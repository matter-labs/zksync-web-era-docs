# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Deposit assets from Ethereum into zkSync.
3. Check balances.
4. Transfer and withdraw funds (native and ERC20 tokens).
5. Deploy a smart contract.
6. Deploy a smart contract with create2.

## Prerequisite

This guide assumes that you are familiar with [Python](https://docs.python.org/3/) programming language.

##  Installation

To install the SDK with the `pip install` command, run the following:

```py

pip install zksync2

```
## Instantiating the SDK

To start using this SDK, you just need to pass in a provider configuration.

```py

from web3 import Web3
from zkSync2.module.module_builder import zkSyncBuilder

URL_TO_ETH_NETWORK = "GOERLI_HTTPS_RPC"
ZKSYNC_NETWORK_URL = "https://zksync2-testnet.zksync.dev"

eth_web3 = Web3(Web3.HTTPProvider(URL_TO_ETH_NETWORK))
zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)

```

## Ethereum signer

::: warning

⚠️ Never commit private keys to file tracking history, or your account could be compromised.

:::

Ethereum signer is represented by the `PrivateKeyEthSigner` abstract class from `zkSync2.signer.eth_signer`.

```py

from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.signer.eth_signer import PrivateKeyEthSigner
import os

PRIVATE_KEY = os.environ.get("YOUR_PRIVATE_KEY")

account: LocalAccount = Account.from_key(PRIVATE_KEY)
signer = PrivateKeyEthSigner(account, chain_id)

```
## Depositing funds

This example shows how to deposit funds into an address.

```py

from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.manage_contracts.gas_provider import StaticGasProvider
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import Token
from zkSync2.provider.eth_provider import EthereumProvider


def deposit():
    #geth_poa_middleware is used to connect to geth --dev.
    eth_web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    #calculate  gas fees
    gas_provider = StaticGasProvider(Web3.toWei(1, "gwei"), 555000)

    #Create the ethereum provider for interacting with ethereum node, initialize zkSync signer and deposit funds.
    eth_provider = EthereumProvider.build_ethereum_provider(zkSync=zkSync_web3,
                                                            eth=eth_web3,
                                                            account=account,
                                                            gas_provider=gas_provider)
    tx_receipt = eth_provider.deposit(Token.create_eth(),
                                    eth_web3.toWei("YOUR_AMOUNT_OF_ETH", "ether"),
                                    account.address)
    # Show the output of the transaction details.
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    deposit()

```

## Checking balance

This example shows how to check your balance on the zkSync network.

```py

from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import EthBlockParams


def get_account_balance():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    zk_balance = zkSync_web3.zkSync.get_balance(account.address, EthBlockParams.LATEST.value)
    print(f"zkSync balance: {zk_balance}")


if __name__ == "__main__":
    get_account_balance()

```

## Performing a transfer

This example shows how to execute a transfer from one account to another, on the zkSync network.

```py

from eth_typing import HexStr
from web3 import Web3
from zkSync2.module.request_types import create_function_call_transaction
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import ZkBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount

from zkSync2.signer.eth_signer import PrivateKeyEthSigner
from zkSync2.transaction.transaction712 import Transaction712


def transfer_to_self():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    chain_id = zkSync_web3.zkSync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    nonce = zkSync_web3.zkSync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    tx = create_function_call_transaction(from_=account.address,
                                          to=account.address,
                                          ergs_price=0,
                                          ergs_limit=0,
                                          data=HexStr("0x"))
    estimate_gas = zkSync_web3.zkSync.eth_estimate_gas(tx)
    gas_price = zkSync_web3.zkSync.gas_price

    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = Transaction712(chain_id=chain_id,
                            nonce=nonce,
                            gas_limit=estimate_gas,
                            to=tx["to"],
                            value=Web3.toWei(0.01, 'ether'),
                            data=tx["data"],
                            maxPriorityFeePerGas=100000000,
                            maxFeePerGas=gas_price,
                            from_=account.address,
                            meta=tx["eip712Meta"])

    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zkSync_web3.zkSync.send_raw_transaction(msg)
    tx_receipt = zkSync_web3.zkSync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    transfer_to_self()


```

## Transfer funds (ERC20 tokens)

This example shows how to transfer ERC20 tokens into your account on the zkSync network.

```py

from zkSync2.module.request_types import create_function_call_transaction
from zkSync2.manage_contracts.erc20_contract import ERC20FunctionEncoder
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import ZkBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.signer.eth_signer import PrivateKeyEthSigner
from zkSync2.transaction.transaction712 import Transaction712


def transfer_erc20_token():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    chain_id = zkSync_web3.zkSync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    nonce = zkSync_web3.zkSync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    tokens = zkSync_web3.zkSync.zks_get_confirmed_tokens(0, 100)
    not_eth_tokens = [x for x in tokens if not x.is_eth()]
    token_address = not_eth_tokens[0].l2_address

    erc20_encoder = ERC20FunctionEncoder(zkSync_web3)
    transfer_params = [account.address, 0]
    call_data = erc20_encoder.encode_method("transfer", args=transfer_params)

    tx = create_function_call_transaction(from_=account.address,
                                          to=token_address,
                                          ergs_price=0,
                                          ergs_limit=0,
                                          data=call_data)
    estimate_gas = zkSync_web3.zkSync.eth_estimate_gas(tx)
    gas_price = zkSync_web3.zkSync.gas_price

    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = Transaction712(chain_id=chain_id,
                            nonce=nonce,
                            gas_limit=estimate_gas,
                            to=tx["to"],
                            value=tx["value"],
                            data=tx["data"],
                            maxPriorityFeePerGas=100000000,
                            maxFeePerGas=gas_price,
                            from_=account.address,
                            meta=tx["eip712Meta"])
    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zkSync_web3.zkSync.send_raw_transaction(msg)
    tx_receipt = zkSync_web3.zkSync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    transfer_erc20_token()


```

## Withdrawing funds

This examples shows how to withdraw funds into your account.

```py

from decimal import Decimal
from eth_typing import HexStr
from zkSync2.module.request_types import create_function_call_transaction
from zkSync2.manage_contracts.l2_bridge import L2BridgeEncoder
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import Token, ZkBlockParams, BridgeAddresses
from eth_account import Account
from eth_account.signers.local import LocalAccount

from zkSync2.signer.eth_signer import PrivateKeyEthSigner
from zkSync2.transaction.transaction712 import Transaction712


def withdraw():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    chain_id = zkSync_web3.zkSync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)
    ETH_TOKEN = Token.create_eth()

    nonce = zkSync_web3.zkSync.get_transaction_count(account.address, ZkBlockParams.COMMITTED.value)
    bridges: BridgeAddresses = zkSync_web3.zkSync.zks_get_bridge_contracts()

    l2_func_encoder = L2BridgeEncoder(zkSync_web3)
    call_data = l2_func_encoder.encode_function(fn_name="withdraw", args=[
        account.address,
        ETH_TOKEN.l2_address,
        ETH_TOKEN.to_int(Decimal("0.001"))
    ])

    tx = create_function_call_transaction(from_=account.address,
                                          to=bridges.l2_eth_default_bridge,
                                          ergs_limit=0,
                                          ergs_price=0,
                                          data=HexStr(call_data))
    estimate_gas = zkSync_web3.zkSync.eth_estimate_gas(tx)
    gas_price = zkSync_web3.zkSync.gas_price

    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = Transaction712(chain_id=chain_id,
                            nonce=nonce,
                            gas_limit=estimate_gas,
                            to=tx["to"],
                            value=tx["value"],
                            data=tx["data"],
                            maxPriorityFeePerGas=100000000,
                            maxFeePerGas=gas_price,
                            from_=account.address,
                            meta=tx["eip712Meta"])

    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zkSync_web3.zkSync.send_raw_transaction(msg)
    tx_receipt = zkSync_web3.zkSync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")


if __name__ == "__main__":
    withdraw()


```

## Deploy a smart contract
With zkSync, you can deploy a contract using the `create` method, by simply building the contract into a binary format and deploying it to the zkSync network.

In the next steps, we will guide you through how it works.

### Step1: Create a contract
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
> It must be compiled by zkSync compiler only!

After compilation there must be 2 files with the:

- contract binary representation
- contract ABI in JSON format

### Step 2: Deploy the contract

To deploy the contract, contract ABI is needed for calling its methods in the standard `web3` way.

In some cases, you would need to get the contract address before deploying it.

Here's an example of how you would do it.

```py

import json
from pathlib import Path
from eth_typing import HexStr
from web3 import Web3
from web3.types import TxParams
from zkSync2.module.request_types import create_contract_transaction
from zkSync2.manage_contracts.contract_deployer import ContractDeployer
from zkSync2.manage_contracts.nonce_holder import NonceHolder
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import ZkBlockParams, EthBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.signer.eth_signer import PrivateKeyEthSigner
from zkSync2.transaction.transaction712 import Transaction712


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
                                                       bytecode=read_binary(bin_path))

    def encode_method(self, fn_name, args: list) -> HexStr:
        return self.counter_contract.encodeABI(fn_name, args)


def deploy_contract_create():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    chain_id = zkSync_web3.zkSync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    counter_contract_bin = read_binary("PATH_TO_BINARY_COMPILED_CONTRACT")

    nonce = zkSync_web3.zkSync.get_transaction_count(account.address, EthBlockParams.PENDING.value)
    nonce_holder = NonceHolder(zkSync_web3, account)
    deployment_nonce = nonce_holder.get_deployment_nonce(account.address)
    deployer = ContractDeployer(zkSync_web3)
    precomputed_address = deployer.compute_l2_create_address(account.address, deployment_nonce)

    print(f"precomputed address: {precomputed_address}")

    tx = create_contract_transaction(web3=zkSync_web3,
                                     from_=account.address,
                                     ergs_limit=0,
                                     ergs_price=0,
                                     bytecode=counter_contract_bin)

    estimate_gas = zkSync_web3.zkSync.eth_estimate_gas(tx)
    gas_price = zkSync_web3.zkSync.gas_price
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = Transaction712(chain_id=chain_id,
                            nonce=nonce,
                            gas_limit=estimate_gas,
                            to=tx["to"],
                            value=tx["value"],
                            data=tx["data"],
                            maxPriorityFeePerGas=100000000,
                            maxFeePerGas=gas_price,
                            from_=account.address,
                            meta=tx["eip712Meta"])

    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zkSync_web3.zkSync.send_raw_transaction(msg)
    tx_receipt = zkSync_web3.zkSync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")

    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    counter_contract_encoder = CounterContractEncoder(zkSync_web3, "PATH_TO_BINARY_COMPILED_CONTRACT",
                                                      "PATH_TO_CONTRACT_ABI")

    call_data = counter_contract_encoder.encode_method(fn_name="get", args=[])
    eth_tx: TxParams = {
        "from": account.address,
        "to": contract_address,
        "data": call_data
    }
    # Value is type dependent so might need to be converted to corresponded type under Python
    eth_ret = zkSync_web3.zkSync.call(eth_tx, ZkBlockParams.COMMITTED.value)
    converted_result = int.from_bytes(eth_ret, "big", signed=True)
    print(f"Call method for deployed contract, address: {contract_address}, value: {converted_result}")


if __name__ == "__main__":
    deploy_contract_create()

```
## Deploy a smart contract with Create2

Using the [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) opcode gives you the ability to predict the address where a contract will be deployed, without ever having to do so, hence improving user onboarding.

Similar to the `create` method above, here's the implementation on how you can deploy a contract using the `create2` method on zkSync.

```py

import os
import json
from pathlib import Path
from eth_typing import HexStr
from web3 import Web3
from web3.types import TxParams
from zkSync2.module.request_types import create2_contract_transaction
from zkSync2.manage_contracts.contract_deployer import ContractDeployer
from zkSync2.module.module_builder import zkSyncBuilder
from zkSync2.core.types import ZkBlockParams, EthBlockParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
from zkSync2.signer.eth_signer import PrivateKeyEthSigner
from zkSync2.transaction.transaction712 import Transaction712

#Generate random salt(an arbitrary value provided by the sender)
def generate_random_salt() -> bytes:
    return os.urandom(32)

#Open the file
def read_binary(p: Path) -> bytes:
    with p.open(mode='rb') as contact_file:
        data = contact_file.read()
        return data

#Get the contract ABI
def get_abi(p: Path):
    with p.open(mode='r') as json_f:
        return json.load(json_f)


class CounterContractEncoder:
    def __init__(self, web3: Web3, bin_path: Path, abi_path: Path):
        self.web3 = web3
        self.counter_contract = self.web3.eth.contract(abi=get_abi(abi_path),
                                                       bytecode=read_binary(bin_path))

    def encode_method(self, fn_name, args: list) -> HexStr:
        return self.counter_contract.encodeABI(fn_name, args)

#Deploy the contract
def deploy_contract_create2():
    ZKSYNC_NETWORK_URL: str = 'https://zkSync2-testnet.zkSync.dev'
    account: LocalAccount = Account.from_key('YOUR_PRIVATE_KEY')
    zkSync_web3 = zkSyncBuilder.build(ZKSYNC_NETWORK_URL)
    chain_id = zkSync_web3.zkSync.chain_id
    signer = PrivateKeyEthSigner(account, chain_id)

    counter_contract_bin = read_binary("PATH_TO_BINARY_COMPILED_CONTRACT")

    nonce = zkSync_web3.zkSync.get_transaction_count(account.address, EthBlockParams.PENDING.value)
    deployer = ContractDeployer(zkSync_web3)
    random_salt = generate_random_salt()
    precomputed_address = deployer.compute_l2_create2_address(sender=account.address,
                                                              bytecode=counter_contract_bin,
                                                              constructor=b'',
                                                              salt=random_salt)
    print(f"precomputed address: {precomputed_address}")

    tx = create2_contract_transaction(web3=zkSync_web3,
                                      from_=account.address,
                                      ergs_price=0,
                                      ergs_limit=0,
                                      bytecode=counter_contract_bin,
                                      salt=random_salt)
    estimate_gas = zkSync_web3.zkSync.eth_estimate_gas(tx)
    gas_price = zkSync_web3.zkSync.gas_price
    print(f"Fee for transaction is: {estimate_gas * gas_price}")

    tx_712 = Transaction712(chain_id=chain_id,
                            nonce=nonce,
                            gas_limit=estimate_gas,
                            to=tx["to"],
                            value=tx["value"],
                            data=tx["data"],
                            maxPriorityFeePerGas=100000000,
                            maxFeePerGas=gas_price,
                            from_=account.address,
                            meta=tx["eip712Meta"])
    singed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
    msg = tx_712.encode(singed_message)
    tx_hash = zkSync_web3.zkSync.send_raw_transaction(msg)
    tx_receipt = zkSync_web3.zkSync.wait_for_transaction_receipt(tx_hash, timeout=240, poll_latency=0.5)
    print(f"tx status: {tx_receipt['status']}")

    contract_address = tx_receipt["contractAddress"]
    print(f"contract address: {contract_address}")

    counter_contract_encoder = CounterContractEncoder(zkSync_web3, "CONTRACT_BIN_PATH", "CONTRACT_ABI_PATH")
    call_data = counter_contract_encoder.encode_method(fn_name="get", args=[])
    eth_tx: TxParams = {
        "from": account.address,
        "to": contract_address,
        "data": call_data
    }
    eth_ret = zkSync_web3.zkSync.call(eth_tx, ZkBlockParams.COMMITTED.value)
    result = int.from_bytes(eth_ret, "big", signed=True)
    print(f"Call method for deployed contract, address: {contract_address}, value: {result}")


if __name__ == "__main__":
    deploy_contract_create2()

```

::: warning

⚠️ This section of the docs is still in progress and will be updated with more detailed information soon.

:::