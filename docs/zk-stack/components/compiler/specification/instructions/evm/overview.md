---
head:
  - - meta
    - name: "twitter:title"
      content: EVM Instructions | zkSync Docs
---

# Native EVM Instructions

Such instructions are grouped into the following categories according to [the original reference](https://www.evm.codes/):

- [Arithmetic](./arithmetic.md)
- [Logical](./logical.md)
- [Bitwise](./bitwise.md)
- [Hashes](./hashes.md)
- [Environment](./environment.md)
- [Block](./block.md)
- [Stack](./stack.md)
- [Memory](./memory.md)
- [Storage](./storage.md)
- [Events](./events.md)
- [Calls](./calls.md)
- [Create](./create.md)
- [Return](./return.md)

### EraVM Assembly

Assembly emitted for LLVM standard library functions depends on available optimizations which differ between versions. If there is no
assembly example under an instruction, compile a reproducing contract with the latest version of `zksolc`.

EraVM specification contains a list of [all EraVM instructions (see the table of contents)](https://matter-labs.github.io/eravm-spec/spec.html).
