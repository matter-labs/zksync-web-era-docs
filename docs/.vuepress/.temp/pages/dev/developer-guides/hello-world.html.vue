<template><div><h1 id="quickstart" tabindex="-1"><a class="header-anchor" href="#quickstart" aria-hidden="true">#</a> Quickstart</h1>
<p>In this quickstart guide, you will learn how to deploy a smart contract to zkSync and build a dApp to interact with it using the zkSync development toolbox.</p>
<p>This is what we're going to build:</p>
<ul>
<li>A smart contract that stores a greeting message and is deployed on zkSync.</li>
<li>A dApp to retrieve the greeting.</li>
<li>Users will be able to change the greeting on the smart contract.</li>
<li>By default, users will have to pay transaction fees to change the greeting message in ether. However, we will also explain how to <a href="#paying-fees-using-testnet-paymaster">implement the testnet paymaster</a> to allow users to pay fees with ERC20 tokens.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>The testnet paymaster is just for testing. If you decide to build a project on mainnet, you should read the documentation about <RouterLink to="/dev/developer-guides/aa.html#paymasters">paymasters</RouterLink>.</p>
</div>
<h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<ul>
<li><code v-pre>yarn</code> package manager. <a href="https://yarnpkg.com/getting-started/install" target="_blank" rel="noopener noreferrer">Here is the installation guide<ExternalLinkIcon/></a>(<code v-pre>npm</code> examples will be added soon.)</li>
<li>A wallet with sufficient Göerli <code v-pre>ETH</code> on L1 to pay for bridging funds to zkSync as well as deploying smart contracts. ERC20 tokens on zkSync are required if you want to implement the testnet paymaster. We recommend using <a href="https://portal.zksync.io/faucet" target="_blank" rel="noopener noreferrer">the faucet from the zkSync portal<ExternalLinkIcon/></a>.</li>
</ul>
<h2 id="initializing-the-project-deploying-a-smart-contract" tabindex="-1"><a class="header-anchor" href="#initializing-the-project-deploying-a-smart-contract" aria-hidden="true">#</a> Initializing the project &amp; deploying a smart contract</h2>
<ol>
<li>Initialize the project and install the dependencies. Run the following commands in your terminal:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Please note that Typescript is required by zkSync plugins.</p>
<ol start="2">
<li>Create the <code v-pre>hardhat.config.ts</code> file and paste the following code there:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-solc"</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"1.2.2"</span><span class="token punctuation">,</span>
    compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>
    settings<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  defaultNetwork<span class="token operator">:</span> <span class="token string">"zkSyncTestnet"</span><span class="token punctuation">,</span>

  networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    zkSyncTestnet<span class="token operator">:</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span>
      ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span> <span class="token comment">// Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/&lt;API_KEY>`)</span>
      zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  solidity<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"0.8.16"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Tip</p>
<p>If the contract was already compiled, you should delete the <code v-pre>artifacts-zk</code> and <code v-pre>cache-zk</code> folders, otherwise, it won't recompile unless you change the compiler version.</p>
</div>
<ol start="3">
<li>
<p>Create the <code v-pre>contracts</code> and <code v-pre>deploy</code> folders. The former is the place where we will store all the smart contracts' <code v-pre>*.sol</code> files, and the latter is the place where we will put all the scripts related to deploying the contracts.</p>
</li>
<li>
<p>Create the <code v-pre>contracts/Greeter.sol</code> contract and paste the following code in it:</p>
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
<li>Compile the contract with the following command:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat compile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="6">
<li>Create the following deployment script in <code v-pre>deploy/deploy.ts</code>:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatRuntimeEnvironment <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/types"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Deployer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>

<span class="token comment">// An example of a deploy script that will deploy and call a simple contract.</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Running deploy script for the Greeter contract</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Initialize the wallet.</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;WALLET-PRIVATE-KEY>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create deployer object and load the artifact of the contract you want to deploy.</span>
  <span class="token keyword">const</span> deployer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deployer</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> artifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"Greeter"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Estimate contract deployment fee</span>
  <span class="token keyword">const</span> greeting <span class="token operator">=</span> <span class="token string">"Hi there!"</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> deploymentFee <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">estimateDeployFee</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span>greeting<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deposit funds to L2</span>
  <span class="token keyword">const</span> depositHandle <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span><span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    to<span class="token operator">:</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
    token<span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">ETH_ADDRESS</span><span class="token punctuation">,</span>
    amount<span class="token operator">:</span> deploymentFee<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Wait until the deposit is processed on zkSync</span>
  <span class="token keyword">await</span> depositHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.</span>
  <span class="token comment">// `greeting` is an argument for contract constructor.</span>
  <span class="token keyword">const</span> parsedFee <span class="token operator">=</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">formatEther</span><span class="token punctuation">(</span>deploymentFee<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">The deployment is estimated to cost </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>parsedFee<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> ETH</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> greeterContract <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span>greeting<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">//obtain the Constructor Arguments</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"constructor args:"</span> <span class="token operator">+</span> greeterContract<span class="token punctuation">.</span>interface<span class="token punctuation">.</span><span class="token function">encodeDeploy</span><span class="token punctuation">(</span><span class="token punctuation">[</span>greeting<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Show the contract info.</span>
  <span class="token keyword">const</span> contractAddress <span class="token operator">=</span> greeterContract<span class="token punctuation">.</span>address<span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>artifact<span class="token punctuation">.</span>contractName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> was deployed to </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>contractAddress<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="7">
<li>Replacing the <code v-pre>WALLET-PRIVATE-KEY</code> with the private key of the Ethereum wallet you're using for development, and run the script using the following command to run the deployment script:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat deploy-zksync
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>In the output, you should see the address to which the contract was deployed.</p>
<p>Congratulations! You have deployed a smart contract to zkSync! Now you can visit the <a href="https://explorer.zksync.io/" target="_blank" rel="noopener noreferrer">zkSync block explorer<ExternalLinkIcon/></a> and search your contract address to confirm it was successfully deployed.</p>
<p><RouterLink to="/api/tools/block-explorer/contract-verification.html">This guide</RouterLink> explains how to verify your smart contract using the zkSync block explorer.</p>
<h2 id="front-end-integration" tabindex="-1"><a class="header-anchor" href="#front-end-integration" aria-hidden="true">#</a> Front-end integration</h2>
<h3 id="setting-up-the-project" tabindex="-1"><a class="header-anchor" href="#setting-up-the-project" aria-hidden="true">#</a> Setting up the project</h3>
<p>In this tutorial, <code v-pre>Vue</code> will be used as the web framework of choice, but the process will be quite similar regardless of the framework used. To focus on the specifics of using the <code v-pre>zksync-web3</code> SDK, we're providing a template with all the front-end work done. The final step is to interact with zkSync smart contract.</p>
<ol>
<li>Clone it:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>git clone https://github.com/matter-labs/greeter-tutorial-starter
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li>Spin up the project:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>cd greeter-tutorial-starter
yarn
yarn serve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>By default, the page should be running at <code v-pre>http://localhost:8080</code>. Open this URL in the browser to see the page.</p>
<h3 id="connecting-to-metamask-bridging-tokens-to-zksync" tabindex="-1"><a class="header-anchor" href="#connecting-to-metamask-bridging-tokens-to-zksync" aria-hidden="true">#</a> Connecting to Metamask &amp; bridging tokens to zkSync</h3>
<p>In order to interact with dApps built on zkSync, connect the Metamask wallet to the zkSync alpha testnet network and bridge some funds to L2.</p>
<ul>
<li>
<p>Follow <RouterLink to="/dev/fundamentals/testnet.html#connecting-metamask">this guide</RouterLink> to connect Metamask to zkSync.</p>
</li>
<li>
<p>Use our <a href="https://portal.zksync.io" target="_blank" rel="noopener noreferrer">portal<ExternalLinkIcon/></a> to bridge funds to zkSync.</p>
</li>
</ul>
<h3 id="project-structure" tabindex="-1"><a class="header-anchor" href="#project-structure" aria-hidden="true">#</a> Project structure</h3>
<p>We will write all the code in the <code v-pre>./src/App.vue</code>. Almost all the front-end code is provided out of the box, the only task left is to fill out the TODO-s to interact with the contract we just deployed on zkSync:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">initializeProviderAndSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// TODO: initialize provider and signer based on `window.ethereum`</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

<span class="token keyword">async</span> <span class="token function">getGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// TODO: return the current greeting</span>
  <span class="token keyword">return</span> <span class="token string">""</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

<span class="token keyword">async</span> <span class="token function">getFee</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// TODO: return formatted fee</span>
  <span class="token keyword">return</span> <span class="token string">""</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

<span class="token keyword">async</span> <span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Return formatted balance</span>
  <span class="token keyword">return</span> <span class="token string">""</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token keyword">async</span> <span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l1Address <span class="token operator">!=</span> <span class="token constant">ETH_L1_ADDRESS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// TODO: Return data for the paymaster</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token keyword">async</span> <span class="token function">changeGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token comment">// TODO: Submit the transaction</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
    <span class="token comment">// TODO: Wait for transaction compilation</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
    <span class="token comment">// Update greeting</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>greeting <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingFee <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingBalance <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token comment">// Update balance and fee</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>currentBalance <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>currentFee <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getFee</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingFee <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingBalance <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>At the top of the <code v-pre>&lt;script&gt;</code> tag, you may see the parts that should be filled with the address of the deployed <code v-pre>Greeter</code> contract and the path to its ABI. We will fill these fields in the following sections.</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ADDRESS</span> <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span> <span class="token comment">// TODO: insert the Greeter contract address here</span>
<span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ABI</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// TODO: insert the path to the Greeter contract ABI here</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="installing-zksync-web3" tabindex="-1"><a class="header-anchor" href="#installing-zksync-web3" aria-hidden="true">#</a> Installing <code v-pre>zksync-web3</code></h3>
<p>Run the following command on the greeter-tutorial-starter root folder to install <code v-pre>zksync-web3</code> and <code v-pre>ethers</code>:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add ethers zksync-web3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>After that, import both libraries in the <code v-pre>script</code> part of the <code v-pre>App.vue</code> file (right before the contract constant). It should look like this:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ADDRESS</span> <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span> <span class="token comment">// TODO: insert the Greeter contract address here</span>
<span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ABI</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// TODO: insert the path to the Greeter contract ABI here</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getting-the-abi-and-contract-address" tabindex="-1"><a class="header-anchor" href="#getting-the-abi-and-contract-address" aria-hidden="true">#</a> Getting the ABI and contract address</h3>
<p>Open <code v-pre>./src/App.vue</code> and set the <code v-pre>GREETER_CONTRACT_ADDRESS</code> constant equal to the address where the greeter contract was deployed.</p>
<p>To interact with the smart contract we just deployed to zkSync, we also need its ABI. ABI stands for Application Binary Interface and, in short, it's a file that describes all available names and types of the smart contract methods to interact with it.</p>
<ul>
<li>Create the <code v-pre>./src/abi.json</code> file.</li>
<li>You can get the contract's ABI in the hardhat project folder from the previous section in the <code v-pre>./artifacts-zk/contracts/Greeter.sol/Greeter.json</code> file. You should copy the <code v-pre>abi</code> array and paste it into the <code v-pre>abi.json</code> file created in the previous step. The file should look roughly the following way:</li>
</ul>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">"inputs"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"internalType"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"_greeting"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"stateMutability"</span><span class="token operator">:</span> <span class="token string">"nonpayable"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"constructor"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"inputs"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"greet"</span><span class="token punctuation">,</span>
    <span class="token property">"outputs"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"internalType"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"stateMutability"</span><span class="token operator">:</span> <span class="token string">"view"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"function"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"inputs"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"internalType"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"_greeting"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"setGreeting"</span><span class="token punctuation">,</span>
    <span class="token property">"outputs"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"stateMutability"</span><span class="token operator">:</span> <span class="token string">"nonpayable"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"function"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Set the <code v-pre>GREETER_CONTRACT_ABI</code> to require the ABI file.</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"0x..."</span><span class="token punctuation">;</span>
<span class="token comment">// eslint-disable-next-line</span>
<span class="token keyword">const</span> <span class="token constant">GREETER_CONTRACT_ABI</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./abi.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="working-with-provider" tabindex="-1"><a class="header-anchor" href="#working-with-provider" aria-hidden="true">#</a> Working with provider</h3>
<ol>
<li>Go to the <code v-pre>initializeProviderAndSigner</code> method in <code v-pre>./src/App.vue</code>. This method is called after the connection to Metamask is successful.</li>
</ol>
<p>In this method we should:</p>
<ul>
<li>Initialize a <code v-pre>Web3Provider</code> and a <code v-pre>Signer</code> to interact with zkSync.</li>
<li>Initialize the <code v-pre>Contract</code> object to interact with the <code v-pre>Greeter</code> contract we just deployed.</li>
</ul>
<ol start="2">
<li>Import the necessary dependencies:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Contract<span class="token punctuation">,</span> Web3Provider<span class="token punctuation">,</span> Provider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3">
<li>Initialise the provider, signer, and contract instances like this:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">initializeProviderAndSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">'https://zksync2-testnet.zksync.dev'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Note that we still need to get the Metamask signer</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>signer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>contract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span>
        <span class="token constant">GREETER_CONTRACT_ADDRESS</span><span class="token punctuation">,</span>
        <span class="token constant">GREETER_CONTRACT_ABI</span><span class="token punctuation">,</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>signer
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="retrieving-the-greeting" tabindex="-1"><a class="header-anchor" href="#retrieving-the-greeting" aria-hidden="true">#</a> Retrieving the greeting</h3>
<p>Fill in the method to retrieve the greeting from the smart contract:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Smart contract calls work the same way as in `ethers`</span>
    <span class="token keyword">return</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The full methods now look the following way:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">initializeProviderAndSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">'https://zksync2-testnet.zksync.dev'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Note that we still need to get the Metamask signer</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>signer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Web3Provider</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>ethereum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getSigner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>contract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span>
        <span class="token constant">GREETER_CONTRACT_ADDRESS</span><span class="token punctuation">,</span>
        <span class="token constant">GREETER_CONTRACT_ABI</span><span class="token punctuation">,</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>signer
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token keyword">async</span> <span class="token function">getGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After connecting the Metamask wallet, you should see the following page:</p>
<p><img src="@source/assets/images/start-1.png" alt="img"></p>
<p>The chosen token to pay the fee can now be selected. However, no balances are updated, <em>yet</em>.</p>
<h3 id="retrieving-token-balance-and-transaction-fee" tabindex="-1"><a class="header-anchor" href="#retrieving-token-balance-and-transaction-fee" aria-hidden="true">#</a> Retrieving token balance and transaction fee</h3>
<p>The easiest way to retrieve the user's balance is to use the <code v-pre>Signer.getBalance</code> method.</p>
<ol>
<li>Add the necessary dependencies:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// `ethers` is only used in this tutorial for its utility functions</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>Implement the method itself:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Getting the balance for the signer in the selected token</span>
    <span class="token keyword">const</span> balanceInUnits <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>signer<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l2Address<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// To display the number of tokens in the human-readable format, we need to format them,</span>
    <span class="token comment">// e.g. if balanceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user</span>
    <span class="token keyword">return</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">formatUnits</span><span class="token punctuation">(</span>balanceInUnits<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>decimals<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>Estimate the fee:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getFee</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Getting the amount of gas (ergs) needed for one transaction</span>
    <span class="token keyword">const</span> feeInGas <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span>estimateGas<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>newGreeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Getting the gas price per one erg. For now, it is the same for all tokens.</span>
    <span class="token keyword">const</span> gasPriceInUnits <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// To display the number of tokens in the human-readable format, we need to format them,</span>
    <span class="token comment">// e.g. if feeInGas*gasPriceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user</span>
    <span class="token keyword">return</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">formatUnits</span><span class="token punctuation">(</span>feeInGas<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasPriceInUnits<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>decimals<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Paying fees in ERC20</p>
<p>zkSync v2 does not natively support paying fees in ERC20 tokens, but the account abstraction feature facilitates that. We will show you how to implement the testnet paymaster below, however, when working on mainnet, you should either provide the paymaster services <RouterLink to="/dev/tutorials/custom-paymaster-tutorial.html">yourself</RouterLink> or use a
3rd party paymaster.</p>
</div>
<p>When opening the page and selecting the token to pay the fee, the balance and the expected fee for the transaction will be available.</p>
<p>The <code v-pre>Refresh</code> button should be used to recalculate the fee, as the fee may depend on the length of the message we want to store as the greeting.</p>
<p>It is possible to also click on the <code v-pre>Change greeting</code> button, but nothing will be changed as the contract has not been called yet.</p>
<p><img src="@source/assets/images/start-2.png" alt="img"></p>
<h3 id="updating-the-greeting" tabindex="-1"><a class="header-anchor" href="#updating-the-greeting" aria-hidden="true">#</a> Updating the greeting</h3>
<ol>
<li>Interacting with a smart contract works absolutely the same way as in <code v-pre>ethers</code>, however, if you want to use zkSync-specific features you may need to provide some additional parameters in the overrides:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// The example of paying fees using a paymaster will be shown in the</span>
<span class="token comment">// section below.</span>
<span class="token keyword">const</span> txHandle <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>newGreeting<span class="token punctuation">,</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>Wait until the transaction is committed:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> txHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The full method looks the following way:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">changeGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> txHandle <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>newGreeting<span class="token punctuation">,</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>

        <span class="token comment">// Wait until the transaction is committed</span>
        <span class="token keyword">await</span> txHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>

        <span class="token comment">// Update greeting</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>greeting <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getGreeting</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingFee <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingBalance <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token comment">// Update balance and fee</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>currentBalance <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>currentFee <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getFee</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">alert</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>txStatus <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingFee <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>retreivingBalance <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You now have a fully functional Greeter-dApp! However, it does not leverage any zkSync-specific features.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>What happens when you get a <strong>wallet_requestPermissions</strong> error?</p>
<p>To fix this error, refresh your browser, or open the MetaMask extension on your browser and click <em>Next</em> or <em>Cancel</em> to resolve it.</p>
<p>Read more about <strong>wallet_requestPermissions</strong>, on the <a href="https://docs.metamask.io/guide/rpc-api.html#wallet-requestpermissions" target="_blank" rel="noopener noreferrer">metamask documentation<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="paying-fees-using-testnet-paymaster" tabindex="-1"><a class="header-anchor" href="#paying-fees-using-testnet-paymaster" aria-hidden="true">#</a> Paying fees using testnet paymaster</h3>
<p>Even though ether is the only token you can pay fees with, the account abstraction feature allows you to integrate <RouterLink to="/dev/developer-guides/aa.html#paymasters">paymasters</RouterLink> that can either pay the fees entirely for you or swap your tokens on the fly. In this tutorial, we will use the <RouterLink to="/dev/developer-guides/aa.html#testnet-paymaster">testnet paymaster</RouterLink> that is provided on all zkSync testnets. It allows users to pay fees in an ERC20 token with the exchange rate of ETH of 1:1, i.e. one unit of the token for one wei of ETH.</p>
<div class="hint-container tip">
<p class="hint-container-title">Mainnet integration</p>
<p>Testnet paymaster is purely for demonstration of the feature and won't be available on mainnet. When integrating your protocol on mainnet, you should follow the documentation of the paymaster you will use.</p>
</div>
<p>The <code v-pre>getOverrides</code> method returns an empty object when users decide to pay with ether but, when users select the ERC20 option, it should return the paymaster address and all the information required by it. This is how to do it:</p>
<ol>
<li>Retrieve the address of the testnet paymaster from the zkSync provider:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l1Address <span class="token operator">!=</span> <span class="token constant">ETH_L1_ADDRESS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> testnetPaymaster <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// ..</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note, that it is recommended to retrieve the testnet paymaster's address each time before any interactions as it may change.</p>
<ol start="2">
<li>Add <code v-pre>utils</code> to the imports from <code v-pre>zksync-web3</code> SDK:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Contract<span class="token punctuation">,</span> Web3Provider<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3">
<li>We need to calculate how many tokens are required to process the transaction. Since the testnet paymaster exchanges any ERC20 token to ETH at a 1:1 rate, the amount is the same as the ETH amount:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l1Address <span class="token operator">!=</span> <span class="token constant">ETH_L1_ADDRESS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> testnetPaymaster <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> gasLimit <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span>estimateGas<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>newGreeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> fee <span class="token operator">=</span> gasPrice<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasLimit<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// ..</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li>Now, what is left is to encode the paymasterInput following the <RouterLink to="/dev/developer-guides/aa.html#testnet-paymaster">protocol requirements</RouterLink> and return the needed overrides:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">getOverrides</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l1Address <span class="token operator">!=</span> <span class="token constant">ETH_L1_ADDRESS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> testnetPaymaster <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getTestnetPaymasterAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> gasLimit <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>contract<span class="token punctuation">.</span>estimateGas<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>newGreeting<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> fee <span class="token operator">=</span> gasPrice<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasLimit<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> paymasterParams <span class="token operator">=</span> utils<span class="token punctuation">.</span><span class="token function">getPaymasterParams</span><span class="token punctuation">(</span>testnetPaymaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'ApprovalBased'</span><span class="token punctuation">,</span>
        <span class="token literal-property property">token</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>selectedToken<span class="token punctuation">.</span>l2Address<span class="token punctuation">,</span>
        <span class="token literal-property property">minimalAllowance</span><span class="token operator">:</span> fee<span class="token punctuation">,</span>
        <span class="token comment">// empty bytes as testnet paymaster does not use innerInput</span>
        <span class="token literal-property property">innerInput</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">maxFeePerGas</span><span class="token operator">:</span> gasPrice<span class="token punctuation">,</span>
        <span class="token literal-property property">maxPriorityFeePerGas</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        gasLimit<span class="token punctuation">,</span>
        <span class="token literal-property property">customData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">ergsPerPubdata</span><span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">DEFAULT_ERGS_PER_PUBDATA_LIMIT</span><span class="token punctuation">,</span>
            paymasterParams
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>To use a list of ERC20 tokens, change the following line:</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> allowedTokens <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./eth.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>to the following one:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> allowedTokens <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./erc20.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="complete-app" tabindex="-1"><a class="header-anchor" href="#complete-app" aria-hidden="true">#</a> Complete app</h3>
<p>Now you should be able to update the greeting message.</p>
<ol>
<li>Type the new greeting in the input box and click on the <code v-pre>Change greeting</code> button:</li>
</ol>
<p><img src="@source/assets/images/start-3.png" alt="img"></p>
<ol start="2">
<li>Since the <code v-pre>paymasterParams</code> were supplied, the transaction will be an <code v-pre>EIP712</code> (<a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank" rel="noopener noreferrer">more on EIP712 here<ExternalLinkIcon/></a>):</li>
</ol>
<p><img src="@source/assets/images/start-4.png" alt="img"></p>
<ol start="3">
<li>Click &quot;Sign&quot;.</li>
</ol>
<p>After the transaction is processed, the page updates the balances and the new greeting can be viewed:</p>
<p><img src="@source/assets/images/start-5.png" alt="img"></p>
<h3 id="learn-more" tabindex="-1"><a class="header-anchor" href="#learn-more" aria-hidden="true">#</a> Learn more</h3>
<ul>
<li>To learn more about <code v-pre>zksync-web3</code> SDK, check out its <a href="../../api/js">documentation</a>.</li>
<li>To learn more about the zkSync hardhat plugins, check out their <a href="../../api/hardhat">documentation</a>.</li>
</ul>
</div></template>


