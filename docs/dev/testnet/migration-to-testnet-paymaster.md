# 迁移到测试网的支付系统

## 前提条件

在进入本节之前，请确保你已经阅读了关于
[paymasters](./developer-guides/aa.md#paymasters)。

虽然zkSync Era Testnet之前的迭代原生支持以不同的代币支付费用，但它引起了一些与以太坊生态系统的兼容性问题。随着[paymasters](.../developer-guides/aa.md#paymasters)的出现，这个功能已经变得多余了，因为现在任何人都可以部署他们的paymaster智能合约，将ERC-20代币换成ETH。你可以阅读关于部署自定义paymasters的教程[这里]（.../tutorials/custom-paymaster-tutorial.md）。

为了支持生态系统，zkSync不打算在主网上部署任何支付系统。然而，考虑到更好的DevEx，我们已经在testnet上部署了一个。testnet paymaster可以用ERC-20兼容的代币以1：1的汇率支付费用。你可以阅读文档[这里]（.../developer-guides/aa.md#testnet-paymaster）。在本节中，我们展示了一个关于从使用ERC20代币支付费用的旧方式迁移到新方式的简要例子。

本文件仅涉及testnet paymaster_only。当你在主网上部署你的项目时，你将需要部署你的支付系统或找到第三方的支付系统并阅读其文档。

## 以前的界面

在以前的testnet版本中，你在交易的重写中提供了`feeToken'，所以一个以USDC支付费用的智能合约调用，比如说，看起来大致是这样。

```js
const tx = await contract.callMethod({
  customData: {
    feeToken: USDC_ADDRESS,
  },
});
```

## 使用testnet paymaster

使用testnet paymaster的工作包括三个步骤。

1. 检索testnet paymaster的地址。

```js
const testnetPaymaster = await provider.getTestnetPaymasterAddress();
```

注意：不建议缓存付款人的地址，因为它可能在没有警告的情况下改变。

2. 对交易中使用的付款人参数进行编码。为此，你可以使用`utils.getPaymasterParams`方法。

```js
import { utils } from "zksync-web3";

const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
  type: "ApprovalBased",
  token: USDC_ADDRESS,
  // Note, that the allowance for the testnet paymaster must be
  // at least maxFeePerErg * gasLimit, where maxFeePerErg and gasLimit
  // are parameters used in the transaction.
  minimalAllowance: maxFeePerErg.mul(gasLimit),
  innerInput: new Uint8Array(),
});
```

3. 用所提供的paymaster参数发送交易。

```js
const tx = await contract.callMethod({
  customData: {
    paymasterParams,
  },
});
```
