# zkSync Documentation

This documentation is intended to assist you in developing on zkSync. 
It introduces the concept of zkSync, describes the zkSync network stack, and some advanced subjects for complex applications and use cases.

Because the documentation is open-sourced, feel free to suggest new topics, add new content, and provide examples wherever you believe they will be useful. If you're unsure how to proceed, [follow these instructions](./glossary/edit-doc.md).

## Fundamental topics

If this is your first time using zkSync, we recommend that you kick off at the beginning and work your way through the documentation like you would with a book.

- [Intro to rollups](./fundamentals/rollups.md) - A brief overview of rollups.
- [zkSync Overview](./fundamentals/zkSync.md) - A quick overview of zkSync technologies.
- [zkSync testnet](./fundamentals/testnet.md) - A brief intro into zkSync testnest.
 
### Developer guides

- [Quickstart](./developer-guides/hello-world.md) - Learn how to build a full dApp using the zkSync development toolbox.
- [Contract deployment](./developer-guides/contracts/contracts.md) - A guide on how to deploy smart contracts on zkSync.
  - [Contract verification](./developer-guides/contracts/contract-verification.md) - A guide on how to verify smart contracts with zkSync block explorer.
- [System contracts](./developer-guides/contracts/system-contracts.md) - A brief overview of zkSync system contracts.
- [Transactions](./developer-guides/transactions/transactions.md) - A guide on how zkSync handles transactions.
  - [Account abstraction](./developer-guides/transactions/aa.md) - Learn about account abstraction.
  - [Blocks](./developer-guides/transactions/blocks.md) - Learn how blocks work on zkSync.
- [Fee mechanism](./developer-guides/fee-model.md) - A quick overview of the zkSync fee structure.
- [bridging of funds](./developer-guides/bridging/bridging-asset.md) - A brief intro on token bridging.
  - [L1 / L2 Interoperability](./developer-guides/bridging/l1-l2-interop.md) - A quick brief on data communication between l1 and l2.
    - [L1 / L2 communication](./developer-guides/bridging/l1-l2.md) - Learn how to send data from Ethereum to zkSync.
    - [L2 / L1 communication](./developer-guides/bridging/l2-l1.md) - Learn how to send data from zkSync to Ethereum.
- [Troubleshooting](./troubleshooting/reporting-issues.md) - Report known issues to us here.
  - [Important links](./troubleshooting/important-links.md) - Get a quick reference to important links.
  - [Temporary limitations](./troubleshooting/temp-limits.md)
  - [Status](./troubleshooting/status.md) - Get updates on things we are currently working on.
  - [FAQ](./troubleshooting/faq/known-issues.md) - Get answers to your frequently asked questions

- [Glossary](./glossary/glossary.md) - An alphabetical list of words relating to zkSync and its ecosystem.

### Developer Tools

- Faucet, bridge, wallet - Explore our faucet, bridge and wallet feature.
[zkSync 2.0 Portal](https://portal.zksync.io)
- Block explorer - Search for real-time and historical information about blocks, transactions, addresses, and more on zkSync.
[Explorer](https://zksync2-testnet.zkscan.io)

### Examples and tutorials

- [Cross-chain governance](./tutorials/cross-chain-tutorial.md) - Learn how to use L1 to L2 contract interaction.
- [Account abstraction](./tutorials/custom-aa-tutorial.md) - Learn how to deploy your custom accounts and interact zkSync system contracts.
- [Building custom paymasters](./tutorials/custom-paymaster-tutorial.md) - Learn how to build a custom paymaster to allow users to pay fees in your token.