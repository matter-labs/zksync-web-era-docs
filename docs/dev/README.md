# Introduction to zkSync for Developers

zkSync is built on ZK Rollup architecture. ZK Rollup is a layer 2 scaling solution in which all funds are held by a smart
contract on the mainchain, while computation and storage are performed off-chain. The validity of all the transactions is secured by zero-knowledge proofs, which are verified by the smart contract. All of this enables building a trustless protocol, secured by Ethereum, but with much lower fees.

zkSync 2.0 is the new version of the protocol, which is the first ZK Rollup to natively support Solidity smart contract development.

- Want to start building right now? Head over to the [quickstart guide](#developer-quickstart).
- New to rollups and want to learn more? Here is the [zkSync basics guide](#zksync-basics).

::: warning Closed testnet

The testnet is being rolled out gradually as our team wants to gather feedback before the public launch.

Please, **DO NOT** share this documentation with anyone outside of your team.

:::

## Developer quickstart

### Do I need experience with zkSync 1.x?

Some experience with the zkSync 1.x would be helpful to understand some core concepts, e.g. how finality works. From all other aspects, zkSync 2.0 and zkSync 1.x are very different systems, and the experience with the latter is not needed to build on zkSync 2.0.

If you do have experience building on zkSync 1.x, [here](./v1-vs-v2.md) is a guide on the notable differences.

If you don't, all the needed information is provided in the [zkSync basics guide](#zksync-basics).

### What do I need to start building?

All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like paying fees in ERC-20 tokens, our SDK should to be used.

The only place where using zkSync SDK is required is during the contract deployment. This can be easily done through our hardhat plugin.

### Hello World on zkSync

Check out our step-by-step [tutorial](./tutorials/basic), where you will learn:

- How to install zkSync hardhat plugin and deploy smart contracts with it.
- How to build front-end for your dApp using `zksync-web3` library.

## zkSync basics

TODO: Celeste PR

### Transaction types

<!--

Sidenote: These protocol details are mostly relevant when the zkPorter part is available:

The main part of zkSync 2.0 is the state tree. It's a sparse Merkle tree with a depth of 265, which holds account states. The topmost 8 bits denote the type of the protocol to be used (0 stands for `zkRollup` and 1 stands for `zkPorter`, the rest 254 types are reserved for the future). Each protocol has a storage space of `2^256` slots.

_Note:_ Each account exists in each subtree at the same time, e.g. account can have its funds stored in cold reserve in the zkRollup part and have all trading done on the zkPorter side.

-->

The protocol has 5 types of transactions.

The ones that can only be enacted from layer 1 are:

- `Deposit`. This operation moves funds from an L1 account to an L2 account.
- `AddToken`. This operation adds a native ERC-20 token to zkSync. <!-- TODO: Include link to the glossary of what is the native (or first-class citizen) erc20 token -->

The ones that can be enacted from both layer 1 and layer 2 are:

- `Deploy`. This operation stores the bytecode of the contract in the zkSync network and assigns it an address
  through which the contract can be accessed.
- `Execute`. This operation executes a smart contract method.
- `Withdraw`. This operation moves funds from an L2 account to an L1 account. _Most likely will be replaced with a special `Execute` call soon._

## Glossary

TODO: Celeste PR
