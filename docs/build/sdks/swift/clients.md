---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Providers | zkSync Docs
---

# Providers

A Web3 Provider object provides application-layer access to underlying blockchain networks.

The [`zksync2-swift`](https://github.com/zksync-sdk/zksync2-swift) library supports provider methods from the [`web3swift`](https://github.com/web3swift-team/web3swift) library and
supplies additional functionality.

Two providers are available:

- [`ZkSyncClient`](#ZkSyncClient): Supplies the same functionality as `Web3` and extends it with zkSync-specific methods.

## `ZkSyncClient`

:::info

- This doc details zkSync Era specific methods.
- Web3Swift implementations link to their [github](https://github.com/web3swift-team/web3swift).
  :::

### `constructor`

Returns a `ZkSyncClient` object.

#### Inputs

| Parameter     | Type  | Description                 |
| ------------- | ----- | --------------------------- |
| `providerURL` | `URL` | Network RPC URL (optional). |

#### Example

```ts
var zkSync: ZkSyncClient= BaseClient(URL(string: "https://sepolia.era.zksync.dev"))
```

### `estimateFee`

Returns an estimated [`Fee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type                 | Description          |
| ------------- | -------------------- | -------------------- |
| `transaction` | `CodableTransaction` | Transaction request. |

```swift
var zkSync: ZkSyncClient= BaseClient(URL(string: "https://sepolia.era.zksync.dev"))
var transaction = CodableTransaction(to: EthereumAddress("<TO_ADDRESS>")!, value: BigUInt(7_000_000_000), from: EthereumAddress("<FROM_ADDRESS>"))

let fee = try! await zkSync.estimateFee(transaction)
```

### `estimateGas`

Returns an estimate of the amount of gas required to submit a transaction to the network.

#### Inputs

| Parameter | Type                                                                                 | Description          |
| --------- | ------------------------------------------------------------------------------------ | -------------------- |
| `_tx`     | [`TransactionRequest`](https://docs.ethers.org/v6/api/providers/#TransactionRequest) | Transaction request. |

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasTokenApprove = await provider.estimateGas({
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  to: "0x765F5AF819D818a8e8ee6ff63D8d0e8056DBE150",
  data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
});
console.log(`Gas for token approval tx: ${gasTokenApprove}`);
```

```ts
import { Provider, types, utils } from "zksync-ethers";

const ADDRESS = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";
const RECEIVER = "0xa61464658AfeAf65CccaaFD3a512b69A83B77618";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const tokenAddress = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
const paymasterAddress = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
  type: "ApprovalBased",
  token: tokenAddress,
  minimalAllowance: 1,
  innerInput: new Uint8Array(),
});

const tokenApprove = await provider.estimateGas({
  from: ADDRESS,
  to: tokenAddress,
  data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  },
});
console.log(`Gas for token approval using EIP-712 tx: ${tokenApprove}`);
```

### `estimateGasL1`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `BigUInt` object.

Calls the `zks_estimateL1ToL2` JSON-RPC method.

#### Inputs

| Parameter     | Type                 | Description          |
| ------------- | -------------------- | -------------------- |
| `transaction` | `CodableTransaction` | Transaction request. |

#### Example

```swift
var EIP712Meta = EIP712Meta()
EIP712Meta.gasPerPubdata = gasPerPubData

var transaction = CodableTransaction(
  type: .eip1559,
  to: EthereumAddress(from: "<TO>")!,
  value: BigUInt(7_000_000_000),
  data: calldata,
  eip712Meta: EIP712Meta,
  from: EThereumAddress(from: "<FROM>")!
)

let gasL1 = try! await zkSync.estimateGasL1(transaction)
```

### `estimateGasTransfer`

Returns the gas estimation for a transfer transaction.

Calls internal method [`getTransferTx`](#gettransfertx) to get the transfer transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter         | Type                                                                      | Description                      |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------- |
| `to`              | `String`                                                                  | To address.                      |
| `amount`          | `BigUInt`                                                                 | Amount of token.                 |
| `from`            | `String`                                                                  | From address.                    |
| `token`           | `String`                                                                  | Token address (optional).        |
| `options`         | [`TransactionOption`](https://docs.ethers.org/v6/api/contract/#Overrides) | TransactionOption (optional).    |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)                           | Paymaster parameters (optional). |

#### Example

```swift
let gas = try! await zkSync.web3.eth.estimateGas("<TO_ADDReSS>", amount: BigUInt(7_000_000_000))
```

### `estimateGasWithdraw`

Returns the gas estimation for a withdrawal transaction.

Calls internal method [`getWithdrawTx`](#getwithdrawtx) to get the
withdrawal transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter         | Type                                                                      | Description                      |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------- |
| `amount`          | `BigUInt`                                                                 | Amount of token.                 |
| `from`            | `String`                                                                  | From address.                    |
| `to`              | `String`                                                                  | To address (optional).           |
| `token`           | `String`                                                                  | Token address (optional).        |
| `options`         | [`TransactionOption`](https://docs.ethers.org/v6/api/contract/#Overrides) | TransactionOption (optional).    |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)                           | Paymaster parameters (optional). |

#### Example

```swift
let gas = try! await zkSync.web3.eth.estimateGasWithdraw(amount: BigUInt(7_000_000_000),
                                                        "<FROM_ADDReSS>")
```

### `estimateL1ToL2Execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter            | Type           | Description                                                      |
| -------------------- | -------------- | ---------------------------------------------------------------- |
| `to`                 | `String`       | Address of contract.                                             |
| `from`               | `String`       | Caller address.                                                  |
| `calldata`           | `Data`         | The transaction call data.                                       |
| `amount`             | `BigUInt`      | Current L2 gas value (optional).                                 |
| `gasPerPubdataByte?` | `BigNumberish` | Constant representing current amount of gas per byte (optional). |

#### Example

```swift
let mainContractAddress = try! await wallet.walletL1.mainContract()
let gasL1ToL2 = try! await zkSync.estimateL1ToL2Execute(
  to: mainContractAddress,
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  calldata: Data(hex: "0x"),
  amount: BigUInt(7_000_000_000))
```

### `allAccountBalances`

Returns all balances for confirmed tokens given by an account address.

Calls the `zks_getAllAccountBalances` JSON-RPC method.

#### Inputs

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `address` | `String` | Account address. |

#### Example

```swift
let accountBalances = try! await self.zkSync.allAccountBalances("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049")
```

### `getBalance`

Returns the user's balance as a `bigint` object for an (optional) block tag and (optional) token.

When block and token are not supplied, `committed` and `ETH` are the default values.

#### Inputs

| Parameter       | Type          | Description                                                                           |
| --------------- | ------------- | ------------------------------------------------------------------------------------- |
| `address`       | `String`      | Account address.                                                                      |
| `blockNumber`   | `BlockNumber` | Block tag for getting the balance on. Latest `committed` block is default (optional). |
| `tokenAddress?` | `String`      | Token address. ETH is default (optional).                                             |

#### Example

```swift
let tokenAddress = "0x927488F48ffbc32112F1fF721759649A89721F8F"
let ethBalance = try! await zkSync.getBalance(address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049")
let tokenBalance = try! await zkSync.getBalance(address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", blockNumber: .latest, token: tokenAddress)
```

### `blockDetails`

Returns additional zkSync-specific information about the L2 block.

Calls the `zks_getBlockDetails` JSON-RPC method.

#### Inputs

| Parameter     | Type      | Description   |
| ------------- | --------- | ------------- |
| `blockNumber` | `BigUInt` | Block number. |

#### Example

```swift
let blockDetails = try! await zkSync.blockDetails(blockNumber: BigUInt(90_000))
```

### `bridgeContracts`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

#### Example

```swift
let bridgeAddresses = try await zkSync.bridgeContracts()
```

### `l1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

Calls the `zks_getL1BatchBlockRange` JSON-RPC method.

#### Inputs

| Parameter       | Type      | Description      |
| --------------- | --------- | ---------------- |
| `l1BatchNumber` | `BigUInt` | L1 batch number. |

#### Example

```swift
let l1BatchNumber = try await zkSync.l1BatchNumber()
let l1BatchBlockRange = try await zkSync.l1BatchBlockRange(l1BatchNumber: l1BatchNumber)
```

### `l1BatchDetails`

Returns data pertaining to a given batch.

Calls the `zks_getL1BatchDetails` JSON-RPC method.

#### Inputs

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `number`  | `number` | L1 batch number. |

#### Example

```swift
let l1BatchNumber = try await zkSync.l1BatchNumber()
let l1BatchDetails = try await zkSync.l1BatchDetails(l1BatchNumber: l1BatchNumber)
```

### `l1BatchNumber`

Returns the latest L1 batch number.

Calls the `zks_getL1BatchNumber` JSON-RPC method.

#### Example

```swift
let l1BatchNumber = try await zkSync.l1BatchNumber()
```

### `getL2HashFromPriorityOp`

Returns a L2 transaction hash from L1 transaction response.

#### Inputs

| Parameter | Type                 | Description             |
| --------- | -------------------- | ----------------------- |
| `receipt` | `TransactionReceipt` | L1 transaction receipt. |

#### Example

```swift
let l1Tx = "0xcca5411f3e514052f4a4ae1c2020badec6e0998adb52c09959c5f5ff15fba3a8";
let receipt = try! await zkSync.web3.eth.transactionReceipt(Data(hex: "l1Tx")
let l2Hash = try! await wallet.walletL1.zkSync.getL2HashFromPriorityOp(receipt: receipt!)
```

### `getL2ToL1LogProof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

Calls the `zks_getL2ToL1LogProof` JSON-RPC method.

#### Inputs

| Parameter | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `txHash`  | `String` | Hash of the L2 transaction the L2 to L1 log was produced within. |
| `index`   | `Int`    | The index of the L2 to L1 log in the transaction (optional).     |

#### Example

```swift
// Any L2 -> L1 transaction can be used.
// In this case, withdrawal transaction is used.
let tx = "0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e";
let logProof = try! await wallet.walletL1.zkSync.getL2ToL1LogProof(txHash: tx, index: 0)
```

### `mainContract`

Returns the main zkSync Era smart contract address.

Calls the `zks_getMainContract` JSON-RPC method.

#### Example

```swift
let mainContractAddress = try! await wallet.walletL1.zkSync.mainContract()
```

### `getTestnetPaymaster`

Returns the testnet paymaster address if available, or null.

#### Example

```swift
let paymasterAddress = try! await wallet.walletL1.zkSync.getTestnetPaymaster()
```

### `getTransactionDetails`

Returns data from a specific transaction given by the transaction hash.

Calls the `getTransactionDetails` JSON-RPC method.

#### Inputs

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| `txHash`  | `BytesLike` | Transaction hash. |

#### Example

```swift
let TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
let transactionDetails = try! await wallet.walletL1.zkSync.transactionDetails(TX_HASH)
```

### `getTransferTx`

Returns the populated transfer transaction.

#### Inputs

| Parameter         | Type                                                                      | Description                      |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------- |
| `to`              | `String`                                                                  | To address.                      |
| `amount`          | `BigUInt`                                                                 | Amount of token.                 |
| `from`            | `String`                                                                  | From address.                    |
| `token`           | `String`                                                                  | Token address (optional).        |
| `options`         | [`TransactionOption`](https://docs.ethers.org/v6/api/contract/#Overrides) | TransactionOption (optional).    |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)                           | Paymaster parameters (optional). |

#### Example

```swift
let tx = try! await zkSync.web3.eth.getTransferTx("<TO_ADDReSS>", amount: BigUInt(7_000_000_000))
```

Retrieve populated ETH transfer transaction using paymaster to facilitate fee payment with an ERC20 token.

```swift
let token = "0x927488F48ffbc32112F1fF721759649A89721F8F" // Crown token which can be minted for free
let paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46" // Paymaster for Crown token

let paymasterInput = Paymaster.encodeApprovalBased(
    EthereumAddress(token)!,
    minimalAllowance: BigUInt(1),
    paymasterInput: Data()
)
let paymasterParams = PaymasterParams(
  paymaster: EthereumAddress(paymaster)!,
  paymasterInput: paymasterInput)

let result = try! await zkSync.web3.eth.getTransferTx(
  "<TO_ADDReSS>",
  amount: BigUInt(7_000_000_000),
  paymasterParams: paymasterParams)

let receipt = await ZkSyncTransactionReceiptProcessor(zkSync: zkSync).waitForTransactionReceipt(hash: result.hash)
```

### `getWithdrawTx`

Returns the populated withdrawal transaction.

#### Inputs

| Parameter         | Type                                                                      | Description                      |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------- |
| `amount`          | `BigUInt`                                                                 | Amount of token.                 |
| `from`            | `String`                                                                  | From address.                    |
| `to`              | `String`                                                                  | To address.                      |
| `token`           | `String`                                                                  | Token address (optional).        |
| `options`         | [`TransactionOption`](https://docs.ethers.org/v6/api/contract/#Overrides) | TransactionOption (optional).    |
| `paymasterParams` | [`PaymasterParams`](./types.md#paymasterparams)                           | Paymaster parameters (optional). |

#### Examples

Retrieve populated ETH withdrawal transactions.

```swift
let result = try! await zkSync.getWithdrawTx(BigUInt(7_000_000_000), from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", to: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", token: nil, options:
nil, paymasterParams: nil)
```

Retrieve populated ETH withdrawal transaction using paymaster to facilitate fee payment with an ERC20 token.

```swift
let token = "0x927488F48ffbc32112F1fF721759649A89721F8F" // Crown token which can be minted for free
let paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46" // Paymaster for Crown token

let paymasterInput = Paymaster.encodeApprovalBased(
    EthereumAddress(token)!,
    minimalAllowance: BigUInt(1),
    paymasterInput: Data()
)
let paymasterParams = PaymasterParams(
  paymaster: EthereumAddress(paymaster)!,
  paymasterInput: paymasterInput)

let result = try! await zkSync.getWithdrawTx(BigUInt(7_000_000_000), from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", to: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", token: nil, options:
nil, paymasterParams: paymasterParams)
```

### `l1ChainId`

Returns the chain id of the underlying L1.

Calls the `zks_L1ChainId` JSON-RPC method.

#### Example

```ts
let result = try! await zkSync.L1ChainId()
```

### `l1TokenAddress`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `token`   | `String` | The address of the token on L2. |

#### Example

```swift
let result = try! await zkSync.l1TokenAddress(address: "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b")
```

### `l2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `token`   | `String` | The address of the token on L1. |

#### Example

```swift
let result = try! await zkSync.l2TokenAddress(address: "0x5C221E77624690fff6dd741493D735a17716c26B")
```
