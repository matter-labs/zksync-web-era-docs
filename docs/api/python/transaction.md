## Transactions (WIP)

zkSync transactions is quite similar to the Web3 based transactions.<br>
Transactions are defined in the package: `zksync2.module.request_type`<br>

For sending and signing transactions it's neccessary to sign and encode it in `EIP712` structure.<br>
The EIP712 transaction type can be found in package: `zksync2.transaction.transaction712`

To convert ordinary transaction to `EIP712` type there are defined helper classes:

- TxFunctionCall : Deploys the contract as a singed transaction.
- TxCreateContract : 
- TxCreate2Contract : 

## TxFunctionCall

## TxCreateContract

## TxCreate2Contract