# 跨链治理

本教程作为一个例子，说明如何实现L1到L2的合约互动。本教程中实现了以下功能。

- 一个 "计数器 "智能合约被部署在zkSync上，它存储了一个数字，可以通过调用`increment`方法来增加。
- 一个 "治理 "智能合约被部署在第1层，它有权限增加zkSync上的计数器。

::: warning

请注意，在`zksync-web3 ^0.13.0`中引入了突破性变化。API层现在使用 "gas "操作，"ergs "概念只在虚拟机内部使用。

本教程将很快被更新以反映这些变化。

:::

## 预先说明

在本教程中，假定你已经熟悉在zkSync上部署智能合约。如果没有，请参考[快速入门教程](.../building-on-zksync/hello-world.md)的第一节。

此外，还假设你已经有一些使用Ethereum的经验。

## 项目结构

由于我们将在L1和L2上部署合约，我们将把这个项目分成两个不同的文件夹。

- `/L1-governance`：用于L1合约，和脚本。
- `/L2-counter`：用于L2合约，以及脚本。

所以继续创建这些文件夹。

::: tip

请注意，`governance`项目是一个默认的Hardhat项目，因为它将被用来在L1部署合约，而`counter`项目包括所有的zkSync依赖和特定配置，因为它将在L2部署合约。

:::

## L1治理

要初始化`/L1-governance`文件夹内的项目，运行`npx hardhat`，选择 "创建一个Typescript项目 "选项，其余选项保留默认值。

要使用 Solidity 与 zkSync 桥接合同互动，你需要使用 zkSync 合同接口。有两个选项可以得到它。

1. 从`@matterlabs/zksync-contracts`的npm包中导入它。(首选)
2. 从[contracts repo]中下载（https://github.com/matter-labs/v2-testnet-contracts）。

我们将选择选项1，并通过运行以下命令安装`@matterlabs/zksync-contracts`包（只要确保你在`/L1-governance`文件夹内）。

```
yarn add -D @matterlabs/zksync-contracts
```

我们将在L1上部署的治理合约的代码如下。

```sol
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Governance {
    address public governor;

    constructor() {
        governor = msg.sender;
    }

    function callZkSync(
        address zkSyncAddress,
        address contractAddr,
        bytes memory data,
        uint64 gasLimit
    ) external payable {
        require(msg.sender == governor, "Only governor is allowed");

        IZkSync zksync = IZkSync(zkSyncAddress);
        zksync.requestL2Transaction{value: msg.value}(contractAddr, 0, data, gasLimit, new bytes[](0));
    }
}
```

这是一个非常简单的治理合约。它将合约的创建者设定为单一的治理者，并且有一个函数可以通过zkSync智能合约请求L2的交易。

你可以[在本节文档中了解更多关于L1-L2通信的信息]（.../developer-guides/bridging/L1-l2.md）。

### 部署L1治理合同

尽管本教程并不关注在L1上部署合约的过程，但我们会给你一个快速的概述，告诉你如何继续。

1. 你需要一个RPC节点端点到Göerli测试网，以提交部署事务。你可以[在这里找到多个节点提供者](https://github.com/arddluma/awesome-list-rpc-nodes-providers)。

2. 创建文件`/L1-governance/goerli.json`并填写以下数值。

```json
{
  "nodeUrl": "", // your Göerli Ethereum node  URL.
  "deployerPrivateKey": "" //private key of the wallet that will deploy the governance smart contract. It needs to have some ETH on Göerli.
}
```

3. 在`hardhat.config.ts`文件中添加Göerli网络部分。

```ts
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

// import file with Göerli params
const goerli = require("./goerli.json");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    networks: {
      // Göerli network
      goerli: {
        url: goerli.nodeUrl,
        accounts: [goerli.deployerPrivateKey],
      },
    },
  },
};
```

4. 用以下代码创建部署脚本`/L1-governance/scripts/deploy.ts`。

```ts
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const Governance = await ethers.getContractFactory("Governance");

  const contract = await Governance.deploy();
  await contract.deployed();

  console.log(`Governance contract was successfully deployed at ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. 编译合约并运行部署脚本。

```
# compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts
```

最后一条命令将在终端打印已部署的治理智能合约地址。

## L2反面

现在我们已经解决了L1的治理合约，让我们继续进行L2的反合约。

1. 为了初始化`/L2-counter`文件夹中的项目，运行以下命令。

```
yarn init -y
# install all dependencies
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

当前版本的`zksync-web3`使用`ethers v5.7.x`作为同行依赖。与`ethers v6.x.x`兼容的更新将很快发布。

:::

2. 创建`hardhat.config.ts`文件并在那里粘贴以下代码。

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};
```

如果你的默认网络不是`hardhat'，确保在其配置中也包括`zksync: true'。

3. 创建`contracts`和`deploy`文件夹，其中将包含所有合同`*.sol`文件，以及与部署合同有关的脚本。

::: tip

你可以使用zkSync CLI来自动构建一个项目的支架。查找[关于zkSync CLI的更多信息](.../.../api/tools/zksync-cli/)

:::

4. 创建`contracts/Counter.sol`合同文件。这个合同将有部署在L1的治理合同的地址和一个可以递增的计数器。增加计数器的函数只能由我们之前部署在L1的治理合同调用。下面是代码。

```sol
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Counter {
    uint256 public value = 0;
    address public governance;

    constructor(address newGovernance) {
        governance = newGovernance;
    }

    function increment() public {
        require(msg.sender == governance, "Only governance is allowed");

        value += 1;
    }
}
```

5. 用以下命令编译合同。

```
yarn hardhat compile
```

6. 在`deploy/deploy.ts`中创建部署脚本。

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Insert the address of the governance contract
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Counter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Counter");

  // Deposit some funds to L2 to be able to perform deposits.
  const deploymentFee = await deployer.estimateDeployFee(artifact, [GOVERNANCE_ADDRESS]);
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.
  // The address of the governance is an argument for contract constructor.
  const counterContract = await deployer.deploy(artifact, [GOVERNANCE_ADDRESS]);

  // Show the contract info.
  const contractAddress = counterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

7. 在将`<WALLET-PRIVATE-KEY>`和`<GOVERNANCE-ADDRESS>`分别替换为Göerli上有一定ETH余额的Ethereum钱包的私钥和L1治理合约的地址后，使用以下命令运行该脚本。

```
yarn hardhat deploy-zksync
```

在输出中，你应该看到合同被部署到的地址。

::: tip

你可以在[quickstart tutorial](.../building-onzksync/hello-world.md)或zkSync的[hardhat plugins](.../.../api/hardhat/getting-started.md)的文档中找到关于部署合约的更具体细节。

:::

## 读取计数器的值

在部署了两个合同之后，我们可以创建一个小脚本来检索计数器的值。为了简单起见，我们将在`/L2-counter`文件夹下创建这个脚本。为了保持教程的通用性，其中将不使用特定的hardhat功能。

### 获取计数器合约的ABI

以下是如何获得计数器合约的ABI。

1. 从位于`/L2-counter/artifacts-zk/contracts/Counter.sol/Counter.json`的编译工件中复制`abi`阵列。

2. 在`/L2-counter`项目文件夹中创建`scripts`文件夹。

3. 创建一个新的文件`/L2-counter/scripts/counter.json`并粘贴计数器合同的ABI。

4. 4.创建`/L2-counter/scripts/display-value.ts`文件并粘贴以下代码。

```ts
import { Contract, Provider, Wallet } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const counterContract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counterContract.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

这段代码相对简单，主要等同于使用 "ethers "的工作方式。它将只是从L2合同中检索计数器的值。

将`<COUNTER-ADDRESS>`替换为已部署的计数器合约的地址后，通过运行这个脚本来运行

```
yarn ts-node ./scripts/display-value.ts
```

The output should be:

```
The counter value is 0
```

## 从L1调用L2合同

现在，让我们从第一层调用`increment`方法。

1. 获取已编译的治理合同的ABI数组，它位于`/L1-governance/artifacts/contracts/Governance.sol/Governance.json`，并将其保存在一个新文件中，即`/L2-counter/scripts/governance.json`（确保你在`/L2-counter`文件夹中创建它！）。
2. 创建`L2-counter/scripts/increment-counter.ts`文件，并为脚本粘贴以下模板。

```ts
// Imports and constants will be put here

async function main() {
  // The logic will be put here
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

3. 为了与治理智能合约互动，我们需要初始化一个以太坊提供者和相应的`以太坊`合约`对象，所以我们需要有它的部署地址。

```ts
// Imports
import { BigNumber, Contract, ethers, Wallet } from "ethers";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
```

```ts
async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet, the same one as the one that deployed the
  // governance contract
  const wallet = new ethers.Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);
}
```

将`<治理-地址>和`<钱包-私钥>分别替换为L1治理智能合约的地址和部署治理合约的钱包的私钥。

4. 为了与zkSync桥梁互动，我们需要其L1地址。虽然在mainnet上，你可能想把zkSync智能合约的地址设置为环境变量或常量，但值得注意的是，你可以动态地获取智能合约地址。如果你在测试网工作，我们推荐这种方法，因为再生可能发生，合同地址可能会改变。

```ts
// Imports
import { Provider, utils } from "zksync-web3";
```

```ts
async function main() {
  // ... Previous steps

  // Initializing the L2 provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  // Getting the current address of the zkSync L1 bridge
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);
}
```

5. 从L1执行交易需要调用者向L2操作员支付一些费用。

首先，这个费用取决于calldata的长度和`gasLimit`。如果你对这个概念感到陌生，那么它与以太坊上的`l2gasLimit`基本相同。你可以在这里阅读更多关于[zkSync收费模式]（.../developer-guides/transactions/fee-model.md）。

其次，费用取决于交易调用时使用的天然气价格。因此，为了有一个可预测的调用费用，应该从L1供应商那里获取气体价格。

```ts
// Imports
const COUNTER_ABI = require("./counter.json");
```

```ts
async function main() {
  // ... Previous steps

  // Encoding L1 transaction is the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of L1 transaction requests depend on the gas price used in the call,
  // so we should explicitly fetch the gas price before the call.
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for gas limit.
  // There is currently no way to get the exact gasLimit required for an L1->L2 tx.
  // You can read more on that in the tip below
  const gasLimit = BigNumber.from(100000);

  // Getting the cost of the execution in Wei.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, gasLimit, ethers.utils.hexlify(data).length);
}
```

::: tip 收费模式和收费估算是WIP

你可能已经注意到在L1->L2交易中缺少`gas_per_pubdata`和`gas_per_storage`字段。这些对于协议的安全性肯定是很重要的，它们将很快被添加。请注意，这将是对合同接口的一个突破性改变。

此外，目前还没有简单的方法来估计执行L1->L2交易所需的`气体'的确切数量。在写这篇文章的时候，即使提供的 "gasLimit "为 "0"，交易也可能被处理。这将在未来改变。

:::

6. 现在可以调用治理合同，这将把调用重定向到zkSync。

```ts
// Imports
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
```

```ts
async function main() {
  // ... Previous steps

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 transaction is complete.
  await tx.wait();
}
```

确保将`<COUNTER-ADDRESS>`替换为二级计数器合同的地址。

7. 你可以跟踪相应的L2事务的状态。`zksync-web3`的`Provider`有一个方法，给定调用zkSync桥的事务的L1`ethers.TransactionResponse`对象，返回L2中事务对应的`TransactionResponse`对象，可以方便地等待事务在L2上被处理。

```ts
async function main() {
  // ... Previous steps

  // Getting the TransactionResponse object for the L2 transaction corresponding to the execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}
```

### 完整的代码

以下是获取zkSync合同地址的完整代码，对交易数据进行编码，计算费用，将交易发送到L1，并跟踪L2中的对应交易。

```ts
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { Provider, utils } from "zksync-web3";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
const COUNTER_ABI = require("./counter.json");
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";

async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  // Getting the current address of the zkSync L1 bridge
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);

  // Encoding the tx data the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of the L1 transaction requests depends on the gas price used in the call
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for gas limit.
  const gasLimit = BigNumber.from(100000);
  // Getting the cost of the execution.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, gasLimit, ethers.utils.hexlify(data).length);

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 tx is complete.
  await tx.wait();

  // Getting the TransactionResponse object for the L2 transaction corresponding to the execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract's Increment method
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

你可以用以下命令运行该脚本。

```
yarn ts-node ./scripts/increment-counter.ts
```

在输出中，你应该看到L2的完整交易收据。你可以在[zkSync explorer](https://explorer.zksync.io/)中获取`transactionHash'并跟踪它。

8. 之后，你可以通过再次运行`display-value`脚本来验证交易是否确实成功。

```
yarn ts-node ./scripts/display-value.ts
```

在交易之后，L2合约中的计数器应该增加，所以输出应该是。

```
The counter value is 1
```

## 完整的项目

你可以下载完整的项目[这里](https://github.com/matter-labs/cross-chain-tutorial)。

## 了解更多

- 要了解更多关于zkSync上L1->L2的交互，请查看[文档](../developer-guides/bridging/l1-l2.md)。
- 要了解更多关于`zksync-web3`SDK的信息，请查看其[文档](././api/js)。
- 要了解更多关于zkSync hardhat插件的信息，请查看其[document](../../api/hardhat)。
