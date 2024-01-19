---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK L1/L2 Transactions | zkSync Docs
---

# Accounts: L1->L2 Transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1->L2 interaction works on zkSync Era, go through the [introduction](../../developer-reference/l1-l2-interop.md).

The zkSync Python SDK account is compatible with the `eth_account` package, and in most cases users can have their private key and get account instances by using it.

> Example

```python

from eth_account import Account
from eth_account.signers.local import LocalAccount
...
account: LocalAccount = Account.from_key("PRIVATE_KEY")

```

The base property that is used directly with account is: `Account.address`.

## Approving deposit of tokens

Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract.

```python
def approve_erc20(self,
    token: HexStr,
    amount: int,
    bridge_address: HexStr = None,
    gas_limit: int = None) -> TxReceipt:
```

### Inputs and outputs

| Name           | Description                                    |
| -------------- | ---------------------------------------------- |
| token          | The Ethereum address of the token.             |
| amount         | The amount of the token to be approved.        |
| bridge_address | Custom address of l1 bridge (optional).        |
| gas_limit      | Gas limit (optional).                          |
| returns        | `ethers.providers.TransactionResponse` object. |

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

amount_usdc = 5
is_approved = wallet.approve_erc20("USDC_ADDRESS", amount_usdc)

await txHandle.wait();
```

## Depositing tokens to zkSync

```python
def deposit(self, transaction: DepositTransaction):
```

#### Inputs and outputs

| Name        | Description                                           |
| ----------- | ----------------------------------------------------- |
| transaction | [`Deposittransaction`](./types.md#deposittransaction) |
| returns     | `Hash` of the transaction.                            |

> Example

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
wallet = Wallet(zksync, eth_web3, account)

USDC_ADDRESS = "<USDC_ADDRESS>";
l1_hash_usdc = wallet.deposit(DepositTransaction(Web3.to_checksum_address(USDC_ADDRESS),
                                            amount_usdc,
                                            account.address,
                                            approve_erc20=True))

l1_tx_receipt_usdc = self.eth_web3.eth.wait_for_transaction_receipt(l1_hash_usdc)

l1_hash_eth = self.wallet.deposit(DepositTransaction(token=Token.create_eth().l1_address,
                                        amount=amount,
                                        to=self.wallet.address))

l1_tx_receipt_usdc = self.eth_web3.eth.wait_for_transaction_receipt(l1_hash_eth)

await ethDepositHandle.wait();
```

## Adding native token to zkSync

New tokens are added automatically the first time they are deposited.

## Finalizing withdrawals

Withdrawals are executed in 2 steps - initiated on L2 and finalized on L1.

```python
def finalize_withdrawal(self, withdraw_hash, index: int = 0):
```

#### Inputs and outputs

| Name           | Description                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| withdrawalHash | Hash of the L2 transaction where the withdrawal was initiated.                                                                            |
| index          | In case there were multiple withdrawals in one transaction, you may pass an index of the withdrawal you want to finalize (defaults to 0). |

## Force-executing transactions on L2

### Getting the base cost for L2 transaction

```python
def get_base_cost(self,
                    l2_gas_limit: int,
                    gas_per_pubdata_byte: int = DEPOSIT_GAS_PER_PUBDATA_LIMIT,
                    gas_price: int = None):
```

#### Inputs and outputs

| Name                 | Description                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| l2_gas_limit         | The `gasLimit` for the L2 contract call.                                              |
| gas_per_pubdata_byte | The L2 gas price for each published L1 calldata byte.                                 |
| gas_price            | The L1 gas price of the L1 transaction that will send the request for an execute call |
| returns              | The base cost in ETH for requesting the L2 contract call.                             |

## Claim Failed Deposit

The `claimFailedDeposit` method withdraws funds from the initiated deposit, which failed when finalizing on L2.  
If the deposit L2 transaction has failed, it sends an L1 transaction calling `claimFailedDeposit` method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws the error.

```python
def claim_failed_deposit(self, deposit_hash: HexStr):
```

### Input Parameters

| Parameter   | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| depositHash | `HexStr` | The L2 transaction hash of the failed deposit. |

### Requesting transaction execution

```python
def request_execute(self, transaction: RequestExecuteCallMsg):
    transaction = self.get_request_execute_transaction(transaction)
    tx = self.contract.functions.requestL2Transaction(transaction.contract_address,
                                                          transaction.call_data,
                                                          transaction.l2_value,
                                                          transaction.l2_gas_limit,
                                                          transaction.gas_per_pubdata_byte,
                                                          transaction.factory_deps,
                                                          transaction.refund_recipient).build_transaction(prepare_transaction_options(transaction.options, transaction.from_))
    signed_tx = self._l1_account.sign_transaction(tx)
    return self._eth_web3.eth.send_raw_transaction(signed_tx.rawTransaction)
```

#### Inputs and outputs

| Name        | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| transaction | [`RequestExecuteCallMsg`](./types.md#requestexecutecallmsg) object |
| returns     | `Hash`.                                                            |

> Example

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
wallet = Wallet(zksync, eth_web3, account)

amount = 7_000_000_000
l2_balance_before = self.wallet.get_balance()

l1_tx_receipt = self.wallet.request_execute(RequestExecuteCallMsg(contract_address=Web3.to_checksum_address(self.zksync.zksync.main_contract_address),call_data=HexStr("0x"),l2_value=amount,l2_gas_limit=900_000))

l2_hash = self.zksync.zksync.get_l2_hash_from_priority_op(l1_tx_receipt, self.zksync_contract)
self.zksync.zksync.wait_for_transaction_receipt(l2_hash)
l2_balance_after = self.wallet.get_balance()
```
