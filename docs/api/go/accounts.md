# Accounts: Overview

`DefaultEthSigner` provides private key management, transaction, and message
signing.

## `DefaultEthSigner`

Init:

```go
func NewEthSignerFromMnemonic(mnemonic string, chainId int64) (*DefaultEthSigner, error)

func NewEthSignerFromMnemonicAndAccountId(mnemonic string, accountId uint32, chainId int64) (*DefaultEthSigner, error)

func NewEthSignerFromRawPrivateKey(rawPk []byte, chainId int64) (*DefaultEthSigner, error)
```

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncProvider := "https://testnet.era.zksync.dev"

// Connect to zkSync network
zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
if err != nil {
	log.Panic(err)
}
defer zp.Close()

// Create singer object from private key for appropriate chain
chainID, err := zp.ChainID(context.Background())
if err != nil {
	log.Fatal(err)
}
es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
if err != nil {
	log.Fatal(err)
}
```

Interface:

```go
type EthSigner interface {
	GetAddress() common.Address
	GetDomain() *Eip712Domain
	SignHash(msg []byte) ([]byte, error)
	SignTypedData(d *Eip712Domain, data EIP712TypedData) ([]byte, error)
}
```

- `SignHash`: signs transaction hash.
- `SignTypedData`: signs EIP712-typed zkSync transaction which is used
  for smart contract deployment.

# Wallet

A `Wallet` is a wrapper around `EthSigner` which provides actions on the L2 network.
Based on the action, the `Wallet` crates an appropriate transaction, signs the transaction using
the `EthSigner`, and then broadcasts the transaction to the network.

Init:

```go
func NewWallet(es EthSigner, zp Provider) (*Wallet, error)
```

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncProvider := "https://testnet.era.zksync.dev"

// Connect to zkSync network
zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
if err != nil {
	log.Panic(err)
}
defer zp.Close()

// Create singer object from private key for appropriate chain
chainID, err := zp.ChainID(context.Background())
if err != nil {
	log.Fatal(err)
}
es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
if err != nil {
	log.Fatal(err)
}

// Create wallet
w, err := zksync2.NewWallet(es, zp)
if err != nil {
	log.Panic(err)
}
```

Visit [Accounts:L1->L2 Transactions](./accounts-l1-l2.md) to see which actions `Wallet` provides.

Complete examples are available on the [getting started](./getting-started.md) page.
