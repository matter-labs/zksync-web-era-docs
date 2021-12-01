# Web3 API

zkSync 2.0 fully supports standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API).

As long as your code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes for the codebase needed!_

You can continue using the SDKs which you already use now. Users will continue paying fees in ETH and the UX will identical to the one on Ethereum.

However, zkSync has its own specifics which this section is all about.

## EIP712

To specify additional fields like the token for fee payment or provide the bytecode for new smart contracts, EIP712 transactions should be used. These transactions have the same fields as standard Ethereum transactions as well as two additional ones:

- `eip712_meta` of type `Eip712Meta`, which contains additional L2-specific fields (`fee_token`, etc).
- `transaction_type` should be equal to `712`.

`Eip712Meta` type has the following fields:

```json
{
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
}
```

- `fee` field is an object that describes the token in which the fee is to be paid and also the limit on the number of price in `ergs` per storage slot write and publishing a single pubdata byte.
- `time_range` field is an object that denotes the timeframe within which the tx is valid. _Most likely will be removed after the testnet._
- `withdraw_token` field should be only supplied for `Withdraw` operations. _Most likely will be removed after the testnet._
- `factory_deps` field is an array that should only be supplied for `Deploy` transactions. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecode of the contracts which can be deployed by it.

<!-- TODO: add example -->

## zkSync-specific JSON-RPC methodss

All zkSync-specific methods are located in the `zks_` namespace. The API may also provide methods other than those provided here. These methods are to be used internally by the team and are very unstable.

### `zks_estimateFee`

Returns the fee for the transaction. The token in which the fee is calculated is returned based on the `fee_token` in the transaction provided.

#### Input parameters

| Parameter | Type          | Description                                         |
| --------- | ------------- | --------------------------------------------------- |
| req       | `CallRequest` | zkSync transaction to which the estimate the fee of |

#### Output format

```json
{
  "ergs_limit": 100000000,
  "ergs_price_limit": 10000,
  "fee_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "ergs_per_storage_limit": 100,
  "ergs_per_pubdata_limit": 10
}
```

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

Given the L2 hash of the withdrawal tx, returns the L1 hash of the transaction where it was executed on L1 or `null` if the withdrawal has not been executed yet.

### Input parameters

| Parameter       | Type   | Description               |
| --------------- | ------ | ------------------------- |
| withdrawal_hash | `H256` | L2 hash of the withdrawal |

### Output format

`"0x092ea839f428fba0b8ff23525d4930026e97502f07076ecfd653a1f144ca53d0"`

### `zks_getAccountTransactions`

### Input parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| address   | `Address` | The address of the account                            |
| before    | `u32`     | The offset from which to start returning transactions |
| limit     | `u8`      | The maximum number of transactions to be returned     |

### Output format

TODO

<!--
#[rpc(name = "zks_estimateFee", returns = "Fee")]
fn estimate_fee(&self, req: CallRequest) -> BoxFutureResult<Fee>;

#[rpc(name = "zks_getMainContract", returns = "Address")]
fn get_main_contract(&self) -> BoxFutureResult<Address>;

#[rpc(name = "zks_L1ChainId", returns = "U64")]
fn l1_chain_id(&self) -> Result<U64>;

#[rpc(name = "zks_getL1WithdrawalTx", returns = "Option<H256>")]
fn get_eth_withdrawal_tx(&self, withdrawal_hash: H256) -> BoxFutureResult<Option<H256>>;

#[rpc(name = "zks_getAccountTransactions", returns = "Vec<Transaction>")]
fn get_account_transactions(
    &self,
    address: Address,
    before: u32,
    limit: u8,
) -> BoxFutureResult<Vec<Transaction>>;

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

-->
