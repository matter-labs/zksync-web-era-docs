<template><div><h1 id="l1-l2-communication" tabindex="-1"><a class="header-anchor" href="#l1-l2-communication" aria-hidden="true">#</a> L1 -&gt; L2 communication</h1>
<p>This section describes the interface for interaction with zkSync from L1. It assumes that you are already familiar with the basic concepts of working with the priority queue. If you are new to this topic, you can read the conceptual introduction <RouterLink to="/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue">here</RouterLink>. If you want to dive straight into the code, then you can read the cross-chain governance <RouterLink to="/dev/tutorials/cross-chain-tutorial.html">tutorial</RouterLink>.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="structure" tabindex="-1"><a class="header-anchor" href="#structure" aria-hidden="true">#</a> Structure</h2>
<p>For the most common usecase, there is &quot;baseFee&quot; for a transaction, which basically means the minimum amount the user has to pay to the operator for him to include this transaction. It is derived based on the <code v-pre>ergsLimit</code> for a transaction and the gas price on L1.
In addition, whatever fee the user pays above is called <strong>layer2 tip</strong> and will be used to sort the transactions by the provided L2 fee.</p>
<p>At the moment, all the L1-&gt; L2 transactions are served at the first-in-first-out basis, but in the future we will introduce &quot;priority heap&quot;, which will allow for sorting the
transactions.
Basic costs are defined in gas and not in ETH, so the actual amount of ether that the submission of the transaction will cost depends on
the transaction gas price. Generally the flow for calling any of these methods should be the following:</p>
<ol>
<li>Fetch the gas price that you will use to send the transaction.</li>
<li>Get the base cost for the transaction.</li>
<li>Send the transaction including the needed <code v-pre>value</code>.</li>
</ol>
<h2 id="using-contract-interface-in-your-project" tabindex="-1"><a class="header-anchor" href="#using-contract-interface-in-your-project" aria-hidden="true">#</a> Using contract interface in your project</h2>
<p>To interact with the zkSync mailbox contract using Solidity, you need to use the zkSync contract interface. There are two main ways to get it:</p>
<ul>
<li>By importing it from the <code v-pre>@matterlabs/zksync-contracts</code> npm package (preferred).</li>
<li>By downloading the contracts from the <a href="https://github.com/matter-labs/v2-testnet-contracts" target="_blank" rel="noopener noreferrer">repo<ExternalLinkIcon/></a>.</li>
</ul>
<p>The <code v-pre>@matterlabs/zksync-contracts</code> package can be installed by running the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add -D @matterlabs/zksync-contracts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>In the examples below we assume that the interface is accessed via the <code v-pre>@matterlabs/zksync-contracts</code> npm package.</p>
<h3 id="getting-the-base-cost" tabindex="-1"><a class="header-anchor" href="#getting-the-base-cost" aria-hidden="true">#</a> Getting the base cost</h3>
<p>The following view function returns the amount of ETH that is needed to be supplied by the user to cover the base cost of the transaction.</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">function</span> <span class="token function">l2TransactionBaseCost</span><span class="token punctuation">(</span>
    <span class="token builtin">uint256</span> _gasPrice<span class="token punctuation">,</span>
    <span class="token builtin">uint256</span> _ergsLimit<span class="token punctuation">,</span>
    <span class="token builtin">uint32</span> _calldataLength
<span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">view</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">uint256</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>_gasPrice</code> is a parameter that contains the transaction gas price.</li>
<li><code v-pre>_ergsLimit</code> is a parameter that contains the ergs limit of the transaction call. You can learn more about ergs and the zkSync fee system <RouterLink to="/dev/developer-guides/transactions/fee-model.html">here</RouterLink>.</li>
<li><code v-pre>_calldataLength</code> is a parameter that contains the length of the calldata in bytes.</li>
</ul>
<h3 id="interface" tabindex="-1"><a class="header-anchor" href="#interface" aria-hidden="true">#</a> Interface</h3>
<p>The following function returns the canonical hash or the requested transaction, that can be used to track the execution of the transaction in L2.</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">function</span> <span class="token function">requestL2Transaction</span><span class="token punctuation">(</span>
    <span class="token builtin">address</span> _contractAddressL2<span class="token punctuation">,</span>
    <span class="token builtin">uint256</span> _l2Value<span class="token punctuation">,</span>
    <span class="token builtin">bytes</span> <span class="token keyword">calldata</span> _calldata<span class="token punctuation">,</span>
    <span class="token builtin">uint256</span> _ergsLimit<span class="token punctuation">,</span>
    <span class="token builtin">bytes</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">calldata</span> _factoryDeps
<span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bytes32</span> txHash<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>_contractAddressL2</code> is a parameter that defines the address of the contract to be called.</p>
</li>
<li>
<p><code v-pre>_l2Value</code> is a parameter that defines the amount of ETH you want to pass with the call to L2. This number will be used as <code v-pre>msg.value</code> for the transaction.</p>
</li>
<li>
<p><code v-pre>_calldata</code> is a parameter that contains the calldata of the transaction call. It can be encoded the same way as on Ethereum.</p>
</li>
<li>
<p><code v-pre>_ergsLimit</code> is a parameter that contains the ergs limit of the transaction call. You can learn more about ergs and the zkSync fee system <RouterLink to="/dev/developer-guides/transactions/fee-model.html">here</RouterLink>.</p>
</li>
<li>
<p><code v-pre>_factoryDeps</code> is a list of bytecodes. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts that can be deployed by it.</p>
</li>
</ul>
<p>With the method call, some amount of ETH should be supplied to cover the base cost of the transaction (including the <code v-pre>_l2Value</code>) + layer 2 operator tip.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>A <strong>successful</strong> L1 -&gt; L2 message produces an <code v-pre>L2Log</code> with <code v-pre>key = l2TxHash</code>, and <code v-pre>value = bytes32(1)</code> whereas a <strong>failed</strong> L1 -&gt; L2 message produces an <code v-pre>L2Log</code> with <code v-pre>key = l2TxHash</code>, and <code v-pre>value = bytes32(0)</code>.</p>
</div>
<h3 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h3>
<h4 id="solidity" tabindex="-1"><a class="header-anchor" href="#solidity" aria-hidden="true">#</a> Solidity</h4>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token comment">// Importing zkSync contract interface</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol"</span><span class="token punctuation">;</span>
<span class="token comment">// Importing `Operations` contract which has the `QueueType` type</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l1/contracts/zksync/Operations.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Example</span> <span class="token punctuation">{</span>
    <span class="token keyword">function</span> <span class="token function">callZkSync</span><span class="token punctuation">(</span>
        <span class="token comment">// The address of the zkSync smart contract.</span>
        <span class="token comment">// It is not recommended to hardcode it during the alpha testnet as regenesis may happen.</span>
        <span class="token builtin">address</span> _zkSyncAddress
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> <span class="token keyword">returns</span><span class="token punctuation">(</span><span class="token builtin">bytes32</span> txHash<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        IZkSync zksync <span class="token operator">=</span> <span class="token function">IZkSync</span><span class="token punctuation">(</span>_zkSyncAddress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token builtin">address</span> someL2Contract <span class="token operator">=</span> <span class="token number">0xdba0833e8c4b37cecc177a665e9207962e337299</span><span class="token punctuation">;</span>
        <span class="token comment">// calling L2 smart contract from L1 Example contract</span>
        txHash <span class="token operator">=</span> zksync<span class="token punctuation">.</span>requestL2Transaction<span class="token punctuation">{</span>value<span class="token punctuation">:</span> msg<span class="token punctuation">.</span>value<span class="token punctuation">}</span><span class="token punctuation">(</span>
            <span class="token comment">// The address of the L2 contract to call</span>
            someL2Contract<span class="token punctuation">,</span>
            <span class="token comment">// We pass no ETH with the call</span>
            <span class="token number">0</span><span class="token punctuation">,</span>
            <span class="token comment">// Encoding the calldata for the execute</span>
            abi<span class="token punctuation">.</span><span class="token function">encodeWithSignature</span><span class="token punctuation">(</span><span class="token string">"someMethod()"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
            <span class="token comment">// Ergs limit</span>
            <span class="token number">10000</span><span class="token punctuation">,</span>
            <span class="token comment">// factory dependencies</span>
            <span class="token keyword">new</span> <span class="token class-name">bytes</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="zksync-web3" tabindex="-1"><a class="header-anchor" href="#zksync-web3" aria-hidden="true">#</a> <code v-pre>zksync-web3</code></h4>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers<span class="token punctuation">,</span> BigNumber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">TEST_PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">TEST_PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span>providerL1<span class="token operator">!</span><span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// The calldata can be encoded the same way as for Ethereum</span>
<span class="token keyword">const</span> calldata <span class="token operator">=</span> <span class="token string">"0x..."</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ergsLimit <span class="token operator">=</span> BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> txCostPrice <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBaseCost</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  gasPrice<span class="token punctuation">,</span>
  calldataLength<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">hexDataLength</span><span class="token punctuation">(</span>calldata<span class="token punctuation">)</span><span class="token punctuation">,</span>
  ergsLimit<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Executing the transaction will cost </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">formatEther</span><span class="token punctuation">(</span>txCostPrice<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> ETH</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// initiating L2 transfer via L1 execute from zksync wallet</span>
<span class="token keyword">const</span> someL2Contract <span class="token operator">=</span> <span class="token string">"0x19a5bfcbe15f98aa073b9f81b58466521479df8d"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> executeTx <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">requestExecute</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  calldata<span class="token punctuation">,</span>
  ergsLimit<span class="token punctuation">,</span>
  contractAddress<span class="token operator">:</span> someL2Contract<span class="token punctuation">,</span>
  overrides<span class="token operator">:</span> <span class="token punctuation">{</span>
    gasPrice<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> executeTx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


