---
head:
  - - meta
    - name: "twitter:title"
      content: L1 / L2 Interoperability | zkSync Docs
---

# L1 / L2 interoperability

## Common use cases

Many use cases require multi-layer interoperability, such as:

- The network's censorship resistance.
- Custom bridges.
- Multi-layer governing smart contracts.
- Multi-layer transfers.

## L1 to L2 communication

L1 to L2 communication is governed by the [`IZkSync.sol`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/zksync/interfaces/IZkSync.sol) inherited interfaces.

:::tip

- If you prefer to learn-by-doing, the [cross chain governance tutorial](../tutorials/smart-contract-development/cross-chain-tutorial.md) is a practical example of layer interoperability.
  :::

### Gas estimation

The SDK processes gas estimation for transactions implicitly. However, it is also possible to implement the gas estimation processes explicitly.

:::tip L1 to L2 gas estimation for transactions

- Basic costs are measured in the amount of gas, and so the final cost depends on the gas price that the transaction assigns.
- The transaction process requires the current L1 gas price, transaction base cost, and transaction gas limit which defines the maximum amount of gas a transaction can consume.
  :::

- Find out [how to estimate gas](../tutorials/how-to/estimate-gas.md) for different scenarios.
- Find out [how to send a transaction from L1 to L2](../../build/tutorials/how-to/send-transaction-l1-l2.md) with zkSync Era.

## L2 to L1

L2 to L1 communication is based on transferring data as a message, rather than executing an L1 transaction.

To send a message, use the `sendToL1` method of the `L1_MESSENGER_CONTRACT` system contract and pass the message as a raw bytes array. Each time a message is sent, it triggers an [L1MessageSent](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/system-contracts/contracts/interfaces/IL1Messenger.sol#L38) event. The return value from `sendToL1` is the keccak256 hash of the message bytes.

The example contract below sends its address to L1 via the Messenger system contract.

```solidity
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

::: info L2-L1 message How-To
Learn [how to send a message from L2 to L1 using zksync-ethers](../tutorials/how-to/send-message-l2-l1.md).
:::

Once a message is sent, a proof can be retrieved using the [`zks_getL2ToL1LogProof` JSON RPC API method](../api.md#zks-getl2tol1logproof).

This proof can be verified on L1 using the [`proveL2MessageInclusion`](https://github.com/matter-labs/era-contracts/blob/6250292a98179cd442516f130540d6f862c06a16/l1-contracts/contracts/zksync/facets/Mailbox.sol#L35) function, which returns a boolean value indicating whether the message was successfully sent to L1.

The example contract below receives the proof and the information related to the transaction sent to the L2 messenger contract. It then verifies that the message was included in an L2 block.

```solidity
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

## Priority queue

1. All transaction types are supported by the priority queue.

2. The priority queue must be fully permissionless to prevent malicious activity. For example, malicious users might send multiple transactions which push up the block gas limit to unworkable levels. To mitigate against this, submitting transactions to the priority queue is no longer free and users must pay a fee to the operator. To obtain the cost for sending an L2 to L1 message, please refer to [step 5 of how to send an L1 to L2 transaction](../../build/tutorials/how-to/send-transaction-l1-l2.md#step-by-step).
