---
head:
  - - meta
    - name: "twitter:title"
      content: Estimate Gas | zkSync Docs
---

# Estimate Gas

### Estimation Methods

The estimation methods in the zkSync Era JS SDK provide a way to estimate the gas required for various types of transactions. These methods return a Promise that resolves to a BigNumber, representing the estimated gas cost in wei.

At the bottom of this section you can see a working example using Stackblitz for each of the method operations.

### `estimateGas` Method

#### Overview

The `estimateGas` method returns a `Promise` that resolves to a `BigNumber` representing an estimate of the amount of gas required to submit a given transaction to the network.

:::info
Keep in mind that the estimate may not be entirely accurate. Network conditions, such as other transactions being mined, can affect the actual gas required.
:::

#### Method Signature

```typescript
estimateGas(transaction: TransactionRequest): Promise<BigNumber>
```

**Parameters**

| Parameter     | Type                 | Description                                                                  |
| ------------- | -------------------- | ---------------------------------------------------------------------------- |
| `transaction` | `TransactionRequest` | An object containing the details of the transaction you want to estimate for |

**TransactionRequest Object**

| Property | Type        | Description                             | Example                                        |
| -------- | ----------- | --------------------------------------- | ---------------------------------------------- |
| `to`     | `string`    | The recipient's address                 | `"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"` |
| `data`   | `string`    | The transaction data                    | `"0xd0e30db0"`                                 |
| `value`  | `BigNumber` | The value being sent in the transaction | `parseEther("1.0")`                            |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` representing the estimated gas cost.

#### Example Usage

Here's how you can use `estimateGas` to estimate the gas for a deposit transaction:\`

::: code-tabs
@tab JS

```typescript
import { Provider } from "zksync-ethers";
import { utils } from "ethers";

const provider = new Provider("https://testnet.era.zksync.dev");

const estimate = await provider.estimateGas({
  // Wrapped ETH address
  to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

  // `function deposit() payable`
  data: "0xd0e30db0",

  // 1 ether
  value: utils.parseEther("1.0"),
});

console.log(estimate);
```

@tab Go

```go
gas, err := client.EstimateGas(context.Background(), ethereum.CallMsg{
	From: wallet.Address(),
	To:   ReceiptAddress,
	Data: calldata,
})
if err != nil {
  log.Panic(err)
}
```

@tab Python

```python
web3.eth.estimate_gas({'to': '0xd3CdA913deB6f67967B99D67aCDFa1712C293601', 'from':web3.eth.coinbase, 'value': 12345})
21000
```

:::

### `estimateGasL1` Method

#### Overview

The `estimateGasL1` method returns a `Promise` that resolves to a `BigNumber`, providing an estimate of the amount of gas required to submit a transaction from Layer 1 (L1) to Layer 2 (L2).

#### Method Signature

```typescript
provider.estimateGasL1(transaction: <TransactionRequest>): Promise<BigNumber>
```

**Parameters**

| Parameter     | Type                 | Description                                                                           |
| ------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `transaction` | `TransactionRequest` | An object containing the details of the L1 to L2 transaction you want to estimate for |

**TransactionRequest Object**

| Property     | Type        | Description                                | Example                                                                                                                                  |
| ------------ | ----------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `to`         | `string`    | The recipient's address on L2              | `"0xYourL2AddressHere"`                                                                                                                  |
| `data`       | `string`    | The transaction data                       | `"0xYourDataHere"`                                                                                                                       |
| `value`      | `BigNumber` | The value being sent in the transaction    | `parseEther("1.0")`                                                                                                                      |
| `customData` | `any`       | Custom data for the transaction (optional) | `<pre class="language-typescript" data-overflow="wrap"><code class="lang-typescript">customData: { gasPerPubdataByte: 0 } </code></pre>` |
|              |             |                                            |                                                                                                                                          |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` representing the estimated gas cost for the L1 to L2 transaction.

#### Example Usage

Here's how you can use `estimateGasL1` to estimate the gas for a transaction from L1 to L2:

```typescript
import { Provider, utils } from "zksync-ethers";
import { utils } from "ethers";

// Initialize a new Provider instance
const provider = new Provider("https://testnet.era.zksync.dev");

// Define the transaction details
const transaction = {
  to: "0x1111111111111111111111111111111111111111",
  data: "0xffffffff",
  value: utils.parseEther("1.0"),
  customData: { gasPerPubdataByte: 0 },
};

// Estimate the gas
const estimate = await provider.estimateGasL1(transaction);

// Log the estimated gas
console.log(`Estimated gas for L1 to L2 transaction: ${estimate}`);
```

### `estimateGasTransfer` Method

#### Overview

The `estimateGasTransfer` method returns a `Promise` that resolves to a `BigNumber`, providing an estimate of the amount of gas required to execute a token transfer transaction.

#### Method Signature

```typescript
provider.estimateGasTransfer(transaction: {
  to: Address;
  amount: BigNumberish;
  from?: Address;
  token?: Address;
  overrides?: ethers.CallOverrides;
}): Promise<BigNumber>
```

**Parameters**

| Parameter     | Type     | Description                                                                                 |
| ------------- | -------- | ------------------------------------------------------------------------------------------- |
| `transaction` | `Object` | An object containing the details of the token transfer transaction you want to estimate for |

**Transaction Object**

| Property    | Type                              | Description                     | Example                    |
| ----------- | --------------------------------- | ------------------------------- | -------------------------- |
| `to`        | `Address`                         | The recipient's address         | `"0xRecipientAddressHere"` |
| `amount`    | `BigNumberish`                    | The amount of token to transfer | `1000`                     |
| `from`      | `Address` (Optional)              | The sender's address            | `"0xSenderAddressHere"`    |
| `token`     | `Address` (Optional)              | The token's contract address    | `"0xTokenAddressHere"`     |
| `overrides` | `ethers.CallOverrides` (Optional) | Ethers call overrides object    | `{ gasLimit: 21000 }`      |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` representing the estimated gas cost for the token transfer transaction.

#### Example Usage

Here's how you can use `estimateGasTransfer` to estimate the gas for a token transfer transaction:

```typescript
import { Provider } from "zksync-ethers";
import { BigNumber } from "ethers";

// Initialize a new Provider instance
const provider = new Provider("https://testnet.era.zksync.dev");

// Define the transaction details
const transaction = {
  to: "0xRecipientAddressHere",
  amount: BigNumber.from("1000"),
  from: "0xSenderAddressHere",
  token: "0xTokenAddressHere",
  overrides: { gasLimit: 21000 },
};

// Estimate the gas
const estimate = await provider.estimateGasTransfer(transaction);

// Log the estimated gas
console.log(`Estimated gas for token transfer: ${estimate}`);
```

### `estimateGasWithdraw` Method

#### Overview

The `estimateGasWithdraw` method returns a `Promise` that resolves to a `BigNumber`, providing an estimate of the amount of gas required to execute a token withdrawal transaction.

#### Method Signature

```typescript
provider.estimateGasWithdraw(transaction: {
  token: Address;
  amount: BigNumberish;
  from?: Address;
  to?: Address;
  bridgeAddress?: Address;
  overrides?: ethers.CallOverrides;
}): Promise<BigNumber>
```

**Parameters**

| Parameter     | Type     | Description                                                                                   |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| `transaction` | `Object` | An object containing the details of the token withdrawal transaction you want to estimate for |

**Transaction Object**

| Property        | Type                              | Description                     | Example                    |
| --------------- | --------------------------------- | ------------------------------- | -------------------------- |
| `token`         | `Address`                         | The token's contract address    | `"0xTokenAddressHere"`     |
| `amount`        | `BigNumberish`                    | The amount of token to withdraw | `1000`                     |
| `from`          | `Address` (Optional)              | The sender's address            | `"0xSenderAddressHere"`    |
| `to`            | `Address` (Optional)              | The recipient's address         | `"0xRecipientAddressHere"` |
| `bridgeAddress` | `Address` (Optional)              | The bridge contract address     | `"0xBridgeAddressHere"`    |
| `overrides`     | `ethers.CallOverrides` (Optional) | Ethers call overrides object    | `{ gasLimit: 21000 }`      |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` representing the estimated gas cost for the token withdrawal transaction.

#### Example Usage

Here's how you can use `estimateGasWithdraw` to estimate the gas for a token withdrawal transaction:

```typescript
import { Provider } from "zksync-ethers";
import { BigNumber } from "ethers";

// Initialize a new Provider instance
const provider = new Provider("https://testnet.era.zksync.dev");

// Define the transaction details
const transaction = {
  token: "0xTokenAddressHere",
  amount: BigNumber.from("1000"),
  from: "0xSenderAddressHere",
  to: "0xRecipientAddressHere",
  bridgeAddress: "0xBridgeAddressHere",
  overrides: { gasLimit: 21000 },
};

// Estimate the gas
const estimate = await provider.estimateGasWithdraw(transaction);

// Log the estimated gas
console.log(`Estimated gas for token withdrawal: ${estimate}`);
```

### `estimateL1ToL2Execute` Method

#### Overview

The `estimateL1ToL2Execute` method returns a `Promise` that resolves to a `BigNumber`, providing an estimate of the amount of gas required to execute an L1 to L2 operation.

#### Method Signature

```typescript
provider.estimateL1ToL2Execute(transaction: {
  contractAddress: Address;
  calldata: BytesLike;
  caller?: Address;
  l2Value?: BigNumberish;
  factoryDeps?: ethers.BytesLike[];
  gasPerPubdataByte?: BigNumberish;
  overrides?: ethers.PayableOverrides;
}): Promise<BigNumber>
```

**Parameters**

| Parameter     | Type     | Description                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------------- |
| `transaction` | `Object` | An object containing the details of the L1 to L2 operation you want to estimate for |

**Transaction Object**

| Property            | Type                                 | Description                                          | Example                          |
| ------------------- | ------------------------------------ | ---------------------------------------------------- | -------------------------------- |
| `contractAddress`   | `Address`                            | The contract's address                               | `"0xContractAddressHere"`        |
| `calldata`          | `BytesLike`                          | The transaction call data                            | `"0xSomeCallDataHere"`           |
| `caller`            | `Address` (Optional)                 | The caller's address                                 | `"0xCallerAddressHere"`          |
| `l2Value`           | `BigNumberish` (Optional)            | Current L2 gas value                                 | `1000`                           |
| `factoryDeps`       | `ethers.BytesLike[]` (Optional)      | Byte array containing contract bytecode              | `["0xByteCode1", "0xByteCode2"]` |
| `gasPerPubdataByte` | `BigNumberish` (Optional)            | Constant representing current amount of gas per byte | `100`                            |
| `overrides`         | `ethers.PayableOverrides` (Optional) | Ethers payable overrides object                      | `{ gasLimit: 21000 }`            |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` representing the estimated gas cost for the L1 to L2 operation.

#### Example Usage

Here's how you can use `estimateL1ToL2Execute` to estimate the gas for an L1 to L2 operation:

```typescript
typescriptCopy codeimport { Provider } from "zksync-ethers";
import { BigNumber } from "ethers";

// Initialize a new Provider instance
const provider = new Provider("https://testnet.era.zksync.dev");

// Define the transaction details
const transaction = {
  contractAddress: "0xContractAddressHere",
  calldata: "0xSomeCallDataHere",
  caller: "0xCallerAddressHere",
  l2Value: BigNumber.from("1000"),
  factoryDeps: ["0xByteCode1", "0xByteCode2"],
  gasPerPubdataByte: BigNumber.from("100"),
  overrides: { gasLimit: 21000 }
};

// Estimate the gas
const estimate = await provider.estimateL1ToL2Execute(transaction);

// Log the estimated gas
console.log(`Estimated gas for L1 to L2 operation: ${estimate}`);
```

#### Try out gas estimation
