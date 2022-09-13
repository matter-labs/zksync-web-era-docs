# Block numbers and time

On ZkSync there are two types of blocks: L2 blocks and L1 batches.

## L2 blocks

L2 block is similar to a common block on L1. L2 block time is almost constant, like a few seconds.
In this documentation by default the word "block" actually means "L2 block" including API.
L2 block hash is deterministic and is basically equal to `keccak256(bytes4(l2_block_number))`.

## L1 batches

L1 batch is a range of L2 blocks that are committed and finalized on L1 as one whole.
The purpose of introducing L1 batch conception is to achieve cost optimization by using the whole capacity we have.
Thus, L1 batch is sealed only if its capacity limit, or a timeout is reached.
That is why L1 batch time can be different: from minutes under the high load to several hours when the batch is closed by timeout.

Note, that it does not relate to L2 blocks, they are "cheap" and can be sealed fast.
For users, monitoring L1 batches might be interesting only in case they are waiting for finality on L1,
for all other cases they should use L2 blocks.

## `block` properties
While executing code block properties (`block.number`, `block.hash`, `block.timestamp`, etc) are actually the properties of the current L1 batch.
So, you shouldn't rely on the fact that they are changing every few seconds.
