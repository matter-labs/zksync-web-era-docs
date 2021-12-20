# Intro to zkSync

This page aims to introduce developers to the basic concepts behind zkSync, including topics ranging from the basics of zkRollups, L1 and L2 chains, and key differences in developing using zkRollups over other scaling solutions.

## What are zkRollups?

zkRollups ('zk' standing for zero-knowledge) are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many transactions up into a single batch, and sending it to the main Ethereum chain for processing in one action. In zkSync, this is done via a **SNARK** (succinct non-interactive argument of knowledge); a cryptographic proof that performs the validation of transactions coming from the batch.

With zkRollups, funds are locked into the layer 1 blockchain via a smart contract. This allows transactions to be processed without the overhead of all the data typically associated with performing a transaction on the chain, only requiring a **validity proof** to reach transaction finality. This exponentially decreases associated transaction processing times and gas fees.

## L1 and L2: what's the difference?
In decentralised ecosystems, the term **layer 1** is used to refer to the underlying primary chain architecture, such as the Ethereum network or Bitcoin. Layer 1 blockchains determine protocol rules, process transaction finality, and perform the base-level functions of applications built upon them.

**Layer 2** is used to describe an overlaying application or network that operates on top of the layer 1 chain. These are developed by third parties and are most often are built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the layer-1 chain, quickening transaction times and lower gas fees.

In the case of zkSync, the main Ethereum blockchain represents L1, and zkSync itself is the L2.

## How does transaction finality work?
In the context of blockchain technology, **transaction finality** refers to the guarantee that all transactions and blocks that are processed cannot be reverted, altered or muted. 

For instance, on Ethereum finality is probabilistic, i.e. the more blocks has passed since the transaction was processed, the lesser the chance that this transaction will be reverted.

Once a block has been filled and sealed, its state is committed to the main Ethereum chain. The proving step is then initiated, and a SNARK validity proof is generated for all the block transactions. Once completed, the SNARK is submitted for verification on the L1 smart contract, and after being verified, the transaction state becomes final.

On zkSync finality of a block of transaction is defined by either of the three stages:

- `Processed`. The transaction is proceesed by the server and is confirmed to be included in the next block.
- `Committed`. The transaction state diffs were published on Ethereum.
- `Finalized`. The SNARK validity has been submitted. After this step, the transaction is considered to be final. Please note that since zkSync is layer 2 over Ethereum, you should also wait until the finalization transaction becomes final on Ethereum as well.

At the moment, when a user sends a transaction, zkSync waits for the entire block to be filled, meaning finality time may take longer depending on the volume of transactions being submitted via zkSync. As thoroughput increases, the finality time will subsequently decrease. So the typical time for a transaction to go from `Processed` to `Finalized` is a couple of hours.

Please note, that for developer convenience, we will usually treat the `Processed` and `Committed` states as a single stage since they have no different from the UX/DexEx standpoints.

## What are operators?

**Operators** are the actors that perform basic zkSync functionalities. They are charged with creating blocks, bundling the transactions, performing the calculations and submitting the data to the main Ethereum chain for verification. Operators are required to stake a bond in the rollup contract in order to incentivize operators to verify and execute transactions correctly, at risk of financial penalization.

## Who creates blocks in zkRollups?

As stated above, blocks are created by the operators. At this time zkSync is solely run and operated by the zkSync team's servers, and is therefore centralised; however, this is intended to be transitioned to a decentralised system in the near future.

## What is the native token of zkSync?

zkSync has no "native" token and the fees can be paid in ERC20s. In order to allow easy and secure bridging of ERC20 tokens between layer 1 and layer 2, zkSync provides a canonical bridge within its smart contract. Tokens, which are bridged this way have the same address on zkSync as on layer 1 and all of them have the same standard ERC20 smart contract code on layer 2. 

We will call such tokens *native* or *first-class citizen*, since they are managed on the protocol level. Anyone can in a permissionless way add a new native token to zkSync. Thus, even though technically any of these tokens can be used to pay transaction fees, the operator may decide which of the tokens it wants to accept for fee payment, removing the chance of exploitation using worthless, recently created ERC20 tokens.

## What is zkPorter?

zkPorter is an extension of the zkSync protocol, which is just like zkRollups is secured by the validity proofs, but unlike zkRollups uses a separate decentralized network of guardians to secure data availability. Without the need to publish data on Ethereum, zkPorter will provide transaction fees of a few cents for its users, while maintaining security guarantees much stronger than sidechains.

The key point is that zkRollup part and the zkPorter parts of zkSync will be completely composable, e.g. smart contracts from one shard will be able to call smart contracts in the other one. 
