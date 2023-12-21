---
head:
  - - meta
    - name: "twitter:title"
      content: ERC20Fixed | zkSync Docs
---

# ERC20Fixed

### **Introduction**

zkSync's native account abstraction allows contracts to cover transaction fees on behalf of users, significantly improving user experience. The **`ERC20FixedPaymaster`** contract, discussed in this guide, offers transactions gas coverage for accounts that have a balance of a specific ERC20 token.&#x20;

{% hint style="info" %}
For detailed explanations of the IPaymaster interface please refer to the documentation [here](https://era.zksync.io/docs/reference/concepts/account-abstraction.html#ipaymaster-interface).
{% endhint %}

### **Prerequisites**

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Ensure your zkSync testnet wallet holds a balance in both ETH and the specific ERC-20 token intended for the paymaster contract
- **Tooling**: This guide utilizes [`zksync-cli`](../../development/zksync-cli/README.md). Ensure you have it accessible or installed in your environment.

### **Step 1 — Understanding the ERC20FixedPaymaster contract**

The `ERC20FixedPaymaster` contract allows transactions to have the gas covered in a specified ERC-20 token for accounts that hold a balance of a specific ERC20 token. For the purposes of this guide we will make use of the [DAI ERC-20 token](https://goerli.explorer.zksync.io/address/0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b).&#x20;

**Key components**:

- `validateAndPayForPaymasterTransaction`: Validates the user's token balance, checks the transaction allowance, calculates the required ETH, and pays the bootloader.

Each paymaster should implement the `IPaymaster` interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### **Step 2 — Environment setup**

Using `zksync-cli` create a new project with required dependencies:

```bash
npx hardhat@latest create-project erc20FixedPaymaster
```

Choose `Hardhat + Solidity` to setup our project repository. The contract we will be adjusting exists under `/contracts/ApprovalPaymaster.sol` and can be renamed to `ERC20fixedPaymaster.`

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance.

### **Step 3 — Updating the contract**

No modifications are needed for ERC20Fixed paymaster since the provided `ApprovalPaymaster` contract is already configured for this purpose.

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

### **Step 4 — Deploy the contract**

Create a new file under `/deploy`, for example `deploy-erc20FixedPaymaster.ts`. Insert the provided script:

<details>

<summary>deploy-erc20FixedPaymaster.ts</summary>

```typescript
import { Provider, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
// The address of the DAI token contract
const TOKEN_ADDRESS = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

if (!TOKEN_ADDRESS) throw "⛔️ TOKEN_ADDRESS not detected! Add it to the TOKEN_ADDRESS variable!";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the ERC20fixedPaymaster contract...`);
  const provider = new Provider("https://testnet.era.zksync.dev");
  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("ERC20fixedPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, [TOKEN_ADDRESS]);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, [TOKEN_ADDRESS]);
  console.log(`Paymaster address: ${paymaster.address}`);

  console.log("Funding paymaster with ETH");
  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymaster.address);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);

  // Verify contract programmatically
  //
  // Contract MUST be fully qualified name (e.g. path/sourceName:contractName)
  const contractFullyQualifedName = "contracts/paymasters/ERC20fixedPaymaster.sol:ERC20fixedPaymaster";
  const verificationId = await hre.run("verify:verify", {
    address: paymaster.address,
    contract: contractFullyQualifedName,
    constructorArguments: [TOKEN_ADDRESS],
    bytecode: paymasterArtifact.bytecode,
  });
  console.log(`${contractFullyQualifedName} verified! VerificationId: ${verificationId}`);

  console.log(`Done!`);
}
```

</details>

{% hint style="info" %}
Update the `TOKEN_ADDRESS` variable to the address of your preferred token.
{% endhint %}

Compile the contract:

```bash
yarn hardhat compile
```

Deploy the contract:

```bash
yarn hardhat deploy --script erc20FixedPaymaster.ts
```

### **Step 5 — Testing the contract**

To test the functionality, you can utilize a mock ERC-20 token contract. This will help confirm that the paymaster operates as expected. Inside the `/contracts/` directory, create a file named `ERC20.sol` and insert the following contract:

<details>

<summary>ERC20.sol</summary>

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

</details>

To further validate the operations of the ERC20FixedPaymaster contract, we've provided a test script. Create a file named `erc20FixedPaymaster.test.ts` within the `/test` directory, then populate it with the subsequent script:.&#x20;

<details>

<summary>erc20FixedPaymaster.test.ts</summary>

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import hardhatConfig from "../hardhat.config";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";

import { deployContract, fundAccount, setupDeployer } from "./utils";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe("ERC20fixedPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;
  let userWallet: Wallet;
  let ownerInitialBalance: ethers.BigNumber;
  let paymaster: Contract;
  let greeter: Contract;
  let token: Contract;

  before(async function () {
    const deployUrl = hardhatConfig.networks.zkSyncTestnet.url;
    // setup deployer
    [provider, wallet, deployer] = setupDeployer(deployUrl, PRIVATE_KEY);
    // setup new wallet
    const emptyWallet = Wallet.createRandom();
    console.log(`Empty wallet's address: ${emptyWallet.address}`);
    userWallet = new Wallet(emptyWallet.privateKey, provider);
    // deploy contracts
    token = await deployContract(deployer, "MyERC20", ["MyToken", "MyToken", 18]);
    paymaster = await deployContract(deployer, "ERC20fixedPaymaster", [token.address]);
    greeter = await deployContract(deployer, "Greeter", ["Hi"]);
    // fund paymaster
    await fundAccount(wallet, paymaster.address, "3");
    ownerInitialBalance = await wallet.getBalance();
  });

  async function executeGreetingTransaction(user: Wallet) {
    const gasPrice = await provider.getGasPrice();
    const token_address = token.address.toString();

    const paymasterParams = utils.getPaymasterParams(paymaster.address, {
      type: "ApprovalBased",
      token: token_address,
      minimalAllowance: ethers.BigNumber.from(1),
      // empty bytes as testnet paymaster does not use innerInput
      innerInput: new Uint8Array(),
    });

    const setGreetingTx = await greeter.connect(user).setGreeting("Hola, mundo!", {
      maxPriorityFeePerGas: ethers.BigNumber.from(0),
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
    const initialMintAmount = ethers.utils.parseEther("3");
    const success = await token.mint(userWallet.address, initialMintAmount);
    await success.wait();

    const userInitialTokenBalance = await token.balanceOf(userWallet.address);
    const userInitialETHBalance = await userWallet.getBalance();
    const initialPaymasterBalance = await provider.getBalance(paymaster.address);

    await executeGreetingTransaction(userWallet);

    const finalETHBalance = await userWallet.getBalance();
    const finalUserTokenBalance = await token.balanceOf(userWallet.address);
    const finalPaymasterBalance = await provider.getBalance(paymaster.address);

    expect(await greeter.greet()).to.equal("Hola, mundo!");
    expect(initialPaymasterBalance.gt(finalPaymasterBalance)).to.be.true;
    expect(userInitialETHBalance).to.eql(finalETHBalance);
    expect(userInitialTokenBalance.gt(finalUserTokenBalance)).to.be.true;
  });

  it("should allow owner to withdraw all funds", async function () {
    try {
      const tx = await paymaster.connect(wallet).withdraw(userWallet.address);
      await tx.wait();
    } catch (e) {
      console.error("Error executing withdrawal:", e);
    }

    const finalContractBalance = await provider.getBalance(paymaster.address);

    expect(finalContractBalance).to.eql(ethers.BigNumber.from(0));
  });

  it("should prevent non-owners from withdrawing funds", async function () {
    try {
      await paymaster.connect(userWallet).withdraw(userWallet.address);
    } catch (e) {
      expect(e.message).to.include("Ownable: caller is not the owner");
    }
  });
});
```

</details>

This particular script assesses the paymaster's ability to cover gas expenses for accounts, provided they hold a balance in the designated ERC20 token.

To execute test:

```bash
yarn hardhat test
```

**Conclusion**

The `ERC20FixedPaymaster` contract introduces an efficient mechanism, allowing developers to cover gas fees for users holding a specific ERC20 token with that ERC20 token. This improves UX for dApps, making it easier for users to interact without worrying about gas fees. Further customizations or protocol-specific validations can be added as necessary.
