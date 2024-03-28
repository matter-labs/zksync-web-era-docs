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

2. Navigate to the project directory and switch to the main branch:

   ```bash
   cd foundry-zksync && git checkout main
   ```

For component-specific installations:

- **zkForge**: To install, execute:

  ```bash
  cargo install --path ./crates/zkforge --profile local --force --locked
  ```

- **zkCast**: To install, run:

  ```bash
  cargo install --path ./crates/zkcast --profile local --force --locked
  ```

For the entire suite:

- Execute the following command for a comprehensive installation:

  ```bash
  cargo build --release
  ```

Choose the installation that best fits your development needs.

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

Use `zkforge test` to run tests written for your smart contracts. For an overview of how to write tests using `Foundry-zksync` please refer to Foundry testing [here](../../test-and-debug/foundry.md).

## Deploying Smart Contracts with `zkforge`

### Compilation with `zkforge zk-build`

`zkforge zkbuild` (also accessible via aliases like `zkforge zk-build`, `zkforge zk-compile`, `zkforge zkb`) is used for compiling smart contracts into zkEVM bytecode. The compiled files are stored in a structured directory at `<PROJECT-ROOT>/zkout/`.

**Usage:**

```sh
zkforge zkbuild [OPTIONS]
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
zkforge zkbuild

# specifying zksolc version
zkforge zkbuild --use-zksolc v1.3.19
```

### Deployment with `zkforge zk-create`

`zkforge zkcreate` (and its aliases `zkforge zk-create`, `zkforge zk-deploy`, `zkforge zkc`) deploys smart contracts to zkSync.

**Usage:**

```sh
zkforge zkcreate <CONTRACT> [OPTIONS] --rpc-url <RPC-URL> --chain <CHAIN-ID> --private-key <PRIVATE-KEY>
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
zkforge zkcreate src/Greeter.sol:Greeter --constructor-args "Hello zkSync" --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300
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
zkforge zkbuild --is-system=true
```

**Deploy `GreeterFactory.sol`:**

```sh
zkforge zkcreate src/GreeterFactory.sol:Factory --factory-deps src/Greeter.sol:Greeter --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300
```

**Deploy `Greeter.sol` via `GreeterFactory.sol`:**

```sh
zkcast zk-send <FACTORY_ADDRESS> "CreateNewGreeter(string)" "zkSync Rules"  --private-key <PRIVATE_KEY> --rpc-url https://sepolia.era.zksync.dev --chain 300
```

**Interact with `Greeter.sol`**

```sh
zkcast call <CONTRACT_ADDRESS> "greet()(string)" --rpc-url https://sepolia.era.zksync.dev --chain 300
```

**Output:**

```
0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c7a6b53796e632052756c65730000000000000000000000000000000000000000
```

**To decode the output to a readable string:**

```sh
zkcast to-ascii  0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c7a6b53796e632052756c65730000000000000000000000000000000000000000
```

**Output:**

```
zkSync Rules
```

## Basic zkSync Chain Interactions with `zkcast`

### Introduction

This guide introduces you to fundamental interactions within the zkSync chain using `zkcast`, a component of the `foundry-zksync` toolkit. Learn how to query chain IDs, retrieve client versions, check L2 ETH balances, obtain gas prices, and more.

### Chain ID Retrieval

- **Local Node:**

  Retrieve the Chain ID for a local zkSync node with:

  ```sh
  zkcast chain-id --rpc-url http://localhost:3050
  ```

  Expected Output: `270`, indicating the Chain ID of your local zkSync node.

- **zkSync Sepolia Testnet:**

  For the zkSync Sepolia Testnet, use:

  ```sh
  zkcast chain-id --rpc-url https://sepolia.era.zksync.dev
  ```

  Expected Output: `300`, the Chain ID for the zkSync Sepolia Testnet.

### Client Version Information

Knowing the client version is vital for compatibility checks and debugging:

```sh
zkcast client --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: `zkSync/v2.0`, denoting the client version.

### L2 Balance Check

Verify the Layer 2 (L2) balance of an account:

```sh
zkcast balance 0x8b1d48a69ACEbC6eb201e2F4d162A002203Bfe8E --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: A numerical value, e.g., `774909739323110932`, representing the account's L2 balance.

### Current Gas Price

Fetch the current gas price on the network for transaction cost estimations:

```sh
zkcast gas-price --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: A value such as `100000000`, indicating the current gas price.

### Latest Block Details

Gain insights into the latest block on the zkSync chain:

```sh
zkcast block latest --rpc-url https://sepolia.era.zksync.dev
```

Expected Output: Detailed information about the latest block, including base fee per gas, gas limit, block hash, and more.

### Sending Transactions

Initiate transactions, such as contract function calls, using `zkcast`:

```sh
zkcast zk-send <CONTRACT_ADDRESS> <FUNCTION_SIGNATURE> <ARGUMENTS> --rpc-url <RPC-URL> --private-key <PRIVATE-KEY> --chain <CHAIN-ID>
```

Example:

```sh
zkcast zk-send 0x97b985951fd3e0c1d996421cc783d46c12d00082 "setGreeting(string)" "Hello, zkSync!" --rpc-url http://localhost:3050 --private-key <PRIVATE-KEY> --chain 270
```

This command calls the `setGreeting` function of a contract, updating the greeting to "Hello, zkSync!". Replace `<PRIVATE-KEY>` with your actual private key.

### Bridging Assets Between L1 and L2

#### L1 to L2 Deposits

Deposit assets from Layer 1 (Ethereum) to Layer 2 (zkSync):

```sh
zkcast zk-deposit <RECIPIENT_ADDRESS> <AMOUNT> <TOKEN> --l1-rpc-url <L1-RPC-URL> --l2-url <L2-RPC-URL> --chain <CHAIN-ID> --private-key <PRIVATE-KEY>
```

Note: For ETH deposits, leave the `<TOKEN>` parameter empty.

Example (Depositing ETH):

```sh
zkcast zk-deposit 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 1 ether --l1-rpc-url http://localhost:8545 --l2-url http://localhost:3050 --private-key <PRIVATE-KEY> --chain 270
```

#### L2 to L1 Withdrawals

Withdraw assets from Layer 2 back to Layer 1:

```sh
zkcast zk-send --withdraw <RECIPIENT_ADDRESS> --amount <AMOUNT> <TOKEN> --rpc-url <L2-RPC-URL> --private-key <PRIVATE-KEY> --chain <CHAIN-ID>
```

Example (Withdrawing ETH):

```sh
zkcast zk-send --withdraw 0x36615Cf349d7F6344891B1e7CA7C728

83F5dc049 --amount 1 ether --rpc-url http://localhost:3050 --private-key <PRIVATE-KEY> --chain 270
```
