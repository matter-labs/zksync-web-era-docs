# Transactions

Transactions in Ethereum are cryptographically signed instructions by an externally owned account (an account owned by a user and not by code). These instructions are stored in the blockchain and added to a block.
The state of the Ethereum virtual machine (EVM) changes when a transaction is initiated. A transaction can be anything from sending ether to another account to invoking the functions of a smart contract.

## Prerequisites

We recommend reading the [accounts documentation](https://ethereum.org/en/developers/docs/accounts/) as preliminary material towards understanding the content on this page.

## How transactions work

When a user initiates a transaction on Ethereum, some specific data is created:

- **Receiver**: The recipient is the account's address to receive the transaction. The receiver can be a contract account or an externally owned account. Each transaction is aimed toward a specific recipient.
- **Nonce**: This field displays the most recent transaction based on the account's counter, which maintains track of how many transactions it does. The network uses the transaction nonce to ensure that transactions are completed in the correct sequence.
- **Gas price**: Most transactions necessitate the payment of a fee from the transaction's author. This cost is computed per unit of gas. The unit is Wei, a smaller ether unit.
- **Gas limit**: The transaction author specifies the number of gas units used for the transaction. This is the total amount of gas that could be consumed.
- **Value**: The quantity of Wei or Ether that the sender account wishes to transmit to the recipient is represented by the value.
- **Data**: If the transaction receiver is a smart contract, the data contains information for the contract's functions to be executed. This comprises data with varying lengths.
- **Signature**: A signature indicates who sent the communication. The signature is created when an externally owned account confirms and signs the transaction with its private key.

### Transaction Types

- Simple or asset transfers: This refers to the regular tokens transfer in the form of ether from one account to another.

- Contract deployment transactions: Contract deployment on zkSync is quite different from Ethereum.
  - Ethereum: Contract deployment occurs when a user sends a transaction to the zero address `(0x000...000)` with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.
  - zkSync Era: To deploy a contract on zkSync, a user calls the `create` function of the [ContractDeployer](../../architecture/contracts/system-contracts.md#contractdeployer) and provides the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the `factory_deps` field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), the contracts bytecodes should be included in the `factory_deps`.
  Read more on [contract deployment](../../architecture/contracts/contract-development.md).

::: tip
zkSync Era supports Ethereum's "old" (pre-EIP-2718) transaction types, the EIP-1559 transaction type, and the EIP-712 transactions; which can be used to access zkSync-specific features such as account abstraction. Furthermore, smart contracts can only be deployed with the EIP-712 transaction type.

See the [EIP-712 transaction section below](#eip-712-transactions) for more information.

:::

### When is a transaction considered final?

**Transaction finality** refers to the promise that transactions cannot be reversed, altered, or mutated in the context of a blockchain network.

Under proof of stake, Ethereum transactions finalize in 2.5 epochs (16 minutes) on average under normal conditions: reverting that transaction would cost 1/3 of the total staked Ethereum.

Once a block has been filled and sealed in zk rollups, its state is committed to the main Ethereum chain. The proving stage is then started, and a SNARK validity proof is constructed for each block transaction. Once completed, the SNARK is sent for verification on the L1 smart contract, and the transaction state becomes final following verification.

From the standpoint of zkSync, _finality_ occurs when the transaction (the SNARK verification) is executed by L1. At this point, the guarantees are the same as any other L1 transaction within the same L1 block; the more L1 blocks issued after the initial block is processed, the less likely this transaction will be overturned.

When a user transmits a transaction, zkSync currently waits for the entire block to be filled, which means the finality time may be longer depending on the volume of transactions sent via zkSync. The finality time will reduce as the throughput increases.

### What exactly are operators?

**Operators** are the actors who carry out essential ZK rollup functions. They are responsible for producing blocks, packaging transactions, conducting calculations, and submitting data to the main Ethereum chain for verification.

## EIP-712 transactions

The Ethereum Improvement Proposal [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712) introduces hashing and signing of typed-structured data as well as bytestrings. 

To specify additional fields, such as the custom signature for custom accounts or to choose the paymaster, EIP-712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but they also have fields that contain additional L2-specific data (`paymaster`, etc).

```json
"gasPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factoryDeps": ["0x..."]
```

- `gasPerPubdata`: A field denoting the maximum amount of gas the user is willing to pay for a single byte of pubdata.
- `customSignature`: A field with a custom signature for the cases in which the signer's account is not an EOA.
- `paymasterParams`: A field with parameters for configuring the custom paymaster for the transaction. Parameters include the address of the paymaster and the encoded input.
- `factory_deps`: A non-empty array of `bytes`. For deployment transactions, it should contain the bytecode of the contract being deployed. If the contract is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which it can deploy.

To ensure the server recognizes EIP-712 transactions, the `transaction_type` field is equal to `113`. The number `712` cannot be used as it has to be one byte long.

Instead of signing the RLP-encoded transaction, the user signs the following typed EIP-712 structure:

| Field name             | Type        |
| ---------------------- | ----------- |
| txType                 | `uint256`   |
| from                   | `uint256`   |
| to                     | `uint256`   |
| gasLimit               | `uint256`   |
| gasPerPubdataByteLimit | `uint256`   |
| maxFeePerGas           | `uint256 `  |
| maxPriorityFeePerGas   | `uint256`   |
| paymaster              | `uint256`   |
| nonce                  | `uint256`   |
| value                  | `uint256`   |
| data                   | `bytes`     |
| factoryDeps            | `bytes32[]` |
| paymasterInput         | `bytes`     |

These fields are handled by our [SDK](../../../api/js/features.md).