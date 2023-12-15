# Testing bootloader and system contracts

`era-test-node` enables you to test locally compiled bootloader and system contracts, allowing you to examine the effects of changes on already deployed contracts. Follow these steps to get started:

### Prerequisites

Before proceeding, ensure you have set the `$ZKSYNC_HOME` environment variable in your shell profile file (e.g., `~/.bash_profile`, `~/.zshrc`) to target your local copy of `era-test-node`. For example:

```bash
# Add path here:
export ZKSYNC_HOME=/path/to/era-test-node

export PATH=$ZKSYNC_HOME/bin:$PATH
```

### Make changes to local contracts

Navigate to the system contracts directory:

```bash
cd etc/system-contracts
```

Make desired changes to the available system contracts, or add contract to be included.&#x20;

### Compile Contracts

Preprocess and compile the contracts:

```bash
yarn preprocess && yarn hardhat run ./scripts/compile-yul.ts
```

### Use Local Contracts

Now that you have locally compiled the bootloader and system contracts, you can use them with `era-test-node`. Run the following command:

```bash
RUST_LOG=vm=trace era_test_node --dev-use-local-contracts fork testnet
```

This command starts `era-test-node` in fork mode using the locally compiled contracts for testing. You can now examine the effects of changes on these contracts without affecting the mainnet or testnet!
