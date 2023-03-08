# zkSync时代文档

本文档旨在帮助您在zkSync上进行开发。
它介绍了zkSync的概念，描述了zkSync网络堆栈，以及一些复杂应用和用例的高级主题。

鉴于该文档是开源的，请随时建议新的主题，添加新的内容，并在你认为有用的地方提供例子。如果你不确定如何进行，[按照这些指示](./troubleshooting/docs-contribution/docs.md)。

## 基本主题

如果这是你第一次使用zkSync，我们建议你从头开始，像看书一样慢慢阅读文档。

- [Intro to rollups](./fundamentals/rollups.md) - 简单介绍一下rollups。
- [zkSync时代基础知识](./fundamentals/zkSync.md) - 对zkSync时代技术的快速概述。
- [Interacting with zkSync Era](./fundamentals/interacting.md) - 对zkSync Era Testnet的简要介绍。
- [Hyperscaling](./fundamentals/hyperscaling.md) - 了解zkSync的超链。

### 了解zkSync Era

- [Transactions](./developer-guides/transactions/transactions.md) - 关于zkSync如何处理交易的指南。
- [Blocks](./developer-guides/transactions/blocks.md) - 了解块如何在zkSync上工作。
- [System contracts](./developer-guides/system-contracts.md) - 简要介绍zkSync系统合同。
- [Account abstraction](./developer-guides/aa.md) - 了解账户的抽象性。
- [收费机制](./developer-guides/transactions/fee-model.md) - 快速浏览zkSync的收费结构。
- [资金桥接](./developer-guides/bridging/bridging-asset.md) - 关于代币桥接的简要介绍。
- [L1 / L2 Interoperability](./developer-guides/bridging/l1-l2-interop.md) - 关于L1和L2之间数据通信的简单介绍。
- [L1 / L2通信](./developer-guides/bridging/l1-l2.md) - 了解如何从Ethereum向zkSync发送数据。
- [L2 / L1通信](./developer-guides/bridging/l2-l1.md) - 学习如何从zkSync向以太坊发送数据。
- [视频资源](./developer-guides/videos.md) - 观看开发者相关视频和zkSync时代。

### 基于zkSync时代的构建

- [Quickstart](./building-on-zksync/hello-world.md) - 了解如何使用zkSync开发工具箱构建一个完整的dApp。
- [智能合约部署](./building-on-zksync/contracts/contracts.md) - 关于如何在zkSync上部署智能合约的指南。
- [验证合同](./building-on-zksync/contracts/contract-verification.md) - 关于如何用zkSync区块资源管理器验证智能合同的指南。
- [处理事件](./building-on-zksync/events.md) - 了解如何在zkSync时代处理事件。
- [JSON-RPC API](./building-on-zksync/rpc.md) - 了解如何使用我们类似于Ethereum的自定义JSON-RPC API。
- [Fair Onboarding Alpha](./building-on-zksync/fair-onboarding-alpha.md) - 了解zkSync时代的Fair Onboarding Alpha如何工作。

### 教程

- [Cross-chain governance](./tutorials/cross-chain-tutorial.md) - 了解如何使用L1到L2的合同互动。
- [Account abstraction multisig](./tutorials/custom-aa-tutorial.md) - 了解如何部署您的自定义账户并与zkSync系统合同互动。
- [Daily Spending Limit](./tutorials/aa-daily-spend-limit.md) - 了解如何使用账户抽象在智能合约中创建每日花费限制。
- 构建自定义支付大师](./tutorials/custom-paymaster-tutorial.md) - 了解如何构建一个自定义支付大师，让用户在你的 
代币。

### 故障排除

- [Changelogs](./troubleshooting/changelog.md) - 获取zkSync Era的更新、重大变化和新功能。
- [贡献文档](./troubleshooting/docs-contribution/docs.md) - 了解成为zkSync Era文档贡献者所需的准则。
- [FAQs](./troubleshooting/faq.md) - 关于zkSync Era的热门问题和答案。
<! -- -- [已知问题](./troubleshooting/known-issues.md) - 获得你可能发现的常见问题的答案。-->
<!-- - [重要链接](./troubleshooting/important-links.md) - 获得重要链接的快速参考。-->
<!-- - [状态](./troubleshooting/status.md) - 获得我们目前正在进行的工作的更新。-->

### 工具和SDKs

- [zkSync Era Portal](https://portal.zksync.io) - 探索钱包、桥梁和龙头的功能。
- [Block Explorer](../api/tools/block-explorer/) - 在zkSync block explorer上搜索关于区块、交易、地址等的实时和历史信息。
- [Javascript SDK](./api/js/) - 扩展Ethers的功能，我们的Javascript SDK包含在zkSync Era上构建所需的特定类和方法。
- [Python SDK](./api/python/) - 探索在zkSync Era上构建所需的所有Python方法和功能。
- [Go SDK](../api/go/) - 探索在zkSync Era上构建的所有GO方法和功能。
- [Java SDK](../api/java/) - 探索在zkSync Era上构建的所有Java方法和功能。
- [Swift SDK](../api/java/) - 探索在zkSync Era上构建的所有Swift方法和功能。
- [Hardhat Plugins](./api/hardhat/) - 使用我们的Hardhat zkSync插件来编译、测试、部署和验证您基于Solidity或Vyper的应用程序。
- [zkSync CLI](./api/tools/zksync-cli/) - 通过zkSync CLI简化您的开发过程并从您的终端与zkSync Era互动。

