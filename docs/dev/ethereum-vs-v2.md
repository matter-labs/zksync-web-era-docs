# Comparison to Ethereum

zkSync 2.0 is made to look and feel like Ethereum, but with lower fees. However, since it is optimized for zero-knowledge proofs some differences are inevitable.

## Web3 API

zkSync fully supports the standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API), but it also has some additional L2-specific functionality.

As long as your code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes for the codebase needed!_

You may continue using the SDKs that you use now. Users will continue paying fees in ETH and the UX will be identical to the one on Ethereum.

If you want to deploy smart contracts or enable the unique zkSync features to your users (e.g. paying fees in the same token which is being swapped), you will need to use the EIP712 transaction type.

A more detailed description of the zkSync JSON-RPC API can be found [here](../api/api.md).

## Native currency

zkSync 2.0 has no "native" token as the fees can be paid in ERC20s. `ETH` is an ERC20 token with address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`.

**Please note**, that support for native ETH transfers (by passing `value` to the transaction) does not work yet. As a consequewnce, `msg.value` is always equal to `0`. Dealing with native ETH is an important part of some protocols and it will be implemented in the future for backward-compatibility.

## Solidity support

For the alpha preview, only Solidity version `0.8.x` is supported. Also, compiling Solidity to zkEVM bytecode requires a special compiler.

## EIP712

Besides supporting native ETH transactions, zkSync supports the EIP712 transaction type. You can use transactions of this type to pay fees in ERC20 tokens. Also, it is only possible to deploy smart contracts with this type of transaction.

You don't need to know the details about the transaction format to use our SDK, but if you are curious, you can read more about it [here](../api/api.md#eip712).

## Fee model

Unlike Ethereum, there is no native token and zkSync supports paying fees in any ERC20 tokens.

Our version of `gas` is called `ergs` and represents not only the costs of computations, but also the cost of publishing data onchain and affecting storage. Similar to `gas`, `ergs` is an absolute unit. VM operations (`add`, `mul`, etc) will also have their costs measured in `ergs`, and they may not be equal to each other. The actual table of operation costs in `ergs` is yet to be defined.

Since the costs for publishing the calldata on L1 are very volatile, the number of `ergs` needed for changing a storage slot is not constant. For each block, the operator defines the following dynamic parameters:

- `ergs_price` table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token.
- `ergs_per_storage` — price in `ergs` for changing 1 storage value.
- `ergs_per_pubdata` — price in `ergs` for adding 1 byte of pubdata.

Please note, that the public data is published only for state diffs. That means, that if you update the same storage slot 10 times, only one update will be published on Ethereum and so you will charged for public data only once.

### Why do we need different fee model?

- **Why `ergs` and not gas?**

We wanted to show the clear distiction of our fee model from the Ethereum ones. Also, unlike Ethereum, where most of the opcodes have very distinct gas prices, basic zkEVM opcodes will likely have similar `ergs` price. Generally, the execution itself (arithmetic operations, which do not involve storage updates) are very cheap. As in Ethereum, most of the cost will be incurred for updating the storage.

- **Why can't we have constant price for storage value?**

zkRollup security model means that we periodically publish state diffs on Ethereum. The price of that is defined by Ethereum gas price and, as already said, it is very volatile. That's why the operator can definte the new price in `ergs` for publishing pubdata for each block. Users can provide a cap on the `ergs_per_pubdata` in the [EIP712](../api/api.md#eip712) transactions.

- **Why do we need a seperate `ergs_per_storage` then?**

This parameter will be most useful for zkPorter transactions. Generally, it is created to prevent state bloat and to be able to pay for publishing state diffs to the guardians. We will show more materials on that in the future with zkPorter release.

### What does this mean to me?

Despite the differences, the fee model is actually quite similar to one of Ethereum. The same as for Ethereum, the most costly will always be the storage changes. One of the advantages of ZK rollups over optimistic rollups is that instead of publishing the transaction data, ZK rollups publish only state diffs.

That means, that if you update the same storage slot 10 times, only one update will be published on Ethereum and so you will charged for public data only once. But it goes beyond simple storage slots. Let's say that you have a DEX and a `PairFactory` factory for different `Pair` pools. The contract bytecode of `Pair` needs to be published only when the first instance is deployed. After the code of the `Pair` was published once, the subsequent deployments will only involve changing one storage slot -- to set the contract code hash on the newly deployed `Pair`'s address.

So the tips to make the most out of zkSync fee system are the following:

- **Update storage slots as little as possible.** Cost for execution are a lot less than cost of storage updates.
- **Reuse as much storage slots as possible.** Only the state diff is published to Ethereum.
- **Users should share as much storage slots as possible.** If 100 users update a storage slot of your contract in a single block, the diff will be published only once. In the future, we will introduce reimbursement for the users, so that the costs for updating shared storage slots is split between the users.
- **Reuse contract code if possible.** On Ethereum, avoiding constructor parameters and putting them into constants allows for some gas cost reduction upon deployment. On zkSync the opposite is true: deploying the same bytecode for contracts, while changing only constructor parameters can lead to substantial fee savings.

## Contract deployment

To maintain the same security as L1, the zkSync operator must publish the contract code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it needs to be published onchain only once.

This means that while deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: _The operator should know the code of the contract before it is deployed_. That means that deploying contracts is only possible by the means of `EIP712` transactions with the `factory_deps` field containing the supplied bytecode. More on EIP712 transactions [here](../api/api.md#eip712).

Summary:

- **How contract deployment works on Ethereum.**
  To deploy a contract, a user sends transaction to zero address (`0x000...000`) with the `data` field of transaction equal to the contract bytecode concatenated with the constructor parameters.

- **How contract deployment works on zkSync.**
  To deploy a contract, a user sends transaction to zero address (`0x000...000`) with the `data` field for transaction equal to the contract bytecode hash concatenated with the constructor parameters. The contract bytecode itself is supplied in the `factory_deps` field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.

All of the deployment process is handled inside our [hardhat](../api/hardhat) plugin.

## Transaction types

There are three types of L2 transactions on zkSync: `Withdraw`, `Execute`, `Deploy`.

- `Withdraw` is used to withdraw native ERC20 tokens to L1. _Please note, that this type most likely will be removed after the testnet._
- `Execute` is used to call smart contract functions.
- `Deploy` is used to deploy smart contracts on zkSync.

There are also two types of transactions, related to bridging native tokens to zkSync:

- `Deposit` is used to move funds from an L1 account to an L2 account.
- `AddToken` is used to add a native ERC20 token to zkSync.
