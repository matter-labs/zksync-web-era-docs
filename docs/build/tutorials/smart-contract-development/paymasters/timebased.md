---
head:
  - - meta
    - name: "twitter:title"
      content: TimeBased | zkSync Docs
---

# TimeBased

### Introduction

zkSync brings forth the possibility to cover transaction fees on behalf of users through native account abstraction, promoting user experience. The `TimeBasedPaymaster` contract presented in this guide ensures transactions are validated based on the time they occur. By utilizing this guide, developers can set up, deploy, and test the `TimeBasedPaymaster` contract.

:::info
For a more in-depth understanding of the IPaymaster interface, please refer to the official zkSync documentation [here](../../../developer-reference/account-abstraction.md#ipaymaster-interface).
:::

### Prerequisites

- **Knowledge Base**: Familiarity with Solidity and Hardhat.
- **Wallet Setup**: MetaMask installation with balance on zkSync testnet.
- **Tooling**: Ensure you have `zksync-cli` either accessible or installed.

### Step 1 — Understanding the TimeBasedPaymaster contract

The `TimeBasedPaymaster` contract allows transactions within a specific timeframe to have the gas covered.

Key components:

- **validateAndPayForPaymasterTransaction**: Validates the transaction time, checks if the transaction is within the defined time window, calculates the required ETH, and pays the bootloader.

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/interfaces/IPaymaster.sol) interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### Step 2 — Environment Setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

```bash
npx zksync-cli create timeBasedPaymaster
```

Choose the following options:

```sh
? What type of project do you want to create? Contracts
? Ethereum framework Ethers v6
? Template Hardhat + Solidity
? Private key of the wallet responsible for deploying contracts (optional)
? Package manager yarn
```

The contract for this guide exists under `/contracts/GeneralPaymaster.sol`.

**Update the Environment File**:

If you didn't enter your wallet private key in the CLI prompt, enter it in the `.env` file.

Ensure your account has a sufficient balance.

### Step 3 — Updating the Contract

For convenience, rename the `GeneralPaymaster.sol` contract to `TimeBasedPaymaster.sol` also changing the name of the contract in the source file.

The intended objective of the `TimeBasedPaymaster` contract is to permit transactions only between a stipulated timeframe to cover the gas costs.

Include the validation logic in the `validateAndPayForPaymasterTransaction` function in the contract. Insert the following code under the `if(paymasterInputSelector == IPaymasterFlow.general.selector){` condition check:

```solidity
uint256 startTime = (block.timestamp / 86400) * 86400 + (15 * 3600); // Adding 15 hours (15 * 3600 seconds)
uint256 endTime = startTime + (20 * 60); // Adding 20 minutes (20 * 60 seconds)

 require(
   block.timestamp >= startTime && block.timestamp <= endTime,
   "Transactions can only be processed between 14:35 - 14:55"
 );
```

During the validation step, the contract will check if the transaction is taking place between the specified time frame, if not the account will be required to pay their own gas costs. Specifically, this contract checks if the transaction takes place between 14:35 - 14:55 UTC.

### Step 4 — Deploy the Contract

Create a new file under `/deploy`, for example `deploy-timeBasedPaymaster.ts`. Insert the provided script:

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

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the TimeBasedPaymaster contract...`);
  const provider = new Provider("https://sepolia.era.zksync.dev");

  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  const paymasterArtifact = await deployer.loadArtifact("TimeBasedPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, []);
  const parsedFee = ethers.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, []);
  const paymasterAddress = await paymaster.getAddress();
  console.log(`Paymaster address: ${paymasterAddress}`);
  console.log("constructor args:" + paymaster.interface.encodeDeploy([]));

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
  const contractFullyQualifedName = "contracts/paymasters/TimeBasedPaymaster.sol:TimeBasedPaymaster";
  const verificationId = await hre.run("verify:verify", {
    address: paymasterAddress,
    contract: contractFullyQualifedName,
    constructorArguments: [],
    bytecode: paymasterArtifact.bytecode,
  });
  console.log(`${contractFullyQualifedName} verified! VerificationId: ${verificationId}`);
  console.log(`Done!`);
}
```

:::info
Be sure to add your private key to the `.env` file.
:::

The provided script takes care of loading environment variables, setting up a deployment wallet with the private key specified in an `.env` file, contract deployment and funding the paymaster. You can adjust the amount of ETH to fund the paymaster to your needs.

Compile the contract:

```bash
yarn hardhat compile
```

Deploy the contract:

```bash
yarn hardhat deploy-zksync --script deploy-timeBasedPaymaster.ts
```

### Step 5 — Testing the Contract

To verify the functionality of the TimeBased Paymaster contract, let's draft a quick test. Set it up by creating `timeBasedPaymaster.test.ts` in the `/test` directory and populating it with the provided script:

#### timeBasedPaymaster.test.ts

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-ethers";
import hardhatConfig from "../hardhat.config";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as ethers from "ethers";
import * as hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

// test pk rich wallet from in-memory node
const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe.only("TimeBasedPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;
  let userWallet: Wallet;
  let paymaster: Contract;
  let greeter: Contract;
  let paymasterAddress: string;

  before(async function () {
    const deployUrl = hardhatConfig.networks.inMemoryNode.url;
    [provider, wallet, deployer] = setupDeployer(deployUrl, PRIVATE_KEY);
    userWallet = Wallet.createRandom();
    console.log(`User wallet's address: ${userWallet.address}`);
    userWallet = new Wallet(userWallet.privateKey, provider);
    paymaster = await deployContract(deployer, "TimeBasedPaymaster", []);
    paymasterAddress = await paymaster.getAddress();
    greeter = await deployContract(deployer, "Greeter", ["Hi"]);
    await fundAccount(wallet, paymasterAddress, "3");
  });

  async function executeGreetingTransaction(user: Wallet) {
    const gasPrice = await provider.getGasPrice();

    const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
      type: "General",
      innerInput: new Uint8Array(),
    });

    await greeter.connect(user);

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!", {
      maxPriorityFeePerGas: BigInt(0),
      maxFeePerGas: gasPrice,
      gasLimit: 6000000,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    });

    await setGreetingTx.wait();
  }

  it("should cost the user no gas during the time window", async function () {
    // Arrange
    const currentDate = new Date();
    currentDate.setUTCHours(14);
    currentDate.setUTCMinutes(1);
    currentDate.setUTCSeconds(0);
    currentDate.setUTCMilliseconds(0);
    const targetTime = Math.floor(currentDate.getTime() / 1000);
    await provider.send("evm_setNextBlockTimestamp", [targetTime]);

    // Act
    const initialBalance = await userWallet.getBalance();
    await executeGreetingTransaction(userWallet);
    await provider.send("evm_mine", []);
    const newBalance = await userWallet.getBalance();

    // Assert
    expect(newBalance.toString()).to.equal(initialBalance.toString());
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("should fail due to Paymaster validation error outside the time window", async function () {
    // Arrange
    let errorOccurred = false;

    // Act
    try {
      await executeGreetingTransaction(wallet);
    } catch (error) {
      errorOccurred = true;
      expect(error.message).to.include("Paymaster validation error");
    }

    // Assert
    expect(errorOccurred).to.be.true;
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

This script tests whether the TimeBasedPaymaster contract permits a user to modify a message in the "Greeter" contract without incurring any gas charges at different times. The necessary paymaster parameters are provided when invoking the `setGreeting` method, showcasing our time based paymaster in action.

```bash
yarn hardhat test --network hardhat
```

#### Conclusion

The `TimeBasedPaymaster` contract bestows a novel capability on zkSync, allowing developers to limit transactions gas coverage to a specific timeframe. This proves beneficial for scenarios demanding temporal restrictions. Further adaptability or protocol-specific validations can be incorporated as needed.
