# Accounts: L1->L2 transactions

This section explores the methods which allow the [account](./accounts.md) classes to send transactions from L1 to L2.

If you want to get some background on how L1->L2 interaction works on zkSync, go through the [introduction](../../dev/developer-guides/bridging/l1-l2-interop.md) and the [guide](../dev/../../dev/developer-guides/bridging/l1-l2.md).

The zkSync Python SDK account is compatible with the `eth_account` package, and in most cases users can have their private key and get account instances by using it.

> Example

```python 

from eth_account import Account
from eth_account.signers.local import LocalAccount
...
account: LocalAccount = Account.from_key("PRIVATE_KEY")

```
The base property that is used directly with account is: `Account.address`.


## Supported classes

The following account classes support sending transactions from L1 to L2:

- `Wallet` (if connected to an L1 provider)
- `L1Signer`

## Finalizing deposit

Deposit are executed in 2 steps - initiated on L2 and finalized on L1, it returns the transaction receipt.

```py

 def finalize_deposit(self, l1_sender: HexStr,l2_receiver: HexStr,l1_token: HexStr,amount: int, data: bytes) -> TxReceipt

```

**Agruements**

| Name               | Description                                                            |
| ------------------ | -----------------------------------------------------------------------|
| l1_sender          | The ERC20 sender address of the token to deposit.                      |
| l2_receiver        | The address that will receive the deposited tokens on L2.              |
| l1_token           | The address of the deposited L1 ERC20 token.                           |
| amount             | The amount of the token to be deposited.                               |
| data               | Returns the transaction receipt of the transaction                     |

> Example 

```py

    def finalize_deposit(self,
                         l1_sender: HexStr,
                         l2_receiver: HexStr,
                         l1_token: HexStr,
                         amount: int,
                         data: bytes) -> TxReceipt:
        tx = self.contract.functions.finalizeDeposit(l1_sender,
                                                     l2_receiver,
                                                     l1_token,
                                                     amount,
                                                     data).build_transaction(
            {
                "from": self.zksync_account.address,
                "nonce": self._get_nonce(),
                "gas": self.gas_provider.gas_limit(),
                "gasPrice": self.gas_provider.gas_price()
            })
        signed_tx = self.zksync_account.sign_transaction(tx)
        txn_hash = self.web3.zksync.send_raw_transaction(signed_tx.rawTransaction)
        txn_receipt = self.web3.zksync.wait_for_transaction_receipt(txn_hash)
        return txn_receipt

```

## Claim Failed Deposit

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

**Agruements**

| Name               | Description                                                            |
| ------------------ | -----------------------------------------------------------------------|
| deposit_sender     | The address of the deposit initiator.                                  |
| l2tx_hash          | The L2 transaction hash of the failed deposit finalization.            |
| l1_token           | The address of the deposited L1 ERC20 token.                           |
| l2_block_number    | The L2 block number where the deposit finalization was processed.      |
| l2_msg_index       | The position in the L2 logs Merkle tree of the l2Log that was sent with the message.      |
| merkle_proof       | The Merkle proof of the processing L1 -> L2 transaction with deposit finalization         |