---
head:
  - - meta
    - name: "twitter:title"
      content: Send an L2 to L1 Message | zkSync Docs
---

# Send an L2 to L1 message

It is impossible to send transactions directly from L2 to L1.

Instead, you can send arbitrary-length messages from zkSync Era to Ethereum, and then handle the received message on Ethereum with an L1 smart contract.

:::warning What is a message?

- A message is like an event on Ethereum.
- The difference is that a message publishes data on L1.

- [Solidity representation](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/l1-contracts/contracts/zksync/Storage.sol#L60):
  `solidity
struct L2Message {
        address sender;
        bytes data;
        uint256 txNumberInblock;
}
`
  :::

:::tip Verification

- Verification and confirmation is possible using Ethereum data.
- However, zkSync Era has an efficient [request proof function](#_4-retrieve-the-message-proof) which does the same.
  :::

## Common use cases

Along with zkSync Era's built-in censorship resistance, which requires multi-layer interoperability, there are some common use cases that need L2 to L1 transaction functionality, such as:

- Bridging funds from L2 to L1.
- Layer 2 governance.

## Example using zksync-ethers

### 1. Project setup

1. Create a project folder and `cd` into it

```sh
mkdir message-l2
cd message-l2
```

2. Initialise the project:

```sh
yarn init -y
```

3. Install the required dependencies:

```sh
yarn add -D zksync-ethers ethers typescript dotenv @matterlabs/zksync-contracts @types/node
```

4. Install `ts-node` globally to execute the scripts that we're going to create:

```sh
yarn global add ts-node
```

5. In the root folder, add a `.env` file with the private key of the wallet to use:

```md
WALLET_PRIVATE_KEY=0x..;
```

### 2. Send the message

To send a message from L2 to L1, we are going to interact with the zkSync messenger contract.

Both the address and ABI are provided in the `utils.L1_MESSENGER_ADDRESS` and `utils.L1_MESSENGER` of `zksync-ethers`. The method we're using is `sendToL1` and we're passing the message in UTF8 bytes format.

Create a `1.send-message.ts` file in the root directory with the next script:

```ts
// The following script sends a message from L2 to L1
import * as ethers from "ethers";
import { Provider, utils, Wallet } from "zksync-ethers";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) {
  throw new Error("Please provide WALLET_PRIVATE_KEY in .env file");
}

const l2Provider = new Provider("https://sepolia.era.zksync.dev");
const l1Provider = ethers.getDefaultProvider("sepolia");

const wallet = new Wallet(PRIVATE_KEY, l2Provider, l1Provider);

export async function sendMessageToL1(message: string): Promise<string> {
  console.log(`Sending message to L1 with text ${message}`);
  const textBytes = ethers.toUtf8Bytes(message);

  const messengerContract = new ethers.Contract(utils.L1_MESSENGER_ADDRESS, utils.L1_MESSENGER, wallet);
  const tx = await messengerContract.sendToL1(textBytes);
  await tx.wait();
  console.log("L2 trx hash is ", tx.hash);
  console.log(`Check https://sepolia.explorer.zksync.io/tx/${tx.hash}`);
  return tx.hash;
}

try {
  // To run this script on stand alone mode, you need to provide the message to send
  const MESSAGE = "Some L2->L1 message";
  sendMessageToL1(MESSAGE);
} catch (error) {
  console.error(error);
}
```

Adapt the message in the `MESSAGE` variable and execute the script by running:

```bash
ts-node 1.send-message.ts
```

You should see the following output:

```bash
Sending message to L1 with text Some L2->L1 message
L2 trx hash is  0x926efb47c374478191645a138c5d110e6a6a499ea542e14bcb583918646f7db5
Check https://sepolia.explorer.zksync.io/tx/0x926efb47c374478191645a138c5d110e6a6a499ea542e14bcb583918646f7db5
```

### 3. Retrieve the message transaction details

::: info Transaction must be included in a batch
In order to continue, we need the transaction that sent the message to be included in a batch and sent to L1. This time varies depending on the network activity and could be around one hour.
:::

For the next steps we'll need information about the L2 block and L1 batch the transaction was included into. Create a `2.get-tx-details.ts` file in the root directory with the next script:

```ts
// The following retrieves an L2-L1 transaction details
import { Provider } from "zksync-ethers";

const l2Provider = new Provider("https://sepolia.era.zksync.dev");

export async function getTransactionDetails(hash: string) {
  console.log(`Getting L2 tx details for transaction ${hash}`);
  const l2Receipt = await l2Provider.getTransactionReceipt(hash);
  console.log(`L2 transaction included in block ${l2Receipt.blockNumber} with index ${l2Receipt.index}`);
  console.log(`L1 batch number is ${l2Receipt.l1BatchNumber} and tx index in L1 batch is ${l2Receipt.l1BatchTxIndex}`);
  console.log(`Check https://sepolia.explorer.zksync.io/tx/${hash} for more details`);
  return l2Receipt;
}

try {
  // To run this script on stand alone mode, you need to provide the L2 tx hash
  const TX_HASH = "";
  getTransactionDetails(TX_HASH);
} catch (error) {
  console.error(error);
}
```

This script retrieves the transaction receipt. The fields we're interested in are:

- `blockNumber`: the L2 block number the transaction was included into.
- `index`: the index of the transaction in the L2 block.
- `l1BatchNumber`: the L1 batch number the transaction was included into.
- `l1BatchTxIndex`: the index of the transaction in the L1 batch.

Enter the transaction hash from [the previous step](#_2-send-the-message) in the `TX_HASH` variable and run the script with:

```bash
ts-node 2.get-tx-details.ts
```

You'll get the following output:

```bash
Getting L2 tx details for transaction 0x7be3434dd5f886bfe2fe446bf833f09d1be08e0a644a4996776fec569c3801a0
L2 transaction included in block 2607311 with index 0
L1 batch number is 9120 and tx index in L1 batch is 953
Check https://sepolia.explorer.zksync.io/tx/0x7be3434dd5f886bfe2fe446bf833f09d1be08e0a644a4996776fec569c3801a0 for more details
```

### 4. Retrieve the message proof

To retrieve the proof that the message was sent to L1, create a `3.get-proof.ts` file in the root directory with the next script:

```ts
import { Provider } from "zksync-ethers";

const l2Provider = new Provider("https://sepolia.era.zksync.dev");

export async function getL2LogProof(hash: string, index: number) {
  console.log(`Getting L2 message proof for transaction ${hash} and index ${index}`);
  const proof = await l2Provider.getLogProof(hash, index);
  console.log(`Proof is: `, proof);
  return proof;
}

try {
  // To run this script on stand alone mode, you need to provide the transaction hash and L2 tx index
  const TX_HASH = "0x7be3434dd5f886bfe2fe446bf833f09d1be08e0a644a4996776fec569c3801a0";
  const L2_TX_INDEX = 0;

  getL2LogProof(TX_HASH, L2_TX_INDEX);
} catch (error) {
  console.error(error);
}
```

The `getLogProof` method requires the L2 transaction hash and the L2 transaction index, both of which are included in the transaction receipt that [we retrieved in the previous step](#_3-retrieve-the-message-transaction-details).

Enter the hash and index in the `TX_HASH` and `L2_TX_INDEX` variables and run the script with:

```bash
ts-node 3.get-proof.ts
```

You'll get an output similar to this:

```bash
Getting L2 message proof for transaction 0x7be3434dd5f886bfe2fe446bf833f09d1be08e0a644a4996776fec569c3801a0 and index 0
Proof is:  {
  id: 15,
  proof: [
    '0x871b381c5abfd7365d19ef7bf2b9bd80912b6728a4475dfbaf2f2c652f9912b6',
    '0x505e3c0e95b3f2c18a11630874013b527820b729cf8443da3b39c0f029a5d354',
    '0x1d49feee54b5d52f361196a133e1265481afae3fcc3ccfae74ef5df0f0c1bad6',
    '0x71c3b4937077cd356e32d3f5c413eddff25caf93542a6fa05f0b1c046b6c59d5',
    '0x33d776ccbbe67db6aaf1ab61ec564d406b33f7f9d12c587a85104077d13cecd3',
    '0x1798a1fd9c8fbb818c98cff190daa7cc10b6e5ac9716b4a2649f7c2ebcef2272',
    '0x66d7c5983afe44cf15ea8cf565b34c6c31ff0cb4dd744524f7842b942d08770d',
    '0xb04e5ee349086985f74b73971ce9dfe76bbed95c84906c5dffd96504e1e5396c',
    '0xac506ecb5465659b3a927143f6d724f91d8d9c4bdb2463aee111d9aa869874db',
    '0x124b05ec272cecd7538fdafe53b6628d31188ffb6f345139aac3c3c1fd2e470f',
    '0xc3be9cbd19304d84cca3d045e06b8db3acd68c304fc9cd4cbffe6d18036cb13f',
    '0xfef7bd9f889811e59e4076a0174087135f080177302763019adaf531257e3a87',
    '0xa707d1c62d8be699d34cb74804fdd7b4c568b6c1a821066f126c680d4b83e00b',
    '0xf6e093070e0389d2e529d60fadb855fdded54976ec50ac709e3a36ceaa64c291'
  ],
  root: '0x98ebb6d15a0274a2a40bf7ca42d1576c994f29e23155c10597cd5a0c9ed7e367'
}
```

### 5. Verify the message transaction proof

Once we have a proof that the message was sent from L2, we can verify that it was actually included in L1. Create a `4.prove-inclusion.ts` file in the root directory with the next script:

```ts
import * as ethers from "ethers";
import { Provider, utils } from "zksync-ethers";

const l2Provider = new Provider("https://sepolia.era.zksync.dev");
const l1Provider = ethers.getDefaultProvider("sepolia");

export async function proveL2MessageInclusion(l1BatchNumber: ethers.BigNumberish, proof: any, l1BatchTxIndex: number, sender: string, message: string) {
  const zkAddress = await l2Provider.getMainContractAddress();

  const mailboxL1Contract = new ethers.Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, l1Provider);
  // all the information of the message sent from L2
  const messageInfo = {
    txNumberInBatch: l1BatchTxIndex,
    sender: sender,
    data: ethers.toUtf8Bytes(message),
  };

  console.log(`Retrieving proof for batch ${l1BatchNumber}, transaction index ${l1BatchTxIndex} and proof id ${proof.id}`);

  const res = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, proof.id, messageInfo, proof.proof);

  console.log("Is proof valid?: ", res)
  return res;
}

try {
  // To run this script on stand alone mode, you need to provide the following details

  // The account that sent the transaction in step 1
  const SENDER = "0x...";
  // The same message we sent in step 1
  const MESSAGE = "";
  // Retrieved in step 2
  const L1_BATCH_NUMBER = ;
  const L1_BATCH_TX_INDEX = 953;
  // The full proof object, including root, proof and id
  const PROOF = {};

  proveL2MessageInclusion(L1_BATCH_NUMBER, PROOF, L1_BATCH_TX_INDEX, SENDER, MESSAGE);
} catch (error) {
  console.error(error);
}

```

This scripts interacts with the `proveL2MessageInclusion` method of the zkSync contract on L1. This method requires the following parameters:

- `l1BatchNumber`: Batch number the L2 transaction was included into.
- `proofId`: the `id` of the proof retrieved in step 3.
- `messageInfo`: an object including:
  - `txNumberInBatch`: the index of the transaction in the L1 batch.
  - `sender`: the address of the account that sent the transaction.
  - `data`: the message formated in UTF8 bytes format.
- `proof`: the `proof` retrieved in step 3.

Enter all these details in the `SENDER`, `MESSAGE`, `L1_BATCH_NUMBER`, `L1_BATCH_TX_INDEX` and `PROOF` variables and execute the script with:

```bash
ts-node 4.prove-inclusion.ts
```

You'll get the following output:

```bash
Retrieving proof for batch 9120, transaction index 953 and proof id 15
Result is :>>  true
```

This indicates the proof is valid and the message was actually included in L1.
