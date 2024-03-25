---
head:
  - - meta
    - name: "twitter:title"
      content: Gasless | zkSync Docs
---

# Gasless

### Introduction

zkSync's native account abstraction allows contracts to cover transaction fees on behalf of users, significantly improving user experience. The **`GaslessPaymaster`** contract offers a method to deploy a universal paymaster which ensures transactions are gasless for users.;

This guide describes the process of setting up and deploying the **`GaslessPaymaster`** contract.

:::info
For detailed explanations of the IPaymaster interface please refer to the documentation [here](../../../developer-reference/account-abstraction.md#ipaymaster-interface).
:::

### Prerequisites

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Have MetaMask installed and set up, ensuring there's a balance on the zkSync testnet.
- **Tooling**: This guide utilizes [`zksync-cli`](../../../tooling/zksync-cli/getting-started.md). Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding the GaslessPaymaster Contract

The `GaslessPaymaster` contract ensures that transaction fees are handled automatically without user intervention.

Key components:

- **validateAndPayForPaymasterTransaction**: This function validates the transaction, calculates the required ETH based on gas limits, and transfers the fees to the bootloader.

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/interfaces/IPaymaster.sol) interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### Step 2 — Environment Setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations.

```sh
npx zksync-cli create gaslessPaymaster
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

No modifications are needed for gasless transactions since the provided `GeneralPaymaster` contract is already configured for this purpose. With no restrictions on its usage.

Reviewing the `validateAndPayForPaymasterTransaction` function reveals its simplicity: it only verifies that the paymaster holds sufficient ETH.

### Step 4 — Deploy the Contract

Create a new file under `/deploy`, for example `deploy-gaslessPaymaster.ts`. Insert the provided script:

Deployment script

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
  console.log(`Running deploy script for the GaslessPaymaster contract...`);
  const provider = new Provider("https://sepolia.era.zksync.dev");

  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("GeneralPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, []);
  const parsedFee = ethers.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, []);
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
  console.log(`Done!`);
}
```

:::info
Be sure to add your private key to the `.env` file.;
:::

The provided script takes care of loading environment variables, setting up a deployment wallet with the private key specified in an `.env` file, contract deployment and funding the paymaster. You can adjust the amount of ETH to fund the paymaster to your needs.;

Compile the contract:

```bash
yarn hardhat compile
```

Once compiled, deploy using:

```bash
yarn hardhat deploy-zksync --script deploy-gaslessPaymaster.ts
```

### Step 5 — Testing the Contract

To verify the functionality of the GaslessPaymaster contract, let's draft a quick test.

Set it up by creating `gaslessTest.test.ts` in the `/test` directory and populating it with the provided script:

#### gasless.test.ts

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-ethers";
import hardhatConfig from "../hardhat.config";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as hre from "hardhat";
import * as ethers from "ethers";
import dotenv from "dotenv";

dotenv.config();

// test pk rich wallet from in-memory node
const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe.only("GaslessPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;
  let emptyWallet: Wallet;
  let userWallet: Wallet;
  let ownerInitialBalance: BigInt;
  let paymaster: Contract;
  let greeter: Contract;
  let paymasterAddress: string;

  before(async function () {
    // @ts-ignore
    [provider, wallet, deployer] = setupDeployer(hardhatConfig.networks.inMemoryNode.url, PRIVATE_KEY);
    emptyWallet = Wallet.createRandom();
    userWallet = new Wallet(emptyWallet.privateKey, provider);
    paymaster = await deployContract(deployer, "GeneralPaymaster", []);
    paymasterAddress = await paymaster.getAddress();
    greeter = await deployContract(deployer, "Greeter", ["Hi"]);
    await fundAccount(wallet, paymasterAddress, "3");
    ownerInitialBalance = await wallet.getBalance();
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
    return wallet.getBalance();
  }

  it("Owner can update message for free", async function () {
    const newBalance = await executeGreetingTransaction(userWallet);
    expect(await greeter.greet()).to.equal("Hola, mundo!");
    expect(newBalance).to.eql(ownerInitialBalance);
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

This script tests whether the GaslessPaymaster contract permits a user to modify a message in the "Greeter" contract without incurring any gas charges. The necessary paymaster parameters are provided when invoking the `setGreeting` method, showcasing our gasless paymaster in action.

To execute test:

```bash
yarn hardhat test --network hardhat
```

### Conclusion

The `GaslessPaymaster` contract provides an effortless way to cover gas fees, ensuring a seamless experience for users. It represents a breakthrough for dApps and businesses aiming to increase adoption by making user transactions gasless. You can add protocol specific validations for more control, an adaptation of which can be reviewed in the next section.
