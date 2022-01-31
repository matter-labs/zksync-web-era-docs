# Confirmations and finality

On zkSync, each transaction is one of the four stages:

- `Pending`. The transaction was received by the operator, but it has not been processed yet.
- `Processed`. The transaction is proceesed by the server and is confirmed to be included in the next block.
- `Committed`. The transaction state diffs were published on Ethereum.
- `Finalized`. The SNARK validity proof has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours.

Please note that for developer convenience, we will usually treat the `Processed` and `Committed` states as a single stage called `Committed` since they have no difference from the UX/DexEx standpoints.
