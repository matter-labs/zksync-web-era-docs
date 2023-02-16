# Accounts: overview

The zkSync Python SDK, has a few methods to generate signature and verify messages.

`sign_typed_data` : used to sign EIP712-typed zkSync transactions.
`verify_typed_data` : used to verify the signed EIP712-typed zkSync transactions.

**construction**

For constructing the instance it needs only `account` and `chain_id`.

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

The signer is used to generate the signature of the provided transaction based on your account(your private key).

**Parameters**

| Parameters                        | Return value          | Description                                                                 |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------- |
| EIP712 Structure, optional domain | Web3 py SignedMessage | Builds `SignedMessage` based on the encoded in `EIP712` format Transaction. |

## verify_typed_data

It's used to verify the provided transaction, whose signature is added to the final `EIP712` transaction for its validation.

**Parameters**

| Parameters                                   | Return value | Description                                                                    |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| signature, EIP712 structure, optional domain | bool         | Returns **True** if the encoded transaction is signed with provided signature. |

The signer class also has the following properties:

| Attribute | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| address   | Account address                                                                   |
| domain    | Domain that is used to generate signature. It's depends on `chain_id` of network. |
