<template><div><h1 id="contracts" tabindex="-1"><a class="header-anchor" href="#contracts" aria-hidden="true">#</a> Contracts</h1>
<p><code v-pre>zksync-web3</code> does not implement any new <code v-pre>Contract</code> class, since <code v-pre>ethers.Contract</code> fully works out of the box. However, for convenience, the library still re-exports this class.</p>
<p>Since deploying smart contracts on zkSync has some differences from deploying on Ethereum, there is a need for a specific <code v-pre>ContractFactory</code> method. It supports the same interface as <code v-pre>ethers.ContractFactory</code>.</p>
<p>In order to pay for smart contract interactions in ERC20 tokens, <code v-pre>customData</code> override should be used. You can read more about accessing zkSync features in <RouterLink to="/api/js/features.html">the next chaper</RouterLink>.</p>
</div></template>


