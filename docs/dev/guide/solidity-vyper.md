# Solidity/Vyper support

Compiling Solidity to zkEVM bytecode requires a special compiler. For the time being Solidity `>=0.4.0` versions are supported, though it is still recommended to use `^0.8.0` as the most stable ones. Vyper `^0.3.3` is also supported.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compiler under the hood.

More versions of Solidity and Vyper will be supported soon.
