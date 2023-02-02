<template><div><h1 id="fee-mechanism" tabindex="-1"><a class="header-anchor" href="#fee-mechanism" aria-hidden="true">#</a> Fee mechanism</h1>
<p>zkSync's version of <code v-pre>gas</code> is called <code v-pre>ergs</code> and represents not only the costs of computations but also the cost of publishing data on-chain and affecting storage. Similar to <code v-pre>gas</code>, <code v-pre>ergs</code> is an absolute unit. VM operations (<code v-pre>add</code>, <code v-pre>mul</code>, etc.) will also have their costs measured in <code v-pre>ergs</code>, and they may not be equal to each other. The actual table of operation costs in <code v-pre>ergs</code> is yet to be defined.</p>
<p>Since the costs for publishing the calldata on L1 are very volatile, the number of <code v-pre>ergs</code> needed for changing a storage slot is not constant. For each block, the operator defines the following dynamic parameters:</p>
<ul>
<li><code v-pre>ergs_price</code> — the table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token.</li>
<li><code v-pre>ergs_per_pubdata</code> — the price in <code v-pre>ergs</code> for publishing one byte of data to Ethereum.</li>
</ul>
<p><strong>Please note that the public data is published only for state diffs.</strong> If the same storage slot is updated 10 times in the same rollup block, only the final update will be published on Ethereum, thus only charging for public data once.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="why-do-we-need-a-different-fee-model" tabindex="-1"><a class="header-anchor" href="#why-do-we-need-a-different-fee-model" aria-hidden="true">#</a> Why do we need a different fee model?</h2>
<ul>
<li><strong>Why <code v-pre>ergs</code> and not gas?</strong></li>
</ul>
<p>We want to show the clear distinction between our fee model and the Ethereum one. Also, unlike Ethereum, where most of the opcodes have very distinct gas prices, basic zkEVM opcodes will likely have similar <code v-pre>ergs</code> prices. Generally, the execution itself (arithmetic operations, which do not involve storage updates) is very cheap. As in Ethereum, most of the cost is incurred for storage updates.</p>
<ul>
<li><strong>Why can't we have a constant price for storage value?</strong></li>
</ul>
<p>As part of the zk rollup security model, zkSync periodically publishes state diffs on Ethereum. The price of that is defined by Ethereum gas price and, as stated, is very volatile. This is why the operator can define the new price in <code v-pre>ergs</code> for publishing pubdata for each block. Users can provide a cap on the <code v-pre>ergs_per_pubdata</code> in the <RouterLink to="/api/api.html#eip712">EIP712</RouterLink> transactions.</p>
<h2 id="what-does-this-mean-to-me" tabindex="-1"><a class="header-anchor" href="#what-does-this-mean-to-me" aria-hidden="true">#</a> What does this mean to me?</h2>
<p>Despite the differences, the fee model is quite similar to the one of Ethereum; the most costly operation is storage change. One of the advantages of zk rollups over optimistic rollups is that, instead of publishing all the transaction data, zk rollups can publish only state diffs, thus making fewer storage changes.</p>
<p>As already stated, if the same storage slot is updated several times in a single block, only the last update will be published on Ethereum, and the cost of storage change will only be charged once; but it goes beyond simple storage slots. For example, a DEX and a <code v-pre>PairFactory</code> factory for different <code v-pre>Pair</code> pools. The contract bytecode of <code v-pre>Pair</code> needs to be published only when the first instance is deployed. After the code of the <code v-pre>Pair</code> was published once, the subsequent deployments will only involve changing one storage slot -- to set the contract code hash on the newly deployed <code v-pre>Pair</code>'s address.</p>
<p>So the tips to make the most out of the zkSync fee system are the following:</p>
<ul>
<li><strong>Update storage slots as little as possible.</strong> The cost for execution is a lot smaller than the cost of storage updates.</li>
<li><strong>Reuse as many storage slots as possible.</strong> Only the state diff is published on Ethereum.</li>
<li><strong>Users should share as many storage slots as possible.</strong> If 100 users update a storage slot of your contract in a single block, the diff will be published only once. In the future, we will introduce reimbursement for the users, so that the costs for updating shared storage slots are split between the users.</li>
<li><strong>Reuse the contract code if possible.</strong> On Ethereum, avoiding constructor parameters and putting them into constants reduces some of the gas costs upon contract deployment. On zkSync the opposite is true: deploying the same bytecode for contracts, while changing only constructor parameters can lead to substantial fee savings.</li>
</ul>
</div></template>


