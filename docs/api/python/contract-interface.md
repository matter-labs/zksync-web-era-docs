# 合约接口

有一套系统合约，有助于与zkSync Era网络的互动。
以下是这些合约。

- 许可证持有人（NonceHolder
- ERC20Contract & ERC20FunctionEncoder
- ContractDeployer




### NonceHolder

NonceHolder "系统合约处理nonce的部署，它对于预先计算将被部署在网络中的合约地址很有用。

要构建它，你需要`account'和`Web3'对象与集成zksync模块。

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

| Method                     | Parameters | Return value | Description                                                           |
| -------------------------- | ---------- | ------------ | --------------------------------------------------------------------- |
| get_account_nonce          | -          | Nonce        | Returns account nonce.                                                |
| get_deployment_nonce       | -          | Nonce        | Return the current deployment nonce that is going to be used.         |
| increment_deployment_nonce | Address    | Nothing      | Manually increments deployment nonce by the provided account address. |

### ERC20Contract

这是系统合约，在内部作为`EthereumProvider`的实现方法的一部分使用<br>。

更感兴趣的类型包括`ERC20FunctionEncoder`。它用于在网络内发送非本地令牌的情况下提供方法编码。

建设只需要Web3对象和附加的zksync模块（ZkSyncBuilder）。

它只有一个方法：`python encode_method`，参数为函数名和它的args


### ContractDeployer

ContractDeployer是一个实用的系统合同，以一个类型表示，涵盖以下功能。

- 通过`create'方法对二进制合同表示进行编码，以便进一步部署。
- 通过`create2`方法编码二进制合同表示，以便进一步部署。
- 为`create`和`create2`方法预先计算合同地址。

结构：只需要web3对象和附加的zksync模块。

Example:

```python
from zksync2.manage_contracts.contract_deployer import ContractDeployer
from zksync2.module.module_builder import ZkSyncBuilder

zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")
deployer = ContractDeployer(zksync_web3)
```

**Parameter and Methods:**

| Method                     | Parameters                                 | Return value | Description                                                                                                                                                                                                                                                   |
| -------------------------- | ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| encode_create              | bytecode, optional `call_data` & `salt`    | HexStr       | Creates binary representation of a contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.                 |
| encode_create2             | bytecode, optional `call_data` & `salt`    | HexStr       | Creates binary representation of contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.                   |
| compute_l2_create_address  | Address, Nonce                             | Address      | Accepts address of deployer and current deployed nonce and returns address of contract that is going to be deployed by the`encode_create` method.                                                                                                             |
| compute_l2_create2_address | Address, bytecode, `ctor` bytecode, `salt` | Address      | Accepts address of the deployer, binary representation of contract, it's constructor in binary format and salt. By default constructor can be `b'0'` value. It returns the address of the contract that is going to be deployed by an`encode_create2` method. |
