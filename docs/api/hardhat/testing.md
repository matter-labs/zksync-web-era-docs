# Local testing

Sometimes there is a need to test contracts in a local environment for network latency or fee reasons.

zkSync team provides a dockerized local setup for this purpose.

## Prerequisites

It is required that you have `Docker` and `docker-compose` installed on your computer.

Also, some familiarity with the zkSync hardhat plugin is assumed. If you are newly developing on zkSync with hardhat, a nice introduction is [here](./getting-started.md).

## Installing the testing environment

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
The local zkSync setup comes with some "rich" wallets with large amounts of ETH on both L1 and L2.

The full list of the addresses of these accounts with the corresponding private keys can be found [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json).

::: tip ERC-20 tokens

The initial version of the local node was shipped with several ERC-20 tokens deployed by default.

It's no longer the case and if you need to interact with ERC-20 tokens, you should deploy them yourself.

If you'd like the local node to come with pre-deployed tokens again, please let us know on our [discord](https://discord.gg/px2aR7w), so we can prioritize accordingly.

:::

## Using custom database/L1
To use a custom Postgres database or Layer 1, you should change the environment parameters in the docker-compose file:

```yml
environment:
  - DATABASE_URL=postgres://postgres@postgres/zksync_local
  - ETH_CLIENT_WEB3_URL=http://geth:8545
```

- `DATABASE_URL` is the URL to the Postgres database.
- `ETH_CLIENT_WEB3_URL` is the URL to the HTTP JSON-RPC interface of the L1 node.

## Testing with `mocha` + `chai`

Please note, that since the zkSync node URL is provided in the `hardhat.config.ts`, the best way to use different URLs for production deployment and local testing is to use environment variables. The standard way is to set the `NODE_ENV=test` environment variable before invoking the tests.

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

This will enable running tests in a hardhat environment with the `NODE_ENV` env variable set as a `test`.

4. Modify `hardhat.config.ts` to use the local node for testing:
Create a `test` folder, where the tests will reside.

5. Now we can write our first test! Create a `test/main.test.ts` file with the following content:

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
