# Send a message L2 to L1 

Unlike L1 to L2 communication, it is impossible to directly initialize transactions from L2 to L1. Instead, send an arbitrary-length message from zkSync to Ethereum, and then handle the received message with an L1 smart contract.

Verification and confirmation is possible with Ethereum data. However, zkSync Era provides a request proof method to do the same.

## Use cases

- An L2 transaction uses a bridge to transfer funds. The tokens are removed from L2, and a message is sent to L1 saying the tokens were burned. On L1, the block containing the message is proved, and the bridge counterpart verifies that the token was indeed present in a certain block on L2 and supplies the funds.

## Send a message

Two transactions are required: 

- An L2 transaction which sends a message of arbitrary length.
- An L1 read implemented by a getter function on an L1 smart contract. 

1. Import the zkSync Era library or contract containing the required functionality. 

2. Get a `Contract` object that represents the [`Messenger`](../developer-guides/system-contracts.md#l1messenger) contract.

3. Transform the request into a raw bytes array.

4. Use the [`sendToL1`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l2/system-contracts/interfaces/IL1Messenger.sol#L5) function from the `IL1Messenger.sol` interface, passing the message as a raw bytes array.

Each sent message emits an `L1MessageSent` event.

```solidity
function sendToL1(bytes memory _message) external returns (bytes32);
```

4.1 The return value from `sendToL1` is the `keccak256` hash of the message bytes.

```json
// output example ??
```

:::warning What is a message?
- A message functions like an event on Ethereum. The difference is that a message publishes data on L1. 
- Its Solidity representation:
    ```solidity
    struct L2Message {
            address sender;
            bytes data;
            uint256 txNumberInblock;
    }
    ```
:::

## Prove the result

1. The [`proveL2MessageInclusion`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/facets/Mailbox.sol#L46) function returns a boolean parameter indicating whether the message was sent successfully to L1.

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
- `_blockNumber`: the L1 batch number in which the L2 block was included; retrievable using the `getBlock` method.
- `_index`: the index of the L2 log in the block; returned as `id` by the [`zks_getL2ToL1LogProof`](../../api/api.md#zks_getl2tol1logproof) method.
`_message`: a parameter that contains the full information of the message sent. It should be an object containing:
    - `sender`: the address that sent the message from L2.
    - `data`: the message sent in bytes.
- `txNumberInBlock`: the index of the transaction in the L2 block, which is returned as transactionIndex using getTransaction
- `_proof` is a parameter that contains the Merkle proof of the message inclusion. It can be retrieved either from observing Ethereum or received from the zks_getL2ToL1LogProof method of the zksync-web3 API.
:::

2. The return value from `proveL2MessageInclusion` is `true` or `false`.

```json
// output example ??
```

## Example

::: code-tabs
@tab Solidity
```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing zkSync contract interface
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Example {

    function sendMessageToL1() external returns(bytes32 messageHash) {
        // Construct the message directly on the contract
        bytes memory message = abi.encode(address(this));

        messageHash = L1_MESSENGER_CONTRACT.sendToL1(message);
    }

  // NOTE: The zkSync contract implements only the functionality for proving that a message belongs to a block
  // but does not guarantee that such a proof was used only once. That's why a contract that uses L2 -> L1
  // communication must take care of the double handling of the message.
  /// @dev mapping L2 block number => message number => flag
  /// @dev Used to indicated that zkSync L2 -> L1 message was already processed
  mapping(uint256 => mapping(uint256 => bool)) isL2ToL1MessageProcessed;

  function consumeMessageFromL2(
    // The address of the zkSync smart contract.
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
@tab JavaScript
```js
import * as ethers from "ethers";
import { Provider, utils, Wallet } from "zksync-web3";
const TEST_PRIVATE_KEY = "<YOUR_PRIVATE_KEY>";

const MESSAGE = "Some L2->L1 message";

const l2Provider = new Provider("https://testnet.era.zksync.dev");
const l1Provider = ethers.getDefaultProvider("goerli");

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
@tab Python
```sh
// In progress. Check back later.
```
@tab Go
```sh
// In progress. Check back later.
```
:::

### Result

The return value is the `keccak256` hash of the message bytes.??

```json
// output example ??
```