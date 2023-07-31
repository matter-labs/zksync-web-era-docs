# Types

All the types which are used in the SDK are referenced
[in the source code](https://github.com/zksync-sdk/zksync2-go/tree/main/types):

```go

var (
	EthAddress              = common.HexToAddress("0x0000000000000000000000000000000000000000")
	BootloaderFormalAddress = common.HexToAddress("0x0000000000000000000000000000000000008001")
	ContractDeployerAddress = common.HexToAddress("0x0000000000000000000000000000000000008006")
	MessengerAddress        = common.HexToAddress("0x0000000000000000000000000000000000008008")
	L2EthTokenAddress       = common.HexToAddress("0x000000000000000000000000000000000000800a")
	L1ToL2AliasOffset       = common.HexToAddress("0x1111000000000000000000000000000000001111")
)

const (
	ZkSyncChainIdMainnet   int64 = 280
	ZkSyncChainIdLocalhost int64 = 270

	PriorityQueueTypeDeque      uint8 = 0
	PriorityQueueTypeHeapBuffer uint8 = 1
	PriorityQueueTypeHeap       uint8 = 2
)

type BridgeContracts struct {
	L1Erc20DefaultBridge common.Address `json:"l1Erc20DefaultBridge"`
	L2Erc20DefaultBridge common.Address `json:"l2Erc20DefaultBridge"`
}

type Token struct {
	L1Address common.Address `json:"l1Address"`
	L2Address common.Address `json:"l2Address"`
	Name      string         `json:"name"`
	Symbol    string         `json:"symbol"`
	Decimals  uint           `json:"decimals"`
}

func CreateETH() *Token {
	return &Token{
		L1Address: common.Address{},
		L2Address: common.Address{},
		Name:      `ETH`,
		Symbol:    `ETH`,
		Decimals:  18,
	}
}

type L2ToL1MessageProof struct {
	Id    int           `json:"id"`
	Proof []common.Hash `json:"proof"`
	Root  common.Hash   `json:"root"`
}

type Fee struct {
	GasLimit             *hexutil.Big `json:"gas_limit"`
	GasPerPubdataLimit   *hexutil.Big `json:"gas_per_pubdata_limit"`
	MaxFeePerGas         *hexutil.Big `json:"max_fee_per_gas"`
	MaxPriorityFeePerGas *hexutil.Big `json:"max_priority_fee_per_gas"`
}

type BlockNumber string // Enums or hex value

var (
	BlockNumberEarliest  BlockNumber = "earliest"
	BlockNumberLatest    BlockNumber = "latest"
	BlockNumberPending   BlockNumber = "pending"
	BlockNumberCommitted BlockNumber = "committed"
	BlockNumberFinalized BlockNumber = "finalized"
)

type BlockDetails struct {
	CommitTxHash  common.Hash `json:"commitTxHash"`
	CommittedAt   time.Time   `json:"committedAt"`
	ExecuteTxHash common.Hash `json:"executeTxHash"`
	ExecutedAt    time.Time   `json:"executedAt"`
	L1TxCount     uint        `json:"l1TxCount"`
	L2TxCount     uint        `json:"l2TxCount"`
	Number        uint        `json:"number"`
	ProveTxHash   common.Hash `json:"proveTxHash"`
	ProvenAt      time.Time   `json:"provenAt"`
	RootHash      common.Hash `json:"rootHash"`
	Status        string      `json:"status"`
	Timestamp     uint        `json:"timestamp"`
}

type Block struct {
	types.Block
	L1BatchNumber    *hexutil.Big `json:"l1BatchNumber"`
	L1BatchTimestamp *hexutil.Big `json:"l1BatchTimestamp"`
}

type Log struct {
	types.Log
	L1BatchNumber *hexutil.Big `json:"l1BatchNumber"`
}

type L2ToL1Log struct {
	BlockNumber      *hexutil.Big   `json:"blockNumber"`
	BlockHash        common.Hash    `json:"blockHash"`
	L1BatchNumber    *hexutil.Big   `json:"l1BatchNumber"`
	TransactionIndex *hexutil.Uint  `json:"transactionIndex"`
	ShardId          *hexutil.Uint  `json:"shardId"`
	IsService        bool           `json:"isService"`
	Sender           common.Address `json:"sender"`
	Key              string         `json:"key"`
	Value            string         `json:"value"`
	TxHash           common.Hash    `json:"transactionHash"`
	Index            *hexutil.Uint  `json:"logIndex"`
}

type TransactionReceipt struct {
	types.Receipt
	// extend
	From              common.Address `json:"from"`
	To                common.Address `json:"to"`
	EffectiveGasPrice *hexutil.Big   `json:"effectiveGasPrice"`
	L1BatchNumber     *hexutil.Big   `json:"l1BatchNumber"`
	L1BatchTxIndex    *hexutil.Big   `json:"l1BatchTxIndex"`
	Logs              []*Log         `json:"logs"`
	L2ToL1Logs        []*L2ToL1Log   `json:"l2ToL1Logs"`
}

type TransactionResponse struct {
	BlockHash            common.Hash    `json:"blockHash"`
	BlockNumber          *hexutil.Big   `json:"blockNumber"`
	ChainID              hexutil.Big    `json:"chainId"`
	From                 common.Address `json:"from"`
	Gas                  hexutil.Uint64 `json:"gas"`
	GasPrice             hexutil.Big    `json:"gasPrice"`
	Hash                 common.Hash    `json:"hash"`
	Data                 hexutil.Bytes  `json:"input"`
	L1BatchNumber        hexutil.Big    `json:"l1BatchNumber"`
	L1BatchTxIndex       hexutil.Big    `json:"l1BatchTxIndex"`
	MaxFeePerGas         hexutil.Big    `json:"maxFeePerGas"`
	MaxPriorityFeePerGas hexutil.Big    `json:"maxPriorityFeePerGas"`
	Nonce                hexutil.Uint64 `json:"nonce"`
	To                   common.Address `json:"to"`
	TransactionIndex     hexutil.Uint   `json:"transactionIndex"`
	TxType               hexutil.Uint64 `json:"type"`
	Value                hexutil.Big    `json:"value"`
	V                    hexutil.Big    `json:"v"`
	R                    hexutil.Big    `json:"r"`
	S                    hexutil.Big    `json:"s"`
}

func NewBigZero() *hexutil.Big {
	return (*hexutil.Big)(new(big.Int))
}

func NewBig(n int64) *hexutil.Big {
	return (*hexutil.Big)(big.NewInt(n))
}

type FilterQuery struct {
	BlockHash *common.Hash
	FromBlock *BlockNumber
	ToBlock   *BlockNumber
	Addresses []common.Address
	Topics    [][]common.Hash
}
```
