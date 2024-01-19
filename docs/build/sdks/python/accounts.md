---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Accounts | zkSync Docs
---

# Accounts

## Overview

The zkSync Python SDK has a method that generates a signature and a method that verifies messages.

- `Wallet`
- `sign_typed_data` : used to sign EIP712-typed zkSync transactions.
- `verify_typed_data` : used to verify the signed EIP712-typed zkSync transactions.

### construction

For constructing the instance it needs only `account` and `chain_id`.

> Example:

```python
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from eth_account import Account
from zksync2.module.module_builder import ZkSyncBuilder


account = Account.from_key("PRIVATE_KEY")
zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")

chain_id = zksync_web3.zksync.chain_id
signer = PrivateKeyEthSigner(account, chain_id)

```

## sign_typed_data

The signer is used to generate the signature of the provided transaction based on your account(your private key).

### Parameters

| Parameters                        | Return value          | Description                                                                 |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------- |
| EIP712 Structure, optional domain | Web3 py SignedMessage | Builds `SignedMessage` based on the encoded in `EIP712` format Transaction. |

## verify_typed_data

It's used to verify the provided transaction, whose signature is added to the final `EIP712` transaction for its validation.

### Parameters

| Parameters                                   | Return value | Description                                                                    |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| signature, EIP712 structure, optional domain | bool         | Returns **True** if the encoded transaction is signed with provided signature. |

The signer class also has the following properties:

| Attribute | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| address   | Account address                                                                 |
| domain    | Domain that is used to generate signature. It depends on `chain_id` of network. |

## `Wallet`

### Creating wallet from a private key

The `Wallet` object can be created from 'BaseAccount'.

```python
def __init__(self,
                 zksync_web3: Web3,
                 eth_web3: Web3,
                 l1_account: BaseAccount):
```

#### Inputs and outputs

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| zksync_web3 | A zkSync node provider. Needed for interaction with zkSync. |
| eth_web3    | An Ethereum node provider. Needed for interaction with L1.  |
| l1_account  | Base account used to associate with wallet.                 |
| returns     | The new `Wallet` object.                                    |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"
  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))
  account: LocalAccount = Account.from_key(private_key)
  wallet = Wallet(zk_web3, eth_web3, account)
```

### Getting the zkSync L1 smart contract

```python
def main_contract(self):
```

#### Inputs and outputs

| Name    | Description                              |
| ------- | ---------------------------------------- |
| returns | `Contract` of the zkSync smart contract. |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key(private_key)
  wallet = Wallet(zk_web3, eth_web3, account)

  contract = wallet.main_contract
  print(contract.address);
```

### Getting token balance

```python
def get_balance(self, block_tag = ZkBlockParams.COMMITTED.value, token_address: HexStr = None) -> int:
```

#### Inputs and outputs

| Name          | Description                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| block_tag     | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| token_address | The address of the token. ETH by default.                                                                     |
| returns       | The amount of the token the `Wallet` has.                                                                     |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key(private_key)
  wallet = Wallet(zk_web3, eth_web3, account)


  balance = self.wallet.get_balance()
  print(balance);
```

### Getting token balance on L1

```python
def get_l1_balance(self, token: HexStr = ADDRESS_DEFAULT, block: EthBlockParams = EthBlockParams.LATEST) -> int:
```

#### Inputs and outputs

| Name    | Description                                                                                 |
| ------- | ------------------------------------------------------------------------------------------- |
| token   | The address of the token. ETH by default.                                                   |
| block   | The block the balance should be checked on. The latest processed one is the default option. |
| returns | The amount of the token the `Wallet` has on Ethereum.                                       |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key(private_key)
  wallet = Wallet(zk_web3, eth_web3, account)


  balance = self.wallet.get_l1_balance()
  print(balance);
```

### Transferring tokens inside zkSync Era

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

```python
def transfer(self, tx: TransferTransaction) -> HexStr:
```

#### Inputs and outputs

| Name    | Description                                              |
| ------- | -------------------------------------------------------- |
| tx      | [`TransferTransaction`](./types.md#transfertransaction). |
| returns | A `HexStr` of transaction.                               |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key("PRIVATE_KEY")
  wallet = Wallet(zk_web3, eth_web3, account)

  amount = 7_000_000_000
  tx_hash = self.wallet.transfer(TransferTransaction(to=Web3.to_checksum_address("TO_ADDRESS"),
  token_address=ADDRESS_DEFAULT,
  amount=amount))

  tx_receipt = self.zk_web3.zksync.wait_for_transaction_receipt(
    tx_hash, timeout=240, poll_latency=0.5
  )
```

### Initiating a withdrawal to L1

```python
def withdraw(self, tx: WithdrawTransaction):
```

| Name    | Description                                             |
| ------- | ------------------------------------------------------- |
| tx      | [`WithdrawTransaction`](./types.md#withdrawtransaction) |
| returns | A `Hash` of the transaction                             |

### Transferring tokens inside zkSync

Please note that for now, unlike Ethereum, zkSync does not support native transfers, i.e. the `value` field of all transactions is equal to `0`. All the token transfers are done through ERC20 `transfer` function calls.

But for convenience, the `Wallet` class has `transfer` method, which can transfer any `ERC20` tokens.

```python
def transfer(self, tx: TransferTransaction) -> HexStr:
```

#### Inputs and outputs

| Name    | Description                                             |
| ------- | ------------------------------------------------------- |
| tx      | ['TransferTransaction'](./types.md#transfertransaction) |
| returns | An `Hash` of the transaction                            |

> Example

```python
from web3 import Web3

from zksync2.core.types import TransferTransaction, ADDRESS_DEFAULT

ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zksync, eth_web3, account)

tx_hash = self.wallet.transfer(TransferTransaction(to=Web3.to_checksum_address("TO_ADDRESS"),token_address=ADDRESS_DEFAULT,amount=amount))

self.zksync.zksync.wait_for_transaction_receipt(
  tx_hash, timeout=240, poll_latency=0.5
)
```

### Getting the zkSync L1 smart contract

```python
def main_contract(self) -> Union[Type[Contract], Contract]:
```

#### Inputs and outputs

| Name    | Description                                     |
| ------- | ----------------------------------------------- |
| returns | `Contract` object of the zkSync smart contract. |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zksync, eth_web3, account)

main_contract = wallet.main_contract
```

### Getting bridge contracts

ERC-20 bridge `Contract` object:

```python
def get_l1_bridge_contracts(self) -> L1BridgeContracts:
```

#### Inputs and outputs

| Name    | Description                                                 |
| ------- | ----------------------------------------------------------- |
| returns | [`L1BridgeContracts`](./types.md#l1bridgecontracts) object. |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zksync, eth_web3, account)

l1_bridge_contracts = wallet.get_l1_bridge_contracts()
```

:::note

there is no separate Ether bridge contract, [Main contract](./accounts.md#getting-the-zksync-l1-smart-contract) is used instead.

:::

### Getting token balance on L1

```python
def get_l1_balance(self, token: HexStr = ADDRESS_DEFAULT, block: EthBlockParams = EthBlockParams.LATEST) -> int:

```

#### Inputs and outputs

| Name    | Description                                                                                 |
| ------- | ------------------------------------------------------------------------------------------- |
| token   | The address of the token. ETH by default.                                                   |
| block   | The block the balance should be checked on. The latest processed one is the default option. |
| returns | The amount of the token the `BaseAccount` has on Ethereum.                                  |

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder

ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zksync, eth_web3, account)

balance = self.wallet.get_l1_balance()
```
