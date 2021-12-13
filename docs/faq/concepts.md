## Conceptual introduction

This page aims to introduce developers to the basic concepts behind zkSync, including topics ranging from the basics of zkRollups, L1 and L2 chains, and key differences in developing using zkRollups over other scaling solutions.

### What are zkRollups?

zkRollups ('zk' standing for zero-knowledge) are a recent development intended to increase the scalability of Ethereum by performing calculations off-chain, bundling together many transactions into a single batch, and sending them to the main Ethereum chain for processing in one action. This is done via a SNARK (succinct non-interactive argument of knowledge); a cryptographic proof that performs the validation of transactions coming from the batch.

With zkRollups, funds are locked into the layer 1 blockchain via a zkRollup smart contract. This allows transactions to be processed without the overhead of all the data typically associated with performing a transaction on the chain, only requiring a *validity proof* to reach transaction finality. This exponentially decreases associated transaction processing times and gas fees.

### L1 and L2: what's the difference?
In decentralised ecosystems, the term **layer 1** is used to refer to the underlying primary chain architecture, such as the Ethereum network or Bitcoin. Layer 1 blockchains determine protocol rules, process transaction finality, and perform the base-level functions of applications built upon them.

**Layer 2** is used to describe an overlaying application or network that operates on top of the layer 1 chain. These are developed by third parties and are most often built to provide further scalability solutions by taking on a portion of transaction-based tasks to lighten the impact on the layer-1 chain to quicken transaction times and lower gas fees.

### How does transaction finality work?
In terms of blockchain, *transaction finality* refers to the guarantee that all transactions and blocks that are processed cannot be reverted, altered or muted. In the case of zkRollups, this is term is generally used in reference to finality rate: the time it takes for a transaction to be processed by the chain. zkRollup technology significantly lowers finality time, thus allowing confirmation to happen far quicker than if they were simply performed on the layer 1 chain.

### Who creates blocks in zkRollups?

### How do zkRollups and Optimistic Rollups differ?

### How does using zkSync differ from developing on a separate chain?

