<template><div><h1 id="migration-to-the-testnet-paymaster" tabindex="-1"><a class="header-anchor" href="#migration-to-the-testnet-paymaster" aria-hidden="true">#</a> Migration to the testnet paymaster</h1>
<h2 id="prerequisite" tabindex="-1"><a class="header-anchor" href="#prerequisite" aria-hidden="true">#</a> Prerequisite</h2>
<p>Before going further into this section, please ensure you have read about
<RouterLink to="/dev/developer-guides/aa.html#paymasters">paymasters</RouterLink>.</p>
<p>While the previous iterations of zkSync 2.0 testnet natively supported paying fees in different tokens, it caused several compatibility issues with the Ethereum ecosystem. With the advent of the <RouterLink to="/dev/developer-guides/aa.html#paymasters">paymasters</RouterLink>, this feature has become redundant as now anybody can deploy their paymaster smart contract that will swap ERC-20 tokens to ETH on the fly. You can read the tutorial on deploying custom paymasters <RouterLink to="/dev/tutorials/custom-paymaster-tutorial.html">here</RouterLink>.</p>
<p>For the sake of supporting the ecosystem, zkSync does not plan to deploy any paymaster on mainnet. However, with better DevEx in mind, we have deployed one on the testnet. The testnet paymaster enables paying fees in an ERC-20 compatible token at a 1:1 exchange rate. You can read the documentation <RouterLink to="/dev/developer-guides/aa.html#testnet-paymaster">here</RouterLink>. In this section, we show a brief example on migration from the old way of paying fees with ERC20 tokens to the new ones.</p>
<p>This document is about the testnet paymaster <em>only</em>. When deploying your project on mainnet, you will need to either deploy your paymaster or find a 3rd party's one and read its documentation.</p>
<h2 id="previous-interface" tabindex="-1"><a class="header-anchor" href="#previous-interface" aria-hidden="true">#</a> Previous interface</h2>
<p>In the previous testnet versions, you provided <code v-pre>feeToken</code> in the overrides of the transaction, so a smart contract call that paid fees in USDC, for example, looked roughly like this:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> contract<span class="token punctuation">.</span><span class="token function">callMethod</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">customData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">feeToken</span><span class="token operator">:</span> <span class="token constant">USDC_ADDRESS</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="using-testnet-paymaster" tabindex="-1"><a class="header-anchor" href="#using-testnet-paymaster" aria-hidden="true">#</a> Using testnet paymaster</h2>
<p>Working with the testnet paymaster consists of three steps:</p>
<ol>
<li>Retrieving the address of the testnet paymaster.</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> testnetPaymaster <span class="token operator">=</span> <span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Note: Caching the paymaster's address is not recommended, since it may change without a warning.</p>
<ol start="2">
<li>Encoding the paymaster parameters to be used in the transaction. For this you can the <code v-pre>utils.getPaymasterParams</code> method:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'zksync-web3'</span>

<span class="token keyword">const</span> paymasterParams <span class="token operator">=</span> utils<span class="token punctuation">.</span><span class="token function">getPaymasterParams</span><span class="token punctuation">(</span>testnetPaymaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'ApprovalBased'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">token</span><span class="token operator">:</span> <span class="token constant">USDC_ADDRESS</span><span class="token punctuation">,</span>
    <span class="token comment">// Note, that the allowance for the testnet paymaster must be</span>
    <span class="token comment">// at least maxFeePerErg * gasLimit, where maxFeePerErg and gasLimit</span>
    <span class="token comment">// are parameters used in the transaction.</span>
    <span class="token literal-property property">minimalAllowance</span><span class="token operator">:</span> maxFeePerErg<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasLimit<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">innerInput</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>Sending the transaction with the provided paymaster params:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> contract<span class="token punctuation">.</span><span class="token function">callMethod</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">customData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        paymasterParams
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


