# Overview

This section introduces an LLVM-based compiler toolchain for smart contract languages with Ethereum Virtual Machine
(EVM) support. The toolchain works on top of existing compilers and requires their output, which typically includes
intermediate representations (IRs), abstract syntax trees (ASTs), and auxiliary contract metadata and documentation.
::: info
At the time of writing, we support Solidity and Vyper.
:::

The toolchain roughly consists of the following parts:

1. High-level source code compilers (`solc` and `vyper`)
2. IR compilers, or LLVM front-ends (`zksolc` and `zkvyper`)
3. [The LLVM framework](./llvm.md) with a zkEVM back-end, emitting the zkEVM text assembly
4. The assembler, producing the zkEVM bytecode from the text assembly
5. Hardhat plugins, setting up the environment

## High-level Source Code Compilers

The high-level source code compilers are the original upstream compilers that are called by the IR compilers as
child processes to process their output. We use two such compilers at the moment of writing:

- [solc](https://github.com/ethereum/solc-bin): the official Solidity compiler. [See the documentation](https://docs.soliditylang.org/en/latest/)
- [vyper](https://github.com/vyperlang/vyper/releases): the official Vyper compiler [See the documentation](https://docs.vyperlang.org/en/latest/index.html)

## IR Compilers

Our toolchain includes LLVM front-ends that process the output of high-level source code compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin); calling `solc` as a child process. [See the documentation](./solidity.md)
- [zkvyper](https://github.com/matter-labs/zkvyper-bin); calling `vyper` as a child process. [See the documentation](./vyper.md)

These IR compilers perform the following steps:

1. Receive the input, which is usually a standard or combined JSON passed by the hardhat plugin via the standard input.
2. Modify the input, save the relevant data, and pass the input down to the underlying high-level source code compiler, which is called as a child process.
3. Receive the IRs and additional metadata from the underlying compiler, save the relevant data.
4. Compile the IRs into LLVM IR, resolving dependencies and adding the zkEVM extra data to the output on the way.
5. Provide the output accordingly to the input method the IR compiler is called with.

You might have noticed that our IR compilers leverage I/O mechanisms that already exist in the high-level source code
compilers. The IR compilers may modify the input and output to some extent, adding data for features unique to zkEVM,
and removing artifacts of unsupported ones.

## Assembler

The assembler is [a Rust-written tool](https://github.com/matter-labs/era-zkevm-assembly) that compiles zkEVM assembly
to zkEVM bytecode. This tool is not a part of our LLVM back-end, as it uses several cryptographic libraries which are
easier to maintain outside of the framework.

## Hardhat Plugins

We recommend using our IR compilers via [their correspondent Hardhat plugins](../../../api/hardhat/plugins.md).
These plugins should be added to the Hardhat's config file and allow developers to compile new projects or migrate
existing ones to zkSync Era. If you prefer a more low-level approach, you may download our compiler binaries via the
links above and use their CLI interfaces.

**Learn more about how to install and configure these plugins in the links below:**

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)

::: warning

Compilers are no longer released as Docker images and their usage is not recommended.
Use the `compilerSource: "binary"` in the Hardhat config file to use the compiler binary instead.

:::
