---
head:
  - - meta
    - name: "twitter:title"
      content: Using Your ZK Chain RPC | zkSync Docs
---

# Using Your ZK Chain RPC

Your server contains both HTTPS as well as WS services that are fully web3 compatible (and contain some extra ZK Stack functionalities).

By default your server is available at <http://localhost:3050> - but if you deployed the server into some cloud provider, you will have a different URL to interact with.

## Using zksync-cli

When executing any command with zksync-cli, you can specify RPC urls for both L1 and L2 if you choose “localnet” as your network. An example deposit command would look like:

```bash
npx zksync-cli bridge deposit --rpc=http://localhost:3050 --l1-rpc=http://localhost:8545 --zeek
```

## Using dApp Portal

You can run the Portal module locally, and point it to your ZK Chain configuration. It comes with scripts that help pulling the ZK Chain configuration from your zksync-era repo and adapting to portal needs. Learn more here. An example command would look like:

```bash
npm run hyperchain:migrate ../zksync-era
npm run dev:node:hyperchain
```

## Using Block Explorer

Block explorer contains three components (Worker, API, and App), which you can run all together locally and connect to your ZK Chain. For that, you need to set up all the necessary environment and configuration files with your ZK Chain settings. You can use a script to build them. See setting up env variables.

Once you have your zksync-era repo set up locally, you can run the following command to build environment and configuration files for block explorer based on your **[zksync-era](https://github.com/matter-labs/zksync-era)** repo configuration:

```bash
npm run hyperchain:configure
```

The script generates all the necessary configuration files for block-explorer, which you can edit if you need any changes.

# Addendum

- If you make changes to any contract, you can always deploy a new ZK Chain to easily test those changes.

- If you configure your ZK Chain once, you don't need to do it again as the wizard allows you to use an existing config file.

- For now, it is only possible to deploy a ZK Chain as an L2, but soon it will also work as L3s.

- When running the default matterlabs/geth, you have a set of rich wallets available to you. You can check them [here.](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json)

- If you want to have a custom local base chain, you must ensure you have a database for your ZK Chain, as well as the local RPC for your L1.

- To run a Postgres 14 database for your ZK Chain, execute the following:

```bash
docker-compose -f docker-compose-zkstack-common.yml up -d postgres
```

In case you don't want to use the docker Postgres database above but another one you already have locally, make sure its version is 14 and it is running and accepts connections at postgres://postgres@localhost/zksync_local. You can test with:

```bash
psql -h localhost -U postgres -d postgres -c 'SELECT 1;'
```

If you face an issue compiling rust code (example `<jemalloc>: Error allocating TSD`) try removing the `rust-toolchain` file from the repo.
