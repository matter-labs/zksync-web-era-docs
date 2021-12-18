# Conceptual introduction

This page aims to introduce developers to the basic concepts behind zkSync, including topics ranging from the basics of zkRollups, L1 and L2 chains, and key differences in developing using zkRollups over other scaling solutions.

## What are zkRollups?

zkRollups ('zk' standing for zero-knowledge) are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, rolling many transactions up into a single batch, and sending it to the main Ethereum chain for processing in one function. In zkSync, this is done via a **SNARK** (succinct non-interactive argument of knowledge); a cryptographic proof that performs the validation of transactions coming from the batch.

With zkRollups, funds are locked into the layer 1 blockchain via a smart contract. This allows transactions to be processed without the overhead of all the data typically associated with performing a transaction on the chain, only requiring a **validity proof** to reach transaction finality. This exponentially decreases associated transaction processing times and gas fees.

## L1 and L2: what's the difference?
In decentralised ecosystems, the term **layer 1** is used to refer to the underlying primary chain architecture, such as the Ethereum network or Bitcoin. Layer 1 blockchains determine protocol rules, process transaction finality, and perform the base-level functions of applications built upon them.

**Layer 2** is used to describe an overlaying application or network that operates on top of the layer 1 chain. These are developed by third parties and are most often are built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the layer-1 chain, quickening transaction times and lower gas fees.

In the case of zkSync, the main Ethereum blockchain represents L1, and zkSync itself is the L2.

## How does transaction finality work?
In the context of blockchain technology, **transaction finality** refers to the guarantee that all transactions and blocks that are processed cannot be reverted, altered or muted. In the case of zkRollups, this term is generally used in reference to finality rate: the time it takes for a transaction to be processed by the L1 blockchain.

At the moment, when a user sends a transaction, zkSync waits for the entire block to be filled, meaning finality time may take longer depending on the volume of transactions being submitted via zkSync. As thoroughput increases, the finality time will subsequently decrease.

Once a block has been filled and sealed, its state is committed to the main Ethereum chain. The proving step is then initiated, and a SNARK validity proof is generated for all the block transactions. Once completed, the SNARK is submitted for verification on the L1 smart contract, and after being verified, the transaction state becomes final.

## What are operators?

**Operators** are the actors that perform basic zkSync functionalities. They are charged with creating blocks, bundling the transactions, performing the calculations and submitting the data to the main Ethereum chain for verification. Operators are required to stake a bond in the rollup contract in order to incentivize operators to verify and execute transactions correctly, at risk of financial penalization.

## Who creates blocks in zkRollups?

As stated above, blocks are created by the operators. At this time zkSync is solely run and operated by the zkSync team's servers, and is therefore centralised; however, this is intended to be transitioned to a decentralised system in the near future.

## What are First-Class Citizen tokens?

First-Class Citizen tokens -- or 'native' tokens, in the context of zkSync -- are ERC20 tokens that have been approved for fee payments using zkRollups. In standard Ethereum transactions using tokens, an amount of ETH is still required to be within the wallet in order to pay the gas fees. With zkSync and the integration of EIP712, fees can be paid in a pre-approved token, negating the need to have additional ETH present in the wallet. Token options must be submitted and approved by zkSync operators beforehand, ensuring the additional token in question is a valid payment method and removing the chance of exploitation using worthless, recently created ERC20 tokens.
