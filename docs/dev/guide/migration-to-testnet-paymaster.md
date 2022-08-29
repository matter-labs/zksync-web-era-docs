# Migration to the testnet paymaster

While the previous iterations of zkSync 2.0 natively supported paying fees in different tokens, it caused several issues with compatibility with the Ethereum ecosystem. With the advent of the [paymasters](../zksync-v2/aa.md#paymasters), this feature has become redundant as now anybody can deploy their paymaster smart contract that will swap ERC-20 tokens to ETH on the fly. You can read the tutorial on deploying custom paymasters [here](./custom-paymaster-tutorial.md).

For the sake of supporting the ecosystem, zkSync does not plan to deploy any paymaster on the mainnet. However, with better DevEx in mind, we have deployed one on the testnet. The testnet paymaster allows paying fees in any ERC-20 compatible token at the 1:1 exchange rate. You can read its documentation [here](../zksync-v2/aa.md#testnet-paymaster). In this section, we will show a brief example on migration from the old way of paying fees with ERC20 tokens to the new ones.

This document is about the testnet paymaster *only*. When deploying your project on the mainnet, you will need to either deploy your paymaster or find a 3rd party's one and read its documentation.

## Previous interface

Before you provided `feeToken` in the overrides of the transaction, so a smart contract call that paid fees in USDC looked roughly before:

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

Caching the paymaster's address is not recommended, since it may change without a warning.

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
