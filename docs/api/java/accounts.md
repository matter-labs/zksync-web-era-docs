# Accounts

## PrivateKeyEthSigner

Used to get wallet address, generate signatures, and verify messages.

### `signTypedData`

Signs typed-struct using Ethereum private key with the EIP-712 signature standard.


#### Inputs and outputs

| Name   | Description                                    |
|--------|------------------------------------------------|
| domain | EIP712 domain.                                 |
| typedData | Object implementing EIP712 structure standard. |
| returns | Prepared gas estimate request.                 |

### `verifyTypedData`

Verify typed EIP-712 struct standard.

#### Inputs and outputs

| Name   | Description                                    |
|--------|------------------------------------------------|
| domain | EIP712 domain.                                 |
| typedData | Object implementing EIP712 structure standard. |
| returns | Prepared estimate gas request.                 |

### `signMessage`

Sign raw message

#### Inputs and outputs

| Name   | Description                       |
|--------|-----------------------------------|
| message | Message to sign.                                 |
| addPrefix | If true then add secure prefix (<a href="https://eips.ethereum.org/EIPS/eip-712">EIP-712</a>). |
| returns | Signature object.    |

### `verifySignature`

Verify signature with raw message

#### Inputs and outputs

| Name   | Description                                                                                   |
|--------|-----------------------------------------------------------------------------------------------|
| signature | Signature object.                                                                                             |
| message | Message to verify.                                                                            |
| prefixed | If true then add secure prefix (<a href="https://eips.ethereum.org/EIPS/eip-712">EIP-712</a>). |
| returns | true on verification success.                                                                             |

### `getAddress`

Get wallet address

#### Inputs and outputs

| Name   | Description                       |
|--------|-----------------------------------|
| returns | Address in hex string.    |

## Wallet

### Creating wallet from a private key

The `Wallet` object from `zksync-web3` can be created from Ethereum private key.

#### Inputs and outputs

| Name    | Description                                                          |
|---------|----------------------------------------------------------------------|
| zksync  | A zkSync node provider. Needed for interaction with zkSync.          |
| signer  | Used to get wallet address, generate signatures and verify messages. |
| token   | Token object.                                                        |
| returns | The new `Wallet` object.                                             |

### `transfer`

There are multiple ways to transfer coins or tokens with wallet object.

Transfer coins

| Name    | Description                                                         |
|---------|---------------------------------------------------------------------|
| to      | Reciever address.                                                   |
| amount  | Amount of funds to be transferred in minimal denomination (in Wei). |
| returns | Prepared remote call of transaction.                                |

Transfer coins or tokens

With specific token

| Name    | Description                                                         |
|---------|---------------------------------------------------------------------|
| to      | Reciever address.                                                   |
| amount  | Amount of funds to be transferred in minimal denomination (in Wei). |
| token   | Token object supported by ZkSync.                                                   |
| returns | Prepared remote call of transaction.                                |

With specific token and custom nonce

| Name    | Description                                                         |
|---------|---------------------------------------------------------------------|
| to      | Reciever address.                                                   |
| amount  | Amount of funds to be transferred in minimal denomination (in Wei). |
| token   | Token object supported by ZkSync.                                                   |
| nonce   | Custom nonce value of the wallet.                                                   |
| returns | Prepared remote call of transaction.                                |

### `withdraw`

Withdraw native coins or tokens to L1 chain

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| to      | Address of the wallet in L1 to that funds will be withdrawn.                                                   |
| amount  | Amount of the funds to be withdrawn. |
| returns | Prepared remote call of transaction.                               |

With specific token

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| to      | Address of the wallet in L1 to that funds will be withdrawn.                                                   |
| amount  | Amount of the funds to be withdrawn. |
| token   | Token object supported by ZkSync.                                                  |
| returns | Prepared remote call of transaction.                               |

With specific token and custom nonce

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| to      | Address of the wallet in L1 to that funds will be withdrawn.                                                   |
| amount  | Amount of the funds to be withdrawn. |
| token   | Token object supported by ZkSync.                                                  |
| nonce   | Custom nonce value of the wallet.                                                  |
| returns | Prepared remote call of transaction.                               |

### `deploy`

Deploy new smart-contract into chain (this method uses create2, see <a href="https://eips.ethereum.org/EIPS/eip-1014">EIP-1014</a>)

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| bytecode      | Compiled bytecode of the contract.                                                   |
| returns | Prepared remote call of transaction.                               |

With constructor

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| bytecode      | Compiled bytecode of the contract.                                                   |
| calldata  | Encoded constructor parameter of contract. |
| returns | Prepared remote call of transaction.                               |

With constructor and custom nonce

| Name    | Description                                                        |
|---------|--------------------------------------------------------------------|
| bytecode      | Compiled bytecode of the contract.                                                   |
| calldata  | Encoded constructor parameter of contract. |
| nonce   | Custom nonce value of the wallet.                                                  |
| returns | Prepared remote call of transaction.                               |

### `execute`

Execute function of deployed contract

| Name    | Description                          |
|---------|--------------------------------------|
| contractAddress      | Address of deployed contract.        |
| function  | Prepared function call with or without parameters.                                   |
| returns | Prepared remote call of transaction. |

With custom nonce

| Name    | Description                          |
|---------|--------------------------------------|
| contractAddress      | Address of deployed contract.        |
| function  | Prepared function call with or without parameters.                                   |
| nonce   | Custom nonce value of the wallet.    |
| returns | Prepared remote call of transaction. |

### `getBalance`
Get balance of wallet in natice coin (wallet address gets from EthSigner)

| Name   | Description                       |
|--------|-----------------------------------|
| address | Wallet address.                   |
| returns | Prepared get balance call.        |

Get balance of wallet in Token (wallet address gets from EthSigner)

| Name   | Description                       |
|--------|-----------------------------------|
| token  | Token object supported by ZkSync. |
| returns | Prepared get balance call.        |

Get balance of wallet in native coin

| Name   | Description                       |
|--------|-----------------------------------|
| address | Wallet address.                   |
| returns | Prepared get balance call.        |

Get balance of wallet by address in Token

| Name   | Description                       |
|--------|-----------------------------------|
| address | Wallet address.                   |
| token  | Token object supported by ZkSync. |
| returns | Prepared get balance call.        |

Get balance of wallet by address in Token at block DefaultBlockParameter

| Name   | Description                       |
|--------|-----------------------------------|
| address | Wallet address.                   |
| token  | Token object supported by ZkSync. |
| at     | Block variant.                    |
| returns | Prepared get balance call.        |

### `getNonce`

Get nonce for wallet at block DefaultBlockParameter (wallet address gets from EthSigner)

| Name   | Description              |
|--------|--------------------------|
| at     | Block variant.           |
| returns | Prepared get nonce call. |

Get nonce for wallet at block `COMMITTED` ZkBlockParameterName (wallet address gets from EthSigner)

| Name   | Description              |
|--------|--------------------------|
| returns | Prepared get nonce call. |
