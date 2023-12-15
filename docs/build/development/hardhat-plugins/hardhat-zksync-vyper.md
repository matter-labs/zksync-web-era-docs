---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Vyper | zkSync Era Docs
---

# hardhat-zksync-vyper

### **What is this** `hardhat-zksync-vyper`**?**

The [`hardhat-zksync-vyper`](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper) plugin provides an interface for compiling Vyper smart contracts for deployment on zkSync Era.

{% hint style="info" %}
To gain an understanding **why** vyper plugin is needed for zkSync compilation please refer to the documentation [here](https://era.zksync.io/docs/tools/compiler-toolchain/overview.html).
{% endhint %}

### **Installation**

Add the latest version of the plugin to your project:

::: code-tabs
@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```

:::

### Configuration

Import the package in your `hardhat.config.ts`:

```typescript
import "@matterlabs/hardhat-zksync-vyper";
import "@nomiclabs/hardhat-vyper";
```

**Default configuration**&#x20;

From version `v0.2.0` onwards, a default configuration has been introduced, making all parameters optional. Override default configurations by modifying values inside the `hardhat.config.ts` file.

<details>

<summary>Minimal config with default configuration</summary>

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
import "@matterlabs/hardhat-zksync-deploy";

const config: HardhatUserConfig = {
  zkvyper: {},
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true, // enables zksync in hardhat local network
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
  },
  // Currently only Vyper v0.3.3 and v0.3.9 versions are supported.
  vyper: {
    version: "0.3.3",
  },
};

export default config;
```

</details>

#### Advanced configuration

Inside the `hardhat.config.ts` file, add configuration parameters within a `zkvyper` property.

<details>

<summary>Example advanced config</summary>

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
import "@matterlabs/hardhat-zksync-deploy";

const config: HardhatUserConfig = {
  zkvyper: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zkvyper-bin/
    settings: {
      compilerPath: "zkvyper", // optional field with the path to the `zkvyper` binary.
      libraries: {}, // optional. References to non-inlinable libraries
    },
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true, // enables zksync in hardhat local network
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
  },
  // Currently only Vyper v0.3.3 and v0.3.9 versions are supported.
  vyper: {
    version: "0.3.3",
  },
};

export default config;
```

</details>

Configuration options and their details:

- `version`: The `zkvyper` compiler version. Default value is `latest`. Find the latest compiler versions in the [zkvyper repo](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource`: Indicates the compiler source and can be either `binary`. (A `docker` option is no longer recommended). If there is no previous installation, the plugin automatically downloads one.
- `compilerPath`: Optional field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used.
- `libraries`: Define any non-inlinable libraries your contracts use as dependencies here. Learn more about compiling libraries.

#### Network configuration

Configure the `zksync` parameter in the networks to enable the `zkvyper` compiler:

```ts
defaultNetwork: "zkSyncTestnet",
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL (optional).
    zksync: false, // disables zksolc compiler
  },
  zkSyncTestnet: {
    url: "https://testnet.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
    ethNetwork: "goerli", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true, // enables zksolc compiler
  }
},
```

The `zksync`network option determines if the `zkvyper` compiler is active for a particular network. It is set to `false` by default. This option is especially beneficial for multi-chain projects, allowing you to selectively enable `zksync` for specific networks.

### Usage

::: code-tabs
@tab yarn

```bash
yarn hardhat compile
```

@tab npm

```bash
npm hardhat compile
```

:::

Compiles all the smart contracts in the `contracts` directory and creates the `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.
