# Overview

This section introduces an LLVM-based compiler toolchain for smart contract languages with Ethereum Virtual Machine
(EVM) support. The toolchain works on top of existing compilers and requires their output, which typically includes
intermediate representations (IRs), abstract syntax trees (ASTs), and auxiliary contract metadata and documentation.
::: info
At the time of writing, we support Solidity and Vyper.
:::

The toolchain consists of the following:

1. [High-level source code compilers](#high-level-source-code-compilers): `solc` and `vyper`.
2. [IR compilers, or LLVM front-end](#ir-compilers): `zksolc` and `zkvyper`.
3. [The LLVM framework](./llvm.md) with a zkEVM back-end which emits the zkEVM text assembly.
4. [The assembler](#assembler) which produces the zkEVM bytecode from the text assembly.
5. [Hardhat plugins](#hardhat-plugins) which set up the environment.

## High-level Source Code Compilers

High-level source code compilers are original upstream compilers called by IR compilers as
child processes to process their output. We use two such compilers at the time of writing:

- [solc](https://github.com/ethereum/solc-bin): the official Solidity compiler. For more info, see [the documentation](https://docs.soliditylang.org/en/latest/).
- [vyper](https://github.com/vyperlang/vyper/releases): the official Vyper compiler. For more info, see [the documentation](https://docs.vyperlang.org/en/latest/index.html).

## IR Compilers

Our toolchain includes LLVM front-ends that process the output of high-level source code compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin); calling `solc` as a child process. For more info, see [the documentation](./solidity.md).
- [zkvyper](https://github.com/matter-labs/zkvyper-bin); calling `vyper` as a child process. For more info, see [the documentation](./vyper.md).

These IR compilers perform the following steps:

1. Receive the input, which is usually standard or combined JSON passed by the Hardhat plugin via the standard input.
2. Modify the input, save the relevant data, and pass the input down to the underlying high-level source code compiler - which is called as a child process.
3. Receive the IRs and additional metadata from the underlying compiler and save the relevant data.
4. Compile the IRs into LLVM IR, resolving dependencies and adding the zkEVM extra data to the output.
5. Provide the output accordingly to the input method the IR compiler is called with.

Our IR compilers leverage I/O mechanisms that already exist in the high-level source code
compilers. They may modify the input and output to some extent, and add data for features unique to zkEVM,
and removing unsupported feature artifacts.

## Assembler

The [assembler](https://github.com/matter-labs/era-zkevm-assembly), which is written in Rust, compiles zkEVM assembly
to zkEVM bytecode. This tool is not a part of our LLVM back-end as it uses several cryptographic libraries which are
easier to maintain outside of the framework.

## Hardhat Plugins

We recommend using our IR compilers via [their corresponding Hardhat plugins](../../../api/hardhat/plugins.md).
These plugins should be added to the Hardhat's config file and allow developers to compile new projects or migrate
existing ones to zkSync Era. For a lower-level approach, download our compiler binaries via the
links above and use their CLI interfaces.

**Learn more about how to install and configure these plugins in the links below:**

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)

::: warning

Compilers are no longer released as Docker images and their usage is not recommended.
Instead, use the `compilerSource: "binary"` in the Hardhat config file to use the compiler binary.

:::
