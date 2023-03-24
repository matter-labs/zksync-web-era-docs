# Overview

This section introduces the zkEVM LLVM-based compiler toolchain for smart contract languages with Ethereum Virtual Machine
(EVM) support. The toolchain works on top of existing compilers and requires their output, which typically includes
intermediate representations (IRs), abstract syntax trees (ASTs), and auxiliary contract metadata and documentation.
::: info
At the time of writing, we support Solidity and Vyper.
:::

The toolchain consists of the following:

1. [High-level source code compilers](#high-level-source-code-compilers): `solc` and `vyper`.
2. [IR compilers, front-ends to LLVM](#ir-compilers): `zksolc` and `zkvyper`.
3. [The LLVM framework](./llvm.md) with a zkEVM back-end which emits zkEVM text assembly.
4. [The assembler](#assembler) which produces the zkEVM bytecode from text assembly.
5. [Hardhat plugins](#hardhat-plugins) which set up the environment.

![Compiler Toolchain Visualization](../../assets/images/compiler-toolchain.png "Compiler Toolchain")

## High-level Source Code Compilers

The high-level source code is processed by third-party compilers called, in IR or assembly output mode, 
by zkEVM IR compilers as
child processes. We use two such compilers at the time of writing:

- [solc](https://github.com/ethereum/solc-bin): the official Solidity compiler. For more info, see [its documentation](https://docs.soliditylang.org/en/latest/).
- [vyper](https://github.com/vyperlang/vyper/releases): the official Vyper compiler. For more info, see [its documentation](https://docs.vyperlang.org/en/latest/index.html).

## IR Compilers

Our toolchain includes LLVM front-ends, written in Rust and calling forked LLVM C++ code, which process the output of high-level source code compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): calls `solc` as a child process. For more info, see [its documentation](./solidity.md).
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): calls `vyper` as a child process. For more info, see [its documentation](./vyper.md).

These IR compilers perform the following steps:

1. Receive the input, which is usually standard or combined JSON passed by the Hardhat plugin via standard input.
2. Modify the input, save the relevant data, and pass it to the corresponding high-level source code compiler, which is called as a child process.
3. Receive the IR and additional metadata from the corresponding compiler and save the relevant data.
4. Compile the IR into LLVM IR, resolving dependencies and adding extra zkEVM data to the output.
5. Optimize the LLVM IR using the industry-standard LLVM optimization framework.
6. Provide output matching the format of the input method the IR compiler is called with.

Our IR compilers leverage I/O mechanisms which already exist in the high-level source code
compilers. They may modify the input and output to some extent, and add data for features unique to zkEVM,
and remove unsupported feature artifacts.

## Assembler

The [assembler](https://github.com/matter-labs/era-zkevm-assembly), which is written in Rust, compiles zkEVM assembly
to zkEVM bytecode. This tool is not a part of our LLVM back-end as it uses several cryptographic libraries which are
easier to maintain outside of the framework.

## Hardhat Plugins

We recommend using our IR compilers via [their corresponding Hardhat plugins](../../../api/hardhat/plugins.md).
Add these plugins to Hardhat’s configuration file to compile new projects or migrate
existing ones to zkSync Era. For a lower-level approach, download our compiler binaries via the
links above and use their CLI interfaces.

### Learn more about how to install and configure these plugins in the links below:

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)

::: warning

Using compilers running in Docker images — which are no longer supported — is not recommended.
Instead, use the `compilerSource: "binary"` in the Hardhat config file to use the compiler binary.

:::
