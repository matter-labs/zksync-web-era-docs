# 开始工作

在本指南中，我们将演示如何。

1. 连接到zkSync网络。
2. 将资产从以太坊存入zkSync。
3. 检查余额。
4. 转移和提取资金（本地和ERC20代币）。
5. 部署智能合约。


::: warning

文档的这一部分正在审查中，以反映对系统合同的修改（[见changelog](.../.../dev/troubleshooting/changelog.md)）。修订后的版本很快就会推出。

:::

## 前提条件

本指南假定你熟悉[Swift](https://www.swift.org/)编程语言。

## 安装

### CocoaPods

[CocoaPods](http://cocoapods.org/)是一个用于Cocoa项目的依赖管理器。你可以用下面的命令来安装它。

```bash

sudo gem install cocoapods

```

要使用CocoaPods将zkSync swift SDK集成到你的Xcode项目中，请在你的`Podfile`中指定它。

```bash

platform :ios, '13.0'
use_frameworks!

install! 'cocoapods', :warn_for_unused_master_specs_repo => false

target '<Your Target Name>' do
  pod 'ZkSync2', '~> 0.0.1'
end

```

然后运行以下命令。

```bash

pod install

```

## 连接 zkSync

为了与zkSync网络互动，用户需要知道运营商节点的端点。


创建一个`EthereumAccount'的实例，有一个`EthereumKeyStorage'提供者。这为`web3.swift`使用你的密钥提供了一个封装器。<br/>

**NOTE: 我们建议你实现你自己的_KeyStorage_提供者，而不是依靠提供的`EthereumKeyLocalStorage`类。.**

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

或者

#### `EthereumWebSocketClient`

```swift
guard let clientUrl = URL(string: "wss://zksync2-testnet.zksync.dev/ws") else { return }
let client = EthereumWebSocketClient(url: clientUrl)
```

然后，你可以与客户端方法进行互动。

## `approveDeposits`

它返回erc20令牌的地址。

```swift

    func approveDeposits(with token: Token,
                         limit: BigUInt?) throws -> Promise<TransactionSendingResult>
```

#### Parameters

| Name            | Description                                      |
| --------------- | ------------------------------------------------ |
| token           | The Ethereum address of the token.               |
| limit(optional) | The maximum amount to approve a zkSync contract. |

## `transfer`

转移方法可以转移ERC20代币，并且它返回转移的交易收据。


```swift
    /// Send transfer transaction. This is the regular transfer of ERC20 token.
    /// - Parameters:
    func transfer(with token: Token,
                  amount: BigUInt,
                  to address: String) throws -> Promise<TransactionSendingResult>

```

#### Parameter

| Name    | Description                      |
| ------- | -------------------------------- |
| token   | The ERC20 token address.         |
| amount  | The amount of tokens to transfer |
| address | The Tokens receiver address.     |

## `deposit`

该方法使用`EthereumProvider.approvedDeposits()`来发送存款交易到zkSync合约，并返回存款的交易收据。

```swift

    func deposit(with token: Token,
                 amount: BigUInt,
                 to userAddress: String) throws -> Promise<TransactionSendingResult>

```

#### Parameter

| Name        | Description                                               |
| ----------- | --------------------------------------------------------- |
| token       | The address of the token to deposit.                      |
| amount      | The amount of the token to be deposited.                  |
| userAddress | The address that will receive the deposited tokens on L2. |

## `withdraw`

该方法向指定的代币地址发送提款并返回交易收据。

```swift

    func withdraw(with token: Token,
                  amount: BigUInt,
                  from userAddress: String) throws -> Promise<TransactionSendingResult>

```

#### Parameter

| Name        | Description                                   |
| ----------- | --------------------------------------------- |
| token       | The address of the token to withdraw.         |
| amount      | The amount of the token to withdraw.          |
| userAddress | The L1 withdrawal receiver address in zkSync. |

## `isDepositApproved`

该方法检查存款是否被批准，并返回一个布尔值。

```swift
    func isDepositApproved(with token: Token,
                           address: String,
                           threshold: BigUInt?) throws -> Bool
```

#### Parameter

| Name      | Description                                                     |
| --------- | --------------------------------------------------------------- |
| token     | The address of the token deposited.                             |
| address   | The amount of the token deposited.                              |
| threshold | The minimum threshold of approved tokens.                       |
| returns   | Boolean value that denotes whether deposit was approved or not. |
