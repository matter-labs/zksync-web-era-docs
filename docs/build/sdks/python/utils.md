---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Utilities | zkSync Docs
---

# Utilities

The utilities library contains essential utilities for building on zkSync Era.

:::info

- This document describes common functions and constants you may need.
- Functions used internally are not necessarily described.
- Check the code for the full list.
  :::

## Manage contracts utils

```python
from zksync2.manage_contracts.utils import *
```

### Functions

#### zkSync Era main contract

```python
def zksync_abi_default():
```

#### IERC20

For interacting with native tokens.

```python
def get_erc20_abi():
```

#### Contract deployer

Used for deploying smart contracts.

```python
def icontract_deployer_abi_default():
```

#### L1 and L2 bridges

Bridge interface ABIs for L1 and L2.

```python
def l1_bridge_abi_default():
```

```python
def l2_bridge_abi_default():
```

#### NonceHolder

Used for managing deployment nonce.

```python
def nonce_holder_abi_default():
```

## Core utils

### Constants

#### L1 to L2 alias offset

Used for applying and undoing aliases on addresses during bridging from L1 to L2.

```python
L1_TO_L2_ALIAS_OFFSET = "0x1111000000000000000000000000000000001111"
```

### Useful addresses

#### ETH token layer 1

```python
ADDRESS_DEFAULT = "0x0000000000000000000000000000000000000000"
```

#### ETH token alias on ZkSync Era

```python
L2_ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800a"
```

#### Bootloader

```python
BOOTLOADER_FORMAL_ADDRESS = "0x0000000000000000000000000000000000008001"
```

## ZkSyncAddresses

```python
from zksync2.manage_contracts.deploy_addresses import ZkSyncAddresses
```

#### Contract deployer

```python
CONTRACT_DEPLOYER_ADDRESS.value = "0x0000000000000000000000000000000000008006"
```

#### L1 messenger

```python
MESSENGER_ADDRESS = "0x0000000000000000000000000000000000008008"
```

#### Nonce holder

```python
NONCE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000008003"
```

## EIP712Meta

```python
from zksync2.module.request_types import EIP712Meta
```

### Gas

#### `GAS_PER_PUB_DATA_DEFAULT`

- Use a large amount of gas per pubdata for signing on layer 2.
- The amount ensures any reasonable limit is accepted.

:::info

- The operator is NOT required to use the actual value and can use any value up to that signed by the user.
  :::

```python
GAS_PER_PUB_DATA_DEFAULT = 50000
```

#### `DEPOSIT_GAS_PER_PUBDATA_LIMIT`

The current required gas per pubdata for L1->L2 transactions.

```python
DEPOSIT_GAS_PER_PUBDATA_LIMIT = 800;
```

## Functions

### `applyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

Returns the `msg.sender` of the L1->L2 transaction as the `address` of the contract that initiated the transaction.

:::tip More info

1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `applyL1ToL2Alias(A)`.
   :::

#### Inputs

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `address` | string | Contract address. |

```python
def apply_l1_to_l2_alias(address: HexStr):
```

#### Example

```python
l1ContractAddress = "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb"
l2ContractAddress = applyL1ToL2Alias(l1ContractAddress)
# l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC"
```

See also [`undol1tol2alias`](#undol1tol2alias).

### `get_custom_bridge_data`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter        | Type       | Description     |
| ---------------- | ---------- | --------------- |
| `token_contract` | `Contract` | Token contract. |

```python
def get_custom_bridge_data(token_contract) -> bytes:
```

### `is_eth`

Returns true if token represents ETH on L1 or L2.

#### Inputs

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `token`   | `HexStr` | The token address. |

```python
def is_eth(address: HexStr) -> bool:
```

#### Example

```ts
is_l1_eth = is_eth(ADDRESS_DEFAULT); // true
is_l2_eth = is_eth(L2_ETH_TOKEN_ADDRESS); // true
```

### `undoL1ToL2Alias`

Converts and returns the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

#### Inputs

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `address` | string | Sender address. |

```python
def undo_l1_to_l2_alias(address: HexStr):
```

#### Example

```python
l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC"
l1ContractAddress = undo_l1_to_l2_alias(l2ContractAddress)
# const l1ContractAddress = "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb"
```

See also [`applyl1tol2alias`](#applyl1tol2alias).
