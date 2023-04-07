# Smart contract development

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.

::: tip Differences with Ethereum

Although most smart contracts work out of the box, we **strongly recommend developers to read about the [differences between Ethereum and zkSync Era](./differences-with-ethereum.md)**, and test their projects both locally using the [local setup](../../../api/hardhat/testing.md) and in testnet.

:::

## Solidity support

For the time being Solidity `>=0.4.10` versions are supported, though **we strongly recommended using** `^0.8.0` as older versions contain known bugs.

Solidity versions `>=0.8` are compiled through Yul, whereas `<=0.7` are compiled via the EVM legacy assembly, which is a less friendly IR due to obfuscation of the control-flow and call graphs. For this reason, there are a few limitations in zkSync for contracts written in Solidity `<=0.7`:

- Contract-local recursion is not supported.
- Internal function pointers are not supported.
- Possible impact on the contract size and VM cycles count.

### Using libraries in Solidity

The usage of libraries in Solidity is supported in zkSync Era with the following considerations:

- If a Solidity library can be inlined (i.e. it only contains `private` or `internal` methods), it can be used without any additional configuration.
- However, if a library contains at least one `public` or `external` method, it's non-inlinable and its address needs to be passed explicitly to the compiler. You can learn more about [how to compile non-inlineable libraries in this section of the docs](../../../api/hardhat/compiling-libraries.md).

## Vyper support

Currently only Vyper `^0.3.3` is supported.

## Compilers

Although you can write smart contracts in both Solidity and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

**Our compilers are based on LLVM**. LLVM-based compilers have become the industry standard because of their robustness, efficiency, and the large community around the world. You can find more information about our compilers in the [Compiler toolchain section](../../compiler-toolchain/README.md).

**Learn more about how to install and configure the compiler Hardhat plugins in the links below:**

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)
