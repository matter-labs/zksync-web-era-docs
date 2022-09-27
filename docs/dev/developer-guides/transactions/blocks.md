# General

A block in Ethereum is a list of transactions that have been recorded historically. They are collections of transactions that include the hash of the chain's previous block.
We group transactions into blocks to ensure everyone on the network stays in sync and agrees on the detailed history of transactions. It implies that hundreds of transactions are simultaneously committed, decided upon, and synced.

## Prerequisite

To fully understand this page, we suggest you first read a guide on[accounts](https://ethereum.org/en/developers/docs/accounts/), and [transactions](transactions.md).

## How do Ethereum blocks work?

Blocks are strictly ordered (each new block has a connection to its parent block), and transactions within blocks are strictly ordered to keep track of the history of transactions.
Unless there are exceptional circumstances, all network participants agree with the precise number and history of blocks at any particular time and attempt to combine the pending live transaction requests into the upcoming block.


Every node adds the newly created block to the end of its blockchain after it has been assembled by one of the network's validators, and a new validator is chosen to build the following block.


## Block numbers and time

On zkSync, 


### Block Numbers: Ethereum vs. zkSync

The structure of L2 blocks is similar to that of L1 blocks. 
In zkSync, we send to the L1 contract some information about L2 blocks (a commitment), then we produce a proof for the blocks and transmit it back to the L1 contract, which confirms that the proof is valid.


### Ethereum Block Numbers Within zkSync

L1 batch is a range of L2 blocks that are committed and finalized on L1 as one whole. The reason for having them is to save on fixed gas costs while publishing L2 blocks data on the L1 chain.
Accessing block numbers within a zkSync API is similar to how you would do it on Ethereum. For example, `eth_blockNumber` returns the number of the latest L2 block, and `eth_getBlockByNumber` returns the information about the L2 block by its number.

The **capacity,** which includes the number of transactions and storage writes, of the L1 batch is limited because of two different things:


1. For small L1 batches, a prover can produce proofs in an adequate amount of time.
2. The required gas for the transaction to commit the L1 batch on the L1 contract must not exceed the permitted gas for the L1 block. Because that gas depends on L1 batch size, capacity is constrained.


L1 batches are sealed for two reasons:

1. The capacity is reached (well, because we can't send an L1 batch that exceeds capacity).
2. Timeout has passed. We do not have a precise estimate on the timeout for now.
Users require a timeout season to ensure that their transactions become final on L1 in a timely manner.
Imagine if there weren't a timeout, users would send some transactions, and the load would be very low to fill an L1 batch capacity, resulting in users waiting for finality for days.

### Hashes

You may determine the L2 block's hash by knowing the L2 block number because it is deterministic and equivalent to "keccak256(l2_block_number)".
Every block needs a unique hash, which we proposed for Web3 API compatibility. Additionally, to avoid confusing users, we employ the `keccak hash` function to make hashes appear to be random numbers.

Storage root hash, L1 batch number, and other data are used to determine the hash of the L1 batch. 
The proofs that we supply to the L1 demonstrate that we conduct transactions that cause a state change from the old storage root hash to the committed storage root hash.

### Block Properties

- Previous hash: The hash value of the previous block's header on the blockchain.
- Nonce: A value that makes the header hash of the current block follow a particular pattern.
- Timestamp: The current block's creation date and time.
- Beneficiary: The miner's account is credited with the block's mining reward.
- Block number: The unique sequential number for this block.
- Mix hash: A hash value is added to the nonce value to demonstrate that the mined nonce satisfies the standards for difficulty. Attackers will find it more challenging to change the block with this hash.
- State root: The hash value for the block's state trie's root node.
- Transaction root: The hash value of the trie's root node, which contains all of the block's transactions.
- Receipt root: This is the hash of the trie's root node, which holds all of the transaction receipts for this block.
