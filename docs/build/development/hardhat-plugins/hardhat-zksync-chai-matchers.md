---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Chai Matchers | zkSync Era Docs
---

# hardhat-zksync-chai-matchers

### Overview

This plugin augments the Chai assertion library with zkSync-specific matchers for smart contract testing. It builds on the `hardhat-chai-matchers` plugin, preserving the same behavior and interface.

### Installation

::: code-tabs
@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-chai-matchers
```

:::

### Configuration

In `hardhat.config.js`:

```javascript
import "@matterlabs/hardhat-zksync-chai-matchers";
```

### Matchers

#### `changeEtherBalance`

Checks if the ether balance of an address changed by a specific amount.

```javascript
await expect(() => sender.transfer({ to: receiver.address, amount: 2000 })).to.changeEtherBalance(sender.address, BigInt("-2000"));
```

#### `changeTokenBalance`

Checks if an ERC20 token balance of an address changed by a specific amount.

```javascript
await expect(sender.transfer({ to: receiver.address, amount: 5, token: token.address })).to.changeTokenBalance(token, sender, -5);
```

#### `reverted`

Checks if a transaction reverts.

```javascript
await expect(contract.setAmount(100)).to.be.reverted;
```

#### `revertedWithCustomError`

Checks if a transaction reverted with a specific custom error.

```javascript
await expect(contract.setAmount(100)).to.be.revertedWithCustomError(contract, "InvalidAmount");
```

#### Standard Chai Matchers

- `emit`

  ```javascript
  await expect(contract.setAmount(100)).to.emit(contract, "AmountUpdated");
  ```

- `properAddress`

  ```javascript
  expect("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049").to.be.properAddress;
  ```

- `Comparisons of numbers`

  ```javascript
  expect(await contract.getAmount()).to.equal(100);
  ```

For further reading, consult the In-depth documentation.

| Matcher                   | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `changeEtherBalance`      | Checks ether balance change.                           |
| `changeTokenBalance`      | Checks ERC20 token balance change.                     |
| `reverted`                | Checks if a transaction reverts.                       |
| `revertedWithCustomError` | Checks if a transaction reverts with a specific error. |
| `emit`                    | Checks if an event was emitted.                        |
| `properAddress`           | Validates if a string is a proper address.             |
| `Comparisons of numbers`  | Compares numbers for equality, greater than, etc.      |
