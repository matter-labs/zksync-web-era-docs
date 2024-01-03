---
head:
  - - meta
    - name: "twitter:title"
      content: Java SDK Accounts | zkSync Docs
---

# Accounts

## PrivateKeyEthSigner

Used to get wallet address, generate signatures, and verify messages.

### Create from credentials and chain id

[Example](getting-started.md#ethsigner)

#### Inputs and outputs

| Name        | Description              |
| ----------- | ------------------------ |
| credentials | Credentials object.      |
| chainId     | Chain id of the network. |
| returns     | PrivateKeyEthSigner.     |

### `signTypedData`

```java
String signature = signer.signTypedData(domain, message).join();
```

Signs typed-struct using Ethereum private key with the EIP-712 signature standard.

#### Inputs and outputs

| Name      | Description                                    |
| --------- | ---------------------------------------------- |
| domain    | EIP712 domain.                                 |
| typedData | Object implementing EIP712 structure standard. |
| returns   | Prepared gas estimate request.                 |

### `verifyTypedData`

Verify typed, EIP-712 struct standard.

```java
boolean verified = signer.verifyTypedData(domain, message, signature).join();
```

#### Inputs and outputs

| Name      | Description                                    |
| --------- | ---------------------------------------------- |
| domain    | EIP712 domain.                                 |
| typedData | Object implementing EIP712 structure standard. |
| returns   | Prepared gas estimate request.                 |

### `signMessage`

Sign raw message.

```java
signer.signMessage(Eip712Encoder.typedDataToSignedBytes(domain, typedData), false);
```

#### Inputs and outputs

| Name      | Description                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------- |
| message   | Message to sign.                                                                               |
| addPrefix | If true then add secure prefix (<a href="https://eips.ethereum.org/EIPS/eip-712">EIP-712</a>). |
| returns   | Signature object.                                                                              |

### `verifySignature`

Verify signature with raw message.

```java
signer.verifySignature(signature, Eip712Encoder.typedDataToSignedBytes(domain, typedData), false);
```

#### Inputs and outputs

| Name      | Description                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------- |
| signature | Signature string.                                                                              |
| message   | Message to verify in bytes.                                                                    |
| prefixed  | If true then add secure prefix (<a href="https://eips.ethereum.org/EIPS/eip-712">EIP-712</a>). |
| returns   | true on verification success.                                                                  |

### `getAddress`

Get wallet address.

```java
signer.getAddress();
```

#### Inputs and outputs

| Name    | Description            |
| ------- | ---------------------- |
| returns | Address in hex string. |

## Wallet

### Creating wallet from a private key

The `Wallet` object from `zksync-web3` can be created from an Ethereum private key.
[Example](getting-started.md#zksync-era-wallet)

#### Inputs and outputs

| Name    | Description                                                           |
| ------- | --------------------------------------------------------------------- |
| zksync  | A zkSync Era node provider. Needed for interaction with zkSync Era.   |
| signer  | Used to get wallet address, generate signatures, and verify messages. |
| token   | Token object.                                                         |
| returns | The new `Wallet` object.                                              |

### `transfer`

There are multiple ways to transfer coins or tokens with a wallet object.

#### Transfer coins

[Native coins example](getting-started.md#transfer-native-coins-via-zksyncwallet)

| Name    | Description                                                      |
| ------- | ---------------------------------------------------------------- |
| to      | Recipient address.                                               |
| amount  | Amount of funds to be transferred in minimum denomination (wei). |
| returns | Prepared remote call of transaction.                             |

##### Transfer coins or tokens

##### With specific token

[Example](getting-started.md#transfer-erc20-coins-via-zksyncwallet)

| Name    | Description                                                      |
| ------- | ---------------------------------------------------------------- |
| to      | Recipient address.                                               |
| amount  | Amount of funds to be transferred in minimum denomination (wei). |
| token   | Token object supported by ZkSync Era.                            |
| returns | Prepared remote call of transaction.                             |

##### With specific token and custom nonce

| Name    | Description                                                      |
| ------- | ---------------------------------------------------------------- |
| to      | Recipient address.                                               |
| amount  | Amount of funds to be transferred in minimum denomination (wei). |
| token   | Token object supported by ZkSync Era.                            |
| nonce   | Custom nonce value of the wallet.                                |
| returns | Prepared remote call of transaction.                             |

### `withdraw`

Withdraw native coins or tokens from L1.

[Example](getting-started.md#withdraw-funds-via-zksyncwallet)

| Name    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| to      | Address of the L1 wallet from which funds will be withdrawn. |
| amount  | Amount of funds to be withdrawn.                             |
| returns | Prepared remote call of transaction.                         |

#### With specific token

| Name    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| to      | Address of the L1 wallet L1 from which funds will be withdrawn. |
| amount  | Amount of funds to be withdrawn.                                |
| token   | Token object supported by ZkSync Era.                           |
| returns | Prepared remote call of transaction.                            |

#### With specific token and custom nonce

| Name    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| to      | Address of the L1 wallet from which funds will be withdrawn. |
| amount  | Amount of funds to be withdrawn.                             |
| token   | Token object supported by ZkSync Era.                        |
| nonce   | Custom nonce value of the wallet.                            |
| returns | Prepared remote call of transaction.                         |

### `deploy`

Deploy new smart contract onto chain (this method uses `create2`, see <a href="https://eips.ethereum.org/EIPS/eip-1014">EIP-1014</a>)

[Example](getting-started.md#deploy-contract-via-zksyncwallet)

| Name     | Description                          |
| -------- | ------------------------------------ |
| bytecode | Compiled bytecode of the contract.   |
| returns  | Prepared remote call of transaction. |

#### With constructor

[Example](getting-started.md#deploy-contract-with-constructor-via-zksyncwallet)

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| bytecode | Compiled bytecode of the contract.            |
| calldata | Encoded constructor parameter(s) of contract. |
| returns  | Prepared remote call of transaction.          |

#### With constructor and custom nonce

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| bytecode | Compiled bytecode of the contract.            |
| calldata | Encoded constructor parameter(s) of contract. |
| nonce    | Custom nonce value of the wallet.             |
| returns  | Prepared remote call of transaction.          |

### `execute`

Execute function of deployed contract.

[Example](getting-started.md#execute-contact-via-zksyncwallet)

| Name            | Description                                        |
| --------------- | -------------------------------------------------- |
| contractAddress | Address of deployed contract.                      |
| function        | Prepared function call with or without parameters. |
| returns         | Prepared remote call of transaction.               |

#### With custom nonce

| Name            | Description                                        |
| --------------- | -------------------------------------------------- |
| contractAddress | Address of deployed contract.                      |
| function        | Prepared function call with or without parameters. |
| nonce           | Custom nonce value of the wallet.                  |
| returns         | Prepared remote call of transaction.               |

### `getBalance`

#### Get balance of wallet in native coin

```java
BigInteger balance = wallet.getBalance().send();
```

| Name    | Description                |
| ------- | -------------------------- |
| address | Wallet address.            |
| returns | Prepared get balance call. |

#### Get balance of wallet in token

```java
Token token = new Token("L1_ADDRESS", "L2_ADDRESS", "SYMBOL", 18);
BigInteger = wallet.getBalance(token).send();
```

| Name    | Description                           |
| ------- | ------------------------------------- |
| token   | Token object supported by ZkSync Era. |
| returns | Prepared get balance call.            |

#### Get balance of wallet by address of token

```java
Token token = new Token("L1_ADDRESS", "L2_ADDRESS", "SYMBOL", 18);
BigInteger = wallet.getBalance("ADDRESS" ,token).send();
```

| Name    | Description                           |
| ------- | ------------------------------------- |
| address | Wallet address.                       |
| token   | Token object supported by ZkSync Era. |
| returns | Prepared get balance call.            |

#### Get balance of wallet by address of token at block `DefaultBlockParameter`

```java
BigInteger = wallet.getBalance(address, token, ZkBlockParameterName.COMMITTED).send();
```

| Name    | Description                           |
| ------- | ------------------------------------- |
| address | Wallet address.                       |
| token   | Token object supported by ZkSync Era. |
| at      | Block variant.                        |
| returns | Prepared get balance call.            |

### `getNonce`

#### Get nonce for wallet at block `DefaultBlockParameter`

```java
BigInteger = wallet.getNonce(ZkBlockParameterName.COMMITTED).send(); //ZkBlockParameterName.FINALIZED
```

| Name    | Description              |
| ------- | ------------------------ |
| at      | Block variant.           |
| returns | Prepared get nonce call. |

#### Get nonce for wallet at block `COMMITTED` `ZkBlockParameterName`

```java
BigInteger = wallet.getNonce().send();
```

| Name    | Description              |
| ------- | ------------------------ |
| returns | Prepared get nonce call. |
