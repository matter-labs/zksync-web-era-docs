# Utilities

The [utilities library](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) contains essential utilities for building on zkSync Era.

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

- Use a large amount of gas for signing on layer 2.
- The amount ensures any reasonable limit is accepted. 

:::info
- The operator is NOT required to use the actual value and can use any value up to that signed by the user.
:::

```typescript
export const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;
```

#### `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`

Any amount is possible for L1->L2 transactions because the cost per gas is adjusted.

```ts
export const REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT = 800;
```

## Functions

### `applyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

See also [`undol1tol2alias`](#undol1tol2alias).

```ts
export function applyL1ToL2Alias(address: string): string {
    return ethers.utils.hexlify(ethers.BigNumber.from(address).add(L1_TO_L2_ALIAS_OFFSET));
}
```

### `checkBaseCost`

Checks the base cost is within prescribed limits.

```ts
export async function checkBaseCost(baseCost: ethers.BigNumber, value: ethers.BigNumberish | Promise<ethers.BigNumberish>) {
    if (baseCost.gt(await value)) {
        throw new Error(
            `The base cost of performing the priority operation is higher than the provided value parameter ` +
                `for the transaction: baseCost: ${baseCost}, provided value: ${value}`
        );
    }
}
```

### `create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment. 

:::warning
- The zkSync Era implementation is slightly different from Ethereum.
:::

#### Inputs

- `sender`: sender's address.
- `bytecodeHash`: output from zkSolc.
- `salt`: randomization element.
- `input`: ABI encoded constructor arguments.

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
The `prefix` in the `kekkak256` calculation is equal to `keccak256("zksyncCreate")`.
:::

### `createAddress`

Generates a contract address from deployer's account and nonce.

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

Returns signed keccak256 representation of a transaction with signature.

```ts
function eip712TxHash(transaction: any, ethSignature?: EthereumSignature) {
    const signedDigest = EIP712Signer.getSignedDigest(transaction);
    const hashedSignature = ethers.utils.keccak256(getSignature(transaction, ethSignature));

    return ethers.utils.keccak256(ethers.utils.hexConcat([signedDigest, hashedSignature]));
}
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of gas required to execute a transaction from L1 to L2.

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
    // If `from` is not provided, we use a random address, because
    // due to storage slot aggregation, the gas estimation depends on the address,
    // thus estimation for the zero address may be smaller than for the sender.
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

        const calldata = await getERC20BridgeCalldata(token, from, to, amount, providerL1);

        return await providerL2.estimateL1ToL2Execute({
            caller: applyL1ToL2Alias(l1ERC20BridgeAddresses),
            contractAddress: erc20BridgeAddress,
            gasPerPubdataByte: gasPerPubdataByte,
            calldata: calldata
        });
    }
}
```

### `getDeployedContracts`

Returns a log containing details of all deployed contracts related to a transaction receipt parameter.

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

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart.

```ts
export async function getERC20BridgeCalldata(
    l1TokenAddress: string,
    l1Sender: string,
    l2Receiver: string,
    amount: BigNumberish,
    provider: ethers.providers.Provider
): Promise<string> {
    const gettersData = await getERC20GettersData(l1TokenAddress, provider);
    return L2_BRIDGE_ABI.encodeFunctionData('finalizeDeposit', [
        l1Sender,
        l2Receiver,
        l1TokenAddress,
        amount,
        gettersData
    ]);
}
```

### `getERC20GettersData`

Gets the data needed for initializing an L1 token counterpart on L2.

```ts
async function getERC20GettersData(l1TokenAddress: string, provider: ethers.providers.Provider): Promise<string> {
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

### `getSignature`

Returns the signature of any transaction.

```ts
function getSignature(transaction: any, ethSignature?: EthereumSignature): Uint8Array {
    if (transaction?.customData?.customSignature && transaction.customData.customSignature.length) {
        return ethers.utils.arrayify(transaction.customData.customSignature);
    }

    if (!ethSignature) {
        throw new Error('No signature provided');
    }

    const r = ethers.utils.zeroPad(ethers.utils.arrayify(ethSignature.r), 32);
    const s = ethers.utils.zeroPad(ethers.utils.arrayify(ethSignature.s), 32);
    const v = ethSignature.v;

    return new Uint8Array([...r, ...s, v]);
}
```

### `hashBytecode`

Returns the hash of given bytecode.

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

Like similar functionality in `ethers.js` but with added try/catch facility. 

Called from [`isSignatureCorrect`](#isSignatureCorrect) for non-contract account addresses.

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

### `isMessageSignatureCorrect`

Returns true if account abstraction EIP712 signature is correct.

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

### `serializeTransaction`

Common serialize transaction function used by internal teams. 

Please see the [utilities library definition](https://github.com/matter-labs/zksync-2-dev/blob/94701bd2fbc590f733346934cfbccae08fc62f1a/sdk/zksync-web3.js/src/utils.ts) for more info.

### `undoL1ToL2Alias`

Converts the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

See also [`applyl1tol2alias`](#applyl1tol2alias).

```ts
export function undoL1ToL2Alias(address: string): string {
    return ethers.utils.hexlify(ethers.BigNumber.from(address).sub(L1_TO_L2_ALIAS_OFFSET));
}
```
