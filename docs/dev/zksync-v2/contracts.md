# Contract deployment

To maintain the same security as L1, the zkSync operator must publish the contract code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it needs to be published onchain only once.

While deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: _The operator should know the code of the contract before it is deployed_. That means that deploying contract is only possible by the means of `EIP712` transactions with the `factory_deps` field containing the supplied bytecode. More on EIP712 transactions [here](../../api/api.md#eip712).

Summary:

- **How deploying contract works on Ethereum.**
  To deploy a contract, a user sends a transaction to the zero address (`0x000...000`) with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.

- **How deploying contract works on zkSync.**
  To deploy a contract, a user sends a transaction to the zero address (`0x000...000`) with the `data` field for the transaction equal to the contract bytecode hash concatenated with the constructor parameters. The contract bytecode itself is supplied in the `factory_deps` field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.

All of the deployment process is handled inside our [hardhat](../../api/hardhat) plugin.
