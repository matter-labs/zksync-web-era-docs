---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Utilities | zkSync Era Docs
---

# Utilities

The [utilities library](https://github.com/zksync-sdk/zksync-ethers/blob/main/src/utils.ts) contains essential utilities for building on zkSync Era.

:::info

- This document describes common functions and constants you may need.
- Functions used internally are not necessarily described.
- Check the code for the full list.
  :::

## Use the library

Access the library by importing it into your scripts.

```typescript
import { utils } from "zksync-ethers";
```

## Constants

### Interfaces

#### zkSync Era main contract

```typescript
export const ZKSYNC_MAIN_ABI = new utils.Interface(require("../abi/IZkSync.json").abi);
```

#### IERC20

For interacting with native tokens.

```typescript
export const IERC20 = new utils.Interface(require("../abi/IERC20.json").abi);
```

#### IERC1271

```ts
export const IERC1271 = new utils.Interface(require("../abi/IERC1271.json").abi);
```

#### Contract deployer

Used for deploying smart contracts.

```ts
export const CONTRACT_DEPLOYER = new utils.Interface(require("../abi/ContractDeployer.json").abi);
```

#### L1 messenger

Used for sending messages from zkSync Era to Ethereum.

```ts
export const L1_MESSENGER = new utils.Interface(require("../abi/IL1Messenger.json").abi);
```

#### L1 and L2 bridges

Bridge interface ABIs for L1 and L2.

```ts
export const L1_BRIDGE_ABI = new utils.Interface(require("../abi/IL1Bridge.json").abi);
export const L2_BRIDGE_ABI = new utils.Interface(require("../abi/IL2Bridge.json").abi);
```

#### NonceHolder

Used for managing deployment nonce.

```ts
export const NONCE_HOLDER_ABI = new ethers.Interface(require("../abi/INonceHolder.json").abi);
```

#### PaymasterFlow

Used for encoding paymaster flows.

```ts
export const PAYMASTER_FLOW_ABI = new ethers.Interface(require("../abi/IPaymasterFlow.json").abi);
```

#### L1 to L2 alias offset

Used for applying and undoing aliases on addresses during bridging from L1 to L2.

```ts
export const L1_TO_L2_ALIAS_OFFSET = "0x1111000000000000000000000000000000001111";
```

#### Magic value

The value returned from `isEIP1271SignatureCorrect` to confirm signature correctness.

```ts
export const EIP1271_MAGIC_VALUE = "0x1626ba7e";
```

#### EIP712 transaction type

Constant representing an EIP712 transaction type.

```ts
export const EIP712_TX_TYPE = 0x71;
```

#### Priority op transaction on L2

Constant representing a priority transaction operation on L2.

```ts
export const PRIORITY_OPERATION_L2_TX_TYPE = 0xff;
```

#### Max bytecode length

Used for ensuring bytecode length is not over the maximum allowed.

```ts
export const MAX_BYTECODE_LEN_BYTES = ((1 << 16) - 1) * 32;
```

### Useful addresses

#### ETH token layer 1

```typescript
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
```

#### ETH token alias on ZkSync Era

```typescript
export const L2_ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800a";
```

#### Bootloader

```ts
export const BOOTLOADER_FORMAL_ADDRESS = "0x0000000000000000000000000000000000008001";
```

#### Contract deployer

```ts
export const CONTRACT_DEPLOYER_ADDRESS = "0x0000000000000000000000000000000000008006";
```

#### L1 messenger

```ts
export const L1_MESSENGER_ADDRESS = "0x0000000000000000000000000000000000008008";
```

#### Nonce holder

```ts
export const NONCE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000008003";
```

### Gas

#### `DEFAULT_GAS_PER_PUBDATA_LIMIT`

- Use a large amount of gas per pubdata for signing on layer 2.
- The amount ensures any reasonable limit is accepted.

:::info

- The operator is NOT required to use the actual value and can use any value up to that signed by the user.
  :::

```typescript
export const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;
```

#### `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`

The current required gas per pubdata for L1->L2 transactions.

```ts
export const REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT = 800;
```

## Functions

### `applyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

#### Inputs

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `address` | string | Contract address. |

#### Outputs

Returns the `msg.sender` of the L1->L2 transaction as the `address` of the contract that initiated the transaction.

:::tip More info

1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `applyL1ToL2Alias(A)`.
   :::

```ts
export function applyL1ToL2Alias(address: string): string;
```

See also [`undol1tol2alias`](#undol1tol2alias).

### `create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment.

:::warning

- The zkSync Era implementation is slightly different from Ethereum.
  :::

#### Inputs

| Parameter      | Type        | Description                        |
| -------------- | ----------- | ---------------------------------- |
| `sender`       | `Address`   | Sender address.                    |
| `bytecodeHash` | `BytesLike` | Output from zkSolc.                |
| `salt`         | `BytesLike` | Randomization element.             |
| `input`        | `BytesLike` | ABI encoded constructor arguments. |

#### Outputs

- Returns an `Address` object.

```ts
export function create2Address(sender: Address, bytecodeHash: BytesLike, salt: BytesLike, input: BytesLike);
```

:::tip
The `prefix` is equal to `keccak256("zksyncCreate")`.
:::

### `createAddress`

Generates a contract address from deployer's account and nonce.

#### Inputs

| Parameter     | Type           | Description     |
| ------------- | -------------- | --------------- |
| `sender`      | `Address`      | Sender address. |
| `senderNonce` | `BigNumberish` | Sender nonce.   |

#### Outputs

- Returns an `Address` object.

```ts
export function createAddress(sender: Address, senderNonce: BigNumberish);
```

### `eip712TxHash`

Returns the hash of an EIP712 transaction.

#### Inputs

| Parameter       | Type                                                | Description                                    |
| --------------- | --------------------------------------------------- | ---------------------------------------------- |
| `transaction`   | `any`                                               | EIP-712 transaction.                           |
| `ethSignature?` | [`EthereumSignature`](./types.md#ethereumsignature) | ECDSA signature of the transaction (optional). |

```ts
function eip712TxHash(transaction: any, ethSignature?: EthereumSignature);
```

### `estimateCustomBridgeDepositL2Gas`

Used by `estimateDefaultBridgeDepositL2Gas` to estimate L2 gas required for token bridging via a custom ERC20 bridge.

::: tip More info

- See the [default bridges documentation](../../../reference/concepts/bridging-asset.md#default-bridges)
  :::

#### Inputs

| Parameter            | Type           | Description                                 |
| -------------------- | -------------- | ------------------------------------------- |
| `providerL2`         | `Provider`     | zkSync provider.                            |
| `l1BridgeAddress`    | `Address`      | L1 bridge address.                          |
| `l2BridgeAddress`    | `Address`      | L2 bridge address.                          |
| `token`              | `Address`      | Token address.                              |
| `amount`             | `BigNumberish` | Deposit amount.                             |
| `to`                 | `Address`      | Recipient address.                          |
| `bridgeData`         | `BytesLike`    | Bridge data.                                |
| `from?`              | `Address`      | Sender address (optional).                  |
| `gasPerPubdataByte?` | `BigNumberish` | Current gas per byte of pubdata (optional). |
| `l2Value?`           | `BigNumberish` | L2 value (optional).                        |

```ts
export async function estimateCustomBridgeDepositL2Gas(
  providerL2: Provider,
  l1BridgeAddress: Address,
  l2BridgeAddress: Address,
  token: Address,
  amount: BigNumberish,
  to: Address,
  bridgeData: BytesLike,
  from?: Address,
  gasPerPubdataByte?: BigNumberish,
  l2Value?: BigNumberish
): Promise<bigint>;
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

::: tip More info

- See the [default bridges documentation](../../../reference/concepts/bridging-asset.md#default-bridges)
  :::

#### Inputs

| Parameter            | Type           | Description                                 |
| -------------------- | -------------- | ------------------------------------------- |
| `providerL1`         | `Provider`     | Ethers provider.                            |
| `providerL2`         | `Provider`     | zkSync provider.                            |
| `token`              | `Address`      | Token address.                              |
| `amount`             | `BigNumberish` | Deposit amount.                             |
| `to`                 | `Address`      | Recipient address.                          |
| `from?`              | `Address`      | Sender address (optional).                  |
| `gasPerPubdataByte?` | `BigNumberish` | Current gas per byte of pubdata (optional). |

```ts
export async function estimateDefaultBridgeDepositL2Gas(
  providerL1: ethers.providers.Provider,
  providerL2: Provider,
  token: Address,
  amount: BigNumberish,
  to: Address,
  from?: Address,
  gasPerPubdataByte?: BigNumberish
): Promise<bigint>;
```

### `getDeployedContracts`

Returns a log containing details of all deployed contracts related to a transaction receipt parameter.

#### Inputs

| Parameter | Type                                                  | Description          |
| --------- | ----------------------------------------------------- | -------------------- |
| `receipt` | [`TransactionReceipt`](./types.md#transactionreceipt) | Transaction receipt. |

```ts
export function getDeployedContracts(receipt: ethers.providers.TransactionReceipt): DeploymentInfo[];
```

### `getERC20BridgeCalldata`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter        | Type           | Description                                 |
| ---------------- | -------------- | ------------------------------------------- |
| `l1TokenAddress` | `Address`      | Token address on L1.                        |
| `l1Sender`       | `Address`      | Sender address on L1.                       |
| `l2Receiver`     | `Address`      | Recipient address on L2.                    |
| `amount`         | `BigNumberish` | Gas fee for the number of tokens to bridge. |
| `bridgeData`     | `BytesLike`    | Data                                        |

```ts
export async function getERC20BridgeCalldata(l1TokenAddress: string, l1Sender: string, l2Receiver: string, amount: BigNumberish, bridgeData: BytesLike): Promise<string>;
```

### `getERC20DefaultBridgeData`

Returns the data needed for correct initialization of an L1 token counterpart on L2.

#### Inputs

| Parameter        | Type       | Description          |
| ---------------- | ---------- | -------------------- |
| `l1TokenAddress` | `Address`  | Token address on L1. |
| `provider`       | `Provider` | Ethers provider.     |

#### Outputs

An ABI-encoded array of:

- `nameBytes`: `bytes` object representation of token name.
- `symbolBytes`: `bytes` object representation of token symbol.
- `decimalBytes`: `bytes` object representation of token decimal representation.

```ts
export async function getERC20DefaultBridgeData(l1TokenAddress: string, provider: ethers.providers.Provider): Promise<string>;
```

### `getL2HashFromPriorityOp`

Returns the hash of the L2 priority operation from a given transaction receipt and L2 address.

#### Inputs

| Parameter       | Type                                                  | Description                          |
| --------------- | ----------------------------------------------------- | ------------------------------------ |
| `txReceipt`     | [`TransactionReceipt`](./types.md#transactionreceipt) | Receipt of the L1 transaction.       |
| `zkSyncAddress` | `Address`                                             | Address of zkSync Era main contract. |

```ts
export function getL2HashFromPriorityOp(txReceipt: ethers.providers.TransactionReceipt, zkSyncAddress: Address): string;
```

### `getHashedL2ToL1Msg`

Returns a keccak encoded message with a given sender address and block number from the L1 messenger contract.

#### Inputs

| Parameter         | Type        | Description                            |
| ----------------- | ----------- | -------------------------------------- |
| `sender`          | `Address`   | The sender of the message on L2.       |
| `msg`             | `BytesLike` | Encoded message.                       |
| `txNumberInBlock` | number      | Index of the transaction in the block. |

```ts
export function getHashedL2ToL1Msg(sender: Address, msg: BytesLike, txNumberInBlock: number);
```

### `hashBytecode`

Returns the hash of given bytecode.

#### Inputs

| Parameter  | Type        | Description |
| ---------- | ----------- | ----------- |
| `bytecode` | `BytesLike` | Bytecode.   |

```ts
export function hashBytecode(bytecode: ethers.BytesLike): Uint8Array;
```

### `isECDSASignatureCorrect`

Like similar functionality in `ethers.js` but with added try/catch facility. The function returns true if the validation process succeeds.

Called from [`isSignatureCorrect`](#isSignatureCorrect) for non-contract account addresses.

#### Inputs

| Parameter   | Type            | Description                    |
| ----------- | --------------- | ------------------------------ |
| `address`   | `Address`       | Address which signs `msgHash`. |
| `msgHash`   | `Address`       | Hash of the message.           |
| `signature` | `SignatureLike` | Ethers signature.              |

```ts
function isECDSASignatureCorrect(address: string, msgHash: string, signature: SignatureLike): boolean;
```

### `isEIP1271SignatureCorrect`

Called from [`isSignatureCorrect`](#isSignatureCorrect) for contract account addresses, the function returns true if the validation process results in the `EIP1271_MAGIC_VALUE`.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `Address`       | Sender address.          |
| `msgHash`   | `Address`       | The hash of the message. |
| `signature` | `SignatureLike` | Ethers signature.        |

```ts
async function isEIP1271SignatureCorrect(provider: Provider, address: string, msgHash: string, signature: SignatureLike): Promise<boolean>;
```

### `isETH`

Returns true if token represents ETH on L1 or L2.

#### Inputs

| Parameter | Type      | Description        |
| --------- | --------- | ------------------ |
| `token`   | `Address` | The token address. |

```ts
export function isETH(token: Address);
```

### `isMessageSignatureCorrect`

Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `Address`       | Sender address.          |
| `message`   | `Address`       | The hash of the message. |
| `signature` | `SignatureLike` | Ethers signature.        |

```ts
export async function isMessageSignatureCorrect(provider: Provider, address: string, message: ethers.Bytes | string, signature: SignatureLike): Promise<boolean>;
```

### `isSignatureCorrect`

Called from [`isMessageSignatureCorrect`](#ismessagesignaturecorrect) and [`isTypedDataSignatureCorrect`](#istypeddatasignaturecorrect). Returns true if account abstraction EIP712
signature is correct.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `Address`       | Sender address.          |
| `msgHash`   | `Address`       | The hash of the message. |
| `signature` | `SignatureLike` | Ethers signature.        |

```ts
async function isSignatureCorrect(provider: Provider, address: string, msgHash: string, signature: SignatureLike): Promise<boolean>;
```

### `isTypedDataSignatureCorrect`

Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter   | Type                          | Description                                            |
| ----------- | ----------------------------- | ------------------------------------------------------ |
| `provider`  | `Provider`                    | Provider.                                              |
| `address`   | `Address`                     | Sender address.                                        |
| `domain`    | `TypedDataDomain`             | Domain data.                                           |
| `types`     | `Map<string, TypedDataField>` | Map of records pointing from field name to field type. |
| `value`     | `Record<string, any>`         | A single record value.                                 |
| `signature` | `SignatureLike`               | Ethers signature.                                      |

```ts
export async function isTypedDataSignatureCorrect(
  provider: Provider,
  address: string,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>,
  signature: SignatureLike
): Promise<boolean>;
```

### `parseTransaction`

Common parsing transaction function used by internal teams.

Please see the [utilities library definition](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) for more
info.

### `serialize`

Common serialize function used by internal teams.

Please see the [utilities library definition](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) for more
info.

### `sleep`

Common sleep function that pauses execution for a number of milliseconds.

#### Inputs

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `millis`  | number | Number of milliseconds. |

```ts
export function sleep(millis: number);
```

### `undoL1ToL2Alias`

Converts and returns the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

#### Inputs

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `address` | string | Sender address. |

```ts
export function undoL1ToL2Alias(address: string): string;
```

See also [`applyl1tol2alias`](#applyl1tol2alias).
