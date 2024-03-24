---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Getting Started | zkSync Docs
---

# Getting Started

## Concept

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional fields to those that Ethereum transactions have by default.

To provide easy access to all the features of zkSync Era, the `zksync2` Python SDK was created, which is made in a way that has an interface very similar to those of
[web3.py](https://web3py.readthedocs.io/en/latest/index.html). In fact, `web3.py` is a peer dependency of our library and most of the objects exported by `zksync2` inherit from the corresponding `web3.py` objects and override only the fields that need to be changed.

## Prerequisites

- Python: >=3.8 ([installation guide](https://www.python.org/downloads/))
- Pip: 23.1.2 ([installation guide](https://pip.pypa.io/en/stable/installation/))

## Adding dependencies

To install zkSync Era, run the command below in your terminal.

```console
pip install zksync2
```

## Connecting to zkSync Era

Once you have all the necessary dependencies, connect to zkSync Era using the endpoint of the operator node.

```python
from zksync2.module.module_builder import ZkSyncBuilder
...
sdk = ZkSyncBuilder.build("https://sepolia.era.zksync.dev")
```

Get chain id:

```python
chain_id = zk_web3.zksync.chain_id
```

Get block number:

```python
block_number = zk_web3.zksync.block_number
```

Get the transaction by hash:

```ts
transaction = zksync_web3.zksync.eth_get_transaction_by_hash(hash);
```

Also, the following examples demonstrate how to:

1. [Deposit ETH and tokens from Ethereum into zkSync Era](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/01_deposit.ts)
2. [Transfer ETH and tokens on zkSync Era](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/02_transfer.ts)
3. [Withdraw ETH and tokens from zkSync Era to Ethereum](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/04_withdraw.ts)
4. [Use paymaster to pay fee with token](https://github.com/zksync-sdk/zksync2-examples/blob/main/js/src/22_use_paymaster.ts)

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/js/src).
Examples are configured to interact with `zkSync Era` and `Sepolia` test networks.
