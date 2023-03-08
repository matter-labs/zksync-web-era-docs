# 账户:L1->L2交易

本节探讨了允许[account](./accounts.md)类从L1向L2发送交易的方法。

如果你想了解一些关于L1->L2交互在zkSync上如何工作的背景，请查阅[introduction](././dev/developer-guides/bridging/l1-l2-interop.md)和[guide](./dev/./dev/developer-guides/bridging/l1-l2.md) 。

zkSync Python SDK账户与`eth_account`包兼容，在大多数情况下，用户可以通过使用它拥有自己的私钥并获得账户实例。

> Example

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
...
account: LocalAccount = Account.from_key("PRIVATE_KEY")
```

直接与帐户一起使用的基本属性是。`Account.address`。

## Finalizing deposit

存款分两步执行--在L2启动，在L1完成，它返回最终的存款收据。

```py
 def finalize_deposit(self, l1_sender: HexStr,l2_receiver: HexStr,l1_token: HexStr,amount: int, data: bytes) -> TxReceipt
```

**应收款项**

| 名称          | 描述                |
| ----------- | ----------------- |
| l1_sender   | 要存入代币的ERC20发送者地址。 |
| l2_receiver | 将在L2上接收存放的代币的地址。  |
| l1_token    | 存入的L1 ERC20代币的地址。 |
| amount      | 将要存入的代币的数量。       |
| data        | 返回该交易的交易收据。       |

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

## 申领失败存款

`claimFailedDeposit`方法从发起的存款中提取资金，该存款在L2上最终确定时失败。 
如果存款的L2交易失败，它将发送一个L1交易，调用L1桥的`claimFailedDeposit`方法，结果是将L1代币返回给存款人，否则就会抛出错误。

```py
 def claim_failed_deposit(self, deposit_sender: HexStr,
                             l1_token: HexStr,
                             l2tx_hash,
                             l2_block_number: int,
                             l2_msg_index: int,
                             merkle_proof: List[bytes]) -> TxReceipt
```

**应收款项**

| 名称              | 描述                             |
| --------------- | ------------------------------ |
| deposit_sender  | 存款发起人的地址。                      |
| l2tx_hash       | 存款失败后的二级交易哈希值。                 |
| l1_token        | 存入的L1 ERC20代币的地址。              |
| l2_block_number | 处理存款最终结果的L2区块编号。               |
| l2_msg_index    | 与消息一起发送的l2Log在二级日志Merkle树中的位置。 |
| merkle_proof    | 处理L1->L2交易的Merkle证明，包括存款的最后处理。 |

## 获取一个nonce

`_get_nonce`方法是[getTransactionCount](https://web3py.readthedocs.io/en/v5/web3.eth.html?highlight=web3.eth.get_transaction_count#web3.eth.Eth.get_transaction_count)的别名，它返回这个账户曾经发送过的交易数。

```py
def _get_nonce(self, account) -> transaction_count
```

**参数**

| Name    | Description |
| ------- | ----------- |
| account | 用户的地址       |

## 存款

返回存款的交易收据。

```py
def deposit(self, l2_receiver: HexStr, l1_token: HexStr, amount: int) -> txn_receipt
```

**应收款项**

| 名称          | 描述               |
| ----------- | ---------------- |
| l2_receiver | 将在L2上接收存放的代币的地址。 |
| l1_token    | 存放L1 ERC20代币的地址  |
| 金额          | 要存入的代币的金额。       |

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

## 提款。

提款分两步执行--在L2启动，在L1完成，此方法返回提款的交易收据。

```py
def finalize_withdrawal(self,
                            l2_block_number: int,
                            l2_msg_index: int,
                            msg: bytes,
                            merkle_proof: List[bytes]) -> txn_receipt
```

**参数**

| 名称              | 描述                             |
| --------------- | ------------------------------ |
| l2_block_number | 处理存款终结的二级区块编号。                 |
| l2_msg_index    | 与信息一起发送的l2Log在二级日志Merkle树中的位置。 |
| l2_msg_index    | 与信息一起发送的l2Log在L2日志Merkle树中的位置。 |
| merkle_proof    | 处理L1->L2交易的Merkle证明，有存款的最终确定。  |

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
