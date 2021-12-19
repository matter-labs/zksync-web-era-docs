# Reference

## `@matterlabs/hardhat-zksync-solc`

This plugin is used to provide convenient interface for compiling zkSync smart contracts.

### Npm

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

You can add this plugin to your project with the following comand:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

```js
zksolc: {
  version: "0.1.0",
  compilerSource: "docker",
  settings: {
    optimizer: {
      enabled: true,
    },
    experimental: {
      dockerImage: "zksyncrobot/test-build"
    }
}
```

- `version` is a field with the version of the plugin.
- `compilerSource` is a field with the compiler source. It can be either `docker` or `binary`. In the former case, the `dockerImage` value with the name of the compiler docker image should also be provided. In the latter case, the compiler binary should be provided in `$PATH`.
- `optimizer` is a field which describes parameters of the optimizer.
- `dockerImage` is the name of the docker image of the compiler.

### Commands

`yarn hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment. If you are not sure what factory dependencies are, you can read more about them in the [Web3 API](../api.md) documentation.

## `@matterlabs/hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the `@matterlabs/hardhat-zksync-solc` plugin.

### Npm

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

You can add this plugin to your project with the following comand:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm
npm i -D @matterlabs/hardhat-zksync-deploy
```

### Exports

#### `Deployer`

The main export is the `Deployer` class. It is used to wrap `zksync-web3` Wallet instance and provide convenient interface for deploying smart contracts based on the artifacts returned by the `@matterlabs/hardhat-zksync-solc` plugin.

```typescript
class Deployer {

  /**
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param ethWallet The wallet which will be used to deploy the contracts.
   */
  constructor(hre: HardhatRuntimeEnvironment, ethWallet: ethers.Wallet)

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
   * @param feeToken Address of the token to pay fees in. If not provided, defaults to ETH.
   *
   * @returns A contract object.
   */
  public async deploy(
    artifact: ZkSyncArtifact,
    constructorArguments: any[],
    feeToken?: string,
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
  zkSyncNetwork: "https://z2-dev-api.zksync.dev",
  ethNetwork: "rinkeby"
}
```

- `zkSyncNetwork` is a field with the url of the zkSync node.
- `ethNetwork` is a field with the url of the ethereum node. You can also provide network name (e.g. `rinkeby`) as the value of this field. In this case, the default `ethers` provider for the network will be used.
