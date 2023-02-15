# `hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync Era.

## Installation

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

This plugin is configured in the `hardhat.config.ts` file of your project. Here is an example

```typescript
zksolc: {
  version: "1.3.1",
  compilerSource: "binary",  // binary or docker (deprecated)
  settings: {
    compilerPath: "zksolc",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zksolc", // Deprecated: used for compilerSource: "docker"
      tag: "latest"   // Deprecated: used for compilerSource: "docker"
    },
    libraries:{}, // optional. References to non-inlinable libraries
    isSystem: false, // optional.  Enables Yul instructions available only for zkSync system contracts and libraries
    forceEvmla: false // optional. Falls back to EVM legacy assembly if there is a bug with Yul
  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

::: warning

Compilers are no longer released as Docker images and its usage is no longer recommended. Use the `compilerSource: "binary"` in the Hardhat config file to use the binary instead.

:::

- `version` is a field with the version of the `zksolc` compiler. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zksolc-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zksolc` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `isSystem` - required if contracts use enables Yul instructions available only for zkSync system contracts and libraries
- `forceEvmla` - falls back to EVM legacy assembly if there is a bug with Yul
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.


::: warning `forceEvmla` usage

Setting the `forceEvmla` field to true can have the following negative impacts:

- No support for recursion.
- No support for internal function pointers.
- Contract size or performance impact.

For solidity versions older than 0.8, this setting is enforced by default when compiling.

:::

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates the `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.
