# Getting Started

In this guide we will demonstrate how to:

1. Check balance.
2. Get all confirmed tokens on zkSync.
3. Deposit ETH from Ethereum into zkSync.
4. Transfer ETH on zkSync. 
5. Withdraw ETH from zkSync to Ethereum.
6. Mint custom token on zkSync.
7. Deploy a smart contract using create2 opcode.
8. Deploy a smart account using create2 opcode.
9. Use paymaster to pay fee with token.

## Prerequisites

- IOS: >=13.0
- MacOS: >=11.0

## CocoaPods Integration

To install zkSync via CocoaPods, add zkSync2 pod to the Podfile:

```
 pod 'zkSync2-swift'
```

## Swift Package Manager Integration

To install zkSync via Swift Package Manager, add zkSync2 to the Package Dependencies:

```
 'github.com/zksync-sdk/zksync2-swift'
```

## Connecting to ZkSync

Once you have integrated zkSync2 dependencies, connect to zkSync using the endpoint of the operator node.

```swift
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
```

## Connecting to Ethereum

Also connect to Ethereum using the endpoint of the eth_goerli node.

```swift
let ethereum: web3 = try! Web3.new(URL(string: "https://rpc.ankr.com/eth_goerli")!)

let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let keystoreManager = KeystoreManager([credentials])
ethereum.addKeystoreManager(keystoreManager)
```

## Useful properties and functions 

This is the list of computed properties that you need to use when executing some zkSync functions.

```swift
var chainId: BigUInt {
    try! zkSync.web3.eth.getChainIdPromise().wait()
}

var nonce: BigUInt {
    try! zkSync.web3.eth.getTransactionCountPromise(
        address: EthereumAddress(signer.address)!,
        onBlock: ZkBlockParameterName.committed.rawValue
    ).wait()
}

func signTransaction(_ transaction: inout EthereumTransaction) {
    let signature = signer.signTypedData(signer.domain, typedData: transaction).addHexPrefix()
    
    let unmarshalledSignature = SECP256K1.unmarshalSignature(signatureData: Data(fromHex: signature)!)!
    transaction.envelope.r = BigUInt(fromHex: unmarshalledSignature.r.toHexString().addHexPrefix())!
    transaction.envelope.s = BigUInt(fromHex: unmarshalledSignature.s.toHexString().addHexPrefix())!
    transaction.envelope.v = BigUInt(unmarshalledSignature.v)
}
```

## Creating a ZkSyncWallet

To control your account in zkSync, use the `ZkSyncWallet` object. It can sign transactions and send them to the zkSync network.

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let signer = PrivateKeyEthSigner(credentials, chainId: chainId)
let wallet = ZkSyncWallet(zkSync, ethereum: ethereum, ethSigner: signer, feeToken: Token.ETH)
```

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/swift). Examples are configured to interact with `zkSync` and `Goerli` test networks.  

### Check balance

This is an example of how to check balance on zkSync.
```swift
let balance = try! wallet.getBalance().wait()
```
or
```swift
zkSync.zksGetAllAccountBalances(signer.address) { result in

}
```

### Get all confirmed tokens on zkSync

This is an example shows how to get all confirmed tokens on zkSync. 

```swift
zkSync.zksGetConfirmedTokens(0, limit: 255) { result in

}
```

### Deposit ETH

This is an example of how to deposit ETH from Ethereum network (L1) to zkSync network (L2):

```swift
zkSync.zksMainContract { result in
    DispatchQueue.global().async {
        switch result {
        case .success(let address):
            let zkSyncContract = self.ethereum.contract(
                Web3.Utils.IZkSync,
                at: EthereumAddress(address)
            )!
            
            let l1ERC20Bridge = self.zkSync.web3.contract(
                Web3.Utils.IL1Bridge,
                at: EthereumAddress(self.signer.address)
            )!
            
            let defaultEthereumProvider = DefaultEthereumProvider(
                self.ethereum,
                l1ERC20Bridge: l1ERC20Bridge,
                zkSyncContract: zkSyncContract,
                gasProvider: DefaultGasProvider()
            )
            
            let amount = BigUInt(1_000_000_000_000)
            
            _ = try! defaultEthereumProvider.deposit(
                with: Token.ETH,
                amount: amount,
                operatorTips: BigUInt(0),
                to: self.signer.address
            ).wait()
        case .failure(let error):
            throw error
        }
    }
}
```
or
```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! wallet.deposit(
    signer.address,
    amount: amount
).wait()
```

### Transfer ETH

This is an example on how to transfer ETH on zkSync network.

```swift
let value = BigUInt(1_000_000_000_000)

var estimate = EthereumTransaction.createFunctionCallTransaction(
    from: EthereumAddress(signer.address)!,
    to: EthereumAddress(<TO_ADDRESS>)!,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    data: Data()
)

let fee = try! zkSync.zksEstimateFee(estimate).wait()

estimate.parameters.EIP712Meta?.gasPerPubdata = fee.gasPerPubdataLimit

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.type = .eip712
transactionOptions.from = EthereumAddress(signer.address)!
transactionOptions.to = estimate.to
transactionOptions.gasLimit = .manual(fee.gasLimit)
transactionOptions.maxPriorityFeePerGas = .manual(fee.maxPriorityFeePerGas)
transactionOptions.maxFeePerGas = .manual(fee.maxFeePerGas)
transactionOptions.value = value
transactionOptions.nonce = .manual(nonce)
transactionOptions.chainID = chainId

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    value: value,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

let result = try! zkSync.web3.eth.sendRawTransactionPromise(transaction).wait()

let receipt = transactionReceiptProcessor.waitForTransactionReceipt(hash: result.hash)

assert(receipt?.status == .ok)
```
or
```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! wallet.transfer(
    <TO_ADDRESS>,
    amount: amount
).wait()
```

### Withdraw ETH

This is an example of how to withdraw ETH from zkSync network (L2) to Ethereum network (L1):

```swift
let contract = zkSync.web3.contract(Web3.Utils.IEthToken)!

let value = BigUInt(1_000_000_000_000)

let inputs = [
    ABI.Element.InOut(name: "_l1Receiver", type: .address)
]

let function = ABI.Element.Function(
    name: "withdraw",
    inputs: inputs,
    outputs: [],
    constant: false,
    payable: true
)

let withdrawFunction: ABI.Element = .function(function)

let parameters: [AnyObject] = [
    EthereumAddress(signer.address)! as AnyObject,
]

let calldata = withdrawFunction.encodeParameters(parameters)!

var estimate = EthereumTransaction.createFunctionCallTransaction(
    from: EthereumAddress(signer.address)!,
    to: EthereumAddress.L2EthTokenAddress,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    value: value,
    data: calldata
)

estimate.envelope.parameters.chainID = signer.domain.chainId

let fee = try! zkSync.zksEstimateFee(estimate).wait()

estimate.parameters.EIP712Meta?.gasPerPubdata = BigUInt(160000)

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.type = .eip712
transactionOptions.from = EthereumAddress(signer.address)!
transactionOptions.to = estimate.to
transactionOptions.maxPriorityFeePerGas = .manual(fee.maxPriorityFeePerGas)
transactionOptions.maxFeePerGas = .manual(fee.maxFeePerGas)
transactionOptions.value = value
transactionOptions.nonce = .manual(nonce)
transactionOptions.chainID = chainId

let estimateGas = try! self.zkSync.web3.eth.estimateGas(estimate, transactionOptions: transactionOptions)
transactionOptions.gasLimit = .manual(estimateGas)

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

let result = try! contract.web3.eth.sendRawTransactionPromise(transaction).wait()

let txHash = result.hash
let index = 0

guard let receipt = transactionReceiptProcessor.waitForTransactionReceipt(hash: txHash) else {
    fatalError("Transaction failed.")
}

assert(receipt.status == .ok)

let l1ERC20Bridge = zkSync.web3.contract(
    Web3.Utils.IL1Bridge,
    at: EthereumAddress(signer.address)
)!

zkSync.zksMainContract { result in
    DispatchQueue.global().async {
        switch result {
        case .success(let address):
            let zkSyncContract = self.ethereum.contract(
                Web3.Utils.IZkSync,
                at: EthereumAddress(address)
            )!
            
            let defaultEthereumProvider = DefaultEthereumProvider(self.ethereum, l1ERC20Bridge: l1ERC20Bridge, zkSyncContract: zkSyncContract, gasProvider: DefaultGasProvider())
            
            let topic = "L1MessageSent(address,bytes32,bytes)"
            let log = receipt.logs.filter({
                if $0.address.address == ZkSyncAddresses.MessengerAddress && $0.topics.first == EIP712.keccak256(topic) {
                    return true
                }
                return false
            })[index]
            
            let l2tol1log = receipt.l2ToL1Logs!.filter({
                if $0.sender.address == ZkSyncAddresses.MessengerAddress {
                    return true
                }
                return false
            })[index]
            
            self.zkSync.zksGetL2ToL1LogProof(txHash, logIndex: Int(l2tol1log.logIndex)) { result in
                DispatchQueue.global().async {
                    switch result {
                    case .success(let proof):
                        let contract = self.zkSync.web3.contract(Web3.Utils.IL1Messenger)!
                        
                        let eventData = contract.parseEvent(log).eventData
                        let message = eventData?["_message"] as? Data ?? Data()
                        
                        _ = try! defaultEthereumProvider.finalizeEthWithdrawal(
                            receipt.l1BatchNumber,
                            l2MessageIndex: BigUInt(proof.id),
                            l2TxNumberInBlock: receipt.l1BatchTxIndex,
                            message: message,
                            proof: proof.proof.compactMap({ Data(fromHex: $0) }),
                            nonce: self.nonce
                        ).wait()
                    case .failure(let error):
                        throw error
                    }
                }
            }
        case .failure(let error):
            throw error
        }
    }
}
```
or
```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! wallet.withdraw(
    signer.address,
    amount: amount,
    token: Token.ETH
).wait()
```

#### Mint custom token

```swift
let contract = zkSync.web3.contract(Web3.Utils.IToken, at: EthereumAddress(<SMART_CONTRACT_ADDRESS>)!)!

let value = BigUInt(100)

let parameters = [
    EthereumAddress(signer.address)! as AnyObject,
    value as AnyObject
] as [AnyObject]

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.from = EthereumAddress(signer.address)!

guard let writeTransaction = contract.write(
    "mint",
    parameters: parameters,
    transactionOptions: transactionOptions
) else {
    return
}

var estimate = EthereumTransaction.createFunctionCallTransaction(
    from: EthereumAddress(signer.address)!,
    to: writeTransaction.transaction.to,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    data: writeTransaction.transaction.data
)

let fee = try! zkSync.zksEstimateFee(estimate).wait()

estimate.parameters.EIP712Meta?.gasPerPubdata = BigUInt(160000)

transactionOptions = TransactionOptions.defaultOptions
transactionOptions.type = .eip712
transactionOptions.from = EthereumAddress(signer.address)!
transactionOptions.to = estimate.to
transactionOptions.maxPriorityFeePerGas = .manual(fee.maxPriorityFeePerGas)
transactionOptions.maxFeePerGas = .manual(fee.maxFeePerGas)
transactionOptions.nonce = .manual(nonce)
transactionOptions.chainID = chainId

let estimateGas = try! self.zkSync.web3.eth.estimateGas(estimate, transactionOptions: transactionOptions)
transactionOptions.gasLimit = .manual(estimateGas)

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

_ = try! zkSync.web3.eth.sendRawTransactionPromise(transaction).wait()
```

### Smart contract and smart account deployment

With zkSync, you can deploy a contract using the create and create2 opcode, by simply building the contract into a binary format and deploying it to the zkSync network.


- [Storage](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/storage/Storage.sol): Contract without constructor.
- [Incrementer](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/incrementer/Incrementer.sol): Contract with constructor.
- [Demo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Demo.sol): Contract that has a dependency on 
[Foo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Foo.sol) contract.
- [Token](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/token/Token.sol): custom ERC20 token.
- [Paymaster](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/paymaster/Paymaster.sol): custom paymaster which provides payment of transaction fees in ERC20 tokens. 

There is a [user guide](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/README.md) on how to compile Solidity smart contracts using `zksolc` 
compiler. `zksolc` compiler generates a `*.zbin` and a `combined.json` file that contains the bytecode and ABI of a smart contract. 
The `combined.json` file is used by `abigen` tool to generate smart contrat bindings. 
Those files are used in the following examples. 

In some cases, you need to get the contract address before deploying it. Use
 - `utils.ComputeL2CreateAddress()` to get precomputed smart contract address when deploying with create opcode, 
 - `utils.ComputeL2Create2Address()` to get precomputed smart contract address when deploying with create2 opcode.


#### Deploy a smart contract using create2 opcode

```swift
let bytecodeData = <SMART_CONTRACT_BYTECODE>

let contractTransaction = EthereumTransaction.create2ContractTransaction(
    from: EthereumAddress(signer.address)!,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    bytecode: bytecodeData,
    deps: [bytecodeData],
    calldata: Data(),
    salt: Data(),
    chainId: signer.domain.chainId
)

let precomputedAddress = ContractDeployer.computeL2Create2Address(
    EthereumAddress(signer.address)!,
    bytecode: bytecodeData,
    constructor: Data(),
    salt: Data()
)

let chainID = signer.domain.chainId

var estimate = EthereumTransaction.createFunctionCallTransaction(
    from: EthereumAddress(signer.address)!,
    to: contractTransaction.to,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    data: contractTransaction.data
)

estimate.parameters.EIP712Meta?.factoryDeps = [bytecodeData]

let fee = try! zkSync.zksEstimateFee(estimate).wait()

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.type = .eip712
transactionOptions.chainID = chainID
transactionOptions.nonce = .manual(nonce)
transactionOptions.to = contractTransaction.to
transactionOptions.value = contractTransaction.value
transactionOptions.gasLimit = .manual(fee.gasLimit)
transactionOptions.maxPriorityFeePerGas = .manual(fee.maxPriorityFeePerGas)
transactionOptions.maxFeePerGas = .manual(fee.maxFeePerGas)
transactionOptions.from = contractTransaction.parameters.from

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta
ethereumParameters.EIP712Meta?.factoryDeps = [bytecodeData]

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

guard let message = transaction.encode(for: .transaction) else {
    fatalError("Failed to encode transaction.")
}

let result = try! zkSync.web3.eth.sendRawTransactionPromise(message).wait()

let receipt = transactionReceiptProcessor.waitForTransactionReceipt(hash: result.hash)

assert(receipt?.status == .ok)
assert(precomputedAddress == receipt?.contractAddress)
```

#### Deploy a smart account using create2 opcode

```swift
let bytecodeData = <SMART_ACCOUNT_BYTECODE>

let inputs = [
    ABI.Element.InOut(name: "erc20", type: .address),
]

let function = ABI.Element.Function(
    name: "",
    inputs: inputs,
    outputs: [],
    constant: false,
    payable: false)

let elementFunction: ABI.Element = .function(function)

let parameters: [AnyObject] = [
    EthereumAddress(<TOKEN_ADDRESS>)! as AnyObject
]

guard var encodedCallData = elementFunction.encodeParameters(parameters) else {
    fatalError("Failed to encode function.")
}

// Removing signature prefix, which is first 4 bytes
for _ in 0..<4 {
    encodedCallData = encodedCallData.dropFirst()
}

let estimate = EthereumTransaction.create2AccountTransaction(
    from: EthereumAddress(signer.address)!,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    bytecode: bytecodeData,
    deps: [bytecodeData],
    calldata: encodedCallData,
    salt: Data(),
    chainId: signer.domain.chainId
)

let chainID = signer.domain.chainId
let gasPrice = try! zkSync.web3.eth.getGasPrice()

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.gasPrice = .manual(BigUInt.zero)
transactionOptions.type = .eip712
transactionOptions.chainID = chainID
transactionOptions.nonce = .manual(nonce)
transactionOptions.to = estimate.to
transactionOptions.value = BigUInt.zero
transactionOptions.maxPriorityFeePerGas = .manual(BigUInt(100000000))
transactionOptions.maxFeePerGas = .manual(gasPrice)
transactionOptions.from = estimate.parameters.from

let estimateGas = try! zkSync.web3.eth.estimateGas(estimate, transactionOptions: transactionOptions)
transactionOptions.gasLimit = .manual(estimateGas)

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta
ethereumParameters.EIP712Meta?.factoryDeps = [bytecodeData]

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

guard let message = transaction.encode(for: .transaction) else {
    fatalError("Failed to encode transaction.")
}

let result = try! zkSync.web3.eth.sendRawTransactionPromise(message).wait()

let receipt = transactionReceiptProcessor.waitForTransactionReceipt(hash: result.hash)

assert(receipt?.status == .ok)
```

### Use paymaster

This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.

```swift
let contract = zkSync.web3.contract(Web3.Utils.IToken, at: EthereumAddress(<SMART_CONTRACT_ADDRESS>)!)!

let value = BigUInt(1_000)

let parameters = [
    EthereumAddress(signer.address)! as AnyObject,
    value as AnyObject
] as [AnyObject]

var transactionOptions = TransactionOptions.defaultOptions
transactionOptions.from = EthereumAddress(signer.address)!

guard let writeTransaction = contract.write(
    "mint",
    parameters: parameters,
    transactionOptions: transactionOptions
) else {
    return
}

var estimate = EthereumTransaction.createFunctionCallTransaction(
    from: EthereumAddress(signer.address)!,
    to: writeTransaction.transaction.to,
    gasPrice: BigUInt.zero,
    gasLimit: BigUInt.zero,
    data: writeTransaction.transaction.data
)

let fee = try! zkSync.zksEstimateFee(estimate).wait()

estimate.parameters.EIP712Meta?.gasPerPubdata = BigUInt(160000)

let paymasterAddress = EthereumAddress(<PAYMASTER_ADDRESS>)!
let paymasterInput = Paymaster.encodeApprovalBased(
    EthereumAddress(<TO_ADDRESS>)!,
    minimalAllowance: BigUInt(1),
    paymasterInput: Data()
)

estimate.parameters.EIP712Meta?.paymasterParams = PaymasterParams(paymaster: paymasterAddress, paymasterInput: paymasterInput)

transactionOptions = TransactionOptions.defaultOptions
transactionOptions.type = .eip712
transactionOptions.from = EthereumAddress(signer.address)!
transactionOptions.to = estimate.to
transactionOptions.maxPriorityFeePerGas = .manual(fee.maxPriorityFeePerGas)
transactionOptions.maxFeePerGas = .manual(fee.maxFeePerGas)
transactionOptions.nonce = .manual(nonce)
transactionOptions.chainID = chainId

let estimateGas = try! self.zkSync.web3.eth.estimateGas(estimate, transactionOptions: transactionOptions)
transactionOptions.gasLimit = .manual(estimateGas)

var ethereumParameters = EthereumParameters(from: transactionOptions)
ethereumParameters.EIP712Meta = estimate.parameters.EIP712Meta

var transaction = EthereumTransaction(
    type: .eip712,
    to: estimate.to,
    nonce: nonce,
    chainID: chainId,
    data: estimate.data,
    parameters: ethereumParameters
)

signTransaction(&transaction)

_ = try! zkSync.web3.eth.sendRawTransactionPromise(transaction).wait()
```
