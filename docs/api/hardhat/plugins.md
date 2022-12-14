# Plugins

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync 2.0.

### Npm

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

This plugin is configured in the `hardhat.config.ts` file of your project. Here is an example

```typescript
zksolc: {
  version: "1.2.1",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zksolc",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zksolc", // required for compilerSource: "docker"
      tag: "latest"   // required for compilerSource: "docker"
    },
    libraries{} // optional. References to non-inlinable libraries
  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

- `version` is a field with the version of the `zksolc` compiler. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zksolc-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zksolc` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates the `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `hardhat-zksync-vyper`

This plugin is used to provide a convenient interface for compiling Vyper smart contracts before deploying them to zkSync 2.0.

### Npm

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

This plugin is used in conjunction with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).
To use it, you have to install and import both plugins in the `hardhat.config.ts` file:

```javascript
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
```

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-vyper

# Npm
npm i -D @matterlabs/hardhat-zksync-vyper
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

```typescript
zkvyper: {
  version: "0.1.0",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zkvyper",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zkvyper",  // required for compilerSource: "docker"
      tag: "latest"  // required for compilerSource: "docker"
    },
    libraries{} // optional. References to non-inlinable libraries

  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

- `version` is a field with the version of the `zkvyper` compiler. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `zksync` network option indicates whether zkvyper is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

::: warning

Contracts must be compiled using the official `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins. Contracts compiled with other compilers will fail to deploy to zkSync using this plugin.

:::

### Npm

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

Add the latest version of this plugin to your project with the following command:

```

# Yarn

yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm

npm i -D @matterlabs/hardhat-zksync-deploy

```

### Exports

#### `Deployer`

The main export of this plugin is the `Deployer` class. It is used to wrap a `zksync-web3` Wallet instance and provides a convenient interface to deploy smart contracts. Its main methods are:

```typescript
class Deployer {

  /**
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param zkWallet The wallet which will be used to deploy the contracts.
   */
  constructor(hre: HardhatRuntimeEnvironment, zkWallet: zk.Wallet)

  /**
   * Created a `Deployer` object on ethers.Wallet object.
   *
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param ethWallet The wallet which will be used to deploy the contracts.
   */
  static fromEthWallet(hre: HardhatRuntimeEnvironment, ethWallet: ethers.Wallet)

  /**
   * Loads an artifact and verifies that it was compiled by `zksolc\.
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
   * @param constructorArguments List of arguments to be passed to the contract constructor.
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
    * @param constructorArguments List of arguments to be passed to the contract constructor.
    * @param overrides Optional object with additional deploy transaction parameters.
    * @param additionalFactoryDeps Additional contract bytecodes to be added to the factory dependencies list.
    * The fee amount is requested automatically from the zkSync server.
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

To see an example script of how to use a `Deployer` to deploy a contract, check out [deployment section of the quickstart](./getting-started.md#write-and-deploy-a-contract).

### Configuration

::: warning API changes in v0.6.x

Previous versions of this package required a different configuration in the `hardhat.config.ts` file. If you're using `v0.5.x` or previous, the network configuration must be indicated in an object named `zkSyncDeploy`, including the properties `zkSyncNetwork` and `ethNetwork`. **We recommended users to update to the latest version of this package.**

:::

Specify the zkSync and Ethereum networks as part of the `hardhat.config.ts` file's `networks` configuration:

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // URL of the Ethereum Web3 RPC (optional)
  },
  zkTestnet: {
    url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
    ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true
  }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

- `zkTestnet` is an arbitrary zkSync network name. You can select this as the default network using the `defaultNetwork` property.
- `url` is a field with the URL of the zkSync node in case of the zkSync network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `goerli`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `zksync` is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to `true` for all zkSync networks. `false` by default.

### Commands

`hardhat deploy-zksync` -- runs through all the scripts in the `deploy` folder.

::: tip

Note that deployment scripts must be placed in the `deploy` folder!

:::

- To run a specific script, add the `--script` argument, e.g. `hardhat deploy-zksync --script 001_deploy.ts` will run script `./deploy/001_deploy.ts`.
- To run on a specific zkSync network, use standard hardhat `--network` argument, e.g. `--network zkTestnet` (the network with the name `zkTestnet` needs to be configured in the `hardhat.config.ts` file, with all required fields stated above), or specify `defaultNetwork` in `hardhat.config.ts` file.

::: tip

If network argument `--network` or `defaultNetwork` configuration are not specified, local setup with `http://localhost:8545` (Ethereum RPC URL) and `http://localhost:3050` (zkSync RPC URL), will be used. In this case zkSync network doesn't need to be configured in `hardhat.config.ts` file.
For more details about the dockerized local setup, check out [Local testing](https://v2-docs.zksync.io/api/hardhat/testing.html).

:::
