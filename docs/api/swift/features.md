---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Features | zkSync Era Docs
---

# zkSync Era features

While zkSync Era is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP-712 transactions
since [EIP-712](https://eips.ethereum.org/EIPS/eip-712) is used to sign them. You can look at the internal structure of the EIP-712
transactions [here](../../reference/concepts/transactions.md#eip-712-0x71).

This document will focus solely on how to pass these arguments to the SDK.

## EIP-712 Metadata

[`EIP712Meta`](types/types.md#eip712meta) contains EIP-712 transaction metadata. Following objects contain `EIP712Meta` and provides working with
EIP-712 transactions:

- [`types.CallMsg`](types/types.md#callmsg)
- [`types.Transaction712`](types/types.md#transaction712)
- [`accounts.CallMsg`](types/accounts.md#callmsg)
- [`accounts.Transaction`](types/accounts#transaction)

## Encoding paymaster params

While the paymaster feature by itself does not impose any limitations on values of the `paymasterInput`, the Matter Labs team endorses certain types of [paymaster flows](../../reference/concepts/account-abstraction.md#built-in-paymaster-flows) that are processable by EOAs.

zkSync SDK provides a utility method that can be used to get the correctly formed `PaymasterParams` object: [GetPaymasterParams](./paymaster-utils.md#getpaymasterparams).
