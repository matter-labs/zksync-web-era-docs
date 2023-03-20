# LLVM Framework

[The LLVM framework](https://github.com/matter-labs/era-compiler-llvm) is an excellent choice for developing toolchains for smart contract languages. Leveraging
its powerful intermediate representation (IR) allows developers to efficiently design, implement, and optimize
language-specific features while benefiting from the extensive LLVM ecosystem. This ensures high-performance execution,
improved portability, and seamless integration with existing LLVM-based tools. Furthermore, the modularity and
extensibility of LLVM make it easier to support new smart contract languages with LLVM front-ends, fostering innovation
and growth in the blockchain industry.

Additionally, LLVM enables us to improve the efficiency over the original EVM pipeline, as we can take advantage of the
numerous optimization passes and tools available in its mature ecosystem.

In our toolchain, LLVM consumes the LLVM IR, applies extensive optimizations, and eventually passes the optimized IR
to the zkEVM back-end code generator in order to produce the zkEVM text assembly output.

By default, our IR compilers optimize for performance, which correlates with the number of VM cycles per transaction,
thus affecting gas usage. The `z` option may reduce the contract size for large contracts, making deployment cheaper,
but increasing the average transaction price.

To get more information about the LLVM framework, [see the official documentation](https://llvm.org/).
