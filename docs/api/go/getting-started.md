# 开始工作

在本指南中，我们将演示如何。

1. 连接到zkSync网络。
2. 将资产从以太坊存入zkSync。
3. 转移和提取资金。
4. 部署一个智能合约。
5. 与任何智能合约进行互动。

:::warning

本节文档正在审查中，以反映对系统合约所做的修改（[见changelog](././dev/troubleshooting/changelog.md)）。修订后的版本很快就会推出。

:::

## 前提条件

本指南假定你熟悉[Go](https://go.dev/doc/)编程语言。
Go的版本应该>=1.17，并且需要Go模块。

## 安装

使用`go get`命令来安装SDK，请运行以下命令。

```go
go get github.com/zksync-sdk/zksync2-go

```

## Instantiating the SDK

要开始使用SDK，你只需要传入一个提供者的配置。

使用 "ZkSync Provider"、"Eth Provider "和 "wallet"，你可以用ZkSync网络执行所有基本操作。

::: warning

⚠️ 切勿将私钥提交给文件追踪历史，否则你的账户可能会被泄露。

:::

```go

package main

import (
    "github.com/ethereum/go-ethereum/rpc"
    "github.com/zksync-sdk/zksync2-go"
)

// first, init Ethereum Signer, from your mnemonic, and with the chain Id (in zkSync Era Testnet case, 280)
ethereumSigner, err := zksync2.NewEthSignerFromMnemonic("<mnemonic words>", 280)

// or from raw PrivateKey bytes
ethereumSigner, err = zksync2.NewEthSignerFromRawPrivateKey(pkBytes, 280)

// also, init ZkSync Provider, specify ZkSync2 RPC URL (e.g. testnet)
zkSyncProvider, err := zksync2.NewDefaultProvider("https://zksync2-testnet.zksync.dev")

// then init Wallet, passing just created Ethereum Signer and ZkSync Provider
wallet, err := zksync2.NewWallet(ethereumSigner, zkSyncProvider)

// init default RPC client to Ethereum node (Goerli network in case of ZkSync2 Era Testnet)
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

你可以通过以下方式访问合约部署界面。

```go

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

为了与智能合约互动，SDK需要知道合约的地址，以及它的ABI。为此，你需要使用ABI.Pack() [方法](https://github.com/ethereum/go-ethereum/accounts/abi)来加载你的合约的ABI，或者对执行函数及其参数的calldata进行编码。

编码calldata的例子。

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
