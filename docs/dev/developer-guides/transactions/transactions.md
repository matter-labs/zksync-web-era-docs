## When does a transaction become final?

In the context of blockchain network, **transaction finality** refers to the guarantee that transactions cannot be reverted, altered or mutated.

On Ethereum, as in Bitcoin, finality is probabilistic, i.e. the more blocks that passed since the transaction was processed, the lesser the chance that this transaction will be reverted.

In zk rollups, once a block has been filled and sealed, its state is committed to the main Ethereum chain. The proving step is then initiated, and a SNARK validity proof is generated for all the block transactions. Once completed, the SNARK is submitted for verification on the L1 smart contract, and after being verified, the transaction state becomes final.

Note that _finality_ from the zkSync perspective happens when the transaction (the SNARK verification) is processed by L1. At this stage, the guarantees are exactly like any other L1 transaction within the same L1 block; the more L1 blocks that generated after the initial block is processed, the lesser the chance that this transaction will be reverted.

At the moment, when a user sends a transaction, zkSync waits for the entire block to be filled, meaning finality time may take longer depending on the volume of transactions being submitted via zkSync. As throughput increases, the finality time will subsequently decrease.

# Transaction types

zkSync supports Ethereum's "legacy" (pre-EIP2718) transaction types, EIP1559 transaction type, and its custom EIP712 transactions. You can use transactions of this type to use zkSync-specific features like account abstraction. Additionally, it is only possible to deploy smart contracts with this type of transaction.

Knowing the details about the transaction format is not required to use zkSync's SDK, but if you are curious, you can read more about it [here](../../../api/api.md#eip712).

## What are operators?

**Operators** are the actors that perform basic ZK rollup functionalities. They are charged with creating blocks, bundling the transactions, performing the calculations and submitting the data to the main Ethereum chain for verification.