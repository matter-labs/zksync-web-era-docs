# Technology

[[toc]]

## ZK rollup architecture

**zkSync** is an L2 protocol based on **ZK rollup** architecture. ZK rollup is a flavour of a larger "rollup" family.
For more background, we recommend Vitalik Buterin's
[2021 guide to rollups](https://vitalik.ca/general/2021/01/05/rollup.html).

All funds are held by a smart contract on the mainchain, while computation and storage are performed off-chain. The main
idea is that instead of verifying each transaction separately, transactions are "rolled up" to a single item (the rollup
block), which is then being verified, approving all them simultaneously.

Informally, it works as follows:

1. Users sign transactions and submit them to validators.
2. Validators roll up thousands of transactions together in a single block and submit a cryptographic commitment (the
   root hash) of the new state to the smart contract on mainnet along with a cryptographic proof (a SNARK) that this new
   state is indeed the result of the application of some correct transactions to the old state.
3. Additionally to the proof, the state ∆ (a small amount of data for every transaction) is published over the mainchain
   network as cheap `calldata`. This enables anyone to reconstruct the state at any moment.
4. The proof and the state ∆ are verified by the smart contract, thus verifying both the validity of all the
   transactions included in the block and the block data availability.

SNARK verification is much cheaper than verifying every transaction individually, and storing the state off-chain is
significantly cheaper than storing it on EVM. Hence enabling a huge boost of scalability (~100-200x mainnet capacity)
and tx cost savings.

zkRollup architecture provides the following guarantees:

- Validators can never corrupt the state or steal funds (unlike Sidechains).
- Users can always retrieve the funds from the zkRollup smart contract even if validator(s) stop cooperating, because
  the data is available (unlike Plasma).
- Neither users nor a single trusted third party needs to be online to monitor zkRollup blocks in order to prevent fraud
  (unlike fraud-proof systems, such as payment channels or Optimistic Rollups).

In other words, zkRollup strictly inherits the security guarantees of the underlying L1.

Here are some links to explore the topic of zkRollups:

- [Vitalik Buterin's guide to rollups (Jan 2021)](https://vitalik.ca/general/2021/01/05/rollup.html)
- [Original idea proposal by Buterin](https://ethresear.ch/t/on-chain-scaling-to-potentially-500-tx-sec-through-mass-tx-validation/3477)
- [Matter Labs' zkRollup talk at Zcon1 (video)](https://www.youtube.com/watch?v=QyM9qdFKsEA)
- [Awesome Zero-Knowledge Proofs materials](https://github.com/matter-labs/awesome-zero-knowledge-proofs)
- [zkRollup vs. Optimistic Rollup deep dive](https://medium.com/matter-labs/optimistic-vs-zk-rollup-deep-dive-ea141e71e075)
- [Validity proofs (zkRollup) vs. fraud proofs](https://medium.com/starkware/validity-proofs-vs-fraud-proofs-4ef8b4d3d87a)

## Maximum throughput

Since [the upgrade on Feb 9, 2021](https://twitter.com/zksync/status/1359190015671164930) that brought support of
recursion to **zkSync** on mainnet, protocol throughput is limited essentially only by the need to publish state changes
for every transaction via `calldata` Ethereum, to ensure data availability. With the current block gas limit of 12.5M,
zkSync can process over 2000 TPS.

## Transaction finality

Transactions in **zkSync** reach the finality of Ethereum once the SNARK proof of the **zkSync** block is generated and
accepted by the smart contract. The proof time generation is expected to be about 10 minutes, i.e. 10 minutes after
submitted, the **zkSync** (proof) transaction is as final as any L1 Ethereum transaction included in the same Ethereum
block as the transaction with the proof. At the moment, when a user sends a transaction, we wait for the block to get
filled, and so we don't generate the proof immediately. With higher throughput on the zkSync system, time between blocks
will decrease.

In contrast, fraud-based scaling solutions (e.g. optimistic rollup) require at least 2 weeks of a lockout period to
operate more-or-less securely, which results in 2 weeks objective<sup>\*</sup> tx finality time.

It should be added that Matter Labs and other companies in the ZKP space are constantly working on improving the prover
efficiency, which will result in lower finality times (potentially down to under 1 minute).

<span class="footnote"><sup>\*</sup> Subjective finality time can be shorter for optimistic rollup users who validate
every tx themselves, but this would defeat the purpose of optimistic rollups as a scaling solution.</span>

## Instant confirmations

Even though time to finality is about 10 minutes, it does not affect the usability of the network. Transactions
submitted to **zkSync** by users are instantly confirmed, instantly displayed to the receiving party in the UI and API
(although they are marked as unconfirmed), and the transferred assets can immediately be used to make further transfers
(which might even end up in the same **zkSync** block).

At the moment, instant confirmations are pure promise on the side of **zkSync** validators to include the transaction in
the next block. Users who do not trust the validator should await full finality before considering the assets as
received.

In the future, a security bond will be added to **zkSync** by the validators. This will provide instant economic
finality guarantees. It will work as follows.

Validators elected to participate in the **zkSync** block production will have to post a significant security bond to
the **zkSync** smart contract on the mainnet. A consensus run by the validators provides a subsecond confirmation to the
user that their transaction will be included in the next **zkSync** block, signed by a supermajority of (more than) ⅔ of
the consensus participants (weighted by stake).

If a new **zkSync** block is produced and submitted to the mainchain, it cannot be reverted. However, if it doesn’t
contain the promised transactions, the security bond of the intersection of the signers of the original receipt and the
signers of the new block will be slashed. This intersection is guaranteed to have more than ⅓ of the stake. This
guarantees that at least ⅓ of the security bond can be slashed and that only malicious validators will be punished.

A portion of the slashed funds will be used to compensate the tx recipient. The rest will be burned.

## Congested mainnet

Periodically, extraordinary events lead to very high levels of congestion on the Ethereum network (notable examples are
the
[Cryptokitties crisis](https://media.consensys.net/the-inside-story-of-the-cryptokitties-congestion-crisis-499b35d119cc)
and the [Shanghai DOS attack](https://blog.ethereum.org/2016/09/22/ethereum-network-currently-undergoing-dos-attack/)).
During such peak load times, gas prices skyrocket and it might become prohibitively expensive to move crypto assets,
rendering some services inoperative or preventing arbitrage opportunities.

Moreover, some systems can generally fail in extreme circumstances, leading to cascading failures (the recent
[DeFi Black Thursday](https://forklog.media/black-thursday-for-defi-wounds-to-lick-and-lessons-to-learn/) is an
excellent example). This is especially worrisome for fraud-proof-based scaling solutions (payment channels, optimistic
rollups), because there is a risk that their automated security bots won't be able to get their fraud-proof transactions
mined in case of an attack during high congestion, thus jeopardizing the security of all assets under the control of
such systems. What makes the problem for these systems worse, you can never know until the situation occurs (just like
[it happened](https://medium.com/dragonfly-research/daos-ex-machina-an-in-depth-timeline-of-makers-recent-crisis-66d2ae39dd65)
for Maker's liquidation bot).

In contrast, **zkSync** is positioned exceptionally well to thrive in a high-congestion environment.

First and foremost, a congested network (just like a case of targeted DOS attack) can never create any threat to assets
in **zkSync**. Any movement of funds within or out of **zkSync** requires a zero-knowledge proof of validity, and it's
simply unaffected by L1 censorship in any way.

Secondly, the normal operation of **zkSync** is also unlikely to be disrupted, even for smaller amounts. The validator's
node is configured to automatically increase the gas price to over-the-average level to get **zkSync** blocks mined with
high priority. Since the cost per transaction are ~1/100th of the cost of corresponding plain transaction on the L1,
**zkSync** users will be least affected.
