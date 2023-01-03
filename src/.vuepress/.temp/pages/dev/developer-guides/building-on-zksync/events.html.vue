<template><div><h1 id="handling-events" tabindex="-1"><a class="header-anchor" href="#handling-events" aria-hidden="true">#</a> Handling events</h1>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p>Events are a mechanism to publish information to listeners outside the blockchain, given that smart contracts themselves can't read them.</p>
<p>Blockchains are public by design, and therefore make all information available to the public, and any actions can be discovered by carefully looking into the transactions. Events are a shortcut for making specific information easily available for external systems; they let dApps keep track of, and respond to what's happening to a smart contract. They can also be searched for because they are indexable. Therefore, you should emit an event anytime something occurs in your smart contract that some system outside the blockchain should be aware of so that the outside system may listen for such occurrences.
Events are included in the transaction logs of the same block containing the original transaction.</p>
<p>At zkSync, events behave the same way as in Ethereum.</p>
<h2 id="events-filtering" tabindex="-1"><a class="header-anchor" href="#events-filtering" aria-hidden="true">#</a> Events filtering</h2>
<p>Filtering is used to query indexed data and provide lower-cost data storage when the data is not required to be accessed on-chain.
When filtering, you should load events by block ranges (0-1999, 2000-3999, ...) and index the result on your end. Otherwise you will get an error that says &quot;block range should be less than or equal to 2000&quot;.</p>
<p>These can be used in conjunction with the <a href="https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods" target="_blank" rel="noopener noreferrer">Provider Events API<ExternalLinkIcon/></a> and with the <a href="https://docs.ethers.io/v5/api/contract/contract/#Contract--events" target="_blank" rel="noopener noreferrer">Contract Events API<ExternalLinkIcon/></a>.</p>
<h2 id="getting-the-events" tabindex="-1"><a class="header-anchor" href="#getting-the-events" aria-hidden="true">#</a> Getting the events</h2>
<p>Here is an example to listen for smart contract events:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> contractABI <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./ABI_JSON"</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token function-variable function">listenEvents</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> contractAddress <span class="token operator">=</span> <span class="token string">"&lt;CONTRACT_ADDRESS>"</span>
  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ether<span class="token punctuation">.</span>providers<span class="token punctuation">.</span>WebSocketProvider</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">wss://zksync2-testnet.zksync.dev/ws</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> contract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers<span class="token punctuation">.</span>Contract</span><span class="token punctuation">(</span>contractAddress<span class="token punctuation">,</span> contractABI<span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token comment">// starts listening to Transfer events on contract</span>
  contract<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"Transfer"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// optional filter parameters</span>
    <span class="token keyword">let</span> options <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">filter</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">INDEXED_PARAMETER</span><span class="token operator">:</span> <span class="token constant">VALUE</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// e.g { from: '0x48c6c0923b514db081782271355e5745c49wd60' }</span>
        <span class="token literal-property property">fromBlock</span><span class="token operator">:</span> <span class="token constant">START_BLOCK_NUMBER</span><span class="token punctuation">,</span> <span class="token comment">// e.g 15943000</span>
        <span class="token literal-property property">toBlock</span><span class="token operator">:</span> <span class="token constant">END_BLOCK_NUMBER</span><span class="token punctuation">,</span> <span class="token comment">// e.g 15943100</span>
        <span class="token literal-property property">data</span><span class="token operator">:</span> event<span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>options<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">listenEvents</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Provider: Your websocket provider through which you will retrieve the events data. Note that you need to use the websocket endpoint.</li>
<li>Contract address: The contract address whose events you want to track.</li>
<li>ABI: The ABI (Application Binary Interface) of the contract in JSON format.</li>
<li>Event name: The name of the event as defined in the smart contract. In this example we used the &quot;Transfer&quot; event from an ERC20 contract.</li>
<li>Indexed parameter : The indexed parameter of the event.</li>
<li>Block number: The block number range for the events retrieval, it involves the <code v-pre>START_BLOCK_NUMBER</code> and the <code v-pre>END_BLOCK_NUMBER</code>.</li>
</ul>
<p><strong>Note</strong>: zkSync has a 10K log limit per response. This means that if you receive a response with 10k events, it will most likely contain additional events so it'd be a good idea to adjust the filters to retrieve the events in multiple batches.</p>
</div></template>


