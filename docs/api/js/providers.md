# Providers

Providers are objects that wrap interactions with the zkSync node. If you are new to the concept of providers in `ethers`, you should check out their docs [here](https://docs.ethers.io/v5/api/providers).

zkSync fully supports Ethereum Web3 API, so you can use the provider objects from ethers.js. However, zkSync API provides some additional JSON-RPC methods, which allow:

- Easily track L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use-cases may require tracking "finalized" transactions only.

And much more! Generally, you can use providers from `ethers` for a quick start, but switch to providers from the `zksync-web3` library later on.

The `zksync-web3` library exports two types of providers:

- `Provider` which inherits from `ethers`'s `JsonRpcProvider` and provides access to all of the zkSync JSON-RPC endpoints.
- `Web3Provider` which extends the `Provider` class by making it more compatible with Web3 wallets. This is the type of wallet that should be used for browser integrations.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `Provider`

This is the most commonly used type of provider. It provides the same functionality as `ethers.providers.JsonRpcProvider`, but extends it with the zkSync-specific methods.

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

const provider = new Provider("https://zksync2-testnet.zksync.dev");
```

### `getBalance`

Returns the balance of a user for a certain block tag and a native token.
In order to check the balance in `ETH` you can either omit the last argument or supply `ETH_ADDRESS` provided in the `utils` object.

Example:

```typescript
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address): Promise<BigNumber>
```

#### Inputs and outputs

| Name                    | Description                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| address                 | The address of the user to check the balance.                                                                 |
| blockTag (optional)     | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| tokenAddress (optional) | The address of the token. ETH by default.                                                                     |  |
| returns                 | `BigNumber` object.                                                                                           |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

// Getting  USDC balance of account 0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5 at the latest processed block
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5", "latest", USDC_L2_ADDRESS));

// Getting ETH balance
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5"));
```

### Getting the zkSync smart contract address

```typescript
async getMainContractAddress(): Promise<string>
```

#### Inputs and outputs

| Name    | Description                               |
| ------- | ----------------------------------------- |
| returns | The address of the zkSync smart contract. |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getMainContractAddress());
```

### Getting testnet paymaster address

On zkSync testnets, the [testnet paymaster](../../dev/developer-guides/aa.md#paymasters) is available.

```typescript
async getTestnetPaymasterAddress(): Promise<string|null>
```

#### Inputs and outputs

| Name    | Description                               |
| ------- | ----------------------------------------- |
| returns | The address of the testnet paymaster or `null` if there isn't any. |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getTestnetPaymasterAddress());
```

### Getting zkSync default bridge contract addresses

```typescript
async getDefaultBridgeAddresses(): Promise<{
    ethL1?: Address;
    ethL2?: Address;
    erc20L1?: Address;
    erc20L2?: Address;
}>
```

#### Inputs and outputs

| Name    | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| returns | The addresses of default zkSync bridge contracts on both L1 and L2 |

### `getConfirmedTokens`

Given `from` and `limit` returns information (address, symbol, name, decimals) about the confirmed tokens with IDs in the interval `[from..from+limit-1]`. "Confirmed" is a misnomer here, since a confirmed token is one that has been bridged through the default zkSync bridge. This method will mostly be used by the zkSync team internally.

The tokens are returned in alphabetical order by their symbol, so basically, the token id is its position in an alphabetically sorted array of tokens.

```typescript
async getConfirmedTokens(start: number = 0, limit: number = 255): Promise<Token[]>
```

#### Inputs and outputs

| Name    | Description                                                                                   |
| ------- | --------------------------------------------------------------------------------------------- |
| start   | The token id from which to start returning the information about the tokens. Zero by default. |
| limit   | The number of tokens to be returned from the API. 255 by default.                             |
| returns | The array of `Token` objects sorted by their symbol.                                          |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getConfirmedTokens());
```

### `getTokenPrice`

::: warning Deprecated

This method is deprecated and will be removed soon.

:::

Returns the price USD in for a token. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

```typescript
async getTokenPrice(token: Address): Promise<string | null>
```

| Name    | Description                        |
| ------- | ---------------------------------- |
| token   | The address of the token.          |
| returns | `string` value of the token price. |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getTokenPrice(USDC_L2_ADDRESS));
```

### Getting token's address on L2 from its L1 address and vice-versa

Token's address on L2 will not be the same as on L1.
ETH's address is set to zero address on both networks.

Provided methods work only for tokens bridged using default zkSync bridges.

```typescript
// takes L1 address, returns L2 address
async l2TokenAddress(l1Token: Address): Promise<Address>
// takes L2 address, returns L1 address
async l1TokenAddress(l2Token: Address): Promise<Address>
```

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| token   | The address of the token.                        |
| returns | The address of that token on the opposite layer. |

### `getTransactionStatus`

Given a transaction hash, returns the status of the transaction.

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
const provider = new Provider("https://zksync2-testnet.zksync.dev");

const TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
console.log(await provider.getTransactionStatus(TX_HASH));
```

### `getTransaction`

Given a transaction hash, returns the L2 transaction response object.

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
const provider = new Provider("https://zksync2-testnet.zksync.dev");

const TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
const txHandle = await provider.getTransaction(TX_HASH);

// Wait until the transaction is processed by the server.
await txHandle.wait();
// Wait until the transaction is finalized.
await txHandle.waitFinalize();
```

## `Web3Provider`

A class that should be used for web3 browser wallet integrations, adapted for easy compatibility with Metamask, WalletConnect, and other popular browser wallets.

### Creating `Web3Provider`

The main difference from the constructor of `Provider` class is that it accepts `ExternalProvider` instead of the node URL.

```typescript
constructor(provider: ExternalProvider, network?: ethers.providers.Networkish)
```

#### Inputs and outputs

| Name               | Description                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| provider           | The `ethers.providers.ExternalProvider` class instance. For instance, in the case of Metamask it is `window.ethereum`. |
| network (optional) | The description of the network.                                                                                        |
| returns            | `Provider` object.                                                                                                     |

> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
```

### Getting zkSync signer

Returns a `Signer` object that can be used to sign zkSync transactions. More details on the `Signer` class can be found in the next [section](./accounts.md#signer).

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
