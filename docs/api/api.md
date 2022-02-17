# Web3 API

zkSync 2.0 fully supports standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API).

As long as the code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes for the codebase are needed._

It is possible to continue using the SDK that is currently in use. Users will continue paying fees in ETH, and the UX will be identical to the one on Ethereum.

However, zkSync has its own specifics, which this section describes.

## EIP712

To specify additional fields, like the token for fee payment or provide the bytecode for new smart contracts, EIP712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but also they have fields which contain additional L2-specific data (`fee_token`, etc):

```json
"fee": {
  "fee_token": "0x0000...0000",
  "ergs_per_storage_limit": 100000,
  "ergs_per_pubdata_limit": 1000
},
"time_range": {
  "from": 0,
  "until": 10101010
},
"withdraw_token": "0x00000...00000",
"factory_deps": ["0x..."]
```

- `fee` is a field that describes the token in which the fee is to be paid, and defines the limits on the price in `ergs` per storage slot write and per publishing a single pubdata byte.
- `time_range` is a field that denotes the timeframe, within which the transaction is valid. _Most likely will be removed after the testnet._
- `withdraw_token` is a parameter that should be only supplied for `Withdraw` operations. _Most likely will be removed after the testnet._
- `factory_deps` is a field that should be a non-empty array of `bytes` only for `Deploy` transactions. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which can be deployed by it.

To let the server recognize EIP712 transactions, the `transaction_type` field is equal to `112` (unfortunately the number `712` can not be used as the `transaction_type` since the type has to be one byte long).

Instead of signing the RLP-encoded transaction, the user signs the following typed EIP712 structure:

| Field name     | Type      |
| -------------- | --------- |
| to             | `address` |
| nonce          | `uint256` |
| value          | `uint256` |
| data           | `bytes`   |
| gasPrice       | `uint256` |
| gasLimit       | `uint256` |
| ergsPerStorage | `uint256` |
| ergsPerPubdata | `uint256` |
| feeToken       | `address` |
| withdrawToken  | `address` |
| validFrom      | `uint64`  |
| validUntil     | `uint64`  |

These fields are conveniently handled by our [SDK](./js/features).

## zkSync-specific JSON-RPC methods

All zkSync-specific methods are located in the `zks_` namespace. The API may also provide methods other than those provided here. These methods are to be used internally by the team and are very unstable.

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

### `zks_getL1WithdrawalTx`

Given the hash of the withdrawal transaction on layer 2, returns the hash of the layer 1 transaction that executed the withdrawal or `null` if the withdrawal has not been executed yet.

### Input parameters

| Parameter       | Type      | Description                             |
| --------------- | --------- | --------------------------------------- |
| withdrawal_hash | `bytes32` | The hash of the withdrawal transaction. |

### Output format

`"0xd8a8165ada7ec780364368bf28e473d439e41c4c95164c23368d368cc3730ea7"`

### `zks_getConfirmedTokens`

Given `from` and `limit`, returns the information about the confirmed tokens with ids in the interval `[from..from+limit-1]`. Confirmed tokens are native tokens that are considered legit by the zkSync team. This method will be mostly used by the zkSync team internally.

The tokens are returned in alphabetical order by their symbol, so basically, the token id is its position in an alphabetically sorted array of tokens.

### Input parameters

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| from      | `uint32` | The token id from which to start returning the information about the tokens. |
| limit     | `uint8`  | The number of tokens to be returned from the API.                            |

### Output format

```
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
    "name": "TrueUSD (rinkeby)",
    "symbol": "TUSD"
  },
  {
    "address": "0xeb8f08a975ab53e34d8a0330e0d34de942c95926",
    "decimals": 6,
    "name": "USD Coin (rinkeby)",
    "symbol": "USDC"
  }
]
```

### `zks_isTokenLiquid`

Given a token address, returns whether it can be used to pay fees.

### Input parameters

| Parameter | Type      | Description               |
| --------- | --------- | ------------------------- |
| address   | `address` | The address of the token. |

### Output format

`true`

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

zkSync is fully compatible with [Geth's pubsub API](https://geth.ethereum.org/docs/rpc/pubsub).
