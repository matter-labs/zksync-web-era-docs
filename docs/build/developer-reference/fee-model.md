---
head:
  - - meta
    - name: "twitter:title"
      content: Fee Model | zkSync Docs
---

# Fee Model

zkSync Era's fee model is similar to Ethereum’s where `gas` is charged for computational cost, cost of publishing data on-chain and storage effects. However, zkSync Era includes additional costs for publishing to L1 and for proof generation.

::: info More in ZK Stack docs

You can find more details about the Fee model Contracts [the concepts section of the ZK Stack documentation](../../zk-stack/concepts/fee-mechanism.md).

:::

Because the L1 gas price for publishing data (on L1) is so volatile, the amount of required L2 `gas` is variable.
Therefore, for each block, the zkSync Era sequencer defines the following dynamic parameters:

- `gasPrice`: the price, in gwei, of a unit of gas.
- `gasPerPubdata`: the amount of `gas` for publishing one byte of data on Ethereum.

In zkSync Era, unlike in Ethereum where each opcode has a fixed gas price, storage write charges remain dynamic due to the fluctuation of gas price on L1. Other opcode prices are constant, similar to Ethereum. See the [zkSync opcode documentation](https://github.com/matter-labs/era-zkevm_opcode_defs/blob/9307543b9ca51bd80d4f5c85d6eb80efd8b19bb2/src/lib.rs#L227) for an idea of how we calculate them.

Like Ethereum, the most costly operation is a storage update. Execution of arithmetic operations is relatively cheap, as it involves computation alone and no storage changes.

## State diffs vs transaction inputs

A considerable advantage we have over optimistic and most ZK rollups is that, instead of publishing all transaction data to L1, zkSync Era only publishes state diffs, thus publishing significantly less data to L1.

:::info State diff example

If an oracle updates a price in a contract using the same storage slot 10 times in the same rollup batch, only the final update is published on Ethereum and is therefore only charged once, making 9 of the 10 updates free.
:::

Another advantage is the cost-effective contract redeployment. An example is a DEX with a `PairFactory` contract for different `Pair` pools. The contract bytecode of `Pair` is only published when the first instance is deployed. After that, subsequent deployments only involve updating one storage slot which sets the contract code hash on the newly deployed `Pair` address.

## Design recommendations

- **Update storage slots as little as possible:** Check to see if your code can avoid unnecessary storage updates.
- **Reuse as many storage slots as possible:** Only the final state diff is published on Ethereum.
- **Reuse the contract code where possible:**
  - On Ethereum, avoiding constructor parameters and putting them into constants reduces some of the gas costs upon contract deployment.
  - On zkSync Era the opposite is true: as contract bytecode is only published once, updating the constructor parameters alone leads to substantial fee savings.

## Gas estimation for transactions

Ethereum has a constant of `21000` gas that covers the intrinsic costs of processing a transaction, i.e. checking the signature and updating the nonce for the account.

On zkSync Era this varies because we support custom and paymaster accounts. These accounts require a (usually) higher amount of gas than EOAs. zkSync Era provides functions for estimating the cost of a transaction regardless of the type of account.

The transaction fee estimate depends on the entire transaction flow, including validation and execution. The `eth_estimateGas` function uses binary search to find the smallest gas value under which the transaction succeeds.

For more information, find out [how to estimate gas for various transaction types](../tutorials/how-to/estimate-gas.md).

For any Rust developers interested in the zkSync Era implementation for gas estimation, see the [Rust code in our repo](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-rs/src/operations/execute_contract.rs#L129).

### Transaction length

zkSync Era publishes state diffs on-chain. The cost of the transaction, however, may still depend on transaction length because the sequencer stores long transactions in-memory.

Long transactions incur additional costs during interactions with an account. zkSync Era works with different types of accounts and, therefore, the protocol cannot make assumptions about signature length. Furthermore, given that a signature (and thus its length) is unavailable at the time of fee estimation, we cannot precisely estimate the cost of such a transaction. To mitigate this, we multiply the recommended cost of the transaction by a small percentage.

### `DefaultAccount`

By default, the zkSync Era sequencer provides a transaction structure with the available information during the fee estimation.

Because the signature is unavailable prior to the transaction taking place, an invalid 65-byte ECDSA signature is used instead. The `DefaultAccount` (used by EOAs), during gas fee estimation, executes many operations, including signature verification, and returns only `bytes4(0)` instead of [magic](../sdks/js/utils.md#magic-value).

In the case of a custom account with multiple signers, the account may wish to simulate signature validation for all the provided signers.

See the [DefaultAccount code](https://github.com/matter-labs/era-contracts/blob/main/system-contracts/contracts/DefaultAccount.sol) for more information.

### Account abstraction considerations

The `validateTransaction` function for account abstraction, and the `validateAndPayForPaymasterTransaction` function for paymasters, always attempt to run using the same amount of computation, including storage access, regardless of whether the transaction is successful or not.

See the documentation on [account abstraction](../developer-reference/account-abstraction.md) for more detailed information.

#### `validateTransaction`

- `validateTransaction` is considered successful when it does not revert (i.e. it returns `success = true`) and also returns the magic string.
- For invalid signatures, the function does not revert. It instead returns invalid magic so the function is unsuccessful.

#### `eth_estimateGas`

Because the entire transaction validation and execution flow is simulated in order to get the transaction’s fee, the user needs to have sufficient funds in their account, otherwise the simulation may exit. This means that, to ensure the execution progresses, the zkSync Era sequencer adds the necessary balance, temporarily, to the user’s account; specifically the sequencer increases the account balance by tx.maxFeePerGas \* tx.gasLimit.

This ensures the `DefaultAccount`’s `payForTransaction` function runs successfully.

This is different to the Geth implementation which uses `tx.gasprice = 0` to make sure that the user can pay the fee even though the `tx.origin` in the simulation may not have any balance at all.

:::warning
Due to this, custom accounts may unexpectedly contain more balance than they have on-chain during the validation step, which may affect their behavior.
:::

## Refunds

A gas estimate may be higher than the actual cost of the transaction. This means users usually only spend a portion of the estimated transaction cost.

The refund, therefore, returns the unpaid transaction fee portion to the user.

:::tip

- Only one transaction is recorded on the block, even if a portion of the original estimate is refunded.
- Users can compare their token balance against the transaction cost on the block explorer to verify they did not overspend.
- Users may see no notification in their wallet depending on which wallet they use.
  :::

Refunds are calculated by defining a fair value for the amount the user spent on the transaction and subtracting it from the actual spend.

## Out-of-gas errors

Unlike on Geth, it is impossible to track out-of-gas errors on zkSync Era.

The main reason is that the “actual” execution happens inside the `DefaultAccount` system contract and, due to the [63/64 rule](https://eips.ethereum.org/EIPS/eip-150), when a high amount of gas is provided, the call to the `execute` function of the `DefaultAccount` will NOT fail, even if it is out of gas, although the subcall to the `transaction.to` contract will fail with an out of gas error.
