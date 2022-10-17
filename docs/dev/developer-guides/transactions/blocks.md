# Blocks

A block is an ordered list of transactions. Each block (except for the Genesis block) points to the previous block it extends, thus creating a chain of blocks.

## Blocks in zkSync 2.0

In zkSync there are two notions of ``blocks'': an L2 block and an L1 rollup block.
L2 blocks, or just "blocks", are simply the blocks created on L2, that is on the zkSync network. They are not included on the Ethereum chain. An L1 rollup block, which we call "batch", is a set of 
consecutive (L2) blocks, it contains all the transactions, and in the same order, from the first block in the batch to the last block in the 
batch.

L1 batches, as the name suggests, are submitted to Ethereum. The main reason to have these different notions is that a block can 
contain a minimal number of transactions, thus be processed quickly, while in a batch we would like to include many transactions, to make 
the cost on interaction with L1 spread among many transactions.


## Block numbers
**TODO**
- need to explain how to retrieve L1BatchNumber

Accessing block numbers within zkSync API is similar to how you would do it on Ethereum. For example, `eth_blockNumber` returns the number 
of the latest L2 block, and `eth_getBlockByNumber`, given a block number, returns the information about the requested block.

## Block processing time
**TODO**
- explain blocks/batch timing:
-- blocks are processed immediately; once we decentralize the system, block time will be a couple of seconds, for the actors to achieve consensus
-- batch time depends on the system activity -- the more active the system is, the faster we <em>seal</em> a batch. explain the seal criteria  

refer to the tx status here: https://v2-docs.zksync.io/dev/fundamentals/zkSync.html#zksync-in-comparison

DELETE THIS:

The batch size is limited due to the following:
1. For small L1 batches, a prover can produce proofs in an adequate amount of time.
2. The required gas for the transaction to commit the L1 batch on the L1 contract must not exceed the permitted gas for the L1 block. Because that gas depends on L1 batch size, capacity is constrained.

L1 batches are sealed for two reasons:

1. The capacity is reached (well, because we can't send an L1 batch that exceeds capacity).
2. Timeout has passed. We do not have a precise estimate on the timeout for now.
Users require a timeout season to ensure that their transactions become final on L1 on time.
Imagine if there weren't a timeout, users would send some transactions, and the load would be very low to fill an L1 batch capacity, resulting in users waiting for finality for days.

### Hashes

Block hash in zkSync are deterministic and are derived from the following formula: "keccak256(l2_block_number)".
The reason for having a deterministic block hash is that these hashes are not provable (remember that L2 blocks are not submitted to L1). 
<<<<<<< HEAD
Projects are advised not to use the L2 block hash as a source of randomness.
=======
Projects are advised not the use the L2 block hash as a source of randomness.
>>>>>>> 413f291 (blocks)

### Block Properties
- Timestamp: The current block's creation time as seconds since the Unix epoch
- Block number: The unique sequential number for this block.
- Gas limit: The current block gas limit, always returns `2^32-1`.
- Coinbase:  The current block miner’s address, returns the [bootloader](../contracts/system-contracts.md#bootloader) address.
- Difficulty: The current block difficulty, returns `2500000000000000` (zkSync does not have proof of work consensus).
