<template><div><h1 id="blocks" tabindex="-1"><a class="header-anchor" href="#blocks" aria-hidden="true">#</a> Blocks</h1>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><p>A block is an ordered list of transactions. Each block (except for the Genesis block) points to the previous block it extends, thus creating a chain of blocks.</p>
<h2 id="blocks-in-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#blocks-in-zksync-2-0" aria-hidden="true">#</a> Blocks in zkSync 2.0</h2>
<p>In zkSync there are two notions of &quot;blocks&quot;: an L2 block and an L1 rollup block.</p>
<p>L2 blocks, or just &quot;blocks&quot;, are simply the blocks created on L2, that is on the zkSync network. They are not included on the Ethereum chain. An L1 rollup block, which we call &quot;batch&quot;, is a set of
consecutive (L2) blocks, it contains all the transactions, and in the same order, from the first block in the batch to the last block in the
batch.</p>
<p>L1 batches, as the name suggests, are submitted to Ethereum. The main reason to have these different notions is that a block can
contain a minimal number of transactions, and thus be processed quickly, while in a batch we would like to include many transactions, to make the cost of interaction with L1 spread among many transactions.</p>
<h2 id="block-numbers" tabindex="-1"><a class="header-anchor" href="#block-numbers" aria-hidden="true">#</a> Block numbers</h2>
<p>Accessing block numbers within zkSync API is similar to how you would do it on Ethereum. For example, <code v-pre>eth_blockNumber</code> returns the number
of the latest L2 block, and <code v-pre>eth_getBlockByNumber</code>, given a block number, returns the information about the requested block.</p>
<p>For L1 batches, to retrieve the latest batch number, use zkSync API method <code v-pre>zks_L1BatchNumber</code>.
Additionally, by querying on a block, you can see the batch number for the batch that includes the block.
Within transaction receipts, the field <code v-pre>l1BatchNumber</code> is the batch number that includes the transaction.
The field <code v-pre>l1BatchTxIndex</code> returns the transaction position among all of the batch transactions.</p>
<h2 id="block-processing-time" tabindex="-1"><a class="header-anchor" href="#block-processing-time" aria-hidden="true">#</a> Block processing time</h2>
<p>Transactions are processed immediately by the operator and added to blocks, which are then immediately generated. Once zkSync becomes
fully decentralised, block time will take a couple of seconds, as the involved entities need to achieve consensus.</p>
<p>Batch time, in general, depends on the system activity - the more active the system has, the faster we <em>seal</em> a batch.
There are several criteria for sealing a batch, which we defer from explaining in detail here, as the system is still under testing and
these may change.
In general, a batch will get sealed when:</p>
<ol>
<li>The batch &quot;capacity&quot; is reached. Capacity includes L1 gas used, L2 ergs consumed and several other parameters.</li>
<li>The batch timeout has passed.</li>
</ol>
<p>After submitting transactions, users can check where in the process their transaction is as explained <RouterLink to="/dev/fundamentals/zkSync.html#zksync-overview">here</RouterLink>.</p>
<h3 id="empty-blocks" tabindex="-1"><a class="header-anchor" href="#empty-blocks" aria-hidden="true">#</a> Empty Blocks</h3>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>We currently have empty blocks being shown on our block explorer, please note it's not a block explorer issue, but this happens by design.</p>
<p>Although this might be a short-term reality, it is important to consider the rationale behind this design.</p>
</div>
<p>Each L1 batch (which comprises several L2 blocks) is executed in a single VM instance. The VM executes transactions one by one and then executes some code that has nothing to do with the last transaction but rather with the entire batch. Currently, the ETH collected from fees is transferred from the bootloader formal address to the block miner address. The issue is that this transfer emits an event (like any other transfer), hence, we included this event in an L2 block for it to be accessible via API.</p>
<p>We could add it in the latest L2 block in the L1 batch, but imagine the following scenario: if an L2 block was closed, but its L1 batch was not, and the node hasn't received any new transactions in a while, then the L1 batch must be closed by the timeout. If we add the event to the most recent closed block, it will modify the block, resulting in a sort of re-organization. 
To avoid this is why we built a purely fictional block containing the only event.</p>
<h3 id="hashes" tabindex="-1"><a class="header-anchor" href="#hashes" aria-hidden="true">#</a> Hashes</h3>
<p>Block hashes in zkSync are deterministic and are derived from the following formula: &quot;keccak256(l2_block_number)&quot;.
The reason for having a deterministic block hash is that these hashes are not provable (remember that L2 blocks are not submitted to L1).
Projects are advised not to use the L2 block hash as a source of randomness.</p>
<h3 id="block-properties" tabindex="-1"><a class="header-anchor" href="#block-properties" aria-hidden="true">#</a> Block Properties</h3>
<ul>
<li>Timestamp: The current block's creation time in seconds that returns the timestamp of the L1 batch.</li>
<li>Block number: The unique sequential number for this block.</li>
<li>Gas limit: The current block gas limit, always returns <code v-pre>2^32-1</code>.</li>
<li>Coinbase:  The current block miner’s address, returns the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#bootloader">bootloader</RouterLink> address.</li>
<li>Difficulty: The current block difficulty, returns <code v-pre>2500000000000000</code> (zkSync does not have proof of work consensus).</li>
</ul>
</div></template>


