# Web3 API

zkSync 2.0 fully supports standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API).

As long as the code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes to the codebase are needed._

It is possible to continue using the SDK that is currently in use. Users will continue paying fees in ETH, and the UX will be identical to the one on Ethereum.

However, zkSync has its own specifics, which this section describes.

## EIP712

To specify additional fields, like the custom signature for custom accounts or to choose the paymaster, EIP712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but they also have fields that contain additional L2-specific data (`paymaster`, etc):

```json
"ergsPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factory_deps": ["0x..."]
```

- `ergsPerPubdata` is a field that describes the maximal amount of ergs the user is willing to pay for a single byte of pubdata.
- `customSignature` is a field with a custom signature, in case the signer's account is not EOA.
- `paymasterParams` is a field with parameters for configuring the custom paymaster for the transaction. The paymaster parameters contain the address of the paymaster and the encoded input to invoke it.
- `factory_deps` is a field that should be a non-empty array of `bytes` for deployment transactions. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which can be deployed by it.

To let the server recognize EIP712 transactions, the `transaction_type` field is equal to `113` (unfortunately the number `712` can not be used as the `transaction_type` since the type has to be one byte long).

Instead of signing the RLP-encoded transaction, the user signs the following typed EIP712 structure:

| Field name              | Type      |
| ----------------------- | --------- |
| txType                  | `uint256`   |
| from                  | `uint256`   |
| to                  | `uint256`   |
| ergsLimit                  | `uint256`   |
| ergsPerPubdataByteLimit                  | `uint256`   |
| maxFeePerErg                      | `uint256 ` |
| maxPriorityFeePerErg                   | `uint256` |
| paymaster                    | `uint256`   |
| nonce                | `uint256` |
| value               | `uint256` |
| data                | `bytes` |
| factoryDeps | `bytes32[]` |
| paymasterInput               | `bytes` |

These fields are conveniently handled by our [SDK](./js/features.md).

## zkSync-specific JSON-RPC methods

All zkSync-specific methods are located in the `zks_` namespace. The API may also provide methods other than those provided here. These methods are to be used internally by the team and are very unstable. 

::: warning

Please note that, Metamask does not support zks_ namespace's methods, we are working to support it in the future, alternatively you can use `Provider` class with the testnet RPC instead of relying on the Metamask's injected provider.

:::

<!-- ### `zks_estimateFee`

Returns the fee for the transaction. The token in which the fee is calculated is returned based on the `fee_token` in the transaction provided.

#### Input parameters

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| req       | `CallRequest` | The zkSync transaction for which the fee should be estimated |

#### Output format

```json
{
  "ergs_limit": 100000000,
  "ergs_price_limit": 10000,
  "fee_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "ergs_per_storage_limit": 100,
  "ergs_per_pubdata_limit": 10
}
``` -->

### `zks_getMainContract`

Returns the address of the zkSync contract.

### Input parameters

None.

### Output format

`"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"`

### `zks_L1ChainId`

Returns the chain id of the underlying L1.

### Input parameters

None.

### Output format

`12`

### `zks_getConfirmedTokens`

Given `from` and `limit` returns information about the confirmed tokens with IDs in the interval `[from..from+limit-1]`. "Confirmed" is a misnomer here, since a confirmed token is one that has been bridged through the default zkSync bridge.

The tokens are returned in alphabetical order by their symbol, so basically, the token id is its position in an alphabetically sorted array of tokens.

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

### `zks_getL2ToL1MsgProof`

Given a block, a sender, a message and an optional message log index in the block containing the L1->L2 message, returns the proof for the message sent via the L1Messenger system contract.

### Input parameters

| Parameter | Type      | Description                                                                               |
| --------- | --------- | ----------------------------------------------------------------------------------------- |
| block     | `uint32`  | The number of the block where the message was emitted.                                    |
| sender    | `address` | The sender of the message (i.e. the account that called the L1Messenger system contract). |
| msg       | `uint256` | The keccak256 hash of the message that was sent.                                          |
| l2_log_position       | `uint256 | null` | The index in the block of the event that was emitted by the [L1Messenger](../dev/zksync-v2/system-contracts.md#il1messenger) when submitting this message. If it is ommitted, the proof for the first message with such content will be returned.                                          |

### Output format

If there was no such message, the returned value is `null`.

Otherwise, the object of the following format is returned:

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

The `id` is the position of the leaf in the Merkle tree of L2->L1 messages for the block. The `proof` is the merkle proof for the message, while the `root ` is the root of the merkle tree of L2->L1 messages. Please note, that the merkle tree uses _sha256_ for the trees.

You do not need to care about the intrinsics, since the returned `id` and `proof` can be used rightaway for interacting with zkSync smart contract.

A nice example of using this endpoint via our SDK can be found [here](../dev/guide/l2-l1.md).

### `zks_getBridgeContracts`

Returns L1/L2 addresses of default bridges.

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

Returns the address of the [testnet paymaster](../dev/zksync-v2/aa.md#testnet-paymaster): the paymaster that is available on testnets and enables paying fees in ERC-20 compatible tokens. 

### Input parameters

None.

### Output format

```json
"0x7786255495348c08f82c09c82352019fade3bf29"
```


<!-- TODO: uncomment once fixed --->
<!-- ### `zks_getTokenPrice`

Given a token address, returns its price in USD. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

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



Don't want to document (at least for now):

### `zks_getAccountTransactions`

### Input parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| address   | `Address` | The address of the account                            |
| before    | `u32`     | The offset from which to start returning transactions |
| limit     | `u8`      | The maximum number of transactions to be returned     |





-->

## PubSub API

zkSync is fully compatible with [Geth's pubsub API](https://geth.ethereum.org/docs/rpc/pubsub), except for `syncing` subscription, as it doesn't have meaning for the zkSync network since technically our nodes are always synced.

The WebSocket URL is `wss://zksync2-testnet.zksync.dev/ws`.
