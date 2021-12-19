# Providers

Providers are objects that wrap interaction with the zkSync node. If you are new to concept of providers in `ethers`, you should check out their docs [here](https://docs.ethers.io/v5/api/providers).

zkSync supports fully supports Ethereum Web3 API, so you can use the provider objects from ethers.js. However, zkSync API provides some additional JSON-RPC methods, which allow:

- Easily track L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use-cases may require to track "finalized" transactions only.
- Get balance of any native ERC-20 token.

And much more! Generally, you can providers from `ethers` for a quick start, but switch to providers from `zksync-web3` library later on.

`zksync-web` library exports two types of providers:

- `Provider` which inherits from the `ethers`'s `JsonRpcProvider` and provides access to all the zkSync JSON-RPC endpoints.
- `Web3Provider` which extends the `Provider` class by making it more compatible with Web3 wallets. This is the type of the wallet which should be used for browser integration.s

## `Provider`

The most commonly used type of provider. It provides the same functionality as `ethers.providers.JsonRpcProvider`, but extends it with the zkSync-specific methods.

### Creating provider

The constructor accepts the `url` to the operator node and the `network` name (optional).

```typescript
constructor(url?: ConnectionInfo | string, network?: ethers.providers.Networkish)
```

#### Inputs and outputs

| Name               | Description                      |
| ------------------ | -------------------------------- |
| url (optional)     | URL of the zkSync operator node. |
| network (optional) | The description of the network.  |
| returns            | `Provider` object.               |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://z2-dev-api.zksync.dev");
```

### `getBalance`

Returns balance of a user for a certain blockTag and a native token.
In order to check balance in `ETH` you can either omit the last argument or supply [ETH_ADDRESS](./utils/#eth-address) provided in the `utils` object.

Example:

```typescript
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address): Promise<BigNumber>
```

#### Inputs and outputs

| Name                    | Description                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | --- |
| address                 | The address of the user to check the balance.                                                                  |
| blockTag (optional)     | Which block should we check the balance on. `committed`, i.e. the latest processed one is the default option. |
| tokenAddress (optional) | The address of the token. ETH by default.                                                                     |     |
| returns                 | `BigNumber` object.                                                                                           |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://z2-dev-api.zksync.dev");
const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";

// Getting  USDC balance of account 0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5 at the latest processed block
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5", "latest", USDC_ADDRESS));

// Getting ETH balance
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5"));
```

### Getting address of the zkSync smart contract

```typescript
async getMainContractAddress(): Promise<string>
```

#### Inputs and outputs

| Name    | Description                          |
| ------- | ------------------------------------ |
| returns | Address of the zkSync smart contract. |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://z2-dev-api.zksync.dev");

console.log(await provider.getMainContractAddress());
```

### `getConfirmedTokens`

Given `from` and `limit`, returns the information about the confirmed tokens with ids in the inverval `[from..from+limit-1]`. Confirmed tokens are native tokens which are considered legit by the zkSync team. This method will be mostly used in zkSync wallet interface. 

The tokens are returned in alphabetical order by their symbol, so basically token id is position in alphabetically sorted array of tokens.

```typescript
async getConfirmedTokens(start: number = 0, limit: number = 255): Promise<Token[]>
```

#### Inputs and outputs

| Name    | Description                                                                                   |
| ------- | --------------------------------------------------------------------------------------------- |
| start   | The token id from which to start returning the information about the tokens. Zero by default. |
| limit   | The number of tokens to be returned from the API. 255 by default.                             |
| returns | The array of `Token` objects sorted by their symbol.                                                                 |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

console.log(await provider.getConfirmedTokens());
```

### `isTokenLiquid`

Returns `true` or `false` on whether or not a token can be used to pay fees.

```typescript
async isTokenLiquid(token: Address): Promise<boolean>
```

| Name    | Description                                                                         |
| ------- | ----------------------------------------------------------------------------------- |
| token   | The address of the token.                                                           |
| returns | Boolean value (`true` or `false`) on whether or not a token can be used to pay fees. |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
console.log(await provider.isTokenLiquid(USDC_ADDRESS)); // Should return true
```

<!-- TODO: uncomment once fixed --->
<!-- ### `getTokenPrice`

Returns the price USD in for a token. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

```typescript
async getTokenPrice(token: Address): Promise<string>
```

| Name    | Description                                                                         |
| ------- | ----------------------------------------------------------------------------------- |
| token   | The address of the token.                                                           |
| returns | `string` value of the teken price.  |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
console.log(await provider.getTokenPrice(USDC_ADDRESS)); 
``` -->

### `getTransactionStatus`

Given transaction hash, returns the status of the transaction.

```typescript
async getTransactionStatus(txHash: string): Promise<TransactionStatus>
```

| Name    | Description                                                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| token   | The address of the token.                                                                                                  |
| returns | The status of the transaction. You can find the description for `TransactionStatus` enum variants in the [types](./types). |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

const TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
console.log(await provider.getTransactionStatus(TX_HASH));
```

### `getTransaction`

Given transaction hash, returns zkSync L2 transaction response object.

```typescript
async getTransaction(hash: string | Promise<string>): Promise<TransactionResponse>
```

| Name    | Description                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| token   | The address of the token.                                                                  |
| returns | `TransactionResponse` object, which allows for easy tracking the state of the transaction. |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

const TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
const txHandle = await provider.getTransactionStatus(TX_HASH);

// Wait until the tx is processed by the server.
await txHandle.wait();
// Wait until the tx is finalized.
await txHandle.waitFinalize();
```

### `getL1Withdrawal`

Given the hash of the withdrawal tx, returns the hash of the layer 1 transaction that executed the withdrawal or `null` if the withdrawal has not been executed yet.

```typescript
async getL1Withdrawal(withdrawalHash: string): Promise<string|null>
```

| Name           | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| withdrawalHash | The hash of the withdrawal transaction.                           |
| returns        | The hash of the layer 1 transaction that executed the withdrawal. |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://z2-dev-api.zksync.dev");

const WITHDRAWAL_TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
console.log(await provider.getL1Withdrawal(WITHDRAWAL_TX_HASH));
```

## `Web3Provider`

A class which should be used for web3 browser wallet integrations, adapted for easy compatibility with Metamask, WalletConnect and other popular browser wallets.

### Creating `Web3Provider`

The main difference from the constructor of `Provider` class is that it accepts `ExternalProvider` instead of the node URL.

```typescript
constructor(provider: ExternalProvider, network?: ethers.providers.Networkish)
```

#### Inputs and outputs

| Name               | Description                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| provider           | The `ethers.providers.ExternalProvider` class instance. For instance, in case of Metamask it is `window.ethereum`. |
| network (optional) | The description of the network.                                                                                    |
| returns            | `Provider` object.                                                                                                 |

> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
```

### Getting zkSync Signer

Returns signer which can be used to sign zkSync transactions. More details on the `Signer` class can be found in the next [section](./accounts.md#signer).

#### Inputs and outputs

| Name    | Description            |
| ------- | ---------------------- |
| returns | `Signer` class object. |

> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();
```
