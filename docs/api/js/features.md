# zkSync features

While zkSync is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Transaction fees can be paid in ERC-20 tokens.
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

This requires us to extend the standard Ethereum transactoins with new custom fields. We call such extended transactions "EIP-712" transactions, since we use EIP-712 to sign them. You can look at the internal structure of the EIP-712 transactions [here](.,/api#eip712).

This document will focus solely on how to pass these arguments to the SDK.

## Overrides

`ethers` has a notion of overrides. For any on-chain transaction, the `ethers` finds the optimal `gasPrice`, `gasLimit`, `nonce` and other important fields under the hood. But sometimes, you may have a need to explicitly provide these values (you want set a smaller `gasPrice` for instance or sign a transaction with future `nonce`)

In this case you can provide an `Overrides` object as the last parameter. There you can supply fields like `gasPrice`, `gasLimit`, `nonce` etc.

In order to make the SDK as ergonomic as possible, we decided to use the overrides to supply zkSync-specific fields. To supply zkSync-specific fields, you need to pass the following override:

```typescript
{
    customData: {
        feeToken?: Address;
        ergsPerStorage?: BigNumberish;
        ergsPerPubdata?: BigNumberish;
        withdrawToken?: Address;
        validFrom?: number;
        validUntil?: number;
        factoryDeps?: BytesLike[];
    }
}
```

Examples:

Override to pay fees in token with address `0xeb8f08a975ab53e34d8a0330e0d34de942c95926`:

```typescript
{
  customData: {
    feeToken: "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
  }
}
```

Override to withdraw ETH and pay fees in token with address `0xeb8f08a975ab53e34d8a0330e0d34de942c95926`:

```typescript
{
    customData: {
        feeToken: "0xeb8f08a975ab53e34d8a0330e0d34de942c95926",
        withdrawToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
}
```

Override to deploy a contract with bytecode `0xcde...12` and enforce that the operator will not charge more than `100` ergs per published bytes on Layer 1:

```typescript
{
    // feeToken is not supplied, using ETH by default
    customData: {
        ergsPerPubdata: "100",
        factoryDeps: ["0xcde...12"],
    }
}
```

## See in action

If you want to call a method `setGreeting` of an ethers `Contract` object called `greeter`, this would look the following way:

```javascript
// The `setGreeting` method has a single parameter -- new greeting
// We will set its value as `some new greeting`.
const txHandle = greeter.setGreeting("some new greeting", {
  customData: {
    // Paying fee in USDC
    feeToken: "0xeb8f08a975ab53e34d8a0330e0d34de942c95926",
  },
});
```

You can also check out our [tutorial](../../dev/tutorials/basic) on the full-fledged mini-dApp, where users can choose token to pay fee.
