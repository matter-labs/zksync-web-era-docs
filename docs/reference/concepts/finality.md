---
head:
  - - meta
    - name: "twitter:title"
      content: Finality | zkSync Docs
---

# Finality

## Finality on Ethereum

Finality in blockchain systems refers to the time taken from sending a transaction to when the transaction can be considered settled; and therefore cannot be altered, reversed, or canceled. At the time of writing, finality on the Ethereum layer is considered to occur after 2 [epochs](https://info.etherscan.com/epoch-in-ethereum/) or ~13 minutes.

## Finality on zkSync Era

As with other L2 rollup systems, finality and security on zkSync Era is tied to the finality and security of the underlying L1 Ethereum chain. Finality on zkSync Era is the time taken from sending a transaction to when the L1 smart contract updates the L2 state. The process has a few steps:

- Fill a batch with transactions (usually takes a few minutes).
- Commit the batch to Ethereum.
- Generate a proof for the whole batch (usually takes around an hour).
- Submit the proof for verification by the Ethereum smart contract.
- Finalize the batch on Ethereum (delayed by ~21 hours as a security measure during the alpha phase).

When this process is complete, around ~24 hours in total, the batch is as final as any Ethereum transaction included in the same Ethereum block.

:::info
Research into validity proofs have seen tremendous advances in recent years. As the field evolves, we expect to see further improvements in proof generation, which will likely result in lower finality times.
:::

## Instant confirmations

Even though zkSync Era finality is usually around 24 hours, users may consider transactions submitted to zkSync Era as having instant confirmation. Transaction details are instantly displayed in the UI and API (although they are marked as unconfirmed), and the transferred assets can be used immediately to make further transfers (which might even end up in the same zkSync Era batch).

More cautious users may prefer to wait for full finality, or for any of the intermediate steps described above, before considering the assets as received.
