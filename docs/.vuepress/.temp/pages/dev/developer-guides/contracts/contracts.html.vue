<template><div><h1 id="smart-contract-development" tabindex="-1"><a class="header-anchor" href="#smart-contract-development" aria-hidden="true">#</a> Smart contract development</h1>
<p>zkSync 2.0 allows developers to build projects using the same programming languages and tools used to build on Ethereum.</p>
<h2 id="solidity-support" tabindex="-1"><a class="header-anchor" href="#solidity-support" aria-hidden="true">#</a> Solidity support</h2>
<p>For the time being Solidity <code v-pre>&gt;=0.4.10</code> versions are supported, though <strong>we strongly recommended using</strong> <code v-pre>^0.8.0</code> as older versions contain known bugs.</p>
<p>Solidity versions <code v-pre>&gt;=0.8</code> are compiled through Yul, whereas <code v-pre>&lt;=0.7</code> are compiled via the EVM legacy assembly, which is a less friendly IR due to obfuscation of the control-flow and call graphs. For this reason, there are a few limitations in zkSync for contracts written in Solidity <code v-pre>&lt;=0.7</code>:</p>
<ul>
<li>Contract-local recursion is not supported.</li>
<li>Internal function pointers are not supported.</li>
<li>Possible impact on the contract size and VM cycles count.</li>
</ul>
<h3 id="using-libraries-in-solidity" tabindex="-1"><a class="header-anchor" href="#using-libraries-in-solidity" aria-hidden="true">#</a> Using libraries in Solidity</h3>
<p>The usage of libraries in Solidity is supported in zkSync 2.0 with the following considerations:</p>
<ul>
<li>If a Solidity library can be inlined (i.e. it only contains <code v-pre>private</code> or <code v-pre>internal</code> methods), it can be used without any additional configuration.</li>
<li>However, if a library contains at least one <code v-pre>public</code> or <code v-pre>external</code> method, it's non-inlinable and its address needs to be passed explicitly to the compiler. You can learn more about <RouterLink to="/api/hardhat/compiling-libraries.html">how to compile non-inlineable libraries in this section of the docs</RouterLink>.</li>
</ul>
<h2 id="vyper-support" tabindex="-1"><a class="header-anchor" href="#vyper-support" aria-hidden="true">#</a> Vyper support</h2>
<p>Currently only Vyper <code v-pre>^0.3.3</code> is supported.</p>
<h2 id="compilers" tabindex="-1"><a class="header-anchor" href="#compilers" aria-hidden="true">#</a> Compilers</h2>
<p>Although you can write smart contracts in both Solidty and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:</p>
<ul>
<li><a href="https://github.com/matter-labs/zksolc-bin" target="_blank" rel="noopener noreferrer">zksolc<ExternalLinkIcon/></a>: Solidity compiler.</li>
<li><a href="https://github.com/matter-labs/zkvyper-bin" target="_blank" rel="noopener noreferrer">zkvyper<ExternalLinkIcon/></a>: Vyper compiler.</li>
</ul>
<p><strong>Our compilers are based on LLVM</strong>. LLVM-based compilers have become the industry standard because of their robustness, efficiency, and the large community around the world. They provide us some additional advantages:</p>
<ul>
<li>Enable us to improve the efficiency over the original EVM bytecode because with LLVM we can take advantage of the many optimizations and tools available in this mature ecosystem.</li>
<li>Pave the way for us to add support for integrating codebases written in other programming languages with LLVM front-ends. By doing so, developers can build dApps and use blockchains in ways that are currently not possible.</li>
</ul>
<p>We recommend using these compilers via <RouterLink to="/api/hardhat/plugins.html">their correspondent Hardhat plugins</RouterLink> (although they're also available as binaries). These plugins should be added to the Hardhat's config file and allow developers to compile new projects or migrate existing ones to zkSync 2.0.</p>
<div class="hint-container warning">
<p class="hint-container-title">Note</p>
<p>Compilers are no longer released as Docker images and its usage is no longer recommended. Use the <code v-pre>compilerSource: &quot;binary&quot;</code> in the Hardhat config file to use the binary instead.</p>
</div>
<p><strong>Learn more about how to install and configure these plugins in the links below:</strong></p>
<ul>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-solc">hardhat-zksync-solc documentation</RouterLink></li>
<li><RouterLink to="/api/hardhat/plugins.html#hardhat-zksync-vyper">hardhat-zksync-vyper documentation</RouterLink></li>
</ul>
<h2 id="evm-compatibility" tabindex="-1"><a class="header-anchor" href="#evm-compatibility" aria-hidden="true">#</a> EVM compatibility</h2>
<p>Almost every smart contract written for EVM will be supported by zkSync 2.0 and will hold all key security invariants so that no additional security re-auditing will be required in most cases. A notable exception is the contracts that use the following EVM opcodes:</p>
<ul>
<li><code v-pre>SELFDESTRUCT</code> - It’s considered harmful and was deprecated in <a href="https://eips.ethereum.org/EIPS/eip-6049" target="_blank" rel="noopener noreferrer">EIP-6049<ExternalLinkIcon/></a>.</li>
<li><code v-pre>CALLCODE</code> - It was deprecated on Ethereum in <a href="https://eips.ethereum.org/EIPS/eip-2488" target="_blank" rel="noopener noreferrer">EIP-2488<ExternalLinkIcon/></a> in favor of <code v-pre>DELEGATECALL</code>.</li>
<li><code v-pre>EXTCODECOPY</code> - We've skip it for now because zkEVM opcodes are not identical to EVM ones, but it can be implemented if needed.</li>
<li><code v-pre>CODECOPY</code> - It's replaced with <code v-pre>CALLDATACOPY</code> in the deploy code.</li>
<li><code v-pre>PC</code> - Not accessible in Yul and Solidity <code v-pre>&gt;=0.7.0</code>. Accessible in Solidity <code v-pre>0.6.0</code> although it produces a runtime error.</li>
</ul>
<p><strong>All these opcodes produce an error on compilation.</strong></p>
<p>There are a few other distinctions, for example, gas metering will be different (as is the case for other L2s as well). Some EVM’s cryptographic precompiles (notably pairings and RSA) won’t be available in the very first release but will be implemented soon after the launch, with pairing being a priority to allow both Hyperchains and protocols like Aztec/Dark Forest to be deployed without modifications too.</p>
<p>Ethereum cryptographic primitives like <code v-pre>ecrecover</code>, <code v-pre>keccak256</code> and <code v-pre>sha256</code> are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.</p>
</div></template>


