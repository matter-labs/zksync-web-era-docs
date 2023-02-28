# Fee mechanism

::: warning


This section of the documentation is under review to reflect the changes made to the system contracts ([see changelog](../../troubleshooting/changelog.md)). A revised version will be available shortly.

:::

At zkSync, we aim to be compatible with Ethereum, meaning we aim to share similarities while minimizing huge differences, one such similarity is the gas fee model of zkSync.

zkSync's version of `gas` is called `gas` just like Ethereum and represents not only the costs of computations but also the cost of publishing data on-chain and affecting storage.

Since the costs for publishing the calldata on L1 are very volatile, the number of `gas` needed for changing a storage slot is not constant. For each block, the operator defines the following dynamic parameters:

- `gas_price` — the table for the current base price in each token. The value of this parameter is used to determine the costs of VM execution in each token.
- `gas_per_pubdata` — the price in `gas` for publishing one byte of data to Ethereum.

**Please note that the public data is published only for state diffs.** If the same storage slot is updated 10 times in the same rollup block, only the final update will be published on Ethereum, thus only charging for public data once.

## Fee model: zkSync vs Ethereum

We want to show the clear distinction between our fee model and the Ethereum one.
Also, unlike Ethereum, where most of the opcodes have very distinct gas prices, in zkSync the cost of the opcodes is different, hence zkEVM opcodes will likely have similar `gas` prices.
Generally, the execution itself (arithmetic operations, which do not involve storage updates) is very cheap. As in Ethereum, most of the cost is incurred for storage updates.

## What does this mean to me?

Despite the differences, the fee model is quite similar to the one of Ethereum; the most costly operation is the storage change. One of the advantages of zk rollups over-optimistic rollups is that, instead of publishing all the transaction data, zk rollups can publish only state diffs, thus making fewer storage changes.

As already stated, if the same storage slot is updated several times in a single block, only the last update will be published on Ethereum, and the cost of storage change will only be charged once; but it goes beyond simple storage slots. For example, a DEX and a `PairFactory` factory for different `Pair` pools. The contract bytecode of `Pair` needs to be published only when the first instance is deployed. After the code of the `Pair` was published once, the subsequent deployments will only involve changing one storage slot -- to set the contract code hash on the newly deployed `Pair`'s address.

So the tips to make the most out of the zkSync fee system are the following:

- **Update storage slots as little as possible.** The cost for execution is a lot smaller than the cost of storage updates.
- **Reuse as many storage slots as possible.** Only the state diff is published on Ethereum.
- **Users should share as many storage slots as possible.** If 100 users update a storage slot of your contract in a single block, the diff will be published only once. In the future, we will introduce reimbursement for the users, so that the costs for updating shared storage slots are split between the users.
- **Reuse the contract code if possible.** On Ethereum, avoiding constructor parameters and putting them into constants reduces some of the gas costs upon contract deployment. On zkSync the opposite is true: deploying the same bytecode for contracts, while changing only constructor parameters can lead to substantial fee savings.


## Gas estimation during transaction: For custom and paymaster accounts

On Ethereum, there is a constant of 21000 gas that should cover all the intrinsic costs of processing a transaction: checking the signature and updating the nonce of the account. 

On zkSync Era, it's quite different, because we support custom accounts that may take a slightly different (typically a bit higher) number of gas than EOAs. 
We provide a good, robust way for anyone to estimate the cost of a transaction regardless of the type of account. 
### Changes in the `validateTransaction`

Right now, the `validateTransaction` fails if the signature is not correct and returns `success=true` otherwise, while the `returndata` is discarded completely. We will migrate to a different approach, where the `validateTransaction` method to be considered successful must return some magic string. Any other `returndata` will be considered invalid and will be rejected by the system.  

Now, `validateTransaction` method of the AA (or the paymaster `validateAndPayForPaymasterTransaction` method), should always try to do the same amount of computation (and especially storage accesses) as it would have done if the transaction was indeed validated correctly. By default, the operator will provide a transaction structure that contains as much information as is available to the operator at the time of the fee estimation. As a substitute for the signature, an invalid 65-byte ECDSA signature will be used. The `DefaultAccount` (the one that is used by EOAs) will do as many operations as possible (including signature verification) and only return `bytes4(0)` instead of magic. If, for instance, the wallet is a custom account, with multiple signers, then it may want to simulate the validation of the signatures of all the provided signers.

So roughly the code of the validation step of each account will look the following way:

```solidity
 function validateTransaction(
        bytes32, // _txHash
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable override ignoreNonBootloader returns (bytes4 magic) {
        // ...
        // normal validation logic
        // ...
         
        // The execution before the following `if` statement should look as close as to the execution under incorrect 
        // signature as possible
        if(!validSignature) {
           // Setting magic to 0 to make sure that the transaction will not be accepted on mainnet
           magic = bytes4(0);  
        } else {
           magic = // setting to actual magic value which should be returned by the correct signature validation
        }
    }
```

### Notes on the transaction’s length

zkSync Era sends state diffs onchain, and the cost for the transaction will still mildly depend on its length (because long transactions need to be stored in memory of the operator), also long transactions incur additional costs during interactions with an account. However, the signature (as well as its length) is not available at the time of fee estimation and so there is no correct way to precisely estimate the cost of the transaction. For now, we will compensate for it by multiplying the recommended cost of the transaction by **5%**. In the future, we will introduce the following:

- Each account will be able to implement a method called `fillPartialTransaction` that will fill the signature with the substituted value which will be used for fee estimation.

### Changes for `eth_estimateGas`

Since the entire flow for tx validation + execution will be executed to get the transaction’s fee, the operator will manually put the necessary balance (if needed) for the account before the emulation is run to conduct the default account’s `payForTransaction` method.

Note, that the operator will NOT do the same with the paymaster (i.e. if a transaction has a paymaster, the paymaster MUST have the proper balance beforehand). 

The `eth_estimateGas` method itself will use binary search to find the smallest gas value under which the transaction *succeeds*.

### Difference from geth

Just like geth, we will use binary search. However, there will be some notable differences in gas estimation from the behavior of geth:

- Unlike geth, it is impossible to track out of gas errors on zkSync Era. The main reason is that the “actual” execution will happen inside the DefaultAccount system contract and due to the 63/64 rule when a high number of gas is provided, the call to the `execute` method of the DefaultAccount will NOT fail even though the subcall to the `transaction.to` contract did fail with an out of gas error.

That means that while geth can distinguish between “empty error” and “out of gas”, we can’t. If during gas estimation we fail to find the necessary `gasLimit`, will return the following error _“can not estimate gas: the transaction either fails or requires more gas than allowed”_.

- During simulation, geth uses `tx.gasprice = 0` to make sure that the user can pay the fee even though the `tx.origin` in the simulation may not have any balance at all - This means that when `estimateGas` from an empty account is called, no `value` can be provided to such call as this account has zero balance to cover this value. 

We could do that, but that would mean that the `payForTransaction` of the Account Abstraction protocol would do nothing and thus be much cheaper than it will be during the actual transaction validation. Instead, the operator will increase the balance of the user’s account by `tx.maxFeePerErg * tx.ergsLimit`.

For DefaultAccount it will behave the same way as on geth (since the user will get rid of the new funds in the `payForTransaction` method), but for custom accounts, they may unexpectedly contain more balance than they will have onchain, which may affect their behavior.