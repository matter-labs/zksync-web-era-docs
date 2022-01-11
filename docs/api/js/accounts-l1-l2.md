# Accounts: L1->L2 transactions

In this section we will explore the methods which allow the [account]() classes to send transactions from L1 to L2.

## Supported classes

The following account classes support sending transactions from L1 to L2:

- `Wallet` (if connected to an L1 provider)
- `L1Signer`

## Approving deposit of tokens

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

```typescript
async approveERC20(
    token: Address,
    amount: BigNumberish,
    overrides?: ethers.CallOverrides
): Promise<ethers.providers.TransactionResponse>
```

### Inputs and outputs

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| token                | The Ethereum address of the token.                                               |
| amount               | The amount of the token to be approved.                                          |
| overrides (optional) | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc. |
| returns              | `ethers.providers.TransactionResponse` object.                                   |

> Example

```typescript
import * as zksync from "zksync";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
const txHandle = await wallet.approveERC20({
  USDC_ADDRESS,
  amount: "10000000", // 10.0 USDC
});

await txHandle.wait();
```

## Depositing tokens to zkSync

### Getting the base cost for deposit to zkSync

While for now the deposits are free, it is important to note that it may change in the future. We added the functionality to get the base cost for the deposit transaction:

```ts
async depositBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

#### Inputs and outputs

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| params.gasPrice (optional)               | The gas price of the L1 transaction that will send the request for deposit.                                               |
| params.queueType (optional)              | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                         |
|     params.opTree (optional) | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used. |
| returns              | The base cost in ETH for requesting a deposit.                                   |


### Performing the deposit

The wallet also has a convenience method for bridging tokens to zkSync:

```typescript
async deposit(transaction: {
    token: Address;
    amount: BigNumberish;
    to?: Address;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
    operatorTip?: BigNumberish;
    approveERC20?: boolean;
    overrides?: ethers.CallOverrides;
    approveOverrides?: ethers.CallOverrides;
}): Promise<PriorityOpResponse>
```

#### Inputs and outputs

| Name                                | Description                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.token                   | The address of the token to deposit.                                                                                                                                            |
| transaction.amount                  | The amount of the token to be deposited.                                                                                                                                        |
| transaction.to (optional)           | The address that will receive the deposited tokens on L2.                                                                                                                       |
| transaction.queueType (optional)           | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                                                                                                       |
| transaction.opTree (optional)           | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used.                                                                                                                       |
| transaction.operatorTip (optional)           | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction.  This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues.                                                                                                                         |
| transaction.approveERC20 (optional) | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge ERC20 token and didn't call the `approveERC20` function beforehand. |
| transaction.overrides (optional)    | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                |
| transaction.approveOverrides (optional)    | Ethereum transaction overrides of the approval transaction. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                |
| returns                             | `PriorityOpResponse` object.                                                                                                                                                    |

> Example

```typescript
import * as zksync from "zksync";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
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

## Adding native token to zkSync

### Getting the base cost for adding token to zkSync

```ts
async addTokenBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber> 
```

#### Inputs and outputs

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| params.gasPrice (optional)               | The gas price of the L1 transaction that will send the request for adding a token.                                               |
| params.queueType (optional)              | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                         |
|     params.opTree (optional) | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used. |
| returns              | The base cost in ETH for requesting of adding a token.                                   |

### Performing AddToken

To add a new native token to zkSync, `addToken` function should be called on the zkSync smart contract:

```typescript
async addToken(transaction: {
    token: Address;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
    operatorTip?: BigNumberish;
    overrides?: ethers.CallOverrides;
}): Promise<PriorityOpResponse>
```

#### Inputs and outputs

| Name                 | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| token                | The address of the token.                                                       |
| transaction.queueType (optional)           | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                                                                                                       |
| transaction.opTree (optional)           | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used.                                                                                                                       |
| transaction.operatorTip (optional)           | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction.  This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues.                                                                                                                         |
| overrides (optional) | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc. |
| returns              | `PriorityOpResponse` object.                                                    |

> Example

```typescript
import * as zksync from "zksync";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const MLTT_ADDRESS = "0x690f4886c6911d81beb8130db30c825c27281f22";
const addTokenHandle = await wallet.addToken(MLTT_ADDRESS);

// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await addTokenHandle.waitL1Commit()`
await addTokenHandle.wait();
```

## Requesting a withdrawal from L1

zkSync provides a way to request a withdrawal of your funds from L2 through Ethereum.

### Getting the base cost for withdrawal

```ts
async withdrawBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| params.gasPrice (optional)               | The gas price of the L1 transaction that will send the request for withdrawal.                                               |
| params.queueType (optional)              | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                         |
|     params.opTree (optional) | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used. |
| returns              | The base cost in ETH for requesting a withdrawal.                                   |

### Requesting a withdrawal

```ts
async requestL1Withdraw(transaction: {
    token: Address;
    amount: BigNumberish;
    to: Address;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
    operatorTip?: BigNumberish;
    overrides?: ethers.CallOverrides;
}): Promise<PriorityOpResponse>
```

#### Inputs and outputs

| Name                 | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| token                | The address of the token.                                                       |
| amount                | The amount of the token to withdraw.                                                       |
| to                | The address that will receive the withdrawn tokens on L1. .                                                       |
| transaction.queueType (optional)           | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                                                                                                       |
| transaction.opTree (optional)           | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used.                                                                                                                       |
| transaction.operatorTip (optional)           | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction.  This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues.                                                                                                                         |
| overrides (optional) | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc. |
| returns              | `PriorityOpResponse` object.                                                    |

> Example

```ts
TODO
```

## Calling L2 smart contracts from L1

zkSync provides a way to invoke `Execute` transaction through Ethereum.

### Getting the base cost for contract call

```ts
async executeBaseCost(params: {
    ergsLimit: BigNumberish;
    calldataLength: number;
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber> 
```

#### Inputs and outputs

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| params.ergsLimit                | The `ergsLimit` for the call.                                               |
| params.calldataLength               | The length of the calldata in bytes.                                               |
| params.gasPrice (optional)               | The gas price of the L1 transaction that will send the request for execute.                                               |
| params.queueType (optional)              | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                         |
|     params.opTree (optional) | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used. |
| returns              | The base cost in ETH for requesting the contract call. 

### Requesting an `Execute`

```ts
async requestL1Execute(transaction: {
    contractAddress: Address;
    calldata: ethers.BytesLike;
    ergsLimit: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
    operatorTip?: BigNumberish;
    overrides?: ethers.CallOverrides;
}): Promise<PriorityOpResponse>
```

#### Inputs and outputs

| Name                 | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| contractAddress                | The address of the L2 contract to call.                                                       |
| calldata                | The calldata of the call transaction. It can be encoded the same way as in Ethereum.                                                       |
| ergsLimit                |  The `ergsLimit` for the call.                                                       |
| transaction.queueType (optional)           | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                                                                                                       |
| transaction.opTree (optional)           | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used.                                                                                                                       |
| transaction.operatorTip (optional)           | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction.  This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues.                                                                                                                         |
| overrides (optional) | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc. |
| returns              | `PriorityOpResponse` object.                                                    |

> Example

```ts
TODO
```

## Deploying L2 smart contracts from L1

zkSync provides a way to deploy a smart contract on L2 through Ethereum.

### Getting the base cost for deploying smart contract

```ts
async deployContractBaseCost(params?: {
    ergsLimit: BigNumberish;
    bytecodeLength: BigNumberish;
    calldataLength: BigNumberish;
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

#### Inputs and outputs

| Name                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| params.ergsLimit                | The `ergsLimit` for the call.                                               |
| params.bytecodeLength               | The length of the smart contract's zkEVM bytecode in bytes.                                               |
| params.calldataLength               | The length of the calldata in bytes.                                               |
| params.gasPrice (optional)               | The gas price of the L1 transaction that will send the request for deposit.                                               |
| params.queueType (optional)              | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                         |
|     params.opTree (optional) | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used. |
| returns              | The base cost in ETH for requesting a deposit. 

### Requesting a deployment of a contract

```ts
async requestL1DeployContract(transaction: {
    bytecode: ethers.BytesLike;
    calldata: ethers.BytesLike;
    ergsLimit: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
    operatorTip?: BigNumberish;
    overrides?: ethers.CallOverrides;
}): Promise<PriorityOpResponse>
```

#### Inputs and outputs

| Name                 | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| bytecode                | The bytecode of the contract to deploy.                                                       |
| calldata                | The constructor calldata. It needs to be encoded with our SDK. (see the example below).                                                      |
| ergsLimit                |  The `ergsLimit` for the call.                                                       |
| transaction.queueType (optional)           | The type of the queue to use. Currently, only value `PriorityQueueType.Deque` can be used.                                                                                                                       |
| transaction.opTree (optional)           | The operational tree to use. Currently, only value `PriorityOpTree.Full` can be used.                                                                                                                       |
| transaction.operatorTip (optional)           | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction.  This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues.                                                                                                                         |
| overrides (optional) | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc. |
| returns              | `PriorityOpResponse` object.                                                    |

> Example

```ts
TODO
```
