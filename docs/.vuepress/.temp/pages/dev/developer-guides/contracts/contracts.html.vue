<template><div><h1 id="contract-deployment" tabindex="-1"><a class="header-anchor" href="#contract-deployment" aria-hidden="true">#</a> Contract deployment</h1>
<p>To maintain the same security as in L1, the zkSync operator must publish on the Ethereum chain the contract code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it will only publish it once.</p>
<p>While deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.</p>
<p>All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: <em>The operator should know the code of the contract before it is deployed</em>. This means that deploying contracts is only possible by the means of <code v-pre>EIP712</code> transactions with the <code v-pre>factory_deps</code> field containing the supplied bytecode. More on EIP712 transactions <RouterLink to="/api/api.html#eip712">here</RouterLink>.</p>
<p>Summary:</p>
<ul>
<li>
<p><strong>How deploying contracts works on Ethereum.</strong>
To deploy a contract, a user sends a transaction to the zero address (<code v-pre>0x000...000</code>) with the <code v-pre>data</code> field of the transaction equal to the contract bytecode concatenated with the constructor parameters.</p>
</li>
<li>
<p><strong>How deploying contracts works on zkSync.</strong>
To deploy a contract, a user calls the <code v-pre>create</code> function of the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#contractdeployer">ContractDeployer</RouterLink> and provides the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the <code v-pre>factory_deps</code> field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the <code v-pre>factory_deps</code> as well.</p>
</li>
</ul>
<p>The <a href="../../../api/hardhat">hardhat-zksync-deploy</a> plugin takes care of the deployment process. Here's a <RouterLink to="/api/hardhat/getting-started.html">guide on how to use it</RouterLink>.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="solidity-vyper-support" tabindex="-1"><a class="header-anchor" href="#solidity-vyper-support" aria-hidden="true">#</a> Solidity/Vyper support</h2>
<p>Compiling Solidity to zkEVM bytecode requires a special compiler. For the time being Solidity <code v-pre>&gt;=0.4.10</code> versions are supported, though we strongly recommended using <code v-pre>^0.8.0</code> as the most stable one. Vyper <code v-pre>^0.3.3</code> is also supported.</p>
<p>Although, older versions of Solidity are supported, here are some of their limitations in zkSync:</p>
<ul>
<li>Contract-local recursion is not supported.</li>
<li>Internal function pointers are not supported.</li>
</ul>
<p>For smart contract compilation using Solidity or Vyper, <RouterLink to="/api/hardhat/plugins.html">check the correspondent Hardhat plugins here</RouterLink>.</p>
<p>Ethereum cryptographic primitives like <code v-pre>ecrecover</code>, <code v-pre>keccak256</code> and <code v-pre>sha256</code> are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compiler under the hood.</p>
<h2 id="differences-in-create-behaviour" tabindex="-1"><a class="header-anchor" href="#differences-in-create-behaviour" aria-hidden="true">#</a> Differences in <code v-pre>CREATE</code> behaviour</h2>
<p>For the ease of supporting account abstraction, for each account, we split the nonce into two parts: <em>the deployment nonce</em> and <em>the transaction nonce</em>. The deployment nonce is the number of contracts the account has deployed with <code v-pre>CREATE</code> opcode, while the transaction nonce is used for replay attack protection for the transactions.</p>
<p>This means that while for smart contracts the nonce on zkSync behaves the same way as on Ethereum, for EOAs calculating the address of the deployed contract is not as straightforward. On Ethereum, it can be safely calculated as <code v-pre>hash(RLP[address, nonce])</code>, while on zkSync it is recommended to wait until the contract is deployed and catch the event with the address of the newly deployed contract. All of this is done in the background by the SDK.
To gain a deterministic address, you should use <code v-pre>create2</code>. It is available for EOAs as well, but it is not available in the SDK yet.</p>
<h2 id="note-on-factory-deps" tabindex="-1"><a class="header-anchor" href="#note-on-factory-deps" aria-hidden="true">#</a> Note on <code v-pre>factory deps</code></h2>
<p>Under the hood, zkSync stores not bytecodes of contracts, but <a href="#format-of-bytecode-hash">specially formatted</a> hashes of their bytecodes. You can see that even the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#contractdeployer">ContractDeployer</RouterLink> system contract accepts the bytecode hash of the deployed contract and not its bytecode. However, for contract deployment to succeed, the operator needs to know the bytecode. Exactly for this reason the <code v-pre>factory_deps</code> (i.e. factory dependencies) field for transactions is used: it contains the bytecodes that should be known to the operator for this transaction to succeed. Once the transaction succeeds, these bytecodes will be published on L1 and will be considered &quot;known&quot; to the operator forever.</p>
<p>Some examples of usage are:
The obvious one is when you deploy a contract, you need to provide its code in the <code v-pre>factory_deps</code> field.</p>
<ul>
<li>On zkSync, factories (i.e. contracts that can deploy other contracts) do not store bytecodes of their dependencies, i.e. contracts that they can deploy. They only store their hashes. That's why you need to include <em>all</em> the bytecodes of the dependencies in the <code v-pre>factory_deps</code> field.</li>
</ul>
<p>Both of these examples are already seamlessly done under the hood by our <RouterLink to="/api/hardhat/getting-started.html">hardhat plugin</RouterLink>.</p>
<p>Note, that the factory deps do not necessarily have to be used by the transaction in any way. These are just markers that these bytecodes should be published on L1 with this transaction. If your contract contains a lot of various factory dependencies and they do not fit inside a single L1 block, you can split the list of factory dependencies between multiple transactions.</p>
<p>For example, let's say that you want to deploy contract <code v-pre>A</code> which can also deploy contracts <code v-pre>B</code> and <code v-pre>C</code>. This means that you will have three factory dependencies for your deployment transaction: <code v-pre>A</code>,<code v-pre>B</code> and <code v-pre>C</code>. If the pubdata required to publish all of them is too large to fit into one block, you can send a dummy transaction with only factory dependencies <code v-pre>A</code> and <code v-pre>B</code> (assuming their combined length is small enough) and do the actual deploy with a second transaction while providing the bytecode of contract <code v-pre>C</code> as a factory dependency for it. Note, that if some contract <em>on its own</em> is larger than the allowed limit per block, this contract has to be split into smaller ones.</p>
<h3 id="l1-l2-communication" tabindex="-1"><a class="header-anchor" href="#l1-l2-communication" aria-hidden="true">#</a> L1-&gt;L2 communication</h3>
<p>The <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IMailbox.sol#L78" target="_blank" rel="noopener noreferrer">interface<ExternalLinkIcon/></a> for submitting L1-&gt;L2 transactions accepts the list of all the factory dependencies required for this particular transaction. The logic for working with them is the same as for the L2 transactions. The only difference is that since the user has already published the full preimage for the bytecodes on L1, there is no need to publish these bytecodes again on L1.</p>
<h3 id="format-of-bytecode-hash" tabindex="-1"><a class="header-anchor" href="#format-of-bytecode-hash" aria-hidden="true">#</a> Format of bytecode hash</h3>
<p>Each zkEVM bytecode must adhere to the following format:</p>
<ul>
<li>Its length must be divisible by 32.</li>
<li>Its length in words (32-byte chunks) should be odd. In other words, <code v-pre>bytecodeLength % 64 == 32</code>.</li>
<li>It can not be longer than <code v-pre>2^16</code> 32-byte words, i.e. <code v-pre>2^21</code> bytes.</li>
</ul>
<p>The 32-byte hash of the bytecode of a zkSync contract is calculated in the following way:</p>
<ul>
<li>The first 2 bytes denote the version of bytecode hash format and are currently equal to <code v-pre>[1,0]</code>.</li>
<li>The second 2 bytes denote the length of the bytecode in 32-byte words.</li>
<li>The rest of the 28-byte (i.e. 28 low big-endian bytes) are equal to the last 28 bytes of the <code v-pre>sha256</code> hash of the contract's bytecode.</li>
</ul>
</div></template>


