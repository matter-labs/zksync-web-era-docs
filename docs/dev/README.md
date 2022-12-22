# zkSync Documentation

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

This documentation is intended to assist you in developing on zkSync. 
It introduces the concepts of zkSync, describes the zkSync network stack, and some advanced topics for complex applications and use cases.

Given this documentation is open-sourced, feel free to suggest new topics, add new content, and provide examples wherever you believe they will be useful. If you're unsure how to proceed, [follow these instructions](./troubleshooting/docs-contribution/docs.md).

## Fundamental topics

If this is your first time using zkSync, we recommend that you kick off at the beginning and work your way through the documentation like you would with a book.

- [Intro to rollups](./fundamentals/rollups.md) - A brief overview of rollups.
- [zkSync overview](./fundamentals/zkSync.md) - A quick overview of zkSync technologies.
- [zkSync testnet](./fundamentals/testnet.md) - A brief intro into zkSync testnest.

### Developer guides

- [Quickstart](./developer-guides/hello-world.md) - Learn how to build a full dApp using the zkSync development toolbox.
- [Contract deployment](./developer-guides/contracts/contracts.md) - A guide on how to deploy smart contracts on zkSync.
  - [Contract verification](../api/tools/block-explorer/contract-verification.md) - A guide on how to verify smart contracts with zkSync block explorer.
- [System contracts](./developer-guides/contracts/system-contracts.md) - A brief overview of zkSync system contracts.
- [Transactions](./developer-guides/transactions/transactions.md) - A guide on how zkSync handles transactions.
  - [Blocks](./developer-guides/transactions/blocks.md) - Learn how blocks work on zkSync.
  - [Fee mechanism](./developer-guides/transactions/fee-model.md) - A quick overview of the zkSync fee structure.
- [Account abstraction](./developer-guides/aa.md) - Learn about account abstraction.
- [Bridging of funds](./developer-guides/bridging/bridging-asset.md) - A brief intro on token bridging.
  - [L1 / L2 Interoperability](./developer-guides/bridging/l1-l2-interop.md) - A quick brief on data communication between L1 and L2.
    - [L1 / L2 communication](./developer-guides/bridging/l1-l2.md) - Learn how to send data from Ethereum to zkSync.
    - [L2 / L1 communication](./developer-guides/bridging/l2-l1.md) - Learn how to send data from zkSync to Ethereum.
- [Important links](./troubleshooting/important-links.md) - Get a quick reference to important links.
- [Status](./troubleshooting/status.md) - Get updates on things we are currently working on.
- [Known Issues](./troubleshooting/known-issues.md) - Get answers to common issues you may find.

### Tools and SDKs

- [zkSync 2.0 Portal](https://portal.zksync.io) - Explore Wallet, Bridge and Faucet features.
- [Block explorer](../api/tools/block-explorer/) - Search for real-time and historical information about blocks, transactions, addresses, and more on zkSync block explorer.
- [Javascript SDK](../api/js/) - Extending the capabilities of Ethers, our Javascript SDK contains specific classes and methods required to build on zkSync 2.0.
- [Python SDK](../api/python/) - Explore all the Python methods and functions required to build on zkSync 2.0.
- [Go SDK](../api/go/) - Explore all the GO methods and functions required to build on zkSync 2.0.
- [Java SDK](../api/java/) - Explore all the Java methods and functions required to build on zkSync 2.0.
- [Hardhat Plugins](../api/hardhat/) - Use our Hardhat zkSync plugins to compile, test, deploy, and verify your Solidity or Vyper based applications.
- [zkSync CLI](../api/tools/zksync-cli/) - Simplify your development process and interact with zkSync 2.0 from your terminal with zkSync CLI.

### Examples and tutorials

- [Cross-chain governance](./tutorials/cross-chain-tutorial.md) - Learn how to use L1 to L2 contract interaction.
- [Account abstraction](./tutorials/custom-aa-tutorial.md) - Learn how to deploy your custom accounts and interact zkSync system contracts.
- [Building custom paymasters](./tutorials/custom-paymaster-tutorial.md) - Learn how to build a custom paymaster to allow users to pay fees in your token.
