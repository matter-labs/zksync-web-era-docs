---
head:
  - - meta
    - name: "twitter:title"
      content: LLVM Framework | zkSync Docs
---

# LLVM Framework

::: warning
To safeguard the security and efficiency of your application, always use the latest compiler version.
:::

[The LLVM framework](https://github.com/matter-labs/era-compiler-llvm) is a soundly-architected and well-tested framework
for developing toolchains for smart contract languages. Its powerful intermediate representation (IR) allows developers
to design, implement, and optimize efficient language-specific features while benefiting from the extensive LLVM ecosystem.
This ensures high-performance execution, improved portability, and seamless integration with existing LLVM-based tools.
Furthermore, the modularity and extensibility of LLVM make it easier to support new smart contract languages with LLVM front ends.

Additionally, LLVM improves on the original EVM pipeline efficiency, as we can take advantage of the
numerous optimization passes, tools, and tests available in its mature ecosystem.

In our toolchain, LLVM consumes the LLVM IR, applies extensive optimizations, and eventually passes the optimized IR
to the zkEVM back-end code generator in order to produce the zkEVM text assembly output.

## Optimizer

All our compilers utilize the state-of-the-art LLVM optimizer.
By default, they optimize for performance, which correlates with the number of VM cycles per transaction,
thus affecting gas usage. The `z` option may reduce the contract size for large contracts, making deployments cheaper while increasing the average transaction price.

## Diving deeper

For more information on the LLVM framework, [see the official documentation](https://llvm.org/).
