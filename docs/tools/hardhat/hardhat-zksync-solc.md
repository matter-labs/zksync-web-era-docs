---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-solc | zkSync Era Docs
---

# `hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync Era.

Learn more about the latest updates in the [changelog](https://github.com/matter-labs/hardhat-zksync/blob/main/packages/hardhat-zksync-solc/CHANGELOG.md)

## Installation

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-solc
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-solc
```

:::

## Configuration

Import the package in the `hardhat.config.ts` file:

```ts
import "@matterlabs/hardhat-zksync-solc";
```

::: info Default config in hardhat-zksync-solc ^0.4.0

Version 0.4.0 introduced a default configuration making all parameters optional. You can override the default configuration in the `hardhat.config.ts` file.

:::

::: info Support for missing libraries in hardhat-zksync-solc ^0.4.2

Version 0.4.2 introduced a mode that detects non-inlinable libraries that are missing and that are required for the compilation of contracts. This feature works with the `hardhat-zksync-deploy` plugin, specifically the `deploy-zksync:libraries` task, to compile and deploy the missing libraries. There are no new commands, just follow the instructions logged by the `yarn hardhat compile` output.

:::

Any configuration parameters should be added inside a `zksolc` property in the `hardhat.config.ts` file:

```typescript
zksolc: {
    version: "latest", // optional.
    settings: {
      compilerPath: "zksolc",  // optional. Ignored for compilerSource "docker". Can be used if compiler is located in a specific folder
      libraries:{}, // optional. References to non-inlinable libraries
      missingLibrariesPath: "./.zksolc-libraries-cache/missingLibraryDependencies.json" // optional. This path serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed
      isSystem: false, // optional.  Enables Yul instructions available only for zkSync system contracts and libraries
      forceEvmla: false, // optional. Falls back to EVM legacy assembly if there is a bug with Yul
      optimizer: {
        enabled: true, // optional. True by default
        mode: '3' // optional. 3 by default, z to optimize bytecode size
      },
      experimental: {
        dockerImage: '', // deprecated
        tag: ''   // deprecated
      },
    }
},

```

::: warning

- Compilers are no longer released as Docker images and its usage is no longer recommended.

:::

- `version` is the `zksolc` compiler version. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zksolc-bin).
- `compilerSource` indicates the compiler source and can be either `binary` (default) or `docker` (deprecated). If there isn't a compiler binary already installed, the plugin will automatically download it.
- `compilerPath` (optional) is a field with the path to the `zksolc` binary. By default, the binary in `$PATH` is used.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `missingLibrariesPath` (optiona) serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed. Defaults to `./.zksolc-libraries-cache/missingLibraryDependencies.json`.
- `isSystem` - required if contracts use enables Yul instructions available only for zkSync system contracts and libraries
- `forceEvmla` - falls back to EVM legacy assembly if there is an issue with the Yul IR compilation pipeline.
- `optimizer` - Compiler optimizations:
  - `enabled`: `true` (default) or `false`.
  - `mode`: `3` (default) recommended for most projects. Mode `z` reduces bytecode size for large projects that make heavy use of `keccak` and far calls.
- `metadata`: Metadata settings. If the option is omitted, the metadata hash appends by default:
  - `bytecodeHash`: Can only be `none`. It removes metadata hash from the bytecode.
- `dockerImage` and `tag` are deprecated options used to identify the name of the compiler docker image.

::: warning `forceEvmla` usage

Setting the `forceEvmla` field to true can have the following negative impacts:

- No support for recursion.
- No support for internal function pointers.
- Possible contract size and performance impact.

For Solidity versions older than 0.8, only this compilation mode is available and it is used by default.

:::

### Network configuration

Configure the `zksync` parameter in the networks to enable the zksolc compiler:

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

- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.

## Commands

::: code-tabs

@tab:active yarn

```bash
yarn hardhat compile
```

@tab npm

```bash
npx hardhat compile
```

:::

Compiles all the smart contracts in the `contracts` directory and creates the `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../../api/api.md) documentation.

## Troubleshoting

#### Error in plugin @matterlabs/hardhat-zksync-solc: Invalid zksolc compiler version

This error is returned when the version defined in the `hardhat.config.ts` file is lower than the minimal required (versions are defined [here](https://github.com/matter-labs/zksolc-bin/blob/main/version.json)). Update the version to solve the issue.

#### Why is there an `unexpected end of JSON input` compilation error?

This is an error that is usually thrown when compiling a large smart contract codebase.

If you encounter such an error, please do the following:

- Update the `@matterlabs/hardhat-zksync-solc` library and try to re-compile the smart contracts afterwards.
- If after the recompilation you get the `Library not found` error, then you should follow the instructions from [here](./compiling-libraries.md).
