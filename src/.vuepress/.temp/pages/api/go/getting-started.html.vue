<template><div><h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting started</h1>
<p>In this guide we will demonstrate how to:</p>
<ol>
<li>Connect to the zkSync network.</li>
<li>Deposit assets from Ethereum into zkSync.</li>
<li>Transfer and withdraw funds.</li>
<li>Deploy a smart contract.</li>
<li>Interact with any smart contract.</li>
</ol>
<h2 id="prerequisite" tabindex="-1"><a class="header-anchor" href="#prerequisite" aria-hidden="true">#</a> Prerequisite</h2>
<p>This guide assumes that you are familiar with the <a href="https://go.dev/doc/" target="_blank" rel="noopener noreferrer">Go<ExternalLinkIcon/></a> programming language.
The Go version should be &gt;= 1.17, and Go modules are required.</p>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2>
<p>To install the SDK with the <code v-pre>go get</code> command, run the following:</p>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code><span class="token keyword">go</span> get github<span class="token punctuation">.</span>com<span class="token operator">/</span>zksync<span class="token operator">-</span>sdk<span class="token operator">/</span>zksync2<span class="token operator">-</span><span class="token keyword">go</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="instantiating-the-sdk" tabindex="-1"><a class="header-anchor" href="#instantiating-the-sdk" aria-hidden="true">#</a> Instantiating the SDK</h2>
<p>To start using the SDK, you just need to pass in a provider configuration.</p>
<p>Using <code v-pre>ZkSync Provider</code>, <code v-pre>EthereumProvider</code> and <code v-pre>Wallet</code>, you can perform all basic actions with ZkSync network.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>⚠️ Never commit private keys to file tracking history, or your account could be compromised.</p>
</div>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code>
<span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token comment">// first, init Ethereum Signer, from your mnemonic, and with the chain Id (in zkSync testnet case, 280)</span>
ethereumSigner<span class="token punctuation">,</span> err <span class="token operator">:=</span> zksync2<span class="token punctuation">.</span><span class="token function">NewEthSignerFromMnemonic</span><span class="token punctuation">(</span><span class="token string">"&lt;mnemonic words>"</span><span class="token punctuation">,</span> <span class="token number">280</span><span class="token punctuation">)</span>

<span class="token comment">// or from raw PrivateKey bytes</span>
ethereumSigner<span class="token punctuation">,</span> err <span class="token operator">=</span> zksync2<span class="token punctuation">.</span><span class="token function">NewEthSignerFromRawPrivateKey</span><span class="token punctuation">(</span>pkBytes<span class="token punctuation">,</span> <span class="token number">280</span><span class="token punctuation">)</span>

<span class="token comment">// also, init ZkSync Provider, specify ZkSync2 RPC URL (e.g. testnet)</span>
zkSyncProvider<span class="token punctuation">,</span> err <span class="token operator">:=</span> zksync2<span class="token punctuation">.</span><span class="token function">NewDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span>

<span class="token comment">// then init Wallet, passing just created Ethereum Signer and ZkSync Provider   </span>
wallet<span class="token punctuation">,</span> err <span class="token operator">:=</span> zksync2<span class="token punctuation">.</span><span class="token function">NewWallet</span><span class="token punctuation">(</span>ethereumSigner<span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">)</span>

<span class="token comment">// init default RPC client to Ethereum node (Goerli network in case of ZkSync2 testnet)</span>
ethRpc<span class="token punctuation">,</span> err <span class="token operator">:=</span> rpc<span class="token punctuation">.</span><span class="token function">Dial</span><span class="token punctuation">(</span><span class="token string">"https://goerli.infura.io/v3/&lt;your_infura_node_id>"</span><span class="token punctuation">)</span>

<span class="token comment">// and use it to create Ethereum Provider by Wallet </span>
ethereumProvider<span class="token punctuation">,</span> err <span class="token operator">:=</span> w<span class="token punctuation">.</span><span class="token function">CreateEthereumProvider</span><span class="token punctuation">(</span>ethRpc<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deposit-funds" tabindex="-1"><a class="header-anchor" href="#deposit-funds" aria-hidden="true">#</a> Deposit funds</h2>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code>
<span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    tx<span class="token punctuation">,</span> err <span class="token operator">:=</span> ep<span class="token punctuation">.</span><span class="token function">Deposit</span><span class="token punctuation">(</span>
        zksync2<span class="token punctuation">.</span><span class="token function">CreateETH</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        big<span class="token punctuation">.</span><span class="token function">NewInt</span><span class="token punctuation">(</span><span class="token number">1000000000000000</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        common<span class="token punctuation">.</span><span class="token function">HexToAddress</span><span class="token punctuation">(</span><span class="token string">"&lt;target_L2_address>"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Tx hash"</span><span class="token punctuation">,</span> tx<span class="token punctuation">.</span><span class="token function">Hash</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="transfer" tabindex="-1"><a class="header-anchor" href="#transfer" aria-hidden="true">#</a> Transfer</h2>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    hash<span class="token punctuation">,</span> err <span class="token operator">:=</span> w<span class="token punctuation">.</span><span class="token function">Transfer</span><span class="token punctuation">(</span>
        common<span class="token punctuation">.</span><span class="token function">HexToAddress</span><span class="token punctuation">(</span><span class="token string">"&lt;target_L2_address>"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        big<span class="token punctuation">.</span><span class="token function">NewInt</span><span class="token punctuation">(</span><span class="token number">1000000000000</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token boolean">nil</span><span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Tx hash"</span><span class="token punctuation">,</span> hash<span class="token punctuation">)</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="withdraw" tabindex="-1"><a class="header-anchor" href="#withdraw" aria-hidden="true">#</a> Withdraw</h2>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code>
<span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    hash<span class="token punctuation">,</span> err <span class="token operator">:=</span> w<span class="token punctuation">.</span><span class="token function">Withdraw</span><span class="token punctuation">(</span>
        common<span class="token punctuation">.</span><span class="token function">HexToAddress</span><span class="token punctuation">(</span><span class="token string">"&lt;target_L1_address>"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        big<span class="token punctuation">.</span><span class="token function">NewInt</span><span class="token punctuation">(</span><span class="token number">1000000000000</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Tx hash"</span><span class="token punctuation">,</span> hash<span class="token punctuation">)</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploy-a-smart-contract" tabindex="-1"><a class="header-anchor" href="#deploy-a-smart-contract" aria-hidden="true">#</a> Deploy a smart contract</h2>
<p>You can access the contract deployer interface as follows:</p>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code>
    <span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    hash<span class="token punctuation">,</span> err <span class="token operator">:=</span> w<span class="token punctuation">.</span><span class="token function">Deploy</span><span class="token punctuation">(</span>bytecode<span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Tx hash"</span><span class="token punctuation">,</span> hash<span class="token punctuation">)</span>

    <span class="token comment">// use helper to get (compute) address of deployed SC</span>
    address<span class="token punctuation">,</span> err <span class="token operator">:=</span> zksync2<span class="token punctuation">.</span><span class="token function">ComputeL2Create2Address</span><span class="token punctuation">(</span>
        common<span class="token punctuation">.</span><span class="token function">HexToAddress</span><span class="token punctuation">(</span><span class="token string">"&lt;deployer_L2_address>"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 
        bytecode<span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span> 
        <span class="token boolean">nil</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Deployed address"</span><span class="token punctuation">,</span> address<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="interact-with-smart-contracts" tabindex="-1"><a class="header-anchor" href="#interact-with-smart-contracts" aria-hidden="true">#</a> Interact with smart contracts</h2>
<p>In order to interact with smart contracts, the SDK needs to know the contract address, as well as its ABI. For that, you need to use ABI.Pack() <a href="https://github.com/ethereum/go-ethereum/accounts/abi" target="_blank" rel="noopener noreferrer">method<ExternalLinkIcon/></a> to load the ABI of your contract, or encode the calldata to execute function and its parameters.</p>
<p>Example encoding the calldata:</p>
<div class="language-go line-numbers-mode" data-ext="go"><pre v-pre class="language-go"><code>
<span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/ethereum/go-ethereum/rpc"</span>
    <span class="token string">"github.com/zksync-sdk/zksync2-go"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    calldata <span class="token operator">:=</span> crypto<span class="token punctuation">.</span><span class="token function">Keccak256</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span><span class="token string">"get()"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token number">4</span><span class="token punctuation">]</span>
    hash<span class="token punctuation">,</span> err <span class="token operator">:=</span> w<span class="token punctuation">.</span><span class="token function">Execute</span><span class="token punctuation">(</span>
        common<span class="token punctuation">.</span><span class="token function">HexToAddress</span><span class="token punctuation">(</span><span class="token string">"&lt;contract_address>"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        calldata<span class="token punctuation">,</span>
        <span class="token boolean">nil</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"Tx hash"</span><span class="token punctuation">,</span> hash<span class="token punctuation">)</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>⚠️ This section of the docs is still in progress and will be updated with more detailed information soon.</p>
</div>
</div></template>


