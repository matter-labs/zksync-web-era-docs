<template><div><h1 id="accounts-l1-l2-transactions" tabindex="-1"><a class="header-anchor" href="#accounts-l1-l2-transactions" aria-hidden="true">#</a> Accounts: L1-&gt;L2 transactions</h1>
<p>This section explores the methods which allow the <RouterLink to="/api/js/accounts.html">account</RouterLink> classes to send transactions from L1 to L2.</p>
<p>If you want to get some background on how L1-&gt;L2 interaction works on zkSync, go through the <RouterLink to="/dev/developer-guides/bridging/l1-l2-interop.html">introduction</RouterLink> and the <RouterLink to="/dev/developer-guides/bridging/l1-l2.html">guide</RouterLink>.</p>
<h2 id="supported-classes" tabindex="-1"><a class="header-anchor" href="#supported-classes" aria-hidden="true">#</a> Supported classes</h2>
<p>The following account classes support sending transactions from L1 to L2:</p>
<ul>
<li><code v-pre>Wallet</code> (if connected to an L1 provider)</li>
<li><code v-pre>L1Signer</code></li>
</ul>
<h2 id="approving-deposit-of-tokens" tabindex="-1"><a class="header-anchor" href="#approving-deposit-of-tokens" aria-hidden="true">#</a> Approving deposit of tokens</h2>
<p>Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">approveERC20</span><span class="token punctuation">(</span>
    token<span class="token operator">:</span> Address<span class="token punctuation">,</span>
    amount<span class="token operator">:</span> BigNumberish<span class="token punctuation">,</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>Overrides <span class="token operator">&amp;</span> <span class="token punctuation">{</span> bridgeAddress<span class="token operator">?</span><span class="token operator">:</span> Address <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>TransactionResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="inputs-and-outputs" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs" aria-hidden="true">#</a> Inputs and outputs</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>The Ethereum address of the token.</td>
</tr>
<tr>
<td>amount</td>
<td>The amount of the token to be approved.</td>
</tr>
<tr>
<td>overrides (optional)</td>
<td>Ethereum transaction overrides. May be used to pass <code v-pre>gasLimit</code>, <code v-pre>gasPrice</code>, etc. You can also provide a custom address of the L1 bridge to use (the bridge provided by the Matter Labs team is used by default).</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>ethers.providers.TransactionResponse</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">USDC_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"0xd35cceead182dcee0f148ebac9447da2c4d449c4"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> txHandle <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">approveERC20</span><span class="token punctuation">(</span>
  <span class="token constant">USDC_ADDRESS</span><span class="token punctuation">,</span>
  <span class="token string">"10000000"</span> <span class="token comment">// 10.0 USDC</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> txHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="depositing-tokens-to-zksync" tabindex="-1"><a class="header-anchor" href="#depositing-tokens-to-zksync" aria-hidden="true">#</a> Depositing tokens to zkSync</h2>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">deposit</span><span class="token punctuation">(</span>transaction<span class="token operator">:</span> <span class="token punctuation">{</span>
  token<span class="token operator">:</span> Address<span class="token punctuation">;</span>
  amount<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
  to<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
  operatorTip<span class="token operator">?</span><span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
  bridgeAddress<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
  approveERC20<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
  overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>PayableOverrides<span class="token punctuation">;</span>
  approveOverrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>Overrides<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>PriorityOpResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-1" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-1" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>transaction.token</td>
<td>The address of the token to deposit.</td>
</tr>
<tr>
<td>transaction.amount</td>
<td>The amount of the token to be deposited.</td>
</tr>
<tr>
<td><a href="http://transaction.to" target="_blank" rel="noopener noreferrer">transaction.to<ExternalLinkIcon/></a> (optional)</td>
<td>The address that will receive the deposited tokens on L2.</td>
</tr>
<tr>
<td>transaction.operatorTip (optional)</td>
<td>If the ETH <code v-pre>value</code> passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the <code v-pre>Deque</code> type of queue, but it will be used to prioritize the transactions that get into the <code v-pre>Heap</code> or <code v-pre>HeapBuffer</code> queues.</td>
</tr>
<tr>
<td>transaction.bridgeAddress (optional)</td>
<td>The address of the bridge contract to be used. Defaults to the default zkSync bridge (either <code v-pre>L1EthBridge</code> or <code v-pre>L1Erc20Bridge</code>).</td>
</tr>
<tr>
<td>transaction.approveERC20 (optional)</td>
<td>Whether or not should the token approval be performed under the hood. Set this flag to <code v-pre>true</code> if you bridge an ERC20 token and didn't call the <code v-pre>approveERC20</code> function beforehand.</td>
</tr>
<tr>
<td>transaction.overrides (optional)</td>
<td>Ethereum transaction overrides. May be used to pass <code v-pre>gasLimit</code>, <code v-pre>gasPrice</code>, etc.</td>
</tr>
<tr>
<td>transaction.approveOverrides (optional)</td>
<td>Ethereum transaction overrides of the approval transaction. May be used to pass <code v-pre>gasLimit</code>, <code v-pre>gasPrice</code>, etc.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>PriorityOpResponse</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">USDC_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"0xd35cceead182dcee0f148ebac9447da2c4d449c4"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> usdcDepositHandle <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  token<span class="token operator">:</span> <span class="token constant">USDC_ADDRESS</span><span class="token punctuation">,</span>
  amount<span class="token operator">:</span> <span class="token string">"10000000"</span><span class="token punctuation">,</span>
  approveERC20<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Note that we wait not only for the L1 transaction to complete but also for it to be</span>
<span class="token comment">// processed by zkSync. If we want to wait only for the transaction to be processed on L1,</span>
<span class="token comment">// we can use `await usdcDepositHandle.waitL1Commit()`</span>
<span class="token keyword">await</span> usdcDepositHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ethDepositHandle <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  token<span class="token operator">:</span> zksync<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token constant">ETH_ADDRESS</span><span class="token punctuation">,</span>
  amount<span class="token operator">:</span> <span class="token string">"10000000"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Note that we wait not only for the L1 transaction to complete but also for it to be</span>
<span class="token comment">// processed by zkSync. If we want to wait only for the transaction to be processed on L1,</span>
<span class="token comment">// we can use `await ethDepositHandle.waitL1Commit()`</span>
<span class="token keyword">await</span> ethDepositHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="adding-native-token-to-zksync" tabindex="-1"><a class="header-anchor" href="#adding-native-token-to-zksync" aria-hidden="true">#</a> Adding native token to zkSync</h2>
<p>New tokens are added automatically the first time they are deposited.</p>
<h2 id="finalizing-withdrawals" tabindex="-1"><a class="header-anchor" href="#finalizing-withdrawals" aria-hidden="true">#</a> Finalizing withdrawals</h2>
<p>Withdrawals are executed in 2 steps - initiated on L2 and finalized on L1.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">finalizeWithdrawal</span><span class="token punctuation">(</span>withdrawalHash<span class="token operator">:</span> BytesLike<span class="token punctuation">,</span> index<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ethers<span class="token punctuation">.</span>TransactionResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-2" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-2" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>withdrawalHash</td>
<td>Hash of the L2 transaction where the withdrawal was initiated.</td>
</tr>
<tr>
<td>index (optional)</td>
<td>In case there where multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize (defaults to 0)</td>
</tr>
</tbody>
</table>
<h2 id="force-executing-transactions-on-l2" tabindex="-1"><a class="header-anchor" href="#force-executing-transactions-on-l2" aria-hidden="true">#</a> Force-executing transactions on L2</h2>
<h3 id="getting-the-base-cost-for-a-transaction" tabindex="-1"><a class="header-anchor" href="#getting-the-base-cost-for-a-transaction" aria-hidden="true">#</a> Getting the base cost for a transaction</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBaseCost</span><span class="token punctuation">(</span>params<span class="token operator">:</span> <span class="token punctuation">{</span>
    ergsLimit<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    calldataLength<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    gasPrice<span class="token operator">?</span><span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-3" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-3" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>params.ergsLimit</td>
<td>The <code v-pre>ergsLimit</code> for the call.</td>
</tr>
<tr>
<td>params.calldataLength</td>
<td>The length of the calldata in bytes.</td>
</tr>
<tr>
<td>params.gasPrice (optional)</td>
<td>The gas price of the L1 transaction that will send the request for an execute call.</td>
</tr>
<tr>
<td>returns</td>
<td>The base cost in ETH for requesting the contract call.</td>
</tr>
</tbody>
</table>
<h2 id="claim-failed-deposit" tabindex="-1"><a class="header-anchor" href="#claim-failed-deposit" aria-hidden="true">#</a> Claim Failed Deposit</h2>
<p>The <code v-pre>claimFailedDeposit</code> method withdraws funds from the initiated deposit, which failed when finalizing on L2.<br>
If the deposit L2 transaction has failed, it sends an L1 transaction calling <code v-pre>claimFailedDeposit</code> method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws the error.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">claimFailedDeposit</span><span class="token punctuation">(</span>depositHash<span class="token operator">:</span> BytesLike<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ethers<span class="token punctuation">.</span>ContractTransaction<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="input-parameters" tabindex="-1"><a class="header-anchor" href="#input-parameters" aria-hidden="true">#</a> Input Parameters</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>depositHash</td>
<td><code v-pre>bytes32</code></td>
<td>The  L2 transaction hash of the failed deposit.</td>
</tr>
</tbody>
</table>
<h3 id="requesting-transaction-execution" tabindex="-1"><a class="header-anchor" href="#requesting-transaction-execution" aria-hidden="true">#</a> Requesting transaction execution</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">requestExecute</span><span class="token punctuation">(</span>transaction<span class="token operator">:</span> <span class="token punctuation">{</span>
    contractAddress<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    calldata<span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
    ergsLimit<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    factoryDeps<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>BytesLike<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    operatorTip<span class="token operator">?</span><span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>CallOverrides<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>PriorityOpResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-4" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-4" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>transaction.contractAddress</td>
<td>The address of the L2 contract to call.</td>
</tr>
<tr>
<td>transaction.calldata</td>
<td>The calldata of the call transaction. It can be encoded the same way as in Ethereum.</td>
</tr>
<tr>
<td>transaction.ergsLimit</td>
<td>The <code v-pre>ergsLimit</code> for the call.</td>
</tr>
<tr>
<td>transaction.factoryDeps</td>
<td>Array of bytecodes of factory dependencies - only used for transactions that deploy contracts.</td>
</tr>
<tr>
<td>transaction.operatorTip (optional)</td>
<td>If the ETH <code v-pre>value</code> passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the <code v-pre>Deque</code> type of queue, but it will be used to prioritize the transactions that get into the <code v-pre>Heap</code> or <code v-pre>HeapBuffer</code> queues.</td>
</tr>
<tr>
<td>overrides (optional)</td>
<td>Ethereum transaction overrides. May be used to pass <code v-pre>gasLimit</code>, <code v-pre>gasPrice</code> etc.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>PriorityOpResponse</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> BigNumber<span class="token punctuation">,</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span>providerL1<span class="token operator">!</span><span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// The calldata can be encoded the same way as for Ethereum.</span>
<span class="token comment">// Here is an example on how to get the calldata from an ABI:</span>
<span class="token keyword">const</span> abi <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    inputs<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    name<span class="token operator">:</span> <span class="token string">"increment"</span><span class="token punctuation">,</span>
    outputs<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    stateMutability<span class="token operator">:</span> <span class="token string">"nonpayable"</span><span class="token punctuation">,</span>
    type<span class="token operator">:</span> <span class="token string">"function"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> contractInterface <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">Interface</span><span class="token punctuation">(</span>abi<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> calldata <span class="token operator">=</span> contractInterface<span class="token punctuation">.</span><span class="token function">encodeFunctionData</span><span class="token punctuation">(</span><span class="token string">"increment"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ergsLimit <span class="token operator">=</span> BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> txCostPrice <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBaseCost</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  gasPrice<span class="token punctuation">,</span>
  calldataLength<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">arrayify</span><span class="token punctuation">(</span>calldata<span class="token punctuation">)</span><span class="token punctuation">.</span>length<span class="token punctuation">,</span>
  ergsLimit<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Executing the transaction will cost </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">formatEther</span><span class="token punctuation">(</span>txCostPrice<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> ETH</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> executeTx <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">requestExecute</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  calldata<span class="token punctuation">,</span>
  ergsLimit<span class="token punctuation">,</span>
  contractAddress<span class="token operator">:</span> <span class="token string">"0x19a5bfcbe15f98aa073b9f81b58466521479df8d"</span><span class="token punctuation">,</span>
  overrides<span class="token operator">:</span> <span class="token punctuation">{</span>
    gasPrice<span class="token punctuation">,</span>
    value<span class="token operator">:</span> txCostPrice<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> executeTx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


