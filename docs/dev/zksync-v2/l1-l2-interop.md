# L1 / L2 Interoperability

While most of the execution will happen on L2, some use-cases require interoperability with the L1 chain. The main use-cases are building complex bridges, maintaining governance smart contracts on one chain that govern contracts on other chains, etc.

Also, the L2 censorship resistance derives from the underlying chain, so the ability to send messages from Ethereum to zkSync is an important part of the censorship-resistance mechanism called [priority queue](#priority-queue).

## L1 -> L2 communication

Sending transactions from Ethereum to zkSync is done via the zkSync smart contract. It allows the sender to request transactions directly from the L1. Thereby allowing permissionless pass of any data from the Ethereum into zkSync.

## Priority queue

### How it worked in zkSync 1.x

The way the priority queue works in zkSync 2.0 is very close to how it works in the previous version of zkSync. Looking at the example of how it worked before gives the rationale for the new design of the priority queue for zkSync 2.0.

The goal is the same: provide a censorship-resistant way to interact with zkSync in case the operator becomes malicious or unavailable. Back then, we only had two operations that could be sent to zkSync from L1:

- `Deposit` to bridge funds from Ethereum to zkSync.
- `FullExit` is essentially the same as `Withdraw` in zkSync 2.0, to bridge the funds back from Ethereum.

If a user wanted to deposit funds to or withdraw funds from zkSync, they would have sent a transaction request to the smart contract which then got appended to the deque of priority transactions. The deque has the following rules:

- All transactions are processed sequentially.
- Each priority operation must be processed by the operator within `X` days since it was submitted to the contract.

The first rule is strictly enforced by the smart contract. The second rule may be violated if the operator becomes malicious or unavailable. In case that happens, the system entered exodus mode, where no new blocks can be processed and the users can withdraw their funds without cooperation from the operator.

### What changes are needed?

The process described above works well for a system with a small set of relatively light operations supported. zkSync 2.0 supports general smart contract computation and thus, some of the principles had to be changed in order to preserve the stability of the network.

Firstly, all the transactions need to be supported by the priority queue. The users may have their funds locked on an L2 smart contract, and not on their own account. So before moving their funds to L1, they need to send an `Execute` transaction to zkSync to release the funds from that smart contract first.

Secondly, the priority queue needs to stay censorship-resistant. But imagine what will happen if users start sending a lot of transactions that take the entirety of the block ergs limit? There needs to be a way to prevent spam attacks on the system. That's why submitting the transactions to the priority queue is no longer free. The users need to pay a certain fee to the operator for processing their transactions. It is really hard to calculate the accurate fee in a permissionless way. Thus, the fee for a transaction is equal to `txBaseCost * gasPrice`. The `gasPrice` is the gas price of the users' transaction, while `txBaseCost` is the base cost for the transaction, which depends on its parameters (e.g. `ergs_limit` for `Execute` transaction).

Thirdly, the operator can not commit to processing each and every transaction within `X` days. Again, this is needed to prevent spam attacks on the priority queue. We changed this rule to the following one:

- The operator must do at least `X` amount of work (see below) for the priority queue or the priority queue should be empty.

In other words, we require the operator to do its best instead of requiring a strict deadline. The measure of "the work" is still to be developed. Most likely it will be the number of `ergs` the priority operations used.

Fourthly, there needs to be a way to bypass spam attacks for important transactions. From the points above we already know that there is no strict deadline for processing the transactions. If the deque with priority gets filled with a lot of heavy transactions, the next transactions will need to wait until all these are processed. If you need to pass your transaction urgently, you can submit your transaction to a separate priority heap, where the transactions will be processed based on the layer 2 tip (`tx.value - txBaseCost * gasPrice`) provided by the operator. The transactions in the heap get processed before transactions in the queue.

### Summary

For each transaction, besides supplying the transaction input data, the user also provides the following:

- The queue type to use. It is either a `Deque`, `HeapBuffer` or `Heap`. `Deque` is used for sequential processing of the transactions, while `HeapBuffer` and `Heap` are used for fee-prioritized processing of transactions. For the testnet, only `Deque` is available. The details on using `HeapBuffer` and `Heap` will be available later with their release.
- The operator fee for the transaction as part of the transaction `value` (the amount of ETH passed with the L1 transaction).

## Priority mode

If the operator fails to process the needed L1 transactions, the system enters the Priority mode. In this mode, everyone can become an operator by staking tokens. The exact details of the priority mode are still under development and will be described in more detail closer to the mainnet launch.

## L2 -> L1 communication

L2 -> L1 communication, in contrast to L1 -> L2 communication, is based only on transferring of the information, and not on the transaction execution on L1. It is a built-in feature, which is made up of two parts: sending a message from L2 and reading it on L1. The first is implemented as a call to an L2 system smart contract. And the second is implemented on the zkSync L1 smart contract as a getter function.

### Sending messages

Each message sent from L2 to L1 contains the sender's address and the message itself. The length of the message can be arbitrarily large, but the longer the message, the more expensive it is to send it. The operator must include all messages for the corresponding merkle root (see next paragraph). Hence, all of the messages are publicly available, and one does not have to rely on the operator to reveal them.

### Reading messages

Every sent message can be read on-chain. Moreover, it is possible to prove that message has been sent in a specific L2 block. To make such proof as cheap as possible for both the user and the validator, we store all messages for each L2 block in the Merkle Tree. Accordingly, any L1 smart contract can consume the sent message by providing proof of inclusion to some of the L2 block. A proof can be generated based only on the data that the operator sent to the `zkSync` L1 smart contract. The proof can also be obtained via [the API](../../api/api.md#zksgetl2tol1msgproof).

#### Summary

- L2 -> L1 communication requires one transaction on L2 and one on L1.
- Messages can be of arbitrary length.
- All the data needed for proving message inclusion in an L2 block can always be restored from Ethereum. However, the easiest way is to request the proof from the operator via API.
