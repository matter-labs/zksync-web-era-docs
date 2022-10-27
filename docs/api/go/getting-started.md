# Go SDK

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Check Balance 
4. Transfer funds (ERC20 tokens) into the zksync network
5. Withdraw funds (Native coins)

## Prerequisite

This guide assumes that you are familiar with the [Go programming](https://go.dev/doc/) language
Also, the required version is >= 1.17 and Go modules were used.


## Installation

To install the SDK with the `go get` command, run the following:

```go 

get github.com/zksync-sdk/zksync2-go

```

## Getting started

To start using this SDK, you just need to pass in a provider configuration.

### Instantiating the SDK

Once you have all the necessary dependencies, you can follow the following setup steps to get started with SDK read-only functions:
Using these three instances `ZkSync Provider`, `EthereumProvider` and `Wallet`, you can perform all basic actions with ZkSync network.

```go

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

// first, init Ethereum Signer, from your mnemonic
es, err := zksync2.NewEthSignerFromMnemonic("<mnemonic words>", zksync2.ZkSyncChainIdMainnet)

// or from raw PrivateKey bytes
es, err = zksync2.NewEthSignerFromRawPrivateKey(pkBytes, zksync2.ZkSyncChainIdMainnet)

// also, init ZkSync Provider, specify ZkSync2 RPC URL (e.g. testnet)
zp, err := zksync2.NewDefaultProvider("https://zksync2-testnet.zksync.dev")

// then init Wallet, passing just created Ethereum Signer and ZkSync Provider   
w, err := zksync2.NewWallet(es, zp)

// init default RPC client to Ethereum node (Goerli network in case of ZkSync2 testnet)
ethRpc, err := rpc.Dial("https://goerli.infura.io/v3/<your_infura_node_id>")

// and use it to create Ethereum Provider by Wallet 
ep, err := w.CreateEthereumProvider(ethRpc)

```
### Working With Contracts

Once you instantiate the SDK, you can use it to access your zkSync contracts. You can use SDK's contract getter functions like `L2Create2Address`, and `getContractDeployerABI`, to get the respective SDK contract instances. To deposit funds on zkSync for example, you can do the following.

Here are a few examples:

### Depositing funds

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
### Withdraw

Assets will be withdrawn to the target wallet after the zero-knowledge proof of zkSync block with this operation is generated and verified by the contract.


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
### Deploy smart contract (basic case)

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
    addr, err := zksync2.ComputeL2Create2Address(
        common.HexToAddress("<deployer_L2_address>"), 
        bytecode, 
        nil, 
        nil,
    )
    if err != nil {
        panic(err)
    }
    fmt.Println("Deployed address", addr.String())
}

```

### Execute smart contract (basic case)

In order to execute smart contract, the SDK needs to know the contract address that is performing the execution. 
For that, you need to use `ABI.Pack()` [method]("https://github.com/ethereum/go-ethereum/accounts/abi") to load the ABI of your contract, or you need to encode calldata to execute function and its parameters.

To execute smart contract, you can use the following setup, to encode the calldata:

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