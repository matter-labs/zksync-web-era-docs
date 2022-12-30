# Smart contract development

Here is all the info you need to develop smart contracts for zkSync 2.0.

## Solidity & Vyper support

You can write smart contracts for zkSync 2.0 in both Solidity and Vyper. For the time being Solidity `>=0.4.10` versions are supported, though **we strongly recommended using `^0.8.0`** as the most stable one.

Although, older versions of Solidity are supported, here are some of their limitations in zkSync:

- Contract-local recursion is not supported.
- Internal function pointers are not supported.

Vyper `^0.3.3` is also supported.

## zkEVM compilers

Although you can write smart contracts in both Solidty and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

These are available as binaries but we recommend using them via [their correspondent Hardhat plugins](../../../api/hardhat/plugins.md). These plugins are easy to setup so developers can compile new projects or migrate existing ones to zkSync 2.0.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are handled by the compiler under the hood.
