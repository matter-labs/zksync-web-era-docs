# Getting started

This is a short introduction to `zksync2-go` SDK, but covers many of the most common operations that developers require and provides a
starting point for those newer to zkSync Era.

## Getting zksync2-go

### Prerequisites

- Go: >=1.17 ([installation guide](https://go.dev/dl/))

In order to install SDK for zkSync Era, run the command below in your terminal.

```console
 go get github.com/zksync-sdk/zksync2-go
```

## Overview

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional
fields to those that Ethereum transactions have by default.

To begin, it is useful to have a basic understanding of the types of objects available and what they are responsible for, at a high level:

- `Client` provides connection to the zkSync Era blockchain, which allows querying the blockchain state, such as account, block or transaction details,
  querying event logs or evaluating read-only code using call. Additionally, the client facilitates writing to the blockchain by sending
  transactions.
- `Signer` wraps all operations that interact with an account. An account generally has a private key, which can be used to sign a variety of
  types of payloads.
- `Wallet` is a wrapper around `Client` and `Signer` that provides easy usage of the most common features.

## Examples

Connect to the zkSync Era network:

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

Get the chain ID:

```go
chainID, err := client.ChainID(context.Background())
if err != nil {
	log.Panic(err)
}
fmt.Println("Chain ID: ", chainID)
```

Get the latest block:

```go
block, err := client.BlockByNumber(context.Background(), nil)
if err != nil {
		log.Panic(err)
	}
fmt.Printf("%+v\n", *block)
```

Get the block by hash:

```go
blockHash := common.HexToHash("b472c070c9e121ba42702f6c322b7b266e287a4d8b5fa426ed265b105430c397")
block, err := client.BlockByHash(context.Background(), blockHash)
if err != nil {
	log.Panic(err)
}
fmt.Printf("%+v\n", *block)
```

Get the transaction by hash:

```go
transactionByHash, _, err := client.TransactionByHash(context.Background(), common.HexToHash("0x9af27afed9a4dd018c0625ea1368afb8ba08e4cfb69b3e76dfb8521c8a87ecfc"))
if err != nil {
	log.Panic(err)
}
fmt.Printf("%+v\n", transactionByHash)
```

Also, the following examples demonstrate how to:

1. [Deposit ETH and tokens from Ethereum into zkSync Era](examples/deposit.md).
2. [Transfer ETH and tokens on zkSync Era](examples/transfer.md).
3. [Withdraw ETH and tokens from zkSync Era to Ethereum](examples/withdraw.md).
4. [Get confirmed tokens on zkSync Era](examples/get-confirmed-tokens.md).
5. [Deploy a smart contract using CREATE opcode](examples/create.md).
6. [Deploy a smart contract using CREATE2 opcode](examples/create2.md).
7. [Deploy custom token on zkSync Era](examples/custom-paymaster/deploy-token.md).
8. [Deploy smart account](examples/custom-paymaster/deploy-account.md).
9. [Use paymaster to pay fee with token](examples/custom-paymaster/use-paymaster.md).

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/go). Examples are configured to
interact with `zkSync Era` and `Goerli` test networks.
