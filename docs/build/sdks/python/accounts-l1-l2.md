---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK L1/L2 Transactions | zkSync Docs
---

# Accounts: L1->L2 Transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1->L2 interaction works on zkSync Era, go through the [introduction](../../developer-reference/l1-l2-interop.md).

Full examples of actions below are available on the getting started page.

## Deposit

`Wallet` object provides a deposit workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

For a complete example of how to execute the deposit workflow, take a look at the following: [Deposit ETH and ERC20 token](https://github.com/zksync-sdk/zksync2-examples/blob/main/python/01_deposit.py).

## Request execute

`Wallet` and `L1Signer` objects provide an option to request execution of L2 transaction from L1. For more information, please refer
to the method specification [`request_execute`](accounts.md#requestexecute).

## Base cost

`Wallet` object provides an option to calculate base cost for L2 transaction. For more information, please refer to the
method specification [`getBaseCost`](accounts.md#getbasecost).

## Claim failed deposit

`Wallet` object provides a claim fail deposit workflow. For more information, please refer to the method specification
[`claimFailedDeposit`](accounts.md#claimfaileddeposit).

## Finalize withdraw

`Wallet` object provides a finalize withdraw workflow. For more information, please refer to the method specification
[`finalizeWithdrawal`](accounts.md#finalizewithdrawal).

## Withdrawal

`Wallet` object provides a withdrawal workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

For a complete example of how to execute the deposit workflow, take a look at the following: [Withdraw ETH and ERC20 token](https://github.com/zksync-sdk/zksync2-examples/blob/main/python/09_withdrawal.py).
