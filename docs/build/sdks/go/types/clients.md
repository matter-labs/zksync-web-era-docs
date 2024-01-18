---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Clients Package | zkSync Docs
---

# `clients` Package

### `BlockRange`

Represents a range of blocks with the starting and ending block numbers.

```go
type BlockRange struct {
	Beginning *big.Int `json:"beginning"` // Starting block number of the range.
	End       *big.Int `json:"end"`       // Ending block number of the range.
}
```

### `WithdrawalCallMsg`

Contains parameters for withdrawal call. It can be transformed into an `ethereum.CallMsg` by encoding the withdrawal parameters with
`ToCallMsg` method.

```go
type WithdrawalCallMsg struct {
	To            common.Address  // The address of the recipient on L1.
	Amount        *big.Int        // The amount of the token to transfer.
	Token         common.Address  // The address of the token. ETH by default.
	BridgeAddress *common.Address // The address of the bridge contract to be used.
	From          common.Address  // The address of the sender.

	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *WithdrawalCallMsg) ToCallMsg(defaultL2Bridge *common.Address) (*ethereum.CallMsg, error)
```

### `TransferCallMsg`

Contains parameters for transfer call. It can be transformed into `ethereum.CallMsg` by encoding the transfer parameters with `ToCallMsg`
method.

```go
type TransferCallMsg struct {
	To     common.Address // The address of the recipient.
	Amount *big.Int       // The amount of the token to transfer.
	Token  common.Address // The address of the token. ETH by default.
	From   common.Address // The address of the sender.

	Gas       uint64   // If 0, the call executes with near-infinite gas.
	GasPrice  *big.Int // Wei <-> gas exchange ratio.
	GasFeeCap *big.Int // EIP-1559 fee cap per gas.
	GasTipCap *big.Int // EIP-1559 tip per gas.

	AccessList types.AccessList // EIP-2930 access list.
}

func (m *TransferCallMsg) ToCallMsg() (*ethereum.CallMsg, error)
```
