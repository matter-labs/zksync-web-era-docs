# Migration guide

Do you have a Hardhat project and you want to deploy it to zkSync? In this page you'll find all the steps you need to do to migrate an existing Hardhat project to zkSync.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Overview

zkSync offers [multiple Hardhat plugins](./plugins.md) with different features but in this guide we'll focus on only the ones you'd need to do to migrate your project to zkSync.

## Install dependencies

Although zkSync is [compatible with Solidity and Vyper](../dev/../../dev/developer-guides/contracts/contracts.md), the deployed bytecode and the deployment process is different from Ethereum or other EVM blockchains. So the fist step will be to install the compiler and deployer hardhat plugins:

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
yarn hardhat compile

# NPM
npm hardhat compile
```

This will compile all contracts in the `contracts` folder and create the folders `artifacts-zk` and `cache-zk`.

If your contracts import any non-inlineable libraries, you'd need to configure them in the `hardhat.config.ts` file. Find more info and examples about [compiling libraries here](./compiling-libraries.md).

## Deploy contracts

To deploy your contracts you'd need to use the `Deployer` class from the `hardhat-zksync-deploy` hardhat plugin. This class takes care of all the specifics of [deploying contracts on zkSync](../dev/../../dev/developer-guides/contracts/contract-deployment.md). You can find an example deployment script in the [Getting started](./getting-started.md) page.

## Frontend integration

You can interact with your contracts using the `zksync-web3` Javascript library. This SDK has been built on top of ethers and uses the same classes (`Provider`, `Contract`, `Wallet`) so in a lot of cases, you'd just need to import these clases from `zksync-web3`  instead of `ethers`:

```typescript

//import { utils, Provider, Contract, Wallet } from "ethers";
import { utils, Provider, Contract, Wallet } from "zksync-web3";

```

You'd also need to use the contract ABI from the `artifacts-zk` folder.

## Verify contracts

To verify your contracts you have two options:

- Explorer: verify your contracts manually in the [zkSync explorer](../tools/block-explorer/contract-verification.md)
- Plugin:verify your contracts programatically using the [Hardhat verify plugin](./hardhat-zksync-verify.md)


---

If you have any problems migrating your project, [send us a message on Discord](https://join.zksync.dev/).
