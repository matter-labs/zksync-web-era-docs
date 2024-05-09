---
head:
  - - meta
    - name: "twitter:title"
      content: Contract Deployment | zkSync Docs
---

# Contract Deployment

In order to maintain the same level of security as the L1, the zkSync operator is required to publish the code for each contract it deploys on the Ethereum chain. However, if multiple contracts are deployed using the same code, the operator only needs to publish it on Ethereum once. While the initial deployment of contracts can be relatively expensive, utilizing contract factories that deploy contracts with the same code multiple times can lead to huge savings compared to the L1.

These specific requirements ensure that the process of deploying smart contracts on zkEVM complies to a crucial rule: _the operator must be aware of the contract's code before deployment_. Consequently, deploying contracts can only be accomplished through EIP712 transactions, with the `factory_deps` field containing the bytecode provided.

[Learn more about EIP712 transactions here](../../zk-stack/concepts/transaction-lifecycle.md#eip-712-0x71).

## Ethereum / zkSync differences in contract deployment

**How deploying contracts works on Ethereum.**

To deploy a contract on Ethereum, a user sends a transaction to the zero address (`0x000...000`) with the `data` field of the transaction equal to the contract bytecode concatenated with the constructor parameters.

**How deploying contracts works on zkSync.**

To deploy a contract on zkSync Era, a user calls the `create` function of the [ContractDeployer system contract](./system-contracts.md#contractdeployer) providing the hash of the contract to be published, as well as the constructor arguments. The contract bytecode itself is supplied in the `factory_deps` field of the transaction (as it's an [EIP712 transaction](../../zk-stack/concepts/transaction-lifecycle.md#eip-712-0x71)). If the contract is a factory (i.e. it can deploy other contracts), these contracts' bytecodes should be included in the `factory_deps` as well.

We recommend using the [hardhat-zksync-deploy](../tooling/hardhat/getting-started.md) plugin, to simplify the deployment process. It provides classes and methods to take care of all the deployment requirements, like generating the [bytecode hash of the contract](#contract-size-limit-and-format-of-bytecode-hash).

Here's a [step-by-step guide on how to use it](../tooling/hardhat/getting-started.md).

### Note on `factory_deps`

You might wonder how validators obtain the preimage of the bytecode hashes necessary to execute the code. This is where the concept of factory dependencies, or factory_deps for short, comes into play. Factory dependencies refer to a list of bytecode hashes whose corresponding preimages were previously revealed on the L1 (where data is always available).

Under the hood, zkSync does not store bytecodes of contracts in its state tree, but [specially formatted hashes of the bytecodes](#contract-size-limit-and-format-of-bytecode-hash). You can see that the [ContractDeployer](./system-contracts.md#contractdeployer) system contract accepts the bytecode hash of the deployed contract and not its bytecode. However, for contract deployment to succeed, the operator needs to know the bytecode. The `factory_deps` field of the transaction is used for this reason: it contains the bytecodes that should be known to the operator for this transaction to succeed. Once the transaction succeeds, these bytecodes are published on L1 and are considered "known" to the operator forever.

Some examples of usage are:

- The obvious one is when you deploy a contract, you need to provide its code in the `factory_deps` field.
- On zkSync, factories (i.e. contracts that can deploy other contracts) do not store bytecodes of their dependencies, i.e. contracts that they can deploy. They only store their hashes. That's why you need to include _all_ the bytecodes of the dependencies in the `factory_deps` field.

Both of these examples are already seamlessly done under the hood by our [hardhat-zksync-deploy](../tooling/hardhat/getting-started.md).

Note that the factory deps do not necessarily have to be used by the transaction in any way. These are just markers that these bytecodes should be published on L1 with this transaction. If your contract contains a lot of various factory dependencies and they do not fit inside a single L1 block, you can split the list of factory dependencies between multiple transactions.

For example, let's say that you want to deploy contract `A` which can also deploy contracts `B` and `C`. This means that you will have three factory dependencies for your deployment transaction: `A`,`B` and `C`. If the pubdata required to publish all of them is too large to fit into one block, you can send a dummy transaction with only factory dependencies `A` and `B` (assuming their combined length is small enough) and do the actual deploy with a second transaction while providing the bytecode of contract `C` as a factory dependency for it. Note that if some contract _on its own_ is larger than the allowed limit per block, this contract has to be split into smaller ones.

### Contract size limit and format of bytecode hash

Each zkEVM bytecode must adhere to the following format:

- Its length must be divisible by 32.
- Its length in words (32-byte chunks) should be odd. In other words, `bytecodeLength % 64 == 32`.
- There is a VM limit, the bytecode can not be more than `2^16` 32-byte words, i.e. `2^21` bytes.
- The bootloader has a memory limit for supplying pubdata of 450999 bytes, therefore limiting the contract size to it as well. This limit is valid for Validium hyperchains, that don’t have to publish the bytecode to the base layer.
- For rollups that must publish the deployed bytecode to the base layer (e.g. Ethereum), there is an additional pubdata limit, which is normally smaller. By default, for each batch, this limit is set to 100000 bytes for hyperchains using calldata DA, or 120000\*number_of_blobs, for hyperchains using EIP-4844 blobs.

The 32-byte hash of the bytecode of a zkSync contract is calculated in the following way:

- The first 2 bytes denote the version of bytecode hash format and are currently equal to `[1,0]`.
- The second 2 bytes denote the length of the bytecode in 32-byte words.
- The rest of the 28-byte (i.e. 28 low big-endian bytes) are equal to the last 28 bytes of the `sha256` hash of the contract's bytecode.

## Smart contract security

Smart contract security is critical. A single vulnerability in a smart contract can lead to loss of funds. Make sure your contracts are secure against common threats.

A common Solidity smart contract attack is reentrancy. This threat exploits vulnerabilities in contract code that allow an attacker to repeatedly call a function that withdraws funds.

Auditing smart contracts for security holes prevents theft and other malicious activities. An audit involves a thorough review of the contract's code and its underlying logic to identify any vulnerabilities or weaknesses that could be exploited by attackers. Auditors look for things like buffer overflows, integer overflows, and other types of security issues that can lead to the loss of assets or other unwanted outcomes. This review process should include both manual and automated testing to ensure that all vulnerabilities are identified.

The process of auditing a smart contract should be carried out by experts who have the necessary knowledge and experience to identify potential security risks. Investing in a thorough audit can help prevent security breaches and protect investors and users from losses, reputation damage, and legal issues. Therefore, it's essential to prioritize smart contract security and take proactive measures to ensure that they are thoroughly audited for security holes before deploying your smart contract on zkSync Era network.

For detailed information on smart contract vulnerabilities and security best practices, refer to the following resources:

- [Cyfrin Updraft Security & Auditing Curriculum](https://updraft.cyfrin.io/courses/security).
- [Consensys smart contract best practices](https://consensys.github.io/smart-contract-best-practices/).
- [Solidity docs security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html).
- [Security considerations and best practices on zkSync](../quick-start/best-practices.md)

### Differences in `create()` behaviour

To facilitate [support for account abstraction](../developer-reference/account-abstraction.md), zkSync splits the nonce of each account into two parts: the deployment nonce and the transaction nonce. The deployment nonce represents the number of contracts the account has deployed using the `create()` opcode, while the transaction nonce is used for protecting against replay attacks for transactions.

This distinction implies that, while the nonce on zkSync behaves similarly to Ethereum for smart contracts, calculating the address of a deployed contract for externally owned accounts (EOAs) is not as straightforward.

On Ethereum, it can be safely determined using the formula `hash(RLP[address, nonce])`. However, on zkSync, it is advisable to wait until the contract is deployed and catch the `ContractDeployed` event emitted by the [ContractDeployer](./system-contracts#contractdeployer), which provides the address of the newly deployed contract. The SDK handles all of these processes in the background to simplify the workflow.

To have a deterministic address, you should use the `create2` method from [ContractDeployer](./system-contracts.md#contractdeployer). It is available for EOAs as well.

## Deploying contracts from L1

Deploying contracts on zkSync Era is also possible via L1-L2 communication.

The [interface](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/zksync/interfaces/IZkSync.sol) for submitting L1->L2 transactions accepts the list of all the factory dependencies required for this particular transaction. The logic for working with them is the same as for the default L2 deployments. The only difference is that since the user has already published the full preimage for the bytecodes on L1, there is no need to publish these bytecodes again on L1.

To learn more about L1-L2 communication on zkSync Era, visit [this section of the docs](../developer-reference/l1-l2-interop.md).
