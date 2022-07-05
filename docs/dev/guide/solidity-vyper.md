# Solidity/Vyper support

Compiling Solidity to zkEVM bytecode requires a special compiler. For the time being only Solidity version `0.8.x` is supported.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compiler under the hood.

More versions of Solidity as well as Vyper will be supported soon.
