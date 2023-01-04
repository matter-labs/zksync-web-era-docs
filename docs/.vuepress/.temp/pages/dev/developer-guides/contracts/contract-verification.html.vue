<template><div><h1 id="verify-contracts" tabindex="-1"><a class="header-anchor" href="#verify-contracts" aria-hidden="true">#</a> Verify contracts</h1>
<h2 id="verify-smart-contracts-by-using-block-explorer-ui" tabindex="-1"><a class="header-anchor" href="#verify-smart-contracts-by-using-block-explorer-ui" aria-hidden="true">#</a> Verify smart contracts by using block explorer UI</h2>
<p>Now that you have learned how to deploy your contracts, you might be interested to know how you can <strong>verify</strong> the contracts deployed on zkSync using the official block explorer. All the details about how to verify contracts can be found on the <a href="https://v2-docs.zksync.io/api/tools/block-explorer/contract-verification.html" target="_blank" rel="noopener noreferrer">block explorer<ExternalLinkIcon/></a> page.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="verify-smart-contracts-with-the-hardhat-zksync-verify-plugin" tabindex="-1"><a class="header-anchor" href="#verify-smart-contracts-with-the-hardhat-zksync-verify-plugin" aria-hidden="true">#</a> Verify smart contracts with the hardhat-zksync-verify plugin</h2>
<p>To use the hardhat-zksync-verify plugin first add it to your project by running <code v-pre>yarn add @matterlabs/hardhat-zksync-verify</code>
After that, define your network configuration (&quot;testnet&quot; in this case):</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>networks<span class="token operator">:</span> <span class="token punctuation">{</span>
  testnet<span class="token operator">:</span> <span class="token punctuation">{</span>
    zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    url<span class="token operator">:</span> <span class="token string">'https://zksync2-testnet.zksync.dev'</span><span class="token punctuation">,</span>
    ethNetwork<span class="token operator">:</span> <span class="token string">'goerli'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>By setting the <code v-pre>zksync</code> parameter to true when running verify task, you will be verifying smart contracts on the zkSync network, but since we support verify backward compatibility, you can also verify a smart contract directly on the Ethereum network within the same project. All you need to do is to specify your network with <code v-pre>zksync: false</code> settings and follow the rest of the <a href="https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan" target="_blank" rel="noopener noreferrer">Etherscan verification instructions<ExternalLinkIcon/></a>.</p>
<h3 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h3>
<p>To verify the contract, you need to provide the contract's address: </br>
<code v-pre>yarn hardhat verify --network &lt;network&gt; &lt;contract address&gt;</code></p>
<p>With the <code v-pre>--contract</code> parameter you can also specify which contract from your local setup you want to verify by specifying its Fully qualified name. Fully qualified name structure looks like this: &quot;contracts/AContract.sol:TheContract&quot; </br></p>
<p>Example: <code v-pre>yarn hardhat verify --network &lt;network&gt; &lt;contract address&gt; --contract &lt;fully qualified name&gt;</code></p>
<p>This parameter is optional. If not specified, the verify task will try to compare compiled bytecode of all the contracts in your local setup to the deployed bytecode of the contract you are trying to verify. If there is no match, it will report an error.</p>
<h3 id="constructor-arguments" tabindex="-1"><a class="header-anchor" href="#constructor-arguments" aria-hidden="true">#</a> Constructor arguments</h3>
<p>Constructor arguments are an optional positional parameter you can add if your contract was deployed with the specific constructor arguments. For example: <br/>
<code v-pre>yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF &quot;Hi there!&quot;</code></p>
<p>If your constructor takes a complex argument list, you can write a separate javascript module to export it. <br/>
For example, create an <code v-pre>arguments.js</code> file with the following structure:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">"a string argument"</span><span class="token punctuation">,</span>
  <span class="token string">"0xabcdef"</span><span class="token punctuation">,</span>
  <span class="token string">"42"</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    property1<span class="token operator">:</span> <span class="token string">"one"</span><span class="token punctuation">,</span>
    property2<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Include it in the verify function call by adding a new parameter: <code v-pre>--constructor-args arguments.js </code>
<code v-pre>yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js&quot;</code></p>
<h2 id="verify-smart-contract-programmatically" tabindex="-1"><a class="header-anchor" href="#verify-smart-contract-programmatically" aria-hidden="true">#</a> Verify smart contract programmatically</h2>
<p>If you need to run the verification task directly from your code, you can use the hardhat &quot;verify:verify&quot; task with the previously mentioned parameters with the difference in using <code v-pre>--address</code> parameter when specifying contarct's address:<br/></p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">await</span> hre<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token string">"verify:verify"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  address<span class="token operator">:</span> contractAddress<span class="token punctuation">,</span>
  contract<span class="token operator">:</span> contractFullyQualifedName<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


