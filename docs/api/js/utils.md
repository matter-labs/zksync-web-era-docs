# Utilities

`zksync-web3` provides some useful utilities for zkSync builders. They can be imported the following way:

```typescript
import { utils } from "zksync-web3";
```

Most of the utilities are used internally by the zkSync team. So this document will describe only those which should be helpful for you.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## The "address" of ether

While *de facto* ether is a token with address

```typescript
export const L2_ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800a";
```
 on zkSync, *de jure* in SDK and API "zero address" is used as a more user-friendly alias:

```typescript
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
```

## ABI of zkSync smart contract

```typescript
export const ZKSYNC_MAIN_ABI = new utils.Interface(require("../abi/IZkSync.json"));
```

## IERC20 interface

Convenient when interacting with native tokens on zkSync.

```typescript
export const IERC20 = new utils.Interface(require("../abi/IERC20.json"));
```

## Encoding paymaster params

Utility method that returns the correctly formed `paymasterParams` object for the common [paymaster flows](../../dev/developer-guides/aa.md#built-in-paymaster-flows).

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams {
    if (paymasterInput.type == 'General') {
        return {
            paymaster: paymasterAddress,
            paymasterInput: getGeneralPaymasterInput(paymasterInput)
        };
    } else {
        return {
            paymaster: paymasterAddress,
            paymasterInput: getApprovalBasedPaymasterInput(paymasterInput)
        };
    }
}
```

The definition of the `PaymasterInput` can be found [here](./types.md).

## Useful gas constants
Currently, there is no method to accurately estimate the required `gasPerPubdataLimit`. That's why for now, it is highly recommended to provide the `DEFAULT_GAS_PER_PUBDATA_LIMIT`. Users are not charged more by providing it.
Later on it will be possible to query the current recommended limit.

```typescript
const GAS_PER_PUBDATA_BYTE = 17;

export const DEFAULT_GAS_PER_PUBDATA_LIMIT = 800;

export const RECOMMENDED_GAS_LIMIT = {
    DEPOSIT: 600_000,
    EXECUTE: 620_000,
    ERC20_APPROVE: 50_000
};
```
