# 迁移指南

你有一个Hardhat项目，你想把它部署到zkSync？在这个页面，你会发现所有的步骤，你需要做的是将现有的Hardhat项目迁移到zkSync。

## 概述

zkSync提供了[多个Hardhat插件](./plugins.md)，具有不同的功能，但在本指南中，我们将只关注你将项目迁移到zkSync所需的功能。

警告 目前还不支持非默认的路径。

合同文件必须包含在`contracts`文件夹中，部署脚本必须包含在`deploy`文件夹中。

对自定义路径的支持将在未来加入。

:::

## 安装依赖项

尽管zkSync[与Solidity和Vyper兼容]（.../.../dev/building-onzksync/contracts/contracts.md），但部署的字节码和部署过程与Ethereum或其他EVM区块链不同。因此，第一步将是安装编译器和部署器的硬帽插件。

```sh
# Yarn
yarn add -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-solc

```

如果你使用Vyper，请将`@matterlabs/hardhat-zksync-solc`替换为`@matterlabs/hardhat-zksync-vyper`。

## 配置变化

在你的`hardhat.config.ts`文件中导入已安装的依赖项。

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
```

zkSync上的网络需要两个不同的URL端点：一个用于第一层（Ethereum或Goerli），另一个用于第二层（zkSync）。这就是你如何在`hardhat.config.ts`中把zkSync testnet添加到你的网络列表中。

```typescript
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet:{
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",  // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    }
  },
  defaultNetwork: "zkSyncTestnet",
  // configuration continues ....

};
```
记得在任何其他网络中添加`zksync: false`。

最后，你需要在`zksolc`或`zkvyper`属性中添加编译器选项。下面是一个 Solidity 项目的最小配置。

```typescript
zksolc: {
  version: "1.3.1",
  compilerSource: "binary",
  settings: {},
},
```
你可以在 [Solidity](./hardhat-zksync-solc.md) 或 [Vyper](./hardhat-zksync-vyper.md) 插件中找到提前设置。

### 完整的配置

下面是一个配置文件的例子。

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    goerli:{
      url: 'https://goerli.com/api/abcdef12345',
      zksync: false,
    }
    mainnet:{
      url: 'https://ethereum.mainnet.com/api/abcdef12345',
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",  // or a Goerli RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
  // OTHER SETTINGS...
};

export default config;
```

## 编译合同

要为zkSync编译你的合同，请运行。

```
# Yarn
yarn hardhat compile --network zkSyncTestnet

# NPM
npx hardhat compile  --network zkSyncTestnet
```

通过传递 --network 标志，我们确保 Hardhat 将使用 zksolc 编译器（或 zkvyper）。这个命令将编译 /contracts 文件夹中的所有合同，并创建 artifacts-zk 和 cache-zk 文件夹。

如果你的合同导入了任何非内联的库，你需要在hardhat.config.ts文件中对其进行配置。在这里可以找到更多关于编译库的信息和例子。

部署合同

:::tip 测试ETH

从我们的龙头获得测试ETH，或者直接使用zkSync门户桥接GöerliETH。

:::

为了部署你的合约，你需要使用hardhat-zksync-deploy插件中的Deployer类。这个类负责处理在zkSync上部署合同的所有具体事宜。

下面是一个Greeter合同的基本部署脚本。


```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("Greeter");

  // Deploy this contract. The returned object will be of a `Contract` type, 
  // similar to the ones in `ethers`.
  const greeting = "Hi there!";
  // `greeting` is an argument for contract constructor.
  const greeterContract = await deployer.deploy(artifact, [greeting]);

  // Show the contract info.
  console.log(`${artifact.contractName} was deployed to ${greeterContract.address}`);
}

```
在`deploy`文件夹中包含你的部署脚本，并在运行中执行它。

```
# Yarn
yarn hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet

# NPM
npx hardhat deploy-zksync --script SCRIPT_FILENAME.ts --network zkSyncTestnet
```

如果你不包括`--script`选项，`deploy`文件夹内的所有脚本文件将按字母顺序执行。

## 前端集成

你可以使用`zksync-web3` Javascript库与你的合同进行交互。这个SDK建立在ethers之上，使用相同的类（`Provider`, `Contract`, `Wallet`），所以在很多情况下，你只需要从`zksync-web3`导入这些类，而不是`ethers`。

```typescript

//import { utils, Provider, Contract, Wallet } from "ethers";
import { utils, Provider, Contract, Wallet } from "zksync-web3";

```

你还需要使用`artifacts-zk`文件夹中的合同ABI来实例化合同。

除了以太坊提供的相同的类和方法外，zksync-web3还包括用于zksync特定功能的额外方法。你可以在[`zksync-web3`文档]（.../js/getting-started.md）中阅读更多内容。

## 验证合同

要验证你的合同，你有两个选择。

- 探索器：在[zkSync探索器]中手动验证你的合同(.../tools/block-explorer/contract-verification.md)
- 插件：使用[Hardhat验证插件](./hardhat-zksync-verify.md)以编程方式验证你的合同。


-

如果你在迁移你的项目时有任何问题，[在Discord上给我们留言](https://join.zksync.dev/)。
