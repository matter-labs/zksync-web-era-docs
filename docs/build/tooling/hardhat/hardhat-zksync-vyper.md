---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-vyper | zkSync Docs
---

# `hardhat-zksync-vyper`

The [@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper) plugin provides an interface for compiling Vyper smart contracts before deploying them to zkSync Era.

Learn more about the latest updates in the [changelog](https://github.com/matter-labs/hardhat-zksync/blob/main/packages/hardhat-zksync-vyper/CHANGELOG.md).

## Prerequisite

To use the `hardhat-zksync-vyper` in your project, we recommend that:

- You have a Node installation and `yarn` or `npm` package manager.

## Installation

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-vyper
```

:::

## Configuration

::: info zero-config

`hardhat-zksync-vyper` v0.2.0 introduced a default configuration so all parameters are optional.

:::

Any configuration parameters should be added inside a `zkvyper` property in the `hardhat.config.ts` file:

```typescript
zkvyper: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zkvyper-bin/
    settings: {
      // compilerPath: "zkvyper", // optional field with the path to the `zkvyper` binary.
      libraries: {}, // optional. References to non-inlinable libraries
      optimizer: {
        mode: '3' // optional. 3 by default, z to optimize bytecode size
        fallback_to_optimizing_for_size: false, // optional. Try to recompile with optimizer mode "z" if the bytecode is too large
      },
      experimental: {
        dockerImage: '', // deprecated
        tag: ''   // deprecated
      },
    },
  }
```

::: warning

- Compilers are no longer released as Docker images and its usage is no longer recommended.

:::

- `version`: The `zkvyper` compiler version. Default value is `latest`. Find the latest compiler versions in the [zkvyper repo](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource`: Indicates the compiler source and can be either `binary`. (A `docker` option is no longer recommended). If there is no previous installation, the plugin automatically downloads one.
- `optimizer` - Compiler optimizations:
  - `mode`: `3` (default) recommended for most projects. Mode `z` reduces bytecode size for large projects that make heavy use of `keccak` and far calls.
  - `fallback_to_optimizing_for_size` (optional) indicates that the compiler will try to recompile with optimizer mode "z" if the bytecode is too large.
- `compilerPath`: Optional field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used.
- `libraries`: Define any non-inlinable libraries your contracts use as dependencies here. Learn more about [compiling libraries](./compiling-libraries.md).

::: warning fallback_to_optimizing_for_size usage

`fallback_to_optimizing_for_size` option is supported for zkvyper compiler version 1.3.15 or higher.

:::

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
