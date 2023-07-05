# Contracts

There is a set of system contracts that supports the zkSync Era network interaction.<br>
The following are the contracts:

- ERC20
- ContractDeployer

## `ERC20`

This is a system contract that provides ERC20 token management. It has the same API as
defined in the [ERC20](https://eips.ethereum.org/EIPS/eip-20) standard.

## `ContractDeployer`

ContractDeployer is a utility system contract, represented as a type, and covers the following functionality:

- Encode binary contract representation by `create` method for further deploying.
- Encode binary contract representation by `create2` method for further deploying.
- Precompute contract address for `create` and `create2` methods.
