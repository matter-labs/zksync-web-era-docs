<template><div><h1 id="zksync-basics" tabindex="-1"><a class="header-anchor" href="#zksync-basics" aria-hidden="true">#</a> zkSync basics</h1>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<p>If you are unfamiliar with rollups, you should cover the <RouterLink to="/dev/fundamentals/rollups.html">rollups basics</RouterLink> and read about ZK rollups and Optimistic rollups, before learning about zkSync.</p>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p><strong>zkSync</strong> is a <RouterLink to="/dev/fundamentals/rollups.html#what-are-zk-rollups">ZK rollup</RouterLink>, a trustless protocol that uses cryptographic validity proofs to provide
scalable and low-cost transactions on Ethereum.
In zkSync, computation is performed off-chain and most data is stored off-chain as well. As all transactions are proven on the Ethereum
mainchain, users enjoy the same security level as in Ethereum.</p>
<p>zkSync 2.0 is made to look and feel like Ethereum, but with lower fees. Just like on Ethereum, smart contracts are written in Solidity/Vyper and can be called using the same clients as the other EVM-compatible chains.</p>
<p>You don't need to register a separate private key before usage; zkSync supports existing Ethereum wallets out of the box.
At this time, zkSync is solely run and operated by the zkSync team's servers and is therefore centralized. However, this will be transitioned to a decentralized system shortly.</p>
<h2 id="zksync-overview" tabindex="-1"><a class="header-anchor" href="#zksync-overview" aria-hidden="true">#</a> zkSync overview</h2>
<!---
Both parts will be able to work with each other and be put together. This means that contracts and accounts on the zkRollup side will be 
able to work with accounts on the zkPorter side without any problems, and vice versa.
-->
<p>The general rollup workflow is as follows:</p>
<ul>
<li>Users can receive, deposit, and transfer assets to each other.</li>
<li>Users can withdraw assets under their control to an L1 address.</li>
</ul>
<p>Rollup operation requires the assistance of an operator, who rolls transactions together, computes a zero-knowledge proof of the correct state transition, and affects the state transition by interacting with the rollup contract.
To understand the design, we need to look into how zkSync rollup transactions work.</p>
<p>zkSync operations are divided into rollup transactions (initiated inside rollup by a rollup account) and priority operations (initiated on the mainchain by an Ethereum account).</p>
<p>The zkSync rollup operation lifecycles are as follows:</p>
<ul>
<li>A user creates a transaction or a priority operation.</li>
<li>After processing this request, the operator creates a rollup operation and adds it to the block.</li>
<li>Once the block is complete, the operator submits it to the zkSync smart contract as a block commitment. Part of the logic of some rollup operations is checked by the smart contract.</li>
<li>The proof for the block is submitted to the zkSync smart contract as block verification. If the verification succeeds, the new state is considered final.</li>
</ul>
<p>Furthermore, on zkSync, each L2 block will progress through the following four stages until it is final.</p>
<ul>
<li><code v-pre>Pending</code>: The transaction was received by the operator, but it has not been processed yet.</li>
<li><code v-pre>Processed</code>: The transaction is processed by the operator and is confirmed to be included in the next block.</li>
<li><code v-pre>Committed</code>: This indicates that the transaction data of this block has been posted on Ethereum. It does not prove that it has been executed in a valid way, but it ensures the
availability of the block data.</li>
<li><code v-pre>Finalized</code>: This indicates that the SNARK validity proof for the transaction has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.</li>
</ul>
<p>The typical time for a transaction to go from <code v-pre>Processed</code> to <code v-pre>Finalized</code> is a couple of hours at the current stage.</p>
<p>Please note that for developer convenience, we usually treat the <code v-pre>Processed</code> and <code v-pre>Committed</code> states as a single stage called <code v-pre>Committed</code> since they have no difference from the UX/DexEx standpoints.</p>
<h3 id="the-state-of-zksync" tabindex="-1"><a class="header-anchor" href="#the-state-of-zksync" aria-hidden="true">#</a> The State of zkSync</h3>
<p>The current version of zkSync 2.0 solves the needs of most applications on Ethereum, and with more features planned for release soon, zkSync 2.0 will provide developers with a design space to experiment with applications not possible on Ethereum today. With this release, we are supporting the following features:</p>
<ul>
<li>Native support of ECDSA signatures: Unlike the first version of zkSync and most of the ZK rollups, no special operation is required to register the user’s private key. Any account can be managed in L2 with the same private key that is used for L1.</li>
<li>Solidity 0.8.x support: Deploy your existing codebase with little to no changes required.</li>
<li>With small exceptions, our Web3 API is fully compatible with Ethereum. This allows seamless integration with existing indexers, explorers, etc.</li>
<li>Support for Ethereum cryptographic primitives: zkSync natively supports <code v-pre>keccak256</code>, <code v-pre>sha256</code>, and <code v-pre>ecrecover</code> via precompiles.</li>
<li>Hardhat plugin: Enables easy testing and development of smart contracts on zkSync.</li>
<li>L1 → L2 smart contract messaging: Allows developers to pass data from Ethereum to smart contracts on zkSync, providing the required information to run various smart contracts.</li>
</ul>
<p>Some features are not included in our current testnet that we’re looking to ship in future upgrades, this includes:</p>
<ul>
<li>zkPorter: One of the largest and most important features, zkPorter will allow users to choose between a zkRollup account featuring the highest security and a 20x fee reduction compared to Ethereum, or a zkPorter account featuring stable transaction fees of just a few cents in a different security model (much higher than that of a sidechain). Both zkPorter and zkRollup accounts will be able to interact seamlessly together under the hood.</li>
</ul>
<h2 id="zksync-in-comparison" tabindex="-1"><a class="header-anchor" href="#zksync-in-comparison" aria-hidden="true">#</a> zkSync in comparison</h2>
<p>zkSync <a href="https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955" target="_blank" rel="noopener noreferrer">stands out remarkably<ExternalLinkIcon/></a> in security and usability among existing L2 scaling solutions.
Thanks to the combination of cutting-edge cryptography and on-chain data availability, ZK rollups (the core network of zkSync) are the only L2 scaling solution that doesn't
require any operational activity to keep the funds safe.
For example, users can go offline and still be able to withdraw their assets safely when they come back, even if the ZK rollup validators are no longer around.</p>
<h2 id="zksync-characteristics" tabindex="-1"><a class="header-anchor" href="#zksync-characteristics" aria-hidden="true">#</a> zkSync characteristics</h2>
<ul>
<li>ETH and ERC20 token transfers with instant confirmations and fast finality on L1.</li>
<li>Transaction fees are extremely low for the mainnet cost for ERC20 tokens and ETH transfers.</li>
<li>Payments to existing Ethereum addresses (including smart contracts) can be conveniently paid with the token being transferred.</li>
</ul>
<h2 id="highlights-of-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#highlights-of-zksync-2-0" aria-hidden="true">#</a> Highlights of zkSync 2.0</h2>
<ul>
<li>Mainnet-like security with zero reliance on 3rd parties.</li>
<li>Permissionless EVM-compatible smart contracts.</li>
<li>Standard Web3 API.</li>
<li>Preserving key EVM features, such as smart contract composability.</li>
<li>Introducing new features, such as account abstraction.</li>
</ul>
<h2 id="how-to-get-started" tabindex="-1"><a class="header-anchor" href="#how-to-get-started" aria-hidden="true">#</a> How to get started?</h2>
<ul>
<li>Begin by building a dApp in the <RouterLink to="/dev/developer-guides/hello-world.html">quickstart section</RouterLink>.</li>
<li>See the info on RPC nodes, wallet, and block explorer on the <RouterLink to="/dev/troubleshooting/important-links.html">important links</RouterLink> page.</li>
</ul>
</div></template>


