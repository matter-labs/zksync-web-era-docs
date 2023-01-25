# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Check balances.
4. Transfer and withdraw funds (native and ERC20 tokens).
5. Deploy a smart contract.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Prerequisite

This guide assumes that you are familiar with [Swift](https://www.swift.org/) programming language.

##  Installation
### CocoaPods

[CocoaPods](http://cocoapods.org/) is a dependency manager for Cocoa projects. You can install it with the following command:

```bash

sudo gem install cocoapods

```

To integrate zkSync swift SDK into your Xcode project using CocoaPods, specify it in your `Podfile`:

```bash

platform :ios, '13.0'
use_frameworks!

install! 'cocoapods', :warn_for_unused_master_specs_repo => false

target '<Your Target Name>' do
  pod 'ZkSync2', '~> 0.0.1'
end

```

Then run the following command:

```bash

pod install

```

## Connecting to zkSync

To interact with the zkSync network users need to know the endpoint of the operator node.

Create an instance of `EthereumAccount`  with a `EthereumKeyStorage` provider. This provides a wrapper around your key for `web3.swift` to use. <br/>

**NOTE:  We recommend you implement your own _KeyStorage_ provider, instead of relying on the provided `EthereumKeyLocalStorage` class.**

```swift
import web3

// This is just an example. EthereumKeyLocalStorage should not be used in production code
let keyStorage = EthereumKeyLocalStorage()
let account = try? EthereumAccount.create(replacing: keyStorage, keystorePassword: "MY_PASSWORD")
```

Create an instance of `EthereumHttpClient` or `EthereumWebSocketClient`. This will then provide you access to a set of functions for interacting with the zkSync network.

#### `EthereumHttpClient`

```swift
guard let clientUrl = URL(string: "https://zksync2-testnet.zksync.dev") else { return }
let client = EthereumHttpClient(url: clientUrl)
```

OR

#### `EthereumWebSocketClient`

```swift
guard let clientUrl = URL(string: "wss://zksync2-testnet.zksync.dev/ws") else { return }
let client = EthereumWebSocketClient(url: clientUrl)
```

You can then interact with the client methods:

## `approveDeposits`
It returns the erc20 token address.

```swift

    func approveDeposits(with token: Token,
                         limit: BigUInt?) throws -> Promise<TransactionSendingResult>
```
#### Parameters

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The Ethereum address of the token.                               |
| limit(optional)    | The maximum amount to approve a zkSync contract.                 |


## `transfer`

The transfer method can transfer ERC20 tokens, and it returns the transaction receipt of the transfer.

```swift 
    /// Send transfer transaction. This is the regular transfer of ERC20 token.
    /// - Parameters:
    func transfer(with token: Token,
                  amount: BigUInt,
                  to address: String) throws -> Promise<TransactionSendingResult>

```
#### Parameter

| Name               | Description                        |
| ------------------ | -----------------------------------|
| token              | The ERC20 token address.           |
| amount             | The amount of tokens to transfer   |
| address            | The Tokens receiver address.       |


## `deposit`

This method uses `EthereumProvider.approveDeposits()` to send deposit transactions to zkSync contracts and returns the transaction receipt of the deposit.

```swift

    func deposit(with token: Token,
                 amount: BigUInt,
                 to userAddress: String) throws -> Promise<TransactionSendingResult>

```

#### Parameter

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The address of the token to deposit.                             |
| amount             | The amount of the token to be deposited.                         |
| userAddress        | The address that will receive the deposited tokens on L2.        |


## `withdraw`

This method send withdrawals to the specified token address and returns the transaction receipt.

```swift

    func withdraw(with token: Token,
                  amount: BigUInt,
                  from userAddress: String) throws -> Promise<TransactionSendingResult>

```

#### Parameter

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The address of the token to withdraw.                            |
| amount             | The amount of the token to withdraw.                             |
| userAddress        | The L1 withdrawal receiver address in zkSync.                    |


## `isDepositApproved`

This method checks if the deposit is approved and returns a Boolean.

```swift
    func isDepositApproved(with token: Token,
                           address: String,
                           threshold: BigUInt?) throws -> Bool
```

#### Parameter

| Name               | Description                                                            |
| ------------------ | -----------------------------------------------------------------------|
| token              | The address of the token deposited.                                    |
| address            | The amount of the token deposited.                                     |
| threshold          | The minimum threshold of approved tokens.                              |
| returns            | Boolean value that denotes whether deposit was approved or not.        |