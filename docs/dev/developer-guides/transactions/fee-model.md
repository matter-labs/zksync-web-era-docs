# Fee mechanism

zkSync's version of `gas` is called `ergs` and represents not only the costs of computations but also the cost of publishing data on-chain and affecting storage. Similar to `gas`, `ergs` is an absolute unit. VM operations (`add`, `mul`, etc.) will also have their costs measured in `ergs`, and they may not be equal to each other. The actual table of operation costs in `ergs` is yet to be defined.

Since the costs for publishing the calldata on L1 are very volatile, the number of `ergs` needed for changing a storage slot is not constant. For each block, the operator defines the following dynamic parameters:

- `ergs_price` — the table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token.
- `ergs_per_pubdata` — the price in `ergs` for publishing one byte of data to Ethereum.

**Please note that the public data is published only for state diffs.** If the same storage slot is updated 10 times in the same rollup block, only the final update will be published on Ethereum, thus only charging for public data once.

### Why do we need a different fee model?

- **Why `ergs` and not gas?**

We want to show the clear distinction between our fee model and the Ethereum one. Also, unlike Ethereum, where most of the opcodes have very distinct gas prices, basic zkEVM opcodes will likely have similar `ergs` prices. Generally, the execution itself (arithmetic operations, which do not involve storage updates) is very cheap. As in Ethereum, most of the cost is incurred for storage updates.

- **Why can't we have a constant price for storage value?**

As part of the zk rollup security model, zkSync periodically publishes state diffs on Ethereum. The price of that is defined by Ethereum gas price and, as stated, is very volatile. This is why the operator can define the new price in `ergs` for publishing pubdata for each block. Users can provide a cap on the `ergs_per_pubdata` in the [EIP712](../../../api/api.md#eip712) transactions.

### What does this mean to me?

Despite the differences, the fee model is quite similar to the one of Ethereum; the most costly operation is storage change. One of the advantages of zk rollups over optimistic rollups is that, instead of publishing all the transaction data, zk rollups can publish only state diffs, thus making fewer storage changes.

As already stated, if the same storage slot is updated several times in a single block, only the last update will be published on Ethereum, and the cost of storage change will only be charged once; but it goes beyond simple storage slots. For example, a DEX and a `PairFactory` factory for different `Pair` pools. The contract bytecode of `Pair` needs to be published only when the first instance is deployed. After the code of the `Pair` was published once, the subsequent deployments will only involve changing one storage slot -- to set the contract code hash on the newly deployed `Pair`'s address.

So the tips to make the most out of the zkSync fee system are the following:

- **Update storage slots as little as possible.** The cost for execution is a lot smaller than the cost of storage updates.
- **Reuse as many storage slots as possible.** Only the state diff is published on Ethereum.
- **Users should share as many storage slots as possible.** If 100 users update a storage slot of your contract in a single block, the diff will be published only once. In the future, we will introduce reimbursement for the users, so that the costs for updating shared storage slots are split between the users.
- **Reuse the contract code if possible.** On Ethereum, avoiding constructor parameters and putting them into constants reduces some of the gas costs upon contract deployment. On zkSync the opposite is true: deploying the same bytecode for contracts, while changing only constructor parameters can lead to substantial fee savings.