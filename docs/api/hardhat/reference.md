# Reference

## `@matterlabs/hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling zkSync smart contracts.

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

```typescript
zksolc: {
  version: "0.1.5",
  compilerSource: "docker",
  settings: {
    compilerPath: "zksolc",
    experimental: {
      dockerImage: "matterlabs/zksolc",
      tag: "latest"
    }
  }
}
networks: {
  hardhat: {
    zksync: true
  }
}
```

- `version` is a field with the version of the `zksolc` compiler. Currently not used.
- `compilerSource` is a field with the compiler source. It can be either `docker` or `binary`. In the former case, the `dockerImage` value with the name of the compiler docker image should also be provided. In the latter case, the compiler binary should be provided in `$PATH`.
- `compilerPath` is a field with the path to the `zksolc` binary. If `compilerSource` is `docker`, this field is ignored. By default, the binary in `$PATH` is used.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default.


### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment. To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `@matterlabs/hardhat-zksync-vyper`

This plugin is used to provide a convenient interface for compiling zkSync smart contracts using Vyper.

### Npm

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

This plugin is used in conjunction with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).
To use it, you have to install and import both:

```javascript
import '@nomiclabs/hardhat-vyper';
import '@matterlabs/hardhat-zksync-vyper';
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
  compilerSource: "docker",
  settings: {
    compilerPath: "zkvyper",
    experimental: {
      dockerImage: "matterlabs/zkvyper",
      tag: "latest"
    }
  }
}
networks: {
  hardhat: {
    zksync: true
  }
}
```

- `version` is a field with the version of the `zkvyper` compiler. Currently not used.
- `compilerSource` is a field with the compiler source. It can be either `docker` or `binary`. In the former case, the `dockerImage` value with the name of the compiler docker image should also be provided. In the latter case, the compiler binary should be provided in `$PATH`.
- `compilerPath` is a field with the path to the `zkvyper` binary. If `compilerSource` is `docker`, this field is ignored. By default, the binary in `$PATH` is used.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default.


### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment. To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `@matterlabs/hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the `@matterlabs/hardhat-zksync-solc` plugin.

### Npm

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

Add the latest version of this plugin to your project with the following command:

```

# Yarn

yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm

npm i -D @matterlabs/hardhat-zksync-deploy

````

### Exports

#### `Deployer`

The main export is the `Deployer` class. It is used to wrap `zksync-web3` Wallet instance and provide a convenient interface for deploying smart contracts based on the artifacts returned by the `@matterlabs/hardhat-zksync-solc` plugin.

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
````

### Configuration

```
zkSyncDeploy: {
  zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
  ethNetwork: "goerli"
}
```

- `zkSyncNetwork` is a field with the URL of the zkSync node.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `goerli`) as the value of this field. In this case, the default `ethers` provider for the network will be used.

### Commands

`hardhat deploy-zksync` -- runs through all the scripts in the `deploy` folder. To run a specific script, add the `--script` argument, e.g. `hardhat deploy-zksync --script 001_deploy.ts` will run script `./deploy/001_deploy.ts`. Note that only scripts in the `deploy` folder can be run by this command.
