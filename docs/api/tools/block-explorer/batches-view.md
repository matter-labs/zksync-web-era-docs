# Browse batches

Batches contain multiple transactions that are processed together in one [block](../../../dev/developer-guides/transactions/blocks.md#blocks) before they're added to the main blockchain. 

By putting multiple transactions in a single batch, we reduce the number of transactions that need to be processed and validated. This results in faster transaction processing times and lower fees for users interacting with zkSync Era.

![Browse batches!](../../../assets/images/batches.png "View batches on zkSync")

On the block explorer home screen, you see the 10 latest batches by default. If you want to see all recent batches, or the details of a specific batch, go to the batches page which is accessible from the top menu.

## See all batches

View the details of a specific batch by clicking on its batch number on the [Batches](https://explorer.zksync.io/batches/) page.

To see more batches, use the pagination at the bottom to navigate through the pages. 

Use the search function on the explorer dashboard to search for a batch by its batch number. 

Batches are similar to blocks and have properties like block headers and transactions.

1. The block header

- This shows brief information about this specific batch, as well as a link to the previous batch in the chain.

2. Transactions

- Lists of all the transactions that were included in this batch.

![Batches transactions!](../../../assets/images/batches-trx.png "View batches transactions")

Check for the [block header](./block-view.md#block-headers) and [transaction](./block-view.md#transactions) batch properties.
