# 支持账户抽象化




:::warning

请注意，在新的`0.13.0`SDK中，API层使用气体操作。ergs的概念只被VM使用。

:::

## 介绍

在以太坊上，有两种类型的账户。[外部拥有的账户（EOAs）](https://ethereum.org/en/developers/docs/accounts/#externally-owned-accounts-and-key-pairs)和[合约账户](https://ethereum.org/en/developers/docs/accounts/#contract-accounts)。
前者是唯一可以发起交易的类型。
而后者则是唯一可以实现任意逻辑的账户。对于一些用例，如智能合约钱包或隐私协议，这种差异会造成很多摩擦。
因此，这类应用需要L1中继器，例如EOA，以帮助促进智能合约钱包的交易。

zkSync Era中的账户可以像EOA一样发起交易，但也可以像智能合约一样在其中实现任意的逻辑。这个功能被称为 "账户
抽象"，它的目的是解决上述问题。

:::warning 不稳定的功能

这是zkSync时代的账户抽象（AA）的测试版本。我们非常高兴听到您的反馈 请注意： **应预计到AA所需的API/接口的突破性变化。

zkSync Era是首批采用AA的EVM兼容链之一，所以这个测试网也被用来观察EVM链的 "经典 "项目如何与账户抽象功能共存。

:::

##先决条件

为了更好地理解这个页面，我们建议你花些时间先阅读一下[账户]（https://ethereum.org/en/developers/docs/accounts/）的指南。

## 设计

zkSync上的账户抽象协议与[EIP4337](https://eips.ethereum.org/EIPS/eip-4337)非常相似，尽管我们的协议为了提高效率和更好的用户体验而有所不同。

### 保持非代码的唯一性


::: warning 预计会有变化

目前的模式有一些重要的缺点：它不允许自定义钱包在同一时间发送多个交易，同时保持确定性的排序。对于
EOA来说，nonces应该是按顺序增长的，而对于自定义账户来说，交易的顺序是不能确定的。

在未来，我们计划切换到这样一种模式，即账户可以选择他们是否希望有顺序的nonce排序（与EOA相同）或者他们希望有任意的排序。

:::

每个区块链的重要不变因素之一是每个交易都有一个唯一的哈希值。用一个任意的账户抽象持有这个属性并不容易。
尽管一般来说，账户可以接受多个相同的交易。即使这些交易根据区块链的规则在技术上是有效的，违反
散列唯一性对于索引器和其他工具来说是很难处理的。

在协议层面上需要有一个解决方案，对用户来说既便宜又稳健，以防止恶意操作者的出现。确保交易哈希值不重复的最简单的方法之一是让一对（发送者，非ce）总是唯一的。

以下是使用的协议。

- 在每个交易开始之前，系统会查询[NonceHolder](.../developer-guides/system-contracts.md#nonceholder)以检查所提供的nonce是否已经被使用。
- 如果nonce还没有被使用，就会运行交易验证。在这段时间内，所提供的nonce有望被标记为 "已使用"。
- 验证后，系统检查该nonce是否被标记为已使用。

用户将被允许使用任何256位数字作为nonce，他们可以将任何非零值放在系统合同中的相应密钥下。这已经被协议所支持，但在服务器上不支持。
协议已经支持，但在服务器端不支持。

一旦服务器端的支持发布，将会有更多关于与 "NonceHolder "系统合约的各种交互的文档以及教程。目前来说。
建议只使用 "incrementNonceIfEquals "方法，它实际上是强制执行nonces的顺序排序。

### 交易哈希值的标准化

在未来，我们计划在zkSync上支持高效的交易包含证明。这需要我们在[bootloader]（.../developer-guides/system-contracts.md#bootloader）中计算交易的哈希值。由于这些计算对用户来说不是免费的，所以把交易的哈希值包含在AA
方法的接口中（以防账户因某种原因需要这个值）。这就是为什么 "IAccount "和 "IPaymaster "接口的所有方法，将在下面介绍。
包含交易的哈希值以及推荐的签名摘要（由EOA为该交易签名的摘要）。

### IAccount接口

建议每个账户都实现[IAccount](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IAccount.sol)接口。它包含以下五个方法。

- `validateTransaction`是强制性的，将被系统用来确定AA逻辑是否同意继续进行交易。如果交易不被接受（例如，签名是错误的），该方法应该被退回。如果对该方法的调用成功，则实现的账户逻辑被认为接受该交易，系统将继续进行交易流程。
- `executeTransaction`是强制性的，在向用户收取费用后，系统将调用该函数。这个函数应该执行交易的执行。
- `payForTransaction`是可选的，如果交易没有付款人，即账户愿意为交易付款，系统将调用该函数。这个方法应该被用来支付账户的费用。注意，如果你的账户永远不会支付任何费用，而总是依赖[paymaster](#paymasters)功能，你就不必实现这个方法。这个方法必须至少发送`tx.gasprice * tx.gasLimit`ETH到[bootloader](./system-contracts.md#bootloader)地址。
- `prePaymaster`是可选的，如果交易有付款人，即有一个不同的地址为用户支付交易费用，则系统会调用该方法。这个方法应该被用来准备与付款人的互动。其中一个值得注意的[例子](#approval-based-paymaster-flow)，它可以帮助批准支付人的ERC-20代币。
- 从技术上讲，"executeTransactionFromOutside "不是强制性的，但它是_高度鼓励的，因为需要有一些方法，在优先模式的情况下（例如，如果运营商没有响应），能够从你的账户 "外部 "启动交易（基本上这是标准的以太坊方法的后备措施，其中EOA从你的智能合约启动交易）。

### IPaymaster接口

与EIP4337一样，我们的账户抽象协议支持付款人：可以为其他账户的交易执行提供补偿的账户。你可以阅读更多关于他们的信息
[这里](#paymasters)。

每个paymaster应该实现[IPaymaster](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IPaymaster.sol)接口。它包含以下两个方法。

- `validateAndPayForPaymasterTransaction`是强制性的，将被系统用来确定付款人是否同意为这个交易付款。如果付款人愿意为该交易付款，该方法必须至少向操作员发送`tx.gasprice * tx.gasLimit'。它应该返回`context`，这将是`postOp`方法的调用参数之一。
- `postOp`是可选的，将在交易执行后被调用。注意，与EIP4337不同，不能保证这个方法会被调用。特别是，如果交易失败，出现 "out of gas "错误，这个方法就不会被调用。它需要四个参数：由 "validateAndPayForPaymasterTransaction "方法返回的上下文，交易本身，交易的执行是否成功，以及支付者可能被退回的最大气体量。一旦zkSync增加了对退款的支持，就会有更多关于退款的文档。

### `交易`结构的保留字段具有特殊意义

请注意，上面的每个方法都接受[Transaction](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/TransactionHelper.sol#L15)结构。
虽然它的一些字段是不言自明的，但也有6个 "保留 "字段，每个字段的含义是由交易的类型决定的。我们决定不给这些字段命名，因为它们在未来的一些交易类型中可能是不需要的。现在，我们的惯例是。

- `reserved[0]`是nonce。
- `reserved[1]`是`msg.value`，应与交易一起传递。

### 交易流程

每个交易都要经过以下流程。

#### 验证步骤

在验证步骤中，账户应该决定它是否接受该交易，如果接受，则支付该交易的费用。如果验证的任何部分失败，该账户将不被收取费用，并且该交易不能被纳入一个区块中。

**步骤1.**系统检查该交易的nonce是否以前被使用过。你可以阅读更多关于保持nonce唯一性的信息[这里](#keeping-nonces-unique)。

**步骤2.** 系统调用账户的 "validateTransaction "方法。如果它没有恢复，则进入下一步。

**步骤3.** 系统检查交易的nonce是否已被标记为使用。

**第4步（nopayments）。**系统调用账户的`payForTransaction`方法。如果它没有恢复，则进入下一步。

**第4步（付款人）。**系统调用发送者的`prePaymaster`方法。如果这个调用没有恢复，则调用付款人的`validateAndPayForPaymasterTransaction`方法。如果它也没有恢复，则继续进行下一个步骤。

**步骤5.**系统验证bootloader是否已经收到至少`tx.gasPrice * tx.gasLimit`的ETH给bootloader。如果是这样的话，验证被认为是
完成，我们可以进入下一步。

#### 执行步骤

执行步骤被认为是负责交易的实际执行，并将任何未使用的气体的退款送回给用户。如果在这个步骤中出现任何逆转，该交易仍被认为是有效的，并将被纳入区块中。

**步骤6.**系统调用账户的`执行交易`方法。

**第7步。(仅在交易有一个付款人的情况下)**付款人的`postOp`方法被调用。这一步通常应该用于退还发送者未使用的气体，如果paymaster被用来促进以ERC-20代币支付费用。

### 费用

在EIP4337中，你可以看到三种类型的气体限制："验证气体"、"执行气体"、"预验证气体"，它们描述了一个区块中包含的交易的不同步骤的气体限制。
zkSync Era只有一个字段，`gasLimit'，涵盖了所有三个的费用。当提交交易时，确保`gasLimit`足够支付验证。
支付费用（上面提到的ERC20转账），以及实际执行本身。

默认情况下，调用`estimateGas`会增加一个常量来支付收费和EOA账户的签名验证。

## 使用`SystemContractsCaller`库

为了安全起见，"NonceHolder "和 "ContractDeployer "系统合约都只能用一个特殊的 "isSystem "标志来调用。你可以在这里阅读更多关于它的信息（./system-contracts.md#protected-access to-some-of-the-system-contracts）。要用这个标志进行调用，应该使用[SystemContractsCaller](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/SystemContractsCaller.sol)库的`systemCall`/`systemCallWithPropagatedRevert`/`systemCallWithReturndata`方法。

在开发自定义账户时，使用这个库实际上是必须的，因为这是调用`NonceHolder`系统合约的非视图方法的唯一方法。另外，如果你想让用户部署自己的合约，你就必须使用这个库。你可以使用EOA账户的[实现](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol)作为参考。

##扩展EIP4337

为了给运营商提供DoS保护，EIP4337对账户的验证步骤施加了一些[限制](https://eips.ethereum.org/EIPS/eip-4337#simulation)。
其中大部分，特别是那些关于被禁止的操作码，仍然是相关的。然而，为了提高用户体验，有几个限制被取消了。

### 扩展允许的操作码

- 允许`call`/`delegateCall`/`staticcall`已经部署好的合约。与Ethereum不同的是，我们没有办法编辑已部署的代码或通过自毁删除合同，因此我们可以确保合同执行期间的代码将是相同的。

### 扩展属于一个用户的槽的集合

在最初的EIP中，AA的`validateTransaction`步骤只允许账户读取属于自己的存储槽。然而，有些槽位_表面上是属于该用户的，但实际上位于另一个合同的地址上。一个值得注意的例子是`ERC20`余额。

这种限制提供了DDoS的安全性，确保不同账户用于验证的槽_不会重叠，所以没有必要让它们_实际上_属于账户的存储。

为了能够在验证步骤中读取用户的ERC20余额或津贴，在验证步骤中，地址为`A`的账户将允许以下类型的槽。

1. 属于地址`A`的槽位。
2. 属于任何其他地址的槽位`A`。
3. 3. 任何其他地址上的 "keccak256(A || X) "类型的槽。(以涵盖`mapping(address => value)`，这通常用于ERC20代币的平衡)。

### 未来可能会允许什么？

在未来，我们甚至可以允许有时间限制的交易，例如，允许检查`block.timestamp <= value`，如果它返回`false`，等等。这将需要部署一个单独的可信方法库，但这将大大增加账户的功能。

## 建立自定义账户

正如上面已经提到的，每个账户都应该实现[IAccount](#iaccount-interface)接口。

实现AA接口的一个例子是EOA账户的[实现](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L17)。
请注意，这个账户，就像以太坊上的标准EOA账户一样，只要被外部地址调用，就会成功返回空值，而这可能不是你的账户所希望的行为。

### EIP1271

如果你正在建立一个智能钱包，我们也_高度鼓励_你实施[EIP1271](https://eips.ethereum.org/EIPS/eip-1271)签名验证方案。
这是由zkSync团队认可的标准。它被用于本节下面描述的签名验证库中。

### 部署过程

部署账户逻辑的过程与部署智能合约的过程非常相似。
为了保护那些不想被当作账户的智能合约，应该使用部署者系统合约的不同方法来做。
你不应该使用`create`/`create2`，而应该使用部署者系统合约的`createAccount`/`create2Account`方法。

下面是一个如何使用`zksync-web3`SDK来部署账户逻辑的例子。


```ts
import { ContractFactory } from "zksync-web3";

const contractFactory = new ContractFactory(abi, bytecode, initiator, "createAccount");
const aa = await contractFactory.deploy(...args);
await aa.deployed();
```

### 验证步骤的局限性

::: warning 尚未实施

验证规则现在还没有完全执行。即使你的自定义账户现在可以使用，但如果不遵守以下规则，将来也可能停止使用。

:::

为了保护系统免受DoS威胁，验证步骤必须有以下限制。

- 账户逻辑只能触及属于该账户的槽。注意，[定义](#extending-the-set-of-slots-that-belong-to-a-user)远远超出了属于用户地址的槽位。
- 账户逻辑不能使用上下文变量（如`block.number`）。
- 还要求你的账户将nonce增加1。这个限制只是为了保持交易哈希的抗碰撞性。在未来，这一要求将被取消，以允许更多的通用情况（如隐私协议）。

违反上述规则的交易将不被API接受，尽管这些要求不能在电路/VM层面上强制执行，也不适用于L1->L2交易。

为了让你更快地尝试这个功能，我们决定在完全实现账户验证步骤的限制'检查之前公开发布账户的抽象性。
目前，尽管违反了上述要求，你的交易仍然可以通过API，但很快这一点就会被改变。

### Nonce holder contract

为了优化，[tx nonce和部署nonce](./building-on-zksync/contracts/contract-deployment.md#differences-in-create-behaviour)都放在[NonceHolder](./system-contracts.md#nonceholder)系统合同中的一个存储槽中。
为了增加账户的nonce，强烈建议调用[incrementNonceIfEquals](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L12)函数并传递交易中提供的nonce的值。

这是白名单调用之一，账户逻辑被允许调用外部智能合约。

###从一个账户发送交易

目前，只支持EIP712交易。要从一个特定的账户提交交易，你应该提供交易的`from`字段作为发送者的地址，并在`customData`的`customSignature`字段中提供该账户的签名。


```ts
import { utils } from "zksync-web3";

// here the `tx` is a `TransactionRequest` object from `zksync-web3` SDK.
// and the zksyncProvider is the `Provider` object from `zksync-web3` SDK connected to zkSync network.
tx.from = aaAddress;
tx.customData = {
  ...tx.customData,
  customSignature: aaSignature,
};
const serializedTx = utils.serialize({ ...tx });

const sentTx = await zksyncProvider.sendTransaction(serializedTx);
```

## Paymasters

想象一下，能够为你的协议的用户支付费用! 付费者是可以为其他账户的交易提供补偿的账户。另一个重要的使用情况
Paymasters的另一个重要用途是促进以ERC20代币支付费用。虽然ETH是zkSync的正式费用代币，但paymasters可以提供将ERC20代币实时兑换成ETH的能力。

如果用户想与付款人互动，他们应该在其EIP712交易中提供非零的`付款人`地址。付款人的输入数据在付款人的`paymasterInput`字段中提供。

### 付款人验证规则

警告 尚未实施

验证规则现在还没有完全执行。即使你的paymaster现在可以工作，但如果它不遵循以下规则，将来也可能停止工作。

:::

由于应允许多个用户访问同一个支付系统，恶意的支付系统_可以对我们的系统进行DoS攻击。为了解决这个问题，将使用一个类似于[EIP4337信誉评分](https://eips.ethereum.org/EIPS/eip-4337#reputation-scoring-and-throttlingbanning-for-paymasters)的系统。

与原来的EIP不同的是，允许付费者接触任何存储槽。另外，如果以下任何一种情况，支付者不会被扼杀。

- 在API节点上通过验证后，已经超过`X`分钟（`X`的确切值将在后面定义）。
- 被读取的槽的顺序与在API节点上运行时相同，并且第一个值发生变化的槽是用户的槽之一。这是为了保护paymaster不受恶意用户的影响（例如，用户可能已经删除了ERC20令牌的津贴）。

### 内置支付宝流量

虽然有些paymaster可以在没有用户任何互动的情况下进行琐碎的操作（例如，一个总是为他们的用户支付费用的协议），但有些需要交易的发送者的积极参与。一个值得注意的例子是一个将用户的ERC20代币换成ETH的支付方，因为它需要用户向支付方设置必要的津贴。

账户抽象协议本身是通用的，允许账户和付款人实现任意的互动。然而，默认账户（EOAs）的代码是恒定的，但我们仍然希望他们能够参与到自定义账户和支付者的生态系统中。这就是为什么我们对交易的 "paymasterInput "字段进行了标准化，以涵盖paymaster功能的最常见的用途。

你的账户可以自由实施或不实施对这些流量的支持。然而，我们强烈建议你这样做，以保持EOA和自定义账户的接口相同。

#### 一般付款人流程

如果用户不需要事先进行操作，就可以使用该流程。

`paymasterInput`字段必须被编码为对一个具有以下接口的函数的调用。

```solidity
function general(bytes calldata data);
```

EOA账户将不做任何事情，付款人可以以任何方式解释这个`数据'。

#### 基于批准的薪资管理流程

如果用户被要求对一个令牌设置某些津贴，以便支付主管进行操作，则应使用该流程。`paymasterInput`字段必须被编码为对一个函数的调用，签名如下。

```solidity
function approvalBased(
    address _token,
    uint256 _minAllowance,
    bytes calldata _innerInput
)
```

EOA将确保`_token'对paymaster的允许值至少被设置为`_minAllowance'。`_innerInput`参数是一个额外的有效载荷，可以被发送到paymaster来实现任何逻辑（例如，一个额外的签名或密钥，可以被paymaster验证）。

如果你正在开发一个paymaster，你_不应该_相信交易发送者的行为是诚实的（例如，用`approvalBased`流程提供所需的津贴）。这些流程主要是作为对EOA的指示，要求应该总是由付款人进行双重检查。

#### 使用 "zksync-web3 "SDK来处理付款人流程。

`zksync-web3`SDK提供了[方法](././api/js/utils.md#encoding-paymaster-params)，用于为所有内置的paymaster流程正确编码格式化的paymaster参数。

### 测试网支付系统

为了确保用户在testnet上体验到paymasters，以及继续支持以ERC20代币支付费用，Matter Labs团队提供了testnet paymaster，它能够以ERC20代币与ETH的1:1汇率支付费用（即该代币的一个单位等于ETH的1wei）。

该支付系统只支持[基于批准](#approval-based-paymaster-flow)的支付系统流程，并要求`token`参数等于被交换的代币，`minAllowance`至少等于`tx.maxFeePerGas * tx.gasLimit`。此外，testnet paymaster不使用`_innerInput`参数，所以不应提供任何东西（空的`bytes`）。

在[quickstart](../building-on-zksync/hello-world.md#paying-fees-using-testnet-paymaster)教程中可以看到如何使用testnet paymaster的例子。

## `aa-signature-checker`。

你的项目可以开始为本地AA支持做准备了。我们非常鼓励你这样做，因为这将使你能够接纳成千上万的用户（例如，已经使用第一版zkSync的阿根廷用户）。
我们预计，在未来，甚至更多的用户将转向智能钱包。

将要建立的各种类型的账户之间最明显的区别之一是不同的签名方案。我们期望账户支持[EIP-1271](https://eips.ethereum.org/EIPS/eip-1271)标准。我们的团队已经创建了一个用于验证账户签名的实用程序库。目前，它只支持ECDSA签名，但我们很快也会增加对EIP-1271的支持。

`aa-signature-checker`库提供了一种验证不同账户实现的签名的方法。目前它只支持验证ECDSA的签名。很快，我们也将增加对EIP-1271的支持。

我们强烈建议你在需要检查一个账户的签名是否正确时使用这个库。

### 将该库添加到你的项目中。


```
yarn add @matterlabs/signature-checker
```

### 使用该库的例子

```solidity
pragma solidity ^0.8.0;

import { SignatureChecker } from "@matterlabs/signature-checker/contracts/SignatureChecker.sol";

contract TestSignatureChecker {
    using SignatureChecker for address;

    function isValidSignature(
        address _address,
        bytes32 _hash,
        bytes memory _signature
    ) public pure returns (bool) {
        return _address.checkSignature(_hash, _signature);
    }
}
```

## 在我们的SDK中验证AA签名

也**不建议**使用`ethers.js`库来验证用户的签名。

我们的SDK在其`utils`中提供了两种方法来验证账户的签名。


```ts
export async function isMessageSignatureCorrect(address: string, message: ethers.Bytes | string, signature: SignatureLike): Promise<boolean>;

export async function isTypedDataSignatureCorrect(
  address: string,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>,
  signature: SignatureLike
): Promise<boolean>;
```

目前这些方法只支持验证ECDSA签名，但很快它们也将支持EIP1271签名验证。

这两个方法都返回 "true "或 "false"，取决于消息签名是否正确。
