---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Accounts | zkSync Era Docs
---

# Accounts: overview

`zksync-web3` exports four classes that can sign transactions on zkSync:

- `Wallet` class is an extension of the `ethers.Wallet` with additional zkSync features.
- `EIP712Signer` class that is used to sign `EIP712`_-typed_ zkSync transactions.
- `Signer` and `L1Signer` classes, which should be used for browser integration.

## `Wallet`

### Creating wallet from a private key

Just like `ethers.Wallet`, the `Wallet` object from `zksync-web3` can be created from Ethereum private key.

```typescript
  constructor Wallet(
    privateKey: ethers.utils.BytesLike | ethers.utils.SigningKey,
    providerL2?: Provider,
    providerL1?: ethers.providers.Provider): Wallet
```

#### Inputs and outputs

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| privateKey  | The private key of the Ethereum account.                    |
| providerL2? | A zkSync node provider. Needed for interaction with zkSync. |
| providerL1? | An Ethereum node provider. Needed for interaction with L1.  |
| returns     | The new `Wallet` object.                                    |

> Example

```typescript
import { Wallet, Provider, utils } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);
```

### Other ways to create `Wallet` instances

The `Wallet` class supports all the methods from `ethers.Wallet` for creating wallets, e.g. creating from mnemonic, creating from encrypted JSON, creating a random wallet, etc. All these methods take the same parameters as `ethers.Wallet`, so you should refer to its documentation on how to use them.

### Connecting to the zkSync provider

To interact with the zkSync network, the `Wallet` object should be connected to a `Provider` by either passing it to the constructor or with the `connect` method.

```typescript
Wallet.connect(provider: Provider): Wallet
```

#### Inputs and outputs

| Name     | Description                     |
| -------- | ------------------------------- |
| provider | A zkSync node provider.         |
| returns  | A new zkSync `Wallet` instance. |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const provider = new Provider("https://sepolia.era.zksync.dev");
const wallet = unconnectedWallet.connect(provider);
```

### Connecting to the Ethereum provider

To perform L1 operations, the `Wallet` object needs to be connected to an `ethers.providers.Provider` object.

```typescript
Wallet.connectToL1(provider: ethers.providers.Provider): Wallet
```

#### Inputs and outputs

| Name     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| provider | An Ethereum node provider.                                        |
| returns  | A new zkSync `Wallet` instance that is connected to L1 `provider` |

> Example

```typescript
import { Wallet } from "zksync-web3";
import { ethers } from "ethers";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethProvider = ethers.getDefaultProvider("sepolia");
const wallet = unconnectedWallet.connectToL1(ethProvider);
```

It is possible to chain `connect` and `connectToL1` methods:

```typescript
const wallet = unconnectedWallet.connect(zkSyncProvider).connectToL1(ethProvider);
```

### Getting the zkSync L1 smart contract

```typescript
async getMainContract(): Promise<IZkSync>
```

#### Inputs and outputs

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| returns | `Contract` wrapper of the zkSync smart contract. |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const contract = await wallet.getMainContract();
console.log(contract.address);
```

### Getting token balance

```typescript
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<BigNumber>
```

#### Inputs and outputs

| Name      | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| token?    | The address of the token. ETH by default.                                                                     |
| blockTag? | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| returns   | The amount of the token the `Wallet` has.                                                                     |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_L2_ADDRESS = "<USDC_ADDRESS>";

// Get balance in Big Number
console.log(await wallet.getBalance(USDC_L2_ADDRESS));

// Get balance in ETH formatted
console.log(ethers.utils.formatEther(await wallet.getBalance()));
```

### Getting token balance on L1

```typescript
async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>
```

#### Inputs and outputs

| Name      | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| token?    | The address of the token. ETH by default.                                                   |
| blockTag? | The block the balance should be checked on. The latest processed one is the default option. |
| returns   | The amount of the token the `Wallet` has on Ethereum.                                       |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers, utils } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const unconnectedWallet = new Wallet(PRIVATE_KEY);
const wallet = unconnectedWallet.connect(zkSyncProvider).connectToL1(ethereumProvider);
const USDC_ADDRESS = "<USDC_ADDRESS>";

async function getBalance() {
  // Get balance in Big Number
  console.log(await wallet.getBalanceL1(USDC_ADDRESS));

  // Get balance in ETH formatted
  console.log(utils.formatEther(await wallet.getBalanceL1()));
}

getBalance();
```

### Getting a nonce

`Wallet` also provides the `getNonce` method which is an alias for [getTransactionCount](https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount).

```typescript
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Inputs and outputs

| Name      | Description                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------- |
| blockTag? | The block the nonce should be got on. `committed`, i.e. the latest processed one is the default option. |
| returns   | Account's nonce number.                                                                                 |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");

// Note that we don't need ethereum provider to get the nonce
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

console.log(await wallet.getNonce());
```

### Transferring tokens inside zkSync Era

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

| Name       | Description                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- |
| tx.to      | The address of the recipient.                                                                  |
| tx.amount  | The amount of the token to transfer.                                                           |
| token?     | The address of the token. `ETH` by default.                                                    |
| overrides? | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`, `value`, etc. |
| returns    | A `TransactionResponse` object                                                                 |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const recipient = Wallet.createRandom();

// We transfer 0.01 ETH to the recipient and pay the fee in USDC
const transferHandle = wallet.transfer({
  to: recipient.address,
  amount: ethers.utils.parseEther("0.01"),
});

const tx = await transferHandle;

console.log(`The sum of ${ethers.utils.formatEther(tx.value)} ETH was transferred to ${tx.to}`);
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

| Name           | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| tx.to          | The address of the recipient on L1.                                                |
| tx.amount      | The amount of the token to transfer.                                               |
| token?         | The address of the token. `ETH` by default.                                        |
| bridgeAddress? | The address of the bridge contract to be used.                                     |
| overrides?     | **zkSync** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc. |
| returns        | A `TransactionResponse` object                                                     |

### Retrieving the underlying L1 wallet

You can get an `ethers.Wallet` object with the same private key with `ethWallet()` method.

#### Inputs and outputs

| Name    | Description                                          |
| ------- | ---------------------------------------------------- |
| returns | An `ethers.Wallet` object with the same private key. |

> Example

```typescript
import { Wallet, Provider, utils } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("sepolia");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

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

| Name      | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| token?    | The address of the token. ETH by default.                                                                     |
| blockTag? | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| returns   | The amount of the token the `Signer` has.                                                                     |

> Example

```typescript
import { Web3Provider } from "zksync-web3";
import { ethers } from "ethers";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

const USDC_L2_ADDRESS = "0x852a4599217e76aa725f0ada8bf832a1f57a8a91";
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

| Name      | Description                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------- |
| blockTag? | The block the nonce should be got on. `committed`, i.e. the latest processed one is the default option. |
| returns   | The amount of the token the `Wallet` has.                                                               |

> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();

console.log(await signer.getNonce());
```

### Transferring tokens inside zkSync

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

| Name       | Description                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| tx.to      | The address of the recipient.                                                         |
| tx.amount  | The amount of the token to transfer.                                                  |
| token?     | The address of the token. `ETH` by default.                                           |
| overrides? | **zkSync** transaction overrides. May be used to pass L2 `gasLimit`, `gasPrice`, etc. |
| returns    | An `ethers.ContractTransaction` object.                                               |

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
const zksyncProvider = new Provider("https://sepolia.era.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);
```

### Getting the zkSync L1 smart contract

```typescript
async getMainContract(): Promise<Contract>
```

### Getting bridge contracts

ERC-20 bridge `Contract` object:

```typescript
async getL1BridgeContracts(): Promise<{
    erc20: IL1Bridge;
}>
```

:::note

there is no separate Ether bridge contract, [Main contract](./accounts.md#getting-the-zksync-l1-smart-contract) is used instead.

:::

#### Inputs and outputs

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| returns | `Contract` wrapper of the zkSync smart contract. |

> Example

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";
import { ethers } from "ethers";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://sepolia.era.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const mainContract = await signer.getMainContract();
console.log(mainContract.address);
```

### Getting token balance on L1

```typescript
async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>
```

#### Inputs and outputs

| Name      | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| token?    | The address of the token. ETH by default.                                                   |
| blockTag? | The block the balance should be checked on. The latest processed one is the default option. |
| returns   | The amount of the token the `L1Signer` has on Ethereum.                                     |

> Example

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";
import { ethers } from "ethers";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://sepolia.era.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const USDC_ADDRESS = "<ADDRESS>";

// Getting balance in USDC
console.log(await signer.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalanceL1());
```
