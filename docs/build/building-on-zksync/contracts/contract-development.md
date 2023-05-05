# Compilers and tools

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.

::: tip Differences with Ethereum

Although most smart contracts work out of the box, we **strongly recommend developers to read about the [differences between Ethereum and zkSync Era]()**, and test their projects both locally using the [local setup]() and in testnet.

:::

## Solidity support

Currently, Solidity versions as old as `0.4.12` are supported, although **we strongly recommend using the latest supported revision of 0.8**, as older versions contain known bugs and [have limitations with our compiler]().

Please read [this section of the docs]() if your project uses libraries.

### Unsupported functions

We currently do not support the following Solidity functions:

- `runtimeCode`
- `creationCode`

## Vyper support

Currently only Vyper `0.3.3` is supported.

## Compilers

Although you can write smart contracts in both Solidity and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

You can find more information about our compilers in the [Compiler toolchain section]().

**Learn more about how to install and configure the compiler Hardhat plugins in the links below:**

- [hardhat-zksync-solc documentation]()
- [hardhat-zksync-vyper documentation]()
