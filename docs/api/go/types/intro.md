---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Types | zkSync Docs
---

# Types

Types are placed in three packages for different purposes:

- [`types`](types.md): Contains common and general types used to build basic features and other types.
- [`eip712`](eip712.md): Contains types used for EIP-712 implementation.
- [`clients`](clients.md): Contains types that are meant to be used along with [`Client`](clients.md).
- [`accounts`](accounts.md): Contains types that are meant to be used along with an account, specifically with the
  [`Adapter`](../accounts.md) abstraction. Many types are similar to those from the `geth` library, but the `From` or `Signer` fields are omitted
  because these fields are inherited from `Adapter`, which already has an associated account.
