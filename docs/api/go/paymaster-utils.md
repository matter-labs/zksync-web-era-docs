---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Paymaster utilities | zkSync Era Docs
---

# Paymaster utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-go/blob/main/utils/paymaster.go) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/36fe0fd11aeb2cfe88139e7e09d59a25366668d6/zksync/contracts/interfaces/IPaymasterFlow.sol).

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

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../reference/concepts/account-abstraction.md#built-in-paymaster-flows).

#### Inputs

| Parameter          | Type             | Description                       |
| ------------------ | ---------------- | --------------------------------- |
| `paymasterAddress` | `Address`        | The non-zero `paymaster` address. |
| `paymasterInput`   | `PaymasterInput` | The input data to the paymaster.  |

```go
func GetPaymasterParams(paymasterAddress common.Address, paymasterInput types.PaymasterInput) (*types.PaymasterParams, error)
```

Find out more about the [`PaymasterInput` type](types/types.md).
Check out the [example](examples/custom-paymaster/use-paymaster.md) how to use paymaster.
