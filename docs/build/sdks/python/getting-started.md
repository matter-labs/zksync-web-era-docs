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

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/python). Examples are configured to interact with `zkSync`, and `Sepolia` test networks.

## Creating a wallet

To control your account in zkSync, use the `Wallet` object. It can sign transactions with keys stored in `Wallet` and send transaction to the zkSync network using `zksync_module`.

```python
# Derive Wallet from ethereum private key.
account: LocalAccount = Account.from_key()
wallet = Wallet(zksync, eth_web3, account)
```

## Depositing funds

Let's deposit `1.0 ETH` to our zkSync account.

```python
tx_hash = self.wallet.deposit(
    DepositTransaction(token=Token.create_eth().l1_address, amount=amount)
)
```

**NOTE:** Each token inside zkSync has an address. If `ERC-20` tokens are being bridged, you should supply the token's L1 address in the `deposit` function, or zero address (`0x0000000000000000000000000000000000000000`) if you want to deposit ETH. Note, that for the `ERC-20` tokens the address of their corresponding L2 token will be different from the one on Ethereum.

After the transaction is submitted to the Ethereum node, its status can be tracked using the transaction handle:

```python
# Waiting for receipt on L1
tx_receipt = self.eth_web3.eth.wait_for_transaction_receipt(tx_hash)
```

```python
l2_hash = self.zksync.zksync.get_l2_hash_from_priority_op(
    tx_receipt, self.zksync_contract
)
# Waiting for receipt on L2
self.zksync.zksync.wait_for_transaction_receipt(
    transaction_hash=l2_hash, timeout=360, poll_latency=10
)
```

## Checking zkSync account balance

```python
#Retrieving the current (committed) zkSync ETH balance of an account
balance = self.wallet.get_balance()
```

```python
# Retrieving the ETH balance of an account in the last finalized zkSync block.
balance = self.wallet.get_balance(block_tag=ZkBlockParams.FINALIZED.value)
```

## Performing a transfer

Now, let's create a second wallet and transfer some funds into it. Note that it is possible to send assets to any fresh Ethereum
account, without preliminary registration!

```python
wallet_2 = Wallet(zksync, eth_web3, account_2)
```

Let's transfer `1 ETH` to another account:

The `transfer` method is a helper method that enables transferring `ETH` or any `ERC-20` token within a single interface.

```python
tx_hash = self.wallet.transfer(
    TransferTransaction(
        to=Web3.to_checksum_address("<TO_ADDRESS">),
        token_address=ADDRESS_DEFAULT,
        amount=amount,
```

To track the status of this transaction:

```python
# Wait for tx receipt
tx_receipt = zksync.zksync.wait_for_transaction_receipt(
    tx_hash, timeout=240, poll_latency=0.5
)
```

## Withdrawing funds

There are two ways to withdraw funds from zkSync to Ethereum, calling the operation through L2 or L1. If the
withdrawal operation is called through L1, then the operator has a period of time during which he must process
the transaction, otherwise `PriorityMode` will be turned on. This ensures that the operator cannot stage the
transaction. But in most cases, a call via L2 is sufficient.

```python
withdraw_tx_hash = wallet.withdraw(
  WithdrawTransaction(
    token = Token.create_eth().l1_address,
    amount = Web3.to_wei(amount, "ether")))
```

Assets will be withdrawn to the target wallet(if do not define the `to` address in the `withdraw` method's argument - the sender address will be chosen as a destination) after the validity proof of the zkSync block with this transaction is generated and verified by the mainnet contract.

It is possible to wait until the validity proof verification is complete:

```python
tx_receipt = zksync.zksync.wait_for_transaction_receipt(
  withdraw_tx_hash, (timeout = 240), (poll_latency = 0.5))
```

## Adding tokens to the standard bridge

Adding tokens to the zkSync standard bridge can be done in a permissionless way. After adding a token to zkSync, it can be used in all types of transactions.
The documentation on adding tokens to zkSync can be found [here](./accounts-l1-l2.md#adding-native-token-to-zksync).
