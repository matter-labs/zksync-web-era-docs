# Providers

Providers are objects that wrap interactions with the zkSync node. If you are new to the concept of providers in `web3`, you should check out their docs [here](https://docs.web3j.io/4.9.8/getting_started/interacting_with_node/).

zkSync fully supports Ethereum Web3 API, so you can use the provider objects from web3.py. However, zkSync API provides some additional JSON-RPC methods, which allow:

- Easily track L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use cases may require tracking "finalized" transactions only.



### `Initialize`

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync = ZkSync.build(new HttpService("https://testnet.era.zksync.dev"));
    }
}
```

#### Inputs and outputs

| Name        | Description                      |
|-------------| -------------------------------- |
|web3jService | URL of the zkSync operator node. |
| returns     | `Provider` object.               |


### `zksGetAllAccountBalances`

Get all known balances for the given account.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
        ZkSync zksync = ZkSync.build(new HttpService("https://testnet.era.zksync.dev"));
        ZksAccountBalances response = zksync.zksGetAllAccountBalances("ADDRESS").send();
    }
}
```

#### Inputs and outputs

| Name                    | Description                                                                  |
| ----------------------- |------------------------------------------------------------------------------|
| address                 | The address of the user to check the balance.                                |
| returns                 | 'ZksAccounteBalances' List of all balances where account has non-zero value. |

### `zksGetConfirmedTokens`

Get list of the tokens supported by ZkSync. The tokens are returned in alphabetical order by their symbol, so basically, the token id is its position in an alphabetically 
sorted array of tokens.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
      ZksTokens response = zksync.zksGetConfirmedTokens(offset, limit).send();    }
}
```

#### Inputs and outputs

| Name    | Description                            |
|---------|----------------------------------------|
| from    | Offset of tokens.                      |
| list    | Limit of amount of tokens to return.   |
| returns | Prepared get confirmed tokens request. |

### `zksGetBridgeContracts`

Get default bridges addresses deployed on L1 and L2.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.protocol.core.BridgeAddresses;

public class Main { 
    public static void main(String ...args) {
      BridgeAddresses bridgeAddresses = zksync.zksGetBridgeContracts().sendAsync().join().getResult();
}
```

#### Inputs and outputs

| Name    | Description                           |
|---------|---------------------------------------|
| from    | Offset of tokens.                     |
| list    | Limit of amount of tokens to return.  |
| returns | Prepared get bridge contract request. |

### `zksMainContract`

Get address of main contract for current network chain.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
      String mainContract = zksync.zksMainContract().sendAsync().join().getResult();
}
```

#### Inputs and outputs

| Name    | Description                     |
|---------|---------------------------------|
| returns | Prepared main contract request. |

### `zksGetTestnetPaymaster`

Get the address of the testnet paymaster: the paymaster that is available on testnets and enables paying fees in ERC-20 compatible tokens.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZksTestnetPaymasterAddress;

public class Main { 
    public static void main(String ...args) {
      ZksTestnetPaymasterAddress response = zksync.zksGetTestnetPaymaster().send();
}
```

#### Inputs and outputs

| Name    | Description                     |
|---------|---------------------------------|
| returns | Prepared get paymaster request. |

### `zksGetTokenPrice`

Get price of the token in USD.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
      ZksTokenPrice response = zksync.zksGetTokenPrice(ETH.getL2Address()).send();
}
```

#### Inputs and outputs

| Name         | Description                        |
|--------------|------------------------------------|
| tokenAddress | Address of the token in hex forma. |
| returns      | Prepared get token price request.  |

### `zksGetTransactionReceipt`

Get transaction receipt. The same as eth_getTransactionReceipt but with additional fields belong to L2ToL1 messenger

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main { 
    public static void main(String ...args) {
      ZkTransactionReceipt zkReceipt = wallet.getZksync().zksGetTransactionReceipt("TRANSACTION_HASH").send().getTransactionReceipt().get();
}
```

#### Inputs and outputs

| Name            | Description                                              |
|-----------------|----------------------------------------------------------|
| transactionHash | Hash of the executed transaction hash with sent message. |
| returns         | Prepared get transaction receipt request.                |

### `zksGetTransactionDetails`

Get transaction details.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main { 
    public static void main(String ...args) {
      ZksGetTransactionDetails response = zksync.zksGetTransactionDetails("TRANSACTION_HASH").send();
}
```

#### Inputs and outputs

| Name            | Description                                              |
|-----------------|----------------------------------------------------------|
| transactionHash | Hash of the executed transaction hash with sent message. |
| returns         | Prepared get transaction details request.                |

### `zksGetTransactionByHash`

Get transaction details.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main { 
    public static void main(String ...args) {
      ZksGetTransactionDetails response = zksync.zksGetTransactionDetails("TRANSACTION_HASH").send();
}
```

#### Inputs and outputs

| Name            | Description                                              |
|-----------------|----------------------------------------------------------|
| transactionHash | Hash of the executed transaction hash with sent message. |
| returns         | Prepared get transaction details request.                |

### `zksEstimateFee`

Estimate fee for the given transaction at the moment of the latest committed block.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main { 
    public static void main(String ...args) {
      Transaction forEstimate; 

      Fee fee = zksync.zksEstimateFee(forEstimate).send().getResult();
    }
```

#### Inputs and outputs

| Name        | Description                      |
|-------------|----------------------------------|
| transaction | Transaction data for estimation. |
| returns     | Prepared estimate fee request.   |

### `zksL1ChainId`

Get chain identifier of the L1 chain.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
      ZksL1ChainId response = zksync.zksL1ChainId().send();
    }
```

#### Inputs and outputs

| Name        | Description                  |
|-------------|------------------------------|
| returns     | Prepared l1 chainid request. |

### `zksGetL2ToL1MsgProof`

Get the proof for the message sent via the L1Messenger system contract.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main { 
    public static void main(String ...args) {
      ZksL1ChainId response = zksync.zksL1ChainId().send();
    }
```

#### Inputs and outputs

| Name         | Description                                                                                                                                                                                 |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| block        | The number of the block where the message was emitted.                                                                                                                                      |
| sender       | The sender of the message (i.e. the account that called the L1Messenger system contract).                                                                                                   |
| message      | The keccak256 hash of the message that was sent.                                                                                                                                            |
| l2LogPosition | The index in the block of the event that was emitted by the L1Messenger when submitting this message. If it is omitted, the proof for the first message with such content will be returned. |
| returns      | Prepared l1 chainid request.                                                                                                                                                                |

### `ethEstimateGas`

Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;
import io.zksync.methods.response.ZkTransactionReceipt;

public class Main { 
    public static void main(String ...args) {
      Transaction forEstimate;

      BigInteger gasUsed = zksync.ethEstimateGas(forEstimate).send().getAmountUsed();
    }
```

#### Inputs and outputs

| Name        | Description                      |
|-------------|----------------------------------|
| transaction | Transaction data for estimation. |
| returns     | Prepared estimate gas request.   |

### `zksGetBlockByHash`

Get block by hash.

Example:

```java
import io.zksync.protocol.ZkSync;
import org.web3j.protocol.http.HttpService;

public class Main {
    public static void main(String... args) {
      ZksBlock response = zksync.zksGetBlockByHash("BLOCK_HASH", true).send();
    }
}
```

#### Inputs and outputs

| Name        | Description                                                                                    |
|-------------|------------------------------------------------------------------------------------------------|
| blockHash | Hash of a block.                                                                               |
| returnFullTransactionObjects | If true it returns the full transaction objects, if false only the hashes of the transactions. |
| returns     | Prepared get transaction receipt request.                                                                 |

