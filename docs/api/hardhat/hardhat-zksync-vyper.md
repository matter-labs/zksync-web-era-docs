# `hardhat-zksync-vyper`

This plugin is used to provide a convenient interface for compiling Vyper smart contracts before deploying them to zkSync Era.

## Installation

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

This plugin is used in conjunction with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).
To use it, you have to install and import both plugins in the `hardhat.config.ts` file:

```javascript
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
```

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-vyper
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-vyper
```
:::

### Exports

This plugin most often will not be used directly in the code.

### Configuration

```typescript
zkvyper: {
  version: "1.3.5",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zkvyper",  // ignored for compilerSource: "docker"
    libraries{} // optional. References to non-inlinable libraries

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

- `version` is the `zkvyper` compiler version. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `zksync` network option indicates whether zkvyper is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.



### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.


## How to configure multiple compilation targets

To configure the `hardhat.config.ts` file to target both zkSync Era and other networks, do the following:

1. In your `hardhat.config.ts`, configure the zkSync Era network with `zksync: true`.
2. Configure the other networks with `zksync: false`.
3. Run the compilation script with the network flag: `yarn hardhat compile --network zkSyncTestnet` for zkSync Era network or `yarn hardhat compile --network goerli` for other networks.

```typescript
networks: {
        goerli: {
          url: "https://goerli.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL.
          zksync: false, // Set to false to target other networks.
        },
        zkTestnet: {
          url: "https://testnet.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
          ethNetwork: "goerli", // The identifier of the network (e.g. `mainnet` or `goerli`)
        zksync: true, // Set to true to target zkSync Era.
        }
    },

```