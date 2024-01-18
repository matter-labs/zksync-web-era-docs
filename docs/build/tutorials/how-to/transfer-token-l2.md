---
head:
  - - meta
    - name: "twitter:title"
      content: Transfer a Token on L2 | zkSync Docs
---

# Transfer a token on L2

## Prerequisites

- A [Node.js](https://nodejs.org/en/download) installation.
- The token's address from the [testnet tokens page](https://sepolia.explorer.zksync.io/tokenlist). This document uses `MCRN` on testnet.
  - Check the [mainnet tokens list](https://explorer.zksync.io/tokenlist) for mainnet token addresses.
- Be sure to have some of the token in your wallet.
  - Use the [Macaron Swap](https://macaronswap.finance/swap) if you need to swap Sepolia ETH for `MCRN` token.
- You should also know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

## Setup

### 1. Create a project folder and `cd` into it

```sh
mkdir transfer-l2
cd transfer-l2
```

### 2. Add the libraries

```sh
yarn add zksync-ethers@5 ethers@5 typescript @types/node ts-node
```

## Step-by-step

### 1. Create a script

```sh
touch transfer-l2.ts
```

### 2. Import the libraries

Open the file and add the following imports:

```ts
import * as zksync from "zksync-ethers";
import * as ethers from "ethers";
```

### 3. Create a wallet for the sender

:::tip
Check the [JSON-RPC API doc](../../api.md#rpc-endpoint-urls) for the correct RPC endpoint URL.
:::

Create a zkSync Era provider on testnet and use it to build a zkSync Era wallet, replacing `<SENDER-PRIVATE-KEY>` with your private key.

```ts
const zkSyncProvider = new zksync.Provider("https://sepolia.era.zksync.dev");
const zkSyncWallet = new zksync.Wallet("<SENDER-PRIVATE-KEY>", zkSyncProvider);
```

### 4. Store the recipient's public key

Save the recipient's wallet address to a variable, replacing `<RECIPIENT-PUBLIC-KEY>` with their public key.

```ts
const receiverWallet = "<RECIPIENT-PUBLIC-KEY>";
```

### 5. Store the token information

```ts
const l2TokenName = "MCRN";
const l2TokenAddress = "0xAFe4cA0Bbe6215cBdA12857e723134Bc3809F766";
```

### 6. Transfer tokens to the recipient

```ts
async function l2transfer() {
  // Amount of Token to transfer
  const amount = ethers.BigNumber.from("100000000"); // 0.0000000001
  console.log(`Amount of token to transfer: ${ethers.utils.formatEther(amount)} ${l2TokenName}`);

  // Log the balance of the accounts before transferring
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
  console.log(`TO receiver account: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);

  const transfer = await zkSyncWallet.transfer({
    to: receiverWallet,
    token: l2TokenAddress,
    amount,
  });

  // Await commitment
  const transferReceipt = await transfer.wait();
  console.log(`Tx transfer hash for ${l2TokenName}: ${transferReceipt.blockHash}`);

  // Show the balance of wallets after transfer
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
  console.log(`TO receiver wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
}
```

### 7. Code the call to the transfer function

```ts
l2transfer();
```

## Full code

```ts
// Import the relevant libraries
import * as zksync from "zksync-ethers";
import * as ethers from "ethers";

// Create zkSync Era provider on testnet
const zkSyncProvider = new zksync.Provider("https://sepolia.era.zksync.dev");

// Create a zkSync wallet for the sender
const zkSyncWallet = new zksync.Wallet("<SENDER-PRIVATE-KEY>", zkSyncProvider);

// Store the recipient public key
const receiverWallet = "<RECIPIENT-PUBLIC-KEY>";

// Store the L2 token address
const l2TokenName = "MCRN";
const l2TokenAddress = "0xAFe4cA0Bbe6215cBdA12857e723134Bc3809F766";

async function l2transfer() {
  // Amount of Token to transfer
  const amount = ethers.BigNumber.from("100000000"); // 0.0000000001
  console.log(`Amount of token to transfer: ${ethers.utils.formatEther(amount)} ${l2TokenName}`);

  // Log the balance of the accounts before transferring
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
  console.log(`TO receiver account: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);

  const transfer = await zkSyncWallet.transfer({
    to: receiverWallet,
    token: l2TokenAddress,
    amount,
  });

  // Await commitment
  const transferReceipt = await transfer.wait();
  console.log(`Tx transfer hash for ${l2TokenName}: ${transferReceipt.blockHash}`);

  // Show the balance of wallets after transfer
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
  console.log(`TO receiver wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", l2TokenAddress), 18)}" ${l2TokenName}`);
}

l2transfer();
```

## Run the script

```sh
yarn ts-node transfer-l2.ts
```

:::tip
Try running the `ts-node transfer-l2.ts` command in case you receive an error with `yarn ts-node transfer-l2.ts`.
:::

## Output

You should see output like this:

```txt
Amount of token to transfer: 0.0000000001 MCRN
FROM this L2 wallet: "0.00000004530161678" MCRN
TO receiver account: "0.0000000001" MCRN
Tx transfer hash for MCRN: 0x254d63addbf4bfaa3e584e6e9a211d769fc0dd56844ae2caa92a3f305c6c0d04
FROM this L2 wallet: "0.00000004520161678" MCRN
TO receiver wallet: "0.0000000002" MCRN
✨  Done in 4.65s.
```
