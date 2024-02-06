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

```python
def __init__(self, web3: "Web3"):
    super(ZkSync, self).__init__(web3)
    self.main_contract_address = None
    self.bridge_addresses = None
```

#### Example

```python
from zksync2.module.module_builder import ZkSyncBuilder

zksync = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")
```

### `estimate_fee`

Returns an estimated [`Fee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type                                    | Description          |
| ------------- | --------------------------------------- | -------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction request. |

```python
nonce = self.web3.zksync.get_transaction_count(self.account.address, ZkBlockParams.COMMITTED.value)
        gas_price = self.web3.zksync.gas_price

        func_call = TxFunctionCall(chain_id=self.chain_id,
                                   nonce=nonce,
                                   from_=self.account.address,
                                   to=self.account.address,
                                   gas_limit=0,
                                   gas_price=gas_price)
        estimated_fee = self.web3.zksync.zks_estimate_fee(func_call.tx)
```

### `eth_estimate_gas`

Returns an estimate(`int`) of the amount of gas required to submit a transaction to the network.
| Parameter | Type | Description |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction request. |
[web3.py implementation.](https://web3py.readthedocs.io/en/stable/web3.eth.html#web3.eth.Eth.estimate_gas)

### `zks_estimate_gas_l1_to_l2`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `int` object.

Calls the [`zks_estimateL1ToL2`](../../api.md#zks-estimategasl1tol2) JSON-RPC method.

### `estimateGasTransfer`

Returns the gas estimation for a transfer transaction.

Calls internal method [`getTransferTx`](https://github.com/zksync-sdk/zksync-ethers/blob/ethers-v5/src/utils.ts) to get the transfer transaction and sends it to the [`eth_estimate_gas`](#eth-estimate-gas) method.

#### Inputs

| Parameter     | Type                                    | Description               |
| ------------- | --------------------------------------- | ------------------------- |
| `transaction` | [`Transaction`](./types.md#transaction) | Transaction.              |
| `token`       | Address string                          | Token address (optional). |

```python
def zks_estimate_gas_transfer(self, transaction: Transaction, token_address: HexStr = ADDRESS_DEFAULT) -> int:

    if token_address is not None and not is_eth(token_address):
        transfer_params = (transaction["to"], transaction["value"])
        transaction["value"] = 0
        contract = self.contract(Web3.to_checksum_address(token_address), abi=get_erc20_abi())
        transaction["data"] = contract.encodeABI("transfer", args=transfer_params)
        transaction["nonce"] = self.get_transaction_count(transaction["from_"], ZkBlockParams.COMMITTED.value)

        return self.eth_estimate_gas(transaction)
```

### `estimateL1ToL2Execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter     | Type                                    |
| ------------- | --------------------------------------- |
| `Transaction` | [`Transaction`](./types.md#transaction) |

```python
def zks_estimate_l1_to_l2_execute(self, transaction: Transaction) -> int:
    if transaction["from"] is None:
        transaction["from"] = self.account.create().address

    return self.zks_estimate_gas_l1_to_l2(transaction)
```

### `zks_get_all_account_balances`

Returns all balances for confirmed tokens given by an account address.

Calls the [`zks_getAllAccountBalances`](../../api.md#zks-getallaccountbalances) JSON-RPC method.

### `zks_get_balance`

Returns the user's balance as a `int` object for an (optional) block tag and (optional) token.

When block and token are not supplied, `committed` and `ETH` are the default values.

#### Inputs

| Name          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| address       | User's address.                                                            |
| block_tag     | Block tag for getting the balance on. Latest `committed` block is default. |
| token_address | The address of the token. ETH is default.                                  |

```python
    def zks_get_balance(self, address: HexStr, block_tag = ZkBlockParams.COMMITTED.value, token_address: HexStr = None) -> int:
        if token_address is None or is_eth(token_address):
            return self.get_balance(to_checksum_address(address), block_tag)

        try:
            token = self.contract(Web3.to_checksum_address(token_address), abi=get_erc20_abi())
            return token.functions.balanceOf(address).call()
        except:
            return 0
```

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

### `get_block`

Returns block from the network.Throws `BlockNotFound` error if the block is not found

[web3.py implementation.](https://web3py.readthedocs.io/en/stable/web3.eth.html#web3.eth.Eth.get_block)

### `zks_get_block_details`

Returns additional zkSync-specific information about the L2 block.

Calls the [`zks_getBlockDetails`](../../api.md#zks-getblockdetails) JSON-RPC method.

### `getContractAccountInfo`

Returns the version of the supported account abstraction and nonce ordering from a given contract address.

#### Inputs

| Name    | Description      |
| ------- | ---------------- |
| address | Contract address |

```python
def get_contract_account_info(self, address: HexStr) -> ContractAccountInfo:
    deployer = self.contract(address=Web3.to_checksum_address(ZkSyncAddresses.CONTRACT_DEPLOYER_ADDRESS.value), abi=icontract_deployer_abi_default())

    data = deployer.functions.getAccountInfo(Web3.to_checksum_address(address)).call()

    return ContractAccountInfo(account_abstraction_version=data[0],account_nonce_ordering=data[1])
```

### `zks_get_bridge_contracts`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

```python
def zks_get_bridge_contracts(self) -> BridgeAddresses:
    if self.bridge_addresses is None:
        self.bridge_addresses = self._zks_get_bridge_contracts()
    return self.bridge_addresses
```

### `getL1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

Calls the [`zks_getL1BatchBlockRange`](../../api.md#zks-getl1batchblockrange) JSON-RPC method.

```python
def zks_get_l1_batch_block_range(self, l1_batch_number: int) -> BlockRange:
    return self._zks_get_l1_batch_block_range(l1_batch_number)
```

### `zks_get_l1_batch_details`

Returns data pertaining to a given batch.

Calls the [`zks_getL1BatchDetails`](../../api.md#zks-getl1batchdetails) JSON-RPC method.

### `zks_l1_batch_number`

Returns the latest L1 batch number.

Calls the [`zks_getL1BatchNumber`](../../api.md#zks-l1batchnumber) JSON-RPC method.

### `getL2TransactionFromPriorityOp`

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

### `zks_main_contract`

Returns the main zkSync Era smart contract address.

Calls the [`zks_getMainContract`](../../api.md#zks-getmaincontract) JSON-RPC method.

```python
def zks_main_contract(self) -> HexStr:
    if self.main_contract_address is None:
        self.main_contract_address = self._zks_main_contract()
    return self.main_contract_address
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

```python
def zks_get_testnet_paymaster_address(self) -> HexStr:
    return Web3.to_checksum_address(self._zks_get_testnet_paymaster_address())
```

### `zks_get_transaction_details`

Returns data from a specific transaction given by the transaction hash.

Calls the [`getTransactionDetails`](../../api.md#zks-gettransactiondetails) JSON-RPC method.

### `eth_get_transaction_receipt`

Returns the transaction receipt from a given hash number.

### `zks_l1_chain_id`

Returns the chain id of the underlying L1.

Calls the [`zks_L1ChainId`](../../api.md#zks-l1chainid) JSON-RPC method.

### `l1TokenAddress`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L2. |

```python
def l1_token_address(self, token: HexStr) -> HexStr:
    if is_eth(token):
        return ADDRESS_DEFAULT
    bridge_address = self.zks_get_bridge_contracts()
    l2_weth_bridge = self.contract(Web3.to_checksum_address(bridge_address.weth_bridge_l2),
                                   abi=l2_bridge_abi_default())
    try:
        l1_weth_token = l2_weth_bridge.functions.l1TokenAddress(token).call()
        if not is_eth(l1_weth_token):
            return l1_weth_token
        except:
            pass

    erc20_bridge = self.contract(Web3.to_checksum_address(bridge_address.erc20_l2_default_bridge),
                                     abi=l2_bridge_abi_default())

    return erc20_bridge.functions.l1TokenAddress(token).call()
```

### `l2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L1. |

```python
def l2_token_address(self, token: HexStr) -> HexStr:
    if is_eth(token):
        return ADDRESS_DEFAULT
    bridge_address = self.zks_get_bridge_contracts()
    l2_weth_bridge = self.contract(Web3.to_checksum_address(bridge_address.weth_bridge_l2),
                                   abi=l2_bridge_abi_default())
    try:
        l1_weth_token = l2_weth_bridge.functions.l2TokenAddress(token).call()
        if not is_eth(l1_weth_token):
            return l1_weth_token
    except:
        pass

    erc20_bridge = self.contract(Web3.to_checksum_address(bridge_address.erc20_l2_default_bridge),
    abi=l2_bridge_abi_default())

    return erc20_bridge.functions.l2TokenAddress(token).call()
```
