# Blocks

A block in Ethereum is a list of transactions that have been recorded historically. They are collections of transactions that include the hash of the chain's previous block.
We group transactions into blocks to ensure everyone on the network stays in sync and agrees on the detailed history of transactions. It implies that hundreds of transactions are simultaneously committed, decided upon, and synced.

## Prerequisite

To fully understand this page, we suggest you first read a guide on [transactions](transactions.md).

## How do Ethereum blocks work?

Blocks are strictly ordered (each new block has a connection to its parent block), and transactions within blocks are strictly ordered to keep track of the history of transactions.
Unless there are exceptional circumstances, all network participants agree with the precise number and history of blocks at any particular time and attempt to combine the pending live transaction requests into the upcoming block.

Every node adds the newly created block to the end of its blockchain after it has been assembled by one of the network's validators, and a new validator is chosen to build the following block.

## Block numbers and time

On zkSync, when users send transactions, those transactions are included in L2 blocks. These L2 blocks are sealed every X seconds (X is not decided yet, but it will surely be in the 1–5 range). Typically, the user needs to wait at most X seconds to get the receipt and be informed that his transaction is included in some block.
In L1 batches, we send some information about L2 blocks to the L1 contract (known as a commitment); later, we generate proof for the blocks and send them to the L1 contract. The L1 contract then verifies that the given proof is correct.
All actions on L1 require some gas to be spent. So, for example, if we aggregate some transactions into 1 block instead of 2, we will save some gas because we will need to send only one commitment and one proof instead of two. Thus, we aggregate ranges of L2 blocks into L1 batches and send one commitment/proof per L1 batch to save on gas costs.

### Ethereum Block Numbers Within zkSync

L1 batch is a range of L2 blocks that are committed and finalized on L1 as one whole. The reason for having them is to save on fixed gas costs while publishing L2 block data on the L1 chain.
Accessing block numbers within a zkSync API is similar to how you would do it on Ethereum. For example, `eth_blockNumber` returns the number of the latest L2 block, and `eth_getBlockByNumber` returns the information about the L2 block by its number.

The **capacity,** which includes the number of transactions and storage writes, of the L1 batch is limited because of two different things:
1. For small L1 batches, a prover can produce proofs in an adequate amount of time.
2. The required gas for the transaction to commit the L1 batch on the L1 contract must not exceed the permitted gas for the L1 block. Because that gas depends on L1 batch size, capacity is constrained.


L1 batches are sealed for two reasons:

1. The capacity is reached (well, because we can't send an L1 batch that exceeds capacity).
2. Timeout has passed. We do not have a precise estimate on the timeout for now.
Users require a timeout season to ensure that their transactions become final on L1 on time.
Imagine if there weren't a timeout, users would send some transactions, and the load would be very low to fill an L1 batch capacity, resulting in users waiting for finality for days.

### Hashes

You may determine the L2 block's hash by knowing the L2 block number because it is deterministic and equivalent to "keccak256(l2_block_number)".
Every block needs a unique hash, which we proposed for Web3 API compatibility. Additionally, to avoid confusing users, we employ the `keccak hash` function to make hashes appear to be random numbers.

### Block Properties
- Timestamp: The current block's creation time as seconds since the Unix epoch
- Block number: The unique sequential number for this block.
- Gas limit: The current block gas limit, always returns `2^32-1`.
- Coinbase:  The current block miner’s address, returns the [bootloader](../contracts/system-contracts.md#bootloader) address.
- Difficulty: The current block difficulty, returns `2500000000000000` (zkSync does not have proof of work consensus).
- MSIZE: It returns the size of the memory, usually `2^16`.
