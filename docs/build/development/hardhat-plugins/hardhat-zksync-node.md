---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync In-memory Node | zkSync Era Docs
---

# hardhat-zksync-node

### Overview

`hardhat-zksync-node` is a Hardhat plugin for running a local zkSync In-memory node.

### Installation

{% tabs %}
{% tab title="yarn" %}

```bash
yarn add -D @matterlabs/hardhat-zksync-node
```

{% endtab %}

{% tab title="npm" %}

```bash
npm i -D @matterlabs/hardhat-zksync-node
```

{% endtab %}
{% endtabs %}

### Configuration

Import in your `hardhat.config.ts`.

```typescript
import "@matterlabs/hardhat-zksync-node";
```

### Commands

#### `yarn hardhat node-zksync`

Start a local zkSync In-memory node and JSON-RPC server.

**Parameters**

| Parameter                   | Description                           | Options                          | Default             |
| --------------------------- | ------------------------------------- | -------------------------------- | ------------------- |
| `--port`                    | Server listening port                 |                                  | `8011`              |
| `--log`                     | Log level                             | `error`, `warn`, `info`, `debug` | `info`              |
| `--log-file-path`           | Log file path                         |                                  | `era_test_node.log` |
| `--cache`                   | Cache type                            | `none`, `disk`, `memory`         | `disk`              |
| `--cache-dir`               | Disk cache directory                  |                                  | `.cache`            |
| `--reset-cache`             | Reset local disk cache                |                                  |                     |
| `--show-calls`              | Call debug info                       | `none`, `user`, `system`, `all`  | `none`              |
| `--show-storage-logs`       | Storage logs                          | `none`, `read`, `write`, `all`   | `none`              |
| `--show-vm-details`         | VM details                            | `none`, `all`                    | `none`              |
| `--show-gas-details`        | Gas details                           | `none`, `all`                    | `none`              |
| `--resolve-hashes`          | Resolve ABI & topic names             |                                  |                     |
| `--dev-use-local-contracts` | Use locally compiled system contracts |                                  |                     |
| `--fork`                    | Fork from network                     | `testnet`, `mainnet`, URL        |                     |
| `--fork-block-number`       | Fork from specific block number       |                                  |                     |
| `--replay-tx`               | Replay a transaction hash             |                                  |                     |

**Restrictions**

- `--replay-tx` and `--fork-block-number` cannot be used together.
- `--fork` is required if `--replay-tx` or `--fork-block-number` is used.

### Additional Information

- In-memory node documentation
- Supported APIs
