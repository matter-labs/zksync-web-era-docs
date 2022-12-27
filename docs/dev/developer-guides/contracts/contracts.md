# Writing smart contracts

Here is all the info you need to develop smart contracts for zkSync 2.0.

## Solidity & Vyper support

Compiling Solidity and Vyper to zkEVM bytecode requires a special compiler. For the time being Solidity `>=0.4.10` versions are supported, though we strongly recommended using `^0.8.0` as the most stable one. Vyper `^0.3.3` is also supported.

Although, older versions of Solidity are supported, here are some of their limitations in zkSync:

- Contract-local recursion is not supported.
- Internal function pointers are not supported.

For smart contract compilation using Solidity or Vyper, [check the correspondent Hardhat plugins here](../../../api/hardhat/plugins.md).

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compiler under the hood.
