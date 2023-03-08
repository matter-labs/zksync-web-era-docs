# 合约部署

为了保持与L1相同的安全性，zkSync运营商必须在以太坊链上发布它所部署的每个合约的代码。然而，如果有多个合同部署了相同的代码，它将只在以太坊上发布一次。虽然第一次部署合约可能相对昂贵，但多次部署相同代码的合约的工厂，与L1相比，可以有很大的节省。

所有这些具体细节使zkEVM上部署智能合约的过程符合主要规则。_操作者在部署合约之前应该知道合约的代码_。这意味着，部署合约只能通过`EIP712`交易进行，`factory_deps`字段包含提供的字节码。

[在此了解更多关于EIP712交易的信息](../../../api/api.md#eip712).

## 以太坊/zkSync的差异

**在以太坊上部署合约是如何进行的。**

为了在以太坊上部署一个合约，用户需要向零地址（0x000...000）发送一个交易，交易的数据字段等于合约字节码与构造函数参数的串联。

**在zkSync上部署合约的方式。**

要在zkSync Era上部署合同，用户调用[ContractDeployer系统合同](.../.../developer-guides/system-contracts.md#contractdeployer)的`create`函数，提供要发布的合同的哈希值，以及构造器参数。合同字节码本身是在事务的`factory_deps`字段中提供的（因为它是一个[EIP712事务](.../.../api/api.md#eip712)）。如果合同是一个工厂（即它可以部署其他合同），这些合同的字节码也应该包括在`factory_deps`中。

我们推荐使用[hardhat-zksync-deploy](./././api/hardhat)插件，以简化部署过程。它提供了类和方法来处理所有的部署要求，比如生成[合同的字节码哈希](#format-of-bytecode-hash)。

这里有一个[关于如何使用它的分步指南](.../.../.../api/hardhat/getting-started.md)。

### 关于 "工厂部署 "的说明

一个好的问题是，验证器如何知道执行代码的字节码哈希值的预象？
这里就出现了工厂依赖的概念(`factory_deps`简称)! 工厂依赖是一个字节码哈希值的列表，其预像在L1上显示（数据总是可用的）。

在引擎盖下，zkSync并不存储合约的字节码，而是[特别格式化的字节码哈希](#format-of-bytecode-hash)。你可以看到，即使是[ContractDeployer](.../.../developer-guides/system-contracts.md#contractdeployer)系统合同也接受部署合同的字节码哈希值，而不是其字节码。然而，为了使合约部署成功，运营商需要知道字节码。正是由于这个原因，交易的`factory_deps`（即工厂依赖）字段被使用：它包含了操作员应该知道的字节码，以便这个交易成功。一旦交易成功，这些字节码将被公布在L1上，并被视为永远被操作者 "知道"。

一些用法的例子是。

- 显而易见的是，当你部署一个合同时，你需要在`factory_deps`字段中提供其代码。
- 在zkSync上，工厂（即可以部署其他合同的合同）并不存储其依赖的字节码，即他们可以部署的合同。它们只存储它们的哈希值。这就是为什么你需要在 "factory_deps "字段中包含所有依赖的字节码。

这两个例子在我们的[hardhat-zksync-deploy](./././api/hardhat/getting-started.md)中已经无缝完成。

请注意，工厂部署不一定要以任何方式被事务使用。这些只是标记，表明这些字节码应该和这个事务一起发布在L1上。如果你的合同包含很多不同的工厂依赖，而且它们不适合放在一个L1块中，你可以在多个事务之间分割工厂依赖的列表。

例如，假设你想部署合同`A`，它也可以部署合同`B`和`C`。这意味着你的部署事务将有三个工厂依赖关系：`A`、`B`和`C`。如果发布所有合约所需的pubdata太大，无法装入一个区块，你可以发送一个只有工厂依赖的`A`和`B`的虚拟事务（假设它们的总长度足够小），用第二个事务进行实际部署，同时提供合约`C`的字节码作为它的工厂依赖。请注意，如果某个合同_本身大于每个区块允许的限制，这个合同就必须被分割成更小的合同。

### 字节码哈希的格式

每个zkEVM字节码必须遵守以下格式。

- 其长度必须能被32整除。
- 它的字长(32字节的块)应该是奇数。换句话说，`bytecodeLength % 64 == 32`。
- 它不能长于`2^16`个32字节的字，即`2^21`个字节。

zkSync合约的字节码的32字节哈希值是按照以下方式计算的。

- 前两个字节表示字节码哈希格式的版本，目前等于`[1,0]`。
- 后2个字节表示字节码的长度，以32字节为单位。
- 其余的28个字节(即28个低大数字节)等于合同字节码的`sha256`哈希值的最后28个字节。

### `CREATE`行为的差异

为了便于[支持账户抽象](././developer-guides/aa.md)，对于每个账户，我们将nonce分成两部分。部署nonce_和交易nonce_。部署nonce是该账户用`CREATE'操作码部署的合约数量，而交易nonce则用于交易的重放攻击保护。

这意味着，虽然zkSync上的nonce与Ethereum上的行为方式相同，但对于EOA来说，计算部署合同的地址并不那么简单。在Ethereum上，它可以安全地计算为`hash(RLP[address, nonce])`，而在zkSync上，建议等待合同部署，并捕捉由[ContractDeployer](././developer-guides/system-contracts.md#contractdeployer)发出的`ContractDeployed`事件，以获得新部署合同的地址。所有这些都是由SDK在后台完成的。

为了获得一个确定的地址，你应该使用[ContractDeployer](.../.../developer-guides/system-contracts.md#contractdeployer)的`create2`方法。它也适用于EOA，但在SDK中还不能使用。

## 从L1部署合约

在zkSync Era上部署合同也可以通过L1-L2通信实现。

用于提交L1->L2事务的[接口](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IMailbox.sol#L78)接受该特定事务所需的所有工厂依赖的列表。处理它们的逻辑与默认的L2部署是一样的。唯一的区别是，由于用户已经在L1上发布了字节码的完整预像，所以不需要在L1上再次发布这些字节码。

要了解更多关于zkSync Era上的L1-L2通信，请访问[本节文档](.../.../developer-guides/bridging/l1-l2.md)
