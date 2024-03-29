---
head:
  - - meta
    - name: "twitter:title"
      content: Python SDK Contract | zkSync Docs
---

# Contract Interfaces

There is a set of system contract that helps with the interaction with zkSync Era network. Most of them are called using abi.

#### Example

```python
from web3 import Web3

from zksync2.manage_contracts.utils import zksync_abi_default
from zksync2.module.module_builder import ZkSyncBuilder

zksync = ZkSyncBuilder.build(self.env.zksync_server)
zksync_contract = self.eth_web3.eth.contract(Web3.to_checksum_address(zksync.zksync.main_contract_address), abi=zksync_abi_default())
```

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

| Method                     | Parameters                                 | Return value | Description                                                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| encode_create              | bytecode, optional `call_data` & `salt`    | HexStr       | Creates binary representation of a contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.               |
| encode_create2             | bytecode, optional `call_data` & `salt`    | HexStr       | Creates binary representation of contract in an internal deploying format.<br/> bytecode - contract binary representation, `call_data` is used for `ctor` bytecode only, `salt` is used to generate unique identifier of deploying contract.                 |
| compute_l2_create_address  | Address, Nonce                             | Address      | Accepts address of deployer and current deployed nonce and returns address of contract that is going to be deployed by the`encode_create` method.                                                                                                            |
| compute_l2_create2_address | Address, bytecode, `ctor` bytecode, `salt` | Address      | Accepts address of the deployer, binary representation of contract, its constructor in binary format and salt. By default constructor can be `b'0'` value. It returns the address of the contract that is going to be deployed by an`encode_create2` method. |
