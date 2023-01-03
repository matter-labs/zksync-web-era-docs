<template><div><h1 id="browse-blocks" tabindex="-1"><a class="header-anchor" href="#browse-blocks" aria-hidden="true">#</a> Browse blocks</h1>
<figure><img src="@source/assets/images/block-tx.png" alt="Browse blocks!" tabindex="0" loading="lazy"><figcaption>View blocks on zkSync</figcaption></figure>
<p>The block explorer home screen, by default, displays the 10 most recent blocks in the chain.
View all blocks for a more complete overview of recent blocks, or click on a specific block number for details on that block.
The blocks page is also accessible via the top menu.</p>
<figure><img src="@source/assets/images/block-menu.png" alt="Access the block page" tabindex="0" loading="lazy"><figcaption>Blocks menu</figcaption></figure>
<h2 id="view-all-blocks" tabindex="-1"><a class="header-anchor" href="#view-all-blocks" aria-hidden="true">#</a> View all blocks</h2>
<p>You can click on a block number to see all the details of that specific block. If you want to browse more blocks, click the <a href="https://explorer.zksync.io/blocks/" target="_blank" rel="noopener noreferrer">Blocks<ExternalLinkIcon/></a> section of the navigation menu. Use the pagination to navigate to the next page.</p>
<p>However, if you have already left the homepage, you can always search for any block by typing in the block number.</p>
<figure><img src="@source/assets/images/view-block.png" alt="Browse all blocks" tabindex="0" loading="lazy"><figcaption>Browse all blocks</figcaption></figure>
<p>There are two main sections inside a block:</p>
<ol>
<li>The Block Header</li>
</ol>
<ul>
<li>This shows brief information about this specific block, as well as a link to the previous block in the chain.</li>
</ul>
<ol start="2">
<li>Transactions</li>
</ol>
<ul>
<li>Consists of lists of all the transactions that were included in this block.</li>
</ul>
<figure><img src="@source/assets/images/single-block.png" alt="Single block page!" tabindex="0" loading="lazy"><figcaption>View a single block</figcaption></figure>
<h3 id="block-headers" tabindex="-1"><a class="header-anchor" href="#block-headers" aria-hidden="true">#</a> Block headers</h3>
<p>The following table should help explain what you’ll see in a block.
For more details on blocks, see the docs on <RouterLink to="/dev/developer-guides/transactions/blocks.html">Blocks</RouterLink>.</p>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Block number</td>
<td>The unique sequential number for this block.</td>
</tr>
<tr>
<td>Block size</td>
<td>The size of the block.</td>
</tr>
<tr>
<td>Timestamp</td>
<td>The block generation time in seconds since the Unix epoch.</td>
</tr>
<tr>
<td>Root hash</td>
<td>The Cryptographic hash of the block header.</td>
</tr>
<tr>
<td>Status</td>
<td>The status of the block, could be <code v-pre>sealed</code>, <code v-pre>finalized</code>, or <code v-pre>unfinalized</code>.</td>
</tr>
</tbody>
</table>
<h3 id="transactions" tabindex="-1"><a class="header-anchor" href="#transactions" aria-hidden="true">#</a> Transactions</h3>
<p>This section lists all the transactions that are included in this block.
Transactions are served on a first-in-first-out basis, but in the future, we will introduce a &quot;priority heap&quot;, which will allow for sorting the transactions.</p>
<table>
<thead>
<tr>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Block</td>
<td>The amount of transactions in a block</td>
</tr>
<tr>
<td>Timestamp</td>
<td>The block generation time in seconds since the Unix epoch.</td>
</tr>
<tr>
<td>Hash</td>
<td>The hash of the transaction serving as the transaction’s ID</td>
</tr>
<tr>
<td>From</td>
<td>The account or smart contract, sending the transaction.</td>
</tr>
<tr>
<td>To</td>
<td>The account or smart contract, the transaction targeted.</td>
</tr>
<tr>
<td>Fee</td>
<td>The rate of fees associated with this transaction processing.</td>
</tr>
<tr>
<td>Tokens transfered</td>
<td>Details about the tokens(both <code v-pre>to</code> and <code v-pre>from</code> addresses) involved in the transactions, it includes, details like the assets, balance in the wallet address, and token address.</td>
</tr>
<tr>
<td>Contract address</td>
<td>The rate of fees collected by the network.</td>
</tr>
</tbody>
</table>
</div></template>


