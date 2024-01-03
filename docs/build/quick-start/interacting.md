---
head:
  - - meta
    - name: "twitter:title"
      content: Interact with zkSync Era | zkSync Docs
---

# Interact with zkSync Era

## Do I need experience with zkSync Lite?

Some experience with zkSync Lite would be helpful to understand some core concepts, e.g. how finality works. From all other aspects, zkSync Era and zkSync Lite are very different systems, and experience with the latter is not needed to build on zkSync Era.

## What do I need to start building?

All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like account abstraction, the zkSync SDK should be used.

The only other place where using zkSync SDK is required is during contract deployment. This can be easily done through our hardhat plugin.

### Quickstart on zkSync

Before diving into the technical details, we highly recommend checking out our [Security considerations](./best-practices.md) and [Differences with Ethereum](../../build/technical-reference/architecture/differences-with-ethereum.md) sections. This will help align your development with the distinctive attributes of zkSync Era and ensure your projects are secure and optimized.

Check out our step-by-step [quickstart guide](../../build/quick-start/hello-world.md), where you will learn:

- How to install zkSync hardhat plugin and deploy smart contracts with it.
- How to build the front-end for your dApp using the `zksync-web3` library.

### Connecting to zkSync Era on Metamask

In order to add the zkSync Era alpha mainnet network to your wallet, you will need to enter the following details:

1. Sign into your Metamask wallet and click on the network in the top center:

![img](../../assets/images/connect-1.png)

2. Click on **Add network**.

3. Scroll down to the bottom of the network list and click **Add network manually**.

4. Fill in the zkSync Era mainnet or testnet network details:

#### Mainnet network info

- Network Name: `zkSync Era Mainnet`
- RPC URL: `https://mainnet.era.zksync.io`
- Chain ID: `324`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://explorer.zksync.io/`
- WebSocket URL: `wss://mainnet.era.zksync.io/ws`

#### Sepolia testnet network info

- Network Name: `zkSync Era Sepolia Testnet`
- RPC URL: `https://sepolia.era.zksync.dev`
- Chain ID: `300`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://sepolia.explorer.zksync.io/`
- WebSocket URL: `wss://sepolia.era.zksync.dev/ws`

#### Goerli testnet network info

:::warning
Goerli testnet will be deprecated in January 2024.
:::

- Network Name: `zkSync Era Testnet`
- RPC URL: `https://zksync2-testnet.zksync.dev`
- Chain ID: `280`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://goerli.explorer.zksync.io/`
- WebSocket URL: `wss://testnet.era.zksync.dev/ws`

5. Click "Save"
