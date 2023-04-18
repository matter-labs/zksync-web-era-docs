# Paymaster utilities

The [paymaster utilities library](https://github.com/matter-labs/zksync-era/blob/f5a36684b8c2088d36308bad86643bc7ab3d6a78/sdk/zksync-web3.js/src/paymaster-utils.ts) contains essential utilities for using paymasters on zkSync Era.

## Contract interfaces

### `PaymasterFlow`

Constant abi definition for the [Paymaster Flow Interface](https://github.com/matter-labs/era-contracts/blob/36fe0fd11aeb2cfe88139e7e09d59a25366668d6/zksync/contracts/interfaces/IPaymasterFlow.sol).

```typescript
export const IPaymasterFlow = new ethers.utils.Interface(require('../../abi/IPaymasterFlow.json').abi);
```

## Functions

### `getApprovalBasedPaymasterInput`


### `getGeneralPaymasterInput`

### `getPaymasterParams`

Returns the correctly formed `paymasterParams` object for common [paymaster flows](../../dev/developer-guides/aa.md#built-in-paymaster-flows).

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams
```

The definition of the `PaymasterInput` can be found [here](./types.md).