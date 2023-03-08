# 本地测试

有时，由于网络延迟或费用的原因，需要在本地环境下测试合同。

zkSync团队为这个目的提供了一个docker化的本地设置。

## 先决条件

要求你的电脑上安装有`Docker`和`docker-compose`。在这里找到[安装指南](https://docs.docker.com/get-docker/)

本指南假定你已经熟悉了zkSync Hardhat插件。如果你是在zkSync上新开发的Hardhat，请查看[getting started section here](./getting-started.md)。

## 安装测试环境

用以下命令下载docker化项目。

```
git clone https://github.com/matter-labs/local-setup.git
```

## 启动本地节点

要在本地运行zkSync，运行`start.sh`脚本。

```
cd local-setup
./start.sh
```

这个命令将启动三个docker容器。

- Postgres（用作zkSync的数据库）。
- 本地Geth节点（用作zkSync的L1）。
- zkSync节点本身。

默认情况下，HTTP JSON-RPC API将运行在端口`3050`，而WS API将运行在端口`3051`。

:::warning

注意，重要的是第一次`start.sh`脚本的调用要不间断地进行。如果你在启动过程意外停止后面临任何问题，你应该[reset](#reset-thezksync-state)本地zkSync状态并再次尝试。

:::

##将钱包连接到本地节点

你可以使用以下细节将你的钱包连接到L1和L2节点。

**本地L1网络**

- 网络名称。`L1本地`。
- 新的RPC URL: `http://localhost:8545/ `
- 链ID: `9
- 货币符号: `ETH `

**本地zkSync网络**

- 网络名称: `L2本地zkSync`.
- 新的RPC网址。`http://localhost:3050/ `
- 链ID: `270
- 货币符号: `ETH `

## 重置zkSync的状态

要重置zkSync的状态，请运行`./clear.sh`脚本。

```
./clear.sh
```

注意，当运行这个命令时，你可能会收到 "权限被拒绝 "的错误。在这种情况下，你应该以root权限运行它。

```
sudo ./clear.sh
```

## 丰富的钱包

本地zkSync设置带有一些 "丰富 "的钱包，在L1和L2上都有大量的ETH。

这些账户的地址与相应的私钥的完整列表可以在[这里]（https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json）找到。

:::warning ERC20代币

富有的钱包只有ETH。**如果你需要用ERC20代币进行测试，你应该自己部署它们。

如果你希望本地节点再次带有预先部署的代币，请在我们的[Discord](https://join.zksync.dev/)上告诉我们，这样我们就可以相应地安排优先次序。

:::

## 使用自定义数据库或以太坊节点

要使用自定义的Postgres数据库或第1层节点，你应该改变docker-compose文件中的环境参数。


```yml
environment:
  - DATABASE_URL=postgres://postgres@postgres/zksync_local
  - ETH_CLIENT_WEB3_URL=http://geth:8545
```

- `DATABASE_URL` is the URL to the Postgres database.
- `ETH_CLIENT_WEB3_URL` is the URL to the HTTP JSON-RPC interface of the L1 node.

## 使用`mocha`+`chai`进行测试

由于zkSync节点的URL是在`hardhat.config.ts`中提供的，使用不同的URL进行部署和本地测试的最好方法是使用环境变量。标准的方法是在调用测试前设置`NODE_ENV=test`环境变量。

### 项目设置

1. 按照[入门指南](./getting-started.md)创建一个新的Hardhat项目作为参考。
2. 要安装测试库，运行以下命令。

```
yarn add -D mocha chai @types/mocha @types/chai
```

3. 在根目录下的`package.json`中添加以下几行。

```json
"scripts": {
    "test": "NODE_ENV=test hardhat test"
}
```

这将使在Hardhat环境中运行测试，并将`NODE_ENV`环境变量设置为`test`。

### Configuration

4. 修改 `hardhat.config.ts` 以使用本地节点进行测试。

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
      };

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  // defaults to zkSync network
  defaultNetwork: "zkSyncTestnet",

  networks: {
    hardhat: {
      zksync: true,
    },
    // load test network details
    zkSyncTestnet,
  },
  solidity: {
    version: "0.8.16",
  },
};
```

创建一个`test'文件夹，测试将存放在那里。

### 编写测试文件

5. 现在你可以写你的第一个测试了! 创建一个`test/main.test.ts`文件，代码如下。

```ts
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

async function deployGreeter(deployer: Deployer): Promise<Contract> {
  const artifact = await deployer.loadArtifact("Greeter");
  return await deployer.deploy(artifact, ["Hi"]);
}

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const provider = Provider.getDefaultProvider();

    const wallet = new Wallet(RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    const greeter = await deployGreeter(deployer);

    expect(await greeter.greet()).to.eq("Hi");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
```

这个脚本部署了在[入门指南](./getting-started.md#write-and-deploy-a-contract)中创建的`Greeter`合同，并测试它在调用`greet()`方法时返回一个正确的消息，并且该消息可以用`setGreeting()`方法更新。

现在你可以用下面的命令运行这个测试文件。

```
yarn test
```

**恭喜你! 你已经在本地使用zkSync进行了第一次测试 🎉***。

## 完整的例子

完整的测试例子可以在[这里]找到(https://github.com/matter-labs/tutorial-examples/tree/main/local-setup-testing)

## chai匹配器

zkSync团队提供了[hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers)插件，除了提供本地测试环境外，还让你更容易为项目编写和维护测试。这个插件包括一组专门为zkSync设计的Chai匹配器，它可以帮助你为你的合同编写更全面和更容易理解的测试。通过使用这些匹配器，你可以确保你的合同按预期工作，并减少在开发过程中遇到错误或其他问题的可能性。
