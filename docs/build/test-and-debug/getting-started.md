---
head:
  - - meta
    - name: "twitter:title"
      content: Getting Started | zkSync Docs
---

# Getting Started

## Testing strategies for zkSync Era

zkSync Era provides two distinct testing environments for your development needs

- Dockerized Local Setup
- In-Memory Node.

Each solution boasts unique characteristics tailored to diverse use cases. This guide aims to unpack the intricacies of these tools, aiding you in selecting the setup best suited for your development workflow.

## In-Memory node vs Dockerized Local Setup

The local testing process revolves around two principal options:

1. **Dockerized local setup**: An extensive zkSync Era network simulation that comprises a Postgres database, a local Geth node functioning as Layer 1, and the zkSync node. Opt for this setup for comprehensive simulations and testing that require interaction with both L1 and L2.

2. **In-Memory node**: A lightweight, speedy alternative, the in-memory node, supports forking the state from various networks, including the mainnet and testnet. This choice is ideal for swift testing, prototyping, and bootloader and system contract testing.

### When to use each

- Use the **Dockerized local setup** for in-depth simulations and tests that necessitate L1 and L2 interaction. This complex and detailed setup mirrors how your contracts will function within the mainnet zkSync Era network.

- Opt for the **In-Memory node** for swift testing, prototyping, or testing new changes via the local bootloader and system contracts. This setup facilitates forking the state from the mainnet or testnet, suitable for replaying transactions or observing the impact of modifications on existing contracts.

:::warning
Being in its alpha stage, the In-Memory Node comes with some constraints and doesn't fully support all functionalities. For definitive testing, Dockerized Local Setup or a testnet is highly recommended.
:::

### Feature comparison

The following table highlights the key characteristics of each testing environment for a quick comparison:

| Feature                                 | In-memory node      | Dockerized Local Setup |
| --------------------------------------- | ------------------- | ---------------------- |
| Quick startup                           | Yes                 | No                     |
| Supports forking state                  | Yes                 | No                     |
| Console.log debugging                   | Yes                 | No                     |
| Detailed call traces                    | Yes                 | No                     |
| Pre-configured 'rich' accounts          | Yes                 | Yes                    |
| Replay existing transactions            | Yes                 | No                     |
| Fast for integration testing            | Yes                 | No                     |
| Communication between Layer 1 & Layer 2 | No                  | Yes                    |
| Multiple transactions per batch         | No                  | Yes                    |
| Complete set of APIs                    | No (Basic set only) | Yes                    |
| Websocket support                       | No                  | Yes                    |

Whether you're testing new contracts, debugging transactions, or prototyping, zkSync Era provides robust options for local testing. Both the Dockerized local setup and the In-Memory Node offer feature-rich and quick setup options, each with their distinct strengths and limitations. Choose the most appropriate setup based on your specific needs, and happy testing!

## Using zkSync CLI for Easy Setup

The [zkSync CLI](../../build/tooling/zksync-cli/getting-started.md) makes it simple for developers to work with both Dockerized Local Setup and In-Memory Node. Just use `zksync-cli dev start` to get your local development environment running and choose to use additional modules like Block Explorer, Wallet and Bridge.

## zkSync Era local testing

- [Dockerized L1 - L2 Nodes](../../build/test-and-debug/dockerized-l1-l2-nodes.md)
- [In-memory node testing](../../build/test-and-debug/era-test-node.md)
- [zkSync CLI](../../build/tooling/zksync-cli/getting-started.md)
