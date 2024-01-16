---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Paymaster Utilities | zkSync Era Docs
---

# Paymaster utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync-ethers/blob/ethers-v5/src/paymaster-utils.ts) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow` Deprecated

::: warning Deprecated

- This method is deprecated in favor of [utils.PAYMASTER_FLOW_ABI](./utils.md#paymasterflow).
  :::

Constant ABI definition for the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l2-contracts/contracts/interfaces/IPaymasterFlow.sol).

```typescript
export const IPaymasterFlow = new ethers.utils.Interface(require("../../abi/IPaymasterFlow.json").abi);
```

## Functions

### `getApprovalBasedPaymasterInput`

Returns encoded input for an approval-based paymaster.

#### Inputs

| Parameter        | Type                                 | Description                      |
| ---------------- | ------------------------------------ | -------------------------------- |
| `paymasterInput` | `ApprovalBasedPaymasterInput` object | The input data to the paymaster. |

```ts
export function getApprovalBasedPaymasterInput(paymasterInput: ApprovalBasedPaymasterInput): BytesLike {
  return IPaymasterFlow.encodeFunctionData("approvalBased", [paymasterInput.token, paymasterInput.minimalAllowance, paymasterInput.innerInput]);
}
```

### `getGeneralPaymasterInput`

As above but for general-based paymaster.

#### Inputs

| Parameter        | Type                           | Description                      |
| ---------------- | ------------------------------ | -------------------------------- |
| `paymasterInput` | `GeneralPaymasterInput` object | The input data to the paymaster. |

```ts
export function getGeneralPaymasterInput(paymasterInput: GeneralPaymasterInput): BytesLike {
  return IPaymasterFlow.encodeFunctionData("general", [paymasterInput.innerInput]);
}
```

### `getPaymasterParams`

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../reference/concepts/account-abstraction.md#built-in-paymaster-flows).

#### Inputs

| Parameter          | Type                    | Description                       |
| ------------------ | ----------------------- | --------------------------------- |
| `paymasterAddress` | `Address` string        | The non-zero `paymaster` address. |
| `paymasterInput`   | `PaymasterInput` object | The input data to the paymaster.  |

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams;
```

Find out more about the [`PaymasterInput` type](./types.md).
