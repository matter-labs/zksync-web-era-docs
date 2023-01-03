<template><div><h1 id="l1-l2-interoperability" tabindex="-1"><a class="header-anchor" href="#l1-l2-interoperability" aria-hidden="true">#</a> L1 / L2 Interoperability</h1>
<p>While most of the execution will happen on L2, some use cases require interoperability with the L1 chain. The main use cases are building complex bridges, maintaining governance smart contracts on one chain that govern contracts on other chains, etc.</p>
<p>In addition, the L2 censorship resistance is derived from the underlying chain, so the ability to send messages from Ethereum to zkSync is an important part of the censorship-resistance mechanism called the <a href="#priority-queue">priority queue</a>.</p>
<p>Sending transactions from Ethereum to zkSync is done via the zkSync smart contract. It allows the sender to request transactions directly from L1. Thereby allowing the permissionless passing of any data from Ethereum into zkSync.
<RouterLink to="/dev/developer-guides/bridging/l1-l2.html">Read more</RouterLink> about messaging from L1 to L2.</p>
<h2 id="priority-queue" tabindex="-1"><a class="header-anchor" href="#priority-queue" aria-hidden="true">#</a> Priority queue</h2>
<p>The goal of the priority queue is to provide a censorship-resistant way to interact with zkSync in case the operator becomes malicious or unavailable.
The way the priority queue works in zkSync 2.0 is very close to how it worked in the previous version of zkSync.
For the full picture, we first present how the priority queue works on zkSync 1.x.
This gives the rationale for the new design of the priority queue for zkSync 2.0.</p>
<h3 id="how-it-works-in-zksync-1-x" tabindex="-1"><a class="header-anchor" href="#how-it-works-in-zksync-1-x" aria-hidden="true">#</a> How it works in zkSync 1.x</h3>
<p>In the previous version of zkSync, we only had two operations that could be sent to zkSync from L1:</p>
<ul>
<li><code v-pre>Deposit</code> to bridge funds from Ethereum to zkSync.</li>
<li><code v-pre>FullExit</code> to bridges the funds back from Ethereum (this is essentially the same as <code v-pre>Withdraw</code> in zkSync 2.0).</li>
</ul>
<p>If users wanted to deposit funds to or withdraw funds from zkSync, they would have to send a transaction request to the smart contract which will then get appended to the queue of priority transactions. The queue has the following rules:</p>
<ul>
<li>All transactions are processed sequentially.</li>
<li>Each priority operation must be processed by the operator within <code v-pre>X</code> days since it was submitted to the contract.</li>
</ul>
<p>The first rule is strictly enforced by the smart contract. The second rule may be violated if the operator becomes malicious or unavailable. In case that happens, the system enters 'exodus mode', where no new blocks can be processed and users can withdraw their funds without cooperation from the operator.</p>
<h3 id="what-changes-are-needed" tabindex="-1"><a class="header-anchor" href="#what-changes-are-needed" aria-hidden="true">#</a> What changes are needed?</h3>
<p>The process described above works well for a system with a small set of relatively light supported operations. zkSync 2.0 supports general smart contract computation, and thus some principles had to be changed in order to preserve the stability of the network.</p>
<p>Firstly, all transactions need to be supported by the priority queue. Users may have their funds locked on an L2 smart contract, and not on their own L2 account. Therefore before moving their funds to L1, they need to send an <code v-pre>Execute</code> transaction to the zkSync network to release the funds from that smart contract first.</p>
<p>Secondly, the priority queue needs to stay censorship-resistant. But imagine what will happen if users start sending a lot of transactions that take the entirety of the block ergs limit? There needs to be a way to prevent spam attacks on the system.
That's why submitting transactions to the priority queue is no longer free.
Users need to pay a certain fee to the operator for processing their transactions. It is really hard to calculate the accurate fee in a permissionless way.
Thus, the fee for a transaction is equal to <code v-pre>txBaseCost * gasPrice</code>. The <code v-pre>gasPrice</code> is the gas price of the users' transaction, while <code v-pre>txBaseCost</code> is the base cost for the transaction, which depends on its parameters (e.g. <code v-pre>ergs_limit</code> for <code v-pre>Execute</code> transaction).</p>
<p>Thirdly, the operator can not commit to processing every transaction within <code v-pre>X</code> days. Again, this is needed to prevent spam attacks on the priority queue. We changed this rule to the following one:</p>
<ul>
<li>The operator must do at least <code v-pre>X</code> amount of work (see below) on the priority queue or the priority queue should be empty.</li>
</ul>
<p>In other words, we require the operator to do its best instead of requiring a strict deadline. The measure of &quot;the work&quot; is still to be developed. Most likely it will be the number of <code v-pre>ergs</code> the priority operations used.</p>
<p>In the future, we will also add the ability to &quot;prioritize&quot; L1-&gt;L2 transactions, allowing users to speed up the inclusion of their transactions in exchange for paying a higher fee to the operator.</p>
<h2 id="priority-mode" tabindex="-1"><a class="header-anchor" href="#priority-mode" aria-hidden="true">#</a> Priority mode</h2>
<p>If the operator fails to process the needed L1 transactions, the system enters in 'Priority mode'. In this mode, everyone can become an operator by staking tokens. The exact details of the priority mode are still under development and will be described in more detail closer to the mainnet launch.</p>
<p>To reduce risks, the alpha mainnet will start with a mechanism to instantly stop and upgrade the network, which contradicts the purpose of the priority mode. Priority mode will be gradually introduced in the following releases.</p>
<h2 id="l2-l1-messaging" tabindex="-1"><a class="header-anchor" href="#l2-l1-messaging" aria-hidden="true">#</a> L2 -&gt; L1 messaging</h2>
<p>The <RouterLink to="/dev/developer-guides/bridging/l2-l1.html">L2 -&gt; L1 communication</RouterLink>, in contrast to L1 -&gt; L2 communication, is based only on transferring the information, and not on the transaction execution on L1. It is a built-in feature, which is made up of two parts: sending a message from L2 and reading it on L1. The first is implemented as a call to an L2 system smart contract. And the second is implemented on the zkSync L1 smart contract as a getter function.</p>
<h3 id="sending-messages" tabindex="-1"><a class="header-anchor" href="#sending-messages" aria-hidden="true">#</a> Sending messages</h3>
<p>Each message sent from L2 to L1 contains the sender's address and the message itself. The length of the message can be arbitrarily large, but the longer the message, the more expensive it will be to send. The operator must include all messages for the corresponding merkle root (see next paragraph). Hence, all the messages are publicly available, and one does not have to rely on the operator to reveal them.</p>
<h3 id="reading-messages" tabindex="-1"><a class="header-anchor" href="#reading-messages" aria-hidden="true">#</a> Reading messages</h3>
<p>Every message sent can be read on-chain. Moreover, it is possible to prove that a message has been sent in a specific L2 block. To make such proof as cheap as possible for both the user and the operator, we store all messages, for each L2 block, in a merkle tree. Accordingly, any L1 smart contract can consume the message sent by providing proof of inclusion in some L2 block. Proof can be generated based only on the data that the operator sent to the zkSync L1 smart contract. The proof can also be obtained via <RouterLink to="/api/api.html#zksgetl2tol1msgproof">the API</RouterLink>.</p>
<h3 id="summary-on-l2-l1-messaging" tabindex="-1"><a class="header-anchor" href="#summary-on-l2-l1-messaging" aria-hidden="true">#</a> Summary on L2-&gt;L1 messaging</h3>
<ul>
<li>L2 -&gt; L1 communication requires one transaction on L2 and one on L1.</li>
<li>Messages can be of arbitrary length.</li>
<li>All the data needed for proving message inclusion in an L2 block can always be restored from Ethereum. However, the easiest way is to request proof from the operator via API.</li>
</ul>
</div></template>


