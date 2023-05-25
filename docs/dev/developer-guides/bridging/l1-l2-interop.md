# L1 / L2 interoperability

## Common use cases

Many use cases require multi-layer interoperability, such as:

- The network's censorship resistance.
- Custom bridges.
- Multi-layer governing smart contracts.
- Multi-layer transfers.

## L1 to L2 communication

L1 to L2 communication is governed by the [`IZkSync.sol`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IZkSync.sol#L4) inherited interfaces.

:::tip
- If you prefer to learn-by-doing, the [cross chain governance tutorial](../../tutorials/cross-chain-tutorial.md) is a practical example of layer interoperability.
:::

### Gas estimation

The system processes gas estimation for transactions implicitly. However, it is also possible to implement the gas estimation processes explicitly.

:::tip L1 to L2 gas estimation for transactions
- Gas is measured in amount and not ERC20 token value so actual costs can vary.
- The transaction process requires the current L1 gas price, transaction base cost, and transaction gas limit which defines the maximum amount of gas a transaction can consume.
:::

- Find out [how to estimate gas](../../how-to/estimate-gas.md) for different scenarios.
- Find out [how to send a transaction from L1 to L2](../../how-to/send-transaction-l1-l2.md) with zkSync Era.

## L2 to L1 

L2 to L1 communication is based on transferring the data as a message, and not on L1 transaction execution. 

- Find out [how to send a message from L2 to L1](../../how-to/send-message-l2-l1.md) with zkSync Era.

## Priority queue

1. All transactions types are now supported by the priority queue. 

    In Lite, users may have had their funds locked on an L2 smart contract, and not on their own L2 account. Now, before moving funds to L1, they can execute a transaction on the zkSync Era network which releases the funds from the smart contract so they can move them.

    :::info
    The withdraw functionality in zkSync Era replaces `FullExit` in Lite.
    :::

2. The priority queue must be fully permissionless to prevent malicious activity. For example, malicious users might send multiple transactions which push up the block gas limit to unworkable levels. To mitigate against this, submitting transactions to the priority queue is no longer free and users must pay a fee to the operator. 

    The fee for a transaction is equal to `txBaseCost * gasPrice`. The `gasPrice` is the gas price of the user's transaction, while `txBaseCost` is the base cost for the transaction and depends on the transaction parameters (e.g. `gasLimit` for an `Execute` transaction).