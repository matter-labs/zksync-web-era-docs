# zkSync features

While zkSync is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP712 transactions since [EIP712](https://eips.ethereum.org/EIPS/eip-712) is used to sign them. You can look at the internal structure of the EIP712 transactions [here](../api.md#eip712).

This document will focus solely on how to pass these arguments to the SDK.

## Overrides

`ethers` has a notion of overrides. For any on-chain transaction, `ethers` finds the optimal `gasPrice`, `gasLimit`, `nonce`, and other important fields under the hood. But sometimes, you may have a need to explicitly provide these values (you want to set a smaller `gasPrice` for instance, or sign a transaction with future `nonce`).

In this case, you can provide an `Overrides` object as the last parameter. There you can supply fields like `gasPrice`, `gasLimit`, `nonce` etc.

In order to make the SDK as flexible as possible, the library uses the overrides to supply zkSync-specific fields. To supply zkSync-specific fields, you need to pass the following override:

```typescript
{
    customData: {
        ergsPerPubdata?: BigNumberish;
        factoryDeps?: BytesLike[];
        customSignature?: BytesLike;
        paymasterParams?: {
            paymaster: Address;
            paymasterInput: BytesLike;
        };
    }
}
```

Examples:

Override to deploy a contract with bytecode `0xcde...12` and enforce that the operator will not charge more than `100` ergs per published bytes on layer 1:

```typescript
{
    customData: {
        ergsPerPubdata: "100",
        factoryDeps: ["0xcde...12"],
    }
}
```

Use custom signature `0x123456` for account, while using paymaster with address `0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC` and paymaster input `0x8c5a3445`:

```typescript
{
    customData: {
        customSignature: "0x123456",
        paymasterParams: {
            paymaster: "0x8e1DC7E4Bb15927E76a854a92Bf8053761501fdC",
            paymasterInput: "0x8c5a3445"
        }
    }
}
```

## Encoding paymaster params

While the paymaster feature by itself does not impose any limitations on values of the `paymasterInput`, the Matter Labs team endorses certain types of [paymaster flows](../../dev/developer-guides/aa.md#built-in-paymaster-flows) that are processable by EOAs.

zkSync SDK provides a utility method that can be used to get the correctly formed `paymasterParams` object: [getPaymasterParams](./utils.md#encoding-paymaster-params).

## See in action

If you want to call the method `setGreeting` of an ethers `Contract` object called `greeter`, this would look the following way, while paying fees with the [testnet paymaster](../../dev/developer-guides/aa.md#testnet-paymaster):

```javascript
// The `setGreeting` method has a single parameter -- new greeting
// We will set its value as `a new greeting`.
const greeting = "a new greeting";
const tx = await greeter.populateTransaction.setGreeting(greeting);
const gasPrice = await sender.provider.getGasPrice();
const gasLimit = await greeter.estimateGas.setGreeting(greeting);
const fee = gasPrice.mul(gasLimit);

const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
    type: 'ApprovalBased',
    token,
    minimalAllowance: fee,
    innerInput: new Uint8Array()
});
const sentTx = await sender.sendTransaction({
    ...tx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit,
    customData: {
        ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
        paymasterParams
    }
});
```

You can also check out our [tutorial](../../dev/developer-guides/hello-world.md) on the full-fledged mini-dApp, where users can choose token to pay the fee.
