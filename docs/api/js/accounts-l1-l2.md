# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1->L2 interaction works on zkSync, you should go through the [introduction](../../dev/zksync-v2/l1-l2-interop.md) and the [guide](../../dev/guide/l1-l2.md).

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
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
const txHandle = await wallet.approveERC20(
  USDC_ADDRESS,
 "10000000", // 10.0 USDC
);

await txHandle.wait();
```

## Depositing tokens to zkSync

### Getting the base cost for a deposit

While for now the deposits are free, it is important to note that it may change in the future. zkSync team added the functionality to get the base cost for the deposit transaction:

```ts
async depositBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

#### Inputs and outputs

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| params.gasPrice (optional)  | The gas price of the L1 transaction that will send the request for deposit.                            |
| params.queueType (optional) | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used. |
| params.opTree (optional)    | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.      |
| returns                     | The base cost in ETH for requesting a deposit.                                                         |

### Requesting deposit operation

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

| Name                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.token                       | The address of the token to deposit.                                                                                                                                                                                                                                                                                                                             |
| transaction.amount                      | The amount of the token to be deposited.                                                                                                                                                                                                                                                                                                                         |
| transaction.to (optional)               | The address that will receive the deposited tokens on L2.                                                                                                                                                                                                                                                                                                        |
| transaction.queueType (optional)        | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used.                                                                                                                                                                                                                                                           |
| transaction.opTree (optional)           | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.                                                                                                                                                                                                                                                                |
| transaction.operatorTip (optional)      | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues. |
| transaction.approveERC20 (optional)     | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                                                                                                                                                               |
| transaction.overrides (optional)        | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                                                                                                                                                                                                 |
| transaction.approveOverrides (optional) | Ethereum transaction overrides of the approval transaction. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                                                                                                                                                                     |
| returns                                 | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

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

### Getting the base cost for adding a token to zkSync

```ts
async addTokenBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

#### Inputs and outputs

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| params.gasPrice (optional)  | The gas price of the L1 transaction that will send the request for adding a token.                     |
| params.queueType (optional) | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used. |
| params.opTree (optional)    | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.      |
| returns                     | The base cost in ETH for requesting of adding a token.                                                 |

### Requesting to add a token

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

| Name                               | Description                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token                              | The address of the token.                                                                                                                                                                                                                                                                                                                                        |
| transaction.queueType (optional)   | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used.                                                                                                                                                                                                                                                           |
| transaction.opTree (optional)      | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.                                                                                                                                                                                                                                                                |
| transaction.operatorTip (optional) | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues. |
| overrides (optional)               | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc.                                                                                                                                                                                                                                                                                  |
| returns                            | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |

> Example

```typescript
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const MLTT_ADDRESS = "0x690f4886c6911d81beb8130db30c825c27281f22";
const addTokenHandle = await wallet.addToken({token: MLTT_ADDRESS});

// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await addTokenHandle.waitL1Commit()`
await addTokenHandle.wait();
```

## Requesting a withdrawal from L1

### Getting the base cost for withdrawal

```ts
async withdrawBaseCost(params?: {
    gasPrice?: BigNumberish;
    queueType?: PriorityQueueType;
    opTree?: PriorityOpTree;
}): Promise<BigNumber>
```

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| params.gasPrice (optional)  | The gas price of the L1 transaction that will send the request for a withdrawal.                       |
| params.queueType (optional) | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used. |
| params.opTree (optional)    | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.      |
| returns                     | The base cost in ETH for requesting a withdrawal.                                                      |

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

| Name                               | Description                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token                              | The address of the token.                                                                                                                                                                                                                                                                                                                                        |
| amount                             | The amount of the token to withdraw.                                                                                                                                                                                                                                                                                                                             |
| to                                 | The address that will receive the withdrawn tokens on L1. .                                                                                                                                                                                                                                                                                                      |
| transaction.queueType (optional)   | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used.                                                                                                                                                                                                                                                           |
| transaction.opTree (optional)      | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.                                                                                                                                                                                                                                                                |
| transaction.operatorTip (optional) | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues. |
| overrides (optional)               | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc.                                                                                                                                                                                                                                                                                  |
| returns                            | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |

> Example

```ts
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

const txCostPrice = await wallet.withdrawBaseCost({
  gasPrice,
});

console.log(`Withdrawing the token will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const withdrawTx = await wallet.requestL1Withdraw({
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  amount: "100",
  to: wallet.address,
  overrides: {
    gasPrice,
  },
});

await withdrawTx.wait();
```

## Calling L2 smart contracts from L1

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

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| params.ergsLimit            | The `ergsLimit` for the call.                                                                          |
| params.calldataLength       | The length of the calldata in bytes.                                                                   |
| params.gasPrice (optional)  | The gas price of the L1 transaction that will send the request for an execute call.                    |
| params.queueType (optional) | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used. |
| params.opTree (optional)    | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.      |
| returns                     | The base cost in ETH for requesting the contract call.                                                 |

### Requesting a contract call

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

| Name                               | Description                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contractAddress                    | The address of the L2 contract to call.                                                                                                                                                                                                                                                                                                                          |
| calldata                           | The calldata of the call transaction. It can be encoded the same way as in Ethereum.                                                                                                                                                                                                                                                                             |
| ergsLimit                          | The `ergsLimit` for the call.                                                                                                                                                                                                                                                                                                                                    |
| transaction.queueType (optional)   | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used.                                                                                                                                                                                                                                                           |
| transaction.opTree (optional)      | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.                                                                                                                                                                                                                                                                |
| transaction.operatorTip (optional) | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues. |
| overrides (optional)               | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc.                                                                                                                                                                                                                                                                                  |
| returns                            | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |

> Example

```ts
import * as zksync from "zksync-web3";
import { BigNumber, ethers } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new zksync.Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

// The calldata can be encoded the same way as for Ethereum
const calldata = "0x...";
const ergsLimit = BigNumber.from(1000);

const txCostPrice = await wallet.executeBaseCost({
  gasPrice,
  calldataLength: ethers.utils.arrayify(calldata).length,
  ergsLimit,
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const executeTx = await wallet.requestL1Execute({
  calldata,
  ergsLimit,
  contractAddress: "0x19a5bfcbe15f98aa073b9f81b58466521479df8d",
  overrides: {
    gasPrice,
  },
});

await executeTx.wait();
```

## Deploying L2 smart contracts from L1

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

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| params.ergsLimit            | The `ergsLimit` for the call.                                                                          |
| params.bytecodeLength       | The length of the smart contract's zkEVM bytecode in bytes.                                            |
| params.calldataLength       | The length of the calldata in bytes.                                                                   |
| params.gasPrice (optional)  | The gas price of the L1 transaction that will send the request for contract deployment.                |
| params.queueType (optional) | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used. |
| params.opTree (optional)    | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.      |
| returns                     | The base cost in ETH for requesting a contract deployment.                                             |

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

| Name                               | Description                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bytecode                           | The bytecode of the contract to deploy.                                                                                                                                                                                                                                                                                                                          |
| calldata                           | The constructor calldata. It needs to be encoded with our SDK. (see the example below).                                                                                                                                                                                                                                                                          |
| ergsLimit                          | The `ergsLimit` for the call.                                                                                                                                                                                                                                                                                                                                    |
| transaction.queueType (optional)   | The type of the queue to use. Currently, only the default value `PriorityQueueType.Deque` can be used.                                                                                                                                                                                                                                                           |
| transaction.opTree (optional)      | The operational tree to use. Currently, only the default value `PriorityOpTree.Full` can be used.                                                                                                                                                                                                                                                                |
| transaction.operatorTip (optional) | If the ETH `value` passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. This value has no meaning for the `Deque` type of queue, but it will be used to prioritize the transactions that get into the `Heap` or `HeapBuffer` queues. |
| overrides (optional)               | Ethereum transaction overrides. May be used to pass `gasLimit`, `gasPrice` etc.                                                                                                                                                                                                                                                                                  |
| returns                            | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |

> Example

```ts
import { Wallet, Provider, ContractFactory }  from "zksync-web3";
import { ethers, BigNumber } from "ethers";

const PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

const zkSyncProvider = new Provider("https://z2-dev-api-rinkeby.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("rinkeby");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

// The zkEVM bytecode of the contract.
const bytecode = "0x...";

// ABI of the smart contract. Here the smart contract
// takes a single parameter to its constructor of an `address` type.
const abi = [{
    "inputs": [
        {
            "internalType": "address",
            "name": "newGovernance",
            "type": "address"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
}];

// Please note that the constructor calldata must be encoded by our SDK.
// Here is an example of how it can be done:
// 1. Create a contract factory.
const factory = new ContractFactory(
    abi,
    bytecode,
    wallet
);

// 2. Get the L2 deployment transaction's data. The calldata on L1 is encoded the same as on L2.
// `wallet.address` here is a constructor parameter.
const l2DeployCalldata = factory.getDeployTransaction(wallet.address).data!;

// 3. Remove the first 32 bytes.`l2DeployCalldata is a concatenation of `keccak256(bytecode)` and the actual calldata.
// Please note that to save gas the calldata that we send to L1 doesn't have the keccak256(bytecode) part.
// That's why we omit the first 32 bytes.
const calldata = ethers.utils.arrayify(l2DeployCalldata).slice(32);

const ergsLimit = BigNumber.from(1000);

const txCostPrice = await wallet.deployContractBaseCost({
    gasPrice,
    calldataLength: ethers.utils.arrayify(calldata).length,
    bytecodeLength: ethers.utils.arrayify(bytecode).length,
    ergsLimit
});

console.log(`Deploying the contract will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

const deployTx = await wallet.requestL1DeployContract({
    calldata,
    ergsLimit,
    bytecode,
    overrides: {
        gasPrice
    }
});

await deployTx.wait();
```
