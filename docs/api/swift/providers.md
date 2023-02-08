# Providers

Providers are objects that wrap interactions with the zkSync node. If you are new to the concept of providers in `web3`, you should check out their docs [here](https://openbase.com/swift/web3swift/documentation).

zkSync fully supports Ethereum Web3 API, so you can use the provider objects from web3swift. However, zkSync API provides some additional JSON-RPC methods, which allow:

- Easily track L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use cases may require tracking "finalized" transactions only.


The zkSync swift SDK exports the `EthereumProvider` provider:

- `EthereumProvider` which inherits from `web3swift` `JsonRpcProvider` provides access to all of the zkSync JSON-RPC endpoints. 

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## EthereumProvider

This provides the same functionality as `web3swift.providers.JsonRpcProvider`, but extends it with the zkSync-specific methods.

### Creating provider

It accepts the `URL` to the operator node and the `network` name and the `keystoreManager`.  

#### Arguments

| Name               | Description                      |
| ------------------ | -------------------------------- |
| url (optional)     | URL of the zkSync operator node. |
| network (optional) | The description of the network.  |
| keystoreManager (optional)   | The public key certificates. |
| returns            | `Provider` object.               |


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