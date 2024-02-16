---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Getting Started | zkSync Docs
---

# Getting Started

::: info
Take a look at [migration guide](migration.md) if you are migrating from `zksync-web3`.
:::

This is a short introduction to `zksync-ethers` SDK, but covers many of the most common operations that developers require and provides a
starting point for those newer to zkSync Era.

## Getting zksync-ethers

### Prerequisites

- Node: >=v18 ([installation guide](https://nodejs.org/en/download/package-manager))

In order to install SDK for zkSync Era, run the command below in your terminal.

```bash
yarn add zksync-ethers
yarn add ethers@6 # ethers is a peer dependency of zksync-ethers
```

## Overview

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional
fields to those that Ethereum transactions have by default.

To begin, it is useful to have a basic understanding of the types of objects available and what they are responsible for, at a high level:

- `Provider` provides connection to the zkSync Era blockchain, which allows querying the blockchain state, such as account, block or transaction details,
  querying event logs or evaluating read-only code using call. Additionally, the client facilitates writing to the blockchain by sending
  transactions.
- `Wallet` wraps all operations that interact with an account. An account generally has a private key, which can be used to sign a variety of
  types of payloads. It provides easy usage of the most common features.

## Examples

The following examples could be easily run by writing the code snippets in a file and executing them as follows:

```shell
npx ts-node src/zksync.ts
```

Connect to the zkSync Era network:

```ts
import { Provider, utils, types } from "zksync-ethers";
import { ethers } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const ethProvider = ethers.getDefaultProvider("sepolia");
```

Get the network (helper function [toJSON](./providers.md#tojson)):

```ts
console.log(`Network: ${toJSON(await provider.getNetwork())}`);
```

Get the latest block number:

```ts
console.log(`Block number: ${await provider.getBlockNumber()}`);
```

Get the block by hash (helper function [toJSON](./providers.md#tojson)):

```ts
console.log(`Block: ${toJSON(await provider.getBlock("b472c070c9e121ba42702f6c322b7b266e287a4d8b5fa426ed265b105430c397", true))}`);
```

Get the transaction by hash (helper function [toJSON](./providers.md#tojson)):

```ts
console.log(`Block: ${toJSON(await provider.getTransaction("0x9af27afed9a4dd018c0625ea1368afb8ba08e4cfb69b3e76dfb8521c8a87ecfc"))}`);
```

Also, the following examples demonstrate how to:

1. [Deposit ETH and tokens from Ethereum into zkSync Era](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/01_deposit.ts)
2. [Transfer ETH and tokens on zkSync Era](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/02_transfer.ts)
3. [Withdraw ETH and tokens from zkSync Era to Ethereum](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/04_withdraw.ts)
4. [Use paymaster to pay fee with token](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/22_use_paymaster.ts)

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/js/src).
Examples are configured to interact with `zkSync Era` and `Sepolia` test networks.
