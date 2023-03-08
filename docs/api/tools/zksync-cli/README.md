# zkSync CLI

zkSync CLI简化了开发应用程序和与zkSync Era交互的过程。

该代码可[在以下资源库](https://github.com/matter-labs/zksync-cli)。

## 安装

用以下命令全局安装zkSync CLI。

```
npm i -g zksync-cli@latest
```

你也可以通过NPX运行`npx zksync-cli@latest [COMMAND]`。

## 命令

- `zksync-cli create [PROJECT_NAME]`: 在一个新的文件夹中创建一个新的Hardhat项目，并给出项目名称。如果没有提供项目名称，它会在当前文件夹中创建项目，尽管这需要该文件夹为空。可以在这里找到[模板项目](https://github.com/matter-labs/zksync-hardhat-template)。

- `zksync-cli deposit`：将资金从L1（Goerli testnet）存入zkSync Era Testnet。它将要求你提供：收件人钱包，ETH金额（例如0.1）和你要发送资金的钱包的私钥。

- `zksync-cli withdraw`: 从zkSync Era提取资金到L1（Goerli测试网）。它将要求你提供：收件人钱包，ETH金额（例如0.1）和你要发送资金的钱包的私钥。

> 存款和取款都可能需要几分钟的时间来完成。

更多的命令将很快被添加，但如果你有任何建议，请随时[在GitHub上打开一个问题](https://github.com/matter-labs/zksync-cli/issues/new)。

## 故障排除

如果你发现任何问题，你可以[在GitHub上打开一个问题](https://github.com/matter-labs/zksync-cli/issues/new)或[在我们的 Discord](https://join.zksync.dev/)向我们报告。

