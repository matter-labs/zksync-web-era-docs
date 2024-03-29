---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Providers | zkSync Docs
---

# Providers

A Web3 Provider object provides application-layer access to underlying blockchain networks.

The [`zksync2-java`](https://github.com/zksync-sdk/zksync2-java) library supports provider methods from the [`web3j`](https://docs.web3j.io/4.9.7/) library and
supplies additional functionality.

[`ZkSync`](#ZkSync): Supplies the same functionality as `Web3` and extends it with zkSync-specific methods.

## `ZkSync`

:::info

- This doc details zkSync Era specific methods.
- Web3Swift implementations link to their [docs](https://docs.web3j.io/4.9.7/).
  :::

### `constructor`

Returns a `ZkSyncClient` object.

#### Inputs

| Parameter     | Type  | Description                 |
| ------------- | ----- | --------------------------- |
| `providerURL` | `URL` | Network RPC URL (optional). |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync = ZkSync.build(new HttpService("https://sepolia.era.zksync.dev"));
    }
}
```

### `estimateFee`

Returns an estimated [`ZksEstimateFee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type          | Description          |
| ------------- | ------------- | -------------------- |
| `transaction` | `Transaction` | Transaction request. |

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      io.zksync.methods.request.Transaction estimate = io.zksync.methods.request.Transaction.createFunctionCallTransaction(
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                BigInteger.ZERO,
                BigInteger.ZERO,
                "0x"
        );

      Fee fee = zksync.zksEstimateFee(estimate).send().getResult();
    }
```

### `estimateGas`

Returns an estimate of the amount of gas required to submit a transaction to the network.

#### Inputs

| Parameter     | Type          | Description        |
| ------------- | ------------- | ------------------ |
| `transaction` | `Transaction` | Transaction class. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      io.zksync.methods.request.Transaction estimate = io.zksync.methods.request.Transaction.createFunctionCallTransaction(
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                BigInteger.ZERO,
                BigInteger.ZERO,
                "0x"
        );

      BigInteger gasUsed = zksync.ethEstimateGas(estimate).send().getAmountUsed();
    }
}
```

### `estimateGasL1`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `EthEstimateGas` object.

Calls the `zks_estimateL1ToL2` JSON-RPC method.

#### Inputs

| Parameter     | Type          | Description        |
| ------------- | ------------- | ------------------ |
| `transaction` | `Transaction` | Transaction class. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      io.zksync.methods.request.Transaction estimate = io.zksync.methods.request.Transaction.createFunctionCallTransaction(
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
                BigInteger.ZERO,
                BigInteger.ZERO,
                "0x"
        );

      BigInteger estimatedGas = zksync.estimateGasL1(estimate).send().getAmountUsed();
    }
}
```

### `estimateL1ToL2Execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter            | Type         | Description                                                      |
| -------------------- | ------------ | ---------------------------------------------------------------- |
| `contractAddress`    | `String`     | Address of contract.                                             |
| `calldata`           | `byte[]`     | The transaction call data.                                       |
| `caller`             | `String`     | Caller address.                                                  |
| `l2GasLimit`         | `BigInteger` | Current L2 gas value (optional).                                 |
| `l2Value`            | `BigInteger` | L2 amount (optional).                                            |
| `factoryDeps`        | `byte[][]`   | Factory deps (optional).                                         |
| `operatorTip`        | `BigInteger` | Operator tip (optional).                                         |
| `gasPerPubdataByte?` | `BigInteger` | Constant representing current amount of gas per byte (optional). |
| `refoundRecepient`   | `String`     | Refound address.                                                 |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      String mainContractAddress = zksync.zksMainContract().sendAsync().join()

      BigInteger estimatedGas = zksync.estimateGasL1(mainContractAddress, Numeric.hexStringToByteArray("0x"), "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", null, BigInteger.
      valueOf(7_000_000_000L), null, null, null, null).
      send().
      getAmountUsed();
    }
}
```

### `allAccountBalances`

Returns all balances for confirmed tokens given by an account address.

Calls the `zks_getAllAccountBalances` JSON-RPC method.

#### Inputs

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `address` | `String` | Account address. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      ZksAccountBalances allBalances = zkSync.zksGetAllAccountBalances("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049").send();
    }
}
```

### `getBlockDetails`

Returns additional zkSync-specific information about the L2 block.

Calls the `zks_getBlockDetails` JSON-RPC method.

#### Inputs

| Parameter     | Type         | Description   |
| ------------- | ------------ | ------------- |
| `blockNumber` | `BigInteger` | Block number. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      ZksBlockDetails blockDetails = zkSync.getBlockDetails(BigInteger.valueOf(90_000)).send();
    }
}
```

### `zksGetBridgeContracts`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
      ZksBlockDetails blockDetails = zkSync.zksGetBridgeContracts().send();
    }
}
```

### `getL1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

Calls the `zks_getL1BatchBlockRange` JSON-RPC method.

#### Inputs

| Parameter       | Type         | Description      |
| --------------- | ------------ | ---------------- |
| `l1BatchNumber` | `BigInteger` | L1 batch number. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger l1BatchNumber = zkSync.getL1BatchNumber().send().getL1BatchNumber();
        BlockRange blockRange = zkSync.getL1BatchBlockRange(l1BatchNumber).send().getResult();
    }
}
```

### `getL1BatchDetails`

Returns data pertaining to a given batch.

Calls the `zks_getL1BatchDetails` JSON-RPC method.

#### Inputs

| Parameter | Type         | Description      |
| --------- | ------------ | ---------------- |
| `number`  | `BigInteger` | L1 batch number. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger l1BatchNumber = zkSync.getL1BatchNumber().send().getL1BatchNumber();
        BatchDetails blockRange = zkSync.getL1BatchBlockRange(l1BatchNumber).send().getResult();
    }
}
```

### `getL1BatchNumber`

Returns the latest L1 batch number.

Calls the `zks_getL1BatchNumber` JSON-RPC method.

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger l1BatchNumber = zkSync.getL1BatchNumber().send().getL1BatchNumber();
    }
}
```

### `getL2ToL1LogProof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

Calls the `zks_getL2ToL1LogProof` JSON-RPC method.

#### Inputs

| Parameter | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `txHash`  | `String` | Hash of the L2 transaction the L2 to L1 log was produced within. |
| `index`   | `int`    | The index of the L2 to L1 log in the transaction (optional).     |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        // Any L2 -> L1 transaction can be used.
        // In this case, withdrawal transaction is used.
        String tx = "0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e";
        L2ToL1MessageProof result = zkSync.zksGetL2ToL1LogProof(tx, 0).sendAsync().join().getResult();
    }
}
```

### `mainContract`

Returns the main zkSync Era smart contract address.

Calls the `zks_getMainContract` JSON-RPC method.

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        String result = zkSync.zksMainContract().sendAsync().join().getResult();
    }
}
```

### `zksGetTestnetPaymaster`

Returns the testnet paymaster address if available, or null.

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        String result = zkSync.zksGetTestnetPaymaster().sendAsync().join().getResult();
    }
}
```

### `zksGetTransactionDetails`

Returns data from a specific transaction given by the transaction hash.

Calls the `getTransactionDetails` JSON-RPC method.

#### Inputs

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| `txHash`  | `BytesLike` | Transaction hash. |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        TransactionDetails result = zkSync.zksGetTransactionDetails("<TX_HASH>").sendAsync().join().getResult();
    }
}
```

### `getTransferTransaction`

Returns the populated transfer transaction.

#### Inputs

| Parameter            | Type                  | Description                |
| -------------------- | --------------------- | -------------------------- |
| `tx`                 | `TransferTransaction` | TransferTransaction class. |
| `transactionManager` | `TransactionManager`  | L2 transaction manager.    |
| `gasProvider`        | `ContractGasProvider` | L2 gas provider.           |

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        TransferTransaction transaction = new TransferTransaction(RECEIVER, amount, signer.getAddress());
        Transaction result = zkSync.getTransferTransaction(transaction, transactionManager, gasProvider).sendAsync().join().getResult();
    }
}
```

Retrieve populated ETH transfer transaction using paymaster to facilitate fee payment with an ERC20 token.

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger amount = BigInteger.valueOf(7_000_000_000L);
        PaymasterParams paymasterParams = new PaymasterParams(PAYMASTER, Numeric.hexStringToByteArray(FunctionEncoder.encode(Paymaster.encodeApprovalBased(TOKEN, BigInteger.ONE, new byte[] {}))));

        TransferTransaction transaction = new TransferTransaction(RECEIVER, amount, signer.getAddress(), paymasterParams);
        Transaction result = zkSync.getTransferTransaction(transaction, transactionManager, gasProvider).sendAsync().join().getResult();
    }
}
```

### `getWithdrawTx`

Returns the populated withdrawal transaction.

#### Inputs

| Parameter            | Type                  | Description                |
| -------------------- | --------------------- | -------------------------- |
| `tx`                 | `TransferTransaction` | TransferTransaction class. |
| `transactionManager` | `TransactionManager`  | L2 transaction manager.    |
| `gasProvider`        | `ContractGasProvider` | L2 gas provider.           |

#### Examples

Retrieve populated ETH withdrawal transactions.

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        WithdrawTransaction transaction = new WithdrawTransaction(RECEIVER, amount, signer.getAddress());
        Transaction result = zkSync.getWithdrawTx(transaction, transactionManager, gasProvider).sendAsync().join().getResult();
    }
}
```

Retrieve populated ETH withdrawal transaction using paymaster to facilitate fee payment with an ERC20 token.

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger amount = BigInteger.valueOf(7_000_000_000L);
        PaymasterParams paymasterParams = new PaymasterParams(PAYMASTER, Numeric.hexStringToByteArray(FunctionEncoder.encode(Paymaster.encodeApprovalBased(TOKEN, BigInteger.ONE, new byte[] {}))));

        WithdrawTransaction transaction = new WithdrawTransaction(RECEIVER, amount, signer.getAddress(), paymasterParams);
        Transaction result = zkSync.getWithdrawTx(transaction, transactionManager, gasProvider).sendAsync().join().getResult();
    }
}
```

### `l1ChainId`

Returns the chain id of the underlying L1.

Calls the `zks_L1ChainId` JSON-RPC method.

#### Example

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger result = zkSync.l1ChainId().sendAsync().join().getResult();
    }
}
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

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main {
    public static void main(String ...args) {
        BigInteger result = zkSync.l1ChainId().sendAsync().join().getResult();
    }
}
```
