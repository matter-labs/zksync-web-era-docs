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

#### Example

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

#### Inputs and outputs

| Name        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| zksync_web3 | A zkSync node provider. Needed for interaction with zkSync. |
| eth_web3    | An Ethereum node provider. Needed for interaction with L1.  |
| l1_account  | Base account used to associate with wallet.                 |
| returns     | The new `Wallet` object.                                    |

#### Example

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

### `mainContract`

#### Inputs and outputs

| Name    | Description                              |
| ------- | ---------------------------------------- |
| returns | `Contract` of the zkSync smart contract. |

#### Example

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

### `get_l1_bridge_contracts`

Returns `Contract` wrapper of the zkSync smart contract.

#### Inputs and outputs

| Name    | Description                                                 |
| ------- | ----------------------------------------------------------- |
| returns | [`L1BridgeContracts`](./types.md#l1bridgecontracts) object. |

#### Example

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
wallet = Wallet(zk_web3, eth_web3, account)

l1_bridge_contracts = wallet.get_l1_bridge_contracts()
```

:::note

there is no separate Ether bridge contract, [Main contract](./accounts.md#mainContract) is used instead.

:::

### `get_l2_bridge_contracts`

Returns L2 bridge contracts.

#### Example

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
wallet = Wallet(zk_web3, eth_web3, account)

l2_bridge_contracts = await wallet.get_l2_bridge_contracts()
```

### `get_balance`

Returns the amount of the token the `Wallet` has.

#### Inputs and outputs

| Name          | Description                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| block_tag     | The block the balance should be checked on. `committed`, i.e. the latest processed one is the default option. |
| token_address | The address of the token. ETH by default.                                                                     |
| returns       | The amount of the token the `Wallet` has.                                                                     |

#### Example

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


  balance = wallet.get_balance()
  print(balance)
```

### `get_l1_balance`

Returns the amount of the token the `Wallet` has on Ethereum.

#### Inputs and outputs

| Name    | Description                                                                                 |
| ------- | ------------------------------------------------------------------------------------------- |
| token   | The address of the token. ETH by default.                                                   |
| block   | The block the balance should be checked on. The latest processed one is the default option. |
| returns | The amount of the token the `Wallet` has on Ethereum.                                       |

#### Example

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


  balance = wallet.get_l1_balance()
  print(balance)
```

### `get_all_balances`

Returns all balances for confirmed tokens given by an account address.

#### Inputs and outputs

| Name    | Description                                     |
| ------- | ----------------------------------------------- |
| returns | `ZksAccountBalances` with all account balances. |

#### Example

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


  balance = wallet.get_l1_balance()
  print(balance)
```

### `get_deployment_nonce`

Returns account's deployment nonce number.

#### Inputs and outputs

| Name    | Description                  |
| ------- | ---------------------------- |
| returns | The deployment nonce number. |

#### Example

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


  nonce = wallet.get_deployment_nonce()
```

### `l2_token_address`

Returns the L2 token address equivalent for a L1 token address as they are not equal. ETH's address is set to zero address.

:::warning
Only works for tokens bridged on default zkSync Era bridges.
:::

#### Inputs

| Parameter | Type      | Description                     |
| --------- | --------- | ------------------------------- |
| `address` | `Address` | The address of the token on L2. |

#### Example

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


  l2_address = wallet.l2_token_address("L1_ADDRESS")
```

### `transfer`

For convenience, the `Wallet` class has `transfer` method, which can transfer `ETH` or any `ERC20` token within the same interface.

#### Inputs and outputs

| Name    | Description                                              |
| ------- | -------------------------------------------------------- |
| tx      | [`TransferTransaction`](./types.md#transfertransaction). |
| returns | A `HexStr` of transaction.                               |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransferTransaction, ADDRESS_DEFAULT

if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key("PRIVATE_KEY")
  wallet = Wallet(zk_web3, eth_web3, account)

  amount = 7_000_000_000
  tx_hash = wallet.transfer(TransferTransaction(to=Web3.to_checksum_address("TO_ADDRESS"),
  token_address=ADDRESS_DEFAULT,
  amount=amount))

  tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
    tx_hash, timeout=240, poll_latency=0.5
  )
```

Transfer ETH using paymaster to facilitate fee payment with an ERC20 token.

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3

from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransferTransaction, ADDRESS_DEFAULT, PaymasterParams
from zksync2.manage_contracts.paymaster_utils import PaymasterFlowEncoder


if __name__ == "__main__":
  ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
  ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

  zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
  eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

  account: LocalAccount = Account.from_key("PRIVATE_KEY")
  wallet = Wallet(zk_web3, eth_web3, account)

  paymaster_address = zk_web3.to_checksum_address("0x13D0D8550769f59aa241a41897D4859c87f7Dd46")
  token_address = zk_web3.to_checksum_address("0x927488F48ffbc32112F1fF721759649A89721F8F")


  paymaster_params = PaymasterParams(
            **{
                "paymaster": paymaster_address,
                "paymaster_input": eth_web3.to_bytes(
                    hexstr=PaymasterFlowEncoder(eth_web3).encode_approval_based(
                        token_address, 1, b""
                    )
                ),
            }
        )

  amount = 7_000_000_000
  tx_hash = wallet.transfer(
              TransferTransaction(
                  to=Web3.to_checksum_address("TO_ADDRESS"),
                  amount=amount,
                  paymaster_params=paymaster_params,
              )
          )

  tx_receipt = zk_web3.zksync.wait_for_transaction_receipt(
    tx_hash, timeout=240, poll_latency=0.5
  )
```

### `getAllowanceL1`

Returns the amount of approved tokens for a specific L1 bridge.

#### Inputs

| Parameter        | Type      | Description                                                                                                                               |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `token`          | `Address` | The Ethereum address of the token.                                                                                                        |
| `bridge_address` | `Address` | The address of the bridge contract to be used. Defaults to the default zkSync bridge, either `L1EthBridge` or `L1Erc20Bridge` (optional). |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexStr
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
  l1_address = HexStr("0x5C221E77624690fff6dd741493D735a17716c26B")

  result = wallet.get_allowance_l1(HexStr(l1_address))
```

### `approve_erc20`

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

#### Inputs

| Parameter        | Type      | Description                                                                                                                               |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `token`          | `Address` | The Ethereum address of the token.                                                                                                        |
| `amount`         | `int`     | The amount of the token to be approved.                                                                                                   |
| `bridge_address` | `Address` | The address of the bridge contract to be used. Defaults to the default zkSync bridge, either `L1EthBridge` or `L1Erc20Bridge` (optional). |
| `gas_limit`      | `int`     |                                                                                                                                           |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from eth_typing import HexStr
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
  l1_address = HexStr("0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be")

  result = wallet.approve_erc20(HexStr(l1_address), 10000000)
```

### `getBaseCost`

Returns base cost for L2 transaction.

#### Inputs

| Name                   | Type  | Description                                                                                       |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| `l2_gas_limit`         | `int` | The `l2_gas_limit` for the L2 contract call.                                                      |
| `gas_per_pubdata_byte` | `int` | The L2 gas price for each published L1 calldata byte (optional).                                  |
| `gas_price`            | `int` | The L1 gas price of the L1 transaction that will send the request for an execute call (optional). |

#### Example

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

  result = wallet.get_base_cost(l2_gas_limit=100_000)
```

### `deposit`

Transfers the specified token from the associated account on the L1 network to the target account on the L2 network. The token can be either
ETH or any ERC20 token. For ERC20 tokens, enough approved tokens must be associated with the specified L1 bridge (default one or the one
defined in `transaction.bridge_address`). In this case, `transaction.approve_erc20` can be enabled to perform token approval. If there are
already enough approved tokens for the L1 bridge, token approval will be skipped. To check the amount of approved tokens for a specific bridge,
use the [`get_allowance_l1`](#getallowancel1) method.

#### Inputs

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| transaction | [`Deposittransaction`](./types.md#deposittransaction) |
| returns     | `Hash` of the transaction.                            |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

l1_address = HexStr("0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be")
l1_hash_erc20 = wallet.deposit(DepositTransaction(Web3.to_checksum_address(l1_address),
                                            10000000,
                                            account.address,
                                            approve_erc20=True))

l1_tx_receipt_erc20 = eth_web3.eth.wait_for_transaction_receipt(l1_hash_erc20)

l1_hash_eth = wallet.deposit(DepositTransaction(token=ADDRESS_DEFAULT,
                                        amount=10000000,
                                        to=wallet.address))

l1_tx_receipt_eth = eth_web3.eth.wait_for_transaction_receipt(l1_hash_eth)
```

### `prepare_deposit_tx`

Returns populated deposit transaction.

#### Inputs

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| transaction | [`Deposittransaction`](./types.md#deposittransaction) |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

l1_address = HexStr("0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be")
deposit_erc20 = wallet.prepare_deposit_tx(DepositTransaction(Web3.to_checksum_address(l1_address),
                                            10000000,
                                            account.address,
                                            approve_erc20=True))

deposit_eth = wallet.prepare_deposit_tx(DepositTransaction(token=ADDRESS_DEFAULT,
                                        amount=10000000,
                                        to=wallet.address))
```

### `estimate_gas_deposit`

Estimates the amount of gas required for a deposit transaction on L1 network. Gas of approving ERC20 token is not included in estimation.

#### Inputs

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| transaction | [`Deposittransaction`](./types.md#deposittransaction) |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

l1_address = HexStr("0x56E69Fa1BB0d1402c89E3A4E3417882DeA6B14Be")
estimated_gas_erc20 = wallet.estimate_gas_deposit(DepositTransaction(Web3.to_checksum_address(l1_address),
                                            10000000,
                                            account.address,
                                            approve_erc20=True))

estimated_gas_eth = wallet.estimate_gas_deposit(DepositTransaction(token=ADDRESS_DEFAULT,
                                        amount=10000000,
                                        to=wallet.address))
```

### `getFullRequiredDepositFee`

Retrieves the full needed ETH fee for the deposit. Returns the L1 fee and the L2 fee [`FullDepositFee`](./types.md#fulldepositfee).

#### Inputs

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| transaction | [`Deposittransaction`](./types.md#deposittransaction) |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

full_deposit_fee_eth = wallet.get_full_required_deposit_fee(DepositTransaction(token=ADDRESS_DEFAULT, to=wallet.address))
```

### `claimFailedDeposit`

The `claim_failed_deposit` method withdraws funds from the initiated deposit, which failed when finalizing on L2.  
If the deposit L2 transaction has failed, it sends an L1 transaction calling `claimFailedDeposit` method of the L1 bridge, which results in
returning L1 tokens back to the depositor, otherwise throws the error.

#### Inputs

| Parameter   | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| depositHash | `HexStr` | The L2 transaction hash of the failed deposit. |

#### Example

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
wallet = Wallet(zk_web3, eth_web3, account)

claim_failed_deposit_handle = wallet.get_full_required_deposit_fee(HexStr("<FAILED_DEPOSIT_TX_HASH>"))
```

### `withdraw`

Initiates the withdrawal process which withdraws ETH or any ERC20 token from the associated account on L2 network to the target account on
L1 network.

#### Inputs

| Name        | Description                                             |
| ----------- | ------------------------------------------------------- |
| transaction | [`WithdrawTransaction`](./types.md#withdrawTransaction) |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import WithdrawTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

withdraw_tx_hash = wallet.withdraw(
    WithdrawTransaction(
        token=ADDRESS_DEFAULT, amount=Web3.to_wei(1, "ether")
    )
)

withdraw_receipt = zk_web3.zksync.wait_for_transaction_receipt(
    withdraw_tx_hash, timeout=240, poll_latency=0.5
)
```

Withdraw ETH using paymaster to facilitate fee payment with an ERC20 token.

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import WithdrawTransaction, ADDRESS_DEFAULT


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

paymaster_address = zk_web3.to_checksum_address(HexStr("0x13D0D8550769f59aa241a41897D4859c87f7Dd46"))
token_address = zk_web3.to_checksum_address(HexStr("0x927488F48ffbc32112F1fF721759649A89721F8F"))

paymaster_params = PaymasterParams(
    **{
        "paymaster": paymaster_address,
        "paymaster_input": eth_web3.to_bytes(
            hexstr=PaymasterFlowEncoder(eth_web3).encode_approval_based(
                token_address, 1, b""
            )
        ),
    }
)

withdraw_tx_hash = wallet.withdraw(
    WithdrawTransaction(
        token=ADDRESS_DEFAULT, amount=Web3.to_wei(1, "ether"), paymaster_params=paymaster_params
    )
)

withdraw_receipt = zk_web3.zksync.wait_for_transaction_receipt(
    withdraw_tx_hash, timeout=240, poll_latency=0.5
)
```

### `finalizeWithdrawal`

Proves the inclusion of the L2 -> L1 withdrawal message.

#### Inputs

| Name            | Type     | Description                                                                                                                                         |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withdraw_hash` | `HexStr` | Hash of the L2 transaction where the withdrawal was initiated.                                                                                      |
| `index?`        | `number` | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. Defaults to 0 (optional). |

#### Example

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
wallet = Wallet(zk_web3, eth_web3, account)

withdraw_tx_hash = wallet.finalize_withdrawal("<WITHDRAWAL_TX_HASH>")
```

### `is_withdrawal_finalized`

Returns whether the withdrawal transaction is finalized on the L1 network.

#### Inputs

| Name            | Type     | Description                                                                                                                                         |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withdraw_hash` | `HexStr` | Hash of the L2 transaction where the withdrawal was initiated.                                                                                      |
| `index`         | `number` | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize. Defaults to 0 (optional). |

#### Example

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
wallet = Wallet(zk_web3, eth_web3, account)

withdraw_tx_hash = wallet.is_withdrawal_finalized("<WITHDRAWAL_TX_HASH>")
```

### `requestExecute`

Request execution of L2 transaction from L1. Return hash of the transaction

#### Inputs

| Name        | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| transaction | [`RequestExecuteCallMsg`](./types.md#requestexecutecallmsg) object |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from eth_typing import HexStr
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT, RequestExecuteCallMsg


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

amount = 7_000_000_000

l1_tx_receipt = wallet.request_execute(RequestExecuteCallMsg(contract_address=Web3.to_checksum_address(zk_web3.zksync.main_contract_address),call_data=HexStr("0x"),l2_value=amount,
                                                             l2_gas_limit=900_000))

l2_hash = zk_web3.zksync.get_l2_hash_from_priority_op(l1_tx_receipt, wallet.main_contract)
zk_web3.zksync.wait_for_transaction_receipt(l2_hash)
```

### `get_request_execute_transaction`

Returns populated request execute transaction.

#### Inputs

| Name        | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| transaction | [`RequestExecuteCallMsg`](./types.md#requestexecutecallmsg) object |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from eth_typing import HexStr
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT, RequestExecuteCallMsg


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

amount = 7_000_000_000
l2_balance_before = wallet.get_balance()

request_execute_transaction = wallet.get_request_execute_transaction(RequestExecuteCallMsg(contract_address=Web3.to_checksum_address(zk_web3.zksync.main_contract_address),
                                                                                     call_data=HexStr("0x"),l2_value=amount,l2_gas_limit=900_000))
```

### `estimateGasRequestExecute`

Estimates the amount of gas required for a request execute transaction.

#### Inputs

| Name        | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| transaction | [`RequestExecuteCallMsg`](./types.md#requestexecutecallmsg) object |

#### Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3 import Web3
from eth_typing import HexStr
from zksync2.account.wallet import Wallet
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import TransactionOptions, DepositTransaction, ADDRESS_DEFAULT, RequestExecuteCallMsg


ZKSYNC_PROVIDER = "https://sepolia.era.zksync.dev"
ETH_PROVIDER = "https://rpc.ankr.com/eth_sepolia"

zk_web3 = ZkSyncBuilder.build(ZKSYNC_PROVIDER)
eth_web3 = Web3(Web3.HTTPProvider(ETH_PROVIDER))

account: LocalAccount = Account.from_key("PRIVATE_KEY")
wallet = Wallet(zk_web3, eth_web3, account)

amount = 7_000_000_000
l2_balance_before = wallet.get_balance()

estimated_gas = wallet.estimate_gas_request_execute(RequestExecuteCallMsg(contract_address=Web3.to_checksum_address(zk_web3.zksync.main_contract_address),
                                                                                     call_data=HexStr("0x"),l2_value=amount,l2_gas_limit=900_000))
```
