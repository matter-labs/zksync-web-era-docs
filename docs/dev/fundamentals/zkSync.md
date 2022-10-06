# Introduction to zkSync

## Prerequisites

If you are unfamiliar with rollups, you should cover the [rollups basics](./rollups.md) and read about zk rollups and optimistic rollups, before learning about zkSync.

**zkSync** is a [ZK rollup](./rollups.md) trustless protocol that utilizes zero-knowledge proofs to provide scalable low-cost transactions on Ethereum. 
zkSync ensures that all assets are stored in a single smart contract on the mainchain, while computation and storing data are performed off-chain. As all transactions are proven on the Ethereum mainchain, users enjoy the same security level as in Ethereum.

zkSync 2.0 is made to look and feel like Ethereum, but with lower fees. Just like on Ethereum, smart contracts are written in Solidity/Vyper and can be called using the same clients as the other EVM-compatible chains.

zkSync 2.0 doesn't require you to register a separate private key to use before usage, it supports existing Ethereum wallets that work out of the box.


At this time zkSync is solely run and operated by the zkSync team's servers, and is therefore centralized; however, this will be transitioned to a decentralized system in the near future.

## zkSync in comparison

zkSync [stands out remarkably](https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955) in security and usability among existing L2 scaling solutions. 

## Confirmations and finality

On zkSync, each transaction is at one of the four stages:

- `Pending`: The transaction was received by the operator, but it has not been processed yet.
- `Processed`: The transaction is processed by the operator and is confirmed to be included in the next block.
- `Committed`: It indicates that the transaction data of this block has been posted on Ethereum. It does not prove that it has been executed in a valid way, but it ensures the availability of the block data.
- `Finalized`: This indicates that the SNARK validity proof for the transaction has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours at the current stage.

Please note that for developer convenience, we usually treat the `Processed` and `Committed` states as a single stage called `Committed` since they have no difference from the UX/DexEx standpoints.


## zkSync features

- ETH and ERC20 token transfers with instant confirmations and fast finality on L1
- Transaction fees are extremely low for the mainnet cost for ERC20 tokens and that of ETH transfers.
- Payments to existing Ethereum addresses (including smart contracts) can be conveniently paid with the token being transferred.

### zkSync 2.0 highlights

- Mainnet-like security with zero reliance on 3rd parties.
- Permissionless EVM-compatible smart contracts.
- Standard Web3 API.
- Preserving key EVM features, such as smart contract composability.
- Introducing new features, such as account abstraction.

### How to get started?

- Begin by building a dApp in the [quickstart section](../../developer-guides/hello-world.md)
- See the info on RPC nodes, wallet, and block explorer on the [important links](../troubleshooting/important-links.md) page.