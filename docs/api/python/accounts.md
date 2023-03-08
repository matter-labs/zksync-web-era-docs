# 账户：概述

zkSync Python SDK，有一些方法来生成签名和验证信息。

`sign_typed_data`：用于签署EIP712类型的zkSync交易。
`verify_typed_data`：用于验证签名的EIP712类型的zkSync事务。

**构建**

为了构建实例，它只需要`account`和`chain_id`。

> Example:

```python
from zksync2.signer.eth_signer import PrivateKeyEthSigner
from eth_account import Account
from zksync2.module.module_builder import ZkSyncBuilder


account = Account.from_key("PRIVATE_KEY")
zksync_web3 = ZkSyncBuilder.build("ZKSYNC_NETWORK_URL")

chain_id = zksync_web3.zksync.chain_id
signer = PrivateKeyEthSigner(account, chain_id)
```

## sign_typed_data

签名者用于根据你的账户（你的私钥）生成所提供交易的签名。

**Parameters**

| Parameters                        | Return value          | Description                                                                 |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------- |
| EIP712 Structure, optional domain | Web3 py SignedMessage | Builds `SignedMessage` based on the encoded in `EIP712` format Transaction. |

## verify_typed_data

它被用来验证所提供的交易，其签名被添加到最终的`EIP712`交易中进行验证。

**Parameters**

| Parameters                                   | Return value | Description                                                                    |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| signature, EIP712 structure, optional domain | bool         | Returns **True** if the encoded transaction is signed with provided signature. |

签名者类也有以下属性。

| Attribute | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| address   | Account address                                                                   |
| domain    | Domain that is used to generate signature. It's depends on `chain_id` of network. |
