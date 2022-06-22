# Developer quickstart

## Do I need experience with zkSync 1.x?

Some experience with the zkSync 1.x would be helpful to understand some core concepts, e.g. how finality works. From all other aspects, zkSync 2.0 and zkSync 1.x are very different systems, and experience with the latter is not needed to build on zkSync 2.0.

## What do I need to start building?

All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like paying fees in ERC20 tokens, the zkSync SDK should be used.

The only other place where using zkSync SDK is required is during the contract deployment. This can be easily done through our hardhat plugin.

## Hello World on zkSync

Check out our step-by-step [tutorial](./hello-world.md), where you will learn:

- How to install zkSync hardhat plugin and deploy smart contracts with it.
- How to build front-end for your dApp using `zksync-web3` library.
