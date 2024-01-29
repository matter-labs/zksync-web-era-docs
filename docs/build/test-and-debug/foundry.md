---
head:
  - - meta
    - name: "twitter:title"
      content: Foundry | zkSync Docs
---

# Foundry with zkSync Era

## Overview

`foundry-zksync` is a specialized fork of [Foundry](https://github.com/foundry-rs/foundry), tailored for zkSync Era. It extends Foundry's capabilities for Ethereum app development to support zkSync Era, allowing for the compilation, deployment, testing, and interaction with smart contracts on zkSync. Foundry itself is known for its components like Forge, Cast, Anvil, and Chisel.

### Status and Contribution

`foundry-zksync` is currently in its **alpha stage**, indicating ongoing development and potential for future enhancements. It is open-sourced, and contributions from the developer community are welcome. For more details and contributions, visit the [GitHub repository](https://github.com/matter-labs/foundry-zksync).

### Features and Limitations

For a comprehensive understanding of `foundry-zksync's` capabilities, refer to the [README](https://github.com/matter-labs/foundry-zksync?tab=readme-ov-file#-features--limitations) which outlines its features and current limitations.

## Getting Started

### Prerequisites

The primary prerequisite for using `foundry-zksync` is the [Rust Compiler](https://www.rust-lang.org/tools/install).

### Installation

`foundry-zksync` components can be installed individually or as a suite:

- **zkForge**: Run `cargo install --path ./crates/zkforge --profile local --force --locked`.
- **zkCast**: Execute `cargo install --path ./crates/zkcast --profile local --force --locked`.
- **Entire Suite**: Use `cargo build --release` for a complete installation.

## Configuration

### Initial Setup

After installation, initialize a new project with `zkforge init <project_name>`, which sets up the basic structure of a new Foundry project.

### Project Configuration using `foundry.toml`

Foundry is designed to be very configurable. You can configure Foundry using a file called `foundry.toml` in the root of your project, or any other parent directory.

Configuration can be arbitrarily namespaced by profiles. The default profile is named `default`.

You can select another profile using the `FOUNDRY_PROFILE` environment variable. You can also override parts of your configuration using `FOUNDRY_` or `DAPP_` prefixed environment variables, like `FOUNDRY_SRC`.

`zkforge init` creates a basic, extendable `foundry.toml` file.

To see your current configuration, run `zkforge config`. To see only basic options (as set with `zkforge init`), run `zkforge config --basic`. This can be used to create a new `foundry.toml` file with `zkforge config --basic > foundry.toml`.

By default `zkforge config` shows the currently selected foundry profile and its values. It also accepts the same arguments as `zkforge build`. An example `foundry.toml` for zkSync with zksolc configurations may look like:

```
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']

[profile.zksync]
src = 'src'
libs = ['lib']
fallback_oz = true
is_system = true
mode = "3"
```

## Basic Usage

### Running Tests

Use `zkforge test` to run tests written for your smart contracts. For an overview of how to write tests using Foundry please refer to the official documentation [here](https://book.getfoundry.sh/forge/writing-tests).

## Deploying Smart Contracts with `zkforge`

### Compilation with `zkforge zk-build`

`zkforge zk-build` (also accessible via aliases like `zkforge zkbuild`, `zkforge zk-compile`, `zkforge zkb`) is used for compiling smart contracts into zkEVM bytecode. The compiled files are stored in a structured directory at `<PROJECT-ROOT>/zkout/`.

**Usage:**

```sh
zkforge zk-build [OPTIONS]
```

**Key Compiler Options:**

- `--use-zksolc <ZK_SOLC_VERSION>`: Specify the solc version or a local solc path.
- `--is-system <SYSTEM_MODE>`: Enables system contract compilation mode (`true`/`false`).
- `--force-evmla <FORCE_EVMLA>`: Switch to the EVM legacy assembly pipeline.
- `--fallback-oz <FALLBACK_OZ>`: Recompile with `-Oz` if bytecode is too large.
- `--detect-missing-libraries`: Detect and report missing libraries.
- `-O, --optimization <LEVEL>`: Set LLVM optimization levels.
- `--zk-optimizer`: Optimize specifically for zkSync.

**Example Usage:**
Compile with default settings or specify `zksolc` version:

```sh
zkforge zk-build
zkforge zkb
```

### Deployment with `zkforge zk-create`

`zkforge zk-create` (and its aliases `zkforge zkcreate`, `zkforge zk-deploy`, `zkforge zkc`) deploys smart contracts to zkSync.

**Usage:**

```sh
zkforge zk-create <CONTRACT> [OPTIONS] --rpc-url <RPC-URL> --chain <CHAIN-ID> --private-key <PRIVATE-KEY>
```

**Options:**

- `--constructor-args <ARGS>`: Specify constructor arguments.
- `--constructor-args-path <FILE>`: File path for constructor arguments.
- `<CONTRACT>`: Contract identifier in `<path>:<contractname>` format.
- `--factory-deps <FACTORY-DEPS>`: Specify factory dependencies.

**Example:**
Deploy `Greeter.sol` to zkSync testnet:

```bash
zkforge zkc src/Greeter.sol:Greeter --constructor-args "Hello zkSync" --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300
```

### Deploying Factory Contracts

To deploy contracts like `SimpleFactory.sol`, use the `is-system` flag and place the contract in `src/is-system/`.

**Compile `SimpleFactory.sol`:**

```bash
zkforge zk-build --is-system=true
```

**Deploy `SimpleFactory.sol`:**

```sh
zkforge zkc src/SimpleFactory.sol:SimpleFactory --constructor-args <ARGS> --factory-deps <DEPS> --private-key <PRIVATE_KEY> --rpc-url <RPC-URL> --chain <CHAIN-ID>
```

**Deploy `StepChild.sol` via `SimpleFactory.sol`:**

```sh
zkcast zk-send <FACTORY_ADDRESS> "newStepChild()" --private-key <PRIVATE_KEY> --rpc-url <RPC-URL> --chain <CHAIN-ID>
```

## Basic zkSync Chain Interactions with `zkcast`

### Introduction

This section guides you through basic blockchain interactions using `zkcast`, a command-line tool in the `foundry-zksync` suite. These interactions include querying chain IDs, retrieving client information, checking account balances, and getting gas prices. Understanding these basic commands is crucial for interacting effectively with the zkSync network.

### Getting Chain ID

Chain IDs help identify the specific blockchain network you're interacting with. Here's how you can retrieve them:

- **For a Local Node:**

  - **Command:**

    ```sh
    zkcast chain-id --rpc-url http://localhost:3050
    ```

  - **Expected Output:** The command returns the chain ID of your local node, e.g., `270`.

- **For the Testnet:**

  - **Command:**

    ```sh
    zkcast chain-id --rpc-url https://sepolia.era.zksync.dev
    ```

  - **Expected Output:** This will return the chain ID of the zkSync testnet, typically `300`.

### Retrieving Client Information

Knowing your client version can be essential for compatibility and troubleshooting:

- **Command:**

  ```sh
  zkcast client --rpc-url https://sepolia.era.zksync.dev
  ```

- **Expected Output:** A string indicating the client version, like `zkSync/v2.0`.

### Checking Account's L2 ETH Balance

To check the balance of an account on Layer 2 (L2):

- **Command:**

  ```sh
  zkcast balance 0x8b1d48a69ACEbC6eb201e2F4d162A002203Bfe8E --rpc-url https://sepolia.era.zksync.dev
  ```

- **Expected Output:** The ETH balance of the specified account, e.g., `530378345265523336`.

### Obtaining Gas Price

Understanding the current gas price is vital for transaction cost estimation:

- **Command:**

  ```sh
  zkcast gas-price --rpc-url https://sepolia.era.zksync.dev
  ```

- **Expected Output:** The current gas price on the network, such as `100000000`.

### Fetching Latest Block Details

Fetching the latest block details can provide insights into the blockchain's current state:

- **Command:**

  ```sh
  zkcast block latest --rpc-url https://sepolia.era.zksync.dev
  ```

- **Expected Output:** Detailed information about the latest block, including base fee per gas, block number, and more.

## Troubleshooting

Given `foundry-zksync` is in **alpha-stage** some functionality may not work as intended. If you do run into issues please report them.

### Reporting Bugs

Bugs or issues can be reported through the [GitHub Issues](https://github.com/matter-labs/foundry-zksync/issues) page of the `foundry-zksync` repository.

## Contributing

Developers are encouraged to contribute to `foundry-zksync`. Contributions can be made via GitHub pull requests. Adherence to coding standards and guidelines, as detailed in the repository, is recommended.

## Further Resources

For more detailed documentation, tutorials, or webinars, refer to the [Foundry Book](https://book.getfoundry.sh/) and the [Usage Guides](https://github.com/matter-labs/foundry-zksync/tree/main/docs/dev/zksync) for `foundry-zksync`.
