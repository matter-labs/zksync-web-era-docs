# 提供者

提供者是包裹与zkSync节点的交互的对象。如果你对 "web3 "中提供者的概念感到陌生，你应该看看他们的文档[这里](https://web3py.readthedocs.io/en/v5/providers.html?highlight=providers)。

zkSync完全支持Ethereum Web3 API，所以你可以使用web3.py的提供者对象。然而，zkSync API提供了一些额外的JSON-RPC方法，这些方法允许。

- 轻松地跟踪L1<->L2交易。
- 交易的不同阶段的最终结果。默认情况下，我们的RPC返回服务器处理的最后一个状态的信息，但有些用例可能只需要跟踪 "最终完成 "的事务。

****\*init *****

初始化zkSync SDK。

```py

def __init__(self,
                 web3: Web3,
                 erc20_bridge: L1Bridge,
                 eth_bridge: L1Bridge,
                 account: BaseAccount,
                 zksync: Optional[ZkSyncContract] = None):

```

**Arguments**

| Name              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| web3              | The provider instance to use for getting on-chain data. |
| erc20_bridge      | The erc20 token address you want to bridge.             |
| eth_bridge        | The eth token address you want to bridge                |
| account           | Your wallet address used for transactions.              |
| zksync (optional) | zkSync contract address                                 |
| returns           | `Provider` object.                                      |



## `approve_deposits`

从以太坊桥接ERC20代币需要批准代币到zkSync以太坊智能合约，它返回桥接的erc20代币地址。

```py

def approve_deposits(self, token: Token, limit: Optional[int]) -> txn_receipt

```

**Arguments**

| Name            | Description                                       |
| --------------- | ------------------------------------------------- |
| token           | The Ethereum address of the token.                |
| limit(optional) | The number of tokens to be returned from the API. |

## `transfer`

转移方法，可以在同一接口内转移ETH或任何ERC20代币，并返回转移的交易收据。

```py
def transfer(self, token: Token, amount: Decimal, to: HexStr) -> txn_receipt

```

**Arguments**

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| token  | The address of the token. ETH by default.    |
| to     | The wallet address to transfer the tokens to |
| amount | The amount of tokens to transfer             |

从连接的钱包转移指定数量的代币到一个指定的地址。

> Example

```py

 def transfer(self, token: Token, amount: Decimal, to: HexStr):
        if token.is_eth(): # Checks if the token is a ETH token.
            tx = {
                'nonce': self.web3.eth.get_transaction_count() + 1, #The nonce of the transaction.
                'to': to, # Address to send tokens to
                'value': Web3.toWei(amount, 'ether'), # The amount of the token sent, converted to Wei.
                'gas': self.GAS_LIMIT, # The gas limit
                'gasPrice': self.web3.eth.gas_price # The gas price of the transaction.
            }
            signed_tx = self.web3.eth.account.sign_transaction(tx, self.account)
            txn_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
            txn_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
            return txn_receipt # Returns the transaction receipt of the transfer.
        else:
            token_contract = ERC20Contract(web3=self.web3.eth,
                                           contract_address=token.l1_address,
                                           account=self.account,
                                           gas_provider=self.l1_erc20_bridge.gas_provider)
            return token_contract.transfer(to, token.to_int(amount)) # Returns the transaction receipt of the transfer.

```

## `get_deposit_base_cost`

返回请求合约调用的基本费用（ETH）。

```py

def get_deposit_base_cost(self, gas_price: int = None) -> base_cost

```

**Arguments**

| Name      | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| gas price | The gas price of the L1 transaction that will send the request for an execute call. |

## `deposit`

返回存款的交易收据。

```py

def deposit(self, token: Token, amount: int, user_address: HexStr) -> txn_receipt

```

**Arguments**

| Name         | Description                                               |
| ------------ | --------------------------------------------------------- |
| token        | The address of the token to deposit.                      |
| amount       | The amount of the token to be deposited.                  |
| user_address | The address that will receive the deposited tokens on L2. |

## `is_deposit_approved`

返回津贴集的交易收据。

```py

def is_deposit_approved(self, token: Token, to: HexStr, threshold: int = DEFAULT_THRESHOLD) -> txn_receipt

```

**Arguments**

| Name      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| token     | The address of the token to deposit.                                    |
| to        | The amount of the token to be deposited.                                |
| threshold | The daily automatic payout of all balances above your configured payout |
