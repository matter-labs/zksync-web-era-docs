# Migration to the testnet paymaster

## Prerequisite
Before going further into this section, please ensure you have read about
[paymasters](../developer-guides/aa.md#paymasters).

While the previous iterations of zkSync 2.0 testnet natively supported paying fees in different tokens, it caused several compatibility issues with the Ethereum ecosystem. With the advent of the [paymasters](../developer-guides/aa.md#paymasters), this feature has become redundant as now anybody can deploy their paymaster smart contract that will swap ERC-20 tokens to ETH on the fly. You can read the tutorial on deploying custom paymasters [here](../tutorials/custom-paymaster-tutorial.md).

For the sake of supporting the ecosystem, zkSync does not plan to deploy any paymaster on mainnet. However, with better DevEx in mind, we have deployed one on the testnet. The testnet paymaster enables paying fees in an ERC-20 compatible token at a 1:1 exchange rate. You can read the documentation [here](../developer-guides/aa.md#testnet-paymaster). In this section, we show a brief example on migration from the old way of paying fees with ERC20 tokens to the new ones.

This document is about the testnet paymaster *only*. When deploying your project on mainnet, you will need to either deploy your paymaster or find a 3rd party's one and read its documentation.

## Previous interface

In the previous testnet versions, you provided `feeToken` in the overrides of the transaction, so a smart contract call that paid fees in USDC, for example, looked roughly like this:

```js
const tx = await contract.callMethod({
    customData: {
        feeToken: USDC_ADDRESS
    }
}) 
```

## Using testnet paymaster

Working with the testnet paymaster consists of three steps:

1. Retrieving the address of the testnet paymaster.

```js
const testnetPaymaster = await provider.getTestnetPaymasterAddress();
```

Note: Caching the paymaster's address is not recommended, since it may change without a warning.

2. Encoding the paymaster parameters to be used in the transaction. For this you can the `utils.getPaymasterParams` method:

```js
import { utils } from 'zksync-web3'

const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
    type: 'ApprovalBased',
    token: USDC_ADDRESS,
    // Note, that the allowance for the testnet paymaster must be
    // at least maxFeePerErg * gasLimit, where maxFeePerErg and gasLimit
    // are parameters used in the transaction.
    minimalAllowance: maxFeePerErg.mul(gasLimit),
    innerInput: new Uint8Array()
});
```

3. Sending the transaction with the provided paymaster params:

```js
const tx = await contract.callMethod({
    customData: {
        paymasterParams
    }
});
```
