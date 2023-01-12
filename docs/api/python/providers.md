## Providers

Providers are objects that wrap interactions with the zkSync node. If you are new to the concept of providers in `web3`, you should check out their docs [here](https://web3py.readthedocs.io/en/v5/providers.html?highlight=providers).

zkSync fully supports Ethereum Web3 API, so you can use the provider objects from web3.py. However, zkSync API provides some additional JSON-RPC methods, which allow:

- Easily track L1<->L2 transactions.
- Different stages of finality for transactions. By default, our RPC returns information about the last state processed by the server, but some use cases may require tracking "finalized" transactions only.

**__init__**

Initialize the zkSync SDK.

```py

def __init__(self,
                 web3: Web3,
                 erc20_bridge: L1Bridge,
                 eth_bridge: L1Bridge,
                 account: BaseAccount,
                 zksync: Optional[ZkSyncContract] = None):

```

**Arguements**

| Name               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| web3               | The provider instance to use for getting on-chain data. |
| erc20_bridge       | The erc20 token address you want to bridge.                    |
| eth_bridge         | The eth token address you want to bridge                        |
| account            | Your wallet address used for transactions.              |
| zksync (optional)  | zkSync contract address                                 |
| returns            | `Provider` object.                                      |

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `approve_deposits`
Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract, it returns the bridged erc20 token address.

```py

def approve_deposits(self, token: Token, limit: Optional[int]) -> txn_receipt

```
**Arguements**

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The Ethereum address of the token.                               |
| limit(optional)    | The number of tokens to be returned from the API.                |


## `transfer`
The transfer method, can transfer ETH or any ERC20 token within the same interface, and it returns the transaction receipt of the transfer.

```py
def transfer(self, token: Token, amount: Decimal, to: HexStr) -> txn_receipt

```

**Arguements**

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The address of the token. ETH by default.                        |
| to                 | The wallet address to transfer the tokens to                     |
| amount             | The amount of tokens to transfer                                 |

Transfer a specified amount of tokens from the connected wallet to a specified address.

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

Returns the base cost in ETH for requesting the contract call.

```py

def get_deposit_base_cost(self, gas_price: int = None) -> base_cost

```

**Arguements**

| Name               | Description                                                                         |
| ------------------ | ------------------------------------------------------------------------------------|
| gas price          | The gas price of the L1 transaction that will send the request for an execute call. |

## `deposit`

Returns the transaction receipt of the deposit.

```py

def deposit(self, token: Token, amount: int, user_address: HexStr) -> txn_receipt

```

**Arguements**

| Name               | Description                                                      |
| ------------------ | -----------------------------------------------------------------|
| token              | The address of the token to deposit.                             |
| amount             | The amount of the token to be deposited.                         |
| user_address       | The address that will receive the deposited tokens on L2.        |


## `is_deposit_approved`
Returns the transaction receipt of the allowance set.

```py

def is_deposit_approved(self, token: Token, to: HexStr, threshold: int = DEFAULT_THRESHOLD) -> txn_receipt

```

**Arguements**

| Name               | Description                                                            |
| ------------------ | -----------------------------------------------------------------------|
| token              | The address of the token to deposit.                                   |
| to                 | The amount of the token to be deposited.                               |
| threshold          | The daily automatic payout of all balances above your configured payout|