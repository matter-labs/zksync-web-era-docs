---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Clients | zkSync Docs
---

# Clients

:::info Note
Since the `geth` library has the concept of a `Client`, not a `Provider`, that's why the Go SDK for zkSync Era also adopts the concept of a
`Client`, as opposed to using a Provider like in the other zkSync Era SDKs.
:::

`Client` is a wrapper around the zkSync Era RPC API, which supports `ethclient.Client` from the `geth` library and additional methods
specific to zkSync Era.

`Client` in code represents the interface that is composed of the following two interfaces:

- `EthereumClient` provides Ethereum RPC methods on the zkSync Era node, those with the `eth_` prefix. This interface contains the same
  methods as `ethclient.Client` from the `geth` library. Additionally, it has extra methods capable of working with EIP-712 transactions. It
  is designed to be compatible with the `bind.ContractBackend` interface from `geth`, enabling support for smart contracts generated using the
  `abigen` tool.
- `ZkSyncEraClient` provides the API for zkSync Era features and specific RPC methods, those with the `zks_` prefix.

These interfaces are separated to make the SDK more flexible and extensible.

## `BaseClient`

`BaseClient` implements the `Client` interface and provides interaction with zkSync Era RPC API.

### `Init`

`Dial` connects a client to the given URL.

```go
func Dial(rawUrl string) (Client, error)
```

`DialContext` connects a client to the given URL with context.

```go
func DialContext(ctx context.Context, rawUrl string) (Client, error)
```

`NewClient` creates a client that uses the given RPC client.

```go
func NewClient(c *rpc.Client) Client
```

#### Example

```go
ZkSyncEraProvider   := "https://testnet.era.zksync.dev"
ZkSyncEraWSProvider := "ws://testnet.era.zksync.dev:3051"

// Connect to zkSync network
client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

// Connect to zkSync network using Web Socket
wsClient, err := clients.Dial(ZkSyncEraWSProvider)
if err != nil {
	log.Panic(err)
}
defer wsClient.Close()
```

### `FilterLogsL2`

Executes a log filter operation, blocking during execution, and returns all the results in one batch. This method is a
replacement for `FilterLogs` because the returned `types.Log` type does not contain additional data specific to L2, as found in
[`Log`](types/types.md#log). The `FilterLogs` method is kept in order to be compatible with `bind.ContractBackend`, and this method can be used,
but additional L2 data won't be retrieved.

#### Inputs

| Parameter | Type                                                                                             | Description              |
| --------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| `ctx`     | `context.Context`                                                                                | Context.                 |
| `query`   | [`ethereum.FilterQuery`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0#FilterQuery) | Filter query parameters. |

```go
FilterLogsL2(ctx context.Context, query ethereum.FilterQuery) ([]zkTypes.Log, error)
```

#### Example

```go
contracts, err := client.BridgeContracts(context.Background())
if err != nil {
  log.Panic(err)
}
zkLogs, err := client.FilterLogsL2(context.Background(), ethereum.FilterQuery{
	FromBlock: big.NewInt(0),
	ToBlock:   big.NewInt(1000),
	Addresses: []common.Address{contracts.L2Erc20DefaultBridge},
})
if err != nil {
	log.Panic(err)
}

for _, l := range zkLogs {
	fmt.Println("Log address:", l.Address.Hex())
	fmt.Println("Log data:", l.Data)
	fmt.Println("L1 batch number: ", l.L1BatchNumber)
}
```

### `SubscribeFilterLogsL2`

Creates a background log filtering operation, returning a subscription immediately, which can be used to stream the
found events. This method is a replacement for `SubscribeFilterLogs` because the returned `types.Log` type does not contain additional data
specific to L2, as found in [`Log`](types/types.md#log). The `SubscribeFilterLogs` method is kept in order to be compatible with `bind.ContractBackend`,
and this method can be used, but additional L2 data won't be retrieved.

#### Inputs

| Parameter | Type                                                                                             | Description                |
| --------- | ------------------------------------------------------------------------------------------------ | -------------------------- |
| `ctx`     | `context.Context`                                                                                | Context.                   |
| `query`   | [`ethereum.FilterQuery`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0#FilterQuery) | Filter query parameters.   |
| `ch`      | [`chan<- zkTypes.Log`](types/types.md#log)                                                       | Channel that receives Log. |

```go
SubscribeFilterLogsL2(ctx context.Context, query ethereum.FilterQuery, ch chan<- zkTypes.Log) (ethereum.Subscription, error)
```

#### Example

```go
contracts, err := client.BridgeContracts(context.Background())
if err != nil {
	log.Panic(err)
}

filterLogs := make(chan zkTypes.Log)
sub, err := wsClient.SubscribeFilterLogsL2(context.Background(), ethereum.FilterQuery{
	FromBlock: big.NewInt(0),
	ToBlock:   big.NewInt(1000),
	Addresses: []common.Address{contracts.L2Erc20DefaultBridge},
}, filterLogs)
if err != nil {
	log.Panic(err)
}
defer sub.Unsubscribe()

for {
	select {
	case err := <-sub.Err():
		log.Println(err)
		break
	case l := <-filterLogs:
		fmt.Println("Address: ", l.Address)
		fmt.Println("Data", l.Data)
	}
}
```

### `CallContractL2`

Executes a message call for EIP-712 transaction, which is directly executed in the VM of the node, but never mined into the
blockchain.

#### Inputs

| Parameter     | Type                                        | Description                                                                                                                                                                                 |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx`         | `context.Context`                           | Context.                                                                                                                                                                                    |
| `msg`         | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction.                                                                                                                            |
| `blockNumber` | `*big.Int` (optional)                       | Selects the block height at which the call runs. It can be `nil`, in which case the code is taken from the latest known block. Note that state from very old blocks might not be available. |

```go
CallContractL2(ctx context.Context, msg zkTypes.CallMsg, blockNumber *big.Int) ([]byte, error)
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

result, err := client.CallContractL2(context.Background(), types.CallMsg{
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

### `CallContractAtHashL2`

Almost the same as [`CallContractL2`](#callcontractl2) except that it selects the block by block hash instead of
block height.

#### Inputs

| Parameter   | Type                                        | Description                                                      |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`       | `context.Context`                           | Context.                                                         |
| `msg`       | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |
| `blockHash` | `common.Hash`                               | Block hash.                                                      |

```go
CallContractAtHashL2(ctx context.Context, msg zkTypes.CallMsg, blockHash common.Hash) ([]byte, error)
```

### `PendingCallContractL2`

Almost the same as [`CallContractL2`](#callcontractl2) except that the state seen by the contract call is the
pending state.

#### Inputs

| Parameter | Type                                        | Description                                                      |
| --------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`     | `context.Context`                           | Context.                                                         |
| `msg`     | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |

```go
PendingCallContractL2(ctx context.Context, msg zkTypes.CallMsg) ([]byte, error)
```

### `EstimateGasL2`

Tries to estimate the gas needed to execute an EIP-712 transaction based on the current pending state of the backend blockchain. There is no
guarantee that this is the true gas limit requirement as other transactions may be added or removed by miners, but it should provide a basis
for setting a reasonable default.

#### Inputs

| Parameter | Type                                        | Description                                                      |
| --------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`     | `context.Context`                           | Context.                                                         |
| `msg`     | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |

```go
EstimateGasL2(ctx context.Context, msg zkTypes.CallMsg) (uint64, error)
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

gas, err := client.EstimateGasL2(context.Background(), zkTypes.CallMsg{
	CallMsg: ethereum.CallMsg{
		To:   &TokenAddress,
		Data: calldata,
	},
	Meta: &zkTypes.Eip712Meta{
		PaymasterParams: paymasterParams,
	},
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `SendRawTransaction`

Injects a signed raw transaction into the pending pool for execution. Is meant to be used for sending EIP-712 transaction,

#### Inputs

| Parameter | Type              | Description      |
| --------- | ----------------- | ---------------- |
| `ctx`     | `context.Context` | Context.         |
| `tx`      | `[]byte`          | Raw transaction. |

```go
SendRawTransaction(ctx context.Context, tx []byte) (common.Hash, error)
```

#### Example

```go
// The Crown token on testnet
TokenAddress := common.HexToAddress("0x927488F48ffbc32112F1fF721759649A89721F8F")
// Paymaster for Crown token on testnet
PaymasterAddress := common.HexToAddress("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
ReceiptAddress := common.HexToAddress("0xa61464658AfeAf65CccaaFD3a512b69A83B77618")

w, err := accounts.NewWallet(common.Hex2Bytes(<private key>), &client, nil)
if err != nil {
	log.Panic(err)
}

abi, err := erc20.IERC20MetaData.GetAbi()
if err != nil {
	log.Panic(err)
}

// Encode mint function from token contract
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

hash, err := w.SendTransaction(context.Background(), &accounts.Transaction{
	To:   &TokenAddress,
	Data: calldata,
	Meta: &zkTypes.Eip712Meta{
		PaymasterParams: paymasterParams,
	},
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Tx: ", hash)
```

### `WaitMined`

Waits for transaction to be mined on the L2. It stops waiting when the context is canceled.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `txHash`  | `common.Hash`     | Transaction hash. |

```go
WaitMined(ctx context.Context, txHash common.Hash) (*zkTypes.Receipt, error)
```

#### Example

```go
// Create wallet
w, err := accounts.NewWallet(common.Hex2Bytes(<private key>), &client, nil)
if err != nil {
	log.Panic(err)
}

tx, err := w.Transfer(accounts.TransferTransaction{
		To:     common.HexToAddress(<address>),
		Amount: big.NewInt(7_000_000_000),
		Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}

// Wait for transaction to be mined on L2 network
_, err = client.WaitMined(context.Background(), tx.Hash())
if err != nil {
	log.Panic(err)
}
```

### `WaitFinalized`

Waits for tx to be finalized on the L2. It stops waiting when the context is canceled.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `txHash`  | `common.Hash`     | Transaction hash. |

```go
WaitFinalized(ctx context.Context, txHash common.Hash) (*zkTypes.Receipt, error)
```

#### Example

```go
// Create wallet
w, err := accounts.NewWallet(common.Hex2Bytes(<private key>), &client, nil)
if err != nil {
	log.Panic(err)
}

tx, err := w.Transfer(accounts.TransferTransaction{
		To:     common.HexToAddress(<address>),
		Amount: big.NewInt(7_000_000_000),
		Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}

// Wait for transaction to be finalized on L2 network
_, err = client.WaitFinalized(context.Background(), tx.Hash())
if err != nil {
	log.Panic(err)
}
```

### `MainContractAddress`

Returns the address of the zkSync Era contract.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
MainContractAddress(ctx context.Context) (common.Address, error)
```

#### Example

```go
address, err := client.MainContractAddress(context.Background())
if err != nil {
	log.Panic()
}
fmt.Println("Main contract address: ", address)
```

### `TestnetPaymaster`

Returns the testnet paymaster address if available, or `nil`.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
TestnetPaymaster(ctx context.Context) (common.Address, error)
```

#### Example

```go
address, err := client.TestnetPaymaster(context.Background())
if err != nil {
	log.Panic()
}
fmt.Println("Testnet paymaster address: ", address)
```

### `BridgeContracts`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
BridgeContracts(ctx context.Context) (*zkTypes.BridgeContracts, error)
```

#### Example

```go
contracts, err := client.BridgeContracts(context.Background())
if err != nil {
  log.Panic(err)
}
fmt.Println("Bridge contracts: ", contracts)
```

### `ContractAccountInfo`

Returns the version of the supported account abstraction and nonce ordering from a given contract address.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `address` | `common.Address`  | Contract address. |

```go
ContractAccountInfo(ctx context.Context, address common.Address) (*zkTypes.ContractAccountInfo, error)
```

#### Example

```go
// Paymaster for Crown token on testnet
PaymasterAddress := common.HexToAddress("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
accountInfo, err := client.ContractAccountInfo(context.Background(), PaymasterAddress)
if err != nil {
	log.Panic()
}
fmt.Printf("Account info: %+v\n", accountInfo)
```

### `L1ChainID`

Returns the chain id of the underlying L1.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
L1ChainID(ctx context.Context) (*big.Int, error)
```

#### Example

```go
l1ChainID, err := client.L1ChainID(context.Background())
if err != nil {
	log.Panic()
}
fmt.Println("L1 chain ID: ", l1ChainID)
```

### `L1BatchNumber`

Returns the latest L1 batch number.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `ctx`     | `context.Context` | Context.    |

```go
L1BatchNumber(ctx context.Context) (*big.Int, error)
```

#### Example

```go
l1BatchNumber, err := client.L1BatchNumber(context.Background())
if err != nil {
	log.Panic()
}
fmt.Println("L1 chain ID: ", l1BatchNumber)
```

### `L1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

#### Inputs

| Parameter       | Type              | Description      |
| --------------- | ----------------- | ---------------- |
| `ctx`           | `context.Context` | Context.         |
| `l1BatchNumber` | `*big.Int`        | L1 batch number. |

```go
L1BatchBlockRange(ctx context.Context, l1BatchNumber *big.Int) (*BlockRange, error)
```

#### Example

```go
batchBlockRange, err := client.L1BatchBlockRange(context.Background(), big.NewInt(83277))
if err != nil {
	log.Panic(err)
}
fmt.Printf("Batch block range: %+v\n", *batchBlockRange)
```

### `L1BatchDetails`

Returns data pertaining to a given batch.

#### Inputs

| Parameter       | Type              | Description      |
| --------------- | ----------------- | ---------------- |
| `ctx`           | `context.Context` | Context.         |
| `l1BatchNumber` | `*big.Int`        | L1 batch number. |

```go
L1BatchDetails(ctx context.Context, l1BatchNumber *big.Int) (*zkTypes.BatchDetails, error)
```

#### Example

```go
batchDetails, err := client.L1BatchDetails(context.Background(), big.NewInt(83277))
if err != nil {
	log.Panic(err)
}
fmt.Printf("Batch details: %+v\n", *batchDetails)
```

### `BlockDetails`

Returns additional zkSync Era-specific information about the L2 block.

#### Inputs

| Parameter | Type              | Description      |
| --------- | ----------------- | ---------------- |
| `ctx`     | `context.Context` | Context.         |
| `block`   | `uint32`          | L2 block number. |

```go
BlockDetails(ctx context.Context, block uint32) (*zkTypes.BlockDetails, error)
```

#### Example

```go
blockDetails, err := client.BlockDetails(context.Background(), 90000)
if err != nil {
	log.Panic(err)
}
fmt.Printf("Block details: %+v\n", *blockDetails)
```

### `TransactionDetails`

Returns data from a specific transaction given by the transaction hash.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `txHash`  | `common.Hash`     | Transaction hash. |

```go
TransactionDetails(ctx context.Context, txHash common.Hash) (*zkTypes.TransactionDetails, error)
```

#### Example

```go
txHash := common.HexToHash("0x7765b9d5ace5798ab4c1cdd246bbf934cfbf17011dceba844adf207de5bc0a39")
txDetails, err := client.TransactionDetails(context.Background(), txHash)
if err != nil {
	log.Panic(err)
}
fmt.Printf("Transaction details: %+v\n", *txDetails)
```

### `LogProof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

#### Inputs

| Parameter  | Type              | Description                                                      |
| ---------- | ----------------- | ---------------------------------------------------------------- |
| `ctx`      | `context.Context` | Context.                                                         |
| `txHash`   | `common.Hash`     | Hash of the L2 transaction the L2 to L1 log was produced within. |
| `logIndex` | `int`             | The index of the L2 to L1 log in the transaction.                |

```go
LogProof(ctx context.Context, txHash common.Hash, logIndex int) (*zkTypes.MessageProof, error)
```

#### Example

```go
txHash := common.HexToHash("0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e")
logProof, err := client.LogProof(context.Background(), txHash, 0)
if err != nil {
	log.Panic(err)
}
fmt.Printf("Log proof: %+v\n", *logProof)
```

### `L2TransactionFromPriorityOp`

Returns transaction on L2 network from transaction receipt on L1 network.

#### Inputs

| Parameter     | Type              | Description             |
| ------------- | ----------------- | ----------------------- |
| `ctx`         | `context.Context` | Context.                |
| `l1TxReceipt` | `*types.Receipt`  | L1 transaction receipt. |

```go
L2TransactionFromPriorityOp(ctx context.Context, l1TxReceipt *types.Receipt) (*zkTypes.TransactionResponse, error)
```

#### Example

```go
// Connect to Ethereum network
ethClient, err := ethclient.Dial("https://rpc.ankr.com/eth_sepolia")
if err != nil {
	log.Panic(err)
}
defer ethClient.Close()

txHash := common.HexToHash("0xcca5411f3e514052f4a4ae1c2020badec6e0998adb52c09959c5f5ff15fba3a8")
l1Receipt, err := ethClient.TransactionReceipt(context.Background(), txHash)
if err != nil {
	log.Panic(err)
}

l2Tx, err := client.L2TransactionFromPriorityOp(context.Background(), l1Receipt)
if err != nil {
	log.Panic(err)
}
fmt.Printf("L2 transaction: %+v\n", l2Tx)
```

### `ConfirmedTokens`

Returns {address, symbol, name, and decimal} information of all tokens within a range of ids given by parameters from and limit.

#### Inputs

| Parameter | Type              | Description                                                                  |
| --------- | ----------------- | ---------------------------------------------------------------------------- |
| `ctx`     | `context.Context` | Context.                                                                     |
| `from`    | `uint32`          | The token id from which to start returning the information about the tokens. |
| `limit`   | `limit`           | The number of tokens to be returned from the API.                            |

```go
ConfirmedTokens(ctx context.Context, from uint32, limit uint8) ([]*zkTypes.Token, error)
```

#### Example

```go
// get first 255 tokens
tokens, err := client.ConfirmedTokens(context.Background(), 0, 255)
if err != nil {
	log.Panic(err)
}

for _, token := range tokens {
	fmt.Printf("%+v\n", *token)
}
```

### `L2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH address is set to zero address.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `address` | `common.Address`  | L1 token address. |

```go
L2TokenAddress(ctx context.Context, token common.Address) (common.Address, error)
```

#### Example

```go
l1DAI := common.HexToAddress("0x5C221E77624690fff6dd741493D735a17716c26B")
l2DAI, err := client.L2TokenAddress(context.Background(), l1DAI)
if err != nil {
	log.Panic(err)
}
fmt.Println("L2 DAI address: ", l2DAI)
```

### `L1TokenAddress`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH address is set to zero address.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `ctx`     | `context.Context` | Context.          |
| `address` | `common.Address`  | L2 token address. |

```go
L1TokenAddress(ctx context.Context, token common.Address) (common.Address, error)
```

#### Example

```go
l2DAI := common.HexToAddress("0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b")
l1DAI, err := client.L1TokenAddress(context.Background(), l2DAI)
if err != nil {
	log.Panic(err)
}
fmt.Println("L2 DAI address: ", l1DAI)
```

### `AllAccountBalances`

Returns all balances for confirmed tokens given by an account address.

#### Inputs

| Parameter | Type              | Description      |
| --------- | ----------------- | ---------------- |
| `ctx`     | `context.Context` | Context.         |
| `address` | `common.Address`  | Account address. |

```go
AllAccountBalances(ctx context.Context, address common.Address) (map[common.Address]*big.Int, error)
```

#### Example

```go
// Paymaster on testnet
paymaster := common.HexToAddress("0x8f0ea1312da29f17eabeb2f484fd3c112cccdd63")
balances, err := client.AllAccountBalances(context.Background(), paymaster)
if err != nil {
	log.Panic(err)
}
fmt.Printf("Balances: %+v\n", balances)
```

### `EstimateFee`

Returns the fee for the transaction.

#### Inputs

| Parameter | Type                                        | Description                                                      |
| --------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`     | `context.Context`                           | Context.                                                         |
| `msg`     | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |

```go
EstimateFee(ctx context.Context, tx zkTypes.CallMsg) (*zkTypes.Fee, error)
```

#### Example

```go
from := common.HexToAddress("<Sender address>")
to := common.HexToAddress("<Receipt address>")
fee, err := client.EstimateFee(context.Background(), zkTypes.CallMsg{
	CallMsg: ethereum.CallMsg{
		From:  from,
		To:    &to,
		Value: big.NewInt(7_000_000_000),
	},
})
if err != nil {
	log.Panic(err)
}
fmt.Printf("Fee: %+v\n", *fee)
```

### `EstimateGasL1`

Estimates the amount of gas required to submit a transaction from L1 to L2.

#### Inputs

| Parameter | Type                                        | Description                                                      |
| --------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`     | `context.Context`                           | Context.                                                         |
| `msg`     | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |

```go
EstimateGasL1(ctx context.Context, tx zkTypes.CallMsg) (uint64, error)
```

#### Example

```go
account := common.HexToAddress("<address>")
gas, err := client.EstimateGasL1(context.Background(), zkTypes.CallMsg{
	CallMsg: ethereum.CallMsg{
		From:  account,
		To:    &account,
		Value: big.NewInt(7_000_000_000),
	},
	Meta: &zkTypes.Eip712Meta{
		GasPerPubdata: utils.NewBig(utils.RequiredL1ToL2GasPerPubdataLimit.Int64()),
	},
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `EstimateGasTransfer`

Estimates the amount of gas required for a transfer transaction.

#### Inputs

| Parameter | Type                                                  | Description                            |
| --------- | ----------------------------------------------------- | -------------------------------------- |
| `ctx`     | `context.Context`                                     | Context.                               |
| `msg`     | [`TransferCallMsg`](types/clients.md#transfercallmsg) | Contains parameters for transfer call. |

```go
EstimateGasTransfer(ctx context.Context, msg TransferCallMsg) (uint64, error)
```

#### Example

```go
gas, err := client.EstimateGasTransfer(context.Background(), clients.TransferCallMsg{
	From: common.HexToAddress("<Sender address>"),
	To:   common.HexToAddress("<Receipt address>"),
	Amount: big.NewInt(7_000_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `EstimateGasWithdraw`

Estimates the amount of gas required for a withdrawal transaction.

#### Inputs

| Parameter | Type                                                      | Description                              |
| --------- | --------------------------------------------------------- | ---------------------------------------- |
| `ctx`     | `context.Context`                                         | Context.                                 |
| `msg`     | [`WithdrawalCallMsg`](types/clients.md#withdrawalcallmsg) | Contains parameters for withdrawal call. |

```go
EstimateGasWithdraw(ctx context.Context, msg WithdrawalCallMsg) (uint64, error)
```

#### Example

```go
gas, err := client.EstimateGasWithdraw(context.Background(), clients.WithdrawalCallMsg{
	From: common.HexToAddress("<Sender address>"),
	To:   common.HexToAddress("<Receipt address>"),
	Amount: big.NewInt(7_000_000_000),
	Token:  utils.EthAddress,
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `EstimateL1ToL2Execute`

Estimates the amount of gas required for an L1 to L2 execute operation.

#### Inputs

| Parameter | Type                                        | Description                                                      |
| --------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `ctx`     | `context.Context`                           | Context.                                                         |
| `msg`     | [`zkTypes.CallMsg`](types/types.md#callmsg) | Contains parameters for contract call using EIP-712 transaction. |

```go
EstimateL1ToL2Execute(ctx context.Context, msg zkTypes.CallMsg) (uint64, error)
```

#### Example

```go
account := common.HexToAddress("<address>")
gas, err := client.EstimateL1ToL2Execute(context.Background(), zkTypes.CallMsg{
	CallMsg: ethereum.CallMsg{
		From:  account,
		To:    &account,
		Value: big.NewInt(7_000_000_000),
	},
})
if err != nil {
	log.Panic(err)
}
fmt.Println("Gas: ", gas)
```

### `Proof`

Returns Merkle proofs for one or more storage values at the specified account along with a Merkle proof of their authenticity.

#### Inputs

| Parameter       | Type              | Description                                                                                     |
| --------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `ctx`           | `context.Context` | Context.                                                                                        |
| `address`       | `common.Address`  | The account to fetch storage values and proofs for.                                             |
| `keys`          | `common.Hahs`     | Vector of storage keys in the account.                                                          |
| `l1BatchNumber` | `*big.Int`        | Number of the L1 batch specifying the point in time at which the requested values are returned. |

```go
Proof(ctx context.Context, address common.Address, keys []common.Hash, l1BatchNumber *big.Int) (*zkTypes.StorageProof, error)
```

#### Example

```go
// Fetching the storage proof for rawNonces storage slot in NonceHolder system contract.
// mapping(uint256 => uint256) internal rawNonces;

baseClient, ok := client.(*clients.BaseClient)
if !ok {
  log.Panic("casting could not be performed")
}

address := common.HexToAddress("<address>")

// Ensure the address is a 256-bit number by padding it
// because rawNonces slot uses uint256 for mapping addresses and their nonces.
addressPadded := common.LeftPadBytes(address.Bytes(), 32)

// Convert the slot number to a hex string and pad it to 32 bytes
slotBytes := common.Hex2Bytes("0x00") // slot with index 0
slotPadded := common.LeftPadBytes(slotBytes, 32)

// Concatenate the padded address and slot number
concatenated := append(addressPadded, slotPadded...)
storageKey := crypto.Keccak256(concatenated)

l1BatchNumber, err := client.L1BatchNumber(context.Background())
if err != nil {
  log.Panic(err)
}

storageProof, err := baseClient.Proof(
		context.Background(),
		utils.NonceHolderAddress,
		[]common.Hash{common.BytesToHash(storageKey)},
		l1BatchNumber)
if err != nil {
	log.Panic(err)
}
```
