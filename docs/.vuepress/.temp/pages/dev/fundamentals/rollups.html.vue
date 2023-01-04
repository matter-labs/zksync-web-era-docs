<template><div><h1 id="intro-to-rollups" tabindex="-1"><a class="header-anchor" href="#intro-to-rollups" aria-hidden="true">#</a> Intro to rollups</h1>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>To better understand rollups we need to dive briefly into Ethereum and Layer 2 solutions.</p>
<p>The Ethereum network is frequently congested, which results in slow transactions and increased gas prices.
While this has remained so for a long time, an improved solution is needed: one that will not put limits on the throughput, but instead,
achieve a high transaction rate without having to trade off security. That is where Layer 2 solutions shine.</p>
<p>Layer 2 solutions are designed as an extension to Ethereum, and offer various solutions poised to be the critical scalability component to
the inherent network congestion on Ethereum. Covering all Layer 2 solutions is beyond the scope of this doc.
We will go through a brief explainer on rollups in this section.</p>
<h2 id="what-are-rollups" tabindex="-1"><a class="header-anchor" href="#what-are-rollups" aria-hidden="true">#</a> What are rollups?</h2>
<p>Rollups are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many
transactions up into a single batch, and sending it to the main Ethereum chain in a single action.
Instead of submitting each transaction separately, rollup operators submit a summary of the required changes to represent all transactions
in a batch.</p>
<p>To be able to work on a rollup, funds need to be locked on a smart contract on the Layer 1 blockchain.
This allows transactions to be processed without the overhead of all the data associated with performing a transaction on the main chain.
Rollups significantly decrease associated transaction processing times and gas fees.</p>
<p>The main difference between ZK and Optimistic rollups is in the way this batch of transactions becomes <em>final</em>.</p>
<h3 id="optimistic-rollups-versus-zk-rollups" tabindex="-1"><a class="header-anchor" href="#optimistic-rollups-versus-zk-rollups" aria-hidden="true">#</a> Optimistic rollups versus ZK rollups</h3>
<p>There are mainly two types of rollups, ZK rollups and Optimistic rollups.</p>
<h3 id="what-are-zk-rollups" tabindex="-1"><a class="header-anchor" href="#what-are-zk-rollups" aria-hidden="true">#</a> What are ZK rollups?</h3>
<p>In ZK rollups ('ZK' standing for zero-knowledge) the batch of transactions is verified for correctness on the Ethereum network. After the
verification passes, the batch of transactions is considered final like any other Ethereum transaction. This is achieved through the power
of cryptographic <em>validity proofs</em> (commonly called zero-knowledge proofs). With any batch of off-chain transactions, the ZK rollup
operator generates a proof of validity for this batch. Once the proof is generated, it is submitted to Ethereum to make the roll-up batch final.
In zkSync, this is done via a <strong>SNARK</strong>, succinct non-interactive argument of knowledge.</p>
<h3 id="what-are-optimistic-rollups" tabindex="-1"><a class="header-anchor" href="#what-are-optimistic-rollups" aria-hidden="true">#</a> What are Optimistic rollups?</h3>
<p>Optimistic rollups, on the other hand, have no mechanism to prove the validity of the off-chain transactions. Instead, they are considered
“optimistic” because they assume off-chain transactions are valid unless proven otherwise. Hence, they rely on <em>fraud proofs</em>, a
challenge to the submitted state to Ethereum. If such a challenge is submitted, the Optimistic rollup operator needs to show that the
state and transactions in questions are actually valid. This is a cumbersome process, and requires watchers to make sure that the Optimistic
rollup operator is honest at all times.</p>
<h2 id="l1-and-l2-what-s-the-difference" tabindex="-1"><a class="header-anchor" href="#l1-and-l2-what-s-the-difference" aria-hidden="true">#</a> L1 and L2: what's the difference?</h2>
<p>The term <strong>Layer 1</strong> (or <strong>L1</strong>) is used to refer to the underlying primary chain, such as the Ethereum network or Bitcoin. Layer 1
blockchains determine protocol rules and transaction finality, and perform the base-level functions of applications built upon them.</p>
<p>The term <strong>Layer 2</strong> (or <strong>L2</strong>) is used to describe an overlaying application or network that operates on top of the Layer 1 chain. These
are most often built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the
layer 1 chain, quickening transaction times and lowering gas fees.</p>
<p>zkSync is an L2, where L1 is the main Ethereum blockchain.</p>
</div></template>


