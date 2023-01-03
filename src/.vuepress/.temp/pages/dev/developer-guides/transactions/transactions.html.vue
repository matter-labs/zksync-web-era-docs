<template><div><h1 id="transactions" tabindex="-1"><a class="header-anchor" href="#transactions" aria-hidden="true">#</a> Transactions</h1>
<p>Transactions in Ethereum are cryptographically signed instructions by an externally owned account (an account owned by a user and not by code). These instructions are stored in the blockchain and added to a block.
The state of the Ethereum virtual machine (EVM) changes when a transaction is initiated. A transaction can be anything from sending ether to another account to invoking the functions of a smart contract.</p>
<h2 id="prerequisite" tabindex="-1"><a class="header-anchor" href="#prerequisite" aria-hidden="true">#</a> Prerequisite</h2>
<p>We recommend you first read <a href="https://ethereum.org/en/developers/docs/accounts/" target="_blank" rel="noopener noreferrer">accounts<ExternalLinkIcon/></a> to understand this page.</p>
<h2 id="how-transactions-work" tabindex="-1"><a class="header-anchor" href="#how-transactions-work" aria-hidden="true">#</a> How transactions work</h2>
<p>When a user initiates a transaction on Ethereum, some specific data is created:</p>
<ul>
<li>Receiver: The recipient is the account's address to receive the transaction. The receiver can be a contract account or an externally owned account. Each transaction is aimed toward a specific recipient.</li>
<li>Nonce: This field displays the most recent transaction based on the account's counter, which maintains track of how many transactions it does. The network uses the transaction nonce to ensure that transactions are completed in the correct sequence.</li>
<li>Gas Price: Most transactions necessitate the payment of a fee to the transaction's author. This cost is computed per unit of gas. The unit is Wei, a smaller ether unit.</li>
<li>Gas Limit: The transaction author specifies the number of gas units used for the transaction. This is the total amount of gas that could be consumed.</li>
<li>Value: The quantity of Wei or Ether that the sender account wishes to transmit to the recipient is represented by the value.</li>
<li>Data: If the transaction receiver is a smart contract, the data contains information for the contract's functions to be executed. This comprises data with varying lengths.</li>
<li>Signature: A signature indicates who sent the communication. The signature is created when an externally owned account confirms and signs the transaction with its private key.</li>
</ul>
<h3 id="transaction-types" tabindex="-1"><a class="header-anchor" href="#transaction-types" aria-hidden="true">#</a> Transaction Types</h3>
<ul>
<li>Simple or asset transfers: This refers to the regular tokens transfer in the form of ether from one account to another.</li>
</ul>
<p>To deploy a contract, a user calls the <code v-pre>create</code> function of the ContractDeployer and provides the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the factory_deps field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the factory_deps as well.</p>
<ul>
<li>Contract deployment transactions: Contract deployment on zkSync is quite different from Ethereum.
<ul>
<li>Ethereum: Contract deployment occurs when a user sends a transaction to the zero address <code v-pre>(0x000...000)</code> with the <code v-pre>data</code> field of the transaction equal to the contract bytecode concatenated with the constructor parameters.</li>
<li>zkSync: To deploy a contract on zkSync, a user calls the <code v-pre>create</code> function of the <RouterLink to="/dev/developer-guides/contracts/system-contracts.html#contractdeployer">ContractDeployer</RouterLink> and provides the hash of the contract to be published, as well as the constructor arguments.
The contract bytecode itself is supplied in the <code v-pre>factory_deps</code> field of the EIP712 transactions.
If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the <code v-pre>factory_deps</code> as well.
Read more on <RouterLink to="/dev/developer-guides/contracts/contracts.html">contract deployment</RouterLink>.</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>zkSync supports Ethereum's &quot;old&quot; (pre-EIP2718) transaction types, the EIP1559 transaction type, and its EIP712 transactions. Transactions of this type can be used to access zkSync-specific features such as account abstraction. Furthermore, smart contracts can only be deployed with this sort of transaction.</p>
<p>It is not necessary to understand the transaction format to utilize zkSync's SDK, but if you are interested, you can learn more about it <RouterLink to="/api/api.html#eip712">here</RouterLink>.</p>
</div>
<h3 id="when-is-a-transaction-considered-final" tabindex="-1"><a class="header-anchor" href="#when-is-a-transaction-considered-final" aria-hidden="true">#</a> When is a transaction considered final?</h3>
<p><strong>Transaction finality</strong> refers to the promise that transactions cannot be reversed, altered, or mutated in the context of a blockchain network.</p>
<p>Finality on Ethereum, like in Bitcoin, is probabilistic, which means that the more blocks passed after the transaction was executed, the less likely it is that this transaction will be overturned.</p>
<p>Once a block has been filled and sealed in zk rollups, its state is committed to the main Ethereum chain. The proving stage is then started, and a SNARK validity proof is constructed for each block transaction. Once completed, the SNARK is sent for verification on the L1 smart contract, and the transaction state becomes final following verification.</p>
<p>From the standpoint of zkSync, <em>finality</em> occurs when the transaction (the SNARK verification) is executed by L1. At this point, the guarantees are the same as any other L1 transaction within the same L1 block; the more L1 blocks issued after the initial block is processed, the less likely this transaction will be overturned.</p>
<p>When a user transmits a transaction, zkSync currently waits for the entire block to be filled, which means the finality time may be longer depending on the volume of transactions sent via zkSync. The finality time will reduce as the throughput increases.</p>
<h3 id="what-exactly-are-operators" tabindex="-1"><a class="header-anchor" href="#what-exactly-are-operators" aria-hidden="true">#</a> What exactly are operators?</h3>
<p><strong>Operators</strong> are the actors who carry out essential ZK rollup functions. They are responsible for producing blocks, packaging transactions, conducting calculations, and submitting data to the main Ethereum chain for verification.</p>
</div></template>


