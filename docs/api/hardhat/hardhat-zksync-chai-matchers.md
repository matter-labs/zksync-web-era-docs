# `hardhat-zksync-chai-matchers'。

这个插件为[Chai](https://www.chaijs.com/)断言库增加了zkSync的特定功能，用于测试智能合约。它扩展了[hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview)插件所支持的所有功能，其理念是保留相同的行为和接口。
目前，它是与[本地测试环境](./testing.md)结合使用的。

> **_NOTE:_** 由于恢复的事务的响应高度依赖于RPC的实现，所有[hardhat](https://hardhat.org/hardhat-chai-matchers/docs/overview)以revert开头的chai匹配器都受到了影响（但chai匹配器接口没有任何变化）。此外，来自changeEtherBalance/changeEtherBalances的options参数已经扩展了overrides字段，以便支持带有overrides的zksync-web3传输方法。

## 安装

用以下命令将该插件的最新版本添加到你的项目中。

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-chai-matchers
```

### Usage

安装后，将该插件添加到你的Hardhat配置中。

```javascript
import "@matterlabs/hardhat-zksync-chai-matchers";
```

Then you'll be able to use the matchers in your tests.

#### changeEtherBalance

断言一个地址的余额改变了一个特定的数量。

```javascript
await expect(() =>
  sender.transfer({
    to: receiver.address,
    amount: 2000,
  })
).to.changeEtherBalance(sender.address, BigInt("-2000"));

await expect(() =>
  sender.sendTransaction({
    to: receiver.address,
    value: 1000,
  })
).to.changeEtherBalance(sender.address, "-1000");
```

这种匹配器包括额外的选项参数，包括收费和覆盖交易的功能。

```javascript
overrides = {
  type: 2,
  maxFeePerGas: 1 * gasPrice,
  maxPriorityFeePerGas: 1 * gasPrice,
};

await expect(() =>
  sender.transfer({
    to: receiver.address,
    amount: 500,
    overrides,
  })
).to.changeEtherBalance(sender, -(txGasFees + 500), {
  balanceChangeOptions: {
    includeFee: true,
  },
  overrides,
});
```

#### changeTokenBalance

断言一个地址的ERC20代币余额改变了一个特定的数额。


```javascript
await expect(sender.transfer({ to: receiver.address, amount: 5, token: token.address })).to.changeTokenBalance(token, sender, -5);

await expect(token.transfer(receiver.address, 5)).to.not.changeTokenBalance(token, sender, 0);
```

#### reverted

断言一项交易因任何原因而恢复。

```javascript
await expect(contract.setAmount(100)).to.be.reverted;
```

#### revertedWithCustomError

断言一个事务因一个特定的自定义错误而被恢复。

```javascript
await expect(contract.setAmount(100)).to.be.revertedWithCustomError(contract, "InvalidAmount");
```

<br/>

而你也可以使用常规的匹配器，如。

#### emit

```javascript
await expect(contract.setAmount(100)).to.emit(contract, "AmountUpdated");
```

#### properAddress

```javascript
expect("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049").to.be.properAddress;
```

#### Comparisons of numbers

```javascript
expect(await contract.getAmount()).to.equal(100);
```

查看使用chai匹配器的优势[这里](https://hardhat.org/hardhat-chai-matchers/docs/overview#why-would-i-want-to-use-it?)。由于所有支持的chai匹配器的列表与[hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview)插件相同，请查看[参考文档](https://hardhat.org/hardhat-chai-matchers/docs/reference)。
