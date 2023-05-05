# Estimate gas


## L1 transaction

Gas estimation on Ethereum: https://docs.alchemy.com/reference/eth-estimategas


## L1 to L2 transaction

1. Import the relevant zkSync Era library or contract containing the required functionality.

2. Get the gas price which returns the current layer 1 gas price.

3. Use a language-dependent function that calls the JSON-RPC method [`zks_estimateGasL1toL2`]() and wraps the transaction data in a `CallRequest` JSON object parameter. The method returns the upper bound of the gas cost estimate and is often referred to as **limit** in our documented examples.

    3.1 Depending on language, apply an alias to the addresses in the request. Is this true for all? Or just of JS?

4. Get the base cost which takes the gas price returned from step 2. and the upper-bound limit gas estimation returned at step 3., and formats the total cost in wei.

5. Send the transaction including both the gas price and base cost in the value.

6. Wait for a transaction response and output the details.

### Transaction parameters

```json

```

### Examples

::: code-tabs
@tab JavaScript
```js

```
@tab Solidity
```solidity
`requestL2Transaction`
```
@tab Python
```sh
// In progress. Check back later.
```
@tab Go
```sh
// In progress. Check back later.
```
:::

### Result

6. The return value is a 256-bit unsigned integer in hexadecimal represting the cost in wei ?? of the transaction.

```json

```


## L2 transaction

Gas estimation on zkSync Era: ??


## L2 to L1 transaction

- Two transactions are required: one on layer 1, another on layer 2 -> only one is given in docs.
- Messages can be of arbitrary length -> really?

1. Import the relevant zkSync Era library or contract containing the required functionality.

2. Get a `Contract` object that represents the [`Messenger`]() contract.

3. Transform the request into a raw bytes object.

4. Use the [`sendToL1`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l2/system-contracts/interfaces/IL1Messenger.sol#L5) function from the `Messenger` contract passing the transaction request as a raw bytes object.

:::warning
- The word **message** is interchangeable with **transaction** in our documentation.
:::

### Request message format prior to conversion

```json

```

### Example

::: code-tabs
@tab Solidity
```solidity

```
@tab JavaScript
```js

```
@tab Python
```sh
// In progress. Check back later.
```
@tab Go
```sh
// In progress. Check back later.
```
:::

### Result

5. The return value is the `keccak256` hash of the message bytes and you can use it to manually confirm the transaction on layer 1.

```json

```


