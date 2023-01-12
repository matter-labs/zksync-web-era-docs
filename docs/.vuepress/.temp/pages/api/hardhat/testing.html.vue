<template><div><h1 id="local-testing" tabindex="-1"><a class="header-anchor" href="#local-testing" aria-hidden="true">#</a> Local testing</h1>
<p>Sometimes there is a need to test contracts in a local environment for network latency or fee reasons.</p>
<p>zkSync team provides a dockerized local setup for this purpose.</p>
<h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<p>It is required that you have <code v-pre>Docker</code> and <code v-pre>docker-compose</code> installed on your computer. Find the <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener noreferrer">installation guide here<ExternalLinkIcon/></a></p>
<p>This guide assumes that you're familiar with the zkSync Hardhat plugins. If you are new developing on zkSync with Hardhat, please check the <RouterLink to="/api/hardhat/getting-started.html">getting started section here</RouterLink>.</p>
<h2 id="installing-the-testing-environment" tabindex="-1"><a class="header-anchor" href="#installing-the-testing-environment" aria-hidden="true">#</a> Installing the testing environment</h2>
<p>Download the dockerized project with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>git clone https://github.com/matter-labs/local-setup.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="start-the-local-nodes" tabindex="-1"><a class="header-anchor" href="#start-the-local-nodes" aria-hidden="true">#</a> Start the local nodes</h2>
<p>To run zkSync locally, run the <code v-pre>start.sh</code> script:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>cd local-setup
./start.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>This command will start three docker containers:</p>
<ul>
<li>Postgres (used as the database for zkSync).</li>
<li>Local Geth node (used as L1 for zkSync).</li>
<li>zkSync node itself.</li>
</ul>
<p>By default, the HTTP JSON-RPC API will run on port <code v-pre>3050</code>, while WS API will run on port <code v-pre>3051</code>.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>Note, that it is important that the first <code v-pre>start.sh</code> script invocation goes uninterrupted. If you face any issues after the bootstrapping process unexpectedly stopped, you should <a href="#resetting-the-zksync-state">reset</a> the local zkSync state and try again.</p>
</div>
<h2 id="reset-the-zksync-state" tabindex="-1"><a class="header-anchor" href="#reset-the-zksync-state" aria-hidden="true">#</a> Reset the zkSync state</h2>
<p>To reset the zkSync state, run the <code v-pre>./clear.sh</code> script:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>./clear.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Note, that you may receive a &quot;permission denied&quot; error when running this command. In this case, you should run it with the root privileges:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>sudo ./clear.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="rich-wallets" tabindex="-1"><a class="header-anchor" href="#rich-wallets" aria-hidden="true">#</a> Rich wallets</h2>
<p>The local zkSync setup comes with some &quot;rich&quot; wallets with large amounts of ETH on both L1 and L2.</p>
<p>The full list of the addresses of these accounts with the corresponding private keys can be found <a href="https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</p>
<div class="hint-container warning">
<p class="hint-container-title">ERC20 tokens</p>
<p>Rich wallets only have ETH. <strong>If you need to test with ERC20 tokens, you should deploy them yourself.</strong></p>
<p>If you'd like the local node to come with pre-deployed tokens again, please let us know on our <a href="https://join.zksync.dev/" target="_blank" rel="noopener noreferrer">Discord<ExternalLinkIcon/></a>, so we can prioritize accordingly.</p>
</div>
<h2 id="using-custom-database-or-ethereum-node" tabindex="-1"><a class="header-anchor" href="#using-custom-database-or-ethereum-node" aria-hidden="true">#</a> Using custom database or Ethereum node</h2>
<p>To use a custom Postgres database or Layer 1 node, you should change the environment parameters in the docker-compose file:</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">environment</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> DATABASE_URL=postgres<span class="token punctuation">:</span>//postgres@postgres/zksync_local
  <span class="token punctuation">-</span> ETH_CLIENT_WEB3_URL=http<span class="token punctuation">:</span>//geth<span class="token punctuation">:</span><span class="token number">8545</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>DATABASE_URL</code> is the URL to the Postgres database.</li>
<li><code v-pre>ETH_CLIENT_WEB3_URL</code> is the URL to the HTTP JSON-RPC interface of the L1 node.</li>
</ul>
<h2 id="testing-with-mocha-chai" tabindex="-1"><a class="header-anchor" href="#testing-with-mocha-chai" aria-hidden="true">#</a> Testing with <code v-pre>mocha</code> + <code v-pre>chai</code></h2>
<p>Since the zkSync node URL is provided in the <code v-pre>hardhat.config.ts</code>, the best way to use different URLs for deployment and local testing is to use environment variables. The standard way is to set the <code v-pre>NODE_ENV=test</code> environment variable before invoking the tests.</p>
<h3 id="project-setup" tabindex="-1"><a class="header-anchor" href="#project-setup" aria-hidden="true">#</a> Project setup</h3>
<ol>
<li>
<p>Create a new Hardhat project following the <RouterLink to="/api/hardhat/getting-started.html">getting started guide</RouterLink> as a reference.</p>
</li>
<li>
<p>To install the test libraries, run the following command:</p>
</li>
</ol>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add -D mocha chai @types/mocha @types/chai
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3">
<li>Add the following lines to your <code v-pre>package.json</code> in the root folder:</li>
</ol>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"test"</span><span class="token operator">:</span> <span class="token string">"NODE_ENV=test hardhat test"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This will enable running tests in a Hardhat environment with the <code v-pre>NODE_ENV</code> env variable set as a <code v-pre>test</code>.</p>
<h3 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h3>
<ol start="4">
<li>Modify <code v-pre>hardhat.config.ts</code> to use the local node for testing:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">"@matterlabs/hardhat-zksync-solc"</span><span class="token punctuation">;</span>

<span class="token comment">// dynamically changes endpoints for local tests</span>
<span class="token keyword">const</span> zkSyncTestnet <span class="token operator">=</span>
  process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">==</span> <span class="token string">"test"</span>
    <span class="token operator">?</span> <span class="token punctuation">{</span>
        url<span class="token operator">:</span> <span class="token string">"http://localhost:3050"</span><span class="token punctuation">,</span>
        ethNetwork<span class="token operator">:</span> <span class="token string">"http://localhost:8545"</span><span class="token punctuation">,</span>
        zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span>
    <span class="token operator">:</span> <span class="token punctuation">{</span>
        url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span>
        ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span>
        zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"1.2.2"</span><span class="token punctuation">,</span>
    compilerSource<span class="token operator">:</span> <span class="token string">"binary"</span><span class="token punctuation">,</span>
    settings<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// defaults to zkSync network</span>
  defaultNetwork<span class="token operator">:</span> <span class="token string">"zkSyncTestnet"</span><span class="token punctuation">,</span>

  networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    hardhat<span class="token operator">:</span> <span class="token punctuation">{</span>
      zksync<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// load test network details</span>
    zkSyncTestnet<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  solidity<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"0.8.16"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Create a <code v-pre>test</code> folder, where the tests will reside.</p>
<h3 id="writing-test-files" tabindex="-1"><a class="header-anchor" href="#writing-test-files" aria-hidden="true">#</a> Writing test files</h3>
<ol start="5">
<li>Now you can write your first test! Create a <code v-pre>test/main.test.ts</code> file with the following code:</li>
</ol>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> expect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"chai"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Wallet<span class="token punctuation">,</span> Provider<span class="token punctuation">,</span> Contract <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> hre <span class="token keyword">from</span> <span class="token string">"hardhat"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Deployer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">RICH_WALLET_PK</span> <span class="token operator">=</span> <span class="token string">"0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">deployGreeter</span><span class="token punctuation">(</span>deployer<span class="token operator">:</span> Deployer<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>Contract<span class="token operator">></span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> artifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"Greeter"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">"Hi"</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">"Greeter"</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">"Should return the new greeting once it's changed"</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> provider <span class="token operator">=</span> Provider<span class="token punctuation">.</span><span class="token function">getDefaultProvider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">RICH_WALLET_PK</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> deployer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deployer</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> greeter <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">deployGreeter</span><span class="token punctuation">(</span>deployer<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">expect</span><span class="token punctuation">(</span><span class="token keyword">await</span> greeter<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span><span class="token string">"Hi"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> setGreetingTx <span class="token operator">=</span> <span class="token keyword">await</span> greeter<span class="token punctuation">.</span><span class="token function">setGreeting</span><span class="token punctuation">(</span><span class="token string">"Hola, mundo!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// wait until the transaction is mined</span>
    <span class="token keyword">await</span> setGreetingTx<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">expect</span><span class="token punctuation">(</span><span class="token keyword">await</span> greeter<span class="token punctuation">.</span><span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span><span class="token function">equal</span><span class="token punctuation">(</span><span class="token string">"Hola, mundo!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This script deploys the <code v-pre>Greeter</code> contract created in the <RouterLink to="/api/hardhat/getting-started.html#write-and-deploy-a-contract">getting started guide</RouterLink> and test that it returns a correct message when calling the <code v-pre>greet()</code> method, and that the message can be updated with the <code v-pre>setGreeting()</code> method.</p>
<p>You can now run the test file with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>Congratulations! You've ran your first tests locally with zkSync 🎉</strong></p>
<h2 id="full-example" tabindex="-1"><a class="header-anchor" href="#full-example" aria-hidden="true">#</a> Full example</h2>
<p>The full example with tests can be found <a href="https://github.com/matter-labs/tutorial-examples/tree/main/local-setup-testing" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a></p>
<h2 id="chai-matchers" tabindex="-1"><a class="header-anchor" href="#chai-matchers" aria-hidden="true">#</a> Chai Matchers</h2>
<p>The zkSync team provides the <RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-chai-matchers">hardhat-zksync-chai-matchers</RouterLink> plugin to make it easier to write and maintain tests for your projects, in addition to offering a local testing environment. This plugin includes a set of Chai matchers specifically designed for use with zkSync, which can help you write more comprehensive and understandable tests for your contracts. By using these matchers, you can ensure that your contracts are working as intended and reduce the likelihood of encountering bugs or other issues during development.</p>
</div></template>


