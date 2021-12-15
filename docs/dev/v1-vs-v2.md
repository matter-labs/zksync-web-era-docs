# Comparing zkSync 1.x and zkSync 2.0

## Overview

zkSync 1.x is the previous iteration of zkSync which has been on mainnet for over a year. It supports cheap transfers, swaps, nft minting & trading. If you don't have any experience with zkSync 1.x, there is no need to worry as it is not needed to use zkSync 2.0, you should go to the [comparison with Ethereum](./ethereum-vs-v2.md) or go through the [list](./tutorials.md) of comprehensive tutorials.

The first and the most noticeable difference is, of course, smart contract support. zkSync 2.0 is capable of deploying and executing arbitrary smart contracts compiled from Solidity (currently only Solidity v0.8.x is supported).

However, to make the protocol work with smart contracts, we've had to rework the basics of protocol and
implement many new things. Apart from the smart contracts, differences include:

- **zkSync 2.0 natively supports ECDSA signatures.** It means, that `ChangePubKey` operation is no longer
  required, any account can be managed in L2 with the same private key that is used for L1.
- **Most operations in zkSync 2.0 can be called from both L1 and L2 (not implemented yet).** It means, you can request a withdrawal of funds
  without dealing with L2 transactions, or call a transfer in L2 from L1.
- **Exodus mode was replaced with Priority mode.** Priority mode is a mode where blocks can still be generated in L2, but
  may only consist of requests initiated from L1. Unlike exodus mode, priority mode is not eternal: rollup can continue
  operating once it satisfies all the priority requests received from L1.
- **Smart contract-centric model made it possible to implement a full fledged Web3 API.** zkSync network can be accessed by
  any Web3-compatible client. Though there are [some](./ethereum-vs-v2.md) differences.
- **There are no account IDs and token IDs.** Everything is accessed using Ethereum addresses, just like in L1.
- **There is no limit on the number of native tokens.** Any valid ERC20 token can be added to the zkSync 2.0 as a first-class citizen
  token.
