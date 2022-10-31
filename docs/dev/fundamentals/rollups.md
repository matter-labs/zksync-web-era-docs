# Intro to rollups

## Introduction

To better understand rollups we need to dive briefly into Ethereum and Layer 2 solutions.

The Ethereum network is frequently congested, which results in slow transactions and increased gas prices.
While this has remained so for a long time, an improved solution is needed: one that will not put limits on the throughput, but instead, 
achieve a high transaction rate without having to trade off security. That is where Layer 2 solutions shine.

Layer 2 solutions are designed as an extension to Ethereum, and offer various solutions poised to be the critical scalability component to 
the inherent network congestion on Ethereum. Covering all Layer 2 solutions is beyond the scope of this doc.
We will go through a brief explainer on rollups in this section.

## Optimistic rollups versus ZK rollups

There are mainly two types of rollups, ZK rollups and Optimistic rollups.

### What are rollups?

Rollups are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many
transactions up into a single batch, and sending it to the main Ethereum chain in a single action.
Instead of submitting each transaction separately, rollup operators submit a summary of the required changes to represent all transactions
in a batch.

To be able to work on a rollup, funds need to be locked on a smart contract on the Layer 1 blockchain.
This allows transactions to be processed without the overhead of all the data associated with performing a transaction on the main chain. 
Rollups significantly decrease associated transaction processing times and gas fees.

The main difference between ZK and Optimistic rollups is in the way this batch of transactions becomes <em>final</em>.

### What are ZK rollups?

In ZK rollups ('ZK' standing for zero-knowledge) the batch of transactions is verified for correctness on the Ethereum network. After the 
verification passes, the batch of transactions is considered final like any other Ethereum transaction. This is achieved through the power 
of cryptographic <em>validity proofs</em> (commonly called zero-knowledge proofs). With any batch of off-chain transactions, the ZK rollup 
operator generates a proof of validity for this batch. Once the proof is generated, it is submitted to Ethereum to make the roll-up batch final. 
In zkSync, this is done via a **SNARK**, succinct non-interactive argument of knowledge.

### What are Optimistic rollups?

Optimistic rollups, on the other hand, have no mechanism to prove the validity of the off-chain transactions. Instead, they are considered 
“optimistic” because they assume off-chain transactions are valid unless proven otherwise. Hence, they rely on <em>fraud proofs</em>, a 
challenge to the submitted state to Ethereum. If such a challenge is submitted, the Optimistic rollup operator needs to show that the 
state and transactions in questions are actually valid. This is a cumbersome process, and requires watchers to make sure that the Optimistic 
rollup operator is honest at all times.

### L1 and L2: what's the difference?
The term **Layer 1** (or **L1**) is used to refer to the underlying primary chain, such as the Ethereum network or Bitcoin. Layer 1 
blockchains determine protocol rules and transaction finality, and perform the base-level functions of applications built upon them.

The term **Layer 2** (or **L2**) is used to describe an overlaying application or network that operates on top of the Layer 1 chain. These 
are most often built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the
layer 1 chain, quickening transaction times and lowering gas fees.

zkSync is an L2, where L1 is the main Ethereum blockchain.
