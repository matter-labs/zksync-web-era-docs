# 账户。L1->L2交易

本节探讨了允许[account](./accounts.md)类从L1向L2发送交易的方法。

如果你想了解一些关于L1->L2交互在zkSync上如何工作的背景，请查阅[introduction](././dev/developer-guides/bridging/l1-l2-interop.md)和[guide](././dev/developer-guides/bridging/l1-l2.md) 。


##支持的类

以下账户类别支持从L1向L2发送交易。

- `Wallet` (如果连接到L1提供者)
- `L1Signer`

## 批准代币的存款

从以太坊桥接ERC20代币需要批准代币到zkSync以太坊智能合约。

```typescript
async approveERC20(
    token: Address,
    amount: BigNumberish,
    overrides?: ethers.Overrides & { bridgeAddress?: Address }
): Promise<ethers.providers.TransactionResponse>
```

### 输入和输出

| 名称 | 说明 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token | 代币的Ethereum地址。                                                                                                                                                                              |
| amount | 待批准的代币金额。                                                                                                                                                                         |
| overrides? | **以太坊**交易覆盖物。可用于传递`gasLimit`、`gasPrice`等。你也可以提供一个要使用的L1桥的自定义地址（默认使用`Matter Labs`团队提供的桥）。|
| return                                                                                                                                                                  |`ethers.providers.TransactionResponse`对象。|


> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "0xd35cceead182dcee0f148ebac9447da2c4d449c4";
const txHandle = await wallet.approveERC20(
  USDC_ADDRESS,
  "10000000" // 10.0 USDC
);

await txHandle.wait();
```

## 向zkSync存入代币

```typescript
async deposit(transaction: {
  token: Address;
  amount: BigNumberish;
  to?: Address;
  operatorTip?: BigNumberish;
  bridgeAddress?: Address;
  approveERC20?: boolean;
  overrides?: ethers.PayableOverrides;
  approveOverrides?: ethers.Overrides;
}): Promise<PriorityOpResponse>
```

#### 输入和输出

| 名称 | 说明 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.token | 要存入代币的地址。                                                                                                                                                                                                                                                                                                                            |
| transaction.amount | 要存入的代币的金额。                                                                                                                                                                                                                                                                                                                        |
| Transaction.to?               | 将在L2上接收存入的代币的地址。                                                                                                                                                                                                                                                                                                       |
| transaction.operatorTip?      | (*目前不使用*) 如果交易中传递的ETH值在重写中没有明确说明，这个字段将等于操作员在交易的基本费用之外将收到的小费。|
| transaction.bridgeAddress?    | 要使用的桥接合同的地址。默认为默认的zkSync网桥（`L1EthBridge`或`L1Erc20Bridge`）。                                                                                                                                                                                                                                 |
| transaction.approveERC20?     | 是否应该在引擎盖下进行代币审批。如果你桥接了ERC20令牌，并且没有事先调用 "approveERC20 "函数，将此标志设置为 "true"。                                                                                                                                                                              |
| transaction.overrides?        | **以太坊**交易覆盖物。可用于传递`gasLimit`，`gasPrice`等。                                                                                                                                                                                                                                                                                |
| transaction.approvedOverrides? | **以太坊**交易的批准交易的重写。可用于传递`gasLimit', `gasPrice'等。                                                                                                                                                                                                                                                    |
|return                                                                                                                                                                                                                                                                                                                                    |返回 `PriorityOpResponse`对象。|



> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "0xd35cceead182dcee0f148ebac9447da2c4d449c4";
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
  token: zksync.utils.ETH_ADDRESS,
  amount: "10000000",
});
// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await ethDepositHandle.waitL1Commit()`
await ethDepositHandle.wait();
```

## 向zkSync添加本地令牌

新的代币在第一次存入时就会自动添加。

## 最终确定提款

提款分两步执行--在L2启动，在L1完成。

```typescript
async finalizeWithdrawal(withdrawalHash: BytesLike, index: number = 0): Promise<ethers.TransactionResponse>
```

#### Inputs and outputs

| Name             | Description                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| withdrawalHash | 启动提款的L2交易的哈希值。                                                                           |
| index? | 如果一个交易中有多个提款，你可以传递一个你想最终确定的提款的索引（默认为0）。|

## 在L2上强制执行交易

### 获取L2交易的基本成本

```ts
async getBaseCost(params: {
    gasLimit: BigNumberish;
    gasPerPubdataByte?: BigNumberish;
    gasPrice?: BigNumberish;
}): Promise<BigNumber>
```

#### Inputs and outputs

| Name                       | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| params.gasLimit            | The `gasLimit` for the the L2 contract call.                                     |
| params.gasPerPubdataByte   | The L2 gas price for each published L1 calldata byte.                                                |
| params.gasPrice? | The L1 gas price of the L1 transaction that will send the request for an execute call |
| returns                    | The base cost in ETH for requesting the L2 contract call.                           |

## 申领失败的存款

`claimFailedDeposit`方法从发起的存款中提取资金，该存款在L2上最终确定时失败。 
如果存款的L2交易失败，它将发送一个L1交易，调用L1桥的`claimFailedDeposit`方法，结果是将L1令牌返回给存款人，否则就会抛出错误。

```ts
async claimFailedDeposit(depositHash: BytesLike): Promise<ethers.ContractTransaction>
```

### 输入参数

| 参数 | 类型 | 描述 |
| ----------- | --------- | ---------------------------------------------- |
| depositHash | `bytes32` | 失败存款的二级交易哈希值。|


### Requesting transaction execution

```ts
async requestExecute(transaction: {
    contractAddress: Address;
    calldata: BytesLike;
    l2GasLimit: BigNumberish;
    l2Value?: BigNumberish;
    factoryDeps?: ethers.BytesLike[];
    operatorTip?: BigNumberish;
    gasPerPubdataByte?: BigNumberish;
    refundRecipient?: Address;
    overrides?: ethers.PayableOverrides;
}): Promise<PriorityOpResponse>
```

#### 输入和输出

| 名称 | 说明 |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.contractAddress | 要调用的二级合同。                                                                                                                        |
| transaction.calldata | 二级交易的输入。                                                                                                                |
| transaction.l2GasLimit | 交易在L2上执行时可消耗的最大L2气体量。                                                                   |
| transaction.l2Value?           | L2事务的`msg.value`。                                                                                                                  |
| transaction.factoryDeps?       | L2字节码的数组，这些字节码将被标记为L2上的已知代码。                                                                                    |
| transaction.operatorTip?       | (*目前不使用*) 如果交易中传递的ETH值在重写中没有明确说明，这个字段将等于操作员在交易的基本成本之外将收到的小费。|                                                                                                                                         
| transaction.gasPerPubdataByte?  | 每个公布的L1 calldata字节的二级气体价格。                                          |
| transaction.refundRecipient?   | L2上将收到交易退款的地址。如果交易失败，它也将是接收`l2Value`的地址。|
| transaction.overrides | **以太坊**交易覆盖。可用于传递`gasLimit`、`gasPrice`、`value`等。                                                      |
|returns|返回 `PriorityOpResponse`对象。                                                                                                                   |

> Example

```typescript
import * as zksync from "zksync-web3";
import { BigNumber, ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

// The calldata can be encoded the same way as for Ethereum.
// Here is an example on how to get the calldata from an ABI:
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
  contractAddress: "0x19a5bfcbe15f98aa073b9f81b58466521479df8d",
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
