# Providers

Providers (clients) are objects that wrap interactions with the zkSync Era node. If you are new to the concept of providers, 
check out the [go-ethereum documentation](https://geth.ethereum.org/docs/developers/dapp-developer/native).

zkSync Era fully supports Ethereum Web3 API, so you can use the provider objects from `geth`. However, the zkSync Era JSON-RPC API provides some additional methods, which allow:

- Easy tracking of L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use cases may require tracking "finalized" transactions only.

`DefaultProvider` implements the zkSync Era Web3 JSON-RPC API and provides interaction with a zkSync Era node. 

## DefaultProvider

Init:
```go
func NewDefaultProvider(rawUrl string) (*DefaultProvider, error)
```

```go
ZkSyncProvider   := "https://testnet.era.zksync.dev"

// Connect to zkSync network
zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
if err != nil {
	log.Panic(err)
}
defer zp.Close()
```

Interface that provides interaction with zkSync node:
```go
type Provider interface {
	GetClient() *ethclient.Client
	GetBalance(address common.Address, blockNumber BlockNumber) (*big.Int, error)
	GetBlockByNumber(blockNumber BlockNumber) (*Block, error)
	GetBlockByHash(blockHash common.Hash) (*Block, error)
	GetTransactionCount(address common.Address, blockNumber BlockNumber) (*big.Int, error)
	GetTransactionReceipt(txHash common.Hash) (*TransactionReceipt, error)
	GetTransaction(txHash common.Hash) (*TransactionResponse, error)
	WaitMined(ctx context.Context, txHash common.Hash) (*TransactionReceipt, error)
	WaitFinalized(ctx context.Context, txHash common.Hash) (*TransactionReceipt, error)
	EstimateGas(tx *Transaction) (*big.Int, error)
	GetGasPrice() (*big.Int, error)
	SendRawTransaction(tx []byte) (common.Hash, error)
	ZksGetMainContract() (common.Address, error)
	ZksL1ChainId() (*big.Int, error)
	ZksL1BatchNumber() (*big.Int, error)
	ZksGetConfirmedTokens(from uint32, limit uint8) ([]*Token, error)
	ZksIsTokenLiquid(address common.Address) (bool, error)
	ZksGetTokenPrice(address common.Address) (*big.Float, error)
	ZksGetL2ToL1LogProof(txHash common.Hash, logIndex int) (*L2ToL1MessageProof, error)
	ZksGetL2ToL1MsgProof(block uint32, sender common.Address, msg common.Hash) (*L2ToL1MessageProof, error)
	ZksGetAllAccountBalances(address common.Address) (map[common.Address]*big.Int, error)
	ZksGetBridgeContracts() (*BridgeContracts, error)
	ZksEstimateFee(tx *Transaction) (*Fee, error)
	ZksGetTestnetPaymaster() (common.Address, error)
	ZksGetBlockDetails(block uint32) (*BlockDetails, error)
	GetLogs(q FilterQuery) ([]Log, error)
}
```

