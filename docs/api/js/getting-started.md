# 快速开始

:::warning

请注意，在新的`0.13.1`SDK版本中，API/Node层使用气体操作。ergs的概念只被VM使用。

:::

## 概念

虽然大多数现有的SDK应该开箱即用，但部署智能合约或使用独特的zkSync功能，如账户抽象，需要提供Ethereum交易默认拥有的额外字段。

为了方便访问zkSync Era的所有功能，创建了`zksync-web3`JavaScript SDK，它的制作方式与[ethers](https://docs.ethers.io/v5/)的接口非常相似。事实上，"ethers "是我们的库的对等依赖，"zksync-web3 "输出的大多数对象（例如 "钱包"、"供应商 "等）都继承自相应的 "ethers "对象，并且只覆盖需要修改的字段。

该库的制作方式是，在用`zksync-web3`替换`ethers`后，大多数客户端应用程序都能开箱工作。

## 添加依赖性

```bash
yarn add zksync-web3
yarn add ethers@5 # ethers is a peer dependency of zksync-web3
```

然后你可以用以下语句导入`ethers`库和`zksync-web3`库的所有内容。

```typescript
import * as zksync from "zksync-web3";
import * as ethers from "ethers";
```

## 连接到zkSync

为了与zkSync网络互动，用户需要知道运营商节点的端点。

```typescript
// Currently, only one environment is supported.
const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
```

**注意:**目前，只支持`goerli`网络。

有些操作需要访问Ethereum网络。`ethers`库应该被用来与
以太坊。

```typescript
const ethProvider = ethers.getDefaultProvider("goerli");
```

## 创建一个钱包

为了控制你在zkSync中的账户，使用zksync.Wallet对象。它可以用存储在
ethers.Wallet，并使用zksync.Provider将交易发送到zkSync网络。

```typescript
// Derive zksync.Wallet from ethereum private key.
// zkSync's wallets support all of the methods of ethers' wallets.
// Also, both providers are optional and can be connected to later via `connect` and `connectToL1`.
const zkSyncWallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethProvider);
```

## 存入资金

让我们把`1.0 ETH`存入我们的zkSync账户。

```typescript
const deposit = await zkSyncWallet.deposit({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("1.0"),
});
```

**注意：** zkSync内的每个令牌都有一个地址。如果`ERC-20`代币被桥接，你应该在`存款`功能中提供代币的L1地址，或者如果你想存入ETH，则提供零地址（`0x000000000000000000000000`）。注意，对于`ERC-20`代币，其对应的L2代币的地址将与以太坊上的地址不同。

交易提交到以太坊节点后，可以使用交易手柄跟踪其状态。

```typescript
// Await processing of the deposit on L1
const ethereumTxReceipt = await deposit.waitL1Commit();

// Await processing the deposit on zkSync
const depositReceipt = await deposit.wait();
```

## 检查zkSync账户余额

```typescript
// Retrieving the current (committed) zkSync ETH balance of an account
const committedEthBalance = await zkSyncWallet.getBalance(zksync.utils.ETH_ADDRESS);

// Retrieving the ETH balance of an account in the last finalized zkSync block.
const finalizedEthBalance = await zkSyncWallet.getBalance(zksync.utils.ETH_ADDRESS, "finalized");
```

你可以阅读更多关于什么是已提交和已完成的块[这里](.../.../dev/developer-guides/transactions/blocks.md)。

## 执行一个转移

现在，让我们创建第二个钱包，并向其中转移一些资金。请注意，可以将资产发送到任何新的以太坊
帐户，无需预先注册

```typescript
const zkSyncWallet2 = new zksync.Wallet(PRIVATE_KEY2, zkSyncProvider, ethProvider);
```

让我们把`1 ETH`转移到另一个账户。

转移 "方法是一个辅助方法，可以在一个接口内转移`ETH`或任何`ERC-20`代币。

```typescript
const amount = ethers.utils.parseEther("1.0");

const transfer = await zkSyncWallet.transfer({
  to: zkSyncWallet2.address,
  token: zksync.utils.ETH_ADDRESS,
  amount,
});
```

跟踪该交易的状态。

```typescript
// Await commitment
const committedTxReceipt = await transfer.wait();

// Await finalization on L1
const finalizedTxReceipt = await transfer.waitFinalize();
```

## 提取资金

有两种方法可以将资金从zkSync提取到以太坊，通过L2或L1调用该操作。如果
提款操作是通过L1调用的，那么操作员有一段时间必须处理
交易，否则 "PriorityMode "将被打开。这保证了操作员不能进行
交易。但在大多数情况下，通过L2调用就足够了。

```typescript
const withdrawL2 = await zkSyncWallet.withdraw({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("0.5"),
});
```

资产将被提取到目标钱包（如果没有在`withdraw`方法的参数中定义`to`地址 - 发件人地址将被选择为目的地），在这个交易的zkSync区块的有效性证明被激活并由主网合约验证后。

可以等到有效性证明验证完成后再进行。

```typescript
await withdrawL2.waitFinalize();
```

## 部署合约

关于使用我们的hardhat插件部署智能合约的指南可以在[这里](.../hardhat)。

## 将代币添加到标准桥上

向zkSync标准桥添加令牌可以以无权限的方式进行。在向zkSync添加令牌后，它可以用于所有类型的交易。

关于向zkSync添加令牌的文档可以在[这里](./accounts-l1-l2.md#adding-native-token-zksync)找到。
