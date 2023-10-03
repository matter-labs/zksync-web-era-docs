---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Accounts | zkSync Era Docs
---

# Accounts: Overview

The `accounts` package provides abstractions that wrap operations that interact with an account. An account typically contains a private
key, allowing it to sign various types of payloads. There are the following interfaces that provide account operations for different
purposes:

- `Signer` provides support for signing EIP-712 transactions as well as other types of transactions
- `AdapterL1` is associated with an account and provides common operations on the L1 network for the associated account.
- `AdapterL2` is associated with an account and provides common operations on the L2 network for the associated account.
- `Deployer` is associated with an account and provides deployment of smart contracts and smart accounts on the L2 network for the
  associated account.
- `Adapter` consists of `AdapterL1`, `AdapterL2`, and `Deployer` interfaces.

There are the following objects that provide account operations:

- `BaseSigner` implements the `Signer` interface.
- `WalletL1` implements the `AdapterL1` interface.
- `WalletL2` implements the `AdapterL2` interface.
- `BaseDeployer` implements the `Deployer` interface.
- `Wallet` implements the `Adapter` interface.

In most cases, `Wallet` should be used because it provides all the necessary operations. Other objects and interfaces are separated to make
the SDK more flexible and extensible.

## `BaseSigner`

### `Init`

Creates a new instance of `BaseSigner` based on the credentials.

```swift
BaseSigner(credentials, chainId: chainId)
```

### `Address`

Returns the address associated with the signer.

```swift
signer.address: String
```

### `Domain`

Returns the EIP-712 domain used for signing.

```swift
signer.domain: EIP712Domain
```

### `PrivateKey`

Returns the private key associated with the signer.

```swift
signer.credentials.privateKey: Data
```

Signs the given hash using the signer's private key and returns the signature. The hash should be the 32-byte hash of the data to be signed.

### `SignHash`

```swift
signer.signMessage(message)
```

### `SignTypeData`

Signs the given EIP-712 typed data using the signer's private key and returns the signature. The domain parameter is the EIP-712 domain
separator, and the data parameter is the EIP-712 typed data.

```swift
signer.signTypedData(domain, typedData: typeddata)
```

## `WalletL1`

### `Init`

Creates an instance of WalletL1 associated with the account provided by the signer.

```swift
WalletL1(zkSync, ethClient: ethClient, web3: web3, ethSigner: signer)
```

#### Example

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let chainId = try! zkSync.web3.eth.getChainIdPromise().wait()
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
let ethereum: web3 = try! Web3.new(URL(string: "https://rpc.ankr.com/eth_goerli")!)
let signer = BaseSigner(credentials, chainId: chainId)
let wallet = WalletL1(zkSync, ethClient: ethClient, web3: web3, ethSigner: signer)
```

### `MainContract`

Returns the zkSync L1 smart contract.

```swift
func mainContract() async throws -> String
```

#### Example

```swift
try await self.zkSync.mainContract()
```

### `L1BridgeContracts`

Returns L1 bridge contracts.

```swift
func L1BridgeContracts() async throws -> BridgeAddresses
```

#### Example

```swift
try await wallet.L1BridgeContracts()
```

### `BalanceL1`

Returns the balance of the specified token on L1 that can be either ETH or any ERC20 token.

#### Inputs

| Parameter | Type                                                | Description    |
| --------- | --------------------------------------------------- | -------------- |
| `token`   | `Token`                                             | Token.         |

```swift
func balanceL1(token: Token) async -> BigUInt
```

#### Example

```swift
try await wallet.BalanceL1(Token.ETH)
```

### `AllowanceL1`

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter       | Type                                                | Description     |
| --------------- | --------------------------------------------------- | --------------- |
| `token`         | `Token`                                             | Token.          |
| `bridgeAddress` | `EthereumAddress                                    | Bridge address. |

```swift
func allowanceL1(token: Token, bridgeAddress: EthereumAddress) async -> BigUInt
```

### `L2TokenAddress`

Returns the corresponding address on the L2 network for the token on the L1 network.

#### Inputs

| Parameter | Type              | Description       |
| --------- | ----------------- | ----------------- |
| `token`   | `Token`           | L1 token.         |

```swift
try await L2TokenAddress(token: Token) async throws -> EthereumAddress
```

### `BaseCost`

Returns base cost for L2 transaction.

#### Inputs

| Parameter           | Type                                                | Description                                                                             |
| ------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `gasLimit`          | `BigUInt`                                           | The gasLimit for the the L2 contract call.                                              |
| `gasPerPubdataByte` | `BigUInt`                                           | The L2 gas price for each published L1 calldata byte.                                   |
| `gasPrice`          | `BigUInt` (optional)                                | The L1 gas price of the L1 transaction that will send the request for an execute call. |

```swift
func baseCost(_ gasLimit: BigUInt, gasPerPubdataByte: BigUInt, gasPrice: BigUInt?) async throws -> [String: Any]
```

### `Deposit`

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `BridgeAddress`). In this case, `ApproveERC20` can be enabled to perform token approval. If there are already enough approved
tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge, use the
[`AllowanceL1`](#allowancel1) method.

#### Inputs

| Parameter | Type                 | Description            |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `to`      | `String`             | To address.            |
| `amount`  | `BigUInt`            | Amount to deposit.     |
| `token`   | `Token` (optional)   | Token.                 |
| `nonce`   | `BigUInt` (optional) | Nonce.                 |

```swift
func deposit(_ to: String, amount: BigUInt, token: Token?, nonce: BigUInt?) async throws -> TransactionSendingResult
```

#### Example

```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! await walletL1.deposit(
    signer.address,
    amount: amount,
    token: Token.ETH
)
```

### `ClaimFailedDeposit`

Withdraws funds from the initiated deposit, which failed when finalizing on L2. If the deposit L2 transaction has failed, it sends an L1
transaction calling ClaimFailedDeposit method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws
the error.

#### Inputs

| Parameter     | Type                                                         | Description                                    |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `depositHash` | `common.Hash`                                                | The L2 transaction hash of the failed deposit. |

```swift
func claimFailedDeposit(_ l1BridgeAddress: String, depositSender: String, l1Token: String, l2TxHash: Data, l2BlockNumber: BigUInt, l2MessageIndex: BigUInt, l2TxNumberInBlock: UInt, proof: [Data]) async throws -> TransactionSendingResult
```

### `RequestExecute`

Request execution of L2 transaction from L1.

#### Inputs

| Parameter         | Type                 | Description           |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `contractAddress` | `String`             | Transaction options.  |
| `l2Value`         | `BigUInt`            | L2 value.             |
| `calldata`        | `Token` (optional)   | Calldata.             |
| `gasLimit`        | `BigUInt` (optional) | Gas limit.            |
| `factoryDeps`     | `BigUInt` (optional) | Factory deps.         |
| `operatorTips`    | `BigUInt` (optional) | Operator tips.        |
| `gasPrice`        | `BigUInt` (optional) | Gas price.            |
| `refundRecipient` | `BigUInt` (optional) | Refund recipient.     |

```swift
func requestExecute(_ contractAddress: String, l2Value: BigUInt, calldata: Data, gasLimit: BigUInt, factoryDeps: [Data]?, operatorTips: BigUInt?, gasPrice: BigUInt?, refundRecipient: String) async throws -> TransactionSendingResult
```

## `WalletL2`

### `Init`

Creates an instance of WalletL2 associated with the account provided by the signer.

```swift
WalletL2(zkSync, ethClient: ethClient, web3: web3, ethSigner: signer)
```

#### Example

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let chainId = try! zkSync.web3.eth.getChainIdPromise().wait()
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
let ethereum: web3 = try! Web3.new(URL(string: "https://rpc.ankr.com/eth_goerli")!)
let signer = BaseSigner(credentials, chainId: chainId)
let wallet = WalletL2(zkSync, ethClient: ethClient, web3: web3, ethSigner: signer)
```

### `Address`

Returns the address of the associated account.

```swift
let address: EthereumAddress
```

#### Example

```swift
wallet.address
```

### `Signer`

Returns the signer of the associated account.

```swift
let signer: ETHSigner
```

#### Example

```swift
wallet.signer
```

### `Balance`

Returns the balance of the specified token that can be either ETH or any ERC20 token. The block number can be `nil`, in which case the
balance is taken from the latest known block.

#### Inputs

| Parameter     | Type          | Description       |
| ------------- | ------------- | ----------------- |
| `token`       | `Token`       | L2 token address. |
| `blockNumber` | `BlockNumber` | Block number.     |

```swift
func balance(token: Token, blockNumber: BlockNumber) async throws -> BigUInt
```

#### Example

```swift
try await walletL2.balance(token: Token.ETH, blockNumber: .latest)
```

### `AllBalances`

Returns all balances for confirmed tokens given by an associated account.

#### Inputs

| Parameter | Type              | Description |
| --------- | ----------------- | ----------- |
| `address` | `String`          | Address.    |

```swift
func allBalances(_ address: String) async throws -> Dictionary<String, String>
```

#### Example

```swift
try await walletL2.allBalances(addres: <ADDRESS>)
```

### `Withdraw`

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Parameter | Type                 | Description            |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `to`      | `String`             | To address.            |
| `amount`  | `BigUInt`            | Amount to withdraw.    |
| `token`   | `Token` (optional)   | Token.                 |
| `nonce`   | `BigUInt` (optional) | Nonce.                 |

```swift
func withdraw(_ to: String, amount: BigUInt, token: Token?, nonce: BigUInt?) async throws -> TransactionSendingResult
```

#### Example

```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! await walletL2.withdraw(
    signer.address,
    amount: amount,
    token: Token.ETH
)
```

### `EstimateGasWithdraw`

Estimates the amount of gas required for a withdrawal transaction.

#### Inputs

| Parameter | Type                                                       | Description                 |
| --------- | ---------------------------------------------------------- | --------------------------- |
| `transaction`     | `CodableTransaction` (optional) | Withdrawal transaction. |

```swift
func estimateGasWithdraw(_ transaction: CodableTransaction) async throws -> BigUInt
```

#### Example

```swift
try await walletL2.estimateGasWithdraw(transaction)
```

### `Transfer`

Moves the ETH or any ERC20 token from the associated account to the target account.

#### Inputs

| Parameter | Type                 | Description            |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `to`      | `String`             | To address.            |
| `amount`  | `BigUInt`            | Amount to transfer.    |
| `token`   | `Token` (optional)   | Token.                 |
| `nonce`   | `BigUInt` (optional) | Nonce.                 |

```swift
func transfer(_ to: String, amount: BigUInt, token: Token?, nonce: BigUInt?) async -> TransactionSendingResult
```

#### Example

```swift
let amount = BigUInt(1_000_000_000_000)

_ = try! await walletL2.transfer(
    signer.address,
    amount: amount,
    token: Token.ETH
)
```

### `EstimateGasTransfer`

Estimates the amount of gas required for a transfer transaction.

#### Inputs

| Parameter      | Type                                                   | Description               |
| -------------- | ------------------------------------------------------ | ------------------------- |
| `transaction`  | `CodableTransaction`                                   | Transaction.            |

```swift
func estimateGasTransfer(_ transaction: CodableTransaction) async throws -> BigUInt
```

#### Example

```swift
try await walletL2.estimateGasTransfer(transaction)
```

### `CallContract`

Executes a message call for EIP-712 transaction, which is directly executed in the VM of the node, but never mined into the
blockchain.

#### Inputs

| Parameter     | Type                                   | Description                                                                                                                                                                                 |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction`         | `CodableTransaction`                      | Transaction.                                                                                                                                                                                    |
| `blockNumber` | `BigUInt` (optional)                  | Selects the block height at which the call runs. It can be `nil`, in which case the code is taken from the latest known block. Note that state from very old blocks might not be available. |

```swift
func callContract(_ transaction: CodableTransaction, blockNumber: BigUInt?) async throws -> Data
```

#### Example

```swift
try await walletL2.callContract(transaction, blockNumber: .latest)
```

### PopulateTransaction

Designed for users who prefer a simplified approach by providing only the necessary data to create a valid EIP-712 transaction.
The only required fields are `Transaction.To` and either `Transaction.Data` or `Transaction.Value` (or both, if the method is payable).
Any other fields that are not set will be prepared by this method.

#### Inputs

| Parameter     | Type                 | Description             |
| ------------- | -------------------- | ----------------------- |
| `transaction` | `CodableTransaction` | Transaction.            |

```swift
func populateTransaction(_ transaction: inout CodableTransaction) async
```

#### Example

```swift
await walletL2.populateTransaction(transaction)
```

### `SignTransaction`

Returns a signed transaction that is ready to be broadcast to the network. The input transaction must be a valid transaction with all fields
having appropriate values. To obtain a valid transaction, you can use the [`PopulateTransaction`](#populatetransaction) method.

#### Inputs

| Parameter     | Type                 | Description             |
| ------------- | -------------------- | ----------------------- |
| `transaction` | `CodableTransaction` | Transaction.            |

```swift
func signTransaction(_ transaction: inout CodableTransaction)
```

#### Example

```swift
await walletL2.populateTransaction(transaction)
```

### `SendTransaction`

Injects a transaction into the pending pool for execution. Any unset transaction fields are prepared using the PopulateTransaction method.

#### Inputs

| Parameter     | Type                 | Description             |
| ------------- | -------------------- | ----------------------- |
| `transaction` | `CodableTransaction` | Transaction.            |

```swift
func sendTransaction(_ transaction: CodableTransaction) async throws -> TransactionSendingResult
```

#### Example

```swift
try await walletL2.sendTransaction(transaction)
```

## `BaseDeployer`

### `Init`

Creates an instance of `BaseDeployer` based on provided `AdapterL2`.

```swift
BaseDeployer(adapterL2: walletL2, signer: signer)
```

### `Deploy`

Deploys smart contract using CREATE2 opcode.

#### Inputs

| Parameter     | Type              | Description              |
| ------------- | ----------------- | ------------------------ |
| `bytecode`    | `Data`            | Smart contract bytecode. |
| `calldata`    | `Data` (optional) | Calldata.                |
| `nonce`       | `Data` (optional) | Nonce.                   |

```swift
func deploy(_ bytecode: Data, calldata: Data?, nonce: BigUInt?) async -> TransactionSendingResult
```

#### Example

```swift
let url = Bundle.main.url(forResource: "Storage", withExtension: "zbin")!
let bytecodeData = try! Data(contentsOf: url)

_ = try await deployer.deploy(bytecodeData, calldata: nil, nonce: nil)
```

### `DeployWithCreate`

Deploys smart contract using CREATE opcode.

#### Inputs

| Parameter     | Type              | Description              |
| ------------- | ----------------- | ------------------------ |
| `bytecode`    | `Data`            | Smart contract bytecode. |
| `calldata`    | `Data` (optional) | Calldata.                |
| `nonce`       | `Data` (optional) | Nonce.                   |

```swift
func deployWithCreate(_ bytecode: Data, calldata: Data?, nonce: BigUInt?) async -> TransactionSendingResult
```

#### Example

```swift
let url = Bundle.main.url(forResource: "Storage", withExtension: "zbin")!
let bytecodeData = try! Data(contentsOf: url)

_ = try await deployer.deployWithCreate(bytecodeData, calldata: nil, nonce: nil)
```

### `DeployAccount`

Deploys smart account using CREATE2 opcode.

#### Inputs

| Parameter     | Type              | Description              |
| ------------- | ----------------- | ------------------------ |
| `bytecode`    | `Data`            | Smart account bytecode.  |
| `calldata`    | `Data` (optional) | Calldata.                |
| `nonce`       | `Data` (optional) | Nonce.                   |

```swift
func deployAccount(_ bytecode: Data, calldata: Data?, nonce: BigUInt?) async -> TransactionSendingResult
```

#### Example

```swift
let url = Bundle.main.url(forResource: "Storage", withExtension: "zbin")!
let bytecodeData = try! Data(contentsOf: url)

_ = try await deployer.deployAccount(bytecodeData, calldata: nil, nonce: nil)
```

### `DeployAccountWithCreate`

Deploys smart account using CREATE opcode.

#### Inputs

| Parameter     | Type              | Description              |
| ------------- | ----------------- | ------------------------ |
| `bytecode`    | `Data`            | Smart account bytecode.  |
| `calldata`    | `Data` (optional) | Calldata.                |
| `nonce`       | `Data` (optional) | Nonce.                   |

```swift
func deployAccountWithCreate(_ bytecode: Data, calldata: Data?, nonce: BigUInt?) async -> TransactionSendingResult
```

#### Example

```swift
let url = Bundle.main.url(forResource: "Storage", withExtension: "zbin")!
let bytecodeData = try! Data(contentsOf: url)

_ = try await deployer.deployAccountWithCreate(bytecodeData, calldata: nil, nonce: nil)
```

## `Wallet`

It contains the same functions as [`WalletL1`](#walletl1), [`WalletL2`](#walletl2), and [`BaseDeployer`](#basedeployer) since it implements
the Adapter interface, and the usage of those methods is the same.

### `Init`

Creates an instance of Wallet associated with the account provided by the signer. The `clientL2` and `clientL1` parameters are optional;
if not provided, only `SignTransaction`, `Address` and `Signer` methods can be used, as the rest of the functionalities require communication with the network.

```swift
WalletL2(zkSync, ethClient: ethClient, web3: web, ethSigner: signer)
```

#### Example

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let chainId = try! zkSync.web3.eth.getChainIdPromise().wait()
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
let ethereum: web3 = try! Web3.new(URL(string: "https://rpc.ankr.com/eth_goerli")!)
let signer = BaseSigner(credentials, chainId: chainId)
let wallet = Wallet(zkSync, ethClient: ethClient, web3: web3, ethSigner: signer)
```

### `Nonce`

Returns the account nonce of the associated account. The block number can be `nil`, in which case the nonce is taken from the latest known
block.

#### Inputs

| Parameter     | Type                     | Description   |
| ------------- | ------------------------ | ------------- |
| `blockNumber` | `BlockNumber` (optional) | Block number. |

```swift
func nonce(at block: BlockNumber = .latest) async throws -> BigUInt
```

#### Example

```swift
try await wallet.nonce(at: .exact(9000))
```

### `PendingNonce`

Returns the account nonce of the associated account in the pending state. This is the nonce that should be used for the next transaction.

```swift
func pendingNonce() async throws -> BigUInt
```

#### Example

```swift
try await wallet.pendingNonce()
```
