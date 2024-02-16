---
head:
  - - meta
    - name: "twitter:title"
      content: Solidity Compiler | zkSync Docs
---

# Solidity

The compiler we provide as a part of our toolchain is called [zksolc](https://github.com/matter-labs/zksolc-bin). It
operates on IR and metadata received from the underlying [solc](https://docs.soliditylang.org/en/latest/) compiler,
which must be available in `$PATH`, or its path must be explicitly passed via the CLI (command-line interface).

::: warning
To safeguard the security and efficiency of your application, always use the latest compiler version.
:::

## Usage

Make sure your machine satisfies the [system requirements](https://github.com/matter-labs/era-compiler-solidity/tree/main#system-requirements).

Using our compiler via the Hardhat plugin usually suffices. However, knowledge of its interface and I/O (input/output)
methods are crucial for integration, debugging, or contribution purposes.

The CLI supports several I/O modes:

1. Standard JSON.
2. Combined JSON.
3. Free-form output.

All three modes use the standard JSON `solc` interface internally. This reduces the complexity of the `zksolc`
interface and facilitates testing.

### Standard JSON

The `zksolc` standard JSON I/O workflow closely follows that of the official `solc` compiler. However, `zksolc` does not
support some configuration settings which are only relevant to the EVM architecture.

Additional zkEVM data is supported by `zksolc` but is omitted when passed to `solc`:

- `settings/optimizer/mode`: sets the optimization mode. Available values: `0`, `1`, `2`, `3`, `s`, `z`. The default
  setting is `3`. See [LLVM optimizer](./llvm.md#optimizer).
- `settings/optimizer/fallback_to_optimizing_for_size`: tries to compile again in `z` mode if the bytecode is too large for zkEVM.
- `settings/optimizer/disable_system_request_memoization`: disables the memoization of data received in requests to System Contracts.

Unsupported sections of the input JSON, ignored by `zksolc`:

- `sources/<file>/urls`
- `sources/destructible`
- `settings/stopAfter`
- `settings/evmVersion`
- `settings/debug`
- `settings/metadata`: for zkEVM you can only append `keccak256` metadata hash to the bytecode.
- `settings/modelChecker`

Additional zkEVM data inserted by `zksolc`:

- `long_version`: the full `solc` version output.
- `zk_version`: the `zksolc` version.
- `contract/hash`: the hash of the zkEVM bytecode.
- `contract/factory_dependencies`: bytecode hashes of contracts created in the current contract with `CREATE`. [More details here](../../../../build/developer-reference/contract-deployment.md#note-on-factory-deps).

Unsupported sections of the output JSON, ignored by `zksolc`:

- `contracts/<file>/<contract>/evm/bytecode`: replaced with a JSON object with zkEVM build data.
- `contracts/<file>/<contract>/ewasm`

See the complete standard JSON data structures in [the zksolc repository](https://github.com/matter-labs/era-compiler-solidity/tree/main/src/solc/standard_json).

### Combined JSON

The `zksolc` standard JSON I/O workflow closely follows that of the official `solc` compiler. However, `zksolc` does not
support some configuration settings which are only relevant to the EVM architecture.

Combined JSON is only an output format; there is no combined JSON input format. Instead, CLI arguments are
used for configuration.

Additional zkEVM data, inserted by `zksolc`:

- `zk_version`: the version of `zksolc`.
- `contract/factory_deps`: bytecode hashes of contracts created by the current contract with `CREATE`. [More details here](../../../../build/developer-reference/contract-deployment.md#note-on-factory-deps).

Unsupported combined JSON flags, rejected by `zksolc`:

- `function-debug`
- `function-debug-runtime`
- `generated-sources`
- `generated-sources-runtime`
- `opcodes`
- `srcmap`
- `srcmap-runtime`

For more information, see the complete combined JSON data structures in [the zksolc repository](https://github.com/matter-labs/era-compiler-solidity/tree/main/src/solc/combined_json).

### Free-form output

This output format is utilized in Yul and LLVM IR compilation modes. These modes currently only support compiling a single
file. Only `--asm` and `--bin` output flags are supported, so this mode can be useful for debugging and prototyping.

## Limitations

Currently, Solidity versions as old as `0.4.12` are supported, although **we strongly recommend using** the latest
supported revision of `0.8`, as older versions contain known bugs and have limitations dictated by the absence of IR with
sufficient level of abstraction over EVM.

Projects written in Solidity `>=0.8` are compiled by default through the Yul pipeline, whereas those written in `<=0.7` are compiled
via EVM legacy assembly which is a less friendly IR due to its obfuscation of control-flow and call graphs.
Due to this obfuscation, there are several limitations in zkSync for contracts written in Solidity `<=0.7`:

1. Recursion on the stack is not supported.
2. Internal function pointers are not supported.
3. Contract size and performance may be affected.

## Using libraries

The usage of libraries in Solidity is supported in zkSync Era with the following considerations:

- If a Solidity library can be inlined (i.e. it only contains `private` or `internal` methods), it can be used without
  any additional configuration.
- However, if a library contains at least one `public` or `external` method, it cannot be inlined and its address needs
  to be passed explicitly to the compiler; see [compiling non-inlinable libraries](../../../../build/tooling/hardhat/compiling-libraries.md#compiling-non-inlinable-libraries).
