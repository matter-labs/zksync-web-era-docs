---
head:
  - - meta
    - name: "twitter:title"
      content: Migration Guide | zkSync Docs
---

# Migration guide

::: warning Windows as platform
If you are using Windows, we strongly recommend you use Windows Subsystem for Linux (also known as WSL 2). You can use `Hardhat` and `Hardhat zkSync plugins` without it, but it will work better if you use it.

To install Node.js using WSL 2, please read this [guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)
:::

This guide shows you how to migrate an existing Hardhat project to zkSync Era.

## Overview

zkSync Era offers [multiple Hardhat plugins](../hardhat/getting-started.md) with different features. This guide details the one you need to migrate your project to zkSync Era.

::: warning Non-default paths are not supported yet

- Contract files must be included in the `contracts` folder and deployment scripts must be included in the `deploy` folder.
- Support for custom paths will be included in the future.
  :::

## Install dependencies

Although zkSync Era is [compatible with Solidity and Vyper](../../developer-reference/contract-development.md), the deployed bytecode and the deployment process is different from Ethereum or other EVM blockchains. So the first step is to install the compiler and deployer Hardhat plugins:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc
```

:::

If you're using Vyper, replace `@matterlabs/hardhat-zksync-solc` with `@matterlabs/hardhat-zksync-vyper`

## Configuration changes

In your `hardhat.config.ts` file import the installed dependencies:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
```

Networks on zkSync Era require two different URL endpoints: one for layer 1 (Ethereum or Sepolia), and one for layer 2 (zkSync). This is how you add the zkSync Era testnet to your list of networks in the `hardhat.config.ts`:

```typescript
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia", // or a Sepolia RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    },
  },
  defaultNetwork: "zkSyncTestnet",
  // configuration continues ....
};
```

::: tip
Remember to add `zksync: false` to any other networks.
:::

Finally, add the compiler options inside a `zksolc` or `zkvyper` property. Here is the minimal configuration for a Solidity project:

```typescript
zksolc: {
  version: "latest",
  settings: {},
},
```

For more advanced settings, check out the [Solidity](./hardhat-zksync-solc.md) or [Vyper](./hardhat-zksync-vyper.md) plugins.

### How to configure multiple compilation targets

To configure the `hardhat.config.ts` file to target both zkSync Era and other networks, do the following:

1. In your `hardhat.config.ts`, configure the zkSync Era network with `zksync: true`.
2. Configure all other networks with `zksync: false`.
3. Run the compilation or deployment scripts with the network flag: `yarn hardhat compile --network zkSyncTestnet` for zkSync Era network or `yarn hardhat compile --network sepolia` for other networks, e.g sepolia.

```typescript
networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL.
      zksync: false, // Set to false to target other networks.
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The identifier of the network (e.g. `mainnet` or `sepolia`)
    zksync: true, // Set to true to target zkSync Era.
    }
},

```

### Full configuration

Here is an example config file:

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    sepolia: {
      url: "https://sepolia.com/api/abcdef12345",
      zksync: false,
    },
    mainnet: {
      url: "https://ethereum.mainnet.com/api/abcdef12345",
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia", // or a Sepolia RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.13",
  },
  // OTHER SETTINGS...
};

export default config;
```

## Compile contracts

To compile your contracts for zkSync Era, run:

::: code-tabs

@tab:active yarn

```bash
yarn hardhat compile --network zkSyncTestnet
```

@tab npm

```bash
npm hardhat compile  --network zkSyncTestnet
```

:::

Passing the `--network` flag we make sure Hardhat will use the zksolc compiler (or zkvyper). This command will compile all contracts in the `/contracts` folder and create the folders `artifacts-zk` and `cache-zk`.

If your contracts import any non-inlineable libraries, you need to configure them in the `hardhat.config.ts` file. Find more info and examples about [compiling libraries here](./compiling-libraries.md).

## Deploy contracts

::: tip `hardhat-deploy` support
`hardhat-deploy` version `^0.11.26` supports deployments on zkSync Era.
:::

To deploy your contracts you need to use the `Deployer` class from the `hardhat-zksync-deploy` plugin. This class takes care of all the specifics of [deploying contracts on zkSync](../../developer-reference/contract-deployment.md).

Here is a basic deployment script for a `Greeter` contract:

```typescript
import { utils, Wallet } from "zksync-ethers";
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
  console.log(`${artifact.contractName} was deployed to ${await greeterContract.getAddress()}`);
}
```

::: tip Test ETH
To obtain Sepolia ETH please refer to the [network faucets page](../network-faucets.md) for more info. <br>
To transfer Sepolia ETH to zkSync testnet use [bridges](https://zksync.io/explore#bridges).
:::

Include your deployment script in the `deploy` folder and execute it running:

::: code-tabs

@tab:active yarn

```bash
yarn hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet
```

@tab npm

```bash
npm hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet
```

:::

If you don't include the `--script` option, all script files inside the `deploy` folder will be executed in alphabetical order.

Check out a detailed [approach](./hardhat-zksync-deploy.md) on how to use `hardhat-zksync-deploy` plugin.

## Frontend integration

You can interact with your contracts using the `zksync-ethers` Javascript library. This SDK has been built on top of ethers and uses the same classes (`Provider`, `Contract`, `Wallet`) so in a lot of cases, you just need to import these classes from `zksync-ethers` instead of `ethers`:

```typescript
//import { utils, Provider, Contract, Wallet } from "ethers";
import { utils, Provider, Contract, Wallet } from "zksync-ethers";
```

You also need to use the `contract ABI` from the `artifacts-zk` folder to instantiate contracts.

Apart from the same classes and methods provided by ethers, zksync-ethers includes additional methods for zksync-specific features. You can read more in the [`zksync-ethers` documentation](../../sdks/js/getting-started.md).

## Verify contracts

To verify your contracts you have two options:

- Explorer: verify your contracts manually in the [zkSync explorer](../block-explorer/contract-verification.md)
- Plugin: verify your contracts programmatically using the [Hardhat verify plugin](./hardhat-zksync-verify.md)

If you have any problems migrating your project, [send us a message on Discord](https://join.zksync.dev/).
