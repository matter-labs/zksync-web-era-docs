# 提供者

- 提供者是包裹与zkSync节点的交互的对象。如果你对`web3`中的提供者的概念感到陌生，你应该看看他们的文档[这里](https://openbase.com/swift/web3swift/documentation)。
  
  zkSync完全支持Ethereum Web3 API，所以你可以使用web3swift的提供者对象。然而，zkSync API提供了一些额外的JSON-RPC方法，这些方法允许。
  
  - 轻松地跟踪L1<->L2交易。
  - 交易的不同阶段的最终结果。默认情况下，我们的RPC会返回服务器处理的最后一个状态的信息，但有些用例可能只需要跟踪 "最终完成 "的交易。
  
  zkSync swift SDK导出了`EthereumProvider`提供者。
  
  - `EthereumProvider`继承自`web3swift``JsonRpcProvider`提供对所有zkSync JSON-RPC端点的访问。

## EthereumProvider

这提供了与`web3swift.providers.JsonRpcProvider`相同的功能，但用zkSync特定的方法对其进行了扩展。

### 创建提供者

它接受操作员节点的`URL`和`网络`名称以及`keystoreManager`。

#### Arguments

| Name                       | Description                      |
| -------------------------- | -------------------------------- |
| url (optional)             | URL of the zkSync operator node. |
| network (optional)         | The description of the network.  |
| keystoreManager (optional) | The public key certificates.     |
| returns                    | `Provider` object.               |

```swift
 public init?(_ httpProviderURL: URL, network net: Networks?, keystoreManager manager: KeystoreManager? = nil)
```

## Get gas price

```swift
func gasPrice() throws -> BigUInt {
        return try web3.eth.getGasPrice()
    }
```

## Approve deposits

```swift
func approveDeposits(with token: Token,
                         limit: BigUInt?) throws -> Promise<TransactionSendingResult> {
        guard let tokenAddress = EthereumAddress(token.l1Address),
              let spenderAddress = EthereumAddress(l1ERC20BridgeAddress) else {
            throw EthereumProviderError.invalidToken
        }

        let tokenContract = ERC20(web3: web3,
                                  provider: web3.provider,
                                  address: tokenAddress)

        let maxApproveAmount = BigUInt.two.power(256) - 1
        let amount = limit?.description ?? maxApproveAmount.description

        do {
            let transaction = try tokenContract.approve(from: spenderAddress,
                                                        spender: spenderAddress,
                                                        amount: amount)
            return transaction.sendPromise()
        } catch {
            return .init(error: error)
        }
    }
```

## Transfer

```swift
func transfer(with token: Token,
                  amount: BigUInt,
                  to address: String) throws -> Promise<TransactionSendingResult> {
        let transaction: WriteTransaction
        do {
            if token.isETH {
                transaction = try transferEth(amount: amount,
                                              to: address)
            } else {
                transaction = try transferERC20(token: token,
                                                amount: amount,
                                                to: address)
            }

            return transaction.sendPromise()
        } catch {
            return .init(error: error)
        }
    }
```

## Transfer ETH

```swift
func transferEth(amount: BigUInt,
                     to address: String) throws -> WriteTransaction {
        guard let fromAddress = EthereumAddress(l1ERC20BridgeAddress),
              let toAddress = EthereumAddress(address) else {
            throw EthereumProviderError.invalidAddress
        }

        guard let transaction = web3.eth.sendETH(from: fromAddress,
                                                 to: toAddress,
                                                 amount: amount.description,
                                                 units: .wei) else {
            throw EthereumProviderError.internalError
        }

        return transaction
    }
```

## Transfer ERC20 tokens

```swift
func transferERC20(token: Token,
                       amount: BigUInt,
                       to address: String) throws -> WriteTransaction {
        guard let fromAddress = EthereumAddress(l1ERC20BridgeAddress),
              let toAddress = EthereumAddress(address),
              let erc20ContractAddress = EthereumAddress(token.l1Address) else {
            throw EthereumProviderError.invalidToken
        }

        guard let transaction = web3.eth.sendERC20tokensWithKnownDecimals(tokenAddress: erc20ContractAddress,
                                                                          from: fromAddress,
                                                                          to: toAddress,
                                                                          amount: amount) else {
            throw EthereumProviderError.internalError
        }

        return transaction
    }
```

## Deposits

```swift
func deposit(with token: Token,
                 amount: BigUInt,
                 to userAddress: String) throws -> Promise<TransactionSendingResult> {
        guard let userAddress = EthereumAddress(userAddress) else {
            return .init(error: EthereumProviderError.invalidAddress)
        }

        if token.isETH {
            let depositInputs = [
                ABI.Element.InOut(name: "_l2Receiver", type: .address),
                ABI.Element.InOut(name: "_l1Token", type: .address),
                ABI.Element.InOut(name: "_amount", type: .uint(bits: 256))
            ]

            let depositFunction: ABI.Element = .function(ABI.Element.Function(name: "deposit",
                                                                              inputs: depositInputs,
                                                                              outputs: [],
                                                                              constant: false,
                                                                              payable: false))

            let depositParameters: [AnyObject] = [
                userAddress,
                EthereumAddress.Default,
                amount
            ] as [AnyObject]

            guard let encodedFunction = depositFunction.encodeParameters(depositParameters) else {
                fatalError("Encoded deposit function should be valid")
            }
```
