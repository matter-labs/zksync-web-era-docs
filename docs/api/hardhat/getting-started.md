# 开始使用

[Hardhat](https://hardhat.org)是一个Ethereum开发环境，为在Solidity中轻松开发智能合约而设计。它最突出的特点之一是可扩展性：你可以轻松地将新的插件添加到你的Hardhat项目中。

zkSync为Hardhat提供了以下插件。

- [@matterlabs/hardhat-zksync-solc](./hardhat-zksync-solc.md) - 用于编译用Solidity编写的合约。
- [@matterlabs/hardhat-zksync-vyper](./hardhat-zksync-vyper.md) - 用于编译用Vyper编写的合约。
- [@matterlabs/hardhat-zksync-deploy](./hardhat-zksync-deploy.md) - 用来部署智能合约。
- [@matterlabs/hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md) - 为测试智能合约的[Chai](https://www.chaijs.com/)断言库增加了zkSync的特定功能。
- [@matterlabs/hardhat-zksync-verify](./hardhat-zksync-verify.md) - 用来验证智能合约。

要了解更多关于Hardhat本身的信息，请查看[其官方文档]（https://hardhat.org/getting-started/）。

本教程展示了如何使用Hardhat从头开始设置一个zkSync Solidity项目。
如果你使用 Vyper，请查看 GitHub 中的 [Vyper 插件文档](./hardhat-zksync-vyper.md) 或 [这个例子](https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example)

## 前提条件

对于本教程，必须安装以下程序。

- `yarn`软件包管理器。`npm`例子将很快被添加。
- 一个在L1上有足够的Göerli `ETH`的钱包，以支付桥接资金到zkSync以及部署智能合约。我们建议使用[我们来自zkSync门户的龙头](https://portal.zksync.io/faucet)。

## 项目设置

1. 为了初始化项目并安装依赖性，在终端运行以下命令。

```
mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node @types/node ethers@^5.7.2 zksync-web3@^0.13.1 @ethersproject/hash @ethersproject/web hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

typescript、ts-node和@types/node的依赖是可选的--插件在vanilla JavaScript环境下可以正常工作。不过，请注意，本教程确实使用了TypeScript。

::: tip

如果使用Yarn 2及以上版本，你可能需要做一些额外的步骤，以使`TypeScript`在你的编辑器中按预期工作。要了解更多，请查看[Yarn的官方文档](https://yarnpkg.com/getting-started/editor-sdks)

:::

## Configuration

2. 创建`hardhat.config.ts`文件并在其中粘贴以下代码。

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkTestnet",
  networks: {
    zkTestnet: {
      url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
      ethNetwork: "goerli", // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};
```

::: tip

要了解更多关于hardhat.config.ts文件中的每个具体属性，请查看插件文档./plugins.md)

:::

## Write and deploy a contract

3. 创建合约和部署文件夹。在合约文件夹中，我们将存储所有的智能合约文件。在deploy文件夹中，我们将放置所有与部署合约有关的脚本。
4. 创建contracts/Greeter.sol合约并粘贴以下代码。

```solidity
//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
```

5. 运行`yarn hardhat compile`，它使用`hardhat-zksync-solc`插件来编译合同。`artifacts-zk`和`cache-zk`文件夹将被创建在根目录下（而不是常规Hardhat的`artifacts`和`cache`）。

::: tip

注意`artifacts-zk`和`cache-zk`文件夹包含了编译工件和缓存，不应该被添加到版本控制中，所以把它们包含在你的项目的`.gitignore`文件中是个好的做法。

:::

6. 在`deploy/deploy.ts`中创建部署脚本，代码如下。

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const greeting = "Hi there!";
  const greeterContract = await deployer.deploy(artifact, [greeting]);

  // Show the contract info.
  const contractAddress = greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // Call the deployed contract.
  const greetingFromContract = await greeterContract.greet();
  if (greetingFromContract == greeting) {
    console.log(`Contract greets us with ${greeting}!`);
  } else {
    console.error(`Contract said something unexpected: ${greetingFromContract}`);
  }

  // Edit the greeting of the contract
  const newGreeting = "Hey guys";
  const setNewGreetingHandle = await greeterContract.setGreeting(newGreeting);
  await setNewGreetingHandle.wait();

  const newGreetingFromContract = await greeterContract.greet();
  if (newGreetingFromContract == newGreeting) {
    console.log(`Contract greets us with ${newGreeting}!`);
  } else {
    console.error(`Contract said something unexpected: ${newGreetingFromContract}`);
  }
}
```

7. 将`WALLET-PRIVATE-KEY`文本替换为你的Ethereum钱包的私钥后，使用以下命令运行该脚本。`yarn hardhat deploy-zksync`。这个脚本将
   
   - 从Goerli转移0.001个ETH到zkSync。
   
   - 向[zkSync Era Testnet](.../.../dev/fundamentals/interacting.md)部署带有 "你好！"信息的`Greeting`合约。
   
   - 从合同中检索信息，调用`greet()`方法。
   
   - 用`setGreeting()`方法更新合同中的问候信息。
   
   - 再次从合约中获取消息。
     
     **恭喜你! 你的Hardhat项目现在已经在zkSync Era Testnet上运行了 🎉**。

::: tip 请求-速率超标消息

这条信息是由使用ethers提供的默认RPC端点引起的。为了避免这种情况，请使用你自己的Goerli RPC端点。你可以[在这里找到多个节点提供者]（https://github.com/arddluma/awesome-list-rpc-nodes-providers）。

:::

## 了解更多

- 要了解更多关于zkSync Hardhat插件的信息，请查看[plugins documentation](./plugins)。
- 如果你想了解更多关于如何使用Javascript与zkSync互动，请查看[zksync-web3 Javascript SDK documentation](./js) 。

## 未来版本

未来将发布的插件有两个主要改进点。

- **与现有hardhat插件的兼容性。
- **与其他hardhat插件的兼容性是未来的计划，但还没有成为重点。
- **改进的跨平台支持**。
