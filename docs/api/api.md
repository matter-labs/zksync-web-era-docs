# Web3 API

zkSync Era完全支持标准的[Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)，并增加了一些L2特有的功能。

只要代码不涉及部署新的智能合约（它们只能使用EIP712交易部署，[下文]（#eip712）），_就不需要改变代码库。

可以继续使用目前正在使用的SDK。用户将继续以ETH支付费用，并且用户体验将与以太坊上的用户体验相同。

然而，zkSync Era有其特殊性，本节介绍。

## EIP712

为了指定额外的字段，如自定义账户的自定义签名或选择支付方，应使用EIP712交易。这些交易具有与标准Ethereum交易相同的字段，但它们也有包含额外的L2特定数据的字段（`paymaster'，等等）。

```json
"gasPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factoryDeps": ["0x..."]
```

- gasPerPubdata": 是一个字段，描述用户愿意为一个字节的pubdata支付的最大气体量。
- `customSignature`是一个带有自定义签名的字段，以防签名者的账户不是EOA。
- `paymasterParams`是一个包含参数的字段，用于配置交易的自定义付款人。支付系统的地址和调用它的编码输入在支付系统参数中。
- `factory_deps`是一个字段，应该是一个非空的`字节'数组。对于部署交易，它应该包含被部署合约的字节码。如果被部署的合约是一个工厂合约，即它可以部署其他合约，该数组还应该包含可以被它部署的合约的字节码。

为了让服务器识别EIP712交易，`transaction_type`字段等于`113`（不幸的是，数字`712`不能被用作`transaction_type`，因为类型必须是一个字节长）。

用户不签署RLP编码的交易，而是签署以下类型的EIP712结构。

| Field name             | Type        |
| ---------------------- | ----------- |
| txType                 | `uint256`   |
| from                   | `uint256`   |
| to                     | `uint256`   |
| gasLimit               | `uint256`   |
| gasPerPubdataByteLimit | `uint256`   |
| maxFeePerGas           | `uint256 `  |
| maxPriorityFeePerGas   | `uint256`   |
| paymaster              | `uint256`   |
| nonce                  | `uint256`   |
| value                  | `uint256`   |
| data                   | `bytes`     |
| factoryDeps            | `bytes32[]` |
| paymasterInput         | `bytes`     |

这些字段由我们的[SDK](./js/features.md)方便地处理。

## zkSync特定的JSON-RPC方法

所有zkSync特定的方法都位于`zks_`命名空间中。API也可以提供这里提供的方法之外的其他方法。这些方法将由团队内部使用，并且非常不稳定。

::: warning

请注意，Metamask不支持zks\_命名空间的方法，我们正在努力在未来支持它，另外，你可以使用testnet RPC的`Provider`类，而不是依赖Metamask的注入提供者。

:::

<!-- ### `zks_estimateFee`。

返回交易的费用。计算费用的令牌是根据提供的交易中的`fee_token'返回的。

#### Input parameters

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| req       | `CallRequest` | The zkSync transaction for which the fee should be estimated |

#### Output format

```json
{
  "gas_limit": 100000000,
  "max_fee_per_gas": 10000,
  "max_priority_fee_per_gas": 100,
  "gas_per_pubdata_limit": 10
}
``` -->

### `zks_getMainContract`

返回zkSync Era合约的地址。

### Input parameters

None.

### Output format

`"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"`

### `zks_L1ChainId`

返回底层L1的链ID。

### Input parameters

None.

### Output format

`12`

### `zks_getConfirmedTokens`

给定`from`和`limit`，返回ID在`[from...from+limit-1]`区间内的确认令牌的信息。"确认 "在这里是个错误的词，因为确认的令牌已经通过默认的zkSync Era桥接了。

代币是按照符号的字母顺序返回的，所以一个代币的id只是它在一个按照符号排序的代币数组中的位置。

### Input parameters

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| from      | `uint32` | The token id from which to start returning the information about the tokens. |
| limit     | `uint8`  | The number of tokens to be returned from the API.                            |

### Output format

```json
[
  {
    "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "decimals": 18,
    "name": "ETH",
    "symbol": "ETH"
  },
  {
    "address": "0xd2255612f9b045e9c81244bb874abb413ca139a3",
    "decimals": 18,
    "name": "TrueUSD",
    "symbol": "TUSD"
  },
  {
    "address": "0xd35cceead182dcee0f148ebac9447da2c4d449c4",
    "decimals": 6,
    "name": "USD Coin (goerli)",
    "symbol": "USDC"
  }
]
```

### `zks_getL2ToL1LogProof`

给定一个交易哈希值，以及在该交易中产生的L2到L1日志的索引，它返回相应的L2到L1日志的证明。

可以从交易收据中获得的日志索引（它包括交易产生的每个日志的列表）。

### Input parameters

| Parameter          | Type                        | Description                                                      |
| ------------------ | --------------------------- | ---------------------------------------------------------------- |
| tx_hash            | `bytes32`                   | Hash of the L2 transaction the L2 to L1 log was produced within. |
| l2_to_l1_log_index | `undefined` &#124; `number` | The Index of the L2 to L1 log in the transaction.                |

### Output format

如果没有这样的消息，返回值为`null`。

否则，将返回以下格式的对象。

```json
{
  "id": 0,
  "proof": [
    "0x66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925",
    "0x2eeb74a6177f588d80c0c752b99556902ddf9682d0b906f5aa2adbaf8466a4e9",
    "0x1223349a40d2ee10bd1bebb5889ef8018c8bc13359ed94b387810af96c6e4268",
    "0x5b82b695a7ac2668e188b75f7d4fa79faa504117d1fdfcbe8a46915c1a8a5191"
  ],
  "root": "0x6a420705824f0a3a7e541994bc15e14e6a8991cd4e4b2d35c66f6e7647760d97"
}
```

`id`是该区块在L2->L1消息的Merkle树中的叶子的位置。`proof`是该信息的Merkle证明，而`root`是L2->L1信息的Merkle树的根。请注意，Merkle树使用_sha256_的树。

你不需要关心本征，因为返回的`id`和`proof`可以立即用于与zkSync Era智能合约的交互。

通过我们的SDK使用这个端点的一个很好的例子可以找到[这里]（.../dev/developer-guides/bridging/l2-l1.md）。

::: tip

事务产生的L2到L1的日志列表，包含在收据中，是由L1Messenger合约或其他系统合约/bootloader产生的日志的组合。

有一个由bootloader为每个L1起源的交易产生的日志，显示交易是否成功。

:::

### `zks_getL2ToL1MsgProof`

给定一个区块、一个发件人、一个消息和一个包含L1->L2消息的区块中的可选消息日志索引，它返回通过L1Messenger系统合同发送的消息的证明。

### Input parameters

| Parameter       | Type                    | Description                                                                                                                                                                                                                                            |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| block           | `uint32`                | The number of the block where the message was emitted.                                                                                                                                                                                                 |
| sender          | `address`               | The sender of the message (i.e. the account that called the L1Messenger system contract).                                                                                                                                                              |
| msg             | `bytes32`               | The keccak256 hash of the sent message.                                                                                                                                                                                                                |
| l2_log_position | `uint256` &#124; `null` | The index in the block of the event that was emitted by the [L1Messenger](../dev/developer-guides/system-contracts.md#l1messenger) when submitting this message. If it is omitted, the proof for the first message with such content will be returned. |

### Output format

与[zks_getL2ToL1LogProof](#zks-getl2tol1logproof)中相同。

::: warning

`zks_getL2ToL1MsgProof`端点将被废弃，因为L2到L1消息的证明也可以从`zks_getL2ToL1LogProof`获取。

:::

### `zks_getBridgeContracts`

返回默认网桥的L1/L2地址。

### Input parameters

None.

### Output format

```json
{
  "l1Erc20DefaultBridge": "0x7786255495348c08f82c09c82352019fade3bf29",
  "l1EthDefaultBridge": "0xcbebcd41ceabbc85da9bb67527f58d69ad4dfff5",
  "l2Erc20DefaultBridge": "0x92131f10c54f9b251a5deaf3c05815f7659bbe02",
  "l2EthDefaultBridge": "0x2c5d8a991f399089f728f1ae40bd0b11acd0fb62"
}
```

### `zks_getTestnetPaymaster`

返回[testnet paymaster](.../dev/developer-guides/aa.md#testnet-paymaster)的地址：在testnets上可用的paymaster，可以用ERC-20兼容代币支付费用。

### Input parameters

None.

### Output format

```json
"0x7786255495348c08f82c09c82352019fade3bf29"
```

### `zks_getBlockDetails`

返回关于L2块的其他ZkSync特定信息。

### Input parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| block     | `uint32` | The number of the block. |

### Output format

```json
{
  "commitTxHash": "0x2c8f18312c6b6c2e72df56dd5684e3c65fcdf5f6141763eafdcbbfc02c3a39b5",
  "committedAt": "2022-12-12T08:41:50.774441Z",
  "executeTxHash": "0xa12f3a9689101758acad280dd21a00cfc2644c125702ea301f46a33799cde9b9",
  "executedAt": "2022-12-12T08:41:57.233941Z",
  "l1TxCount": 5,
  "l2TxCount": 0,
  "number": 1,
  "proveTxHash": "0x0fed6d8a7b02a26b5513edea10d8849342b56a13c0e48317556c78b34aeacd26",
  "provenAt": "2022-12-12T08:41:57.219584Z",
  "rootHash": "0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f",
  "status": "verified",
  "timestamp": 1670834504
}
```

<!-- TODO: uncomment once fixed --->

<!-- ### `zks_getTokenPrice`

给定一个代币地址，返回它的价格（美元）。请注意，这是zkSync团队使用的价格，可能与当前的市场价格有一些不同。在测试网络上，代币价格可能与实际市场价格有很大差异。

### Input parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| address   | `address` | The address of the token. |

### Output format

`3500.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000` -->

<!--

#[rpc(name = "zks_getConfirmedTokens", returns = "Vec<Token>")]
fn get_confirmed_tokens(&self, from: u32, limit: u8) -> BoxFutureResult<Vec<Token>>;

#[rpc(name = "zks_isTokenLiquid", returns = "bool")]
fn is_token_liquid(&self, token_address: Address) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getTokenPrice", returns = "BigDecimal")]
fn get_token_price(&self, token_address: Address) -> BoxFutureResult<BigDecimal>;

#[rpc(name = "zks_setContractDebugInfo", returns = "bool")]
fn set_contract_debug_info(
    &self,
    contract_address: Address,
    info: ContractSourceDebugInfo,
) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getContractDebugInfo", returns = "ContractSourceDebugInfo")]
fn get_contract_debug_info(
    &self,
    contract_address: Address,
) -> BoxFutureResult<Option<ContractSourceDebugInfo>>;

#[rpc(name = "zks_getTransactionTrace", returns = "Option<VmDebugTrace>")]
fn get_transaction_trace(&self, hash: H256) -> BoxFutureResult<Option<VmDebugTrace>>;





Documented:
#[rpc(name = "zks_estimateFee", returns = "Fee")]
fn estimate_fee(&self, req: CallRequest) -> BoxFutureResult<Fee>;

#[rpc(name = "zks_getMainContract", returns = "Address")]
fn get_main_contract(&self) -> BoxFutureResult<Address>;

#[rpc(name = "zks_L1ChainId", returns = "U64")]
fn l1_chain_id(&self) -> Result<U64>;

#[rpc(name = "zks_getL1WithdrawalTx", returns = "Option<H256>")]
fn get_eth_withdrawal_tx(&self, withdrawal_hash: H256) -> BoxFutureResult<Option<H256>>;



不想记录（至少现在是这样）:

### `zks_getAccountTransactions`

### Input parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| address   | `Address` | The address of the account                            |
| before    | `u32`     | The offset from which to start returning transactions |
| limit     | `u8`      | The maximum number of transactions to be returned     |





-->

## PubSub API

zkSync与[Geth的pubsub API](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub)完全兼容，除了`同步`的订阅。这是因为zkSync网络上的节点在技术上总是同步的。

WebSocket URL是`wss://zksync2-testnet.zksync.dev/ws`。

::: tip

你可以使用websocket端点来处理智能合约事件，如[本节文档](.../dev/building-on-zksync/events.md)所详述。

:::合约
