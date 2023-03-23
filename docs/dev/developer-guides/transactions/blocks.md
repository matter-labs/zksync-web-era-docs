# Blocks

A block is an ordered list of transactions. Each block (except for the Genesis block) points to the previous block it extends, thus creating a chain of blocks.

## Blocks in zkSync Era

In zkSync there are two notions of blocks:  L2 block and L1 rollup block.

L2 blocks, or just "blocks", are the blocks created on the L2, that is on the zkSync Era network, and they are not included on the Ethereum chain. 

On the other hand, L1 rollup blocks are batches of consecutive L2 blocks that contain all the transactions in the same order, from the first block to the last block in the batch.

L1 batches, as the name suggests, are submitted to Ethereum. The main reason to have these different notions is that a block can
contain a minimal number of transactions ([or none at all](#empty-blocks)), and thus be processed quickly, while in a batch we would like to include many transactions to spread the cost of interacting with L1 across all transactions.

## Block Properties


The following are the block properties returned when you use the `getBlock` method from the API using [any of our SDKs](../../../api/README.md#sdks).

| Parameter     | Description                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------|
| hash          | The hash of the block. null if pending                                                                                                 |
| parentHash    | It refers to the hash of the parent block in L2.                                                                        |
| number        | The number of the current block. null if pending. [More info on block.number](#block-number-and-timestamp-considerations)                                                                                     |
| timestamp     | The UNIX timestamp for when the block was collated. [More info on block.timestamp](#block-number-and-timestamp-considerations)                                                       |
| nonce         | It's the most recent transaction based on the account's counter, which maintains track of how many transactions it does. null if pending. |
| difficulty    | The current block difficulty returns 2500000000000000 (zkSync does not have proof of work consensus).                   |
| gasLimit      | The maximum gas allowed in this block encoded as a hexadecimal, always returns `2^32-1`.                                                                |
| gasUsed       | The actual amount of gas used in this block.                                                                            |
| transactions  | An array of transaction objects - please see [interface TransactionResponse](../../../api/js/providers.md#gettransaction) for exact shape                                                                     |
| baseFeePerGas | The EIP1559-like baseFee for this block.                                                                                |


## Processing times

When transactions are made on zkSync Era, they are processed right away and added to blocks, which are generated immediately. Once zkSync Era becomes fully decentralised, block time will take a couple of seconds, as the involved entities would need to achieve consensus.

The time it takes to seal an L1 batch depends on the system activity - the more activity the system has, the faster we <em>seal</em> a batch.
There are several criteria for sealing a batch, which we defer from explaining in detail here, as these may change.

In general, a batch will get sealed when:

1. The batch "capacity" is reached: the capacity includes L1 gas used, L2 gas consumed, and several other parameters.
2. The batch timeout has passed.

After submitting them, blocks will go through different stages as explained [here](../../fundamentals/zkSync.md#zksync-overview).

### Empty Blocks

::: warning

Our block explorer shows empty blocks. Please note it's not a block explorer issue, but this happens by design.

Although this might be a short-term reality, it is important to consider the rationale behind this design.

:::

Each L1 batch (which comprises several L2 blocks) is executed in a single VM instance. The VM executes transactions one by one and then executes some code that has nothing to do with the last transaction but rather with the entire batch. Currently, the ETH collected from fees is transferred from the bootloader formal address to the block miner address. This transfer emits an event (like any other transfer) which is included in an "empty" L2 block so it's accessible via API.

We could add it in the latest L2 block in the L1 batch, but imagine the following scenario: if an L2 block was closed, but its L1 batch was not, and the node hasn't received any new transactions in a while, then the L1 batch must be closed by the timeout. If we add the event to the most recent closed block, it will modify the block, resulting in a sort of re-organization. 

To avoid this, we built a purely fictional block containing only the event .

## Retrieving block and batch numbers

Accessing block numbers within zkSync API is similar to how you would do it on Ethereum. For example, `eth_blockNumber` returns the number of the latest L2 block, and `eth_getBlockByNumber`, given a block number, returns the information about the requested block.

For L1 batches, to retrieve the latest batch number, use zkSync API method `zks_L1BatchNumber`.
Additionally, by querying on a block, you can see the batch number for the batch that includes the block.
Within transaction receipts, the field `l1BatchNumber` is the batch number that includes the transaction.
The field `l1BatchTxIndex` returns the transaction position among all of the transactions included in a batch.


### Hashes

Block hashes in zkSync are deterministic and are derived from the following formula: "keccak256(l2_block_number)".
The reason for having a deterministic block hash is that these hashes are not provable (remember that L2 blocks are not submitted to L1).
Projects are advised not to use the L2 block hash as a source of randomness.


## Block number and timestamp considerations


The `number` and `timestamp` properties of the block retrieved via the API using any of the SDKs will refer to L2 blocks however, `block.number` and `block.timestamp` in the EVM (on smart contracts), return the number and timestamp of the L1 batch respectively.


### Why do we return L2 blocks from API?

On zkSync Era we return L2 blocks from API because this is how all platforms, which include SDKs, Metamask and all other popular wallets can perceive our transactions as processed. It is expected that a transaction is processed once it is included in a block. That's why we need to produce L2 blocks faster than L1 batches.

### Why do we return L1 batches inside EVM?

Currently, we return the number and timestamp of the L1 batch inside the VM, as the values related to the L2 block will be unprovable. Unlike Ethereum blocks that contain some kind of commitment to the state of the chain, on zkSync Era these blocks won't have such commitment, because calculating the Merkle tree is too expensive to be done more often than once per batch.

A method to retrieve the L2 block number and timestamp inside the EVM is under development.
