<template><div><h1 id="security-model" tabindex="-1"><a class="header-anchor" href="#security-model" aria-hidden="true">#</a> Security model</h1>
<p>Given that zkSync is still in its early stages of development, there is a chance that our codebase contains undiscovered bugs that could lead to the loss of users' assets. As a result, we are constantly working to strengthen our security protocols to ensure that users and developers have a seamless onboarding experience when building on zkSync.
zkSync smart contract codebase is currently being audited, but audits are not a guarantee of quality, and they are not a guarantee that a codebase has been thoroughly vetted for vulnerabilities. It's crucial to realize that zkSync usage exposes you to the possibility of defects in the zkSync codebase.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="bug-bounty-program" tabindex="-1"><a class="header-anchor" href="#bug-bounty-program" aria-hidden="true">#</a> Bug Bounty Program</h2>
<p>zkSync takes security seriously and as such, we have a massive <a href="https://immunefi.com/bounty/zksync/" target="_blank" rel="noopener noreferrer">bug bounty program<ExternalLinkIcon/></a>.</p>
<h2 id="scope" tabindex="-1"><a class="header-anchor" href="#scope" aria-hidden="true">#</a> Scope</h2>
<p>Issues that can lead to substantial loss of money, critical bugs like a broken liveness condition, blocking upgrade system, irreversible loss of funds, or enforced exodus mode.</p>
<h2 id="assumptions" tabindex="-1"><a class="header-anchor" href="#assumptions" aria-hidden="true">#</a> Assumptions</h2>
<p>To be eligible for the bug bounty, a bug should adhere to the security assumptions of zkSync.</p>
<h3 id="cryptography-assumptions" tabindex="-1"><a class="header-anchor" href="#cryptography-assumptions" aria-hidden="true">#</a> Cryptography assumptions:</h3>
<ul>
<li>DLP is unbroken.</li>
<li>Rescue hash and sha256 are collision-resistant.</li>
<li>ZKP scheme used in the construction is secure (subject to a separate formal proof).</li>
</ul>
<h3 id="l1-blockchain-assumptions" tabindex="-1"><a class="header-anchor" href="#l1-blockchain-assumptions" aria-hidden="true">#</a> L1 blockchain assumptions:</h3>
<ul>
<li>L1 protocol is secure.</li>
<li>L1 is eventually censorship-resistant: a sufficiently highly priced L1 tx will be mined in a block within finite time.</li>
<li>Owners have access to the full L1 archive (can at any time retrieve all block bodies of the L1 chain).</li>
</ul>
<h3 id="operational-assumptions" tabindex="-1"><a class="header-anchor" href="#operational-assumptions" aria-hidden="true">#</a> Operational assumptions:</h3>
<ul>
<li>Rollup key is controlled by the owner and not compromised at all times.</li>
</ul>
<h2 id="disclosure-policy" tabindex="-1"><a class="header-anchor" href="#disclosure-policy" aria-hidden="true">#</a> Disclosure Policy</h2>
<p>Let us know as soon as possible upon discovery of a potential security issue.
Provide us with a reasonable amount of time to resolve the issue before any disclosure to the public or a third party.</p>
<h3 id="the-wrong-way-to-disclose" tabindex="-1"><a class="header-anchor" href="#the-wrong-way-to-disclose" aria-hidden="true">#</a> The wrong way to disclose</h3>
<p>The following actions will make you ineligible for the bug bounty program:</p>
<ul>
<li>Filing a public issue about the vulnerability</li>
<li>Testing the vulnerability on mainnet or testnet</li>
</ul>
<h2 id="the-right-way-to-disclose" tabindex="-1"><a class="header-anchor" href="#the-right-way-to-disclose" aria-hidden="true">#</a> The right way to disclose</h2>
<p>Please email us at <a href="mailto:security@zksync.io">security@zksync.io</a>. We appreciate detailed information about confirming or fixing the vulnerability. If possible, please use the PGP key below to encrypt the message.</p>
<h2 id="exclusions" tabindex="-1"><a class="header-anchor" href="#exclusions" aria-hidden="true">#</a> Exclusions</h2>
<ul>
<li>Already known vulnerabilities.</li>
<li>Vulnerabilities in code not leading to funds lost or frozen.</li>
<li>Vulnerabilities not related to smart contracts or cryptography used by the protocol.</li>
</ul>
<h2 id="eligibility" tabindex="-1"><a class="header-anchor" href="#eligibility" aria-hidden="true">#</a> Eligibility</h2>
<ul>
<li>You must be the first reporter of the vulnerability</li>
<li>You must be able to verify a signature from the same address</li>
<li>Provide enough information about the vulnerability</li>
</ul>
</div></template>


