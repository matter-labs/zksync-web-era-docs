---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat Getting Started | zkSync Docs
---

# Getting started

::: warning Windows as platform
If you are using Windows, we strongly recommend you use Windows Subsystem for Linux (also known as WSL 2). You can use `Hardhat` and `Hardhat zkSync plugins` without it, but it will work better if you use it.

To install Node.js using WSL 2, please read this [guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)
:::

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.

zkSync Era has the following official plugins for Hardhat:

- [@matterlabs/hardhat-zksync-solc](./hardhat-zksync-solc.md) - used to compile contracts written in Solidity.
- [@matterlabs/hardhat-zksync-vyper](./hardhat-zksync-vyper.md) - used to compile contracts written in Vyper.
- [@matterlabs/hardhat-zksync-deploy](./hardhat-zksync-deploy.md) - used to deploy smart contracts.
- [@matterlabs/hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md) - adds zkSync-specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts.
- [@matterlabs/hardhat-zksync-verify](./hardhat-zksync-verify.md) - used to verify smart contracts.
- [@matterlabs/hardhat-zksync-verify-vyper](./hardhat-zksync-verify-vyper.md) - used to verify vyper smart contracts.
- [@matterlabs/hardhat-zksync-upgradable](./hardhat-zksync-upgradable.md) - used to deploy, update, and verify proxy smart contracts.
- [@matterlabs/hardhat-zksync-ethers](./hardhat-zksync-ethers.md) - wrapper around zksync-ethers with some extra Hardhat-specific functionality.
- [@matterlabs/hardhat-zksync-node](./hardhat-zksync-node.md) - used to run the zkSync era-test-node locally.

::: tip Additional plugins
Learn more about [other plugins from the community](./other-plugins.md) that you can use with zkSync Era.
:::

To learn more about Hardhat itself, check out [its official documentation](https://hardhat.org/getting-started/).

This tutorial shows you how to Setup a zkSync Era Solidity project with Hardhat using the [zkSync CLI](../zksync-cli/getting-started.md).

If you are using Vyper, check out the [Vyper plugin documentation](./hardhat-zksync-vyper.md) or [this example](https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example) in GitHub!

## Prerequisites

- Make sure your machine satisfies the [system requirements](https://github.com/matter-labs/era-compiler-solidity/tree/main#system-requirements).
- You have a Node installation and `yarn` or `npm` package manager.
- You are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [Contract Deployment](../../developer-reference/contract-deployment.md).
- A wallet with sufficient Sepolia or Göerli `ETH` on Ethereum and zkSync Era Testnet to pay for deploying smart contracts. You can get Sepolia ETH from the [network faucets](../../tooling/network-faucets.md).
  - Get testnet `ETH` for zkSync Era using [bridges](https://zksync.io/explore#bridges) to bridge funds to zkSync.
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

::: tip Local zkSync Testing with zksync-cli
Skip the hassle for test ETH by using `zksync-cli` for local testing. Simply execute `npx zksync-cli dev start` to initialize a local zkSync development environment, which includes local Ethereum and zkSync nodes. This method allows you to test contracts without requesting external testnet funds. Explore more in the [zksync-cli documentation](../zksync-cli/getting-started.md).
:::

::: warning Important

- Contracts must be compiled using the [official zkSync Era compilers](../../../zk-stack/components/compiler/toolchain/overview.md), with their respective Hardhat plugins.
- Contracts compiled with other compilers will fail to deploy to zkSync Era.
  :::

## Project setup

To create a new project run the CLI's `create` command, passing a project name:

#### Solidity project

```sh
npx zksync-cli create demo --template hardhat_solidity
```

#### Vyper project

```sh
npx zksync-cli create demo --template hardhat_vyper
```

This command creates a `demo` folder and clones a Hardhat template project inside it. The downloaded project is already configured and contains all the required plugins.

::: tip Migrating a project
If you want to migrate an existing project, please check the [project migration guide](./migrating-to-zksync.md).
:::

## Hardhat configuration

The `hardhat.config.ts` file contains some zkSync-Era-specific configurations:

The zkSync Era deployment and compiler plugin imports.

###### Solidity project

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
......
```

The `zksolc` block contains the minimal configuration for the compiler.

```typescript
zksolc: {
  version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
  settings: {},
},
```

###### Vyper project

```typescript
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-vyper";
......
```

The `zkvyper` block contains the minimal configuration for the compiler.

```typescript
zkvyper: {
  version: "latest", // Uses latest available in https://github.com/matter-labs/zkvyper-bin/
  settings: {},
},
```

#### Network

The network endpoints of the `zkSyncTestnet` network change dynamically for local tests.

```typescript
// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://sepolia.era.zksync.dev",
        ethNetwork: "sepolia",
        zksync: true,
      };
```

::: info
For local zkSync testing, modify `url` and `ethNetwork` in `hardhat.config.ts` to align with your local zkSync and Ethereum node's L2 and L1 RPC URLs, respectively.
:::

::: tip Unit tests
This template project includes a basic unit test in the `/test` folder that runs with the local-setup and can be executed with `yarn test`. Learn more about how to [start the local setup and write unit tests here](../../test-and-debug/getting-started.md).
:::

::: tip Advanced configuration
To learn more about each specific property in the `hardhat.config.ts` file, check out the [plugins documentation](../hardhat/getting-started.md)
:::

## Set your Private Key

Rename `.env.example` to `.env` and input your private key:

```text
WALLET_PRIVATE_KEY=YourPrivateKeyHere...
```

Your private key will be used for paying the costs of deploying the smart contract.

## Compile and deploy a contract

Smart contracts belong in the `contracts` folder.

#### 1. To compile the contract, run

```sh
yarn hardhat compile
```

You'll see the following output:

```text
Compiling 1 Solidity file
Successfully compiled 1 Solidity file
// Successfully compiled 1 Vyper file - Vyper project
✨  Done in 1.09s.
```

The `artifacts-zk` and `cache-zk` folders appear in the root directory (instead of the regular Hardhat's `artifacts` and `cache`). These folders contain the compilation artifacts (including contract's ABIs) and compiler cache files.

::: tip
The `artifacts-zk` and `cache-zk` folders are included in the `.gitignore` file.

:::

The `deploy-greeter.ts` script is in the `deploy` folder. This script uses the `Deployer` class from the `hardhat-zksync-deploy` package to deploy the `Greeter.sol`/`Greeter.vy` contract.

```typescript
import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  // Estimate contract deployment fee
  const greeting = "Hi there!";
  const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting]);

  // ⚠️ OPTIONAL: You can skip this block if your account already has funds in L2
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similar to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.formatEther(deploymentFee);
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const greeterContract = await deployer.deploy(artifact, [greeting]);

  //obtain the Constructor Arguments
  console.log("constructor args:" + greeterContract.interface.encodeDeploy([greeting]));

  // Show the contract info.
  const contractAddress = await greeterContract.getAddress();
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

#### 2. To execute the deployment script run

```sh
yarn hardhat deploy-zksync --script deploy-greeter.ts
```

This script deploys the `Greeting` contract with the message "Hi there!" to zkSync Era Testnet.

You should see something like this:

```txt
Running deploy script for the Greeter contract
The deployment is estimated to cost 0.00579276320831943 ETH
constructor args:0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
Greeter was deployed to 0x46f1d2d8A16DBD8b47e9D61175a826ac667288Be4D1293a22E8

✨  Done in 12.69s.
```

**Congratulations! You have deployed a smart contract project to zkSync Era Testnet with Hardhat 🎉**

::: warning Request-Rate Exceeded message

- This message is caused by using the default RPC endpoints provided by ethers.
- To avoid this, use your own Sepolia RPC endpoint in the `hardhat.config.ts` file.
- Find multiple [node providers here](https://github.com/arddluma/awesome-list-rpc-nodes-providers).
  :::

## Interact with the contract

The template project contains another script to interact with the contract.

1. Enter the address of the deployed Greeter contract in the `CONTRACT_ADDRESS` variable of the `use-greeter.ts` script:

```typescript
import { Provider } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first! - Solidity Project
import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.sol/Greeter.json";
// load contract artifact. Make sure to compile first! - Vyper Project
//import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.vy/Greeter.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialise contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractArtifact.abi, signer);

  // Read message from contract
  console.log(`The message is ${await contract.greet()}`);

  // send transaction to update the message
  const newMessage = "Hello people!";
  const tx = await contract.setGreeting(newMessage);

  console.log(`Transaction to change the message is ${tx.hash}`);
  await tx.wait();

  // Read message after transaction
  console.log(`The message now is ${await contract.greet()}`);
}
```

2. To execute the script, run:

```sh
yarn hardhat deploy-zksync --script use-greeter.ts
```

The script will:

- Retrieve the message from the contract by calling the `greet()` method.
- Update the greeting message in the contract with the `setGreeting()` method.
- Retrieve the message from the contract again.

You should see something like this:

```text
Running script to interact with contract Greeter
The message is Hello there!
Transaction to change the message is 0x12f16578A16DB0f47e9D61175a823ac214288Af
The message now is Hello people!

✨  Done in 14.32s.
```

## Learn more

- To learn more about the zkSync Hardhat plugins check out the [plugins documentation](../hardhat/getting-started.md).
- If you want to know more about how to interact with zkSync using Javascript, check out the [zksync-ethers Javascript SDK documentation](../../sdks/js/zksync-ethers/getting-started.md) .
