---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Accounts | zkSync Docs
---

# Accounts

## Overview

`zksync2-java` uses following classes that can sign transactions on zkSync:

- `Wallet`
- `EthSigner` class that is used to sign `EIP712`_-typed_ zkSync transactions.

## `Wallet`

### `constructor`

#### Inputs

| Parameter     | Type        | Description                                                 |
| ------------- | ----------- | ----------------------------------------------------------- |
| `providerL1`  | Web3j       | Instance of Web3j class.                                    |
| `providerL2`  | ZkSync      | A zkSync node provider. Needed for interaction with zkSync. |
| `credentials` | Credentials | An Ethereum node provider. Needed for interaction with L1.  |

### `getMainContract`

Returns `Contract` wrapper of the zkSync smart contract.

#### Example

```java
IZkSync mainContract = testWallet.getMainContract()
```

### `getL1BridgeContracts`

Returns L1 bridge contracts.

:::note

There is no separate Ether bridge contract, [Main contract](./accounts.md#getMainContract) is used instead.

:::

#### Example

```java
L1BridgeContracts l1BridgeContracts = wallet.getL1BridgeContracts();
```

### `getAddress`

Returns the wallet address.

### Example

```java
String address = wallet.getAddress();
```

### `getBalance`

Returns the amount of the token the `Wallet` has.

```java
BigInteger ethBalance = wallet.getBalance().sendAsync().join();
```

#### Inputs

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `token`   | `String` | The address of the token. ETH by default (optional). |

#### Example

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = wallet.l2TokenAddress(L1_DAI);

BigInteger tokenBalance = wallet.getBalance(l2DAI).sendAsync().join();
```

#### Inputs

| Parameter     | Type          | Description                                                                                                      |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `address`     | `String`      | The address of the wallet.                                                                                       |
| `token`       | `String`      | The address of the token. ETH by default.                                                                        |
| `blockNumber` | `BlockNumber` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

#### Example

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = wallet.l2TokenAddress(L1_DAI);

BigInteger tokenBalance = wallet.getBalance(signer.getAddress(), l2DAI, ZkBlockParameterName.COMMITTED).sendAsync().join();
```

### `balanceL1`

Returns the amount of the token the `Wallet` has on Ethereum.

```java
BigInteger ethBalance = wallet.getBalance().sendAsync().join();
```

#### Inputs

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `token`   | `String` | The address of the token. ETH by default (optional). |

#### Example

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = wallet.l2TokenAddress(L1_DAI);

BigInteger tokenBalance = wallet.getBalance(l2DAI).sendAsync().join();
```

#### Inputs

| Parameter     | Type          | Description                                                                                                      |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `address`     | `String`      | The address of the wallet.                                                                                       |
| `token`       | `String`      | The address of the token. ETH by default.                                                                        |
| `blockNumber` | `BlockNumber` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

#### Example

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = wallet.l2TokenAddress(L1_DAI);

BigInteger tokenBalance = wallet.getBalance(signer.getAddress(), l2DAI, ZkBlockParameterName.COMMITTED).sendAsync().join();
```

### `getAllBalances`

Returns all balances for confirmed tokens given by an account address.

#### Example

```java
ZksAccountBalances allBalances = wallet.getAddress().join();
```

### `getNonce`

Returns account's nonce number.

#### Inputs

| Parameter | Type                    | Description                                                                                                                 |
| --------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `at`      | `DefaultBlockParameter` | In which block a balance should be checked on. `committed`, i.e. the latest processed one is the default option (optional). |

#### Example

```java
BigInteger nonce = wallet.getNonce().sendAsync().join();
```

### `getDeploymentNonce`

Returns account's deployment nonce number.

#### Example

```java
BigInteger deploymentNonce = wallet.getDeploymentNonce().join()
```

### `estimateAndSend`

Estimate and send the transaction to the network.

#### Inputs

| Parameter              | Type        | Description                                                                 |
| ---------------------- | ----------- | --------------------------------------------------------------------------- |
| `transaction`          | Transaction | Transaction request.                                                        |
| `nonce`                | BigInteger  | Nonce to use in the transaction.                                            |
| `maxPriorityFeePerGas` | BigInteger  | Max priority fee per gas to use in the transaction, default is 0.(optional) |

#### Example

```java
Transaction tx = Transaction.createEthCallTransaction("<FROM_ADDRESS>", "<TO_ADDRESS", "0x", BigInteger.valueOf(7_000_000_000L));
BigInteger nonce = wallet.getNonce().sendAsync().join();

EthSendTransaction result = wallet.estimateAndSend(tx, nonce).sendAsync().join();
```

### `transfer`

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

#### Inputs

| Parameter     | Type                  | Description                |
| ------------- | --------------------- | -------------------------- |
| `transaction` | `TransferTransaction` | TransferTransaction class. |

#### Examples

Transfer ETH.

```java
TransferTransaction transaction = new TransferTransaction("<RECEPIENT_ADDRESS>", BigInteger(7_000_000_000L), signer.getAddress());

TransactionReceipt receipt = wallet.transfer(transaction).sendAsync().join();

wallet.getTransactionReceiptProcessor().waitForTransactionReceipt(receipt.getTransactionHash());
```

Transfer ETH using paymaster to facilitate fee payment with an ERC20 token.

```java
PaymasterParams paymasterParams = new PaymasterParams(PAYMASTER, Numeric.hexStringToByteArray(FunctionEncoder.encode(Paymaster.encodeApprovalBased(TOKEN, BigInteger.ONE, new byte[] {}))));
TransferTransaction transaction = new TransferTransaction("<RECEPIENT_ADDRESS>", BigInteger(7_000_000_000L), signer.getAddress(), paymasterParams);

TransactionReceipt receipt = wallet.transfer(transaction).sendAsync().join();

wallet.getTransactionReceiptProcessor().waitForTransactionReceipt(receipt.getTransactionHash());
```

### `l2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `l1Address` | `String` | The address of the token on L1. |

#### Example

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"

String l2Address = wallet.l2TokenAddress(L1_DAI).sendAsync().join();
```

### `getAllowanceL1`

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter       | Type     | Description                                                                                                                               |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `token`         | `String` | The Ethereum address of the token.                                                                                                        |
| `bridgeAddress` | `String` | The address of the bridge contract to be used. Defaults to the default zkSync bridge, either `L1EthBridge` or `L1Erc20Bridge` (optional). |

#### Example

```java
String L1_DAI = "0x5C221E77624690fff6dd741493D735a17716c26B";

BigInteger allowanceL1 = wallet.getAllowanceL1(L1_DAI).join();
```

### `approveERC20`

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

#### Inputs

| Parameter       | Type         | Description                                                                                                                               |
| --------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `token`         | `String`     | The Ethereum address of the token.                                                                                                        |
| `amount`        | `BigInteger` | The amount of the token to be approved.                                                                                                   |
| `bridgeAddress` | `String`     | The address of the bridge contract to be used. Defaults to the default zkSync bridge, either `L1EthBridge` or `L1Erc20Bridge` (optional). |

#### Example

```java
String L1_DAI = "0x5C221E77624690fff6dd741493D735a17716c26B";

TransactionReceipt tx = wallet.approveERC20(L1_DAI, BigInteger.valueOf(5)).join();
```

### `getBaseCost`

Returns base cost for L2 transaction.

#### Inputs

| Name                | Type         | Description                                                                                       |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `gasLimit`          | `BigInteger` | The `gasLimit` for the L2 contract call.                                                          |
| `gasPerPubdataByte` | `BigInteger` | The L2 gas price for each published L1 calldata byte (optional).                                  |
| `gasPrice`          | `BigInteger` | The L1 gas price of the L1 transaction that will send the request for an execute call (optional). |

#### Example

```java
BigInteger baseCost = wallet.getBaseCost(BigInteger.valueOf(100_000));
```

### `deposit`

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `transaction.bridgeAddress`). In this case, `transaction.approveERC20` can be enabled to perform token approval. If there are
already enough approved tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge,
use the [`allowanceL1`](#getallowancel1) method.

#### Inputs

| Parameter     | Type                 | Description               |
| ------------- | -------------------- | ------------------------- |
| `transaction` | `DepositTransaction` | DepositTransaction class. |

#### Example

Deposit ETH

```java
BigInteger amount = new BigInteger("7000000000");
DepositTransaction transaction = new DepositTransaction(ZkSyncAddresses.ETH_ADDRESS, amount);

EthSendTransaction hash = testWallet.deposit(transaction).send();
// Wait for l1 receipt
TransactionReceipt l1Receipt = processorL1.waitForTransactionReceipt(hash.getTransactionHash());
// Get l2 hash from l1 receipt
String l2Hash = zksync.getL2HashFromPriorityOp(l1Receipt, zksync.zksMainContract().sendAsync().join().getResult());
// Wait for l2 receipt
TransactionReceipt l2Receipt = wallet.getTransactionReceiptProcessor().waitForTransactionReceipt(l2Hash);
```

Deposit ERC20 token

```java
String L1_DAI = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = testWallet.l2TokenAddress(L1_DAI);

DepositTransaction transaction = new DepositTransaction(L1_DAI, BigInteger.valueOf(5));

EthSendTransaction hash = testWallet.deposit(transaction).send();
// Wait for l1 receipt
TransactionReceipt l1Receipt = processorL1.waitForTransactionReceipt(hash.getTransactionHash());
// Get l2 hash from l1 receipt
String l2Hash = zksync.getL2HashFromPriorityOp(l1Receipt, zksync.zksMainContract().sendAsync().join().getResult());
// Wait for l2 receipt
TransactionReceipt l2Receipt = wallet.getTransactionReceiptProcessor().waitForTransactionReceipt(l2Hash);
```

### `getDepositTransaction`

Returns populated deposit transaction.

#### Inputs

| Parameter     | Type                 | Description               |
| ------------- | -------------------- | ------------------------- |
| `transaction` | `DepositTransaction` | DepositTransaction class. |

#### Example

```java
BigInteger amount = new BigInteger("7000000000");
DepositTransaction transaction = new DepositTransaction(ZkSyncAddresses.ETH_ADDRESS, amount);
```

### `estimateGasDeposit`

Estimates the amount of gas required for a deposit transaction on L1 network. Gas of approving ERC20 token is not included in estimation.

#### Inputs

| Parameter     | Type                 | Description               |
| ------------- | -------------------- | ------------------------- |
| `transaction` | `DepositTransaction` | DepositTransaction class. |

#### Example

```java
BigInteger amount = new BigInteger("7000000000");
DepositTransaction transaction = new DepositTransaction(ZkSyncAddresses.ETH_ADDRESS, amount);
BigInteger result = testWallet.estimateGasDeposit(transaction);
```

### `getFullRequiredDepositFee`

Retrieves the full needed ETH fee for the deposit. Returns the L1 fee and the L2 fee [`FullDepositFee`](./types.md#fulldepositfee).

#### Inputs

| Parameter     | Type                 | Description               |
| ------------- | -------------------- | ------------------------- |
| `transaction` | `DepositTransaction` | DepositTransaction class. |

#### Example

```java
BigInteger amount = new BigInteger("7000000000");
DepositTransaction transaction = new DepositTransaction(ZkSyncAddresses.ETH_ADDRESS, amount);
BigInteger result = testWallet.getFullRequiredDepositFee(transaction);
```

### `withdraw`

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Parameter     | Type                 | Description               |
| ------------- | -------------------- | ------------------------- |
| `transaction` | `DepositTransaction` | DepositTransaction class. |

#### Examples

Withdraw ETH.

```java
BigInteger amount = new BigInteger("7000000000");
WithdrawTransaction transaction = new WithdrawTransaction(ZkSyncAddresses.ETH_ADDRESS, amount, testWallet.getAddress());

TransactionReceipt result = testWallet.withdraw(transaction).sendAsync().join();

TransactionReceipt receipt = testWallet.getTransactionReceiptProcessor().waitForTransactionReceipt(result.getTransactionHash());
```

Withdraw ETH using paymaster to facilitate fee payment with an ERC20 token.

```java
BigInteger amount = new BigInteger("7000000000");
String token = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
String paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

PaymasterParams paymasterParams = new PaymasterParams(paymaster, Numeric.hexStringToByteArray(FunctionEncoder.encode(Paymaster.encodeApprovalBased(token, BigInteger.ONE, new byte[]
 {}))));
WithdrawTransaction transaction = new WithdrawTransaction(ZkSyncAddresses.ETH_ADDRESS, amount, paymasterParams);

TransactionReceipt result = testWallet.withdraw(transaction).sendAsync().join();

TransactionReceipt receipt = testWallet.getTransactionReceiptProcessor().waitForTransactionReceipt(result.getTransactionHash());
```

Withdraw ERC20.

```java
BigInteger amount = BigInteger.valueOf(5);
String tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = testWallet.l2TokenAddress(L1_DAI);

WithdrawTransaction transaction = new WithdrawTransaction(l2DAI, amount, testWallet.getAddress());
TransactionReceipt result = testWallet.withdraw(transaction).sendAsync().join();
TransactionReceipt receipt = testWallet.getTransactionReceiptProcessor().waitForTransactionReceipt(result.getTransactionHash());
```

Withdraw ERC20 using paymaster to facilitate fee payment with an ERC20 token.

```java
BigInteger amount = BigInteger.valueOf(5);
String tokenL1 = "0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be"
String l2DAI = testWallet.l2TokenAddress(L1_DAI);

String token = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
String paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

PaymasterParams paymasterParams = new PaymasterParams(paymaster, Numeric.hexStringToByteArray(FunctionEncoder.encode(Paymaster.encodeApprovalBased(token, BigInteger.ONE, new byte[]
 {}))));

WithdrawTransaction transaction = new WithdrawTransaction(l2DAI, amount, testWallet.getAddress(), paymasterParams);
TransactionReceipt result = testWallet.withdraw(transaction).sendAsync().join();
TransactionReceipt receipt = testWallet.getTransactionReceiptProcessor().waitForTransactionReceipt(result.getTransactionHash());
```

### `finalizeWithdraw`

Proves the inclusion of the L2 -> L1 withdrawal message.

#### Inputs

| Name             | Type     | Description                                                                                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `withdrawalHash` | `String` | Hash of the L2 transaction where the withdrawal was initiated.                                                                           |
| `index`          | `Int`    | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. Defaults to 0. |

#### Example

```java
WithdrawTransaction transaction = wallet.finalizeWithdraw("<WITHDRAW_HASH>", 0).sendAsync().join();
```

### `requestExecute`

Request execution of L2 transaction from L1.

#### Inputs

| Parameter     | Type                        | Description                       |
| ------------- | --------------------------- | --------------------------------- |
| `transaction` | `RequestExecuteTransaction` | RequestExecuteTransaction struct. |

#### Example

```java
RequestExecuteTransaction transaction = new RequestExecuteTransaction(null, zksync.zksMainContract().send().getResult(), Numeric.hexStringToByteArray("0x"), BigInteger.valueOf(7000000), null, null, null, null, null);
EthSendTransaction result = testWallet.requestExecute(transaction);
// Wait for l1 receipt
TransactionReceipt l1Receipt = processorL1.waitForTransactionReceipt(hash.getTransactionHash());
// Get l2 hash from l1 receipt
String l2Hash = zksync.getL2HashFromPriorityOp(l1Receipt, zksync.zksMainContract().sendAsync().join().getResult());
// Wait for l2 receipt
TransactionReceipt l2Receipt = wallet.getTransactionReceiptProcessor().waitForTransactionReceipt(l2Hash);
```

### `getRequestExecute`

Returns populated RequestExecuteTransaction.

#### Inputs

| Parameter     | Type                        | Description                       |
| ------------- | --------------------------- | --------------------------------- |
| `transaction` | `RequestExecuteTransaction` | RequestExecuteTransaction struct. |

#### Example

```java
RequestExecuteTransaction transaction = new RequestExecuteTransaction(null, zksync.zksMainContract().send().getResult(), Numeric.hexStringToByteArray("0x"), BigInteger.valueOf(7000000), null, null, null, null, null);
RequestExecuteTransaction result = testWallet.getRequestExecute(transaction);
```

### `estimateGasRequestExecute`

Estimates the amount of gas required for a request execute transaction.

#### Inputs

| Parameter     | Type                        | Description                       |
| ------------- | --------------------------- | --------------------------------- |
| `transaction` | `RequestExecuteTransaction` | RequestExecuteTransaction struct. |

#### Example

```java
RequestExecuteTransaction transaction = new RequestExecuteTransaction(null, zksync.zksMainContract().send().getResult(), Numeric.hexStringToByteArray("0x"), BigInteger.valueOf(7000000), null, null, null, null, null);
BigInteger baseGasLimit = estimateGasRequestExecute(transaction.toRequestExecute(mainContractAddress)).sendAsync().join().getAmountUsed();
```

## `ETHSigner`

Provides support for an EIP712 transaction. The methods of this class are mostly used internally.

### `getDomain`

Returns the EIP712 domain.

### `signTypedData`

Signs typed struct using ethereum private key by EIP-712 signature standard.

| Parameter   | Type           | Description       |
| ----------- | -------------- | ----------------- |
| `domain`    | `Eip712Domain` | EIP712 domain.    |
| `typedData` | `S`            | EIP712 structure. |

### `signMessage`

Signs typed struct using ethereum private key by EIP-712 signature standard.

| Parameter   | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| `message`   | `byte[]`  | Message to sign.                |
| `addPrefix` | `boolean` | If true then add secure prefix. |
