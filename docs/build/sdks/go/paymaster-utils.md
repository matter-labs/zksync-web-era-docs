---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Paymaster Utilities | zkSync Docs
---

# Paymaster Utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-go/blob/main/utils/paymaster.go) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l2-contracts/contracts/interfaces/IPaymasterFlow.sol).

```go
IPaymasterFlow := abi.JSON(strings.NewReader(paymasterflow.IPaymasterFlowMetaData.ABI));
```

## Functions

### `GetApprovalBasedPaymasterInput`

Returns encoded input for an approval-based paymaster.

#### Inputs

| Parameter        | Type                          | Description                      |
| ---------------- | ----------------------------- | -------------------------------- |
| `paymasterInput` | `ApprovalBasedPaymasterInput` | The input data to the paymaster. |

```go
func GetApprovalBasedPaymasterInput(paymasterInput types.ApprovalBasedPaymasterInput) ([]byte, error) {
	return paymasterFlowAbi.Pack("approvalBased",
		paymasterInput.Token,
		paymasterInput.MinimalAllowance,
		paymasterInput.InnerInput)
}
```

### `GetGeneralPaymasterInput`

Returns encoded input for a general-based paymaster.

#### Inputs

| Parameter        | Type                    | Description                      |
| ---------------- | ----------------------- | -------------------------------- |
| `paymasterInput` | `GeneralPaymasterInput` | The input data to the paymaster. |

```go
func GetGeneralPaymasterInput(paymasterInput types.GeneralPaymasterInput) ([]byte, error) {
	return paymasterFlowAbi.Pack("general", paymasterInput)
}
```

### `GetPaymasterParams`

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../developer-reference/account-abstraction.md#built-in-paymaster-flows).

#### Inputs

| Parameter          | Type             | Description                       |
| ------------------ | ---------------- | --------------------------------- |
| `paymasterAddress` | `Address`        | The non-zero `paymaster` address. |
| `paymasterInput`   | `PaymasterInput` | The input data to the paymaster.  |

```go
func GetPaymasterParams(paymasterAddress common.Address, paymasterInput types.PaymasterInput) (*types.PaymasterParams, error)
```

Find out more about the [`PaymasterInput` type](types/types.md).
Check out the [example](https://github.com/zksync-sdk/zksync2-examples/blob/main/go/19_use_paymaster.go) how to use paymaster.
