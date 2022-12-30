# Smart contract development

zkSync 2.0 allows developers to build projects using the same programming languages and tools used to build on Ethereum.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Solidity & Vyper support

You can write smart contracts for zkSync 2.0 in both Solidity and Vyper. For the time being Solidity `>=0.4.10` versions are supported, though **we strongly recommended using** `^0.8.0` as the most stable one. Vyper `^0.3.3` is also supported.

Although, older versions of Solidity are supported, here are some of their limitations in zkSync:

- Contract-local recursion is not supported.
- Internal function pointers are not supported.

### Compilers

Although you can write smart contracts in both Solidty and Vyper, compiling these contracts to our zkEVM bytecode requires special compilers:

- [zksolc](https://github.com/matter-labs/zksolc-bin): Solidity compiler.
- [zkvyper](https://github.com/matter-labs/zkvyper-bin): Vyper compiler.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are handled by the compiler under the hood.

We recommend using these compilers via [their correspondent Hardhat plugins](../../../api/hardhat/plugins.md) (although they're also available as binaries). These plugins should be added to the Hardhat's config file and allow developers to compile new projects or migrate existing ones to zkSync 2.0.

::: warning

Compilers are no longer released as Docker images and its usage is no longer recommended. Use the `compilerSource: "binary"` in the Hardhat config file to use the binary instead.

:::

Check out the documentation in the links below:

- [hardhat-zksync-solc documentation](../../../api/hardhat/plugins.md#hardhat-zksync-solc)
- [hardhat-zksync-vyper documentation](../../../api/hardhat/plugins.md#hardhat-zksync-vyper)
