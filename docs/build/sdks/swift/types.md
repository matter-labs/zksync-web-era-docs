---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Types | zkSync Docs
---

# Types and Interfaces

## `PaymasterParams`

```swift
public struct PaymasterParams: Codable {
    public var paymaster: EthereumAddress?

    public var paymasterInput: Data?
}
```

## `TransactionOption`

```swift
public struct TransactionOption {
    var from: Address?
    var maxPriorityFeePerGas: BigUInt?
    var maxFeePerGas: BigUInt?
    var gasPrice: BigUInt?
    var value: BigUInt?
    var chainID: BigUInt?
    var gasLimit: BigUInt?
    var nonce: BigUInt?
}
```

## `DepositTransaction`

```swift
public struct DepositTransaction {
    var token: Address
    var amount: BigUInt
    var to: Address?
    var approveERC20: Bool?
    var operatorTip: BigUInt?
    var bridgeAddress: Address?
    var l2GasLimit: BigUInt?
    var gasPerPubdataByte: BigUInt?
    var customBridgeData: Data?
    var refundRecipient: Address?
    var options: TransactionOption?
}
```

## `RequestExecuteTransaction`

```swift
public struct RequestExecuteTransaction {
    var contractAddress: Address
    var calldata: Data
    var from: Address?
    var l2Value: BigUInt?
    var l2GasLimit: BigUInt?
    var operatorTip: BigUInt?
    var gasPerPubdataByte: BigUInt?
    var refundRecipient: Address?
    var factoryDeps: [Data]?
    var options: TransactionOption?
}
```

## `FullDepositFee`

```swift
public struct FullDepositFee: Equatable {
    var baseCost: BigUInt
    var l1GasLimit: BigUInt
    var l2GasLimit: BigUInt
    var gasPrice: BigUInt?
    var maxPriorityFeePerGas: BigUInt?
    var maxFeePerGas: BigUInt?
}
```

## Fee

```swift
public struct Fee: Decodable {

    public var gasLimit: BigUInt

    public var gasPerPubdataLimit: BigUInt

    public var maxFeePerGas: BigUInt

    public var maxPriorityFeePerGas: BigUInt
}
```

## `Proof`

```swift
public struct Proof: Codable{
    let address: EthereumAddress
    let storageProof: [StorageProof]
}

public struct StorageProof: Codable{
    let key: String
    let value: String
    let index: Int
    let proof: [String]
}
```
