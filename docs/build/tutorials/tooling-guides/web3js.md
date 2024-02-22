---
head:
  - - meta
    - name: "twitter:title"
      content: Web3.js | zkSync Docs
---

# Web3.js

[Web3.js](https://web3js.org/) is a robust and flexible collection of libraries for TypeScript and JavaScript developers. It serves as an essential tool for connecting and crafting applications within the Ethereum ecosystem and can be extended to support other networks through its [plugin system](https://docs.web3js.org/guides/web3_plugin_guide/).

You can use the [zkSync plugin](https://github.com/web3/web3-plugin-zksync) for Web3.js to interact with the [zkSync JSON-RPC API](https://docs.zksync.io/build/api.html) smart contracts deployed on zkSync.

## Installation

Start by adding Web3.js and the zkSync plugin for Web3.js to your project. Open your terminal and execute the following command:

```bash
npm install --save web3 web3-plugin-zksync
```

This command installs the latest version of Web3.js and the zkSync plugin for Web3.js and adds them to your project's dependencies.

## Initial Setup

### Initialization

Before using the zkSync plugin for Web3.js, you need to [initialize Web3 with a provider](https://docs.web3js.org/#initialize-web3-with-a-provider) and [register the plugin](https://docs.web3js.org/guides/web3_plugin_guide/plugin_users#registering-the-plugin).

#### Example

```javascript
import { Web3 } from "web3";
import { ZkSyncPlugin } from "web3-plugin-zksync";

const zkSyncRpcUrl: string = "https://sepolia.era.zksync.dev";

console.log(`📞 Connecting to zkSync Era [${zkSyncRpcUrl}]`);
const web3: Web3 = new Web3(zkSyncRpcUrl);
web3.registerPlugin(new ZkSyncPlugin());
```

:::info

- This examples uses the zkSync Sepolia testnet.

:::

### Ethereum JSON-RPC API

Use the Web3.js `eth` package to fetch data from the zkSync [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc).

#### Fetch the Latest Block Number

```javascript
const blockNumber = await web3.eth.getBlockNumber();
console.log(`Current block number: ${blockNumber}`);
```

### zkSync L2-Specific JSON-RPC API

The zkSync plugin for Web3.js implements the zkSync-specific methods from the `zks_` namespace of the [JSON-RPC API](https://docs.zksync.io/build/api.html#zksync-era-json-rpc-methods).

#### Fetch the Main Contract Address

```javascript
const mainContract = await web3.zkSync.rpc.getMainContract();
console.log(`Main contract: ${mainContract}`);
```

### Wallet Configuration

Refer to the Web3.js documentation for [details regarding wallet configuration](https://docs.web3js.org/#setting-up-a-wallet).
