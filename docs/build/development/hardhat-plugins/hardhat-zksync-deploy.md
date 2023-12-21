---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Deploy | zkSync Docs
---

# hardhat-zksync-deploy

### **What is this** `hardhat-zksync-deploy`**?**

The [`hardhat-zksync-deploy`](https://github.com/matter-labs/hardhat-zksync/tree/main/packages/hardhat-zksync-deploy) plugin provides utilities for deploying smart contracts on zkSync Era with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

{% hint style="info" %}
To gain an understanding **why** deploy plugin is needed for zkSync deployment please refer to the documentation [here](https://era.zksync.io/docs/reference/architecture/contract-deployment.html).
{% endhint %}

### **Installation**

Add the latest version of the plugin to your project:

::: code-tabs
@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-deploy
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-deploy
```

:::

### Configuration

Import the package in your `hardhat.config.ts`:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
```

In the `hardhat.config.ts` file, specify zkSync Era and Ethereum networks in the `networks` object.

<details>

<summary>Configuration example</summary>

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

const config: HardhatUserConfig = {
  zksolc: {},
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    };
  },
  solidity: {
    version: "0.8.20",
  },
};

export default config;
```

</details>

- `zkSyncTestnet` is an arbitrary zkSync Era network name. You can select this as the default network using the `defaultNetwork` property.
- `url` is a field containing the URL of the zkSync Era node in case of the zkSync Era network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync Era and Ethereum networks used by this plugin.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `goerli`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `zksync` is a flag that indicates if the network is zkSync Era. This field needs to be set to `true` for all zkSync Era networks; it is `false` by default.

### Usage

Deploy your smart contracts on the zkSync Era network using the following commands:

#### **General Deployment**

```bash
yarn hardhat deploy-zksync
```

This command executes all the scripts located in the `deploy` folder. Ensure that your deployment scripts are in this folder for the command to work.

For a targeted script deployment, use:

```bash
yarn hardhat deploy-zksync --script 001_deploy.ts
```

The above will execute the script at `./deploy/001_deploy.ts`.

For deployments on a specific zkSync Era network, you can specify the network:

```bash
yarn hardhat deploy-zksync --network zkSyncTestnet
```

#### **Library Deployment**

```bash
yarn hardhat deploy-zksync:libraries --private-key <PRIVATE_KEY>
```

This command compiles and deploys any missing libraries, as indicated by the `@matterlabs/hardhat-zksync-solc` plugin.

Parameters for library deployment:

- `--private-key <PRIVATE_KEY>`: Deploys libraries using the provided private key.
- `--no-auto-populate-config`: Disables auto-population of the hardhat config. Default: Enabled.
- `--external-config-object-path <file path>`: Path to zksolc configuration. Defaults to Hardhat config path.
- `--exported-config-object <object name>`: Name of the Hardhat config object. Default: `config`.
- `--compile-all-contracts`: Compiles all contracts with deployed libraries. Default: Disabled.

Example usage:

```bash
yarn hardhat deploy-zksync:libraries --private-key 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

#### **Usage of --exported-config-object**

Your JavaScript config might look like:

```javascript
const someObject = {
  zksolc: {
    compilerSource: "binary",
    settings: {},
  },
  solidity: {
    compilers: compilers,
  },
};

module.exports = someObject;
```

To run with this config:

```bash
yarn hardhat deploy-zksync:libraries --private-key 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2
```
