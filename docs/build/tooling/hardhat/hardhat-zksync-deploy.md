---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-deploy | zkSync Docs
---

# `hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync Era with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

## Prerequisite

To use the `hardhat-zksync-deploy` in your project, we recommend that:

- You have a Node installation and `yarn` or `npm` package manager.
- You are already familiar with deploying smart contracts on zkSync Era. If not, please refer to the first section of the [quickstart tutorial](../../quick-start/hello-world.md).
- A wallet with sufficient Sepolia `ETH` on Ethereum and zkSync Era Testnet to pay for deploying smart contracts on testnet. You can get Sepolia ETH from the [network faucets](../../tooling/network-faucets.md).
  - Get testnet `ETH` for zkSync Era using [bridges](https://zksync.io/explore#bridges) to bridge funds to zkSync.
- You know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

::: tip Local zkSync Testing with zksync-cli
Skip the hassle for test ETH by using `zksync-cli` for local testing. Simply execute `npx zksync-cli dev start` to initialize a local zkSync development environment, which includes local Ethereum and zkSync nodes. This method allows you to test contracts without requesting external testnet funds. Explore more in the [zksync-cli documentation](../zksync-cli/getting-started.md).
:::

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:

  - Compatible with ethers **v6** (⭐ Recommended)

  :::

::: tip Deployer extension inside Hardhat Runtime Environment (HRE)
To use new features like the deployer extension inside Hardhat Runtime Environment (HRE), caching mechanism, and support for script paths, tags, dependencies, and priority, the plugin versions should be as follows:

- For **v6**, the version should be **1.2.0** or higher.
- For **v5**, the version should be **0.8.0** or higher.

  :::

## Setup

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-deploy ethers zksync-ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-deploy
```

:::

## Network Configuration

In the `hardhat.config.ts` file, specify zkSync Era and Ethereum networks in the `networks` object.

```typescript
networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true
    }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

- `zkTestnet` is an arbitrary zkSync Era network name. You can select this as the default network using the `defaultNetwork` property.
- `url` is a field containing the URL of the zkSync Era node in case of the zkSync Era network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync Era and Ethereum networks used by this plugin.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `sepolia`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `zksync` is a flag that indicates if the network is zkSync Era. This field needs to be set to `true` for all zkSync Era networks; it is `false` by default.

# Usage in deployment scripts

## `Deployer` export

The main export of this plugin is the `Deployer` class. It is used to wrap a `zksync-ethers` Wallet instance and provides a convenient interface to deploy smart contracts and account abstractions. It's main methods are:

```typescript
class Deployer {

  /**
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param zkWallet The wallet which will be used to deploy the contracts.
   * @param deploymentType Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */
  constructor(hre: HardhatRuntimeEnvironment, zkWallet: zk.Wallet, deploymentType?: zk.types.DeploymentType)

  /**
   * Created a `Deployer` object on ethers.Wallet object.
   *
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param ethWallet The wallet used to deploy smart contracts.
   * @param deploymentType The optional deployment type that relates to the `ContractDeployer` system contract function to be called. Defaults to deploying regular smart contracts.
   */
  static fromEthWallet(hre: HardhatRuntimeEnvironment, ethWallet: ethers.Wallet, deploymentType?: zk.types.DeploymentType)

  /**
   * Loads an artifact and verifies that it was compiled by `zksolc`.
   *
   * @param contractNameOrFullyQualifiedName The name of the contract.
   *   It can be a bare contract name (e.g. "Token") if it's
   *   unique in your project, or a fully qualified contract name
   *   (e.g. "contract/token.sol:Token") otherwise.
   *
   * @throws Throws an error if a non-unique contract name is used,
   *   indicating which fully qualified names can be used instead.
   *
   * @throws Throws an error if an artifact was not compiled by `zksolc`.
   */
  public async loadArtifact(
    contractNameOrFullyQualifiedName: string
  ): Promise<ZkSyncArtifact>

  /**
   * Estimates the price of calling a deploy transaction in a certain fee token.
   *
   * @param artifact The previously loaded artifact object.
   * @param constructorArguments The list of arguments to be passed to the contract constructor.
   *
   * @returns Calculated fee in ETH wei.
   */
  public async estimateDeployFee(
    artifact: ZkSyncArtifact,
    constructorArguments: any[]
  ): Promise<bigint>

  /**
    * Sends a deploy transaction to the zkSync network.
    * For now it uses default values for the transaction parameters:
    *
    * @param contractNameOrArtifact The previously loaded artifact object, or contract name that will be resolved to artifact in the background.
    * @param constructorArguments The list of arguments to be passed to the contract constructor.
    * @param overrides Optional object with additional deploy transaction parameters.
    * @param additionalFactoryDeps Additional contract bytecodes to be added to the factory dependencies list.
    * The fee amount is requested automatically from the zkSync Era server.
    *
    * @returns A contract object.
    */
  public async deploy(
    contractNameOrArtifact: ZkSyncArtifact | string,
    constructorArguments: any[],
    overrides?: Overrides,
    additionalFactoryDeps?: ethers.BytesLike[],
  ): Promise<zk.Contract>
```

To see an example script of how to use a `Deployer` class to deploy a contract, check out the [deployment section of the quickstart](./getting-started.md#compile-and-deploy-a-contract).

::: note contractNameOrArtifact parameter within the deploy method

In the method description, it's evident that `contractNameOrArtifact` can accept two types of objects. One type represents a loaded artifact, while the other type is a string representing a contract name, which the `deploy` method will internally convert to the corresponding artifact.

```typescript
const wallet = new zk.Wallet("PRIVATE_KEY");
const deployer = new Deployer(hre, zkWallet);
............
// Provided previously loaded artifact
const artifact = await deployer.loadArtifact("ContractName");
const contract = await deployer.deploy(artifact);
// Provided contract name
const contract = await deployer.deploy("ContractName");
```

:::

## Environment extensions

The plugin adds a deployer extension object to the Hardhat Runtime Environment (HRE), which allows us to access it using `hre.deployer`.

### Configuration

To extend the configuration to support automatic deployment inside scripts without the need for manually creating a wallet, you can add an `accounts` field to the specific network configuration in the `networks` section of the `hardhat.config.ts` file. This accounts field can support an array of private keys or a mnemonic object.

If the `accounts` section contains an array of private keys, the deploy method will use index `0` by default unless another wallet is explicitly set in the script.

```typescript
const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      // ADDITION
      accounts: ['0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3', '0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959'] // The private keys for the accounts used in the deployment process.
      accounts: {
          mnemonic: 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
      }
      // Mnemonic used in the deployment process
    }
  },
};
```

- `accounts` represents a list of the private keys or mnemonic object for the account used in the deployment process.

:::tip Accounts on zkSync Era Test Node or zksync-cli Local Node

`accounts` object will be automatically be populated with rich accounts if used network is zkSync Era Test Node or zksync-cli Local Node

:::

To establish a default index per network, which is by default `0`, you can include a `deployerAccounts` section in your `hardhat.config.ts` file. This enables the plugin to utilize the designated default indexes when accessing `deploy` method in deployment scripts, thereby granting greater control over the selection of the deployment account for each network.

```typescript
const config: HardhatUserConfig = {
  // ADDITION
  deployerAccounts: {
    'zkTestnet': 1, // The default index of the account for the specified network.
    //default: 0 // The default value for not specified networks. Automatically set by plugin to the index 0.
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      accounts: ['0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3', '0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959']  // The private keys for the accounts used in the deployment process.
      accounts: {
          mnemonic: 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
      }  // Mnemonic used in the deployment process
    }
  },
};
```

- `deployerAccounts` represents an object where the default index of the accounts is provided and automatically used in the deployment scripts. If the network name is not specified inside the object, the default index of the account will be `0`. We can change and deafult index for not specified networks if we override `default` name with index that we want.

The described objects work together to provide users with a better deployment experience, eliminating the need for manual wallet initialization.

### Methods

Methods available for use in `hre.deployer` are the same as those available in the `Deployer` class object, as described [here.](#deployer-export) Additionally, `hre.deployer` is extended with specific methods to facilitate the deployment process, making it more straightforward.

```typescript
  /**
   * Set deployment type
   *
   * @param deployment type for further deployment actions
   *
   */
  public setDeploymentType(
    deploymentType: zk.types.DeploymentType
  ): void

  /**
    * Set a new Wallet
    *
    * @param wallet object to be used in further deployment actions
    *
  */
  public setWallet(
    wallet: zk.Wallet
  ): void

  /**
    * Returns a new Wallet connected to the selected network
    *
    * @param privateKeyOrAccountNumber Optional private key or index of the account
    *
    * @returns A wallet object. If param is not provided, default wallet will be returned.
  */
  public async getWallet(
    privateKeyOrAccountNumber?: string | number
  ): Promise<zk.Wallet>
```

### Transition from `Deployer` object to the `hre.deployer`

The deployment logic remains the same, but instead of instantiating a `Deployer` class, you directly access the deployer object provided by `hre.deployer`. This simplifies the deployment process and enhances the developer experience.

```typescript
// Using Deploy exports for the deployment
const wallet = new zk.Wallet("PRIVATE_KEY");
const deployer = new Deployer(hre, zkWallet);
const artifact = await deployer.loadArtifact("ContractName");
const contract = await deployer.deploy(artifact, []);

// Using hre.deployer with connected wallet provided by hardhat.config.ts configuration
const artifact = await hre.deployer.loadArtifact("ContractName");
const contract = await hre.deployer.deploy(artifact, []);
```

### Usage of the getWallet and setWallet

To simplify and improve the user experience, you can use the `getWallet` and `setWallet` methods provided by `hre.deployer` to generate a new wallet for deployment if that is needed and to change current wallet.

```typescript
// To get the wallet for index 2 of the network accounts object inside hardhat.config.ts
const wallet = await hre.deployer.getWallet(2);
// To get the wallet for the provided private key
const wallet = await hre.deployer.getWallet("0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959");

// Set a new wallet
hre.deployer.setWallet(wallet);

const artifact = await hre.deployer.loadArtifact("ContractName");
const contract = await hre.deployer.deploy(artifact, []);
```

## Caching mechanism

The `hardhat-zksync-deploy` plugin supports a caching mechanism for contracts deployed on the same network, and by default, this feature is enabled for every deployment with specific network unless specified otherwise.
For each deployment within your project, a new `deployments-zk` folder is created. Inside this folder, you can find subfolders for each network specified in the `hardhat.config.ts` file. Each network folder contains JSON files named after deployed contracts where caching purposes information are stored, and additionally, a `.chainId` file contains the chainId specific to that network.

To explicitly use a cache mechanism or force deploy for a specific network in your `hardhat.config.ts` file, you would indeed need to set the `forceDeploy` flag for that network in the networks section.

```typescript
const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      // ADDITION
      forceDeploy: true, // Specify is deploy proccess will use cache mechanism or it will force deploy of the contracts
    },
  },
};
```

If the `forceDeploy` flag is set to `true` for a specific network in your hardhat.config.ts file, it indicates that the deployment process will force deploy contracts to that network, bypassing any cache mechanism.

Conversely, if the `forceDeploy` flag is set to `false` or not specified for a network, `hardhat-zksync-deploy` will use caching mechanism during deployment. This means it will check whether the contracts have changed since the last deployment, and if not, it will reuse the already deployed contracts instead of redeploying them.

:::note default value for forceDeploy

If a value isn't explicitly defined, it automatically defaults to `true`.

:::

## Scripts configuration

Scripts used for deployments have additional features that can provide the better experience and efficiency of the deployment process.

### Deployment scripts path

Configuring a scripts path can be achieved in two ways:

- setting up global paths used for all networks.
- configuring network-specific paths used exclusively for each network. This kind of paths overrides a global paths.

#### Global Deployment Paths

To enable the plugin's usage of global custom deploy scripts, specify the directory path containing these scripts within the `deployPaths` section nested inside the `paths` section of your `hardhat.config.ts` file.

```typescript
const config: HardhatUserConfig = {
  // ADDITION
  paths: {
    deployPaths: "deploy-zkSync", //single deployment directory
    deployPaths: ["deploy", "deploy-zkSync"], //multiple deployment directories
  }
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
    }
  },
}
```

- `deployPaths` Specify deployment directories, you can use either a single object or an array structure.

:::note default path

The default path, if not explicitly set, is the `deploy` folder inside the project's root directory.

:::

#### Network-Specific Deployment Paths

To configure network-specific paths, the `hardhat.config.ts` configuration needs to be extended with a `deployPaths` property inside the network object inside `networks` section.

```typescript
const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>",
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      // ADDITION
      deployPaths: "deploy-zkSync", //single deployment directory
      deployPaths: ["deploy", "deploy-zkSync"], //multiple deployment directories
      zksync: true,
    },
  },
};
```

::: note override of global paths

Network-specific paths will override a global path, ensuring that only scripts within the directories configured for the specific network are executed.

:::

### Deployment scripts, tags, dependencies and priority

Deployment scripts can be tagged, allowing for easy categorization and organization. Dependencies between scripts can be specified to ensure proper execution order, and priority levels can be assigned to determine the sequence in which scripts are run.

- `tags` An array of strings representing lables that can be assigned to scripts for categorization and organization.
- `dependencies` An array of script tags specifying the dependencies of a script, ensuring proper execution order based on their dependencies.
- `priority` An integer value indicating the priority level of a script, determining the sequence in which scripts are executed. If a script has a higher value for priority field, it will be executed first unless it depends on another script.

Examples:

```typescript
// Script 001_deploy.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployScript = async function (_: HardhatRuntimeEnvironment) {
  console.log("Deploy script");
};

export default deployScript;
deployScript.priority = 800;
deployScript.tags = ["first"];
deployScript.dependencies = ["second"];

// Script 002_deploy.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployScript = async function (_: HardhatRuntimeEnvironment) {
  console.log("Deploy script");
};

export default deployScript;
deployScript.priority = 650;
deployScript.tags = ["second"];

// Script 003_deploy.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployScript = async function (_: HardhatRuntimeEnvironment) {
  console.log("Deploy script");
};

export default deployScript;
deployScript.priority = 1000;
```

For the specific scripts, we observe that `001_deploy.ts` and `002_deploys.ts` are tagged, and `001_deploy.ts` depends on deployment scripts with the tag `second`. Additionally, a priority is set for all three scripts. As a result, when starting the deployment process (running scripts), the order of script execution will be as follows:

1. `003_deploys.ts`: This script has the highest priority and is not dependent on any other script.
2. `002_deploy.ts`: This script needs to be executed second because it is tagged with `second`, and `001_deploy.ts` depends on that script.
3. `001_deploy.ts`: Although this script has a higher priority than `002_deploy.ts`, it depends on the latter, so it will be executed last.

:::note default values
The default value for **tags** is `default`, and the default value for **priority** is `0`.
:::

## Compilation and Deployment Support for Missing Libraries

This plugin facilitates the compilation and deployment of missing libraries for users. By leveraging the `@matterlabs/hardhat-zksync-solc` plugin, users can obtain a file that not only contains specifics about the missing libraries for compilation but also showcases how they interlink with other dependent libraries. For more information about missing libraries during the compilation process, please refer to [this link](./compiling-libraries.md).

::: warning zksolc compiler version
Starting from version 1.13.14, the zksolc compiler has been enhanced to identify missing libraries.
:::

Complex library dependency tree is also supported. It ensures libraries are compiled and deployed in a structured manner, starting from the most foundational library to the topmost dependent one.

Example:

```
Consider three libraries where:

- Library A is dependent on Library B
- Library B is dependent on Library C

A
└── B
    └── C

Deployment workflow:
1. Compile and deploy Library C.
2. Compile and deploy Library B, referencing the deployed address of Library C.
3. Compile and deploy Library A, referencing the deployed address of Library B.
```

The feature to automatically update the Hardhat user configuration with deployed addresses of libraries in the `zksolc` object is supported as well.

```typescript
zksolc: {
    compilerSource: 'binary',
    settings: {
      libraries: {
        "contracts/LibraryA.sol": {
          "LibraryA": "0x13706Afd344d905BB9Cb50752065a67Fa8d09c70"
        },
        "contracts/LibraryB.sol": {
          "LibraryB": "0x4cf2E778D384746EaB115b914885e2bB18E893E2"
        }
      }
    }
  },
  // If the settings and libraries don't exist, they'll be created.
```

For a step-by-step guide on how to deploy missing libraries, see the `deploy-zksync:libraries` command below.

## Commands

`yarn hardhat deploy-zksync` -- runs through all the scripts.

- To run a specific script, add the `--script` argument, e.g. `hardhat deploy-zksync --script 001_deploy.ts`. Runs script with name `001_deploy.ts`.
- To run a scripts with specific tags add the `--tags` argument, e.g `hardhat deploy-zksync --tags all`. Run all scripts with tag `all`.
- To run on a specific zkSync Era network, use the standard Hardhat `--network` argument, e.g. `--network zkTestnet`. The network with the name `zkTestnet` needs to be configured in the `hardhat.config.ts` file, with all required fields stated above, or specify `defaultNetwork` in `hardhat.config.ts` file.

::: tip

If network argument `--network` or `defaultNetwork` configuration are not specified, local setup with `http://localhost:8545` (Ethereum RPC URL) and `http://localhost:3050` (zkSync Era RPC URL), will be used. In this case zkSync Era network will not need to be configured in `hardhat.config.ts` file.
For more details about a dockerized local setup, check out [Local testing](../../test-and-debug/getting-started.md).
:::

`yarn hardhat deploy-zksync:libraries` -- runs compilation and deployment of missing libraries (the list of all missing libraries is provided by the output of `@matterlabs/hardhat-zksync-solc` plugin).

The account used for deployment will be the one specified by the `deployerAccount` configuration within the `hardhat.config.ts` file. If no such configuration is present, the account with index `0` will be used.

- `--private-key-or-index <PRIVATE_KEY_OR_INDEX>` - An optional argument, libraries are deployed either using the provided private key or by default using the account specified by its index in the accounts array for the specified network.
- `--no-auto-populate-config` - Flag which disables the auto-population of the hardhat config file. Enabled by default.
- `--external-config-object-path <file path>` - Specifies the path to the file containing the zksolc configuration. If not set, it defaults to the Hardhat configuration file path. Works only if auto-population is enabled.
- `--exported-config-object <object name>` - Specifies the name of the user's Hardhat config object within the Hardhat configuration file. Primarily for auto-population. Defaults to `config`.
- `--compile-all-contracts` - Compile all contracts with deployed libraries. Disabled by default.

```bash
// Automatically using the account.
yarn hardhat deploy-zksync:libraries

// Specifying a private key for the deployment.
yarn hardhat deploy-zksync:libraries --private-key-or-index 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110

// Specifying a accounts index for the deployment.
yarn hardhat deploy-zksync:libraries --private-key-or-index 2
```

Example of using the `--exported-config-object <object name>` argument:

```javascript
const someObject = {
  zksolc: {
    compilerSource: 'binary',
      settings: {
  },
  solidity: {
    compilers: compilers,
  },
  ....
  },
}

module.exports = someObject;
```

```bash
yarn hardhat deploy-zksync:libraries --exported-config-object someObject
```

::: tip
In Typescript projects `--exported-config-object <object name>` argument can be provided optionally. Plugin will try to resolve config by `HardhatUserConfig` type.
:::
