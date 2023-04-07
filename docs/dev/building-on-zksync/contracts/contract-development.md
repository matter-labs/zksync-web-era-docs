# Smart contract development

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.


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

**Our compilers are based on LLVM**. LLVM-based compilers have become the industry standard because of their robustness, efficiency, and the large community around the world. They provide us some additional advantages:

- Enable us to improve the efficiency over the original EVM bytecode because with LLVM we can take advantage of the many optimizations and tools available in this mature ecosystem.
- Pave the way for us to add support for integrating codebases written in other programming languages with LLVM front-ends. By doing so, developers can build dApps and use blockchains in ways that are currently not possible.

We recommend using these compilers via [their correspondent Hardhat plugins](../../../api/hardhat/plugins.md) (although they're also available as binaries). These plugins should be added to the Hardhat's config file and allow developers to compile new projects or migrate existing ones to zkSync Era.

::: warning

Compilers are no longer released as Docker images and its usage is no longer recommended. Use the `compilerSource: "binary"` in the Hardhat config file to use the binary instead.

:::

**Learn more about how to install and configure these plugins in the links below:**

- [hardhat-zksync-solc documentation](../../../api/hardhat/hardhat-zksync-solc.md)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/hardhat-zksync-vyper.md)
