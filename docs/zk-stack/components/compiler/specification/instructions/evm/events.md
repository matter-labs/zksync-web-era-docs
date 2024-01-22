---
head:
  - - meta
    - name: "twitter:title"
      content: Events | zkSync Docs
---

# Event Instructions

The EraVM event instructions are more low-level. Each `LOG`-like instruction is unrolled into a loop, where each iteration writes two 256-bit words.

The words must contain data in the following order:

1. The initializer cell, describing the number of indexed words (e.g. `I`) and the size of non-indexed data in bytes (e.g. `D`)
2. `I` indexed 32-byte words
3. `D` bytes of data

Each write operation can contain some subsequent data from its next step. If only one word remains, the second input is zero.

See [EraVM instruction: `log.event`](https://matter-labs.github.io/eravm-spec/spec.html#EventDefinition)

## LOG0 - LOG4

Original [EVM](https://www.evm.codes/#a0?fork=shanghai) instructions.

### System Contract

This information is requested a System Contract called [EventWriter](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/EventWriter.yul).

On how the System Contract is called, see [this section](../../system-contracts.md#event-handler).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/event.rs#L20) is common for Yul and EVMLA representations.
