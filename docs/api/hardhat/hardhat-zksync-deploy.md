# `hardhat-zksync-deploy`

这个插件提供了在zkSync上部署智能合约的工具，这些智能合约是由`@matterlabs/hardhat-zksync-solc`或`@matterlabs/hardhat-zksync-vyper`插件构建的。

::: warning

合同必须使用官方的`@matterlabs/hardhat-zksync-solc`或`@matterlabs/hardhat-zksync-vyper`插件进行编译。用其他编译器编译的合约将无法使用此插件部署到zkSync。

:::

## Installation

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

用以下命令将该插件的最新版本添加到你的项目中。

```
# Yarn

yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm

npm i -D @matterlabs/hardhat-zksync-deploy
```

### Exports

#### `Deployer`

这个插件的主要出口是`Deployer`类。它被用来包装一个`zksync-web3'钱包实例，并提供一个方便的接口来部署智能合约和账户抽象。它的主要方法是。

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

要查看如何使用Deployer来部署合同的示例脚本，请查看快速入门中的部署部分。

### Configuration

::: warning 0.6.x版的API变化

这个软件包的以前版本需要在hardhat.config.ts文件中进行不同的配置。如果你使用v0.5.x或以前的版本，网络配置必须在一个名为zkSyncDeploy的对象中注明，包括属性zkSyncNetwork和ethNetwork。我们建议用户更新到这个软件包的最新版本。

:::

指定zkSync和Ethereum网络作为`hardhat.config.ts`文件的`networks`配置的一部分。

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

- `zkTestnet`是一个任意的zkSync网络名称。你可以使用`defaultNetwork`属性选择它作为默认网络。
- `url`是一个字段，如果是zkSync网络（`zksync`标志设置为`true`），则是zkSync节点的URL，或Ethereum节点的URL。这个字段对于这个插件使用的所有zkSync和Ethereum网络都是必需的。
- `ethNetwork`是一个包含Ethereum节点的URL的字段。你也可以提供网络名称（例如：`goerli`）作为这个字段的值。在这种情况下，插件将使用适当的以太坊网络配置的URL（来自`networks`部分），如果没有提供配置，则使用该网络的默认`ethers`提供者。本插件使用的所有zkSync网络都需要这个字段。
- `zksync`是一个标志，表示该网络是否代表zkSync网络配置。这个字段对所有zkSync网络需要设置为`true`。默认为 "false"。

### 命令

`hardhat deploy-zksync` -- 运行`deploy`文件夹中的所有脚本。

:::tip

请注意，部署脚本必须放在`deploy`文件夹中!

:::

- 要运行特定的脚本，请添加`--脚本`参数，例如，`hardhat deploy-zksync --脚本001_deploy.ts`将运行脚本`./deploy/001_deploy.ts`。
- 要在特定的zkSync网络上运行，使用标准的hardhat`--network`参数，例如`--network zkTestnet`（名称为`zkTestnet`的网络需要在`hardhat.config.ts`文件中配置，并包含上述所有必需的字段），或者在`hardhat.config.ts`文件中指定`defaultNetwork`。

:::tip

如果没有指定网络参数`--network`或`defaultNetwork`配置，将使用`http://localhost:8545`（Ethereum RPC URL）和`http://localhost:3050`（zkSync RPC URL）的本地设置，。在这种情况下，zkSync网络不需要在`hardhat.config.ts`文件中进行配置。
关于docker化本地设置的更多细节，请查看[本地测试](./testing.md)。

:::
