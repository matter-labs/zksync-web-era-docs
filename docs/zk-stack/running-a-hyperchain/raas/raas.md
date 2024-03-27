---
head:
  - - meta
    - name: "twitter:title"
      content: Deploying ZK Stack Hyperchain Via RAAS | zkSync Docs
---

# Deploy Hyperchain Using RAAS

:::warning

ZK Stack is still under development. We advise you to only use for local and testnet deployments.
:::

## Deploying and running using a Rollup As A Service Provider

Looking to deploy a ZK Stack chain but worried about complexities? RAAS providers are here to simplify the process! Providers offer scalable and secure nodes, and may provide quick and user-friendly interfaces, allowing you to deploy your ZK Stack chain with ease and efficiency. Experience the seamless integration of advanced blockchain technology without the hassle. Get started today and revolutionise your product with the power of RAAS and ZK Stack!

Use RAAS in to improve scalability, reduce costs, access specialized services, speed up development, enhance interoperability, and maintain flexibility in an ever-evolving technological landscape.

The list of RAAS providers you can use to deploy and customise their your hyperchain:

<!-- * [Caldera](https://www.caldera.xyz/) -->

- [Zeeve](https://www.zeeve.io/appchains/zksync-hyperchains-zkrollups/)

- [Ankr](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/ankrpbc1684783099666.ankr_appchains?tab=Overview/)

- [AltLayer](https://altlayer.io/raas)

- [Magic](https://magic.link/docs/blockchains/other-chains/evm/zksync)

- [Luganodes](https://www.luganodes.com/product/zkraas/)

## Using your hyperchain

### Using RAAS Dashboard

Some Rollup-As-A-Service providers provide a simple user friendly dashboard for managing & monitoring your hyperchain. If this is the case, you can likely manage most of the settings directly there.

### Funding accounts

#### Base layer is the local geth node ([@matterlabs/geth:latest](https://hub.docker.com/r/matterlabs/geth))

- If you chose to deploy your hyperchain as an instance on the server on local geth node, and your RAAS provider did not prefund the hyperchain, you will have a set of addresses that have 100 ETH each. You can find the list [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json) and use these addresses to deposit into your hyperchain via the bridge.

#### Base layer is an Ethereum network (e.g., Sepolia)

- If you chose to deploy your hyperchain as an instance on an Ethereum network (e.g., Sepolia), you need to have an account on the base layer with ETH. You can use the deployer, governor, or operator wallets provided by your RAAS or setup manually setup during the configuration, or any other one you have funds on, to deposit into your hyperchain via the bridge.

Once you have the accounts with funds on the L1 base layer, you can do a deposit via the bridge to your hyperchain, and any further interactions with your hyperchain.

### Using your hyperchain RPC

Your RAAS will either provide external RPC nodes, or your server contains them. Both HTTPS as well as WebSocket (WS) services are provided that are fully web3 compatible (and contain some extra ZK Stack functionalities). Learn more about it [here](../../build/api.md).

### Using [zksync-cli](https://github.com/matter-labs/zksync-cli)

zkSync CLI allows you to easily interact and develop applications on your hyperchain. When executing any command with zksync-cli, you can specify RPC urls provided by the RAAS provider for both L1 and L2. An example deposit command via the bridge would look like:

```bash
npx zksync-cli bridge deposit --rpc=http://localhost:3050 --l1-rpc=http://localhost:8545 --zeek
```

### Using [Portal](https://github.com/matter-labs/dapp-portal)

The dApp Portal module allows you to:

- View balances, transfer and bridge tokens to your hyperchain.
- Add contacts for quick and easy access.

Your RAAS provider likely gave you the option to setup the Portal module during the hyperchain configuration.

If you chose this option, you can navigate to the displayed Portal URL provided by the RAAS.

If did not choose this option but wish to enable it later, you can use the RAAS dashboard, or contact your provide, or follow the guide [here](/zk-stack/running-a-hyperchain/locally/quickstart.md#using-portal) to setup the Portal module for your server.

### Using [Block Explorer](https://github.com/matter-labs/block-explorer)

A block explorer was likely setup during configuration by your RAAS, and now running.

The RAAS provider should have provided you with links to access front-end `App` in your browser, `API`, `Worker`, and `Data Fetcher`.

If a block explorer was not provided, you can follow the guide [here](/zk-stack/running-a-hyperchain/locally/quickstart.md#using-block-explorer) to setup the open source explorer for your server.

## Addendum

- If you make changes to any contract, you can always deploy a new hyperchain to easily test those changes.

- For now, it is only possible to deploy a hyperchain as an L2, but soon it will also work as L3s.
