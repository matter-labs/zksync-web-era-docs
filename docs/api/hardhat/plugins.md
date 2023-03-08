# zkSync Era工具箱

## hardhat-zksync-toolbox。

hardhat-zksync-toolbox插件为捆绑和访问一系列与zkSync相关的Hardhat插件提供了一种方便的方法。这种方法简化了利用这些插件的过程，促进了使用的便利性。

支持的插件列表。

- [hardhat-zksync-solc](./hardhat-zksync-solc.md)
- [hardhat-zksync-vyper](./hardhat-zksync-vyper.md)
- [hardhat-zksync-deploy](./hardhat-zksync-deploy.md)
- [hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md)
- [hardhat-zksync-verify](./hardhat-zksync-verify.md)

### 安装

用以下命令将此插件的最新版本添加到你的项目中。

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-toolbox @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-vyper @matterlabs/hardhat-zksync-chai-matchers @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify hardhat ethers zksync-web3 @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-toolbox
```

### 使用方法

安装后，将该插件添加到你的Hardhat配置中。

```javascript
import "@matterlabs/hardhat-zksync-toolbox";
```

 安装并导入hardhat-zksync-toolbox插件后，你将可以访问所有支持的插件，并能够在你的项目中根据需要使用它们。

> 注意：要了解更多关于使用hardhat-zksync-toolbox插件所支持的任何插件，你可以参考上面的文档。
