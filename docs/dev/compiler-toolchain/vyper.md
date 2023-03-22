# Vyper

The Vyper compiler we provide as part of our toolchain is called [zkvyper](https://github.com/matter-labs/zkvyper-bin). It
operates on LLL IR and metadata received from the underlying [vyper](https://docs.vyperlang.org/en/latest/index.html) compiler,
which must be available in `$PATH`, or the path must be explicitly passed via the CLI (command-line interface).

## Usage

Most of the time, using our compiler via the Hardhat plugin is enough, and you do not have to dive deeper into its
interface and I/O (input/output) methods. However, knowledge of these can be crucial for integration, debugging, or contribution purposes.

#### Combined JSON

The Hardhat plugin uses the combined JSON I/O mode, which is passed down to the `vyper` compiler child process.

Additional zkEVM data is inserted into the output combined JSON by `zksolc`:

- `zk_version`: the `zksolc` version.
- `contract/factory_deps`: bytecode hashes of contracts created in the current contract with `CREATE`.
  Since Vyper does not support `CREATE` directly, only the forwarder can be present in this mapping.
  [More detail here](../building-on-zksync/contracts/contract-deployment.md#note-on-factory-deps).

Regardless of the requested output, only the `combined_json`, `abi`, `method_identifiers`, `bytecode`, `bytecode_runtime`
flags are supported, while the rest are ignored.

Other output formats are available via the `-f` option. Check out `vyper --help` for more details.

#### CLI reference

- `--version`  
  Print the version and exit.

- `<input_files>`  
  Specify the input file paths.  
  Multiple Vyper files can be passed in the default Vyper mode. 
  LLVM IR mode currently supports only a single file.

- `-o`, `--output-dir <path>`  
  Create one file per component and contract/file at the specified directory, if given.

- `--overwrite`  
  Overwrite existing files (used together with -o).

- `-O`, `--optimization <level>`  
  Set the optimization parameter -O[0 | 1 | 2 | 3 | s | z].  
  Use `3` for best performance and `z` for minimal size. See [LLVM optimizer](./llvm.md#optimizer).  

- `--vyper <path>`  
  Specify the path to the `vyper` executable. By default, the one in `${PATH}` is used.  
  LLVM IR mode: `vyper` is unused.

- `-f`  
  The extra output format string.

- `--llvm-ir`  
  Switch to the LLVM IR mode.  
  Only one input LLVM IR file is allowed.  
  Cannot be used with the combined or standard JSON modes.

- `--debug-output-dir <path>`  
  Dump all IRs to files in the specified directory.  
  Only for testing and debugging.

- `--llvm-verify-each`  
  Set the verify-each option in LLVM.  
  Only for testing and debugging.

- `--llvm-debug-logging`  
  Set the debug-logging option in LLVM.  
  Only for testing and debugging.

## Limitations

Currently only Vyper v0.3.3 is supported.
