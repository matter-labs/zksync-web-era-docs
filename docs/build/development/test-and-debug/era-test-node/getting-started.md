---
head:
  - - meta
    - name: "twitter:title"
      content: Getting started | zkSync Era Docs
---

# Getting started

### Prerequisites

Before you get started, there are a few prerequisites to consider. Ensure that your development environment meets the following requirements:

- **Rust:** Since `era-test-node` is written in Rust, you need to have Rust installed on your machine. You can download Rust from [here](https://www.rust-lang.org/tools/install).
- **Other Dependencies:** This crate relies on `rocksDB` for its operation. If you encounter any compile errors due to `rocksDB`, you might also need to install some dependencies with the following command: `apt-get install -y cmake pkg-config libssl-dev clang`.

After checking all these prerequisites, you should be ready to use the `era-test-node`. Please keep in mind that `era-test-node` is still in its **alpha** stage, so some features might not be fully supported yet.

### Quickstart

:::info
**Repository:** [**https://github.com/matter-labs/era-test-node**](https://github.com/matter-labs/era-test-node)

**Learn to contribute:** [**CONTRIBUTING.md**](https://github.com/matter-labs/era-test-node/blob/main/.github/CONTRIBUTING.md)

**Rust docs:** [**RUST Doc**](https://matter-labs.github.io/era-test-node/era_test_node/index.html)
:::info

Begin by installing `era-test-node` using the command:

```bash
cargo install --git https://github.com/matter-labs/era-test-node.git --locked
```

Rust should install it in the `~/.cargo/bin` directory.

To start the node, execute:

```bash
era_test_node run
```

The expected output will be as follows:

```bash
Starting network with chain id: L2ChainId(260)

Rich Accounts
=============
Account #0: 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 (10000 ETH)
Private Key: 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110

Account #1: 0xa61464658AfeAf65CccaaFD3a512b69A83B77618 (10000 ETH)
Private Key: 0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3

Account #2: 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e (10000 ETH)
Private Key: 0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e

Account #3: 0xA13c10C0D5bd6f79041B9835c63f91de35A15883 (10000 ETH)
Private Key: 0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8

========================================
  Node is ready at 127.0.0.1:8011
========================================
```

:::info
When utilizing `era-test-node` with MetaMask, it's essential to note that any restart of the in-memory node will necessitate a reset of MetaMask's cached account data (nonce, etc). To do this, navigate to 'Settings', then 'Advanced', and finally, select 'Clear activity tab data'.
:::

### Network details

The `era_test_node` has the following default network configurations:

- **L2 RPC:** `http://localhost:8011`
- **Network Id:** 260

These can be configured to your preference.
