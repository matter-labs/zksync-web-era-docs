# Transactions

Transactions in Ethereum are cryptographically signed instructions by an externally owned account (an account owned by a user and not by code). These instructions are stored in the blockchain and added to a block.
The state of the Ethereum virtual machine (EVM) changes when a transaction is initiated. A transaction can be anything from sending ether to another account to invoking the functions of a smart contract.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Prerequisite

We recommend you first read [accounts](https://ethereum.org/en/developers/docs/accounts/) to understand this page.

## How transactions work

When a user initiates a transaction on Ethereum, some specific data is created:
- Receiver: The recipient is the account's address to receive the transaction. The receiver can be a contract account or an externally owned account. Each transaction is aimed toward a specific recipient.
- Nonce: This field displays the most recent transaction based on the account's counter, which maintains track of how many transactions it does. The network uses the transaction nonce to ensure that transactions are completed in the correct sequence.
- Gas Price: Most transactions necessitate the payment of a fee to the transaction's author. This cost is computed per unit of gas. The unit is Wei, a smaller ether unit.
- Gas Limit: The transaction author specifies the number of gas units used for the transaction. This is the total amount of gas that could be consumed.
- Value: The quantity of Wei or Ether that the sender account wishes to transmit to the recipient is represented by the value.
- Data: If the transaction receiver is a smart contract, the data contains information for the contract's functions to be executed. This comprises data with varying lengths.
- Signature: A signature indicates who sent the communication. The signature is created when an externally owned account confirms and signs the transaction with its private key.

### Transaction Types

- Simple or asset transfers: This refers to the regular tokens transfer in the form of ether from one account to another.

To deploy a contract, a user calls the `create` function of the ContractDeployer and provides the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the factory_deps field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the factory_deps as well.

- Contract deployment transactions: Contract deployment on zkSync is quite different from Ethereum.
  - Ethereum: Contract deployment occurs when a user sends a transaction to the zero address `(0x000...000)` with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.
  - zkSync: To deploy a contract on zkSync, a user calls the `create` function of the [ContractDeployer](../contracts/system-contracts.md#contractdeployer) and provides the hash of the contract to be published, as well as the constructor arguments. 
  The contract bytecode itself is supplied in the `factory_deps` field of the EIP712 transactions. 
  If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.
  Read more on [contract deployment](../contracts/contracts.md).

::: tip
zkSync supports Ethereum's "old" (pre-EIP2718) transaction types, the EIP1559 transaction type, and its EIP712 transactions. Transactions of this type can be used to access zkSync-specific features such as account abstraction. Furthermore, smart contracts can only be deployed with this sort of transaction.

It is not necessary to understand the transaction format to utilize zkSync's SDK, but if you are interested, you can learn more about it [here](../../../api/api.md#eip712).

:::

### When is a transaction considered final?

**Transaction finality** refers to the promise that transactions cannot be reversed, altered, or mutated in the context of a blockchain network.

Finality on Ethereum, like in Bitcoin, is probabilistic, which means that the more blocks passed after the transaction was executed, the less likely it is that this transaction will be overturned.

Once a block has been filled and sealed in zk rollups, its state is committed to the main Ethereum chain. The proving stage is then started, and a SNARK validity proof is constructed for each block transaction. Once completed, the SNARK is sent for verification on the L1 smart contract, and the transaction state becomes final following verification.

From the standpoint of zkSync, _finality_ occurs when the transaction (the SNARK verification) is executed by L1. At this point, the guarantees are the same as any other L1 transaction within the same L1 block; the more L1 blocks issued after the initial block is processed, the less likely this transaction will be overturned.

When a user transmits a transaction, zkSync currently waits for the entire block to be filled, which means the finality time may be longer depending on the volume of transactions sent via zkSync. The finality time will reduce as the throughput increases.

### What exactly are operators?

**Operators** are the actors who carry out essential ZK rollup functions. They are responsible for producing blocks, packaging transactions, conducting calculations, and submitting data to the main Ethereum chain for verification.
