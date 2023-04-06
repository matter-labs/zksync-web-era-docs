# Browse batches

Batches are groups of transactions that are processed and validated together in a single [block](../../../dev/developer-guides/transactions/blocks.md#blocks), before being added to the main blockchain. It increases the throughput of zkSync Era and reduce its transaction fees.

By grouping multiple transactions into a single batch, we significantly reduce the number of transactions that need to be processed and validated, this results in faster transaction processing times and lower fees for users interacting with zkSync Era.

![Browse batches!](../../../assets/images/batches.png "View batches on zkSync")

The block explorer home screen, by default, displays the 10 most recent batches in the chain.
View all batches for a more complete overview of recent batch, or click on a specific batch number for details on that batch.
The batches page is also accessible via the top menu.

## View all batches

You can click on a batch number to see all the details of that specific batch. If you want to browse more batches, click the [Batches](https://explorer.zksync.io/batches/) section of the navigation menu. Use the pagination to navigate to the next page.

However, if you have already left the homepage, you can always search for any batch by typing in the batch number.

Batches have almost same properties as blocks, like block headers and transactions.

1. The block header

- This shows brief information about this specific batch, as well as a link to the previous batch in the chain.

2. Transactions

- Lists of all the transactions that were included in this batch.

![Batches transactions!](../../../assets/images/batches-trx.png "View batches transactions")

Check for the [block header](./block-view.md#block-headers) and [transaction](./block-view.md#transactions) batch properties.
