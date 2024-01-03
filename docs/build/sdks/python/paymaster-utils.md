---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Paymaster Utilities | zkSync Docs
---

# Paymaster utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-go/blob/main/utils/paymaster.go) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `PaymasterFlowEncoder`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/36fe0fd11aeb2cfe88139e7e09d59a25366668d6/zksync/contracts/interfaces/IPaymasterFlow.sol).

```python
encoder = PaymasterFlowEncoder(zk_web3)
```

## Functions

### `encode_approval_based`

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
Check out the [example](getting-started.md#use-paymaster) how to use paymaster.
