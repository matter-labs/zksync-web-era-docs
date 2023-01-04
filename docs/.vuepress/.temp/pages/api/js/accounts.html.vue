<template><div><h1 id="accounts-overview" tabindex="-1"><a class="header-anchor" href="#accounts-overview" aria-hidden="true">#</a> Accounts: overview</h1>
<p><code v-pre>zksync-web3</code> exports four classes that can sign transactions on zkSync:</p>
<ul>
<li><code v-pre>Wallet</code> class is an extension of the <code v-pre>ethers.Wallet</code> with additional zkSync features.</li>
<li><code v-pre>EIP712Signer</code> class that is used to sign <code v-pre>EIP712</code>-typed zkSync transactions.</li>
<li><code v-pre>Signer</code> and <code v-pre>L1Signer</code> classes, which should be used for browser integration.</li>
</ul>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="wallet" tabindex="-1"><a class="header-anchor" href="#wallet" aria-hidden="true">#</a> <code v-pre>Wallet</code></h2>
<h3 id="creating-wallet-from-a-private-key" tabindex="-1"><a class="header-anchor" href="#creating-wallet-from-a-private-key" aria-hidden="true">#</a> Creating wallet from a private key</h3>
<p>Just like <code v-pre>ethers.Wallet</code>, the <code v-pre>Wallet</code> object from <code v-pre>zksync-web3</code> can be created from Ethereum private key.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token function">constructor</span><span class="token punctuation">(</span>
    privateKey<span class="token operator">:</span> ethers<span class="token punctuation">.</span>BytesLike <span class="token operator">|</span> utils<span class="token punctuation">.</span>SigningKey<span class="token punctuation">,</span>
    providerL2<span class="token operator">?</span><span class="token operator">:</span> Provider<span class="token punctuation">,</span>
    providerL1<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>Provider
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>privateKey</td>
<td>The private key of the Ethereum account.</td>
</tr>
<tr>
<td>providerL2 (optional)</td>
<td>A zkSync node provider. Needed for interaction with zkSync.</td>
</tr>
<tr>
<td>providerL1 (optional)</td>
<td>An Ethereum node provider. Needed for interaction with L1.</td>
</tr>
<tr>
<td>returns</td>
<td>The new <code v-pre>Wallet</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="other-ways-to-create-wallet-instances" tabindex="-1"><a class="header-anchor" href="#other-ways-to-create-wallet-instances" aria-hidden="true">#</a> Other ways to create <code v-pre>Wallet</code> instances</h3>
<p>The <code v-pre>Wallet</code> class supports all the methods from <code v-pre>ethers.Wallet</code> for creating wallets, e.g. creating from mnemonic, creating from encrypted JSON, creating a random wallet, etc. All these methods take the same parameters as <code v-pre>ethers.Wallet</code>, so you should refer to its documentation on how to use them.</p>
<h3 id="connecting-to-the-zksync-provider" tabindex="-1"><a class="header-anchor" href="#connecting-to-the-zksync-provider" aria-hidden="true">#</a> Connecting to the zkSync provider</h3>
<p>To interact with the zkSync network, the <code v-pre>Wallet</code> object should be connected to a <code v-pre>Provider</code> by either passing it to the constructor or with the <code v-pre>connect</code> method.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token function">connect</span><span class="token punctuation">(</span>provider<span class="token operator">:</span> Provider<span class="token punctuation">)</span><span class="token operator">:</span> Wallet
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-1" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-1" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>provider</td>
<td>A zkSync node provider.</td>
</tr>
<tr>
<td>returns</td>
<td>A new <code v-pre>Wallet</code> object, connected to zkSync.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> unconnectedWallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> unconnectedWallet<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span>provider<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="connecting-to-the-ethereum-provider" tabindex="-1"><a class="header-anchor" href="#connecting-to-the-ethereum-provider" aria-hidden="true">#</a> Connecting to the Ethereum provider</h3>
<p>To perform L1 operations, the <code v-pre>Wallet</code> object needs to be connected to an <code v-pre>ethers.providers.Provider</code> object.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token function">connectToL1</span><span class="token punctuation">(</span>provider<span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>Provider<span class="token punctuation">)</span>
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
<td>provider</td>
<td>An Ethereum node provider.</td>
</tr>
<tr>
<td>returns</td>
<td>A new <code v-pre>Wallet</code> object, connected to Ethereum.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> unconnectedWallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ethProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> unconnectedWallet<span class="token punctuation">.</span><span class="token function">connectToL1</span><span class="token punctuation">(</span>ethProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>It is possible to chain <code v-pre>connect</code> and <code v-pre>connectToL1</code> methods:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> wallet <span class="token operator">=</span> unconnectedWallet<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span>provider<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">connectToL1</span><span class="token punctuation">(</span>ethProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="getting-the-zksync-l1-smart-contract" tabindex="-1"><a class="header-anchor" href="#getting-the-zksync-l1-smart-contract" aria-hidden="true">#</a> Getting the zkSync L1 smart contract</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getMainContract</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Contract<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-3" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-3" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>returns</td>
<td><code v-pre>Contract</code> wrapper of the zkSync smart contract.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> contract <span class="token operator">=</span> <span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getMainContract</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span>address<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-token-balance" tabindex="-1"><a class="header-anchor" href="#getting-token-balance" aria-hidden="true">#</a> Getting token balance</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBalance</span><span class="token punctuation">(</span>token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">,</span> blockTag<span class="token operator">:</span> BlockTag <span class="token operator">=</span> <span class="token string">'committed'</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-4" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-4" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token (optional)</td>
<td>The address of the token. ETH by default.</td>
</tr>
<tr>
<td>blockTag (optional)</td>
<td>The block the balance should be checked on. <code v-pre>committed</code>, i.e. the latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The amount of the token the <code v-pre>Wallet</code> has.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in USDC</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token constant">USDC_L2_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in ETH</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-token-balance-on-l1" tabindex="-1"><a class="header-anchor" href="#getting-token-balance-on-l1" aria-hidden="true">#</a> Getting token balance on L1</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBalanceL1</span><span class="token punctuation">(</span>token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">,</span> blockTag<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>BlockTag<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-5" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-5" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token (optional)</td>
<td>The address of the token. ETH by default.</td>
</tr>
<tr>
<td>blockTag (optional)</td>
<td>The block the balance should be checked on. The latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The amount of the token the <code v-pre>Wallet</code> has on Ethereum.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in USDC</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBalanceL1</span><span class="token punctuation">(</span><span class="token constant">USDC_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in ETH</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getBalanceL1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-a-nonce" tabindex="-1"><a class="header-anchor" href="#getting-a-nonce" aria-hidden="true">#</a> Getting a nonce</h3>
<p><code v-pre>Wallet</code> also provides the <code v-pre>getNonce</code> method which is an alias for <a href="https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount" target="_blank" rel="noopener noreferrer">getTransactionCount<ExternalLinkIcon/></a>.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getNonce</span><span class="token punctuation">(</span>blockTag<span class="token operator">?</span><span class="token operator">:</span> BlockTag<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-6" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-6" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>blockTag (optional)</td>
<td>The block the nonce should be got on. <code v-pre>committed</code>, i.e. the latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The amount of the token the <code v-pre>Wallet</code> has.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Note that we don't need ethereum provider to get the nonce</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> wallet<span class="token punctuation">.</span><span class="token function">getNonce</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="transfering-tokens-inside-zksync" tabindex="-1"><a class="header-anchor" href="#transfering-tokens-inside-zksync" aria-hidden="true">#</a> Transfering tokens inside zkSync</h3>
<p>For convenience, the <code v-pre>Wallet</code> class has <code v-pre>transfer</code> method, which can transfer <code v-pre>ETH</code> or any <code v-pre>ERC20</code> token within the same interface.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">transfer</span><span class="token punctuation">(</span>tx<span class="token operator">:</span> <span class="token punctuation">{</span>
    to<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    amount<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>CallOverrides<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>TransactionResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-7" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-7" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="http://tx.to" target="_blank" rel="noopener noreferrer">tx.to<ExternalLinkIcon/></a></td>
<td>The address of the recipient.</td>
</tr>
<tr>
<td>tx.amount</td>
<td>The amount of the token to transfer.</td>
</tr>
<tr>
<td>token (optional)</td>
<td>The address of the token. <code v-pre>ETH</code> by default.</td>
</tr>
<tr>
<td>overrides (optional)</td>
<td>Transaction overrides, such as <code v-pre>nonce</code>, <code v-pre>gasLimit</code> etc.</td>
</tr>
<tr>
<td>returns</td>
<td>A <code v-pre>TransactionResponse</code> object</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> recipient <span class="token operator">=</span> zksync<span class="token punctuation">.</span>Wallet<span class="token punctuation">.</span><span class="token function">createRandom</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// We transfer 0.01 ETH to the recipient and pay the fee in USDC</span>
<span class="token keyword">const</span> transferHandle <span class="token operator">=</span> wallet<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  to<span class="token operator">:</span> recipient<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
  amount<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">parseEther</span><span class="token punctuation">(</span><span class="token string">"0.01"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="initiating-a-withdrawal-to-l1" tabindex="-1"><a class="header-anchor" href="#initiating-a-withdrawal-to-l1" aria-hidden="true">#</a> Initiating a withdrawal to L1</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">withdraw</span><span class="token punctuation">(</span>transaction<span class="token operator">:</span> <span class="token punctuation">{</span>
    token<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    amount<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    to<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    bridgeAddress<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>CallOverrides<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>TransactionResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="http://tx.to" target="_blank" rel="noopener noreferrer">tx.to<ExternalLinkIcon/></a></td>
<td>The address of the recipient on L1.</td>
</tr>
<tr>
<td>tx.amount</td>
<td>The amount of the token to transfer.</td>
</tr>
<tr>
<td>token (optional)</td>
<td>The address of the token. <code v-pre>ETH</code> by default.</td>
</tr>
<tr>
<td>bridgeAddress (optional)</td>
<td>The address of the bridge contract to be used.</td>
</tr>
<tr>
<td>overrides (optional)</td>
<td>Transaction overrides, such as <code v-pre>nonce</code>, <code v-pre>gasLimit</code> etc.</td>
</tr>
<tr>
<td>returns</td>
<td>A <code v-pre>TransactionResponse</code> object</td>
</tr>
</tbody>
</table>
<h3 id="retrieving-the-underlying-l1-wallet" tabindex="-1"><a class="header-anchor" href="#retrieving-the-underlying-l1-wallet" aria-hidden="true">#</a> Retrieving the underlying L1 wallet</h3>
<p>You can get an <code v-pre>ethers.Wallet</code> object with the same private key with <code v-pre>ethWallet()</code> method.</p>
<h4 id="inputs-and-outputs-8" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-8" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>returns</td>
<td>An <code v-pre>ethers.Wallet</code> object with the same private key.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zksync <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> ethereumProvider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">zksync</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token constant">PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">,</span> ethereumProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ethWallet <span class="token operator">=</span> wallet<span class="token punctuation">.</span><span class="token function">ethWallet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="eip712signer" tabindex="-1"><a class="header-anchor" href="#eip712signer" aria-hidden="true">#</a> <code v-pre>EIP712Signer</code></h2>
<p>The methods of this class are mostly used internally. The examples of using this class are coming soon!</p>
<h2 id="signer" tabindex="-1"><a class="header-anchor" href="#signer" aria-hidden="true">#</a> <code v-pre>Signer</code></h2>
<p>This class is to be used in a browser environment. The easiest way to construct it is to use the <code v-pre>getSigner</code> method of the <code v-pre>Web3Provider</code>. This structure extends <code v-pre>ethers.providers.JsonRpcSigner</code> and so supports all the methods available for it.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-token-balance-1" tabindex="-1"><a class="header-anchor" href="#getting-token-balance-1" aria-hidden="true">#</a> Getting token balance</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBalance</span><span class="token punctuation">(</span>token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">,</span> blockTag<span class="token operator">:</span> BlockTag <span class="token operator">=</span> <span class="token string">'committed'</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-9" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-9" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token (optional)</td>
<td>The address of the token. ETH by default.</td>
</tr>
<tr>
<td>blockTag (optional)</td>
<td>The block the balance should be checked on. <code v-pre>committed</code>, i.e. the latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The amount of the token the <code v-pre>Signer</code> has.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in USDC</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token constant">USDC_L2_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in ETH</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-a-nonce-1" tabindex="-1"><a class="header-anchor" href="#getting-a-nonce-1" aria-hidden="true">#</a> Getting a nonce</h3>
<p>The <code v-pre>Wallet</code> class also provides the <code v-pre>getNonce</code> method which is an alias for <a href="https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount" target="_blank" rel="noopener noreferrer">getTransactionCount<ExternalLinkIcon/></a>.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getNonce</span><span class="token punctuation">(</span>blockTag<span class="token operator">?</span><span class="token operator">:</span> BlockTag<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-10" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-10" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>blockTag (optional)</td>
<td>The block the nonce should be got on. <code v-pre>committed</code>, i.e. the latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The the <code v-pre>Wallet</code> has.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getNonce</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="transfering-tokens-inside-zksync-1" tabindex="-1"><a class="header-anchor" href="#transfering-tokens-inside-zksync-1" aria-hidden="true">#</a> Transfering tokens inside zkSync</h3>
<p>Please note that for now, unlike Ethereum, zkSync does not support native transfers, i.e. the <code v-pre>value</code> field of all transactions is equal to <code v-pre>0</code>. All the token transfers are done through ERC20 <code v-pre>transfer</code> function calls.</p>
<p>But for convenience, the <code v-pre>Wallet</code> class has <code v-pre>transfer</code> method, which can transfer any <code v-pre>ERC20</code> tokens.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">transfer</span><span class="token punctuation">(</span>tx<span class="token operator">:</span> <span class="token punctuation">{</span>
    to<span class="token operator">:</span> Address<span class="token punctuation">;</span>
    amount<span class="token operator">:</span> BigNumberish<span class="token punctuation">;</span>
    token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>CallOverrides<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ethers<span class="token punctuation">.</span>ContractTransaction<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-11" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-11" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="http://tx.to" target="_blank" rel="noopener noreferrer">tx.to<ExternalLinkIcon/></a></td>
<td>The address of the recipient.</td>
</tr>
<tr>
<td>tx.amount</td>
<td>The amount of the token to transfer.</td>
</tr>
<tr>
<td>token (optional)</td>
<td>The address of the token. <code v-pre>ETH</code> by default.</td>
</tr>
<tr>
<td>overrides (optional)</td>
<td>Transaction overrides, such as <code v-pre>nonce</code>, <code v-pre>gasLimit</code> etc.</td>
</tr>
<tr>
<td>returns</td>
<td>An <code v-pre>ethers.ContractTransaction</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> recipient <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">createRandom</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// We transfer 0.01 ETH to the recipient and pay the fee in USDC</span>
<span class="token keyword">const</span> transferHandle <span class="token operator">=</span> signer<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  to<span class="token operator">:</span> recipient<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
  amount<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">parseEther</span><span class="token punctuation">(</span><span class="token string">"0.01"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="l1signer" tabindex="-1"><a class="header-anchor" href="#l1signer" aria-hidden="true">#</a> <code v-pre>L1Signer</code></h2>
<p>This class is to be used in a browser environment to do zkSync-related operations on layer 1. This class extends <code v-pre>ethers.providers.JsonRpcSigner</code> and so supports all the methods available for it.</p>
<p>The easiest way to construct it is from an <code v-pre>Web3Provider</code> object.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> L1Signer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> zksyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> L1Signer<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> zksyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-the-zksync-l1-smart-contract-1" tabindex="-1"><a class="header-anchor" href="#getting-the-zksync-l1-smart-contract-1" aria-hidden="true">#</a> Getting the zkSync L1 smart contract</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getMainContract</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Contract<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-12" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-12" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>returns</td>
<td><code v-pre>Contract</code> wrapper of the zkSync smart contract.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> L1Signer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> zksyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> L1Signer<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> zksyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> mainContract <span class="token operator">=</span> <span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getMainContract</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>mainContract<span class="token punctuation">.</span>address<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-token-balance-on-l1-1" tabindex="-1"><a class="header-anchor" href="#getting-token-balance-on-l1-1" aria-hidden="true">#</a> Getting token balance on L1</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBalanceL1</span><span class="token punctuation">(</span>token<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">,</span> blockTag<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>BlockTag<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-13" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-13" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token (optional)</td>
<td>The address of the token. ETH by default.</td>
</tr>
<tr>
<td>blockTag (optional)</td>
<td>The block the balance should be checked on. The latest processed one is the default option.</td>
</tr>
<tr>
<td>returns</td>
<td>The amount of the token the <code v-pre>L1Signer</code> has on Ethereum.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> L1Signer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> zksyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> L1Signer<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> zksyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in USDC</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getBalanceL1</span><span class="token punctuation">(</span><span class="token constant">USDC_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting balance in ETH</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> signer<span class="token punctuation">.</span><span class="token function">getBalanceL1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


