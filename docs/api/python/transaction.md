## Transactions (WIP)

zkSync交易与基于Web3的交易非常相似。<br>
交易被定义在软件包中: `zksync2.module.request_type`<br>

为了发送和签署交易，有必要在 "EIP712 "结构中签署和编码。.<br>
EIP712交易类型可以在软件包中找到: `zksync2.transaction.transaction712`

为了将普通交易转换为 "EIP712 "类型，有一些定义的辅助类。

- TxFunctionCall : 将合同作为一个签名的交易进行部署。
- TxCreateContract :
- TxCreate2Contract :

## TxFunctionCall

## TxCreateContract

## TxCreate2Contract

