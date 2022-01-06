# L1 / L2 Interoperability

While most of the execution will happen on L2, some use-cases require interoperability with the L1 chain. The most obvious example is to maintain a single L1 governance contract between both zkSync and Ethereum. As layer 2 ecosystem becomes more and more battle-tested, the projects may want to move their governance to zkSync to make the voting more inclusive. This way, there needs to be some way to pass the messages from L2 to L1. Also, the L2<->L1 communication allows to create ultrasecure asset brdiges. 

Also, the L2 cencorship resistance derives from the underlying chain, so the ability to send messages from Ethereum to zkSync are an important part of the cencorship-resistant mechanism called [priority queue](#priority-mode).

## L1 -> L2 communication

Sending transactions from Ethereum to zkSync is done via the `zkSync` smart contract. It allows to request any type of zkSync transactions:

- `DeployContract`
- `Execute`
- `Withdraw`

Besides these, it also allows some types of transactions specific for these bridge.

- `AddToken` to add a native token to zkSync.
- `Deposit` to deposit some amount of the native token to the L2. 


## Priority queue

### How it worked in zkSync 1.x

The way priority queue works in zkSync 2.0 is very close to how it worked in the previous version of zkSync. Looking at the example of how it worked before gives the rationale for the new design of the priority queue for zkSync 2.0.

The goal was the same: provide a cencorship-resistant way to interact with zkSync in case the operator becomes malicious or unavailable. Back then, we only had two operations which could be sent to zkSync from L1:

- `Deposit` to bridge funds from Ethereum to zkSync.
- `FullExit` (the same as `Withdraw`, to bridge the funds back from Ethereum).

If a user wants to deposit or withdraw funds from zkSync, they would send a transaction request to the smart contract and it was appended to the deque of priority transactions. The deck had the following rules:

- All transactions are processed sequentially.
- Each priority operation must be processed by the operator within `X` days since it was submitted to the contract.

The first rule is strictly enforced by the smart contract. The second rule may be violated if the operator becomes malicious or unavailable. In case that happens, the system entered exodus mode, where no new blocks can be processed and the users can withdraw their funds without cooperation from the operator.

### What changes are needed?

The process described above works well for a system with a small set of relatively light operations supported. zkSync 2.0 supports general smart contract computation and thus, some of the principles had to be changed in order to preserve stability of the network.

Firstly, all the transactions need to be supported by the priority queue. The users may have their funds stored on an L2 smart contract. So before withdrawing their funds to L1, they need to send an `Execute` transaction to zkSync to wtthdraw the funds from that smart contract first. 

Secondly, priority queue needs to stay cencorship-resistant. But imagine what will happen if users start sending a lot of transactions that take the entirety of the block ergs limit? There needs to be a way to prevent spam attacks on the system. That's why submitting the transactions to the priority queue is no longer free. The users need to pay a certain fee to the operator for processing their transactions. It is really hard to calculate the accurate fee in a permissionless. Thus, the fee for a transaction is equal to `txBaseCost * gasPrice`. The `gasPrice` is the gas price of the users' transaction, while `txBaseCost` is the base cost for transaction, which depends on its parameters (e.g. `ergs_limit` for `Execute` transaction).

Thirdly, the operator can not commit to process each and every transaction within `X` days. Again, this is needed to prevent spam attacks on the priority queue. We changed this rule to the following one:

- The operator must do at least a _X_ amount of work for the priority queue or the priority queue should be empty.

In other words, we require the operator that he does best he can do instead of requiring a strict deadline. The measure of "exact amount of work" is still to be developed. Most likely it will be the number of `ergs` the priority operations used.

Fourthly, there needs to a way to bypass spam attacks for important transactions. From the points above we already know that there is no strict deadline for processing the transactions. If the deque with priority gets filled with a lot of heavy transactions, the next transactions will need to wait until all these are processed before being processed. If you need to pass your transaction urgently, you can submit your transaction to a separate priority heap, where the transactions will be processed based on the fee provided by the operator. The transactions in heap get processed before transactions in the queue.

### Summary

For each transaction, besides supplying the transaction input data, the user also provides the following:

- The queue type to use. It is either a `Deque`, `HeapBuffer` or `Heap`. `Deque` is used for sequential processing of the transactions, while `HeapBuffer` and `Heap` are used for fee-prioritized processing of transactions. For the testnet, only `Deque` is available. The details on using `HeapBuffer` and `Heap` will be available later with their release.
- The operation tree to use. It is either `Full` or `Rollup`. The details about the operation trees will be available once the zkPorter is out. For now, only `Full` option can be used.
- The operator fee for the transaction as part of the transaction `value` (the amount of ETH passed with the L1 transaction).

## Priority mode

If the operator fails to process the needed L1 transactions, the system enters the Priority mode. In this mode everyone can become an operator by staking tokens. The exact details of the priority mode are still under development and will be described in more detail closer to the mainnet launch.

## L2->L1 communication

Sending messages from zkSync to Ethereum is not yet available, but it will be implemented later.
