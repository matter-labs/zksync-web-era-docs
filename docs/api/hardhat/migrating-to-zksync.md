# Migration guide

Do you have a Hardhat project and you want to deploy it to zkSync? In this page you'll find all the steps you need to do to migrate an existing Hardhat project to zkSync.

## Overview

zkSync offers [multiple Hardhat plugins](./plugins.md) with different features but in this guide we'll focus on only the ones you'd need to do to migrate your project to zkSync.

:::warning Non-default paths are not supported yet.

Contracts files must be included in the `contracts` folder and deployment scripts must be included in the `deploy` folder.

Support for custom paths will be included in the future.

:::

## Install dependencies

Although zkSync is [compatible with Solidity and Vyper](../../dev/building-on-zksync/contracts/contracts.md), the deployed bytecode and the deployment process is different from Ethereum or other EVM blockchains. So the fist step will be to install the compiler and deployer hardhat plugins:

```sh
# Yarn
yarn add -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc

```

If you're using Vyper, replace `@matterlabs/hardhat-zksync-solc` with `@matterlabs/hardhat-zksync-vyper`

## Configuration changes

In your `hardhat.config.ts` file import the installed dependencies:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
```

Networks on zkSync require two different URL endpoints: one for the layer 1 (Ethereum or Goerli), and one for the layer 2 (zkSync). This is how you'd add the zkSync testnet to your list of networks in the `hardhat.config.ts`:

```typescript
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet:{
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",  // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    }
  },
  defaultNetwork: "zkSyncTestnet",
  // configuration continues ....

};
```
Remember to add `zksync: false` to any other networks.

Finally, you'd need to add the compiler options inside a `zksolc` or `zkvyper` property. Here is the minimal configuration for a Solidity project:

```typescript
zksolc: {
  version: "1.3.1",
  compilerSource: "binary",
  settings: {},
},
```
You can find advance settings in the [Solidity](./hardhat-zksync-solc.md) or [Vyper](./hardhat-zksync-vyper.md) plugins.

### Full configuration

Here is an example config file:

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    goerli:{
      url: 'https://goerli.com/api/abcdef12345',
      zksync: false,
    }
    mainnet:{
      url: 'https://ethereum.mainnet.com/api/abcdef12345',
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",  // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
  // OTHER SETTINGS...
};

export default config;
```

## Compile contracts

To compile your contracts for zkSync, run:

```
# Yarn
yarn hardhat compile --network zkSyncTestnet

# NPM
npx hardhat compile  --network zkSyncTestnet
```

Passing the `--network` flag we make sure Hardhat will use the zksolc compiler (or zkvyper). This command will compile all contracts in the `/contracts` folder and create the folders `artifacts-zk` and `cache-zk`.


If your contracts import any non-inlineable libraries, you'd need to configure them in the `hardhat.config.ts` file. Find more info and examples about [compiling libraries here](./compiling-libraries.md).

## Deploy contracts

::: tip Test ETH

Obtain [test ETH from our faucet](https://portal.zksync.io/faucet) or just bridge GöerliETH using [the zkSync Portal](https://portal.zksync.io/bridge).

:::

To deploy your contracts you'd need to use the `Deployer` class from the `hardhat-zksync-deploy`  plugin. This class takes care of all the specifics of [deploying contracts on zkSync](../../dev/building-on-zksync/contracts/contract-deployment.md). 

Here is a basic deployment script for a `Greeter` contract:


```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("Greeter");

  // Deploy this contract. The returned object will be of a `Contract` type, 
  // similar to the ones in `ethers`.
  const greeting = "Hi there!";
  // `greeting` is an argument for contract constructor.
  const greeterContract = await deployer.deploy(artifact, [greeting]);

  // Show the contract info.
  console.log(`${artifact.contractName} was deployed to ${greeterContract.address}`);
}

```
Include your deployment script in the `deploy` folder and execute it running:

```
# Yarn
yarn hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet

# NPM
npx hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet
```

If you don't include the `--script` option, all script files inside the `deploy` folder will be executed in alphabetical order.

## Frontend integration

You can interact with your contracts using the `zksync-web3` Javascript library. This SDK has been built on top of ethers and uses the same classes (`Provider`, `Contract`, `Wallet`) so in a lot of cases, you'd just need to import these classes from `zksync-web3`  instead of `ethers`:

```typescript

//import { utils, Provider, Contract, Wallet } from "ethers";
import { utils, Provider, Contract, Wallet } from "zksync-web3";

```

You'd also need to use the contract ABI from the `artifacts-zk` folder to instantiate contracts.

Apart from the same classes and methods provided by ethers, zksync-web3 includes additional methods for zksync-specific features. You can read more in the [`zksync-web3` documentation](../js/getting-started.md).

## Verify contracts

To verify your contracts you have two options:

- Explorer: verify your contracts manually in the [zkSync explorer](../tools/block-explorer/contract-verification.md)
- Plugin:verify your contracts programmatically using the [Hardhat verify plugin](./hardhat-zksync-verify.md)


---

If you have any problems migrating your project, [send us a message on Discord](https://join.zksync.dev/).
