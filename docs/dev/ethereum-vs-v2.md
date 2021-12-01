# Comparison to Ethereum

zkSync 2.0 is made to look and feel like Ethereum, but with lower fees. However, since it is optimized for zero-knowledge proofs some differences are inevitable.

## Web3 API

zkSync fully supports the standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API), but it also has some additional L2-specific functionality, described [here](../api/api).

As long as your code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes for the codebase needed!_

You may continue using the SDKs that you use now. Users will continue paying fees in ETH and the UX will be identical to the one on Ethereum.

If you want to deploy smart contracts or enable the unique zkSync features to your users (e.g. paying fees in the same token which is being swapped), you will need to use the EIP712 transaction type.

A more detailed description of the zkSync JSON-RPC API can be found [here](../api/api.md).

## Solidity support

For the alpha preview, only Solidity version `0.8.x` is supported.

## EIP712

Besides supporting native ETH transactions, zkSync supports the EIP712 transaction type. You can use transactions of this type to pay fees in ERC20 tokens. Also, it is only possible to deploy smart contracts with this type of transaction.

You don't need to know the details about the transaction format to use our SDK, but if you are curious, you can read more about it [here](../api/api.md#eip712).

## Fee model

Unlike Ethereum, there is no native token and zkSync supports paying fees in any ERC-20 tokens.

Our version of `gas` is called `ergs` and represents not only the costs of computations, but also the cost of publishing data onchain and affecting storage. Similar to `gas`, `ergs` is an absolute unit. VM operations (`add`, `mul`, etc) will also have their costs measured in `ergs`, and they may not be equal to each other. The actual table of operation costs in `ergs` is yet to be defined.

Since the costs for publishing the calldata on L1 are very volatile, the number of `ergs` needed for changing a storage slot is not constant. For each block, the operator define the following dynamic parameters:

- `ergs_price` table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token.
- `ergs_per_storage` — multiplier for `ergs_price` to get the cost of changing 1 storage value. Note that this value is used for both zkRollup and zkPorter storage updates.
- `ergs_per_pubdata` — multiplier for `ergs_price` to get the cost of adding 1 byte of pubdata.

## Contract Deployment

To maintain the same security as L1, the zkSync operator must publish the contract code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it needs to be published onchain only once.

This means that while deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: _The operator should know the code of the contract before it is deployed_. That means that deploying contracts is only possible by the means of `EIP712` transactions with the `factory_deps` field containing the supplied bytecode. More on EIP712 transactions [here](../api/api.md#eip712).

## L2 transaction types

There are three types of L2 transactions on zkSync: `Withdraw`, `Execute`, `Deploy`.

- `Withdraw` is used to withdraw native ERC20 tokens to L1. _Please note, that this type most likely will be removed after the testnet._
- `Execute` is used to call smart contract functions.
- `Deploy` is used to deploy smart contracts on zkSync.
