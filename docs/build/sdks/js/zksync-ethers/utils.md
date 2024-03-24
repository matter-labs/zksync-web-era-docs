---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Utilities | zkSync Docs
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
export const ZKSYNC_MAIN_ABI = new utils.Interface(require("../abi/IZkSync.json"));
```

#### IERC20

For interacting with native tokens.

```typescript
export const IERC20 = new utils.Interface(require("../abi/IERC20.json"));
```

#### IERC1271

For interacting with contract which implements ERC1271.

```ts
export const IERC1271 = new utils.Interface(require("../abi/IERC1271.json"));
```

#### Contract deployer

Used for deploying smart contracts.

```ts
export const CONTRACT_DEPLOYER = new utils.Interface(require("../abi/ContractDeployer.json"));
```

#### L1 messenger

Used for sending messages from zkSync Era to Ethereum.

```ts
export const L1_MESSENGER = new utils.Interface(require("../abi/IL1Messenger.json"));
```

#### L1 and L2 bridges

Bridge interface ABIs for L1 and L2.

```ts
export const L1_BRIDGE_ABI = new utils.Interface(require("../abi/IL1Bridge.json"));
export const L2_BRIDGE_ABI = new utils.Interface(require("../abi/IL2Bridge.json"));
```

#### NonceHolder

Used for managing deployment nonce.

```ts
export const NONCE_HOLDER_ABI = new ethers.Interface(require("../abi/INonceHolder.json"));
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
export const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50_000;
```

#### `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`

The current required gas per pubdata for L1->L2 transactions.

```ts
export const REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT = 800;
```

## Functions

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
| `address` | string | Contract address. |

```ts
export function applyL1ToL2Alias(address: string): string;
```

#### Example

```ts
const l1ContractAddress = "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb";
const l2ContractAddress = utils.applyL1ToL2Alias(l1ContractAddress);
// l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC"
```

See also [`undol1tol2alias`](#undol1tol2alias).

### `checkBaseCost`

Checks if the transaction's base cost is greater than the provided value, which covers the transaction's cost. Throws an error if it is not.

#### Inputs

| Parameter  | Type           | Description                                |
| ---------- | -------------- | ------------------------------------------ |
| `baseCost` | `BigNumberish` | transaction's base cost.                   |
| `value`    | `BigNumberish` | value which covers the transaction's cost. |

```ts
async function checkBaseCost(baseCost: ethers.BigNumberish, value: ethers.BigNumberish | Promise<ethers.BigNumberish>): Promise<void>;
```

### Example

```ts
const baseCost = 100;
const value = 99;
try {
  await utils.checkBaseCost(baseCost, value);
} catch (e) {
  // e.message = `The base cost of performing the priority operation is higher than the provided value parameter for the transaction: baseCost: ${baseCost}, provided value: ${value}`,
}
```

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

```ts
export function create2Address(sender: Address, bytecodeHash: BytesLike, salt: BytesLike, input: BytesLike): string;
```

#### Example

```ts
const address = utils.create2Address("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", "0x010001cb6a6e8d5f6829522f19fa9568660e0a9cd53b2e8be4deb0a679452e41", "0x01", "0x01");
// address = "0x29bac3E5E8FFE7415F97C956BFA106D70316ad50"
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

```ts
export function createAddress(sender: Address, senderNonce: BigNumberish): string;
```

#### Example

```ts
const address = utils.createAddress("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", 1);
// address = "0x4B5DF730c2e6b28E17013A1485E5d9BC41Efe021"
```

### `eip712TxHash`

Returns the hash of an EIP712 transaction.

#### Inputs

| Parameter       | Type                                                                   | Description                                    |
| --------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `transaction`   | `Transaction` or [`TransactionRequest`](./types.md#transactionrequest) | EIP-712 transaction.                           |
| `ethSignature?` | [`EthereumSignature`](./types.md#ethereumsignature)                    | ECDSA signature of the transaction (optional). |

```ts
function eip712TxHash(transaction: any, ethSignature?: EthereumSignature): string;
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

::: tip More info

- See the [default bridges documentation](../../../developer-reference/bridging-asset.md#default-bridges)
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

| Parameter | Type                        | Description          |
| --------- | --------------------------- | -------------------- |
| `receipt` | `ethers.TransactionReceipt` | Transaction receipt. |

```ts
export function getDeployedContracts(receipt: ethers.TransactionReceipt): DeploymentInfo[];
```

### `getERC20BridgeCalldata`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token bridging.

#### Inputs

| Parameter        | Type           | Description                                 |
| ---------------- | -------------- | ------------------------------------------- |
| `l1TokenAddress` | `Address`      | Token address on L1.                        |
| `l1Sender`       | `Address`      | Sender address on L1.                       |
| `l2Receiver`     | `Address`      | Recipient address on L2.                    |
| `amount`         | `BigNumberish` | Gas fee for the number of tokens to bridge. |
| `bridgeData`     | `BytesLike`    | Additional bridge data                      |

```ts
export async function getERC20BridgeCalldata(l1TokenAddress: string, l1Sender: string, l2Receiver: string, amount: BigNumberish, bridgeData: BytesLike): Promise<string>;
```

### `getL2HashFromPriorityOp`

Returns the hash of the L2 priority operation from a given transaction receipt and L2 address.

#### Inputs

| Parameter       | Type                        | Description                          |
| --------------- | --------------------------- | ------------------------------------ |
| `txReceipt`     | `ethers.TransactionReceipt` | Receipt of the L1 transaction.       |
| `zkSyncAddress` | `Address`                   | Address of zkSync Era main contract. |

```ts
export function getL2HashFromPriorityOp(txReceipt: ethers.TransactionReceipt, zkSyncAddress: Address): string;
```

### `getHashedL2ToL1Msg`

Returns a keccak encoded message with a given sender address and block number from the L1 messenger contract.

#### Inputs

| Parameter         | Type        | Description                            |
| ----------------- | ----------- | -------------------------------------- |
| `sender`          | `Address`   | The sender of the message on L2.       |
| `msg`             | `BytesLike` | Encoded message.                       |
| `txNumberInBlock` | `number`    | Index of the transaction in the block. |

```ts
export function getHashedL2ToL1Msg(sender: Address, msg: BytesLike, txNumberInBlock: number): string;
```

#### Example

```ts
const withdrawETHMessage = "0x6c0960f936615cf349d7f6344891b1e7ca7c72883f5dc04900000000000000000000000000000000000000000000000000000001a13b8600";
const withdrawETHMessageHash = utils.getHashedL2ToL1Msg("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049", withdrawETHMessage, 0);
// withdrawETHMessageHash = "0xd8c80ecb64619e343f57c3b133c6c6d8dd0572dd3488f1ca3276c5b7fd3a938d"
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

#### Examples

```ts
const bytecode =
  "0x000200000000000200010000000103550000006001100270000000130010019d0000008001000039000000400010043f0000000101200190000000290000c13d0000000001000031000000040110008c000000420000413d0000000101000367000000000101043b000000e001100270000000150210009c000000310000613d000000160110009c000000420000c13d0000000001000416000000000110004c000000420000c13d000000040100008a00000000011000310000001702000041000000200310008c000000000300001900000000030240190000001701100197000000000410004c000000000200a019000000170110009c00000000010300190000000001026019000000000110004c000000420000c13d00000004010000390000000101100367000000000101043b000000000010041b0000000001000019000000490001042e0000000001000416000000000110004c000000420000c13d0000002001000039000001000010044300000120000004430000001401000041000000490001042e0000000001000416000000000110004c000000420000c13d000000040100008a00000000011000310000001702000041000000000310004c000000000300001900000000030240190000001701100197000000000410004c000000000200a019000000170110009c00000000010300190000000001026019000000000110004c000000440000613d00000000010000190000004a00010430000000000100041a000000800010043f0000001801000041000000490001042e0000004800000432000000490001042e0000004a00010430000000000000000000000000000000000000000000000000000000000000000000000000ffffffff0000000200000000000000000000000000000040000001000000000000000000000000000000000000000000000000000000000000000000000000006d4ce63c0000000000000000000000000000000000000000000000000000000060fe47b18000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000080000000000000000000000000000000000000000000000000000000000000000000000000000000009c8c8fa789967eb514f3ec9def748480945cc9b10fcbd1a19597d924eb201083";
const hashedBytecode = utils.hashBytecode(bytecode);
/* 
hashedBytecode =  new Uint8Array([
    1, 0, 0, 27, 57, 231, 154, 55, 0, 164, 201, 96, 244, 120, 23, 112, 54, 34, 224, 133,
    160, 122, 88, 164, 112, 80, 0, 134, 48, 138, 74, 16,
  ]),
);
 */
```

### `isECDSASignatureCorrect`

Validates signatures from non-contract account addresses (EOA). Provides similar functionality in `ethers.js` but returns `true` if the
validation process succeeds, otherwise returns `false`.

Called from [`isSignatureCorrect`](#isSignatureCorrect) for non-contract account addresses.

#### Inputs

| Parameter   | Type            | Description                    |
| ----------- | --------------- | ------------------------------ |
| `address`   | `string`        | Address which signs `msgHash`. |
| `msgHash`   | `Address`       | Hash of the message.           |
| `signature` | `SignatureLike` | Ethers signature.              |

```ts
function isECDSASignatureCorrect(address: string, msgHash: string, signature: SignatureLike): boolean;
```

#### Examples

```ts
import { Wallet, utils } from "zksync-ethers";

const ADDRESS = "<WALLET_ADDRESS>";
const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const message = "Hello, world!";
const signature = await new Wallet(PRIVATE_KEY).signMessage(message);
// ethers.Wallet can be used as well
// const signature =  await new ethers.Wallet(PRIVATE_KEY).signMessage(message);

const isValidSignature = await utils.isECDSASignatureCorrect(ADDRESS, message, signature);
// isValidSignature = true
```

See also [`isMessageSignatureCorrect()`](#ismessagesignaturecorrect) and [`isTypedDataSignatureCorrect()`](#istypeddatasignaturecorrect)
to validate signatures.

### `isEIP1271SignatureCorrect`

Called from [`isSignatureCorrect`](#isSignatureCorrect) for contract account addresses, the function returns true if the validation process results in the `EIP1271_MAGIC_VALUE`.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `string`        | Sender address.          |
| `msgHash`   | `string`        | The hash of the message. |
| `signature` | `SignatureLike` | Ethers signature.        |

```ts
async function isEIP1271SignatureCorrect(provider: Provider, address: string, msgHash: string, signature: SignatureLike): Promise<boolean>;
```

See also [`isMessageSignatureCorrect()`](#ismessagesignaturecorrect) and [`isTypedDataSignatureCorrect()`](#istypeddatasignaturecorrect)
to validate signatures.

### `isETH`

Returns true if token represents ETH on L1 or L2.

#### Inputs

| Parameter | Type      | Description        |
| --------- | --------- | ------------------ |
| `token`   | `Address` | The token address. |

```ts
export function isETH(token: Address);
```

#### Example

```ts
const isL1ETH = utils.isETH(utils.ETH_ADDRESS); // true
const isL2ETH = utils.isETH(utils.L2_ETH_TOKEN_ADDRESS); // true
```

### `isMessageSignatureCorrect`

Returns whether the account abstraction message signature is correct.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `string`        | Sender address.          |
| `message`   | `string`        | The hash of the message. |
| `signature` | `SignatureLike` | Ethers signature.        |

```ts
export async function isMessageSignatureCorrect(provider: Provider, address: string, message: ethers.Bytes | string, signature: SignatureLike): Promise<boolean>;
```

#### Example

```ts
import { Wallet, utils, Provider } from "zksync-ethers";

const ADDRESS = "<WALLET_ADDRESS>";
const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const message = "Hello, world!";
const signature = await new Wallet(PRIVATE_KEY).signMessage(message);
// ethers.Wallet can be used as well
// const signature =  await new ethers.Wallet(PRIVATE_KEY).signMessage(message);

const isValidSignature = await utils.isMessageSignatureCorrect(provider, ADDRESS, message, signature);
// isValidSignature = true
```

### `isSignatureCorrect`

Called from [`isMessageSignatureCorrect`](#ismessagesignaturecorrect) and [`isTypedDataSignatureCorrect`](#istypeddatasignaturecorrect). Returns true if account abstraction
signature is correct.

#### Inputs

| Parameter   | Type            | Description              |
| ----------- | --------------- | ------------------------ |
| `provider`  | `Provider`      | Provider.                |
| `address`   | `string`        | Sender address.          |
| `msgHash`   | `string`        | The hash of the message. |
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
| `address`   | `string`                      | Sender address.                                        |
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

#### Example

```ts
import { Wallet, utils, Provider, EIP712Signer } from "zksync-ethers";

const ADDRESS = "<WALLET_ADDRESS>";
const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const tx: types.TransactionRequest = {
  type: 113,
  chainId: 270,
  from: ADDRESS,
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  value: BigInt(7_000_000),
};

const eip712Signer = new EIP712Signer(
  new Wallet(PRIVATE_KEY), // or new ethers.Wallet(PRIVATE_KEY),
  Number((await provider.getNetwork()).chainId)
);

const signature = await eip712Signer.sign(tx);

const isValidSignature = await utils.isTypedDataSignatureCorrect(provider, ADDRESS, await eip712Signer.getDomain(), utils.EIP712_TYPES, EIP712Signer.getSignInput(tx), signature);
// isValidSignature = true
```

### `parseEip712`

Parses an EIP712 transaction from a payload.

#### Inputs

| Parameter | Type        | Description |
| --------- | ----------- | ----------- |
| `payload` | `BytesLike` | Payload.    |

```ts
export function parseEip712(payload: ethers.BytesLike): TransactionLike;
```

### Example

```ts
import { types } from "zksync-ethers";

const serializedTx =
  "0x71f87f8080808094a61464658afeaf65cccaafd3a512b69a83b77618830f42408001a073a20167b8d23b610b058c05368174495adf7da3a4ed4a57eb6dbdeb1fafc24aa02f87530d663a0d061f69bb564d2c6fb46ae5ae776bbd4bd2a2a4478b9cd1b42a82010e9436615cf349d7f6344891b1e7ca7c72883f5dc04982c350c080c0";
const tx: types.TransactionLike = utils.parseEip712(serializedTx);
/*
tx: types.TransactionLike = {
  type: 113,
  nonce: 0,
  maxPriorityFeePerGas: BigInt(0),
  maxFeePerGas: BigInt(0),
  gasLimit: BigInt(0),
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  value: BigInt(1000000),
  data: "0x",
  chainId: BigInt(270),
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  customData: {
    gasPerPubdata: BigInt(50000),
    factoryDeps: [],
    customSignature: "0x",
    paymasterParams: null,
  },
  hash: "0x9ed410ce33179ac1ff6b721060605afc72d64febfe0c08cacab5a246602131ee",
};
 */
```

### `serializeEip712`

Serializes an EIP712 transaction and include a signature if it is provided. Throws an error if:

- `transaction.customData.customSignature` is an empty `string`. The transaction should be signed and the
  `transaction.customData.customSignature` field should be populated with the signature. It should not be specified if the transaction is not signed.
- `transaction.chainId` is not provided.
- `transaction.from` is not provided.

#### Inputs

| Parameter     | Type              | Description                                                            |
| ------------- | ----------------- | ---------------------------------------------------------------------- |
| `transaction` | `TransactionLike` | Transaction that needs to be serialized.                               |
| `signature?`  | `SignatureLike`   | Ethers signature that needs to be included in transactions (optional). |

```ts
export function serializeEip712(transaction: TransactionLike, signature?: ethers.SignatureLike): string;
```

#### Examples

Serialize EIP712 transaction without signature.

```ts
const serializedTx = utils.serializeEip712({ chainId: 270, from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049" }, null);

// serializedTx = "0x71ea8080808080808082010e808082010e9436615cf349d7f6344891b1e7ca7c72883f5dc04982c350c080c0"
```

Serialize EIP712 transaction with signature.

```ts
const signature = ethers.Signature.from("0x73a20167b8d23b610b058c05368174495adf7da3a4ed4a57eb6dbdeb1fafc24aaf87530d663a0d061f69bb564d2c6fb46ae5ae776bbd4bd2a2a4478b9cd1b42a");

const serializedTx = utils.serializeEip712(
  {
    chainId: 270,
    from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
    to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
    value: 1_000_000,
  },
  signature
);
// serializedTx = "0x71f87f8080808094a61464658afeaf65cccaafd3a512b69a83b77618830f42408001a073a20167b8d23b610b058c05368174495adf7da3a4ed4a57eb6dbdeb1fafc24aa02f87530d663a0d061f69bb564d2c6fb46ae5ae776bbd4bd2a2a4478b9cd1b42a82010e9436615cf349d7f6344891b1e7ca7c72883f5dc04982c350c080c0"
```

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

#### Example

```ts
const l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC";
const l1ContractAddress = utils.undoL1ToL2Alias(l2ContractAddress);
// const l1ContractAddress = "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb"
```

See also [`applyl1tol2alias`](#applyl1tol2alias).
