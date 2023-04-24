# Paymaster utilities

The [paymaster utilities library](https://github.com/matter-labs/zksync-era/blob/f5a36684b8c2088d36308bad86643bc7ab3d6a78/sdk/zksync-web3.js/src/paymaster-utils.ts) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `IPaymasterFlow`

Constant abi definition for the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/36fe0fd11aeb2cfe88139e7e09d59a25366668d6/zksync/contracts/interfaces/IPaymasterFlow.sol).

```typescript
export const IPaymasterFlow = new ethers.utils.Interface(require('../../abi/IPaymasterFlow.json').abi);
```

## Functions

### `getApprovalBasedPaymasterInput`

Returns encoded input for an approval-based paymaster.

```ts
export function getApprovalBasedPaymasterInput(paymasterInput: ApprovalBasedPaymasterInput): BytesLike {
    return IPaymasterFlow.encodeFunctionData('approvalBased', [
        paymasterInput.token,
        paymasterInput.minimalAllowance,
        paymasterInput.innerInput
    ]);
}
```

### `getGeneralPaymasterInput`

As above but for general-based paymaster.

```ts
export function getGeneralPaymasterInput(paymasterInput: GeneralPaymasterInput): BytesLike {
    return IPaymasterFlow.encodeFunctionData('general', [paymasterInput.innerInput]);
}
```

### `getPaymasterParams`

Returns a correctly-formed `paymasterParams` object for common [paymaster flows](../../dev/developer-guides/aa.md#built-in-paymaster-flows).

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams
```

Find out more about the [`PaymasterInput` type](./types.md).