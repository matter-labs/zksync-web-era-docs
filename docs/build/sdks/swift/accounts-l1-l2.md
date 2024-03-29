---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK L1/L2 Transactions | zkSync Docs
---

# Accounts: L1<->L2 Transactions

This section explores the methods which allow the [account](./accounts.md) to send transactions among both L1 to L2 networks.

If you want some background on how L1<->L2 interaction works on zkSync, go through the [introduction](../../developer-reference/l1-l2-interop.md).

Full examples of actions below are available on the [getting started](./getting-started.md) page.

## Deposit

`WalletL1` and `Wallet` objects provide a deposit workflow. For more information, please refer to the method specification [`Deposit`](accounts.md#deposit).

## Request execute

`WalletL1` and `Wallet` objects provide an option to request execution of L2 transaction from L1. For more information, please refer
to the method specification [`RequestExecute`](accounts.md#requestexecute).

## Base cost

`WalletL1` and `Wallet` objects provide an option to calculate base cost for L2 transaction. For more information, please refer to the
method specification [`BaseCost`](accounts.md#getBaseCost).

## Claim failed deposit

`WalletL1` and `Wallet` objects provide a claim fail deposit workflow. For more information, please refer to the method specification

## Withdrawal

`WalletL2` and `Wallet` objects provide a withdrawal workflow. For more information, please refer to the method specification [`Withdraw`](accounts.md#withdraw).
