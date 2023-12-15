---
head:
  - - meta
    - name: "twitter:title"
      content: Block and Transaction | zkSync Era Docs
---

# Block and Transaction

### Block Methods

TODO add description.

### `getBlock` Method

#### Overview

The `getBlock` method retrieves a block from the network. The result contains various block properties including a `transactions` list, which consists of transaction hashes corresponding to the specified block.

#### Method Signature

```typescript
provider.getBlock(block: BlockTag | number): Promise<Block>
```

#### Parameters

| Name    | Type                 | Description                                          |
| ------- | -------------------- | ---------------------------------------------------- |
| `block` | `BlockTag \| number` | The block number or tag to retrieve information for. |

#### Return Value

Returns a `Promise` that resolves to a `Block` object containing details of the specified block.

#### Example Usage

```typescript
const blockData = await provider.getBlock("latest");
console.log(blockData);

/*
{
  _difficulty: { BigNumber: "3849295379889" },
  difficulty: 3849295379889,
  extraData: '0x476574682f76312e302e312d39383130306634372f6c696e75782f676f312e34',
  gasLimit: { BigNumber: "3141592" },
  gasUsed: { BigNumber: "21000" },
  hash: '0xf93283571ae16dcecbe1816adc126954a739350cd1523a1559eabeae155fbb63',
  miner: '0x909755D480A27911cB7EeeB5edB918fae50883c0',
  nonce: '0x1a455280001cc3f8',
  number: 100004,
  parentHash: '0x73d88d376f6b4d232d70dc950d9515fad3b5aa241937e362fdbfd74d1c901781',
  timestamp: 1439799168,
  transactions: [
    '0x6f12399cc2cb42bed5b267899b08a847552e8c42a64f5eb128c1bcbd1974fb0c'
  ]
}
*/
```

### `getBlockWithTransactions` Method

#### Overview

The `getBlockWithTransactions` method retrieves a block from the network, but unlike the `getBlock` method, it includes an array of `TransactionResponse` objects within the `transactions` field of the resulting block.

#### Method Signature

```typescript
getBlockWithTransactions(block: BlockTag | number): Promise<BlockWithTransactions>
```

#### Parameters

| Name    | Type                 | Description                                                         |
| ------- | -------------------- | ------------------------------------------------------------------- |
| `block` | `BlockTag \| number` | The block number or tag for which to retrieve detailed information. |

#### Return Value

Returns a `Promise` that resolves to a `BlockWithTransactions` object containing the details of the specified block, including the full transaction details.

#### Example Usage

```typescript
const blockWithTransactions = await provider.getBlockWithTransactions(100004);
console.log(blockWithTransactions);

/*
{
  _difficulty: { BigNumber: "3849295379889" },
  difficulty: 3849295379889,
  ...
  transactions: [
    {
      accessList: null,
      blockHash: '0xf93283571ae16dcecbe1816adc126954a739350cd1523a1559eabeae155fbb63',
      ...
      value: { BigNumber: "5000000000000000000" },
      wait: [Function (anonymous)]
    }
  ]
}
*/
```
