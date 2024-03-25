---
head:
  - - meta
    - name: "twitter:title"
      content: ERC20Fixed | zkSync Docs
---

# ERC20Fixed

### Introduction

zkSync's native account abstraction allows contracts to cover transaction fees on behalf of users, significantly improving user experience. The **`ERC20FixedPaymaster`** contract, discussed in this guide, offers transactions gas coverage for accounts that have a balance of a specific ERC20 token.

:::info
For detailed explanations of the IPaymaster interface please refer to the documentation [here](../../../developer-reference/account-abstraction.md#ipaymaster-interface).
:::

### Prerequisites

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Ensure your zkSync testnet wallet holds a balance in both ETH and the specific ERC-20 token intended for the paymaster contract
- **Tooling**: This guide utilizes [`zksync-cli`](../../../tooling/zksync-cli/getting-started.md). Ensure you have it accessible or installed in your environment.

### **Step 1 — Understanding the ERC20FixedPaymaster contract**

The provided `ApprovalPaymaster` contract allows transactions to have the gas covered in a specified ERC-20 token for accounts that hold a balance of a specific ERC20 token. For the purposes of this guide we will make use of the [DAI ERC-20 token](https://sepolia.explorer.zksync.io/address/0x6Ff473f001877D553833B6e312C89b3c8fACa7Ac).

**Key components**:

- `validateAndPayForPaymasterTransaction`: Validates the user's token balance, checks the transaction allowance, calculates the required ETH, and pays the bootloader.

Each paymaster should implement the `IPaymaster` interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### **Step 2 — Environment setup**

Using `zksync-cli` create a new project with required dependencies:

```bash
npx zksync-cli create erc20FixedPaymaster
```

Choose the following options:

```sh
? What type of project do you want to create? Contracts
? Ethereum framework Ethers v6
? Template Hardhat + Solidity
? Private key of the wallet responsible for deploying contracts (optional)
? Package manager yarn
```

The contract for this guide exists under `/contracts/ApprovalPaymaster.sol`.

**Update the Environment File**:

If you didn't enter your wallet private key in the CLI prompt, enter it in the `.env` file.

Ensure your account has a sufficient balance.

### Step 3 — Updating the Contract

No modifications are needed for `ERC20FixedPaymaster` since the provided `ApprovalPaymaster` contract is already configured for this purpose.

Reviewing the `validateAndPayForPaymasterTransaction` function reveals its simplicity: it verifies if the token is correct, the user holds the token and has provided enough allowance.

```solidity
(address token, uint256 amount, bytes memory data) = abi.decode(
    _transaction.paymasterInput[4:],
    (address, uint256, bytes)
);

// Verify if token is the correct one
require(token == allowedToken, "Invalid token");

// We verify that the user has provided enough allowance
address userAddress = address(uint160(_transaction.from));

address thisAddress = address(this);

uint256 providedAllowance = IERC20(token).allowance(
    userAddress,
    thisAddress
);
require(
    providedAllowance >= PRICE_FOR_PAYING_FEES,
    "Min allowance too low"
);
```

### Step 4 — Deploy the Contract

Create a new file under `/deploy`, for example `deploy-erc20FixedPaymaster.ts`. Insert the provided script:

#### deploy-erc20FixedPaymaster.ts

```typescript
import { Provider, Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
// The address of the DAI token contract
const TOKEN_ADDRESS = "0x6Ff473f001877D553833B6e312C89b3c8fACa7Ac";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

if (!TOKEN_ADDRESS) throw "⛔️ TOKEN_ADDRESS not detected! Add it to the TOKEN_ADDRESS variable!";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the ApprovalPaymaster contract...`);
  const provider = new Provider("https://sepolia.era.zksync.dev");
  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("ApprovalPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, [TOKEN_ADDRESS]);
  const parsedFee = ethers.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, [TOKEN_ADDRESS]);
  const paymasterAddress = await paymaster.getAddress();
  console.log(`Paymaster address: ${paymasterAddress}`);

  console.log("Funding paymaster with ETH");
  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymasterAddress,
      value: ethers.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymasterAddress);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);

  // Verify contract programmatically
  //
  // Contract MUST be fully qualified name (e.g. path/sourceName:contractName)
  const contractFullyQualifedName = "contracts/paymasters/ApprovalPaymaster.sol:ApprovalPaymaster";
  const verificationId = await hre.run("verify:verify", {
    address: paymasterAddress,
    contract: contractFullyQualifedName,
    constructorArguments: [TOKEN_ADDRESS],
    bytecode: paymasterArtifact.bytecode,
  });
  console.log(`${contractFullyQualifedName} verified! VerificationId: ${verificationId}`);

  console.log(`Done!`);
}
```

:::info
Update the `TOKEN_ADDRESS` variable to the address of your preferred token.
:::

Compile the contract:

```bash
yarn hardhat compile
```

Deploy the contract:

```bash
yarn hardhat deploy-zksync --script deploy-erc20FixedPaymaster.ts
```

### Step 5 — Testing the Contract

To test the functionality, you can utilize a mock ERC-20 token contract. This will help confirm that the paymaster operates as expected. Inside the `/contracts/` directory, create a file named `ERC20.sol` and insert the following contract:

#### ERC20.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev This contract is for basic demonstration purposes only. It should not be used in production.
 * It is for the convenience of the ERC20fixedPaymaster.sol contract and its corresponding test file.
 */
contract MyERC20 is ERC20 {
  uint8 private _decimals;

  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals_
  ) payable ERC20(name, symbol) {
    _decimals = decimals_;
  }

  function mint(address _to, uint256 _amount) public returns (bool) {
    _mint(_to, _amount);
    return true;
  }

  function decimals() public view override returns (uint8) {
    return _decimals;
  }

  function burn(address from, uint256 amount) public {
    _burn(from, amount);
  }
}
```

To further validate the operations of the ERC20FixedPaymaster contract, we've provided a test script. Create a file named `erc20FixedPaymaster.test.ts` within the `/test` directory, then populate it with the subsequent script:.

#### erc20FixedPaymaster.test.ts

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-ethers";
import hardhatConfig from "../hardhat.config";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";
import * as hre from "hardhat";

// load env file
import dotenv from "dotenv";
dotenv.config();

// test pk rich wallet from in-memory node
const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe.only("ERC20fixedPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;
  let userWallet: Wallet;
  let ownerInitialBalance: BigInt;
  let paymaster: Contract;
  let greeter: Contract;
  let token: Contract;
  let paymasterAddress: string;
  let tokenAddress: string;
  let greeterAddress: string;

  before(async function () {
    const deployUrl = hardhatConfig.networks.inMemoryNode.url;
    // setup deployer
    [provider, wallet, deployer] = setupDeployer(deployUrl, PRIVATE_KEY);
    // setup new wallet
    const emptyWallet = Wallet.createRandom();
    console.log(`Empty wallet's address: ${emptyWallet.address}`);
    userWallet = new Wallet(emptyWallet.privateKey, provider);
    // deploy contracts
    token = await deployContract(deployer, "MyERC20", ["MyToken", "MyToken", 18]);
    tokenAddress = await token.getAddress();
    paymaster = await deployContract(deployer, "ApprovalPaymaster", [tokenAddress]);
    paymasterAddress = await paymaster.getAddress();
    greeter = await deployContract(deployer, "Greeter", ["Hi"]);
    greeterAddress = await greeter.getAddress();
    // fund paymaster
    await fundAccount(wallet, paymasterAddress, "3");
    ownerInitialBalance = await wallet.getBalance();
  });

  async function executeGreetingTransaction(user: Wallet) {
    const gasPrice = await provider.getGasPrice();

    const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
      type: "ApprovalBased",
      token: tokenAddress,
      minimalAllowance: BigInt(1),
      // empty bytes as testnet paymaster does not use innerInput
      innerInput: new Uint8Array(),
    });

    await greeter.connect(user);
    const setGreetingTx = await greeter.setGreeting("Hola, mundo!", {
      maxPriorityFeePerGas: BigInt(0),
      maxFeePerGas: gasPrice,
      // hardcoded for testing
      gasLimit: 6000000,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    });

    await setGreetingTx.wait();

    return wallet.getBalance();
  }

  it("user with MyERC20 token can update message for free", async function () {
    const initialMintAmount = ethers.parseEther("3");
    const success = await token.mint(userWallet.address, initialMintAmount);
    await success.wait();

    const userInitialTokenBalance = await token.balanceOf(userWallet.address);
    const userInitialETHBalance = await userWallet.getBalance();
    const initialPaymasterBalance = await provider.getBalance(paymasterAddress);

    await executeGreetingTransaction(userWallet);

    const finalETHBalance = await userWallet.getBalance();
    const finalUserTokenBalance = await token.balanceOf(userWallet.address);
    const finalPaymasterBalance = await provider.getBalance(paymasterAddress);

    expect(await greeter.greet()).to.equal("Hola, mundo!");
    expect(initialPaymasterBalance).to.be.gt(finalPaymasterBalance);
    expect(userInitialETHBalance).to.eql(finalETHBalance);
    expect(userInitialTokenBalance.gt(finalUserTokenBalance)).to.be.true;
  });

  it("should allow owner to withdraw all funds", async function () {
    try {
      await paymaster.connect(wallet);
      const tx = await paymaster.withdraw(userWallet.address);
      await tx.wait();
    } catch (e) {
      console.error("Error executing withdrawal:", e);
    }

    const finalContractBalance = await provider.getBalance(paymasterAddress);

    expect(finalContractBalance).to.eql(BigInt(0));
  });

  it("should prevent non-owners from withdrawing funds", async function () {
    try {
      await paymaster.connect(userWallet);
      await paymaster.withdraw(userWallet.address);
    } catch (e) {
      expect(e.message).to.include("Ownable: caller is not the owner");
    }
  });

  async function deployContract(deployer: Deployer, contract: string, params: any[]): Promise<Contract> {
    const artifact = await deployer.loadArtifact(contract);
    return await deployer.deploy(artifact, params);
  }

  async function fundAccount(wallet: Wallet, address: string, amount: string) {
    await (await wallet.sendTransaction({ to: address, value: ethers.parseEther(amount) })).wait();
  }

  function setupDeployer(url: string, privateKey: string): [Provider, Wallet, Deployer] {
    const provider = new Provider(url);
    const wallet = new Wallet(privateKey, provider);
    const deployer = new Deployer(hre, wallet);
    return [provider, wallet, deployer];
  }
});
```

This particular script assesses the paymaster's ability to cover gas expenses for accounts, provided they hold a balance in the designated ERC20 token.

To execute test:

```bash
yarn hardhat test --network hardhat
```

### Conclusion

The `ERC20FixedPaymaster` contract introduces an efficient mechanism, allowing developers to cover gas fees for users holding a specific ERC20 token with that ERC20 token. This improves UX for dApps, making it easier for users to interact without worrying about gas fees. Further customizations or protocol-specific validations can be added as necessary.
