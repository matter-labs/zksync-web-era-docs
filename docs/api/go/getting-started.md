# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Transfer and withdraw funds.
4. Deploy a smart contract.
5. Interact with any smart contract.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Prerequisite

This guide assumes that you are familiar with the [Go](https://go.dev/doc/) programming language.
The Go version should be >= 1.17, and Go modules are required.

 
## Installation

To install the SDK with the `go get` command, run the following:

```go 
go get github.com/zksync-sdk/zksync2-go

```
## Instantiating the SDK

To start using the SDK, you just need to pass in a provider configuration.

Using `ZkSync Provider`, `EthereumProvider` and `Wallet`, you can perform all basic actions with ZkSync network.

::: warning

⚠️ Never commit private keys to file tracking history, or your account could be compromised.

:::

```go

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

// first, init Ethereum Signer, from your mnemonic, and with the chain Id (in zkSync testnet case, 280)
ethereumSigner, err := zksync2.NewEthSignerFromMnemonic("<mnemonic words>", 280)

// or from raw PrivateKey bytes
ethereumSigner, err = zksync2.NewEthSignerFromRawPrivateKey(pkBytes, 280)

// also, init ZkSync Provider, specify ZkSync2 RPC URL (e.g. testnet)
zkSyncProvider, err := zksync2.NewDefaultProvider("https://zksync2-testnet.zksync.dev")

// then init Wallet, passing just created Ethereum Signer and ZkSync Provider   
wallet, err := zksync2.NewWallet(ethereumSigner, zkSyncProvider)

// init default RPC client to Ethereum node (Goerli network in case of ZkSync2 testnet)
ethRpc, err := rpc.Dial("https://goerli.infura.io/v3/<your_infura_node_id>")

// and use it to create Ethereum Provider by Wallet 
ethereumProvider, err := w.CreateEthereumProvider(ethRpc)

```
## Deposit funds

```go

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

func main() {

    tx, err := ep.Deposit(
        zksync2.CreateETH(),
        big.NewInt(1000000000000000), 
        common.HexToAddress("<target_L2_address>"), 
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Tx hash", tx.Hash())

}

```
## Transfer

```go
package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

func main() {

    hash, err := w.Transfer(
        common.HexToAddress("<target_L2_address>"), 
        big.NewInt(1000000000000),
        nil, 
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Tx hash", hash)

}

```
## Withdraw

```go 

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

func main() {

    hash, err := w.Withdraw(
        common.HexToAddress("<target_L1_address>"), 
        big.NewInt(1000000000000), 
        nil, 
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Tx hash", hash)

}

```
## Deploy a smart contract

You can access the contract deployer interface as follows:

``` go

    package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

func main() {

    hash, err := w.Deploy(bytecode, nil, nil, nil, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println("Tx hash", hash)

    // use helper to get (compute) address of deployed SC
    address, err := zksync2.ComputeL2Create2Address(
        common.HexToAddress("<deployer_L2_address>"), 
        bytecode, 
        nil, 
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Deployed address", address.String())
}

```

## Interact with smart contracts

In order to interact with smart contracts, the SDK needs to know the contract address, as well as its ABI. For that, you need to use ABI.Pack() [method](https://github.com/ethereum/go-ethereum/accounts/abi) to load the ABI of your contract, or encode the calldata to execute function and its parameters.

Example encoding the calldata:

```go

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

func main() {

    calldata := crypto.Keccak256([]byte("get()"))[:4]
    hash, err := w.Execute(
        common.HexToAddress("<contract_address>"),
        calldata,
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Tx hash", hash)

}

```

::: warning

⚠️ This section of the docs is still in progress and will be updated with more detailed information soon.

:::