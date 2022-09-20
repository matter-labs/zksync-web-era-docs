# Overview

In ethereum, transactions are referred to as cryptographically signed instructions by an externally-owned account(owned by users not code dependent) that is added to a block and recorded in the blockchain, when initiated by the same EOA, can be transmitted to the Ethereum network.

The the state of the Ethereum virtual machine (EVM) is changed when a transaction is initiated, the transaction can range from from sending ether to other accounts or calling functions of a smart contract.


## Prerequisite

To help you understand this page better, we recommend you first read [accounts](account.md).

## Structure of a transaction

In Ethereum, there are some specific data's that are formed when a transaction is initiated;

- Recipient:
  
The address of the account that will receive the transaction is called the recipient. The recipient can be an externally owned account or a contract account. Each transaction is directed towards a recipient.

- Nonce:

This field is the latest transaction, based on the account’s counter that keeps track of the number of transactions it executes. The transaction nonce is used by the network to ensure that transactions are executed in the proper order.

- Gas Price:
  
Any transaction requires some fee that is paid by the creator of the transaction. The fee is calculated per gas unit. The unit is Wei a smaller unit of ether.

- Gas Limit:

The creator of the transaction gives the number of gas units that can be used for the transaction. This is the maximum limit of gas that would be consumed.

- Value:
  
The value specifies the amount of Wei or Ether that the sender account wants to send to the recipient.

- Data:

If a transaction recipient is a smart contract then the data contains information for executing functions of the contract. This includes data of variable length.

- Signature:

A Signature is the identification of the sender. The signature is generated when an externally owned account confirms and signs the transaction via its private key.

### Types of transactions

On Ethereum there are a few different types of transactions:

- Simple or assets transfers: This refers to regular transfer of tokens in form ether to another account. Although this type of transaction has a value, it does not contain any data.
For example, if Bob sends assets(in form of ether) from his account to account Y, for purchasing an item, the gas price is set by the bob by default.

- Contract deployment transactions: This type of transaction is such that happens when a contract is deployed on the Ethereum network. Although this type of transaction has the bytecode of the smart contract as it's data, it does not have recipient(a "to" address).
- Function Execution transaction: This type of transaction calls the function of an account when a contract is deployed on Ethereum. Since the transaction is concerned with a contract account, the recipient("to" address) becomes a contract address. 
It contains the function name and arguments as data.

### When does a transaction become final?

In the context of blockchain network, **transaction finality** refers to the guarantee that transactions cannot be reverted, altered or mutated.

On Ethereum, as in Bitcoin, finality is probabilistic, i.e. the more blocks that passed since the transaction was processed, the lesser the chance that this transaction will be reverted.

In zk rollups, once a block has been filled and sealed, its state is committed to the main Ethereum chain. The proving step is then initiated, and a SNARK validity proof is generated for all the block transactions. Once completed, the SNARK is submitted for verification on the L1 smart contract, and after being verified, the transaction state becomes final.

Note that _finality_ from the zkSync perspective happens when the transaction (the SNARK verification) is processed by L1. At this stage, the guarantees are exactly like any other L1 transaction within the same L1 block; the more L1 blocks that generated after the initial block is processed, the lesser the chance that this transaction will be reverted.

At the moment, when a user sends a transaction, zkSync waits for the entire block to be filled, meaning finality time may take longer depending on the volume of transactions being submitted via zkSync. As throughput increases, the finality time will subsequently decrease.

# Transaction types

zkSync supports Ethereum's "legacy" (pre-EIP2718) transaction types, EIP1559 transaction type, and its custom EIP712 transactions. You can use transactions of this type to use zkSync-specific features like account abstraction. Additionally, it is only possible to deploy smart contracts with this type of transaction.

Knowing the details about the transaction format is not required to use zkSync's SDK, but if you are curious, you can read more about it [here](../../../api/api.md#eip712).

## What are operators?

**Operators** are the actors that perform basic ZK rollup functionalities. They are charged with creating blocks, bundling the transactions, performing the calculations and submitting the data to the main Ethereum chain for verification.