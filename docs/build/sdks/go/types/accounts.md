---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Accounts Package | zkSync Docs
---

# `accounts` Package

### `CallOpts`

Is the collection of options to fine tune a contract call request from an account associated with `AdapterL1`, `AdapterL2`, `Deployer` or
`Adapter`. Its primary purpose is to be transformed into `bind.CallOpts`, wherein the `From` field represents the associated account.

```go
type CallOpts struct {
	Pending     bool            // Whether to operate on the pending state or the last known one
	BlockNumber *big.Int        // Optional the block number on which the call should be performed
	Context     context.Context // Network context to support cancellation and timeouts (nil = no timeout)
}
```

### `FullDepositFee`

Represents the total ETH fee required for performing the deposit on both L1 and L2 networks.

```go
type FullDepositFee struct {
	MaxFeePerGas, // MaxFeePerGas of the L1 transaction if 1559 transaction is used.
	MaxPriorityFeePerGas, // MaxPriorityFeePerGas of the L1 transaction if 1559 transaction is used.
	GasPrice, // Gas price of the L1 transaction if legacy transaction is used.
	BaseCost, // Base cost of the L2 transaction.
	L1GasLimit, // Gas limit of the L1 transaction.
	L2GasLimit *big.Int // Gas limit of the L2 transaction.
}
```

### `CallMsg`

Contains parameters for contract call from an account associated with `AdapterL1`, `AdapterL2`, `Deployer` or`Adapter`. Its primary purpose
is to be transformed into [`types.CallMsg`](#callmsg), wherein the `From` field represents the associated account.

```go
type CallMsg struct {
	To         *common.Address     // The address of the recipient.
	Gas        uint64              // If 0, the call executes with near-infinite gas.
	GasPrice   *big.Int            // Wei <-> gas exchange ratio.
	GasFeeCap  *big.Int            // EIP-1559 fee cap per gas.
	GasTipCap  *big.Int            // EIP-1559 tip per gas.
	Value      *big.Int            // Amount of wei sent along with the call.
	Data       []byte              // Input data, usually an ABI-encoded contract method invocation
	AccessList types.AccessList    // EIP-2930 access list.
	Meta       *zkTypes.Eip712Meta // EIP-712 metadata.
}

func (m *CallMsg) ToCallMsg(from common.Address) zkTypes.CallMsg
```

### `WithdrawalCallMsg`

Contains the common data required to execute a withdrawal call on L1 from L2. This execution is initiated by the account
associated with `AdapterL2`

```go
type WithdrawalCallMsg struct {
	To            common.Address  // The address of the recipient on L1.
	Amount        *big.Int        // The amount of the token to transfer.
	Token         common.Address  // The address of the token. ETH by default.
	BridgeAddress *common.Address // The address of the bridge contract to be used.

	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *WithdrawalCallMsg) ToWithdrawalCallMsg(from common.Address) clients.WithdrawalCallMsg
```

### `TransferCallMsg`

Contains the common data required to execute a transfer call on L2. This execution is initiated by the account associated with `AdapterL2`.

```go
type TransferCallMsg struct {
	To     common.Address // The address of the recipient.
	Amount *big.Int       // The amount of the token to transfer.
	Token  common.Address // The address of the token. ETH by default.

	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *TransferCallMsg) ToTransferCallMsg(from common.Address) clients.TransferCallMsg
```

### `DepositCallMsg`

Contains the common data required to execute a deposit call on L2 from L1. This execution is initiated by the account
associated with `AdapterL2`.

```go
type DepositCallMsg struct {
	To     common.Address // The address that will receive the deposited tokens on L2.
	Token  common.Address // The address of the token to deposit.
	Amount *big.Int       // The amount of the token to be deposited.

	// If the ETH value passed with the transaction is not explicitly stated Value,
	// this field will be equal to the tip the operator will receive on top of the base cost
	// of the transaction.
	OperatorTip *big.Int

	// The address of the bridge contract to be used. Defaults to the default zkSync bridge
	// (either L1EthBridge or L1Erc20Bridge).
	BridgeAddress *common.Address

	L2GasLimit *big.Int // Maximum amount of L2 gas that transaction can consume during execution on L2.

	// The maximum amount L2 gas that the operator may charge the user for single byte of pubdata.
	GasPerPubdataByte *big.Int

	// The address on L2 that will receive the refund for the transaction.
	// If the transaction fails, it will also be the address to receive L2Value.
	RefundRecipient common.Address

	CustomBridgeData []byte // Additional data that can be sent to a bridge.

	Value     *big.Int // The amount of wei sent along with the call.
	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *DepositCallMsg) ToDepositTransaction() DepositTransaction
func (m *DepositCallMsg) ToRequestExecuteCallMsg() RequestExecuteCallMsg
func (m *DepositCallMsg) ToCallMsg(from, l1Bridge common.Address) (ethereum.CallMsg, error)
func (m *DepositCallMsg) ToTransactOpts() *TransactOpts
```

### `RequestExecuteCallMsg`

Contains the common data required to execute a call for a request execution of an L2 transaction from L1. This execution is initiated by the
account associated with `AdapterL1`.

```go
type RequestExecuteCallMsg struct {
	ContractAddress common.Address // The L2 receiver address.
	Calldata        []byte         // The input of the L2 transaction.
	L2GasLimit      *big.Int       // Maximum amount of L2 gas that transaction can consume during execution on L2.
	L2Value         *big.Int       // `msg.value` of L2 transaction.
	FactoryDeps     [][]byte       // An array of L2 bytecodes that will be marked as known on L2.

	// If the ETH value passed with the transaction is not explicitly stated Value,
	// this field will be equal to the tip the operator will receive on top of the base cost
	// of the transaction.
	OperatorTip *big.Int

	// The maximum amount L2 gas that the operator may charge the user for single byte of pubdata.
	GasPerPubdataByte *big.Int

	// The address on L2 that will receive the refund for the transaction.
	// If the transaction fails, it will also be the address to receive L2Value.
	RefundRecipient common.Address

	Value     *big.Int // The amount of wei sent along with the call.
	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *RequestExecuteCallMsg) ToRequestExecuteTransaction() RequestExecuteTransaction
func (m *RequestExecuteCallMsg) ToCallMsg(from common.Address) (ethereum.CallMsg, error)
func (m *RequestExecuteCallMsg) ToTransactOpts() TransactOpts
```

### `TransactOpts`

Contains common data required to create a valid transaction on both L1 and L2 using the account
associated with `AdapterL1`, `AdapterL2` or `Deployer`. Its primary purpose is to be transformed into
[`bind.TransactOpts`](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.12.0/accounts/abi/bind#TransactOpts),
wherein the `From` and `Signer` fields are linked to the associated account.

```go
type TransactOpts struct {
	Nonce     *big.Int        // Nonce to use for the transaction execution (nil = use pending state).
	Value     *big.Int        // Funds to transfer along the transaction (nil = 0 = no funds).
	GasPrice  *big.Int        // Gas price to use for the transaction execution (nil = gas price oracle).
	GasFeeCap *big.Int        // Gas fee cap to use for the 1559 transaction execution (nil = gas price oracle).
	GasTipCap *big.Int        // Gas priority fee cap to use for the 1559 transaction execution (nil = gas price oracle).
	GasLimit  uint64          // Gas limit to set for the transaction execution (0 = estimate).
	Context   context.Context // Network context to support cancellation and timeouts (nil = no timeout).
}

func (t *TransactOpts) ToTransactOpts(from common.Address, signer bind.SignerFn) *bind.TransactOpts
```

### `Transaction`

Transaction is similar to [`types.Transaction712`](types.md#transaction712) but does not include the From field. This design is intended for use
abstraction which already have an associated account with `AdapterL2`. The From field is bound to the specific account,
and thus, it is not included in this type.

```go
type Transaction struct {
	To        *common.Address // The address of the recipient.
	Data      hexutil.Bytes   // Input data, usually an ABI-encoded contract method invocation.
	Value     *big.Int        // Funds to transfer along the transaction (nil = 0 = no funds).
	Nonce     *big.Int        // Nonce to use for the transaction execution.
	GasTipCap *big.Int        // EIP-1559 tip per gas.
	GasFeeCap *big.Int        // EIP-1559 fee cap per gas.
	Gas       uint64          // Gas limit to set for the transaction execution.

	AccessList types.AccessList // EIP-2930 access list.

	ChainID *big.Int            // Chain ID of the network.
	Meta    *zkTypes.Eip712Meta // EIP-712 metadata.
}

func (t *Transaction) ToTransaction712(from common.Address) *zkTypes.Transaction712
func (t *Transaction) ToCallMsg(from common.Address) zkTypes.CallMsg
```

### `TransferTransaction`

Represents a transfer transaction on L2 initiated by the account associated with `AdapterL2`.

```go
type TransferTransaction struct {
	To     common.Address // The address of the recipient.
	Amount *big.Int       // The amount of the token to transfer.
	Token  common.Address // The address of the token. ETH by default.
}

func (t *TransferTransaction) ToTransaction(opts *TransactOpts) *Transaction
func (t *TransferTransaction) ToTransferCallMsg(from common.Address, opts *TransactOpts) clients.TransferCallMsg
```

### `WithdrawalTransaction`

Represents a withdrawal transaction on L1 from L2 initiated by the account associated with `AdapterL2`.

```go
type WithdrawalTransaction struct {
	To     common.Address // The address that will receive the withdrawn tokens on L1.
	Token  common.Address // The address of the token to withdraw.
	Amount *big.Int       // The amount of the token to withdraw.

	// The address of the bridge contract to be used. Defaults to the default zkSync bridge
	// (either L2EthBridge or L2Erc20Bridge).
	BridgeAddress *common.Address
}

func (t *WithdrawalTransaction) ToWithdrawalCallMsg(from common.Address, opts *TransactOpts) *clients.WithdrawalCallMsg
```

### `RequestExecuteTransaction`

Represents a request execution of L2 transaction from L1 initiated by the account associated with `AdapterL1`.

```go
type RequestExecuteTransaction struct {
	ContractAddress common.Address // The L2 receiver address.
	Calldata        []byte         // The input of the L2 transaction.
	L2GasLimit      *big.Int       // Maximum amount of L2 gas that transaction can consume during execution on L2.
	L2Value         *big.Int       // `msg.value` of L2 transaction.
	FactoryDeps     [][]byte       // An array of L2 bytecodes that will be marked as known on L2.

	// If the ETH value passed with the transaction is not explicitly stated Auth.Value,
	// this field will be equal to the tip the operator will receive on top of the base cost
	// of the transaction.
	OperatorTip *big.Int

	// The maximum amount L2 gas that the operator may charge the user for single byte of pubdata.
	GasPerPubdataByte *big.Int

	// The address on L2 that will receive the refund for the transaction.
	// If the transaction fails, it will also be the address to receive L2Value.
	RefundRecipient common.Address
}

func (t *RequestExecuteTransaction) ToRequestExecuteCallMsg(opts *TransactOpts) RequestExecuteCallMsg
func (t *RequestExecuteTransaction) ToCallMsg(from common.Address, opts *TransactOpts) zkTypes.CallMsg
```

### `DepositTransaction`

Represents a deposit transaction on L2 from L1 initiated by the account associated with `AdapterL1`.

```go
type DepositTransaction struct {
	To     common.Address // The address of the token to deposit.
	Token  common.Address // The address of the token to deposit.
	Amount *big.Int       // The amount of the token to be deposited.

	// If the ETH value passed with the transaction is not explicitly stated Auth.Value,
	// this field will be equal to the tip the operator will receive on top of the base cost
	// of the transaction.
	OperatorTip *big.Int

	// The address of the bridge contract to be used. Defaults to the default zkSync bridge
	// (either L1EthBridge or L1Erc20Bridge).
	BridgeAddress *common.Address

	// Whether should the token approval be performed under the hood. Set this flag to true if you
	// bridge an ERC20 token and didn't call the approveERC20 function beforehand.
	ApproveERC20 bool

	L2GasLimit *big.Int // Maximum amount of L2 gas that transaction can consume during execution on L2.

	// The maximum amount L2 gas that the operator may charge the user for single byte of pubdata.
	GasPerPubdataByte *big.Int

	// The address on L2 that will receive the refund for the transaction.
	// If the transaction fails, it will also be the address to receive L2Value.
	RefundRecipient common.Address

	CustomBridgeData []byte        // Additional data that can be sent to a bridge.
	ApproveAuth      *TransactOpts // Authorization data for the approval token transaction.
}

func (t *DepositTransaction) ToRequestExecuteTransaction() *RequestExecuteTransaction
func (t *DepositTransaction) ToDepositCallMsg(opts *TransactOpts) DepositCallMsg
```

### `DeploymentType`

Represents an enumeration of deployment types.

```go
type DeploymentType string

const (
	DeployContract DeploymentType = "CONTRACT"
	DeployAccount  DeploymentType = "ACCOUNT"
)
```

### `CreateTransaction`

Represents the parameters for deploying a contract or account using the CREATE opcode.
This transaction is initiated by the account associated with `Deployer`.

```go
type CreateTransaction struct {
	Bytecode     []byte        // The bytecode of smart contract or smart account.
	Calldata     []byte        // The constructor calldata.
	Dependencies [][]byte      // The bytecode of dependent smart contracts or smart accounts.
	Auth         *TransactOpts // Authorization data.
}

func (t *CreateTransaction) ToTransaction(deploymentType DeploymentType) (*Transaction, error)
```

### `Create2Transaction`

Represents the parameters for deploying a contract or account using the CREATE2 opcode.
This transaction is initiated by the account associated with `Deployer`.

```go
type Create2Transaction struct {
	Bytecode     []byte        // The bytecode of smart contract or smart account.
	Calldata     []byte        // The constructor calldata.
	Salt         []byte        // The create2 salt.
	Dependencies [][]byte      // The bytecode of dependent smart contracts or smart accounts.
	Auth         *TransactOpts // Authorization data.
}

func (t *Create2Transaction) ToTransaction(deploymentType DeploymentType) (*Transaction, error)
```
