---
head:
  - - meta
    - name: "twitter:title"
      content: Interact with zkSync Era | zkSync Docs
---

# Interact with zkSync Era

## What do I need to start building?

All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like account abstraction, the zkSync SDK should be used.

The only other place where using zkSync SDK is required is during [contract deployment](../developer-reference/contract-deployment.md). This can be easily done through our [Hardhat plugin](../tooling/hardhat/hardhat-zksync-deploy.md).

### Setting up your wallet

To configure zkSync Era (and testnets) in your wallet [follow this guide](../quick-start/add-zksync-to-metamask.md).

### Quickstart on zkSync

Before diving into the technical details, we highly recommend checking out our [Security considerations](./best-practices.md) and [Differences with Ethereum](../../build/developer-reference/differences-with-ethereum.md) sections. This will help align your development with the distinctive attributes of zkSync Era and ensure your projects are secure and optimized.

Check out our step-by-step [quickstart guide](../../build/quick-start/hello-world.md), where you will learn:

- How to install zkSync hardhat plugin and deploy smart contracts with it.
- How to build the front-end for your dApp using the `zksync-ethers` library.
