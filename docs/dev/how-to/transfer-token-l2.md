---
head:
  - - meta
    - name: "twitter:title"
      content: Transfer a token on L2 | zkSync Era Docs
---

# Transfer a token on L2

## Prerequisites

- A [Node.js](https://nodejs.org/en/download) installation.
- The token address from the [testnet tokens page](https://goerli.explorer.zksync.io/tokenlist). This document uses DAI on testnet.
- Check the [mainnet tokens list](https://explorer.zksync.io/tokenlist) for mainnet token addresses.
- Be sure to have some of the token in your wallet.
- You should also know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

## Set up

### 1. Create a project folder and `cd` into it

```sh
mkdir transfer-l2
cd transfer-l2
```

### 2. Add the libraries

```sh
yarn add zksync-web3 ethers@5 typescript @types/node ts-node
```

## Step-by-step

### 1. Create a script

```sh
nano transfer-l2.ts
```

### 2. Import the libraries

Open the file and add the following imports:

```ts
import * as zksync from "zksync-web3";
import * as ethers from "ethers";
```

### 3. Create a wallet for the sender

:::tip
Check the [JSON-RPC API doc](https://era.zksync.io/docs/api/api.html#rpc-endpoint-urls) for the correct RPC endpoint URL.
:::

Create a zkSync Era provider on testnet and use it to build a zkSync Era wallet, replacing `<PRIVATE-KEY` with your private key.

```ts
const zkSyncProvider = new zksync.Provider("https://testnet.era.zksync.dev");
const zkSyncWallet = new zksync.Wallet("<SENDER-PRIVATE-KEY>", zkSyncProvider);
```

### 4. Store the recipient's public key

```ts
const receiverWallet = "<RECIPIENT-PUBLIC-KEY>";
```

### 5. Store the token address

```ts
const _DAI = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";
```

### 6. Transfer 1 token to the recipient

```ts
async function l2transfer() {
  // Create a variable to store the token amount to transfer
  const amount = ethers.BigNumber.from("1000000000000000000");

  // Log the balance of the accounts before transferring
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", _DAI), 18)}" DAI`);
  console.log(`TO receiver account: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", _DAI), 18)}" DAI`);

  const transfer = await zkSyncWallet.transfer({
    to: receiverWallet,
    token: _DAI,
    amount,
  });

  // Await commitment
  const transferReceipt = await transfer.wait();
  console.log(`Tx transfer hash for DAI: ${transferReceipt.blockHash}`);

  // Show the balance of wallets after transfer
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", _DAI), 18)}" DAI`);
  console.log(`TO receiver wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", _DAI), 18)}" DAI`);
}
```

### 7. Code the call to the transfer function

```ts
l2transfer();
```

## Full code

```ts
// Import the relevant libraries
import * as zksync from "zksync-web3";
import * as ethers from "ethers";

// Create zkSync Era provider on testnet
const zkSyncProvider = new zksync.Provider("https://testnet.era.zksync.dev");

// Create a zkSync wallet for the sender
const zkSyncWallet = new zksync.Wallet("<SENDER-PRIVATE-KEY>", zkSyncProvider);

// Store the recipient public key
const receiverWallet = "<RECIPIENT-PUBLIC-KEY>";

// Store the L2 token address
const _DAI = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b";

async function l2transfer() {
  // Create a variable to store the token amount in wei to transfer
  const amount = ethers.BigNumber.from("1000000000000000000");

  //Show the balance of wallets before transferring
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", _DAI), 18)}" DAI`);
  console.log(`TO receiver wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", _DAI), 18)}" DAI`);

  const transfer = await zkSyncWallet.transfer({
    to: receiverWallet,
    token: _DAI,
    amount,
  });

  // Await commitment
  const transferReceipt = await transfer.wait();
  console.log(`Tx transfer hash for DAI: ${transferReceipt.blockHash}`);

  // Show the balance of wallets after transferring
  console.log(`FROM this L2 wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(zkSyncWallet.address, "latest", _DAI), 18)}" DAI`);
  console.log(`TO receiver wallet: "${ethers.utils.formatUnits(await zkSyncProvider.getBalance(receiverWallet, "latest", _DAI), 18)}" DAI`);
}

l2transfer();
```

## Run the script

```sh
yarn ts-node transfer-l2.ts
```

## Output

You should see output like this:

```txt
FROM this L2 wallet: "22.999999998999999999" DAI
TO receiver wallet: "2.000000000000000000" DAI
Tx transfer hash for DAI: 0x12b6c9fffa4570d9fa2dcb6e8b1efbc70c5bfd9eac175c96be71d356082ffb0c
FROM this L2 wallet: "21.999999998999999999" DAI
TO receiver wallet: "3.000000001000000001" DAI
✨  Done in 12.11s.
```
