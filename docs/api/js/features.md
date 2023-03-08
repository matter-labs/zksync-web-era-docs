# zkSync时代的特点

虽然zkSync大部分是兼容Web3的，但与Ethereum相比，它有一些区别。其中主要的是。

- 账户抽象支持（账户可以有近乎任意的验证逻辑，同时也启用了paymaster支持）。
- 部署交易需要合同的字节码在一个单独的字段中传递。
- 收费系统则有些不同。

这些需要我们用新的自定义字段来扩展标准的以太坊交易。这样的扩展交易被称为EIP712交易，因为[EIP712](https://eips.ethereum.org/EIPS/eip-712)被用来签署它们。你可以看一下EIP712交易的内部结构[这里](.../api.md#eip712)。

本文档将只关注如何将这些参数传递给SDK。


## Overrides

`ethers.js`有一个重写的概念。对于任何链上交易，`ethers.js`都能找到最佳的`gasPrice`、`gasLimit`、`nonce`和其他重要的字段。但有时，你可能需要明确地提供这些值（例如，你想设置一个较小的`gasPrice`，或签署一个具有未来`nonce`的交易）。

在这种情况下，你可以提供一个`Overrides`对象作为最后一个参数。在那里你可以提供诸如`gasPrice`、`gasLimit`、`nonce`等字段。

为了使SDK尽可能的灵活，`zksync-web3`在覆盖中使用`customData`对象来提供zkSync特定的字段。要提供zkSync特定的字段，你需要传递以下覆盖。

```typescript
{
    overrides: {
        customData: {
            gasPerPubdata?: BigNumberish;
            factoryDeps?: BytesLike[];
            customSignature?: BytesLike;
            paymasterParams?: {
                paymaster: Address;
                paymasterInput: BytesLike;
            };
        }
    }
}
```
请再次注意：`overrides`中`customData`内的所有内容都与zkSync(L2 gas, etc)有关。

例子。

覆盖部署一个字节码为 "0xcde...12 "的合同，并强制要求运营商在第1层每发布一个字节不会收取超过 "100 "的二级气体。

```typescript
{
    customData: {
        gasPerPubdata: "100", 
        factoryDeps: ["0xcde...12"],
    }
}
```

为账户使用自定义签名`0x123456`，同时使用地址为`0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC`的paymaster和paymaster输入`0x8c5a3445`。

```typescript
{
    customData: {
        customSignature: "0x123456",
        paymasterParams: {
            paymaster: "0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC",
            paymasterInput: "0x8c5a3445"
        }
    }
}
```

## 编码paymaster参数

虽然paymaster功能本身并没有对`paymasterInput`的值施加任何限制，但Matter Labs团队认可某些类型的[paymaster flow](.../.../dev/developer-guides/aa.md#built-in-paymaster-flows)是可以由EOAs处理的。

zkSync SDK提供了一个实用方法，可以用来获取正确形成的`paymasterParams'对象。[getPaymasterParams]（./utils.md#encoding-paymaster-params）。

## 在行动中看到

如果你想调用一个名为`greeter'的ethers`Contract`对象的`setGreeting'方法，这将看起来如下，同时用[testnet paymaster]（././dev/developer-guides/aa.md#testnet-paymaster）支付费用。

```javascript
// The `setGreeting` method has a single parameter -- new greeting
// We will set its value as `a new greeting`.
const greeting = "a new greeting";
const tx = await greeter.populateTransaction.setGreeting(greeting);
const gasPrice = await sender.provider.getGasPrice();
const gasLimit = await greeter.estimateGas.setGreeting(greeting);
const fee = gasPrice.mul(gasLimit);

const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
  type: "ApprovalBased",
  token,
  minimalAllowance: fee,
  innerInput: new Uint8Array(),
});
const sentTx = await sender.sendTransaction({
  ...tx,
  maxFeePerGas: gasPrice,
  maxPriorityFeePerGas: BigNumber.from(0),
  gasLimit,
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  },
});
```

你也可以看看我们的[教程](.../.../dev/building-onzksync/hello-world.md)关于成熟的mini-dApp，用户可以选择token来支付费用。
