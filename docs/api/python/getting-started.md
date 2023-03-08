# 快速开始

在本指南中，我们将演示如何。

1. 连接到zkSync网络。
2. 将资产从以太坊存入zkSync。
3. 检查余额。
4. 转移和提取资金（本地和ERC20代币）。
5. 部署一个智能合约。
6. 用create2部署一个智能合约。

::: warning

文件的这一部分正在审查中，以反映对系统合同的修改（[见changelog](.../.../dev/troubleshooting/changelog.md)）。修订后的版本很快就会推出。

:::

## 添加依赖性

要安装zkSync Era，请在终端运行以下命令。

```console
pip install zksync2
```

## 连接到zkSync

一旦你有了所有必要的依赖，使用操作员节点的端点连接到zkSync。

```python
from zksync2.module.module_builder import ZkSyncBuilder
...
sdk = ZkSyncBuilder.build("https://zksync2-testnet.zksync.dev")
```

该SDK支持主网和goerli网络。

## 示例

一旦你实例化了SDK，你就可以用它来访问你的zkSync合同。你可以使用SDK的合同获取器功能，例如。

### 存入资金

这是一个如何将资产从Ethereum账户存入zkSync账户的例子。

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

### 检查余额

下面是另一个关于如何检查你的余额的例子。

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

### 转移

下面是一个关于如何在zkSync网络上转移资金的例子。

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

### 转移资金（ERC20代币）

下面这个例子显示了你如何转移ERC20代币。

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

### 提取资金（本地币）

这个例子展示了如何从zkSync提取资金。

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

### 部署一个智能合约

使用zkSync，您可以使用创建方法部署合同，只需将合同构建为二进制格式并将其部署到zkSync网络中。

在接下来的步骤中，我们将引导你了解它是如何工作的。

#### 第1步：创建一个合约

这里是一个简单的合约。

```solidityag-0-1gr0ere8lag-1-1gr0ere8l
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
它必须只由zkSync编译器来编译!
:::

- 编译后，必须有2个文件，其中有。
  
  - 合同的二进制表示
  - json格式的合同ABI

#### 第2步：部署合同

为了部署合同，需要合同ABI来以标准的web3方式调用其方法。

在某些情况下，你需要在部署前获得合同地址。

下面是一个例子，说明你将如何做。

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

#### 使用方法create2部署合同

这个例子展示了如何使用create2方法部署合同。

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
