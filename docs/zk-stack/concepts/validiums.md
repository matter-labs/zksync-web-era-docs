---
head:
  - - meta
    - name: "twitter:title"
      content: Validiums | zkSync Docs
---

# Validiums

### TLDR

Validiums are defined by:

- Leveraging data availability off-chain.
- Using off-chain computations to create validity proofs that are verified on Ethereum.

This leads to advantages like:

- Notably lower gas expenses (less data published to L1).
- Development of niche applications, particularly those focusing on privacy and enterprise.

However, Validiums have certain drawbacks:

- There's a risk of users being unable to access their funds if off-chain data needed for Merkle proofs become unavailable.
- Their security model is dependent on trust and economic incentives, in contrast to zk-rollups which are based solely on cryptographic security methods.

### What is a Validium?

More precisely, Validiums serve as scaling solutions utilizing off-chain data availability and computation to enhance throughput through off-chain transaction processing. Their security is upheld by issuing validity proofs on Ethereum, which guarantees accurate state transitions, thereby ensuring the overall integrity of the Validium chain.

Unlike zk-rollups that rely on on-chain data availability, Validiums opt for an off-chain data availability strategy. This difference not only influences their security profile but also their level of trustlessness. By striking a distinctive balance between operational efficiency and data privacy, Validiums offer new use cases. Validiums allow near-instant withdrawals, enabled by the verification of validity proofs on Ethereum and the provision of Merkle proofs by users.

However, one potential risk with Validiums is the withholding of off-chain data by data availability managers, which could impact fund accessibility.

## Potential Use Cases

### Enterprise Solutions

Validiums are ideal for enterprise chains requiring auditability and privacy. By controlling data availability, enterprises can maintain private ZK Chains, making Validiums an attractive choice for these applications.

### Privacy Benefits

For ZK Chains operating in Validium mode, privacy is inherently enhanced as long as the block data remains confidential. This feature is particularly beneficial for enterprise users seeking to protect sensitive information.

## Further Resources

For those interested in delving deeper into the world of Validiums and their applications in blockchain technology, the following resources are invaluable:

- [Ethereum.org - Validium](https://ethereum.org/en/developers/docs/scaling/validium/)
- [DeFi Pulse - Rollups, Validiums, and Volitions](https://www.defipulse.com/blog/rollups-validiums-and-volitions-learn-about-the-hottest-ethereum-scaling-solutions)
- [Coda - Web3 One Pager on Validium](https://coda.io/@enzo/web3-one-pager/validium-42)
