# zkSync Era Documentation

This documentation is intended to assist you in developing on zkSync.
It introduces the concepts of zkSync, describes the zkSync network stack, and some advanced topics for complex applications and use cases.

Given this documentation is open-sourced, feel free to suggest new topics, add new content, and provide examples wherever you believe they will be useful. If you're unsure how to proceed, [follow these instructions](./troubleshooting/docs-contribution/docs.md).

## Fundamental topics

If this is your first time using zkSync, we recommend that you kick off at the beginning and work your way through the documentation like you would with a book.

- [Intro to rollups](./fundamentals/rollups.md) - A brief overview of rollups.
- [zkSync Era basics](./fundamentals/zkSync.md) - A quick overview of zkSync Era technologies.
- [Interacting with zkSync Era](./fundamentals/interacting.md) - A brief intro into zkSync Era Testnet.
- [Hyperscaling](./fundamentals/hyperscaling.md) - Understand hyperchains in zkSync.

### Understanding zkSync Era

- [Transactions](./developer-guides/transactions/transactions.md) - A guide on how zkSync handles transactions.
- [Blocks](./developer-guides/transactions/blocks.md) - Learn how blocks work on zkSync.
- [System contracts](./developer-guides/system-contracts.md) - A brief overview of zkSync system contracts.
- [Account abstraction](./developer-guides/aa.md) - Learn about account abstraction.
- [Fee mechanism](./developer-guides/transactions/fee-model.md) - A quick overview of the zkSync fee structure.
- [Bridging of funds](./developer-guides/bridging/bridging-asset.md) - A brief intro on token bridging.
    - [Add tokens to bridge](./developer-guides/bridging/bridging-asset.md#add-tokens-to-the-bridge) - Add your token to the bridge.
- [L1 / L2 Interoperability](./developer-guides/bridging/l1-l2-interop.md) - A quick brief on data communication between L1 and L2.
- [Video resources](./developer-guides/videos.md) - Watch developer related videos and zkSync Era.

### Building on zkSync Era

- [Quickstart](./building-on-zksync/hello-world.md) - Learn how to build a full dApp using the zkSync development toolbox.
- [Smart contract deployment](./building-on-zksync/contracts/contract-development.md) - A guide on how to deploy smart contracts on zkSync.
- [Verify contracts](./building-on-zksync/contracts/contract-verification.md) - A guide on how to verify smart contracts with zkSync block explorer.
- [Handling events](./building-on-zksync/events.md) - Learn how to handle events in zkSync Era.

### Tutorials

- [Cross-chain governance](./tutorials/cross-chain-tutorial.md) - Learn how to use L1 to L2 contract interaction.
- [Account abstraction multisig](./tutorials/custom-aa-tutorial.md) - Learn how to deploy your custom accounts and interact zkSync system contracts.
- [Daily Spending Limit](./tutorials/aa-daily-spend-limit.md) - Learn how to create a daily spend limit in your smart contract using Account Abstraction.
- [Building custom paymasters](./tutorials/custom-paymaster-tutorial.md) - Learn how to build a custom paymaster to allow users to pay fees in your 
- [Paymaster Tutorial with API3 dAPIs](./tutorials/custom-paymaster-tutorial-api3.md)
token.

### Troubleshooting

- [Changelogs](./troubleshooting/changelog.md) - Get updates, breaking changes and new features on zkSync Era.
- [Contribute to documentation](./troubleshooting/docs-contribution/docs.md) - Learn the guidelines needed to be a contributor to the zkSync Era docs.
- [FAQs](./troubleshooting/faq.md) - Popular questions and answers about zkSync Era.

### Tools and SDKs

- [zkSync Era Portal](https://portal.zksync.io) - Explore Wallet, Bridge and Faucet features.
- [Block Explorer](../tools/block-explorer/) - Search for real-time and historical information about blocks, transactions, addresses, and more on zkSync block explorer.
- [Javascript SDK](../api/js/) - Extending the capabilities of Ethers, our Javascript SDK contains specific classes and methods required to build on zkSync Era.
- [Hardhat Plugins](../tools/hardhat/) - Use our Hardhat zkSync plugins to compile, test, deploy, and verify your Solidity or Vyper based 
- [zkSync CLI](../tools/zksync-cli/) - Simplify your development process and interact with zkSync Era from your terminal with zkSync CLI.
- [Compiler Toolchain](../tools/compiler-toolchain/overview.md) - Learn about our compiler toolchain.
- [Python SDK](../api/python/) - Explore all the Python methods and functions required to build on zkSync Era.
- [Java SDK](../api/java/getting-started.md) - Explore all the Java methods and functions required to build on zkSync Era.