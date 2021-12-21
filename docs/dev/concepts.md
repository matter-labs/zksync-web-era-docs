# Intro to zkSync

This page aims to introduce developers to the basic concepts behind zkSync, including topics ranging from the basics of ZK Rollups, L1 and L2 chains, and key differences in developing using zkSync over other scaling solutions.

## What are ZK Rollups?

ZK Rollups ('ZK' standing for zero-knowledge) are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many transactions up into a single batch, and sending it to the main Ethereum chain for processing in one action. In zkSync, this is done via a **SNARK** (succinct non-interactive argument of knowledge); a cryptographic proof that performs the validation of transactions coming from the batch.

With ZK Rollups, funds are locked into the layer 1 blockchain via a smart contract. This allows transactions to be processed without the overhead of all the data typically associated with performing a transaction on the main chain, only requiring a **validity proof** to reach transaction finality. This significantly decreases associated transaction processing times and gas fees.

## L1 and L2: what's the difference?

In decentralised ecosystems, the term **layer 1** (or **L1**) is used to refer to the underlying primary chain architecture, such as the Ethereum network or Bitcoin. Layer 1 blockchains determine protocol rules, process transaction finality, and perform the base-level functions of applications built upon them.

**Layer 2** (or **L2**) is used to describe an overlaying application or network that operates on top of the layer 1 chain. These are most often built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the layer-1 chain, quickening transaction times and lower gas fees.

In the case of zkSync, the main Ethereum blockchain represents L1, and zkSync itself is the L2.

## How does transaction finality work?

In the context of blockchain technology, **transaction finality** refers to the guarantee that transactions cannot be reverted, altered or muted.

For instance, on Ethereum finality is probabilistic, i.e. the more blocks has passed since the transaction was processed, the lesser the chance that this transaction will be reverted.

In ZK Rollups, once a block has been filled and sealed, its state is committed to the main Ethereum chain. The proving step is then initiated, and a SNARK validity proof is generated for all of the block transactions. Once completed, the SNARK is submitted for verification on the L1 smart contract, and after being verified, the transaction state becomes final.

On zkSync, each transaction is one of the four stages:

- `Pending`. The transaction was received by the operator, but it has not been processed yet.
- `Processed`. The transaction is proceesed by the server and is confirmed to be included in the next block.
- `Committed`. The transaction state diffs were published on Ethereum.
- `Finalized`. The SNARK validity proof has been submitted and verified by the smart contract. After this step, the transaction is considered to be final.

Note that _finality_ from the zkSync perspective happens when the transaction (the SNARK verification) is processed by L1. At this stage the guarantees are exactly like any other L1 transaction within the same L1 block, which means that the more L1 blocks generated afterwards, the lesser the chance that this transaction will be reverted.

At the moment, when a user sends a transaction, zkSync waits for the entire block to be filled, meaning finality time may take longer depending on the volume of transactions being submitted via zkSync. As thoroughput increases, the finality time will subsequently decrease. The typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours.

Please note, that for developer convenience, we will usually treat the `Processed` and `Committed` states as a single stage since they have no difference from the UX/DexEx standpoints.

## What are operators?

**Operators** are the actors that perform basic zkSync functionalities. They are charged with creating blocks, bundling the transactions, performing the calculations and submitting the data to the main Ethereum chain for verification.

## Who creates blocks in ZK Rollups?

As stated above, blocks are created by the operators. At this time zkSync is solely run and operated by the zkSync team's servers, and is therefore centralised; however, this is intended to be transitioned to a decentralised system in the near future.

## What is the native token of zkSync?

zkSync has no "native" token and the fees can be paid in ERC20 tokens. In order to allow easy and secure bridging of ERC20 tokens between layer 1 and layer 2, zkSync provides a canonical bridge within its smart contract. Tokens, which are bridged this way have the same address on zkSync as on layer 1 and all of them have the same standard ERC20 smart contract code on layer 2.

We call such tokens _native_ or _first-class citizen_, since they are managed on the protocol level. Anyone can, in a permissionless way, add a new native token to zkSync. Thus, even though technically any of these tokens can be used to pay transaction fees, the operator may decide which of the tokens it wants to accept for fee payment, removing the chance of exploitation using worthless, recently created ERC20 tokens.

## What transaction types does zkSync support?

zkSync supports 5 types of transactions.

The ones that can only be enacted from layer 1 are:

- `Deposit`. This operation moves funds from an L1 account to an L2 account.
- `AddToken`. This operation registers a native ERC20 token to zkSync. You can learn more about native ERC20 tokens [here](./concepts.md#what-is-the-native-token-of-zksync).

The ones that can be enacted from both layer 1 and layer 2 are:

- `Deploy`. This operation stores the bytecode of the contract in the zkSync network and assigns it an address
  through which the contract can be accessed.
- `Execute`. This operation executes a smart contract method.
- `Withdraw`. This operation moves funds from an L2 account to an L1 account. _Most likely will be replaced with a special `Execute` call soon._

## zkRollup vs ZK Rollup

There are different acronyms for Zero-Knowledge Rollups, so both are interchangeable. In the context of zkSync 2.0, we will use the word zkRollup to refer to accounts that will have their data availability secured by Ethereum, unlike the zkPorter accounts, which will have their data secured by a separate decentralized network of guardians.

## What is zkPorter?

zkPorter is an extension of the zkSync protocol, which just like zkRollup is secured by validity proofs, but unlike zkRollup it does not store data on chain. Instead, the data is held by separate decentralized network of guardians. Without the need to publish data on Ethereum, zkPorter provides transaction fees of a few cents for its users, while maintaining security guarantees much stronger than sidechains.

The key point is that the zkRollup shard and the zkPorter shard of zkSync will be composable, e.g. smart contracts from one shard will be able to call smart contracts in the other one.
