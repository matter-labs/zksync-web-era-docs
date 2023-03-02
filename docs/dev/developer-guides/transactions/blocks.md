# Blocks

A block is an ordered list of transactions. Each block (except for the Genesis block) points to the previous block it extends, thus creating a chain of blocks.

## Blocks in zkSync Era

In zkSync there are two notions of "blocks": an L2 block and an L1 rollup block.

L2 blocks, or just "blocks", are simply the blocks created on L2, that is on the zkSync network. They are not included on the Ethereum chain. An L1 rollup block, which we call "batch", is a set of
consecutive (L2) blocks, it contains all the transactions, and in the same order, from the first block in the batch to the last block in the
batch.

::: tip

Further, on this page the word 'blocks' refers to L2 blocks.

:::

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

Batch time, in general, depends on the system activity - the more activity the system has, the faster we <em>seal</em> a batch.
There are several criteria for sealing a batch, which we defer from explaining in detail here, as the system is still under testing and
these may change.
In general, a batch will get sealed when:

1. The batch "capacity" is reached. The capacity includes L1 gas used, L2 gas consumed and several other parameters.
2. The batch timeout has passed.

After submitting transactions, users can check where in the process their transaction is as explained [here](../../fundamentals/zkSync.md#zksync-overview).

### Empty Blocks

::: warning

We currently have empty blocks being shown on our block explorer, please note it's not a block explorer issue, but this happens by design.

Although this might be a short-term reality, it is important to consider the rationale behind this design.

:::

Each L1 batch (which comprises several L2 blocks) is executed in a single VM instance. The VM executes transactions one by one and then executes some code that has nothing to do with the last transaction but rather with the entire batch. Currently, the ETH collected from fees is transferred from the bootloader formal address to the block miner address. The issue is that this transfer emits an event (like any other transfer), hence, we included this event in an L2 block for it to be accessible via API.

We could add it in the latest L2 block in the L1 batch, but imagine the following scenario: if an L2 block was closed, but its L1 batch was not, and the node hasn't received any new transactions in a while, then the L1 batch must be closed by the timeout. If we add the event to the most recent closed block, it will modify the block, resulting in a sort of re-organization. 
To avoid this is why we built a purely fictional block containing the event only.

### Hashes

Block hashes in zkSync are deterministic and are derived from the following formula: "keccak256(l2_block_number)".
The reason for having a deterministic block hash is that these hashes are not provable (remember that L2 blocks are not submitted to L1).
Projects are advised not to use the L2 block hash as a source of randomness.
## Block Properties

## block.number and block.timestamp

Depending on where it's used, if `block.number` and `block.timestamp` is retrieved via the `zksync-web3` SDK, mini blocks values are returned. It is a special construct on zkSync Era to make sure that the transactions are processed promptly. This approach is similar in other L2s, where each transaction belongs to a separate block, (which we call mini blocks), while these mini blocks are gathered together into batches that get sent to L1.

In Solidity, `block.number` and `block.timestamp` returns the number and timestamp of the L1 batch respectively.
### zksync-web3 SDK

The following are the block properties returned when you use the `getBlock` method via the **zksync-web3** API.

| Parameter     | Description                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------|
| hash          | The hash of the block.                                                                                |
| parentHash    | It refers to the hash of the parent block in L2.                                                      |
| number        | The unique sequential number for this block.                                                          |
| timestamp     | The current block's creation time in seconds.                                                         |
| nonce         | A random number that's used as a base for an hash calculations.                                       |
| difficulty    | The current block difficulty returns 2500000000000000 (zkSync does not have proof of work consensus). |
| gasLimit      | The block gas limit, always returns `2^32-1`.                                                         |
| gasUsed       | The actual amount of gas used in this block.                                                          |
| transactions  | A list of all transactions included in the block.                                                     |
| baseFeePerGas | The EIP1559-like baseFee for this block.                                                              |

### Why do we return L2 blocks from API?

On zkSync Era we return L2 blocks from API because this is how all platforms, which include SDKs, Metamask and all other popular wallets can perceive our transactions as processed. It is expected that a transaction is processed once it is included in some block. That's why we need to produce L2 blocks faster than L1 batches.

### Why do we return L1 batches inside EVM?

In the past,`block.number` was a part of the VM and was provided once per batch and so we returned the number of the batch there.
Presently, we return the L2 block inside the zkEVM, but this value, just like L2 blocks, will be unprovable. We also likely won't have any meaningful value there. Unlike Ethereum blocks that contain some kind of commitment to the state of the chain, on zkSync Era these blocks won't have such commitment, because calculating the Merkle tree is too expensive to be done more often than once per batch.