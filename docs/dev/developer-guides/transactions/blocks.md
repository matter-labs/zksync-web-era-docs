# Overview

In Ethereum, block is a historical recordkeeper of the list of transactions, they are batches of transactions with a hash of the previous block in the chain.
To ensure that all participants on network maintain a synchronized state and agree on the precise history of transactions, we batch transactions into blocks. This means dozens (or hundreds) of transactions are committed, agreed on, and synchronized all at once.

## Prerequisite

Blocks are fundamental topics, and to help you understand this page better, we recommend you first read [accounts](account.md), [transactions](transactions.md).

## How does blocks work on Ethereum?

To preserve the transaction history, blocks are strictly ordered (every new block created contains a reference to its parent block), and transactions within blocks are strictly ordered as well. Except in rare cases, at any given time, all participants on the network are in agreement on the exact number and history of blocks, and are working to batch the current live transaction requests into the next block.

Once a block is put together by some validator on the network, it is propagated to the rest of the network; all nodes add this block to the end of their blockchain, and a new validator is selected to create the next block. The exact block-assembly process and commitment/consensus process is currently specified by Ethereum’s “proof-of-stake” protocol.

## How block and time works on zkSync?

When a user sends L2 transfers to the operator, they are not processed immediately. Instead, they are added to a set of pending transactions in the off-chain available state. After the rollup state has been updated by the operator, the user recieves (off-chain) witnesses to both their balance and to all their pending transactions in the new rollup state from the operator. In order to process their pending transactions, the user signs and sends an operation ProcessTransactions to the operator. The operator then adds this operation in the next rollup block, which processes all the pending transactions of the sender, and sets a value lastSeenBlockNum(sender) = blockNum in the on-chain available state, where blockNum is the last block number. After a rollup block has been posted, the operator provides witnesses to all updated balances to the affected users.

