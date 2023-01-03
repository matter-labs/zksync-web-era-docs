<template><div><h1 id="faq" tabindex="-1"><a class="header-anchor" href="#faq" aria-hidden="true">#</a> FAQ</h1>
<p>Here you will find some of the most common questions we receive about zkSync 2.0.</p>
<h2 id="what-is-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#what-is-zksync-2-0" aria-hidden="true">#</a> What is zkSync 2.0?</h2>
<p>zkSync 2.0 is a Zero Knowledge (ZK) rollup that supports generalized EVM compatibility for the Ethereum blockchain. The primary benefit of zkSync 2.0 is that developers who have created EVM dApps can port to zkSync 2.0 effortlessly and realize significantly lower gas fees and more transactions per second while inheriting Ethereum's security and decentralization.</p>
<h2 id="why-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#why-zksync-2-0" aria-hidden="true">#</a> Why zkSync 2.0?</h2>
<p>zkSync 2.0 is a gigantic leap forward in Layer 2 technologies. It is a long-awaited improvement that offers many never before enjoyed benefits for Ethereum developers.</p>
<ul>
<li><strong>EVM Compatible</strong> - zkSync is an EVM-compatible zero knowledge rollup that supports generalized EVM smart contracts. This means if you have EVM smart contracts it’s super easy to port your dApp to zkSync 2.0.</li>
<li><strong>Ethos Compatible</strong> - we are very aligned with the ethos of decentralization and open source. All of our code will strive to be fully open-source and zkSync will be executing a roadmap that will fully decentralize the sequencer and proof generation, and we will be executing a roadmap of organizational subtractive management - that is, we will be decentralizing our organization as well.</li>
<li><strong>Certainty</strong> - Unlike previous methods attempting to scale Ethereum which have in some cases offered weaker security guarantees than for L1 (e.g. sidechains, plasma, and optimistic) zkSync uses zero-knowledge proofs which offer <em>certainty</em> of security.</li>
<li><strong>Future Proof</strong> - Ecosystem projects that adopt zkSync 2.0 now will enjoy all future improvements without the need to change their code, in particular coming from:
<ol>
<li>The prover technology (hardware acceleration).</li>
<li>The compiler (integration of LLVM-enabled modern programming languages).</li>
<li>All innovations of zkSync 3.0 (Hyperchains and Hyperbridges).</li>
</ol>
</li>
</ul>
<h2 id="what-is-the-zkevm" tabindex="-1"><a class="header-anchor" href="#what-is-the-zkevm" aria-hidden="true">#</a> What is the zkEVM?</h2>
<p>zkEVM is the name of the architecture that enables zero-knowledge proof generation for the execution trace of smart contracts originally written for EVM.</p>
<p>Its architecture is based on the following components:</p>
<ul>
<li>zkVM, a Turing-complete RISC-like virtual machine optimized for proving in a ZKP circuit. It has several different implementations:
<ul>
<li>Executor: fast native execution on CPU.</li>
<li>Witness generator: native executor to generate ZKP witness.</li>
<li>Prover: the actual ZKP circuit implementation.</li>
</ul>
</li>
<li>LLVM-based compiler with:
<ul>
<li>Solidity frontend (more precisely: Yul frontend).</li>
<li>Vyper frontend.</li>
<li>zkVM backend.</li>
</ul>
</li>
<li>Special-purpose circuits (heavily relying on PLONK’s custom gates and lookup tables) as “precompiles” for computationally intensive operations, such as:
<ul>
<li>Non-algebraic hashes (Keccak, SHA256, Blake2).</li>
<li>Storage access (Merkle paths).</li>
<li>Elliptic curve pairing.</li>
</ul>
</li>
<li>Recursive aggregation circuit (combines the proofs from the above-mentioned parts).</li>
</ul>
<h3 id="zkevm-vs-evm" tabindex="-1"><a class="header-anchor" href="#zkevm-vs-evm" aria-hidden="true">#</a> zkEVM vs EVM</h3>
<p>Apart from the opcodes and gas metering disparity, zkVM strictly inherits the EVM programming model and its invariants, including the ABI calling conventions. One important thing to emphasize is that the zkVM supports rollbacks and provably revertible transactions. It guarantees mutual protection: users can not stall the network with bombardment by revertible transactions, and the escape hatch (priority queue) protect the user’s ability to include any transactions into the blocks.</p>
<p>As a result, developers can fully rely on the censorship-resistance provided by L1 without having to introduce any changes related to the escape-hatch mechanism. This means that assets in a zkRollup account on zkSync will have exactly the same security guarantees as on L1.</p>
<h3 id="evm-improvements" tabindex="-1"><a class="header-anchor" href="#evm-improvements" aria-hidden="true">#</a> EVM Improvements</h3>
<p>While maintaining maximum compatibility, the zkEVM has significant improvements over the EVM that increase adoption and benefit our ecosystem projects.</p>
<ul>
<li><strong>Our compiler is based on LLVM</strong>. LLVM-based compilers (Low-Level Virtual Machine) have become the default compiler for Mac OS X, iOS, FreeBSD, and Android systems and are among the most widely used because they:
<ul>
<li>Enable us to improve the efficiency over the original EVM bytecode because with LLVM we can take advantage of the many optimizations and tools available in this mature ecosystem.</li>
<li>Pave the way for us to add support for integrating codebases written in other programming languages with LLVM frontend. By doing so, developers can build dApps and use blockchains in ways that are currently not possible.</li>
</ul>
</li>
<li><strong>Account Abstraction is included in our zkEVM</strong>. This is a long-anticipated feature in the Ethereum dev community which improves developer adoption and user experience in a number of ways:
<ul>
<li>Native support for smart contracts wallets (like Argent), which is critical for onboarding mainstream users.</li>
<li>Much better UX for multisigs.</li>
<li>Transaction fees can be paid in any token using <RouterLink to="/dev/developer-guides/aa.html#paymasters">paymasters</RouterLink>.</li>
<li>Protocols can now subsidize gas for users from their smart contracts or even enable gasless transactions.</li>
<li>Transaction batches (multicall) can be confirmed in one click (big UX problem on Ethereum today).</li>
<li>Learn more about <RouterLink to="/dev/developer-guides/aa.html">account abstraction support in zkSync 2.0</RouterLink>.</li>
</ul>
</li>
</ul>
<h3 id="evm-compatibility" tabindex="-1"><a class="header-anchor" href="#evm-compatibility" aria-hidden="true">#</a> EVM Compatibility</h3>
<p>There is a lot of confusion amongst the community with regard to the impacts of being EVM Compatible versus EVM Equivalent. First, let’s define what is meant by the two.</p>
<ul>
<li><strong>EVM Equivalent</strong> means that a given protocol supports every opcode of Ethereum’s EVM down to the bytecode. Thus, any EVM smart contract works with 100% assurance out of the box.</li>
<li><strong>EVM Compatible</strong> means that a percentage of the opcodes of Ethereum’s EVM are supported; thus, a percentage of smart contracts work out of the box.</li>
</ul>
<p>zkSync is optimized to be EVM <em>compatible</em> not EVM <em>equivalent</em> for three primary reasons:</p>
<ol>
<li>Creating a generalized circuit for EVM equivalence down to the bytecode would be prohibitively expensive and time-consuming.</li>
<li>Building on what we learned with zkSync 1.0, we were able to design a system optimised for performance and provability in ZK.</li>
<li>The opcodes we’ve chosen NOT to support are deprecated by Ethereum itself, or rarely used. In the case a project needs them, modifications to work with zkSync are minimal and do not generate a need for a new security audit.</li>
</ol>
<p>Almost every smart contract written for EVM will be supported by zkSync 2.0 and will hold all key security invariants so that no additional security re-auditing will be required in most cases. A notable exception is the contracts that use the following EVM opcodes:</p>
<ul>
<li><code v-pre>SELFDESTRUCT</code> - (It’s considered harmful and there are calls to deactivate it on L1).</li>
<li><code v-pre>EXTCODECOPY</code> - (It can be implemented if needed, but we skip it for now because zkEVM opcodes are not identical to EVM ones anyway).</li>
<li><code v-pre>CALLCODE</code> - (deprecated on Ethereum in favor of <code v-pre>DELEGATECALL</code>).</li>
<li><code v-pre>CODECOPY</code> - (It does not return 0, but produces a compile error).</li>
</ul>
<p>There are a few other distinctions, for example, gas metering will be different (as is the case for other L2s as well). Some EVM’s cryptographic precompiles (notably pairings and RSA) won’t be available in the very first release but will be implemented soon after the launch, with pairing being a priority to allow both Hyperchains and protocols like Aztec/Dark Forest to be deployed without modifications too.</p>
<h2 id="security-expectations" tabindex="-1"><a class="header-anchor" href="#security-expectations" aria-hidden="true">#</a> Security expectations</h2>
<p>zkSync 2.0’s data availability layer is Ethereum. All ecosystem projects that build on zkSync 2.0 will inherit the full security benefits of Ethereum.</p>
<p>This is obviously a critically important topic for us, and we’re currently in the midst of a major review of zkSync 2.0’s security (including external audits, security contests, and overhauling and extending our bug bounty program).</p>
<p>We’ll be expanding on the details here substantially very soon.</p>
<h3 id="triggering-security-audits" tabindex="-1"><a class="header-anchor" href="#triggering-security-audits" aria-hidden="true">#</a> Triggering Security audits</h3>
<p>While there are a few, rarely used opcodes that we do not support, we have not found any instances with our ecosystem projects where a breaking change was anything other than a simple refactoring of a few lines of code. None of our ecosystem projects who have ported to zkSync have reported that any change has caused a need for a security audit.</p>
<h2 id="what-is-account-abstraction" tabindex="-1"><a class="header-anchor" href="#what-is-account-abstraction" aria-hidden="true">#</a> What is Account Abstraction?</h2>
<p>At a very high level, Account Abstraction allows us to make authorizations <em>programmable</em>, enabling a greater diversity of wallet and protocol design with use cases including:</p>
<ul>
<li>The implementation of smart contract wallets that improve the user experience of private key storage and recovery (eg. <a href="https://vitalik.ca/general/2021/01/11/recovery.html" target="_blank" rel="noopener noreferrer">social recovery<ExternalLinkIcon/></a>, multisig).</li>
<li>The ability to natively pay gas fees in tokens other than ETH.</li>
<li>The ability for accounts to change public and private keys.</li>
<li>The addition of non-cryptographic modifications, where users can require transactions to have expiry times, confirm slightly out-of-order, and more.</li>
<li>Diversity in signature verification systems from the current ECDSA, including post-quantum safe signature algorithms (eg. Lamport, Winternitz).</li>
</ul>
<p>In other words, Account Abstraction brings about major improvements to the overall user experience, and expands the application design space for developers. Learn more in <a href="https://www.argent.xyz/blog/wtf-is-account-abstraction/" target="_blank" rel="noopener noreferrer">this blog post<ExternalLinkIcon/></a> by Argent.</p>
<p>In zkSync 2.0 Account Abstraction is natively implemented, meaning accounts can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract.</p>
<p>If you want to better understand what Account Abstraction on zkSync looks like, you can read <RouterLink to="/dev/developer-guides/aa.html">this section of the docs</RouterLink>, or try out our tutorial <RouterLink to="/dev/tutorials/custom-aa-tutorial.html">here</RouterLink>.</p>
<h2 id="zksync-2-0-vs-alternatives" tabindex="-1"><a class="header-anchor" href="#zksync-2-0-vs-alternatives" aria-hidden="true">#</a> zkSync 2.0 vs Alternatives</h2>
<h3 id="zksync-2-0-vs-optimistic-rollups" tabindex="-1"><a class="header-anchor" href="#zksync-2-0-vs-optimistic-rollups" aria-hidden="true">#</a> <strong>zkSync 2.0 vs Optimistic Rollups</strong></h3>
<p>Optimistic rollups like Arbitrum and Optimism utilize the optimistic approach to secure their networks. At the time of their development, they represented an important incremental improvement over other available options. However, a widely held opinion (<a href="https://coinculture.com/au/people/vitalik-buterin-zk-rollups-to-outperform-optimistic-rollups/" target="_blank" rel="noopener noreferrer">including Vitalik Buterin's<ExternalLinkIcon/></a>) is that optimistic methods represent yet another temporary solution and in the long run the only permanent and truly scalable solution will be blockchains based on Zero-Knowledge proofs.</p>
<p>Optimistic rollups suffer from the following key issues:</p>
<ul>
<li><strong>Optimistic rollups are secured via game theory.</strong> This method assumes all transactions are valid and then utilizes an after-the-fact game theory mechanism to pay participants to discover fraudulent or otherwise invalid (e.g. because of bugs) transactions. Game theory is never perfect and as with the game theory that broke with stablecoins and other systems, we just don’t think it can be relied on in the long term and at true scale to offer the security the ecosystem needs. <em>zkSync 2.0, on the other hand, relies on math, not game theory, to provide the absolute certainty of proof that every single transaction is provably valid and not fraudulent.</em></li>
<li><strong>Optimistic methods take 7 days to settle</strong>. Settlement time is becoming an increasingly important feature for ecosystem projects. As ecosystem projects’ needs mature, the need for as close to instant settlement will rise. With optimistic methods, this settlement problem will not go away. It's always going to be a 7-day settlement time because optimistic methods need 7 days for their after-the-fact game theory to conclude its challenge window. The only way around this is to bring in third parties that provide some liquidity - but then again this is a potential security risk in trusting the liquidity providers. <em>When zkSync 2.0 initially launches on Mainnet, it will provide settlement in hours but we are targeting  settlement within minutes after months of work - and as we improve settlement times to near zero - no partner needs to change any code</em>.</li>
<li><strong>Optimistic rollups have no method of scaling beyond where they are now.</strong> When optimistic methods first came out, they became popular because they scaled Ethereum (e.g. they enabled the processing of 10x Ethereum transactions <em>without degradation of security and decentralization</em>). The problem is that while they can scale Ethereum by 10x now, they have no mechanism to go beyond 10x without degrading security and decentralization. <em>In contrast, zkSync 2.0 is based on zero-knowledge proofs which have important characteristics that optimistic methods do not - they can hyperscale.</em></li>
</ul>
<h3 id="zksync-2-0-vs-other-zkrollups" tabindex="-1"><a class="header-anchor" href="#zksync-2-0-vs-other-zkrollups" aria-hidden="true">#</a> zkSync 2.0 vs other zkRollups</h3>
<p>While all zero knowledge rollup blockchains share the underlying technology of cryptographic proofs, there are many important differences.</p>
<p><strong>zkSync versus Starkware.</strong> When you compare zkSync to Starkware, mostly what you see is two divergent strategies whereby zkSync optimizes for being compatible with the Ethereum ecosystem, technology, and ethos, whereby Starkware optimizes for theoretical performance benefits at the cost of compatibility.</p>
<ul>
<li><strong>EVM.</strong> zkSync is EVM compatible VS Starknet is NOT EVM compatible.</li>
<li><strong>Toolchain</strong>. zkSync is toolchain compatible VS Starknet is NOT and requires people to learn a whole new toolchain centered around a custom language called Cairo.</li>
<li><strong>Ecosystem</strong>. zkSync’s ecosystem naturally works with all of the toolsets of the Ethereum ecosystem VS Starkware is attempting to bootstrap an entirely new ecosystem with all new tools.</li>
<li><strong>Decentralization</strong>. zkSync embraces decentralization, both at the technology level and the organizational level VS Starknet does NOT embrace decentralization.</li>
<li><strong>Open-source.</strong> zkSync is fully open-source VS Starkware is NOT open-source.</li>
</ul>
<h2 id="which-wallets-are-supported" tabindex="-1"><a class="header-anchor" href="#which-wallets-are-supported" aria-hidden="true">#</a> Which Wallets are supported?</h2>
<p>At the moment, we support any Ethereum-based wallet. By default, the provided option on zkSync 2.0 portal is Metamask - besides connecting automatically, you can add zkSync network to your Metamask manually:</p>
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
<h2 id="how-do-i-request-funds-for-testnet" tabindex="-1"><a class="header-anchor" href="#how-do-i-request-funds-for-testnet" aria-hidden="true">#</a> How do I Request Funds for Testnet?</h2>
<p>To access the testnet funds you can use (<a href="https://portal.zksync.io/faucet" target="_blank" rel="noopener noreferrer">Faucet<ExternalLinkIcon/></a>) by tweeting about us and get some tokens. Make sure that Twitter message contains your Ethereum address to which we’ll send funds and that it’s not your main Ethereum account. The faucet will not work with new Twitter accounts &amp; accounts without avatar.</p>
<p>Alternatively, you can use <a href="https://portal.zksync.io/bridge" target="_blank" rel="noopener noreferrer">our bridge<ExternalLinkIcon/></a> to bridge ETH from Goerli to zkSync alpha testnet.</p>
<h2 id="how-long-does-it-take-to-complete-a-deposit-transaction" tabindex="-1"><a class="header-anchor" href="#how-long-does-it-take-to-complete-a-deposit-transaction" aria-hidden="true">#</a> How long does it take to complete a deposit transaction?</h2>
<p>The transactions on zkSync 2.0 should not take more than 5 minutes.</p>
<h2 id="where-can-i-see-the-transactions-i-submitted" tabindex="-1"><a class="header-anchor" href="#where-can-i-see-the-transactions-i-submitted" aria-hidden="true">#</a> Where can I see the transactions I submitted?</h2>
<p>Our <a href="https://explorer.zksync.io" target="_blank" rel="noopener noreferrer">Block Explorer<ExternalLinkIcon/></a> will show everything you may need about a transaction.</p>
<h2 id="can-someone-claim-the-address-i-have-for-my-contract-in-other-evm-networks-in-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#can-someone-claim-the-address-i-have-for-my-contract-in-other-evm-networks-in-zksync-2-0" aria-hidden="true">#</a> Can someone claim the address I have for my contract in other EVM networks in zkSync 2.0?</h2>
<p>The contract address derivation formula is different from the regular EVM approach. Even if a contract is deployed from the same account address with the same nonce, the zkSync v2 contract address will not be the same as it is in another EVM network. This means, for example, that no one will be able to claim an existing Ethereum address of your protocol to try to trick users into interacting with a malicious version of it.</p>
<p>So the hack like we saw with Wintermute on Optimism is not possible</p>
<h2 id="what-is-the-storage-limit-for-smart-contract-on-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#what-is-the-storage-limit-for-smart-contract-on-zksync-2-0" aria-hidden="true">#</a> What is the storage limit for smart contract on zkSync 2.0?</h2>
<p>The current limit is 3600000000 ergs.</p>
<h2 id="what-is-block-gas-limit-on-zksync-2-0" tabindex="-1"><a class="header-anchor" href="#what-is-block-gas-limit-on-zksync-2-0" aria-hidden="true">#</a> What is Block Gas Limit on zkSync 2.0?</h2>
<p>The current value is currently set at roughly 2^32 gas. <br>
<strong>Note</strong>: This value is temporal and will be updated soon.</p>
<h2 id="can-i-withdraw-my-funds-back-to-ethereum" tabindex="-1"><a class="header-anchor" href="#can-i-withdraw-my-funds-back-to-ethereum" aria-hidden="true">#</a> Can I withdraw my funds back to Ethereum?</h2>
<p>Yes, the bridge is two-way. You can withdraw your funds back to Ethereum. The withdrawal transaction will take up to 1 hour, depending on the usage of the zkSync network.</p>
<h2 id="interacting-a-step-by-step-guide" tabindex="-1"><a class="header-anchor" href="#interacting-a-step-by-step-guide" aria-hidden="true">#</a> Interacting - A step-by-step Guide</h2>
<p>As the testnet is running on Goerli network, you will need to get some Goerli ETH first. Try any of the faucets below.</p>
<ul>
<li><a href="https://goerli-faucet.mudit.blog/" target="_blank" rel="noopener noreferrer">https://goerli-faucet.mudit.blog/<ExternalLinkIcon/></a></li>
<li><a href="https://faucets.chain.link/goerli" target="_blank" rel="noopener noreferrer">https://faucets.chain.link/goerli<ExternalLinkIcon/></a></li>
<li><a href="https://goerli-faucet.slock.it/" target="_blank" rel="noopener noreferrer">https://goerli-faucet.slock.it/<ExternalLinkIcon/></a></li>
<li><a href="https://goerlifaucet.com/" target="_blank" rel="noopener noreferrer">https://goerlifaucet.com/<ExternalLinkIcon/></a></li>
</ul>
<p><strong>Step 1</strong></p>
<p>Head to <a href="https://portal.zksync.io/" target="_blank" rel="noopener noreferrer">https://portal.zksync.io/<ExternalLinkIcon/></a> and connect your wallet. You will automatically be asked to add the “zkSync 2.0 testnet Goerli” network.</p>
<p>You may also add the network manually to your metamask.</p>
<ul>
<li>Network Name: <code v-pre>zkSync alpha testnet</code></li>
<li>RPC URL: <code v-pre>https://zksync2-testnet.zksync.dev</code></li>
<li>Chain ID: <code v-pre>280</code></li>
</ul>
<p><strong>Step 2 (Skip if you don’t have Goerli ETH)</strong></p>
<p>We first go to “Bridge” then “Deposit” to deposit some $ETH to zkSync 2.0.</p>
<figure><img src="@source/assets/images/faq-1.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>
<p><strong>Step 3</strong></p>
<p>Next we go to “Faucet” to get some testnet $ETH, $LINK, $DAI, $WBTC and $USDC into our zkSync address.</p>
<figure><img src="@source/assets/images/faq-2.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>
<p>Check your balance at “Balances” after claiming.</p>
<figure><img src="@source/assets/images/faq-3.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>
<p><strong>Step 4</strong></p>
<p>Now go to “Transfer”. Input the address of another wallet and transfer some tokens to it. Pay the fees in DAI if you don’t have ETH.</p>
<figure><img src="@source/assets/images/faq-4.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>
<p><strong>Step 5</strong></p>
<p>At last we go to “Withdraw” to withdraw some $DAI from zkSync back to Goerli. Pay the fees in DAI if you don’t have ETH.</p>
<figure><img src="@source/assets/images/faq-5.png" alt="image" tabindex="0" loading="lazy"><figcaption>image</figcaption></figure>
<h2 id="what-is-a-testnet-regenesis" tabindex="-1"><a class="header-anchor" href="#what-is-a-testnet-regenesis" aria-hidden="true">#</a> What is a testnet ReGenesis?</h2>
<p>Sometimes, the team working on zkSync will initiate a regenesis on testnet - a restart of the blockchain which will introduce upgrades and return the state to the initial point. This won't happen on mainnet, and it is unlikely to happen on testnet after mainnet launch.</p>
</div></template>


