<template><div><h1 id="zksync-features" tabindex="-1"><a class="header-anchor" href="#zksync-features" aria-hidden="true">#</a> zkSync features</h1>
<p>While zkSync is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:</p>
<ul>
<li>Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).</li>
<li>Deployment transactions require the contracts' bytecode to be passed in a separate field.</li>
<li>The fee system is somewhat different.</li>
</ul>
<p>These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP712 transactions since <a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">EIP712<ExternalLinkIcon/></a> is used to sign them. You can look at the internal structure of the EIP712 transactions <RouterLink to="/api/api.html#eip712">here</RouterLink>.</p>
<p>This document will focus solely on how to pass these arguments to the SDK.</p>
<h2 id="overrides" tabindex="-1"><a class="header-anchor" href="#overrides" aria-hidden="true">#</a> Overrides</h2>
<p><code v-pre>ethers</code> has a notion of overrides. For any on-chain transaction, <code v-pre>ethers</code> finds the optimal <code v-pre>gasPrice</code>, <code v-pre>gasLimit</code>, <code v-pre>nonce</code>, and other important fields under the hood. But sometimes, you may have a need to explicitly provide these values (you want to set a smaller <code v-pre>gasPrice</code> for instance, or sign a transaction with future <code v-pre>nonce</code>).</p>
<p>In this case, you can provide an <code v-pre>Overrides</code> object as the last parameter. There you can supply fields like <code v-pre>gasPrice</code>, <code v-pre>gasLimit</code>, <code v-pre>nonce</code> etc.</p>
<p>In order to make the SDK as flexible as possible, the library uses the overrides to supply zkSync-specific fields. To supply zkSync-specific fields, you need to pass the following override:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token punctuation">{</span>
    customData<span class="token operator">:</span> <span class="token punctuation">{</span>
        ergsPerPubdata<span class="token operator">?</span><span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
        factoryDeps<span class="token operator">?</span><span class="token operator">:</span> BytesLike<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        customSignature<span class="token operator">?</span><span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
        paymasterParams<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            paymaster<span class="token operator">:</span> Address<span class="token punctuation">;</span>
            paymasterInput<span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Examples:</p>
<p>Override to deploy a contract with bytecode <code v-pre>0xcde...12</code> and enforce that the operator will not charge more than <code v-pre>100</code> ergs per published bytes on layer 1:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token punctuation">{</span>
    customData<span class="token operator">:</span> <span class="token punctuation">{</span>
        ergsPerPubdata<span class="token operator">:</span> <span class="token string">"100"</span><span class="token punctuation">,</span>
        factoryDeps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"0xcde...12"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Use custom signature <code v-pre>0x123456</code> for account, while using paymaster with address <code v-pre>0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC</code> and paymaster input <code v-pre>0x8c5a3445</code>:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token punctuation">{</span>
    customData<span class="token operator">:</span> <span class="token punctuation">{</span>
        customSignature<span class="token operator">:</span> <span class="token string">"0x123456"</span><span class="token punctuation">,</span>
        paymasterParams<span class="token operator">:</span> <span class="token punctuation">{</span>
            paymaster<span class="token operator">:</span> <span class="token string">"0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC"</span><span class="token punctuation">,</span>
            paymasterInput<span class="token operator">:</span> <span class="token string">"0x8c5a3445"</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="encoding-paymaster-params" tabindex="-1"><a class="header-anchor" href="#encoding-paymaster-params" aria-hidden="true">#</a> Encoding paymaster params</h2>
<p>While the paymaster feature by itself does not impose any limitations on values of the <code v-pre>paymasterInput</code>, the Matter Labs team endorses certain types of <RouterLink to="/dev/developer-guides/aa.html#built-in-paymaster-flows">paymaster flows</RouterLink> that are processable by EOAs.</p>
<p>zkSync SDK provides a utility method that can be used to get the correctly formed <code v-pre>paymasterParams</code> object: <RouterLink to="/api/js/utils.html#encoding-paymaster-params">getPaymasterParams</RouterLink>.</p>
<h2 id="see-in-action" tabindex="-1"><a class="header-anchor" href="#see-in-action" aria-hidden="true">#</a> See in action</h2>
<p>If you want to call the method <code v-pre>setGreeting</code> of an ethers <code v-pre>Contract</code> object called <code v-pre>greeter</code>, this would look the following way, while paying fees with the <RouterLink to="/dev/developer-guides/aa.html#testnet-paymaster">testnet paymaster</RouterLink>:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// The `setGreeting` method has a single parameter -- new greeting</span>
<span class="token comment">// We will set its value as `a new greeting`.</span>
<span class="token keyword">const</span> greeting <span class="token operator">=</span> <span class="token string">"a new greeting"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> greeter<span class="token punctuation">.</span>populateTransaction<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span>greeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> sender<span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> gasLimit <span class="token operator">=</span> <span class="token keyword">await</span> greeter<span class="token punctuation">.</span>estimateGas<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span>greeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> fee <span class="token operator">=</span> gasPrice<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasLimit<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> paymasterParams <span class="token operator">=</span> utils<span class="token punctuation">.</span><span class="token function">getPaymasterParams</span><span class="token punctuation">(</span>testnetPaymaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'ApprovalBased'</span><span class="token punctuation">,</span>
    token<span class="token punctuation">,</span>
    <span class="token literal-property property">minimalAllowance</span><span class="token operator">:</span> fee<span class="token punctuation">,</span>
    <span class="token literal-property property">innerInput</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> sentTx <span class="token operator">=</span> <span class="token keyword">await</span> sender<span class="token punctuation">.</span><span class="token function">sendTransaction</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token operator">...</span>tx<span class="token punctuation">,</span>
    <span class="token literal-property property">maxFeePerGas</span><span class="token operator">:</span> gasPrice<span class="token punctuation">,</span>
    <span class="token literal-property property">maxPriorityFeePerGas</span><span class="token operator">:</span> BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    gasLimit<span class="token punctuation">,</span>
    <span class="token literal-property property">customData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">ergsPerPubdata</span><span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">DEFAULT_ERGS_PER_PUBDATA_LIMIT</span><span class="token punctuation">,</span>
        paymasterParams
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You can also check out our <RouterLink to="/dev/developer-guides/hello-world.html">tutorial</RouterLink> on the full-fledged mini-dApp, where users can choose token to pay the fee.</p>
</div></template>


