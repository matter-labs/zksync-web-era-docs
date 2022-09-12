# Block numbers and time

On ZkSync there are two types of blocks: L2 blocks and L1 batches.

## L2 blocks

L2 block is similar to a common block on L1.
L2 block time is almost constant, like a few seconds.
In this documentation by default the word "block" actually
means "L2 block" including API.
L2 block hash is deterministic
and is basically equal to `keccak256(bytes4(l2_block_number))`.

## L1 batches

L1 batch is a range of L2 blocks that are committed
and finalized on L1 as one whole.
L1 batch time can be different: from minutes to several hours
depending on the system load.
While executing code block properties (`block.number`, `block.hash`, `block.timestamp`, etc)
are actually the properties of the current L1 batch.
