---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Paymaster Utilities | zkSync Docs
---

# Paymaster Utilities

The [paymaster utilities](https://github.com/zksync-sdk/zksync2-java/blob/master/src/main/java/io/zksync/utils/Paymaster.java) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

Constant ABI definition for
the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/583cb674a2b942dda34e9f46edb5a9f5b696b90a/l2-contracts/contracts/interfaces/IPaymasterFlow.sol).

## Functions

### `encodeApprovalBased`

Returns encoded input for an approval-based paymaster.

#### Inputs

| Parameter          | Type         | Description                 |
| ------------------ | ------------ | --------------------------- |
| `tokenAddress`     | `String`     | Address of paymaster token. |
| `minimalAllowance` | `BigInteger` | Paymaster allowance.        |
| `input`            | `byte[]`     |                             |

### `encodeGeneral`

As above but for general-based paymaster.

#### Inputs

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `input`   | `byte[]` |             |

#### Examples

Creating `General` paymaster parameters.

```java
PaymasterParams paymasterParams = new PaymasterParams(
  "0x0a67078A35745947A37A552174aFe724D8180c25",
  Numeric.hexStringToByteArray(FunctionEncoder.encode(
    Paymaster.encodeGeneral(
      new byte[] {})
     )
    )
  );
```

Creating `ApprovalBased` paymaster parameters.

```java
PaymasterParams paymasterParams = new PaymasterParams(
  "0x0a67078A35745947A37A552174aFe724D8180c25",
  Numeric.hexStringToByteArray(FunctionEncoder.encode(
    Paymaster.encodeApprovalBased(
      "0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964",
      BigInteger.ONE,
      new byte[] {})
     )
    )
  );
```
