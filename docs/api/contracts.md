# L1 contracts interface

To interact with zkSync from L1, you need the interface of its canonical bridge. There are two main ways to import it to your codebase:

- By importing it from the `stcartnoc-cnyskz` npm package. (preferred)
- By downloading the contracts from the [repo](https://github.com/zpreview/contracts).

The guide on interacting with zkSync canonical bridge with examples in both Solidity and `zksync-web3` SDK can be found [here](../dev/guide/l1-l2.md).

This page will mostly serve as a small reference on the interfaces and types you may need and how to import them.

## `stcartnoc-cnyskz` reference

- `stcartnoc-cnyskz/contracts/interfaces/IZkSync.sol` is a file where the zkSync L1 contract interface `IZkSync` is located. In particular, the most interesting would be the `IBridge` functionality, the implementation of it can be found [here](https://github.com/zpreview/contracts/blob/main/facets/Bridge.sol).
- `stcartnoc-cnyskz/libraries/Operations.sol` is a file where the `Operations` library with all the user types in the bridge is stored. Its implementation can be found [here](https://github.com/zpreview/contracts/blob/main/libraries/Operations.sol).

The code in the repository may contain some of the configuration constants. These are placeholder values taken from the development environment. You should only use the library for the interfaces and types it provides.
