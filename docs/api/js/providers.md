# 提供者

提供者是包裹与zkSync节点的交互的对象。如果你对`ethers`中提供者的概念感到陌生，你应该看看他们的文档[这里](https://docs.ethers.io/v5/api/providers)。

zkSync完全支持Ethereum Web3 API，所以你可以使用`ethers.js`的提供者对象。然而，zkSync API提供了一些额外的JSON-RPC方法，这些方法允许。

- 轻松地跟踪L1<->L2交易。
- 交易的不同阶段的最终结果。默认情况下，我们的RPC会返回服务器处理的最后一个状态的信息，但有些用例可能只需要跟踪 "最终完成 "的交易。

还有更多! 一般来说，你可以使用`ethers`的提供者来快速入门，但以后可以切换到`zksync-web3`库的提供者。

`zksync-web3`库输出两种类型的提供者。

- `Provider`继承自`ethers`的`JsonRpcProvider`，提供对所有zkSync JSON-RPC端点的访问。
- `Web3Provider`扩展了`Provider`类，使其与Web3钱包更加兼容。*这是一种应该用于浏览器集成的钱包类型。

## `Provider`

这是最常用的提供者类型。它提供了与`ethers.providers.JsonRpcProvider`相同的功能，但用zkSync特定的方法对其进行了扩展。

### 创建提供者

构造函数接受操作者节点的`url`和`network`名称（可选）。

```typescript
constructor(url?: ConnectionInfo | string, network?: ethers.providers.Networkish)
```

#### 输入和输出

| 名称     | 说明                    |
| -------- | ----------------------- |
| url?     | zkSync操作员节点的URL。 |
| network? | 网络的描述。            |
| returns  | `provider`对象。        |


> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");
```

### `getBalance `

返回一个用户在某个区块标签和一个本地令牌的余额。
为了检查`ETH`中的余额，你可以省略最后一个参数或提供`utils`对象中提供的`ETH_ADDRESS`。

Example:

```typescript
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address): Promise<BigNumber>
```

 #### 输入和输出

 | 名称          | 说明                                                         |
 | ------------- | ------------------------------------------------------------ |
 | 地址          | 用户检查余额的地址。                                         |
 | blockTag?     | 检查余额的区块。*默认情况下，使用最新处理的(`committed`)块。 |
 | tokenAddress? | 代币的地址。*默认情况下，使用ETH。                           |
 | returns       | `BigNumber`对象。                                            |

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

const USDC_L2_ADDRESS = "0x0faF6df7054946141266420b43783387A78d82A9";
// Getting  USDC balance of account 0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5 at the latest processed block
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5", "latest", USDC_L2_ADDRESS));

// Getting ETH balance
console.log(await provider.getBalance("0x0614BB23D91625E60c24AAD6a2E6e2c03461ebC5"));
```

### 获取zkSync智能合约地址

```typescript
async getMainContractAddress(): Promise<string>
```

#### 输入和输出

| Name    | Description            |
| ------- | ---------------------- |
| returns | zkSync智能合约的地址。 |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getMainContractAddress());
```

### 获取测试网的付款人地址

在zkSync测试网，测试网的付款人是可用的。

```typescript
async getTestnetPaymasterAddress(): Promise<string|null>
```

#### 输入和输出

| Name    | Description                                |
| ------- | ------------------------------------------ |
| returns | 测试网支付系统的地址，如果没有则为`null`。 |

> Example

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getTestnetPaymasterAddress());
```

### 获取zkSync默认的桥接合约地址

```typescript
async getDefaultBridgeAddresses(): Promise<{
    erc20L1: string;
    erc20L2: string;
}>
```

#### 输入和输出

| Name    | Description                        |
| ------- | ---------------------------------- |
| returns | L1和L2上默认的zkSync桥接合约的地址 |

### `getConfirmedTokens`.

给定`start`和`limit`，返回ID在`[start...start+limit-1]`区间内的确认令牌的信息（地址、符号、名称、小数）。这里的 "确认 "是一个错误的说法，因为一个确认的令牌是已经通过默认的zkSync桥接的令牌。这种方法主要由zkSync团队内部使用。

代币是按照符号的字母顺序返回的，所以基本上，代币ID是它在按字母排序的代币阵列中的位置。

```typescript
async getConfirmedTokens(start: number = 0, limit: number = 255): Promise<Token[]>
```

#### 输入和输出

| 名称   | 说明                                              |
| ------ | ------------------------------------------------- |
| start  | token id，从这个id开始返回token的信息。默认为零。 |
| limit  | 从API返回的令牌数量。255 *默认*。                 |
| rturns |                                                   |

|      |      |
| ---- | ---- |
|      |      |
|      |      |
|      |      |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://zksync2-testnet.zksync.dev");

console.log(await provider.getConfirmedTokens());
```

### "getTokenPrice"。

:::warning 已废弃

该方法已被废弃，并将在不久的将来被删除。

:::

返回一个代币的美元价格。请注意，这是zkSync团队使用的价格，可能与当前的市场价格有一些不同。在测试网络上，代币价格可能与实际市场价格有很大差异。

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

### 从L1地址中获取令牌在L2上的地址，反之亦然

代币在L2上的地址将与L1上的地址不一样。
ETH的地址在两个网络上都被设置为零地址。

所提供的方法只对使用默认的zkSync桥接的令牌有效。

```typescript
// takes L1 address, returns L2 address
async l2TokenAddress(l1Token: Address): Promise<string>
// takes L2 address, returns L1 address
async l1TokenAddress(l2Token: Address): Promise<string>
```

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| token   | The address of the token on the one layer.       |
| returns | The address of that token on the opposite layer. |

### `getTransactionStatus'（获取交易状态）。

给定一个交易哈希值，返回该交易的状态。

```typescript
async getTransactionStatus(txHash: string): Promise<TransactionStatus>
```

| Name    | Description                                                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| txHash   | zkSync transaction hash.                                                                                                  |
| returns | The status of the transaction. You can find the description for `TransactionStatus` enum variants in the [types](./types). |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://zksync2-testnet.zksync.dev");

const TX_HASH = "0x95395d90a288b29801c77afbe359774d4fc76c08879b64708c239da8a65dbcf3";
console.log(await provider.getTransactionStatus(TX_HASH));
```

### `getTransaction `

给出一个交易哈希值，返回L2交易响应对象。

```typescript
async getTransaction(hash: string | Promise<string>): Promise<TransactionResponse>
```

| Name    | Description                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| hash   |  zkSync transaction hash.                                                                  |
| returns | `TransactionResponse`对象，可以方便地跟踪交易的状态。 |

> Example

```typescript
import { Provider } from "zksync-web3";
const provider = new Provider("https://zksync2-testnet.zksync.dev");

const TX_HASH = "0x300baeb6804c2068ff796d95336c53ac671eef216e7ae9c17190660cdb1e2c17";
const txHandle = await provider.getTransaction(TX_HASH);

// Wait until the transaction is processed by the server.
await txHandle.wait();
// Wait until the transaction is finalized.
await txHandle.waitFinalize();
```

### Web3Provider

一个应该用于web3浏览器钱包集成的类，经过调整，可以轻松兼容Metamask、WalletConnect和其他流行的浏览器钱包。

### 创建Web3Provider

与Provider类的构造函数的主要区别是，它接受ExternalProvider而不是节点URL。

```typescript
constructor(provider: ExternalProvider, network?: ethers.providers.Networkish)
```

#### 输入和输出

| 名称 | 说明 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| provider | `ethers.provider.ExternalProvider`类实例。例如，在Metamask的情况下，它是`window.ethereum`。|
| 网络？| 网络的描述。                                                                                       |
|returns|返回 `Provider`对象。                                                                                                    |


> Example

```typescript
import { Web3Provider } from "zksync-web3";

const provider = new Web3Provider(window.ethereum);
```

### 获取zkSync签名者

返回一个`Signer`对象，可用于签署zkSync交易。关于`Signer`类的更多细节可以在下一[节](./accounts.md#signer)找到。

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
