# Utilities

`zksync-web3` provides some useful utilities for zkSync builders. They can be imported the following way:

```typescript
import { utils } from "zksync-web3";
```

Most of the utilities are used internally by the zkSync team. So this document will describe only those which should be helpful for you.

## The "address" of Ether

While formally on zkSync, ether is a token with address `0x000000000000000000000000000000000000800a`, we use zero as a more user-friendly alias:

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
