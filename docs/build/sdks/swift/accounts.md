---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Accounts | zkSync Docs
---

# Accounts

## Overview

`zksync2-swift` uses following classes that can sign transactions on zkSync:

- `Wallet`
- `BaseSigner` class that is used to sign `EIP712`_-typed_ zkSync transactions.

## `Wallet`

### `constructor`

#### Inputs

| Parameter  | Type         | Description                     |
| ---------- | ------------ | ------------------------------- |
| `walletL1` | WalletL1     | Instance of WalletL1 class.     |
| `walletL2` | WalletL2     | Instance of WalletL2 class.     |
| `deployer` | BaseDeployer | Instance of BaseDeployer class. |

## `WalletL1` and `WalletL2`

### `constructor`

#### Inputs

| Parameter   | Type           | Description                       |
| ----------- | -------------- | --------------------------------- |
| `zkSync`    | ZkSyncClient   | Instance of ZkSyncClient class.   |
| `ethClient` | EthereumClient | Instance of EthereumClient class. |
| `web`       | Web3           | Instance of Web3 class.           |

## `BaseDeployer`

### `constructor`

#### Inputs

| Parameter | Type         | Description                     |
| --------- | ------------ | ------------------------------- |
| `zkSync`  | ZkSyncClient | Instance of ZkSyncClient class. |
| `web`     | Web3         | Instance of Web3 class.         |
| `signer`  | ETHSigner    | Instance of ETHSigner class.    |

#### Example

```swift
let credentials = Credentials("<WALLET_PRIVATE_KEY>")

let l1Web3 = EthereumClientImpl(ZKSyncWeb3RpcIntegrationTests.L1NodeUrl)
let zkSync = BaseClient(BaseIntegrationEnv.L2NodeUrl)
let signerL1 = BaseSigner(credentials,
                        chainId: chainId)
let signerL2 = BaseSigner(credentials,
                          chainId: BigUInt(270))
let walletL1 = WalletL1(zkSync, ethClient: l1Web3, web3: l1Web3.web3, ethSigner: signer)
let walletL2 = WalletL2(zkSync, ethClient: l1Web3, web3: zkSync.web3, ethSigner: signerL2)
let baseDeployer = BaseDeployer(adapterL2: walletL2, signer: signerL2)
let wallet = Wallet(walletL1: walletL1, walletL2: walletL2, deployer: baseDeployer)
```

### `mainContract`

#### Inputs

| Parameter     | Type               | Description                                                                       |
| ------------- | ------------------ | --------------------------------------------------------------------------------- |
| `transaction` | CodableTransaction | Template transaction which will be used for `writeOperation` and `readOperation`. |

Returns `Contract` wrapper of the zkSync smart contract.

#### Example

```swift
let result = try! await wallet.walletL1.mainContract()
```

```swift
let transaction = CodableTransaction(type: .eip1559, to: EthereumAddress(signer.address)!)

let result = try! await wallet.walletL1.mainContract(transaction: transaction)
```

### `getL1BridgeContracts`

Returns L1 bridge contracts.

:::note

There is no separate Ether bridge contract, [Main contract](./accounts.md#maincontract) is used instead.

:::

#### Example

```swift
let result = try! await wallet.walletL1.getL1BridgeContracts()
```

### `getAddress`

Returns the wallet address.

### Example

```ts
let result = try! await wallet.walletL1.getAddress()
```

### `balance`

Returns the amount of the token the `Wallet` has.

#### Inputs

| Parameter     | Type          | Description                                                                                                      |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `token`       | `String`      | The address of the token. ETH by default (optional).                                                             |
| `blockNumber` | `BlockNumber` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

#### Example

```ts
let result = try! await wallet.walletL2.balance()
```

### `balanceL1`

Returns the amount of the token the `Wallet` has on Ethereum.

#### Inputs

| Parameter   | Type       | Description                                                                                                                 |
| ----------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `token?`    | `Address`  | The address of the token. ETH by default (optional).                                                                        |
| `blockTag?` | `BlockTag` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option (optional). |

#### Example

```ts
import { Wallet, Provider, utils } from "zksync-ethers";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be";

console.log(`Token balance: ${await wallet.getBalanceL1(tokenL1)}`);
```

### `allBalances`

Returns all balances for confirmed tokens given by an account address.

#### Example

```ts
let result = try! await wallet.walletL2.allBalances()
```

### `getNonce`

Returns account's nonce number.

#### Inputs

| Parameter | Type          | Description                                                                                                                 |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `block`   | `BlockNumber` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option (optional). |

#### Example

```ts
let result = try! await wallet.walletL2.getNonce()
```

### `getDeploymentNonce`

Returns account's deployment nonce number.

```ts
async getDeploymentNonce(): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync-ethers";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Nonce: ${await wallet.getDeploymentNonce()}`);
```

### `signTransaction`

Returns new and signed CodableTransaction.

#### Inputs

| Parameter     | Type               | Description          |
| ------------- | ------------------ | -------------------- |
| `transaction` | CodableTransaction | Transaction request. |

#### Example

```ts
let transaction = CodableTransaction(type: .eip1559, to: EthereumAddress(signer.address)!)

let result = wallet.walletL2.signTransaction(transaction)
```

### `sendTransaction`

Broadcast the transaction to the network.

#### Inputs

| Parameter    | Type               | Description          |
| ------------ | ------------------ | -------------------- |
| `tranaction` | CodableTransaction | Transaction request. |

#### Example

```ts
let transaction = CodableTransaction(type: .eip1559, to: EthereumAddress(signer.address)!)

let signed = wallet.walletL2.signTransaction(transaction)
let result = try! await wallet.walletL2.sendTransaction(signed)
```

### `transfer`

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

#### Inputs

| Parameter         | Type                                                | Description                                                                                         |
| ----------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `to`              | `String`                                            | The address of the recipient.                                                                       |
| `amount`          | `BigUInt`                                           | The amount of the token to transfer (optional).                                                     |
| `token`           | `String`                                            | The address of the token. `ETH` by default (optional).                                              |
| `options`         | [`TransactionOption`](./types.md#transactionoption) | Transaction's options which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)     | Paymaster parameters (optional).                                                                    |

#### Examples

Transfer ETH.

```swift
let amount = BigUInt(7_000_000_000)

let result = await wallet.walletL2.transfer("<RECEPIENT_ADDRESS>", amount: amount)

let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result.hash)
```

Transfer ETH using paymaster to facilitate fee payment with an ERC20 token.

```swift
let amount = BigUInt(7_000_000_000)

let paymasterInput = Paymaster.encodeApprovalBased(
  EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterToken)!,
  minimalAllowance: BigUInt(1),
  paymasterInput: Data()
)

let paymasterParams = PaymasterParams(paymaster: EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterAddress)!, paymasterInput: paymasterInput)

let result = await wallet.walletL2.transfer("<RECEPIENT_ADDRESS>", amount: amount, token: ZkSyncAddresses.EthAddress, options: nil, paymasterParams: paymasterParams)

let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result.hash)
```

### `getAllowanceL1`

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter       | Type      | Description                                                                                                      |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `token`         | `String`  | The Ethereum address of the token.                                                                               |
| `bridgeAddress` | `String?` | The address of the bridge contract to be used. Defaults to the default zkSync bridge `L1Erc20Bridge` (optional). |

#### Example

```swift
let tokenL1 = "0x5C221E77624690fff6dd741493D735a17716c26B";
let result = try await wallet.walletL1.getAllowanceL1(token: tokenL1)
```

### `approveERC20`

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

#### Inputs

| Parameter       | Type           | Description                                                                                                      |
| --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `token`         | `Address`      | The Ethereum address of the token.                                                                               |
| `amount`        | `BigNumberish` | The amount of the token to be approved.                                                                          |
| `bridgeAddress` | `String?`      | The address of the bridge contract to be used. Defaults to the default zkSync bridge `L1Erc20Bridge` (optional). |

#### Example

```swift
let tokenL1 = "0x5C221E77624690fff6dd741493D735a17716c26B";
let result = try await wallet.walletL1.approveERC20(token: tokenL1, amount: BigUInt(5))
```

### `getBaseCost`

Returns base cost for L2 transaction.

#### Inputs

| Name                | Type      | Description                                                                                       |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `gasLimit`          | `BigUInt` | The `gasLimit` for the L2 contract call.                                                          |
| `gasPerPubdataByte` | `BigUInt` | The L2 gas price for each published L1 calldata byte (optional).                                  |
| `gasPrice`          | `BigUInt` | The L1 gas price of the L1 transaction that will send the request for an execute call (optional). |

#### Example

```swift
let result = try await wallet.walletL1.baseCost(gasLimit: BigUInt(100_000))["0"] as? BigUInt else {
  throw EthereumProviderError.invalidParameter
}
```

### `deposit`

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `transaction.bridgeAddress`). In this case, `transaction.approveERC20` can be enabled to perform token approval. If there are
already enough approved tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge,
use the [`allowanceL1`](#getallowancel1) method.

#### Inputs

| Parameter     | Type                                                  | Description                |
| ------------- | ----------------------------------------------------- | -------------------------- |
| `transaction` | [`Deposittransaction`](./types.md#deposittransaction) | DepositTransaction struct. |

#### Example

```swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let txERC20 = DepositTransaction(token: token, amount: BigUInt(10000000), approveERC20: true)

let resultERC20 = try! await wallet.walletL1.deposit(transaction: txERC20)
let receiptERC20 = try! await wallet.walletL1.ethClient.waitforTransactionReceipt(transactionHash: resultERC20.hash, timeout: 120, pollLatency: 0.5)

let l2HashERC20 = try! await wallet.walletL1.zkSync.getL2HashFromPriorityOp(receipt: receiptERC20!)
let l2receiptERC20 = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: l2HashERC20!)

let txETH = DepositTransaction(token: ZkSyncAddresses.EthAddress, amount: amount)

let resultEth = try! await wallet.walletL1.deposit(transaction: txETH)
let receiptEth = try! await wallet.walletL1.ethClient.waitforTransactionReceipt(transactionHash: resultEth.hash, timeout: 120, pollLatency: 0.5)

let l2HashEth = try! await wallet.walletL1.zkSync.getL2HashFromPriorityOp(receipt: receiptEth!)
let l2receiptEth = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: l2HashEth!)
```

### `getDepositTransaction`

Returns populated deposit transaction.

#### Inputs

| Parameter     | Type                                                  | Description                |
| ------------- | ----------------------------------------------------- | -------------------------- |
| `transaction` | [`Deposittransaction`](./types.md#deposittransaction) | DepositTransaction struct. |

#### Example

```swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let tx = DepositTransaction(token: tokenL1, amount: BigUInt(10000000), approveERC20: true)

let resultERC20 = try! await wallet.walletL1.getDepositTransaction(transaction: tx)
```

### `estimateGasDeposit`

Estimates the amount of gas required for a deposit transaction on L1 network. Gas of approving ERC20 token is not included in estimation.

#### Inputs

| Parameter     | Type                                                  | Description                |
| ------------- | ----------------------------------------------------- | -------------------------- |
| `transaction` | [`Deposittransaction`](./types.md#deposittransaction) | DepositTransaction struct. |

#### Example

```swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let tx = DepositTransaction(token: tokenL1, amount: BigUInt(10000000), approveERC20: true)

let gas = try! await wallet.walletL1.estimateGasDeposit(transaction: tx)
```

### `getFullRequiredDepositFee`

Retrieves the full needed ETH fee for the deposit. Returns the L1 fee and the L2 fee [`FullDepositFee`](./types.md#fulldepositfee).

#### Inputs

| Parameter     | Type                                                  | Description                |
| ------------- | ----------------------------------------------------- | -------------------------- |
| `transaction` | [`Deposittransaction`](./types.md#deposittransaction) | DepositTransaction struct. |

#### Example

```swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let tx = DepositTransaction(token: tokenL1, amount: BigUInt(10000000), approveERC20: true)

let fullDepositFee = try! await wallet.walletL1.getFullRequiredDepositFee(transaction: tx)
```

### `withdraw`

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Parameter         | Type                                                | Description                                                                                         |
| ----------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `amount`          | `BigNumberish`                                      | The amount of the token to withdraw.                                                                |
| `token`           | `Address`                                           | The address of the token. `ETH` by default.                                                         |
| `to`              | `Address`                                           | The address of the recipient on L1 (optional).                                                      |
| `options`         | [`TransactionOption`](./types.md#transactionoption) | Transaction's options which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)     | Paymaster parameters (optional).                                                                    |

#### Examples

Withdraw ETH.

````swift
let result = try! await wallet.walletL2.withdraw(BigUInt(10_000_000), to: nil, token: ZkSyncAddresses.EthAddress)
let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result!.hash)

// It should return false
let isFinalized = await wallet.walletL1.isWithdrawalFinalized(withdrawHash: result!.hash)

let finalizedWithdraw = try! await wallet.walletL1.finalizeWithdrawal(withdrawalHash: result!.hash)```
````

Withdraw ETH using paymaster to facilitate fee payment with an ERC20 token.

````swift
let paymasterInput = Paymaster.encodeApprovalBased(
    EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterToken)!,
    minimalAllowance: BigUInt(1),
    paymasterInput: Data()
)
let paymasterParams = PaymasterParams(paymaster: EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterAddress)!, paymasterInput: paymasterInput)

let result = try! await wallet.walletL2.withdraw(BigUInt(10_000_000), to: nil, token: ZkSyncAddresses.EthAddress, paymasterParams: paymasterParams)
let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result!.hash)

// It should return false
let isFinalized = await wallet.walletL1.isWithdrawalFinalized(withdrawHash: result!.hash)

let finalizedWithdraw = try! await wallet.walletL1.finalizeWithdrawal(withdrawalHash: result!.hash)```
````

Withdraw ERC20.

````swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let l2DAI = try! await zkSync.l2TokenAddress(address: tokenL1)

let result = try! await wallet.walletL2.withdraw(BigUInt(5), to: nil, token: l2DAI)
let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result!.hash)

// It should return false
let isFinalized = await wallet.walletL1.isWithdrawalFinalized(withdrawHash: result!.hash)

let finalizedWithdraw = try! await wallet.walletL1.finalizeWithdrawal(withdrawalHash: result!.hash)```
````

Withdraw ERC20 using paymaster to facilitate fee payment with an ERC20 token.

````swift
let tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
let l2DAI = try! await zkSync.l2TokenAddress(address: tokenL1)

let paymasterInput = Paymaster.encodeApprovalBased(
    EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterToken)!,
    minimalAllowance: BigUInt(1),
    paymasterInput: Data()
)
let paymasterParams = PaymasterParams(paymaster: EthereumAddress(ZkSyncWalletIntegrationTests.PaymasterAddress)!, paymasterInput: paymasterInput)

let result = try! await wallet.walletL2.withdraw(BigUInt(5), to: nil, token: l2DAI, paymasterParams: paymasterParams)
let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result!.hash)

// It should return false
let isFinalized = await wallet.walletL1.isWithdrawalFinalized(withdrawHash: result!.hash)

let finalizedWithdraw = try! await wallet.walletL1.finalizeWithdrawal(withdrawalHash: result!.hash)```
````

### `finalizeWithdrawal`

Proves the inclusion of the L2 -> L1 withdrawal message.

#### Inputs

| Name             | Type                                                | Description                                                                                                                                         |
| ---------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withdrawalHash` | `String`                                            | Hash of the L2 transaction where the withdrawal was initiated.                                                                                      |
| `index`          | `Int`                                               | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. Defaults to 0 (optional). |
| `options`        | [`TransactionOption`](./types.md#transactionoption) | Transaction's options which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional).                                                 |

#### Example

````swift
let finalizedWithdraw = try! await wallet.walletL1.finalizeWithdrawal(withdrawalHash: "<WITHDRAW_HASH>")```
````

### `isWithdrawalFinalized`

Returns whether the withdrawal transaction is finalized on the L1 network.

#### Inputs

| Name             | Type     | Description                                                                                                                                         |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withdrawalHash` | `String` | Hash of the L2 transaction where the withdrawal was initiated.                                                                                      |
| `index`          | `Int`    | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. Defaults to 0 (optional). |

#### Example

```swift
let isFinalized = await wallet.walletL1.isWithdrawalFinalized(withdrawHash: "<WITHDRAW_HASH>")
```

### `requestExecute`

Request execution of L2 transaction from L1.

#### Inputs

| Parameter     | Type                                                                | Description                       |
| ------------- | ------------------------------------------------------------------- | --------------------------------- |
| `transaction` | [`RequestExecuteTransaction`](./types.md#RequestExecuteTransaction) | RequestExecuteTransaction struct. |

#### Example

```swift
let tx = RequestExecuteTransaction(contractAddress: mainContractAddress, calldata: Data(hex: "0x"), l2Value: BigUInt(7_000_000_000), l2GasLimit: BigUInt(900_000))

let resultEth = try! await wallet.walletL1.deposit(transaction: txETH)
let receiptEth = try! await wallet.walletL1.ethClient.waitforTransactionReceipt(transactionHash: resultEth.hash, timeout: 120, pollLatency: 0.5)

let l2HashEth = try! await wallet.walletL1.zkSync.getL2HashFromPriorityOp(receipt: receiptEth!)
let l2receiptEth = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: l2HashEth!)
```

### `getRequestExecute`

Returns populated CodableTransaction.

#### Inputs

| Parameter     | Type                                                                | Description                       |
| ------------- | ------------------------------------------------------------------- | --------------------------------- |
| `transaction` | [`RequestExecuteTransaction`](./types.md#RequestExecuteTransaction) | RequestExecuteTransaction struct. |

#### Example

```swift
let tx = RequestExecuteTransaction(contractAddress: mainContractAddress, calldata: Data(hex: "0x"), l2Value: BigUInt(7_000_000_000))

let requestExecuteTx = try! await wallet.walletL1.getRequestExecute(transaction: tx)
```

### `estimateGasRequestExecute`

Estimates the amount of gas required for a request execute transaction.

#### Inputs

| Parameter     | Type                                                                | Description                       |
| ------------- | ------------------------------------------------------------------- | --------------------------------- |
| `transaction` | [`RequestExecuteTransaction`](./types.md#RequestExecuteTransaction) | RequestExecuteTransaction struct. |

#### Example

```swift
let tx = RequestExecuteTransaction(contractAddress: mainContractAddress, calldata: Data(hex: "0x"), l2Value: BigUInt(7_000_000_000))

let gas = try! await wallet.walletL1.estimateGasRequestExecute(transaction: tx)
```

## `ETHSigner`

Provides support for an EIP712 transaction. The methods of this class are mostly used internally.

### `getDomain`

Returns the EIP712 domain.
