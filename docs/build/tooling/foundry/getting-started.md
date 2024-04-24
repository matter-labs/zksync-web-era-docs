---
head:
  - - meta
    - name: "twitter:title"
      content: Foundry | Getting Started
---

## Getting Started

### Prerequisites

The primary prerequisite for using `foundry-zksync` is the [Rust Compiler](https://www.rust-lang.org/tools/install).

### Installation Guide

To integrate `foundry-zksync` into your projects, you have the flexibility to install its components individually or the entire suite at once. Follow the steps below to get started:

1. Clone the repository:

```bash
git clone git@github.com:matter-labs/foundry-zksync.git
```

2. Navigate to the project directory:

```bash
cd foundry-zksync
```

3. Prepare the Installation Script: Ensure the script is executable

```bash
chmod +x ./install-foundry-zksync
```

4. Run the Installer: Execute the script to install the foundry-zksync binaries forge and cast

```bash
./install-foundry-zksync
```

Once the `forge` and `cast` binaries are installed, you can start using `foundry-zksync`. Source your preferred profile or refresh your terminal window to activate the changes. You are now ready to begin working with `foundry-zksync`!

For component-specific installations from source:

- **Forge**: To install, execute:

```bash
cargo install --path ./crates/forge --profile local --force --locked
```

- **Cast**: To install, run:

```bash
cargo install --path ./crates/cast --profile local --force --locked
```

For the entire suite:

- Execute the following command for a comprehensive installation:

```bash
cargo build --release
```

Choose the installation that best fits your development needs.

## Configuration

### Initial Setup

After installation, initialize a new project with `forge init <project_name>`, which sets up the basic structure of a new Foundry project.

### Project Configuration using `foundry.toml`

Foundry is designed to be very configurable. You can configure Foundry using a file called `foundry.toml` in the root of your project, or any other parent directory.

Configuration can be arbitrarily namespaced by profiles. The default profile is named `default`.

You can select another profile using the `FOUNDRY_PROFILE` environment variable. You can also override parts of your configuration using `FOUNDRY_` or `DAPP_` prefixed environment variables, like `FOUNDRY_SRC`.

`forge init` creates a basic, extendable `foundry.toml` file.

To see your current configuration, run `forge config`. To see only basic options (as set with `forge init`), run `forge config --basic`. This can be used to create a new `foundry.toml` file with `forge config --basic > foundry.toml`.

By default `forge config` shows the currently selected foundry profile and its values. It also accepts the same arguments as `forge build`. An example `foundry.toml` for zkSync with zksolc configurations may look like:

```
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']

[profile.zksync]
src = 'src'
libs = ['lib']
fallback_oz = true
is_system = false
mode = "3"
```

## Basic Usage

### Running Tests

Use `forge test --zksync` to run tests written for your smart contracts. For an overview of how to write tests using `foundry-zksync` please refer to Foundry testing [here](../../test-and-debug/foundry.md).

## Deploying Smart Contracts with `forge`

### Compilation with `forge build --zksync`

`forge build --zksync` is used for compiling smart contracts into zkEVM bytecode. The compiled files are stored in a structured directory at `<PROJECT-ROOT>/zkout/`.

**Usage:**

```sh
forge build [OPTIONS] --zksync
```

**Key Compiler Options:**

- `--use-zksolc <ZK_SOLC_VERSION>`: Specify the zksolc version or a local zksolc path.
- `--is-system <SYSTEM_MODE>`: Enables system contract compilation mode (`true`/`false`).
- `--force-evmla <FORCE_EVMLA>`: Switch to the EVM legacy assembly pipeline.
- `--fallback-oz <FALLBACK_OZ>`: Recompile with `-Oz` if bytecode is too large.
- `--detect-missing-libraries`: Detect and report missing libraries.
- `-O, --optimization <LEVEL>`: Set LLVM optimization levels.
- `--zk-optimizer`: Optimize specifically for zkSync.

**Example Usage:**
Compile with default settings or specify `zksolc` version:

```sh
forge build --zksync
```

### Deployment with `forge create --zksync`

`forge create --zksync` deploys smart contracts to zkSync.

**Usage:**

```sh
forge create <CONTRACT> [OPTIONS] --rpc-url <RPC-URL> --chain <CHAIN-ID> --private-key <PRIVATE-KEY> --zksync
```

**Options:**

- `--constructor-args <ARGS>`: Specify constructor arguments.
- `--constructor-args-path <FILE>`: File path for constructor arguments.
- `<CONTRACT>`: Contract identifier in `<path>:<contractname>` format.
- `--factory-deps <FACTORY-DEPS>`: Specify factory dependencies.

**Example:**
Deploy `Greeter.sol` to zkSync Sepolia testnet:

<details>
<summary>Click to view the `Greeter.sol` contract</summary>

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
```

</details>

```bash
forge create src/Greeter.sol:Greeter --constructor-args "Hello zkSync" --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300 --zksync
```

### Deploying Factory Contracts

To deploy contracts like `GreeterFactory.sol`, use the `is-system` flag.

<details>
<summary>Click to view the `GreeterFactory.sol` contract</summary>

```solidity
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Greeter.sol";

contract Factory {
    Greeter[] public GreeterArray;

    function CreateNewGreeter(string memory _greeting) public {
        Greeter greeter = new Greeter(_greeting);
        GreeterArray.push(greeter);
    }

    function gfSetter(uint256 _greeterIndex, string memory _greeting) public {
        Greeter(address(GreeterArray[_greeterIndex])).setGreeting(_greeting);
    }

    function gfGetter(uint256 _greeterIndex) public view returns (string memory) {
        return Greeter(address(GreeterArray[_greeterIndex])).greet();
    }
}
```

</details>

**Compile `GreeterFactory.sol`:**

```bash
forge build --is-system=true --zksync
```

**Deploy `GreeterFactory.sol`:**

```sh
forge create src/GreeterFactory.sol:Factory --factory-deps src/Greeter.sol:Greeter --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300 --zksync
```

**Deploy `Greeter.sol` via `GreeterFactory.sol`:**

```sh
cast send <FACTORY_ADDRESS> "CreateNewGreeter(string)" "zkSync Rules"  --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300
```

**Interact with `Greeter.sol`**

```sh
cast call <CONTRACT_ADDRESS> "greet()(string)" --rpc-url https://sepolia.era.zksync.dev --chain 300
```

**Output:**

```
0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c7a6b53796e632052756c65730000000000000000000000000000000000000000
```

**To decode the output to a readable string:**

```sh
cast to-ascii  0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c7a6b53796e632052756c65730000000000000000000000000000000000000000
```

**Output:**

```
zkSync Rules
```

## Basic zkSync Chain Interactions with `cast`

### Introduction

This guide introduces you to fundamental interactions within the zkSync chain using `cast`, a component of the `foundry-zksync` toolkit. Learn how to query chain IDs, retrieve client versions, check L2 ETH balances, obtain gas prices, and more.

### Chain ID Retrieval

- **Local Node:**

  Retrieve the Chain ID for a local zkSync node with:

  ```sh
  cast chain-id --rpc-url http://localhost:3050
  ```

  Expected Output: `270`, indicating the Chain ID of your local zkSync node.

- **zkSync Sepolia Testnet:**

  For the zkSync Sepolia Testnet, use:

  ```sh
  cast chain-id --rpc-url https://sepolia.era.zksync.dev
  ```

  Expected Output: `300`, the Chain ID for the zkSync Sepolia Testnet.

### Client Version Information

Knowing the client version is vital for compatibility checks and debugging:

```sh
cast client --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: `zkSync/v2.0`, denoting the client version.

### L2 Balance Check

Verify the Layer 2 (L2) balance of an account:

```sh
cast balance 0x8b1d48a69ACEbC6eb201e2F4d162A002203Bfe8E --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: A numerical value, e.g., `774909739323110932`, representing the account's L2 balance.

### Current Gas Price

Fetch the current gas price on the network for transaction cost estimations:

```sh
cast gas-price --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: A value such as `100000000`, indicating the current gas price.

### Latest Block Details

Gain insights into the latest block on the zkSync chain:

```sh
cast block latest --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: Detailed information about the latest block, including base fee per gas, gas limit, block hash, and more.

### Sending Transactions

Initiate transactions, such as contract function calls, using `cast`:

```sh
cast send <CONTRACT_ADDRESS> <FUNCTION_SIGNATURE> <ARGUMENTS> --rpc-url <RPC-URL> --private-key <PRIVATE-KEY> --chain <CHAIN-ID>
```

Example:

```sh
cast send 0xe34E488C1B0Fb372Cc4a5d39219261A5a6fc7996 "setGreeting(string)" "Hello, zkSync!" --rpc-url https://sepolia.era.zksync.dev --private-key <PRIVATE-KEY> --chain 300
```

This command calls the `setGreeting` function of a contract, updating the greeting to "Hello, zkSync!". Replace `<PRIVATE-KEY>` with your actual private key.
