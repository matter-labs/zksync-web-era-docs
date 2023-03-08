# 与zkSync Era互动

zkSync Era目前正处于公平的阿尔法登场阶段，这涉及到向某些团队开放我们的主网，以便在主网上建立和进行交易。

## 我需要有使用zkSync Lite的经验吗？

对zkSync Lite的一些经验将有助于理解一些核心概念，例如最终性如何工作。从所有其他方面来看，zkSync Era和zkSync Lite是非常不同的系统，在zkSync Era的基础上不需要后者的经验。

## 我需要什么来开始构建？

所有现有的以太坊的SDK将开箱工作，你的用户将有与以太坊上相同的体验。如果你想启用先进的zkSync功能，如账户抽象，应该使用zkSync SDK。

其他唯一需要使用zkSync SDK的地方是在合约部署期间。这可以通过我们的硬帽插件轻松完成。

### 快速启动zkSync

查看我们的步骤[快速入门指南](.../building-on-zksync/hello-world.md)，在那里你会学到。

- 如何安装zkSync硬帽插件并使用它部署智能合约。
- 如何使用`zksync-web3`库为你的dApp构建前端。

### 连接到Metamask上的zkSync Era

为了将zkSync Era alpha主网网络添加到您的钱包，您需要输入以下详细信息。

1. 打开Metamask的钱包，点击顶部中心的网络。

![img](../../assets/images/connect-1.png)

2. 点击 "手动添加网络"。

3. 填写有关zkSync Era alpha主网或测试网的详细信息，然后点击 "保存"。

**主网网络信息**

- 网络名称。`zkSync Era Mainnet`.
- 新的RPC URL: `https://zksync2-mainnet.zksync.io `
- 链ID: `324`
- 货币符号: `ETH `
- 区块资源管理器 URL: `https://explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-mainnet.zksync.io/ws`。

**Testnet网络信息**

- Network Name: `zkSync Era Testnet`
- New RPC URL: `https://zksync2-testnet.zksync.dev`
- Chain ID: `280`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://goerli.explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-testnet.zksync.dev/ws`

## zkSync Era支持

你可以在`💻🧪│dev-support-beta`里开一张支持票，或者在`🖥│dev-general`里问任何问题。

如果你需要与zkSync Era有关的任何帮助，你可以在zkSync Era discord上提出支持票，或者查看[FAQs](.../troubleshooting/faq.md)页面，查看关于zkSync Era的最常见的疑问。此外，你可以联系`#dev-support-beta`上的支持团队，或者在zkSync Era Discord服务器上的`#dev-general`频道中提出任何问题。
提出支持票的说明如下。

- 加入 zkSync Era [我们的 Discord](https://join.zksync.dev/) 服务器。
- 接受发送的邀请。
- 导航到`#dev-support-beta`频道。

另外，你现在可以通过[email](mailto:support@zksync.io)联系我们的支持工程师，提出你的问题和疑虑。
我们将积极监测问题，并努力尽快解决它们。

<!-- **Testnet network info**

- Network Name: `zkSync alpha testnet`
- New RPC URL: `https://zksync2-testnet.zksync.dev`
- Chain ID: `280`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://goerli.explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-testnet.zksync.dev/ws` -->

<!-- ## 使用zkSync门户网站存入和提取资金

由于测试网是在Goerli网络上运行，你需要先获得一些Goerli ETH。试试下面的任何一个龙头。

- [https://goerli-faucet.mudit.blog/](https://goerli-faucet.mudit.blog/)
- [https://faucets.chain.link/goerli](https://faucets.chain.link/goerli)
- [https://goerli-faucet.slock.it/](https://goerli-faucet.slock.it/)
- [https://goerlifaucet.com/](https://goerlifaucet.com/)

**Step 1**

前往[https://portal.zksync.io/](https://portal.zksync.io/)并连接你的钱包。你会自动被要求添加 "zkSync Era testnet Goerli "网络。

你也可以手动添加网络到你的metamask中。

- Network Name: `zkSync mainnet`
- New RPC URL: `https://zksync2-mainnet.zksync.io`
- Chain ID: `324` -->

<!-- 
**Step 2 (如果你没有Goerli ETH，请跳过。)**

我们首先进入 "桥梁"，然后 "存款"，将一些$ETH存入zkSync Era。

![image](../../assets/images/faq-1.png)

**Step 3**

接下来，我们去 "Faucet "获取一些测试网的$ETH、$LINK、$DAI、$WBTC和$USDC到我们的zkSync地址。

![image](../../assets/images/faq-2.png)

申领后在 "余额 "处查看你的余额。

![image](../../assets/images/faq-3.png)

**Step 4**

现在转到 "转移"。输入另一个钱包的地址，并转移一些代币到它。如果你没有ETH，就用DAI支付费用。

![image](../../assets/images/faq-4.png)

**Step 5**

最后我们去 "提款"，从zkSync提取一些\$DAI回到Goerli。用ETH支付费用。


![image](../../assets/images/faq-5.png) -->
