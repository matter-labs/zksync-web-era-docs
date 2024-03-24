---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-solc | zkSync Docs
---

# `hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync Era.

Learn more about the latest updates in the [changelog](https://github.com/matter-labs/hardhat-zksync/blob/main/packages/hardhat-zksync-solc/CHANGELOG.md)

## Prerequisite

To use the `hardhat-zksync-solc` in your project, we recommend that:

- You have a Node installation and `yarn` or `npm` package manager.

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

Upon encountering missing non-inline libraries during the compilation process, the compiler logged steps to follow, while compilation is not valid. This results with empty `artifacts-zk` and `cache-zk` folders.

:::

Any configuration parameters should be added inside a `zksolc` property in the `hardhat.config.ts` file:

```typescript
zksolc: {
    version: "latest", // optional.
    settings: {
      compilerPath: "zksolc",  // optional. Ignored for compilerSource "docker". Can be used if compiler is located in a specific folder
      libraries:{}, // optional. References to non-inlinable libraries
      missingLibrariesPath: "./.zksolc-libraries-cache/missingLibraryDependencies.json", // optional. This path serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed
      isSystem: false, // optional.  Enables Yul instructions available only for zkSync system contracts and libraries
      forceEvmla: false, // optional. Falls back to EVM legacy assembly if there is a bug with Yul
      optimizer: {
        enabled: true, // optional. True by default
        mode: '3', // optional. 3 by default, z to optimize bytecode size
        fallback_to_optimizing_for_size: false, // optional. Try to recompile with optimizer mode "z" if the bytecode is too large
      },
      experimental: {
        dockerImage: '', // deprecated
        tag: ''   // deprecated
      },
      contractsToCompile: [] //optional. Compile only specific contracts
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
- `missingLibrariesPath` (optional) serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed. Defaults to `./.zksolc-libraries-cache/missingLibraryDependencies.json`.
- `isSystem` - required if contracts use enables Yul instructions available only for zkSync system contracts and libraries
- `forceEvmla` - falls back to EVM legacy assembly if there is an issue with the Yul IR compilation pipeline.
- `optimizer` - Compiler optimizations:
  - `enabled`: `true` (default) or `false`.
  - `mode`: `3` (default) recommended for most projects. Mode `z` reduces bytecode size for large projects that make heavy use of `keccak` and far calls.
  - `fallback_to_optimizing_for_size` (optional) indicates that the compiler will try to recompile with optimizer mode "z" if the bytecode is too large.
- `metadata`: Metadata settings. If the option is omitted, the metadata hash appends by default:
  - `bytecodeHash`: Can only be `none`. It removes metadata hash from the bytecode.
- `dockerImage` and `tag` are deprecated options used to identify the name of the compiler docker image.
- `contractsToCompile` (optional) field is utilized to compile only the specified contracts. The contract names do not necessarily need to be written in full qualified form. The plugin will perform an include operation, attempting to match the provided contract names.

::: warning forceEvmla usage

Setting the `forceEvmla` field to true can have the following negative impacts:

- No support for recursion.
- No support for internal function pointers.
- Possible contract size and performance impact.

For Solidity versions older than 0.8, only this compilation mode is available and it is used by default.

:::

::: warning fallback_to_optimizing_for_size usage

`fallback_to_optimizing_for_size` option is supported for zksolc compiler version 1.3.21 or higher.

:::

### Compiler informations

The zksolc compilers are stored in the cache folder with the path `{cache}/hardhat-nodejs/compilers-v2/zksolc`. In this location, you can inspect the locally stored compiler versions.

`{cache}` is a placeholder for a path that is resolved by Hardhat

The `compilerVersion.json` file is used by the plugin to get the latest available version and the minimum required compiler version. This file undergoes invalidation every 24 hours (currently), subsequently being updated with fresh information. This approach is implemented to provide a caching mechanism, avoiding the risk of encountering GitHub throttling issues during fetching new releases.

### zkSync Era Solidity compiler

Due to [the identified limitations](https://docs.zksync.io/zk-stack/components/compiler/toolchain/solidity.html#limitations) of the [upstream Solidity compiler](https://github.com/ethereum/solidity), our team has developed [a new edition](https://github.com/matter-labs/era-solidity) of the compiler, which effectively addresses and resolves these constraints.

For usage of EraVM compiler, `eraVersion` should be added inside `solidity` property in the `hardhat.config.ts` file:

```typescript
solidity: {
    version: "0.8.17",
    eraVersion: "1.0.0" //optional. Compile contracts with EraVM compiler
},

```

- `eraVersion` - (optional) field used to specify version of EraVM compiler

::: warning eraVersion usage

Using latest as the field value is not supported. Instead, the eraVersion field must be filled with a specific version.

:::

::: warning EraVM compiler usage

To use the EraVM compiler, the zksolc compiler version must be equal to or greater than 1.3.22.

:::

### Network configuration

Configure the `zksync` parameter in the networks to enable the zksolc compiler:

```ts
defaultNetwork: "zkSyncTestnet",
networks: {
  sepolia: {
    url: "https://sepolia.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL (optional).
    zksync: false, // disables zksolc compiler
  },
  zkSyncTestnet: {
    url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
    ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
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

To understand what the factory dependencies are, read more about them in the [Web3 API](../../api.md) documentation.

## Troubleshooting

#### Error in plugin @matterlabs/hardhat-zksync-solc: Invalid zksolc compiler version

This error is returned when the version defined in the `hardhat.config.ts` file is lower than the minimal required (versions are defined in file [compilerVersion.json](#compiler-informations)). Update the version to solve the issue.

#### Why is there an `unexpected end of JSON input` compilation error?

This is an error that is usually thrown when compiling a large smart contract codebase.

If you encounter such an error, please do the following:

- Update the `@matterlabs/hardhat-zksync-solc` library and try to re-compile the smart contracts afterwards.
- If after the recompilation you get the `Library not found` error, then you should follow the instructions from [here](./compiling-libraries.md).
