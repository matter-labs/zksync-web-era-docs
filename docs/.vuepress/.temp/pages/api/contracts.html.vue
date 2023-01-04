<template><div><h1 id="l1-contracts-interface" tabindex="-1"><a class="header-anchor" href="#l1-contracts-interface" aria-hidden="true">#</a> L1 contracts interface</h1>
<p>To interact with zkSync from L1, you need the interface of its canonical bridge. There are two main ways to import it to your codebase:</p>
<ul>
<li>By importing it from the <code v-pre>@matterlabs/zksync-contracts</code> npm package. (preferred)</li>
<li>By downloading the contracts from the <a href="https://github.com/matter-labs/v2-testnet-contracts" target="_blank" rel="noopener noreferrer">repo<ExternalLinkIcon/></a>.</li>
</ul>
<p>The guide on interacting with the zkSync canonical bridge with examples in both Solidity and <code v-pre>zksync-web3</code> SDK can be found <RouterLink to="/dev/developer-guides/bridging/l1-l2.html">here</RouterLink>.</p>
<p>This page will primarily serve as a quick reference for the interfaces and types you may require, as well as how to import them.</p>
<h2 id="matterlabs-zksync-contracts-reference" tabindex="-1"><a class="header-anchor" href="#matterlabs-zksync-contracts-reference" aria-hidden="true">#</a> <code v-pre>@matterlabs/zksync-contracts</code> reference</h2>
<ul>
<li><code v-pre>@matterlabs/zksync-contracts/contracts/interfaces/IZkSync.sol</code> is the file where the zkSync L1 contract interface <code v-pre>IZkSync</code> is located. Particular interest is in the <code v-pre>IBridge</code> functionality. Its implementation can be found <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IZkSync.sol" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</li>
</ul>
<blockquote>
<ul>
<li><code v-pre>@matterlabs/zksync-contracts/libraries/Operations.sol</code> is the file where the <code v-pre>Operations</code> library with all the user types in the bridge is stored. Its implementation can be found <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/libraries/Operations.sol" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</li>
</ul>
</blockquote>
<p>The code in the repository may contain some of the configuration constants. These are placeholder values taken from the development environment. You should use the library only for the interfaces and types it provides.</p>
</div></template>


