---
head:
  - - meta
    - name: "twitter:title"
      content: Foundry | zkSync Docs
---

# zkSync Foundry Testing

For instructions on how to install `foundry-zksync` please refer to the [Getting Started](../tooling/foundry/getting-started.md) page.

## Overview

`foundry-zksync`, a fork of Foundry, provides developers with a tailored testing framework designed specifically for zkSync environments. Utilizing `forge test --zksync`, you can execute your smart contract tests efficiently. Tests are written in Solidity, and the framework is designed to recognize any contract function prefixed with `test` as a test case. By convention, tests are typically stored within the `test/` directory and have a `.t.sol` extension.

:::info
For more detailed documentation related to Foundry testing please refer to the official upstream Foundry documentation [here](https://book.getfoundry.sh/forge/tests).
:::

## Running Tests

To initiate your tests, use the `forge test --zksync` command with the `--zksync` flag, or incorporate `vm.zkVm(true)` within your tests. This command automatically locates and executes tests across your source directory. Here's an example of executing tests in a standard project setup:

```bash
forge test --zksync

Running 2 tests for test/Counter.t.sol:CounterTest
[PASS] testFuzz_SetNumber(uint256) (runs: 256, μ: 27553, ~: 28409)
[PASS] test_Increment() (gas: 28379)
Test result: ok. 2 passed; 0 failed; 0 skipped; finished in 96.80ms
```

### Filtering Tests

You can run specific tests by filtering based on the contract or test names:

```bash
forge test --match-contract CounterTest --match-test test_Increment --zksync
```

This command will execute only the tests within `CounterTest` that include `test_Increment` in their name.

Similarly, you can use `--match-path` to run tests in files that match a specific glob pattern:

```bash
forge test --match-path test/Counter.t.sol --zksync
```

Inverse filters are available through `--no-match-contract`, `--no-match-test`, and `--no-match-path` flags.

## Watch Mode

To automatically re-run tests upon any file changes, use the `forge test --watch --run-all --zksync` command.

## Writing Tests

Tests are structured as Solidity contracts, often inheriting from the Forge Standard Library's `Test` contract for enhanced functionality, including basic assertions and logging:

```solidity
pragma solidity 0.8.10;

import "forge-std/Test.sol";

contract ContractBTest is Test {
    uint256 testNumber;

    function setUp() public {
        testNumber = 42;
    }

    function test_NumberIs42() public {
        assertEq(testNumber, 42);
    }

    function testFail_Subtract43() public {
        testNumber -= 43;
    }
}
```

### Key Concepts

- **`setUp`:** An optional function that runs before each test, used for initializing test conditions.
- **`test`:** Prefix for functions that are recognized as tests. These functions must either pass or revert to indicate success or failure, respectively.
- **`testFail`:** A prefix for test functions expected to revert. If such a function does not revert, the test is considered failed.

### Cheatcodes

Cheatcodes allow you to change the block number, your identity, and more. `foundry-zksync` supports the most common cheatcodes. For an exhaustive list of supported cheatcodes refer to the supported table [here](https://github.com/matter-labs/foundry-zksync/blob/main/SUPPORTED_CHEATCODES.md).
