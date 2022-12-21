# zkSync2 client sdk

## Contents
- [Getting started](#getting-started)
- [Provider](#provider-zksyncbuilder)
- [Account](#account)
- [Signer](#signer)
- [Transactions](#transactions)
- [Contract interfaces](#contract-interfaces)
- [Examples](#examples)

TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Getting started

### Requirements
| Tool  | Required  |
|-------|-----------|
| python| >= 3.8    |
| package manager| pip |

## How to install
To install zksync 2.0, run the command below in your terminal.

```console
pip install zksync2
```
### Provider (zkSyncBuilder)

### Design
ZkSync 2.0 is designed with the same styling as web3.<br>
It defines the zksync module based on Ethereum and extends it with zkSync-specific methods.<br>

### How to construct
For usage, there is a `ZkSyncBuilder` that returns a Web3 object with an instance of zksync module.<br>
The construction only needs the URL to the zkSync blockchain.

#### For example:
```python
from zksync2.module.module_builder import ZkSyncBuilder
...
web3 = ZkSyncBuilder.build("ZKSYNC_NET_URL")
```

#### Module parameters and methods

- ZkSync module attributes:

|  Attribute | Description |
|------------|-------------|
|chain_id    | Returns an integer value for the currently configured "ChainId". |
|gas_price   | Returns the current gas price in Wei. |


- ZkSync module methods:

|  Method | Parameters | Return value |Description |
|---------|------------|--------------|------------|
|zks_estimate_fee | zkSync Transaction | Fee structure | Gets fee for zkSync transactions.|
|zks_main_contract | - | Address of the main contract | Returns address of the main contract. |
|zks_get_confirmed_tokens | from, limit | List[Token]| Returns all tokens in the set range by a global index.|
|zks_l1_chain_id | - | ChainID | Return etherium chain ID.|
|zks_get_all_account_balances| Address | Dict[str, int] | Returns the dictionary of token addresses and its values. |
|zks_get_bridge_contracts | - | BridgeAddresses | Returns addresses of all bridge contracts that are interacting with L1 layer.|
| eth_estimate_gas | Transaction | estimated gas | The overloaded method of eth_estimate_gas for ZkSync transaction gas estimation. |
| wait_for_transaction_receipt | Tx Hash, optional timeout,poll_latency | TxReceipt| Waits for the transaction to be included into block by its hash and returns its reciept. Optional arguments are `timeout` and `poll_latency` in seconds.|

## Account

The account incapsulate the private key, and the unique user identifier in the network.<br> This unique identifier also means the wallet address.

#### Account construction

zkSync2 Python SDK account is compatible with `eth_account` package.
In most cases users can have their private key and get account instances by using it.

Example:
```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
...
account: LocalAccount = Account.from_key("PRIVATE_KEY")

```

The base property that is used directly with account is: `Account.address`.

## Signer

Signer is used to generate signature of the provided transaction based on your account(your private key).<br>
This signature is added to the final `EIP712` transaction for its validation.

### Singer construction

zkSync2 already has implementation of signer. For contruct the instance it needs only `account` and `chain_id`.

Example:

```python
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from eth_account import Account
from zksync2.module.module_builder import ZkSyncBuilder


account = Account.from_key("PRIVATE_KEY")
zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
...
chain_id = zksync_web3.zksync.chain_id
signer = PrivateKeyEthSigner(account, chain_id)
```
#### Methods


Signer has a few methods to generate signature and verify messages.

|  Method | Parameters | Return value |Description |
|---------|------------|--------------|------------|
|sign_typed_data| EIP712 Structure, optional domain| Web3 py SignedMessage | Builds `SignedMessage` based on the encoded in `EIP712` format Transaction. |
|verify_typed_data | signature, EIP712 structure, optional domain| bool | Returns **True** if the encoded transaction is signed with provided signature. |

The signer class also has the following properties:

|  Attribute | Description |
|------------|-------------|
|address    | Account address|
|domain   | Domain that is used to generate signature. It's depends on `chain_id` of network. |

## Transactions

zkSync transactions is quite similar to the Web3 based transactions.<br>
Transactions are defined in the package: `zksync2.module.request_type`<br>

For sending and siging transactions it's neccessary to sign and encode it in `EIP712` structure.<br>
The EIP712 transaction type can be found in package: `zksync2.transaction.transaction712`

To convert ordinary transaction to `EIP712` type there are defined helper classes:

* TxFunctionCall
* TxCreateContract
* TxCreate2Contract

Usage will be described in the examples [section][#Examples]

## Contract interfaces

There is a set of system contract that helps with the interaction with zkSync 2.0 network.<br>
The following are the contracts:

* NonceHolder
* ERC20Contract & ERC20FunctionEncoder
* ContractDeployer

### NonceHolder

The `NonceHolder` system contract handles the deployment of nonce, it's useful for precomputing address of contract that is going to be deployed in the network.<br>

To construct it, you need the `account` and `Web3` object with the integrated zksync module.

```python
from zksync2.manage_contracts.nonce_holder import NonceHolder
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.module.module_builder import ZkSyncBuilder

zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
account: LocalAccount = Account.from_key("PRIVATE_KEY")
nonce_holder = NonceHolder(zksync_web3, account)
```

Methods:

|  Method | Parameters | Return value |Description |
|---------|------------|--------------|------------|
|get_account_nonce | - | Nonce | Returns account nonce. |
|get_deployment_nonce | - | Nonce | Return the current deployment nonce that is going to be used. |
|increment_deployment_nonce| Address | Nothing | Manually increments deployment nonce by the provided account address. | 


### ERC20Contract

This is system contract that is used internally as a part of the implementation methods of `EthereumProvider`<br>

More interested type include the `ERC20FunctionEncoder`. it's used to provide method encoding in the case of sending non-native tokens inside the network.

Construction needs only Web3 object with appended zksync module(ZkSyncBuilder)

It has only 1 single method: `python encode_method` with arguments of function name, and it's args
Usage example you may find in [section](#examples) `Transfer funds (ERC20 tokens)`   


### ContractDeployer

ContractDeployer is a utility system contract, represented as a type to cover the following functionality:

* encode binary contract representation by `create` method for further deploying.
* encode binary contract representation by `create2` method for further deploying.
* Precompute contract address for `create` and `create2` methods.

Construction: needs only web3 object with appended zksync module


Example:
```python
from zksync2.manage_contracts.contract_deployer import ContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder

zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
deployer = ContractDeployer(zksync_web3)
```

**Parameter and Methods:**

| Method                    | Parameters                                  | Return value | Description                                                                                                                                                                                                                                          |
|---------------------------|---------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| encode_create             | bytecode, optional `call_data` & `salt`     | HexStr  | Creates binary represenation of a contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.                                         |
| encode_create2            | bytecode, optional `call_data` & `salt`     | HexStr  | Creates binary represenation of contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.                     |
 | compute_l2_create_address | Address, Nonce                              | Address | Accepts address of deployer and current deployed nonce and returns address of contract that is going to be deployed by the`encode_create` method.                                                                                                        |
| compute_l2_create2_address | Address, bytecode, `ctor` bytecode, `salt` | Address | Accepts address of the deployer, binary representation of contract, it's constructor in binary format and salt. By default constructor can be `b'0'` value. It returns the address of the contract that is going to be deployed by an`encode_create2` method. |


## Examples

### Deposit funds
This is an example of how to deposit assets from Ethereum account to zkSync account:

```python
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.manage_contracts.gas_provider import StaticGasProvider
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import Token
from zksync2.provider.eth_provider import EthereumProvider


def deposit():
    URL_TO_ETH_NETWORK = "https://goerli.infura.io/v3/25be7ab42c414680a5f89297f8a11a4d"
    ZKSYNC_NETWORK_URL = "https://zksync2-testnet.zksync.dev"

    eth_web3 = Web3(Web3.HTTPProvider(URL_TO_ETH_NETWORK))
    eth_web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    zksync_web3 = ZkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    gas_provider = StaticGasProvider(Web3.toWei(1, "gwei"), 555000)
    eth_provider = EthereumProvider.build_ethereum_provider(zksync=zksync_web3,
                                                            eth=eth_web3,
                                                            account=account,
                                                            gas_provider=gas_provider)
    tx_receipt = eth_provider.deposit(Token.create_eth(),
                                      eth_web3.toWei("YOUR_AMOUNT_OF_ETH", "ether"),
                                      account.address)
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    deposit()

```


### Check balance

Here's another example on how to check your balance.

```python
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import EthBlockParams


def get_account_balance():
    ZKSYNC_NETWORK_URL: str = 'https://zksync2-testnet.zksync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zksync_web3 = ZkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    zk_balance = zksync_web3.zksync.get_balance(account.address, EthBlockParams.LATEST.value)
    print(f"ZkSync balance: {zk_balance}")


if __name__ == "__main__":
    get_account_balance()

```

### Transfer

Here is an example on how to transfer funds on zkSync network.

```python
from eth_typing import HexStr
from web3 import Web3
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import ZkBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction712 import TxFunctionCall


def transfer_to_self():
    amount = 0.05
    account: LocalAccount = Account.from_key("YOUR_PRIVATE_KEY")
    zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
    chain_id = zksync_web3.zksync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    nonce = zksync_web3.zksync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    gas_price = zksync_web3.zksync.gas_price

    tx_func_call = TxFunctionCall(chain_id=chain_id,
                                  nonce=nonce,
                                  from_=account.address,
                                  to=account.address,
                                  value=Web3.toWei(amount, 'ether'),
                                  data=HexStr("0x"),
                                  gas_limit=0,  # unknown at this state, will be replaced by estimate_gas
                                  gas_price=gas_price,
                                  max_priority_fee_per_gas=100000000)
    estimate_gas = zksync_web3.zksync.eth_estimate_gas(tx_func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = tx_func_call.tx712(estimate_gas)

    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zksync_web3.zksync.send_raw_transaction(msg)
    tx_receipt = zksync_web3.zksync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx_hash : {tx_hash.hex()}, status: {tx_receipt['status']}")


if __name__ == "__main__":
    transfer_to_self()
```

### Transfer funds (ERC20 tokens)

This example below shows how you can tranfer ERC20 tokens.

```python
from zksync2.manage_contracts.erc20_contract import ERC20FunctionEncoder
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import ZkBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction712 import TxFunctionCall


def transfer_erc20_token():
    account: LocalAccount = Account.from_key("YOUR_PRIVATE_KEY")
    zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
    chain_id = zksync_web3.zksync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    nonce = zksync_web3.zksync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    gas_price = zksync_web3.zksync.gas_price

    tokens = zksync_web3.zksync.zks_get_confirmed_tokens(0, 100)
    not_eth_tokens = [x for x in tokens if not x.is_eth()]
    token_address = not_eth_tokens[0].l2_address

    erc20_encoder = ERC20FunctionEncoder(zksync_web3)
    transfer_params = [account.address, 0]
    call_data = erc20_encoder.encode_method("transfer", args=transfer_params)

    func_call = TxFunctionCall(chain_id=chain_id,
                               nonce=nonce,
                               from_=account.address,
                               to=token_address,
                               data=call_data,
                               gas_limit=0,  # unknown at this state, will be replaced by estimate_gas
                               gas_price=gas_price,
                               max_priority_fee_per_gas=100000000)
    estimate_gas = zksync_web3.zksync.eth_estimate_gas(func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = func_call.tx712(estimate_gas)
    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zksync_web3.zksync.send_raw_transaction(msg)
    tx_receipt = zksync_web3.zksync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx_hash : {tx_hash.hex()}, status: {tx_receipt['status']}")


if __name__ == "__main__":
    transfer_erc20_token()
```

### Withdraw funds (Native coins)
This example show how to withdraw funds from zkSync.

```python
from decimal import Decimal
from eth_typing import HexStr
from zksync2.manage_contracts.l2_bridge import L2BridgeEncoder
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import Token, ZkBlockParams, BridgeAddresses
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction712 import TxFunctionCall


def withdraw():
    value = Decimal("0.001")

    account: LocalAccount = Account.from_key("PRIVATE_KEY")
    zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
    chain_id = zksync_web3.zksync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)
    ETH_TOKEN = Token.create_eth()

    nonce = zksync_web3.zksync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    gas_price = zksync_web3.zksync.gas_price
    bridges: BridgeAddresses = zksync_web3.zksync.zks_get_bridge_contracts()

    l2_func_encoder = L2BridgeEncoder(zksync_web3)
    call_data = l2_func_encoder.encode_function(fn_name="withdraw", args=[
        account.address,
        ETH_TOKEN.l2_address,
        ETH_TOKEN.to_int(value)
    ])

    func_call = TxFunctionCall(chain_id=chain_id,
                               nonce=nonce,
                               from_=account.address,
                               to=bridges.l2_eth_default_bridge,
                               data=HexStr(call_data),
                               gas_limit=0, # unknown at this state, will be replaced by estimate_gas
                               gas_price=gas_price,
                               max_priority_fee_per_gas=100000000)
    estimate_gas = zksync_web3.zksync.eth_estimate_gas(func_call.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = func_call.tx712(estimate_gas)
    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zksync_web3.zksync.send_raw_transaction(msg)
    tx_receipt = zksync_web3.zksync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx_hash : {tx_hash.hex()}, status: {tx_receipt['status']}")


if __name__ == "__main__":
    withdraw()
```

### Deploy a smart contract
With zkSync, you can deploy a contract using the create method, by simply building the contract into a binary format and deploying it to the zkSync network.

In the next steps, we will guide you through how it works.

#### Step1: Create a contract
Here is a simple contract:

```solidity
pragma solidity ^0.8.0;

contract Counter {
    uint256 value;

    function increment(uint256 x) public {
        value += x;
    }

    function get() public view returns (uint256) {
        return value;
    }
}
```

::: tip
It must be compiled by zkSync compiler only!
:::

After compilation there must be 2 files with:

- contract binary representation
- contract abi in json format

#### Step 2: Deploy the contract
To deploy the contract, contract ABI is needed for calling its methods in the standard web3 way.

In some cases, you would need to get the contract address before deploying it.

Here's an example of how you would do it.

```python
import json
import os
from pathlib import Path
from eth_typing import HexStr
from web3 import Web3
from web3.types import TxParams
from zksync2.manage_contracts.contract_deployer import ContractDeployer
from zksync2.manage_contracts.nonce_holder import NonceHolder
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import ZkBlockParams, EthBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction712 import TxCreateContract


def generate_random_salt() -> bytes:
    return os.urandom(32)


def read_hex_binary(name: str) -> bytes:
    p = Path(f"./{name}")
    with p.open(mode='r') as contact_file:
        lines = contact_file.readlines()
        data = "".join(lines)
        return bytes.fromhex(data)


def read_binary(p: Path) -> bytes:
    with p.open(mode='rb') as contact_file:
        data = contact_file.read()
        return data


def get_abi(p: Path):
    with p.open(mode='r') as json_f:
        return json.load(json_f)


class CounterContractEncoder:
    def __init__(self, web3: Web3, bin_path: Path, abi_path: Path):
        self.web3 = web3
        self.counter_contract = self.web3.eth.contract(abi=get_abi(abi_path),
                                                       bytecode=read_hex_binary(str(bin_path)))

    def encode_method(self, fn_name, args: list) -> HexStr:
        return self.counter_contract.encodeABI(fn_name, args)


def deploy_contract_create():
    account: LocalAccount = Account.from_key("PRIVATE_KEY")
    zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
    chain_id = zksync_web3.zksync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    counter_contract_bin = read_hex_binary("counter_contract.hex")

    nonce = zksync_web3.zksync.get_transaction_count(account.address, EthBlockParams.PENDING.value)
    gas_price = zksync_web3.zksync.gas_price

    nonce_holder = NonceHolder(zksync_web3, account)
    deployment_nonce = nonce_holder.get_deployment_nonce(account.address)
    deployer = ContractDeployer(zksync_web3)
    precomputed_address = deployer.compute_l2_create_address(account.address, deployment_nonce)

    print(f"precomputed address: {precomputed_address}")

    random_salt = generate_random_salt()
    create_contract = TxCreateContract(web3=zksync_web3,
                                       chain_id=chain_id,
                                       nonce=nonce,
                                       from_=account.address,
                                       gas_limit=0,  # unknown at this state, will be replaced by estimate_gas
                                       gas_price=gas_price,
                                       bytecode=counter_contract_bin,
                                       salt=random_salt)
    estimate_gas = zksync_web3.zksync.eth_estimate_gas(create_contract.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = create_contract.tx712(estimate_gas)

    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zksync_web3.zksync.send_raw_transaction(msg)
    print(f"tx_hash:{tx_hash.hex()}")
    tx_receipt = zksync_web3.zksync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")

    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")
    counter_contract_encoder = CounterContractEncoder(zksync_web3, Path("./counter_contract.hex"),
                                                      Path("counter_contract_abi.json"))

    call_data = counter_contract_encoder.encode_method(fn_name="get", args=[])
    eth_tx: TxParams = {
        "from": account.address,
        "to": contract_address,
        "data": call_data
    }
    # Value is type dependent so might need to be converted to corresponded type under Python
    eth_ret = zksync_web3.zksync.call(eth_tx, ZkBlockParams.COMMITTED.value)
    converted_result = int.from_bytes(eth_ret, "big", signed=True)
    print(f"Call method for deployed contract, address: {contract_address}, value: {converted_result}")


if __name__ == "__main__":
    deploy_contract_create()
```

#### Deploy contract with method create2
This example show how you can deploy contract using the create2 method.


```python
import os
import json
from pathlib import Path
from eth_typing import HexStr
from web3 import Web3
from web3.types import TxParams
from zksync2.manage_contracts.contract_deployer import ContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder
from zksync2.core.types import ZkBlockParams, EthBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from zksync2.transaction.transaction712 import TxCreate2Contract


def generate_random_salt() -> bytes:
    return os.urandom(32)


def read_hex_binary(name: str) -> bytes:
    p = Path(f"./{name}")
    with p.open(mode='r') as contact_file:
        lines = contact_file.readlines()
        data = "".join(lines)
        return bytes.fromhex(data)


def read_binary(p: Path) -> bytes:
    with p.open(mode='rb') as contact_file:
        data = contact_file.read()
        return data


def get_abi(p: Path):
    with p.open(mode='r') as json_f:
        return json.load(json_f)


class CounterContractEncoder:
    def __init__(self, web3: Web3, bin_path: Path, abi_path: Path):
        self.web3 = web3
        self.counter_contract = self.web3.eth.contract(abi=get_abi(abi_path),
                                                       bytecode=read_hex_binary(str(bin_path)))

    def encode_method(self, fn_name, args: list) -> HexStr:
        return self.counter_contract.encodeABI(fn_name, args)


def deploy_contract_create2():
    account: LocalAccount = Account.from_key("PRIVATE_KEY")
    zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
    chain_id = zksync_web3.zksync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    counter_contract_bin = read_hex_binary("counter_contract.hex")

    nonce = zksync_web3.zksync.get_transaction_count(account.address, EthBlockParams.PENDING.value)
    gas_price = zksync_web3.zksync.gas_price

    deployer = ContractDeployer(zksync_web3)
    random_salt = generate_random_salt()
    precomputed_address = deployer.compute_l2_create2_address(sender=account.address,
                                                              bytecode=counter_contract_bin,
                                                              constructor=b'',
                                                              salt=random_salt)
    print(f"precomputed address: {precomputed_address}")

    create2_contract = TxCreate2Contract(web3=zksync_web3,
                                         chain_id=chain_id,
                                         nonce=nonce,
                                         from_=account.address,
                                         gas_limit=0,
                                         gas_price=gas_price,
                                         bytecode=counter_contract_bin,
                                         salt=random_salt)
    estimate_gas = zksync_web3.zksync.eth_estimate_gas(create2_contract.tx)
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = create2_contract.tx712(estimate_gas)
    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zksync_web3.zksync.send_raw_transaction(msg)
    print(f"tx_hash: {tx_hash.hex()}")
    tx_receipt = zksync_web3.zksync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")

    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    counter_contract_encoder = CounterContractEncoder(zksync_web3, Path("counter_contract.hex"),
                                                      Path("counter_contract_abi.json"))
    call_data = counter_contract_encoder.encode_method(fn_name="get", args=[])
    eth_tx: TxParams = {
        "from": account.address,
        "to": contract_address,
        "data": call_data
    }
    eth_ret = zksync_web3.zksync.call(eth_tx, ZkBlockParams.COMMITTED.value)
    result = int.from_bytes(eth_ret, "big", signed=True)
    print(f"Call method for deployed contract, address: {contract_address}, value: {result}")


if __name__ == "__main__":
    deploy_contract_create2()

```