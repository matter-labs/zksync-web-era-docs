---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync Era basics | zkSync Era docs
---

# zkSync Era basics

## Prerequisites

If you are unfamiliar with rollups, you should cover the [rollups basics](./rollups.md) and read about ZK rollups and Optimistic rollups, before learning about zkSync.

## Introduction

**zkSync Era** is a [ZK rollup](./rollups.md#what-are-zk-rollups), a trustless protocol that uses cryptographic validity proofs to provide
scalable and low-cost transactions on Ethereum.
In zkSync Era, computation is performed off-chain and most data is stored off-chain as well. As all transactions are proven on the Ethereum
mainchain, users enjoy the same security level as in Ethereum.

zkSync Era is made to look and feel like Ethereum, but with lower fees. Just like on Ethereum, smart contracts are written in Solidity/Vyper and can be called using the same clients as the other EVM-compatible chains.

You don't need to register a separate private key before usage; zkSync supports existing Ethereum wallets out of the box.
At this time, zkSync is solely run and operated by the zkSync team's servers and is therefore centralized. However, this will be transitioned to a decentralized system shortly.

:::tip Gas fees
Layer 2 gas fees depend on the current Ethereum gas fees for publishing and verification.
:::

## zkSync Era overview

The general rollup workflow is as follows:

- Users can receive, deposit, and transfer assets to each other.
- Users can withdraw assets under their control to an L1 address.

Rollup operation requires the assistance of an operator, who rolls transactions together, computes a zero-knowledge proof of the correct state transition, and affects the state transition by interacting with the rollup contract.
To understand the design, we need to look into how zkSync rollup transactions work.

zkSync operations are divided into rollup transactions (initiated inside rollup by a rollup account) and priority operations (initiated on the mainchain by an Ethereum account).

The zkSync rollup operation lifecycles are as follows:

- A user creates a transaction or a priority operation.
- After processing this request, the operator creates a rollup operation and adds it to the block.
- Once the block is complete, the operator submits it to the zkSync smart contract as a block commitment. Part of the logic of some rollup operations is checked by the smart contract.
- The proof for the block is submitted to the zkSync smart contract as block verification. If the verification succeeds, the new state is considered final.

Furthermore, on zkSync, each L2 block will progress through the following four stages until it is final.

- `Pending`: The transaction was received by the operator, but it has not been processed yet.
- `Processed`: The transaction is processed by the operator and is confirmed to be included in the next block.
- `Committed`: This indicates that the transaction data of this block has been posted on Ethereum. It does not prove that it has been executed in a valid way, but it ensures the
  availability of the block data.
- `Finalized`: This indicates that the SNARK validity proof for the transaction has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours at the current stage.

Please note that for developer convenience, we usually treat the `Processed` and `Committed` states as a single stage called `Committed` since they have no difference from the UX/DevEx standpoints.

### The State of zkSync

The current version of zkSync Era solves the needs of most applications on Ethereum, and with more features planned for release soon, zkSync Era will provide developers with a design space to experiment with applications not possible on Ethereum today. With this release, we are supporting the following features:

- Native support of ECDSA signatures: Unlike the first version of zkSync and other ZK rollups, no special operation is required to register the user’s private key. Any account can be managed in L2 with the same private key that is used for L1.
- Solidity 0.8.x support: Deploy your existing codebase with little to no changes required.
- With small exceptions, our Web3 API is fully compatible with Ethereum. This allows seamless integration with existing indexers, explorers, etc.
- Support for Ethereum cryptographic primitives: zkSync natively supports `keccak256`, `sha256`, and `ecrecover` via precompiles.
- Hardhat plugin: Enables easy testing and development of smart contracts on zkSync.
- L1 → L2 smart contract messaging: Allows developers to pass data from Ethereum to smart contracts on zkSync, providing the required information to run various smart contracts.
- Native account abstraction: zkSync Era implements [account abstraction natively](./account-abstraction.md), which brings multiple UX improvements for all accounts.

Some features that will be released in future upgrades:

- zkPorter: One of the largest and most important features, zkPorter will allow users to choose between a zkRollup account featuring the highest security and a 20x fee reduction compared to Ethereum, or a zkPorter account featuring stable transaction fees of just a few cents in a different security model (much higher than that of a sidechain). Both zkPorter and zkRollup accounts will be able to interact seamlessly together under the hood.

## Highlights of zkSync Era

- Mainnet-like security with zero reliance on 3rd parties.
- Permissionless EVM-compatible smart contracts.
- Standard Web3 API.
- Preserving key EVM features, such as smart contract composability.
- Introducing new features, such as account abstraction.

## zkSync in comparison

zkSync [stands out remarkably](https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955) in security and usability among existing L2 scaling solutions.
Thanks to the combination of cutting-edge cryptography and on-chain data availability, ZK rollups (the core network of zkSync) are the only L2 scaling solution that doesn't require any operational activity to keep the funds safe.
For example, users can go offline and still be able to withdraw their assets safely when they come back, even if the ZK rollup validators are no longer around.
For a comprehensive distinction between zkSync Era and Ethereum, read this [guide](../../reference/architecture/differences-with-ethereum.md).

## zkSync Era user experience

- Transactions have instant confirmations and fast finality on L1.
- Transaction fees are extremely low.
- Transaction fees can be conveniently paid with ERC20 tokens (e.g. USDC) thanks to [native account abstraction and paymasters](./account-abstraction.md).
- Support for existing Ethereum-based wallets like Metamask, TrustWallet or Zerion.

## zkSync Era developer experience

- Smart contracts can be written in Solidity or Vyper.
- Most contracts work out of the box so migrating projects is seamless.
- Web3 API compatibility enables support of most developer tools.
- Use existing frameworks like [Hardhat](../../tools/hardhat/README.md) and [Foundry (alpha)](https://github.com/matter-labs/foundry-zksync).
- Compile smart contracts with custom compilers: [zksolc and zkvyper](../../tools/compiler-toolchain/README.md).
- Different [tools for testing locally](../../tools/testing/README.md).

## How to get started?

- Begin by building a dApp in the [quickstart section](../../dev/building-on-zksync/hello-world.md).
- See how to [connect your wallet and interact with zkSync Era](../../dev/building-on-zksync/interacting.md).
