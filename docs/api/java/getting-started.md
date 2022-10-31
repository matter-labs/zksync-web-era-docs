# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Transfer and withdraw funds (native and ERC20 tokens).
4. Deploy a smart contract.
5. Interact with any smart contract.

## Prerequisite
This guide assumes that you are familiar with the basics of [Java](https://docs.oracle.com/en/java/) programming language.

##  Installation
To install the zkSync Java SDK, just add the following dependency:

Maven `pom.xml`

```gradle
<project>
  ...
  <dependencies>
    <dependency>
      <groupId>io.zksync</groupId>
      <artifactId>zksync2</artifactId>
      <version>0.0.1</version>
    </dependency>
  </dependencies>
</project>

```

Gradle `build.gradle`

```
dependencies {
    implementation "io.zksync:zksync2:0.0.1"
}
```

## Instantiating the SDK
To start using this SDK, you just need to pass in a provider configuration.

```java

import io.zksync.protocol.zksync;
import org.web3j.protocol.http.HttpService;

public class Main {
    public static void main(String ...args) {
        zksync zksync = zksync.build(new HttpService("<http://127.0.0.1:3050>"));
    }
}

```

## Ethereum signer

::: warning

⚠️ Never commit private keys to file tracking history, or your account could be compromised.

:::

Ethereum signer is necessary for sending both L1 and L2 transactions, given L2 transactions require an Ethereum signature as a part of a 2-factor authentication scheme.
Ethereum signer is represented by the `PrivateKeyEthSigner` abstract class from `zksync.crypto.signer`.

```java
import io.zksync.crypto.signer.EthSigner;
import io.zksync.crypto.signer.PrivateKeyEthSigner;
import org.web3j.crypto.Credentials;

public class Main {
    public static void main(String ...args) {
        long chainId = 123L;// Chainid of the zksync network

        Credentials credentials = Credentials.create("0x<private_key>");

        EthSigner signer = new PrivateKeyEthSigner(credentials, chainId);
    }
}

```

## Creating a wallet
To control your account in zksync, use the `zksync.crypto.signer.EthSigner`. It can sign transactions with keys and send transactions to the zksync network.

```java
import io.zksync.crypto.signer.EthSigner;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        ZkSyncWallet wallet = new ZkSyncWallet(zksync, signer, Token.ETH);
    }
}

```

## Transactions

zksync2 supports Ethereum's `Legacy` and `EIP-1155` transactions except for deploying contracts.


```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import io.zksync.utils.ContractDeployer;
import org.web3j.abi.datatypes.Address;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.security.SecureRandom;

public class Main {
    public static void main(String... args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        String binary = "0x<bytecode_of_the_contract>";

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        byte[] salt = SecureRandom.getSeed(32);

        // Here we can precompute contract address before its deploying
        String precomputedAddress = ContractDeployer.computeL2Create2Address(new Address(signer.getAddress()), Numeric.hexStringToByteArray(binary), new byte[]{}, salt).getValue();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        Transaction estimate = Transaction.create2ContractTransaction(
                signer.getAddress(),
                BigInteger.ZERO,
                BigInteger.ZERO,
                binary,
                "0x",
                salt
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status 
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Deploy a smart contract

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import io.zksync.utils.ContractDeployer;
import io.zksync.utils.zksyncAddresses;
import io.zksync.wrappers.NonceHolder;
import org.web3j.abi.datatypes.Address;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.ReadonlyTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        String binary = "0x<bytecode_of_the_contract>";

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        NonceHolder nonceHolder = NonceHolder.load(zksyncAddresses.NONCE_HOLDER_ADDRESS, zksync, new ReadonlyTransactionManager(zksync, signer.getAddress()), new DefaultGasProvider());

        BigInteger deploymentNonce = nonceHolder.getDeploymentNonce(signer.getAddress()).send();

        // Here we can precompute contract address before its deploying
        String precomputedAddress = ContractDeployer.computeL2CreateAddress(new Address(signer.getAddress()), deploymentNonce).getValue();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        Transaction estimate = Transaction.createContractTransaction(
                signer.getAddress(),
                BigInteger.ZERO,
                BigInteger.ZERO,
                binary,
                "0x"
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Deploy contract via ZkSyncWallet

```java

import io.zksync.ZkSyncWallet;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

public class Main {
    public static void main(String ...args) {
        ZkSyncWallet wallet; // Initialize wallet

        TransactionReceipt receipt = wallet.deploy(Numeric.hexStringToByteArray("0x<bytecode_of_the_contract>")).send();
    }
}

```

### Interacting with smart contracts

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;

import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        String contractAddress = "0x<contract_address>";
        String calldata = "0x<calldata>"; // Here is an encoded contract function

        Transaction estimate = Transaction.createFunctionCallTransaction(
                signer.getAddress(),
                contractAddress,
                BigInteger.ZERO,
                BigInteger.ZERO,
                calldata
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Interacting with smart contracts via ZkSyncWallet

```java 

import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.util.Collections;

public class Main {
    public static void main(String... args) {
        ZkSyncWallet wallet; // Initialize wallet

        String contractAddress = "0x<contract_address>";

        // Example contract function
        Function contractFunction = new Function(
                "increment",
                Collections.singletonList(new Uint256(BigInteger.ONE)),
                Collections.emptyList());

        TransactionReceipt receipt = wallet.execute(contractAddress, contractFunction).send();
    }
}

```

### Interacting with smart contracts via Web3j generic Contract

```java

import io.zksync.crypto.signer.EthSigner;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;
import io.zksync.transaction.fee.DefaultTransactionFeeProvider;
import io.zksync.transaction.fee.ZkTransactionFeeProvider;
import io.zksync.transaction.manager.zksyncTransactionManager;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        ZkTransactionFeeProvider feeProvider = new DefaultTransactionFeeProvider(zksync, Token.ETH);
        zksyncTransactionManager transactionManager = new zksyncTransactionManager(zksync, signer, feeProvider);

        // Wrapper class of a contract generated by Web3j or Epirus ClI
        SomeContract contract = SomeContract.load("0x<contract_address>", zksync, transactionManager, new DefaultGasProvider()).send();

        // Generated method in wrapper
        TransactionReceipt receipt = contract.increment(BigInteger.ONE).send();

        //The same way you can call read function

        BigInteger result = contract.get().send();
    }
}

```

### Transfer funds

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        BigInteger amountInWei = Convert.toWei("1", Convert.Unit.ETHER).toBigInteger();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        Transaction estimate = Transaction.createFunctionCallTransaction(
                signer.getAddress(),
                "0x<receiver_address>",
                BigInteger.ZERO,
                BigInteger.ZERO,
                amountInWei,
                "0x"
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Transfer funds (ERC20 tokens)

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import io.zksync.wrappers.ERC20;
import org.web3j.abi.FunctionEncoder;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        // Here we're getting tokens supported by zksync
        Token token = zksync.zksGetConfirmedTokens(0, (short) 100).send()
                .getResult().stream()
                .findAny().orElseThrow(IllegalArgumentException::new);

        BigInteger amount = token.toBigInteger(1.0);

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();
        String calldata = FunctionEncoder.encode(ERC20.encodeTransfer("0x<receiver_address>", amount));

        Transaction estimate = Transaction.createFunctionCallTransaction(
                signer.getAddress(),
                token.getL2Address(),
                BigInteger.ZERO,
                BigInteger.ZERO,
                calldata
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Transfer funds via ZkSyncWallet

```java

import io.zksync.protocol.core.Token;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigDecimal;
import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSyncWallet wallet; // Initialize wallet

        BigInteger amount = Token.ETH.toBigInteger(0.5);

        TransactionReceipt receipt = wallet.transfer("0x<receiver_address>", amount).send();

        //You can check balance
        BigInteger balance = wallet.getBalance().send();

        //Also, you can convert amount number to decimal
        BigDecimal decimalBalance = Token.ETH.intoDecimal(balance);
    }
}

```

### Withdraw funds

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import io.zksync.wrappers.IL2Bridge;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        // Get address of the default bridge contract
        String l2EthBridge = zksync.zksGetBridgeContracts().send().getResult().getL2EthDefaultBridge();
        final Function withdraw = IL2Bridge.encodeWithdraw(signer.getAddress(), Token.ETH.getL2Address(), Token.ETH.toBigInteger(1));

        String calldata = FunctionEncoder.encode(withdraw);

        Transaction estimate = Transaction.createFunctionCallTransaction(
                signer.getAddress(),
                l2EthBridge,
                BigInteger.ZERO,
                BigInteger.ZERO,
                calldata
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status 
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Withdraw funds (ERC20 tokens)

```java

import io.zksync.abi.TransactionEncoder;
import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Eip712Meta;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;
import io.zksync.protocol.core.ZkBlockParameterName;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.type.Transaction712;
import io.zksync.wrappers.IL2Bridge;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;

import java.math.BigInteger;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client
        EthSigner signer; // Initialize signer

        BigInteger chainId = zksync.ethChainId().send().getChainId();

        BigInteger nonce = zksync
                .ethGetTransactionCount(signer.getAddress(), ZkBlockParameterName.COMMITTED).send()
                .getTransactionCount();

        // Here we're getting tokens supported by zksync
        Token token = zksync.zksGetConfirmedTokens(0, (short) 100).send()
                .getResult().stream()
                .findAny().orElseThrow(IllegalArgumentException::new);

        // Get address of the default bridge contract (ERC20)
        String l2Erc20Bridge = zksync.zksGetBridgeContracts().send().getResult().getL2Erc20DefaultBridge();
        final Function withdraw = IL2Bridge.encodeWithdraw(signer.getAddress(), token.getL2Address(), token.toBigInteger(1.0));

        String calldata = FunctionEncoder.encode(withdraw);

        Transaction estimate = Transaction.createFunctionCallTransaction(
                signer.getAddress(),
                l2Erc20Bridge,
                BigInteger.ZERO,
                BigInteger.ZERO,
                calldata
        );

        Fee fee = zksync.zksEstimateFee(estimate).send().getResult();

        Eip712Meta meta = estimate.getEip712Meta();
        meta.setErgsPerPubdata(fee.getErgsPerPubdataLimitNumber());

        Transaction712 transaction = new Transaction712(
                chainId.longValue(),
                nonce,
                fee.getErgsLimitNumber(),
                estimate.getTo(),
                estimate.getValueNumber(),
                estimate.getData(),
                fee.getMaxPriorityFeePerErgNumber(),
                fee.getErgsPriceLimitNumber(),
                signer.getAddress(),
                meta
        );

        String signature = signer.getDomain().thenCompose(domain -> signer.signTypedData(domain, transaction)).join();
        byte[] message = TransactionEncoder.encode(transaction, TransactionEncoder.getSignatureData(signature));

        String sentTransactionHash = zksync.ethSendRawTransaction(Numeric.toHexString(message)).send().getTransactionHash();

        // You can check the transaction status
        TransactionReceipt receipt = zksync.ethGetTransactionReceipt(sentTransactionHash).send().getTransactionReceipt();
    }
}

```

### Withdraw funds via ZkSyncWallet

```java

import io.zksync.protocol.core.Token;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSyncWallet wallet; // Initialize wallet

        BigInteger amount = Token.ETH.toBigInteger(0.5);

        // ETH By default
        TransactionReceipt receipt = wallet.withdraw("0x<receiver_address>", amount).send();

        // Also we can withdraw ERC20 token
        Token token;

        TransactionReceipt receipt = wallet.withdraw("0x<receiver_address>", amount, token).send();
    }
}

```

## Wallet
Get the price of the execution of the transaction

```java

import io.zksync.crypto.signer.EthSigner;
import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.transaction.fee.Fee;

import java.math.BigInteger;

public class Main {
    public static void main(String... args) {
        ZkSync zksync; // Initialize client

        Transaction forEstimate; // Create transaction as described above

        Fee fee = zksync.zksEstimateFee(forEstimate).send().getResult();

        // Also possible to use eth_estimateGas
        BigInteger gasUsed = zksync.ethEstimateGas(forEstimate).send().getAmountUsed();
    }
}

```

### Get fee via TransactionFeeProvider

```java

import io.zksync.methods.request.Transaction;
import io.zksync.protocol.zksync;
import io.zksync.protocol.core.Token;
import io.zksync.transaction.fee.DefaultTransactionFeeProvider;
import io.zksync.transaction.fee.Fee;
import io.zksync.transaction.fee.ZkTransactionFeeProvider;

public class Main {
    public static void main(String ...args) {
        ZkSync zksync; // Initialize client

        ZkTransactionFeeProvider feeProvider = new DefaultTransactionFeeProvider(zksync, Token.ETH);

        Transaction forEstimate; // Create transaction as described above

        Fee fee = feeProvider.getFee(forEstimate);
    }
}

```

::: warning

⚠️ This section of the docs is still in progress and will be updated with more detailed information soon.

:::