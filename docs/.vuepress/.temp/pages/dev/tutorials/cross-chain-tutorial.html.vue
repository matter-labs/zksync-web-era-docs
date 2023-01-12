<template><div><h1 id="cross-chain-governance" tabindex="-1"><a class="header-anchor" href="#cross-chain-governance" aria-hidden="true">#</a> Cross-chain governance</h1>
<p>This tutorial serves as an example of how to implement L1 to L2 contract interaction. The following functionality is implemented in this tutorial:</p>
<ul>
<li>A &quot;counter&quot; smart contract is deployed on zkSync, which stores a number that can be incremented by calling the <code v-pre>increment</code> method.</li>
<li>A &quot;governance&quot; smart contract is deployed on layer 1, which has the privilege to increment the counter on zkSync.</li>
</ul>
<h2 id="preliminaries" tabindex="-1"><a class="header-anchor" href="#preliminaries" aria-hidden="true">#</a> Preliminaries</h2>
<p>In this tutorial, it is assumed that you are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the <RouterLink to="/dev/developer-guides/hello-world.html">quickstart tutorial</RouterLink>.</p>
<p>It is also assumed that you already have some experience working with Ethereum.</p>
<h2 id="project-structure" tabindex="-1"><a class="header-anchor" href="#project-structure" aria-hidden="true">#</a> Project structure</h2>
<p>As we will deploy contracts on both L1 and L2, we'll separate this project in two different folders:</p>
<ul>
<li><code v-pre>/L1-governance</code>: for the L1 contract, and scripts.</li>
<li><code v-pre>/L2-counter</code>: for the L2 contract, and scripts.</li>
</ul>
<p>So go ahead and create these folders.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Note that the <code v-pre>governance</code> project is a default Hardhat project because it'll be used to deploy a contract just in L1, while the <code v-pre>counter</code> project includes all the zkSync dependencies and specific configuration as it'll deploy the contract in L2.</p>
</div>
<h2 id="l1-governance" tabindex="-1"><a class="header-anchor" href="#l1-governance" aria-hidden="true">#</a> L1 governance</h2>
<p>To initialise the project inside the <code v-pre>/L1-governance</code> folder, run <code v-pre>npx hardhat</code>, select the option &quot;Create a Typescript project&quot;, and leave the rest of the options with the default value.</p>
<p>To interact with the zkSync bridge contract using Solidity, you need to use the zkSync contract interface. There are two options to get it:</p>
<ol>
<li>Importing it from the <code v-pre>@matterlabs/zksync-contracts</code> npm package. (preferred)</li>
<li>Downloading it from the <a href="https://github.com/matter-labs/v2-testnet-contracts" target="_blank" rel="noopener noreferrer">contracts repo<ExternalLinkIcon/></a>.</li>
</ol>
<p>We'll go with option 1 and install the <code v-pre>@matterlabs/zksync-contracts</code> package by running the following command (just make sure you're inside the <code v-pre>/L1-governance</code> folder):</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add -D @matterlabs/zksync-contracts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The code of the governance contract that we will deploy on L1 is the following:</p>
<div class="language-sol line-numbers-mode" data-ext="sol"><pre v-pre class="language-sol"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Governance</span> <span class="token punctuation">{</span>
    <span class="token builtin">address</span> <span class="token keyword">public</span> governor<span class="token punctuation">;</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        governor <span class="token operator">=</span> msg<span class="token punctuation">.</span>sender<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">callZkSync</span><span class="token punctuation">(</span>
        <span class="token builtin">address</span> zkSyncAddress<span class="token punctuation">,</span>
        <span class="token builtin">address</span> contractAddr<span class="token punctuation">,</span>
        <span class="token builtin">bytes</span> <span class="token keyword">memory</span> data<span class="token punctuation">,</span>
        <span class="token builtin">uint64</span> ergsLimit
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> <span class="token punctuation">{</span>
        <span class="token keyword">require</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>sender <span class="token operator">==</span> governor<span class="token punctuation">,</span> <span class="token string">"Only governor is allowed"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        IZkSync zksync <span class="token operator">=</span> <span class="token function">IZkSync</span><span class="token punctuation">(</span>zkSyncAddress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        zksync<span class="token punctuation">.</span>requestL2Transaction<span class="token punctuation">{</span>value<span class="token punctuation">:</span> msg<span class="token punctuation">.</span>value<span class="token punctuation">}</span><span class="token punctuation">(</span>contractAddr<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> data<span class="token punctuation">,</span> ergsLimit<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">bytes</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This is a very simple governance contract. It sets the creator of the contract as the single governor and has a function that can request transactions in L2 via the zkSync smart contract.</p>
<p>You can <RouterLink to="/dev/developer-guides/bridging/l1-l2.html">learn more about L1-L2 communication in this section of the docs</RouterLink>.</p>
<h3 id="deploy-l1-governance-contract" tabindex="-1"><a class="header-anchor" href="#deploy-l1-governance-contract" aria-hidden="true">#</a> Deploy L1 governance contract</h3>
<p>Although this tutorial does not focus on the process of deploying contracts on L1, we'll give you a quick overview on how to continue.</p>
<ol>
<li>
<p>You'll need an RPC node endpoint to the Göerli testnet to submit the deploymet transaction. You can <a href="https://github.com/arddluma/awesome-list-rpc-nodes-providers" target="_blank" rel="noopener noreferrer">find multiple node providers here<ExternalLinkIcon/></a>.</p>
</li>
<li>
<p>Create the file <code v-pre>/L1-governance/goerli.json</code> and fill in the following values:</p>
</li>
</ol>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"nodeUrl"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token comment">// your Göerli Ethereum node  URL.</span>
  <span class="token property">"deployerPrivateKey"</span><span class="token operator">:</span> <span class="token string">""</span> <span class="token comment">//private key of the wallet that will deploy the governance smart contract. It needs to have some ETH on Göerli.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>Add the Göerli network section to the <code v-pre>hardhat.config.ts</code> file:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatUserConfig<span class="token punctuation">,</span> task <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/config"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@nomiclabs/hardhat-etherscan"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@nomiclabs/hardhat-waffle"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@typechain/hardhat"</span><span class="token punctuation">;</span>

<span class="token comment">// import file with Göerli params</span>
<span class="token keyword">const</span> goerli <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./goerli.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> config<span class="token operator">:</span> HardhatUserConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  solidity<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"0.8.4"</span><span class="token punctuation">,</span>
    networks<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// Göerli network</span>
      goerli<span class="token operator">:</span> <span class="token punctuation">{</span>
        url<span class="token operator">:</span> goerli<span class="token punctuation">.</span>nodeUrl<span class="token punctuation">,</span>
        accounts<span class="token operator">:</span> <span class="token punctuation">[</span>goerli<span class="token punctuation">.</span>deployerPrivateKey<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li>Create the deployment script <code v-pre>/L1-governance/scripts/deploy.ts</code> with the following code:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// We require the Hardhat Runtime Environment explicitly here. This is optional</span>
<span class="token comment">// but useful for running the script in a standalone fashion through `node &lt;script>`.</span>
<span class="token comment">//</span>
<span class="token comment">// When running the script with `npx hardhat run &lt;script>` you'll find the Hardhat</span>
<span class="token comment">// Runtime Environment's members available in the global scope.</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ethers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat"</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// We get the contract to deploy</span>
  <span class="token keyword">const</span> Governance <span class="token operator">=</span> <span class="token keyword">await</span> ethers<span class="token punctuation">.</span><span class="token function">getContractFactory</span><span class="token punctuation">(</span><span class="token string">"Governance"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> contract <span class="token operator">=</span> <span class="token keyword">await</span> Governance<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">await</span> contract<span class="token punctuation">.</span><span class="token function">deployed</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Governance contract was successfully deployed at </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>contract<span class="token punctuation">.</span>address<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// We recommend this pattern to be able to use async/await everywhere</span>
<span class="token comment">// and properly handle errors.</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  process<span class="token punctuation">.</span>exitCode <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>Compile the contract and run the deployment script with:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The last command will print the deployed governance smart contract address in the terminal.</p>
<h2 id="l2-counter" tabindex="-1"><a class="header-anchor" href="#l2-counter" aria-hidden="true">#</a> L2 counter</h2>
<p>Now that we have the L1 governance contract addressed, let's proceed with the counter contract on L2.</p>
<ol>
<li>To initialise the project in the <code v-pre>/L2-counter</code> folder run the following commands:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn init -y
# install all dependencies
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>Create the <code v-pre>hardhat.config.ts</code> file and paste the following code there:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-solc"</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"1.2.2"</span><span class="token punctuation">,</span>
    compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  defaultNetwork<span class="token operator">:</span> <span class="token string">"zkSyncTestnet"</span><span class="token punctuation">,</span>

  networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    hardhat<span class="token operator">:</span> <span class="token punctuation">{</span>
      zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If your default network is not <code v-pre>hardhat</code>, make sure to include <code v-pre>zksync: true</code> in its config, too.</p>
<ol start="3">
<li>Create the <code v-pre>contracts</code> and <code v-pre>deploy</code> folders, which will contain all the contract <code v-pre>*.sol</code> files, and the scripts related to deploying the contract.</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>You can use the zkSync CLI to scaffold a project automatically. Find <RouterLink to="/api/tools/zksync-cli/">more info about the zkSync CLI here</RouterLink></p>
</div>
<ol start="4">
<li>Create the <code v-pre>contracts/Counter.sol</code> contract file. This contract will have the address of the governance contract deployed in L1 and a counter that can be incremented. The function to increment the counter can only be invoked by the governance contract that we previously deployed in L1. Here is the code:</li>
</ol>
<div class="language-sol line-numbers-mode" data-ext="sol"><pre v-pre class="language-sol"><code><span class="token comment">//SPDX-License-Identifier: Unlicense</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Counter</span> <span class="token punctuation">{</span>
    <span class="token builtin">uint256</span> <span class="token keyword">public</span> value <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token builtin">address</span> <span class="token keyword">public</span> governance<span class="token punctuation">;</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token builtin">address</span> newGovernance<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        governance <span class="token operator">=</span> newGovernance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token punctuation">{</span>
        <span class="token keyword">require</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>sender <span class="token operator">==</span> governance<span class="token punctuation">,</span> <span class="token string">"Only governance is allowed"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        value <span class="token operator">+=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>Compile the contract with the following command:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat compile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="6">
<li>Create the deployment script in the <code v-pre>deploy/deploy.ts</code>:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> utils<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatRuntimeEnvironment <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/types"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Deployer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>

<span class="token comment">// Insert the address of the governance contract</span>
<span class="token keyword">const</span> <span class="token constant">GOVERNANCE_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;GOVERNANCE-ADDRESS>"</span><span class="token punctuation">;</span>

<span class="token comment">// An example of a deploy script that will deploy and call a simple contract.</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Running deploy script for the Counter contract</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Initialize the wallet.</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;WALLET-PRIVATE-KEY>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create deployer object and load the artifact of the contract you want to deploy.</span>
  <span class="token keyword">const</span> deployer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deployer</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> artifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"Counter"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deposit some funds to L2 to be able to perform deposits.</span>
  <span class="token keyword">const</span> deploymentFee <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">estimateDeployFee</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token constant">GOVERNANCE_ADDRESS</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> depositHandle <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span><span class="token function">deposit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    to<span class="token operator">:</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
    token<span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">ETH_ADDRESS</span><span class="token punctuation">,</span>
    amount<span class="token operator">:</span> deploymentFee<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Wait until the deposit is processed on zkSync</span>
  <span class="token keyword">await</span> depositHandle<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.</span>
  <span class="token comment">// The address of the governance is an argument for contract constructor.</span>
  <span class="token keyword">const</span> counterContract <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token constant">GOVERNANCE_ADDRESS</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Show the contract info.</span>
  <span class="token keyword">const</span> contractAddress <span class="token operator">=</span> counterContract<span class="token punctuation">.</span>address<span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>artifact<span class="token punctuation">.</span>contractName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> was deployed to </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>contractAddress<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="7">
<li>After replacing <code v-pre>&lt;WALLET-PRIVATE-KEY&gt;</code> and <code v-pre>&lt;GOVERNANCE-ADDRESS&gt;</code> with the private key of an Ethereum wallet with some ETH balance on Göerli, and the address of the L1 governance contract respectively, run the script using the following command:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat deploy-zksync
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>In the output, you should see the address to which the contract was deployed.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>You can find more specific details about deploying contracts in the <RouterLink to="/dev/developer-guides/hello-world.html">quickstart tutorial</RouterLink> or the documentation for the <RouterLink to="/api/hardhat/getting-started.html">hardhat plugins</RouterLink> for zkSync.</p>
</div>
<h2 id="reading-the-counter-value" tabindex="-1"><a class="header-anchor" href="#reading-the-counter-value" aria-hidden="true">#</a> Reading the counter value</h2>
<p>With both contracts deployed, we can create a small script to retrieve the value of the counter. For the sake of simplicity, we will create this scripts inside the <code v-pre>/L2-counter</code> folder. To keep the tutorial generic hardhat-specific features will not be used in it.</p>
<h3 id="getting-the-abi-of-the-counter-contract" tabindex="-1"><a class="header-anchor" href="#getting-the-abi-of-the-counter-contract" aria-hidden="true">#</a> Getting the ABI of the counter contract</h3>
<p>Here is how you can get the ABI of the counter contract:</p>
<ol>
<li>
<p>Copy the <code v-pre>abi</code> array from the compilation artifact located at <code v-pre>/L2-counter/artifacts-zk/contracts/Counter.sol/Counter.json</code>.</p>
</li>
<li>
<p>Create the <code v-pre>scripts</code> folder inside the <code v-pre>/L2-counter</code> project folder.</p>
</li>
<li>
<p>Create a new file <code v-pre>/L2-counter/scripts/counter.json</code> and paste the ABI of the counter contract.</p>
</li>
<li>
<p>Create the <code v-pre>/L2-counter/scripts/display-value.ts</code> file and paste the following code there:</p>
</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Contract<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token comment">// The address of the counter smart contract</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;COUNTER-ADDRESS>"</span><span class="token punctuation">;</span>
<span class="token comment">// The ABI of the counter smart contract</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ABI</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./counter.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Initializing the zkSync provider</span>
  <span class="token keyword">const</span> l2Provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> counterContract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span><span class="token constant">COUNTER_ADDRESS</span><span class="token punctuation">,</span> <span class="token constant">COUNTER_ABI</span><span class="token punctuation">,</span> l2Provider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">The counter value is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span><span class="token keyword">await</span> counterContract<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  process<span class="token punctuation">.</span>exitCode <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The code is relatively straightforward and is mostly equivalent to how it would work with <code v-pre>ethers</code>. It will just retrieve the counter value from the L2 contract.</p>
<p>After replacing <code v-pre>&lt;COUNTER-ADDRESS&gt;</code> with the address of the deployed counter contract, run this script by running</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn ts-node ./scripts/display-value.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The output should be:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>The counter value is 0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="calling-an-l2-contract-from-l1" tabindex="-1"><a class="header-anchor" href="#calling-an-l2-contract-from-l1" aria-hidden="true">#</a> Calling an L2 contract from L1</h2>
<p>Now, let's call the <code v-pre>increment</code> method from Layer 1.</p>
<ol>
<li>Get the ABI array of the compiled Governance contract, which is located in <code v-pre>/L1-governance/artifacts/contracts/Governance.sol/Governance.json</code>, and save it in a new file as <code v-pre>/L2-counter/scripts/governance.json</code> (make sure you create it in the <code v-pre>/L2-counter</code> folder!).</li>
<li>Create the <code v-pre>L2-counter/scripts/increment-counter.ts</code> file and paste the following template for the script:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// Imports and constants will be put here</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// The logic will be put here</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  process<span class="token punctuation">.</span>exitCode <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>To interact with the governance smart contract, we need to initialise an Ethereum provider and the corresponding <code v-pre>ethers</code> <code v-pre>Contract</code> object, so we need to have the address it was deployed to:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// Imports</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> BigNumber<span class="token punctuation">,</span> Contract<span class="token punctuation">,</span> ethers<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">GOVERNANCE_ABI</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./governance.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">GOVERNANCE_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;GOVERNANCE-ADDRESS>"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Ethereum L1 provider</span>
  <span class="token keyword">const</span> l1Provider <span class="token operator">=</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Governor wallet, the same one as the one that deployed the</span>
  <span class="token comment">// governance contract</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;WALLET-PRIVATE-KEY>"</span><span class="token punctuation">,</span> l1Provider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> govcontract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span><span class="token constant">GOVERNANCE_ADDRESS</span><span class="token punctuation">,</span> <span class="token constant">GOVERNANCE_ABI</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace the <code v-pre>&lt;GOVERNANCE-ADDRESS&gt;</code> and <code v-pre>&lt;WALLET-PRIVATE-KEY&gt;</code> with the address of the L1 governance smart contract and the private key of the wallet that deployed the governance contract respectively.</p>
<ol start="4">
<li>To interact with the zkSync bridge, we need its L1 address. While on mainnet you may want to set the address of the zkSync smart contract as an env variable or a constant, it is worth noticing that you can fetch the smart contract address dynamically. We recommended this approach if you're working on a testnet since regenesis may happen and contract addresses might change.</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// Imports</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Provider<span class="token punctuation">,</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ... Previous steps</span>

  <span class="token comment">// Initializing the L2 provider</span>
  <span class="token keyword">const</span> l2Provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Getting the current address of the zkSync L1 bridge</span>
  <span class="token keyword">const</span> zkSyncAddress <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getMainContractAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Getting the `Contract` object of the zkSync bridge</span>
  <span class="token keyword">const</span> zkSyncContract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span>zkSyncAddress<span class="token punctuation">,</span> utils<span class="token punctuation">.</span><span class="token constant">ZKSYNC_MAIN_ABI</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>Executing transactions from L1 requires the caller to pay some fee to the L2 operator.</li>
</ol>
<p>Firstly, this fee depends on the length of the calldata and the <code v-pre>ergsLimit</code>. If you are new to this concept then it is pretty much the same as the <code v-pre>gasLimit</code> on Ethereum. You can read more about <RouterLink to="/dev/developer-guides/transactions/fee-model.html">zkSync fee model here</RouterLink>.</p>
<p>Secondly, the fee depends on the gas price that is used during the transaction call. So to have a predictable fee for the call, the gas price should be fetched from the L1 provider.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// Imports</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ABI</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./counter.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ... Previous steps</span>

  <span class="token comment">// Encoding L1 transaction is the same way it is done on Ethereum.</span>
  <span class="token keyword">const</span> counterInterface <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">Interface</span><span class="token punctuation">(</span><span class="token constant">COUNTER_ABI</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> data <span class="token operator">=</span> counterInterface<span class="token punctuation">.</span><span class="token function">encodeFunctionData</span><span class="token punctuation">(</span><span class="token string">"increment"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The price of L1 transaction requests depend on the gas price used in the call,</span>
  <span class="token comment">// so we should explicitly fetch the gas price before the call.</span>
  <span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> l1Provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Here we define the constant for ergs limit.</span>
  <span class="token comment">// There is currently no way to get the exact ergsLimit required for an L1->L2 tx.</span>
  <span class="token comment">// You can read more on that in the tip below</span>
  <span class="token keyword">const</span> ergsLimit <span class="token operator">=</span> BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">100000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Getting the cost of the execution in Wei.</span>
  <span class="token keyword">const</span> baseCost <span class="token operator">=</span> <span class="token keyword">await</span> zkSyncContract<span class="token punctuation">.</span><span class="token function">l2TransactionBaseCost</span><span class="token punctuation">(</span>gasPrice<span class="token punctuation">,</span> ergsLimit<span class="token punctuation">,</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">hexlify</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Fee model and fee estimation are WIP</p>
<p>You may have noticed the lack of the <code v-pre>ergs_per_pubdata</code> and <code v-pre>ergs_per_storage</code> fields in the L1-&gt;L2 transactions. These are surely important for the security of the protocol and they will be added soon. Please note that this will be a breaking change for the contract interface.</p>
<p>Also, there is currently no easy way to estimate the exact number of <code v-pre>ergs</code> required for the execution of an L1-&gt;L2 transaction. At the time of this writing, the transactions may be processed even if the supplied <code v-pre>ergsLimit</code> is <code v-pre>0</code>. This will change in the future.</p>
</div>
<ol start="6">
<li>Now it is possible to call the governance contract, that will redirect the call to zkSync:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// Imports</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;COUNTER-ADDRESS>"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ... Previous steps</span>

  <span class="token comment">// Calling the L1 governance contract.</span>
  <span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> govcontract<span class="token punctuation">.</span><span class="token function">callZkSync</span><span class="token punctuation">(</span>zkSyncAddress<span class="token punctuation">,</span> <span class="token constant">COUNTER_ADDRESS</span><span class="token punctuation">,</span> data<span class="token punctuation">,</span> ergsLimit<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// Passing the necessary ETH `value` to cover the fee for the operation</span>
    value<span class="token operator">:</span> baseCost<span class="token punctuation">,</span>
    gasPrice<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Waiting until the L1 transaction is complete.</span>
  <span class="token keyword">await</span> tx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Make sure to replace <code v-pre>&lt;COUNTER-ADDRESS&gt;</code> with the address of the L2 counter contract.</p>
<ol start="7">
<li>You can track the status of the corresponding L2 transaction. <code v-pre>zksync-web3</code>'s <code v-pre>Provider</code> has a method that, given the L1 <code v-pre>ethers.TransactionResponse</code> object of a transaction that called the zkSync bridge, returns the correspondent <code v-pre>TransactionResponse</code> object of the transaction in L2, which can conveniently wait for the transaction to be processed on L2.</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ... Previous steps</span>

  <span class="token comment">// Getting the TransactionResponse object for the L2 transaction corresponding to the execution call</span>
  <span class="token keyword">const</span> l2Response <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getL2TransactionFromPriorityOp</span><span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The receipt of the L2 transaction corresponding to the call to the counter contract</span>
  <span class="token keyword">const</span> l2Receipt <span class="token operator">=</span> <span class="token keyword">await</span> l2Response<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>l2Receipt<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="complete-code" tabindex="-1"><a class="header-anchor" href="#complete-code" aria-hidden="true">#</a> Complete code</h3>
<p>Here is the full code to get the zkSync contract address, encode the transaction data, calculate the fees, send the transaction to the L1 and track the correspondent transaction in L2:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> BigNumber<span class="token punctuation">,</span> Contract<span class="token punctuation">,</span> ethers<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Provider<span class="token punctuation">,</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">GOVERNANCE_ABI</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./governance.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">GOVERNANCE_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;GOVERNANCE-ADDRESS>"</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ABI</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"./counter.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">COUNTER_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;COUNTER-ADDRESS>"</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Ethereum L1 provider</span>
  <span class="token keyword">const</span> l1Provider <span class="token operator">=</span> ethers<span class="token punctuation">.</span>providers<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token string">"goerli"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Governor wallet</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;WALLET-PRIVATE-KEY>"</span><span class="token punctuation">,</span> l1Provider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> govcontract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span><span class="token constant">GOVERNANCE_ADDRESS</span><span class="token punctuation">,</span> <span class="token constant">GOVERNANCE_ABI</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Getting the current address of the zkSync L1 bridge</span>
  <span class="token keyword">const</span> l2Provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> zkSyncAddress <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getMainContractAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Getting the `Contract` object of the zkSync bridge</span>
  <span class="token keyword">const</span> zkSyncContract <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Contract</span><span class="token punctuation">(</span>zkSyncAddress<span class="token punctuation">,</span> utils<span class="token punctuation">.</span><span class="token constant">ZKSYNC_MAIN_ABI</span><span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Encoding the tx data the same way it is done on Ethereum.</span>
  <span class="token keyword">const</span> counterInterface <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">Interface</span><span class="token punctuation">(</span><span class="token constant">COUNTER_ABI</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> data <span class="token operator">=</span> counterInterface<span class="token punctuation">.</span><span class="token function">encodeFunctionData</span><span class="token punctuation">(</span><span class="token string">"increment"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The price of the L1 transaction requests depends on the gas price used in the call</span>
  <span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> l1Provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Here we define the constant for ergs limit.</span>
  <span class="token keyword">const</span> ergsLimit <span class="token operator">=</span> BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">100000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Getting the cost of the execution.</span>
  <span class="token keyword">const</span> baseCost <span class="token operator">=</span> <span class="token keyword">await</span> zkSyncContract<span class="token punctuation">.</span><span class="token function">l2TransactionBaseCost</span><span class="token punctuation">(</span>gasPrice<span class="token punctuation">,</span> ergsLimit<span class="token punctuation">,</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">hexlify</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Calling the L1 governance contract.</span>
  <span class="token keyword">const</span> tx <span class="token operator">=</span> <span class="token keyword">await</span> govcontract<span class="token punctuation">.</span><span class="token function">callZkSync</span><span class="token punctuation">(</span>zkSyncAddress<span class="token punctuation">,</span> <span class="token constant">COUNTER_ADDRESS</span><span class="token punctuation">,</span> data<span class="token punctuation">,</span> ergsLimit<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token comment">// Passing the necessary ETH `value` to cover the fee for the operation</span>
    value<span class="token operator">:</span> baseCost<span class="token punctuation">,</span>
    gasPrice<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Waiting until the L1 tx is complete.</span>
  <span class="token keyword">await</span> tx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Getting the TransactionResponse object for the L2 transaction corresponding to the execution call</span>
  <span class="token keyword">const</span> l2Response <span class="token operator">=</span> <span class="token keyword">await</span> l2Provider<span class="token punctuation">.</span><span class="token function">getL2TransactionFromPriorityOp</span><span class="token punctuation">(</span>tx<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The receipt of the L2 transaction corresponding to the call to the counter contract's Increment method</span>
  <span class="token keyword">const</span> l2Receipt <span class="token operator">=</span> <span class="token keyword">await</span> l2Response<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>l2Receipt<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// We recommend this pattern to be able to use async/await everywhere</span>
<span class="token comment">// and properly handle errors.</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  process<span class="token punctuation">.</span>exitCode <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You can run the script with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn ts-node ./scripts/increment-counter.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>In the output, you should see the full transaction receipt in L2. You can take the <code v-pre>transactionHash</code> and track it in the <a href="https://explorer.zksync.io/" target="_blank" rel="noopener noreferrer">zkSync explorer<ExternalLinkIcon/></a>.</p>
<ol start="8">
<li>After that, you can verify that the transaction was indeed successful by running the <code v-pre>display-value</code> script again:</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn ts-node ./scripts/display-value.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The counter in the L2 contract should have increased after the transaction so output should be:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>The counter value is 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="complete-project" tabindex="-1"><a class="header-anchor" href="#complete-project" aria-hidden="true">#</a> Complete project</h2>
<p>You can download the complete project <a href="https://github.com/matter-labs/cross-chain-tutorial" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</p>
<h2 id="learn-more" tabindex="-1"><a class="header-anchor" href="#learn-more" aria-hidden="true">#</a> Learn more</h2>
<ul>
<li>To learn more about L1-&gt;L2 interaction on zkSync, check out the <RouterLink to="/dev/developer-guides/bridging/l1-l2.html">documentation</RouterLink>.</li>
<li>To learn more about the <code v-pre>zksync-web3</code> SDK, check out its <a href="../../api/js">documentation</a>.</li>
<li>To learn more about the zkSync hardhat plugins, check out their <a href="../../api/hardhat">documentation</a>.</li>
</ul>
</div></template>


