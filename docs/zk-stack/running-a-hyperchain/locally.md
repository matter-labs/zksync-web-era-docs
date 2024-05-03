---
head:
  - - meta
    - name: "twitter:title"
      content: Deploying ZK Stack Hyperchain Locally | zkSync Docs
---

# Getting Started with ZK Stack

::: danger Note

A new and improved ZK Stack CLI is coming very soon. The current version is deprecated and may not function as expected.
:::

## Development dependencies

Ensure you have followed [these instructions](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/setup-dev.md) to set up dependencies on your machine (don't worry about the Environment section for now).

## Deploying locally

1. Clone the zksync-era repo (or pull the latest if you've already cloned it) and go to the root of it:

```bash
git clone https://github.com/matter-labs/zksync-era
```

2. Add `ZKSYNC_HOME` to your path (e.g. `~/.bash_profile`, `~/.zshrc` ) - don't forget to source your profile file again (or restart your terminal):

```bash
export ZKSYNC_HOME=/path/to/zksync/repo/you/cloned
export PATH=$ZKSYNC_HOME/bin:$PATH
```

3. Build latest version of zk tools by just running `zk` on the root of the project.

```bash
zk
```

4. Last, start the wizard and follow instructions to set up and deploy your new hyperchain by running `zk stack init`

   - Initially you want to `Configure new chain`

   - Give it a name and chain id.

   - Select localhost (default `matterlabs/geth`) and follow the wizard.

     - If you are doing this for the first time, several components need to be compiled/built, so do not worry if it takes a few minutes. The console will show what is going on anyways.

   - If you don't want to configure any values for now and just want check the build process for a hyperchain, try out the `zk stack demo` command.

:::warning

The commands above are not just running docker containers, but are actually building the code from the repo to spin up your hyperchain. For this reason the process might take some time. If you just want to run docker containers to play around with a zkSync chain, you can use `npx zksync-cli dev`. Learn more [here](../../build/tooling/zksync-cli/getting-started.md).
:::

### Your hyperchain is now deployed

Your hyperchain is now deployed to the base chain (most likely a local geth docker container) and configured. You can find all configuration in a new `.env` file created on `<project root>/etc/env/<your_chain_name_slug>.env`, and if you deployed test tokens, their addresses will be available at `<project root>/etc/tokens/<the_l1_identifier>.json`

1. The wizard allows you to run the server in the end. If you chose not to, you’re still able to run it by executing

```bash
zk server --components "http_api,eth,state_keeper,housekeeper"
```

2. You can now run transactions and start playing with your hyperchain by using the RPC available at <http://localhost:3050>.

   - Don't forget to deposit some ETH and fund your accounts on your hyperchain. To do so follow the instructions for [Funding accounts](#funding-accounts).

## Using your hyperchain

### Funding accounts

During the `zk stack init` configurator, you have a choice of what base layer to deploy the hyperchain onto: the local geth node, or an Ethereum network (e.g., Sepolia). The first step to start interacting with your hyperchain is to fund an account (or a few). This means you need some funds on the base layer.

#### Base layer is the local geth node ([@matterlabs/geth:latest](https://hub.docker.com/r/matterlabs/geth))

- If you chose to deploy on local geth node, you will have a set of addresses that have 100 ETH each. You can find the list [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json) and use these addresses to deposit into your hyperchain via the bridge.

#### Base layer is an Ethereum network (e.g., Sepolia)

- If you chose to deploy on an Ethereum network (e.g., Sepolia), you need to have an account on the base layer with ETH. You can use the deployer, governor, or operator wallets setup during the the deployment process, or any other one you have funds, to deposit into your hyperchain via the bridge.

Once you have the accounts with funds on the L1 base layer, you can do a deposit via the bridge to your hyperchain, and any further interactions with your hyperchain.

### Using your hyperchain RPC

Your server contains both HTTPS as well as WebSocket (WS) services that are fully web3 compatible (and contain some extra ZK Stack functionalities). Learn more about it [here](../../build/api.md).

### Using [zksync-cli](https://github.com/matter-labs/zksync-cli)

zkSync CLI allows you to easily interact and develop applications on your hyperchain. When executing any command with zksync-cli, you can specify RPC urls for both L1 and L2. Your local server contains RPCs for both. An example deposit command via the bridge would look like:

```bash
npx zksync-cli bridge deposit --rpc=http://localhost:3050 --l1-rpc=http://localhost:8545 --zeek
```

### Using [Portal](https://github.com/matter-labs/dapp-portal)

The dApp Portal module allows you to:

- View balances, transfer and bridge tokens to your hyperchain.
- Add contacts for quick and easy access.

You can run the Portal module locally, and point it to your hyperchain configuration. It comes with scripts that help pulling the hyperchain configuration from your zksync-era repo and adapting to portal needs. Learn more [here](https://github.com/matter-labs/dapp-portal). An example command would look like:

```bash
npm run hyperchain:configure ../zksync-era
npm run dev:node:hyperchain
```

You can now navigate to the displayed Portal URL (typically <http://localhost:3000>).

### Using [Block Explorer](https://github.com/matter-labs/block-explorer)

A free open source block explorer is available for your hyperchain. Block explorer contains three components [Worker](https://github.com/matter-labs/block-explorer/tree/main/packages/worker), [API](https://github.com/matter-labs/block-explorer/tree/main/packages/api), and [App](https://github.com/matter-labs/block-explorer/tree/main/packages/app), which you can run all together locally and connect to your hyperchain.

Make sure you have your [zksync-era](https://github.com/matter-labs/zksync-era) repo set up locally and the `zk server` is running. The wizard in this guide allows you to run the server in the end. If you chose not to, you’re still able to run it by executing:

```bash
zk server --components "http_api,eth,state_keeper,housekeeper"
```

### Running block explorer locally

#### Install block explorer

Clone & install the block explorer repository:

```bash
cd /path/to/where/you/clone/repos
git clone https://github.com/matter-labs/block-explorer.git
cd block-explorer
npm install
```

#### Setting up env variables

Next you need to set up all the necessary environment and configuration files with your hyperchain settings. You can use a script to set them up:

```bash
npm run hyperchain:configure
```

#### Run block explorer

Afterwards you can run the block explorer:

```bash
# if you are running block explorer for the first time
npm run db:create
```

```bash
npm run dev
```

#### Verify block explorer is up and running

By default, you can access front-end `App` at <http://localhost:3010> in your browser. `API` should be available at <http://localhost:3020>, `Worker` at <http://localhost:3001> and `Data Fetcher` at <http://localhost:3040>.

## Enabling Boojum prover

With the default configuration, your hyperchain is not running a prover, and has a DummyExecutor contract, which mainly “accepts” that a batch is executed without proof. This enables you to test it with much lower hardware requirements.

To enable the prover, run the `zk stack prover-setup` command. It will guide through the necessary configuration.

There are two options for running the Boojum prover: in GPU, or in CPU.

:::warning

<u>Running a prover is not required</u> for deploying a testnet. The requirements below are only necessary if you want to enable the prover.
:::

### Requirements for GPU Prover

The docker compose file assumes you will be running all components in the same machine. The current minimum requirements for a low TPS scenario are:

- 6 GB VRAM NVIDIA GPU
- 16 Core CPU
- 64 GB of RAM
- 300 GB of Disk Space (SSD preferred)

### Requirements for CPU Prover

The docker compose file assumes you will be running all components in the same machine. The current minimum requirements for a low TPS scenario are:

- 32 Core CPU
- 128 GB of RAM
- 700 of Disk Space (SSD preferred)

## Addendum

- If you make changes to any contract, you can always deploy a new hyperchain to easily test those changes.

- If you configure your hyperchain once, you don't need to do it again as the wizard allows you to use an existing config file.

- For now, it is only possible to deploy a hyperchain as an L2, but soon it will also work as L3s.

- When running the default matterlabs/geth, you have a set of rich wallets available to you. You can check them [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json).

- If you face an issue compiling rust code (example `<jemalloc>: Error allocating TSD`) try removing the `rust-toolchain` file from the repo.

- If you want to have a custom local base chain, you must ensure you have a database for your hyperchain, as well as the local RPC for your L1.

  - To run a Postgres 14 database for your hyperchain, execute the following:

```bash
docker-compose -f docker-compose-zkstack-common.yml up -d postgres
```

In case you don't want to use the docker Postgres database above but another one you already have locally, make sure its version is 14 and it is running and accepts connections at `postgres://postgres@localhost/zksync_local`. You can test with:

```bash
psql -h localhost -U postgres -d postgres -c 'SELECT 1;'
```
