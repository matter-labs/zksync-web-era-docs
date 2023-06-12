# `hardhat-zksync-vyper`

The [@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper) plugin provides an interface for compiling Vyper smart contracts before deploying them to zkSync Era.

## Set up

### 1. Install the libraries

The plugin is used with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).

::: code-tabs
@tab:active yarn
```bash
yarn add -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```
@tab npm
```bash
npm i -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```
:::

### 2. Create `hardhat.config.ts`

```ts
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";

const config: HardhatUserConfig = {
  zkvyper: {
    version: "1.3.7",
    compilerSource: "binary", // docker usage no longer recommended
    settings: {
      // compilerPath: "zkvyper", // optional field with the path to the `zkvyper` binary.
      libraries: {}, // optional. References to non-inlinable libraries
    },
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true, // enables zksync in hardhat local network
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev"",
      ethNetwork: "goerli",
      zksync: true,
    },
  },
  // Currently, only Vyper ^0.3.3 is supported.
  vyper: {
    version: "0.3.3",
  },
};

export default config;
```

#### Options

- `version`: The `zkvyper` compiler version. Find the latest compiler versions in the [zkvyper repo](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource`: Indicates the compiler source and can be either `binary`. (A `docker` option is no longer recommended). If there is no previous installation, the plugin automatically downloads one. 

:::warning
The `docker` option is not recommended as compilers are no longer released as Docker images.
:::

- `compilerPath`: Optional field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used.
- `libraries`: Define any non-inlinable libraries your contracts use as dependencies here. Learn more about [compiling libraries](./compiling-libraries.md).
- `zksync`: Indicates whether `zkvyper` is enabled on zkSync Era. This option is useful for multichain projects in which you want to enable `zksync` for specific networks only.

### 3. Compile your contracts ??errors here??

::: code-tabs
@tab:active yarn
```bash
yarn hardhat compile
```
@tab npm
```bash
npx hardhat compile
```