# 功能支持状态

:: :tip 征求反馈意见

随着我们增加新的功能，这个页面会不断地更新。

如果其中有任何阻挡你的情况，请在我们的[Discord](https://join.zksync.dev/)上告诉我们，这样我们就可以相应地安排优先次序。

:::

## 在 Solidity 中使用库

如果一个Solidity库可以被内联，即它只包含`private`或`internal`方法，那么这个库就可以不受任何限制地使用。

然而，如果一个库至少包含一个`public`或`external`方法，它在Yul表示中就不再被内联。这些地址需要明确地传递给我们的编译器。我们的硬帽插件目前还不支持这一点，但以后会加入。

对于Solidity和Vyper的旧版本的支持，请查看[这里](.../building-on-zksync/contracts/contracts.md)

## 不支持的操作码

- `SELFDESTRUCT` (它被认为是有害的，在L1上有调用来停用它)。
- `EXTCODECOPY` (如果需要可以实现，但我们现在跳过它，因为zkEVM的操作码与EVM的不一样)。
- `CALLCODE` (在Ethereum上已被废弃，改用`DELEGATECALL`)。
- `CODECOPY` - (它不返回0，但产生一个编译错误)。

## 被编译器忽略

- `PC`总是返回`0`(因为solidity是0.7.0，所以在Yul和Solidity中不能访问)。

## 预编译

- zkSync通过预编译原生支持`keccak256`, `sha256`, 和`ecrecover`。

## 目前支持的功能

- **原生支持ECDSA签名。**与第一个版本的zkSync和大多数zk rollups不同，注册用户的私钥不需要特殊操作。任何账户都可以在L2上用L1上的相同私钥进行管理。
- **支持Solidity 0.8.x和Vyper。**不需要改变或重新审核代码库。
- **Web3 API**。除了小的例外，我们的API与Ethereum完全兼容。这使得我们能够与现有的索引器、探索器等无缝集成。
- **Hardhat插件**。这使得zkSync上的智能合约的测试和开发变得容易。
- **L1 <-> L2智能合约通信**。

## 即将发布的功能

- **更多的开发者工具。**各种硬帽插件与zkSync插件之间的兼容性，与Docker的简单本地设置，等等，将是生态系统发展的关键。
- **对旧版本的Solidity的支持。**我们正在积极努力支持不同版本的Solidity，以实现现有项目的无缝集成。
- **zkPorter扩展。**最大和最重要的功能之一。它将让用户在高安全性和比以太坊低20倍的费用中选择zkRollup账户，而在安全性远高于侧链的情况下选择zkPorter账户，其交易费用几乎为几美分。
