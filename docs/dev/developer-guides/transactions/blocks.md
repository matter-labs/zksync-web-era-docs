# Blocks

A block is an ordered list of transactions. Each block (except for the Genesis block) points to the previous block it extends, thus creating a chain of blocks.

## Blocks in zkSync 2.0

In zkSync there are two notions of "blocks": an L2 block and an L1 rollup block.

L2 blocks, or just "blocks", are simply the blocks created on L2, that is on the zkSync network. They are not included on the Ethereum chain. An L1 rollup block, which we call "batch", is a set of 
consecutive (L2) blocks, it contains all the transactions, and in the same order, from the first block in the batch to the last block in the 
batch.

L1 batches, as the name suggests, are submitted to Ethereum. The main reason to have these different notions is that a block can 
contain a minimal number of transactions, and thus be processed quickly, while in a batch we would like to include many transactions, to make the cost of interaction with L1 spread among many transactions.

## Block numbers

Accessing block numbers within zkSync API is similar to how you would do it on Ethereum. For example, `eth_blockNumber` returns the number 
of the latest L2 block, and `eth_getBlockByNumber`, given a block number, returns the information about the requested block.

For L1 batches, to retrieve the latest batch number, use zkSync API method `zks_L1BatchNumber`.
Additionally, by querying on a block, you can see the batch number for the batch that includes the block. 
Within transaction receipts, the field `l1BatchNumber` is the batch number that includes the transaction.
The field `l1BatchTxIndex` returns the transaction position among all of the batch transactions.

## Block processing time

Transactions are processed immediately by the operator and added to blocks, which are then immediately generated. Once zkSync becomes
fully decentralised, block time will take a couple of seconds, as the involved entities need to achieve consensus.

Batch time, in general, depends on the system activity - the more active the system has, the faster we <em>seal</em> a batch.
There are several criteria for sealing a batch, which we defer from explaining in detail here, as the system is still under testing and 
these may change. 
In general, a batch will get sealed when:
1. The batch "capacity" is reached. Capacity includes L1 gas used, L2 ergs consumed and several other parameters. 
2. The batch timeout has passed.

After submitting transactions, users can check where in the process their transaction is as explained [here](../../fundamentals/zkSync.md#zksync-overview).

### Hashes

Block hashes in zkSync are deterministic and are derived from the following formula: "keccak256(l2_block_number)".
The reason for having a deterministic block hash is that these hashes are not provable (remember that L2 blocks are not submitted to L1). 
Projects are advised not to use the L2 block hash as a source of randomness.

### Block Properties
- Timestamp: The current block's creation time in seconds since the Unix epoch
- Block number: The unique sequential number for this block.
- Gas limit: The current block gas limit, always returns `2^32-1`.
- Coinbase:  The current block miner’s address, returns the [bootloader](../contracts/system-contracts.md#bootloader) address.
- Difficulty: The current block difficulty, returns `2500000000000000` (zkSync does not have proof of work consensus).
