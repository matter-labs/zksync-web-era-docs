<template><div><h1 id="building-custom-paymaster" tabindex="-1"><a class="header-anchor" href="#building-custom-paymaster" aria-hidden="true">#</a> Building custom paymaster</h1>
<p>Let's see how we can use the paymaster feature to build a custom paymaster that allows users to pay fees in our token. In this tutorial we will:</p>
<ul>
<li>Create a paymaster that will assume that a single unit of an ERC20 token is enough to cover any transaction fee.</li>
<li>Create the ERC20 token contract and send some tokens to a brand new wallet.</li>
<li>Finally we will send a <code v-pre>mint</code> transaction from the newly created wallet via the paymaster. Even though the transaction would normally require some ETH to pay for the gas fee, our paymaster will execute the transaction in exchange for 1 unit of the ERC20 token.</li>
</ul>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="prerequisite" tabindex="-1"><a class="header-anchor" href="#prerequisite" aria-hidden="true">#</a> Prerequisite</h2>
<p>To better understand this page, we recommend you first read up on <RouterLink to="/dev/developer-guides/aa.html">account abstraction design</RouterLink> before diving into this tutorial.</p>
<p>It is assumed that you are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the <RouterLink to="/dev/developer-guides/hello-world.html">quickstart tutorial</RouterLink>. It is also recommended to read the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html">introduction to the system contracts</RouterLink> .</p>
<h2 id="installing-dependencies" tabindex="-1"><a class="header-anchor" href="#installing-dependencies" aria-hidden="true">#</a> Installing dependencies</h2>
<p>We will use the zkSync hardhat plugin for developing this contract. Firstly, we should install all the dependencies for it:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>mkdir custom-paymaster-tutorial
cd custom-paymaster-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Since we are working with zkSync contracts, we also need to install the package with the contracts and its peer dependencies:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Then create the <code v-pre>hardhat.config.ts</code> config file, <code v-pre>contracts</code> and <code v-pre>deploy</code> folders, like in the <RouterLink to="/dev/developer-guides/hello-world.html">quickstart tutorial</RouterLink>.</p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>You can use the zkSync CLI to scaffold a project automatically. Find <RouterLink to="/api/tools/zksync-cli/">more info about the zkSync CLI here</RouterLink></p>
</div>
<h2 id="design" tabindex="-1"><a class="header-anchor" href="#design" aria-hidden="true">#</a> Design</h2>
<p>Our protocol will be a dummy protocol that allows anyone to swap a certain ERC20 token in exchange for paying fees for the transaction.</p>
<p>The skeleton for the paymaster looks the following way:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">// SPDX-License-Identifier: MIT</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> IPaymaster<span class="token punctuation">,</span> ExecutionResult <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> IPaymasterFlow <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> TransactionHelper<span class="token punctuation">,</span> Transaction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol'</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">'@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol'</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">MyPaymaster</span> <span class="token keyword">is</span> IPaymaster <span class="token punctuation">{</span>
    <span class="token builtin">uint256</span> <span class="token keyword">constant</span> PRICE_FOR_PAYING_FEES <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token builtin">address</span> <span class="token keyword">public</span> allowedToken<span class="token punctuation">;</span>

    <span class="token keyword">modifier</span> <span class="token function">onlyBootloader</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">require</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>sender <span class="token operator">==</span> BOOTLOADER_FORMAL_ADDRESS<span class="token punctuation">,</span> <span class="token string">"Only bootloader can call this method"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// Continure execution if called from the bootloader.</span>
        <span class="token keyword">_</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token builtin">address</span> _erc20<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        allowedToken <span class="token operator">=</span> _erc20<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">validateAndPayForPaymasterTransaction</span><span class="token punctuation">(</span><span class="token builtin">bytes32</span><span class="token punctuation">,</span> <span class="token builtin">bytes32</span><span class="token punctuation">,</span> Transaction <span class="token keyword">calldata</span> _transaction<span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> override onlyBootloader <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bytes</span> <span class="token keyword">memory</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// Transaction validation logic goes here</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">postOp</span><span class="token punctuation">(</span>
        <span class="token builtin">bytes</span> <span class="token keyword">calldata</span> _context<span class="token punctuation">,</span>
        Transaction <span class="token keyword">calldata</span> _transaction<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _txHash<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _suggestedSignedHash<span class="token punctuation">,</span>
        ExecutionResult _txResult<span class="token punctuation">,</span>
        <span class="token builtin">uint256</span> _maxRefundedErgs
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> onlyBootloader <span class="token punctuation">{</span>
        <span class="token comment">// This contract does not support any refunding logic</span>
    <span class="token punctuation">}</span>

    <span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note, that only the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#bootloader">bootloader</RouterLink> should be allowed to call the <code v-pre>validateAndPayForPaymasterTransaction</code>/<code v-pre>postOp</code> methods. That's why the <code v-pre>onlyBootloader</code> modifier is used for them.</p>
<h3 id="parsing-the-paymaster-input" tabindex="-1"><a class="header-anchor" href="#parsing-the-paymaster-input" aria-hidden="true">#</a> Parsing the paymaster input</h3>
<p>In this tutorial, we want to charge the user one unit of the <code v-pre>allowedToken</code> in exchange for her fees being paid by the contract.</p>
<p>The input that the paymaster should receive is encoded in the <code v-pre>paymasterInput</code>. As described <RouterLink to="/dev/developer-guides/aa.html#built-in-paymaster-flows">in the paymaster documentation</RouterLink>, there are some standardized ways to encode user interactions with paymasterInput. To charge the user, we will require that she has provided enough allowance to the paymaster contract. This is what the <code v-pre>approvalBased</code> flow can help us with.</p>
<p>Firstly, we'll need to check that the <code v-pre>paymasterInput</code> was encoded as in the <code v-pre>approvalBased</code> flow:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">require</span><span class="token punctuation">(</span>_transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">.</span>length <span class="token operator">>=</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token string">"The standard paymaster input must be at least 4 bytes long"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">bytes4</span> paymasterInputSelector <span class="token operator">=</span> <span class="token builtin">bytes4</span><span class="token punctuation">(</span>_transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">:</span><span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>paymasterInputSelector <span class="token operator">==</span> IPaymasterFlow<span class="token punctuation">.</span>approvalBased<span class="token punctuation">.</span>selector<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span><span class="token builtin">address</span> token<span class="token punctuation">,</span> <span class="token builtin">uint256</span> minAllowance<span class="token punctuation">,</span> <span class="token builtin">bytes</span> <span class="token keyword">memory</span> data<span class="token punctuation">)</span> <span class="token operator">=</span> abi<span class="token punctuation">.</span><span class="token function">decode</span><span class="token punctuation">(</span>_transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token builtin">address</span><span class="token punctuation">,</span> <span class="token builtin">uint256</span><span class="token punctuation">,</span> <span class="token builtin">bytes</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">require</span><span class="token punctuation">(</span>token <span class="token operator">==</span> allowedToken<span class="token punctuation">,</span> <span class="token string">"Invalid token"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">require</span><span class="token punctuation">(</span>minAllowance <span class="token operator">>=</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">"Min allowance too low"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//</span>
    <span class="token comment">// ...</span>
    <span class="token comment">//</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">revert</span><span class="token punctuation">(</span><span class="token string">"Unsupported paymaster flow"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Then, we need to check that the user indeed provided enough allowance:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token builtin">address</span> userAddress <span class="token operator">=</span> <span class="token builtin">address</span><span class="token punctuation">(</span><span class="token builtin">uint160</span><span class="token punctuation">(</span>_transaction<span class="token punctuation">.</span><span class="token keyword">from</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token builtin">address</span> thisAddress <span class="token operator">=</span> <span class="token builtin">address</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token builtin">uint256</span> providedAllowance <span class="token operator">=</span> <span class="token function">IERC20</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">allowance</span><span class="token punctuation">(</span>userAddress<span class="token punctuation">,</span> thisAddress<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">require</span><span class="token punctuation">(</span>providedAllowance <span class="token operator">>=</span> PRICE_FOR_PAYING_FEES<span class="token punctuation">,</span> <span class="token string">"The user did not provide enough allowance"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Then, we finally transfer the funds to the user in exchange for 1 unit of this token.</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">// Note, that while the minimal amount of ETH needed is tx.ergsPrice * tx.ergsLimit,</span>
<span class="token comment">// neither paymaster nor account are allowed to access this context variable.</span>
<span class="token builtin">uint256</span> requiredETH <span class="token operator">=</span> _transaction<span class="token punctuation">.</span>ergsLimit <span class="token operator">*</span> _transaction<span class="token punctuation">.</span>maxFeePerErg<span class="token punctuation">;</span>

<span class="token comment">// Pulling all the tokens from the user</span>
<span class="token function">IERC20</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">transferFrom</span><span class="token punctuation">(</span>userAddress<span class="token punctuation">,</span> thisAddress<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// The bootloader never returns any data, so it can safely be ignored here.</span>
<span class="token punctuation">(</span><span class="token builtin">bool</span> success<span class="token punctuation">,</span> <span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">payable</span><span class="token punctuation">(</span>BOOTLOADER_FORMAL_ADDRESS<span class="token punctuation">)</span><span class="token punctuation">.</span>call<span class="token punctuation">{</span>value<span class="token punctuation">:</span> requiredETH<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">require</span><span class="token punctuation">(</span>success<span class="token punctuation">,</span> <span class="token string">"Failed to transfer funds to the bootloader"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">You should validate all the requirements first</p>
<p>The <RouterLink to="/dev/developer-guides/aa.html#paymaster-validation-rules">rules</RouterLink> for the paymaster throttling say that the paymaster won't be throttled if the first storage read the value of which differed from the execution on the API was a storage slot that belonged to the user.</p>
<p>That is why it is important to verify that the user provided all the allowed prerequisites to the transaction <em>before</em> performing any logic. This is the reason we <em>first</em> check that the user provided enough allowance, and only then do we do <code v-pre>transferFrom</code>.</p>
</div>
<h3 id="full-code-of-the-paymaster" tabindex="-1"><a class="header-anchor" href="#full-code-of-the-paymaster" aria-hidden="true">#</a> Full code of the paymaster</h3>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">// SPDX-License-Identifier: MIT</span>
<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span>IPaymaster<span class="token punctuation">,</span> ExecutionResult<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>IPaymasterFlow<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>TransactionHelper<span class="token punctuation">,</span> Transaction<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">"@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">MyPaymaster</span> <span class="token keyword">is</span> IPaymaster <span class="token punctuation">{</span>
    <span class="token builtin">uint256</span> <span class="token keyword">constant</span> PRICE_FOR_PAYING_FEES <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token builtin">address</span> <span class="token keyword">public</span> allowedToken<span class="token punctuation">;</span>

    <span class="token keyword">modifier</span> <span class="token function">onlyBootloader</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">require</span><span class="token punctuation">(</span>
            msg<span class="token punctuation">.</span>sender <span class="token operator">==</span> BOOTLOADER_FORMAL_ADDRESS<span class="token punctuation">,</span>
            <span class="token string">"Only bootloader can call this method"</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// Continure execution if called from the bootloader.</span>
        <span class="token keyword">_</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token builtin">address</span> _erc20<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        allowedToken <span class="token operator">=</span> _erc20<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">validateAndPayForPaymasterTransaction</span><span class="token punctuation">(</span>
        <span class="token builtin">bytes32</span> _txHash<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _suggestedSignedHash<span class="token punctuation">,</span>
        Transaction <span class="token keyword">calldata</span> _transaction
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> override onlyBootloader <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bytes</span> <span class="token keyword">memory</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">require</span><span class="token punctuation">(</span>
            _transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">.</span>length <span class="token operator">>=</span> <span class="token number">4</span><span class="token punctuation">,</span>
            <span class="token string">"The standard paymaster input must be at least 4 bytes long"</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token builtin">bytes4</span> paymasterInputSelector <span class="token operator">=</span> <span class="token builtin">bytes4</span><span class="token punctuation">(</span>
            _transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">:</span><span class="token number">4</span><span class="token punctuation">]</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>paymasterInputSelector <span class="token operator">==</span> IPaymasterFlow<span class="token punctuation">.</span>approvalBased<span class="token punctuation">.</span>selector<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token punctuation">(</span><span class="token builtin">address</span> token<span class="token punctuation">,</span> <span class="token builtin">uint256</span> minAllowance<span class="token punctuation">,</span> <span class="token builtin">bytes</span> <span class="token keyword">memory</span> data<span class="token punctuation">)</span> <span class="token operator">=</span> abi
                <span class="token punctuation">.</span><span class="token function">decode</span><span class="token punctuation">(</span>
                    _transaction<span class="token punctuation">.</span>paymasterInput<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                    <span class="token punctuation">(</span><span class="token builtin">address</span><span class="token punctuation">,</span> <span class="token builtin">uint256</span><span class="token punctuation">,</span> <span class="token builtin">bytes</span><span class="token punctuation">)</span>
                <span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">require</span><span class="token punctuation">(</span>token <span class="token operator">==</span> allowedToken<span class="token punctuation">,</span> <span class="token string">"Invalid token"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">require</span><span class="token punctuation">(</span>minAllowance <span class="token operator">>=</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">"Min allowance too low"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token builtin">address</span> userAddress <span class="token operator">=</span> <span class="token builtin">address</span><span class="token punctuation">(</span><span class="token builtin">uint160</span><span class="token punctuation">(</span>_transaction<span class="token punctuation">.</span><span class="token keyword">from</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token builtin">address</span> thisAddress <span class="token operator">=</span> <span class="token builtin">address</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token builtin">uint256</span> providedAllowance <span class="token operator">=</span> <span class="token function">IERC20</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">allowance</span><span class="token punctuation">(</span>
                userAddress<span class="token punctuation">,</span>
                thisAddress
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">require</span><span class="token punctuation">(</span>
                providedAllowance <span class="token operator">>=</span> PRICE_FOR_PAYING_FEES<span class="token punctuation">,</span>
                <span class="token string">"The user did not provide enough allowance"</span>
            <span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token comment">// Note, that while the minimal amount of ETH needed is tx.ergsPrice * tx.ergsLimit,</span>
            <span class="token comment">// neither paymaster nor account are allowed to access this context variable.</span>
            <span class="token builtin">uint256</span> requiredETH <span class="token operator">=</span> _transaction<span class="token punctuation">.</span>ergsLimit <span class="token operator">*</span>
                _transaction<span class="token punctuation">.</span>maxFeePerErg<span class="token punctuation">;</span>

            <span class="token comment">// Pulling all the tokens from the user</span>
            <span class="token function">IERC20</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">transferFrom</span><span class="token punctuation">(</span>userAddress<span class="token punctuation">,</span> thisAddress<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// The bootloader never returns any data, so it can safely be ignored here.</span>
            <span class="token punctuation">(</span><span class="token builtin">bool</span> success<span class="token punctuation">,</span> <span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">payable</span><span class="token punctuation">(</span>BOOTLOADER_FORMAL_ADDRESS<span class="token punctuation">)</span><span class="token punctuation">.</span>call<span class="token punctuation">{</span>
                value<span class="token punctuation">:</span> requiredETH
            <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">require</span><span class="token punctuation">(</span>success<span class="token punctuation">,</span> <span class="token string">"Failed to transfer funds to the bootloader"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">revert</span><span class="token punctuation">(</span><span class="token string">"Unsupported paymaster flow"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">postOp</span><span class="token punctuation">(</span>
        <span class="token builtin">bytes</span> <span class="token keyword">calldata</span> _context<span class="token punctuation">,</span>
        Transaction <span class="token keyword">calldata</span> _transaction<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _txHash<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _suggestedSignedHash<span class="token punctuation">,</span>
        ExecutionResult _txResult<span class="token punctuation">,</span>
        <span class="token builtin">uint256</span> _maxRefundedErgs
    <span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> onlyBootloader <span class="token punctuation">{</span>
        <span class="token comment">// This contract does not support any refunding logic</span>
    <span class="token punctuation">}</span>

    <span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">external</span> <span class="token keyword">payable</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploying-an-erc20-contract" tabindex="-1"><a class="header-anchor" href="#deploying-an-erc20-contract" aria-hidden="true">#</a> Deploying an ERC20 contract</h2>
<p>To test our paymaster, we need an ERC20 token. We are now going to deploy one. For the sake of simplicity we will use a somewhat modified OpenZeppelin implementation of it:</p>
<p>Create the <code v-pre>MyERC20.sol</code> file and put the following code in it:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token comment">// SPDX-License-Identifier: UNLICENSED</span>

<span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">"@openzeppelin/contracts/token/ERC20/ERC20.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">MyERC20</span> <span class="token keyword">is</span> ERC20 <span class="token punctuation">{</span>
    <span class="token builtin">uint8</span> <span class="token keyword">private</span> _decimals<span class="token punctuation">;</span>

    <span class="token keyword">constructor</span><span class="token punctuation">(</span>
        <span class="token builtin">string</span> <span class="token keyword">memory</span> name_<span class="token punctuation">,</span>
        <span class="token builtin">string</span> <span class="token keyword">memory</span> symbol_<span class="token punctuation">,</span>
        <span class="token builtin">uint8</span> decimals_
    <span class="token punctuation">)</span> <span class="token function">ERC20</span><span class="token punctuation">(</span>name_<span class="token punctuation">,</span> symbol_<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _decimals <span class="token operator">=</span> decimals_<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">mint</span><span class="token punctuation">(</span><span class="token builtin">address</span> _to<span class="token punctuation">,</span> <span class="token builtin">uint256</span> _amount<span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">_mint</span><span class="token punctuation">(</span>_to<span class="token punctuation">,</span> _amount<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">function</span> <span class="token function">decimals</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">view</span> override <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">uint8</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> _decimals<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploying-the-paymaster" tabindex="-1"><a class="header-anchor" href="#deploying-the-paymaster" aria-hidden="true">#</a> Deploying the paymaster</h2>
<p>To deploy the ERC20 token and the paymaster, we need to create a deployment script. Create the <code v-pre>deploy</code> folder and create one file there: <code v-pre>deploy-paymaster.ts</code>. Put the following deployment script there:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> utils<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatRuntimeEnvironment <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/types"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Deployer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/hardhat-zksync-deploy"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// The wallet that will deploy the token and the paymaster</span>
  <span class="token comment">// It is assumed that this wallet already has sufficient funds on zkSync</span>
  <span class="token comment">// ⚠️ Never commit private keys to file tracking history, or your account could be compromised.</span>
  <span class="token keyword">const</span> wallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token string">"&lt;PRIVATE-KEY>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// The wallet that will receive ERC20 tokens</span>
  <span class="token keyword">const</span> emptyWallet <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">createRandom</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Empty wallet's address: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>emptyWallet<span class="token punctuation">.</span>address<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Empty wallet's private key: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>emptyWallet<span class="token punctuation">.</span>privateKey<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> deployer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deployer</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deploying the ERC20 token</span>
  <span class="token keyword">const</span> erc20Artifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"MyERC20"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> erc20 <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>erc20Artifact<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">"MyToken"</span><span class="token punctuation">,</span> <span class="token string">"MyToken"</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">ERC20 address: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>erc20<span class="token punctuation">.</span>address<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Deploying the paymaster</span>
  <span class="token keyword">const</span> paymasterArtifact <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">loadArtifact</span><span class="token punctuation">(</span><span class="token string">"MyPaymaster"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> paymaster <span class="token operator">=</span> <span class="token keyword">await</span> deployer<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span>paymasterArtifact<span class="token punctuation">,</span> <span class="token punctuation">[</span>erc20<span class="token punctuation">.</span>address<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Paymaster address: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>paymaster<span class="token punctuation">.</span>address<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Supplying paymaster with ETH</span>
  <span class="token keyword">await</span> <span class="token punctuation">(</span>
    <span class="token keyword">await</span> deployer<span class="token punctuation">.</span>zkWallet<span class="token punctuation">.</span><span class="token function">sendTransaction</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      to<span class="token operator">:</span> paymaster<span class="token punctuation">.</span>address<span class="token punctuation">,</span>
      value<span class="token operator">:</span> ethers<span class="token punctuation">.</span>utils<span class="token punctuation">.</span><span class="token function">parseEther</span><span class="token punctuation">(</span><span class="token string">"0.03"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Supplying the ERC20 tokens to the empty wallet:</span>
  <span class="token keyword">await</span> <span class="token comment">// We will give the empty wallet 3 units of the token:</span>
  <span class="token punctuation">(</span><span class="token keyword">await</span> erc20<span class="token punctuation">.</span><span class="token function">mint</span><span class="token punctuation">(</span>emptyWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Minted 3 tokens for the empty wallet"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Done!</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Besides deploying the paymaster it also creates an empty wallet and gives some of the <code v-pre>MyERC20</code> tokens to it, so that it can use the paymaster.</p>
<p>To deploy the ERC20 token and the paymaster, you should compile the contracts and run the script:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>The output should be roughly the following:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Empty wallet's address: 0xAd155D3069BB3c587E995916B320444056d8191F
Empty wallet's private key: 0x236d735297617cc68f4ec8ceb40b351ca5be9fc585d446fa95dff02354ac04fb
ERC20 address: 0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964
Paymaster address: 0x0a67078A35745947A37A552174aFe724D8180c25
Minted 3 tokens for the empty wallet
Done!
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note that the addresses and private keys will be different for each run.</p>
<h2 id="using-the-paymaster" tabindex="-1"><a class="header-anchor" href="#using-the-paymaster" aria-hidden="true">#</a> Using the paymaster</h2>
<p>Create the <code v-pre>use-paymaster.ts</code> script in the <code v-pre>deploy</code> folder. You can see the example for interacting with the paymaster in the code snippet below:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Provider<span class="token punctuation">,</span> utils<span class="token punctuation">,</span> Wallet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ethers <span class="token keyword">from</span> <span class="token string">"ethers"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HardhatRuntimeEnvironment <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"hardhat/types"</span><span class="token punctuation">;</span>

<span class="token comment">// Put the address of the deployed paymaster here</span>
<span class="token keyword">const</span> <span class="token constant">PAYMASTER_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;PAYMASTER_ADDRESS>"</span><span class="token punctuation">;</span>

<span class="token comment">// Put the address of the ERC20 token here:</span>
<span class="token keyword">const</span> <span class="token constant">TOKEN_ADDRESS</span> <span class="token operator">=</span> <span class="token string">"&lt;TOKEN_ADDRESS>"</span><span class="token punctuation">;</span>

<span class="token comment">// Wallet private key</span>
<span class="token comment">// ⚠️ Never commit private keys to file tracking history, or your account could be compromised.</span>
<span class="token keyword">const</span> <span class="token constant">EMPTY_WALLET_PRIVATE_KEY</span> <span class="token operator">=</span> <span class="token string">"&lt;EMPTY_WALLET_PRIVATE_KEY>"</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">getToken</span><span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">,</span> wallet<span class="token operator">:</span> Wallet<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> artifact <span class="token operator">=</span> hre<span class="token punctuation">.</span>artifacts<span class="token punctuation">.</span><span class="token function">readArtifactSync</span><span class="token punctuation">(</span><span class="token string">"MyERC20"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ethers</span><span class="token punctuation">.</span><span class="token function">Contract</span><span class="token punctuation">(</span><span class="token constant">TOKEN_ADDRESS</span><span class="token punctuation">,</span> artifact<span class="token punctuation">.</span>abi<span class="token punctuation">,</span> wallet<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>hre<span class="token operator">:</span> HardhatRuntimeEnvironment<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token string">"https://zksync2-testnet.zksync.dev"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> emptyWallet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span><span class="token constant">EMPTY_WALLET_PRIVATE_KEY</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Obviously this step is not required, but it is here purely to demonstrate that indeed the wallet has no ether.</span>
  <span class="token keyword">const</span> ethBalance <span class="token operator">=</span> <span class="token keyword">await</span> emptyWallet<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>ethBalance<span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">"The wallet is not empty"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Balance of the user before mint: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">await</span> emptyWallet<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token constant">TOKEN_ADDRESS</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> erc20 <span class="token operator">=</span> <span class="token function">getToken</span><span class="token punctuation">(</span>hre<span class="token punctuation">,</span> emptyWallet<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> gasPrice <span class="token operator">=</span> <span class="token keyword">await</span> provider<span class="token punctuation">.</span><span class="token function">getGasPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Estimate gas fee for mint transaction</span>
  <span class="token keyword">const</span> gasLimit <span class="token operator">=</span> <span class="token keyword">await</span> erc20<span class="token punctuation">.</span>estimateGas<span class="token punctuation">.</span><span class="token function">mint</span><span class="token punctuation">(</span>emptyWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    customData<span class="token operator">:</span> <span class="token punctuation">{</span>
      ergsPerPubdata<span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">DEFAULT_ERGS_PER_PUBDATA_LIMIT</span><span class="token punctuation">,</span>
      paymasterParams<span class="token operator">:</span> <span class="token punctuation">{</span>
        paymaster<span class="token operator">:</span> <span class="token constant">PAYMASTER_ADDRESS</span><span class="token punctuation">,</span>
        <span class="token comment">// empty input as our paymaster doesn't require additional data</span>
        paymasterInput<span class="token operator">:</span> <span class="token string">"0x"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> fee <span class="token operator">=</span> gasPrice<span class="token punctuation">.</span><span class="token function">mul</span><span class="token punctuation">(</span>gasLimit<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Encoding the "ApprovalBased" paymaster flow's input</span>
  <span class="token keyword">const</span> paymasterParams <span class="token operator">=</span> utils<span class="token punctuation">.</span><span class="token function">getPaymasterParams</span><span class="token punctuation">(</span><span class="token constant">PAYMASTER_ADDRESS</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    type<span class="token operator">:</span> <span class="token string">"ApprovalBased"</span><span class="token punctuation">,</span>
    token<span class="token operator">:</span> <span class="token constant">TOKEN_ADDRESS</span><span class="token punctuation">,</span>
    <span class="token comment">// set minimalAllowance as we defined in the paymaster contract</span>
    minimalAllowance<span class="token operator">:</span> ethers<span class="token punctuation">.</span>BigNumber<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// empty bytes as testnet paymaster does not use innerInput</span>
    innerInput<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">await</span> <span class="token punctuation">(</span>
    <span class="token keyword">await</span> erc20<span class="token punctuation">.</span><span class="token function">mint</span><span class="token punctuation">(</span>emptyWallet<span class="token punctuation">.</span>address<span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token comment">// Provide gas params manually</span>
      maxFeePerGas<span class="token operator">:</span> gasPrice<span class="token punctuation">,</span>
      maxPriorityFeePerGas<span class="token operator">:</span> gasPrice<span class="token punctuation">,</span>
      gasLimit<span class="token punctuation">,</span>

      <span class="token comment">// paymaster info</span>
      customData<span class="token operator">:</span> <span class="token punctuation">{</span>
        paymasterParams<span class="token punctuation">,</span>
        ergsPerPubdata<span class="token operator">:</span> utils<span class="token punctuation">.</span><span class="token constant">DEFAULT_ERGS_PER_PUBDATA_LIMIT</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Balance of the user after mint: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">await</span> emptyWallet<span class="token punctuation">.</span><span class="token function">getBalance</span><span class="token punctuation">(</span><span class="token constant">TOKEN_ADDRESS</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After filling in the parameters <code v-pre>PAYMASTER_ADDRESS</code>, <code v-pre>TOKEN_ADDRESS</code> and <code v-pre>EMPTY_WALLET_PRIVATE_KEY</code> with the output provided in the previous step, run this script with the following command:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn hardhat deploy-zksync --script use-paymaster.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The output should be roughly the following:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Balance of the user before mint: 3
Balance of the user after mint: 102
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>The wallet had 3 tokens after running the deployment script and, after sending the transaction to <code v-pre>mint</code> 100 more tokens, the balance is 102 as 1 token was used to pay the transaction fee to the paymaster.</p>
<h2 id="common-errors" tabindex="-1"><a class="header-anchor" href="#common-errors" aria-hidden="true">#</a> Common errors</h2>
<p>If the <code v-pre>use-paymaster.ts</code> script fails with the error <code v-pre>Failed to submit transaction: Failed to validate the transaction. Reason: Validation revert: Paymaster validation error: Failed to transfer funds to the bootloader</code>, please try sending additional ETH to the paymaster so it has enough funds to pay for the transaction. You can use <a href="https://portal.zksync.io/" target="_blank" rel="noopener noreferrer">zkSync Portal<ExternalLinkIcon/></a>.</p>
<p>If the <code v-pre>use-paymaster.ts</code> script fails when minting new ERC20 tokens with the error <code v-pre>Error: transaction failed</code>, and the transactions appear with status &quot;Failed&quot; in the <a href="https://explorer.zksync.io/" target="_blank" rel="noopener noreferrer">zkSync explorer<ExternalLinkIcon/></a>, please reach out to us on <a href="https://join.zksync.dev/" target="_blank" rel="noopener noreferrer">our Discord<ExternalLinkIcon/></a> or <a href="https://zksync.io/contact.html" target="_blank" rel="noopener noreferrer">contact page<ExternalLinkIcon/></a>. As a workaround, try including a specific <code v-pre>gasLimit</code> value in the transaction.</p>
<h2 id="complete-project" tabindex="-1"><a class="header-anchor" href="#complete-project" aria-hidden="true">#</a> Complete project</h2>
<p>You can download the complete project <a href="https://github.com/matter-labs/custom-paymaster-tutorial" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</p>
<h2 id="learn-more" tabindex="-1"><a class="header-anchor" href="#learn-more" aria-hidden="true">#</a> Learn more</h2>
<ul>
<li>To learn more about L1-&gt;L2 interaction on zkSync, check out the <RouterLink to="/dev/developer-guides/bridging/l1-l2.html">documentation</RouterLink>.</li>
<li>To learn more about the <code v-pre>zksync-web3</code> SDK, check out its <a href="../../api/js">documentation</a>.</li>
<li>To learn more about the zkSync hardhat plugins, check out their <a href="../../api/hardhat">documentation</a>.</li>
</ul>
</div></template>


