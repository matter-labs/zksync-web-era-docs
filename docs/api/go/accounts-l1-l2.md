# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want some background on how L1->L2 interaction works on zkSync, go through the [introduction](../../reference/concepts/l1-l2-interop.md).

Full examples of actions below are available on the [getting started](./getting-started.md) page.

## Deposit

```go

func (p *DefaultEthProvider) Deposit(token *Token, amount *big.Int, address common.Address, options *GasOptions) (*types.Transaction, error)

```

> Example

The complete examples how to use `Deposit`:

```go
tx, err := ep.Deposit(
  utils.CreateETH(),
  big.NewInt(1_000_000_000_000_000_000),
  w.GetAddress(),
  nil,
)
if err != nil {
  panic(err)
}

_, err = ep.WaitMined(context.Background(), tx.Hash())
if err != nil {
  log.Panic(err)
}
```

[Deposit ETH](getting-started.md#deposit-eth).

[Deposit ERC20 token](getting-started.md#deposit-tokens).

**Inputs and outputs**

| Name    | Description                                           |
| ------- | ----------------------------------------------------- |
| token   | The address of the deposited L1 ERC20 token.          |
| amount  | The amount of the token to be deposited.              |
| address | The address that receives the deposited tokens on L2. |
| options | The options for transaction fee and gas.              |
| returns | The transaction hash of the deposit.                  |

## Claim failed deposit

The `ClaimFailedDeposit` method withdraws funds from an initiated deposit, which failed when finalizing on L2.  
If the L2 deposit transaction fails, it sends an L1 transaction calling the `ClaimFailedDeposit` method of the
L1 bridge, which results in returning L1 tokens back to the depositor, or throws an error.

```go

 func (w *Wallet) ClaimFailedDeposit(depositHash common.Hash, ep EthProvider) (common.Hash, error)

```

**Inputs and Outputs**

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| depositHash | The L2 transaction hash of the failed deposit finalization. |
| ep          | The Ethereum provider which interacts with L1 network.      |
| returns     | The transaction hash of claim failed deposit                |

> Example

```go
cfdHash, err := w.ClaimFailedDeposit(l2Hash, ep)
if err != nil {
		fmt.Println(err) // this should trigger if deposit succeed
}
fmt.Println("ClaimFailedDeposit hash", cfdHash)
```

## Withdrawals

Withdrawal are executed in 2 steps:

- `Withdraw`: Initiates withdrawal on L2.
- `FinalizeWithdraw`: Finalized withdrawal on L1.

### Withdraw

```go
func (w *Wallet) Withdraw(to common.Address, amount *big.Int, token *Token, nonce *big.Int) (common.Hash, error)
```

**Inputs and outputs**

| Name    | Description                                           |
| ------- | ----------------------------------------------------- |
| to      | The address that receives the withdrawn tokens on L1. |
| amount  | The amount of the token to be deposited.              |
| token   | The address of the L2 ERC20 token.                    |
| nonce   | The sender's nonce.                                   |
| returns | The transaction hash of the withdrawal.               |

### `FinalizeWithdraw`

```go
func (w *Wallet) FinalizeWithdraw(withdrawalHash common.Hash, index int) (common.Hash, error)
```

**Inputs and outputs**

| Name           | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| withdrawalHash | The L2 transaction hash of the withdrawal.                                             |
| index          | The position in the L2 Merkle-tree logs of the `l2Log` that was sent with the message. |
| returns        | The L1 transaction hash of the finalized withdrawal.                                   |

> Example

```go
// Perform withdraw
wHash, err := w.Withdraw(
  w.GetAddress(),
  big.NewInt(1000000000),
  nil,
  nil,
)
if err != nil {
  panic(err)
}
fmt.Println("Withdraw transaction: ", wHash)

// Wait until transaction is finalized
_, err = w.GetProvider().WaitFinalized(context.Background(), wHash)
if err != nil {
  panic(err)
}

// Perform finalize withdraw
fwHash, err := w.FinalizeWithdraw(wHash, 0)
if err != nil {
  panic(err)
}
fmt.Println("Finalize withdraw transaction", fwHash)
```

The complete examples how to use `Withdraw` and `FinalizeWithdraw`:

- [Withdraw ETH token](getting-started.md#withdraw-eth).
- [Withdraw ERC20 token](getting-started.md#withdraw-tokens).
