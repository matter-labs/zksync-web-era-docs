# Web3 API

zkSync fully supports the standard [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API), but it also has some additional L2-specific functionality.

As long as the code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](../../api/api.md#eip712)), _no changes to the codebase are needed._

You may continue using the SDKs that you use now. The UX will be identical to the one on Ethereum.

For deploying smart contracts or enabling the unique zkSync features for users (e.g. account abstraction), using the EIP712 transaction type is required.

A more detailed description of the zkSync JSON-RPC API can be found [here](../../api/api).
