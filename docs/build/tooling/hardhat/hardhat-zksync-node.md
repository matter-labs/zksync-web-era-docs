---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-node | zkSync Docs
---

# `hardhat-zksync-node`

This plugin is used to provide a convenient way to run zkSync Era [In-memory node](../../test-and-debug/era-test-node.md) locally using hardhat.

::: warning Platform Restrictions

The zkSync Era In-memory node binaries are not supported on Windows at the moment. As an alternative, users can utilize the Windows Subsystem for Linux (WSL).

:::

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:
  - Compatible with ethers **v6** (⭐ Recommended)

:::

## Installation

[@matterlabs/hardhat-zksync-node](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-node)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-node zksync-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-node
```

:::

### Configuration

Import the plugin in the `hardhat.config.ts` file:

```javascript
import "@matterlabs/hardhat-zksync-node";
```

### Commands

```sh
yarn hardhat node-zksync
```

This command runs a local zkSync In-memory node by initiating a JSON-RPC server. It uses the provided or default configurations to set up and run the zkSync node, allowing for blockchain operations in a local environment. The command also handles tasks such as downloading the necessary JSON-RPC server binary if it's not already present.

- `--port` - Port on which the server should listen. Defaults to 8011.
- `--log` - Log filter level. Accepted values are: error, warn, info, and debug. Defaults to info.
- `--log-file-path` - Path to the file where logs should be written. Defaults to `era_test_node.log`.
- `--cache` - Type of cache to use. Accepted values are: none, disk, and memory. Defaults to disk.
- `--cache-dir` - Directory location for the `disk` cache. Defaults to `.cache`.
- `--reset-cache` - Flag to reset the local `disk` cache.
- `--show-calls` - Determines which call debug information to show. Accepted values are: none, user, system, and all. Defaults to none.
- `--show-storage-logs` - Determines which storage logs to show. Accepted values are: none, read, write, and all. Defaults to none.
- `--show-vm-details` - Specifies the level of Virtual Machine (VM) details to show. Accepted values are: none and all. Defaults to none.
- `--show-gas-details` - Specifies the level of gas details to show. Accepted values are: none and all. Defaults to none.
- `--resolve-hashes` - Flag to try contacting openchain to resolve the ABI & topic names. When enabled, it makes the debug log more readable but might decrease performance.
- `--dev-use-local-contracts` - Flag to load locally compiled system contracts. Useful when making changes to system contracts or bootloader.
- `--fork` - Starts a local network that is a fork of another network. Accepted values are: testnet, mainnet, or a specific URL.
- `--fork-block-number` - Specifies the block height at which to fork.
- `--replay-tx` - Transaction hash to replay.
- `--tag` - Specifies the zkSync era test node release to be used

::: warning Parameter Restrictions

The `--replay-tx` and `--fork-block-number` parameters cannot be specified simultaneously. The `--replay-tx` is used for replaying a remote transaction locally for deep debugging, while `--fork-block-number` is used for forking the blockchain at a specified block number. Combining these actions is not supported. <br>
Additionally, if either `--replay-tx` or `--fork-block-number` is specified, the `--fork` parameter must also be provided.

:::

::: tip Learn More

If you wish to learn more about replaying transactions or forking, check out the [In-memory node documentation](../../test-and-debug//era-test-node.md).

:::

::: tip Supported APIs

To see a list of all supported APIs, visit [this link ](https://github.com/matter-labs/era-test-node/blob/main/SUPPORTED_APIS.md).

:::

## Running Hardhat's test Task with hardhat-zksync-node

The `hardhat-zksync-node` plugin enhances Hardhat's test task, allowing all tests to run against an In-memory node operated in a separate process. By invoking the test task, ensure you are using the `hardhat` network and have set its `zksync` flag to `true`. Doing so will initiate the plugin's In-memory node alongside the tests. After the tests conclude, the node shuts down gracefully. The plugin begins port allocation from the default 8011.

```ts
networks: {
  hardhat: {
    zksync: true,
  }
},
```

The network object in the Hardhat runtime environment is also updated to match the running node as follows:

- The network name is set to `zkSyncEraTestNode`.
- The network config is set as an HTTP network config, adopting default values.
- The network provider uses a provider adapter that implements `EthereumProvider` and wraps the zksync's JS SDK Provider implementation.

::: warning Provider URL Mismatch

When running tests, be aware that the In-memory node attempts to allocate free ports (starting from the default 8011). This can lead to situations where the provider's URL does not match your expectations. It's strongly recommended to use the network config URL from the hardhat runtime environment to instantiate the Provider instance from the JS SDK, like this:

```typescript
const provider = new Provider(hre.network.config.url);
```

:::

::: info TypeScript Note

If TypeScript marks the 'url' property indicating a potential issue (even though it works), simply add the following import to your project:

```typescript
import "@matterlabs/hardhat-zksync-node/dist/type-extensions";
```

:::

::: note Accessing the Network Provider in Hardhat

Apart from the previously described method of instantiating the Provider, you can also directly access it from the Hardhat runtime environment. Due to incompatibilities between Hardhat's `EthereumProvider` and the JS SDK Provider, we've introduced a new adapter (`ZkSyncProviderAdapter`). This adapter bridges the gap and ensures that all the necessary functionalities are seamlessly integrated. If you wish to access the JS SDK Provider directly, you can do so in TypeScript with:

```typescript
// hre stands for hardhat runtime environment
(hre.network.provider as ZkSyncProviderAdapter)._zkSyncProvider;
```

:::
