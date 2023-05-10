# L1 / L2 interoperability

While most of the execution is L2-based, there are use cases, including the system's censorship resistance, that require interoperability between L1 and L2. For example, [bridging assets from L1 to L2](../bridging/bridging-asset.md).

## L1 to L2 transactions with the priority queue

The goal of the priority queue is to provide a censorship-resistant way to interact with zkSync Era in case the operator becomes malicious or unavailable.

The way the priority queue works now is very close to how it worked in the previous version of zkSync. For the full picture, we explain the priority queue operation on zkSync Lite before detailing the new priority queue design in zkSync Era.

### How it worked in zkSync Lite

In the previous version, we only had two operations that could be sent to zkSync from L1:

- [`Deposit`](??) to bridge funds from Ethereum to zkSync.
- [`FullExit`](??) to bridge funds back to Ethereum.

If users wanted to deposit or withdraw funds, they had to send a transaction request to the smart contract. The request was appended to the priority queue. The queue had the following rules:

1. All transactions are processed sequentially.
2. Each priority operation must be processed by the operator within `X` days from submission to the contract.

The first rule is strictly enforced by the smart contract. The second rule could be violated if the operator becomes malicious or unavailable. If that happens, the system enters **exodus mode**, where no new blocks can be processed and users can withdraw their funds without cooperation from the operator.

### How it works in zkSync Era

The process described above works well for a system supporting a small set of light operations. zkSync Era supports general smart contract computation, and thus some of the principles had to evolve in order to preserve the stability of the network.

1. All transactions types are now supported by the priority queue. 

    In Lite, users may have had their funds locked on an L2 smart contract, and not on their own L2 account. Now, before moving their funds to L1, they need to send an [`Execute`] transaction to the zkSync network to release the funds from the smart contract first.

    :::info
    The [`Withdraw`](??) function in zkSync Era replaces [`FullExit`](??) in Lite.
    :::

2. The priority queue must be censorship-resistant to prevent spam attacks on the system. For example, malicious users can send multiple transactions that push up the block gas limit to unworkable levels. To mitigate against this, submitting transactions to the priority queue is no longer free and users must pay a fee to the operator. 

    The fee for a transaction is equal to `txBaseCost * gasPrice`. The `gasPrice` is the gas price of the users' transaction, while `txBaseCost` is the base cost for the transaction, which depends on its parameters (e.g. `gasLimit` for an `Execute` transaction).

:::tip
For further details and code examples, check out our [L1 to L2 docs](./l1-l2.md).
:::

## L2 to L1 

L2 to L1 communication is based on transferring the data as a message, and not on L1 transaction execution. 

Find out [how to send a message from L2 to L1](../../how-to/send-message-l2-l1.md).
