<!-- 
## zkSync 2.0

**zkSync 2.0** is the new version of the protocol, which is the first ZK Rollup to natively support Solidity smart contract development.

- Want to start building right now? Head over to the [quickstart guide](#developer-quickstart).
- New to rollups and want to learn more? Here is the [intro to zkSync](./concepts.md).

::: warning Closed testnet

The testnet is being rolled out gradually as our team wants to gather feedback before the public launch.

Please, **DO NOT** share this documentation with anyone outside of your team.

:::

## Developer quickstart

### Do I need experience with zkSync 1.x?

Some experience with the zkSync 1.x would be helpful to understand some core concepts, e.g. how finality works. From all other aspects, zkSync 2.0 and zkSync 1.x are very different systems, and experience with the latter is not needed to build on zkSync 2.0.

If you do have experience building on zkSync 1.x, [here](./v1-vs-v2.md) is a guide on the notable differences.

### What do I need to start building?

All the existing SDKs for Ethereum will work out of the box and your users will have the same experience as on Ethereum. If you want to enable advanced zkSync features, like paying fees in ERC20 tokens, the zkSync SDK should to be used.

The only other place where using zkSync SDK is required is during the contract deployment. This can be easily done through our hardhat plugin.

### Hello World on zkSync

Check out our step-by-step [tutorial](./tutorials/basic.md), where you will learn:

- How to install zkSync hardhat plugin and deploy smart contracts with it.
- How to build front-end for your dApp using `zksync-web3` library. -->

<!-- ### Transaction types -->

<!--

Sidenote: These protocol details are mostly relevant when the zkPorter part is available:

The main part of zkSync 2.0 is the state tree. It's a sparse Merkle tree with a depth of 265, which holds account states. The topmost 8 bits denote the type of the protocol to be used (0 stands for `zkRollup` and 1 stands for `zkPorter`, the rest 254 types are reserved for the future). Each protocol has a storage space of `2^256` slots.

_Note:_ Each account exists in each subtree at the same time, e.g. account can have its funds stored in cold reserve in the zkRollup part and have all trading done on the zkPorter side.

-->
