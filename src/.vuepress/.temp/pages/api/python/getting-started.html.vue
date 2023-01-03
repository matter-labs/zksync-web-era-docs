<template><div><h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting started</h1>
<p>In this guide we will demonstrate how to:</p>
<ol>
<li>Connect to the zkSync network.</li>
<li>Deposit assets from Ethereum into zkSync.</li>
<li>Check balances.</li>
<li>Transfer and withdraw funds (native and ERC20 tokens).</li>
<li>Deploy a smart contract.</li>
<li>Deploy a smart contract with create2.</li>
</ol>
<h2 id="prerequisite" tabindex="-1"><a class="header-anchor" href="#prerequisite" aria-hidden="true">#</a> Prerequisite</h2>
<p>This guide assumes that you are familiar with <a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">Python<ExternalLinkIcon/></a> programming language.</p>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2>
<p>To install the SDK with the <code v-pre>pip install</code> command, run the following:</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
pip install zksync2

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="instantiating-the-sdk" tabindex="-1"><a class="header-anchor" href="#instantiating-the-sdk" aria-hidden="true">#</a> Instantiating the SDK</h2>
<p>To start using this SDK, you just need to pass in a provider configuration.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> web3 <span class="token keyword">import</span> Web3
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder

URL_TO_ETH_NETWORK <span class="token operator">=</span> <span class="token string">"GOERLI_HTTPS_RPC"</span>
ZKSYNC_NETWORK_URL <span class="token operator">=</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span>

eth_web3 <span class="token operator">=</span> Web3<span class="token punctuation">(</span>Web3<span class="token punctuation">.</span>HTTPProvider<span class="token punctuation">(</span>URL_TO_ETH_NETWORK<span class="token punctuation">)</span><span class="token punctuation">)</span>
zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ethereum-signer" tabindex="-1"><a class="header-anchor" href="#ethereum-signer" aria-hidden="true">#</a> Ethereum signer</h2>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>⚠️ Never commit private keys to file tracking history, or your account could be compromised.</p>
</div>
<p>Ethereum signer is represented by the <code v-pre>PrivateKeyEthSigner</code> abstract class from <code v-pre>zkSync2.signer.eth_signer</code>.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">import</span> os

PRIVATE_KEY <span class="token operator">=</span> os<span class="token punctuation">.</span>environ<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">"YOUR_PRIVATE_KEY"</span><span class="token punctuation">)</span>

account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span>PRIVATE_KEY<span class="token punctuation">)</span>
signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="depositing-funds" tabindex="-1"><a class="header-anchor" href="#depositing-funds" aria-hidden="true">#</a> Depositing funds</h2>
<p>This example shows how to deposit funds into an address.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> web3 <span class="token keyword">import</span> Web3
<span class="token keyword">from</span> web3<span class="token punctuation">.</span>middleware <span class="token keyword">import</span> geth_poa_middleware
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>gas_provider <span class="token keyword">import</span> StaticGasProvider
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> Token
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>provider<span class="token punctuation">.</span>eth_provider <span class="token keyword">import</span> EthereumProvider


<span class="token keyword">def</span> <span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment">#geth_poa_middleware is used to connect to geth --dev.</span>
    eth_web3<span class="token punctuation">.</span>middleware_onion<span class="token punctuation">.</span>inject<span class="token punctuation">(</span>geth_poa_middleware<span class="token punctuation">,</span> layer<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">)</span>

    <span class="token comment">#calculate  gas fees</span>
    gas_provider <span class="token operator">=</span> StaticGasProvider<span class="token punctuation">(</span>Web3<span class="token punctuation">.</span>toWei<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">"gwei"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">555000</span><span class="token punctuation">)</span>

    <span class="token comment">#Create the ethereum provider for interacting with ethereum node, initialize zkSync signer and deposit funds.</span>
    eth_provider <span class="token operator">=</span> EthereumProvider<span class="token punctuation">.</span>build_ethereum_provider<span class="token punctuation">(</span>zkSync<span class="token operator">=</span>zkSync_web3<span class="token punctuation">,</span>
                                                            eth<span class="token operator">=</span>eth_web3<span class="token punctuation">,</span>
                                                            account<span class="token operator">=</span>account<span class="token punctuation">,</span>
                                                            gas_provider<span class="token operator">=</span>gas_provider<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> eth_provider<span class="token punctuation">.</span>deposit<span class="token punctuation">(</span>Token<span class="token punctuation">.</span>create_eth<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                                    eth_web3<span class="token punctuation">.</span>toWei<span class="token punctuation">(</span><span class="token string">"YOUR_AMOUNT_OF_ETH"</span><span class="token punctuation">,</span> <span class="token string">"ether"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                                    account<span class="token punctuation">.</span>address<span class="token punctuation">)</span>
    <span class="token comment"># Show the output of the transaction details.</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    deposit<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="checking-balance" tabindex="-1"><a class="header-anchor" href="#checking-balance" aria-hidden="true">#</a> Checking balance</h2>
<p>This example shows how to check your balance on the zkSync network.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> EthBlockParams


<span class="token keyword">def</span> <span class="token function">get_account_balance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    zk_balance <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_balance<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> EthBlockParams<span class="token punctuation">.</span>LATEST<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"zkSync balance: </span><span class="token interpolation"><span class="token punctuation">{</span>zk_balance<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    get_account_balance<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="performing-a-transfer" tabindex="-1"><a class="header-anchor" href="#performing-a-transfer" aria-hidden="true">#</a> Performing a transfer</h2>
<p>This example shows how to execute a transfer from one account to another, on the zkSync network.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> eth_typing <span class="token keyword">import</span> HexStr
<span class="token keyword">from</span> web3 <span class="token keyword">import</span> Web3
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>request_types <span class="token keyword">import</span> create_function_call_transaction
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> ZkBlockParams
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount

<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>transaction<span class="token punctuation">.</span>transaction712 <span class="token keyword">import</span> Transaction712


<span class="token keyword">def</span> <span class="token function">transfer_to_self</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    chain_id <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>chain_id
    signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>

    nonce <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_transaction_count<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">.</span>COMMITTED<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    tx <span class="token operator">=</span> create_function_call_transaction<span class="token punctuation">(</span>from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                          to<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                          ergs_price<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          ergs_limit<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          data<span class="token operator">=</span>HexStr<span class="token punctuation">(</span><span class="token string">"0x"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    estimate_gas <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">.</span>zksync<span class="token punctuation">.</span>eth_estimate_gas<span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">)</span>
    gas_price <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>gas_price

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Fee for transaction is: </span><span class="token interpolation"><span class="token punctuation">{</span>estimate_gas <span class="token operator">*</span> gas_price<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx_712 <span class="token operator">=</span> Transaction712<span class="token punctuation">(</span>chain_id<span class="token operator">=</span>chain_id<span class="token punctuation">,</span>
                            nonce<span class="token operator">=</span>nonce<span class="token punctuation">,</span>
                            gas_limit<span class="token operator">=</span>estimate_gas<span class="token punctuation">,</span>
                            to<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"to"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            value<span class="token operator">=</span>Web3<span class="token punctuation">.</span>toWei<span class="token punctuation">(</span><span class="token number">0.01</span><span class="token punctuation">,</span> <span class="token string">'ether'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                            data<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"data"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            maxPriorityFeePerGas<span class="token operator">=</span><span class="token number">100000000</span><span class="token punctuation">,</span>
                            maxFeePerGas<span class="token operator">=</span>gas_price<span class="token punctuation">,</span>
                            from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                            meta<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"eip712Meta"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

    singed_message <span class="token operator">=</span> signer<span class="token punctuation">.</span>sign_typed_data<span class="token punctuation">(</span>tx_712<span class="token punctuation">.</span>to_eip712_struct<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    msg <span class="token operator">=</span> tx_712<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>singed_message<span class="token punctuation">)</span>
    tx_hash <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>send_raw_transaction<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>wait_for_transaction_receipt<span class="token punctuation">(</span>tx_hash<span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">240</span><span class="token punctuation">,</span> poll_latency<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    transfer_to_self<span class="token punctuation">(</span><span class="token punctuation">)</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="transfer-funds-erc20-tokens" tabindex="-1"><a class="header-anchor" href="#transfer-funds-erc20-tokens" aria-hidden="true">#</a> Transfer funds (ERC20 tokens)</h2>
<p>This example shows how to transfer ERC20 tokens into your account on the zkSync network.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>request_types <span class="token keyword">import</span> create_function_call_transaction
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>erc20_contract <span class="token keyword">import</span> ERC20FunctionEncoder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> ZkBlockParams
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>transaction<span class="token punctuation">.</span>transaction712 <span class="token keyword">import</span> Transaction712


<span class="token keyword">def</span> <span class="token function">transfer_erc20_token</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    chain_id <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>chain_id
    signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>

    nonce <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_transaction_count<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">.</span>COMMITTED<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    tokens <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>zks_get_confirmed_tokens<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    not_eth_tokens <span class="token operator">=</span> <span class="token punctuation">[</span>x <span class="token keyword">for</span> x <span class="token keyword">in</span> tokens <span class="token keyword">if</span> <span class="token keyword">not</span> x<span class="token punctuation">.</span>is_eth<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
    token_address <span class="token operator">=</span> not_eth_tokens<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>l2_address

    erc20_encoder <span class="token operator">=</span> ERC20FunctionEncoder<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">)</span>
    transfer_params <span class="token operator">=</span> <span class="token punctuation">[</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span>
    call_data <span class="token operator">=</span> erc20_encoder<span class="token punctuation">.</span>encode_method<span class="token punctuation">(</span><span class="token string">"transfer"</span><span class="token punctuation">,</span> args<span class="token operator">=</span>transfer_params<span class="token punctuation">)</span>

    tx <span class="token operator">=</span> create_function_call_transaction<span class="token punctuation">(</span>from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                          to<span class="token operator">=</span>token_address<span class="token punctuation">,</span>
                                          ergs_price<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          ergs_limit<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          data<span class="token operator">=</span>call_data<span class="token punctuation">)</span>
    estimate_gas <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">.</span>zksync<span class="token punctuation">.</span>eth_estimate_gas<span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">)</span>
    gas_price <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>gas_price

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Fee for transaction is: </span><span class="token interpolation"><span class="token punctuation">{</span>estimate_gas <span class="token operator">*</span> gas_price<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx_712 <span class="token operator">=</span> Transaction712<span class="token punctuation">(</span>chain_id<span class="token operator">=</span>chain_id<span class="token punctuation">,</span>
                            nonce<span class="token operator">=</span>nonce<span class="token punctuation">,</span>
                            gas_limit<span class="token operator">=</span>estimate_gas<span class="token punctuation">,</span>
                            to<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"to"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            value<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"value"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            data<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"data"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            maxPriorityFeePerGas<span class="token operator">=</span><span class="token number">100000000</span><span class="token punctuation">,</span>
                            maxFeePerGas<span class="token operator">=</span>gas_price<span class="token punctuation">,</span>
                            from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                            meta<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"eip712Meta"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    singed_message <span class="token operator">=</span> signer<span class="token punctuation">.</span>sign_typed_data<span class="token punctuation">(</span>tx_712<span class="token punctuation">.</span>to_eip712_struct<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    msg <span class="token operator">=</span> tx_712<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>singed_message<span class="token punctuation">)</span>
    tx_hash <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>send_raw_transaction<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>wait_for_transaction_receipt<span class="token punctuation">(</span>tx_hash<span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">240</span><span class="token punctuation">,</span> poll_latency<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    transfer_erc20_token<span class="token punctuation">(</span><span class="token punctuation">)</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="withdrawing-funds" tabindex="-1"><a class="header-anchor" href="#withdrawing-funds" aria-hidden="true">#</a> Withdrawing funds</h2>
<p>This examples shows how to withdraw funds into your account.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">from</span> decimal <span class="token keyword">import</span> Decimal
<span class="token keyword">from</span> eth_typing <span class="token keyword">import</span> HexStr
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>request_types <span class="token keyword">import</span> create_function_call_transaction
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>l2_bridge <span class="token keyword">import</span> L2BridgeEncoder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> Token<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">,</span> BridgeAddresses
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount

<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>transaction<span class="token punctuation">.</span>transaction712 <span class="token keyword">import</span> Transaction712


<span class="token keyword">def</span> <span class="token function">withdraw</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    chain_id <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>chain_id
    signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>
    ETH_TOKEN <span class="token operator">=</span> Token<span class="token punctuation">.</span>create_eth<span class="token punctuation">(</span><span class="token punctuation">)</span>

    nonce <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_transaction_count<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">.</span>COMMITTED<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    bridges<span class="token punctuation">:</span> BridgeAddresses <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>zks_get_bridge_contracts<span class="token punctuation">(</span><span class="token punctuation">)</span>

    l2_func_encoder <span class="token operator">=</span> L2BridgeEncoder<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">)</span>
    call_data <span class="token operator">=</span> l2_func_encoder<span class="token punctuation">.</span>encode_function<span class="token punctuation">(</span>fn_name<span class="token operator">=</span><span class="token string">"withdraw"</span><span class="token punctuation">,</span> args<span class="token operator">=</span><span class="token punctuation">[</span>
        account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        ETH_TOKEN<span class="token punctuation">.</span>l2_address<span class="token punctuation">,</span>
        ETH_TOKEN<span class="token punctuation">.</span>to_int<span class="token punctuation">(</span>Decimal<span class="token punctuation">(</span><span class="token string">"0.001"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">]</span><span class="token punctuation">)</span>

    tx <span class="token operator">=</span> create_function_call_transaction<span class="token punctuation">(</span>from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                          to<span class="token operator">=</span>bridges<span class="token punctuation">.</span>l2_eth_default_bridge<span class="token punctuation">,</span>
                                          ergs_limit<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          ergs_price<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                          data<span class="token operator">=</span>HexStr<span class="token punctuation">(</span>call_data<span class="token punctuation">)</span><span class="token punctuation">)</span>
    estimate_gas <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">.</span>zksync<span class="token punctuation">.</span>eth_estimate_gas<span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">)</span>
    gas_price <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>gas_price

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Fee for transaction is: </span><span class="token interpolation"><span class="token punctuation">{</span>estimate_gas <span class="token operator">*</span> gas_price<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx_712 <span class="token operator">=</span> Transaction712<span class="token punctuation">(</span>chain_id<span class="token operator">=</span>chain_id<span class="token punctuation">,</span>
                            nonce<span class="token operator">=</span>nonce<span class="token punctuation">,</span>
                            gas_limit<span class="token operator">=</span>estimate_gas<span class="token punctuation">,</span>
                            to<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"to"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            value<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"value"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            data<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"data"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            maxPriorityFeePerGas<span class="token operator">=</span><span class="token number">100000000</span><span class="token punctuation">,</span>
                            maxFeePerGas<span class="token operator">=</span>gas_price<span class="token punctuation">,</span>
                            from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                            meta<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"eip712Meta"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

    singed_message <span class="token operator">=</span> signer<span class="token punctuation">.</span>sign_typed_data<span class="token punctuation">(</span>tx_712<span class="token punctuation">.</span>to_eip712_struct<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    msg <span class="token operator">=</span> tx_712<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>singed_message<span class="token punctuation">)</span>
    tx_hash <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>send_raw_transaction<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>wait_for_transaction_receipt<span class="token punctuation">(</span>tx_hash<span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">240</span><span class="token punctuation">,</span> poll_latency<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    withdraw<span class="token punctuation">(</span><span class="token punctuation">)</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploy-a-smart-contract" tabindex="-1"><a class="header-anchor" href="#deploy-a-smart-contract" aria-hidden="true">#</a> Deploy a smart contract</h2>
<p>With zkSync, you can deploy a contract using the <code v-pre>create</code> method, by simply building the contract into a binary format and deploying it to the zkSync network.</p>
<p>In the next steps, we will guide you through how it works.</p>
<h3 id="step1-create-a-contract" tabindex="-1"><a class="header-anchor" href="#step1-create-a-contract" aria-hidden="true">#</a> Step1: Create a contract</h3>
<p>Here is a simple contract:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Counter</span> <span class="token punctuation">{</span>
    <span class="token builtin">uint256</span> value<span class="token punctuation">;</span>

    <span class="token keyword">function</span> <span class="token function">increment</span><span class="token punctuation">(</span><span class="token builtin">uint256</span> x<span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token punctuation">{</span>
        value <span class="token operator">+=</span> x<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">view</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">uint256</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>It must be compiled by zkSync compiler only!</p>
</blockquote>
<p>After compilation there must be 2 files with the:</p>
<ul>
<li>contract binary representation</li>
<li>contract ABI in JSON format</li>
</ul>
<h3 id="step-2-deploy-the-contract" tabindex="-1"><a class="header-anchor" href="#step-2-deploy-the-contract" aria-hidden="true">#</a> Step 2: Deploy the contract</h3>
<p>To deploy the contract, contract ABI is needed for calling its methods in the standard <code v-pre>web3</code> way.</p>
<p>In some cases, you would need to get the contract address before deploying it.</p>
<p>Here's an example of how you would do it.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">import</span> json
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path
<span class="token keyword">from</span> eth_typing <span class="token keyword">import</span> HexStr
<span class="token keyword">from</span> web3 <span class="token keyword">import</span> Web3
<span class="token keyword">from</span> web3<span class="token punctuation">.</span>types <span class="token keyword">import</span> TxParams
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>request_types <span class="token keyword">import</span> create_contract_transaction
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>contract_deployer <span class="token keyword">import</span> ContractDeployer
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>nonce_holder <span class="token keyword">import</span> NonceHolder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> ZkBlockParams<span class="token punctuation">,</span> EthBlockParams
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>transaction<span class="token punctuation">.</span>transaction712 <span class="token keyword">import</span> Transaction712


<span class="token keyword">def</span> <span class="token function">read_binary</span><span class="token punctuation">(</span>p<span class="token punctuation">:</span> Path<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bytes</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> p<span class="token punctuation">.</span><span class="token builtin">open</span><span class="token punctuation">(</span>mode<span class="token operator">=</span><span class="token string">'rb'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> contact_file<span class="token punctuation">:</span>
        data <span class="token operator">=</span> contact_file<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> data


<span class="token keyword">def</span> <span class="token function">get_abi</span><span class="token punctuation">(</span>p<span class="token punctuation">:</span> Path<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> p<span class="token punctuation">.</span><span class="token builtin">open</span><span class="token punctuation">(</span>mode<span class="token operator">=</span><span class="token string">'r'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> json_f<span class="token punctuation">:</span>
        <span class="token keyword">return</span> json<span class="token punctuation">.</span>load<span class="token punctuation">(</span>json_f<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">CounterContractEncoder</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> web3<span class="token punctuation">:</span> Web3<span class="token punctuation">,</span> bin_path<span class="token punctuation">:</span> Path<span class="token punctuation">,</span> abi_path<span class="token punctuation">:</span> Path<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>web3 <span class="token operator">=</span> web3
        self<span class="token punctuation">.</span>counter_contract <span class="token operator">=</span> self<span class="token punctuation">.</span>web3<span class="token punctuation">.</span>eth<span class="token punctuation">.</span>contract<span class="token punctuation">(</span>abi<span class="token operator">=</span>get_abi<span class="token punctuation">(</span>abi_path<span class="token punctuation">)</span><span class="token punctuation">,</span>
                                                       bytecode<span class="token operator">=</span>read_binary<span class="token punctuation">(</span>bin_path<span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">encode_method</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> fn_name<span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> HexStr<span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>counter_contract<span class="token punctuation">.</span>encodeABI<span class="token punctuation">(</span>fn_name<span class="token punctuation">,</span> args<span class="token punctuation">)</span>


<span class="token keyword">def</span> <span class="token function">deploy_contract_create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    chain_id <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>chain_id
    signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>

    counter_contract_bin <span class="token operator">=</span> read_binary<span class="token punctuation">(</span><span class="token string">"PATH_TO_BINARY_COMPILED_CONTRACT"</span><span class="token punctuation">)</span>

    nonce <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_transaction_count<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> EthBlockParams<span class="token punctuation">.</span>PENDING<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    nonce_holder <span class="token operator">=</span> NonceHolder<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">,</span> account<span class="token punctuation">)</span>
    deployment_nonce <span class="token operator">=</span> nonce_holder<span class="token punctuation">.</span>get_deployment_nonce<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">)</span>
    deployer <span class="token operator">=</span> ContractDeployer<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">)</span>
    precomputed_address <span class="token operator">=</span> deployer<span class="token punctuation">.</span>compute_l2_create_address<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> deployment_nonce<span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"precomputed address: </span><span class="token interpolation"><span class="token punctuation">{</span>precomputed_address<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx <span class="token operator">=</span> create_contract_transaction<span class="token punctuation">(</span>web3<span class="token operator">=</span>zkSync_web3<span class="token punctuation">,</span>
                                     from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                     ergs_limit<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                     ergs_price<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                     bytecode<span class="token operator">=</span>counter_contract_bin<span class="token punctuation">)</span>

    estimate_gas <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">.</span>zksync<span class="token punctuation">.</span>eth_estimate_gas<span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">)</span>
    gas_price <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>gas_price
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Fee for transaction is: </span><span class="token interpolation"><span class="token punctuation">{</span>estimate_gas <span class="token operator">*</span> gas_price<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx_712 <span class="token operator">=</span> Transaction712<span class="token punctuation">(</span>chain_id<span class="token operator">=</span>chain_id<span class="token punctuation">,</span>
                            nonce<span class="token operator">=</span>nonce<span class="token punctuation">,</span>
                            gas_limit<span class="token operator">=</span>estimate_gas<span class="token punctuation">,</span>
                            to<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"to"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            value<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"value"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            data<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"data"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            maxPriorityFeePerGas<span class="token operator">=</span><span class="token number">100000000</span><span class="token punctuation">,</span>
                            maxFeePerGas<span class="token operator">=</span>gas_price<span class="token punctuation">,</span>
                            from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                            meta<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"eip712Meta"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

    singed_message <span class="token operator">=</span> signer<span class="token punctuation">.</span>sign_typed_data<span class="token punctuation">(</span>tx_712<span class="token punctuation">.</span>to_eip712_struct<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    msg <span class="token operator">=</span> tx_712<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>singed_message<span class="token punctuation">)</span>
    tx_hash <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>send_raw_transaction<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>wait_for_transaction_receipt<span class="token punctuation">(</span>tx_hash<span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">240</span><span class="token punctuation">,</span> poll_latency<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    contract_address <span class="token operator">=</span> tx_receipt<span class="token punctuation">[</span><span class="token string">"contractAddress"</span><span class="token punctuation">]</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"contract address: </span><span class="token interpolation"><span class="token punctuation">{</span>contract_address<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    counter_contract_encoder <span class="token operator">=</span> CounterContractEncoder<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">,</span> <span class="token string">"PATH_TO_BINARY_COMPILED_CONTRACT"</span><span class="token punctuation">,</span>
                                                      <span class="token string">"PATH_TO_CONTRACT_ABI"</span><span class="token punctuation">)</span>

    call_data <span class="token operator">=</span> counter_contract_encoder<span class="token punctuation">.</span>encode_method<span class="token punctuation">(</span>fn_name<span class="token operator">=</span><span class="token string">"get"</span><span class="token punctuation">,</span> args<span class="token operator">=</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    eth_tx<span class="token punctuation">:</span> TxParams <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token string">"from"</span><span class="token punctuation">:</span> account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        <span class="token string">"to"</span><span class="token punctuation">:</span> contract_address<span class="token punctuation">,</span>
        <span class="token string">"data"</span><span class="token punctuation">:</span> call_data
    <span class="token punctuation">}</span>
    <span class="token comment"># Value is type dependent so might need to be converted to corresponded type under Python</span>
    eth_ret <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>call<span class="token punctuation">(</span>eth_tx<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">.</span>COMMITTED<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    converted_result <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">.</span>from_bytes<span class="token punctuation">(</span>eth_ret<span class="token punctuation">,</span> <span class="token string">"big"</span><span class="token punctuation">,</span> signed<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Call method for deployed contract, address: </span><span class="token interpolation"><span class="token punctuation">{</span>contract_address<span class="token punctuation">}</span></span><span class="token string">, value: </span><span class="token interpolation"><span class="token punctuation">{</span>converted_result<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    deploy_contract_create<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploy-a-smart-contract-with-create2" tabindex="-1"><a class="header-anchor" href="#deploy-a-smart-contract-with-create2" aria-hidden="true">#</a> Deploy a smart contract with Create2</h2>
<p>Using the <a href="https://eips.ethereum.org/EIPS/eip-1014" target="_blank" rel="noopener noreferrer">CREATE2<ExternalLinkIcon/></a> opcode gives you the ability to predict the address where a contract will be deployed, without ever having to do so, hence improving user onboarding.</p>
<p>Similar to the <code v-pre>create</code> method above, here's the implementation on how you can deploy a contract using the <code v-pre>create2</code> method on zkSync.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code>
<span class="token keyword">import</span> os
<span class="token keyword">import</span> json
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path
<span class="token keyword">from</span> eth_typing <span class="token keyword">import</span> HexStr
<span class="token keyword">from</span> web3 <span class="token keyword">import</span> Web3
<span class="token keyword">from</span> web3<span class="token punctuation">.</span>types <span class="token keyword">import</span> TxParams
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>request_types <span class="token keyword">import</span> create2_contract_transaction
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>manage_contracts<span class="token punctuation">.</span>contract_deployer <span class="token keyword">import</span> ContractDeployer
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>module<span class="token punctuation">.</span>module_builder <span class="token keyword">import</span> zkSyncBuilder
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>core<span class="token punctuation">.</span>types <span class="token keyword">import</span> ZkBlockParams<span class="token punctuation">,</span> EthBlockParams
<span class="token keyword">from</span> eth_account <span class="token keyword">import</span> Account
<span class="token keyword">from</span> eth_account<span class="token punctuation">.</span>signers<span class="token punctuation">.</span>local <span class="token keyword">import</span> LocalAccount
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>signer<span class="token punctuation">.</span>eth_signer <span class="token keyword">import</span> PrivateKeyEthSigner
<span class="token keyword">from</span> zkSync2<span class="token punctuation">.</span>transaction<span class="token punctuation">.</span>transaction712 <span class="token keyword">import</span> Transaction712

<span class="token comment">#Generate random salt(an arbitrary value provided by the sender)</span>
<span class="token keyword">def</span> <span class="token function">generate_random_salt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bytes</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> os<span class="token punctuation">.</span>urandom<span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span>

<span class="token comment">#Open the file</span>
<span class="token keyword">def</span> <span class="token function">read_binary</span><span class="token punctuation">(</span>p<span class="token punctuation">:</span> Path<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token builtin">bytes</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> p<span class="token punctuation">.</span><span class="token builtin">open</span><span class="token punctuation">(</span>mode<span class="token operator">=</span><span class="token string">'rb'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> contact_file<span class="token punctuation">:</span>
        data <span class="token operator">=</span> contact_file<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> data

<span class="token comment">#Get the contract ABI</span>
<span class="token keyword">def</span> <span class="token function">get_abi</span><span class="token punctuation">(</span>p<span class="token punctuation">:</span> Path<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> p<span class="token punctuation">.</span><span class="token builtin">open</span><span class="token punctuation">(</span>mode<span class="token operator">=</span><span class="token string">'r'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> json_f<span class="token punctuation">:</span>
        <span class="token keyword">return</span> json<span class="token punctuation">.</span>load<span class="token punctuation">(</span>json_f<span class="token punctuation">)</span>


<span class="token keyword">class</span> <span class="token class-name">CounterContractEncoder</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> web3<span class="token punctuation">:</span> Web3<span class="token punctuation">,</span> bin_path<span class="token punctuation">:</span> Path<span class="token punctuation">,</span> abi_path<span class="token punctuation">:</span> Path<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>web3 <span class="token operator">=</span> web3
        self<span class="token punctuation">.</span>counter_contract <span class="token operator">=</span> self<span class="token punctuation">.</span>web3<span class="token punctuation">.</span>eth<span class="token punctuation">.</span>contract<span class="token punctuation">(</span>abi<span class="token operator">=</span>get_abi<span class="token punctuation">(</span>abi_path<span class="token punctuation">)</span><span class="token punctuation">,</span>
                                                       bytecode<span class="token operator">=</span>read_binary<span class="token punctuation">(</span>bin_path<span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">encode_method</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> fn_name<span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token builtin">list</span><span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> HexStr<span class="token punctuation">:</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span>counter_contract<span class="token punctuation">.</span>encodeABI<span class="token punctuation">(</span>fn_name<span class="token punctuation">,</span> args<span class="token punctuation">)</span>

<span class="token comment">#Deploy the contract</span>
<span class="token keyword">def</span> <span class="token function">deploy_contract_create2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    ZKSYNC_NETWORK_URL<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">'https://zkSync2-testnet.zkSync.dev'</span>
    account<span class="token punctuation">:</span> LocalAccount <span class="token operator">=</span> Account<span class="token punctuation">.</span>from_key<span class="token punctuation">(</span><span class="token string">'YOUR_PRIVATE_KEY'</span><span class="token punctuation">)</span>
    zkSync_web3 <span class="token operator">=</span> zkSyncBuilder<span class="token punctuation">.</span>build<span class="token punctuation">(</span>ZKSYNC_NETWORK_URL<span class="token punctuation">)</span>
    chain_id <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>chain_id
    signer <span class="token operator">=</span> PrivateKeyEthSigner<span class="token punctuation">(</span>account<span class="token punctuation">,</span> chain_id<span class="token punctuation">)</span>

    counter_contract_bin <span class="token operator">=</span> read_binary<span class="token punctuation">(</span><span class="token string">"PATH_TO_BINARY_COMPILED_CONTRACT"</span><span class="token punctuation">)</span>

    nonce <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>get_transaction_count<span class="token punctuation">(</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span> EthBlockParams<span class="token punctuation">.</span>PENDING<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    deployer <span class="token operator">=</span> ContractDeployer<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">)</span>
    random_salt <span class="token operator">=</span> generate_random_salt<span class="token punctuation">(</span><span class="token punctuation">)</span>
    precomputed_address <span class="token operator">=</span> deployer<span class="token punctuation">.</span>compute_l2_create2_address<span class="token punctuation">(</span>sender<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                                              bytecode<span class="token operator">=</span>counter_contract_bin<span class="token punctuation">,</span>
                                                              constructor<span class="token operator">=</span><span class="token string">b''</span><span class="token punctuation">,</span>
                                                              salt<span class="token operator">=</span>random_salt<span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"precomputed address: </span><span class="token interpolation"><span class="token punctuation">{</span>precomputed_address<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx <span class="token operator">=</span> create2_contract_transaction<span class="token punctuation">(</span>web3<span class="token operator">=</span>zkSync_web3<span class="token punctuation">,</span>
                                      from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                                      ergs_price<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                      ergs_limit<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>
                                      bytecode<span class="token operator">=</span>counter_contract_bin<span class="token punctuation">,</span>
                                      salt<span class="token operator">=</span>random_salt<span class="token punctuation">)</span>
    estimate_gas <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">.</span>zksync<span class="token punctuation">.</span>eth_estimate_gas<span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">)</span>
    gas_price <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>gas_price
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Fee for transaction is: </span><span class="token interpolation"><span class="token punctuation">{</span>estimate_gas <span class="token operator">*</span> gas_price<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    tx_712 <span class="token operator">=</span> Transaction712<span class="token punctuation">(</span>chain_id<span class="token operator">=</span>chain_id<span class="token punctuation">,</span>
                            nonce<span class="token operator">=</span>nonce<span class="token punctuation">,</span>
                            gas_limit<span class="token operator">=</span>estimate_gas<span class="token punctuation">,</span>
                            to<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"to"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            value<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"value"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            data<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"data"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                            maxPriorityFeePerGas<span class="token operator">=</span><span class="token number">100000000</span><span class="token punctuation">,</span>
                            maxFeePerGas<span class="token operator">=</span>gas_price<span class="token punctuation">,</span>
                            from_<span class="token operator">=</span>account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
                            meta<span class="token operator">=</span>tx<span class="token punctuation">[</span><span class="token string">"eip712Meta"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    singed_message <span class="token operator">=</span> signer<span class="token punctuation">.</span>sign_typed_data<span class="token punctuation">(</span>tx_712<span class="token punctuation">.</span>to_eip712_struct<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    msg <span class="token operator">=</span> tx_712<span class="token punctuation">.</span>encode<span class="token punctuation">(</span>singed_message<span class="token punctuation">)</span>
    tx_hash <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>send_raw_transaction<span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    tx_receipt <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>wait_for_transaction_receipt<span class="token punctuation">(</span>tx_hash<span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">240</span><span class="token punctuation">,</span> poll_latency<span class="token operator">=</span><span class="token number">0.5</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"tx status: </span><span class="token interpolation"><span class="token punctuation">{</span>tx_receipt<span class="token punctuation">[</span><span class="token string">'status'</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    contract_address <span class="token operator">=</span> tx_receipt<span class="token punctuation">[</span><span class="token string">"contractAddress"</span><span class="token punctuation">]</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"contract address: </span><span class="token interpolation"><span class="token punctuation">{</span>contract_address<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>

    counter_contract_encoder <span class="token operator">=</span> CounterContractEncoder<span class="token punctuation">(</span>zkSync_web3<span class="token punctuation">,</span> <span class="token string">"CONTRACT_BIN_PATH"</span><span class="token punctuation">,</span> <span class="token string">"CONTRACT_ABI_PATH"</span><span class="token punctuation">)</span>
    call_data <span class="token operator">=</span> counter_contract_encoder<span class="token punctuation">.</span>encode_method<span class="token punctuation">(</span>fn_name<span class="token operator">=</span><span class="token string">"get"</span><span class="token punctuation">,</span> args<span class="token operator">=</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    eth_tx<span class="token punctuation">:</span> TxParams <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token string">"from"</span><span class="token punctuation">:</span> account<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        <span class="token string">"to"</span><span class="token punctuation">:</span> contract_address<span class="token punctuation">,</span>
        <span class="token string">"data"</span><span class="token punctuation">:</span> call_data
    <span class="token punctuation">}</span>
    eth_ret <span class="token operator">=</span> zkSync_web3<span class="token punctuation">.</span>zkSync<span class="token punctuation">.</span>call<span class="token punctuation">(</span>eth_tx<span class="token punctuation">,</span> ZkBlockParams<span class="token punctuation">.</span>COMMITTED<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
    result <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">.</span>from_bytes<span class="token punctuation">(</span>eth_ret<span class="token punctuation">,</span> <span class="token string">"big"</span><span class="token punctuation">,</span> signed<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Call method for deployed contract, address: </span><span class="token interpolation"><span class="token punctuation">{</span>contract_address<span class="token punctuation">}</span></span><span class="token string">, value: </span><span class="token interpolation"><span class="token punctuation">{</span>result<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    deploy_contract_create2<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>⚠️ This section of the docs is still in progress and will be updated with more detailed information soon.</p>
</div>
</div></template>


