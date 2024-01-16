---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Withdraw Example | zkSync Era Docs
---

# Withdrawal

When it comes to withdrawals there are several notes that needs to be taken into account:

- Withdrawal flow consist of two steps:
  - Executing withdrawal transaction on L2 which initiates submission to L1.
  - Executing finalize withdrawal after the withdrawal transaction is submitted to L1.
- The duration for [submitting a withdrawal transaction to L1](../../../../reference/troubleshooting/withdrawal-delay.md)
  can last up to 24 hours.
- On the testnet, withdrawals are [automatically finalized](../../../../reference/concepts/bridging-asset.md#withdrawals-to-l1).
  There is no need to execute finalize withdrawal step, otherwise, an error with code `jj` would occur.

## Withdraw ETH

This is an example of how to withdraw ETH from zkSync Era network (L2) to Ethereum network (L1):

```ts
import { Provider, types, utils, Wallet } from "zksync-ethers";
import { ethers } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

async function main() {
  console.log(`L2 balance before withdraw: ${await wallet.getBalance()}`);
  console.log(`L1 balance before withdraw: ${await wallet.getBalanceL1()}`);

  const tx = await wallet.withdraw({
    token: utils.ETH_ADDRESS,
    to: await wallet.getAddress(),
    amount: 7_000_000_000,
  });
  const receipt = await tx.wait();
  console.log(`Tx: ${receipt.hash}`);
}

main()
  .then()
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
```

## Withdraw tokens

This is an example of how to withdraw tokens from zkSync Era network (L2) to Ethereum network (L1):

```ts
import { Provider, types, Wallet } from "zksync-ethers";
import { ethers } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

async function main() {
  const token = "0x6a4Fb925583F7D4dF82de62d98107468aE846FD1";

  console.log(`L2 balance before withdrawal: ${await wallet.getBalance()}`);
  console.log(`L1 balance before withdrawal: ${await wallet.getBalanceL1()}`);

  const tx = await wallet.withdraw({
    token: token,
    to: await wallet.getAddress(),
    amount: 5,
  });
  const receipt = await tx.wait();
  console.log(`Tx: ${receipt.hash}`);
}

main()
  .then()
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
```

## Finalize withdrawal

```ts
import { Provider, types, Wallet } from "zksync-ethers";
import { ethers } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const WITHDRAW_TX = process.env.WITHDRAW_TX;

async function main() {
  if (!(await wallet.isWithdrawalFinalized(WITHDRAW_TX))) {
    const finalizeWithdrawTx = await wallet.finalizeWithdrawal(WITHDRAW_TX);
    const receipt = await finalizeWithdrawTx.wait();
    console.log(`Tx: ${receipt.hash}`);

    console.log(`L2 balance after withdraw: ${await wallet.getBalance()}`);
    console.log(`L1 balance after withdraw: ${await wallet.getBalanceL1()}`);
  }
}

main()
  .then()
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
```
