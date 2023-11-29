---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Accounts | zkSync Era Docs
---

# Accounts: overview

`zksync2-js` exports following classes that can sign transactions on zkSync:

- `Wallet` class is an extension of the `ethers.Wallet` with additional zkSync features.
- `EIP712Signer` class that is used to sign `EIP712`_-typed_ zkSync transactions.
- `Signer`, `L1Signer`, `L2VoidSigner`, `L1VoidSigner` classes, which should be used for browser integration.

## `Wallet`

### `constructor`

#### Inputs

| Parameter     | Type                                                                                 | Description                                                            |
| ------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `privateKey`  | `string` or [`ethers.SigningKey`](https://docs.ethers.org/v6/api/crypto/#SigningKey) | The private key of the Ethereum account.                               |
| `providerL2?` | [`Provider`](./providers.md#provider)                                                | A zkSync node provider. Needed for interaction with zkSync (optional). |
| `providerL1?` | [`ethers.Provider`](https://docs.ethers.org/v6/api/providers/#Provider)              | An Ethereum node provider. Needed for interaction with L1 (optional).  |

```ts
constructor(privateKey: string | ethers.SigningKey, providerL2?: Provider, providerL1?: ethers.Provider)
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);
```

### fromMnemonic

Creates a `Wallet` with the `provider` as L1 provider and a private key that is built from the `mnemonic` passphrase.

#### Inputs

| Parameter   | Type                                                                    | Description                                                           |
| ----------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `mnemonic`  | `string`                                                                | The mnemonic of the private key.                                      |
| `provider?` | [`ethers.Provider`](https://docs.ethers.org/v6/api/providers/#Provider) | An Ethereum node provider. Needed for interaction with L1 (optional). |

```ts
static fromMnemonic(mnemonic: string, provider?: ethers.Provider): Wallet
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const MNEMONIC = "stuff slice staff easily soup parent arm payment cotton hammer scatter struggle";

const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = Wallet.fromMnemonic(MNEMONIC, ethProvider);
```

### fromEncryptedJson

Creates a `Wallet` from encrypted `json` file using provided `password`.

#### Inputs

| Parameter   | Type                     | Description                                                                                         |
| ----------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `json`      | `string`                 | Encrypted json file.                                                                                |
| `password`  | `string` or `Uint8Array` | Password for encrypted json file.                                                                   |
| `callback?` | `ProgressCallback`       | If callback is provided, it is called periodically during decryption so that any UI can be updated. |

```ts
static override async fromEncryptedJson(json: string, password: string | Uint8Array, callback? : ProgressCallback): Promise<Wallet>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import * as fs from "fs";

const wallet = await Wallet.fromEncryptedJson(fs.readFileSync("wallet.json", "utf8"), "password");
```

### fromEncryptedJsonSync

Creates a `Wallet` from encrypted `json` file using provided `password`.

#### Inputs

| Parameter  | Type                     | Description                       |
| ---------- | ------------------------ | --------------------------------- |
| `json`     | `string`                 | Encrypted json file.              |
| `password` | `string` or `Uint8Array` | Password for encrypted json file. |

```ts
static override fromEncryptedJsonSync(json: string, password: string | Uint8Array): Wallet
```

#### Example

```ts
import { Wallet } from "zksync2-js";
import * as fs from "fs";

const wallet = Wallet.fromEncryptedJsonSync(fs.readFileSync("tests/files/wallet.json", "utf8"), "password");
```

### connect

To interact with the zkSync network, the `Wallet` object should be connected to a `Provider` by either passing it to the constructor or with the `connect` method.

#### Inputs

| Parameter  | Type                                  | Description             |
| ---------- | ------------------------------------- | ----------------------- |
| `provider` | [`Provider`](./providers.md#provider) | A zkSync node provider. |

```ts
Wallet.connect(provider:Provider): Wallet
```

#### Example

```ts
import { Wallet, Provider, types } from "zksync2-js";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const wallet = unconnectedWallet.connect(provider);
```

It is possible to chain `connect` and `connectToL1` methods:

```ts
const wallet = unconnectedWallet.connect(zkSyncProvider).connectToL1(ethProvider);
```

### connectToL1

To perform L1 operations, the `Wallet` object needs to be connected to an `ethers.Provider` object.

#### Inputs

| Parameter  | Type                                                                    | Description                |
| ---------- | ----------------------------------------------------------------------- | -------------------------- |
| `provider` | [`ethers.Provider`](https://docs.ethers.org/v6/api/providers/#Provider) | An Ethereum node provider. |

```ts
Wallet.connectToL1(provider: ethers.Provider): Wallet
```

#### Example

```ts
import { Wallet } from "zksync2-js";
import { ethers } from "ethers";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = unconnectedWallet.connectToL1(ethProvider);
```

It is possible to chain `connect` and `connectToL1` methods:

```ts
const wallet = unconnectedWallet.connect(zkSyncProvider).connectToL1(ethProvider);
```

### getMainContract

Returns `Contract` wrapper of the zkSync smart contract.

```ts
async getMainContract(): Promise<IZkSync>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Main contract: ${await wallet.getMainContract()}`);
```

### getL1BridgeContracts

Returns L1 bridge contracts.

```ts
async getL1BridgeContracts(): Promise<{ erc20: IL1Bridge }>
```

:::note

there is no separate Ether bridge contract, [Main contract](./accounts.md#getmaincontract) is used instead.

:::

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const l1BridgeContracts = await wallet.getL1BridgeContracts();
```

### getL2BridgeContracts

Returns L2 bridge contracts.

```ts
async getL2BridgeContracts(): Promise<{ erc20: IL2Bridge }>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const l2BridgeContracts = await wallet.getL2BridgeContracts();
```

### getAddress

Returns the wallet address.

```ts
async getAddress(): Promise<Address>;
```

### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Address: ${await wallet.getAddress()}`);
```

### getBalance

Returns the amount of the token the `Wallet` has.

#### Inputs

| Parameter  | Type       | Description                                                                                                   |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `token?`   | `Address`  | The address of the token. ETH by default.                                                                     |
| `blockTag` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_L2_ADDRESS = "0x0faF6df7054946141266420b43783387A78d82A9";

console.log(`USDC balance: ${await wallet.getBalance(USDC_L2_ADDRESS)}`);
```

### getBalanceL1

Returns the amount of the token the `Wallet` has on Ethereum.

#### Inputs

| Parameter   | Type       | Description                                                                                                   |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `token?`    | `Address`  | The address of the token. ETH by default.                                                                     |
| `blockTag?` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getBalanceL1(token?: Address, blockTag?: BlockTag): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_L1_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";

console.log(`USDC balance: ${await wallet.getBalanceL1(USDC_L1_ADDRESS)}`);
```

### getAllBalances

Returns all balances for confirmed tokens given by an account address.

```ts
async getAllBalances(): Promise<BalancesMap>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const allBalances = await wallet.getAllBalances();
```

### getNonce

Returns account's nonce number.

#### Inputs

| Parameter   | Type       | Description                                                                                                   |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `blockTag?` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Nonce: ${await wallet.getNonce()}`);
```

### getDeploymentNonce

Returns account's deployment nonce number.

```ts
async getDeploymentNonce(): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Nonce: ${await wallet.getDeploymentNonce()}`);
```

### ethWallet

You can get an `ethers.Wallet` object with the same private key with `ethWallet()` method.

```ts
ethWallet(): ethers.Wallet
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const ethWallet = wallet.ethWallet();
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
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_L1_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";

console.log(`USDC L2 address: ${await wallet.l2TokenAddress(USDC_L1_ADDRESS)}`);
```

### populateTransaction

Designed for users who prefer a simplified approach by providing only the necessary data to create a valid transaction.
The only required fields are `transaction.to` and either `transaction.data` or `transaction.value` (or both, if the method is payable).
Any other fields that are not set will be prepared by this method.

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

```ts
override async populateTransaction(transaction: TransactionRequest): Promise<TransactionLike>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const recipient = Wallet.createRandom();

const tx = wallet.populateTransaction({
  to: recipient.address,
  amount: ethers.parseEther("0.01"),
});
```

### transfer

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

#### Inputs

| Parameter       | Type                                                                     | Description                                                                                    |
| --------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `tx.to`         | `Address`                                                                | The address of the recipient.                                                                  |
| `tx.amount`     | `BigNumberish`                                                           | The amount of the token to transfer.                                                           |
| `tx.token?`     | `Address`                                                                | The address of the token. `ETH` by default.                                                    |
| `tx.overrides?` | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc. |

```ts
async transfer(tx: {
  to: Address;
  amount: BigNumberish;
  token?: Address;
  overrides?: ethers.Overrides;
}): Promise<TransactionResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const recipient = Wallet.createRandom();

const transferHandle = await wallet.transfer({
  to: recipient.address,
  amount: ethers.parseEther("0.01"),
});

const tx = await transferHandle.wait();

console.log(`The sum of ${tx.value} ETH was transferred to ${tx.to}`);
```

### getAllowanceL1

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter        | Type       | Description                                                                                                                     |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `token`          | `Address`  | The Ethereum address of the token.                                                                                              |
| `bridgeAddress?` | `Address`  | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`). |
| `blockTag?`      | `BlockTag` | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                  |

```ts
async getAllowanceL1(
  token: Address,
  bridgeAddress?: Address,
  blockTag?: ethers.BlockTag
): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_L1_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
console.log(`USDC allowance: ${await wallet.getAllowanceL1(USDC_L1_ADDRESS)}`);
```

### approveERC20

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

#### Inputs

| Parameter    | Type                                                                     | Description                                                                                    |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `token`      | `Address`                                                                | The Ethereum address of the token.                                                             |
| `amount`     | `BigNumberish`                                                           | The amount of the token to be approved.                                                        |
| `overrides?` | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc. |

```ts
async approveERC20(
  token: Address,
  amount: BigNumberish,
  overrides?: ethers.Overrides & { bridgeAddress?: Address }
): Promise<ethers.TransactionResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
const txHandle = await wallet.approveERC20(
  USDC_ADDRESS,
  "10000000" // 10.0 USDC
);

await txHandle.wait();
```

### getBaseCost

Returns base cost for L2 transaction.

#### Inputs

| Name                        | Type           | Description                                                                                      |
| --------------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `params.gasLimit`           | `BigNumberish` | The `gasLimit` for the L2 contract call.                                                         |
| `params.gasPerPubdataByte?` | `BigNumberish` | The L2 gas price for each published L1 calldata byte (optional).                                 |
| `params.gasPrice?`          | `BigNumberish` | The L1 gas price of the L1 transaction that will send the request for an execute call (optional. |

```ts
async getBaseCost(params: {
  gasLimit: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  gasPrice?: BigNumberish;
}): Promise<BigNumber>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

console.log(`Base cost: ${await wallet.getBaseCost({ gasLimit: 100_000 })}`);
```

### deposit

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `transaction.bridgeAddress`). In this case, `transaction.approveERC20` can be enabled to perform token approval. If there are
already enough approved tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge,
use the [`allowanceL1`](#getallowancel1) method.

#### Inputs

| Parameter                        | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.token`              | `Address`                                                                | The address of the token to deposit. `ETH` by default.                                                                                                                                                                      |
| `transaction.amount`             | `BigNumberish`                                                           | The amount of the token to withdraw.                                                                                                                                                                                        |
| `transaction.to?`                | `Address`                                                                | The address that will receive the deposited tokens on L2.                                                                                                                                                                   |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.bridgeAddress?`     | `Address`                                                                | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`).                                                                                             |
| `transaction.approveERC20?`      | `boolean`                                                                | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                          |
| `transaction.l2GasLimit?`        | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                          |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive l2Value.                                                                               |
| `transaction.overrides?`         | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                              |
| `transaction.approveOverrides?`  | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides of the approval transaction. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                                                                                  |
| `transaction.customBridgeData?`  | `BytesLike`                                                              | Additional data that can be sent to a bridge.                                                                                                                                                                               |

```ts
async deposit(transaction: {
  token: Address;
  amount: BigNumberish;
  to?: Address;
  operatorTip?: BigNumberish;
  bridgeAddress?: Address;
  approveERC20?: boolean;
  l2GasLimit?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
  approveOverrides?: ethers.Overrides;
  customBridgeData?: BytesLike;
}): Promise<PriorityOpResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
const usdcDepositHandle = await wallet.deposit({
  token: USDC_ADDRESS,
  amount: "10000000",
  approveERC20: true,
});
// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await usdcDepositHandle.waitL1Commit()`
await usdcDepositHandle.wait();

const ethDepositHandle = await wallet.deposit({
  token: utils.ETH_ADDRESS,
  amount: "10000000",
});
// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await ethDepositHandle.waitL1Commit()`
await ethDepositHandle.wait();
```

### getDepositTx

Returns populated deposit transaction.

#### Inputs

| Parameter                        | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.token`              | `Address`                                                                | The address of the token to deposit. `ETH` by default.                                                                                                                                                                      |
| `transaction.amount`             | `BigNumberish`                                                           | The amount of the token to withdraw.                                                                                                                                                                                        |
| `transaction.to?`                | `Address`                                                                | The address that will receive the deposited tokens on L2.                                                                                                                                                                   |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.bridgeAddress?`     | `Address`                                                                | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`).                                                                                             |
| `transaction.l2GasLimit?`        | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                          |
| `transaction.customBridgeData?`  | `BytesLike`                                                              | Additional data that can be sent to a bridge.                                                                                                                                                                               |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive l2Value.                                                                               |
| `transaction.overrides?`         | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                              |

```ts
async getDepositTx(transaction: {
  token: Address;
  amount: BigNumberish;
  to?: Address;
  operatorTip?: BigNumberish;
  bridgeAddress?: Address;
  l2GasLimit?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  customBridgeData?: BytesLike;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
}): Promise<any>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
const tx = await wallet.getDepositTx({
  token: USDC_ADDRESS,
  amount: "10000000",
});
```

### estimateGasDeposit

Estimates the amount of gas required for a deposit transaction on L1 network. Gas of approving ERC20 token is not included in estimation.

#### Inputs

| Parameter                        | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.token`              | `Address`                                                                | The address of the token to deposit. `ETH` by default.                                                                                                                                                                      |
| `transaction.amount`             | `BigNumberish`                                                           | The amount of the token to withdraw.                                                                                                                                                                                        |
| `transaction.to?`                | `Address`                                                                | The address that will receive the deposited tokens on L2.                                                                                                                                                                   |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.bridgeAddress?`     | `Address`                                                                | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`).                                                                                             |
| `transaction.l2GasLimit?`        | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                          |
| `transaction.customBridgeData?`  | `BytesLike`                                                              | Additional data that can be sent to a bridge.                                                                                                                                                                               |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive l2Value.                                                                               |
| `transaction.overrides?`         | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                              |

```ts
async estimateGasDeposit(transaction:
  token: Address;
  amount: BigNumberish;
  to?: Address;
  operatorTip?: BigNumberish;
  bridgeAddress?: Address;
  customBridgeData?: BytesLike;
  l2GasLimit?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
 }): Promise<bigint>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
const gas = await wallet.estimateGasDeposit({
  token: USDC_ADDRESS,
  amount: "10000000",
});
console.log(`Gas: ${gas}`);
```

### getFullRequiredDepositFee

Retrieves the full needed ETH fee for the deposit. Returns the L1 fee and the L2 fee [`FullDepositFee`](./types.md#fulldepositfee).

#### Inputs

| Parameter                        | Type                                                                     | Description                                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.token`              | `Address`                                                                | The address of the token to deposit. `ETH` by default.                                                                                                                             |
| `transaction.to?`                | `Address`                                                                | The address that will receive the deposited tokens on L2.                                                                                                                          |
| `transaction.bridgeAddress?`     | `Address`                                                                | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`).                                                    |
| `transaction.customBridgeData?`  | `BytesLike`                                                              | Additional data that can be sent to a bridge.                                                                                                                                      |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand. |
| `transaction.overrides?`         | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                                                                     |

```ts
async getFullRequiredDepositFee(transaction: {
  token: Address;
  to?: Address;
  bridgeAddress?: Address;
  customBridgeData?: BytesLike;
  gasPerPubdataByte?: BigNumberish;
  overrides?: ethers.Overrides;
}): Promise<FullDepositFee>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";
const fee = await wallet.getFullRequiredDepositFee({
  token: USDC_ADDRESS,
  to: await wallet.getAddress(),
});
console.log(`Fee: ${fee}`);
```

### claimFailedDeposit

The `claimFailedDeposit` method withdraws funds from the initiated deposit, which failed when finalizing on L2.  
If the deposit L2 transaction has failed, it sends an L1 transaction calling `claimFailedDeposit` method of the L1 bridge, which results in
returning L1 tokens back to the depositor, otherwise throws the error.

#### Inputs

| Parameter   | Type      | Description                                    |
| ----------- | --------- | ---------------------------------------------- |
| depositHash | `bytes32` | The L2 transaction hash of the failed deposit. |

```ts
async claimFailedDeposit(depositHash: BytesLike): Promise<ethers.ContractTransaction>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const FAILED_DEPOSIT_HASH = "<FAILED_DEPOSIT_TX_HASH>";
const claimFailedDepositHandle = await wallet.claimFailedDeposit(FAILED_DEPOSIT_HASH);
```

### withdraw

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Parameter                    | Type                                                                     | Description                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `transaction.token`          | `Address`                                                                | The address of the token. `ETH` by default.                                                    |
| `transaction.amount`         | `BigNumberish`                                                           | The amount of the token to withdraw.                                                           |
| `transaction.to`             | `Address`                                                                | The address of the recipient on L1.                                                            |
| `transaction.bridgeAddress?` | `Address`                                                                | The address of the bridge contract to be used.                                                 |
| `transaction.overrides?`     | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc. |

```ts
async withdraw(transaction: {
  token: Address;
  amount: BigNumberish;
  to?: Address;
  bridgeAddress?: Address;
  overrides?: ethers.Overrides;
}): Promise<TransactionResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const USDC_ADDRESS = "0x0faF6df7054946141266420b43783387A78d82A9";
const usdcWithdrawHandle = await wallet.withdraw({
  token: USDC_ADDRESS,
  amount: "10000000",
});
```

### finalizeWithdrawal

Proves the inclusion of the L2 -> L1 withdrawal message.

#### Inputs

| Name             | Type                                                                     | Description                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `withdrawalHash` | `BytesLike`                                                              | Hash of the L2 transaction where the withdrawal was initiated.                                                                            |
| `index?`         | `hash`                                                                   | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize (defaults to 0). |
| `overrides?`     | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc.                                            |

```ts
async finalizeWithdrawal(withdrawalHash: BytesLike, index: number = 0, overrides?: ethers.Overrides): Promise<ethers.ContractTransactionResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const WITHDRAWAL_HASH = "<WITHDRAWAL_TX_HASH>";
const finalizeWithdrawHandle = await wallet.finalizeWithdrawal(WITHDRAWAL_HASH);
```

### requestExecute

Request execution of L2 transaction from L1.

#### Inputs

| Name                             | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.contractAddress`    | `Address`                                                                | The L2 contract to be called.                                                                                                                                                                                               |
| `transaction.calldata`           | `BytesLike`                                                              | The input of the L2 transaction.                                                                                                                                                                                            |
| `transaction.l2GasLimit`         | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.l2Value?`           | `BigNumberish`                                                           | `msg.value` of L2 transaction.                                                                                                                                                                                              |
| `transaction.factoryDeps?`       | `ethers.BytesLike[]`                                                     | An array of L2 bytecodes that will be marked as known on L2.                                                                                                                                                                |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | The L2 gas price for each published L1 calldata byte.                                                                                                                                                                       |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive `l2Value`.                                                                             |
| `transaction.overrides`          | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                               |

```ts
async requestExecute(transaction: {
  contractAddress: Address;
  calldata: string;
  l2GasLimit: BigNumberish;
  l2Value?: BigNumberish;
  factoryDeps?: ethers.BytesLike[];
  operatorTip?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
}): Promise<PriorityOpResponse>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const CONTRACT_ADDRESS = "<CONTRACT_ADDRESS>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const gasPrice = await wallet.providerL1.getGasPrice();

// The calldata can be encoded the same way as for Ethereum.
// Here is an example of how to get the calldata from an ABI:
const abi = [
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractInterface = new ethers.utils.Interface(abi);
const calldata = contractInterface.encodeFunctionData("increment", []);
const l2GasLimit = BigNumber.from(1000);

const txCostPrice = await wallet.getBaseCost({
  gasPrice,
  calldataLength: ethers.utils.arrayify(calldata).length,
  l2GasLimit,
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const executeTx = await wallet.requestExecute({
  contractAddress: CONTRACT_ADDRESS,
  calldata,
  l2Value: 1,
  l2GasLimit,
  overrides: {
    gasPrice,
    value: txCostPrice,
  },
});

await executeTx.wait();
```

### getRequestExecuteTx

Returns populated deposit transaction.

#### Inputs

| Name                             | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.contractAddress`    | `Address`                                                                | The L2 contract to be called.                                                                                                                                                                                               |
| `transaction.calldata`           | `BytesLike`                                                              | The input of the L2 transaction.                                                                                                                                                                                            |
| `transaction.l2GasLimit`         | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.l2Value?`           | `BigNumberish`                                                           | `msg.value` of L2 transaction.                                                                                                                                                                                              |
| `transaction.factoryDeps?`       | `ethers.BytesLike[]`                                                     | An array of L2 bytecodes that will be marked as known on L2.                                                                                                                                                                |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | The L2 gas price for each published L1 calldata byte.                                                                                                                                                                       |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive `l2Value`.                                                                             |
| `transaction.overrides`          | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                               |

```ts
async getRequestExecuteTx(transaction: {
  contractAddress: Address;
  calldata: string;
  l2GasLimit?: BigNumberish;
  l2Value?: BigNumberish;
  factoryDeps?: ethers.BytesLike[];
  operatorTip?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
}): Promise<EthersTransactionRequest>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const CONTRACT_ADDRESS = "<CONTRACT_ADDRESS>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const gasPrice = await wallet.providerL1.getGasPrice();

// The calldata can be encoded the same way as for Ethereum.
// Here is an example of how to get the calldata from an ABI:
const abi = [
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractInterface = new ethers.utils.Interface(abi);
const calldata = contractInterface.encodeFunctionData("increment", []);
const l2GasLimit = BigNumber.from(1000);

const txCostPrice = await wallet.getBaseCost({
  gasPrice,
  calldataLength: ethers.utils.arrayify(calldata).length,
  l2GasLimit,
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const executeTx = await wallet.getRequestExecuteTx({
  contractAddress: CONTRACT_ADDRESS,
  calldata,
  l2Value: 1,
  l2GasLimit,
  overrides: {
    gasPrice,
    value: txCostPrice,
  },
});
```

### estimateGasRequestExecute

Estimates the amount of gas required for a request execute transaction.

#### Inputs

| Name                             | Type                                                                     | Description                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction.contractAddress`    | `Address`                                                                | The L2 contract to be called.                                                                                                                                                                                               |
| `transaction.calldata`           | `BytesLike`                                                              | The input of the L2 transaction.                                                                                                                                                                                            |
| `transaction.l2GasLimit`         | `BigNumberish`                                                           | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                                                                                               |
| `transaction.l2Value?`           | `BigNumberish`                                                           | `msg.value` of L2 transaction.                                                                                                                                                                                              |
| `transaction.factoryDeps?`       | `ethers.BytesLike[]`                                                     | An array of L2 bytecodes that will be marked as known on L2.                                                                                                                                                                |
| `transaction.operatorTip?`       | `BigNumberish`                                                           | (_currently is not used_) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| `transaction.gasPerPubdataByte?` | `BigNumberish`                                                           | The L2 gas price for each published L1 calldata byte.                                                                                                                                                                       |
| `transaction.refundRecipient?`   | `Address`                                                                | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive `l2Value`.                                                                             |
| `transaction.overrides`          | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, `value`, etc.                                                                                                                               |

```ts
async estimateGasRequestExecute(transaction: {
  contractAddress: Address;
  calldata: string;
  l2GasLimit?: BigNumberish;
  l2Value?: BigNumberish;
  factoryDeps?: ethers.BytesLike[];
  operatorTip?: BigNumberish;
  gasPerPubdataByte?: BigNumberish;
  refundRecipient?: Address;
  overrides?: ethers.Overrides;
}): Promise<EthersTransactionRequest>
```

#### Example

```ts
import { Wallet, Provider, utils } from "zksync2-js";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const CONTRACT_ADDRESS = "<CONTRACT_ADDRESS>";

const provider = Provider.getDefaultProvider(types.Network.Goerli);
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, provider, ethProvider);

const gasPrice = await wallet.providerL1.getGasPrice();

// The calldata can be encoded the same way as for Ethereum.
// Here is an example of how to get the calldata from an ABI:
const abi = [
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractInterface = new ethers.utils.Interface(abi);
const calldata = contractInterface.encodeFunctionData("increment", []);
const l2GasLimit = BigNumber.from(1000);

const txCostPrice = await wallet.getBaseCost({
  gasPrice,
  calldataLength: ethers.utils.arrayify(calldata).length,
  l2GasLimit,
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const executeTx = await wallet.getRequestExecuteTx({
  contractAddress: CONTRACT_ADDRESS,
  calldata,
  l2Value: 1,
  l2GasLimit,
  overrides: {
    gasPrice,
    value: txCostPrice,
  },
});
```

## `EIP712Signer`

The methods of this class are mostly used internally.

### getSignInput

Generates the EIP-712 typed data from provided transaction.

#### Inputs

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

```ts
static getSignInput(transaction: TransactionRequest)
```

### sign

Signs an Ethereum transaction using EIP-712.

#### Inputs

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

```ts
async sign(transaction: TransactionRequest): Promise<Signature>
```

### getSignedDigest

#### Inputs

| Parameter     | Type                                                  | Description          |
| ------------- | ----------------------------------------------------- | -------------------- |
| `transaction` | [`TransactionRequest`](./types.md#transactionrequest) | Transaction request. |

Generates the signed digest of an Ethereum transaction using EIP-712.

```ts
static getSignedDigest(transaction: TransactionRequest): ethers.BytesLike
```

## `Signer`

This class is to be used in a browser environment. The easiest way to construct it is to use the `getSigner` method of the `BrowserProvider`. This structure
extends `ethers.JsonRpcSigner` and so supports all the methods available for it.

```ts
import { BrowserProvider } from "zksync2-js";

const provider = new BrowserProvider(window.ethereum);
const signer = provider.getSigner();
```

### getBalance

Returns the amount of the token the `Signer` has.

#### Inputs

| Parameter  | Type       | Description                                                                                                   |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `token?`   | `Address`  | The address of the token. ETH by default.                                                                     |
| `blockTag` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<bigint>
```

#### Example

```ts
import { BrowserProvider } from "zksync2-js";

const provider = new BrowserProvider(window.ethereum);
const signer = provider.getSigner();

const USDC_L2_ADDRESS = "0x0faF6df7054946141266420b43783387A78d82A9";
// Getting balance in USDC
console.log(await signer.getBalance(USDC_L2_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalance());
```

### getNonce

Returns account's nonce number.

#### Inputs

| Parameter   | Type       | Description                                                                                                   |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `blockTag?` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Example

```ts
import { BrowserProvider } from "zksync2-js";

const provider = new BrowserProvider(window.ethereum);
const signer = provider.getSigner();

console.log(await signer.getNonce());
```

### transfer

Please note that for now, unlike Ethereum, zkSync does not support native transfers, i.e. the `value` field of all transactions is equal to `0`. All the token transfers are done
through ERC20 `transfer` function calls.

But for convenience, the `Wallet` class has `transfer` method, which can transfer any `ERC20` tokens.

#### Inputs and outputs

| Parameter    | Type                                                                     | Description                                                                                    |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `tx.to`      | `Address`                                                                | The address of the recipient.                                                                  |
| `tx.amount`  | `BigNumberish`                                                           | The amount of the token to transfer.                                                           |
| `token?`     | `Address`                                                                | The address of the token. `ETH` by default.                                                    |
| `overrides?` | [`ethers.Overrides`](https://docs.ethers.org/v6/api/contract/#Overrides) | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc. |

```ts
async transfer(tx: {
  to: Address;
  amount: BigNumberish;
  token ? : Address;
  overrides ? : ethers.Overrides;
}): Promise<ethers.ContractTransaction>
```

#### Example

```ts
import { BrowserProvider } from "zksync2-js";
import { ethers } from "ethers";

const provider = new BrowserProvider(window.ethereum);
const signer = provider.getSigner();

const recipient = Wallet.createRandom();

const transferHandle = signer.transfer({
  to: recipient.address,
  amount: ethers.parseEther("0.01"),
});
```

## `L1Signer`

This class is to be used in a browser environment to do zkSync-related operations on layer 1. This class extends `ethers.JsonRpcSigner` and so supports all the methods
available for it.

The easiest way to construct it is from an `BrowserProvider` object.

```ts
import { Provider, L1Signer, types } from "zksync2-js";
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const zksyncProvider = Provider.getDefaultProvider(types.Network.Goerli);
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);
```

### getMainContract

Returns the main zkSync Era smart contract address.

```ts
async getMainContract(): Promise<Contract>
```

#### Example

```ts
import { Provider, L1Signer, types } from "zksync2-js";
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const zksyncProvider = Provider.getDefaultProvider(types.Network.Goerli);
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const mainContract = await signer.getMainContract();
console.log(mainContract.address);
```

### getL1BridgeContracts

Returns L1 bridge contracts.

```ts
async getL1BridgeContracts(): Promise<{ erc20: IL1Bridge }>
```

:::note

there is no separate Ether bridge contract, [Main contract](./accounts.md#getmaincontract) is used instead.

:::

### Example

```ts
import { Provider, L1Signer, types } from "zksync2-js";
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const zksyncProvider = Provider.getDefaultProvider(types.Network.Goerli);
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const l1BridgeContracts = await signer.getL1BridgeContracts();
```

### getBalanceL1

Returns the amount of the token the `L1Signer` has on Ethereum.

#### Inputs

| Parameter   | Type       | Description                                                                                                   |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `token?`    | `Address`  | The address of the token. ETH by default.                                                                     |
| `blockTag?` | `BlockTag` | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |

```ts
async getBalanceL1(token?: Address, blockTag?: BlockTag): Promise<bigint>
```

#### Example

```ts
import { Provider, L1Signer, types } from "zksync2-js";
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);
const zksyncProvider = Provider.getDefaultProvider(types.Network.Goerli);
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const USDC_ADDRESS = "0x5C221E77624690fff6dd741493D735a17716c26B";

// Getting balance in USDC
console.log(await signer.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalanceL1());
```

## L2VoidSigner

`L2VoidSigner` is identical to [`Signer`](#signer) but is designed to allow an address to be used in any API that accepts a `Signer`,
even when there are no credentials available to perform any actual signing.

## L1VoidSigner

`L1VoidSigner` is identical to [`L1Signer`](#l1signer) but is designed to allow an address to be used in any API that accepts a `Signer`,
even when there are no credentials available to perform any actual signing.
