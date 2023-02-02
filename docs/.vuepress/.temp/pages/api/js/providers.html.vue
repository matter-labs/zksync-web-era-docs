<template><div><h1 id="providers" tabindex="-1"><a class="header-anchor" href="#providers" aria-hidden="true">#</a> Providers</h1>
<p>Providers are objects that wrap interactions with the zkSync node. If you are new to the concept of providers in <code v-pre>ethers</code>, you should check out their docs <a href="https://docs.ethers.io/v5/api/providers" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</p>
<p>zkSync fully supports Ethereum Web3 API, so you can use the provider objects from ethers.js. However, zkSync API provides some additional JSON-RPC methods, which allow:</p>
<ul>
<li>Easily track L1&lt;-&gt;L2 transactions.</li>
<li>Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use-cases may require tracking &quot;finalized&quot; transactions only.</li>
</ul>
<p>And much more! Generally, you can use providers from <code v-pre>ethers</code> for a quick start, but switch to providers from the <code v-pre>zksync-web3</code> library later on.</p>
<p>The <code v-pre>zksync-web3</code> library exports two types of providers:</p>
<ul>
<li><code v-pre>Provider</code> which inherits from <code v-pre>ethers</code>'s <code v-pre>JsonRpcProvider</code> and provides access to all of the zkSync JSON-RPC endpoints.</li>
<li><code v-pre>Web3Provider</code> which extends the <code v-pre>Provider</code> class by making it more compatible with Web3 wallets. This is the type of wallet that should be used for browser integrations.</li>
</ul>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="provider" tabindex="-1"><a class="header-anchor" href="#provider" aria-hidden="true">#</a> <code v-pre>Provider</code></h2>
<p>This is the most commonly used type of provider. It provides the same functionality as <code v-pre>ethers.providers.JsonRpcProvider</code>, but extends it with the zkSync-specific methods.</p>
<h3 id="creating-provider" tabindex="-1"><a class="header-anchor" href="#creating-provider" aria-hidden="true">#</a> Creating provider</h3>
<p>The constructor accepts the <code v-pre>url</code> to the operator node and the <code v-pre>network</code> name (optional).</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token function">constructor</span><span class="token punctuation">(</span>url<span class="token operator">?</span><span class="token operator">:</span> ConnectionInfo <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">,</span> network<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>Networkish<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="inputs-and-outputs" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs" aria-hidden="true">#</a> Inputs and outputs</h4>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>url (optional)</td>
<td>URL of the zkSync operator node.</td>
</tr>
<tr>
<td>network (optional)</td>
<td>The description of the network.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>Provider</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getbalance" tabindex="-1"><a class="header-anchor" href="#getbalance" aria-hidden="true">#</a> <code v-pre>getBalance</code></h3>
<p>Returns the balance of a user for a certain block tag and a native token.
In order to check the balance in <code v-pre>ETH</code> you can either omit the last argument or supply <code v-pre>ETH_ADDRESS</code> provided in the <code v-pre>utils</code> object.</p>
<p>Example:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getBalance</span><span class="token punctuation">(</span>address<span class="token operator">:</span> Address<span class="token punctuation">,</span> blockTag<span class="token operator">?</span><span class="token operator">:</span> BlockTag<span class="token punctuation">,</span> tokenAddress<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>BigNumber<span class="token operator">></span>
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
<td>address</td>
<td>The address of the user to check the balance.</td>
</tr>
<tr>
<td>blockTag (optional)</td>
<td>The block the balance should be checked on. <code v-pre>committed</code>, i.e. the latest processed one is the default option.</td>
</tr>
<tr>
<td>tokenAddress (optional)</td>
<td>The address of the token. ETH by default.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>BigNumber</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting  USDC balance of account 0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5 at the latest processed block</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token string">"0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5"</span><span class="token punctuation">,</span> <span class="token string">"latest"</span><span class="token punctuation">,</span> <span class="token constant">USDC_L2_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Getting ETH balance</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token string">"0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-the-zksync-smart-contract-address" tabindex="-1"><a class="header-anchor" href="#getting-the-zksync-smart-contract-address" aria-hidden="true">#</a> Getting the zkSync smart contract address</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getMainContractAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span>
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
<td>returns</td>
<td>The address of the zkSync smart contract.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getMainContractAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-testnet-paymaster-address" tabindex="-1"><a class="header-anchor" href="#getting-testnet-paymaster-address" aria-hidden="true">#</a> Getting testnet paymaster address</h3>
<p>On zkSync testnets, the <RouterLink to="/dev/developer-guides/aa.html#paymasters">testnet paymaster</RouterLink> is available.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">|</span><span class="token keyword">null</span><span class="token operator">></span>
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
<td>The address of the testnet paymaster or <code v-pre>null</code> if there isn't any.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-zksync-default-bridge-contract-addresses" tabindex="-1"><a class="header-anchor" href="#getting-zksync-default-bridge-contract-addresses" aria-hidden="true">#</a> Getting zkSync default bridge contract addresses</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getDefaultBridgeAddresses</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token punctuation">{</span>
    ethL1<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    ethL2<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    erc20L1<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
    erc20L2<span class="token operator">?</span><span class="token operator">:</span> Address<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="inputs-and-outputs-4" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-4" aria-hidden="true">#</a> Inputs and outputs</h4>
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
<td>The addresses of default zkSync bridge contracts on both L1 and L2</td>
</tr>
</tbody>
</table>
<h3 id="getconfirmedtokens" tabindex="-1"><a class="header-anchor" href="#getconfirmedtokens" aria-hidden="true">#</a> <code v-pre>getConfirmedTokens</code></h3>
<p>Given <code v-pre>from</code> and <code v-pre>limit</code> returns information (address, symbol, name, decimals) about the confirmed tokens with IDs in the interval <code v-pre>[from..from+limit-1]</code>. &quot;Confirmed&quot; is a misnomer here, since a confirmed token is one that has been bridged through the default zkSync bridge. This method will mostly be used by the zkSync team internally.</p>
<p>The tokens are returned in alphabetical order by their symbol, so basically, the token id is its position in an alphabetically sorted array of tokens.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getConfirmedTokens</span><span class="token punctuation">(</span>start<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> limit<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">255</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Token<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span>
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
<td>start</td>
<td>The token id from which to start returning the information about the tokens. Zero by default.</td>
</tr>
<tr>
<td>limit</td>
<td>The number of tokens to be returned from the API. 255 by default.</td>
</tr>
<tr>
<td>returns</td>
<td>The array of <code v-pre>Token</code> objects sorted by their symbol.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getConfirmedTokens</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="gettokenprice" tabindex="-1"><a class="header-anchor" href="#gettokenprice" aria-hidden="true">#</a> <code v-pre>getTokenPrice</code></h3>
<div class="hint-container warning">
<p class="hint-container-title">Deprecated</p>
<p>This method is deprecated and will be removed soon.</p>
</div>
<p>Returns the price USD in for a token. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getTokenPrice</span><span class="token punctuation">(</span>token<span class="token operator">:</span> Address<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>The address of the token.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>string</code> value of the token price.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getTokenPrice</span><span class="token punctuation">(</span><span class="token constant">USDC_L2_ADDRESS</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-token-s-address-on-l2-from-its-l1-address-and-vice-versa" tabindex="-1"><a class="header-anchor" href="#getting-token-s-address-on-l2-from-its-l1-address-and-vice-versa" aria-hidden="true">#</a> Getting token's address on L2 from its L1 address and vice-versa</h3>
<p>Token's address on L2 will not be the same as on L1.
ETH's address is set to zero address on both networks.</p>
<p>Provided methods work only for tokens bridged using default zkSync bridges.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// takes L1 address, returns L2 address</span>
<span class="token keyword">async</span> <span class="token function">l2TokenAddress</span><span class="token punctuation">(</span>l1Token<span class="token operator">:</span> Address<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Address<span class="token operator">></span>
<span class="token comment">// takes L2 address, returns L1 address</span>
<span class="token keyword">async</span> <span class="token function">l1TokenAddress</span><span class="token punctuation">(</span>l2Token<span class="token operator">:</span> Address<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Address<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>The address of the token.</td>
</tr>
<tr>
<td>returns</td>
<td>The address of that token on the opposite layer.</td>
</tr>
</tbody>
</table>
<h3 id="gettransactionstatus" tabindex="-1"><a class="header-anchor" href="#gettransactionstatus" aria-hidden="true">#</a> <code v-pre>getTransactionStatus</code></h3>
<p>Given a transaction hash, returns the status of the transaction.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getTransactionStatus</span><span class="token punctuation">(</span>txHash<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>TransactionStatus<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>The address of the token.</td>
</tr>
<tr>
<td>returns</td>
<td>The status of the transaction. You can find the description for <code v-pre>TransactionStatus</code> enum variants in the <a href="./types">types</a>.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">TX_HASH</span> <span class="token operator">=</span> <span class="token string">"0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3"</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getTransactionStatus</span><span class="token punctuation">(</span><span class="token constant">TX_HASH</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="gettransaction" tabindex="-1"><a class="header-anchor" href="#gettransaction" aria-hidden="true">#</a> <code v-pre>getTransaction</code></h3>
<p>Given a transaction hash, returns the L2 transaction response object.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token function">getTransaction</span><span class="token punctuation">(</span>hash<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>TransactionResponse<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>The address of the token.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>TransactionResponse</code> object, which allows for easy tracking the state of the transaction.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">TX_HASH</span> <span class="token operator">=</span> <span class="token string">"0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> txHandle <span class="token operator">=</span> <span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getTransaction</span><span class="token punctuation">(</span><span class="token constant">TX_HASH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Wait until the transaction is processed by the server.</span>
<span class="token keyword">await</span> txHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Wait until the transaction is finalized.</span>
<span class="token keyword">await</span> txHandle<span class="token punctuation">.</span><span class="token function">waitFinalize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="web3provider" tabindex="-1"><a class="header-anchor" href="#web3provider" aria-hidden="true">#</a> <code v-pre>Web3Provider</code></h2>
<p>A class that should be used for web3 browser wallet integrations, adapted for easy compatibility with Metamask, WalletConnect, and other popular browser wallets.</p>
<h3 id="creating-web3provider" tabindex="-1"><a class="header-anchor" href="#creating-web3provider" aria-hidden="true">#</a> Creating <code v-pre>Web3Provider</code></h3>
<p>The main difference from the constructor of <code v-pre>Provider</code> class is that it accepts <code v-pre>ExternalProvider</code> instead of the node URL.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token function">constructor</span><span class="token punctuation">(</span>provider<span class="token operator">:</span> ExternalProvider<span class="token punctuation">,</span> network<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>Networkish<span class="token punctuation">)</span>
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
<td>provider</td>
<td>The <code v-pre>ethers.providers.ExternalProvider</code> class instance. For instance, in the case of Metamask it is <code v-pre>window.ethereum</code>.</td>
</tr>
<tr>
<td>network (optional)</td>
<td>The description of the network.</td>
</tr>
<tr>
<td>returns</td>
<td><code v-pre>Provider</code> object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-zksync-signer" tabindex="-1"><a class="header-anchor" href="#getting-zksync-signer" aria-hidden="true">#</a> Getting zkSync signer</h3>
<p>Returns a <code v-pre>Signer</code> object that can be used to sign zkSync transactions. More details on the <code v-pre>Signer</code> class can be found in the next <RouterLink to="/api/js/accounts.html#signer">section</RouterLink>.</p>
<h4 id="inputs-and-outputs-7" tabindex="-1"><a class="header-anchor" href="#inputs-and-outputs-7" aria-hidden="true">#</a> Inputs and outputs</h4>
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
<td><code v-pre>Signer</code> class object.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Example</p>
</blockquote>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Web3Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> signer <span class="token operator">=</span> provider<span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


