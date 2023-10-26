---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK L1/L2 Transactions | zkSync Era Docs
---

# Accounts: L1<->L2 transactions

This section explores the methods which allow the [account](./accounts.md) to send transactions among both L1 to L2 networks.

If you want some background on how L1<->L2 interaction works on zkSync, go through the [introduction](../../../reference/concepts/l1-l2-interop.md).

Full examples of actions below are available on the [getting started](./getting-started.md) page.

## Deposit

`Wallet`, `L1Signer` and `L1VoidSigner` objects provide a deposit workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

For a complete example of how to execute the deposit workflow, take a look at the following: [Deposit ETH and ERC20 token](examples/deposit.md).

## Request execute

`Wallet`, `L1Signer` and `L1VoidSigner` objects provide an option to request execution of L2 transaction from L1. For more information, please refer
to the method specification [`requestExecute`](accounts.md#requestexecute).

## Base cost

`Wallet`, `L1Signer` and `L1VoidSigner` objects provide an option to calculate base cost for L2 transaction. For more information, please refer to the
method specification [`getBaseCost`](accounts.md#getbasecost).

## Claim failed deposit

`Wallet`, `L1Signer` and `L1VoidSigner` objects provide a claim fail deposit workflow. For more information, please refer to the method specification
[`claimFailedDeposit`](accounts.md#claimfaileddeposit).

## Finalize withdraw

`Wallet`, `Signer` and `L2VoidSigner` objects provide a finalize withdraw workflow. For more information, please refer to the method specification
[`finalizeWithdrawal`](accounts.md#finalizewithdrawal).

## Withdrawal

`Wallet`, `Signer` and `L2VoidSigner` objects provide a withdrawal workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

For a complete example of how to execute the deposit workflow, take a look at the following: [Withdraw ETH and ERC20 token](examples/withdraw.md).
