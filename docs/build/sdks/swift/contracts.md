---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Contracts | zkSync Docs
---

# Contracts

`zksync2-swift` does not implement any new `Contract` class.

With zkSync, you can deploy a contract using the create and create2 opcode, by simply building the contract into a binary format and deploying it to the zkSync network.

In order to pay for smart contract interactions in ERC20 tokens, `customData` override should be used. You can read more about accessing zkSync features in [the next chapter](./features.md).
