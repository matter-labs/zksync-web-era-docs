---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Migration | zkSync Docs
---

# Migration from `zksync-web3`

This guide provides some high-level differences between `zksync-web3` and `zksync-ethers` for those who are familiar with
`zksync-web3` and need a quick primer. `zksync-ethers` has several differences since it's using `ethers.js v6`, compared to
`zksync-web3`, which uses `ethers.js v5`. Before continuing to get to know the changes made in `zksync-ethers`, you should
read the [migration guide](https://docs.ethers.org/v6/migrating/) from `ethers.js v5` to `ethers.js v6`.

Differences:

- `Token.Address` has been removed because it was deprecated.
- `Provider.getMessageProof` has been removed because it was deprecated.
- `Provider.getTokenPrice` has been removed because it was deprecated.
- `Provider.getBlockWithTransaction` has been replaced with `Provider.getBlock(<BlockTag>, true)`.
- `BlockWithTransaction` has been removed.
- `TransactionRequest.calldata` has been changed from `BytesLike` to `string`.
- `transaction.calldata` parameter in`Provider.estimateL1ToL2Execute` has been changed from `BytesLike` to `string`.
- `transaction.calldata` parameter in `AdaterL1.getRequestExecuteTx` has been changed from `BytesLike` to `string`.
- `transaction.calldata` parameter in `AdapterL1.estimateGasRequestExecute` has been changed from `BytesLike` to `string`.
- `transaction.calldata` parameter in `AdapterL1.RequestExecute` has been changed from `BytesLike` to `string`.
- `utils.parseTransaction` has been replaced by `utils.parseEip712`.
