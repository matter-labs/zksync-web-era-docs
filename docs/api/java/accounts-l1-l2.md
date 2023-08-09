# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to some background on how L1->L2 interaction works on zkSync Era, go through the [L1 / L2 interoperability doc](../../reference/concepts/l1-l2-interop.md).

## EthereumProvider

### `approveDeposits`

Send approve transaction to token contract.

Example:

```java
TransactionReceipt approveReceipt = provider.approveDeposits(token, Optional.of(token.toBigInteger(10000000000L))).join();
```

| Name   | Description                                           |
| ------ | ----------------------------------------------------- |
| token  | Token object supported by ZkSync Era.                 |
| limit  | Maximum amount to approve for ZkSync Era contract.    |
| return | `CompletableFuture` for waiting for transaction mine. |

### `deposit`

Send deposit transaction to ZkSync Era contract. For ERC20 token must be approved before. See [approveDeposits](#approvedeposits)

| Name         | Description                                           |
| ------------ | ----------------------------------------------------- |
| token        | Token object supported by ZkSync Era.                 |
| amount       | Amount of tokens to transfer.                         |
| operatorTips | Tips for operator that executes deposit on L2.        |
| userAddress  | Address of L2 receiver of deposit in ZkSync Era.      |
| return       | `CompletableFuture` for waiting for transaction mine. |

Example:

```java
  TransactionManager manager = new RawTransactionManager(web3j, credentials, chainId.longValue());
  BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();
  ContractGasProvider gasProvider = new StaticGasProvider(gasPrice, BigInteger.valueOf(300_000L));
  TransactionReceipt receipt = EthereumProvider
  .load(wallet.getZksync(), web3j, manager, gasProvider).join()
  .deposit(Token.ETH, Convert.toWei("0.001", Convert.Unit.ETHER).toBigInteger(), BigInteger.ZERO, credentials.getAddress()).join();

  System.out.println(receipt);
```

### `getBaseCost`

Get base cost for L2 transaction.

Example:

```java
BigInteger baseCost = provider.getBaseCost(gasLimit, L1_TO_L2_GAS_PER_PUBDATA, gasPriceValue).join();
```

| Name              | Description                                           |
| ----------------- | ----------------------------------------------------- |
| gasLimit          | Gas limit for L2 transaction.                         |
| gasPerPubdataByte | Gas per pubdata byte.                                 |
| gasPrice          | Gas price for L2 transaction.                         |
| return            | `CompletableFuture` for waiting for transaction mine. |

### `transfer`

Send transfer transaction. This is the regular transfer of ERC20 tokens.

Example:

```java
TransactionManager manager = new RawTransactionManager(web3j, credentials, chainId.longValue());
BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();
ContractGasProvider gasProvider = new StaticGasProvider(gasPrice, BigInteger.valueOf(300_000L));
TransactionReceipt receipt = EthereumProvider
 .load(wallet.getZksync(), web3j, manager, gasProvider).join()
 .transfer(Token.ETH, Convert.toWei("0.117649", Convert.Unit.ETHER).toBigInteger(), credentials.getAddress()).join();

 System.out.println(receipt);
```

| Name   | Description                                           |
| ------ | ----------------------------------------------------- |
| token  | Token object supported by ZkSync Era.                 |
| amount | Amount of tokens to transfer.                         |
| to     | Address of token recipient.                           |
| return | `CompletableFuture` for waiting for transaction mine. |
