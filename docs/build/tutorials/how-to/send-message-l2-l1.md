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
- However, zkSync Era has an efficient [request proof function](#prove-the-result) which does the same.
  :::

## Common use cases

Along with zkSync Era's built-in censorship resistance that requires multi-layer interoperability, there are some common use cases that need L2 to L1 transaction functionality, such as:

- Bridging funds from L2 to L1.
- Layer 2 governance.

## Step-by-step

1. Create a project folder and `cd` into it

```sh
mkdir message-l2
cd message-l2
```

2. Run

```sh
yarn init add -y
```

3. Run

```sh
yarn add -D @matterlabs/zksync-contracts
```

4. Import the zkSync Era library or contract containing the required functionality.

```sh
yarn add zksync-ethers@5 ethers@5 typescript @types/node ts-node
```

5. In the root folder add `.env` file with private key of wallet to use

```js
"RICH_WALLET_PRIV_KEY=0x..";
```

6. Create a `file.ts` file in the root directory with the next script:

```ts
// The following script sends a message from L2 to L1, retrieves the message proof, and validates that the message received in L1 came from an L2 block.
import * as ethers from "ethers";
import { Provider, utils, Wallet } from "zksync-ethers";

import dotenv from "dotenv";
dotenv.config();

const TEST_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

const MESSAGE = "Some L2->L1 message";

const l2Provider = new Provider("https://sepolia.era.zksync.dev");
const l1Provider = ethers.getDefaultProvider("sepolia");

const wallet = new Wallet(TEST_PRIVATE_KEY, l2Provider, l1Provider);

async function sendMessageToL1(text: string) {
  console.log(`Sending message to L1 with text ${text}`);
  const textBytes = ethers.utils.toUtf8Bytes(MESSAGE);

  const messengerContract = new ethers.Contract(utils.L1_MESSENGER_ADDRESS, utils.L1_MESSENGER, wallet);
  const tx = await messengerContract.sendToL1(textBytes);
  await tx.wait();
  console.log("L2 trx hash is ", tx.hash);
  return tx;
}

async function getL2MessageProof(blockNumber: ethers.BigNumberish) {
  console.log(`Getting L2 message proof for block ${blockNumber}`);
  return await l2Provider.getMessageProof(blockNumber, wallet.address, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(MESSAGE)));
}

async function proveL2MessageInclusion(l1BatchNumber: ethers.BigNumberish, proof: any, trxIndex: number) {
  const zkAddress = await l2Provider.getMainContractAddress();

  const mailboxL1Contract = new ethers.Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, l1Provider);
  // all the information of the message sent from L2
  const messageInfo = {
    txNumberInBlock: trxIndex,
    sender: wallet.address,
    data: ethers.utils.toUtf8Bytes(MESSAGE),
  };

  console.log(`Retrieving proof for batch ${l1BatchNumber}, transaction index ${trxIndex} and proof id ${proof.id}`);

  const res = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, proof.id, messageInfo, proof.proof);

  return res;
}

/**
 * Full end-to-end of an L2-L1 messaging with proof validation.
 * Recommended to run in 3 steps:
 * 1. Send message.
 * 2. Wait for transaction to finalize and block verified
 * 3. Wait for block to be verified and validate proof
 */
async function main() {
  // Step 1: send message
  const l2Trx = await sendMessageToL1(MESSAGE);

  console.log("Waiting for transaction to finalize...");

  // Step 2: waiting to finalize can take a few minutes.
  const l2Receipt = await l2Trx.waitFinalize();

  // Step 3: get and validate proof (block must be verified)
  const proof = await getL2MessageProof(l2Receipt.blockNumber);

  console.log(`Proof is: `, proof);

  const { l1BatchNumber, l1BatchTxIndex } = await l2Provider.getTransactionReceipt(l2Receipt.transactionHash);

  console.log("L1 Index for Tx in block :>> ", l1BatchTxIndex);

  console.log("L1 Batch for block :>> ", l1BatchNumber);

  // IMPORTANT: This method requires that the block is verified
  // and sent to L1!
  const result = await proveL2MessageInclusion(
    l1BatchNumber,
    proof,
    // @ts-ignore
    l1BatchTxIndex
  );

  console.log("Result is :>> ", result);
  process.exit();
}

try {
  main();
} catch (error) {
  console.error(error);
}
```

6. Add the following lines to your `package.json` in the root folder:

```json
"scripts": {
   "run-file": "ts-node file.ts"
}
```

7. To run the script, execute:

```bash
yarn run-file
```

### Example output

```sh
Sending message to L1 with text Some L2->L1 message
L2 trx hash is  0xb6816e16906788ea5867bf868693aa4e7a46b68ccd2091be345e286a984cb39b
Waiting for transaction to finalize...
Getting L2 message proof for block 5382192
Proof is:  {
  id: 14,
  proof: [
    '0xd92e806d774b16f21a00230a5ee93555dde30138daf8dbbc8c225ad4aa670edd',
    '0xf970801623a03cf02838550dcca2ecf575ace6ae824e5a3339426e69a582c2d8',
    '0x389719c677f61f2681950c2136df476e78e74016268806986d4f0599e8055a4b',
    '0xb1bde90366b509799bd535f03da87f4c2b68e305bfb5166e694809c4caf0df69',
    '0x94b863aefb6546c8465f7700ec701f6b97ddf71a165a6d1e1ce1dc3c41db2534',
    '0x1798a1fd9c8fbb818c98cff190daa7cc10b6e5ac9716b4a2649f7c2ebcef2272',
    '0x66d7c5983afe44cf15ea8cf565b34c6c31ff0cb4dd744524f7842b942d08770d',
    '0xb04e5ee349086985f74b73971ce9dfe76bbed95c84906c5dffd96504e1e5396c',
    '0xac506ecb5465659b3a927143f6d724f91d8d9c4bdb2463aee111d9aa869874db'
  ],
  root: '0xbc872eb80a7d5d35dd16283c1b1a768b1e1c36404000edaaa04868c7d6a5907c'
}
L1 Index for Tx in block :>>  32
L1 Batch for block :>>  77512
Retrieving proof for batch 77512, transaction index 32 and proof id 14
Result is :>>  true
```

## Send a message

Two transactions are required:

- An L2 transaction which sends a message of arbitrary length.
- An L1 read; implemented by a getter function on an L1 smart contract.

1. Get a `Contract` object that represents the [`L1Messenger`](../../../zk-stack/components/smart-contracts/system-contracts.md#l1messenger) contract.

2. Transform the request into a raw bytes array.

3. Use the [`sendToL1`](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/system-contracts/contracts/interfaces/IL1Messenger.sol#L44) function from the [`IL1Messenger.sol`](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/system-contracts/contracts/interfaces/IL1Messenger.sol) interface, passing the message as a raw bytes array.

Each sent message emits an [`L1MessageSent`](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/system-contracts/contracts/interfaces/IL1Messenger.sol#L38) event.

```solidity
event L1MessageSent(address indexed _sender, bytes32 indexed _hash, bytes _message);

function sendToL1(bytes memory _message) external returns (bytes32);
```

3.1 The return value from `sendToL1` is the `keccak256` hash of the message bytes.

## Prove the result

The [`proveL2MessageInclusion`](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/l1-contracts/contracts/zksync/facets/Mailbox.sol#L35) function returns a boolean parameter indicating whether the message was sent successfully to L1.

```solidity
function proveL2MessageInclusion(
    uint256 _blockNumber,
    uint256 _index,
    L2Message memory _message,
    bytes32[] calldata _proof
) public view returns (bool) {
    return _proveL2LogInclusion(_blockNumber, _index, _L2MessageToLog(_message), _proof);
}
```

:::tip Parameter details

- `_blockNumber`: L1 batch number in which the L2 block was included; retrievable using the `getBlock` method.
- `_index`: Index of the L2 log in the block; returned as `id` by the [`zks_getL2ToL1LogProof`](../../api.md#zks-getl2tol1logproof) method.
- `_message`: Parameter holding the message data. It should be an object containing:
  - `sender`: Address that sent the message from L2.
  - `data`: Message sent in bytes.
  - `txNumberInBlock`: Index of the transaction in the L2 block; returned as `transactionIndex` with [`getTransactionReceipt`](https://docs.ethers.org/v5/single-page/#/v5/api/providers/provider/-%23-Provider-getTransactionReceipt) on an Ethers `Provider` object.
- `_proof`: Merkle proof of the message inclusion; retrieved by observing Ethereum or using the `zks_getL2ToL1LogProof` method of the zksync web3 API.
  :::

## Example

::: code-tabs
@tab Solidity 1

```solidity
// The Example contract below sends its address to L1 via the Messenger system contract.
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing interfaces and addresses of the system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract Example {
    function sendMessageToL1() external returns(bytes32 messageHash) {
        // Construct the message directly on the contract
        bytes memory message = abi.encode(address(this));

        messageHash = L1_MESSENGER_CONTRACT.sendToL1(message);
    }
}
```

@tab Solidity 2

```solidity
// This contract receives the information related to the transaction sent to the L2 messenger contract.
// It then proves that the message was included in an L2 block.
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing zkSync contract interface
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Example {
  // NOTE: The zkSync contract implements only the functionality for proving that a message belongs to a block
  // but does not guarantee that such a proof was used only once. That's why a contract that uses L2 to L1
  // communication must take care of the double handling of the message.
  /// @dev mapping L2 block number => message number => flag
  /// @dev Used to indicated that zkSync L2 to L1 message was already processed
  mapping(uint256 => mapping(uint256 => bool)) isL2ToL1MessageProcessed;

  function consumeMessageFromL2(
    // The address of the zkSync smart contract.
    // It is not recommended to hardcode it during the alpha testnet as regenesis may happen.
    address _zkSyncAddress,
    // zkSync block number in which the message was sent
    uint256 _l2BlockNumber,
    // Message index, that can be received via API
    uint256 _index,
    // The tx number in block
    uint16 _l2TxNumberInBlock,
    // The message that was sent from l2
    bytes calldata _message,
    // Merkle proof for the message
    bytes32[] calldata _proof
  ) external {
    // check that the message has not been processed yet
    require(!isL2ToL1MessageProcessed[_l2BlockNumber][_index]);

    IZkSync zksync = IZkSync(_zkSyncAddress);
    address someSender = 0x19A5bFCBE15f98Aa073B9F81b58466521479DF8D;
    L2Message memory message = L2Message({sender: someSender, data: _message, txNumberInBlock:_l2TxNumberInBlock});

    bool success = zksync.proveL2MessageInclusion(
      _l2BlockNumber,
      _index,
      message,
      _proof
    );
    require(success, "Failed to prove message inclusion");

    // Mark message as processed
    isL2ToL1MessageProcessed[_l2BlockNumber][_index] = true;
  }
}
```

@tab Python

```sh
// In progress. Check back later.
```

@tab Go

```sh
// In progress. Check back later.
```

:::
