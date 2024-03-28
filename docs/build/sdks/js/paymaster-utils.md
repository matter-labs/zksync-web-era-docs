---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Paymaster Utilities | zkSync Docs
---

# Paymaster Utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync-ethers/blob/main/src/paymaster-utils.ts) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/583cb674a2b942dda34e9f46edb5a9f5b696b90a/l2-contracts/contracts/interfaces/IPaymasterFlow.sol).

```ts
export const PAYMASTER_FLOW_ABI = new ethers.Interface(require("../abi/IPaymasterFlow.json"));
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

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../developer-reference/account-abstraction.md#built-in-paymaster-flows).

#### Inputs

| Parameter          | Type                                          | Description                       |
| ------------------ | --------------------------------------------- | --------------------------------- |
| `paymasterAddress` | `Address`                                     | The non-zero `paymaster` address. |
| `paymasterInput`   | [`PaymasterInput`](./types.md#paymasterinput) | The input data to the paymaster.  |

```ts
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams;
```

Find out more about the [`PaymasterInput` type](./types.md).

#### Examples

Creating `General` paymaster parameters.

```ts
const paymasterAddress = "0x0a67078A35745947A37A552174aFe724D8180c25";
const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
  type: "General",
  innerInput: new Uint8Array(),
});
```

Creating `ApprovalBased` paymaster parameters.

```ts
const result = utils.getPaymasterParams("0x0a67078A35745947A37A552174aFe724D8180c25", {
  type: "ApprovalBased",
  token: "0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964",
  minimalAllowance: BigInt(1),
  innerInput: new Uint8Array(),
});
```
