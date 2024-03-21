---
head:
  - - meta
    - name: "twitter:title"
      content: In-memory Node | zkSync Era Docs
---

# In-memory node

This documentation provides instructions on setting up and using the In-Memory Node, `era-test-node`, for local testing. It covers installation, network forking, transaction details viewing, replaying transactions, and testing local bootloader and system contracts.

:::warning Tool in alpha stage
Please keep in mind that `era-test-node` is still in its **alpha** stage, so some features might not be fully supported yet and may not work as fully intended. It is [open-sourced](https://github.com/matter-labs/era-test-node) and contributions are welcomed.
:::

## Understanding the In-Memory Node

The In-memory node uses an in-memory database for storing state information and simplified hashmaps for tracking blocks and transactions. In fork mode, it retrieves missing storage data from a remote source when not available locally. Moreover it also uses the remote server (openchain) to resolve the ABI and topics to human readable names.

You can visit the `era-test-node` repository [here](https://github.com/matter-labs/era-test-node) to learn more.

## Running with `zksync-cli`

You can setup In-Memory Node quickly with `npx zksync-cli dev start`. Note: at the moment this method won't allow you to use additional features like forking networks or replaying transactions.

## Installing and setting up `era-test-node`

1. Download `era-test-node` from latest [Release](https://github.com/matter-labs/era-test-node/releases/latest)

2. Extract the binary and mark as executable:

   ```bash
   tar xz -f /path/to/downloaded/binary/era_test_node.tar.gz -C /usr/local/bin/
   chmod +x /usr/local/bin/era_test_node
   ```

3. Start the node:

   ```bash
   era_test_node run
   ```

The expected output will be as follows:

```log
12:34:56 [INFO] Starting network with chain id: L2ChainId(260)
12:34:56 [INFO] Rich Accounts
12:34:56 [INFO] =============
12:34:56 [INFO] Account #0: 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 (1_000_000_000_000 ETH)
12:34:56 [INFO] Private Key: 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
12:34:56 [INFO]
12:34:56 [INFO] Account #1: 0xa61464658AfeAf65CccaaFD3a512b69A83B77618 (1_000_000_000_000 ETH)
12:34:56 [INFO] Private Key: 0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3

...

12:34:56 [INFO] Account #9: 0xE90E12261CCb0F3F7976Ae611A29e84a6A85f424 (1_000_000_000_000 ETH)
12:34:56 [INFO] Private Key: 0x3eb15da85647edd9a1159a4a13b9e7c56877c4eb33f614546d4db06a51868b1c
12:34:56 [INFO]
12:34:56 [INFO] ========================================
12:34:56 [INFO]   Node is ready at 127.0.0.1:8011
12:34:56 [INFO] ========================================
```

:::warning
When utilizing `era-test-node` with MetaMask, it's essential to note that any restart of the in-memory node will necessitate a reset of MetaMask's cached account data (nonce, etc). To do this, navigate to 'Settings', then 'Advanced', and finally, select 'Clear activity tab data'.
:::

### Network details

The `era_test_node` has the following default network configurations:

- **L2 RPC:** `http://localhost:8011`
- **Network Id:** 260

These can be configured to your preference.

::: warning
Please note that the existing implementation does not facilitate communication with Layer 1. As a result, an L1 RPC is not available.
:::

## Forking networks

To fork the mainnet, use the following command:

```bash
era_test_node fork mainnet
```

:::tip
You can also fork the zkSync Sepolia testnet with `era_test_node fork sepolia-testnet`
:::

The expected output will be similar to the following:

```log
14:50:12  INFO Creating fork from "https://mainnet.era.zksync.io:443" L1 block: L1BatchNumber(356201) L2 block: 21979120 with timestamp 1703083811, L1 gas price 41757081846 and protocol version: Some(Version18)
14:50:12  INFO Starting network with chain id: L2ChainId(260)
14:50:12  INFO
14:50:12  INFO Rich Accounts
14:50:12  INFO =============
14:50:16  INFO Account #0: 0xBC989fDe9e54cAd2aB4392Af6dF60f04873A033A (1_000_000_000_000 ETH)
14:50:16  INFO Private Key: 0x3d3cbc973389cb26f657686445bcc75662b415b656078503592ac8c1abb8810e
14:50:16  INFO Mnemonic: mass wild lava ripple clog cabbage witness shell unable tribe rubber enter
14:50:16  INFO
14:50:16  INFO Account #1: 0x55bE1B079b53962746B2e86d12f158a41DF294A6 (1_000_000_000_000 ETH)
14:50:16  INFO Private Key: 0x509ca2e9e6acf0ba086477910950125e698d4ea70fa6f63e000c5a22bda9361c
14:50:16  INFO Mnemonic: crumble clutch mammal lecture lazy broken nominee visit gentle gather gym erupt

...

14:50:19  INFO Account #9: 0xe2b8Cb53a43a56d4d2AB6131C81Bd76B86D3AFe5 (1_000_000_000_000 ETH)
14:50:19  INFO Private Key: 0xb0680d66303a0163a19294f1ef8c95cd69a9d7902a4aca99c05f3e134e68a11a
14:50:19  INFO Mnemonic: increase pulp sing wood guilt cement satoshi tiny forum nuclear sudden thank
14:50:19  INFO
14:50:19  INFO ========================================
14:50:19  INFO   Node is ready at 127.0.0.1:8011
14:50:19  INFO ========================================
```

This command starts the node, forked at the current head of the testnet.

You also have the option to specify a custom http endpoint and a custom forking height, like so:

```bash
# Usage: era_test_node fork --fork-at <FORK_AT> <NETWORK>
era_test_node fork --fork-at 7000000 mainnet http://172.17.0.3:3060
```

## Replay remote transactions locally

If you wish to replay a remote transaction locally for deep debugging, use the following command:

```bash
# Usage: era_test_node replay_tx <NETWORK> <TX>
era_test_node replay_tx sepolia-testnet 0x7119045573862797257e4441ff48bf5a3bc4d133a00d167c18dc955eda12cfac
```

For more detailed transaction information, such as call traces, add the `--show-calls` flag. If you want to see ABI names, add the `--resolve-hashes` flag. Here's an example:

```bash
# Usage: era_test_node replay_tx <NETWORK> <TX>
era_test_node --show-calls=user --resolve-hashes replay_tx sepolia-testnet 0x7119045573862797257e4441ff48bf5a3bc4d133a00d167c18dc955eda12cfac
```

Alternatively (if your node is already running) you can use `config_setShowCalls` and `config_setResolveHashes` RPC endpoints to configure these values. Here's an example:

```bash
# era_test_node already running...

# Set show-calls to User
curl --request POST \
  --url http://localhost:8011/ \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0","id": "1","method": "config_setShowCalls","params": ["user"]}'

# Enable resolve-hashes
curl --request POST \
  --url http://localhost:8011/ \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0","id": "1","method": "config_setResolveHashes","params": [true]}'
```

Here's an example of what you should expect to see when `show-calls` and `resolve-hashes` are configured:

```log
Creating fork from "https://sepolia.era.zksync.dev:443" L1 block: L1BatchNumber(4513) L2 block: 14945 with timestamp 1703064786, L1 gas price 61083275326 and protocol version: Some(Version19)
Starting network with chain id: L2ChainId(300)
Running 1 transactions (one per batch)

Validating 0x7119045573862797257e4441ff48bf5a3bc4d133a00d167c18dc955eda12cfac
Executing 0x7119045573862797257e4441ff48bf5a3bc4d133a00d167c18dc955eda12cfac
┌─────────────────────────┐
│   TRANSACTION SUMMARY   │
└─────────────────────────┘
Transaction: SUCCESS
Initiator: 0x4eaf936c172b5e5511959167e8ab4f7031113ca3
Payer: 0x4eaf936c172b5e5511959167e8ab4f7031113ca3
Gas - Limit: 2_487_330 | Used: 969_330 | Refunded: 1_518_000
Use --show-gas-details flag or call config_setShowGasDetails to display more info

==== Console logs:

==== 22 call traces.  Use --show-calls flag or call config_setShowCalls to display more info.
  Call(Normal) 0x4eaf936c172b5e5511959167e8ab4f7031113ca3           validateTransaction(bytes32, bytes32, tuple)   1830339
    Call(Normal) 0x0000000000000000000000000000000000000001                 0x89c19e9b   1766835
  Call(Normal) 0x4eaf936c172b5e5511959167e8ab4f7031113ca3           payForTransaction(bytes32, bytes32, tuple)   1789767
  Call(Normal) 0x4eaf936c172b5e5511959167e8ab4f7031113ca3           executeTransaction(bytes32, bytes32, tuple)   1671012
      Call(Mimic) 0x5d4fb5385ed95b65d1cd6a10ed9549613481ab2f           0x   1443393

==== 4 events
EthToken System Contract
  Topics:
    Transfer(address,address,uint256)
    0x0000000000000000000000004eaf936c172b5e5511959167e8ab4f7031113ca3
    0x0000000000000000000000000000000000000000000000000000000000008001
  Data (Hex): 0x000000000000000000000000000000000000000000000000000c31dac51a6200

EthToken System Contract
  Topics:
    Transfer(address,address,uint256)
    0x0000000000000000000000000000000000000000000000000000000000008001
    0x0000000000000000000000004eaf936c172b5e5511959167e8ab4f7031113ca3
  Data (Hex): 0x0000000000000000000000000000000000000000000000000009fc4d1bd4ad00

EthToken System Contract
  Topics:
    Transfer(address,address,uint256)
    0x0000000000000000000000004eaf936c172b5e5511959167e8ab4f7031113ca3
    0x0000000000000000000000005d4fb5385ed95b65d1cd6a10ed9549613481ab2f
  Data (Hex): 0x0000000000000000000000000000000000000000000000000090f705956a4008

EthToken System Contract
  Topics:
    Transfer(address,address,uint256)
    0x0000000000000000000000000000000000000000000000000000000000008001
    0x0000000000000000000000004eaf936c172b5e5511959167e8ab4f7031113ca3
  Data (Hex): 0x000000000000000000000000000000000000000000000000000159273ab13800
```

## Sending network calls

You can send network calls against a running `era-test-node`. You can check the Sepolia testnet LINK balance or mainnet USDT using `curl` or [foundry-zksync](https://github.com/matter-labs/foundry-zksync).

To get started, launch the local in-memory node:

```bash
era_test_node fork sepolia-testnet
```

Next, use curl to send a network call:

```bash
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0xe1134444211593Cfda9fc9eCc7B43208615556E2", "data":"0x313ce567"}, "latest"],"id":1}' http://localhost:8011
```

Here's an example of what you should expect to see:

```bash
{"jsonrpc":"2.0","result":"0x0000000000000000000000000000000000000000000000000000000000000012","id":1}
```

Or, if you prefer, use [`foundry-zksync`](https://github.com/matter-labs/foundry-zksync). Make sure to install and configure `foundry-zksync` before proceeding (for installation instructions, please see this [link](https://github.com/matter-labs/foundry-zksync/tree/main#foundry-with-zksync-era-v01)):

```bash
zkcast call 0xe1134444211593Cfda9fc9eCc7B43208615556E2 "name()(string)" --rpc-url http://localhost:8011
```

Here's an example of what you should expect to see:

```bash
Uniswap
```

Retrieve the balance of a particular contract:

```bash
zkcast call 0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78 "balanceOf(address)(uint256)"  0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78  --rpc-url http://localhost:8011
```

Here's an example of what you should expect to see:

```bash
28762283719941475444443116625665
```

### Deploying contracts

For the deployment of your contracts, you have the flexibility to choose between two preferred methods: either by using Hardhat with the `hardhat-zksync-deploy` and `hardhat-zksync-solc` plugins, or via `foundry-zksync`. The following example will detail the process using `foundry-zksync`.

Before proceeding, ensure that you've compiled your contracts using `zkforge zk-build`. For instructions on how to do this, please refer to this [link](https://github.com/matter-labs/foundry-zksync#compile-with-zkforge-zk-build).

```bash
zkforge zkc contracts/Greeter.sol:Greeter --constructor-args "ZkSync and Foundry" --private-key 7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110 --rpc-url http://localhost:8011 --chain 260
```

Here's an example of what you should expect to see:

```bash
Deploying contract...
+-------------------------------------------------+
Contract successfully deployed to address: 0x0a40ecde17dc16c4001bf0e4f5d5ff1818219b3b
Transaction Hash: 0x9d59bea38ca6f3cef365c23f339547bcc8ce28abb8344999ffffa5fa62c9ff8e
Gas used: 2570407
Effective gas price: 500
Block Number: 8072361
+-------------------------------------------------+
```

## Testing bootloader and system contracts

In-memory node allows testing of the currently compiled bootloader and system contracts. This makes it possible to examine the effects of changes on already deployed contracts.

:::warning
These commands assume you have set `$ZKSYNC_HOME` in your shell profile file (e.g. ~/.bash_profile, ~/.zshrc) to target your local copy of `era-test-node`. For instance,

```bash
# Add path here:
export ZKSYNC_HOME=/path/to/era-test-node

export PATH=$ZKSYNC_HOME/bin:$PATH
```

:::

Firstly, you will need to preprocess and compile the contracts:

```bash
cd etc/system-contracts
yarn preprocess && yarn hardhat run ./scripts/compile-yul.ts
```

To use the locally compiled bootloader and system contracts, run:

```bash
RUST_LOG=vm=trace era_test_node --dev-use-local-contracts fork sepolia-testnet
```

## Use pre-configured rich wallets

In-Memory node includes pre-configured "rich" accounts for testing:

| Account Address                              | Private Key                                                          |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `0x36615Cf349d7F6344891B1e7CA7C72883F5dc049` | `0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110` |
| `0xa61464658AfeAf65CccaaFD3a512b69A83B77618` | `0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3` |
| `0x0D43eB5B8a47bA8900d84AA36656c92024e9772e` | `0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e` |
| `0xA13c10C0D5bd6f79041B9835c63f91de35A15883` | `0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8` |
| `0x8002cD98Cfb563492A6fB3E7C8243b7B9Ad4cc92` | `0xf12e28c0eb1ef4ff90478f6805b68d63737b7f33abfa091601140805da450d93` |
| `0x4F9133D1d3F50011A6859807C837bdCB31Aaab13` | `0xe667e57a9b8aaa6709e51ff7d093f1c5b73b63f9987e4ab4aa9a5c699e024ee8` |
| `0xbd29A1B981925B94eEc5c4F1125AF02a2Ec4d1cA` | `0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959` |
| `0xedB6F5B4aab3dD95C7806Af42881FF12BE7e9daa` | `0x74d8b3a188f7260f67698eb44da07397a298df5427df681ef68c45b34b61f998` |
| `0xe706e60ab5Dc512C36A4646D719b889F398cbBcB` | `0xbe79721778b48bcc679b78edac0ce48306a8578186ffcb9f2ee455ae6efeace1` |
| `0xE90E12261CCb0F3F7976Ae611A29e84a6A85f424` | `0x3eb15da85647edd9a1159a4a13b9e7c56877c4eb33f614546d4db06a51868b1c` |

## Writing and running tests locally

This section demonstrates how to author and execute tests locally against `era-test-node` using the `mocha` and `chai` testing frameworks.

### Project configuration

1. Start by creating a new Hardhat project. If you need guidance, follow the [getting started guide](../../build/tooling/hardhat/getting-started.md).

2. To incorporate the test libraries, execute:

```bash
yarn add -D mocha chai @types/mocha @types/chai
```

3. Add the following lines to your `package.json` in the root folder:

```json
"scripts": {
    "test": "NODE_ENV=test hardhat test"
}
```

This script makes it possible to run tests in a Hardhat environment with the `NODE_ENV` env variable set as `test`.

### Configuring tests

4. Adjust `hardhat.config.ts` to use the local node for testing:

:::warning
Ensure era-test-node is running in another process before executing yarn test.
:::

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: "http://localhost:8011",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};
```

### Writing test scripts

5. Now, create your first test! Construct a `test/main.test.ts` file with the following code:

```ts
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const provider = Provider.getDefaultProvider();

    const wallet = new Wallet(RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    const artifact = await deployer.loadArtifact("Greeter");
    const greeter = await deployer.deploy(artifact, ["Hi"]);

    expect(await greeter.greet()).to.eq("Hi");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
```

To run the test file, execute:

```bash
yarn test
```

Well done! You've successfully run your first local tests with zkSync Era and `era-test-node`.

## Troubleshooting

If running `era_test_node run` provides the following error:

```console:no-line-numbers
“era_test_node” can’t be opened because Apple cannot check it for malicious software.
This software needs to be updated. Contact the developer for more information.
```

You may require the use of `sudo`. On macOS, the binary may need to have its quarantine attribute cleared:

```bash
xattr -d com.apple.quarantine /usr/local/bin/era_test_node
```
