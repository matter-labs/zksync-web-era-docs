# Interface

`ZkSyncImpl` implements the zkSync Era Web3 JSON-RPC API and provides interaction with a zkSync Era node. 

## Connecting a zkSync

```swift
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
```

## Interface that provides interaction with zkSync node

```swift
public typealias Result<T> = Swift.Result<T, Error>

public protocol ZkSync {
    
    var web3: web3 { get set }
    
    func zksEstimateFee(_ transaction: EthereumTransaction) -> Promise<Fee>
    
    func zksMainContract(_ completion: @escaping (Result<String>) -> Void)
    
    func zksGetConfirmedTokens(_ from: Int, limit: Int, completion: @escaping (Result<[Token]>) -> Void)
    
    func zksGetTokenPrice(_ tokenAddress: String, completion: @escaping (Result<Decimal>) -> Void)
    
    func zksL1ChainId(_ completion: @escaping (Result<BigUInt>) -> Void)
    
    func zksGetAllAccountBalances(_ address: String, completion: @escaping (Result<Dictionary<String, String>>) -> Void)
    
    func zksGetBridgeContracts(_ completion: @escaping (Result<BridgeAddresses>) -> Void)
    
    func ethEstimateGas(_ transaction: EthereumTransaction, completion: @escaping (Result<BigUInt>) -> Void)
    
    func zksGetTestnetPaymaster(_ completion: @escaping (Result<String>) -> Void)
    
    func zksGetTransactionDetails(_ transactionHash: String, completion: @escaping (Result<TransactionDetails>) -> Void)
    
    func zksGetTransactionByHash(_ transactionHash: String, completion: @escaping (Result<TransactionResponse>) -> Void)
    
    func zksGetLogs(_ completion: @escaping (Result<Log>) -> Void)
    
    func zksGetBlockByHash(_ blockHash: String, returnFullTransactionObjects: Bool, completion: @escaping (Result<Block>) -> Void)
    
    func zksGetBlockByNumber(_ block: DefaultBlockParameterName, returnFullTransactionObjects: Bool, completion: @escaping (Result<Block>) -> Void)
    
    func zksGetBlockDetails(_ blockNumber: BigUInt, returnFullTransactionObjects: Bool, completion: @escaping (Result<BlockDetails>) -> Void)
    
    func zksGetL2ToL1LogProof(_ txHash: String, logIndex: Int, completion: @escaping (Result<L2ToL1MessageProof>) -> Void)
}
```

