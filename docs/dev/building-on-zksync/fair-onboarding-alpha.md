# 公平入驻阿尔法

Fair Onboarding Alpha邀请项目在全面公开发布之前部署到主网。要注册你的项目参与，请填写表格[这里。](https://forms.gle/wXjWiEeg16eMCWKJ8)

## 公平入驻如何运作

在Fair Onboarding Alpha期间，注册地址可以将代币桥接到zkSync，以部署和测试其产品/协议。

一旦桥接，对于如何在系统内使用令牌没有任何限制。例如，一个注册地址可以向一个非注册地址发送ETH，之后非注册地址可以不受限制地在zkSync内部使用它们（与任何智能合约互动）。话虽如此，但公平入职的明确目的是为了合同部署和测试 - 所以我们建议将交易保持在你的团队内。

**注意:**虽然非注册地址可以接收代币，但只有注册地址可以调用`finaliseWithdrawal`，因此将资产送回L1。当公平入职结束，L1 <> L2通信变得无权限时，这种情况就会改变。

## 如何桥接资产

### 使用门户桥接

你也可以通过Matter Labs提供的用户界面[portal.zksync.io](http://portal.zksync.io)来桥接ETH或代币。如果你想桥接的代币在Portal的下拉菜单中没有，你可以要求我们添加它[这里](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw)。

### 桥接脚本

要存入ETH，你可以使用`Deployer`类的`deposit`方法。下面是一个例子。

```tsx
import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTPS RPC endpoint
const MAINNET_RPC_ENDPOINT = "";

// Amount in ETH
const AMOUNT = "0.1";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key not configured in env file");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to deposit ETH in L2`);

  // Initialize the wallet.
  const provider = new Provider(MAINNET_RPC_ENDPOINT);

  const wallet = new Wallet(WALLET_PRIV_KEY, provider);

  // Create deployer object 
  const deployer = new Deployer(hre, wallet);

  // Deposit ETH to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT),
  });
  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Waiting for deposit to be processed in L2...`);
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log(`ETH available in L2`);
}
```

要存入ERC20代币，你可以使用相同的方法，但要额外传递 approveERC20: true 选项。

```tsx
import { Wallet, Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTPS RPC endpoint
const MAINNET_RPC_ENDPOINT = "";

// Token address
const TOKEN_ADDRESS = "";

// Amount of tokens 
const AMOUNT = "5";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key not configured in env file");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to bridge ERC20 to L2`);

  // Initialize the wallet.
  const provider = new Provider(
    // @ts-ignore
    MAINNET_RPC_ENDPOINT || hre.config.networks.zkSyncTestnet.ethNetwork
  );
    
  const wallet = new Wallet(WALLET_PRIV_KEY, provider);

  // Create deployer object 
  const deployer = new Deployer(hre, wallet);

  // Deposit ERC20 tokens to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: TOKEN_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals
    // performs the ERC20 approve
    approveERC20: true,
  });

  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Waiting for deposit to be processed in L2...`);
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log(`ERC20 tokens available in L2`);
}
```

要运行这个脚本，确保你的`hardhat.config.ts`文件是为zkSync配置的（[在这里找到一个例子](https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html)。你可以使用`npx zksync-cli@latest create PROJECT_NAME`来轻松搭建一个新项目，以防你还没有一个项目。

将脚本文件放在`deploy`文件夹中并运行。

```sh
 yarn hardhat zksync-deploy --script SCRIPT_FILENAME.ts
```

### 自定义桥接

已注册的地址可以通过建立自定义桥接器将令牌与zkSync自由连接。我们的用户界面目前不支持自定义桥接。然而，如果你正在开发一个自定义桥，我们很乐意听到你的意见，并讨论我们如何提供支持。你可以在 product@matterlabs.dev 找到我们。

## 如何部署

如果你需要一个关于部署到zkSync的一般复习，我们建议首先阅读我们的文档的[本节](https://era.zksync.io/docs/dev/building-on-zksync/contracts/contract-deployment.html) - 否则你可以参考我们的[快速入门指南](https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html)。

要把你的合同部署到mainnet，你需要把它包含在你的`hardhat.config.ts`文件的`networks`部分。

```jsx
networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
    zkSyncMainnet: {
      url: "https://zksync2-mainnet.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
    },
  },
```

此外，确保你的配置文件导入了`@matterlabs/hardhat-zksync-deploy`和`@matterlabs/hardhat-zksync-solc`插件，并且它们被正确配置了。

一旦添加，确保你的部署脚本使用`@matterlabs/hardhat-zksync-deploy`包中的`Deployer`类。用`--network`标志运行你的部署脚本（例如：`yarn hardhat deploy-zksync --script deploy-greeter.ts --network zkSyncMainnet` 。

::: tip

请确保您在遵循上述说明之前已经在zkSync上存入资金。

:::

你可以在[快速入门指南](https://v2-docs.zksync.io/dev/developer-guides/hello-world.html)中找到配置文件和部署脚本的例子。如果你有一个现有的项目，你可以按照[Hardhat zkSync迁移指南](https://v2-docs.zksync.io/api/hardhat/migrating-to-zksync.html)。

## zkSync Era主网细节

你可以使用下面的详细信息将zkSync主网添加到你的钱包。

- 网络名称。 `zkSync Era Mainnet'.
- 新的RPC URL: `https://zksync2-mainnet.zksync.io `
- 链ID: `324 `
- 货币符号: `ETH `
- 区块资源管理器 URL: `https://explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-mainnet.zksync.io/ws`。

## 如何加入

要为公平入职注册你的项目，请填写链接的表格[这里](https://forms.gle/wXjWiEeg16eMCWKJ8)。你将需要以下信息。

- 你的项目名称和描述
- 你在zkSync Era Testnet上的合同地址
- 你将用于桥接的L1地址
- 你打算在公平入职期间桥接的任何代币的清单。

## 安全措施

我们已经花费了超过350万美元，与一级审计公司、独立研究人员和社区的公共审计进行了一系列的审计。物质实验室还将在系统中锁定价值--在Fair Onboarding Alpha开始时以10ETH为起点。为了增加进一步的保护，将采取以下安全措施。

### 提款和存款限额

- **存款限额**。作为一般的安全预防措施（并使Fair Onboarding的重点放在部署和测试上），每个注册地址总共可以存入**10 ETH**。我们建议最多只能桥接**3个ETH。**这对于部署合约和执行测试交易来说应该是绰绰有余。当公平入驻结束后，这一限制将被取消。

- **提现限制**。每天最多只能提取协议中ETH总余额的10%。此功能的目的是在攻击者发现允许在L2上未经授权铸造代币的漏洞时，限制可以提取到L1的价值量。这个功能将一直保持到系统达到足够的成熟度。

### 冻结

为了保证我们用户的安全，Matter Labs有能力在紧急情况下冻结（并立即升级）系统。当系统被冻结时，L1或L2上的任何活动都是不可能的：交易将不被处理，我们的API服务将被关闭。

冻结系统使Matter Labs能够解决安全漏洞，而不会对用户资产造成持续风险。这个功能将在Fair Onboarding Alpha之后继续存在，并将随着我们逐步去中心化而被移除。

**注意:**自动执行的功能（如抵押品清算）在系统冻结时将不工作。

## 常见问题

### 什么时候开始公平上岗Alpha？

2月16日。

### 我如何注册？

你可以通过填写[此表](https://docs.google.com/forms/d/e/1FAIpQLSfdXAoQiHLu16ykEoOb762uvC1bAhdzOG-YDk6ju0YwPWf3Fw/viewform)来报名参加Fair Onboarding Alpha。我们将在一周内给你答复。

### 我如何将ERC20代币添加到门户用户界面？

你可以通过填写[此表格](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw)来申请额外的代币。在你提交表格后，如果有任何问题，我们会主动联系你。一般来说，我们的目标是在一个星期内满足这些请求。

### 公平入职将持续多长时间？

我们希望Fair Onboarding能持续4至6周。

### 我的项目已被批准，我如何部署？

请确保你完成上述说明，将ETH存入zkSync。然后进入[我们的部署指南](#how-to-eploy)来启动你的合同。

### 我的项目需要一个官方版本的ERC20/稳定币，但它似乎没有被部署。我应该怎么做？

我们正在与合作伙伴/稳定币供应商合作，在zkSync上提供本地集成和官方部署。 
