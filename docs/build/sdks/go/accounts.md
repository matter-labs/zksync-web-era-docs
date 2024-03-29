---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Accounts | zkSync Docs
---

# Accounts

## Overview

The `accounts` package provides abstractions that wrap operations that interact with an account. An account typically contains a private
key, allowing it to sign various types of payloads. There are the following interfaces that provide account operations for different
purposes:

- `Signer` provides support for signing EIP-712 transactions as well as other types of transactions supported by
  [`types.Signer`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/core/types#Signer).
- `AdapterL1` is associated with an account and provides common operations on the L1 network for the associated account.
- `AdapterL2` is associated with an account and provides common operations on the L2 network for the associated account.
- `Deployer` is associated with an account and provides deployment of smart contracts and smart accounts on the L2 network for the
  associated account.
- `Adapter` consists of `AdapterL1`, `AdapterL2`, and `Deployer` interfaces.

There are the following objects that provide account operations:

- `BaseSigner` implements the `Signer` interface.
- `WalletL1` implements the `AdapterL1` interface.
- `WalletL2` implements the `AdapterL2` interface.
- `BaseDeployer` implements the `Deployer` interface.
- `Wallet` implements the `Adapter` interface.

In most cases, `Wallet` should be used because it provides all the necessary operations. Other objects and interfaces are separated to make
the SDK more flexible and extensible.

## `BaseSigner`

### `Init`

Creates a new instance of `BaseSigner` based on the provided mnemonic phrase.

```go
func NewBaseSignerFromMnemonic(mnemonic string, chainId int64) (*BaseSigner, error)
```

Creates a new instance of `BaseSigner` based on the provided mnemonic phrase and account ID.

```go
func NewBaseSignerFromMnemonicAndAccountId(mnemonic string, accountId uint32, chainId int64) (*BaseSigner, error)
```

Creates a new instance of BaseSigner based on the provided raw private key.

```go
func NewBaseSignerFromRawPrivateKey(rawPk []byte, chainId int64) (*BaseSigner, error)
```

Creates an instance of Signer with a randomly generated private key.

```go
func NewRandomBaseSigner(chainId int64) (*BaseSigner, error)
```

### `Address`

Returns the address associated with the signer.

```go
Address() common.Address
```

### `Domain`

Returns the EIP-712 domain used for signing.

```go
Domain() *eip712.Domain
```

### `PrivateKey`

Returns the private key associated with the signer.

```go
PrivateKey() *ecdsa.PrivateKey
```

Signs the given hash using the signer's private key and returns the signature. The hash should be the 32-byte hash of the data to be signed.

### `SignHash`

```go
SignHash(msg []byte) ([]byte, error)
```

### `SignTypeData`

Signs the given EIP-712 typed data using the signer's private key and returns the signature. The domain parameter is the EIP-712 domain
separator, and the data parameter is the EIP-712 typed data.

```go
SignTypedData(d *eip712.Domain, data eip712.TypedData) ([]byte, error)
```

## `WalletL1`

### `Init`

Creates an instance of WalletL1 associated with the account provided by the raw private key.

```go
func NewWalletL1(rawPrivateKey []byte, clientL1 *ethclient.Client, clientL2 *clients.Client) (*WalletL1, error
```

Creates an instance of WalletL1 associated with the account provided by the signer.

```go
NewWalletL1FromSigner(signer *Signer, clientL1 *ethclient.Client, clientL2 *clients.Client) (*WalletL1, error)
```

#### Example

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://sepolia.era.zksync.dev"
EthereumProvider := "https://rpc.ankr.com/eth_sepolia"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

ethClient, err := ethclient.Dial(EthereumProvider)
if err != nil {
	log.Panic(err)
}
defer ethClient.Close()

wallet, err := accounts.NewWalletL1(common.Hex2Bytes(PrivateKey), &client, ethClient)
if err != nil {
	log.Panic(err)
}
```

### `MainContract`

Returns the zkSync L1 smart contract.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
MainContract(ctx context.Context) (*zksync.IZkSync, error)
```

#### Example

```go
mainContract, err := wallet.MainContract(context.Background())
if err != nil {
	log.Panic(err)
}
```

### `L1BridgeContracts`

Returns L1 bridge contracts.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
L1BridgeContracts(ctx context.Context) (*zkTypes.L1BridgeContracts, error)
```

#### Example

```go
contracts, err := wallet.L1BridgeContracts(context.Background())
if err != nil {
	log.Panic(err)
}
```

### `BalanceL1`

Returns the balance of the specified token on L1 that can be either ETH or any ERC20 token.

#### Inputs

| Parameter | Type                                                | Description    |
| --------- | --------------------------------------------------- | -------------- |
| `opts`    | [`CallOpts`](types/accounts.md#callopts) (optional) | Call options.  |
| `token`   | `common.Address`                                    | Token address. |

```go
BalanceL1(opts *CallOpts, token common.Address) (*big.Int, error)
```

#### Example

```go
balance, err := wallet.BalanceL1(nil, utils.EthAddress)
if err != nil {
	log.Panic(err)
}
fmt.Println("Balance: ", balance)
```

### `AllowanceL1`

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter       | Type                                                | Description     |
| --------------- | --------------------------------------------------- | --------------- |
| `opts`          | [`CallOpts`](types/accounts.md#callopts) (optional) | Call options.   |
| `token`         | `common.Address`                                    | Token address.  |
| `bridgeAddress` | `common.Address`                                    | Bridge address. |

```go
AllowanceL1(opts *CallOpts, token common.Address, bridgeAddress common.Address) (*big.Int, error)
```

#### Example

```go
ZkSyncEraProvider := "https://testnet.era.zksync.dev"
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()


contracts, err := client.BridgeContracts(context.Background())
if err != nil {
	log.Panic(err)
}
bridgeAllowance, err := wallet.AllowanceL1(nil, TokenAddress, contracts.L1Erc20DefaultBridge)
if err != nil {
	log.Panic(err)
}
fmt.Println("Bridge allowance: ", bridgeAllowance)
```

### `L2TokenAddress`

Returns the corresponding address on the L2 network for the token on the L1 network.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `token`   | `common.Address`  | L1 token address. |

```go
L2TokenAddress(ctx context.Context, token common.Address) (common.Address, error)
```

#### Example

```go
l1DAI := common.HexToAddress("0x5C221E77624690fff6dd741493D735a17716c26B")
l2DAI, err := wallet.L2TokenAddress(context.Background(), l1DAI)
if err != nil {
	log.Panic(err)
}
fmt.Println("L2 DAI address: ", l2DAI)
```

### `ApproveERC20`

Approves the specified amount of tokens for the specified L1 bridge.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `token`   | `common.Address`  | L1 token address. |
| `amount`  | `*big.Int`        | Approval amount.  |

```go
ApproveERC20(auth *TransactOpts, token common.Address, amount *big.Int, bridgeAddress common.Address) (*types.Transaction, error)
```

#### Example

```go
ZkSyncEraProvider := "https://testnet.era.zksync.dev"
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()


contracts, err := client.BridgeContracts(context.Background())
if err != nil {
	log.Panic(err)
}
tx, err := wallet.ApproveERC20(nil, TokenAddress, contracts.L1Erc20DefaultBridge)
if err != nil {
	log.Panic(err)
}
fmt.Println("Tx: ", tx.Hash())
```

### `BaseCost`

Returns base cost for L2 transaction.

#### Inputs

| Parameter           | Type                                                | Description                                                                            |
| ------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `opts`              | [`CallOpts`](types/accounts.md#callopts) (optional) | Call options.                                                                          |
| `gasLimit`          | `*big.Int`                                          | The gasLimit for the the L2 contract call.                                             |
| `gasPerPubdataByte` | `*big.Int`                                          | The L2 gas price for each published L1 calldata byte.                                  |
| `gasPrice`          | `*big.Int` (optional)                               | The L1 gas price of the L1 transaction that will send the request for an execute call. |

```go
BaseCost(opts *CallOpts, gasLimit, gasPerPubdataByte, gasPrice *big.Int) (*big.Int, error)
```

#### Example

```go
ZkSyncEraProvider := "https://testnet.era.zksync.dev"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

gasPrice, err := client.SuggestGasPrice(context.Background())
if err != nil {
	log.Panic(err)
}

baseCost, err := wallet.BaseCost(nil, big.NewInt(9000), utils.RequiredL1ToL2GasPerPubdataLimit, gasPrice)
if err != nil {
	log.Panic(err)
}
fmt.Println("Base cost: ", baseCost)
```

### `Deposit`

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `BridgeAddress`). In this case, `ApproveERC20` can be enabled to perform token approval. If there are already enough approved
tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge, use the
[`AllowanceL1`](#allowancel1) method.

#### Inputs

| Parameter | Type                                                         | Description                     |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.            |
| `tx`      | [`DepositTransaction`](types/accounts.md#deposittransaction) | Deposit transaction parameters. |

```go
Deposit(auth *TransactOpts, tx DepositTransaction) (*types.Transaction, error)
```

#### Example

```go
tx, err := wallet.Deposit(nil, accounts.DepositTransaction{
	Token:  utils.EthAddress,
	Amount: big.NewInt(2_000_000_000_000_000_000),
	To:     common.HexToAddress("<Receipt>"),
})
if err != nil {
	log.Panic(err)
}
fmt.Println("L1 deposit transaction: ", tx.Hash())
```

### `EstimateGasDeposit`

Estimates the amount of gas required for a deposit transaction on L1 network. Gas of approving ERC20 token is not included in the estimation.

#### Inputs

| Parameter | Type                                                 | Description              |
| --------- | ---------------------------------------------------- | ------------------------ |
| `ctx`     | `context.Context`                                    | Context.                 |
| `msg`     | [`DepositCallMsg`](types/accounts.md#depositcallmsg) | Deposit call parameters. |

```go
EstimateGasDeposit(ctx context.Context, msg DepositCallMsg) (uint64, error)
```

#### Example

```go
depositGas, err := wallet.EstimateGasDeposit(context.Background(), accounts.DepositCallMsg{
	To:    wallet.Address(),
	Token: utils.EthAddress,
	Amount: big.NewInt(7_000_000_000),
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Deposit gas: ", depositGas)
```

### `FullRequiredDepositFee`

Retrieves the full needed ETH fee for the deposit on both L1 and L2 networks.

#### Inputs

| Parameter | Type                                                 | Description              |
| --------- | ---------------------------------------------------- | ------------------------ |
| `ctx`     | `context.Context`                                    | Context.                 |
| `msg`     | [`DepositCallMsg`](types/accounts.md#depositcallmsg) | Deposit call parameters. |

```go
FullRequiredDepositFee(ctx context.Context, msg DepositCallMsg) (*FullDepositFee, error)
```

#### Example

```go
fee, err := wallet.FullRequiredDepositFee(context.Background(), accounts.DepositCallMsg{
	To:    wallet.Address(),
	Token: utils.EthAddress,
	Amount: big.NewInt(7_000_000_000),
})
if err != nil {
	log.Panic(err)
}
fmt.Printf("Fee: %+v\n", fee)
```

### `FinalizeWithdraw`

Proves the inclusion of the L2 -> L1 withdrawal message.

#### Inputs

| Parameter        | Type                                                         | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `auth`           | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.                                                                                                      |
| `withdrawalHash` | `common.Hash`                                                | Hash of the L2 transaction where the withdrawal was initiated.                                                            |
| `index`          | `int`                                                        | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. |

```go
FinalizeWithdraw(auth *TransactOpts, withdrawalHash common.Hash, index int) (*types.Transaction, error)
```

#### Example

```go
withdrawalHash := common.HexToHash("<tx hash>")
finalizeWithdrawTx, err := wallet.FinalizeWithdraw(nil, withdrawalHash, 0)
if err != nil {
	log.Panic(err)
}
fmt.Println("Finalize withdraw transaction: ", finalizeWithdrawTx.Hash())
```

### `IsWithdrawFinalized`

Checks if the withdrawal finalized on L1 network.

#### Inputs

| Parameter        | Type                                                | Description                                                                                                                |
| ---------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `opts`           | [`CallOpts`](types/accounts.md#callopts) (optional) | Call options.                                                                                                              |
| `withdrawalHash` | `common.Hash`                                       | Hash of the L2 transaction where the withdrawal was initiated.                                                             |
| `index`          | `int`                                               | In case there where multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. |

```go
IsWithdrawFinalized(opts *CallOpts, withdrawalHash common.Hash, index int) (bool, error)
```

#### Example

```go
withdrawalHash := common.HexToHash("<tx hash>")
isFinalized, err := wallet.IsWithdrawFinalized(nil, withdrawalHash, 0)
if err != nil {
	log.Panic(err)
}
fmt.Println("Is withdrawal finalized: ", isFinalized)
```

### `ClaimFailedDeposit`

Withdraws funds from the initiated deposit, which failed when finalizing on L2. If the deposit L2 transaction has failed, it sends an L1
transaction calling ClaimFailedDeposit method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws
the error.

#### Inputs

| Parameter     | Type                                                         | Description                                    |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `auth`        | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.                           |
| `depositHash` | `common.Hash`                                                | The L2 transaction hash of the failed deposit. |

```go
ClaimFailedDeposit(auth *TransactOpts, depositHash common.Hash) (*types.Transaction, error)
```

#### Example

```go
failedDepositL2Hash := common.HexToHash("<deposit L2 hash>")
cfdTx, err := w.ClaimFailedDeposit(nil, failedDepositL2Hash)
if err != nil {
		log.Panic(err)
}
fmt.Println("ClaimFailedDeposit hash: ", cfdTx.Hash)
```

### `RequestExecute`

Request execution of L2 transaction from L1.

#### Inputs

| Parameter | Type                                                                       | Description                             |
| --------- | -------------------------------------------------------------------------- | --------------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional)               | Transaction options.                    |
| `tx`      | [`RequestExecuteTransaction`](types/accounts.md#requestexecutetransaction) | Request execute transaction parameters. |

```go
RequestExecute(auth *TransactOpts, tx RequestExecuteTransaction) (*types.Transaction, error)
```

#### Example

```go
contractAddress := common.HexToAddress("<Contract address>")
requestExecuteTx, err := wallet.RequestExecute(nil, accounts.RequestExecuteTransaction{
	ContractAddress:   contractAddress,
	L2Value:           big.NewInt(7_000_000_000),
	L2GasLimit:        big.NewInt(90_000),
	GasPerPubdataByte: utils.RequiredL1ToL2GasPerPubdataLimit,
	RefundRecipient:   to,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Request execute tx: ", requestExecuteTx.Hash())
```

### `EstimateGasRequestExecute`

Estimates the amount of gas required for a request execute transaction.

#### Inputs

| Parameter | Type                                                               | Description                      |
| --------- | ------------------------------------------------------------------ | -------------------------------- |
| `ctx`     | `context.Context`                                                  | Context.                         |
| `msg`     | [`RequestExecuteCallMsg`](types/accounts.md#requestexecutecallmsg) | Request execute call parameters. |

```go
EstimateGasRequestExecute(ctx context.Context, msg RequestExecuteCallMsg) (uint64, error)
```

#### Example

```go
contractAddress := common.HexToAddress("<Contract address>")
gas, err := wallet.EstimateGasRequestExecute(context.Background(), accounts.RequestExecuteCallMsg{
	ContractAddress:   contractAddress,
	L2Value:           big.NewInt(7_000_000_000),
	L2GasLimit:        big.NewInt(90_000),
	GasPerPubdataByte: utils.RequiredL1ToL2GasPerPubdataLimit,
	RefundRecipient:   to,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `EstimateCustomBridgeDepositL2Gas`

Used by [`EstimateDefaultBridgeDepositL2Gas`](#estimatedefaultbridgedepositl2gas) to estimate L2 gas required for token bridging via a
custom ERC20 bridge.

::: tip More info
See the [default bridges documentation](../../developer-reference/bridging-asset.md)
:::

#### Inputs

| Parameter           | Type                        | Description                      |
| ------------------- | --------------------------- | -------------------------------- |
| `ctx`               | `context.Context`           | Context.                         |
| `l1BridgeAddress`   | `common.Address`            | L1 bridge address.               |
| `l2BridgeAddress`   | `common.Address`            | L2 bridge address.               |
| `token`             | `common.Address`            | Token address.                   |
| `amount`            | `*big.Int`                  | Deposit amount.                  |
| `to`                | `common.Address`            | Recipient address.               |
| `bridgeData`        | `[]byte`                    | Bridge data.                     |
| `from`              | `common.Address` (optional) | Sender address.                  |
| `gasPerPubdataByte` | `*big.Int` (optional)       | Current gas per byte of pubdata. |

```go
EstimateCustomBridgeDepositL2Gas(ctx context.Context, l1BridgeAddress, l2BridgeAddress, token common.Address,
	amount *big.Int, to common.Address, bridgeData []byte, from common.Address, gasPerPubdataByte *big.Int) (uint64, error)
```

#### Example

```go
L1BridgeAddress := common.HexToAddress("<Bridge address>")
Token := common.HexToAddress("<Token address>")
From := common.HexToAddress("<Sender address>")
To := common.HexToAddress("<Receipt address>")


bridge, err := l1bridge.NewIL1Bridge(L1BridgeAddress, ethClient)
if err != nil {
	log.Panic(err)
}
l2BridgeAddress, err := bridge.L2Bridge(nil)
if err != nil {
	log.Panic(err)
}
customBridgeData, err := utils.Erc20DefaultBridgeData(Token, ethClient)
if err != nil {
	log.Panic(err)
}

gas, err := wallet1.EstimateCustomBridgeDepositL2Gas(context.Background(), L1BridgeAddress, l2BridgeAddress, Token,
	big.NewInt(7), To, customBridgeData, From, utils.RequiredL1ToL2GasPerPubdataLimit)
if err != nil {
	log.Panic(err)
}
fmt.Println("L2 gas: ", gas)
```

### `EstimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

::: tip More info
See the [default bridges documentation](../../developer-reference/bridging-asset.md#default-bridges)
:::

#### Inputs

| Parameter            | Type                        | Description                      |
| -------------------- | --------------------------- | -------------------------------- |
| `ctx`                | `context.Context`           | Context.                         |
| `token`              | `common.Address`            | Token address.                   |
| `amount`             | `*big.Int`                  | Deposit amount.                  |
| `to`                 | `common.Address`            | Recipient address.               |
| `from?`              | `common.Address` (optional) | Sender address.                  |
| `gasPerPubdataByte?` | `*big.Int` (optional)       | Current gas per byte of pubdata. |

```go
EstimateDefaultBridgeDepositL2Gas(ctx context.Context, token common.Address, amount *big.Int,
	to, from common.Address, gasPerPubdataByte *big.Int) (uint64, error)
```

#### Example

```go
Token := common.HexToAddress("<Token address>")
From := common.HexToAddress("<Sender address>")
To := common.HexToAddress("<Receipt address>")
gas, err := wallet1.EstimateDefaultBridgeDepositL2Gas(
	context.Background(), Token, big.NewInt(7), To, From, utils.RequiredL1ToL2GasPerPubdataLimit,
)
if err != nil {
	log.Panic(err)
}
fmt.Println("L2 gas: ", gas)
```

## `WalletL2`

### `Init`

Creates an instance of `WalletL2` associated with the account provided by the raw private key.

```go
func NewWalletL2(rawPrivateKey []byte, client *clients.Client) (*WalletL2, error)
```

Creates an instance of `WalletL2`. The `client` can be optional; if it is not provided, only `SignTransaction`, `Address`, `Signer` can be
performed, as the rest of the functionalities require communication to the network.

```go
func NewWalletL2FromSigner(signer *Signer, client *clients.Client) (*WalletL2, error)
```

#### Example

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://testnet.era.zksync.dev"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client)
if err != nil {
	log.Panic(err)
}

```

### `Address`

Returns the address of the associated account.

```go
Address() common.Address
```

#### Example

```go
fmt.Println("Address: ", wallet.Address())
```

### `Signer`

Returns the signer of the associated account.

```go
Signer() Signer
```

#### Example

```go
fmt.Printf("Signer %+v\n", wallet.Signer())
```

### `Balance`

Returns the balance of the specified token that can be either ETH or any ERC20 token. The block number can be `nil`, in which case the
balance is taken from the latest known block.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `token`   | `common.Address`  | L2 token address. |
| `at`      | `*big.Int`        | Block number.     |

```go
Balance(ctx context.Context, token common.Address, at *big.Int) (*big.Int, error)
```

#### Example

```go
balance, err := w.Balance(context.Background(), utils.EthAddress, nil)
if err != nil {
	log.Panic(err)
}
fmt.Println("Balance: ", balance)
```

### `AllBalances`

Returns all balances for confirmed tokens given by an associated account.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
AllBalances(ctx context.Context) (map[common.Address]*big.Int, error)
```

#### Example

```go
balances, err := wallet.AllBalances(context.Background())
if err != nil {
	log.Panic(err)
}
fmt.Printf("Balances: %+v\n", balances)
```

### `L2BridgeContracts`

Returns L2 bridge contracts.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
L2BridgeContracts(ctx context.Context) (*zkTypes.L2BridgeContracts, error)
```

#### Example

```go
contracts, err := wallet.L2BridgeContracts(context.Background())
if err != nil {
	log.Panic(err)
}
```

### `DeploymentNonce`

Returns the deployment nonce of the account.

#### Inputs

| Parameter | Type                                                | Description   |
| --------- | --------------------------------------------------- | ------------- |
| `opts`    | [`CallOpts`](types/accounts.md#callopts) (optional) | Call options. |

```go
func (a *WalletL2) DeploymentNonce(opts *CallOpts) (*big.Int, error)
```

#### Example

```go
deploymentNonce, err := wallet.DeploymentNonce(nil)
if err != nil {
    log.Panic(err)
}
```

### `Withdraw`

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Parameter | Type                                                               | Description                        |
| --------- | ------------------------------------------------------------------ | ---------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional)       | Transaction options.               |
| `tx`      | [`WithdrawalTransaction`](types/accounts.md#withdrawaltransaction) | Withdrawal transaction parameters. |

```go
Withdraw(auth *TransactOpts, tx WithdrawalTransaction) (*types.Transaction, error)
```

#### Example

```go
tx, err := wallet.Withdraw(nil, accounts.WithdrawalTransaction{
	To:     wallet.Address(),
	Amount: big.NewInt(1_000_000_000_000_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	panic(err)
}
fmt.Println("Withdraw transaction: ", tx.Hash())
```

### `EstimateGasWithdraw`

Estimates the amount of gas required for a withdrawal transaction.

#### Inputs

| Parameter | Type                                                       | Description                 |
| --------- | ---------------------------------------------------------- | --------------------------- |
| `ctx`     | `context.Context`                                          | Context.                    |
| `msg`     | [`WithdrawalCallMsg`](types/accounts.md#withdrawalcallmsg) | Withdrawal call parameters. |

```go
EstimateGasWithdraw(ctx context.Context, msg WithdrawalCallMsg) (uint64, error)
```

#### Example

```go
gas, err := wallet.EstimateGasWithdraw(context.Background(), accounts.WithdrawalCallMsg{
	To:   wallet.Address(),
	Amount: big.NewInt(7_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `Transfer`

Moves the ETH or any ERC20 token from the associated account to the target account.

#### Inputs

| Parameter | Type                                                           | Description                      |
| --------- | -------------------------------------------------------------- | -------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional)   | Transaction options.             |
| `tx`      | [`TransferTransaction`](types/accounts.md#transfertransaction) | Transfer transaction parameters. |

```go
Transfer(auth *TransactOpts, tx TransferTransaction) (*types.Transaction, error)
```

#### Example

```go
tx, err := w.Transfer(nil, accounts.TransferTransaction{
	To:     common.HexToAddress("<Receipt address>"),
	Amount: big.NewInt(7_000_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Transaction: ", tx.Hash())
```

### `EstimateGasTransfer`

Estimates the amount of gas required for a transfer transaction.

#### Inputs

| Parameter | Type                                                   | Description               |
| --------- | ------------------------------------------------------ | ------------------------- |
| `ctx`     | `context.Context`                                      | Context.                  |
| `msg`     | [`TransferCallMsg`](types/accounts.md#transfercallmsg) | Transfer call parameters. |

```go
EstimateGasTransfer(ctx context.Context, msg TransferCallMsg) (uint64, error)
```

#### Example

```go
gas, err := wallet.EstimateGasTransfer(context.Background(), accounts.TransferCallMsg{
	To:   common.HexToAddress("<Receipt address>"),
	Amount: big.NewInt(7_000_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `CallContract`

Executes a message call for EIP-712 transaction, which is directly executed in the VM of the node, but never mined into the
blockchain.

#### Inputs

| Parameter     | Type                                   | Description                                                                                                                                                                                 |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx`         | `context.Context`                      | Context.                                                                                                                                                                                    |
| `msg`         | [`CallMsg`](types/accounts.md#callmsg) | Contains parameters for contract call using EIP-712 transaction.                                                                                                                            |
| `blockNumber` | `*big.Int` (optional)                  | Selects the block height at which the call runs. It can be `nil`, in which case the code is taken from the latest known block. Note that state from very old blocks might not be available. |

```go
CallContract(ctx context.Context, msg CallMsg, blockNumber *big.Int) ([]byte, error)
```

#### Example

```go
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")

tokenAbi, err := erc20.IERC20MetaData.GetAbi()
if err != nil {
	log.Panic(err)
}
symbolCalldata, err := tokenAbi.Pack("symbol")
if err != nil {
	log.Panic(err)
}

result, err := wallet.CallContract(context.Background(), types.CallMsg{
	CallMsg: ethereum.CallMsg{
		To:   &TokenAddress,
		Data: symbolCalldata,
	},
}, nil)
if err != nil {
	log.Panic(err)
}
unpack, err := tokenAbi.Unpack("symbol", result)
if err != nil {
	log.Panic(err)
}
symbol := *abi.ConvertType(unpack[0], new(string)).(*string)
fmt.Println("Symbol: ", symbol)
```

### PopulateTransaction

Designed for users who prefer a simplified approach by providing only the necessary data to create a valid [EIP-712 transaction](types/types.md#transaction712).
The only required fields are `Transaction.To` and either `Transaction.Data` or `Transaction.Value` (or both, if the method is payable).
Any other fields that are not set will be prepared by this method.

#### Inputs

| Parameter | Type                                           | Description             |
| --------- | ---------------------------------------------- | ----------------------- |
| `ctx`     | `context.Context`                              | Context.                |
| `tx`      | [`Transaction`](types/accounts.md#transaction) | Transaction parameters. |

```go
PopulateTransaction(ctx context.Context, tx Transaction) (*zkTypes.Transaction712, error)
```

#### Example

```go
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")
// Paymaster for Crown token on testnet
PaymasterAddress := common.HexToAddress("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
ReceiptAddress := common.HexToAddress("0xa61464658AfeAf65CccaaFD3a512b69A83B77618")

abi, err := erc20.IERC20MetaData.GetAbi()
if err != nil {
	log.Panic(err)
}

// Encode transfer function from token contract
calldata, err := abi.Pack("transfer", ReceiptAddress, big.NewInt(7))
if err != nil {
	log.Panic(err)
}

preparedTx, err := wallet.PopulateTransaction(context.Background(), &accounts.Transaction{
	To:   &TokenAddress,
	Data: calldata,
})
fmt.Printf("Prepared tx: %+v\n", preparedTx)
```

### `SignTransaction`

Returns a signed transaction that is ready to be broadcast to the network. The input transaction must be a valid transaction with all fields
having appropriate values. To obtain a valid transaction, you can use the [`PopulateTransaction`](#populatetransaction) method.

#### Inputs

| Parameter | Type                                                      | Description                     |
| --------- | --------------------------------------------------------- | ------------------------------- |
| `tx`      | [`zkTypes.Transaction712`](types/types.md#transaction712) | EIP-712 transaction parameters. |

```go
SignTransaction(tx *zkTypes.Transaction712) ([]byte, error)
```

#### Example

```go
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")
// Paymaster for Crown token on testnet
PaymasterAddress := common.HexToAddress("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
ReceiptAddress := common.HexToAddress("0xa61464658AfeAf65CccaaFD3a512b69A83B77618")

abi, err := erc20.IERC20MetaData.GetAbi()
if err != nil {
	log.Panic(err)
}

// Encode transfer function from token contract
calldata, err := abi.Pack("transfer", ReceiptAddress, big.NewInt(7))
if err != nil {
	log.Panic(err)
}

preparedTx, err := wallet.PopulateTransaction(context.Background(), &accounts.Transaction{
	To:   &TokenAddress,
	Data: calldata,
})

signedTx, err := wallet.SignTransaction(preparedTx)
if err != nil {
	log.Panic(err)
}
fmt.Printf("Signed tx: %+v\n", signedTx)
```

### `SendTransaction`

Injects a transaction into the pending pool for execution. Any unset transaction fields are prepared using the PopulateTransaction method.

#### Inputs

| Parameter | Type                                           | Description             |
| --------- | ---------------------------------------------- | ----------------------- |
| `ctx`     | `context.Context`                              | Context.                |
| `tx`      | [`Transaction`](types/accounts.md#transaction) | Transaction parameters. |

```go
SendTransaction(ctx context.Context, tx *Transaction) (common.Hash, error)
```

#### Example

```go
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")
// Paymaster for Crown token on testnet
PaymasterAddress := common.HexToAddress("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
ReceiptAddress := common.HexToAddress("0xa61464658AfeAf65CccaaFD3a512b69A83B77618")

abi, err := erc20.IERC20MetaData.GetAbi()
if err != nil {
	log.Panic(err)
}

// Encode transfer function from token contract
calldata, err := abi.Pack("transfer", ReceiptAddress, big.NewInt(7))
if err != nil {
	log.Panic(err)
}

// Create paymaster parameters with encoded paymaster input
paymasterParams, err := utils.GetPaymasterParams(
	PaymasterAddress,
	&zkTypes.ApprovalBasedPaymasterInput{
		Token:            TokenAddress,
		MinimalAllowance: big.NewInt(1),
		InnerInput:       []byte{},
	})
if err != nil {
	log.Panic(err)
}

hash, err := wallet.SendTransaction(context.Background(), &accounts.Transaction{
	To:   &TokenAddress,
	Data: calldata,
	Meta: &types.Eip712Meta{
		PaymasterParams: paymasterParams,
	},
})
if err != nil {
	log.Panic(err)
}

_, err = client.WaitMined(context.Background(), hash)
if err != nil {
	log.Panic(err)
}

fmt.Println("Tx: ", hash)
```

## `BaseDeployer`

### `Init`

Creates an instance of `BaseDeployer` based on provided `AdapterL2`.

```go
func NewBaseDeployer(adapter *AdapterL2) *BaseDeployer
```

### `Deploy`

Deploys smart contract using CREATE2 method.

#### Inputs

| Parameter | Type                                                         | Description                     |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.            |
| `tx`      | [`Create2Transaction`](types/accounts.md#create2transaction) | CREATE2 transaction parameters. |

```go
Deploy(auth *TransactOpts, tx Create2Transaction) (common.Hash, error)
```

#### Example

```go
bytecode, err := os.ReadFile("Storage.zbin")
if err != nil {
	log.Panic(err)
}

//Deploy smart contract
hash, err := w.Deploy(nil, accounts.Create2Transaction{Bytecode: bytecode})
if err != nil {
	panic(err)
}
fmt.Println("Transaction: ", hash)
```

### `DeployWithCreate`

Deploys smart contract using CREATE method.

#### Inputs

| Parameter | Type                                                         | Description                    |
| --------- | ------------------------------------------------------------ | ------------------------------ |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.           |
| `tx`      | [`CreateTransaction`](types/accounts.md#createtransaction)   | CREATE transaction parameters. |

```go
DeployWithCreate(auth *TransactOpts, tx CreateTransaction) (common.Hash, error)
```

#### Example

```go
bytecode, err := os.ReadFile("Storage.zbin")
if err != nil {
	log.Panic(err)
}

//Deploy smart contract
hash, err := w.DeployWithCreate(nil, accounts.CreateTransaction{Bytecode: bytecode})
if err != nil {
	panic(err)
}
fmt.Println("Transaction: ", hash)
```

### `DeployAccount`

Deploys smart account using CREATE2 method.

#### Inputs

| Parameter | Type                                                         | Description                     |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.            |
| `tx`      | [`Create2Transaction`](types/accounts.md#create2transaction) | CREATE2 transaction parameters. |

```go
DeployAccount(auth *TransactOpts, tx Create2Transaction) (common.Hash, error)
```

#### Example

```go
# Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")

_, paymasterAbi, bytecode, err := utils.ReadStandardJson("Paymaster.json")
if err != nil {
	log.Panic(err)
}

// Encode paymaster constructor
constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
if err != nil {
	log.Panic(err)
}

// Deploy paymaster contract
hash, err := w.DeployAccount(nil, accounts.Create2Transaction{Bytecode: bytecode, Calldata: constructor})
if err != nil {
	log.Panic(err)
}
if err != nil {
	log.Panic(err)
}
fmt.Println("Transaction: ", hash)

```

### `DeployAccountWithCreate`

Deploys smart account using CREATE method.

#### Inputs

| Parameter | Type                                                         | Description                    |
| --------- | ------------------------------------------------------------ | ------------------------------ |
| `auth`    | [`*TransactOpts`](types/accounts.md#transactopts) (optional) | Transaction options.           |
| `tx`      | [`CreateTransaction`](types/accounts.md#createtransaction)   | CREATE transaction parameters. |

```go
DeployAccountWithCreate(auth *TransactOpts, tx CreateTransaction) (common.Hash, error)
```

#### Example

```go
# Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")

_, paymasterAbi, bytecode, err := utils.ReadStandardJson("Paymaster.json")
if err != nil {
	log.Panic(err)
}

constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
if err != nil {
	log.Panic(err)
}

// Deploy paymaster contract
hash, err := w.DeployAccountWithCreate(nil, accounts.CreateTransaction{
	Bytecode: bytecode,
	Calldata: constructor,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Transaction: ", hash)
```

## `Wallet`

It contains the same functions as [`WalletL1`](#walletl1), [`WalletL2`](#walletl2), and [`BaseDeployer`](#basedeployer) since it implements
the Adapter interface, and the usage of those methods is the same.

### `Init`

Creates an instance of `Wallet` associated with the account provided by the `rawPrivateKey`. The `clientL1` parameters is
optional; if not provided, only methods from `AdapterL2` and `Deployer` interfaces can be used, as the rest of the functionalities require
communication with the L1 network. A `Wallet` can be configured to communicate with L1 networks by using and [`ConnectL1`](#connectl1)
method.

```go
func NewWallet(rawPrivateKey []byte, clientL2 *clients.Client, clientL1 *ethclient.Client) (*Wallet, error)
```

Creates an instance of Wallet associated with the account provided by the signer. The `clientL2` and `clientL1` parameters are optional;
if not provided, only `SignTransaction`, `Address` and `Signer` methods can be used, as the rest of the functionalities require
communication with the network. A wallet that contains only a signer can be configured to communicate with L2 and L1 networks by using
[`Connect`](#connect) and [`ConnectL1`](#connectl1), respectively.

```go
func NewWalletFromSigner(signer Signer, clientL2 *clients.Client, clientL1 *ethclient.Client) (*Wallet, error)
```

Creates a new instance of `Wallet` based on the provided mnemonic phrase. The `clientL2` and `clientL1` parameters are optional, and can be configured
with [`Connect`](#connect) and [`ConnectL1`](#connectl1), respectively.

```go
func NewWalletFromMnemonic(mnemonic string, chainId int64, clientL2 *clients.Client, clientL1 *ethclient.Client) (*Wallet, error)
```

Creates a new instance of `Wallet` based on the provided private key of the account and chain ID. The `clientL2` and `clientL1` parameters
are optional, and can be configured with [`Connect`](#connect) and [`ConnectL1`](#connectl1), respectively.

```go
func NewWalletFromRawPrivateKey(rawPk []byte, chainId int64, clientL2 *clients.Client, clientL1 *ethclient.Client) (*Wallet, error)
```

Creates an instance of `Wallet` with a randomly generated account. The `clientL2` and `clientL1` parameters are optional, and can be configured
with [`Connect`](#connect) and [`ConnectL1`](#connectl1), respectively.

```go
func NewRandomWallet(chainId int64, clientL2 *clients.Client, clientL1 *ethclient.Client) (*Wallet, error)
```

#### Example

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://sepolia.era.zksync.dev"
EthereumProvider := "https://rpc.ankr.com/eth_sepolia"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

ethClient, err := ethclient.Dial(EthereumProvider)
if err != nil {
	log.Panic(err)
}
defer ethClient.Close()

wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, ethClient)
if err != nil {
	log.Panic(err)
}

chainID, err := client.ChainID(context.Background())
if err != nil {
	log.Panic(err)
}
wallet, err = accounts.NewRandomWallet(chainID.Int64(),nil,nil)
if err != nil {
	log.Panic(err)
}
```

### `Connect`

Returns a new instance of `Wallet` with the provided client for the L2 network.

#### Inputs

| Parameter | Type                            | Description |
| --------- | ------------------------------- | ----------- |
| `client`  | [`*clients.Client`](clients.md) | L2 client.  |

```go
Connect(client *clients.Client) (*Wallet, error)
```

#### Example

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://testnet.era.zksync.dev"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

chainID, err := client.ChainID(context.Background())
if err != nil {
	log.Panic(err)
}

wallet, err := accounts.NewRandomWallet(chainID, nil, nil)
if err != nil {
	log.Panic(err)
}

// create new wallet with connection to L2
walleet, err = wallet.Connect(&client)
if err != nil {
	log.Panic(err)
}
```

### `ConnectL1`

Returns a new instance of `Wallet` with the provided client for the L1 network.

#### Inputs

| Parameter | Type                                                                                               | Description |
| --------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `client`  | [`*ethclient.Client`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/ethclient#Client) | L1 client.  |

```go
ConnectL1(client *ethclient.Client) (*Wallet, error)
```

#### Example

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://sepolia.era.zksync.dev"
EthereumProvider := "https://rpc.ankr.com/eth_sepolia"

client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

chainID, err := client.ChainID(context.Background())
if err != nil {
	log.Panic(err)
}

wallet, err := accounts.NewRandomWallet(chainID, nil, nil)
if err != nil {
	log.Panic(err)
}

ethClient, err := ethclient.Dial(EthereumProvider)
if err != nil {
	log.Panic(err)
}
defer ethClient.Close()

// create new wallet with connection to L1
w, err = w.Connect(&ethClient)
if err != nil {
	log.Panic(err)
}
```

### `Nonce`

Returns the account nonce of the associated account. The block number can be `nil`, in which case the nonce is taken from the latest known
block.

#### Inputs

| Parameter     | Type                  | Description   |
| ------------- | --------------------- | ------------- |
| `ctx`         | `context.Context`     | Context.      |
| `blockNumber` | `*big.Int` (optional) | Block number. |

```go
Nonce(ctx context.Context, blockNumber *big.Int) (uint64, error)
```

#### Example

```go
nonce, err := wallet.Nonce(context.Background(), big.NewInt(9000))
if err != nil {
	log.Panic(err)
}
fmt.Println("Nonce: ", nonce)
```

### `PendingNonce`

Returns the account nonce of the associated account in the pending state. This is the nonce that should be used for the next transaction.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
PendingNonce(ctx context.Context) (uint64, error)
```

#### Example

```go
nonce, err := wallet.PendingNonce(context.Background())
if err != nil {
	log.Panic(err)
}
fmt.Println("Nonce: ", nonce)
```
