# Confirmations and finality

On zkSync, each transaction is at one of the four stages:

- `Pending`: The transaction was received by the operator, but it has not been processed yet.
- `Processed`: The transaction is processed by the operator and is confirmed to be included in the next block.
- `Committed`: The transaction state diffs were published on Ethereum.
- `Finalized`: The SNARK validity proof for the transaction has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours at the current stage.

Please note that for developer convenience, we usually treat the `Processed` and `Committed` states as a single stage called `Committed` since they have no difference from the UX/DexEx standpoints.
