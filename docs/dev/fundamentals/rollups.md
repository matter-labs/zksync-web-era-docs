# Introduction

To better understand rollups we need to dive briefly into Ethereum and Layer 2 solutions.

The design of Ethereum is such that when the demand from users to transact increases, a limit is placed on the network capacity, thereby causing congestion, which results in slow transactions and increased gas prices.
While this has remained so for a while, an improved solution is needed, one that can maintain scalability.
That is, to increase finality and achieve high transaction rate per second without having to trade off security. That's where layer 2 solutions shine.

Layer 2 solutions are designed as an extension to Ethereum, offer various solutions poised to be the critical scalability solution to the inherent network congestion on Ethereum. Covering all Layer 2 solutions is beyond the scope of this doc.
We will go through a brief explainer on rollups in this section.

## Optimistic rollups versus zk rollups

There are mainly two types of rollups, zk rollups and Optimistic rollups.

### What are zk rollups?

zk rollups ('zk' standing for zero-knowledge) are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many transactions up into a single batch, and sending it to the main Ethereum chain for verification in a single action. 
Instead of submitting each transaction separately, zk rollup operators submit a summary of the required changes to represent all transactions in a batch. Additionally, they produce validity proofs to demonstrate the legitimacy of their changes.
The validity proof uses cryptography to establish that the proposed changes to Ethereum's state are indeed the outcome of completing all of the transactions in the batch.
On zkSync, this is done via a **SNARK** (succinct non-interactive argument of knowledge), a cryptographic proof that performs the validation of transactions in the batch.

With zk rollups, funds are locked on a smart contract on the layer 1 blockchain. 
This allows transactions to be processed without the overhead of all the data typically associated with performing a transaction on the main chain, only requiring a **validity proof** to reach transaction finality. This significantly decreases associated transaction processing times and gas fees.

### What are Optimistic rollups?

Optimistic rollups, which rely on fraud proofs, are considered “Optimistic” because they assume off-chain transactions are valid and don't publish proofs of validity for transaction batches posted on-chain. 
They keep track of their entire history of state roots and the hash of each batch. Anyone who discovers that one batch has an incorrect post-state root can publish proof to the chain, proving that the batch was computed incorrectly.
The contract verifies the proof and reverts that batch and all batches after it.
This separates Optimistic rollups from zero-knowledge rollups that actually publishing proofs of validity for off-chain transactions.

## L1 and L2: what's the difference?

In decentralised ecosystems, the term **layer 1** (or **L1**) is used to refer to the underlying primary chain, such as the Ethereum network or Bitcoin. Layer 1 blockchains determine protocol rules and transaction finality,
and perform the base-level functions of applications built upon them.

The term **Layer 2** (or **L2**) is used to describe an overlaying application or network that operates on top of the layer 1 chain. These are most often built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the layer-1 chain, quickening transaction times and lowering gas fees.

zkSync is an L2, where L1 is the main Ethereum blockchain.

