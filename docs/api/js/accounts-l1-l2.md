# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1 -> L2 interaction works on zkSync, go through the [L1 to L2 interoperability doc](../../reference/concepts/l1-l2-interop.md).


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
    overrides?: ethers.Overrides & { bridgeAddress?: Address }
): Promise<ethers.providers.TransactionResponse>
```

### Inputs and outputs

| Name                 | Description                                                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token                | The Ethereum address of the token.                                                                                                                                                                               |
| amount               | The amount of the token to be approved.                                                                                                                                                                          |
| overrides? | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc. You can also provide a custom address of the L1 bridge to use (the bridge provided by the `Matter Labs` team is used by default). |
| returns              | `ethers.providers.TransactionResponse` object.                                                                                                                                                                   |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://testnet.era.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "<USDC_ADDRESS>";
const txHandle = await wallet.approveERC20(
  USDC_ADDRESS,
  "10000000" // 10.0 USDC
);

await txHandle.wait();
```

## Depositing tokens to zkSync

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

#### Inputs and outputs

| Name                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.token                       | The address of the token to deposit.                                                                                                                                                                                                                                                                                                                             |
| transaction.amount                      | The amount of the token to be deposited.                                                                                                                                                                                                                                                                                                                         |
| transaction.to?               | The address that will receive the deposited tokens on L2.                                                                                                                                                                                                                                                                                                        |
| transaction.operatorTip?      | (*currently is not used*) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |
| transaction.bridgeAddress?    | The address of the bridge contract to be used. Defaults to the default zkSync bridge (either `L1EthBridge` or `L1Erc20Bridge`).                                                                                                                                                                                                                                  |
| transaction.approveERC20?     | Whether or not should the token approval be performed under the hood. Set this flag to `true` if you bridge an ERC20 token and didn't call the `approveERC20` function beforehand.                                                                                                                                                                               |
| transaction.overrides?        | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                                                                                                                                                                                                 |
| transaction.approveOverrides? | **Ethereum** transaction overrides of the approval transaction. May be used to pass `gasLimit`, `gasPrice`, etc.                                                                                                                                                                                                                                                     |
| returns                                 | `PriorityOpResponse` object.                                                                                                                                                                                                                                                                                                                                     |


> Example

```typescript
import { Wallet, Provider, utils } from "zksync-web3";
import { ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";

const zkSyncProvider = new Provider("https://testnet.era.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const USDC_ADDRESS = "<USDC_ADDRESS>";
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
  token: utils.ETH_ADDRESS,
  amount: "10000000",
});
// Note that we wait not only for the L1 transaction to complete but also for it to be
// processed by zkSync. If we want to wait only for the transaction to be processed on L1,
// we can use `await ethDepositHandle.waitL1Commit()`
await ethDepositHandle.wait();
```

## Adding native token to zkSync

New tokens are added automatically the first time they are deposited.

## Finalizing withdrawals

Withdrawals are executed in 2 steps - initiated on L2 and finalized on L1.

```typescript
async finalizeWithdrawal(withdrawalHash: BytesLike, index: number = 0): Promise<ethers.TransactionResponse>
```

#### Inputs and outputs

| Name             | Description                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| withdrawalHash   | Hash of the L2 transaction where the withdrawal was initiated.                                                                            |
| index? | In case there where multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize (defaults to 0). |

## Force-executing transactions on L2

### Getting the base cost for L2 transaction

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

## Claim Failed Deposit

The `claimFailedDeposit` method withdraws funds from the initiated deposit, which failed when finalizing on L2.  
If the deposit L2 transaction has failed, it sends an L1 transaction calling `claimFailedDeposit` method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws the error.

```ts
async claimFailedDeposit(depositHash: BytesLike): Promise<ethers.ContractTransaction>
```

### Input Parameters

| Parameter   | Type      | Description                                    |
| ----------- | --------- | ---------------------------------------------- |
| depositHash | `bytes32` | The L2 transaction hash of the failed deposit. |

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

#### Inputs and outputs

| Name                                     | Description                                                                                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction.contractAddress              | The L2 contract to be called.                                                                                                                         |
| transaction.calldata                     | The input of the L2 transaction.                                                                                                                 |
| transaction.l2GasLimit                   | Maximum amount of L2 gas that transaction can consume during execution on L2.                                                                    |
| transaction.l2Value?           | `msg.value` of L2 transaction.                                                                                                                   |
| transaction.factoryDeps?       | An array of L2 bytecodes that will be marked as known on L2.                                                                                     |
| transaction.operatorTip?       | (*currently is not used*) If the ETH value passed with the transaction is not explicitly stated in the overrides, this field will be equal to the tip the operator will receive on top of the base cost of the transaction. |                                                                                                                                         
| transaction.gasPerPubdataByte?  | The L2 gas price for each published L1 calldata byte.                                           |
| transaction.refundRecipient?   | The address on L2 that will receive the refund for the transaction. If the transaction fails, it will also be the address to receive `l2Value`. |
| transaction.overrides                    | **Ethereum** transaction overrides. May be used to pass `gasLimit`, `gasPrice`, `value`, etc.                                                       |
| returns                                  | `PriorityOpResponse` object.                                                                                                                    |

> Example

```typescript
import { Wallet, Provider } from "zksync-web3";
import { BigNumber, ethers } from "ethers";

const PRIVATE_KEY = "<WALLET_PRIVATE_KEY>";
const CONTRACT_ADDRESS = "<CONTRACT_ADDRESS>"

const zkSyncProvider = new Provider("https://testnet.era.zksync.dev/");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1.getGasPrice();

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
  contractAddress: CONTRACT_ADDRESS,
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
