# `hardhat-zksync-vyper`

这个插件用于在将Vyper智能合约部署到zkSync Era之前提供一个方便的接口来编译它们。




## 安装

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

这个插件与 [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper) 一起使用。
要使用它，你必须在`hardhat.config.ts`文件中安装并导入两个插件。

```javascript
import "@nomiclabs/hardhat-vyper" 。
import "@matterlabs/hardhat-zksync-vyper";

```


用以下命令将该插件的最新版本添加到你的项目中。

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-vyper

# Npm
npm i -D @matterlabs/hardhat-zksync-vyper
```

### 出口

这个插件通常不会在代码中直接使用。

### 配置

```typescript
zkvyper: {
  version: "0.1.0",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zkvyper",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zkvyper",  // required for compilerSource: "docker"
      tag: "latest"  // required for compilerSource: "docker"
    },
    libraries{} // optional. References to non-inlinable libraries

  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

- `version`是一个包含`zkvyper`编译器版本的字段。编译器的版本可以在[以下资源库]（https://github.com/matter-labs/zkvyper-bin）中找到。
- `compilerSource`表示编译器来源，可以是`docker`或`binary`（推荐）。如果没有已经安装的二进制编译器，该插件将自动下载它。如果使用`docker`，你需要在后台运行Docker桌面，并在实验部分提供`dockerImage`和`tag`。
- `compilerPath`（可选）是一个包含`zkvyper`二进制文件路径的字段。默认情况下，会使用`$PATH`中的二进制文件。如果`compilerSource`是`docker`，这个字段将被忽略。
- `dockerImage`和`tag`构成了编译器docker镜像的名称。如果`compilerSource`是`binary`，这些字段将被忽略。
- `libraries`如果你的合同使用非可linable库作为依赖，必须在这里定义。了解更多关于[在这里编译库](./compiling-libraries.md)
- `zksync`网络选项表示zkvyper是否在某个网络上被启用。默认为 "false"。对多链项目很有用，你可以只对特定的网络启用`zksync`。

:::warning

编译器不再作为Docker镜像发布，不再推荐使用。使用`compilerSource: "binary"`在Hardhat配置文件中使用二进制文件来代替。

:::

### 命令

`hardhat compile` -- 编译`contracts`目录下的所有智能合约，并创建`artifacts-zk`文件夹，其中包含所有编译工件，包括合约的工厂依赖，可用于合约部署。

要了解什么是工厂依赖，请阅读[Web3 API](.../api.md)文档中的更多内容。

