# An (in)complete guide to zkSync 2.0

This document covers the differencies between zkSync 1.x and 2.0, and aims to provide a tutorial on how to work with
zkSync 2.0 protocol.

## Differences between 1.x and 2.0

The first and the most noticable difference is, of course, smart contracts support. zkSync 2.0 is capable of deploying
and executing arbitrary smart contracts compiled from either Zinc programming language or Solidity.

More information on Zinc and Solidity in zkSync 2.0 is coming soon, stay tuned!

However, in order to make the protocol work with smart contracts, we've had to rework the basics of protocol and
implement many new things. Apart from the smart contracts, differences include:

- zkPorter protocol support. zkPorter is a sub-protocol for zkSync 2.0, which is empowered by zero-knowledge proofs the
  same way as zkRollup part, but is drastically cheaper due to moving the data availability part from L1 to the network
  of validators with a simplified proof of stake consensus mechanism enforcing them to actually make the data available.
- zkSync 2.0 natively supports ECDSA signatures (via [EIP712]). It means, that `ChangePubKey` operation is no longer
  required, any account can be managed in L2 with the same private key that is used for L1.
- Most operations in zkSync 2.0 can be called from both L1 and L2. It means, you can request a withdrawal of funds
  without dealing with L2 transactions, or call a transfer in L2 from L1.
- Exodus mode was replaced with Priority mode. Priority mode is a mode where blocks can still be generated in L2, but
  may only consist of requests initiated from L1. Unlike exodus mode, priority mode is not eternal: rollup can continue
  operating once it satisfies all the priority requests received from L1.
- Smart contract centric model made it possible to implement a full fledged Web3 API. zkSync network can be accessed by
  any Web3-compatible client. _Note that zkSync SDK is still required to encode/decode the ABI._
- There are no account IDs and token IDs. Everything is accessed using Ethereum addresses, just like in L1.
- There is no limit on the tokens amount. Any valid ERC20 token can be added to the zkSync 2.0 as a first class citizen
  token.
- Many internal architecture improvements designed to increase the speed and resilisence of the zkSync server
  application.

[eip712]: https://eips.ethereum.org/EIPS/eip-712

## State of implementation

The list of features in the previous chapter is pretty big, and implementing all of them is also a big task. We're
actively working on making the next generation of zero knowledge rollups as easy (or even more!) to use as Ethereum
itself.

So, the current state of implementation is the **alpha preview**. It means that while there are a lot of things that are
not there yet, the core of the system is ready, it works and serves its purpose.

For now, zero-knowledge proofs for transactions are not available (zkEVM have to be heavily optimized, since each proof
computation requires _a lot_ of computations, and we're working on it).

The second thing is the support of Web3 API. We want it to be very polished and to become a main interface of
interacting with zkSync node. This is why we choose to not enable it until it's ready and tested.

Finally, once again, it's an alpha release. Bugs may occur and the best thing you can do in case of encountering it is
to create an issue in this repository with a clear description and steps to reproduce. We will try to help you and fix
the problem as soon as possible. We will also maintain a [troubleshooting](./troubleshooting.md) page for common issues.

Changes to the protocol (e.g. changes in ABI) are _possible_. While the protocol core is ready, we are still
experimenting with some things to provide the most convenient UX/DevEx.

## Protocol details

The main part of zkSync 2.0 is the state tree. It's a sparse Merkle tree with depth 417, which holds account states.
Each account is identified by the Ethereum address (160 bits of path) and each account has the key-value storage with
`uint256` keys (256 bits of path). The remaining bit is actually a topmost one, and it chooses the part of protocol in
which account exists: zkRollup or zkPorter.

_Note:_ Even though we have two subtrees that are capable of holding account addresses, each account may exist _only in
one tree_. The migrations from one protocol to another are possible and described below, but it's not possible for the
same address to be defined both in zkRollup and zkPorter parts.

The same way as in zkSync 1.x, the protocol has multiple types of transactions. Transactions that were available in
zkSync 1.x and are still available in zkSync 2.0:

- `Deposit`. This operation moves funds from L1 account to the L2 account.
- `Transfer`. This operation moves funds from L2 account to another L2 account.
- `Withdraw`. This operation moves funds from L2 account to the L1 account.

New transactions that exist in zkSync 2.0 only:

- `AddToken`. This operation adds support of a valid ERC-20 token to the L2.
- `DeployContract`. This operation stores the bytecode of the contract in the zkSync network and assigns it an address
  through which the contract can be accessed.
- `Execute`. This operation executes a smart contract method.
- `MigrateToPorter`. By default, every account is initially created in zkRollup part. However, if the account owner
  wants their account to be in zkPorter part, they can perform a `MigrateToPorter` transaction to swith to zkPorter.

`ChangePubKey` that was mandatory in zkSync 1.x, is currently not supported, but will exist as an _optional_ operation
for CREATE2 accounts in the future.
