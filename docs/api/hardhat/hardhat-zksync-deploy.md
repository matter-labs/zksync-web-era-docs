# `hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

::: warning

Contracts must be compiled using the official `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins. Contracts compiled with other compilers will fail to deploy to zkSync using this plugin.

:::

## Installation

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

The main export of this plugin is the `Deployer` class. It is used to wrap a `zksync-web3` Wallet instance and provides a convenient interface to deploy smart contracts and account abstractions. Its main methods are:

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
   * @param ethWallet The wallet which will be used to deploy the contracts.
   * @param deploymentType Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */
  static fromEthWallet(hre: HardhatRuntimeEnvironment, ethWallet: ethers.Wallet, deploymentType?: zk.types.DeploymentType)

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
For more details about the dockerized local setup, check out [Local testing](./testing.md).

:::
