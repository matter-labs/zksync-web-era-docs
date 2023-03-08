# `hardhat-zksync-solc`

这个插件用于在将Solidity智能合约部署到zkSync Era之前提供一个方便的接口来编译它们。

## 安装

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

用以下命令将该插件的最新版本添加到你的项目中。

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
```

### Exports

这个插件大多数时候不会直接在代码中使用。

### Configuration

这个插件是在你的项目的`hardhat.config.ts`文件中配置的。下面是一个例子

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

编译器不再作为Docker镜像发布，不再推荐使用。使用Hardhat配置文件中的 `compilerSource: "binary"`在Hardhat配置文件中使用二进制文件来代替。

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

将 "forceEvmla "字段设置为 "true "会产生以下负面影响。

- 不支持递归。
- 不支持内部函数指针。
- 合同大小或性能影响。

对于0.8以前的solidity版本，该设置在编译时是默认执行的。

:::

### Commands

`hardhat compile` -- 编译`contracts`目录下的所有智能合约，并创建`artifacts-zk`文件夹，其中包含所有编译工件，包括合约的工厂依赖，可用于合约部署。

要了解什么是工厂依赖，请阅读[Web3 API](.../api.md)文档中的更多内容。

