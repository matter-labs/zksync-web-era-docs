<template><div><h1 id="system-contracts" tabindex="-1"><a class="header-anchor" href="#system-contracts" aria-hidden="true">#</a> System contracts</h1>
<p>To keep the zero-knowledge circuits as simple as possible and enable simple extensions, a large chunk of the logic of zkSync was moved to the so-called &quot;system contracts&quot; – a
set of contracts that have special privileges and serve special purposes, e.g. deployment of contracts, making sure that the user pays only once for publishing contracts' calldata, etc.</p>
<p>The code for the system contracts will not be public until it has gone through thorough testing. This section will only provide you with the
knowledge needed to build on zkSync.</p>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="interfaces" tabindex="-1"><a class="header-anchor" href="#interfaces" aria-hidden="true">#</a> Interfaces</h2>
<p>The addresses and the interfaces of the system contracts can be found <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>.</p>
<p>This section will describe the semantic meaning of some of the most popular system contracts.</p>
<h2 id="contractdeployer" tabindex="-1"><a class="header-anchor" href="#contractdeployer" aria-hidden="true">#</a> ContractDeployer</h2>
<p><a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IContractDeployer.sol#L5" target="_blank" rel="noopener noreferrer">Interface<ExternalLinkIcon/></a></p>
<p>This contract is used to deploy new smart contracts. Its job is to make sure that the bytecode for each deployed contract is known. This contract also defines the derivation
address. Whenever a contract is deployed, it emits the <code v-pre>ContractDeployed</code> event.</p>
<p>In the future, we will add a description of how to interact directly with this contract.</p>
<h2 id="il1messenger" tabindex="-1"><a class="header-anchor" href="#il1messenger" aria-hidden="true">#</a> IL1Messenger</h2>
<p><a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IL1Messenger.sol#L5" target="_blank" rel="noopener noreferrer">Interface<ExternalLinkIcon/></a></p>
<p>This contract is used to send messages from zkSync to Ethereum. For each message sent, the <code v-pre>L1MessageSent</code> event is emitted.</p>
<h2 id="inonceholder" tabindex="-1"><a class="header-anchor" href="#inonceholder" aria-hidden="true">#</a> INonceHolder</h2>
<p><a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L13" target="_blank" rel="noopener noreferrer">Interface<ExternalLinkIcon/></a></p>
<p>This contract stores account nonces. The account nonces are stored in a single place for efficiency (<RouterLink to="/dev/developer-guides/contracts/contracts.html#differences-in-create-behaviour">the tx nonce and the deployment nonce</RouterLink> are stored in a single place) and also for the ease of the operator.</p>
<h2 id="bootloader" tabindex="-1"><a class="header-anchor" href="#bootloader" aria-hidden="true">#</a> Bootloader</h2>
<p>For greater extensibility and to lower the overhead, some parts of the protocol (e.g. account abstraction rules) were moved to an ephemeral contract called a <em>bootloader</em>. We call it ephemeral since formally it is never deployed and can not be called, but it has a formal <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol#L26" target="_blank" rel="noopener noreferrer">address<ExternalLinkIcon/></a> that is used on <code v-pre>msg.sender</code>, when it calls other contracts.</p>
<p>For now, you do not have to know any details about it, but knowing that it exists is important when you develop using the account abstraction feature. You can always assume that the bootloader is not malicious and it is a part of the protocol. In the future, the code of the bootloader will be made public and any changes to it will also mean an upgrade to the protocol.</p>
<h2 id="protected-access-to-some-of-the-system-contracts" tabindex="-1"><a class="header-anchor" href="#protected-access-to-some-of-the-system-contracts" aria-hidden="true">#</a> Protected access to some of the system contracts</h2>
<p>Some of the system contracts have an impact on the account that may not be expected on Ethereum. For instance, on Ethereum the only way an EOA could increase its nonce is by sending a transaction. Also, sending a transaction could only increase nonce by 1 at a time. On zkSync nonces are implemented via the <a href="#inonceholder">NonceHolder</a> system contract and, if naively implemented, the users could be allowed to increment their nonces by calling this contract. That's why the calls to most of the non-view methods of the nonce holder were restricted to be called only with a special <code v-pre>isSystem</code> flag, so that interactions with important system contracts could be consciously managed by the developer of the account.</p>
<p>The same applies to the <a href="#contractdeployer">ContractDeployer</a> system contract. This means that, for instance, you would need to explicitly allow your users to deploy contracts, as it is done in the DefaultAccount's <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L126" target="_blank" rel="noopener noreferrer">implementation<ExternalLinkIcon/></a>.</p>
</div></template>


