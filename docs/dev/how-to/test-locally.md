# Local testing strategies for zkSync Era

zkSync Era provides two distinct testing environments for your development needs - Dockerized Local Setup and the In-Memory Node. Each solution boasts unique characteristics tailored to diverse use cases. This guide aims to unpack the intricacies of these tools, aiding you in selecting the setup best suited for your development workflow.

## Understanding your choices: In-Memory node vs Dockerized local setup

The local testing process revolves around two principal options:

1. **Dockerized local setup**: An extensive zkSync Era network simulation that comprises a Postgres database, a local Geth node functioning as Layer 1, and the zkSync node. Opt for this setup for comprehensive simulations and testing that require interaction with both L1 and L2.

2. **In-Memory node**: A lightweight, speedy alternative, the In-Memory Node, supports forking the state from various networks, including the mainnet and testnet. This choice is ideal for swift testing, prototyping, and bootloader and system contract testing.

### When to use each

- Use the **Dockerized local setup** for in-depth simulations and tests that necessitate L1 and L2 interaction. This complex and detailed setup mirrors how your contracts will function within the mainnet zkSync Era network.

- Opt for the **In-Memory node** for swift testing, prototyping, or testing new changes via the local bootloader and system contracts. This setup facilitates forking the state from the mainnet or testnet, suitable for replaying transactions or observing the impact of modifications on existing contracts.

:::warning
Being in its alpha stage, the In-Memory Node comes with some constraints and doesn't fully support all functionalities. For definitive testing, Dockerized Local Setup or a testnet is highly recommended.
:::

### Feature comparison

The following table highlights the key characteristics of each testing environment for a quick comparison:

| Feature                                      | In-memory node       | Dockerized Local Setup |
|----------------------------------------------|----------------------|------------------------|
| Quick startup                                | Yes                  | No                     |
| Supports forking state                       | Yes                  | No                     |
| Console.log debugging                        | Yes                  | No                     |
| Detailed call traces                         | Yes                  | No                     |
| Pre-configured 'rich' accounts               | Yes                  | Yes                    |
| Replay existing transactions                 | Yes                  | No                     |
| Fast for integration testing                 | Yes                  | No                     |
| Communication between Layer 1 & Layer 2      | No                   | Yes                    |
| Multiple transactions per batch              | No                   | Yes                    |
| Fixed values for gas estimation              | Yes                  | Varies                 |
| Complete set of APIs                         | No (Basic set only)  | Yes                    |

Armed with this comprehensive comparison, let's delve into the detailed setup process for each of these testing environments. 

## In-Memory node: installation & setup

### Installation

For effortless installation of the In-Memory Node, download it directly from the source:

```shell
cargo install --git https://github.com/matter-labs/era-test-node.git
```

Rust should install it in the `~/.cargo/bin` directory.

If you encounter compile errors due to rocksDB, you might also need to install:

```shell
apt-get install -y cmake pkg-config libssl-dev clang
```

### Node operation

Starting the node is as simple as:

```shell
zksync_test_node run
```

This command initializes a node with an empty state, available on port `8011`.

#### Forking networks

To fork the mainnet:

```shell
zksync_test_node fork mainnet
```

This command starts the node, forked at the current head of mainnet. You should expect to see something similiar in your terminal:

```text
Creating fork from "https://mainnet.era.zksync.io:443" L1 block: L1BatchNumber(94860) L2 block: 7753283 with timestamp 1688496532 and L1 gas price 52949357506
Starting network with chain id: L2ChainId(270)
Setting Rich accounts:
Address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049" Key: "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
Address: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618" Key: "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"
Address: "0x0D43eB5B8a47bA8900d84AA36656c92024e9772e" Key: "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e"
Address: "0xA13c10C0D5bd6f79041B9835c63f91de35A15883" Key: "0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8"
========================================
  Node is ready at 127.0.0.1:8011
========================================
```

The node also allows for specifying a custom HTTP endpoint and custom forking height:

```bash
zksync_test_node fork --fork-at 7000000 http://172.17.0.3:3060
```

#### Transaction replaying 

And you can replay a remote transaction locally for an in-depth debugging insight:

```bash
zksync_test_node replay_tx testnet 0x7f039bcbb1490b855be37e74cf2400503ad57f51c84856362f99b0cbf1ef478a
```

### Utilizing rich wallets

The In-Memory node comes with a set of pre-configured "rich" accounts for testing:

| Account ID | Private Key |
|------------|-------------|
| 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 | 0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110 |
| 0xa61464658AfeAf65CccaaFD3a512b69A83B77618 | 0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3 | 
| 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e | 0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e |
| 0xA13c10C0D5bd6f79041B9835c63f91de35A15883 | 0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8 |

## Dockerized local setup: installation & setup

Let's delve into the setup process for Dockerized Local Testing Environment.

### Prerequisites

Make sure `Docker` and `docker-compose` are installed on your system. If not, follow the [installation guide](https://docs.docker.com/get-docker/). Familiarity with the zkSync Hardhat plugins is also recommended. If you're new to zkSync development with Hardhat, check out the [getting started section here](../../tools/hardhat/getting-started.md).

### Setting up the testing environment

To clone the dockerized project, use the following command:

```
git clone https://github.com/matter-labs/local-setup.git
```

### Starting the local node

To launch the zkSync Era locally, run the `start.sh` script:

```
cd local-setup
./start.sh
```

This command initiates three docker containers:

- Postgres: The database for zkSync.
- Local Geth node: The L1 for zkSync.
- The zkSync node itself.

By default, the HTTP JSON-RPC API operates on port `3050`, and the WS API runs on port `3051`.

:::tip
 The first `start.sh` script execution should go uninterrupted. If the bootstrapping process halts unexpectedly, reset the local zkSync state and try again.
:::

### Resetting the zkSync state

To reset the zkSync state, run

 the `./clear.sh` script:

```
./clear.sh
```

In case of a "permission denied" error, execute it with root privileges:

```
sudo ./clear.sh
```

### Working with rich wallets

The local zkSync setup includes "rich" wallets preloaded with substantial amounts of ETH on both L1 and L2. You can find a complete list of the accounts' addresses along with the corresponding private keys [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json).

:::warning
Rich wallets only hold ETH. If you need to test with ERC20 tokens, deploy them yourself.
:::

### Employing a custom database or Ethereum node

To use a custom Postgres database or Layer 1 node, modify the environment parameters in the docker-compose file:

```yml
environment:
  - DATABASE_URL=postgres://postgres@postgres/zksync_local
  - ETH_CLIENT_WEB3_URL=http://geth:8545
```

`DATABASE_URL` represents the URL to the Postgres database, and `ETH_CLIENT_WEB3_URL` refers to the URL to the HTTP JSON-RPC interface of the L1 node.

## Writing and running tests locally

Next, we'll explore how to write and execute tests locally. We'll use `mocha` and `chai` for testing.

### Project configuration

1. Start by creating a new Hardhat project. If you need guidance, follow the [getting started guide](../../tools/hardhat/getting-started.md).

2. To incorporate the test libraries, execute:

```
yarn add -D mocha chai @types/mocha @types/chai
```

3. Add the following lines to your `package.json` in the root folder:

```json
"scripts": {
    "test": "NODE_ENV=test hardhat test"
}
```

This script makes it possible to run tests in a Hardhat environment with the `NODE_ENV` env variable set as `test`.

### Configuring tests

4. Adjust `hardhat.config.ts` to use the local node for testing:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://testnet.era.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
      };

module.exports = {
  zksolc: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  // defaults to zkSync network
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true,
    },
    // load test network details
    zkSyncTestnet,
  },
  solidity: {
    version: "0.8.17",
  },
};
```

### Writing test scripts

5. Now, create your first test! Construct a `test/main.test.ts` file with the following code:

```ts
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const RICH_WALLET_PK = "<RICH_WALLET_PK>";

async function deployGreeter(deployer: Deployer): Promise<Contract> {
  const artifact = await deployer.loadArtifact("Greeter");
  return await deployer.deploy(artifact, ["Hi"]);
}

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const provider = Provider.getDefaultProvider();

    const wallet = new Wallet(RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    const greeter = await deployGreeter(deployer);

    expect(await greeter.greet()).to.eq("Hi");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
```

Execute the test file with:

```
yarn test
```

Well done! You've successfully run your first local tests with zkSync Era.

For a complete example with tests, check [here](https://github.com/matter-labs/tutorial-examples/tree/main/local-setup-testing)

## Wrapping up

Whether you're testing new contracts, debugging transactions, or prototyping, zkSync Era provides robust options for local testing. Both the Dockerized Local Setup and the In-Memory Node offer feature-rich and quick setup options, each with their distinct strengths and limitations. Choose the most appropriate setup based on your specific needs, and happy testing!