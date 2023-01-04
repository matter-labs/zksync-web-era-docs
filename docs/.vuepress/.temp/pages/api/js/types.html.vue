<template><div><h1 id="types" tabindex="-1"><a class="header-anchor" href="#types" aria-hidden="true">#</a> Types</h1>
<p>All the types which are used in the SDK are referenced here:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> BytesLike<span class="token punctuation">,</span> BigNumberish<span class="token punctuation">,</span> providers<span class="token punctuation">,</span> BigNumber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ethers'</span><span class="token punctuation">;</span>

<span class="token comment">// 0x-prefixed, hex encoded, ethereum account address</span>
<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">Address</span> <span class="token operator">=</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token comment">// 0x-prefixed, hex encoded, ECDSA signature.</span>
<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">Signature</span> <span class="token operator">=</span> <span class="token builtin">string</span><span class="token punctuation">;</span>

<span class="token comment">// Ethereum network</span>
<span class="token keyword">export</span> <span class="token keyword">enum</span> Network <span class="token punctuation">{</span>
    Mainnet <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span>
    Ropsten <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">,</span>
    Rinkeby <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">,</span>
    Goerli <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">,</span>
    Localhost <span class="token operator">=</span> <span class="token number">9</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">enum</span> TransactionStatus <span class="token punctuation">{</span>
    NotFound <span class="token operator">=</span> <span class="token string">'not-found'</span><span class="token punctuation">,</span>
    Processing <span class="token operator">=</span> <span class="token string">'processing'</span><span class="token punctuation">,</span>
    Committed <span class="token operator">=</span> <span class="token string">'committed'</span><span class="token punctuation">,</span>
    Finalized <span class="token operator">=</span> <span class="token string">'finalized'</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">PaymasterParams</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    paymaster<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    paymasterInput<span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">Eip712Meta</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    ergsPerPubdata<span class="token operator">?</span><span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    factoryDeps<span class="token operator">?</span><span class="token operator">:</span> BytesLike<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    customSignature<span class="token operator">?</span><span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
    paymasterParams<span class="token operator">?</span><span class="token operator">:</span> PaymasterParams<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// prettier-ignore</span>
<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">BlockTag</span> <span class="token operator">=</span>
    <span class="token operator">|</span> <span class="token builtin">number</span>
    <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token comment">// hex number</span>
    <span class="token operator">|</span> <span class="token string">'committed'</span>
    <span class="token operator">|</span> <span class="token string">'finalized'</span>
    <span class="token operator">|</span> <span class="token string">'latest'</span>
    <span class="token operator">|</span> <span class="token string">'earliest'</span>
    <span class="token operator">|</span> <span class="token string">'pending'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">DeploymentType</span> <span class="token operator">=</span> <span class="token string">'create'</span> <span class="token operator">|</span> <span class="token string">'createAccount'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">Token</span> <span class="token punctuation">{</span>
    l1Address<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    l2Address<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/** <span class="token keyword">@deprecated</span> This field is here for backward compatibility - please use l2Address field instead */</span>
    address<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
    <span class="token builtin">symbol</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
    decimals<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">MessageProof</span> <span class="token punctuation">{</span>
    id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    proof<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    root<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">EventFilter</span> <span class="token punctuation">{</span>
    topics<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span><span class="token punctuation">;</span>
    address<span class="token operator">?</span><span class="token operator">:</span> Address <span class="token operator">|</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>Address<span class="token operator">></span><span class="token punctuation">;</span>
    limit<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    fromBlock<span class="token operator">?</span><span class="token operator">:</span> BlockTag<span class="token punctuation">;</span>
    toBlock<span class="token operator">?</span><span class="token operator">:</span> BlockTag<span class="token punctuation">;</span>
    blockHash<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">TransactionResponse</span> <span class="token keyword">extends</span> <span class="token class-name">providers</span><span class="token punctuation">.</span>TransactionResponse <span class="token punctuation">{</span>
    <span class="token function">waitFinalize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>providers<span class="token punctuation">.</span>TransactionReceipt<span class="token operator">></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">TransactionRequest</span> <span class="token operator">=</span> providers<span class="token punctuation">.</span>TransactionRequest <span class="token operator">&amp;</span> <span class="token punctuation">{</span> customData<span class="token operator">?</span><span class="token operator">:</span> Eip712Meta <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">PriorityOpResponse</span> <span class="token keyword">extends</span> <span class="token class-name">TransactionResponse</span> <span class="token punctuation">{</span>
    <span class="token function">waitL1Commit</span><span class="token punctuation">(</span>confirmation<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>providers<span class="token punctuation">.</span>TransactionReceipt<span class="token operator">></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">BalancesMap</span> <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> BigNumber <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">DeploymentInfo</span> <span class="token punctuation">{</span>
    sender<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    bytecodeHash<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
    deployedAddress<span class="token operator">:</span> Address<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ApprovalBasedPaymasterInput</span> <span class="token punctuation">{</span>
    type<span class="token operator">:</span> <span class="token string">'ApprovalBased'</span><span class="token punctuation">;</span>
    token<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    minimalAllowance<span class="token operator">:</span> BigNumber<span class="token punctuation">;</span>
    innerInput<span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">GeneralPaymasterInput</span> <span class="token punctuation">{</span>
    type<span class="token operator">:</span> <span class="token string">'General'</span><span class="token punctuation">;</span>
    innerInput<span class="token operator">:</span> BytesLike<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">PaymasterInput</span> <span class="token operator">=</span> ApprovalBasedPaymasterInput <span class="token operator">|</span> GeneralPaymasterInput<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


