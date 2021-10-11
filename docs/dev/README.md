# Introduction to zkSync for Developers

## Overview

zkSync is a scaling and privacy engine for Ethereum. Its current functionality scope includes low gas transfers of ETH
and ERC20 tokens in the Ethereum network, atomic swaps & limit orders as well as native L2 NFT support. This document is a high-level description of the zkSync development ecosystem.

zkSync is built on ZK Rollup architecture. ZK Rollup is an L2 scaling solution in which all funds are held by a smart
contract on the mainchain, while computation and storage are performed off-chain. For every Rollup block, a state
transition zero-knowledge proof (SNARK) is generated and verified by the mainchain contract. This SNARK includes the
proof of the validity of every single transaction in the Rollup block. Additionally, the public data update for every
block is published over the mainchain network in the cheap calldata.

This architecture provides the following guarantees:

- The Rollup validator(s) can never corrupt the state or steal funds (unlike Sidechains).
- Users can always retrieve the funds from the Rollup even if validator(s) stop cooperating because the data is
  available (unlike Plasma).
- Thanks to validity proofs, neither users nor a single other trusted party needs to be online to monitor Rollup blocks
  in order to prevent fraud (unlike payment channels or Optimistic Rollups).

In other words, ZK Rollup strictly inherits the security guarantees of the underlying L1.

## Capabilities

First of all, zkSync, as a scaling solution, is capable of making transfers, and doing them quick and cheap. Interfaces
and principles of the core zkSync functionality are covered in the [payments section](/) of this
documentation.

Secondly, zkSync is smart-contract friendly. Targeting 2021, it will be possible to either write contracts in Zinc,
Rust-based type-safe programming language, or even reuse existing Solidity code. Contracts interoperability is covered
in the [contracts section](/dev/contracts).

Thirdly, zkSync is friendly for exchanges. Atomic swaps — an essential component of exchange protocols — are already [available](/dev/contracts) on mainnet! 

Fourthly, zkSync has native support of NFTs. You can try it out in our [wallet](https://wallet.zksync.io/).

Finally, zkSync support is implemented for all the main platforms. Check out our [SDK section](/) of docs, and
start developing with zkSync!
