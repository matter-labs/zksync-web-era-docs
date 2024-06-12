---
head:
  - - meta
    - name: "twitter:title"
      content: Enabling Prover | zkSync Docs
---

# Enabling Prover

With the default configuration, your ZK Chain is not running a prover, and has a `DummyExecutor` contract, which mainly “accepts” that a batch is executed without proof. This enables you to test it with much lower hardware requirements.

To enable the prover, run the `zk stack prover-setup` command. It will guide through the necessary configuration.

> :warning: Running a prover is not required for deploying a testnet. The requirements below are only necessary if you want to enable the prover.

## Requirements for CPU Prover

The docker compose file assumes you will be running all components in the same machine. The current minimum requirements for a low TPS scenario are:

- 32 Core CPU
- 128 GB of RAM
- 700 of Disk Space (SSD preferred)

## Requirements for GPU Prover

The docker compose file assumes you will be running all components in the same machine. The current minimum requirements for a low TPS scenario are:

- 16 GB VRAM NVIDIA GPU
- 16 Core CPU
- 64 GB of RAM
- 300 GB of Disk Space (SSD preferred)
