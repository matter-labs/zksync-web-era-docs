# Transactions

From [Ethereum.org](https://ethereum.org/en/developers/docs/transactions/):

> Transactions are cryptographically signed instructions from accounts. An account will initiate a transaction to update the state of the Ethereum network. The simplest transaction is transferring ETH from one account to another. 

## Transaction data on Ethereum

From [Ethereum.org](https://ethereum.org/en/developers/docs/transactions/):

> A submitted transaction includes the following information:
>  - `from`: the address of the sender, that will be signing the transaction. This will be an externally-owned account as contract accounts cannot send transactions.
>  - `recipient`: the receiving address (if an externally-owned account, the transaction will transfer value. If a contract account, the transaction will execute the contract code).
>  - `signature`: the identifier of the sender. This is generated when the sender's private key signs the transaction and confirms the sender has authorized this transaction.
>  - `nonce`: a sequentially incrementing counter which indicates the transaction number from the account.
>  - `value`: amount of ETH to transfer from sender to recipient (denominated in WEI, where 1ETH equals 1e+18wei).
>  - `data`: optional field to include arbitrary data.
>  - `gasLimit`: the maximum amount of gas units that can be consumed by the transaction. The EVM specifies the units of gas required by each computational step.
>  - `maxPriorityFeePerGas`: the maximum price of the consumed gas to be included as a tip to the validator.
>  - `maxFeePerGas`: the maximum fee per unit of gas willing to be paid for the transaction (inclusive of baseFeePerGas and maxPriorityFeePerGas).

## Transaction data on zkSync Era

- `Transaction Hash`: Unique 66 character identifier generated when transaction submitted to L2.  
- `Commit Tx hash`: Unique 66 character identifier generated when transaction committed to L1.  
- `Prove Tx hash`: Unique 66 character identifier generated when transaction proven on L1. 
- `Execute Tx hash`: Unique 66 character identifier generated when transaction executed on L1. 
- `Status`: One of `Pending`, `Included`, `Verified`, or `Failed`. See [Transaction statuses section](#transaction-statuses) below.
- `Block`: Block number containing the transaction.  
- `Batch`: Batch number containing the transaction. 
- `From`: The account or smart contract address sending the transaction. 
- `Tokens Transferred`: Details on all tokens transferred by the transaction. 
- `Contract address`:  The transaction recipient. 
- `Input data`: Any additional data used by the transaction for verified contracts.
- `Fee`: Fee for the tx in ETH and USD value. Click **More Details** to see info on refunds.
- `Nonce`: Sender nonce.                         
- `Created`: Timestamp of when the transaction was added to the block.   

## Nature of transactions

There are various different ways of transacting on the Ethereum blockchain:

- Common transactions: A simple transaction from one account to another such as transferring a token.
- Contract deployment transactions: A transaction with no `to` address and the `data` field contains the contract code.  
- Contract execution: A transaction that interacts with an already deployed smart contract where the `to` address is the smart contract's address.

### Contract deployment differences between zkSync Era and Ethereum

- Ethereum: Contract deployment occurs when a user sends a transaction to the zero address `(0x000...000)` where the `data` field contains the contract bytecode concatenated with constructor parameters.
- zkSync Era: To deploy a contract on zkSync, a user calls the `create` function of the [ContractDeployer](../system-contracts.md#contractdeployer) and provides the hash of the contract to be published, as well as the constructor arguments. The contract bytecode is added to the `factory_deps` field of [EIP-712 transaction types](#eip-712-0x71). If the contract is a factory (i.e. it can deploy other contracts), the bytecode of all child contracts should be included in `factory_deps`.
- Find out more about [contract deployment](../../building-on-zksync/contracts/contract-development.md) on zkSync Era.

## Transaction types

For compatibility, the majority of zkSync Era transactions types are similar to those on Ethereum.

:::tip
The transaction type hex value is output by any RPC method call which returns a transaction type, such as [`eth_getTransactionByHash`](https://ethereum.github.io/execution-apis/api-documentation/) for example.
:::

### Legacy: `0x0`

The Ethereum transaction format used before the introduction of typed-transactions.

### EIP-2930: `0x1`

The Ethereum Improvement Proposal [EIP-2930: Optional access lists](https://eips.ethereum.org/EIPS/eip-2930) addressed contract breakage risks introduced by EIP-2929. 

EIP-2930 transaction types contain everything from legacy transactions plus an `accessList` parameter containing an array of addresses and storage keys.

### EIP-1559: `0x2`

The Ethereum Improvement Proposal [EIP-1559: Fee market change for ETH 1.0 chain](https://eips.ethereum.org/EIPS/eip-1559) is an updated transaction type introduced in Ethereum's London fork. It addressed network congestion and excessive fees coming from bids. EIP-1559 transactions don't specify `gasPrice` and instead use a base fee which is adjusted by each block.

EIP-1559 transaction types contain everything from EIP-2930 and legacy transactions (apart from removing the `gasPrice`). 

Additional parameters added are the `maxPriorityFeePerGas` and `maxFeePerGas` where users can specify maximum fees they're willing to pay to prioritize their transactions.

- `maxPriorityFeePerGas`: Is the maximum fee users are willing to give to miners as an incentive.
- `maxFeePerGas`: Is the maximum fee users are willing to pay in total. This includes the `maxPriorityFeePerGas` and network-determined base fee per gas.

:::warning Important
zkSync Era supports the EIP-1559 transaction-type format but does nothing with the max fee parameters.
:::

### EIP-712: `0x71`

The Ethereum Improvement Proposal [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712) introduced hashing and signing of typed-structured data as well as bytestrings. 

Smart contracts must use this transaction type.

EIP-712 transactions access zkSync-specific features such as [account abstraction](../aa.md) and [paymasters](../../tutorials/custom-paymaster-tutorial.md). Furthermore, smart contracts must be deployed with the EIP-712 transaction type.

You can specify the additional fields, such as the custom signature for custom accounts or to choose the paymaster with EIP-712 transactions. These transactions have the same fields as standard Ethereum transactions, plus fields containing additional L2-specific data (`paymaster`, etc).

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

### Priority: `0xff`

This is a zkSync Era specific transaction type related to a [L1 -> L2 transaction](../../how-to/send-transaction-l1-l2.md).

## Transaction statuses

Transaction are always in one of the following [statuses](https://github.com/matter-labs/zksync-era/blob/6167974ec0dfe4a7c72356ebb4580a65b8966dd3/core/lib/types/src/explorer_api.rs#L119):

- `Pending`: In the mempool but not yet included in a block. 
- `Included`: Included in a block but the batch containing the block has not yet been committed.
- `Verified`: Included in a block and verified. Verified means the transaction has been committed, proven, and executed on the Ethereum L1 network.
- `Failed`: Unverified/failed transaction.

:::info
For more information on when a transaction is considered complete and unalterable, read the documentation on [finality](../finality.md).
:::