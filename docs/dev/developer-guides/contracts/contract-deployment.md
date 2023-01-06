# Contract deployment

To maintain the same security as in L1, the zkSync operator must publish on the Ethereum chain the code for each contract it deploys. However, if there are multiple contracts deployed with the same code, it will only publish it on Ethereum once. While deploying contracts for the first time may be relatively expensive, factories, which deploy contracts with the same code multiple times, can have huge savings compared to L1.

All these specifics make the process of deploying smart contracts on zkEVM comply with the major rule: _The operator should know the code of the contract before it is deployed_. This means that deploying contracts is only possible via `EIP712` transactions with the `factory_deps` field containing the supplied bytecode.

[Learn more about EIP712 transactions here](../../../api/api.md#eip712).

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Ethereum / zkSync differences

**How deploying contracts works on Ethereum.**

To deploy a contract on Ethereum, a user sends a transaction to the zero address (`0x000...000`) with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.

**How deploying contracts works on zkSync.**

To deploy a contract on zkSync 2.0, a user calls the `create` function of the [ContractDeployer system contract](./system-contracts.md#contractdeployer) providing the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the `factory_deps` field of the transaction (as it's an [EIP712 transaction](../../../api/api.md#eip712)). If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.

We recommend using the [hardhat-zksync-deploy](../../../api/hardhat) plugin, to simplify the deployment process. It provides classes and methods to take care of all the deployment requirements, like generating the [bytecode hash of the contract](#format-of-bytecode-hash).

Here's a [step-by-step guide on how to use it](../../../api/hardhat/getting-started.md).

### Note on `factory deps`

Under the hood, zkSync does not store bytecodes of contracts, but [specially formatted hashes of the bytecodes](#format-of-bytecode-hash). You can see that even the [ContractDeployer](./system-contracts.md#contractdeployer) system contract accepts the bytecode hash of the deployed contract and not its bytecode. However, for contract deployment to succeed, the operator needs to know the bytecode. Exactly for this reason the `factory_deps` (i.e. factory dependencies) field for transactions is used: it contains the bytecodes that should be known to the operator for this transaction to succeed. Once the transaction succeeds, these bytecodes will be published on L1 and will be considered "known" to the operator forever.

Some examples of usage are:

- The obvious one is when you deploy a contract, you need to provide its code in the `factory_deps` field.
- On zkSync, factories (i.e. contracts that can deploy other contracts) do not store bytecodes of their dependencies, i.e. contracts that they can deploy. They only store their hashes. That's why you need to include _all_ the bytecodes of the dependencies in the `factory_deps` field.

Both of these examples are already seamlessly done under the hood by our [hardhat-zksync-deploy](../../../api/hardhat/getting-started.md).

Note, that the factory deps do not necessarily have to be used by the transaction in any way. These are just markers that these bytecodes should be published on L1 with this transaction. If your contract contains a lot of various factory dependencies and they do not fit inside a single L1 block, you can split the list of factory dependencies between multiple transactions.

For example, let's say that you want to deploy contract `A` which can also deploy contracts `B` and `C`. This means that you will have three factory dependencies for your deployment transaction: `A`,`B` and `C`. If the pubdata required to publish all of them is too large to fit into one block, you can send a dummy transaction with only factory dependencies `A` and `B` (assuming their combined length is small enough) and do the actual deploy with a second transaction while providing the bytecode of contract `C` as a factory dependency for it. Note, that if some contract _on its own_ is larger than the allowed limit per block, this contract has to be split into smaller ones.

### Format of bytecode hash

Each zkEVM bytecode must adhere to the following format:

- Its length must be divisible by 32.
- Its length in words (32-byte chunks) should be odd. In other words, `bytecodeLength % 64 == 32`.
- It can not be longer than `2^16` 32-byte words, i.e. `2^21` bytes.

The 32-byte hash of the bytecode of a zkSync contract is calculated in the following way:

- The first 2 bytes denote the version of bytecode hash format and are currently equal to `[1,0]`.
- The second 2 bytes denote the length of the bytecode in 32-byte words.
- The rest of the 28-byte (i.e. 28 low big-endian bytes) are equal to the last 28 bytes of the `sha256` hash of the contract's bytecode.

### Differences in `CREATE` behaviour

For the ease of [supporting account abstraction](../../developer-guides/aa.md), for each account, we split the nonce into two parts: _the deployment nonce_ and _the transaction nonce_. The deployment nonce is the number of contracts the account has deployed with `CREATE` opcode, while the transaction nonce is used for replay attack protection for the transactions.

This means that while for smart contracts the nonce on zkSync behaves the same way as on Ethereum, for EOAs calculating the address of the deployed contract is not as straightforward. On Ethereum, it can be safely calculated as `hash(RLP[address, nonce])`, while on zkSync it is recommended to wait until the contract is deployed and catch the `ContractDeployed` event emitted by [ContractDeployer](./system-contracts.md#contractdeployer) with the address of the newly deployed contract. All of this is done in the background by the SDK.

To gain a deterministic address, you should use the `create2` method from [ContractDeployer](./system-contracts.md#contractdeployer). It is available for EOAs as well, but it is not available in the SDK yet.

## Deploying contracts from L1

Deploying contracts on zkSync 2.0 is also possible via L1-L2 communication.

The [interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IMailbox.sol#L78) for submitting L1->L2 transactions accepts the list of all the factory dependencies required for this particular transaction. The logic for working with them is the same as for the default L2 deployments. The only difference is that since the user has already published the full preimage for the bytecodes on L1, there is no need to publish these bytecodes again on L1.

To learn more about L1-L2 communication on zkSync 2.0, visit [this section of the docs](../../developer-guides/bridging/l1-l2.md).
