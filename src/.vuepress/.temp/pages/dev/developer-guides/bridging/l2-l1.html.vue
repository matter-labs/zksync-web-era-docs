<template><div><h1 id="l2-l1-communication" tabindex="-1"><a class="header-anchor" href="#l2-l1-communication" aria-hidden="true">#</a> L2 -&gt; L1 communication</h1>
<p>This section describes the interface to interact with Ethereum from L2. It assumes that you are already familiar with the basic concepts of working with L2 -&gt; L1 communication. If you are new to this topic, you can read the conceptual introduction <RouterLink to="/dev/developer-guides/bridging/l1-l2-interop.html#l2-l1-communication">here</RouterLink>.</p>
<h2 id="structure" tabindex="-1"><a class="header-anchor" href="#structure" aria-hidden="true">#</a> Structure</h2>
<p>Unlike L1 -&gt; L2 communication, it is impossible to directly initialize transactions from L2 to L1. However, you can send an arbitrary-length message from zkSync to Ethereum, and then handle the received message on an L1 smart contract.  To send a message from the L2 side, you should call the <code v-pre>sendToL1</code> method from the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger">messenger system contract</RouterLink>. It accepts only the bytes of the message that is sent to the zkSync smart contract on Ethereum.</p>
<p>From the L1 side, the zkSync smart contract provides the method <code v-pre>proveL2MessageInclusion</code> to prove that the message was sent to L1 and included in a zkSync block.</p>
<h2 id="sending-a-message-from-l2-to-l1" tabindex="-1"><a class="header-anchor" href="#sending-a-message-from-l2-to-l1" aria-hidden="true">#</a> Sending a message from L2 to L1</h2>
<p>Sending messages from the L2 side requires users to call the <code v-pre>sendToL1</code> method from the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger">Messenger system contract</RouterLink>. This method accepts only the bytes of the message that is being sent to the zkSync smart contract on L1.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>function sendToL1(bytes memory _message) external returns (bytes32 messageHash);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>_message</code> is a parameter that contains the raw bytes of the message</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>The message sender will be determined from context.</p>
</div>
<p>This function sends a message from L2 and returns the keccak256 hash of the message bytes. The message hash can be used later to get proof that the message was sent on L1. Its use is optional and is for convenience purposes only.</p>
<p>More information about Messenger can be found in the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger">system contracts section</RouterLink>.</p>
<h3 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h3>
<h4 id="sending-a-message-from-l2-to-l1-using-zksync-web3" tabindex="-1"><a class="header-anchor" href="#sending-a-message-from-l2-to-l1-using-zksync-web3" aria-hidden="true">#</a> Sending a message from L2 to L1 using <code v-pre>zksync-web3</code></h4>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> Contract<span class="token punctuation">,</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">TEST_PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"&lt;YOUR_PRIVATE_KEY>"</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> zkSyncProvider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">TEST_PRIVATE_KEY</span><span class="token punctuation">,</span> zkSyncProvider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> messengerContract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Contract</span><span class="token punctuation">(</span>utils<span class="token punctuation">.</span><span class="token constant">L1_MESSENGER_ADDRESS</span><span class="token punctuation">,</span> utils<span class="token punctuation">.</span><span class="token constant">L1_MESSENGER</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Messenger contract address is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>messengerContract<span class="token punctuation">.</span>address<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> someString <span class="token operator">=</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">toUtf8Bytes</span><span class="token punctuation">(</span><span class="token string">"Some L2->L1 message"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Sending message from L2 to L1</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> messengerContract<span class="token punctuation">.</span><span class="token function">sendToL1</span><span class="token punctuation">(</span>someString<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"L2 trx hash is "</span><span class="token punctuation">,</span> tx<span class="token punctuation">.</span>hash<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> receipt <span class="token operator">=</span> <span class="token keyword">await</span> tx<span class="token punctuation">.</span><span class="token function">waitFinalize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Transaction included in block </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>receipt<span class="token punctuation">.</span>blockNumber<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Get proof that the message was sent to L1</span>
  <span class="token keyword">const</span> msgProof <span class="token operator">=</span> <span class="token keyword">await</span> zkSyncProvider<span class="token punctuation">.</span><span class="token function">getMessageProof</span><span class="token punctuation">(</span>receipt<span class="token punctuation">.</span>blockNumber<span class="token punctuation">,</span> wallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">keccak256</span><span class="token punctuation">(</span>someString<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Proof that message was sent to L1 :>> "</span><span class="token punctuation">,</span> msgProof<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">try</span> <span class="token punctuation">{</span>
  <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="smart-contract-in-l2-that-sends-a-message-to-l1" tabindex="-1"><a class="header-anchor" href="#smart-contract-in-l2-that-sends-a-message-to-l1" aria-hidden="true">#</a> Smart contract in L2 that sends a message to L1</h4>
<p>The following contract sends its address to L1 via the Messenger system contract:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token comment">// Importing interfaces and addresses of the system contracts</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Example</span> <span class="token punctuation">{</span>
    <span class="token keyword">function</span> <span class="token function">sendMessageToL1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">returns</span><span class="token punctuation">(</span><span class="token builtin">bytes32</span> messageHash<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// Construct the message directly on the contract</span>
        <span class="token builtin">bytes</span> <span class="token keyword">memory</span> message <span class="token operator">=</span> abi<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token builtin">address</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        messageHash <span class="token operator">=</span> L1_MESSENGER_CONTRACT<span class="token punctuation">.</span><span class="token function">sendToL1</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="proving-the-inclusion-of-the-message-into-the-l2-block" tabindex="-1"><a class="header-anchor" href="#proving-the-inclusion-of-the-message-into-the-l2-block" aria-hidden="true">#</a> Proving the inclusion of the message into the L2 block</h2>
<p>From the L1 side, the zkSync smart contract provides an interface to prove that the message was sent to L1 and included in a zkSync block.</p>
<p>The <code v-pre>proveL2MessageInclusion</code> function from the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/facets/Mailbox.sol" target="_blank" rel="noopener noreferrer">Mailbox L1 contract<ExternalLinkIcon/></a>, returns a boolean value that indicates that a message with such parameters, was sent to L1.</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code>
    <span class="token keyword">struct</span> <span class="token class-name">L2Message</span> <span class="token punctuation">{</span>
        <span class="token builtin">address</span> sender<span class="token punctuation">;</span>
        <span class="token builtin">bytes</span> data<span class="token punctuation">;</span>
        <span class="token builtin">uint256</span> txNumberInblock<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">proveL2MessageInclusion</span><span class="token punctuation">(</span>
        <span class="token builtin">uint32</span> _blockNumber<span class="token punctuation">,</span>
        <span class="token builtin">uint256</span> _index<span class="token punctuation">,</span>
        L2Message <span class="token keyword">calldata</span> _message<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">calldata</span> _proof
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">view</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bool</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Here is a detailed description of the required parameters:</p>
<ul>
<li><code v-pre>_blockNumber</code> is the L1 batch number in which the L2 block was included. It can be retrieved using the <code v-pre>getBlock</code> method.</li>
<li><code v-pre>_index</code> is the index of the L2 log in the block. It's returned as <code v-pre>id</code> by the <code v-pre>getMessageProof</code> method of the <code v-pre>zksync-web3</code> API.</li>
<li><code v-pre>_message</code> is a parameter that contains the full information of the message sent. It should be an object containing:
<ul>
<li><code v-pre>sender</code>: the address that sent the message from L2.</li>
<li><code v-pre>data</code>: the message sent in bytes.</li>
<li><code v-pre>txNumberInBlock</code>: the index of the transaction in the L2 block, which is returned as <code v-pre>transactionIndex</code> using <code v-pre>getTransaction</code></li>
</ul>
</li>
<li><code v-pre>_proof</code> is a parameter that contains the Merkle proof of the message inclusion. It can be retrieved either from observing Ethereum or received from the <code v-pre>getMessageProof</code> method of the <code v-pre>zksync-web3</code> API.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Important</p>
<p>Note that the L2 block of your transaction must be verified (and hence the transaction finalized) before proving the inclusion in L1.</p>
</div>
<h3 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h3>
<h4 id="l1-message-processing-contract" tabindex="-1"><a class="header-anchor" href="#l1-message-processing-contract" aria-hidden="true">#</a> L1 message processing contract</h4>
<p>The following contract receives the information of the transaction sent to the L2 messenger contract and proves that it was included in an L2 block.</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token comment">// Importing zkSync contract interface</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Example</span> <span class="token punctuation">{</span>
  <span class="token comment">// NOTE: The zkSync contract implements only the functionality for proving that a message belongs to a block</span>
  <span class="token comment">// but does not guarantee that such a proof was used only once. That's why a contract that uses L2 -> L1</span>
  <span class="token comment">// communication must take care of the double handling of the message.</span>
  <span class="token comment">/// @dev mapping L2 block number => message number => flag</span>
  <span class="token comment">/// @dev Used to indicated that zkSync L2 -> L1 message was already processed</span>
  <span class="token keyword">mapping</span><span class="token punctuation">(</span><span class="token builtin">uint32</span> <span class="token operator">=></span> <span class="token keyword">mapping</span><span class="token punctuation">(</span><span class="token builtin">uint256</span> <span class="token operator">=></span> <span class="token builtin">bool</span><span class="token punctuation">)</span><span class="token punctuation">)</span> isL2ToL1MessageProcessed<span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">consumeMessageFromL2</span><span class="token punctuation">(</span>
  <span class="token comment">// The address of the zkSync smart contract.</span>
  <span class="token comment">// It is not recommended to hardcode it during the alpha testnet as regenesis may happen.</span>
    <span class="token builtin">address</span> _zkSyncAddress<span class="token punctuation">,</span>
  <span class="token comment">// zkSync block number in which the message was sent</span>
    <span class="token builtin">uint32</span> _l2BlockNumber<span class="token punctuation">,</span>
  <span class="token comment">// Message index, that can be received via API</span>
    <span class="token builtin">uint256</span> _index<span class="token punctuation">,</span>
  <span class="token comment">// The message that was sent from l2</span>
    <span class="token builtin">bytes</span> <span class="token keyword">calldata</span> _message<span class="token punctuation">,</span>
  <span class="token comment">// Merkle proof for the message</span>
    <span class="token builtin">bytes32</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">calldata</span> _proof
  <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bytes32</span> messageHash<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// check that the message has not been processed yet</span>
    <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isL2ToL1MessageProcessed</span><span class="token punctuation">(</span>_l2BlockNumber<span class="token punctuation">,</span> _index<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    IZkSync zksync <span class="token operator">=</span> <span class="token function">IZkSync</span><span class="token punctuation">(</span>_zkSyncAddress<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token builtin">address</span> someSender <span class="token operator">=</span> <span class="token number">0x19a5bfcbe15f98aa073b9f81b58466521479df8d</span><span class="token punctuation">;</span>
    L2Message message <span class="token operator">=</span> <span class="token function">L2Message</span><span class="token punctuation">(</span><span class="token punctuation">{</span>sender<span class="token punctuation">:</span> someSender<span class="token punctuation">,</span> data<span class="token punctuation">:</span> _message<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token builtin">bool</span> success <span class="token operator">=</span> zksync<span class="token punctuation">.</span><span class="token function">proveL2MessageInclusion</span><span class="token punctuation">(</span>
      _l2BlockNumber<span class="token punctuation">,</span>
      _index<span class="token punctuation">,</span>
      message<span class="token punctuation">,</span>
      _proof
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">require</span><span class="token punctuation">(</span>success<span class="token punctuation">,</span> <span class="token string">"Failed to prove message inclusion"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Mark message as processed</span>
    <span class="token function">isL2ToL1MessageProcessed</span><span class="token punctuation">(</span>_l2BlockNumber<span class="token punctuation">,</span> _index<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="end-to-end" tabindex="-1"><a class="header-anchor" href="#end-to-end" aria-hidden="true">#</a> End to end</h4>
<p>The following script sends a message from L2 to L1, retrieves the message proof, and validates that the message received in L1 came from an L2 block.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Provider<span class="token punctuation">,</span> utils<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">SENDER_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;YOUR_ADDRESS>"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">TEST_PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"&lt;YOUR_PRIVATE_KEY>"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">MESSAGE</span> <span class="token operator">=</span> <span class="token string">"Some L2->L1 message"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> l2Provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> l1Provider <span class="token operator">=</span> ethers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">sendMessageToL1</span><span class="token punctuation">(</span>text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Sending message to L1 with text </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>text<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> textBytes <span class="token operator">=</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">toUtf8Bytes</span><span class="token punctuation">(</span><span class="token constant">MESSAGE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">TEST_PRIVATE_KEY</span><span class="token punctuation">,</span> l2Provider<span class="token punctuation">,</span> l1Provider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> messengerContract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Contract</span><span class="token punctuation">(</span>utils<span class="token punctuation">.</span><span class="token constant">L1_MESSENGER_ADDRESS</span><span class="token punctuation">,</span> utils<span class="token punctuation">.</span><span class="token constant">L1_MESSENGER</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> messengerContract<span class="token punctuation">.</span><span class="token function">sendToL1</span><span class="token punctuation">(</span>textBytes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> tx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"L2 trx hash is "</span><span class="token punctuation">,</span> tx<span class="token punctuation">.</span>hash<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> tx<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">getL2MessageProof</span><span class="token punctuation">(</span>blockNumber<span class="token operator">:</span> ethers<span class="token punctuation">.</span>BigNumberish<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Getting L2 message proof for block </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>blockNumber<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getMessageProof</span><span class="token punctuation">(</span>blockNumber<span class="token punctuation">,</span> <span class="token constant">SENDER_ADDRESS</span><span class="token punctuation">,</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">keccak256</span><span class="token punctuation">(</span>ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">toUtf8Bytes</span><span class="token punctuation">(</span><span class="token constant">MESSAGE</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">proveL2MessageInclusion</span><span class="token punctuation">(</span>l1BatchNumber<span class="token operator">:</span> ethers<span class="token punctuation">.</span>BigNumberish<span class="token punctuation">,</span> proof<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> trxIndex<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> zkAddress <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getMainContractAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> mailboxL1Contract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Contract</span><span class="token punctuation">(</span>zkAddress<span class="token punctuation">,</span> utils<span class="token punctuation">.</span><span class="token constant">ZKSYNC_MAIN_ABI</span><span class="token punctuation">,</span> l1Provider<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// all the information of the message sent from L2</span>
  <span class="token keyword">const</span> messageInfo <span class="token operator">=</span> <span class="token punctuation">{</span>
    txNumberInBlock<span class="token operator">:</span> trxIndex<span class="token punctuation">,</span>
    sender<span class="token operator">:</span> <span class="token constant">SENDER_ADDRESS</span><span class="token punctuation">,</span>
    data<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">toUtf8Bytes</span><span class="token punctuation">(</span><span class="token constant">MESSAGE</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Retrieving proof for batch </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>l1BatchNumber<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, transaction index </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>trxIndex<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> and proof id </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>proof<span class="token punctuation">.</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">await</span> mailboxL1Contract<span class="token punctuation">.</span><span class="token function">proveL2MessageInclusion</span><span class="token punctuation">(</span>l1BatchNumber<span class="token punctuation">,</span> proof<span class="token punctuation">.</span>id<span class="token punctuation">,</span> messageInfo<span class="token punctuation">,</span> proof<span class="token punctuation">.</span>proof<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> res<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Full end-to-end of an L2-L1 messaging with proof validation.
 * Recommended to run in 3 steps:
 * 1. Send message.
 * 2. Wait for transaction to finalize and block verified
 * 3. Wait for block to be verified and validate proof
 */</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Step 1: send message</span>
  <span class="token keyword">const</span> l2Trx <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">sendMessageToL1</span><span class="token punctuation">(</span><span class="token constant">MESSAGE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Waiting for transaction to finalize..."</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Step 2: waiting to finalize can take a few minutes.</span>
  <span class="token keyword">const</span> l2Receipt <span class="token operator">=</span> <span class="token keyword">await</span> l2Trx<span class="token punctuation">.</span><span class="token function">waitFinalize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Step 3: get and validate proof (block must be verified)</span>
  <span class="token keyword">const</span> proof <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">getL2MessageProof</span><span class="token punctuation">(</span>l2Receipt<span class="token punctuation">.</span>blockNumber<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Proof is: </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span> proof<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> trx <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getTransaction</span><span class="token punctuation">(</span>l2Receipt<span class="token punctuation">.</span>hash<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// @ts-ignore</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"trx.transactionIndex :>> "</span><span class="token punctuation">,</span> trx<span class="token punctuation">.</span>transactionIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// @ts-ignore</span>
  <span class="token keyword">const</span> block <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getBlock</span><span class="token punctuation">(</span>trx<span class="token punctuation">.</span>blockNumber<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"L1 Batch for block :>> "</span><span class="token punctuation">,</span> block<span class="token punctuation">.</span>l1BatchNumber<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// IMPORTANT: This method requires that the block is verified</span>
  <span class="token comment">// and sent to L1!</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">proveL2MessageInclusion</span><span class="token punctuation">(</span>
    block<span class="token punctuation">.</span>l1BatchNumber<span class="token punctuation">,</span>
    proof<span class="token punctuation">,</span>
    <span class="token comment">// @ts-ignore</span>
    trx<span class="token punctuation">.</span>transactionIndex
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Result is :>> "</span><span class="token punctuation">,</span> result<span class="token punctuation">)</span><span class="token punctuation">;</span>
  process<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">try</span> <span class="token punctuation">{</span>
  <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


