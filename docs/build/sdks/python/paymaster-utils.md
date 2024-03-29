---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Paymaster Utilities | zkSync Docs
---

# Paymaster Utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-python/blob/master/zksync2/manage_contracts/paymaster_utils.py) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `PaymasterFlowEncoder`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l2-contracts/contracts/interfaces/IPaymasterFlow.sol).

```python
encoder = PaymasterFlowEncoder(zk_web3)
```

## Functions

### `encodeApprovalBased`

Returns encoded input for an approval-based paymaster.

#### Inputs

| Parameter       | Type     | Description                                              |
| --------------- | -------- | -------------------------------------------------------- |
| `address`       | `HexStr` | The token address of the paymaster.                      |
| `min_allowance` | `int`    | The minimal amount of token that can be used to pay fee. |
| `inner_input`   | `bytes`  | The input data to the paymaster.                         |

```python
paymaster_params = PaymasterParams(**{
    "paymaster": paymaster_address,
    "paymaster_input": zk_web3.to_bytes(
        hexstr=PaymasterFlowEncoder(zk_web3).encode_approval_based(token_address, 1, b''))
})
```

### `encode_general`

As above but for general-based paymaster.

#### Inputs

| Parameter | Type    | Description                      |
| --------- | ------- | -------------------------------- |
| `inputs`  | `bytes` | The input data to the paymaster. |

```python
paymaster_params = PaymasterParams(**{
    "paymaster": paymaster_address,
    "paymaster_input": zk_web3.to_bytes(
        hexstr=PaymasterFlowEncoder(zk_web3).encode_general( b''))
})
```

Find out more about the [`PaymasterParams` type](./types.md).
Check out the [example](https://github.com/zksync-sdk/zksync2-examples/blob/main/python/15_use_paymaster.py) how to use paymaster.
