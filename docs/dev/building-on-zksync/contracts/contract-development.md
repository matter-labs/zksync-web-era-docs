# Smart contract development

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.

::: tip Differences with Ethereum

Although most smart contracts work out of the box, we **strongly recommend developers to read about the [differences between Ethereum and zkSync Era](./differences-with-ethereum.md)**, and test their projects both locally using the [local setup](../../../api/hardhat/testing.md) and in testnet.

:::

## Solidity support

Currently, Solidity versions as old as `0.4.12` are supported, although **we strongly recommend using the latest supported revision of 0.8**, as older versions contain known bugs or [produce limitations with our compiler](../../../api/compiler-toolchain/solidity.md#limitations).

Please read [this section of the docs](../../../api/compiler-toolchain/solidity.md#using-libraries) if your project uses libraries.

## Vyper support

Currently only Vyper `^0.3.3` is supported.

## Compilers

Although you can write smart contracts in both Solidity and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

**Our compilers are based on LLVM**. LLVM-based compilers have become the industry standard because of their robustness, efficiency, and the large community around the world. 

You can find more information about our compilers in the [Compiler toolchain section](../../../api/compiler-toolchain/README.md).

### System requirements

Both compilers are provided as binaries for the following plaforms:

- Linux: x86_64
- MacOS 11+: x86_64, arm64 (M1, M2)
- Windows: x86_64 - Only Windows 10 has been tested so far, but other versions should be OK.

**Learn more about how to install and configure the compiler Hardhat plugins in the links below:**

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)
