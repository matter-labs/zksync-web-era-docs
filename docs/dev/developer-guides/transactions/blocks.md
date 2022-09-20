# Overview

In Ethereum, block is a historical recordkeeper of the list of transactions, they are batches of transactions with a hash of the previous block in the chain.
To ensure that all participants on network maintain a synchronized state and agree on the precise history of transactions, we batch transactions into blocks. This means dozens (or hundreds) of transactions are committed, agreed on, and synchronized all at once.

## Prerequisite

Blocks are fundamental topics, and to help you understand this page better, we recommend you first read [accounts](account.md), [transactions](transactions.md).

## How does blocks work on Ethereum?

To preserve the transaction history, blocks are strictly ordered (every new block created contains a reference to its parent block), and transactions within blocks are strictly ordered as well. 
Except in rare cases, at any given time, all participants on the network are in agreement on the exact number and history of blocks, and are working to batch the current live transaction requests into the next block.

Once a block is put together by some validator on the network, it is propagated to the rest of the network; all nodes add this block to the end of their blockchain, and a new validator is selected to create the next block. 
The exact block-assembly process and commitment/consensus process is currently specified by Ethereum’s “proof-of-stake” protocol.

## Block numbers and time

On zkSync when a user sends L2 transfers to the operator, they are not processed immediately. 
Instead, they are added to a set of pending transactions in the off-chain available state. After the rollup state has been updated by the operator, the user recieves (off-chain) witnesses to both their balance and to all their pending transactions in the new rollup state from the operator. 
In order to process their pending transactions, the user signs and sends an operation ProcessTransactions to the operator. 
The operator then adds this operation in the next rollup block, which processes all the pending transactions of the sender, and sets a value lastSeenBlockNum(sender) = blockNum in the on-chain available state, where blockNum is the last block number. After a rollup block has been posted, the operator provides witnesses to all updated balances to the affected users.

### Block Numbers: zkSync vs. Ethereum

L2 blocks are similar to L1 block structure, in zkSync we send some information about L2 blocks to L1 contract (known as commitment), afterwards we generate proof for the blocks and send it back to the L1 contract, the L1 contract then verifies that given proof is correct. 

### Ethereum Block Numbers Within zkSync

Accessing block numbers within an zkSync smart contract (i.e., `block.number` in Solidity), is similar to how you would do it on Ethereum. For example `eth_blockNumber` returns the number of the latest L2 Block, and `eth_getBlockByNumber` returns the information about the L2 block by its number.

The **capacity,** which includes, the number of transactions, and storage writes, of the L1 batch is limited because of 2 different things:

1. Prover can generate proofs in a reasonable time for L1 batches with limited capacity.

2. The gas needed for the transaction to commit the L1 batch on the L1 contract should fit into the L1 block gas limit. That gas depends on L1 batch capacity, so that's why capacity gets limited.

We seal L1 batches based on 2 reasons:

1. The capacity is reached (well, because we can't send an L1 batch that exceeds capacity)
   
2. Timeout has passed. The timeout is Y hours, Y is not decided yet, but it will be in the range of 1-24. 
Timeout reason is needed to guarantee users that their transactions will achieve finality on L1 in some reasonable time. 
Consider if there weren't this timeout reason, the user sends some transaction and the load is very low, so to fill an L1 batch capacity couple of days are needed and the user must wait for finality for these days, which is pretty bad for the UX.

### Hashes

The hash of the L2 block is deterministic and is equal to `keccak256(l2_block_number)`, so it can be calculated just by knowing the L2 block number
The reason we made it so is for Web3 API compatibility: every block must have a different hash. Moreover, we use keccak hash function for hashes to look like random values to not confuse users

hash of the L1 batch is calculated based on some values: storage root hash/l1 batch number/others. Basically, the proofs that we sent to L1 prove that we execute transactions and they result in state transition from the previous storage root hash to the committed storage root hash.

### Block Properties

- Previous hash: The hash value of the previous block’s header on the blockchain.
- Nonce: A number that causes the hash value of the current block’s header to adhere to a specific pattern.
- Timestamp: The creation date + time of the current block.
- Uncles hash: The hash value of the current block’s list of uncle blocks (stale blocks).
- Beneficiary: The miner’s account that receives the reward for mining the block.
- Logs bloom: Logging info, stored in a Bloom filter (a data structure useful for quickly finding out if some element is a member of a set).
- Difficulty: The difficulty level for mining this block.
- Block number: The unique sequential number for this block.
- Mix hash: A hash value combined with the nonce value to show that the mined nonce meets the difficulty requirements. This hash makes it more difficult for attackers to modify the block.
- State root: The hash value of the root node of the block’s state trie.
- Transaction root: The hash value of the root node of the trie, which stores all transactions for this block.
- Receipt root: The hash value of the root node of the trie, which stores all transaction receipts for this block.
balances to the affected users.

