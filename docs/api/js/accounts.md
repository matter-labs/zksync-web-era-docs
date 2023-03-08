# 账户：概述

`zksync-web3`输出四个可以在zkSync上签署交易的类。

- `Wallet`类是`ethers.Wallet`的扩容，具有额外的zkSync功能。
- `EIP712Signer`类，用于签署`EIP712`*类型*的zkSync交易。
- `Signer`和`L1Signer`类，应该用于浏览器集成。

## `Wallet`.

### 从一个私钥创建钱包

就像`ethers.Wallet`一样，`zksync-web3`的`Wallet`对象可以由Ethereum私钥创建。

```typescript
constructor Wallet(
  privateKey: ethers.utils.BytesLike | ethers.utils.SigningKey,
  providerL2?: Provider,
  providerL1?: ethers.providers.Provider): Wallet
```

#### 输入和输出

| 名称          | 说明                           |
| ----------- | ---------------------------- |
| privateKey  | 以太坊账户的私钥。                    |
| providerL2? | 一个zkSync节点提供者。需要与zkSync进行互动。 |
| providerL1? | 一个Ethereum节点提供者。需要与L1进行交互。   |
| returns     | 新的 "钱包 "对象。                  |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);
```

### 创建`钱包`实例的其他方法

`Wallet`类支持`ethers.Wallet`中所有用于创建钱包的方法，例如，从助记符创建，从加密的JSON创建，创建一个随机钱包，等等。所有这些方法的参数与`ethers.Wallet`相同，所以你应该参考它的文档来了解如何使用它们。

### 连接到zkSync提供者

为了与zkSync网络进行交互，`Wallet`对象应该连接到`Provider`，方法是将其传递给构造函数或使用`connect`方法。

```typescript
Wallet.connect(provider: Provider): Wallet
```

#### 输入和输出

| 名称       | 说明                  |
| -------- | ------------------- |
| provider | 一个zkSync节点提供者。      |
| returns  | 一个新的zkSync "钱包 "实例。 |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const provider = new Provider("https://zksync2-testnet.zksync.dev");
const wallet = unconnectedWallet.connect(provider);
```

### 连接到Ethereum提供者

为了执行L1操作，`Wallet`对象需要连接到一个`ethers.providers.Provider`对象。

```typescript
Wallet.connectToL1(provider: ethers.providers.Provider): Wallet
```

#### Inputs and outputs

| Name     | Description                      |
| -------- | -------------------------------- |
| provider | 一个Ethereum节点提供者。                 |
| returns  | 一个新的zkSync "钱包 "实例，与L1 "供应商 "相连。 |

> Example

```typescript
import { Wallet } from "zksync-web3";
import { ethers } from "ethers";

const unconnectedWallet = new Wallet(PRIVATE_KEY);

const ethProvider = ethers.getDefaultProvider("goerli");
const wallet = unconnectedWallet.connectToL1(ethProvider);
```

可以将 "connect "和 "connectToL1 "方法进行连锁。

```typescript
const wallet = unconnectedWallet.connect(provider).connectToL1(ethProvider);
```

### 获取zkSync L1智能合约

```typescript
async getMainContract(): Promise<IZkSync>
```

#### 输入和输出

| Name    | Description       |
| ------- | ----------------- |
| returns | zkSync智能合约的合约封装器。 |

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

### 获得代币余额

```typescript
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<BigNumber>
```

#### Inputs and outputs

| Name      | Description       |
| --------- | ----------------- |
| token?    | 代币的地址。默认为ETH.     |
| blockTag? | 承诺，即最近处理的一个是默认选项。 |
| returns   | 钱包拥有的代币的数量。       |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

const USDC_L2_ADDRESS = "0x852a4599217e76aa725f0ada8bf832a1f57a8a91";

// Getting balance in USDC
console.log(await wallet.getBalance(USDC_L2_ADDRESS));

// Getting balance in ETH
console.log(await wallet.getBalance());
```

### 在L1上获得代币平衡

```typescript
async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>
```

#### 输入和输出

| Name      | Description              |
| --------- | ------------------------ |
| token?    | 代币的地址。默认为ETH。            |
| blockTag? | 余额应该被检查的区块。最近处理的那个是默认选项。 |
| returns   | 钱包在以太坊上拥有的代币的数量。         |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

const USDC_ADDRESS = "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4";

// Getting balance in USDC
console.log(await wallet.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await wallet.getBalanceL1());
```

### 获得一个nonce

Wallet "还提供了 "getNonce "方法，它是[getTransactionCount]()的一个别名。

```typescript
async getNonce(blockTag?: BlockTag): Promise<number>
```

#### Inputs and outputs

| Name      | Description       |
| --------- | ----------------- |
| blockTag? | 承诺的，即最新处理的，是默认选项。 |
| returns   | 账户的nonce号码。       |

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

### 在zkSync内部传输令牌

为了方便，"钱包 "类有 "转移 "方法，可以在同一界面内转移 "ETH "或任何 "ERC20 "令牌。

```typescript
async transfer(tx: {
    to: Address;
    amount: BigNumberish;
    token?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<TransactionResponse>
```

#### 输入和输出

| Name       | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| tx.to      | The address of the recipient.                                                                   |
| tx.amount  | The amount of the token to transfer.                                                            |
| token?     | The address of the token. `ETH` by default.                                                     |
| overrides? | **zkSync** transaction overrides. May be used to pass l2 `gasLimit`, `gasPrice`,  `value`, etc. |
| returns    | A `TransactionResponse` object                                                                  |

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

| Name           | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| tx.to          | The address of the recipient on L1.                                                |
| tx.amount      | The amount of the token to transfer.                                               |
| token?         | The address of the token. `ETH` by default.                                        |
| bridgeAddress? | The address of the bridge contract to be used.                                     |
| overrides?     | **zkSync** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc. |
| returns        | A `TransactionResponse` object                                                     |

### 检索底层的 L1 钱包

你可以通过`ethWallet()`方法获得一个具有相同私钥的`ethers.Wallet`对象。

#### 输入和输出

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

这个类的方法主要在内部使用。使用这个类的例子很快就会出现!

## `Signer`

这个类将在浏览器环境中使用。构造它的最简单方法是使用`Web3Provider`的`getSigner`方法。这个结构扩展了`ethers.providers.JsonRpcSigner`，所以支持它的所有可用方法。

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
const signer = provider.getSigner();
```

### 获得代币余额

```typescript
async getBalance(token?: Address, blockTag: BlockTag = 'committed'): Promise<BigNumber>
```

#### Inputs and outputs

| Name      | Description       |
| --------- | ----------------- |
| token?    | 代币的地址。默认为ETH。     |
| blockTag? | 承诺的，即最近处理的，是默认选项。 |
| returns   | 签约人拥有的代币的数量。      |

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

### 获得一个nonce

Wallet "类也提供了 "getNonce "方法，它是[getTransactionCount](https://docs.ethers.io/v5/api/signer/#Signer-getTransactionCount)的一个别名。

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

### 在zkSync内部转移代币

请注意，目前，与Ethereum不同，zkSync不支持原生转移，即所有交易的值域都等于0。

但是为了方便，钱包类有转移方法，可以转移任何ERC20代币。

```typescript
async transfer(tx: {
    to: Address;
    amount: BigNumberish;
    token?: Address;
    overrides?: ethers.CallOverrides;
}): Promise<ethers.ContractTransaction>
```

#### 输入和输出

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

该类将在浏览器环境中用于在第1层进行zkSync相关的操作。该类扩展了ethers.providers.JsonRpcSigner，因此支持它的所有可用方法。

构造它的最简单的方法是来自Web3Provider对象。

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

### Getting bridge contracts

ERC-20桥 `contract `对象。

```typescript
async getL1BridgeContracts(): Promise<{
    erc20: IL1Bridge;
}>
```

:::note

 没有单独的以太桥合约，而是使用主合约。

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

| 名称        | 说明                            |
| --------- | ----------------------------- |
| token?    | 代币的地址。默认为ETH。                 |
| blockTag? | 余额应该被检查的区块。最新处理的一个是默认选项。      |
| returns   | `L1Signer'在Ethereum上拥有的代币的数量。 |

> Example

```typescript
import { Web3Provider, Provider, L1Signer } from "zksync-web3";
import { ethers } from "ethers";

const provider = new ethers.Web3Provider(window.ethereum);
const zksyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
const signer = L1Signer.from(provider.getSigner(), zksyncProvider);

const USDC_ADDRESS = "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4";

// Getting balance in USDC
console.log(await signer.getBalanceL1(USDC_ADDRESS));

// Getting balance in ETH
console.log(await signer.getBalanceL1());
```
