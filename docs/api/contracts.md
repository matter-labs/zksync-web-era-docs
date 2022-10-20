# L1 contracts interface

To interact with zkSync from L1, you need the interface of its canonical bridge. There are two main ways to import it to your codebase:

- By importing it from the `@matterlabs/zksync-contracts` npm package. (preferred)
- By downloading the contracts from the [repo](https://github.com/matter-labs/v2-testnet-contracts).

The guide on interacting with the zkSync canonical bridge with examples in both Solidity and `zksync-web3` SDK can be found [here](../dev/developer-guides/bridging/l1-l2.md).

This page will primarily serve as a quick reference for the interfaces and types you may require, as well as how to import them.

## `@matterlabs/zksync-contracts` reference

- `@matterlabs/zksync-contracts/contracts/interfaces/IZkSync.sol` is the file where the zkSync L1 contract interface `IZkSync` is located. Particular interest is in the `IBridge` functionality. Its implementation can be found [here](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IZkSync.sol).
  
<!--> - `@matterlabs/zksync-contracts/libraries/Operations.sol` is the file where the `Operations` library with all the user types in the bridge is stored. Its implementation can be found [here](https://github.com/matter-labs/v2-testnet-contracts/blob/main/libraries/Operations.sol).

-->

The code in the repository may contain some of the configuration constants. These are placeholder values taken from the development environment. You should use the library only for the interfaces and types it provides.
