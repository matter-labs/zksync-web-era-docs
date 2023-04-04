# Solidity

The compiler we provide as a part of our toolchain is called [zksolc](https://github.com/matter-labs/zksolc-bin). It
operates on IR and metadata received from the underlying [solc](https://docs.soliditylang.org/en/latest/) compiler,
which must be available in `$PATH`, or its path must be explicitly passed via the CLI (command-line interface).

## Usage

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

- `settings/optimizer/enabled`: enables the LLVM optimizer. You can disable it for prototyping and debugging.
- `settings/optimizer/mode`: sets the optimization mode. Available values: `0`, `1`, `2`, `3`, `s`, `z`. The default
setting is `3`. See [LLVM optimizer](./llvm.md#optimizer).

Unsupported sections of the input JSON, ignored by `zksolc`:

- `sources/<file>/urls`
- `sources/destructible`
- `settings/stopAfter`
- `settings/remappings`
- `settings/optimizer/*`: the `solc` optimizer is always enabled and is not configurable.
- `settings/evmVersion`
- `settings/debug`
- `settings/metadata`: we request metadata with default settings for consistency.
- `settings/outputSelection/def`
- `settings/modelChecker`

Additional zkEVM data inserted by `zksolc`:

- `long_version`: the full `solc` version output.
- `zk_version`: the `zksolc` version.
- `contract/hash`: the hash of the zkEVM bytecode.
- `contract/factory_dependencies`: bytecode hashes of contracts created in the current contract with `CREATE`. [More details here](../building-on-zksync/contracts/contract-deployment.md#note-on-factory-deps).

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
- `contract/factory_deps`: bytecode hashes of contracts created by the current contract with `CREATE`. [More details here](../building-on-zksync/contracts/contract-deployment.md#note-on-factory-deps).

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

This output format is utilized in Yul and LLVM IR compilation modes. These modes currently only support compiling a single file. Only `--asm` and `--bin` output flags are supported, so this mode can be useful for debugging and prototyping.

## CLI reference

#### `--version`  
  Print the version and exit.  

#### `<input_files>`  
  Specify the input file paths.  
  Multiple Solidity files can be passed in the default Solidity mode.  
  Yul and LLVM IR modes currently support only a single file.  

#### `--base-path <path>`  
  Set the given path as the root of the source tree instead of the root of the filesystem.  
  Passed to `solc` without changes.  

#### `--include-path <path>`  
  Make an additional source directory available to the default import callback. Use multiple times if required. Only use if the base path has a non-empty value.  
  Passed to `solc` without changes.  

#### `--allow-paths <path1,path2,...>`  
  Allow a given path for imports. For multiple paths, separate with commas.  
  Passed to `solc` without changes.  

#### `-o`, `--output-dir <path>`  
  Create one file per component and contract/file at the specified directory, if given.  

#### `--overwrite`  
  Overwrite existing files (used together with -o).  

#### `-O`, `--optimization <level>`  
  Set the optimization parameter -O[0 | 1 | 2 | 3 | s | z].  
  Use `3` for best performance and `z` for minimal size. See [LLVM optimizer](./llvm.md#optimizer).  

#### `--solc <path>`  
  Specify the path to the `solc` executable. By default, the one in `${PATH}` is used.  
  In Yul mode, `solc` is used for source code validation, as `zksolc` assumes that the input Yul is valid.  
  In LLVM IR mode, `solc` is unused.  

#### `-l`, `--libraries <string>`  
  Specify addresses of deployable libraries. Syntax: `<libraryName>=<address> [, or whitespace] ...`.  
  Addresses are interpreted as hexadecimal strings prefixed with `0x`.  

#### `--combined-json <options>`  
  Output a single JSON document containing the specified information.  
  Available arguments: `abi`, `hashes`, `metadata`, `devdoc`, `userdoc`, `storage-layout`, `ast`, `asm`, `bin`, `bin-runtime`.  

#### `--standard-json`  
  Switch to standard JSON input/output mode. Read from `stdin`, write the result to `stdout`.  
  This is the default used by the Hardhat plugin.  

#### `--yul`  
  Switch to the Yul mode.  
  Only one input Yul file is allowed.  
  Cannot be used with the combined and standard JSON modes.  

#### `--llvm-ir`  
  Switch to LLVM IR mode.  
  Only one input LLVM IR file is allowed.  
  Cannot be used with combined and standard JSON modes.  

#### `--force-evmla`  
  Force use of the EVM legacy assembly pipeline.  
  Useful for early versions of `solc` 0.8.x, where Yul was considered highly experimental and contained more bugs than today.  

#### `--system-mode`  
  Enable system contract compilation mode.  
  In this mode, zkEVM extensions are enabled. For example, calls to addresses `0xFFFF` and below are substituted by special
  zkEVM instructions. In the Yul mode, the `verbatim_*` and `throw` instructions become available.

#### `--asm`  
  Output zkEVM assembly of the contracts.  

#### `--bin`  
  Output zkEVM bytecode of the contracts.  

#### `--debug-output-dir <path>`  
  Dump all IRs to files in the specified directory.  
  Only for testing and debugging.

#### `--llvm-verify-each`  
  Set the verify-each option in LLVM.  
  Only for testing and debugging.

#### `--llvm-debug-logging`  
  Set the debug-logging option in LLVM.  
  Only for testing and debugging.

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
to be passed explicitly to the compiler; see [compiling non-inlinable libraries](../../api/hardhat/compiling-libraries.md).
