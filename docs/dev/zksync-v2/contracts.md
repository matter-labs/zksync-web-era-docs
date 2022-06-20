# Contract deployment

To maintain the same security as L1, the zkSync operator must publish the contract code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it needs to be published onchain only once.

While deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: _The operator should know the code of the contract before it is deployed_. That means that deploying contracts is only possible by the means of `EIP712` transactions with the `factory_deps` field containing the supplied bytecode. More on EIP712 transactions [here](../../api/api.md#eip712).

Summary:

- **How deploying contracts works on Ethereum.**
  To deploy a contract, a user sends a transaction to the zero address (`0x000...000`) with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.

- **How deploying contracts works on zkSync.**
  To deploy a contract, a user calls the `create` function of the `DEPLOYER_SYSTEM_CONTRACT` and provides there the hash of the contract to be published as well as the constructor arguments. The contract bytecode itself is supplied in the `factory_deps` field of the EIP712 transactions. If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.

All of the deployment process is handled inside our [hardhat](../../api/hardhat) plugin.

## Differences in `CREATE` behaviour

For the ease of supporting account abstraction, for each account we split the nonce in two parts: *the deployment nonce* and *the transaction nonce*. The deployment nonce is the number of contracts the account has deployed with `CREATE` opcode, while the transaction nonce is used for replay attack protection for the transactions. 

That means, that while for smart contracts the nonce on zkSync behaves the same way as on Ethereum, for EOAs calculating the address of the deployed contract is not as straightforward. On Ethereum, it can be safely calculated as `hash(RLP[address,nonce])`, while on zkSync it is recommended to wait until the contract is deployed and catch the event with the address of the newly deployed contract. All of this is done in the background by the SDK.

In order to gain the deterministic address, you should use `create2`. It is available for EOAs as well, but it is not available in the SDK yet.
