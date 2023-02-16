# Contract interfaces

There is a set of system contract that helps with the interaction with zkSync Era network.<br>
The following are the contracts:

- NonceHolder
- ERC20Contract & ERC20FunctionEncoder
- ContractDeployer




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

| Method                     | Parameters | Return value | Description                                                           |
| -------------------------- | ---------- | ------------ | --------------------------------------------------------------------- |
| get_account_nonce          | -          | Nonce        | Returns account nonce.                                                |
| get_deployment_nonce       | -          | Nonce        | Return the current deployment nonce that is going to be used.         |
| increment_deployment_nonce | Address    | Nothing      | Manually increments deployment nonce by the provided account address. |

### ERC20Contract

This is system contract that is used internally as a part of the implementation methods of `EthereumProvider`<br>

More interested type include the `ERC20FunctionEncoder`. it's used to provide method encoding in the case of sending non-native tokens inside the network.

Construction needs only Web3 object with appended zksync module(ZkSyncBuilder)

It has only 1 single method: `python encode_method` with arguments of function name, and it's args

### ContractDeployer

ContractDeployer is a utility system contract, represented as a type to cover the following functionality:

- encode binary contract representation by `create` method for further deploying.
- encode binary contract representation by `create2` method for further deploying.
- Precompute contract address for `create` and `create2` methods.

Construction: needs only web3 object with appended zksync module

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
