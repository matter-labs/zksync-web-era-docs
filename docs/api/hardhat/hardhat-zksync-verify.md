# `hardhat-zksync-verify` 

这个插件用于验证zkSync Era网络上的合同。

## 安装

[@matterlabs/hardhat-zksync-verify](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify)

该插件与 [@nomiclabs/hardhat-etherscan](https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan) 一起使用，它支持向后兼容该插件。
要使用它，你必须安装这两个插件，然后在hardhat.config.ts文件中导入`@matterlabs/hardhat-zksync-verify`。

```typescript
# Yarn
yarn add -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan

# Npm
npm i -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```

### 配置

在`hardhat.config.ts`文件中导入该插件。

```javascript
import "@matterlabs/hardhat-zksync-verify";
```

Add the `verifyURL` property to the zkSync network in the `hardhat.config.ts` file as shown below:

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // URL of the Ethereum Web3 RPC (optional)
  },
  zkTestnet: {
    url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
    ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true,
    // Verification endpoint for Goerli
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
  }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

附加的网络属性。

- `zkTestnet`是一个任意的zkSync网络名称。你可以使用`defaultNetwork`属性选择它作为默认网络。
- `ethNetwork`是一个带有Ethereum节点的URL的字段。你也可以提供网络名称（例如：`goerli`）作为这个字段的值。在这种情况下，插件将使用适当的以太坊网络配置的URL（来自`networks`部分），如果没有提供配置，则使用该网络的默认`ethers`提供者。这个字段对于这个插件使用的所有zkSync网络都是必需的。
- `url`是一个字段，在zkSync网络（`zksync`标志设置为`true`）的情况下，包含zkSync节点的URL，或者Ethereum节点的URL。本插件使用的所有zkSync和Ethereum网络都需要这个字段。
- `zksync`是一个标志，表示该网络是否代表zkSync网络配置。对于所有zkSync网络，这个字段需要设置为`true`。如果你想运行`hardhat-etherscan`验证，这个字段需要设置为`false`。如果设置为`true`，验证过程将总是尝试在zkSync网络上运行验证过程。
- `verifyURL`是一个指向特定zkSync网络的验证端点的字段。这个参数是可选的，其默认值是testnet验证网址。
  - 测试网：`https://zksync2-testnet-explorer.zksync.dev/contract_verification`。
  - 主网。`https://zksync2-mainnet-explorer.zksync.io/contract_verification`

如果你想在同一个项目中验证Ethereum上的智能合约，必须在`hardhat.config.ts`文件中添加`etherscan`字段和API密钥。

```typescript

networks: {
    ...
},
etherscan: {
  apiKey: //<Your API key for Etherscan>,
},

```

### 命令

```sh
hardhat verify --network <network> <contract address>
```

用给定合同的地址验证给定网络上的合同。 <br/>
注意：当像这样运行时，验证任务将尝试比较你本地设置中所有合同的编译字节码和你试图验证的合同的部署字节码。如果不匹配，它将报告一个错误。

```sh
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

通过`--合同`参数，你也可以指定你想验证的本地设置中的哪份合同，指定其完全合格的名称。完全合格的名称结构看起来像这样。"contract/AContract.sol:TheContract" <br/>

#### 构造函数参数

如果你的合同在部署时有特定的构造参数，你需要在运行验证任务时指定它们。比如说。

```sh
yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF "Hi there!"
```

如果你的构造函数需要一个复杂的参数列表，你可以写一个单独的javascript模块来导出它。例如，创建一个`arguments.js`文件，结构如下。

```typescript
module.exports = [
  "a string argument",
  "0xabcdef",
  "42",
  {
    property1: "one",
    property2: 2,
  },
];
```

在验证函数调用中加入一个新的参数：`--constructor-args arguments.js`。
```sh
yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js
```

### 核查状态检查

验证过程包括两个步骤。首先，发送一个验证请求，以确认你的合同的给定参数是否正确。然后，我们检查该请求的验证状态。这些步骤都是在你运行`验证`任务时运行的，但你将能够看到你的特定验证请求ID。
然后你可以使用这个ID来检查你的验证请求的状态，而不用从头开始运行整个过程。

下面的命令检查特定验证ID的验证请求的状态。
```sh
yarn hardhat verify-status --verification-id <your verification id>
```

### 以编程方式验证智能合约

如果你需要直接从你的代码中运行验证任务，你可以使用硬帽 "verify:verify "任务和前面提到的参数，不同的是在指定contarct的地址时使用`--address`参数。<br/>

```typescript
await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: [...]
});
```
