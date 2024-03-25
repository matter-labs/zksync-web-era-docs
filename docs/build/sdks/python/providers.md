---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Providers | zkSync Docs
---

# Providers

A Web3 Provider object provides application-layer access to underlying blockchain networks.

The [`zksync2`](https://pypi.org/project/zksync2/) library supports provider methods from the [`web3.py`](https://web3py.readthedocs.io/en/stable/providers.html) library and supplies additional functionality.

## `Provider`

:::info

- This doc details zkSync Era specific methods.
- `web3.py` implementations link to the [web3.py Providers documentation](https://web3py.readthedocs.io/en/stable/providers.html).
  :::

### `init`

Returns a zkSync Era `Provider` object.

#### Inputs

| Parameter | Type                                                                                                                   | Description                |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `web3`    | string or [`ConnectionInfo`](https://web3py.readthedocs.io/en/stable/providers.html#provider-via-environment-variable) | Network RPC URL (optional) |

#### Example

```python
from zksync2.module.module_builder import ZkSyncBuilder

zksync = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")
```

### `zks_estimate_fee`

Returns an estimated [`Fee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type                                    | Description          |
| ------------- | --------------------------------------- | -------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction request. |

#### Example

```python
func_call = TxFunctionCall(
            chain_id=chain_id,
            nonce=nonce,
            from_=account.address,
            to=saccount.address,
            gas_limit=0,
            gas_price=gas_price,
        )
estimated_fee = web3.zksync.zks_estimate_fee(func_call.tx)
```

### `eth_estimate_gas`

Returns an estimate(`int`) of the amount of gas required to submit a transaction to the network.
| Parameter | Type | Description |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction request. |
[web3.py implementation.](https://web3py.readthedocs.io/en/stable/web3.eth.html#web3.eth.Eth.estimate_gas)

#### Example

```python
func_call = TxFunctionCall(
            chain_id=chain_id,
            nonce=nonce,
            from_=account.address,
            to=saccount.address,
            gas_limit=0,
            gas_price=gas_price,
        )
estimated_fee = web3.zksync.eth_estimate_gas(func_call.tx)
```

### `zks_estimate_gas_l1_to_l2`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `int` object.

Calls the [`zks_estimateL1ToL2`](../../api.md#zks-estimategasl1tol2) JSON-RPC method.

#### Example

```python
func_call = TxFunctionCall(
            chain_id=chain_id,
            nonce=nonce,
            from_=account.address,
            to=saccount.address,
            value=7_000_000_000
        )
estimated_fee = web3.zksync.zks_estimate_gas_l1_to_l2(func_call.tx)
```

### `zks_estimate_gas_transfer`

Returns the gas estimation for a transfer transaction.

Calls internal method [`getTransferTx`](https://github.com/zksync-sdk/zksync-ethers/blob/ethers-v5/src/utils.ts) to get the transfer transaction and sends it to the [`eth_estimate_gas`](#eth-estimate-gas) method.

#### Inputs

| Parameter     | Type                                    | Description               |
| ------------- | --------------------------------------- | ------------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction.              |
| `token`       | Address string                          | Token address (optional). |

#### Example

```python
func_call = TxFunctionCall(
            chain_id=chain_id,
            nonce=nonce,
            from_=account.address,
            to=saccount.address,
            value=7_000_000_000
        )
estimated_fee = web3.zksync.zks_estimate_gas_transfer(func_call.tx)
```

### `zks_estimate_l1_to_l2_execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter     | Type                                    |
| ------------- | --------------------------------------- |
| `Transaction` | [`Transaction`](./types.md#transaction) |

#### Example

```python
func_call = TxFunctionCall(
            chain_id=chain_id,
            nonce=nonce,
            from_=account.address,
            to=saccount.address,
            value=7_000_000_000
        )
estimated_fee = web3.zksync.zks_estimate_l1_to_l2_execute(func_call.tx)
```

### `zks_get_all_account_balances`

Returns all balances for confirmed tokens given by an account address.

Calls the [`zks_getAllAccountBalances`](../../api.md#zks-getallaccountbalances) JSON-RPC method.

```python
all_balances = web3.zksync.zks_get_all_account_balances(address)
```

### `zks_get_balance`

Returns the user's balance as a `int` object for an (optional) block tag and (optional) token.

When block and token are not supplied, `committed` and `ETH` are the default values.

#### Inputs

| Name          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| address       | User's address.                                                            |
| block_tag     | Block tag for getting the balance on. Latest `committed` block is default. |
| token_address | The address of the token. ETH is default.                                  |

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

#Find the USDC ADDRESS in https://zksync2-testnet.zkscan.io/address/0x0faF6df7054946141266420b43783387A78d82A9/transactions
USDC_L2_ADDRESS = "<USDC_L2_ADDRESS>"
# Get the USDC balance from your account using your address. Get your address from https://zksync2-testnet.zkscan.io/txs
usdc_balance = zksync_web3.zksync.zks_get_balance("<YOUR_ADDRESS>", "latest", USDC_L2_ADDRESS)

// Getting ETH balance
eth_balance = zksync_web3.zksync.zks_get_balance("<YOUR_ADDRESS>")
```

### `zks_get_block_details`

Returns [`BlockDetails`](types.md#blockdetails) additional zkSync-specific information about the L2 block.

Calls the [`zks_getBlockDetails`](../../api.md#zks-getblockdetails) JSON-RPC method.

| Name  | Description   |
| ----- | ------------- |
| block | Block number. |

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

block_details = zksync_web3.zksync.zks_get_block_details(block_number)
```

### `getContractAccountInfo`

Returns [`ContractAccountInfo`](types.md#accountabstractionversion) class with version of the supported account abstraction and nonce ordering from a given contract address.

#### Inputs

| Name    | Description      |
| ------- | ---------------- |
| address | Contract address |

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

block_details = zksync_web3.zksync.zks_get_block_details(contract_address)
```

### `zks_get_bridge_contracts`

Returns [`BridgeAddresses`](types.md#bridgeaddresses) class containing addresses of the default zkSync Era bridge contracts on both L1 and L2.

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

addresses = zksync_web3.zksync.zks_get_bridge_contracts()
```

### `zks_get_l1_batch_block_range`

Returns the range of blocks contained within a batch given by batch number.

Calls the [`zks_getL1BatchBlockRange`](../../api.md#zks-getl1batchblockrange) JSON-RPC method.

#### Inputs

| Name            | Description |
| --------------- | ----------- |
| l1_batch_number |             |

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_batch_number = zksync_web3.zksync.zks_l1_batch_number()
block_range = zksync_web3.zksync.zks_get_l1_batch_block_range(l1_batch_number)
```

### `zks_get_l1_batch_details`

Returns data pertaining to a given batch.

Calls the [`zks_getL1BatchDetails`](../../api.md#zks-getl1batchdetails) JSON-RPC method.

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_batch_number = zksync_web3.zksync.zks_l1_batch_number()
batch_details = zksync_web3.zksync.zks_get_l1_batch_details(l1_batch_number)
```

### `zks_l1_batch_number`

Returns the latest L1 batch number.

Calls the [`zks_getL1BatchNumber`](../../api.md#zks-l1batchnumber) JSON-RPC method.

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_batch_number = zksync_web3.zksync.zks_l1_batch_number()
```

### `get_l2_transaction_from_priority_op`

Returns a transaction object from a given Ethers [`TransactionResponse`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse) object.

#### Inputs

| Name          | Description          |
| ------------- | -------------------- |
| tx_receipt    | Transaction receipt. |
| main_contract | ZkSync main contract |

```python
def get_l2_transaction_from_priority_op(self, tx_receipt, main_contract: Contract):
    l2_hash = self.get_l2_hash_from_priority_op(tx_receipt, main_contract)
    self.wait_for_transaction_receipt(l2_hash)
    return self.get_transaction(l2_hash)
```

### `zks_get_log_proof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

Calls the [`zks_getL2ToL1LogProof`](../../api.md#zks-getl2tol1logproof) JSON-RPC method.

#### Inputs

| Name    | Description                |
| ------- | -------------------------- |
| tx_hash | Transaction hash.          |
| index   | Log index. Default is None |

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

proof: ZksMessageProof = zksync_web3.zksync.zks_get_log_proof(hex_hash)
```

### `zks_main_contract`

Returns the main zkSync Era smart contract address.

Calls the [`zks_getMainContract`](../../api.md#zks-getmaincontract) JSON-RPC method.

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

main_contract_address = zksync.zksync.zks_main_contract()
```

### `zks_get_l2_to_l1_msg_proof`

Returns the proof for a message sent via the L1Messenger system contract.

Calls the [`zks_getL2ToL1MsgProof`](../../api.md#zks-getl2tol1msgproof) JSON-RPC method.

```python
def zks_get_l2_to_l1_msg_proof(self,
                               block: int,
                               sender: HexStr,
                               message: str,
                               l2log_pos: Optional[int]) -> ZksMessageProof:
    return self._zks_get_l2_to_l1_msg_proof(block, sender, message, l2log_pos)
```

### `zks_get_testnet_paymaster_address`

Returns the [testnet paymaster](../../quick-start/useful-address.md#sepolia-contract-addresses) address if available, or null.

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

paymaster_address = zksync.zksync.zks_get_testnet_paymaster_address()
```

### `zks_get_transaction_details`

Returns data from a specific transaction given by the transaction hash.

Calls the [`getTransactionDetails`](../../api.md#zks-gettransactiondetails) JSON-RPC method.

#### Inputs

| Name    | Description       |
| ------- | ----------------- |
| tx_hash | Transaction hash. |

#### Example

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

paymaster_address = zksync.zksync.zks_get_transaction_details()
```

### `eth_get_transaction_receipt`

Returns the transaction receipt from a given hash number.

#### Inputs

| Name    | Description       |
| ------- | ----------------- |
| tx_hash | Transaction hash. |

#### Examples

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

transaction_receipt = zksync_web3.zksync.eth_get_transaction_receipt(tx_hash)
```

### `zks_l1_chain_id`

Returns the chain id of the underlying L1.

Calls the [`zks_L1ChainId`](../../api.md#zks-l1chainid) JSON-RPC method.

#### Examples

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_chain_id = zksync_web3.web3.zksync.zks_l1_chain_id()
```

### `l1_token_address`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L2. |

#### Examples

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_chain_id = zksync_web3.web3.zksync.l1_token_address(ADDRESS_DEFAULT)
```

### `l2_token_address`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L1. |

#### Examples

```python
zksync_web3 = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")

l1_chain_id = zksync_web3.web3.zksync.l2_token_address(ADDRESS_DEFAULT)
```
