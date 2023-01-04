<template><div><h1 id="account-abstraction-support" tabindex="-1"><a class="header-anchor" href="#account-abstraction-support" aria-hidden="true">#</a> Account abstraction support</h1>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>On Ethereum there are two types of accounts: <a href="https://ethereum.org/en/developers/docs/accounts/#externally-owned-accounts-and-key-pairs" target="_blank" rel="noopener noreferrer">externally owned accounts (EOAs)<ExternalLinkIcon/></a> and <a href="https://ethereum.org/en/developers/docs/accounts/#contract-accounts" target="_blank" rel="noopener noreferrer">contracts accounts<ExternalLinkIcon/></a>.
The former type is the only one that can initiate transactions,
while the latter is the only one that can implement arbitrary logic. For some use-cases, like smart-contract wallets or privacy protocols, this difference can create a lot of friction.
As a result, such applications require L1 relayers, e.g. an EOA to help facilitate transactions from a smart-contract wallet.</p>
<p>Accounts in zkSync 2.0 can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract. This feature is called &quot;account
abstraction&quot; and it aims to resolve the issues described above.</p>
<div class="hint-container warning">
<p class="hint-container-title">Unstable feature</p>
<p>This is the test release of account abstraction (AA) on zkSync 2.0. We are very happy to hear your feedback! Please note: <strong>breaking changes to the API/interfaces required for AA should be anticipated.</strong></p>
<p>zkSync 2.0 is one of the first EVM-compatible chains to adopt AA, so this testnet is also used to see how &quot;classical&quot; projects from EVM chains can coexist with the account abstraction feature.</p>
</div>
<h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<p>To better understand this page, we recommend you take some time to first read a guide on <a href="https://ethereum.org/en/developers/docs/accounts/" target="_blank" rel="noopener noreferrer">accounts<ExternalLinkIcon/></a>.</p>
<h2 id="design" tabindex="-1"><a class="header-anchor" href="#design" aria-hidden="true">#</a> Design</h2>
<p>The account abstraction protocol on zkSync is very similar to <a href="https://eips.ethereum.org/EIPS/eip-4337" target="_blank" rel="noopener noreferrer">EIP4337<ExternalLinkIcon/></a>, though our protocol is still different for the sake of efficiency and better UX.</p>
<h3 id="keeping-nonces-unique" tabindex="-1"><a class="header-anchor" href="#keeping-nonces-unique" aria-hidden="true">#</a> Keeping nonces unique</h3>
<div class="hint-container warning">
<p class="hint-container-title">Changes are expected</p>
<p>The current model has some important drawbacks: it does not allow custom wallets to send multiple transactions at the same time, while keeping a deterministic ordering. For
EOAs the nonces are expected to be sequentially growing, while for the custom accounts the order of transactions can not be determined for sure.</p>
<p>In the future, we plan to switch to a model where the accounts could choose whether they would want to have sequential nonce ordering (the same as EOA) or they want to have arbitrary ordering.</p>
</div>
<p>One of the important invariants of every blockchain is that each transaction has a unique hash. Holding this property with an arbitrary account abstraction is not trivial,
though accounts can, in general, accept multiple identical transactions. Even though these transactions would be technically valid by the rules of the blockchain, violating
hash uniqueness would be very hard for indexers and other tools to process.</p>
<p>There needs to be a solution on the protocol level that is both cheap for users and robust in case of a malicious operator. One of the easiest ways to ensure that transaction hashes do not repeat is to have a pair (sender, nonce) always unique.</p>
<p>The following protocol is used:</p>
<ul>
<li>Before each transaction starts, the system queries the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#inonceholder">NonceHolder</RouterLink> to check whether the provided nonce has already been used or not.</li>
<li>If the nonce has not been used yet, the transaction validation is run. The provided nonce is expected to be marked as &quot;used&quot; during this time.</li>
<li>After the validation, the system checks whether this nonce is now marked as used.</li>
</ul>
<p>Users will be allowed to use any 256-bit number as nonce and they can put any non-zero value under the corresponding key in the system contract. This is already supported by
the protocol, but not on the server side.</p>
<p>More documentation on various interactions with the <code v-pre>NonceHolder</code> system contract as well as tutorials will be available once support on the server side is released. For now,
it is recommended to only use the <code v-pre>incrementNonceIfEquals</code> method, which practically enforces the sequential ordering of nonces.</p>
<h3 id="standardizing-transaction-hashes" tabindex="-1"><a class="header-anchor" href="#standardizing-transaction-hashes" aria-hidden="true">#</a> Standardizing transaction hashes</h3>
<p>In the future, it is planned to support efficient proofs of transaction inclusion on zkSync. This would require us to calculate the transaction's hash in the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#bootloader">bootloader</RouterLink>. Since these calculations won't be free to the user, it is only fair to include the transaction's hash in the interface of the AA
methods (in case the accounts may need this value for some reason). That's why all the methods of the <code v-pre>IAccount</code> and <code v-pre>IPaymaster</code> interfaces, which are described below,
contain the hash of the transaction as well as the recommended signed digest (the digest that is signed by EOAs for this transaction).</p>
<h3 id="iaccount-interface" tabindex="-1"><a class="header-anchor" href="#iaccount-interface" aria-hidden="true">#</a> IAccount interface</h3>
<p>Each account is recommended to implement the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IAccount.sol" target="_blank" rel="noopener noreferrer">IAccount<ExternalLinkIcon/></a> interface. It contains the following five methods:</p>
<ul>
<li><code v-pre>validateTransaction</code> is mandatory and will be used by the system to determine if the AA logic agrees to proceed with the transaction. In case the transaction is not accepted (e.g. the signature is wrong) the method should revert. In case the call to this method succeedes, the implemented account logic is considered to accept the transaction, and the system will proceed with the transaction flow.</li>
<li><code v-pre>executeTransaction</code> is mandatory and will be called by the system after the fee is charged from the user. This function should perform the execution of the transaction.</li>
<li><code v-pre>payForTransaction</code> is optional and will be called by the system if the transaction has no paymaster, i.e. the account is willing to pay for the transaction. This method should be used to pay for the fees by the account. Note, that if your account will never pay any fees and will always rely on the <a href="#paymasters">paymaster</a> feature, you don't have to implement this method. This method must send at least <code v-pre>tx.gasprice * tx.ergsLimit</code> ETH to the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#bootloader">bootloader</RouterLink> address.</li>
<li><code v-pre>prePaymaster</code> is optional and will be called by the system if the transaction has a paymaster, i.e. there is a different address that pays the transaction fees for the user. This method should be used to prepare for the interaction with the paymaster. One of the notable <a href="#approval-based-paymaster-flow">examples</a> where it can be helpful is to approve the ERC-20 tokens for the paymaster.</li>
<li><code v-pre>executeTransactionFromOutside</code>, technically, is not mandatory, but it is <em>highly encouraged</em>, since there needs to be some way, in case of priority mode (e.g. if the operator is unresponsive), to be able to start transactions from your account from ``outside'' (basically this is the fallback to the standard Ethereum approach, where an EOA starts transaction from your smart contract).</li>
</ul>
<h3 id="ipaymaster-interface" tabindex="-1"><a class="header-anchor" href="#ipaymaster-interface" aria-hidden="true">#</a> IPaymaster interface</h3>
<p>Like in EIP4337, our account abstraction protocol supports paymasters: accounts that can compensate for other accounts' transactions execution. You can read more about them
<a href="#paymasters">here</a>.</p>
<p>Each paymaster should implement the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IPaymaster.sol" target="_blank" rel="noopener noreferrer">IPaymaster<ExternalLinkIcon/></a> interface. It contains the following two methods:</p>
<ul>
<li><code v-pre>validateAndPayForPaymasterTransaction</code> is mandatory and will be used by the system to determine if the paymaster approves paying for this transaction. If the paymaster is willing to pay for the transaction, this method must send at least <code v-pre>tx.gasprice * tx.ergsLimit</code> to the operator. It should return the <code v-pre>context</code> that will be one of the call parameters to the <code v-pre>postOp</code> method.</li>
<li><code v-pre>postOp</code> is optional and will be called after the transaction has been executed. Note that unlike EIP4337, there <em>is no guarantee that this method will be called</em>. In particular, this method won't be called if the transaction has failed with <code v-pre>out of gas</code> error. It takes four parameters: the context returned by the <code v-pre>validateAndPayForPaymasterTransaction</code> method, the transaction itself, whether the execution of the transaction succeeded, and also the maximum amount of ergs the paymaster might be refunded with. More documentation on refunds will be available once their support is added to zkSync.</li>
</ul>
<h3 id="reserved-fields-of-the-transaction-struct-with-special-meaning" tabindex="-1"><a class="header-anchor" href="#reserved-fields-of-the-transaction-struct-with-special-meaning" aria-hidden="true">#</a> Reserved fields of the <code v-pre>Transaction</code> struct with special meaning</h3>
<p>Note that each of the methods above accept the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/TransactionHelper.sol#L15" target="_blank" rel="noopener noreferrer">Transaction<ExternalLinkIcon/></a> struct.
While some of its fields are self-explanatory, there are also 6 <code v-pre>reserved</code> fields, the meaning of each is defined by the transaction's type. We decided to not give these fields names, since they might be unneeded in some future transaction types. For now, the convention is:</p>
<ul>
<li><code v-pre>reserved[0]</code> is the nonce.</li>
<li><code v-pre>reserved[1]</code> is <code v-pre>msg.value</code> that should be passed with the transaction.</li>
</ul>
<h3 id="the-transaction-flow" tabindex="-1"><a class="header-anchor" href="#the-transaction-flow" aria-hidden="true">#</a> The transaction flow</h3>
<p>Each transaction goes through the following flow:</p>
<h4 id="the-validation-step" tabindex="-1"><a class="header-anchor" href="#the-validation-step" aria-hidden="true">#</a> The validation step</h4>
<p>During the validation step, the account should decide whether it accepts the transaction and if so, pay the fees for it. If any part of the validation fails, the account is not charged a fee, and such transaction can not be included in a block.</p>
<p><strong>Step 1.</strong> The system checks that the nonce of the transaction has not been used before. You can read more about preserving the nonce uniqueness <a href="#keeping-nonces-unique">here</a>.</p>
<p><strong>Step 2.</strong> The system calls the <code v-pre>validateTransaction</code> method of the account. If it does not revert, proceed to the next step.</p>
<p><strong>Step 3.</strong> The system checks that the nonce of the transaction has been marked as used.</p>
<p><strong>Step 4 (no paymaster).</strong> The system calls the <code v-pre>payForTransaction</code> method of the account. If it does not revert, proceed to the next step.</p>
<p><strong>Step 4 (paymaster).</strong> The system calls the <code v-pre>prePaymaster</code> method of the sender. If this call does not revert, then the <code v-pre>validateAndPayForPaymasterTransaction</code> method of the paymaster is called. If it does not revert too, proceed to the next step.</p>
<p><strong>Step 5.</strong> The system verifies that the bootloader has received at least <code v-pre>tx.ergsPrice * tx.ergsLimit</code> ETH to the bootloader. If it is the case, the verification is considered
complete and we can proceed to the next step.</p>
<h4 id="the-execution-step" tabindex="-1"><a class="header-anchor" href="#the-execution-step" aria-hidden="true">#</a> The execution step</h4>
<p>The execution step is considered responsible for the actual execution of the transaction and sending the refunds for any unused ergs back to the user. If there is any revert on this step, the transaction is still considered valid and will be included in the block.</p>
<p><strong>Step 6.</strong> The system calls the <code v-pre>executeTransaction</code> method of the account.</p>
<p><strong>Step 7. (only in case the transaction has a paymaster)</strong> The <code v-pre>postOp</code> method of the paymaster is called. This step should typically be used for refunding the sender the
unused ergs in case the paymaster was used to facilitate paying fees in ERC-20 tokens.</p>
<h3 id="fees" tabindex="-1"><a class="header-anchor" href="#fees" aria-hidden="true">#</a> Fees</h3>
<p>In EIP4337 you can see three types of gas limits: <code v-pre>verificationGas</code>, <code v-pre>executionGas</code>, <code v-pre>preVerificationGas</code>, that describe the gas limit for the different steps of the transaction inclusion in a block.
zkSync 2 has only a single field, <code v-pre>ergsLimit</code>, that covers the fee for all three. When submitting a transaction, make sure that <code v-pre>ergsLimit</code> is enough to cover verification,
paying the fee (the ERC20 transfer mentioned above), and the actual execution itself.</p>
<p>By default, calling <code v-pre>estimateGas</code> adds a constant to cover charging the fee and the signature verification for EOA accounts.</p>
<h2 id="using-the-systemcontractscaller-library" tabindex="-1"><a class="header-anchor" href="#using-the-systemcontractscaller-library" aria-hidden="true">#</a> Using the <code v-pre>SystemContractsCaller</code> library</h2>
<p>For the sake of security, both <code v-pre>NonceHolder</code> and the <code v-pre>ContractDeployer</code> system contracts can only be called with a special <code v-pre>isSystem</code> flag. You can read more about it <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#protected-access-to-some-of-the-system-contracts">here</RouterLink>. To make a call with this flag, the <code v-pre>systemCall</code>/<code v-pre>systemCallWithPropagatedRevert</code>/<code v-pre>systemCallWithReturndata</code> methods of the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/SystemContractsCaller.sol" target="_blank" rel="noopener noreferrer">SystemContractsCaller<ExternalLinkIcon/></a> library should be used.</p>
<p>Using this library is practically a must when developing custom accounts since this is the only way to call non-view methods of the <code v-pre>NonceHolder</code> system contract. Also, you will have to use this library if you want to allow users to deploy contracts of their own. You can use the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol" target="_blank" rel="noopener noreferrer">implementation<ExternalLinkIcon/></a> of the EOA account as a reference.</p>
<h2 id="extending-eip4337" tabindex="-1"><a class="header-anchor" href="#extending-eip4337" aria-hidden="true">#</a> Extending EIP4337</h2>
<p>To provide DoS protection for the operator, EIP4337 imposes several <a href="https://eips.ethereum.org/EIPS/eip-4337#simulation" target="_blank" rel="noopener noreferrer">restrictions<ExternalLinkIcon/></a> on the validation step of the account.
Most of them, especially those regarding the forbidden opcodes, are still relevant. However, several restrictions have been lifted for better UX.</p>
<h3 id="extending-the-allowed-opcodes" tabindex="-1"><a class="header-anchor" href="#extending-the-allowed-opcodes" aria-hidden="true">#</a> Extending the allowed opcodes</h3>
<ul>
<li>It is allowed to <code v-pre>call</code>/<code v-pre>delegateCall</code>/<code v-pre>staticcall</code> contracts that were already deployed. Unlike Ethereum, we have no way to edit the code that was deployed or delete the contract via selfdestruct, so we can be sure that the code during the execution of the contract will be the same.</li>
</ul>
<h3 id="extending-the-set-of-slots-that-belong-to-a-user" tabindex="-1"><a class="header-anchor" href="#extending-the-set-of-slots-that-belong-to-a-user" aria-hidden="true">#</a> Extending the set of slots that belong to a user</h3>
<p>In the original EIP, the <code v-pre>validateTransaction</code> step of the AA allows the account to read only the storage slots of its own. However, there are slots that <em>semantically</em> belong to that user but are actually located on another contract’s addresses. A notable example is <code v-pre>ERC20</code> balance.</p>
<p>This limitation provides DDoS safety by ensuring that the slots used for validation by various accounts <em>do not overlap</em>, so there is no need for them to <em>actually</em> belong to the account’s storage.</p>
<p>To enable reading the user's ERC20 balance or allowance on the validation step, the following types of slots will be allowed for an account with address <code v-pre>A</code> on the validation step:</p>
<ol>
<li>Slots that belong to address <code v-pre>A</code>.</li>
<li>Slots <code v-pre>A</code> on any other address.</li>
<li>Slots of type <code v-pre>keccak256(A || X)</code> on any other address. (to cover <code v-pre>mapping(address =&gt; value)</code>, which is usually used for balance in ERC20 tokens).</li>
<li>Slots of type <code v-pre>keccak256(X || OWN)</code> on any other address, where <code v-pre>OWN</code> is some slot of the previous (third) type (to cover <code v-pre>mapping(address ⇒ mapping(address ⇒ uint256))</code> that are usually used for <code v-pre>allowances</code> in ERC20 tokens).</li>
</ol>
<h3 id="what-could-be-allowed-in-the-future" tabindex="-1"><a class="header-anchor" href="#what-could-be-allowed-in-the-future" aria-hidden="true">#</a> What could be allowed in the future?</h3>
<p>In the future, we might even allow time-bound transactions, e.g. allow checking that <code v-pre>block.timestamp &lt;= value</code> if it returned <code v-pre>false</code>, etc. This would require deploying a separate library of such trusted methods, but it would greatly increase the capabilities of accounts.</p>
<h2 id="building-custom-accounts" tabindex="-1"><a class="header-anchor" href="#building-custom-accounts" aria-hidden="true">#</a> Building custom accounts</h2>
<p>As already mentioned above, each account should implement the <a href="#iaccount-interface">IAccount</a> interface.</p>
<p>An example of the implementation of the AA interface is the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L17" target="_blank" rel="noopener noreferrer">implementation<ExternalLinkIcon/></a> of the EOA account.
Note that this account, just like standard EOA accounts on Ethereum, successfully returns empty value whenever it is called by an external address, while this may not be the behaviour that you would like for your account.</p>
<h3 id="eip1271" tabindex="-1"><a class="header-anchor" href="#eip1271" aria-hidden="true">#</a> EIP1271</h3>
<p>If you are building a smart wallet, we also <em>highly encourage</em> you to implement the <a href="https://eips.ethereum.org/EIPS/eip-1271" target="_blank" rel="noopener noreferrer">EIP1271<ExternalLinkIcon/></a> signature-validation scheme.
This is the standard that is endorsed by the zkSync team. It is used in the signature-verification library described below in this section.</p>
<h3 id="the-deployment-process" tabindex="-1"><a class="header-anchor" href="#the-deployment-process" aria-hidden="true">#</a> The deployment process</h3>
<p>The process of deploying account logic is very similar to the one of deploying a smart contract.
In order to protect smart contracts that do not want to be treated as an account, a different method of the deployer system contract should be used to do it.
Instead of using <code v-pre>create</code>/<code v-pre>create2</code>, you should use the <code v-pre>createAccount</code>/<code v-pre>create2Account</code> methods of the deployer system contract.</p>
<p>Here is an example of how to deploy account logic using the <code v-pre>zksync-web3</code> SDK:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ContractFactory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> contractFactory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ContractFactory</span><span class="token punctuation">(</span>abi<span class="token punctuation">,</span> bytecode<span class="token punctuation">,</span> initiator<span class="token punctuation">,</span> <span class="token string">"createAccount"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> aa <span class="token operator">=</span> <span class="token keyword">await</span> contractFactory<span class="token punctuation">.</span><span class="token function">deploy</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">await</span> aa<span class="token punctuation">.</span><span class="token function">deployed</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="limitations-of-the-verification-step" tabindex="-1"><a class="header-anchor" href="#limitations-of-the-verification-step" aria-hidden="true">#</a> Limitations of the verification step</h3>
<div class="hint-container warning">
<p class="hint-container-title">Not implemented yet</p>
<p>The verification rules are not fully enforced right now. Even if your custom account works right now, it might stop working in the future if it does not follow the rules below.</p>
</div>
<p>In order to protect the system from a DoS threat, the verification step must have the following limitations:</p>
<ul>
<li>The account logic can only touch slots that belong to the account. Note, that the <a href="#extending-the-set-of-slots-that-belong-to-a-user">definition</a> is far beyond just the slots that are at the users' address.</li>
<li>The account logic can not use context variables (e.g. <code v-pre>block.number</code>).</li>
<li>It is also required that your account increases the nonce by 1. This restriction is only needed to preserve transaction hash collision resistance. In the future, this requirement will be lifted to allow more generic use-cases (e.g. privacy protocols).</li>
</ul>
<p>Transactions that violate the rules above will not be accepted by the API, though these requirements can not be enforced on the circuit/VM level and do not apply to L1-&gt;L2 transactions.</p>
<p>To let you try out the feature faster, we decided to release account abstraction publicly before fully implementing the limitations' checks for the verification step of the account.
Currently, your transactions may pass through the API despite violating the requirements above, but soon this will be changed.</p>
<h3 id="nonce-holder-contract" tabindex="-1"><a class="header-anchor" href="#nonce-holder-contract" aria-hidden="true">#</a> Nonce holder contract</h3>
<p>For optimization purposes, both <RouterLink to="/dev/developer-guides/contracts/contracts.html#differences-in-create-behaviour">tx nonce and the deployment nonce</RouterLink> are put in one storage slot inside the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#inonceholder">NonceHolder</RouterLink> system contracts.
In order to increment the nonce of your account, it is highly recommended to call the <a href="https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L12" target="_blank" rel="noopener noreferrer">incrementNonceIfEquals<ExternalLinkIcon/></a> function and pass the value of the nonce provided in the transaction.</p>
<p>This is one of the whitelisted calls, where the account logic is allowed to call outside smart contracts.</p>
<h3 id="sending-transactions-from-an-account" tabindex="-1"><a class="header-anchor" href="#sending-transactions-from-an-account" aria-hidden="true">#</a> Sending transactions from an account</h3>
<p>For now, only EIP712 transactions are supported. To submit a transaction from a specific account, you should provide the <code v-pre>from</code> field of the transaction as the address of the sender and the <code v-pre>customSignature</code> field of the <code v-pre>customData</code> with the signature for the account.</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> utils <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"zksync-web3"</span><span class="token punctuation">;</span>

<span class="token comment">// here the `tx` is a `TransactionRequest` object from `zksync-web3` SDK.</span>
<span class="token comment">// and the zksyncProvider is the `Provider` object from `zksync-web3` SDK connected to zkSync network.</span>
tx<span class="token punctuation">.</span>from <span class="token operator">=</span> aaAddress<span class="token punctuation">;</span>
tx<span class="token punctuation">.</span>customData <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>tx<span class="token punctuation">.</span>customData<span class="token punctuation">,</span>
  customSignature<span class="token operator">:</span> aaSignature<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> serializedTx <span class="token operator">=</span> utils<span class="token punctuation">.</span><span class="token function">serialize</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span>tx <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> sentTx <span class="token operator">=</span> <span class="token keyword">await</span> zksyncProvider<span class="token punctuation">.</span><span class="token function">sendTransaction</span><span class="token punctuation">(</span>serializedTx<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="paymasters" tabindex="-1"><a class="header-anchor" href="#paymasters" aria-hidden="true">#</a> Paymasters</h2>
<p>Imagine being able to pay fees for users of your protocol! Paymasters are accounts that can compensate for other accounts' transactions. The other important use-case of
paymasters is to facilitate paying fees in ERC20 tokens. While ETH is the formal fee token in zkSync, paymasters can provide the ability to exchange ERC20 tokens to ETH on the fly.</p>
<p>If users want to interact with a paymaster, they should provide the non-zero <code v-pre>paymaster</code> address in their EIP712 transaction. The input data to the paymaster is provided in the <code v-pre>paymasterInput</code> field of the paymaster.</p>
<h3 id="paymaster-verification-rules" tabindex="-1"><a class="header-anchor" href="#paymaster-verification-rules" aria-hidden="true">#</a> Paymaster verification rules</h3>
<div class="hint-container warning">
<p class="hint-container-title">Not implemented yet</p>
<p>The verification rules are not fully enforced right now. Even if your paymaster works right now, it might stop working in the future if it does not follow the rules below.</p>
</div>
<p>Since multiple users should be allowed to access the same paymaster, malicious paymasters <em>can</em> do a DoS attack on our system. To work around this, a system similar to the <a href="https://eips.ethereum.org/EIPS/eip-4337#reputation-scoring-and-throttlingbanning-for-paymasters" target="_blank" rel="noopener noreferrer">EIP4337 reputation scoring<ExternalLinkIcon/></a> will be used.</p>
<p>Unlike in the original EIP, paymasters are allowed to touch any storage slots. Also, the paymaster won't be throttled if either of the following is true:</p>
<ul>
<li>More than <code v-pre>X</code> minutes have passed since the verification has passed on the API nodes (the exact value of <code v-pre>X</code> will be defined later).</li>
<li>The order of slots being read is the same as during the run on the API node and the first slot whose value has changed is one of the user's slots. This is needed to protect the paymaster from malicious users (e.g. the user might have erased the allowance for the ERC20 token).</li>
</ul>
<h3 id="built-in-paymaster-flows" tabindex="-1"><a class="header-anchor" href="#built-in-paymaster-flows" aria-hidden="true">#</a> Built-in paymaster flows</h3>
<p>While some paymasters can trivially operate without any interaction from users (e.g. a protocol that always pays fees for their users), some require active participation from the transaction's sender. A notable example is a paymaster that swaps users' ERC20 tokens to ETH as it requires the user to set the necessary allowance to the paymaster.</p>
<p>The account abstraction protocol by itself is generic and allows both accounts and paymasters to implement arbitrary interactions. However, the code of default accounts (EOAs) is constant, but we still want them to be able to participate in the ecosystem of custom accounts and paymasters. That's why we have standardized the <code v-pre>paymasterInput</code> field of the transaction to cover the most common uses-cases of the paymaster feature.</p>
<p>Your accounts are free to implement or not implement the support for these flows. However, this is highly encouraged to keep the interface the same for both EOAs and custom accounts.</p>
<h4 id="general-paymaster-flow" tabindex="-1"><a class="header-anchor" href="#general-paymaster-flow" aria-hidden="true">#</a> General paymaster flow</h4>
<p>It should be used if no prior actions are required from the user for the paymaster to operate.</p>
<p>The <code v-pre>paymasterInput</code> field must be encoded as a call to a function with the following interface:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">function</span> <span class="token function">general</span><span class="token punctuation">(</span><span class="token builtin">bytes</span> <span class="token keyword">calldata</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>EOA accounts will do nothing and the paymaster can interpret this <code v-pre>data</code> in any way.</p>
<h4 id="approval-based-paymaster-flow" tabindex="-1"><a class="header-anchor" href="#approval-based-paymaster-flow" aria-hidden="true">#</a> Approval-based paymaster flow</h4>
<p>It should be used if the user is required to set certain allowance to a token for the paymaster to operate. The <code v-pre>paymasterInput</code> field must be encoded as a call to a function with the following signature:</p>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">function</span> <span class="token function">approvalBased</span><span class="token punctuation">(</span>
    <span class="token builtin">address</span> _token<span class="token punctuation">,</span>
    <span class="token builtin">uint256</span> _minAllowance<span class="token punctuation">,</span>
    <span class="token builtin">bytes</span> <span class="token keyword">calldata</span> _innerInput
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The EOA will ensure that the allowance of the <code v-pre>_token</code> towards the paymaster is set to at least <code v-pre>_minAllowance</code>. The <code v-pre>_innerInput</code> param is an additional payload that can be sent to the paymaster to implement any logic (e.g. an additional signature or key that can be validated by the paymaster).</p>
<p>If you are developing a paymaster, you <em>should not</em> trust the transaction sender to behave honestly (e.g. provide the required allowance with the <code v-pre>approvalBased</code> flow). These flows serve mostly as instructions to EOAs and the requirements should always be double-checked by the paymaster.</p>
<h4 id="working-with-paymaster-flows-using-zksync-web3-sdk" tabindex="-1"><a class="header-anchor" href="#working-with-paymaster-flows-using-zksync-web3-sdk" aria-hidden="true">#</a> Working with paymaster flows using <code v-pre>zksync-web3</code> SDK</h4>
<p>The <code v-pre>zksync-web3</code> SDK provides <RouterLink to="/api/js/utils.html#encoding-paymaster-param">methods</RouterLink> for encoding correctly formatted paymaster params for all of the built-in paymaster flows.</p>
<h3 id="testnet-paymaster" tabindex="-1"><a class="header-anchor" href="#testnet-paymaster" aria-hidden="true">#</a> Testnet paymaster</h3>
<p>To ensure users experience paymasters on testnet, as well as keep supporting paying fees in ERC20 tokens, the Matter Labs team provides the testnet paymaster, that enables paying fees in ERC20 token at a 1:1 exchange rate with ETH (i.e. one unit of this token is equal to 1 wei of ETH).</p>
<p>The paymaster supports only the <a href="#approval-based-paymaster-flow">approval based</a> paymaster flow and requires that the <code v-pre>token</code> param is equal to the token being swapped and <code v-pre>minAllowance</code> to equal to least <code v-pre>tx.maxFeePerErg * tx.ergsLimit</code>. In addition, the testnet paymaster does not make use of the <code v-pre>_innerInput</code> parameter, so nothing should be provided (empty <code v-pre>bytes</code>).</p>
<p>An example of how to use testnet paymaster can be seen in the <RouterLink to="/dev/developer-guides/hello-world.html#paying-fees-using-testnet-paymaster">quickstart</RouterLink> tutorial.</p>
<h2 id="aa-signature-checker" tabindex="-1"><a class="header-anchor" href="#aa-signature-checker" aria-hidden="true">#</a> <code v-pre>aa-signature-checker</code></h2>
<p>Your project can start preparing for native AA support. We highly encourage you to do so, since it will allow you to onboard hundreds of thousands of users (e.g. Argent users that already use the first version of zkSync).
We expect that in the future even more users will switch to smart wallets.</p>
<p>One of the most notable differences between various types of accounts to be built is different signature schemes. We expect accounts to support the <a href="https://eips.ethereum.org/EIPS/eip-1271" target="_blank" rel="noopener noreferrer">EIP-1271<ExternalLinkIcon/></a> standard. Our team has created a utility library for verifying account signatures. Currently, it only supports ECDSA signatures, but we will add support for EIP-1271 very soon as well.</p>
<p>The <code v-pre>aa-signature-checker</code> library provides a way to verify signatures for different account implementations. Currently it only supports verifying ECDSA signatures. Very soon we will add support for EIP-1271 as well.</p>
<p><em>We strongly encourage you to use this library whenever you need to check that a signature of an account is correct.</em></p>
<h3 id="adding-the-library-to-your-project" tabindex="-1"><a class="header-anchor" href="#adding-the-library-to-your-project" aria-hidden="true">#</a> Adding the library to your project:</h3>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>yarn add @matterlabs/signature-checker
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="example-of-using-the-library" tabindex="-1"><a class="header-anchor" href="#example-of-using-the-library" aria-hidden="true">#</a> Example of using the library</h3>
<div class="language-solidity line-numbers-mode" data-ext="solidity"><pre v-pre class="language-solidity"><code><span class="token keyword">pragma</span> <span class="token keyword">solidity</span> <span class="token operator">^</span><span class="token version number">0.8.0</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> SignatureChecker <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@matterlabs/signature-checker/contracts/SignatureChecker.sol"</span><span class="token punctuation">;</span>

<span class="token keyword">contract</span> <span class="token class-name">TestSignatureChecker</span> <span class="token punctuation">{</span>
    <span class="token keyword">using</span> <span class="token class-name">SignatureChecker</span> <span class="token keyword">for</span> <span class="token builtin">address</span><span class="token punctuation">;</span>

    <span class="token keyword">function</span> <span class="token function">isValidSignature</span><span class="token punctuation">(</span>
        <span class="token builtin">address</span> _address<span class="token punctuation">,</span>
        <span class="token builtin">bytes32</span> _hash<span class="token punctuation">,</span>
        <span class="token builtin">bytes</span> <span class="token keyword">memory</span> _signature
    <span class="token punctuation">)</span> <span class="token keyword">public</span> <span class="token keyword">pure</span> <span class="token keyword">returns</span> <span class="token punctuation">(</span><span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> _address<span class="token punctuation">.</span><span class="token function">checkSignature</span><span class="token punctuation">(</span>_hash<span class="token punctuation">,</span> _signature<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="verifying-aa-signatures-within-our-sdk" tabindex="-1"><a class="header-anchor" href="#verifying-aa-signatures-within-our-sdk" aria-hidden="true">#</a> Verifying AA signatures within our SDK</h2>
<p>It is also <strong>not recommended</strong> to use <code v-pre>ethers.js</code> library to verify user signatures.</p>
<p>Our SDK provides two methods with its <code v-pre>utils</code> to verify the signature of an account:</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">isMessageSignatureCorrect</span><span class="token punctuation">(</span>address<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> message<span class="token operator">:</span> ethers<span class="token punctuation">.</span>Bytes <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">,</span> signature<span class="token operator">:</span> SignatureLike<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">></span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">isTypedDataSignatureCorrect</span><span class="token punctuation">(</span>
  address<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
  domain<span class="token operator">:</span> TypedDataDomain<span class="token punctuation">,</span>
  types<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TypedDataField<span class="token operator">>></span><span class="token punctuation">,</span>
  value<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">,</span>
  signature<span class="token operator">:</span> SignatureLike
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">></span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Currently these methods only support verifying ECDSA signatures, but very soon they will support EIP1271 signature verification as well.</p>
<p>Both of these methods return <code v-pre>true</code> or <code v-pre>false</code> depending on whether the message signature is correct.</p>
</div></template>


