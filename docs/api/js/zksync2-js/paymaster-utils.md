---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Paymaster Utilities | zkSync Era Docs
---

# Paymaster utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-js/blob/main/src/paymaster-utils.ts) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/36fe0fd11aeb2cfe88139e7e09d59a25366668d6/zksync/contracts/interfaces/IPaymasterFlow.sol).

```typescript
export const IPaymasterFlow = new ethers.utils.Interface(require("../abi/IPaymasterFlow.json").abi);
```

## Functions

### `getApprovalBasedPaymasterInput`

Returns encoded input for an approval-based paymaster.

#### Inputs

| Parameter        | Type                                                                    | Description                      |
| ---------------- | ----------------------------------------------------------------------- | -------------------------------- |
| `paymasterInput` | [`ApprovalBasedPaymasterInput`](./types.md#approvalbasedpaymasterinput) | The input data to the paymaster. |

```ts
export function getApprovalBasedPaymasterInput(paymasterInput: ApprovalBasedPaymasterInput): BytesLike;
```

### `getGeneralPaymasterInput`

As above but for general-based paymaster.

#### Inputs

| Parameter        | Type                                                        | Description                      |
| ---------------- | ----------------------------------------------------------- | -------------------------------- |
| `paymasterInput` | [`GeneralPaymasterInput`](./types.md#generalpaymasterinput) | The input data to the paymaster. |

```ts
export function getGeneralPaymasterInput(paymasterInput: GeneralPaymasterInput): BytesLike;
```

### `getPaymasterParams`

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../../reference/concepts/account-abstraction.md#built-in-paymaster-flows).

#### Inputs

| Parameter          | Type                                          | Description                       |
| ------------------ | --------------------------------------------- | --------------------------------- |
| `paymasterAddress` | `Address`                                     | The non-zero `paymaster` address. |
| `paymasterInput`   | [`PaymasterInput`](./types.md#paymasterinput) | The input data to the paymaster.  |

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams;
```

Find out more about the [`PaymasterInput` type](./types.md).
