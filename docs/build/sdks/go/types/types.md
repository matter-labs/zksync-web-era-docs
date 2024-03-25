---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Types Package | zkSync Docs
---

# `types` Package

### `AccountAbstractionVersion`

Represents an enumeration of account abstraction versions.

```go
type AccountAbstractionVersion uint8

const (
	None AccountAbstractionVersion = iota
	Version1
)
```

### `AccountNonceOrdering`

Represents an enumeration of account nonce ordering formats.

```go
type AccountNonceOrdering uint8

const (
	Sequential AccountNonceOrdering = iota
	Arbitrary
)
```

### `ApprovalBasedPaymasterInput`

Contains approval-based paymaster input. It should be used if the user is required to set a certain allowance to a token for the paymaster
to operate.

```go
type ApprovalBasedPaymasterInput struct {
	Token common.Address // ERC20 token used to pay transaction fee.
	// Minimal allowance of Token towards the paymaster from the account that pays the fee with the token.
	MinimalAllowance *big.Int
	InnerInput       []byte // Additional payload that can be sent to the paymaster to implement any logic.
}
```

### `BatchDetails`

Contains batch information.

```go
type BatchDetails struct {
	BaseSystemContractsHashes struct {
		Bootloader common.Hash `json:"bootloader"`
		DefaultAa  common.Hash `json:"default_aa"`
	} `json:"baseSystemContractsHashes"`
	CommitTxHash   common.Hash `json:"commitTxHash"`
	CommittedAt    time.Time   `json:"committedAt"`
	ExecuteTxHash  common.Hash `json:"executeTxHash"`
	ExecutedAt     time.Time   `json:"executedAt"`
	L1GasPrice     uint64      `json:"l1GasPrice"`
	L1TxCount      uint        `json:"l1TxCount"`
	L2FairGasPrice uint        `json:"l2FairGasPrice"`
	L2TxCount      uint        `json:"l2TxCount"`
	Number         uint        `json:"number"`
	ProveTxHash    common.Hash `json:"proveTxHash"`
	ProvenAt       time.Time   `json:"provenAt"`
	RootHash       common.Hash `json:"rootHash"`
	Status         string      `json:"status"`
	Timestamp      uint        `json:"timestamp"`
}
```

### `Block`

Extends the [`types.Block`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/core/types#Block) definition with
additional `L1BatchNumber`, `L1BatchTimestamp` fields.

```go
type Block struct {
	Header           *types.Header
	Uncles           []*types.Header
	Transactions     []*TransactionResponse
	Withdrawals      types.Withdrawals
	Hash             common.Hash
	Size             *big.Int
	TotalDifficulty  *big.Int
	SealFields       []interface{}
	ReceivedAt       time.Time
	ReceivedFrom     interface{}
	L1BatchNumber    *big.Int
	L1BatchTimestamp *big.Int
}
```

### `BlockDetails`

Contains block information.

```go
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
```

### `BridgeContracts`

Represents the addresses of default bridge contracts for both L1 and L2.

```go
type BridgeContracts struct {
	L1Erc20DefaultBridge common.Address `json:"l1Erc20DefaultBridge"` // Default L1Bridge contract address.
	L2Erc20DefaultBridge common.Address `json:"l2Erc20DefaultBridge"` // Default L2Bridge contract address.
}
```

### `CallMsg`

Contains parameters for contract call using EIP-712 transaction. Extends [`ethereum.CallMsg`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0#CallMsg)
with additional [`Eip712Meta`](#eip712meta) field.

```go
type CallMsg struct {
	ethereum.CallMsg
	Meta *Eip712Meta // EIP-712 metadata.
}
```

### `Eip712Meta`

Contains EIP-712 transaction metadata.

```go
type Eip712Meta struct {
	// GasPerPubdata denotes the maximum amount of gas the user is willing
	// to pay for a single byte of pubdata.
	GasPerPubdata *hexutil.Big `json:"gasPerPubdata,omitempty"`
	// CustomSignature is used for the cases in which the signer's account
	// is not an EOA.
	CustomSignature hexutil.Bytes `json:"customSignature,omitempty"`
	// FactoryDeps is a non-empty array of bytes. For deployment transactions,
	// it should contain the bytecode of the contract being deployed.
	// If the contract is a factory contract, i.e. it can deploy other contracts,
	// the array should also contain the bytecodes of the contracts which it can deploy.
	FactoryDeps []hexutil.Bytes `json:"factoryDeps"`
	// PaymasterParams contains parameters for configuring the custom paymaster
	// for the transaction.
	PaymasterParams *PaymasterParams `json:"paymasterParams,omitempty"`
}
```

### `Fee`

Represents the transaction fee parameters.

```go
type Fee struct {
	GasLimit *hexutil.Big `json:"gas_limit"` // Maximum amount of gas allowed for the transaction.
	// Maximum amount of gas the user is willing to pay for a single byte of pubdata.
	GasPerPubdataLimit   *hexutil.Big `json:"gas_per_pubdata_limit"`
	MaxFeePerGas         *hexutil.Big `json:"max_fee_per_gas"`          // EIP-1559 fee cap per gas.
	MaxPriorityFeePerGas *hexutil.Big `json:"max_priority_fee_per_gas"` // EIP-1559 tip per gas.
}
```

### `GeneralPaymasterInput`

Contains general paymaster input. It should be used if no prior actions are required from the user for the paymaster to operate.

```go
type GeneralPaymasterInput []byte
```

### `L1BridgeContracts`

Represents the L1 bridge contracts.

```go
type L1BridgeContracts struct {
	Erc20 *l1bridge.IL1Bridge // Default L1Bridge contract.
}
```

### `L2BridgeContracts`

Represents the L2 bridge contracts.

```go
type L2BridgeContracts struct {
	Erc20 *l2bridge.IL2Bridge // Default L2Bridge contract.
}
```

### `L2ToL1Log`

Represents a layer 2 to layer 1 transaction log.

```go
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
```

### `Log`

Extends the [`types.Log`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/core/types#Log) definition with additional
`L1BatchNumber` field.

```go
// Log represents a log entry.
type Log struct {
	types.Log
	L1BatchNumber *hexutil.Big `json:"l1BatchNumber"`
}
```

### `MessageProof`

Represents a message proof.

```go
type MessageProof struct {
	Id    int           `json:"id"`
	Proof []common.Hash `json:"proof"`
	Root  common.Hash   `json:"root"`
}
```

### `Receipt`

Extends the [`types.Receipt`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/core/types#Receipts) definition with additional
`From`, `To`, `EffectiveGasPrice`, `L1BatchNumber`, `L1BatchTxIndex`, `Logs`, `L2ToL1Logs` fields.

```go
type Receipt struct {
	types.Receipt

	From              common.Address `json:"from"`
	To                common.Address `json:"to"`
	EffectiveGasPrice *hexutil.Big   `json:"effectiveGasPrice"`
	L1BatchNumber     *hexutil.Big   `json:"l1BatchNumber"`
	L1BatchTxIndex    *hexutil.Big   `json:"l1BatchTxIndex"`
	Logs              []*Log         `json:"logs"`
	L2ToL1Logs        []*L2ToL1Log   `json:"l2ToL1Logs"`
}
```

### `StandardConfiguration`

Represents the standard-json configuration generated as output of zksolc compiler.

```go
type StandardConfiguration struct {
	Format       string `json:"_format"`
	ContractName string `json:"contractName"`
	SourceName   string `json:"sourceName"`
	Abi          []struct {
		Inputs []struct {
			InternalType string `json:"internalType"`
			Name         string `json:"name"`
			Type         string `json:"type"`
			Indexed      bool   `json:"indexed,omitempty"`
		} `json:"inputs"`
		StateMutability string `json:"stateMutability,omitempty"`
		Type            string `json:"type"`
		Anonymous       bool   `json:"anonymous,omitempty"`
		Name            string `json:"name,omitempty"`
		Outputs         []struct {
			InternalType string `json:"internalType"`
			Name         string `json:"name"`
			Type         string `json:"type"`
		} `json:"outputs,omitempty"`
	} `json:"abi"`
	Bytecode         string `json:"bytecode"`
	DeployedBytecode string `json:"deployedBytecode"`
	LinkReferences   struct {
	} `json:"linkReferences"`
	DeployedLinkReferences struct {
	} `json:"deployedLinkReferences"`
	FactoryDeps struct {
	} `json:"factoryDeps"`
}
```

### `StorageProof`

Merkle proofs for one or more storage values at the specified account

```go

type StorageProof struct {
	Address string `json:"address"`
	Proofs  []struct {
		Key   string   `json:"key"`
		Proof []string `json:"proof"`
		Value string   `json:"value"`
		Index int      `json:"index"`
	} `json:"storageProof"`
}
```

### `PaymasterParams`

Contains parameters for configuring the custom paymaster for the transaction.

```go
type PaymasterParams struct {
	Paymaster      common.Address `json:"paymaster"`      // address of the paymaster
	PaymasterInput []byte         `json:"paymasterInput"` // encoded input
}
```

### `Token`

Represents a token with addresses on both L1 and L2 chains.

```go
type Token struct {
	L1Address common.Address `json:"l1Address"` // Token address on L1.
	L2Address common.Address `json:"l2Address"` // Token address on L2.
	Name      string         `json:"name"`      // Token name.
	Symbol    string         `json:"symbol"`    // Token symbol.
	Decimals  uint           `json:"decimals"`  // Number of decimals for the token.
}
```

### `EIP712TxType`

Represents an EIP-712 transaction type.

```go
const EIP712TxType = `0x71`
```

### `Transaction712`

Represents an EIP-712 compliant transaction. It shares similarities with regular transactions but also includes zkSync Era-specific features
such as account abstraction and paymasters. Smart contracts must be deployed with support for the EIP-712 transaction type.

```go
type Transaction712 struct {
	Nonce      *big.Int         // Nonce to use for the transaction execution.
	GasTipCap  *big.Int         // EIP-1559 tip per gas.
	GasFeeCap  *big.Int         // EIP-1559 fee cap per gas.
	Gas        *big.Int         // Gas limit to set for the transaction execution.
	To         *common.Address  // The address of the recipient.
	Value      *big.Int         // Funds to transfer along the transaction (nil = 0 = no funds).
	Data       hexutil.Bytes    // Input data, usually an ABI-encoded contract method invocation.
	AccessList types.AccessList // EIP-2930 access list.

	ChainID *big.Int        // Chain ID of the network.
	From    *common.Address // The address of the sender.
	Meta    *Eip712Meta     // EIP-712 metadata.
}
```

### `TransactionDetails`

Contains transaction details.

```go
type TransactionDetails struct {
	EthCommitTxHash  common.Hash    `json:"ethCommitTxHash"`
	EthExecuteTxHash common.Hash    `json:"ethExecuteTxHash"`
	EthProveTxHash   common.Hash    `json:"ethProveTxHash"`
	Fee              hexutil.Big    `json:"fee"`
	InitiatorAddress common.Address `json:"initiatorAddress"`
	IsL1Originated   bool           `json:"isL1Originated"`
	ReceivedAt       time.Time      `json:"receivedAt"`
	Status           string         `json:"status"`
}
```

### `TransactionResponse`

Includes all properties of a transaction as well as several properties that are useful once it has been mined.

```go
type TransactionResponse struct {
	BlockHash            *common.Hash   `json:"blockHash"`
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
	V                    *hexutil.Big   `json:"v"`
	R                    *hexutil.Big   `json:"r"`
	S                    *hexutil.Big   `json:"s"`
	To                   common.Address `json:"to"`
	TransactionIndex     hexutil.Uint   `json:"transactionIndex"`
	Type                 hexutil.Uint64 `json:"type"`
	Value                hexutil.Big    `json:"value"`
}
```
