<template><div><h1 id="feature-support-status" tabindex="-1"><a class="header-anchor" href="#feature-support-status" aria-hidden="true">#</a> Feature support status</h1>
<div class="hint-container tip">
<p class="hint-container-title">Call for feedback</p>
<p>As we add new features, this page is constantly updated.</p>
<p>If any of these blocks you, let us know on our <a href="https://join.zksync.dev/" target="_blank" rel="noopener noreferrer">Discord<ExternalLinkIcon/></a>, so we can prioritize accordingly.</p>
</div>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="using-libraries-in-solidity" tabindex="-1"><a class="header-anchor" href="#using-libraries-in-solidity" aria-hidden="true">#</a> Using libraries in Solidity</h2>
<p>If a Solidity library can be inlined, i.e. it only contains <code v-pre>private</code> or <code v-pre>internal</code> methods, then this library can be used without any limitations.</p>
<p>However, if a library contains at least one <code v-pre>public</code> or <code v-pre>external</code> method, it is no longer inlined in the Yul representation. These addresses need to be passed explicitly to our compiler. This is not currently supported by our hardhat plugin but will be added later.</p>
<p>For support on an older version of Solidity and Vyper, check <RouterLink to="/dev/developer-guides/contracts/contracts.html#solidity-vyper-support">here</RouterLink></p>
<h2 id="unsupported-opcodes" tabindex="-1"><a class="header-anchor" href="#unsupported-opcodes" aria-hidden="true">#</a> Unsupported opcodes</h2>
<ul>
<li><code v-pre>SELFDESTRUCT</code> (it’s considered harmful and there are calls to deactivate it on L1).</li>
<li><code v-pre>EXTCODECOPY</code> (it can be implemented if needed, but we skip it for now because zkEVM opcodes are not identical to EVM ones anyway).</li>
<li><code v-pre>CALLCODE</code> (deprecated on Ethereum in favor of <code v-pre>DELEGATECALL</code>).</li>
<li><code v-pre>CODECOPY</code> - (It does not return 0, but produces a compile error).</li>
</ul>
<h2 id="ignored-by-the-compiler" tabindex="-1"><a class="header-anchor" href="#ignored-by-the-compiler" aria-hidden="true">#</a> Ignored by the compiler</h2>
<ul>
<li><code v-pre>PC</code> always returns <code v-pre>0</code> (since solidity is 0.7.0, it is not accessible in Yul and Solidity).</li>
</ul>
<h2 id="precompiles" tabindex="-1"><a class="header-anchor" href="#precompiles" aria-hidden="true">#</a> Precompiles</h2>
<ul>
<li>zkSync natively supports <code v-pre>keccak256</code>, <code v-pre>sha256</code>, and <code v-pre>ecrecover</code> via precompiles.</li>
</ul>
<h2 id="currently-supported-features" tabindex="-1"><a class="header-anchor" href="#currently-supported-features" aria-hidden="true">#</a> Currently supported features</h2>
<ul>
<li><strong>Native support of ECDSA signatures.</strong> Unlike the first version of zkSync and most zk rollups, no special operation is required to register the user's private key. Any account can be managed on L2 with the same private key that is used on L1.</li>
<li><strong>Solidity 0.8.x and Vyper support.</strong> No need for change or re-audit of the codebase.</li>
<li><strong>Web3 API</strong>. With small exceptions, our API is fully compatible with Ethereum. This enables seamless integration with existing indexers, explorers, etc.</li>
<li><strong>Hardhat plugin</strong>. This allows easy testing and development of smart contracts on zkSync.</li>
<li><strong>L1 &lt;-&gt; L2 smart contract communication</strong>.</li>
</ul>
<h2 id="features-to-be-released-soon" tabindex="-1"><a class="header-anchor" href="#features-to-be-released-soon" aria-hidden="true">#</a> Features to be released soon</h2>
<ul>
<li><strong>More developer tooling.</strong> Composability between various hardhat plugins with the zkSync plugin, easy local setup with Docker, etc. will be essential for the growth of the ecosystem.</li>
<li><strong>Support for older versions of Solidity.</strong> We are actively working on supporting different versions of Solidity to enable seamless integration for the existing projects.</li>
<li><strong>zkPorter extension.</strong> One of the biggest and most important features. It will let the users choose between high security &amp; 20x fee reduction compared to Ethereum for zkRollup accounts and security much higher than that of a sidechain &amp; near-constant transaction costs of a few USD cents for zkPorter accounts.</li>
</ul>
</div></template>


