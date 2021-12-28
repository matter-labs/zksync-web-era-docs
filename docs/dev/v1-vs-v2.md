# Comparing zkSync 1.x and zkSync 2.0

zkSync 1.x is the previous iteration of zkSync which has been on mainnet for over a year. It supports cheap transfers, swaps, NFT minting, and trading. Prior experience with zkSync 1.x is not rrquired for using zkSync 2.0; to get started, review the [comparison with Ethereum](./ethereum-vs-v2.md) page, or go through the [list](./tutorials) of comprehensive tutorials.

The first and the most noticeable difference is, of course, smart contract support. zkSync 2.0 is capable of deploying and executing arbitrary smart contracts compiled from Solidity (currently, only Solidity v0.8.x is supported).

However, to make the protocol work with smart contracts, reworking the basics of protocol and
implementing several new features was required. Apart from the smart contracts, the differences include:

- **zkSync 2.0 natively supports ECDSA signatures.** The `ChangePubKey` operation is no longer
  required, any account can be managed in L2 with the same private key that is used for L1.
- **Most operations in zkSync 2.0 can be called from both L1 and L2 (not implemented yet).** It means you can request a withdrawal of funds
  without dealing with L2 transactions, or call an L2 transfer from L1.
- **There are no account IDs and token IDs.** Everything is accessed using Ethereum addresses, just like in L1. Note that it is not possible to reference tokens by their symbol in our SDK, only by address. The address of `ETH` is `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`.
- **There is no limit on the number of native tokens and adding new tokens is free.** Any valid ERC20 token can be added to the zkSync 2.0 as a first-class citizen token.
- **Exodus mode was replaced with Priority mode.** Priority mode is a mode where blocks can still be generated in L2, but
  may only consist of requests initiated from L1. Unlike exodus mode, priority mode is not eternal: the rollup can continue
  operating once it satisfies all the priority requests received from L1.
- **Smart contract-centric model made it possible to implement a full-fledged Web3 API.** The zkSync network can be accessed by
  any Web3-compatible client. Though there are [some](./ethereum-vs-v2.md) differences.
