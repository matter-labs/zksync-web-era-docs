<template><div><h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting started</h1>
<p><a href="https://hardhat.org" target="_blank" rel="noopener noreferrer">Hardhat<ExternalLinkIcon/></a> is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.</p>
<p>zkSync has has the following plugins for Hardhat:</p>
<ul>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-solc">@matterlabs/hardhat-zksync-solc</RouterLink> - used to compile contracts written in Solidity.</li>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-vyper">@matterlabs/hardhat-zksync-vyper</RouterLink> - used to compile contracts written in Vyper.</li>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-deploy">@matterlabs/hardhat-zksync-deploy</RouterLink> - used to deploy smart contracts.</li>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-chai-matchers">@matterlabs/hardhat-zksync-chai-matchers</RouterLink> - adds zkSync-specific capabilities to the <a href="https://www.chaijs.com/" target="_blank" rel="noopener noreferrer">Chai<ExternalLinkIcon/></a> assertion library for testing smart contracts.</li>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-verify">@matterlabs/hardhat-zksync-verify</RouterLink> - used to verify smart contracts.</li>
</ul>
<p>To learn more about Hardhat itself, check out <a href="https://hardhat.org/getting-started/" target="_blank" rel="noopener noreferrer">its official documentation<ExternalLinkIcon/></a>.</p>
<p>This tutorial shows how to set up a zkSync Solidity project using Hardhat from scratch.
If you are using Vyper, check out the <RouterLink to="/api/hardhat/plugins.html#matterlabs-hardhat-zksync-vyper">Vyper plugin documentation</RouterLink> or <a href="https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example" target="_blank" rel="noopener noreferrer">this example<ExternalLinkIcon/></a> in GitHub!</p>
<h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<p>For this tutorial, the following programs must be installed:</p>
<ul>
<li><code v-pre>yarn</code> package manager. <code v-pre>npm</code> examples will be added soon.</li>
<li>A wallet with sufficient Göerli <code v-pre>ETH</code> on L1 to pay for bridging funds to zkSync as well as deploying smart contracts. We recommend using <a href="https://portal.zksync.io/faucet" target="_blank" rel="noopener noreferrer">our faucet from the zkSync portal<ExternalLinkIcon/></a>.</li>
</ul>
<h2 id="project-setup" tabindex="-1"><a class="header-anchor" href="#project-setup" aria-hidden="true">#</a> Project setup</h2>
<ol>
<li>To initialize the project and install the dependencies, run the following commands in the terminal:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The <code v-pre>typescript</code> and <code v-pre>ts-node</code> dependencies are optional - plugins will work fine in a vanilla JavaScript environment. Although, please note that this tutorial <em>does</em> use TypeScript.</p>
<h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2>
<ol start="2">
<li>Create the <code v-pre>hardhat.config.ts</code> file and paste the following code within it:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-solc"</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"1.2.2"</span><span class="token punctuation">,</span>
    compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>
    settings<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  defaultNetwork<span class="token operator">:</span> <span class="token string">"zkTestnet"</span><span class="token punctuation">,</span>
  networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    zkTestnet<span class="token operator">:</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the zkSync network RPC</span>
      ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span> <span class="token comment">// Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/&lt;API_KEY>`)</span>
      zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  solidity<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"0.8.16"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>To learn more about each specific property in the <code v-pre>hardhat.config.ts</code> file, check out the <RouterLink to="/api/hardhat/plugins.html">plugins documentation</RouterLink></p>
</div>
<h2 id="write-and-deploy-a-contract" tabindex="-1"><a class="header-anchor" href="#write-and-deploy-a-contract" aria-hidden="true">#</a> Write and deploy a contract</h2>
<ol start="3">
<li>
<p>Create the <code v-pre>contracts</code> and <code v-pre>deploy</code> folders. In the <code v-pre>contracts</code> folder we will store all the smart contract files. In the <code v-pre>deploy</code> folder we'll place all the scripts related to deploying the contracts.</p>
</li>
<li>
<p>Create the <code v-pre>contracts/Greeter.sol</code> contract and paste the following code:</p>
</li>
</ol>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Greeter</span> <span class="token punctuation">{</span>
    <span class="token builtin">string</span> <span class="token keyword">private</span> greeting<span class="token punctuation">;</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token builtin">string</span> <span class="token keyword">memory</span> _greeting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        greeting <span class="token operator">=</span> _greeting<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">view</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">string</span> <span class="token keyword">memory</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> greeting<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token builtin">string</span> <span class="token keyword">memory</span> _greeting<span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token punctuation">{</span>
        greeting <span class="token operator">=</span> _greeting<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>Run <code v-pre>yarn hardhat compile</code> which uses the <code v-pre>hardhat-zksync-solc</code> plugin to compile the contract. The <code v-pre>artifacts-zk</code> and <code v-pre>cache-zk</code> folders will be created in the root directory (instead of the regular Hardhat's <code v-pre>artifacts</code> and <code v-pre>cache</code>).</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Note that the <code v-pre>artifacts-zk</code> and <code v-pre>cache-zk</code> folders contain compilation artifacts and cache, and should not be added to version control, so it's a good practice to include them in the <code v-pre>.gitignore</code> file of your project.</p>
</div>
<ol start="6">
<li>Create the deployment script in <code v-pre>deploy/deploy.ts</code> with the following code:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> utils<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatRuntimeEnvironment <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/types"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Deployer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>

<span class="token comment">// An example of a deploy script that will deploy and call a simple contract.</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Running deploy script for the Greeter contract</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Initialize the wallet.</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;WALLET-PRIVATE-KEY>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create deployer object and load the artifact of the contract we want to deploy.</span>
  <span class="token keyword">const</span> deployer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deployer</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> artifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"Greeter"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deposit some funds to L2 in order to be able to perform L2 transactions.</span>
  <span class="token keyword">const</span> depositAmount <span class="token operator">=</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">parseEther</span><span class="token punctuation">(</span><span class="token string">"0.001"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> depositHandle <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span><span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    to<span class="token operator">:</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
    token<span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">ETH_ADDRESS</span><span class="token punctuation">,</span>
    amount<span class="token operator">:</span> depositAmount<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Wait until the deposit is processed on zkSync</span>
  <span class="token keyword">await</span> depositHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.</span>
  <span class="token comment">// `greeting` is an argument for contract constructor.</span>
  <span class="token keyword">const</span> greeting <span class="token operator">=</span> <span class="token string">"Hi there!"</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> greeterContract <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span>greeting<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Show the contract info.</span>
  <span class="token keyword">const</span> contractAddress <span class="token operator">=</span> greeterContract<span class="token punctuation">.</span>address<span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>artifact<span class="token punctuation">.</span>contractName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> was deployed to </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>contractAddress<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Call the deployed contract.</span>
  <span class="token keyword">const</span> greetingFromContract <span class="token operator">=</span> <span class="token keyword">await</span> greeterContract<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>greetingFromContract <span class="token operator">==</span> greeting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Contract greets us with </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>greeting<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Contract said something unexpected: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>greetingFromContract<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// Edit the greeting of the contract</span>
  <span class="token keyword">const</span> newGreeting <span class="token operator">=</span> <span class="token string">"Hey guys"</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> setNewGreetingHandle <span class="token operator">=</span> <span class="token keyword">await</span> greeterContract<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span>newGreeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> setNewGreetingHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> newGreetingFromContract <span class="token operator">=</span> <span class="token keyword">await</span> greeterContract<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>newGreetingFromContract <span class="token operator">==</span> newGreeting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Contract greets us with </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>newGreeting<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Contract said something unexpected: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>newGreetingFromContract<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="7">
<li>After replacing the <code v-pre>WALLET-PRIVATE-KEY</code> text with the private key of your Ethereum wallet, run the script using the following command: <code v-pre>yarn hardhat deploy-zksync</code>. This script will:</li>
</ol>
<ul>
<li>Transfer 0.001 ETH from Goerli to zkSync.</li>
<li>Deploy the <code v-pre>Greeting</code> contract with the message &quot;Hi there!&quot; to <a href="https://v2-docs.zksync.io/dev/fundamentals/testnet.html" target="_blank" rel="noopener noreferrer">zkSync testnet<ExternalLinkIcon/></a>.</li>
<li>Retrieve the message from the contract calling the <code v-pre>greet()</code> method.</li>
<li>Update the greet message in the contract with the <code v-pre>setGreeting()</code> method.</li>
<li>Retrieve the message from the contract again.</li>
</ul>
<p><strong>Congratulations! Your Hardhat project is now running on zkSync 2.0 testnet 🎉</strong></p>
<h2 id="learn-more" tabindex="-1"><a class="header-anchor" href="#learn-more" aria-hidden="true">#</a> Learn more</h2>
<ul>
<li>To learn more about the zkSync Hardhat plugins check out the <a href="./plugins">plugins documentation</a>.</li>
<li>If you want to know more about how to interact with zkSync using Javascript, check out the <a href="../js">zksync-web3 Javascript SDK documentation</a> .</li>
</ul>
<h2 id="future-releases" tabindex="-1"><a class="header-anchor" href="#future-releases" aria-hidden="true">#</a> Future releases</h2>
<p>There are two major points of improvement for the plugins which will be released in the future:</p>
<ul>
<li><strong>Composability with the existing hardhat plugins.</strong> Compatibility with other hardhat plugins is planned for the future but has not been a focus yet.</li>
<li><strong>Improved cross-platform support.</strong></li>
</ul>
</div></template>


