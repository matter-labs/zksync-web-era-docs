# Dockerized setup

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
Rich wallets only hold ETH. If you need to test with ERC20 tokens, you'd need to deploy them yourself.
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