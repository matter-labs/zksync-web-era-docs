# Introduction to zkSync

## Perequisite

If you are unfamiliar with rollups, you should cover the [rollups basics](./rollups.md) and read about zk rollups and optimistic rollups, before learning about zkSync.
<<<<<<< HEAD

=======
>>>>>>> 5ca676d (update glossary contents)

**zkSync** is a [ZK rollup](./rollups.md) trustless protocol that utilises zero-knowledge proofs to provide scalable low-cost transactions on Ethereum. 
zkSync ensures that all assets are stored in a single smart contract on the mainchain, while computation and storing data are performed off-chain. As all transactions are proven on the Ethereum mainchain, users enjoy the same security level as in Ethereum.

zkSync 2.0 is made to look and feel like Ethereum, but with lower fees. Just like on Ethereum, smart contracts are written in Solidity/Vyper and can be called using the same clients as the other EVM-compatible chains.

zkSync 2.0 doesn't require you to register a separate private key to use before usage, it supports existing Ethereum wallets which work out of the box.


At this time zkSync is solely run and operated by the zkSync team's servers, and is therefore centralized; however, this will be be transitioned to a decentralized system in the near future.

## zkSync in comparison

zkSync [stands out remarkably](https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955) in security and usability among existing L2 scaling solutions. 
Thanks to the combination of cutting-edge cryptography and on-chain data availability, zkRollup (the core network of zkSync) is the only L2 scaling solution that doesn't require any operational activity to keep the funds safe. 
<<<<<<< HEAD

=======
>>>>>>> 5ca676d (update glossary contents)
For example, users can go offline and still be able to withdraw their assets safely when they come back, even if the zkRollup validators are no longer around.

In the following sections we will cover some attributes of zkSync.

## Transaction types

zkSync supports Ethereum's "legacy" (pre-EIP2718) transaction types, EIP1559 transaction type, and its custom EIP712 transactions. You can use transactions of this type to use zkSync-specific features like account abstraction. 
Additionally, it is only possible to deploy smart contracts with this type of transaction.

Knowing the details about the transaction format is not required to use zkSync's SDK, but if you are curious, you can read more about it [here](../../api/api.md#eip712).


## Confirmations and finality

On zkSync, each transaction is at one of the four stages:

- `Pending`: The transaction was received by the operator, but it has not been processed yet.
- `Processed`: The transaction is processed by the operator and is confirmed to be included in the next block.
- `Committed`: The transaction state diffs were published on Ethereum.
- `Finalized`: The SNARK validity proof for the transaction has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours at the current stage.

Please note that for developer convenience, we usually treat the `Processed` and `Committed` states as a single stage called `Committed` since they have no difference from the UX/DexEx standpoints.


## zkSync features

- ETH and ERC20 token transfers with instant confirmations and 10-minute finality on L1
- Transaction fees are extremely low (1/100th of the mainnet cost for ERC20 tokens and 1/30th for ETH transfers).
- No registration is required to receive funds.
- Payments to existing Ethereum addresses (including smart contracts) can be conveniently paid with the token being transferred.
- Withdrawals to the mainnet take ~10 minutes.
- As with the Ethereum mainnet, no third parties are needed to keep funds safe.
- Users are always in control of their funds.
- zkSync is smart-contract friendly; it allows you to reuse existing Solidity code.
- zkSync is friendlier for exchanges.
- zkSync has native support for NFTs.
- There is no requirement for an operational activity to keep the funds safe.

### zkSync 2.0 highlights

- Mainnet-like security with zero reliance on 3rd parties.
- Permissionless EVM-compatible smart contracts.
- Standard Web3 API.
- Preserving key EVM features, such as smart contract composability.
- Introducing new features, such as account abstraction and meta-transactions.

### How to get started?

- Begin by building a dApp in the [quickstart section](../../developer-guides/hello-world.md)
- See the info on RPC nodes, wallet, block explorer on the [important links](../troubleshooting/important-links.md) page.