<template><div><h1 id="zksync-cli" tabindex="-1"><a class="header-anchor" href="#zksync-cli" aria-hidden="true">#</a> zkSync CLI</h1>
<p>The zkSync CLI simplifies the process of developing applications and interacting with zkSync 2.0.</p>
<p>The code is available <a href="https://github.com/matter-labs/zksync-cli" target="_blank" rel="noopener noreferrer">in the following repository<ExternalLinkIcon/></a>.</p>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2>
<p>Install the zkSync CLI globally with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>npm i -g zksync-cli@latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>You can also run this via NPX with <code v-pre>npx zksync-cli@latest [COMMAND]</code></p>
<h2 id="commands" tabindex="-1"><a class="header-anchor" href="#commands" aria-hidden="true">#</a> Commands</h2>
<ul>
<li>
<p><code v-pre>zksync-cli create [PROJECT_NAME]</code>: creates a new Hardhat project in a new folder with the given project name. If the project name is not provided, it creates the project in the current folder, although this requires the folder to be empty. The <a href="https://github.com/matter-labs/zksync-hardhat-template" target="_blank" rel="noopener noreferrer">template project can be found here<ExternalLinkIcon/></a>.</p>
</li>
<li>
<p><code v-pre>zksync-cli deposit</code>: deposits funds from L1 (Goerli testnet) to zkSync 2.0 testnet. It will ask you to provide: the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.</p>
</li>
<li>
<p><code v-pre>zksync-cli withdraw</code>: withdraws funds from zkSync 2.0 to L1 (Goerli testnet). It will ask you to provide: the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.</p>
</li>
</ul>
<blockquote>
<p>Both deposit and withdraw might take a couple of minutes to complete.</p>
</blockquote>
<p>More commands will be added shortly but if you have any suggestions, feel free to <a href="https://github.com/matter-labs/zksync-cli/issues/new" target="_blank" rel="noopener noreferrer">open an issue on GitHub<ExternalLinkIcon/></a>.</p>
<h2 id="troubleshooting" tabindex="-1"><a class="header-anchor" href="#troubleshooting" aria-hidden="true">#</a> Troubleshooting</h2>
<p>If you find any issues, you can <a href="https://github.com/matter-labs/zksync-cli/issues/new" target="_blank" rel="noopener noreferrer">open an issue on GitHub<ExternalLinkIcon/></a> or report it to us <a href="https://join.zksync.dev/" target="_blank" rel="noopener noreferrer">in our Discord<ExternalLinkIcon/></a>.</p>
</div></template>


