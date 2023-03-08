# 常见问题

在这里你会发现一些我们收到的关于zkSync Era的最常见的问题。

## 什么是zkSync Era？

zkSync Era是一个零知识（ZK）的Rollup，支持Ethereum区块链的通用EVM兼容性。zkSync Era的主要好处是，已经创建了EVM dApps的开发者可以毫不费力地移植到zkSync Era，并在继承Ethereum的安全性和去中心化的同时，实现显著降低气体费用和每秒更多交易。

## 为什么选择zkSync Era？

zkSync Era是第2层技术的一个巨大飞跃。这是一个期待已久的改进，为以太坊开发者提供了许多从未享受过的好处。

- **EVM兼容** - zkSync是一个EVM兼容的零知识Rollup，支持通用的EVM智能合约。这意味着如果你有EVM智能合约，那么将你的DApp移植到zkSync Era是超级容易的。
- **Ethos兼容** - 我们非常赞同去中心化和开放源代码的精神。我们所有的代码将努力做到完全开源，zkSync将执行一个路线图，将排序器和证明生成完全去中心化，我们将执行一个组织减法管理的路线图，也就是说，我们也将去中心化我们的组织。
- **确定性** - 与之前试图扩大以太坊规模的方法不同，这些方法在某些情况下提供了比L1更弱的安全保障（例如侧链、等离子体和乐观主义），ZkSync使用零知识证明，提供_确定性_的安全。
- **未来证明** - 现在采用zkSync Era的生态系统项目将享受所有未来的改进，而不需要改变他们的代码，特别是来自于。
  1. 证明人技术（硬件加速）。
  2. 编译器（集成支持LLVM的现代编程语言）。
  3. zkSync 3.0的所有创新（超链和超桥）。

## 什么是zkEVM？

zkEVM是一个架构的名称，它能够为最初为EVM编写的智能合约的执行跟踪生成零知识证明。

其架构是基于以下组件。

- zkVM，一个为在ZKP电路中证明而优化的图灵完备的类RISC虚拟机。它有几种不同的实现方式。
  - 执行器：在CPU上的快速本地执行。
  - 证人生成器：生成ZKP证明的本地执行器。
  - 证明者：实际的ZKP电路实现。
- 基于LLVM的编译器。
  - Solidity前台（更确切地说：Yul前台）。
  - Vyper前台。
  - zkVM后端。
- 特殊用途的电路（严重依赖PLONK的自定义门和查找表）作为计算密集型操作的 "预编译"，例如。
  - 非代数哈希（Keccak, SHA256, Blake2）。
  - 存储访问（Merkle路径）。
  - 椭圆曲线配对。
- 递归聚合电路（结合上述部分的证明）。

### zkEVM vs EVM

除了操作码和气体计量的差异外，zkVM严格继承了EVM的编程模型及其不变性，包括ABI的调用约定。需要强调的一件事是，zkVM支持回滚和可证明的可逆事务。它保证了相互保护：用户不能用可逆事务的轰炸来拖延网络，而逃生舱口（优先级队列）则保护了用户将任何事务纳入区块的能力。

因此，开发人员可以完全依赖L1提供的审查阻力，而不必引入与逃生舱口机制有关的任何变化。这意味着zkSync上zkRollup账户中的资产将拥有与L1上完全相同的安全保障。

### EVM的改进

在保持最大的兼容性的同时，zkEVM比EVM有显著的改进，增加了采用率并有利于我们的生态系统项目。

- **我们的编译器是基于LLVM的**。基于LLVM的编译器（Low-Level Virtual Machine）已经成为Mac OS X、iOS、FreeBSD和Android系统的默认编译器，并且是使用最广泛的编译器之一，因为它们。
  - 使我们能够比原来的EVM字节码提高效率，因为通过LLVM，我们可以利用这个成熟的生态系统中的许多优化和工具。
  - 为我们增加支持整合用其他编程语言编写的代码库与LLVM前端铺平道路。通过这样做，开发人员可以建立dApps，并以目前不可能的方式使用区块链。
- **账户抽象包含在我们的zkEVM中**。这是Ethereum开发社区期待已久的功能，它以多种方式改善了开发者的采用和用户体验。
  - 对智能合约钱包（如Argent）的原生支持，这对主流用户的入驻至关重要。
  - 对多合约的用户体验好得多。
  - 交易费用可以使用[paymasters]（.../developer-guides/aa.md#paymasters）以任何代币支付。
  - 协议现在可以从他们的智能合约中为用户补贴气体，甚至可以实现无气体交易。
  - 交易批次（multicall）可以一键确认（目前以太坊的大用户体验问题）。
  - 了解更多关于[zkSync时代的账户抽象支持]（.../developer-guides/aa.md）。

### EVM的兼容性

关于EVM兼容与EVM等同的影响，在社区中存在很多困惑。首先，让我们定义一下这两者的含义。

- **EVM等效**意味着一个特定的协议支持以太坊EVM的每一个操作码，直到字节码。因此，任何EVM智能合约都可以100%保证开箱即用。
- **EVM兼容**意味着支持Ethereum的EVM的一部分操作码；因此，一部分智能合约开箱即用。

zkSync被优化为EVM _compatible_而不是EVM _equivalent_，有三个主要原因。

1. 为EVM的等价性创建一个通用的电路，直到字节码，这将是非常昂贵和费时的。
2. 在我们从zkSync 1.0学到的基础上，我们能够设计一个针对性能和ZK可证明性进行优化的系统。
3. 我们选择不支持的操作码已经被Ethereum本身废弃，或者很少使用。在项目需要它们的情况下，为了与zkSync一起工作而进行的修改是最小的，并且不会产生对新的安全审计的需求。

几乎所有为EVM编写的智能合约都会被zkSync Era所支持，并持有所有关键的安全不变性，因此在大多数情况下不需要额外的安全重新审计。

::: warning 不支持的操作码

有几个操作码不被zkEVM支持。其中一些已经被废弃，或者它的使用是次要的，但使用它们的合约将需要调整。你可以在文档的[EVM兼容性部分]（.../building-on-zksync/contracts/contracts.md#evm-compatibility）找到更多相关信息。

:::

还有一些其他的区别，例如，Gas 将是不同的（其他L2的情况也是如此）。一些EVM的加密预编译（特别是配对和RSA）不会在第一个版本中出现，但会在推出后很快实现，其中配对是一个优先事项，以允许超链和像Aztec/Dark Forest这样的协议在没有修改的情况下也可以部署。

## 安全预期

zkSync Era的数据可用性层是Ethereum。所有建立在zkSync Era上的生态系统项目将继承Ethereum的全部安全优势。

这对我们来说显然是一个极其重要的话题，我们目前正在对zkSync Era的安全性进行重大审查（包括外部审计、安全竞赛，以及全面修改和扩展我们的漏洞赏金计划）。

我们将很快在这里实质性地扩展细节。

### 触发安全审计

虽然有一些很少使用的操作码是我们不支持的，但我们还没有在我们的生态系统项目中发现任何破坏性改变的情况，而只是简单地重构了几行代码。我们的生态系统项目中，没有一个移植到zkSync的项目报告说，任何变化都会导致需要进行安全审计。

## 什么是账户抽象？

在一个非常高的水平上，账户抽象允许我们使授权*可编程*，使钱包和协议设计更加多样化，使用情况包括。

- 实施智能合约钱包，改善私钥存储和恢复的用户体验（例如，[社会恢复](https://vitalik.ca/general/2021/01/11/recovery.html), multisig）。
- 以ETH以外的代币支付天然气费用的能力。
- 账户改变公钥和私钥的能力。
- 增加了非加密的修改，用户可以要求交易有过期时间，确认略微失误，等等。
- 签名验证系统的多样性，从目前的ECDSA，包括后量子安全签名算法（例如，Lamport，Winternitz）。

换句话说，账户抽象给整个用户体验带来了重大改进，并为开发者扩大了应用设计空间。在Argent的[这篇博文](https://www.argent.xyz/blog/wtf-is-account-abstraction/)中了解更多。

在zkSync时代，账户抽象是原生实现的，这意味着账户可以发起交易，像EOA一样，但也可以在其中实现任意的逻辑，像智能合约一样。

如果你想更好地了解zkSync上的账户抽象是什么样的，你可以阅读[本节文档]（.../developer-guides/aa.md），或尝试我们的教程[这里]（.../tutorials/custom-aa-utorial.md）。

## zkSync Era vs 替代品

### **zkSync Era vs # Optimistic Rollups***

像Arbitrum和Optimism这样的 Optimistic Rollups 利用Optimistic的方法来保障其网络安全。在他们开发的时候，他们代表了比其他可用选项更重要的渐进式改进。然而，一个广泛持有的观点（[包括Vitalik Buterin的观点](https://coinculture.com/au/people/vitalik-buterin-zk-rollups-to-outperform-optimistic-rollups/)）是，Optimistic 的方法代表了另一个临时的解决方案，从长远来看，唯一永久的和真正可扩展的解决方案将是基于零知识证明的区块链。

Optimistic Rollups存在以下关键问题。

- 这种方法假设所有交易都是有效的，然后利用事后的博弈论机制来支付参与者发现欺诈性或其他无效的（例如因为bug）交易。博弈论从来都不是完美的，就像稳定币和其他系统的博弈论一样，我们认为它不能被长期和真正的规模所依赖，以提供生态系统所需的安全性。另一方面，_zkSync Era依靠数学，而不是博弈论，提供绝对确定的证据，证明每一笔交易都是可证明的有效的，不是欺诈。
- **Optimistic Rollups的方法需要7天时间来结算**。对于生态系统项目来说，结算时间正成为一个越来越重要的特征。随着生态系统项目需求的成熟，对尽可能接近即时结算的需求将上升。用乐观的方法，这个结算问题不会消失。它总是会有7天的结算时间，因为乐观的方法需要7天的时间来完成其事后博弈理论的挑战窗口。绕过这个问题的唯一方法是引入提供一些流动性的第三方 - 但这又是信任流动性提供者的潜在安全风险。_当zkSync时代最初在主网上推出时，它将在几个小时内提供结算，但经过几个月的工作，我们的目标是在几分钟内完成结算 - 随着我们将结算时间提高到接近零 - 没有合作伙伴需要改变任何代码_。
- **Optimistic Rollups** 没有方法超越他们现在的位置。**当Optimistic的方法首次出现时，他们变得流行，因为他们可以扩展以太坊（例如，他们可以处理10倍的以太坊交易_而不降低安全性和分散性_）。问题是，虽然他们现在可以将以太坊扩展到10倍，但他们没有机制在不降低安全性和分散性的情况下超过10倍。相比之下，zkSync Era是基于零知识证明的，它具有 Optimistic 方法所不具备的重要特征--它们可以超大规模。

### zkSync Era与其他zkRollups相比

虽然所有的零知识Rollups区块链都共享加密证明的基础技术，但有许多重要的区别。

**zkSync与Starkware.**当你比较zkSync和Starkware时，主要看到的是两种不同的策略，即zkSync优化与以太坊生态系统、技术和精神的兼容，而Starkware则以兼容性为代价优化理论上的性能优势。

- **EVM。** zkSync兼容EVM，而Starknet不兼容EVM。
- **工具链**。zkSync与工具链兼容，而Starknet不兼容，它要求人们学习一个全新的工具链，其核心是一种叫做Cairo的自定义语言。
- **生态系统**。zkSync的生态系统自然地与以太坊生态系统的所有工具集一起工作，而Starkware则试图用所有新的工具启动一个全新的生态系统。
- **去中心化**。zkSync拥抱去中心化，无论是在技术层面还是在组织层面，VS Starknet不拥抱去中心化。
- **开源。** zkSync是完全开源的，而Starkware则不是开源的。

## 支持哪些钱包？

目前，我们支持任何基于Ethereum的钱包。默认情况下，zkSync Era门户网站上提供的选项是Metamask - 除了自动连接，你可以手动添加zkSync网络到你的Metamask。

**Testnet network info**

- Network Name: `zkSync Era Testnet`
- New RPC URL: `https://zksync2-testnet.zksync.dev`
- Chain ID: `280`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://goerli.explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-testnet.zksync.dev/ws`

**Mainnet network info**

- Network Name: `zkSync Era Mainnet`
- New RPC URL: `https://zksync2-mainnet.zksync.io`
- Chain ID: `324`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-mainnet.zksync.io/ws`

## 我如何为testnet申请资金？

要获得testnet的资金，你可以使用（[Faucet](https://portal.zksync.io/faucet)）通过在推特上介绍我们，获得一些代币。请确保推特上的信息包含你的以太坊地址，我们将把资金发送到该地址，并且它不是你的主要以太坊账户。该龙头对新的Twitter账户和没有头像的账户将不起作用。

另外，您可以使用[我们的桥梁](https://portal.zksync.io/bridge)将ETH从Goerli桥接到zkSync Era Testnet。

## 完成一笔存款交易需要多长时间？

zkSync Era上的交易不应超过5分钟。

## 我在哪里可以看到我提交的交易？

我们的[区块浏览器](https://explorer.zksync.io)将显示你可能需要的关于交易的一切。

## 有人能在zkSync Era的其他EVM网络中索取我的合约地址吗？

合约地址的推导公式与常规的EVM方法不同。即使合约从相同的账户地址部署了相同的nonce，zkSync Era的合约地址也不会和它在其他EVM网络中的地址相同。这意味着，例如，没有人能够声称你的协议现有以太坊地址，试图欺骗用户与恶意版本的协议互动。

因此，像我们在Optimism上看到的Wintermute那样的黑客是不可能的

## zkSync Era的智能合约的存储限制是什么？

目前的限制是3600000000。

## 什么是zkSync Era的块状气体限制？

目前的值大约设置为2^32的Gas. <br>
**注意**。这个值是暂时的，不久将被更新。

## 我可以把我的资金撤回到以太坊吗？

是的，这个桥梁是双向的。你可以把你的资金撤回到以太坊。提款交易最多需要1小时，取决于zkSync网络的使用情况。

## 什么是测试网ReGenesis？

有时，从事zkSync工作的团队会在testnet上启动再生机制--重新启动区块链，这将引入升级并将状态恢复到初始点。
