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

## `DefaultBlockParameterName`

```swift
public enum DefaultBlockParameterName: String {

    case earliest = "earliest"
    case latest = "latest"
    case pending = "pending"
    case finalized = "finalized"
    case safe = "safe"
    case accepted = "accepted"
}
```

## `AccountAbstractionVersion`

```swift
public enum AccountAbstractionVersion: UInt8 {
    case none
    case version1
}
```

## `BlockDetails`

```swift
public struct BlockDetails: Decodable {

    let commitTxHash: String?

    let committedAt: Date?

    let executeTxHash: String?

    let executedAt: Date?

    let l1TxCount: UInt

    let l2TxCount: UInt

    let number: UInt

    let proveTxHash: String?

    let provenAt: Date?

    let rootHash: String?

    let status: String

    let timestamp: UInt
}
```

## `L2ToL1MessageProof`

```swift
public struct L2ToL1MessageProof: Decodable {

    public let proof: [String]

    public let id: Int

    public let root: String
}
```

## `Log`

```swift
public struct Log: Decodable {

    let address: EthereumAddress

    let blockHash: Data

    let blockNumber: BigUInt

    let data: Data

    let logIndex: BigUInt

    let removed: Bool

    let topics: [Data]

    let transactionHash: Data

    let transactionIndex: BigUInt

    let l1BatchNumber: BigUInt
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

## `TransactionResponse`

```swift
public struct TransactionResponse: Decodable {

    let blockHash: Data

    let chainId: BigUInt

    let maxFeePerGas: BigUInt

    let v: BigUInt

    let r: BigUInt

    let s: BigUInt

    let l1BatchNumber: BigUInt

    let l1BatchTxIndex: BigUInt

    let input: Data

    let gasPrice: BigUInt

    let type: UInt

    let nonce: UInt

    let blockNumber: BigUInt

    let to: String

    let maxPriorityFeePerGas: BigUInt

    let from: String

    let gas: BigUInt

    let hash: String

    let value: BigUInt

    let transactionIndex: BigUInt
}
```
