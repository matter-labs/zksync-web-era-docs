<template><div><h1 id="plugins" tabindex="-1"><a class="header-anchor" href="#plugins" aria-hidden="true">#</a> Plugins</h1>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="hardhat-zksync-toolbox" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-toolbox" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-toolbox</code></h2>
<p>The hardhat-zksync-toolbox plugin provides a convenient method for bundling and accessing a range of zkSync-related Hardhat plugins. This approach simplifies the process of utilizing these plugins and promotes ease of use.</p>
<p>List of supported plugins:</p>
<ul>
<li><a href="#hardhat-zksync-solc">hardhat-zksync-compile</a></li>
<li><a href="#hardhat-zksync-deploy">hardhat-zksync-deploy</a></li>
<li><a href="#hardhat-zksync-chai-matchers">hardhat-zksync-chai-matchers</a></li>
<li><a href="#hardhat-zksync-verify">hardhat-zksync-verify</a></li>
</ul>
<h3 id="npm" tabindex="-1"><a class="header-anchor" href="#npm" aria-hidden="true">#</a> Npm</h3>
<p>Add the latest version of this plugin to your project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># Yarn
yarn add -D @matterlabs/hardhat-zksync-toolbox @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-chai-matchers @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify hardhat ethers zksync-web3 @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-toolbox
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h3>
<p>After installing it, add the plugin to your Hardhat config:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-toolbox"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>With the hardhat-zksync-toolbox plugin installed and imported, you will have access to all of the supported plugins and will be able to use them as needed in your project.</p>
<blockquote>
<p><strong><em>NOTE:</em></strong>  To learn more about using any of the plugins that are supported by the hardhat-zksync-toolbox plugin, you can refer to their documentation below.</p>
</blockquote>
<h2 id="hardhat-zksync-solc" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-solc" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-solc</code></h2>
<p>This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync 2.0.</p>
<h3 id="npm-1" tabindex="-1"><a class="header-anchor" href="#npm-1" aria-hidden="true">#</a> Npm</h3>
<p><a href="https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc" target="_blank" rel="noopener noreferrer">@matterlabs/hardhat-zksync-solc<ExternalLinkIcon/></a></p>
<p>Add the latest version of this plugin to your project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="exports" tabindex="-1"><a class="header-anchor" href="#exports" aria-hidden="true">#</a> Exports</h3>
<p>This plugin most often will not be used directly in the code.</p>
<h3 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h3>
<p>This plugin is configured in the <code v-pre>hardhat.config.ts</code> file of your project. Here is an example</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
  version<span class="token operator">:</span> <span class="token string">"1.2.1"</span><span class="token punctuation">,</span>
  compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>  <span class="token comment">// binary or docker</span>
  settings<span class="token operator">:</span> <span class="token punctuation">{</span>
    compilerPath<span class="token operator">:</span> <span class="token string">"zksolc"</span><span class="token punctuation">,</span>  <span class="token comment">// ignored for compilerSource: "docker"</span>
    experimental<span class="token operator">:</span> <span class="token punctuation">{</span>
      dockerImage<span class="token operator">:</span> <span class="token string">"matterlabs/zksolc"</span><span class="token punctuation">,</span> <span class="token comment">// required for compilerSource: "docker"</span>
      tag<span class="token operator">:</span> <span class="token string">"latest"</span>   <span class="token comment">// required for compilerSource: "docker"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    libraries<span class="token operator">:</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// optional. References to non-inlinable libraries</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
networks<span class="token operator">:</span> <span class="token punctuation">{</span>
  hardhat<span class="token operator">:</span> <span class="token punctuation">{</span>
    zksync<span class="token operator">:</span> <span class="token boolean">true</span>  <span class="token comment">// enables zksync in hardhat local network</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>version</code> is a field with the version of the <code v-pre>zksolc</code> compiler. Compiler versions can be found in <a href="https://github.com/matter-labs/zksolc-bin" target="_blank" rel="noopener noreferrer">the following repository<ExternalLinkIcon/></a>.</li>
<li><code v-pre>compilerSource</code> indicates the compiler source and can be either <code v-pre>docker</code> or <code v-pre>binary</code> (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If <code v-pre>docker</code> is used, you'd need to run Docker desktop in the background and provide both <code v-pre>dockerImage</code> and <code v-pre>tag</code> in the experimental section.</li>
<li><code v-pre>compilerPath</code> (optional) is a field with the path to the <code v-pre>zksolc</code> binary. By default, the binary in <code v-pre>$PATH</code> is used. If <code v-pre>compilerSource</code> is <code v-pre>docker</code>, this field is ignored.</li>
<li><code v-pre>dockerImage</code> and <code v-pre>tag</code> make up the name of the compiler docker image. If <code v-pre>compilerSource</code> is <code v-pre>binary</code>, these fields are ignored.</li>
<li><code v-pre>libraries</code> if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about <RouterLink to="/api/hardhat/compiling-libraries.html">compiling libraries here</RouterLink></li>
<li><code v-pre>zksync</code> network option indicates whether zksolc is enabled on a certain network. <code v-pre>false</code> by default. Useful for multichain projects in which you can enable <code v-pre>zksync</code> only for specific networks.</li>
</ul>
<h3 id="commands" tabindex="-1"><a class="header-anchor" href="#commands" aria-hidden="true">#</a> Commands</h3>
<p><code v-pre>hardhat compile</code> -- compiles all the smart contracts in the <code v-pre>contracts</code> directory and creates the <code v-pre>artifacts-zk</code> folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.</p>
<p>To understand what the factory dependencies are, read more about them in the <RouterLink to="/api/api.html">Web3 API</RouterLink> documentation.</p>
<h2 id="hardhat-zksync-vyper" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-vyper" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-vyper</code></h2>
<p>This plugin is used to provide a convenient interface for compiling Vyper smart contracts before deploying them to zkSync 2.0.</p>
<h3 id="npm-2" tabindex="-1"><a class="header-anchor" href="#npm-2" aria-hidden="true">#</a> Npm</h3>
<p><a href="https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper" target="_blank" rel="noopener noreferrer">@matterlabs/hardhat-zksync-vyper<ExternalLinkIcon/></a></p>
<p>This plugin is used in conjunction with <a href="https://www.npmjs.com/package/@nomiclabs/hardhat-vyper" target="_blank" rel="noopener noreferrer">@nomiclabs/hardhat-vyper<ExternalLinkIcon/></a>.
To use it, you have to install and import both plugins in the <code v-pre>hardhat.config.ts</code> file:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token string">"@nomiclabs/hardhat-vyper"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-vyper"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Add the latest version of this plugin to your project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># Yarn
yarn add -D @matterlabs/hardhat-zksync-vyper

# Npm
npm i -D @matterlabs/hardhat-zksync-vyper
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="exports-1" tabindex="-1"><a class="header-anchor" href="#exports-1" aria-hidden="true">#</a> Exports</h3>
<p>This plugin most often will not be used directly in the code.</p>
<h3 id="configuration-1" tabindex="-1"><a class="header-anchor" href="#configuration-1" aria-hidden="true">#</a> Configuration</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>zkvyper<span class="token operator">:</span> <span class="token punctuation">{</span>
  version<span class="token operator">:</span> <span class="token string">"0.1.0"</span><span class="token punctuation">,</span>
  compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>  <span class="token comment">// binary or docker</span>
  settings<span class="token operator">:</span> <span class="token punctuation">{</span>
    compilerPath<span class="token operator">:</span> <span class="token string">"zkvyper"</span><span class="token punctuation">,</span>  <span class="token comment">// ignored for compilerSource: "docker"</span>
    experimental<span class="token operator">:</span> <span class="token punctuation">{</span>
      dockerImage<span class="token operator">:</span> <span class="token string">"matterlabs/zkvyper"</span><span class="token punctuation">,</span>  <span class="token comment">// required for compilerSource: "docker"</span>
      tag<span class="token operator">:</span> <span class="token string">"latest"</span>  <span class="token comment">// required for compilerSource: "docker"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    libraries<span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// optional. References to non-inlinable libraries</span>

  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
networks<span class="token operator">:</span> <span class="token punctuation">{</span>
  hardhat<span class="token operator">:</span> <span class="token punctuation">{</span>
    zksync<span class="token operator">:</span> <span class="token boolean">true</span>  <span class="token comment">// enables zksync in hardhat local network</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>version</code> is a field with the version of the <code v-pre>zkvyper</code> compiler. Compiler versions can be found in <a href="https://github.com/matter-labs/zkvyper-bin" target="_blank" rel="noopener noreferrer">the following repository<ExternalLinkIcon/></a>.</li>
<li><code v-pre>compilerSource</code> indicates the compiler source and can be either <code v-pre>docker</code> or <code v-pre>binary</code> (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If <code v-pre>docker</code> is used, you'd need to run Docker desktop in the background and provide both <code v-pre>dockerImage</code> and <code v-pre>tag</code> in the experimental section.</li>
<li><code v-pre>compilerPath</code> (optional) is a field with the path to the <code v-pre>zkvyper</code> binary. By default, the binary in <code v-pre>$PATH</code> is used. If <code v-pre>compilerSource</code> is <code v-pre>docker</code>, this field is ignored.</li>
<li><code v-pre>dockerImage</code> and <code v-pre>tag</code> make up the name of the compiler docker image. If <code v-pre>compilerSource</code> is <code v-pre>binary</code>, these fields are ignored.</li>
<li><code v-pre>libraries</code> if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about <RouterLink to="/api/hardhat/compiling-libraries.html">compiling libraries here</RouterLink></li>
<li><code v-pre>zksync</code> network option indicates whether zkvyper is enabled on a certain network. <code v-pre>false</code> by default. Useful for multichain projects in which you can enable <code v-pre>zksync</code> only for specific networks.</li>
</ul>
<h3 id="commands-1" tabindex="-1"><a class="header-anchor" href="#commands-1" aria-hidden="true">#</a> Commands</h3>
<p><code v-pre>hardhat compile</code> -- compiles all the smart contracts in the <code v-pre>contracts</code> directory and creates <code v-pre>artifacts-zk</code> folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.</p>
<p>To understand what the factory dependencies are, read more about them in the <RouterLink to="/api/api.html">Web3 API</RouterLink> documentation.</p>
<h2 id="hardhat-zksync-deploy" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-deploy" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-deploy</code></h2>
<p>This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the <code v-pre>@matterlabs/hardhat-zksync-solc</code> or <code v-pre>@matterlabs/hardhat-zksync-vyper</code> plugins.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>Contracts must be compiled using the official <code v-pre>@matterlabs/hardhat-zksync-solc</code> or <code v-pre>@matterlabs/hardhat-zksync-vyper</code> plugins. Contracts compiled with other compilers will fail to deploy to zkSync using this plugin.</p>
</div>
<h3 id="npm-3" tabindex="-1"><a class="header-anchor" href="#npm-3" aria-hidden="true">#</a> Npm</h3>
<p><a href="https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy" target="_blank" rel="noopener noreferrer">@matterlabs/hardhat-zksync-deploy<ExternalLinkIcon/></a></p>
<p>Add the latest version of this plugin to your project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>
# Yarn

yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm

npm i -D @matterlabs/hardhat-zksync-deploy

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="exports-2" tabindex="-1"><a class="header-anchor" href="#exports-2" aria-hidden="true">#</a> Exports</h3>
<h4 id="deployer" tabindex="-1"><a class="header-anchor" href="#deployer" aria-hidden="true">#</a> <code v-pre>Deployer</code></h4>
<p>The main export of this plugin is the <code v-pre>Deployer</code> class. It is used to wrap a <code v-pre>zksync-web3</code> Wallet instance and provides a convenient interface to deploy smart contracts and account abstractions. Its main methods are:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">Deployer</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * <span class="token keyword">@param</span> <span class="token parameter">hre</span> Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * <span class="token keyword">@param</span> <span class="token parameter">zkWallet</span> The wallet which will be used to deploy the contracts.
   * <span class="token keyword">@param</span> <span class="token parameter">deploymentType</span> Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">,</span> zkWallet<span class="token operator">:</span> zk<span class="token punctuation">.</span>Wallet<span class="token punctuation">,</span> deploymentType<span class="token operator">?</span><span class="token operator">:</span> zk<span class="token punctuation">.</span>types<span class="token punctuation">.</span>DeploymentType<span class="token punctuation">)</span>

  <span class="token doc-comment comment">/**
   * Created a `Deployer` object on ethers.Wallet object.
   *
   * <span class="token keyword">@param</span> <span class="token parameter">hre</span> Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * <span class="token keyword">@param</span> <span class="token parameter">ethWallet</span> The wallet which will be used to deploy the contracts.
   * <span class="token keyword">@param</span> <span class="token parameter">deploymentType</span> Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */</span>
  <span class="token keyword">static</span> <span class="token function">fromEthWallet</span><span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">,</span> ethWallet<span class="token operator">:</span> ethers<span class="token punctuation">.</span>Wallet<span class="token punctuation">,</span> deploymentType<span class="token operator">?</span><span class="token operator">:</span> zk<span class="token punctuation">.</span>types<span class="token punctuation">.</span>DeploymentType<span class="token punctuation">)</span>

  <span class="token doc-comment comment">/**
   * Loads an artifact and verifies that it was compiled by `zksolc\.
   *
   * <span class="token keyword">@param</span> <span class="token parameter">contractNameOrFullyQualifiedName</span> The name of the contract.
   *   It can be a bare contract name (e.g. "Token") if it's
   *   unique in your project, or a fully qualified contract name
   *   (e.g. "contract/token.sol:Token") otherwise.
   *
   * <span class="token keyword">@throws</span> Throws an error if a non-unique contract name is used,
   *   indicating which fully qualified names can be used instead.
   *
   * <span class="token keyword">@throws</span> Throws an error if an artifact was not compiled by `zksolc`.
   */</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">loadArtifact</span><span class="token punctuation">(</span>
    contractNameOrFullyQualifiedName<span class="token operator">:</span> <span class="token builtin">string</span>
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ZkSyncArtifact<span class="token operator">></span>

  <span class="token doc-comment comment">/**
   * Estimates the price of calling a deploy transaction in a certain fee token.
   *
   * <span class="token keyword">@param</span> <span class="token parameter">artifact</span> The previously loaded artifact object.
   * <span class="token keyword">@param</span> <span class="token parameter">constructorArguments</span> List of arguments to be passed to the contract constructor.
   *
   * <span class="token keyword">@returns</span> Calculated fee in ETH wei.
   */</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">estimateDeployFee</span><span class="token punctuation">(</span>
    artifact<span class="token operator">:</span> ZkSyncArtifact<span class="token punctuation">,</span>
    constructorArguments<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>ethers<span class="token punctuation">.</span>BigNumber<span class="token operator">></span>

  <span class="token doc-comment comment">/**
    * Sends a deploy transaction to the zkSync network.
    * For now it uses defaults values for the transaction parameters:
    *
    * <span class="token keyword">@param</span> <span class="token parameter">artifact</span> The previously loaded artifact object.
    * <span class="token keyword">@param</span> <span class="token parameter">constructorArguments</span> List of arguments to be passed to the contract constructor.
    * <span class="token keyword">@param</span> <span class="token parameter">overrides</span> Optional object with additional deploy transaction parameters.
    * <span class="token keyword">@param</span> <span class="token parameter">additionalFactoryDeps</span> Additional contract bytecodes to be added to the factory dependencies list.
    * The fee amount is requested automatically from the zkSync server.
    *
    * <span class="token keyword">@returns</span> A contract object.
    */</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">deploy</span><span class="token punctuation">(</span>
    artifact<span class="token operator">:</span> ZkSyncArtifact<span class="token punctuation">,</span>
    constructorArguments<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    overrides<span class="token operator">?</span><span class="token operator">:</span> Overrides<span class="token punctuation">,</span>
    additionalFactoryDeps<span class="token operator">?</span><span class="token operator">:</span> ethers<span class="token punctuation">.</span>BytesLike<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>zk<span class="token punctuation">.</span>Contract<span class="token operator">></span>

  <span class="token doc-comment comment">/**
   * Extracts factory dependencies from the artifact.
   *
   * <span class="token keyword">@param</span> <span class="token parameter">artifact</span> Artifact to extract dependencies from
   *
   * <span class="token keyword">@returns</span> Factory dependencies in the format expected by SDK.
   */</span>
  <span class="token keyword">async</span> <span class="token function">extractFactoryDeps</span><span class="token punctuation">(</span>artifact<span class="token operator">:</span> ZkSyncArtifact<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To see an example script of how to use a <code v-pre>Deployer</code> to deploy a contract, check out <RouterLink to="/api/hardhat/getting-started.html#write-and-deploy-a-contract">deployment section of the quickstart</RouterLink>.</p>
<h3 id="configuration-2" tabindex="-1"><a class="header-anchor" href="#configuration-2" aria-hidden="true">#</a> Configuration</h3>
<div class="hint-container warning">
<p class="hint-container-title">API changes in v0.6.x</p>
<p>Previous versions of this package required a different configuration in the <code v-pre>hardhat.config.ts</code> file. If you're using <code v-pre>v0.5.x</code> or previous, the network configuration must be indicated in an object named <code v-pre>zkSyncDeploy</code>, including the properties <code v-pre>zkSyncNetwork</code> and <code v-pre>ethNetwork</code>. <strong>We recommended users to update to the latest version of this package.</strong></p>
</div>
<p>Specify the zkSync and Ethereum networks as part of the <code v-pre>hardhat.config.ts</code> file's <code v-pre>networks</code> configuration:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>networks<span class="token operator">:</span> <span class="token punctuation">{</span>
  goerli<span class="token operator">:</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">"https://goerli.infura.io/v3/&lt;API_KEY>"</span> <span class="token comment">// URL of the Ethereum Web3 RPC (optional)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  zkTestnet<span class="token operator">:</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the zkSync network RPC</span>
    ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)</span>
    zksync<span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token comment">// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>zkTestnet</code> is an arbitrary zkSync network name. You can select this as the default network using the <code v-pre>defaultNetwork</code> property.</li>
<li><code v-pre>url</code> is a field with the URL of the zkSync node in case of the zkSync network (with <code v-pre>zksync</code> flag set to <code v-pre>true</code>), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.</li>
<li><code v-pre>ethNetwork</code> is a field with the URL of the Ethereum node. You can also provide network name (e.g. <code v-pre>goerli</code>) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the <code v-pre>networks</code> section), or the default <code v-pre>ethers</code> provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.</li>
<li><code v-pre>zksync</code> is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to <code v-pre>true</code> for all zkSync networks. <code v-pre>false</code> by default.</li>
</ul>
<h3 id="commands-2" tabindex="-1"><a class="header-anchor" href="#commands-2" aria-hidden="true">#</a> Commands</h3>
<p><code v-pre>hardhat deploy-zksync</code> -- runs through all the scripts in the <code v-pre>deploy</code> folder.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Note that deployment scripts must be placed in the <code v-pre>deploy</code> folder!</p>
</div>
<ul>
<li>To run a specific script, add the <code v-pre>--script</code> argument, e.g. <code v-pre>hardhat deploy-zksync --script 001_deploy.ts</code> will run script <code v-pre>./deploy/001_deploy.ts</code>.</li>
<li>To run on a specific zkSync network, use standard hardhat <code v-pre>--network</code> argument, e.g. <code v-pre>--network zkTestnet</code> (the network with the name <code v-pre>zkTestnet</code> needs to be configured in the <code v-pre>hardhat.config.ts</code> file, with all required fields stated above), or specify <code v-pre>defaultNetwork</code> in <code v-pre>hardhat.config.ts</code> file.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>If network argument <code v-pre>--network</code> or <code v-pre>defaultNetwork</code> configuration are not specified, local setup with <code v-pre>http://localhost:8545</code> (Ethereum RPC URL) and <code v-pre>http://localhost:3050</code> (zkSync RPC URL), will be used. In this case zkSync network doesn't need to be configured in <code v-pre>hardhat.config.ts</code> file.
For more details about the dockerized local setup, check out <a href="https://v2-docs.zksync.io/api/hardhat/testing.html" target="_blank" rel="noopener noreferrer">Local testing<ExternalLinkIcon/></a>.</p>
</div>
<h2 id="hardhat-zksync-chai-matchers" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-chai-matchers" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-chai-matchers</code></h2>
<p>This plugin adds zkSync-specific capabilities to the <a href="https://www.chaijs.com/" target="_blank" rel="noopener noreferrer">Chai<ExternalLinkIcon/></a> assertion library for testing smart contracts. It extends all the functionalities supported by the <a href="https://hardhat.org/hardhat-chai-matchers/docs/overview" target="_blank" rel="noopener noreferrer">hardhat-chai-matchers<ExternalLinkIcon/></a> plugin, with the idea to preserve the same behavior and interface.
Currently, it is used in combination with <a href="https://v2-docs.zksync.io/api/hardhat/testing.html" target="_blank" rel="noopener noreferrer">local testing environment<ExternalLinkIcon/></a>.</p>
<blockquote>
<p><strong><em>NOTE:</em></strong>  Since responses from transactions that revert are highly dependent on the RPC implementation, all <a href="https://hardhat.org/hardhat-chai-matchers/docs/overview" target="_blank" rel="noopener noreferrer">hardhat<ExternalLinkIcon/></a> chai matchers that start with revert have been affected (but without any changes to the chai matchers interface). In addition, the options argument from changeEtherBalance/changeEtherBalances has been extended with the overrides field in order to support zksync-web3 transfer method with overrides.</p>
</blockquote>
<h3 id="npm-4" tabindex="-1"><a class="header-anchor" href="#npm-4" aria-hidden="true">#</a> Npm</h3>
<p>Add the latest version of this plugin to your project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># Yarn
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-chai-matchers
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="usage-1" tabindex="-1"><a class="header-anchor" href="#usage-1" aria-hidden="true">#</a> Usage</h3>
<p>After installing it, add the plugin to your Hardhat config:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-chai-matchers"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Then you'll be able to use the matchers in your tests.</p>
<h4 id="changeetherbalance" tabindex="-1"><a class="header-anchor" href="#changeetherbalance" aria-hidden="true">#</a> changeEtherBalance</h4>
<p>Assert that the ether balance of an address changed by a specific amount:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span>
    sender<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">to</span><span class="token operator">:</span> receiver<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        <span class="token literal-property property">amount</span><span class="token operator">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">changeEtherBalance</span><span class="token punctuation">(</span>sender<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token function">BigInt</span><span class="token punctuation">(</span><span class="token string">'-2000'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span>
    sender<span class="token punctuation">.</span><span class="token function">sendTransaction</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">to</span><span class="token operator">:</span> receiver<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">changeEtherBalance</span><span class="token punctuation">(</span>sender<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token string">'-1000'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This matchers include additional options argument with functionalities for including fee and overriding transaction:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>overrides <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token literal-property property">maxFeePerGas</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">*</span> gasPrice<span class="token punctuation">,</span>
    <span class="token literal-property property">maxPriorityFeePerGas</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token operator">*</span> gasPrice<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span>
    sender<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">to</span><span class="token operator">:</span> receiver<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
        <span class="token literal-property property">amount</span><span class="token operator">:</span> <span class="token number">500</span><span class="token punctuation">,</span>
        overrides<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">changeEtherBalance</span><span class="token punctuation">(</span>sender<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token punctuation">(</span>txGasFees <span class="token operator">+</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">balanceChangeOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">includeFee</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    overrides<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="changetokenbalance" tabindex="-1"><a class="header-anchor" href="#changetokenbalance" aria-hidden="true">#</a> changeTokenBalance</h4>
<p>Assert that an ERC20 token balance of an address changed by a specific amount:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span>
    sender<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">to</span><span class="token operator">:</span> receiver<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token literal-property property">amount</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token literal-property property">token</span><span class="token operator">:</span> token<span class="token punctuation">.</span>address <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">changeTokenBalance</span><span class="token punctuation">(</span>token<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span>token<span class="token punctuation">.</span><span class="token function">transfer</span><span class="token punctuation">(</span>receiver<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">changeTokenBalance</span><span class="token punctuation">(</span>token<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reverted" tabindex="-1"><a class="header-anchor" href="#reverted" aria-hidden="true">#</a> reverted</h4>
<p>Assert that a transaction reverted for any reason:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span><span class="token function">setAmount</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>be<span class="token punctuation">.</span>reverted<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="revertedwithcustomerror" tabindex="-1"><a class="header-anchor" href="#revertedwithcustomerror" aria-hidden="true">#</a> revertedWithCustomError</h4>
<p>Assert that a transaction reverted with a specific custom error:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span><span class="token function">setAmount</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>be<span class="token punctuation">.</span><span class="token function">revertedWithCustomError</span><span class="token punctuation">(</span>contract<span class="token punctuation">,</span> <span class="token string">'InvalidAmount'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><br/>
<p>And you can also use regular chai matchers like:</p>
<h4 id="emit" tabindex="-1"><a class="header-anchor" href="#emit" aria-hidden="true">#</a> emit</h4>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">expect</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span><span class="token function">setAmount</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>contract<span class="token punctuation">,</span> <span class="token string">'AmountUpdated'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="properaddress" tabindex="-1"><a class="header-anchor" href="#properaddress" aria-hidden="true">#</a> properAddress</h4>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">expect</span><span class="token punctuation">(</span><span class="token string">"0x36615Cf349d7F6344891B1e7CA7C72883F5dc049"</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>be<span class="token punctuation">.</span>properAddress<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="comparisons-of-numbers" tabindex="-1"><a class="header-anchor" href="#comparisons-of-numbers" aria-hidden="true">#</a> Comparisons of numbers</h4>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">expect</span><span class="token punctuation">(</span><span class="token keyword">await</span> contract<span class="token punctuation">.</span><span class="token function">getAmount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">equal</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Checkout the advantages of using chai matchers <a href="https://hardhat.org/hardhat-chai-matchers/docs/overview#why-would-i-want-to-use-it?" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>. Since the list of all supported chai matchers is same as with <a href="https://hardhat.org/hardhat-chai-matchers/docs/overview" target="_blank" rel="noopener noreferrer">hardhat-chai-matchers<ExternalLinkIcon/></a> plugin, check the <a href="https://hardhat.org/hardhat-chai-matchers/docs/reference" target="_blank" rel="noopener noreferrer">reference documentation<ExternalLinkIcon/></a>.</p>
<h2 id="hardhat-zksync-verify" tabindex="-1"><a class="header-anchor" href="#hardhat-zksync-verify" aria-hidden="true">#</a> <code v-pre>hardhat-zksync-verify</code></h2>
<p>This plugin is used to verify contracts on the zkSync 2.0 network.</p>
<h3 id="npm-5" tabindex="-1"><a class="header-anchor" href="#npm-5" aria-hidden="true">#</a> Npm</h3>
<p><a href="https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify" target="_blank" rel="noopener noreferrer">@matterlabs/hardhat-zksync-verify<ExternalLinkIcon/></a></p>
<p>The plugin is used in conjunction with <a href="https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan" target="_blank" rel="noopener noreferrer">@nomiclabs/hardhat-etherscan<ExternalLinkIcon/></a> and it supports backward compatibility with that plugin.
To use it, you have to install both plugins and then import <code v-pre>@matterlabs/hardhat-zksync-verify</code> in the hardhat.config.ts file.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code># Yarn
yarn add <span class="token operator">-</span><span class="token constant">D</span> <span class="token decorator"><span class="token at operator">@</span><span class="token function">matterlabs</span></span><span class="token operator">/</span>hardhat<span class="token operator">-</span>zksync<span class="token operator">-</span>verify <span class="token decorator"><span class="token at operator">@</span><span class="token function">nomiclabs</span></span><span class="token operator">/</span>hardhat<span class="token operator">-</span>etherscan

# Npm
npm i <span class="token operator">-</span><span class="token constant">D</span> <span class="token decorator"><span class="token at operator">@</span><span class="token function">matterlabs</span></span><span class="token operator">/</span>hardhat<span class="token operator">-</span>zksync<span class="token operator">-</span>verify <span class="token decorator"><span class="token at operator">@</span><span class="token function">nomiclabs</span></span><span class="token operator">/</span>hardhat<span class="token operator">-</span>etherscan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-verify"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="exports-3" tabindex="-1"><a class="header-anchor" href="#exports-3" aria-hidden="true">#</a> Exports</h3>
<h3 id="configuration-3" tabindex="-1"><a class="header-anchor" href="#configuration-3" aria-hidden="true">#</a> Configuration</h3>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>networks<span class="token operator">:</span> <span class="token punctuation">{</span>
  goerli<span class="token operator">:</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">"https://goerli.infura.io/v3/&lt;API_KEY>"</span> <span class="token comment">// URL of the Ethereum Web3 RPC (optional)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  zkTestnet<span class="token operator">:</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the zkSync network RPC</span>
    ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)</span>
    zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    verifyURL<span class="token operator">:</span> <span class="token string">'https://zksync2-testnet-explorer.zksync.dev/contract_verification'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token comment">// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>zkTestnet</code> is an arbitrary zkSync network name. You can select this as the default network using the <code v-pre>defaultNetwork</code> property.</li>
<li><code v-pre>ethNetwork</code> is a field with the URL of the Ethereum node. You can also provide the network name (e.g. <code v-pre>goerli</code>) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the <code v-pre>networks</code> section), or the default <code v-pre>ethers</code> provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.</li>
<li><code v-pre>url</code> is a field with the URL of the zkSync node in the case of the zkSync network (with <code v-pre>zksync</code> flag set to <code v-pre>true</code>), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.</li>
<li><code v-pre>zksync</code> is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to <code v-pre>true</code> for all zkSync networks. If you want to run a <code v-pre>hardhat-etherscan</code> verification, this field needs to be set to <code v-pre>false</code>. If set to <code v-pre>true</code>, the verification process will always try to run the verification process on the zkSync network.</li>
<li><code v-pre>verifyURL</code> is a field that points to the verification endpoint for the specific zkSync network. This parameter is optional, and its default value is the testnet verification url (<code v-pre>https://zksync2-testnet-explorer.zksync.dev/contract_verification</code>).</li>
</ul>
<p>If you want to verify a smart contract on the Ethereum in the same project, it is important to add <code v-pre>etherscan</code> field in the <code v-pre>hardhat.config.ts</code> file:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>
networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
etherscan<span class="token operator">:</span> <span class="token punctuation">{</span>
  apiKey<span class="token operator">:</span> <span class="token comment">//&lt;Your API key for Etherscan>,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="commands-3" tabindex="-1"><a class="header-anchor" href="#commands-3" aria-hidden="true">#</a> Commands</h3>
<p><code v-pre>hardhat verify --network &lt;network&gt; &lt;contract address&gt;</code> - verifies the contract on the given network with the given contract's address. </br>
Note: When run like this, the verify task will try to compare compiled bytecode of all the contracts in your local setup to the deployed bytecode of the contract you are trying to verify. If there is no match, it will report an error.</p>
<p>With the <code v-pre>--contract</code> parameter you can also specify which contract from your local setup you want to verify by specifying its Fully qualified name. Fully qualified name structure looks like this: &quot;contracts/AContract.sol:TheContract&quot; </br></p>
<p>Example: <code v-pre> yarn hardhat verify --network &lt;network&gt; &lt;contract address&gt; --contract &lt;fully qualified  name&gt;</code></p>
<p>If your contract was deployed with the specific constructor arguments, you need to specify them when running the verify task. For example: <br/>
<code v-pre>yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF &quot;Hi there!&quot;</code></p>
<p>If your constructor takes a complex argument list, you can write a separate javascript module to export it. <br/>
For example, create an <code v-pre>arguments.js</code> file with the following structure:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">"a string argument"</span><span class="token punctuation">,</span>
  <span class="token string">"0xabcdef"</span><span class="token punctuation">,</span>
  <span class="token string">"42"</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    property1<span class="token operator">:</span> <span class="token string">"one"</span><span class="token punctuation">,</span>
    property2<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Include it in the verify function call by adding a new parameter: <code v-pre>--constructor-args arguments.js</code>:
<code v-pre>yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js&quot;</code></p>
<h3 id="verify-smart-contract-programmatically" tabindex="-1"><a class="header-anchor" href="#verify-smart-contract-programmatically" aria-hidden="true">#</a> Verify smart contract programmatically</h3>
<p>If you need to run the verification task directly from your code, you can use the hardhat &quot;verify:verify&quot; task with the previously mentioned parameters with the difference in using <code v-pre>--address</code> parameter when specifying contarct's address:<br/></p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">await</span> hre<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token string">"verify:verify"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  address<span class="token operator">:</span> contractAddress<span class="token punctuation">,</span>
  contract<span class="token operator">:</span> contractFullyQualifedName
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


