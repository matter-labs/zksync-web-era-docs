<template><div><h1 id="web3-api" tabindex="-1"><a class="header-anchor" href="#web3-api" aria-hidden="true">#</a> Web3 API</h1>
<p>zkSync 2.0 fully supports the standard <a href="https://ethereum.org/en/developers/docs/apis/json-rpc/" target="_blank" rel="noopener noreferrer">Ethereum JSON-RPC API<ExternalLinkIcon/></a> and adds some L2-specific features.</p>
<p>As long as the code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that <a href="#eip712">below</a>), <em>no changes to the codebase are needed.</em></p>
<p>It is possible to continue using the SDK that is currently in use. Users will continue paying fees in ETH, and the UX will be identical to the one on Ethereum.</p>
<p>However, zkSync has its specifics, which this section describes.</p>
<h2 id="eip712" tabindex="-1"><a class="header-anchor" href="#eip712" aria-hidden="true">#</a> EIP712</h2>
<p>To specify additional fields, like the custom signature for custom accounts or to choose the paymaster, EIP712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but they also have fields that contain additional L2-specific data (<code v-pre>paymaster</code>, etc).</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token property">"ergsPerPubdata"</span><span class="token operator">:</span> <span class="token string">"1212"</span><span class="token punctuation">,</span>
<span class="token property">"customSignature"</span><span class="token operator">:</span> <span class="token string">"0x..."</span><span class="token punctuation">,</span>
<span class="token property">"paymasterParams"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">"paymaster"</span><span class="token operator">:</span> <span class="token string">"0x..."</span><span class="token punctuation">,</span>
  <span class="token property">"paymasterInput"</span><span class="token operator">:</span> <span class="token string">"0x..."</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token property">"factory_deps"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"0x..."</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>ergsPerPubdata</code>: is a field that describes the maximal amount of ergs the user is willing to pay for a single byte of pubdata.</li>
<li><code v-pre>customSignature</code> is a field with a custom signature, in case the signer's account is not EOA.</li>
<li><code v-pre>paymasterParams</code> is a field with parameters for configuring the custom paymaster for the transaction. The address of the paymaster and the encoded input to call it are in the paymaster parameters.</li>
<li><code v-pre>factory_deps</code> is a field that should be a non-empty array of <code v-pre>bytes</code> for deployment transactions. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which can be deployed by it.</li>
</ul>
<p>To let the server recognize EIP712 transactions, the <code v-pre>transaction_type</code> field is equal to <code v-pre>113</code> (unfortunately the number <code v-pre>712</code> can not be used as the <code v-pre>transaction_type</code> since the type has to be one byte long).</p>
<p>Instead of signing the RLP-encoded transaction, the user signs the following typed EIP712 structure:</p>
<table>
<thead>
<tr>
<th>Field name</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>txType</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>from</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>to</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>ergsLimit</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>ergsPerPubdataByteLimit</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>maxFeePerErg</td>
<td><code v-pre>uint256 </code></td>
</tr>
<tr>
<td>maxPriorityFeePerErg</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>paymaster</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>nonce</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>value</td>
<td><code v-pre>uint256</code></td>
</tr>
<tr>
<td>data</td>
<td><code v-pre>bytes</code></td>
</tr>
<tr>
<td>factoryDeps</td>
<td><code v-pre>bytes32[]</code></td>
</tr>
<tr>
<td>paymasterInput</td>
<td><code v-pre>bytes</code></td>
</tr>
</tbody>
</table>
<p>These fields are conveniently handled by our <RouterLink to="/api/js/features.html">SDK</RouterLink>.</p>
<h2 id="zksync-specific-json-rpc-methods" tabindex="-1"><a class="header-anchor" href="#zksync-specific-json-rpc-methods" aria-hidden="true">#</a> zkSync-specific JSON-RPC methods</h2>
<p>All zkSync-specific methods are located in the <code v-pre>zks_</code> namespace. The API may also provide methods other than those provided here. These methods are to be used internally by the team and are very unstable.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>Please note that Metamask does not support zks_ namespace's methods, we are working to support it in the future, alternatively, you can use the <code v-pre>Provider</code> class with the testnet RPC instead of relying on Metamask's injected provider.</p>
</div>
<!-- ### `zks_estimateFee`

Returns the fee for the transaction. The token in which the fee is calculated is returned based on the `fee_token` in the transaction provided.

#### Input parameters

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| req       | `CallRequest` | The zkSync transaction for which the fee should be estimated |

#### Output format

```json
{
  "ergs_limit": 100000000,
  "ergs_price_limit": 10000,
  "fee_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "ergs_per_storage_limit": 100,
  "ergs_per_pubdata_limit": 10
}
``` -->
<h3 id="zks-getmaincontract" tabindex="-1"><a class="header-anchor" href="#zks-getmaincontract" aria-hidden="true">#</a> <code v-pre>zks_getMainContract</code></h3>
<p>Returns the address of the zkSync contract.</p>
<h3 id="input-parameters" tabindex="-1"><a class="header-anchor" href="#input-parameters" aria-hidden="true">#</a> Input parameters</h3>
<p>None.</p>
<h3 id="output-format" tabindex="-1"><a class="header-anchor" href="#output-format" aria-hidden="true">#</a> Output format</h3>
<p><code v-pre>&quot;0xaBEA9132b05A70803a4E85094fD0e1800777fBEF&quot;</code></p>
<h3 id="zks-l1chainid" tabindex="-1"><a class="header-anchor" href="#zks-l1chainid" aria-hidden="true">#</a> <code v-pre>zks_L1ChainId</code></h3>
<p>Returns the chain id of the underlying L1.</p>
<h3 id="input-parameters-1" tabindex="-1"><a class="header-anchor" href="#input-parameters-1" aria-hidden="true">#</a> Input parameters</h3>
<p>None.</p>
<h3 id="output-format-1" tabindex="-1"><a class="header-anchor" href="#output-format-1" aria-hidden="true">#</a> Output format</h3>
<p><code v-pre>12</code></p>
<h3 id="zks-getconfirmedtokens" tabindex="-1"><a class="header-anchor" href="#zks-getconfirmedtokens" aria-hidden="true">#</a> <code v-pre>zks_getConfirmedTokens</code></h3>
<p>Given <code v-pre>from</code> and <code v-pre>limit</code> return information about the confirmed tokens with IDs in the interval <code v-pre>[from..from+limit-1]</code>. &quot;Confirmed&quot; is the wrong word here, since a confirmed token has already been bridged through the default zkSync bridge.</p>
<p>The tokens are returned in alphabetical order by their symbols, so a token's id is just its place in an array of tokens that has been sorted by symbols.</p>
<h3 id="input-parameters-2" tabindex="-1"><a class="header-anchor" href="#input-parameters-2" aria-hidden="true">#</a> Input parameters</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>from</td>
<td><code v-pre>uint32</code></td>
<td>The token id from which to start returning the information about the tokens.</td>
</tr>
<tr>
<td>limit</td>
<td><code v-pre>uint8</code></td>
<td>The number of tokens to be returned from the API.</td>
</tr>
</tbody>
</table>
<h3 id="output-format-2" tabindex="-1"><a class="header-anchor" href="#output-format-2" aria-hidden="true">#</a> Output format</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">"address"</span><span class="token operator">:</span> <span class="token string">"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"</span><span class="token punctuation">,</span>
    <span class="token property">"decimals"</span><span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"ETH"</span><span class="token punctuation">,</span>
    <span class="token property">"symbol"</span><span class="token operator">:</span> <span class="token string">"ETH"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"address"</span><span class="token operator">:</span> <span class="token string">"0xd2255612f9b045e9c81244bb874abb413ca139a3"</span><span class="token punctuation">,</span>
    <span class="token property">"decimals"</span><span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"TrueUSD"</span><span class="token punctuation">,</span>
    <span class="token property">"symbol"</span><span class="token operator">:</span> <span class="token string">"TUSD"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"address"</span><span class="token operator">:</span> <span class="token string">"0xd35cceead182dcee0f148ebac9447da2c4d449c4"</span><span class="token punctuation">,</span>
    <span class="token property">"decimals"</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"USD Coin (goerli)"</span><span class="token punctuation">,</span>
    <span class="token property">"symbol"</span><span class="token operator">:</span> <span class="token string">"USDC"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="zks-getl2tol1logproof" tabindex="-1"><a class="header-anchor" href="#zks-getl2tol1logproof" aria-hidden="true">#</a> <code v-pre>zks_getL2ToL1LogProof</code></h3>
<p>Given a transaction hash, and an index of the L2 to L1 log produced within the transaction, it returns the proof for the corresponding L2 to L1 log.</p>
<p>The index of the log that can be obtained from the transaction receipt (it includes a list of every log produced by the transaction).</p>
<h3 id="input-parameters-3" tabindex="-1"><a class="header-anchor" href="#input-parameters-3" aria-hidden="true">#</a> Input parameters</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>tx_hash</td>
<td><code v-pre>bytes32</code></td>
<td>Hash of the L2 transaction the L2 to L1 log was produced within.</td>
</tr>
<tr>
<td>l2_to_l1_log_index</td>
<td><code v-pre>undefined</code> | <code v-pre>number</code></td>
<td>The Index of the L2 to L1 log in the transaction.</td>
</tr>
</tbody>
</table>
<h3 id="output-format-3" tabindex="-1"><a class="header-anchor" href="#output-format-3" aria-hidden="true">#</a> Output format</h3>
<p>If there was no such message, the returned value is <code v-pre>null</code>.</p>
<p>Otherwise, the object of the following format is returned:</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">"proof"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"0x66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925"</span><span class="token punctuation">,</span>
    <span class="token string">"0x2eeb74a6177f588d80c0c752b99556902ddf9682d0b906f5aa2adbaf8466a4e9"</span><span class="token punctuation">,</span>
    <span class="token string">"0x1223349a40d2ee10bd1bebb5889ef8018c8bc13359ed94b387810af96c6e4268"</span><span class="token punctuation">,</span>
    <span class="token string">"0x5b82b695a7ac2668e188b75f7d4fa79faa504117d1fdfcbe8a46915c1a8a5191"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"root"</span><span class="token operator">:</span> <span class="token string">"0x6a420705824f0a3a7e541994bc15e14e6a8991cd4e4b2d35c66f6e7647760d97"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>id</code> is the position of the leaf in the Merkle tree of L2-&gt;L1 messages for the block. The <code v-pre>proof</code> is the Merkle proof for the message, while the <code v-pre>root </code> is the root of the Merkle tree of L2-&gt;L1 messages. Please note, that the Merkle tree uses <em>sha256</em> for the trees.</p>
<p>You do not need to care about the intrinsics, since the returned <code v-pre>id</code> and <code v-pre>proof</code> can be used right away for interacting with the zkSync smart contract.</p>
<p>A nice example of using this endpoint via our SDK can be found <RouterLink to="/dev/developer-guides/bridging/l2-l1.html">here</RouterLink>.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>The list of L2 to L1 logs produced by the transaction, which is included in the receipts, is a combination of logs produced by L1Messenger contract or other system contracts/bootloader.</p>
<p>There is a log produced by the bootloader for every L1 originated transaction that shows if the transaction has succeeded.</p>
</div>
<h3 id="zks-getl2tol1msgproof" tabindex="-1"><a class="header-anchor" href="#zks-getl2tol1msgproof" aria-hidden="true">#</a> <code v-pre>zks_getL2ToL1MsgProof</code></h3>
<p>Given a block, a sender, a message, and an optional message log index in the block containing the L1-&gt;L2 message, it returns the proof for the message sent via the L1Messenger system contract.</p>
<h3 id="input-parameters-4" tabindex="-1"><a class="header-anchor" href="#input-parameters-4" aria-hidden="true">#</a> Input parameters</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>block</td>
<td><code v-pre>uint32</code></td>
<td>The number of the block where the message was emitted.</td>
</tr>
<tr>
<td>sender</td>
<td><code v-pre>address</code></td>
<td>The sender of the message (i.e. the account that called the L1Messenger system contract).</td>
</tr>
<tr>
<td>msg</td>
<td><code v-pre>bytes32</code></td>
<td>The keccak256 hash of the sent message.</td>
</tr>
<tr>
<td>l2_log_position</td>
<td><code v-pre>uint256</code> | <code v-pre>null</code></td>
<td>The index in the block of the event that was emitted by the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#il1messenger">L1Messenger</RouterLink> when submitting this message. If it is ommitted, the proof for the first message with such content will be returned.</td>
</tr>
</tbody>
</table>
<h3 id="output-format-4" tabindex="-1"><a class="header-anchor" href="#output-format-4" aria-hidden="true">#</a> Output format</h3>
<p>The same as in <a href="#output-format-4">zks_getL2ToL1LogProof</a>.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p><code v-pre>zks_getL2ToL1MsgProof</code> endpoint will be deprecated because proofs for L2 to L1 messages can also be fetched from <code v-pre>zks_getL2ToL1LogProof</code>.</p>
</div>
<h3 id="zks-getbridgecontracts" tabindex="-1"><a class="header-anchor" href="#zks-getbridgecontracts" aria-hidden="true">#</a> <code v-pre>zks_getBridgeContracts</code></h3>
<p>Returns L1/L2 addresses of default bridges.</p>
<h3 id="input-parameters-5" tabindex="-1"><a class="header-anchor" href="#input-parameters-5" aria-hidden="true">#</a> Input parameters</h3>
<p>None.</p>
<h3 id="output-format-5" tabindex="-1"><a class="header-anchor" href="#output-format-5" aria-hidden="true">#</a> Output format</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"l1Erc20DefaultBridge"</span><span class="token operator">:</span> <span class="token string">"0x7786255495348c08f82c09c82352019fade3bf29"</span><span class="token punctuation">,</span>
  <span class="token property">"l1EthDefaultBridge"</span><span class="token operator">:</span> <span class="token string">"0xcbebcd41ceabbc85da9bb67527f58d69ad4dfff5"</span><span class="token punctuation">,</span>
  <span class="token property">"l2Erc20DefaultBridge"</span><span class="token operator">:</span> <span class="token string">"0x92131f10c54f9b251a5deaf3c05815f7659bbe02"</span><span class="token punctuation">,</span>
  <span class="token property">"l2EthDefaultBridge"</span><span class="token operator">:</span> <span class="token string">"0x2c5d8a991f399089f728f1ae40bd0b11acd0fb62"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="zks-gettestnetpaymaster" tabindex="-1"><a class="header-anchor" href="#zks-gettestnetpaymaster" aria-hidden="true">#</a> <code v-pre>zks_getTestnetPaymaster</code></h3>
<p>Returns the address of the <RouterLink to="/dev/developer-guides/aa.html#testnet-paymaster">testnet paymaster</RouterLink>: the paymaster that is available on testnets and enables paying fees in ERC-20 compatible tokens.</p>
<h3 id="input-parameters-6" tabindex="-1"><a class="header-anchor" href="#input-parameters-6" aria-hidden="true">#</a> Input parameters</h3>
<p>None.</p>
<h3 id="output-format-6" tabindex="-1"><a class="header-anchor" href="#output-format-6" aria-hidden="true">#</a> Output format</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token string">"0x7786255495348c08f82c09c82352019fade3bf29"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="zks-getblockdetails" tabindex="-1"><a class="header-anchor" href="#zks-getblockdetails" aria-hidden="true">#</a> <code v-pre>zks_getBlockDetails</code></h3>
<p>Returns additional ZkSync-specific information about the L2 block.</p>
<h3 id="input-parameters-7" tabindex="-1"><a class="header-anchor" href="#input-parameters-7" aria-hidden="true">#</a> Input parameters</h3>
<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>block</td>
<td><code v-pre>uint32</code></td>
<td>The number of the block.</td>
</tr>
</tbody>
</table>
<h3 id="output-format-7" tabindex="-1"><a class="header-anchor" href="#output-format-7" aria-hidden="true">#</a> Output format</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"commitTxHash"</span><span class="token operator">:</span> <span class="token string">"0x2c8f18312c6b6c2e72df56dd5684e3c65fcdf5f6141763eafdcbbfc02c3a39b5"</span><span class="token punctuation">,</span>
  <span class="token property">"committedAt"</span><span class="token operator">:</span> <span class="token string">"2022-12-12T08:41:50.774441Z"</span><span class="token punctuation">,</span>
  <span class="token property">"executeTxHash"</span><span class="token operator">:</span> <span class="token string">"0xa12f3a9689101758acad280dd21a00cfc2644c125702ea301f46a33799cde9b9"</span><span class="token punctuation">,</span>
  <span class="token property">"executedAt"</span><span class="token operator">:</span> <span class="token string">"2022-12-12T08:41:57.233941Z"</span><span class="token punctuation">,</span>
  <span class="token property">"l1TxCount"</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
  <span class="token property">"l2TxCount"</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">"number"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token property">"proveTxHash"</span><span class="token operator">:</span> <span class="token string">"0x0fed6d8a7b02a26b5513edea10d8849342b56a13c0e48317556c78b34aeacd26"</span><span class="token punctuation">,</span>
  <span class="token property">"provenAt"</span><span class="token operator">:</span> <span class="token string">"2022-12-12T08:41:57.219584Z"</span><span class="token punctuation">,</span>
  <span class="token property">"rootHash"</span><span class="token operator">:</span> <span class="token string">"0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f"</span><span class="token punctuation">,</span>
  <span class="token property">"status"</span><span class="token operator">:</span> <span class="token string">"verified"</span><span class="token punctuation">,</span>
  <span class="token property">"timestamp"</span><span class="token operator">:</span> <span class="token number">1670834504</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><!-- TODO: uncomment once fixed --->
<!-- ### `zks_getTokenPrice`

Given a token address, returns its price in USD. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

### Input parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| address   | `address` | The address of the token. |

### Output format

`3500.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000` -->
<!--

#[rpc(name = "zks_getConfirmedTokens", returns = "Vec<Token>")]
fn get_confirmed_tokens(&self, from: u32, limit: u8) -> BoxFutureResult<Vec<Token>>;

#[rpc(name = "zks_isTokenLiquid", returns = "bool")]
fn is_token_liquid(&self, token_address: Address) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getTokenPrice", returns = "BigDecimal")]
fn get_token_price(&self, token_address: Address) -> BoxFutureResult<BigDecimal>;

#[rpc(name = "zks_setContractDebugInfo", returns = "bool")]
fn set_contract_debug_info(
    &self,
    contract_address: Address,
    info: ContractSourceDebugInfo,
) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getContractDebugInfo", returns = "ContractSourceDebugInfo")]
fn get_contract_debug_info(
    &self,
    contract_address: Address,
) -> BoxFutureResult<Option<ContractSourceDebugInfo>>;

#[rpc(name = "zks_getTransactionTrace", returns = "Option<VmDebugTrace>")]
fn get_transaction_trace(&self, hash: H256) -> BoxFutureResult<Option<VmDebugTrace>>;





Documented:
#[rpc(name = "zks_estimateFee", returns = "Fee")]
fn estimate_fee(&self, req: CallRequest) -> BoxFutureResult<Fee>;

#[rpc(name = "zks_getMainContract", returns = "Address")]
fn get_main_contract(&self) -> BoxFutureResult<Address>;

#[rpc(name = "zks_L1ChainId", returns = "U64")]
fn l1_chain_id(&self) -> Result<U64>;

#[rpc(name = "zks_getL1WithdrawalTx", returns = "Option<H256>")]
fn get_eth_withdrawal_tx(&self, withdrawal_hash: H256) -> BoxFutureResult<Option<H256>>;



Don't want to document (at least for now):

### `zks_getAccountTransactions`

### Input parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| address   | `Address` | The address of the account                            |
| before    | `u32`     | The offset from which to start returning transactions |
| limit     | `u8`      | The maximum number of transactions to be returned     |





-->
<h2 id="pubsub-api" tabindex="-1"><a class="header-anchor" href="#pubsub-api" aria-hidden="true">#</a> PubSub API</h2>
<p>zkSync is fully compatible with <a href="https://geth.ethereum.org/docs/rpc/pubsub" target="_blank" rel="noopener noreferrer">Geth's pubsub API<ExternalLinkIcon/></a>, except for the <code v-pre>syncing</code> subscription, as it doesn't have meaning for the zkSync network since technically our nodes are always synced.</p>
<p>The WebSocket URL is <code v-pre>wss://zksync2-testnet.zksync.dev/ws</code>.</p>
</div></template>


