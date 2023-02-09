# `hardhat-zksync-chai-matchers`

This plugin adds zkSync-specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts. It extends all the functionalities supported by the [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview) plugin, with the idea to preserve the same behavior and interface.
Currently, it is used in combination with [local testing environment](https://v2-docs.zksync.io/api/hardhat/testing.html).

> **_NOTE:_** Since responses from transactions that revert are highly dependent on the RPC implementation, all [hardhat](https://hardhat.org/hardhat-chai-matchers/docs/overview) chai matchers that start with revert have been affected (but without any changes to the chai matchers interface). In addition, the options argument from changeEtherBalance/changeEtherBalances has been extended with the overrides field in order to support zksync-web3 transfer method with overrides.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Installation

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-chai-matchers
```

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync-chai-matchers";
```

Then you'll be able to use the matchers in your tests.

#### changeEtherBalance

Assert that the ether balance of an address changed by a specific amount:

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

This matchers include additional options argument with functionalities for including fee and overriding transaction:

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

Assert that an ERC20 token balance of an address changed by a specific amount:

```javascript
await expect(sender.transfer({ to: receiver.address, amount: 5, token: token.address })).to.changeTokenBalance(token, sender, -5);

await expect(token.transfer(receiver.address, 5)).to.not.changeTokenBalance(token, sender, 0);
```

#### reverted

Assert that a transaction reverted for any reason:

```javascript
await expect(contract.setAmount(100)).to.be.reverted;
```

#### revertedWithCustomError

Assert that a transaction reverted with a specific custom error:

```javascript
await expect(contract.setAmount(100)).to.be.revertedWithCustomError(contract, "InvalidAmount");
```

<br/>

And you can also use regular chai matchers like:

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

Checkout the advantages of using chai matchers [here](https://hardhat.org/hardhat-chai-matchers/docs/overview#why-would-i-want-to-use-it?). Since the list of all supported chai matchers is same as with [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview) plugin, check the [reference documentation](https://hardhat.org/hardhat-chai-matchers/docs/reference).
