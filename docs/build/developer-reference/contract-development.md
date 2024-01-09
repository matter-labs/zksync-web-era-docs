---
head:
  - - meta
    - name: "twitter:title"
      content: Smart Contract Development | zkSync Docs
---

# Smart Contract Development

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.

::: tip Differences with Ethereum

Although most smart contracts work out of the box, we **strongly recommend developers to read about the [differences between Ethereum and zkSync Era](./differences-with-ethereum.md)**, and test their projects using the [local setup](../test-and-debug/getting-started.md) and in testnet.

:::

## Solidity support

Currently, Solidity versions as old as `0.4.12` are supported, although **we strongly recommend using the latest supported revision of 0.8**, as older versions contain known bugs and [have limitations with our compiler](../../zk-stack/components/compiler/toolchain/solidity.md#limitations).

Please read [this section of the docs](../../zk-stack/components/compiler/toolchain/solidity.md#using-libraries) if your project uses libraries.

::: info Security and best practices
Follow the [security considerations and best practices](../quick-start/best-practices.md) to build smart contracts on zkSync Era.
:::

## Vyper support

Currently only Vyper 0.3.3 and 0.3.9 versions are supported. Versions 0.3.4 to 0.3.8 (both included) are not supported.

## Compilers

Although you can write smart contracts in both Solidity and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

**It's strongly recommended to use the latest version of the compiler available.**

You can find more information about our compilers in the [Compiler toolchain section](../../zk-stack/components/compiler/toolchain/overview.md).

**Learn more about how to install and configure the compiler Hardhat plugins in the links below:**

- [hardhat-zksync-solc documentation](../tooling/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../tooling/hardhat/hardhat-zksync-vyper.md)
