# Get started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Check Balance 
4. Transfer funds (ERC20 tokens) into ZkSync network
5. Withdraw funds (Native coins)

## Prerequisite
This guide assumes that you are familiar with the basics of go and you have it configured on your local machine.
Also, the required version is >= 1.17 and Go modules were used.


## Installation
Add this package to your project:

```go 

get github.com/zksync-sdk/zksync2-go

```

## How to init main components
Using these three instances `ZkSync Provider`, `EthereumProvider` and `Wallet`, you can perform all basic actions with ZkSync network, just explore their public methods and package helpers.

A few examples are below:

## Depositing funds

```go

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
Transfer
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
Withdraw
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
Deploy smart contract (basic case)
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

```
## Execute smart contract (basic case)

```go

// you need to encode calldata for executing function and its parameters
// or use ABI.Pack() method for loaded ABI for your contract ("github.com/ethereum/go-ethereum/accounts/abi")
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
Get balance of ZkSync account
bal, err := w.GetBalance()
if err != nil {
    panic(err)
}
fmt.Println("Balance", bal)

```