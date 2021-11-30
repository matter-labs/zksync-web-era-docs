# Comparing zkSync 1.x and zkSync 2.0

The first and the most noticeable difference is, of course, smart contracts support. zkSync 2.0 is capable of deploying
and executing arbitrary smart contracts compiled from Solidity or Zinc (currently only Solidity v0.8.x is supported).

However, to make the protocol work with smart contracts, we've had to rework the basics of protocol and
implement many new things. Apart from the smart contracts, differences include:

- **zkPorter protocol support (disabled for the testnet).** zkPorter is a sub-protocol for zkSync 2.0, which is empowered by zero-knowledge proofs the
  same way as zkRollup part but is drastically cheaper due to moving the data availability part from L1 to the network
  of validators with a simplified proof of stake consensus mechanism enforcing them to actually make the data available.
- **zkSync 2.0 natively supports ECDSA signatures.** It means, that `ChangePubKey` operation is no longer
  required, any account can be managed in L2 with the same private key that is used for L1.
- **Most operations in zkSync 2.0 can be called from both L1 and L2.** It means, you can request a withdrawal of funds
  without dealing with L2 transactions, or call a transfer in L2 from L1.
- **Exodus mode was replaced with Priority mode.** Priority mode is a mode where blocks can still be generated in L2, but
  may only consist of requests initiated from L1. Unlike exodus mode, priority mode is not eternal: rollup can continue
  operating once it satisfies all the priority requests received from L1.
- **Smart contract-centric model made it possible to implement a full fledged Web3 API.** zkSync network can be accessed by
  any Web3-compatible client. Though there are [some](./ethereum-vs-v2.md) differences.
- **There are no account IDs and token IDs.** Everything is accessed using Ethereum addresses, just like in L1.
- **There is no limit on the number of native tokens.** Any valid ERC20 token can be added to the zkSync 2.0 as a first-class citizen
  token.

## Limitations of the alpha preview

The list of features in the previous chapter is pretty big, and implementing all of them is also a big task. We're
actively working on making the next generation of zero-knowledge rollups as easy (or even more!) to use as Ethereum
itself.

So, the current state of implementation is the **alpha preview**. It means that while there are a lot of things that are
not there yet, the core of the system is ready, it works and serves its purpose.

- zkPorter part is currently disabled. DexEx/UX on zkRollup and zkPorter parts is the same (besides the much cheaper prices of zkPorter of course), but this does not play a big role on the testnet.
- Some features, like L2 -> L1 communication or support for Solidity versions below 0.8.0 may not be available.
- For now, zero-knowledge proofs for transactions are not available (zkEVM have to be heavily optimized since each proof
  computation requires _a lot_ of computations, and we're working on it).
- Changes to the protocol (e.g. changes in ABI) are _possible_. While the protocol core is ready, we are still
  experimenting with some things to provide the most convenient UX/DevEx.
- Account abstractions.

Finally, once again, it's an alpha release. Bugs may occur and the best thing you can do in case of encountering it is
to report it in our Discord with a clear description and steps to reproduce. We will try to help you and fix
the problem as soon as possible. We will also maintain a [troubleshooting](./troubleshooting.md) page for common issues.

## Protocol details

The main part of zkSync 2.0 is the state tree. It's a sparse Merkle tree with with a depth of 265, which holds account states. The topmost 8 bits denote the type of the protocol to be used (0 stands for `zkRollup` and 1 stand for `zkPorter`, the rest 254 types are reserved for the future). Each protocol has a storage space of `2^256` slots.

_Note:_ Each account exists in each subtree at the same time, e.g. account can have its funds stored in cold reserve in the rollup part and have all trading done on the porter side.

In same way as in zkSync 1.x, the protocol has multiple types of transactions. Transactions that were available in
zkSync 1.x and are still available in zkSync 2.0:

- `Deposit`. This operation moves funds from L1 account to the L2 account.
- `Withdraw`. This operation moves funds from L2 account to the L1 account.

New transactions that exist in zkSync 2.0 only:

- `AddToken`. This operation adds support of a valid ERC-20 token to the L2.
- `Deploy`. This operation stores the bytecode of the contract in the zkSync network and assigns it an address
  through which the contract can be accessed.
- `Execute`. This operation executes a smart contract method.

`ChangePubKey` that was mandatory in zkSync 1.x, is currently not supported but will exist as an _optional_ operation
for CREATE2 accounts in the future.
