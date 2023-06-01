# Utilities

The [utilities library](https://github.com/matter-labs/zksync-2-dev/blob/main/sdk/zksync-web3.js/src/utils.ts) contains essential utilities for building on zkSync Era.

:::info
- This document describes common functions and constants you may need.
- Functions used internally are not necessarily described.
- Check the code for the full list.
:::

## Use the library

Access the library by importing it into your scripts.

```typescript
import { utils } from "zksync-web3";
```

## Constants

### Interfaces

#### zkSync Era main contract

```typescript
export const ZKSYNC_MAIN_ABI = new utils.Interface(require('../../abi/IZkSync.json').abi);
```

#### IERC20

For interacting with native tokens.

```typescript
export const IERC20 = new utils.Interface(require('../../abi/IERC20.json').abi);
```

#### IERC1271

```ts
export const IERC1271 = new utils.Interface(require('../../abi/IERC1271.json').abi);
```

#### Contract deployer

Used for deploying smart contracts.

```ts
export const CONTRACT_DEPLOYER = new utils.Interface(require('../../abi/ContractDeployer.json').abi);
```

#### L1 messenger

Used for sending messages from zkSync Era to Ethereum.

```ts
export const L1_MESSENGER = new utils.Interface(require('../../abi/IL1Messenger.json').abi);
```

#### L1 and L2 bridges

Bridge interface ABIs for L1 and L2.

```ts
export const L1_BRIDGE_ABI = new utils.Interface(require('../../abi/IL1Bridge.json').abi);
export const L2_BRIDGE_ABI = new utils.Interface(require('../../abi/IL2Bridge.json').abi);
```

#### L1 to L2 alias offset

Used for applying and undoing aliases on addresses during bridging from L1 to L2.

```ts
export const L1_TO_L2_ALIAS_OFFSET = '0x1111000000000000000000000000000000001111';
```

#### Magic value

The value returned from `isEIP1271SignatureCorrect` to confirm signature correctness.

```ts
export const EIP1271_MAGIC_VALUE = '0x1626ba7e';
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
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
```

#### ETH token alias on ZkSync Era

```typescript
export const L2_ETH_TOKEN_ADDRESS = '0x000000000000000000000000000000000000800a';
```

#### Bootloader

```ts
export const BOOTLOADER_FORMAL_ADDRESS = '0x0000000000000000000000000000000000008001';
```

#### Contract deployer

```ts
export const CONTRACT_DEPLOYER_ADDRESS = '0x0000000000000000000000000000000000008006';
```

#### L1 messenger

```ts
export const L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008';
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

| Parameter | Type          | Description        |
| --------- | ------------- | ------------------ |
| `address` | string        | Contract address.  |

#### Outputs

Returns the `msg.sender` of the L1->L2 transaction as the `address` of the contract that initiated the transaction.

:::tip More info
1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `applyL1ToL2Alias(A)`.
:::

```ts
export function applyL1ToL2Alias(address: string): string {
    return ethers.utils.hexlify(ethers.BigNumber.from(address).add(L1_TO_L2_ALIAS_OFFSET).mod(ADDRESS_MODULO));
}
```

See also [`undol1tol2alias`](#undol1tol2alias).

### `create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment. 

:::warning
- The zkSync Era implementation is slightly different from Ethereum.
:::

#### Inputs

| Parameter      | Type               | Description                        |
| -------------- | ------------------ | ---------------------------------- |
| `sender`       | string             | Sender address.                   |
| `bytecodeHash` | `BytesLike`        | Output from zkSolc.                |
| `salt`         | `BytesLike`        | Randomization element.             |
| `input`        | `BytesLike`        | ABI encoded constructor arguments. |

#### Outputs

- Returns an `Address` object.

```ts
export function create2Address(sender: Address, bytecodeHash: BytesLike, salt: BytesLike, input: BytesLike) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate2'));
    const inputHash = ethers.utils.keccak256(input);
    const addressBytes = ethers.utils
        .keccak256(ethers.utils.concat([prefix, ethers.utils.zeroPad(sender, 32), salt, bytecodeHash, inputHash]))
        .slice(26);
    return ethers.utils.getAddress(addressBytes);
}
```

:::tip
The `prefix` is equal to `keccak256("zksyncCreate")`.
:::

### `createAddress`

Generates a contract address from deployer's account and nonce.

#### Inputs

| Parameter      | Type                  | Description      |
| -------------- | --------------------- | ---------------- |
| `sender`       | string                | Sender address. |
| `senderNonce`  | `BigNumberish` object | Sender nonce.   |
#### Outputs

- Returns an `Address` object.

```ts
export function createAddress(sender: Address, senderNonce: BigNumberish) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate'));
    const addressBytes = ethers.utils
        .keccak256(
            ethers.utils.concat([
                prefix,
                ethers.utils.zeroPad(sender, 32),
                ethers.utils.zeroPad(ethers.utils.hexlify(senderNonce), 32)
            ])
        )
        .slice(26);

    return ethers.utils.getAddress(addressBytes);
}
```

### `eip712TxHash`

Returns the hash of an EIP712 transaction.

#### Inputs

| Parameter      | Type                          | Description                                                  |
| -------------- | ----------------------------- | ------------------------------------------------------------ |
| `transaction`  | any                           | EIP-712 transaction.                                          |
| `ethSignature?` | `EthereumSignature` (optional)| ECDSA signature of the transaction.                          |

```ts
function eip712TxHash(transaction: any, ethSignature?: EthereumSignature) {
    const signedDigest = EIP712Signer.getSignedDigest(transaction);
    const hashedSignature = ethers.utils.keccak256(getSignature(transaction, ethSignature));

    return ethers.utils.keccak256(ethers.utils.hexConcat([signedDigest, hashedSignature]));
}
```

### `estimateCustomBridgeDepositL2Gas`

Used by `estimateDefaultBridgeDepositL2Gas` to estimate L2 gas required for token bridging via a custom ERC20 bridge.

::: tip More info
- See the [default bridges documentation](../../dev/developer-guides/bridging/bridging-asset.md#default-bridges)
:::

#### Inputs

| Parameter           | Type                             | Description                                                  |
| ------------------- | -------------------------------  | ------------------------------------------------------------ |
| `providerL2`        | object                           | zkSync provider.                                             |
| `l1BridgeAddress`   | string                           | L1 bridge address.                                              |
| `l2BridgeAddress`   | string                           | L2 bridge address.                                              |
| `token`             | string                           | Token address.                                               |
| `amount`            | `BigNumberish` object            | Deposit amount.                                              |
| `to`                | string                           | Recipient address.                                           |
| `bridgeData`        | `BytesLike` object               | Data.                                                        |
| `from?`             | string (optional)                | Sender address.                                              |
| `gasPerPubdataByte?`| `BigNumberish` object (optional) | Current gas per byte of pubdata.                             |

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
    gasPerPubdataByte?: BigNumberish
): Promise<BigNumber> {
    const calldata = await getERC20BridgeCalldata(token, from, to, amount, bridgeData);
    return await providerL2.estimateL1ToL2Execute({
        caller: applyL1ToL2Alias(l1BridgeAddress),
        contractAddress: l2BridgeAddress,
        gasPerPubdataByte: gasPerPubdataByte,
        calldata: calldata
    });
}
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

::: tip More info
- See the [default bridges documentation](../../dev/developer-guides/bridging/bridging-asset.md#default-bridges)
:::

#### Inputs

| Parameter           | Type                             | Description                                   |
| ------------------- | -------------------------------- | --------------------------------------------- |
| `providerL1`        | Provider object                           | Ethers provider.                              |
| `providerL2`        | Provider object                         | zkSync provider.                              |
| `token`             | string                           | Token address.                                |
| `amount`            | `BigNumberish` object            | Deposit amount.                               |
| `to`                | string                           | Recipient address.                            |
| `from?`             | string (optional)                | Sender address.                               |
| `gasPerPubdataByte?`| `BigNumberish` object  (optional)| Current gas per byte of pubdata.              |

```ts
export async function estimateDefaultBridgeDepositL2Gas(
    providerL1: ethers.providers.Provider,
    providerL2: Provider,
    token: Address,
    amount: BigNumberish,
    to: Address,
    from?: Address,
    gasPerPubdataByte?: BigNumberish
): Promise<BigNumber> {
    // If the `from` address is not provided, we use a random address, because
    // due to storage slot aggregation, the gas estimation will depend on the address
    // and so estimation for the zero address may be smaller than for the sender.
    from ??= ethers.Wallet.createRandom().address;

    if (token == ETH_ADDRESS) {
        return await providerL2.estimateL1ToL2Execute({
            contractAddress: to,
            gasPerPubdataByte: gasPerPubdataByte,
            caller: from,
            calldata: '0x',
            l2Value: amount
        });
    } else {
        const l1ERC20BridgeAddresses = (await providerL2.getDefaultBridgeAddresses()).erc20L1;
        const erc20BridgeAddress = (await providerL2.getDefaultBridgeAddresses()).erc20L2;
        const bridgeData = await getERC20DefaultBridgeData(token, providerL1);
        return await estimateCustomBridgeDepositL2Gas(
            providerL2,
            l1ERC20BridgeAddresses,
            erc20BridgeAddress,
            token,
            amount,
            to,
            bridgeData,
            from,
            gasPerPubdataByte
        );
    }
}
```

### `getDeployedContracts`

Returns a log containing details of all deployed contracts related to a transaction receipt parameter.

#### Inputs

| Parameter           | Type                         | Description                                                  |
| ------------------- | ---------------------------  | ------------------------------------------------------------ |
| `receipt`           | TransactionReceipt object                     | Transaction receipt.                                         |

```ts
export function getDeployedContracts(receipt: ethers.providers.TransactionReceipt): DeploymentInfo[] {
    const addressBytesLen = 40;
    const deployedContracts = receipt.logs
        .filter(
            (log) =>
                log.topics[0] == utils.id('ContractDeployed(address,bytes32,address)') &&
                log.address == CONTRACT_DEPLOYER_ADDRESS
        )
        // Take the last topic (deployed contract address as U256) and extract address from it (U160).
        .map((log) => {
            const sender = `0x${log.topics[1].slice(log.topics[1].length - addressBytesLen)}`;
            const bytesCodehash = log.topics[2];
            const address = `0x${log.topics[3].slice(log.topics[3].length - addressBytesLen)}`;
            return {
                sender: utils.getAddress(sender),
                bytecodeHash: bytesCodehash,
                deployedAddress: utils.getAddress(address)
            };
        });

    return deployedContracts;
}
```

### `getERC20BridgeCalldata`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter           | Type                         | Description                                   |
| ------------------- | ---------------------------  | --------------------------------------------- |
| `l1TokenAddress`    | string                       | Token address on L1.                          |
| `l1Sender`          | string                       | Sender address on L1.                         |
| `l2Receiver`        | string                       | Recipient address on L2.                      |
| `amount`            | `BigNumberish` object        | Gas fee for the number of tokens to bridge.   |
| `bridgeData`        | `BytesLike` object           | Data                                        |

```ts
export async function getERC20BridgeCalldata(
    l1TokenAddress: string,
    l1Sender: string,
    l2Receiver: string,
    amount: BigNumberish,
    bridgeData: BytesLike
): Promise<string> {
    return L2_BRIDGE_ABI.encodeFunctionData('finalizeDeposit', [
        l1Sender,
        l2Receiver,
        l1TokenAddress,
        amount,
        bridgeData
    ]);
}
```

### `getERC20DefaultBridgeData`

Returns the data needed for correct initialization of an L1 token counterpart on L2.

#### Inputs

| Parameter           | Type                             | Description                                   |
| ------------------- | -------------------------------- | --------------------------------------------- |
| `l1TokenAddress`    | string                           | Token address on L1.                          |
| `provider`          | Provider object                           | Ethers provider.                              |
#### Outputs

An ABI-encoded array of:

- `nameBytes`: `bytes` object representation of token name.
- `symbolBytes`: `bytes` object representation of token symbol.
- `decimalBytes`: `bytes` object representation of token decimal representation.

```ts
export async function getERC20DefaultBridgeData(
    l1TokenAddress: string,
    provider: ethers.providers.Provider
): Promise<string> {
    const token = IERC20MetadataFactory.connect(l1TokenAddress, provider);

    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();

    const coder = new AbiCoder();

    const nameBytes = coder.encode(['string'], [name]);
    const symbolBytes = coder.encode(['string'], [symbol]);
    const decimalsBytes = coder.encode(['uint256'], [decimals]);

    return coder.encode(['bytes', 'bytes', 'bytes'], [nameBytes, symbolBytes, decimalsBytes]);
}
```

### `getL2HashFromPriorityOp`

Returns the hash of the L2 priority operation from a given transaction receipt and L2 address.

#### Inputs

| Parameter           | Type                        | Description                          |
| ------------------- | --------------------------- | ------------------------------------ |
| `txReceipt`         | `TransactionReceipt` object | Receipt of the L1 transaction.       |
| `zkSyncAddress`     | `Address` as string            | Address of zkSync Era main contract. |

```ts
export function getL2HashFromPriorityOp(
    txReceipt: ethers.providers.TransactionReceipt,
    zkSyncAddress: Address
): string {
    let txHash: string = null;
    for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() != zkSyncAddress.toLowerCase()) {
            continue;
        }

        try {
            const priorityQueueLog = ZKSYNC_MAIN_ABI.parseLog(log);
            if (priorityQueueLog && priorityQueueLog.args.txHash != null) {
                txHash = priorityQueueLog.args.txHash;
            }
        } catch {}
    }
    if (!txHash) {
        throw new Error('Failed to parse tx logs');
    }

    return txHash;
}
```

### `getHashedL2ToL1Msg`

Returns a keccak encoded message with a given sender address and block number from the L1 messenger contract.

#### Inputs

| Parameter           | Type                | Description                           |
| ------------------- | ------------------- | ------------------------------------- |
| `sender`            | `Address` as string    | The sender of the message on L2.      |
| `msg`               | `BytesLike` object  | Encoded message.                      |
| `txNumberInBlock`   | number              | Index of the transaction in the block.|

```ts
export function getHashedL2ToL1Msg(sender: Address, msg: BytesLike, txNumberInBlock: number) {
    const encodedMsg = new Uint8Array([
        0, // l2ShardId
        1, // isService
        ...ethers.utils.zeroPad(ethers.utils.hexlify(txNumberInBlock), 2),
        ...ethers.utils.arrayify(L1_MESSENGER_ADDRESS),
        ...ethers.utils.zeroPad(sender, 32),
        ...ethers.utils.arrayify(ethers.utils.keccak256(msg))
    ]);

    return ethers.utils.keccak256(encodedMsg);
}
```

### `hashBytecode`

Returns the hash of given bytecode.

#### Inputs

| Parameter           | Type                | Description             |
| ------------------- | ------------------- | ----------------------  |
| `bytecode`          | `BytesLike` object  | Bytecode. |

```ts
export function hashBytecode(bytecode: ethers.BytesLike): Uint8Array {
    // For getting the consistent length we first convert the bytecode to UInt8Array
    const bytecodeAsArray = ethers.utils.arrayify(bytecode);

    if (bytecodeAsArray.length % 32 != 0) {
        throw new Error('The bytecode length in bytes must be divisible by 32');
    }

    if (bytecodeAsArray.length > MAX_BYTECODE_LEN_BYTES) {
        throw new Error(`Bytecode can not be longer than ${MAX_BYTECODE_LEN_BYTES} bytes`);
    }

    const hashStr = ethers.utils.sha256(bytecodeAsArray);
    const hash = ethers.utils.arrayify(hashStr);

    // Note that the length of the bytecode
    // should be provided in 32-byte words.
    const bytecodeLengthInWords = bytecodeAsArray.length / 32;
    if (bytecodeLengthInWords % 2 == 0) {
        throw new Error('Bytecode length in 32-byte words must be odd');
    }

    const bytecodeLength = ethers.utils.arrayify(bytecodeLengthInWords);

    // The bytecode should always take the first 2 bytes of the bytecode hash,
    // so we pad it from the left in case the length is smaller than 2 bytes.
    const bytecodeLengthPadded = ethers.utils.zeroPad(bytecodeLength, 2);

    const codeHashVersion = new Uint8Array([1, 0]);
    hash.set(codeHashVersion, 0);
    hash.set(bytecodeLengthPadded, 2);

    return hash;
}
```

### `isECDSASignatureCorrect`

Like similar functionality in `ethers.js` but with added try/catch facility. The function returns true if the validation process succeeds.

Called from [`isSignatureCorrect`](#isSignatureCorrect) for non-contract account addresses. 

#### Inputs

| Parameter           | Type                    | Description             |
| ------------------- | ----------------------- | ----------------------  |
| `address`           | string       | Address which signs `msgHash`.    |
| `msgHash`           | string                  | Hash of the message.    |
| `signature`         | `SignatureLike` object  | Ethers signature.       |

```ts
function isECDSASignatureCorrect(address: string, msgHash: string, signature: SignatureLike): boolean {
    try {
        return address == ethers.utils.recoverAddress(msgHash, signature);
    } catch {
        // In case ECDSA signature verification throws an error,
        // we consider the signature incorrect.
        return false;
    }
}
```

### `isEIP1271SignatureCorrect`

Called from [`isSignatureCorrect`](#isSignatureCorrect) for contract account addresses, the function returns true if the validation process results in the `EIP1271_MAGIC_VALUE`.

#### Inputs


| Parameter           | Type                    | Description                  |
| ------------------- | ----------------------- | ---------------------------  |
| `provider`          | `Provider` object       | Provider.            |
| `address`           | string                  | Sender address.    |
| `msgHash`           | string                  | The hash of the message.     |
| `signature`         | `SignatureLike` object  | Ethers signature.            |

```ts
async function isEIP1271SignatureCorrect(
    provider: Provider,
    address: string,
    msgHash: string,
    signature: SignatureLike
): Promise<boolean> {
    const accountContract = new ethers.Contract(address, IERC1271, provider);

    // This line may throw an exception if the contract does not implement the EIP1271 correctly.
    // But it may also throw an exception in case the internet connection is lost.
    // It is the caller's responsibility to handle the exception.
    const result = await accountContract.isValidSignature(msgHash, signature);

    return result == EIP1271_MAGIC_VALUE;
}
```

### `isETH`

Returns true if token represents ETH on L1 or L2.

#### Inputs

| Parameter           | Type                    | Description                  |
| ------------------- | ----------------------- | ---------------------------  |
| `token`             | `Address` object        | The token adress.            |

```ts
export function isETH(token: Address) {
    return token.toLowerCase() == ETH_ADDRESS || token.toLowerCase() == L2_ETH_TOKEN_ADDRESS;
}
```

### `isMessageSignatureCorrect`

Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter           | Type                    | Description                  |
| ------------------- | ----------------------- | ---------------------------  |
| `provider`          | `Provider` object       | The RPC provider.            |
| `address`           | string                  | Sender address as string.    |
| `message`           | string                  | The hash of the message.     |
| `signature`         | `SignatureLike` object  | Ethers signature.            |

```ts
export async function isMessageSignatureCorrect(
    provider: Provider,
    address: string,
    message: ethers.Bytes | string,
    signature: SignatureLike
): Promise<boolean> {
    const msgHash = ethers.utils.hashMessage(message);
    return await isSignatureCorrect(provider, address, msgHash, signature);
}
```

### `isSignatureCorrect`

Called from [`isMessageSignatureCorrect`](#ismessagesignaturecorrect) and [`isTypedDataSignatureCorrect`](#istypeddatasignaturecorrect). Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter           | Type                    | Description                  |
| ------------------- | ----------------------- | ---------------------------  |
| `provider`          | `Provider` object       | The RPC provider.            |
| `address`           | string                  | Sender address as string.    |
| `msgHash`           | string                  | The hash of the message.     |
| `signature`         | `SignatureLike` object  | Ethers signature.            |

```ts
async function isSignatureCorrect(
    provider: Provider,
    address: string,
    msgHash: string,
    signature: SignatureLike
): Promise<boolean> {
    let isContractAccount = false;

    const code = await provider.getCode(address);
    isContractAccount = ethers.utils.arrayify(code).length != 0;

    if (!isContractAccount) {
        return isECDSASignatureCorrect(address, msgHash, signature);
    } else {
        return await isEIP1271SignatureCorrect(provider, address, msgHash, signature);
    }
}
```

### `isTypedDataSignatureCorrect`

Returns true if account abstraction EIP712 signature is correct.

#### Inputs

| Parameter           | Type                       | Description                                                 |
| ------------------- | -------------------------- | ----------------------------------------------------------  |
| `provider`          | `Provider` object          | The RPC provider.                                           |
| `address`           | string                     | Sender address as string.                                   |
| `domain`            | `TypedDataDomain` object   |                                                             |
| `types`             | string                     | The map of records pointing from field name to field type.  |
| `value`             | string                     | A single record.                                            |
| `signature`         | `SignatureLike` object     | Ethers signature.                                           |

```ts
export async function isTypedDataSignatureCorrect(
    provider: Provider,
    address: string,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: SignatureLike
): Promise<boolean> {
    const msgHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
    return await isSignatureCorrect(provider, address, msgHash, signature);
}
```

### `parseTransaction`

Common parsing transaction function used by internal teams. 

Please see the [utilities library definition](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) for more info.

### `serialize`

Common serialize function used by internal teams. 

Please see the [utilities library definition](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) for more info.

### `sleep`

Common sleep function that pauses execution for a number of milliseconds.

#### Inputs

| Parameter           | Type        | Description                                                        |
| ------------------- | ----------- | -----------------------------------------------------------------  |
| `millis`            | number      | The number of time required in milliseconds to pause an execution. |

#### Outputs

- `Promise` object: for pausing execution by the specified amount.

```ts
export function sleep(millis: number) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
```

### `undoL1ToL2Alias`

Converts and returns the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

#### Inputs

| Parameter           | Type        | Description     |
| ------------------- | ----------- | --------------- |
| `address`           | string      | Sender address. |

```ts
export function undoL1ToL2Alias(address: string): string {
    let result = ethers.BigNumber.from(address).sub(L1_TO_L2_ALIAS_OFFSET);
    if (result.lt(BigNumber.from(0))) {
        result = result.add(ADDRESS_MODULO);
    }

    return ethers.utils.hexlify(result);
}
```

See also [`applyl1tol2alias`](#applyl1tol2alias).