<template><div><h1 id="bridging-assets" tabindex="-1"><a class="header-anchor" href="#bridging-assets" aria-hidden="true">#</a> Bridging assets</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Bridging is implemented by having two contracts
(one deployed to L1, and the second deployed to L2)
communicating with each other using <RouterLink to="/dev/developer-guides/bridging/l1-l2-interop.html">L1 &lt;-&gt; L2 interoperability</RouterLink>.</p>
<p>Developers are free to build their own bridge for any token.
However, we provide our default bridges (one for ETH and one for ERC20 tokens), which can be used for basic bridging.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>Addresses of tokens on L2 will always differ from the same token L1 address.</p>
</div>
<h2 id="default-bridges" tabindex="-1"><a class="header-anchor" href="#default-bridges" aria-hidden="true">#</a> Default bridges</h2>
<p>You can get default bridges' addresses using the <code v-pre>zks_getBridgeContracts</code> endpoint or <code v-pre>getDefaultBridgeAddresses</code> method of <code v-pre>Provider</code> in our JS SDK (similar methods are available in the other SDKs).</p>
<h3 id="deposits-to-l2" tabindex="-1"><a class="header-anchor" href="#deposits-to-l2" aria-hidden="true">#</a> Deposits (to L2)</h3>
<p>Users must call the <code v-pre>deposit</code> method on the L1 bridge contract, which will trigger the following actions:</p>
<ul>
<li>The user's L1 tokens will be sent to the L1 bridge and become locked there.</li>
<li>The L1 bridge initiates a transaction to the L2 bridge using L1 -&gt; L2 communication.</li>
<li>Within the L2 transaction, tokens will be minted and sent to the specified address on L2.
<ul>
<li>If the token does not exist on zkSync yet, a new contract is deployed for it. Given the L2 token address is deterministic (based on the original L1 address, name and symbol), it doesn't matter who is the first person bridging it, the new L2 address will be the same.</li>
</ul>
</li>
<li>For every executed L1 -&gt; L2 transaction, there will be an L2 -&gt; L1 log message confirming its execution.</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>If this transaction fails for any reason (for example, the provided fee is too low) the log message will state its failure.
In this case, the inclusion of the log can be proven on the L1 bridge to return the deposited funds to the original sender by calling the method <code v-pre>claimFailedDeposit</code>.</p>
</div>
<p>The log message described above is not yet fully supported by our SDK but is available on the L1 bridge contract.</p>
<h3 id="withdrawals-to-l1" tabindex="-1"><a class="header-anchor" href="#withdrawals-to-l1" aria-hidden="true">#</a> Withdrawals (to L1)</h3>
<p>Users must call the <code v-pre>withdraw</code> method on the L2 bridge contract, which will trigger the following actions:</p>
<ul>
<li>L2 tokens will be burned.</li>
<li>An L2 -&gt; L1 message with the information about the withdrawal will be sent.</li>
<li>After that, the withdrawal action will be available to be finalized by anyone in the L1 bridge (by proving the inclusion of the L2 -&gt; L1 message, which is done when calling the <code v-pre>finlizeWithdraw</code> method on the L1 bridge contract).</li>
<li>After the method is called, the funds are unlocked from the L1 bridge and sent to the withdrawal recipient.</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>On the testnet environment, we automatically finalize all withdrawals, i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.</p>
</div>
</div></template>


