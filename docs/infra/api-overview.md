---
head:
  - - meta
    - name: "twitter:title"
      content: API Overview | zkSync Docs
---

# API Overview

:::info
The API exposed by the zkSync node is designed to be Web3-compliant. Any deviation from the Ethereum behavior is likely unintended, and we encourage users to report such discrepancies.
:::

### `eth_` Namespace

Data getters in this namespace operate in the L2 domain. They deal with L2 block numbers, check balances in L2, and more.

| Method                                    | Notes                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `eth_blockNumber`                         |                                                                                    |
| `eth_chainId`                             |                                                                                    |
| `eth_call`                                |                                                                                    |
| `eth_estimateGas`                         |                                                                                    |
| `eth_gasPrice`                            |                                                                                    |
| `eth_newFilter`                           | Maximum amount of installed filters is configurable                                |
| `eth_newBlockFilter`                      | Same as above                                                                      |
| `eth_newPendingTransactionsFilter`        | Same as above                                                                      |
| `eth_uninstallFilter`                     |                                                                                    |
| `eth_getLogs`                             | Maximum amount of returned entities can be configured                              |
| `eth_getFilterLogs`                       | Same as above                                                                      |
| `eth_getFilterChanges`                    | Same as above                                                                      |
| `eth_getBalance`                          |                                                                                    |
| `eth_getBlockByNumber`                    |                                                                                    |
| `eth_getBlockByHash`                      |                                                                                    |
| `eth_getBlockTransactionCountByNumber`    |                                                                                    |
| `eth_getBlockTransactionCountByHash`      |                                                                                    |
| `eth_getCode`                             |                                                                                    |
| `eth_getStorageAt`                        |                                                                                    |
| `eth_getTransactionCount`                 |                                                                                    |
| `eth_getTransactionByHash`                |                                                                                    |
| `eth_getTransactionByBlockHashAndIndex`   |                                                                                    |
| `eth_getTransactionByBlockNumberAndIndex` |                                                                                    |
| `eth_getTransactionReceipt`               |                                                                                    |
| `eth_protocolVersion`                     |                                                                                    |
| `eth_sendRawTransaction`                  |                                                                                    |
| `eth_syncing`                             | zkSync node is considered synced if it's less than 11 blocks behind the main node. |
| `eth_coinbase`                            | Always returns a zero address                                                      |
| `eth_accounts`                            | Always returns an empty list                                                       |
| `eth_getCompilers`                        | Always returns an empty list                                                       |
| `eth_hashrate`                            | Always returns zero                                                                |
| `eth_getUncleCountByBlockHash`            | Always returns zero                                                                |
| `eth_getUncleCountByBlockNumber`          | Always returns zero                                                                |
| `eth_mining`                              | Always returns false                                                               |

### **PubSub**

This is exclusively available on the WebSocket servers.

| Method             | Notes                                           |
| ------------------ | ----------------------------------------------- |
| `eth_subscribe`    | Maximum amount of subscriptions is configurable |
| `eth_subscription` |                                                 |

### `net_` Namespace

| Method           | Notes                |
| ---------------- | -------------------- |
| `net_version`    |                      |
| `net_peer_count` | Always returns 0     |
| `net_listening`  | Always returns false |

### `web3_` Namespace

| Method               | Notes |
| -------------------- | ----- |
| `web3_clientVersion` |       |

### `debug_` Namespace\*\*

This namespace provides a set of non-standard RPC methods for developers to inspect and debug calls and transactions. By default, this namespace is disabled but can be activated using the `EN_API_NAMESPACES` setting. Please refer to the configuration section for more details.;

| Method                     | Notes |
| -------------------------- | ----- |
| `debug_traceBlockByNumber` |       |
| `debug_traceBlockByHash`   |       |
| `debug_traceCall`          |       |
| `debug_traceTransaction`   |       |

### `zks` Namespace

This namespace holds rollup-specific extensions to the Web3 API. Only the methods documented are deemed public. Other methods in this namespace, though exposed, are not stable and may change without notice.

| Method                        | Notes |
| ----------------------------- | ----- |
| `zks_estimateFee`             |       |
| `zks_estimateGasL1ToL2`       |       |
| `zks_getAllAccountBalances`   |       |
| `zks_getBlockDetails`         |       |
| `zks_getBridgeContracts`      |       |
| `zks_getBytecodeByHash`       |       |
| `zks_getConfirmedTokens`      |       |
| `zks_getL1BatchBlockRange`    |       |
| `zks_getL1BatchDetails`       |       |
| `zks_getL2ToL1LogProof`       |       |
| `zks_getL2ToL1MsgProof`       |       |
| `zks_getMainContract`         |       |
| `zks_getRawBlockTransactions` |       |
| `zks_getTestnetPaymaster`     |       |
| `zks_getTokenPrice`           |       |
| `zks_getTransactionDetails`   |       |
| `zks_L1BatchNumber`           |       |
| `zks_L1ChainId`               |       |

### `en` Namespace

This namespace includes methods that zkSync nodes call on the main node during syncing. If this namespace is active, other zkSync nodes can sync using this node.
