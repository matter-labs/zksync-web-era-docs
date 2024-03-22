---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Providers | zkSync Docs
---

# Providers

A Web3 Provider object provides application-layer access to underlying blockchain networks.

The [`zksync-ethers`](https://www.npmjs.com/package/zksync-ethers) library supports provider methods from the [`ethers.js`](https://docs.ethers.io/v6/api/providers) library and
supplies additional functionality.

Two providers are available:

- [`Provider`](#provider): Supplies the same functionality as [`ethers.JsonRpcProvider`](https://docs.ethers.org/v6/api/providers/jsonrpc/#about-jsonrpcProvider)
  and extends it with zkSync-specific methods.
- [`BrowserProvider`](#browserprovider): Extends the zkSync Era [`Provider`](#provider) class to make it more compatible with Web3 wallets.

:::tip

- Use the [`BrowserProvider`](#browserprovider) for browser integrations.
- Access the latest [provider.ts code](https://github.com/zksync-sdk/zksync-ethers/blob/main/src/provider.ts) in the zkSync Era GitHub repo.
  :::

## `Provider`

:::info

- This doc details zkSync Era specific methods.
- Ethers implementations link to the [Ethers Providers documentation](https://docs.ethers.org/v6/api/providers/).
  :::

### `constructor`

Returns a zkSync Era `Provider` object.

#### Inputs

| Parameter  | Type                                                                                 | Description                                                             |
| ---------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `url?`     | [`ethers.FetchRequest`](https://docs.ethers.org/v6/api/utils/fetching/#FetchRequest) | Network RPC URL (optional).                                             |
| `network?` | [`ethers.Networkish`](https://docs.ethers.org/v6/api/providers/#Networkish)          | The network name, chain ID, or object with network details. (optional). |
| `options?` | `any`                                                                                | Additional provider options (optional).                                 |

```ts
constructor(url ? : ethers.FetchRequest | string, network ? : Networkish, options ? : any)
```

#### Example

```ts
import { Provider } from "zksync-ethers";

const provider = new Provider("https://sepolia.era.zksync.dev");
```

### `broadcastTransaction`

Override of [Ethers implementation.](https://docs.ethers.org/v6/api/providers/#Provider-broadcastTransaction)

#### Inputs

| Parameter  | Type     | Description         |
| ---------- | -------- | ------------------- |
| `signedTx` | `string` | Signed transaction. |

```ts
override async broadcastTransaction(signedTx: string): Promise<TransactionResponse>
```

#### Example

```ts
import { Provider, types, Wallet } from "zksync-ethers";

const PRIVATE_KEY = "<PRIVATE_KEY>";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const signedTx = await wallet.signTransaction({
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  value: ethers.parseEther("0.01"),
});
const tx = await provider.broadcastTransaction(signedTx);
console.log(tx.hash);
```

### `estimateFee`

Returns an estimated [`Fee`](./types.md#fee) for requested transaction.

#### Inputs

| Parameter     | Type                                                                                 | Description          |
| ------------- | ------------------------------------------------------------------------------------ | -------------------- |
| `transaction` | [`TransactionRequest`](https://docs.ethers.org/v6/api/providers/#TransactionRequest) | Transaction request. |

```ts
async estimateFee([`TransactionRequest`](https://docs.ethers.org/v6/api/providers/#TransactionRequest)): Promise<Fee>
```

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const fee = await provider.estimateFee({
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  value: `0x${BigInt(7_000_000_000).toString(16)}`,
});
console.log(`Fee: ${toJSON(fee)}`);
```

### `estimateGas`

Returns an estimate of the amount of gas required to submit a transaction to the network.

#### Inputs

| Parameter | Type                                                                                 | Description          |
| --------- | ------------------------------------------------------------------------------------ | -------------------- |
| `_tx`     | [`TransactionRequest`](https://docs.ethers.org/v6/api/providers/#TransactionRequest) | Transaction request. |

```ts
async estimateGas(_tx: TransactionRequest): Promise<bigint>
```

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasTokenApprove = await provider.estimateGas({
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  to: "0x765F5AF819D818a8e8ee6ff63D8d0e8056DBE150",
  data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
});
console.log(`Gas for token approval tx: ${gasTokenApprove}`);
```

```ts
import { Provider, types, utils } from "zksync-ethers";

const ADDRESS = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";
const RECEIVER = "0xa61464658AfeAf65CccaaFD3a512b69A83B77618";
const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const tokenAddress = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
const paymasterAddress = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
  type: "ApprovalBased",
  token: tokenAddress,
  minimalAllowance: 1,
  innerInput: new Uint8Array(),
});

const tokenApprove = await provider.estimateGas({
  from: ADDRESS,
  to: tokenAddress,
  data: utils.IERC20.encodeFunctionData("approve", [RECEIVER, 1]),
  customData: {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  },
});
console.log(`Gas for token approval using EIP-712 tx: ${tokenApprove}`);
```

### `estimateGasL1`

Returns an estimate of the amount of gas required to submit a transaction from L1 to L2 as a `bigint` object.

Calls the [`zks_estimateL1ToL2`](../../../api.md#zks-estimategasl1tol2) JSON-RPC method.

#### Inputs

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

```ts
async estimateGasL1(transaction: TransactionRequest): Promise<bigint>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasL1 = await provider.estimateGasL1({
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  to: await provider.getMainContractAddress(),
  value: 7_000_000_000,
  customData: {
    gasPerPubdata: 800,
  },
});
console.log(`L1 gas: ${BigInt(gasL1)}`);
```

### `estimateGasTransfer`

Returns the gas estimation for a transfer transaction.

Calls internal method [`getTransferTx`](#gettransfertx) to get the transfer transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter          | Type                                                                     | Description                         |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------- |
| `token`            | `Address`                                                                | Token address.                      |
| `amount`           | `BigNumberish`                                                           | Amount of token.                    |
| `from?`            | `Address`                                                                | From address (optional).            |
| `to?`              | `Address`                                                                | To address (optional).              |
| `paymasterParams?` | [`PaymasterParams`](./types.md#paymasterparams)                          | Paymaster parameters (optional).    |
| `overrides?`       | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | Ethers overrides object (optional). |

```ts
async estimateGasTransfer(transaction: {
  to: Address;
  amount: BigNumberish;
  from ? : Address;
  token ? : Address;
  paymasterParams ?: PaymasterParams;
  overrides ? : ethers.Overrides;
}): Promise<bigint>
```

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasTransfer = await provider.estimateGasTransfer({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000_000,
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
});
console.log(`Gas for transfer tx: ${gasTransfer}`);
```

### `estimateGasWithdraw`

Returns the gas estimation for a withdrawal transaction.

Calls internal method [`getWithdrawTx`](#getwithdrawtx) to get the
withdrawal transaction and sends it to the [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter          | Type                                                                     | Description                                                                                             |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `token`            | `Address`                                                                | Token address.                                                                                          |
| `amount`           | `BigNumberish`                                                           | Amount of token.                                                                                        |
| `from?`            | `Address`                                                                | From address (optional).                                                                                |
| `to?`              | `Address`                                                                | To address (optional).                                                                                  |
| `bridgeAddress?`   | `Address`                                                                | Bridge address (optional).                                                                              |
| `paymasterParams?` | [`PaymasterParams`](./types.md#paymasterparams)                          | Paymaster parameters (optional).                                                                        |
| `overrides?`       | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | Transaction's overrides which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). . |

```ts
async estimateGasWithdraw(transaction: {
  token: Address;
  amount: BigNumberish;
  from ? : Address;
  to ? : Address;
  bridgeAddress ? : Address;
  paymasterParams ?: PaymasterParams;
  overrides ? : ethers.Overrides;
}): Promise<bigint>
```

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasWithdraw = await provider.estimateGasWithdraw({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000,
  to: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
});
console.log(`Gas for withdrawal tx: ${gasWithdraw}`);
```

### `estimateL1ToL2Execute`

Returns gas estimation for an L1 to L2 execute operation.

#### Inputs

| Parameter            | Type               | Description                                                                                           |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `contractAddress`    | `Address`          | Address of contract.                                                                                  |
| `calldata`           | `string`           | The transaction call data.                                                                            |
| `caller?`            | `Address`          | Caller address (optional).                                                                            |
| `l2Value?`           | `BigNumberish`     | Current L2 gas value (optional).                                                                      |
| `factoryDeps?`       | `BytesLike[]`      | Byte array containing contract bytecode.                                                              |
| `gasPerPubdataByte?` | `BigNumberish`     | Constant representing current amount of gas per byte (optional).                                      |
| `overrides?`         | `ethers.Overrides` | Transaction's overrides which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). |

```ts
async estimateL1ToL2Execute(transaction: {
  contractAddress: Address;
  calldata: string;
  caller ? : Address;
  l2Value ? : BigNumberish;
  factoryDeps ? : ethers.BytesLike[];
  gasPerPubdataByte ? : BigNumberish;
  overrides ? : ethers.Overrides;
}): Promise<bigint>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const gasL1ToL2 = await provider.estimateL1ToL2Execute({
  contractAddress: await provider.getMainContractAddress(),
  calldata: "0x",
  caller: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  l2Value: 7_000_000_000,
});
console.log(`Gas L1 to L2: ${BigInt(gasL1ToL2)}`);
```

### `getAllAccountBalances`

Returns all balances for confirmed tokens given by an account address.

Calls the [`zks_getAllAccountBalances`](../../../api.md#zks-getallaccountbalances) JSON-RPC method.

#### Inputs

| Parameter | Type      | Description      |
| --------- | --------- | ---------------- |
| `address` | `Address` | Account address. |

```ts
async getAllAccountBalances(address: Address): Promise<BalancesMap>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const balances = await provider.getAllAccountBalances("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049");
console.log(`All balances: ${toJSON(balances)}`);
```

### `getBalance`

Returns the user's balance as a `bigint` object for an (optional) block tag and (optional) token.

When block and token are not supplied, `committed` and `ETH` are the default values.

#### Inputs

| Parameter       | Type       | Description                                                                           |
| --------------- | ---------- | ------------------------------------------------------------------------------------- |
| `address`       | `Address`  | Account address.                                                                      |
| `blockTag?`     | `BlockTag` | Block tag for getting the balance on. Latest `committed` block is default (optional). |
| `tokenAddress?` | `Address`  | Token address. ETH is default (optional).                                             |

```ts
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address)
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const account = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049";
const tokenAddress = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
console.log(`ETH balance: ${await provider.getBalance(account)}`);
console.log(`Token balance: ${await provider.getBalance(account, "latest", tokenAddres)}`);
```

### `getBlock`

Returns block from the network, or false if there is no block.

#### Inputs

| Parameter             | Type       | Description                                                 |
| --------------------- | ---------- | ----------------------------------------------------------- |
| `blockHashOrBlockTag` | `BlockTag` | Block tag for getting the balance on.                       |
| `includeTxs?`         | `boolean`  | Whether to fetch transactions that are in block (optional). |

```ts
async getBlock(blockHashOrBlockTag: BlockTag, includeTxs?: boolean): Promise<Block>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Block: ${toJSON(await provider.getBlock("latest", true))}`);
```

### `getBlockDetails`

Returns additional zkSync-specific information about the L2 block.

Calls the [`zks_getBlockDetails`](../../../api.md#zks-getblockdetails) JSON-RPC method.

#### Inputs

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `number`  | `number` | Block number. |

```ts
async getBlockDetails(number:number): Promise<BlockDetails>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Block details: ${toJSON(await provider.getBlockDetails(90_000))}`);
```

### `getBytecodeByHash`

Returns bytecode of a contract given by its hash.

Calls the [`zks_getBytecodeByHash`](../../../api.md#zks-getbytecodebyhash) JSON-RPC method.

#### Inputs

| Parameter      | Type        | Description    |
| -------------- | ----------- | -------------- |
| `bytecodeHash` | `BytesLike` | Bytecode hash. |

```ts
async getBytecodeByHash(bytecodeHash: BytesLike): Promise<Uint8Array>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

// Bytecode hash can be computed by following these steps:
// const testnetPaymasterBytecode = await provider.getCode(await provider.getTestnetPaymasterAddress());
// const testnetPaymasterBytecodeHash = ethers.hexlify(utils.hashBytecode(testnetPaymasterBytecode));

const testnetPaymasterBytecodeHash = "0x010000f16d2b10ddeb1c32f2c9d222eb1aea0f638ec94a81d4e916c627720e30";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Bytecode: ${await provider.getBytecodeByHash(testnetPaymasterBytecodeHash)}`);
```

### `getContractAccountInfo`

Returns the version of the supported account abstraction and nonce ordering from a given contract address.

#### Inputs

| Parameter | Type      | Description       |
| --------- | --------- | ----------------- |
| `address` | `Address` | Contract address. |

```ts
async getContractAccountInfo(address:Address): Promise<ContractAccountInfo>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const tokenAddress = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
console.log(`Contract account info: ${toJSON(await provider.getContractAccountInfo(tokenAddress))}`);
```

### `getDefaultBridgeAddresses`

Returns the addresses of the default zkSync Era bridge contracts on both L1 and L2.

```ts
async getDefaultBridgeAddresses():  Promise<{erc20L1: string, erc20L2: string, wethL1: string, wethL2: string}>;
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Default bridges: ${toJSON(await provider.getDefaultBridgeAddresses())}`);
```

### `getDefaultProvider`

Static method which returns a Provider object from the RPC URL or localhost.

#### Inputs

| Parameter       | Type                                  | Description                                       |
| --------------- | ------------------------------------- | ------------------------------------------------- |
| `zksyncNetwork` | [`ZkSyncNetwork`](./types.md#network) | Type of zkSync network. `Localhost` _by default_. |

```ts
static getDefaultProvider(zksyncNetwork: ZkSyncNetwork = ZkSyncNetwork.Localhost)
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const providerMainnet = Provider.getDefaultProvider(types.Network.Mainnet);
const providerTestnet = Provider.getDefaultProvider(types.Network.Sepolia);
const providerLocalnet = Provider.getDefaultProvider(types.Network.Localhost);
```

### `getFilterChanges`

Returns an array of logs by calling Ethereum method [`eth_getFilterChanges`.](https://ethereum.github.io/execution-apis/api-documentation/)

#### Inputs

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `idx`     | `bigint` | Filter index. |

```ts
async getFilterChanges(idx: bigint): Promise<Array<Log | string>>
```

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const filter = await provider.newFilter({
  address: utils.L2_ETH_TOKEN_ADDRESS,
  topics: [ethers.id("Transfer(address,address,uint256)")],
});
const result = await provider.getFilterChanges(filter);
```

### `getGasPrice`

Returns an estimate (best guess) of the gas price to use in a transaction.

```ts
async getGasPrice(): Promise<bigint>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Gas price: ${await provider.getGasPrice()}`);
```

### `getL1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number.

Calls the [`zks_getL1BatchBlockRange`](../../../api.md#zks-getl1batchblockrange) JSON-RPC method.

#### Inputs

| Parameter       | Type     | Description      |
| --------------- | -------- | ---------------- |
| `l1BatchNumber` | `number` | L1 batch number. |

```ts
async getL1BatchBlockRange(l1BatchNumber: number): Promise<[number, number] | null>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const l1BatchNumber = await provider.getL1BatchNumber();
console.log(`L1 batch block range: ${toJSON(await provider.getL1BatchBlockRange(l1BatchNumber))}`);
```

### `getL1BatchDetails`

Returns data pertaining to a given batch.

Calls the [`zks_getL1BatchDetails`](../../../api.md#zks-getl1batchdetails) JSON-RPC method.

#### Inputs

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `number`  | `number` | L1 batch number. |

```ts
async getL1BatchDetails(number: number): Promise<BatchDetails>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const l1BatchNumber = await provider.getL1BatchNumber();
console.log(`L1 batch details: ${toJSON(await provider.getL1BatchDetails(l1BatchNumber))}`);
```

### `getL1BatchNumber`

Returns the latest L1 batch number.

Calls the [`zks_getL1BatchNumber`](../../../api.md#zks-l1batchnumber) JSON-RPC method.

```ts
async getL1BatchNumber(): Promise<number>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`L1 batch number: ${await provider.getL1BatchNumber()}`);
```

### `getL2TransactionFromPriorityOp`

Returns a L2 transaction from L1 transaction response.

#### Inputs

| Parameter      | Type                                                                                   | Description              |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| `l1TxResponse` | [`TransactionResponse`](https://docs.ethers.org/v6/api/providers/#TransactionResponse) | L1 transaction response. |

```ts
async getL2TransactionFromPriorityOp(l1TxResponse: ethers.TransactionResponse): Promise<TransactionResponse>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const l1Tx = "0xcca5411f3e514052f4a4ae1c2020badec6e0998adb52c09959c5f5ff15fba3a8";
const l1TxResponse = await ethProvider.getTransaction(l1Tx);
if (l1TxResponse) {
  console.log(`Tx: ${toJSON(await provider.getL2TransactionFromPriorityOp(l1TxResponse))}`);
}
```

### `getLogProof`

Returns the proof for a transaction's L2 to L1 log sent via the L1Messenger system contract.

Calls the [`zks_getL2ToL1LogProof`](../../../api.md#zks-getl2tol1logproof) JSON-RPC method.

#### Inputs

| Parameter | Type        | Description                                                      |
| --------- | ----------- | ---------------------------------------------------------------- |
| `txHash`  | `BytesLike` | Hash of the L2 transaction the L2 to L1 log was produced within. |
| `index?`  | `number`    | The index of the L2 to L1 log in the transaction (optional).     |

```ts
async getLogProof(txHash: BytesLike, index ? : number): Promise<MessageProof | null>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
// Any L2 -> L1 transaction can be used.
// In this case, withdrawal transaction is used.
const tx = "0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e";
console.log(`Log ${toJSON(await provider.getLogProof(tx, 0))}`);
```

### `getLogs`

Returns an array of all logs that match a filter with a given id by calling Ethereum method [`eth_getLogs.`](https://ethereum.github.io/execution-apis/api-documentation/)

#### Inputs

| Parameter | Type                                                                                                                                               | Description   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `filter`  | [`Filter`](https://docs.ethers.org/v6/api/providers/#Filter) or [`FilterByBlockHash`](https://docs.ethers.org/v6/api/providers/#FilterByBlockHash) | Filter query. |

```ts
async getLogs(filter: Filter | FilterByBlockHash): Promise<Log[]>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Logs: ${toJSON(await provider.getLogs({ fromBlock: 0, toBlock: 5, address: utils.L2_ETH_TOKEN_ADDRESS }))}`);
```

### `getMainContractAddress`

Returns the main zkSync Era smart contract address.

Calls the [`zks_getMainContract`](../../../api.md#zks-getmaincontract) JSON-RPC method.

```ts
async getMainContractAddress(): Promise<Address>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Main contract: ${await provider.getMainContractAddress()}`);
```

### `getPriorityOpResponse`

Returns a [`TransactionResponse`](https://docs.ethers.org/v6/api/providers/#TransactionResponse) as a `PriorityOpResponse` object.

#### Inputs

| Parameter      | Type                                                                                   | Description              |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| `l1TxResponse` | [`TransactionResponse`](https://docs.ethers.org/v6/api/providers/#TransactionResponse) | L1 transaction response. |

```ts
async getPriorityOpResponse(l1TxResponse: ethers.TransactionResponse): Promise<PriorityOpResponse>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
const l1Tx = "0xcca5411f3e514052f4a4ae1c2020badec6e0998adb52c09959c5f5ff15fba3a8";
const l1TxResponse = await ethProvider.getTransaction(l1Tx);
if (l1TxResponse) {
  console.log(`Tx: ${toJSON(await provider.getPriorityOpResponse(l1TxResponse))}`);
}
```

### `getProof`

Returns Merkle [`proofs`](./types.md#storageproof) for one or more storage values at the specified account along with a Merkle proof of their authenticity.

Calls the [`zks_getProof`](../../../api.md#zks-getproof) JSON-RPC method.

#### Inputs

| Parameter       | Type       | Description                                                                                     |
| --------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `address`       | `Address`  | The account to fetch storage values and proofs for.                                             |
| `keys`          | `string[]` | Vector of storage keys in the account.                                                          |
| `l1BatchNumber` | `number`   | Number of the L1 batch specifying the point in time at which the requested values are returned. |

```ts
async getProof(address: Address, keys: string[], l1BatchNumber: number): Promise<StorageProof>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const address = "0x082b1BB53fE43810f646dDd71AA2AB201b4C6b04";

// Fetching the storage proof for rawNonces storage slot in NonceHolder system contract.
// mapping(uint256 => uint256) internal rawNonces;

// Ensure the address is a 256-bit number by padding it
// because rawNonces slot uses uint256 for mapping addresses and their nonces.
const addressPadded = ethers.zeroPadValue(address, 32);

// Convert the slot number to a hex string and pad it to 32 bytes.
const slotPadded = ethers.zeroPadValue(ethers.toBeHex(0), 32);

// Concatenate the padded address and slot number.
const concatenated = addressPadded + slotPadded.slice(2); // slice to remove '0x' from the slotPadded

// Hash the concatenated string using Keccak-256.
const storageKey = ethers.keccak256(concatenated);

const l1BatchNumber = await provider.getL1BatchNumber();
const storageProof = await provider.getProof(utils.NONCE_HOLDER_ADDRESS, [storageKey], l1BatchNumber);
console.log(`Storage proof: ${toJSON(storageProof)}`);
```

### `getRawBlockTransactions`

Returns data of transactions in a block.

Calls the [`zks_getRawBlockTransactions`](../../../api.md#zks-getrawblocktransactions) JSON-RPC method.

#### Inputs

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `number`  | `number` | Block number. |

```ts
async getRawBlockTransactions(number: number): Promise<RawBlockTransaction[]>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Raw block transactions: ${toJSON(await provider.getRawBlockTransactions(90_000))}`);
```

### `getTestnetPaymasterAddress`

Returns the [testnet paymaster](../../../developer-reference/account-abstraction.md#paymasters) address if available, or null.

```ts
async getTestnetPaymasterAddress(): Promise<Address | null>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`Testnet paymaster: ${await provider.getTestnetPaymasterAddress()}`);
```

### `getTransaction`

Returns a specified L2 transaction response object by overriding the [Ethers implementation](https://docs.ethers.org/v5/api/providers/provider/#Provider-getTransaction).

#### Inputs

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `txHash`  | `string` | Transaction hash. |

```ts
override async getTransaction(txHash: string): Promise<TransactionResponse>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
const txHandle = await provider.getTransaction(TX_HASH);

// Wait until the transaction is processed by the server.
await txHandle.wait();
// Wait until the transaction is finalized.
await txHandle.waitFinalize();
```

### `getTransactionDetails`

Returns data from a specific transaction given by the transaction hash.

Calls the [`zks_getTransactionDetails`](../../../api.md#zks-gettransactiondetails) JSON-RPC method.

#### Inputs

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| `txHash`  | `BytesLike` | Transaction hash. |

```ts
async getTransactionDetails(txHash: BytesLike): Promise<TransactionDetails>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
console.log(`Transaction details: ${toJSON(await provider.getTransactionDetails(TX_HASH))}`);
```

### `getTransactionReceipt`

Returns the transaction receipt from a given hash number.

[Ethers implementation.](https://docs.ethers.org/v5/api/providers/provider/#Provider-getTransactionReceipt)

#### Inputs

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `txHash`  | `string` | Transaction hash. |

```ts
async getTransactionReceipt(txHash: string): Promise<TransactionReceipt>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
console.log(`Transaction receipt: ${toJSON(await provider.getTransactionReceipt(TX_HASH))}`);
```

### `getTransactionStatus`

Returns the status of a specified transaction.

#### Inputs

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `txHash`  | `string` | Transaction hash. |

```ts
async getTransactionStatus(txHash: string): Promise<TransactionStatus>
```

#### Example

Helper function: [toJSON](#tojson).

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const TX_HASH = "<YOUR_TX_HASH_ADDRESS>";
console.log(`Transaction status: ${toJSON(await provider.getTransactionStatus(TX_HASH))}`);
```

### `getTransferTx`

Returns the populated transfer transaction.

#### Inputs

| Parameter          | Type                                                                     | Description                                                                                           |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `token`            | `Address`                                                                | Token address.                                                                                        |
| `amount`           | `BigNumberish`                                                           | Amount of token.                                                                                      |
| `from?`            | `Address`                                                                | From address (optional).                                                                              |
| `to?`              | `Address`                                                                | To address (optional).                                                                                |
| `paymasterParams?` | [`PaymasterParams`](./types.md#paymasterparams)                          | Paymaster parameters (optional).                                                                      |
| `overrides?`       | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | Transaction's overrides which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). |

```ts
async getTransferTx(transaction: {
  to: Address;
  amount: BigNumberish;
  from ? : Address;
  token ? : Address;
  paymasterParams?: PaymasterParams;
  overrides ? : ethers.Overrides;
}): Promise<EthersTransactionRequest>
```

#### Examples

Retrieve populated ETH transfer transaction.

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const tx = await provider.getTransferTx({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000_000,
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
});
console.log(`Transfer tx: ${tx}`);
```

Retrieve populated ETH transfer transaction using paymaster to facilitate fee payment with an ERC20 token.

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const token = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
const paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

const tx = await provider.getTransferTx({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000_000,
  to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  paymasterParams: utils.getPaymasterParams(paymaster, {
    type: "ApprovalBased",
    token: token,
    minimalAllowance: 1,
    innerInput: new Uint8Array(),
  }),
});
console.log(`Transfer tx: ${tx}`);
```

### `getWithdrawTx`

Returns the populated withdrawal transaction.

#### Inputs

| Parameter          | Type                                                                     | Description                                                                                           |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `token`            | `Address`                                                                | Token address.                                                                                        |
| `amount`           | `BigNumberish`                                                           | Amount of token.                                                                                      |
| `from?`            | `Address`                                                                | From address (optional).                                                                              |
| `to?`              | `Address`                                                                | To address (optional).                                                                                |
| `bridgeAddress?`   | `Address`                                                                | Bridge address (optional).                                                                            |
| `paymasterParams?` | [`PaymasterParams`](./types.md#paymasterparams)                          | Paymaster parameters (optional).                                                                      |
| `overrides?`       | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | Transaction's overrides which may be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc (optional). |

```ts
async getWithdrawTx(transaction: {
  token: Address;
  amount: BigNumberish;
  from ? : Address;
  to ? : Address;
  bridgeAddress ? : Address;
  paymasterParams?: PaymasterParams;
  overrides ? : ethers.Overrides;
}): Promise<EthersTransactionRequest>
```

#### Examples

Retrieve populated ETH withdrawal transactions.

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);

const tx = await provider.getWithdrawTx({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000_000,
  to: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
});
console.log(`Withdrawal tx: ${tx}`);
```

Retrieve populated ETH withdrawal transaction using paymaster to facilitate fee payment with an ERC20 token.

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const token = "0x927488F48ffbc32112F1fF721759649A89721F8F"; // Crown token which can be minted for free
const paymaster = "0x13D0D8550769f59aa241a41897D4859c87f7Dd46"; // Paymaster for Crown token

const tx = await provider.getWithdrawTx({
  token: utils.ETH_ADDRESS,
  amount: 7_000_000_000,
  to: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  from: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  paymasterParams: utils.getPaymasterParams(paymaster, {
    type: "ApprovalBased",
    token: token,
    minimalAllowance: 1,
    innerInput: new Uint8Array(),
  }),
});
console.log(`Withdrawal tx: ${tx}`);
```

### `l1ChainId`

Returns the chain id of the underlying L1.

Calls the [`zks_L1ChainId`](../../../api.md#zks-L1ChainId) JSON-RPC method.

```ts
async l1ChainId(): Promise<number>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`L1 chain ID: ${await provider.l1ChainId()}`);
```

### `l1TokenAddress`

Returns the L1 token address equivalent for a L2 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter | Type      | Description                     |
| --------- | --------- | ------------------------------- |
| `token`   | `Address` | The address of the token on L2. |

```ts
async l1TokenAddress(token: Address): Promise<string>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`L1 token address: ${await provider.l1TokenAddress("0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b")}`);
```

### `l2TokenAddress`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter | Type      | Description                     |
| --------- | --------- | ------------------------------- |
| `token`   | `Address` | The address of the token on L1. |

```ts
async l2TokenAddress(token: Address): Promise<string>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`L2 token address: ${await provider.l2TokenAddress("0x5C221E77624690fff6dd741493D735a17716c26B")}`);
```

### `newBlockFilter`

Returns a new block filter by calling Ethereum method [`eth_newBlockFilter.`](https://ethereum.github.io/execution-apis/api-documentation/)

```ts
async newBlockFilter(): Promise<bigint>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`New block filter: ${await provider.newBlockFilter()}`);
```

### `newFilter`

Returns a new filter by calling Ethereum method [`eth_newFilter`](https://ethereum.github.io/execution-apis/api-documentation/) and passing a filter object.

#### Inputs

| Parameter | Type                                                                                                                                               | Description   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `filter`  | [`FilterByBlockHash`](https://docs.ethers.org/v6/api/providers/#FilterByBlockHash) or [`Filter`](https://docs.ethers.org/v6/api/providers/#Filter) | Filter query. |

```ts
async newFilter(filter: FilterByBlockHash | Filter): Promise<bigint>
```

#### Example

```ts
import { Provider, types, utils } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(
  `New filter: ${await provider.newFilter({
    fromBlock: 0,
    toBlock: 5,
    address: utils.L2_ETH_TOKEN_ADDRESS,
  })}`
);
```

### `newPendingTransactionFilter`

Returns a new pending transaction filter by calling Ethereum method [`eth_newPendingTransactionFilter`](https://ethereum.github.io/execution-apis/api-documentation/) and passing a
filter object.

```ts
async newPendingTransactionsFilter(): Promise<bigint>
```

#### Example

```ts
import { Provider, types } from "zksync-ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
console.log(`New pending transaction filter: ${await provider.newPendingTransactionsFilter()}`);
```

## `BrowserProvider`

Use this provider for Web3 browser wallet integrations for easy compatibility with Metamask, WalletConnect, and other popular browser wallets.

### `constructor`

Returns a provider object by extending the constructor of the `Provider` class and accepting an `Eip1193Provider` instead of a node URL.

#### Inputs

| Parameter  | Type                                                                           | Description                                                                        |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `ethereum` | [`Eip1193Provider`](https://docs.ethers.org/v6/api/providers/#Eip1193Provider) | The `Eip1193Provider` class instance. For instance, Metamask is `window.ethereum`. |
| `network?` | [`Networkish`](https://docs.ethers.org/v6/api/providers/#Networkish)           | Network name (optional).                                                           |

```ts
constructor(ethereum: Eip1193Provider, network?: Networkish)
```

#### Example

```ts
import { BrowserProvider } from "zksync-ethers";

const provider = new BrowserProvider(window.ethereum);
```

### `estimateGas`

Returns gas estimate by overriding the zkSync Era [`estimateGas`](#estimategas) method.

#### Inputs

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

```ts
override async estimateGas(transaction: TransactionRequest): Promise<bigint>
```

#### Example

```ts
import { BrowserProvider } from "zksync-ethers";

const provider = new BrowserProvider(window.ethereum);
const gas = await provider.estimateGas({
  to: "<RECEIVER>",
  amount: ethers.parseEther("0.01"),
});
console.log(`Gas: ${gas}`);
```

### `getSigner`

Override of [Ethers implementation](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider-getSigner).

#### Inputs

| Parameter  | Type                 | Description                          |
| ---------- | -------------------- | ------------------------------------ |
| `address?` | `number` or `string` | Account address or index (optional). |

```ts
async getSigner(address ? : number | string): Promise<Signer>
```

#### Example

```ts
import { BrowserProvider } from "zksync-ethers";

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
```

### `send`

Returns a provider request object by overriding the [Ethers implementation](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider-send).

#### Inputs

| Parameter | Type         | Description                        |
| --------- | ------------ | ---------------------------------- |
| `method`  | `Address`    | Request method name as string.     |
| `params?` | `Array<any>` | Parameters of any type (optional). |

```ts
async send(method: string, params?: Array<any>): Promise <any>
```

## Appendix

### toJSON

```ts
function toJSON(object: any): string {
  return JSON.stringify(object, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString(); // Convert BigInt to string
    }
    return value;
  });
}
```
