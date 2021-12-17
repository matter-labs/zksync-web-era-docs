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

### Initializing

The constructor accepts the `url` to the operator node and the `network` name (optional).

```typescript
import { Provider } from 'zksync-web3'

const provider = new Provider("https://z2-dev-api.zksync.dev");
```

### `getBalance`

```typescript
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address)
```

Returns balance of a user for a certain blockTag and a native token. Example:

```typescript
const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
const usdcBalance = await provider.getBalance("0xdead00...0000", "latest", USDC_ADDRESS);
```

In order to check balance in `ETH` you can either omit the last argument or supply [ETH_ADDRESS](./utils/#eth-address) provided in the `utils` object. 

### `estimateFee`

Returns the fee for serialized transaction. This function is mostly used internally.

### `getMainContractAddress`

Returns the address of the zkSync smart contract on Ethereum. Example:

```typescript
console.log(await provider.getMainContractAddress());
```

Please note that the value is cached.

### `getConfirmedTokens`

Returns the list of all confirmed native ERC-20 tokens. Example:

```typescript
console.log(await provider.getConfirmedTokens());
```

This method also supports pagination, so you can specify the token id from which to start returning the tokens and maximum number to return:

```typescript
console.log(await provider.getConfirmedTokens(1,4));
```

### `isTokenLiquid`

Returns `true` or `false` on whether or not a token can be used to pay fees.

```typescript
const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926"; 
console.log(await provider.isTokenLiquid(USDC_ADDRESS)); // Should return true
```

### `getTransactionStatus`

Given transaction hash, returns the status of the transaction. This an enum with the following values:

```typescript
async getTransactionStatus(txHash: string): TransactionStatus
```

You can find the meaning for `TransactionStatus` enum variants in the [types](./types).

### `getTransaction`

Given transaction hash, returns zkSync L2 transaction response object. 

```typescript
override async getTransaction(hash: string | Promise<string>): Promise<TransactionResponse>
```

### `getL1Withdrawal`

Given hash of the withdrawal transaction, returns the hash of the Ethereum transactions where it was executed.

```typescript
async getL1Withdrawal(withdrawalHash: string): Promise<string>
```

## `Web3Provider`

A class which should be used for web3 browser wallet integrations, adapted for easy compatibility with Metamask and other popular wallets.

The main difference from the developer perspective is that it accepts `ExternalProvider` in his constructor instead of node URL:

```typescript
import { Web3Provider } from 'zksync-web3'

const provider = new Web3Provider(window.ethereum);
```
