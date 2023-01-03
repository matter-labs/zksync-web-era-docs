<template><div><h1 id="zksync-testnet" tabindex="-1"><a class="header-anchor" href="#zksync-testnet" aria-hidden="true">#</a> zkSync testnet</h1>
<p>Welcome to zkSync 2.0 testnet! Our team would be very happy to see what you can build on zkSync. We are glad for any feedback you could provide!</p>
<div class="hint-container warning">
<p class="hint-container-title">Alpha testnet</p>
<p>Note, that the system is still in active development, so:</p>
<ul>
<li><strong>Breaking changes are possible in the future.</strong></li>
<li><strong>Some of the updates may require regenesis</strong>, i.e. erasing all the balances, and smart contracts, and restarting the blockchain. We will make sure to communicate all regenesis beforehand! Make sure to follow our <a href="https://join.zksync.dev/" target="_blank" rel="noopener noreferrer">Discord<ExternalLinkIcon/></a>.</li>
</ul>
</div>
<p>To get a first-hand impression of the zkSync 2.0 user experience:</p>
<ul>
<li>Go to the <a href="https://portal.zksync.io" target="_blank" rel="noopener noreferrer">zkSync 2.0 Portal<ExternalLinkIcon/></a>.</li>
<li>Get some test tokens from the faucet, or deposit some from Ethereum's Görli testnet.</li>
<li>Make some transfers.</li>
</ul>
<p>The Portal is the central entry point into the zkSync 2.0 ecosystem for users and developers alike. It contains links to all relevant resources, such as <a href="https://explorer.zksync.io" target="_blank" rel="noopener noreferrer">block explorer<ExternalLinkIcon/></a> or the catalog of featured dApps.</p>
<h2 id="do-i-need-experience-with-zksync-1-x" tabindex="-1"><a class="header-anchor" href="#do-i-need-experience-with-zksync-1-x" aria-hidden="true">#</a> Do I need experience with zkSync 1.x?</h2>
<p>Some experience with zkSync 1. x would be helpful to understand some core concepts, e.g. how finality works. From all other aspects, zkSync 2.0 and zkSync 1.x are very different systems, and experience with the latter is not needed to build on zkSync 2.0.</p>
<h2 id="what-do-i-need-to-start-building" tabindex="-1"><a class="header-anchor" href="#what-do-i-need-to-start-building" aria-hidden="true">#</a> What do I need to start building?</h2>
<p>All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like account abstraction, the zkSync SDK should be used.</p>
<p>The only other place where using zkSync SDK is required is during contract deployment. This can be easily done through our hardhat plugin.</p>
<h2 id="quickstart-on-zksync" tabindex="-1"><a class="header-anchor" href="#quickstart-on-zksync" aria-hidden="true">#</a> Quickstart on zkSync</h2>
<p>Check out our step-by-step <RouterLink to="/dev/developer-guides/hello-world.html">quickstart guide</RouterLink>, where you will learn:</p>
<ul>
<li>How to install zkSync hardhat plugin and deploy smart contracts with it.</li>
<li>How to build the front-end for your dApp using the <code v-pre>zksync-web3</code> library.</li>
</ul>
<h2 id="connecting-metamask" tabindex="-1"><a class="header-anchor" href="#connecting-metamask" aria-hidden="true">#</a> Connecting Metamask</h2>
<p>To connect Metamask to zkSync, add the zkSync alpha testnet network to the wallet.</p>
<ol>
<li>Open the Metamask wallet and click on the network in the top center:</li>
</ol>
<figure><img src="@source/assets/images/connect-1.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ol start="2">
<li>
<p>Click on &quot;Add network manually&quot;.</p>
</li>
<li>
<p>Fill in the details about zkSync alpha testnet network and click &quot;Save&quot;:</p>
</li>
</ol>
<p><strong>Testnet network info</strong></p>
<ul>
<li>Network Name: <code v-pre>zkSync alpha testnet</code></li>
<li>New RPC URL: <code v-pre>https://zksync2-testnet.zksync.dev</code></li>
<li>Chain ID: <code v-pre>280</code></li>
<li>Currency Symbol: <code v-pre>ETH</code></li>
<li>Block Explorer URL: <code v-pre>https://goerli.explorer.zksync.io/</code></li>
<li>WebSocket URL: <code v-pre>wss://zksync2-testnet.zksync.dev/ws</code></li>
</ul>
<p><strong>Mainnet network info</strong></p>
<ul>
<li>Network Name: <code v-pre>zkSync mainnet</code></li>
<li>New RPC URL: <code v-pre>https://zksync2-mainnet.zksync.io</code></li>
<li>Chain ID: <code v-pre>324</code></li>
<li>Currency Symbol: <code v-pre>ETH</code></li>
<li>Block Explorer URL: <code v-pre>https://explorer.zksync.io/</code></li>
<li>WebSocket URL: <code v-pre>wss://zksync2-mainnet.zksync.io/ws</code></li>
</ul>
</div></template>


