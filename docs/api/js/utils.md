# Utilities

`zksync-web3` provides some useful utilities for zkSync builders. They can be imported the following way:

```typescript
import { utils } from "zksync-web3";
```

Most of the utilities are used internally by the zkSync team. So this document will describe only those which should be helpful for you.

## The "address" of ether

While formally ether is a token with address `0x000000000000000000000000000000000000800a` on zkSync, we use the "zero address" as a more user-friendly alias:

```typescript
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
```

## ABI of zkSync smart contract

```typescript
export const ZKSYNC_MAIN_ABI = new utils.Interface(require("../abi/ZkSync.json"));
```

## IERC20 interface

Convenient when interacting with native tokens on zkSync.

```typescript
export const IERC20 = new utils.Interface(require("../abi/IERC20.json"));
```

## Encoding paymaster params

Utility method that returns the correctly formed `paymasterParams` object for the common [paymaster flows](../../dev/developer-guides/aa.md#built-in-paymaster-flows).

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams;
```

The definition of the `PaymasterInput` can be found [here](./types.md).

## Default pubdata price limit

Currently, there is no method to accurately estimate the required `ergsPerPubdataLimit`. That's why for now, it is highly recommended to provide the `DEFAULT_ERGS_PER_PUBDATA_LIMIT`. Users are not charged more by providing it.
Later on it will be possible to query the current recommended limit.

```typescript
const GAS_PER_PUBDATA_BYTE = 16;
export const DEFAULT_ERGS_PER_PUBDATA_LIMIT = GAS_PER_PUBDATA_BYTE * 10_000;
```
