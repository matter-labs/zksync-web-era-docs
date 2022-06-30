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
  version: "0.1.0",
  compilerSource: "docker",
  settings: {
    compilerPath: "zksolc",
    optimizer: {
      enabled: true
    },
    experimental: {
      dockerImage: "matterlabs/zksolc"
    }
  }
}
networks: {
  hardhat: {
    zksync: true
  }
}
```

- `version` is a field with the version of the plugin.
- `compilerSource` is a field with the compiler source. It can be either `docker` or `binary`. In the former case, the `dockerImage` value with the name of the compiler docker image should also be provided. In the latter case, the compiler binary should be provided in `$PATH`.
- `compilerPath` is a field with the path to the `zksolc` binary. If `compilerSource` is `docker`, this field is ignored. By default, the binary in `$PATH` is used.
- `optimizer` is a field that describes the parameters of the optimizer.
- `dockerImage` is the name of the docker image of the compiler. If `compilerSource` is `binary`, this field is ignored.
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default.

Also there can be added a docker image tag:

```typescript
zksolc: {
  version: "0.1.0",
  compilerSource: "docker",
  settings: {
    compilerPath: "zksolc",
    optimizer: {
      enabled: true
    },
    experimental: {
      dockerImage: "matterlabs/zksolc", 
      tag: "v1.1.0"
    }
  }
}
```

- `zksolc.settings.experimental.tag` is a tag of the docker container that corresponds to a specific compiler version. If you don't set the tag - the latest version of zksolc is 
pulled.
If you want to verify your contracts in zkSync Block Explorer you must set this field to a *specific* compiler version - the same one you used for deployed contracts.

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment. To understand what the factory dependencies are, it is possible read more about them in the [Web3 API](../api.md) documentation.

During the compilation, for each subfolder of the `contracts` directory the contracts and their dependencies are flattened into a single `.sol` file and the flattened versions of the contracts are put in the `contracts/tmp` directory. The actual compilation is done over the flattened versions of the contracts.

If a certain contract is a dependency for other smart contracts, it may appear in multiple flattened files; thus, it will appear multiple times in the `artifacts` folder. During deployment, it may be required to specify the full path to the contract artifact to the `Deployer` class instance. The deployer script will provide hints on what paths may be used. If this contract has a unique name in the project, it is possible choose any of the proposed ones.

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
```

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
   * @param feeToken Address of the token to pay fees in. If not provided, defaults to ETH.
   *
   * @returns Calculated fee in wei of the corresponding fee token.
   */
  public async estimateDeployFee(
    artifact: ZkSyncArtifact,
    constructorArguments: any[],
    feeToken?: string,
  ): Promise<ethers.BigNumber>

  /**
   * Sends a deploy transaction to the zkSync network.
   * For now, it will use defaults for the transaction parameters:
   * - fee amount is requested automatically from the zkSync server.
   *
   * @param artifact The previously loaded artifact object.
   * @param constructorArguments List of arguments to be passed to the contract constructor.
   * @param overrides Optional object with additional deploy transaction parameters.
   *
   * @returns A contract object.
   */
  public async deploy(
    artifact: ZkSyncArtifact,
    constructorArguments: any[],
    overrides?: Overrides
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
