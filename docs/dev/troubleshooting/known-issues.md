# Known issues

zkSync Era is currently in the alpha stage, hence some things you are used to may not work. Please keep in mind that the system is still under ongoing development.

## Why are Metamask native contract interactions not working?

It is not currently possible to interact with zkSync smart contracts via Metamask with EIP-1559 transactions. zkSync does not support EIP1559 transactions.

**Solution.** Explicitly specify `{ type: 0 }` in transaction overrides to use Ethereum legacy transactions.

## Why does my wallet have no funds and my contract disappears?

We are expected to update our testnet continuously, so from time to time, we will need to do a re-genesis. This will cause the entire state to reset, and all deployed contracts will cease to exist.

**We will communicate re-genesis events before they happen!**

## Why does `wait()` get stuck for L1->L2 transactions?

If the `wait()` takes much longer than expected, most likely the transaction has failed.

## Why is there an `unexpected end of JSON input` compilation error?

This is an error that is usually thrown when compiling a large smart contract codebase.

If you encounter such an error, please do the following:

- Update the `@matterlabs/hardhat-zksync-solc` library and try to re-compile the smart contracts afterwards.
- If after the recompilation you get the `Library not found` error, then you should follow the instructions from [here](../../api/hardhat/compiling-libraries.md).
- If after the recompilation you get the `Library not found` error, then you should follow the instructions from [here](../../api/).
- If the same error persists, report the issue to our team. We will do our best to help you.

## Why can't I use CREATE/CREATE2 opcodes with raw bytecode?

zkSync does not support using CREATE/CREATE2 with raw bytecode. We highly recommend using the `new` operator to avoid any issues.

## Why is Hardhat's `console.log` not working?

zkSync does not support the Nomic Foundation's `console.log` contract. Due to different address derivation rules, even when deployed, the `console.log` library will likely have a different address from the one on Ethereum.
