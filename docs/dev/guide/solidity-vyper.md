# Solidity/Vyper support

For the alpha preview, only Solidity version `0.8.x` is supported. Compiling Solidity to zkEVM bytecode requires a special compiler. 

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compiler under the hood.

In the future, more versions of Solidity as well as Vyper will be supported.
