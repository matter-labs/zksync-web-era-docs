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

L2 to L1 communication is based on transferring the data as a message, and not on L1 transaction execution.

- Find out [how to send a message from L2 to L1](../tutorials/how-to/send-message-l2-l1.md) with zkSync Era.

## Priority queue

1. All transaction types are supported by the priority queue.

2. The priority queue must be fully permissionless to prevent malicious activity. For example, malicious users might send multiple transactions which push up the block gas limit to unworkable levels. To mitigate against this, submitting transactions to the priority queue is no longer free and users must pay a fee to the operator. To obtain the cost for sending an L2 to L1 message, please refer to [step 5 of how to send an L1 to L2 transaction](../../build/tutorials/how-to/send-transaction-l1-l2.md#step-by-step).
