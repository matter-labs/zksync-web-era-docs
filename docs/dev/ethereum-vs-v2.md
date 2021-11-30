# Comparison to Ethereum

zkSync 2.0 is made to look and feel the same way as Ethereum, buth with cheaper fees. However, since it is based on zkEVM some differences are inevitable.

Most of zkSync interface is completely compliant with the existing Ethereum Web3 API and supports most of the Solidity code.

## Web3 API

zkSync fully supports standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API), but also has some additional L2-specific functionality, described [here](../api).

As long as your code does not involve deploying new smart contracts (these have special format), *no changes for the codebase needed!* 

You can continue ussing the SDKs which you already use now. Users will continue paying fees in ETH and the UX will identical to the one on Ethereum. 

If you want to deploy smart contracts or enable unique zkSync features to your users (e.g. paying fees in the same token which is being swapped), you'll need to use eip712 transaction type.

## Solidity support

For the alpha preview only Solidity version `0.8.x` is supported. 

## EIP712

Besides supporting native ETH transactions, we support EIP712 transaction type. These transactions allow to pass the token to pay the fee with. EIP712 transactions have the same structure as standard Ethereum transactions, but with the following additional fields:

- `eip712_meta` of type `Eip712Meta`, which contains additional L2-specific fields (`fee_token`, etc).
- `transaction_type` should be equal to `712`.

`Eip712Meta` type has the following fields:

```json
{
    "fee": {
        "fee_token": "0x0000...0000",
        "ergs_per_storage_limit": 100000,
        "ergs_per_pubdata_limit": 1000
    },
    "time_range": {
        "from": 0,
        "until": 10101010
    },
    "withdraw_token": "0x00000...00000" ,
    "factory_deps": ["0x..."]
}
```

- `fee` is an object which describes the token in which the fee is to paid and also the limit on the numbre of 
- `time_range` is an object which denotes the timeframe within which the tx is valid. *Most likely will be removed after the testnet.*
- `withdraw_token` field should be only supplied for `Withdraw` operations. *Most likely will be removed after the testnet.*
- `factory_deps` an array which should only be supplied for `Deploy` transactions. It should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecode of the contracts which can be deployed by it.


## Fee model

Unlike Ethereum or other sidechains, there is no native token and zkSync supports paying fees in any ERC-20 tokens.

Since all the computation work is done off-chain, it is very cheap, while most of the costs for transaction execution accounts for storage updates, which are published onchain for zkRollup accounts and published to guardians for zkPorter. The price of publishing data on Ethereum is proportional to the Ethereum gas prices and so is very volatile. That's why unlike

Our version of `gas` is called `ergs` and represents not only costs of computations, but also the cost of publishing data onchain and affecting storage (via dynamic parameters described below). Same as `gas`, `ergs` is an absolute unit. VM operations (`add`, `mul`, etc) will also have their costs in `ergs`, and they may not be equal to each other. The actual table of operation costs in `ergs` is to be defined yet. 

Also, for each block, we define the following dynamic parameters:

- `ergs_per_storage` — multiplier for `ergs_price` to get the cost of changing 1 storage value. Note that this value is used for 
- `ergs_per_pubdata` — multiplier for `ergs_price` to get the cost of adding 1 byte of pubdata.

Additionally we calculate internally `ergs_price` table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token. 

## Contract Deployment

To maintain the same securiy as on L1, the zkSync operator must publish the contract code for each contract it deploys. However, if there is theку are multiple contracts deployed with the same code, it needs to be published onchain only once. 

This means that while deploying contracts for the first time may be relatively expensive, using factories, which deploy contracts with the same code multiple times can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply to the major rule: *The operator should know the code of the contract before it is deployed*. That means that deploying contracts is only possible by the means of `EIP712` transactions with `factory_deps` field set.

## L2 transaction types

There are three types of L2 transactions on zkSync: `Withdraw`, `Execute`, `Deploy`.

`Withdraw` is used to withdraw native erc20 tokens to L1.
`Execute` is used to call smart contract functions.
`Deploy` is used to deploy smart contracts on zkSync.
