---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Providers | zkSync Era Docs
---

# Providers

A Web3 Provider object provides application-layer access to underlying blockchain networks.

The [`zksync-web3`](https://www.npmjs.com/package/zksync-web3) library supports provider methods from the [`ethers.js`](https://docs.ethers.io/v5/api/providers) library and supplies additional functionality.

Two providers are available:

- [`Provider`](#provider): Supplies the same functionality as [`ethers.providers.JsonRpcProvider`](https://docs.ethers.org/v5/api/providers/jsonrpc-provider/#JsonRpcProvider) and extends it with zkSync-specific methods.
- [`Web3Provider`](#web3provider): Extends the zkSync Era [`Provider`](#provider) class to make it more compatible with Web3 wallets.

:::tip

- Use the [`Web3Provider`](#web3provider) for browser integrations.
- Access the latest [provider.ts code](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/provider.ts) in the zkSync Era GitHub repo.
  :::

## `Provider`

:::info

- This doc details zkSync Era specific methods.
- Ethers implementations link to the [Ethers Providers documentation](https://docs.ethers.org/v5/api/providers/).
  :::

### `constructor`

Returns a zkSync Era `Provider` object.

#### Inputs

| Parameter  | Type                                                                                   | Description                |
| ---------- | -------------------------------------------------------------------------------------- | -------------------------- |
| `url?`     | string or [`ConnectionInfo`](https://docs.ethers.org/v5/api/utils/web/#ConnectionInfo) | Network RPC URL (optional) |
| `network?` | `ethers.providers.Networkish`                                                          | Network name (optional)    |

```ts
constructor(url?: ConnectionInfo | string, network?: ethers.providers.Networkish) {
    super(url, network);
    this.pollingInterval = 500;

    const blockTag = this.formatter.blockTag.bind(this.formatter);
    this.formatter.blockTag = (tag: any) => {
        if (tag == 'committed' || tag == 'finalized') {
            return tag;
        }
        return blockTag(tag);
    };
    this.contractAddresses = {};
    this.formatter.transaction = parseTransaction;
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://testnet.era.zksync.dev");
```

### `estimateFee`

Returns an estimated [`Fee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type                                                                                                 | Description          |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionRequest) | Transaction request. |

```ts
async estimateFee(transaction: TransactionRequest): Promise<Fee> {
    return await this.send("zks_estimateFee", [transaction]);
}
```

### `estimateGas`

Returns an estimate of the amount of gas required to submit a transaction to the network.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-estimateGas)

### `estimateGasL1`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `BigNumber` object.

Calls the [`zks_estimateL1ToL2`](../api.md#zks-estimategasl1tol2) JSON-RPC method.

### `estimateGasTransfer`

Returns the gas estimation for a transfer transaction.

Calls internal method [`getTransferTx`](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/provider.ts#L428) to get the transfer transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter    | Type                   | Description                              |
| ------------ | ---------------------- | ---------------------------------------- |
| `token`      | Address string         | Token address.                           |
| `amount`     | `BigNumberish`         | Amount of token.                         |
| `from?`      | Address string         | From address (optional).                 |
| `to?`        | Address string         | To address (optional).                   |
| `overrides?` | `ethers.CallOverrides` | Ethers call overrides object (optional). |

```ts
async estimateGasTransfer(transaction: {
    to: Address;
    amount: BigNumberish;
    from?: Address;
    token?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<BigNumber> {
    const transferTx = await this.getTransferTx(transaction);
    return await this.estimateGas(transferTx);
}
```

### `estimateGasWithdraw`

Returns the gas estimation for a withdrawal transaction.

Calls internal method [`getWithdrawTx`](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/provider.ts#L372) to get the withdrawal transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter        | Type                   | Description                              |
| ---------------- | ---------------------- | ---------------------------------------- |
| `token`          | Address string         | Token address.                           |
| `amount`         | `BigNumberish`         | Amount of token.                         |
| `from?`          | Address string         | From address (optional).                 |
| `to?`            | Address string         | To address (optional).                   |
| `bridgeAddress?` | Address string         | Bridge address (optional).               |
| `overrides?`     | `ethers.CallOverrides` | Ethers call overrides object (optional). |

```ts
async estimateGasWithdraw(transaction: {
    token: Address;
    amount: BigNumberish;
    from?: Address;
    to?: Address;
    bridgeAddress?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<BigNumber> {
    const withdrawTx = await this.getWithdrawTx(transaction);
    return await this.estimateGas(withdrawTx);
}
```

### `estimateL1ToL2Execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter            | Type                      | Description                                                      |
| -------------------- | ------------------------- | ---------------------------------------------------------------- |
| `contractAddress`    | Address string            | Address of contract.                                             |
| `calldata`           | `BytesLike`               | The transaction call data.                                       |
| `caller?`            | Address string            | Caller address (optional).                                       |
| `l2Value?`           | `BigNumberish`            | Current L2 gas value (optional).                                 |
| `factoryDeps?`       | `BytesLike[]`             | Byte array containing contract bytecode.                         |
| `gasPerPubdataByte?` | `BigNumberish`            | Constant representing current amount of gas per byte (optional). |
| `overrides?`         | `ethers.PayableOverrides` | Ethers payable overrides object (optional).                      |

```ts
async estimateL1ToL2Execute(transaction: {
    contractAddress: Address;
    calldata: BytesLike;
    caller?: Address;
    l2Value?: BigNumberish;
    factoryDeps?: ethers.BytesLike[];
    gasPerPubdataByte?: BigNumberish;
    overrides?: ethers.PayableOverrides;
}): Promise<BigNumber> {
    transaction.gasPerPubdataByte ??= REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT;

    // If the `from` address is not provided, we use a random address, because
    // due to storage slot aggregation, the gas estimation will depend on the address
    // and so estimation for the zero address may be smaller than for the sender.
    transaction.caller ??= ethers.Wallet.createRandom().address;

    const customData = {
        gasPerPubdataByte: transaction.gasPerPubdataByte
    };
    if (transaction.factoryDeps) {
        Object.assign(customData, { factoryDeps: transaction.factoryDeps });
    }

    const fee = await this.estimateGasL1({
        from: transaction.caller,
        data: transaction.calldata,
        to: transaction.contractAddress,
        value: transaction.l2Value,
        customData
    });

    return fee;
}
```

### `getAllAccountBalances`

Returns all balances for confirmed tokens given by an account address.

Calls the [`zks_getAllAccountBalances`](../api.md#zks-getallaccountbalances) JSON-RPC method.

### `getBalance`

Returns the user's balance as a `BigNumber` object for an (optional) block tag and (optional) token.

When block and token are not supplied, `committed` and `ETH` are the default values.

#### Inputs

| Name          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| address       | User's address.                                                            |
| blockTag?     | Block tag for getting the balance on. Latest `committed` block is default. |
| tokenAddress? | The address of the token. ETH is default.                                  |
|               |

```typescript
override async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address) {
    const tag = this.formatter.blockTag(blockTag);
    if (tokenAddress == null || isETH(tokenAddress)) {
        // requesting ETH balance
        return await super.getBalance(address, tag);
    } else {
        try {
            let token = IERC20MetadataFactory.connect(tokenAddress, this);
            return await token.balanceOf(address, { blockTag: tag });
        } catch {
            return BigNumber.from(0);
        }
    }
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://testnet.era.zksync.dev");

//Find the USDC ADDRESS in https://zksync2-testnet.zkscan.io/address/0x0faF6df7054946141266420b43783387A78d82A9/transactions
const USDC_L2_ADDRESS = "<USDC_L2_ADDRESS>";
// Get the USDC balance from your account using your address. Get your address from https://zksync2-testnet.zkscan.io/txs
console.log(await provider.getBalance("<YOUR_ADDRESS>", "latest", USDC_L2_ADDRESS));

// Getting ETH balance
console.log(await provider.getBalance("<YOUR_ADDRESS>"));
```

### `getBlock`

Returns block from the network, or false if there is no block.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-getBlock)

### `getBlockDetails`

Returns additional zkSync-specific information about the L2 block.

Calls the [`zks_getBlockDetails`](../api.md#zks-getblockdetails) JSON-RPC method.

### `getBlockWithTransactions`

Returns an array of `TransactionResponse` objects.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-getBlockWithTransactions)

### `getConfirmedTokens`

Returns [address, symbol, name, and decimal] information of all tokens within a range of ids given by parameters `from` and `limit`.

Calls the [`zks_getConfirmedTokens`](../api.md#zks-getconfirmedtokens) JSON-RPC method.

:::tip Tip

- **Confirmed** in the function name means any token bridged to zkSync Era via the official bridge.
  :::

The tokens are returned in alphabetical order by their symbol. This means the token id is its position in an alphabetically sorted array of tokens.

#### Inputs

| Name  | Description                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------- |
| start | The token id from which to start returning the information about the tokens. Zero _by default_. |
| limit | The number of tokens to be returned from the API. 255 _by default_.                             |

```typescript
async getConfirmedTokens(start: number = 0, limit: number = 255): Promise<Token[]> {
    const tokens: Token[] = await this.send('zks_getConfirmedTokens', [start, limit]);
    return tokens.map((token) => ({ address: token.l2Address, ...token }));
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://testnet.era.zksync.dev");

console.log(await provider.getConfirmedTokens());
```

### `getContractAccountInfo`

Returns the version of the supported account abstraction and nonce ordering from a given contract address.

#### Inputs

| Name    | Description      |
| ------- | ---------------- |
| address | Contract address |

```typescript
async getContractAccountInfo(address: Address): Promise<ContractAccountInfo> {
    const deployerContract = new Contract(CONTRACT_DEPLOYER_ADDRESS, CONTRACT_DEPLOYER, this);
    const data = await deployerContract.getAccountInfo(address);

    return {
        supportedAAVersion: data.supportedAAVersion,
        nonceOrdering: data.nonceOrdering
    };
}
```

### `getDefaultBridgeAddresses`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

```typescript
async getDefaultBridgeAddresses() {
    if (!this.contractAddresses.erc20BridgeL1) {
        let addresses = await this.send('zks_getBridgeContracts', []);
        this.contractAddresses.erc20BridgeL1 = addresses.l1Erc20DefaultBridge;
        this.contractAddresses.erc20BridgeL2 = addresses.l2Erc20DefaultBridge;
    }
    return {
        erc20L1: this.contractAddresses.erc20BridgeL1,
        erc20L2: this.contractAddresses.erc20BridgeL2
    };
}
```

### `getDefaultProvider`

Static method which returns a Provider object from the RPC URL or localhost.

```ts
static getDefaultProvider() {
    return new Provider(process.env.ZKSYNC_WEB3_API_URL || 'http://localhost:3050');
}
```

### `getFilterChanges`

Returns an array of logs by calling Ethereum method [`eth_getFilterChanges`.](https://ethereum.github.io/execution-apis/api-documentation/)

### `getFormatter`

Static utility method that returns a `Formatter` object for processing readable block data.

```ts
static override getFormatter(): Formatter {
    if (defaultFormatter == null) {
        defaultFormatter = new Formatter();
        const number = defaultFormatter.number.bind(defaultFormatter);
        const boolean = defaultFormatter.boolean.bind(defaultFormatter);
        const hash = defaultFormatter.hash.bind(defaultFormatter);
        const address = defaultFormatter.address.bind(defaultFormatter);

        defaultFormatter.formats.receiptLog.l1BatchNumber = Formatter.allowNull(number);

        (defaultFormatter.formats as any).l2Tol1Log = {
            blockNumber: number,
            blockHash: hash,
            l1BatchNumber: Formatter.allowNull(number),
            transactionIndex: number,
            shardId: number,
            isService: boolean,
            sender: address,
            key: hash,
            value: hash,
            transactionHash: hash,
            logIndex: number
        };

        defaultFormatter.formats.receipt.l1BatchNumber = Formatter.allowNull(number);
        defaultFormatter.formats.receipt.l1BatchTxIndex = Formatter.allowNull(number);
        defaultFormatter.formats.receipt.l2ToL1Logs = Formatter.arrayOf((value) =>
            Formatter.check((defaultFormatter.formats as any).l2Tol1Log, value)
        );

        defaultFormatter.formats.block.l1BatchNumber = Formatter.allowNull(number);
        defaultFormatter.formats.block.l1BatchTimestamp = Formatter.allowNull(number);
        defaultFormatter.formats.blockWithTransactions.l1BatchNumber = Formatter.allowNull(number);
        defaultFormatter.formats.blockWithTransactions.l1BatchTimestamp = Formatter.allowNull(number);
        defaultFormatter.formats.transaction.l1BatchNumber = Formatter.allowNull(number);
        defaultFormatter.formats.transaction.l1BatchTxIndex = Formatter.allowNull(number);

        defaultFormatter.formats.filterLog.l1BatchNumber = Formatter.allowNull(number);
    }
    return defaultFormatter;
}
```

### `getGasPrice`

Returns an estimate (best guess) of the gas price to use in a transaction.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-getGasPrice)

### `getL1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

Calls the [`zks_getL1BatchBlockRange`](../api.md#zks-getl1batchblockrange) JSON-RPC method.

```typescript
async getL1BatchBlockRange(l1BatchNumber: number): Promise<[number, number] | null> {
    const range = await this.send('zks_getL1BatchBlockRange', [l1BatchNumber]);
    if (range == null) {
        return null;
    }
    return [parseInt(range[0], 16), parseInt(range[1], 16)];
}
```

### `getL1BatchDetails`

Returns data pertaining to a given batch.

Calls the [`zks_getL1BatchDetails`](../api.md#zks-getl1batchdetails) JSON-RPC method.

### `getL1BatchNumber`

Returns the latest L1 batch number.

Calls the [`zks_getL1BatchNumber`](../api.md#zks-l1batchnumber) JSON-RPC method.

### `getL2TransactionFromPriorityOp`

Returns a transaction object from a given Ethers [`TransactionResponse`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse) object.

#### Inputs

| Name         | Description                          |
| ------------ | ------------------------------------ |
| l1TxResponse | Ethers `TransactionResponse` object. |

```ts
async getL2TransactionFromPriorityOp(
    l1TxResponse: ethers.providers.TransactionResponse
): Promise<TransactionResponse> {
    const receipt = await l1TxResponse.wait();
    const l2Hash = getL2HashFromPriorityOp(receipt, await this.getMainContractAddress());

    let status = null;
    do {
        status = await this.getTransactionStatus(l2Hash);
        await sleep(this.pollingInterval);
    } while (status == TransactionStatus.NotFound);

    return await this.getTransaction(l2Hash);
}
```

### `getLogProof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

Calls the [`zks_getL2ToL1LogProof`](../api.md#zks-getl2tol1logproof) JSON-RPC method.

### `getLogs`

Returns an array of all logs that match a filter with a given id by calling Ethereum method [`eth_getLogs.`](https://ethereum.github.io/execution-apis/api-documentation/)

### `getMainContractAddress`

Returns the main zkSync Era smart contract address.

Calls the [`zks_getMainContract`](../api.md#zks-getmaincontract) JSON-RPC method.

```typescript
async getMainContractAddress(): Promise<Address> {
    if (!this.contractAddresses.mainContract) {
        this.contractAddresses.mainContract = await this.send('zks_getMainContract', []);
    }
    return this.contractAddresses.mainContract;
}
```

### `getMessageProof`

Returns the proof for a message sent via the L1Messenger system contract.

Calls the [`zks_getL2ToL1MsgProof`](../api.md#zks-getl2tol1msgproof) JSON-RPC method.

```typescript
async getMessageProof(
    blockNumber: ethers.BigNumberish,
    sender: Address,
    messageHash: BytesLike,
    logIndex?: number
): Promise<MessageProof | null> {
    return await this.send('zks_getL2ToL1MsgProof', [
        BigNumber.from(blockNumber).toNumber(),
        sender,
        ethers.utils.hexlify(messageHash),
        logIndex
    ]);
}
```

### `getPriorityOpResponse`

Returns an Ethers [`TransactionResponse`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse) as a `PriorityOpResponse` object.

#### Inputs

| Name         | Description                          |
| ------------ | ------------------------------------ |
| l1TxResponse | Ethers `TransactionResponse` object. |

```ts
async getPriorityOpResponse(l1TxResponse: ethers.providers.TransactionResponse): Promise<PriorityOpResponse> {
    const l2Response = { ...l1TxResponse } as PriorityOpResponse;

    l2Response.waitL1Commit = l2Response.wait;
    l2Response.wait = async () => {
        const l2Tx = await this.getL2TransactionFromPriorityOp(l1TxResponse);
        return await l2Tx.wait();
    };
    l2Response.waitFinalize = async () => {
        const l2Tx = await this.getL2TransactionFromPriorityOp(l1TxResponse);
        return await l2Tx.waitFinalize();
    };

    return l2Response;
}
```

### `getTestnetPaymasterAddress`

Returns the [testnet paymaster](../../reference/concepts/account-abstraction.md#paymasters) address if available, or null.

```typescript
async getTestnetPaymasterAddress(): Promise<Address | null> {
    // Unlike contract's addresses, the testnet paymaster is not cached, since it can be trivially changed
    // on the fly by the server and should not be relied to be constant
    return await this.send('zks_getTestnetPaymaster', []);
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://testnet.era.zksync.dev");

console.log(await provider.getTestnetPaymasterAddress());
```

### `getTokenPrice` DEPRECATED

::: warning Deprecated

- This method is deprecated and will be removed in the near future.
  :::

Returns the USD price for a token. Please note that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

Calls the [`zks_getTokenPrice`](../api.md#zks-gettokenprice) JSON-RPC method.

#### Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://testnet.era.zksync.dev");

console.log(await provider.getTokenPrice(USDC_L2_ADDRESS));
```

### `getTransaction`

Returns a specified L2 transaction response object by overriding the [Ethers implementation](https://docs.ethers.org/v5/api/providers/provider/#Provider-getTransaction).

#### Inputs

| Name | Description |
| ---- | ----------- |
| hash | string      |

```typescript
override async getTransaction(hash: string | Promise<string>): Promise<TransactionResponse> {
    hash = await hash;
    const tx = await super.getTransaction(hash);
    return tx ? this._wrapTransaction(tx, hash) : null;
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://testnet.era.zksync.dev");

const TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
const txHandle = await provider.getTransaction(TX_HASH);

// Wait until the transaction is processed by the server.
await txHandle.wait();
// Wait until the transaction is finalized.
await txHandle.waitFinalize();
```

### `getTransactionDetails`

Returns data from a specific transaction given by the transaction hash.

Calls the [`getTransactionDetails`](../api.md#zks-gettransactiondetails) JSON-RPC method.

### `getTransactionReceipt`

Returns the transaction receipt from a given hash number.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-getTransactionReceipt)

### `getTransactionStatus`

Returns the status of a specified transaction.

#### Inputs

| Name   | Description |
| ------ | ----------- |
| txHash | string      |

```typescript
async getTransactionStatus(txHash: string) {
    const tx = await this.getTransaction(txHash);
    if (tx == null) {
        return TransactionStatus.NotFound;
    }
    if (tx.blockNumber == null) {
        return TransactionStatus.Processing;
    }
    const verifiedBlock = await this.getBlock('finalized');
    if (tx.blockNumber <= verifiedBlock.number) {
        return TransactionStatus.Finalized;
    }
    return TransactionStatus.Committed;
}
```

#### Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://testnet.era.zksync.dev");

const TX_HASH = "YOUR_TX_HASH_ADDRESS";
console.log(await provider.getTransactionStatus(TX_HASH));
```

### `l1ChainId`

Returns the chain id of the underlying L1.

Calls the [`zks_L1ChainId`](../api.md#zks-l1chainid) JSON-RPC method.

### `l1TokenAddress`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L2. |

```typescript
async l1TokenAddress(token: Address) {
    if (token == ETH_ADDRESS) {
        return ETH_ADDRESS;
    } else {
        const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
        const erc20Bridge = IL2BridgeFactory.connect(erc20BridgeAddress, this);
        return await erc20Bridge.l1TokenAddress(token);
    }
}
```

### `l2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Name  | Description                     |
| ----- | ------------------------------- |
| token | The address of the token on L1. |

```typescript
async l2TokenAddress(token: Address) {
    if (token == ETH_ADDRESS) {
        return ETH_ADDRESS;
    } else {
        const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
        const erc20Bridge = IL2BridgeFactory.connect(erc20BridgeAddress, this);
        return await erc20Bridge.l2TokenAddress(token);
    }
}
```

### `newBlockFilter`

Returns a new block filter by calling Ethereum method [`eth_newBlockFilter.`](https://ethereum.github.io/execution-apis/api-documentation/)

### `newFilter`

Returns a new filter by calling Ethereum method [`eth_newFilter`](https://ethereum.github.io/execution-apis/api-documentation/) and passing a filter object.

### `newPendingTransactionFilter`

Returns a new pending transaction filter by calling Ethereum method [`eth_newPendingTransactionFilter`](https://ethereum.github.io/execution-apis/api-documentation/) and passing a filter object.

### `sendTransaction`

Override of [Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-sendTransaction)

## `Web3Provider`

Use this provider for Web3 browser wallet integrations for easy compatibility with Metamask, WalletConnect, and other popular browser wallets.

### `constructor`

Returns a provider object by extending the constructor of the `Provider` class and accepting an `ExternalProvider` instead of a node URL.

#### Inputs and outputs

| Name     | Description                                                                                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider | The [`ethers.providers.ExternalProvider`](https://docs.ethers.org/v5/api/providers/other/#Web3Provider--ExternalProvider) class instance. For instance, Metamask is `window.ethereum`. |
| network? | The description of the network.                                                                                                                                                        |

```typescript
constructor(provider: ExternalProvider, network?: ethers.providers.Networkish) {
    if (provider == null) {
        throw new Error('missing provider');
    }
    if (!provider.request) {
        throw new Error('provider must implement eip-1193');
    }

    let path = provider.host || provider.path || (provider.isMetaMask ? 'metamask' : 'eip-1193:');
    super(path, network);
    this.provider = provider;
}
```

#### Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
```

### `estimateGas`

Returns gas estimate by overriding the zkSync Era [`estimateGas`](#estimategas) method.

#### Inputs and outputs

| Name        | Description                                     |
| ----------- | ----------------------------------------------- |
| transaction | Deferrable object of `TransactionRequest` type. |

```typescript
override async estimateGas(transaction: ethers.utils.Deferrable<TransactionRequest>) {
    const gas: BigNumber = await super.estimateGas(transaction);
    const metamaskMinimum = BigNumber.from(21000);
    const isEIP712 = transaction.customData != null || transaction.type == EIP712_TX_TYPE;
    return gas.gt(metamaskMinimum) || isEIP712 ? gas : metamaskMinimum;
}
```

### `getSigner`

Override of [Ethers implementation](https://docs.ethers.org/v5/api/providers/jsonrpc-provider/#JsonRpcProvider-getSigner).

#### Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();
```

### `send`

Returns a provider request object by overriding the [Ethers implementation](https://docs.ethers.org/v5/api/providers/jsonrpc-provider/#JsonRpcProvider-send).

#### Inputs and outputs

| Name    | Description                   |
| ------- | ----------------------------- |
| method  | Request method name as string |
| params? | Optional array of any type    |

```typescript
override async send(method: string, params?: Array<any>): Promise<any> {
    params ??= [];
    // Metamask complains about eth_sign (and on some versions hangs)
    if (method == 'eth_sign' && (this.provider.isMetaMask || this.provider.isStatus)) {
        // https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
        method = 'personal_sign';
        params = [params[1], params[0]];
    }
    return await this.provider.request({ method, params });
}

override getSigner(addressOrIndex?: number | string): Signer {
    return Signer.from(super.getSigner(addressOrIndex) as any);
}
```
