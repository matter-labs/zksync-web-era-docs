---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Paymaster Utilities | zkSync Docs
---

# Paymaster Utilities

The [paymaster utilities library](https://github.com/zksync-sdk/zksync2-swift/blob/main/Sources/ZkSync2/Utils/Paymaster.swift) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow`

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/f06a58360a2b8e7129f64413998767ac169d1efd/zksync/contracts/interfaces/IPaymasterFlow.sol).

### `getPaymasterParams`

Returns a correctly-formed `paymasterParams` object for common paymaster flows.

#### Inputs

| Parameter          | Type             | Description                       |
| ------------------ | ---------------- | --------------------------------- |
| `paymasterAddress` | `Address`        | The non-zero `paymaster` address. |
| `paymasterInput`   | `PaymasterInput` | The input data to the paymaster.  |

```typescript
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

## Functions

### `Approval-based` Paymaster

Returns encoded input for an `approval-based` paymaster.

#### Inputs

| Parameter          | Type      | Description                       |
| ------------------ | --------- | --------------------------------- |
| `paymasterAddress` | `Address` | The non-zero `paymaster` address. |
| `paymasterInput`   | `Data`    | The input data to the paymaster.  |

```swift
func encodeApprovalBased(_ tokenAddress: EthereumAddress, minimalAllowance: BigUInt, paymasterInput: Data) -> Data
```

### `General` Paymaster

Returns encoded input for a `general` paymaster.

#### Inputs

| Parameter        | Type   | Description                      |
| ---------------- | ------ | -------------------------------- |
| `paymasterInput` | `Data` | The input data to the paymaster. |

```swift
func encodeGeneral(_ paymasterInput: Data) -> Data
```
