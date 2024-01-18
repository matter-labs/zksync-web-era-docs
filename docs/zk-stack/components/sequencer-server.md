---
head:
  - - meta
    - name: "twitter:title"
      content: Sequencer / Server | zkSync Docs
---

# Sequencer / Server

The zkSync Sequencer is actually a collection of services and functions acting in coordination to monitor L1, maintain L2 state, and order incoming transactions.

Its modules are [here](https://github.com/matter-labs/zksync-era) and are also described below:

## RPC Services

This is the main interface for users to interact with the server.

It includes:

- `HttpApi` - HTTP public Web3 API

- `WsApi` - WebSocket Web3 API (including PubSub)

## ETH Operator

This module is responsible for interacting with the L1. It acts as both an observer and agent executing transactions. It includes:

- `EthWatcher` - Monitor the base layer for specific events, such as Deposits or System Upgrades.

- `EthTxAggregator` - Aggregates batches to send to L1 and prepares the transaction to send it, requiring operations such as
  `commit_blocks`, `prove_blocks` and `execute_blocks`.

- `EthTxManager` - Signs and sends L1 transactions prepared by `EthTxAggregator`. It's responsible for monitoring and resending transactions if they fail for any reason (for example, low gas price).

## Sequencer

Component that takes a list of incoming transactions on zkSync and packs them into blocks and batches. The sequencer makes sure each transaction fits within the constraints required by our proving system. After a batch is collected, the sequencer executes them on the zkEVM.

It includes:

- `Tree` and `TreeBackup` - Maintains a local RocksDB instance with the complete L2 storage tree, computing the latest state root hash.

- `StateKeeper` - Executes the transactions and saves sealed blocks to the local RocksDB instance.

## Contract Verification API

The service that receives smart contract verification requests, validates them and provides the code/ABIs for verified contracts.
