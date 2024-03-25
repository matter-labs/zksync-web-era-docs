---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Utilities | zkSync Docs
---

# Utilities

The [utilities package](https://github.com/zksync-sdk/zksync2-java/tree/master/src/main/java/io/zksync/utils) contains essential utilities for building on zkSync Era.

:::info

- This document describes common functions and constants you may need.
- Functions used internally are not necessarily described.
- Check the code for the full list.
  :::

## Use the library

Access the package by importing it into your scripts.

```java
import io.zksync.utils.*;
```

## Constants

#### EIP712 structures

Collection of EIP712 structures with their types.

```ts
export const EIP712_TYPES = {
  Transaction: [
    { name: "txType", type: "uint256" },
    { name: "from", type: "uint256" },
    { name: "to", type: "uint256" },
    { name: "gasLimit", type: "uint256" },
    { name: "gasPerPubdataByteLimit", type: "uint256" },
    { name: "maxFeePerGas", type: "uint256" },
    { name: "maxPriorityFeePerGas", type: "uint256" },
    { name: "paymaster", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "value", type: "uint256" },
    { name: "data", type: "bytes" },
    { name: "factoryDeps", type: "bytes32[]" },
    { name: "paymasterInput", type: "bytes" },
  ],
};
```

### ZkSyncAddresses

#### ETH token layer 1

```java
public static final String ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
```

#### ETH token alias on ZkSync Era

```java
public static final String L2_ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800a";
```

#### Contract deployer

```java
public static final String CONTRACT_DEPLOYER_ADDRESS = "0x0000000000000000000000000000000000008006";
```

#### L1 messenger

```java
public static final String MESSENGER_ADDRESS = "0x0000000000000000000000000000000000008008";
```

#### Nonce holder

```java
public static final String NONCE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000008003";
```

## WalletUtils

### `applyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

Returns the `msg.sender` of the L1->L2 transaction as the `address` of the contract that initiated the transaction.

:::tip More info

1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `applyL1ToL2Alias(A)`.
   :::

#### Inputs

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `address` | String | Contract address. |

#### Example

```ts
String nonZeroPadded = WalletUtils.applyL1ToL2Alias("0x702942B8205E5dEdCD3374E5f4419843adA76Eeb");
```

### `undoL1ToL2Alias`

Converts and returns the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

#### Inputs

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `address` | String | Sender address. |

#### Example

```ts
String nonZeroPadded = WalletUtils.undoL1ToL2Alias("0x813A42B8205E5DedCd3374e5f4419843ADa77FFC");
```

### `checkBaseCost`

Checks if the transaction's base cost is greater than the provided value, which covers the transaction's cost. Throws an error if it is not.

#### Inputs

| Parameter  | Type         | Description                                |
| ---------- | ------------ | ------------------------------------------ |
| `baseCost` | `BigInteger` | transaction's base cost.                   |
| `value`    | `BigInteger` | value which covers the transaction's cost. |

### Example

```java
BigInteger baseCost = BigInteger.valueOf(100);
BigInteger value = BigInteger.valueOf(99);

try {
  WalletUtils.checkBaseCost(baseCost, value);
} catch (Exception e) {
  // e.message = `The base cost of performing the priority operation is higher than the provided value parameter for the transaction: baseCost: ${baseCost}, provided value: ${value}`,
}
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

#### Inputs

| Parameter           | Type                  | Description                                 |
| ------------------- | --------------------- | ------------------------------------------- |
| `token`             | `Address`             | Token address.                              |
| `amount`            | `BigNumberish`        | Deposit amount.                             |
| `to`                | `Address`             | Recipient address.                          |
| `providerL2`        | `ZkSync`              | zkSync provider.                            |
| `bridgeContracts`   | `L1BridgeContracts`   | L1 bridge contract contracts.               |
| `providerL1`        | `Web3j`               | Ethers provider.                            |
| `credentials`       | `Credentials`         | Sender credentials (optional).              |
| `gasProvider`       | `ContractGasProvider` | Contract gas provider (optional).           |
| `from`              | `Address`             | Sender address (optional).                  |
| `gasPerPubdataByte` | `BigNumberish`        | Current gas per byte of pubdata (optional). |

### `getERC20BridgeCalldata`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter        | Type         | Description                                 |
| ---------------- | ------------ | ------------------------------------------- |
| `l1TokenAddress` | `String`     | Token address on L1.                        |
| `l1Sender`       | `String`     | Sender address on L1.                       |
| `l2Receiver`     | `String`     | Recipient address on L2.                    |
| `amount`         | `BigInteger` | Gas fee for the number of tokens to bridge. |
| `bridgeData`     | `byte[]`     | Data                                        |

## ContractDeployer

### `create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment.

:::warning

- The zkSync Era implementation is slightly different from Ethereum.
  :::

#### Inputs

| Parameter     | Type      | Description                       |
| ------------- | --------- | --------------------------------- |
| `sender`      | `Address` | Sender address.                   |
| `bytecode`    | `byte[]`  | Output from zkSolc.               |
| `constructor` | `byte[]`  | ABI encoded contrusctor arguments |
| `salt`        | `byte[]`  | Randomization element.            |

#### Example

```java
Address result = ContractDeployer.computeL2Create2Address(new Address("0xa909312acfc0ed4370b8bd20dfe41c8ff6595194"), Numeric.hexStringToByteArray
("0x010001cb6a6e8d5f6829522f19fa9568660e0a9cd53b2e8be4deb0a679452e41"), new byte[] {}, new byte[32]);
```

### `createAddress`

Generates a contract address from deployer's account and nonce.

#### Inputs

| Parameter | Type         | Description     |
| --------- | ------------ | --------------- |
| `sender`  | `Address`    | Sender address. |
| `nonce`   | `BigInteger` | Sender nonce.   |

```ts
export function createAddress(sender: Address, senderNonce: BigNumberish): string;
```

#### Example

```java
Address result = ContractDeployer.computeL2CreateAddress(new Address("0x7e5f4552091a69125d5dfcb7b8c2659029395bdf"), BigInteger.valueOf(1));
```

### `verifySignature`

Called from [`verifyTypedData`](#verifyTypedData). Returns true if account abstraction EIP712
signature is correct.

#### Inputs

| Parameter   | Type      | Description       |
| ----------- | --------- | ----------------- |
| `signature` | `String`  | Signature string. |
| `message`   | `byte[]`  | Message bytes.    |
| `prefixed`  | `boolean` | Is prefixed.      |

### `verifyTypedData`

Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter   | Type           | Description        |
| ----------- | -------------- | ------------------ |
| `domain`    | `Eip712Domain` | Domain data.       |
| `typedData` | `S`            | Structurable data. |
| `signature` | `String`       | Signature.         |

#### Example

```java
final String signature = "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c";

boolean verified = key.verifyTypedData(domain, message, signature).join();
```
