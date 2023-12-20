---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-deploy | zkSync Era Docs
---

# `hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync Era with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

## Prerequisite

To use the `hardhat-zksync-deploy` in your project, we recommend that:

- You have a Node installation and `yarn` package manager.
- You are already familiar with deploying smart contracts on zkSync Era. If not, please refer to the first section of the [quickstart tutorial](../../dev/building-on-zksync/hello-world.md).
- You have a wallet with sufficient Sepolia or Goerli `ETH` on L1 to pay for bridging funds to zkSync as well as deploying smart contracts. Use the [third party faucets](../../reference/troubleshooting/faq.md#how-do-i-request-funds-for-testnet) to get some test tokens in your account.
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:

  - Compatible with ethers **v6** (⭐ Recommended)

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

### Exports

#### `Deployer`

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
  ): Promise<ethers.BigNumber>

  /**
    * Sends a deploy transaction to the zkSync network.
    * For now it uses defaults values for the transaction parameters:
    *
    * @param artifact The previously loaded artifact object.
    * @param constructorArguments The list of arguments to be passed to the contract constructor.
    * @param overrides Optional object with additional deploy transaction parameters.
    * @param additionalFactoryDeps Additional contract bytecodes to be added to the factory dependencies list.
    * The fee amount is requested automatically from the zkSync Era server.
    *
    * @returns A contract object.
    */
  public async deploy(
    artifact: ZkSyncArtifact,
    constructorArguments: any[],
    overrides?: Overrides,
    additionalFactoryDeps?: ethers.BytesLike[],
  ): Promise<zk.Contract>

  /**
   * Extracts factory dependencies from the artifact.
   *
   * @param artifact Artifact to extract dependencies from
   *
   * @returns Factory dependencies in the format expected by SDK.
   */
  async extractFactoryDeps(artifact: ZkSyncArtifact): Promise<string[]>
```

To see an example script of how to use a `Deployer` class to deploy a contract, check out the [deployment section of the quickstart](./getting-started.md#compile-and-deploy-a-contract).

### Configuration

::: warning API changes in v0.6.x

- We advise developers to upgrade to the most recent version of this package.

:::

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

### Compilation and Deployment Support for Missing Libraries

This plugin facilitates the compilation and deployment of missing libraries for users. By leveraging the `@matterlabs/hardhat-zksync-solc` plugin, users can obtain a file that not only contains specifics about the missing libraries for compilation but also showcases how they interlink with other dependent libraries. For more information about missing libraries during the compilation process, please refer to [this link](./compiling-libraries.md).

::: warning zksolc compiler version
Starting from version 1.13.14, the zksolc compiler has been enhanced to identify missing libraries.
:::

Complex library dependecy tree is also supported. It ensures libraries are compiled and deployed in a structured manner, starting from the most foundational library to the topmost dependent one.

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

### Commands

`yarn hardhat deploy-zksync` -- runs through all the scripts in the `deploy` folder.

::: tip
The deployment scripts must be placed in the `deploy` folder.
:::

- To run a specific script, add the `--script` argument, e.g. `hardhat deploy-zksync --script 001_deploy.ts`. This runs script `./deploy/001_deploy.ts`.
- To run on a specific zkSync Era network, use the standard Hardhat `--network` argument, e.g. `--network zkTestnet`. The network with the name `zkTestnet` needs to be configured in the `hardhat.config.ts` file, with all required fields stated above, or specify `defaultNetwork` in `hardhat.config.ts` file.

::: tip

If network argument `--network` or `defaultNetwork` configuration are not specified, local setup with `http://localhost:8545` (Ethereum RPC URL) and `http://localhost:3050` (zkSync Era RPC URL), will be used. In this case zkSync Era network will not need to be configured in `hardhat.config.ts` file.
For more details about a dockerized local setup, check out [Local testing](../testing/README.md).
:::

`yarn hardhat deploy-zksync:libraries --private-key <PRIVATE_KEY>` -- runs compilation and deployment of missing libraries (the list of all missing libraries is provided by the output of `@matterlabs/hardhat-zksync-solc` plugin).

- `--private-key <PRIVATE_KEY>` - A required argument. Libraries are deployed using the provided private key.
- `--no-auto-populate-config` - Flag which disables the auto-population of the hardhat config file. Enabled by default.
- `--external-config-object-path <file path>` - Specifies the path to the file containing the zksolc configuration. If not set, it defaults to the Hardhat configuration file path. Works only if auto-population is enabled.
- `--exported-config-object <object name>` - Specifies the name of the user's Hardhat config object within the Hardhat configuration file. Primarily for auto-population. Defaults to `config`.
- `--compile-all-contracts` - Compile all contracts with deployed libraries. Disabled by default.

```
yarn hardhat deploy-zksync:libraries --private-key 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
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
yarn hardhat deploy-zksync:libraries --private-key 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110 --exported-config-object someObject
```

::: tip
In Typescript projects `--exported-config-object <object name>` argument can be provided optionally. Plugin will try to resolve config by `HardhatUserConfig` type.
:::
