# 系统合约

为了使零知识电路尽可能的简单，并能进行简单的扩容，zkSync的一大块逻辑被移到了所谓的 "系统合约"中---一组具有特殊权限和特殊目的的合约，例如，合同的部署，确保用户只为发布合约的calldata支付一次，等等。

系统合同的代码在经过彻底测试之前不会公开。本节将只为你提供在zkSync基础上构建的知识。

## 接口

系统合同的地址和接口可以在[这里](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol)找到。

本节将描述一些最流行的系统合约的语义。

## ContractDeployer

[接口](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IContractDeployer.sol#L5)

这个合约是用来部署新的智能合约的。它的工作是确保每个部署的合约的字节码是已知的。这个合约还定义了衍生的
地址。每当一个合约被部署，它就会发出 "ContractDeployed "事件。

在未来，我们将添加一个关于如何直接与该合约互动的描述。

## L1Messenger

[接口](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IL1Messenger.sol#L5)

该合约用于从zkSync向Ethereum发送消息。每发送一条消息，就会发出 "L1MessageSent "事件。

## NonceHolder

[接口](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L13)

该合约存储账户非对称性。为了提高效率（[tx nonce和deployment nonce](.../building-on-zksync/contracts/contract-deployment.md#differences-in-create-behaviour)被存储在一个地方），也是为了方便操作者。

## 引导器

为了提高可扩容性和降低开销，协议的某些部分（例如账户抽象规则）被转移到一个叫做_bootloader_的短暂合约中。我们称其为短暂的，因为从形式上看，它从未被部署，也不能被调用，但它有一个正式的[地址](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol#L26)，当它调用其他合约时，在`msg.sender`上使用。

现在，你不需要知道关于它的任何细节，但是当你使用账户抽象功能开发时，知道它的存在是很重要的。你总是可以假设引导者不是恶意的，它是协议的一部分。在未来，引导器的代码将被公开，对它的任何改变也意味着对协议的升级。

## 对一些系统合同的保护性访问

一些系统合约对账户的影响，在以太坊上可能是意料之外的。例如，在以太坊上，EOA唯一可以增加其nonce的方式是发送交易。而且，发送交易一次只能增加1个nonce。在zkSync上，nonce是通过[NonceHolder](#nonceholder)系统合约实现的，如果天真地实施，用户可以通过调用这个合约来增加他们的nonce。这就是为什么对nonce holder的大部分非视图方法的调用被限制为只能用一个特殊的`isSystem'标志来调用，以便与重要的系统合约的交互可以被账户的开发者有意识地管理。

这同样适用于[ContractDeployer](#contractdeployer)系统合约。这意味着，例如，你需要明确地允许你的用户部署合约，就像在DefaultAccount的[实现](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L126)中那样。

## L1智能合约

### 钻石

从技术上讲，这个L1智能合约充当了Ethereum（L1）和zkSync（L2）之间的连接器。
这个合约检查有效性证明和数据可用性，处理L2 <-> L1通信，最终完成L2状态转换，等等。

还有一些部署在L2上的重要合约，也可以执行称为_系统合约的逻辑。
使用L2 <-> L1通信可以同时影响L1和L2。

### DiamondProxy

该合同使用[EIP-2535](https://eips.ethereum.org/EIPS/eip-2535)的钻石代理模式。
它是一个内部实现，受到[mudgen reference implementation](https://github.com/mudgen/Diamond)的启发。
它没有外部函数，只有委托调用其中一个面（目标/实现契约）的回退。

因此，即使是升级系统也是一个独立的面，可以被替换。

与参考实现的区别之一是能够冻结对切面的访问。

每个面都有一个相关的参数，表明是否有可能冻结对该面的访问。

有权限的角色可以冻结**钻石（而不是特定的切面！），所有带有 "isFreezable "标记的切面都是不可访问的，直到治理者解冻钻石。

### DiamondInit

这是一个单函数契约，实现了初始化钻石代理的逻辑。
它只在钻石构造器上被调用一次，并不作为一个面保存在钻石中。

实现细节--函数返回一个魔法值，就像它在[EIP-1271](https://eips.ethereum.org/EIPS/eip-1271)中设计的那样，但魔法值的大小是32字节。

### DiamondCutFacet

这些智能合约管理钻石代理的冻结/解冻和升级。
也就是说，该合约决不能被冻结。

目前，冻结和解冻被实现为访问控制功能。它完全由治理者控制，但以后可以改变。
治理者可以调用`emergencyFreezeDiamond`来冻结钻石，`unfreezeDiamond`来恢复它。

`DiamondCutFacet`的另一个目的是升级切面。升级分为2-3个阶段。

- `proposeDiamondCut` - 由总督提议升级。
- `approveEmergencyDiamondCutAsSecurityCouncilMember` - 由安全委员会批准升级。
- `执行钻石切割提案'--最终完成升级。

升级本身由三个变量描述。

- `facetCuts` - 一组对面的改变（增加新的面，移除面，和替换面）。
- 对 `(address _initAddress, bytes _calldata)`用于初始化升级，通过对`_initAddress`的委托调用和`_calldata`的输入。

注意：`proposeDiamondCut` - 提交与升级相关的数据，但不执行。
当升级与`facetCuts`和`(地址_initAddress, 字节_calldata)`关联时，升级将被提交到
`facetCuts`和`_initAddress`。这样做的目的是给治理者留下一些自由，以便在提出和执行升级之间改变calldata。
在提出和执行升级之间改变calldata。

### GettersFacet

独立的面，其唯一的功能是提供`view`和`pure`方法。它还实现了[Diamond loupe](https://eips.ethereum.org/EIPS/eip-2535#diamond-loupe)，使管理分面更容易。

### GovernanceFacet

控制改变特权地址，如治理者和验证者或系统参数之一(L2 bootloader bytecode hash, verifier address, verifier parameters, etc)。

### 信箱面

处理L2 <-> L1通信的面，其概述可以在[L1 / L2 Interoperability guide]（.../developer-guides/bridging/L1-l2-interop.md）中找到。

邮箱只关心从L2到L1的信息传输和其他方式，但不持有或转移任何资产（ETH、ERC20代币或NFT）。

L1->L2通信被实现为在L1上请求一个L2交易，并在L2上执行。这意味着用户可以调用L1合约上的函数，将有关交易的数据保存在一些队列中。后来，验证者可以在L2上处理这些交易，并在L1的优先级队列上将其标记为已处理。

目前，它只用于从L1向L2发送信息或实现多层协议，但计划将优先队列用于抗审查机制。L1->L2通信的相关函数：`requestL2Transaction`/`l2TransactionBaseCost`/`serializeL2Transaction`。

**注意**。对于每个执行的事务L1->L2，系统程序必然会发送一个L2->L1的日志。

这种L2 -> L1日志的语义总是。

- sender = BOOTLOADER_ADDRESS.
- key = hash(L1ToL2Transaction)。
- value = 处理事务的状态（1-成功&0为失败）。
- isService = true（只是一个常规值）。
- l2ShardId = 0（意味着L1->L2交易是在一个卷积分片中处理的，其他分片还不能使用
  反正其他分片还不可用）。
- txNumberInBlock = 该区块中的交易数量。

L2->L1通信，与L1->L2通信相反，只基于信息的传输，而不是在L1上的交易执行。

从L2端来看，有一个特殊的zkEVM操作码，在L2块中保存了`l2ToL1Log`。当发送L2块到L1时，验证器将发送所有`l2ToL1Logs`（见`ExecutorFacet`）。以后，用户既可以在L1上阅读他们的`l2ToL1logs`，又可以_证明他们发送了它。

从L1方面来看，对于每个L2块，都会计算出一个Merkle根，其叶子里有这样的日志。因此，用户可以为每个`l2ToL1Logs`提供Merkle证明。

_NOTE_: `l2ToL1Log`结构由固定大小的字段组成! 正因为如此，从L2发送大量数据并证明它们是在L1上发送的，只用`l2ToL1log`就很不方便。为了发送一个可变长度的信息，我们使用这个技巧。

- 其中一个系统合约接受一个任意长度的信息，并发送一个固定长度的信息，参数为`senderAddress == this`，`marker == true`，`key == msg.sender`，`value == keccak256(message)`。
- L1上的合约接受所有发送的消息，如果消息来自于这个系统合约，它要求
  `value'的预象被提供。

### ExecutorFacet

一个接受L2块的合约，强制执行数据的可用性并检查zk-proof的有效性。

状态转换分为三个阶段。

- `commitBlocks` - 检查L2块的时间戳，处理L2日志，为一个块保存数据，并为zk-proof准备数据。
- `proveBlocks` - 验证zk-proof。
- `executeBlocks` - 最终确定状态，标记L1 -> L2通信处理，并保存Merkle树与L2日志。

当一个块被提交时，我们处理L2 -> L1日志。下面是预计在那里的不变量。

- 只有一个来自`L2_SYSTEM_CONTEXT_ADDRESS`的L2 -> L1日志，`key == l2BlockTimestamp`和`value == l2BlockHash`。
- 几个（或没有）来自`L2_KNOWN_CODE_STORAGE_ADDRESS`的日志，`key == bytecodeHash`，其中bytecode被标记为已知工厂依赖。
- 几个（或没有）来自`L2_BOOTLOADER_ADDRESS`的日志，`key == canonicalTxHash`，其中`canonicalTxHash`是已处理的L1->L2事务的哈希。
- 几个（或没有）来自`L2_TO_L1_MESSENGER`的日志，`key == hashedMessage`，其中`hashedMessage`是一个从L2发送的任意长度的信息的哈希。
- 几个（或没有）来自其他地址的任意参数的日志。
