# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1->L2 interaction works on zkSync Era, go through the [introduction](../../reference/concepts/l1-l2-interop.md).

The zkSync Python SDK account is compatible with the `eth_account` package, and in most cases users can have their private key and get account instances by using it.

> Example

```python

from eth_account import Account
from eth_account.signers.local import LocalAccount
...
account: LocalAccount = Account.from_key("PRIVATE_KEY")

```

The base property that is used directly with account is: `Account.address`.

## Depositing tokens to zkSync Era

Returns the transaction receipt of the deposit.

```py

def deposit(self, l2_receiver: HexStr, l1_token: HexStr, amount: int) -> txn_receipt

```

### Arguments

| Name        | Description                                               |
| ----------- | --------------------------------------------------------- |
| l2_receiver | The address that will receive the deposited tokens on L2. |
| l1_token    | The address of the deposited L1 ERC20 token.              |
| amount      | The amount of the token to be deposited.                  |

> Example

```py

def deposit(self, l2_receiver: HexStr, l1_token: HexStr, amount: int):
        tx = self.contract.functions.deposit(l2_receiver,
                                             l1_token,
                                             amount).build_transaction(
            {
                "chainId": self.web3.eth.chain_id,
                "from": self.account.address,
                "nonce": self._get_nonce(),
                "gas": self.gas_provider.gas_limit(),
                "gasPrice": self.gas_provider.gas_price(),
                "value": amount
            })
        signed_tx = self.account.sign_transaction(tx)
        txn_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        txn_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
        return txn_receipt

```

## Claim failed deposit

The `claimFailedDeposit` method withdraws funds from the initiated deposit, which failed when finalizing on L2.  
If the deposit L2 transaction has failed, it sends an L1 transaction calling `claimFailedDeposit` method of the L1 bridge, which results in returning L1 tokens back to the depositor, otherwise throws the error.

```py

 def claim_failed_deposit(self, deposit_sender: HexStr,
                             l1_token: HexStr,
                             l2tx_hash,
                             l2_block_number: int,
                             l2_msg_index: int,
                             merkle_proof: List[bytes]) -> TxReceipt

```

### Arguments

| Name            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| deposit_sender  | The address of the deposit initiator.                                                |
| l2tx_hash       | The L2 transaction hash of the failed deposit finalization.                          |
| l1_token        | The address of the deposited L1 ERC20 token.                                         |
| l2_block_number | The L2 block number where the deposit finalization was processed.                    |
| l2_msg_index    | The position in the L2 logs Merkle tree of the l2Log that was sent with the message. |
| merkle_proof    | The Merkle proof of the processing L1 -> L2 transaction with deposit finalization    |

## Finalizing withdrawals

Withdrawals are executed in 2 steps - initiated on L2 and finalized on L1, this method returns the transaction receipt of the withdrawals.

```py

def finalize_withdrawal(self,
                            l2_block_number: int,
                            l2_msg_index: int,
                            msg: bytes,
                            merkle_proof: List[bytes]) -> txn_receipt

```

### Arguments

| Name            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| l2_block_number | The L2 block number where the deposit finalization was processed.                    |
| l2_msg_index    | The position in the L2 logs Merkle tree of the l2Log that was sent with the message. |
| l2_msg_index    | The position in the L2 logs Merkle tree of the l2Log that was sent with the message. |
| merkle_proof    | The Merkle proof of the processing L1 -> L2 transaction with deposit finalization    |

> Example

```py

def finalize_withdrawal(self,
                        l2_block_number: int,
                        l2_msg_index: int,
                        msg: bytes,
                        merkle_proof: List[bytes]):
    tx = self.contract.functions.finalizeWithdrawal(l2_block_number,
                                                    l2_msg_index,
                                                    msg,
                                                    merkle_proof).build_transaction(
        {
            "chainId": self.web3.eth.chain_id,
            "from": self.account.address,
            "nonce": self._get_nonce(),
            "gas": self.gas_provider.gas_limit(),
            "gasPrice": self.gas_provider.gas_price()
        })
    signed_tx = self.account.sign_transaction(tx)
    txn_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    txn_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
    return txn_receipt

```
