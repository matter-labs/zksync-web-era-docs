# Local testing

::: warning Being updated

This tutorial is outdated and is currently being reworked.

:::

Sometimes there is a need to test contracts in a local environment for network latency or fee reasons.

zkSync team provides a dockerized local setup for this purpose.

## Prerequisites

It is required that you have `Docker` and `docker-compose` installed on your computer.

Also, some familiarity with the zkSync hardhat plugin is assumed. If you are new developing on zkSync with hardhat, a nice introduction is [here](./getting-started.md).

## Installing the testing environment
::: warning 

The local zkSync node is not available now and will be updated soon.

:::

You can download the dockerized setup with the following command.

```
git clone https://github.com/matter-labs/local-setup.git
```

## Bootstrapping zkSync

To bootstrap zkSync locally, run the `start.sh` script:

```
cd local-setup
./start.sh
```

This command will bootstrap three docker containers:

- Postgres (used as the database for zkSync).
- Local Geth node (used as L1 for zkSync).
- zkSync node itself.

By default, the HTTP JSON-RPC API will run on port `3050`, while WS API will run on port `3051`.

_Note, that it is important that the first `start.sh` script invocation goes uninterrupted. If you face any issues after the bootstrapping process unexpectedly stopped, you should [reset](#resetting-the-zksync-state) the local zkSync state and try again._

## Resetting the zkSync state

To reset the zkSync state, run the `./clear.sh` script:

```
./clear.sh
```

Note, that you may receive a "permission denied" error when running this command. In this case, you should run it with the root privileges:

```
sudo ./clear.sh
```

## Rich wallets

Local zkSync setup comes with some "rich" wallets with large amounts of ETH on both L1 and L2.

The full list of the addresses of these accounts with the corresponding private keys can be found [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json).

Also, during the initial bootstrapping of the system, several ERC-20 contracts are deployed locally. Note, that large quantities of these ERC-20 belong to the wallet `0x36615Cf349d7F6344891B1e7CA7C72883F5dc049` (the first one in the list of the rich wallet). Right after bootstrapping the system, these ERC-20 funds are available only on L1.

## Using custom database/L1

To use custom Postgres database or Layer 1, you should change the environment parameters in the docker-compose file:

```yml
environment:
  - DATABASE_URL=postgres://postgres@postgres/zksync_local
  - ETH_CLIENT_WEB3_URL=http://geth:8545
```

- `DATABASE_URL` is the URL to the Postgres database.
- `ETH_CLIENT_WEB3_URL` is the URL to the HTTP JSON-RPC interface of the L1 node.

## Testing with `mocha` + `chai`

Please note, that since the zkSync node URL is provided in the `hardhat.config.ts`, the best way to use different URLs for production deployment and local testing is to use environment variables. The standard way is to set `NODE_ENV=test` environment variable before invoking the tests.

1. Create a new hardhat project and follow the contracts' compilation guide from the [getting started](./getting-started.md) page (steps 1 to 5 of the **Initializing the project** section).
2. To add the test frameworks, run the following command:

```
yarn add -D mocha chai @types/mocha @types/chai
```

3. Add the following lines to your `package.json` in the root folder:

```json
"scripts": {
    "test": "NODE_ENV=test hardhat test"
}
```

This will enable running tests in a hardhat environment with `NODE_ENV` env variable set as `test`.

4. Modify `hardhat.config.ts` to use local node for testing:

```ts
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

const zkSyncDeploy =
  process.env.NODE_ENV == "test"
    ? {
        zkSyncNetwork: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
      }
    : {
        zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
      };

module.exports = {
  zksolc: {
    version: "0.1.0",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
      },
    },
  },
  zkSyncDeploy,
  solidity: {
    version: "0.8.11",
  },
  networks: {
    // To compile with zksolc, this must be the default network.
    hardhat: {
      zksync: true,
    },
  },
};
```

4. Create `test` folder, where the tests will reside.

5. Now we can write our first test! Create `test/main.test.ts` file with the following content:

```ts
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

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

You can now run the tests with the following command:

```
yarn test
```

## Full example

The full example with tests can be found [here](https://github.com/matter-labs/tutorial-examples/tree/main/local-setup-testing)
