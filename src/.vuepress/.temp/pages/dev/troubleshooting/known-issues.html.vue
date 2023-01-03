<template><div><h1 id="known-issues" tabindex="-1"><a class="header-anchor" href="#known-issues" aria-hidden="true">#</a> Known issues</h1>
<p>zkSync 2.0 is currently in the alpha stage, hence some things you are used to may not work. Please keep in mind that the system is still under ongoing development.</p>
<h2 id="why-are-metamask-native-contract-interactions-not-working" tabindex="-1"><a class="header-anchor" href="#why-are-metamask-native-contract-interactions-not-working" aria-hidden="true">#</a> Why are Metamask native contract interactions not working?</h2>
<p>It is not currently possible to interact with zkSync smart contracts via Metamask with EIP-1559 transactions. zkSync does not support EIP1559 transactions.</p>
<p><strong>Solution.</strong> Explicitly specify <code v-pre>{ type: 0 }</code> in transaction overrides to use Ethereum legacy transactions.</p>
<h2 id="why-does-my-wallet-have-no-funds-and-my-contract-disappears" tabindex="-1"><a class="header-anchor" href="#why-does-my-wallet-have-no-funds-and-my-contract-disappears" aria-hidden="true">#</a> Why does my wallet have no funds and my contract disappears?</h2>
<p>We are expected to update our testnet continuously, so from time to time, we will need to do a re-genesis. This will cause the entire state to reset, and all deployed contracts will cease to exist.</p>
<p><strong>We will communicate re-genesis events before they happen!</strong></p>
<h2 id="why-does-wait-get-stuck-for-l1-l2-transactions" tabindex="-1"><a class="header-anchor" href="#why-does-wait-get-stuck-for-l1-l2-transactions" aria-hidden="true">#</a> Why does <code v-pre>wait()</code> get stuck for L1-&gt;L2 transactions?</h2>
<p>If the <code v-pre>wait()</code> takes much longer than expected, most likely the transaction has failed.</p>
<h2 id="why-is-there-an-unexpected-end-of-json-input-compilation-error" tabindex="-1"><a class="header-anchor" href="#why-is-there-an-unexpected-end-of-json-input-compilation-error" aria-hidden="true">#</a> Why is there an <code v-pre>unexpected end of JSON input</code> compilation error?</h2>
<p>This is an error that is usually thrown when compiling a large smart contract codebase.</p>
<p>If you encounter such an error, please do the following:</p>
<ul>
<li>Update the <code v-pre>@matterlabs/hardhat-zksync-solc</code> library and try to re-compile the smart contracts afterwards.</li>
<li>If after the recompilation you get the <code v-pre>Library not found</code> error, then you should follow the instructions from <RouterLink to="/api/hardhat/compiling-libraries.html">here</RouterLink>.</li>
<li>If the same error persists, report the issue to our team. We will do our best to help you.</li>
</ul>
<h2 id="why-can-t-i-use-create-create2-opcodes-with-raw-bytecode" tabindex="-1"><a class="header-anchor" href="#why-can-t-i-use-create-create2-opcodes-with-raw-bytecode" aria-hidden="true">#</a> Why can't I use CREATE/CREATE2 opcodes with raw bytecode?</h2>
<p>zkSync does not support using CREATE/CREATE2 with raw bytecode. We highly recommend using the <code v-pre>new</code> operator to avoid any issues.</p>
<h2 id="why-is-hardhat-s-console-log-not-working" tabindex="-1"><a class="header-anchor" href="#why-is-hardhat-s-console-log-not-working" aria-hidden="true">#</a> Why is Hardhat's <code v-pre>console.log</code> not working?</h2>
<p>zkSync does not support the Nomic Foundation's <code v-pre>console.log</code> contract. Due to different address derivation rules, even when deployed, the <code v-pre>console.log</code> library will likely have a different address from the one on Ethereum.</p>
<!---

## Metamask native transfers not working

It is not currently possible to transfer ERC-20 tokens inside the Metamask interface.

**Solution.** For now, transfers inside zkSync you should be done via the [zkSync Wallet](https://portal.zksync.io) dApp.


## Transfers with the _entire_ token balance fail

If you try to transfer the entire balance of a token, which is also the token you pay the fee with, the transaction fails. The reason is that we don’t deduct the fee before setting the amount to be transferred.

**Solution.** Keep aside a small amount to cover the fee.

## Errors before sending a transaction

Similar to above, in cases where the fee should be deducted from the token amount, you may get an error if estimate_gas returns an error.

**Solution.** As above, make sure to keep aside a small amount to cover the fee.

## My contract does not compile, due to an error with “cyclic dependencies”

Unfortunately, some contracts have trouble compiling with our hardhat plugin. This is due to the contracts importing external dependencies. This happens to a small number of projects. We are currently working on resolving this issue.

## My transaction is not shown on the block explorer

Currently, the block explorer does not index the latest produced block. As long as a new block is not produced after the block that contains your transaction, it won't appear
on the block explorer.

**Solution.** You can make a simple transfer (or any other transaction) to make the system produce a new block. The previous block would then appear, including your transaction.
Note that if you know the tx id, you can use our wallet to see its status.
--->
</div></template>


