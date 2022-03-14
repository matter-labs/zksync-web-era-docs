# Known issues

While zkSync 2.0 is in alpha, we will put known (and not fixed yet) bugs here as well as workarounds for them.

## Metamask native transfers not working

It is not currently possible to transfer ERC-20s inside the Metamask interface.

**Solution.** For now, transfers inside zkSync you should be done via the [zkSync Wallet](https://portal.zksync.io) dApp.

## Metamask native contract interactions not working

It is not currently possible to interact with zkSync smart contracts via Metamask with EIP-1559 transactions. The reason for that is that Metamask tries to override several EIP-1559 transaction fields (assuming they can not have zero value), while these fields should be zero for zkSync.

**Solution.** Explicitly specify `{ type: 0 }` in transaction overrides to use Ethereum legacy transactions.

## Transfers with the _entire_ token balance fail

If you try to transfer the entire balance of a token, which is also the token you pay the fee with, the transaction fails. The reason is that we don’t deduct the fee before setting the amount to be transferred.

**Solution.** Keep aside a small a amount to cover the fee.

## Errors before sending a transaction

Similar to above, in cases where the fee should be deducted from the token amount, you may get an error if estimate_gas returns an error.

**Solution.** As above, make sure to keep aside a small amount to cover the fee.

## Fee within the wallet is only in ETH

Very soon you will be able to pay the fee within the wallet in other tokens.

<!---
## My contract does not compile, due to an error with “cyclic dependencies”

Unfortunately, some contracts have trouble to compile with our hardhat plugin. This is due to the contracts importing external dependencies. This happens to a small number of projects. We are currently working on resolving this issue.

## My transaction is not shown on the block explorer

Currently, the block explorer does not index the latest produced block. As long as a new block is not produced after the block that contains your transaction, it won't appear
on the block explorer.

**Solution.** You can make a simple transfer (or any other transaction) to make the system produce a new block. The previous block would then appear, including your transaction.
Note that if you know the tx id, you can use our wallet to see its status.
--->

## Wallet has no funds / Contract disappeared

We are expected to update our testnet continuously, and so from time to time, we will need to do a re-genesis. This will cause the entire state to reset, and all deployed contracts will cease to exist.

**We will communicate re-genesis events before they happen!**

## `wait()` gets stuck for L1->L2 transactions

If the `wait()` takes much longer than expected, most likely the transaction has failed.

## `unexpected end of JSON input` compilation error

This is an error that is usually thrown when compiling a large smart contract codebase.

If you encounter such an error, please do the following:

- Update the `@matterlabs/hardhat-zksync-solc` library and try to re-compile the smart contracts afterwards.
- If after the recompilation you get the `Library not found` error, then you should follow the instructions from [here](../../api/hardhat/compiling-libraries.md).
- If the same error persists, report the issue to our team. We will do our best to help you.

## `Docker Desktop is not running` / `Docker Desktop is not installed` error

If you are running Windows you may get this error, as a result of incompatibility with our hardhat plugin.
You can still compile the contract using Windows Subsystem for Linux (WSL 2).
