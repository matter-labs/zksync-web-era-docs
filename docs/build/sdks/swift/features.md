---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Features | zkSync Docs
---

# zkSync Era Features

While zkSync is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP712 transactions since
`EIP712` is used to sign them.

This document will focus solely on how to pass these arguments to the SDK.

## Encoding paymaster params

While the paymaster feature by itself does not impose any limitations on values of the `paymasterInput`.

zkSync SDK provides a utility method that can be used to get the correctly formed `paymasterParams` object: [getPaymasterParams](./paymaster-utils.md#getpaymasterparams).
