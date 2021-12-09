# Introduction to zkSync for Developers

## Overview

**zkSync** is a trustless protocol that utilises [zkRollup technology](/faq/tech.md#zk-rollup-architecture) to provide scalable low-cost payments on Ethereum. It uses zero-knowledge proofs to store all funds in a smart
contract on the mainchain, while computation and storage are performed off-chain. 

For every Rollup block, a state
transition zero-knowledge proof (SNARK) is generated and verified by the mainchain contract. This SNARK includes the
proof of the validity of every single transaction in the Rollup block. Additionally, the public data update for every
block is published over the mainchain network in the cheap `calldata`.

### zkSync features

- Mainnet-level security with zero reliance on 3rd parties.
- Permissionless smart contracts in Solidity / Zinc.
- No registration is required to send or receive funds.
- Payments to existing Ethereum addresses (including smart-contracts).
- Fees conveniently payable in the token being transferred.
- Withdrawals to mainnet in ~10 minutes<sup>\*</sup>

### Architecture guarantees

- The Rollup validator(s) can never corrupt the state or steal funds (unlike Sidechains).
- Users can always retrieve the funds from the Rollup even if validator(s) stop cooperating because the data is
  available (unlike Plasma).
- Thanks to validity proofs, neither users nor a single other trusted party needs to be online to monitor Rollup blocks
  in order to prevent fraud (unlike payment channels or Optimistic Rollups).

In other words, ZK Rollup strictly inherits the security guarantees of the underlying L1 chain.

## zkSync in comparison

![L2 comparison](https://zksync.io/chart4.png)
