# Accounts: overview

`zksync-web3` exports four classes that can sign transactions on zkSync:

- `Wallet` class is an extension of the `ethers.Wallet` with additional zkSync features.
- `EIP712Signer` class that is used to sign `EIP712`-typed zkSync transactions.
- `Signer` and `L1Signer` classes, which should be used for browser integration.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `Wallet`

### Creating wallet from a private key

Just like `ethers.Wallet`, the `Wallet` object from `zksync-web3` can be created from Ethereum private key.

```typescript
constructor(
    privateKey: ethers.BytesLike | utils.SigningKey,
    providerL2?: Provider,
    providerL1?: ethers.providers.Provider
)
```

#### Inputs and outputs

| Name                  | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| privateKey            | The private key of the Ethereum account.                    |
| providerL2 (optional) | A zkSync node provider. Needed for interaction with zkSync. |
| providerL1 (optional) | An Ethereum node provider. Needed for interaction with L1.  |
| returns               | The new `Wallet` object.                                    |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);
```

### Other ways to create `Wallet` instances

The `Wallet` class supports all the methods from `ethers.Wallet` for creating wallets, e.g. creating from mnemonic, creating from encrypted JSON, creating a random wallet, etc. All these methods take the same parameters as `ethers.Wallet`, so you should refer to its documentation on how to use them.

### Connecting to the zkSync provider

To interact with the zkSync network, the `Wallet` object should be connected to a `Provider` by either passing it to the constructor or with the `connect` method.

```typescript
connect(provider: Provider): Wallet
```

#### Inputs and outputs

| Name     | Description                                 |
| -------- | ------------------------------------------- |
| provider | A zkSync node provider.                     |
| returns  | A new `Wallet` object, connected to zkSync. |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const provider = new Provider("https://zksync2-testnet.zksync.dev");
const wallet = unconnectedWallet.connect(provider);
```

### Connecting to the Ethereum provider

To perform L1 operations, the `Wallet` object needs to be connected to an `ethers.providers.Provider` object.

```typescript
connectToL1(provider: ethers.providers.Provider)
```

#### Inputs and outputs

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| provider | An Ethereum node provider.                    |
| returns  | A new `Wallet` object, connected to Ethereum. |

> Example

```typescript
import { Wallet } from "zksync-web3";
import { ethers } from "ethers";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const ethProvider = ethers.getDefaultProvider("goerli");
const wallet = unconnectedWallet.connectToL1(ethProvider);
```

It is possible to chain `connect` and `connectToL1` methods:

```typescript
const wallet = unconnectedWallet.connect(provider).connectToL1(ethProvider);
```

### Getting the zkSync L1 smart contract

```typescript
async getMainContract(): Promise<Contract>
```

#### Inputs and outputs

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| returns | `Contract` wrapper of the zkSync smart contract. |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const contract = await wallet.getMainContract();
console.log(contract.address);
```

### Getting token balance

```typescript
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<BigNumber>
```

#### Inputs and outputs

| Name                | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| token (optional)    | The address of the token. ETH by default.                                                                     |
| blockTag (optional) | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| returns             | The amount of the token the `Wallet` has.                                                                     |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

// Getting balance in USDC
console.log(await wallet.getBalance(USDC_L2_ADDRESS));

// Getting balance in ETH
console.log(await wallet.getBalance());
```

### Getting token balance on L1

```typescript
async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>
```

#### Inputs and outputs

| Name                | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| token (optional)    | The address of the token. ETH by default.                                                   |
| blockTag (optional) | The block the balance should be checked on. The latest processed one is the default option. |
| returns             | The amount of the token the `Wallet` has on Ethereum.                                       |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

// Getting balance in USDC
console.log(await wallet.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await wallet.getBalanceL1());
```

### Getting a nonce

`Wallet` also provides the `getNonce` method which is an alias for [getTransactionCount](https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount).

```typescript
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Inputs and outputs

| Name                | Description                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| blockTag (optional) | The block the nonce should be got on. `committed`, i.e. the latest processed one is the default option. |
| returns             | The amount of the token the `Wallet` has.                                                               |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
// Note that we don't need ethereum provider to get the nonce
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

console.log(await wallet.getNonce());
```

### Transfering tokens inside zkSync

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

```typescript
async transfer(tx: {
    to: Address;
    amount: BigNumberish;
    token?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<TransactionResponse>
```

#### Inputs and outputs

| Name                 | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| tx.to                | The address of the recipient.                                       |
| tx.amount            | The amount of the token to transfer.                                |
| token (optional)     | The address of the token. `ETH` by default.                         |
| overrides (optional) | Transaction overrides, such as `nonce`, `gasLimit` etc. |
| returns              | A `TransactionResponse` object                                      |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const recipient = zksync.Wallet.createRandom();

// We transfer 0.01 ETH to the recipient and pay the fee in USDC
const transferHandle = wallet.transfer({
  to: recipient.address,
  amount: ethers.utils.parseEther("0.01"),
});
```

### Initiating a withdrawal to L1

```typescript
async withdraw(transaction: {
    token: Address;
    amount: BigNumberish;
    to?: Address;
    bridgeAddress?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<TransactionResponse>
```

| Name                     | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| tx.to                    | The address of the recipient on L1.                                 |
| tx.amount                | The amount of the token to transfer.                                |
| token (optional)         | The address of the token. `ETH` by default.                         |
| bridgeAddress (optional) | The address of the bridge contract to be used.                      |
| overrides (optional)     | Transaction overrides, such as `nonce`, `gasLimit` etc. |
| returns                  | A `TransactionResponse` object                                      |

### Retrieving the underlying L1 wallet

You can get an `ethers.Wallet` object with the same private key with `ethWallet()` method.

#### Inputs and outputs

| Name    | Description                                          |
| ------- | ---------------------------------------------------- |
| returns | An `ethers.Wallet` object with the same private key. |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const ethWallet = wallet.ethWallet();
```

## `EIP712Signer`

The methods of this class are mostly used internally. The examples of using this class are coming soon!

## `Signer`

This class is to be used in a browser environment. The easiest way to construct it is to use the `getSigner` method of the `Web3Provider`. This structure extends `ethers.providers.JsonRpcSigner` and so supports all the methods available for it.

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();
```

### Getting token balance

```typescript
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<BigNumber>
```

#### Inputs and outputs

| Name                | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| token (optional)    | The address of the token. ETH by default.                                                                     |
| blockTag (optional) | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| returns             | The amount of the token the `Signer` has.                                                                     |

> Example

```typescript
import { Web3Provider } from "zksync-web3";
import { ethers } from "ethers";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Getting balance in USDC
console.log(await signer.getBalance(USDC_L2_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalance());
```

### Getting a nonce

The `Wallet` class also provides the `getNonce` method which is an alias for [getTransactionCount](https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount).

```typescript
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Inputs and outputs

| Name                | Description                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| blockTag (optional) | The block the nonce should be got on. `committed`, i.e. the latest processed one is the default option. |
| returns             | The the `Wallet` has.                                                                                   |

> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

console.log(await signer.getNonce());
```

### Transfering tokens inside zkSync

Please note that for now, unlike Ethereum, zkSync does not support native transfers, i.e. the `value` field of all transactions is equal to `0`. All the token transfers are done through ERC20 `transfer` function calls.

But for convenience, the `Wallet` class has `transfer` method, which can transfer any `ERC20` tokens.

```typescript
async transfer(tx: {
    to: Address;
    amount: BigNumberish;
    token?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<ethers.ContractTransaction>
```

#### Inputs and outputs

| Name                 | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| tx.to                | The address of the recipient.                                       |
| tx.amount            | The amount of the token to transfer.                                |
| token (optional)     | The address of the token. `ETH` by default.                         |
| overrides (optional) | Transaction overrides, such as `nonce`, `gasLimit` etc. |
| returns              | An `ethers.ContractTransaction` object.                             |

> Example

```typescript
import { Wallet, Web3Provider } from "zksync-web3";
import { ethers } from "ethers";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

const recipient = Wallet.createRandom();

// We transfer 0.01 ETH to the recipient and pay the fee in USDC
const transferHandle = signer.transfer({
  to: recipient.address,
  amount: ethers.utils.parseEther("0.01"),
});
```

## `L1Signer`

This class is to be used in a browser environment to do zkSync-related operations on layer 1. This class extends `ethers.providers.JsonRpcSigner` and so supports all the methods available for it.

The easiest way to construct it is from an `Web3Provider` object.

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);
```

### Getting the zkSync L1 smart contract

```typescript
async getMainContract(): Promise<Contract>
```

#### Inputs and outputs

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| returns | `Contract` wrapper of the zkSync smart contract. |

> Example

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";
import { ethers } from "ethers";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const mainContract = await signer.getMainContract();
console.log(mainContract.address);
```

### Getting token balance on L1

```typescript
async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>
```

#### Inputs and outputs

| Name                | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| token (optional)    | The address of the token. ETH by default.                                                   |
| blockTag (optional) | The block the balance should be checked on. The latest processed one is the default option. |
| returns             | The amount of the token the `L1Signer` has on Ethereum.                                     |

> Example

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";
import { ethers } from "ethers";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

// Getting balance in USDC
console.log(await signer.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalanceL1());
```
