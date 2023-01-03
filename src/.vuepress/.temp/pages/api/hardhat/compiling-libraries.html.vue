<template><div><h1 id="compiling-non-inlinable-libraries" tabindex="-1"><a class="header-anchor" href="#compiling-non-inlinable-libraries" aria-hidden="true">#</a> Compiling non-inlinable libraries</h1>
<p>Solidity libraries can be divided into two categories:</p>
<ul>
<li><em>Inlinable</em>. The ones that contain only <code v-pre>private</code> or <code v-pre>internal</code> methods. Since they can never be called from outside, the Solidity compiler inlines them, i.e. does not use external calls to access the library methods and uses the code of these libraries as part of the code that uses them.</li>
<li><em>Non-inlinable</em>. The ones that have at least one <code v-pre>public</code> or <code v-pre>external</code> method. While they may be inlined by the Solidity compiler, they are not inlined when compiled to Yul representation. Since Yul is an intermediate step when compiling to zkEVM bytecode, this means that these libraries can not be inlined by the zkSync compiler.</li>
</ul>
<p><strong>Practically this means that libraries with public methods need to be deployed separately and their addresses passed as an argument when compiling the main contract.</strong> Usage of the methods of this library will be replaced with calls to its address.</p>
<h2 id="openzeppelin-utility-libraries" tabindex="-1"><a class="header-anchor" href="#openzeppelin-utility-libraries" aria-hidden="true">#</a> OpenZeppelin utility libraries</h2>
<p>Please note, that the total majority of the OpenZeppelin utility libraries <em>are</em> inlinable. That means that <em>there is no need to do any further actions to make them compile</em>.</p>
<p>This section describes the compilation of non-inlinable libraries only.</p>
<h2 id="example" tabindex="-1"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example</h2>
<p>Let's say that we have a small library that calculates the square of a number:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">library</span> <span class="token class-name">MiniMath</span> <span class="token punctuation">{</span>
    <span class="token keyword">function</span> <span class="token function">square</span><span class="token punctuation">(</span><span class="token builtin">uint256</span> x<span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">pure</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">uint256</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> x<span class="token operator">*</span>x<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>And there is a smart contract that uses this library</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">"./MiniMath.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">Main</span> <span class="token punctuation">{</span>
    <span class="token builtin">uint256</span> <span class="token keyword">public</span> lastNumber<span class="token punctuation">;</span>

    <span class="token keyword">function</span> <span class="token function">storeSquare</span><span class="token punctuation">(</span><span class="token builtin">uint256</span> x<span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token punctuation">{</span>
        <span class="token builtin">uint256</span> square <span class="token operator">=</span> MiniMath<span class="token punctuation">.</span><span class="token function">square</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>
        lastNumber <span class="token operator">=</span> square<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you try to create a project with these two files following the guidelines from the <RouterLink to="/api/hardhat/getting-started.html">getting started</RouterLink> guide, the <code v-pre>yarn hardhat compile</code> command will fail with the following error:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Error in plugin @matterlabs/hardhat-zksync-solc: LLVM("Library `contracts/MiniMath.sol:MiniMath` not found")
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>That error tells us that the address of the <code v-pre>MiniMath</code> library should be provided.</p>
<p>To resolve the issue, you need to create <em>a separate project</em>, where only the library file will be located. After deploying <em>only</em> the library to zkSync, you should get the address of the deployed library and pass it to the compiler settings. The process of deploying the library is the same as deploying a smart contract. You can learn how to deploy smart contracts on zkSync in the <RouterLink to="/api/hardhat/getting-started.html#write-and-deploy-a-contract">getting started</RouterLink> guide.</p>
<p>Let's say that the address of the deployed library is <code v-pre>0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC</code>. To pass this address to the compiler parameters, open the <code v-pre>harhdat.config.ts</code> file of the project where the <code v-pre>Main</code> contract is located and add the <code v-pre>libraries</code> section in the <code v-pre>zksolc</code> plugin properties:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"@matterlabs/hardhat-zksync-solc"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  zksolc<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"1.2.0"</span><span class="token punctuation">,</span>
    compilerSource<span class="token operator">:</span> <span class="token string">"docker"</span><span class="token punctuation">,</span>
    settings<span class="token operator">:</span> <span class="token punctuation">{</span>
      optimizer<span class="token operator">:</span> <span class="token punctuation">{</span>
        enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      experimental<span class="token operator">:</span> <span class="token punctuation">{</span>
        dockerImage<span class="token operator">:</span> <span class="token string">"matterlabs/zksolc"</span><span class="token punctuation">,</span>
        tag<span class="token operator">:</span> <span class="token string">"v1.2.0"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      libraries<span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">"contracts/MiniMath.sol"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          MiniMath<span class="token operator">:</span> <span class="token string">"0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC"</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  defaultNetwork<span class="token operator">:</span> <span class="token string">"zkTestnet"</span><span class="token punctuation">,</span>
  networks<span class="token operator">:</span> <span class="token punctuation">{</span>
    zkTestnet<span class="token operator">:</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">,</span> <span class="token comment">// URL of the zkSync network RPC</span>
      ethNetwork<span class="token operator">:</span> <span class="token string">"goerli"</span><span class="token punctuation">,</span> <span class="token comment">// Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/&lt;API_KEY>`)</span>
      zksync<span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  solidity<span class="token operator">:</span> <span class="token punctuation">{</span>
    version<span class="token operator">:</span> <span class="token string">"0.8.16"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The address of the library is passed in the following lines:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>libraries<span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token string-property property">'contracts/MiniMath.sol'</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">'MiniMath'</span><span class="token operator">:</span> <span class="token string">'0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where <code v-pre>'contracts/MiniMath.sol'</code> is the location of the library's Solidity file and <code v-pre>MiniMath</code> is the name of the library.</p>
<p>Now, running <code v-pre>yarn hardhat compile</code> should successfully compile the <code v-pre>Main</code> contract.</p>
</div></template>


