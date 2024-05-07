---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK L1/L2 Transactions | zkSync Docs
---

# Accounts: L1<->L2 Transactions

This section explores the methods which allow the [account](./accounts.md) to send transactions among both L1 to L2 networks.

If you want some background on how L1<->L2 interaction works on zkSync, go through the [introduction](../../developer-reference/l1-l2-interop.md).

## Deposit

`Wallet` and `L1Signer` objects provide a deposit workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

For a complete example of how to execute the deposit workflow, take a look at the following: [Deposit ETH and ERC20 token](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/01_deposit.ts).

## Request execute

`Wallet` and `L1Signer` objects provide an option to request execution of L2 transaction from L1. For more information, please refer
to the method specification [`requestExecute`](accounts.md#requestexecute).

## Base cost

`Wallet` and `L1Signer` objects provide an option to calculate base cost for L2 transaction. For more information, please refer to the
method specification [`getBaseCost`](accounts.md#getbasecost).

## Claim failed deposit

`Wallet` and `L1Signer` objects provide a claim fail deposit workflow. For more information, please refer to the method specification
[`claimFailedDeposit`](accounts.md#claimfaileddeposit).

## Finalize withdraw

`Wallet` and `L1Signer` objects provide a finalize withdraw workflow. For more information, please refer to the method specification
[`finalizeWithdrawal`](accounts.md#finalizewithdrawal).

## Withdrawal

`Wallet` and `Signer` objects provide a withdrawal workflow. For more information, please refer to the method specification [`Withdraw`](accounts.md#withdraw).

For a complete example of how to execute the deposit workflow, take a look at the following: [Withdraw ETH and ERC20 token](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/03_withdraw.ts).
