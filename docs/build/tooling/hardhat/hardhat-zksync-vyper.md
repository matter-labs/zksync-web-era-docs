---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-vyper | zkSync Docs
---

# `hardhat-zksync-vyper`

The [@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper) plugin provides an interface for compiling Vyper smart contracts before deploying them to zkSync Era.

Learn more about the latest updates in the [changelog](https://github.com/matter-labs/hardhat-zksync/blob/main/packages/hardhat-zksync-vyper/CHANGELOG.md).

## Prerequisites

- Download and install [Node](https://nodejs.org/en/download).
- Download and install [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating) to change the running Node version to latest use command `nvm use --lts`.
- Use the `yarn` or `npm` package manager. We recommend using `yarn`. To install `yarn`, follow the [Yarn installation guide](https://yarnpkg.com/getting-started/install).
- A wallet with sufficient Sepolia or Goerli `ETH` on Ethereum and zkSync Era Testnet to pay for deploying smart contracts.
  - You can get Sepolia or Goerli ETH from the following faucets:
    - Chainstack [Sepolia faucet](https://faucet.chainstack.com/sepolia-testnet-faucet), [Goerli faucet](https://faucet.chainstack.com/goerli-faucet/)
    - Alchemy [Sepolia faucet](https://sepoliafaucet.com/), [Goerli faucet](https://goerlifaucet.com/)
    - [Paradigm Goerli faucet](https://faucet.paradigm.xyz/)
    - Proof of work [Sepolia faucet](https://sepolia-faucet.pk910.de/), [Goerli faucet](https://goerli-faucet.pk910.de/)
  - Get testnet `ETH` for zkSync Era using [bridges](https://zksync.io/explore#bridges) to bridge funds to zkSync.
- You know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

::: tip Local zkSync Testing with zksync-cli
Skip the hassle for test ETH by using `zksync-cli` for local testing. Simply execute `npx zksync-cli dev start` to initialize a local zkSync development environment, which includes local Ethereum and zkSync nodes. This method allows you to test contracts without requesting external testnet funds. Explore more in the [zksync-cli documentation](../../tools/zksync-cli/README.md).
:::

## Set up

### 1. Scaffold a new project

Use the [zkSync Era cli](../../tools/zksync-cli/README.md) to set up a project.

```sh
npx zksync-cli@latest create project greeter-vyper-example --template hardhat_vyper
cd greeter-vyper-example
```

### 2. Install the libraries

The plugin is used with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).

::: code-tabs
@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-vyper @nomiclabs/hardhat-vyper
```

:::

### 3. Update the `hardhat.config.ts` file

```ts
import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
import "@matterlabs/hardhat-zksync-deploy";

const config: HardhatUserConfig = {
  zkvyper: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zkvyper-bin/
    settings: {
      // compilerPath: "zkvyper", // optional field with the path to the `zkvyper` binary.
      libraries: {}, // optional. References to non-inlinable libraries
    },
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true, // enables zksync in hardhat local network
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
    },
  },
  // Currently only Vyper v0.3.3 and v0.3.9 versions are supported.
  vyper: {
    version: "0.3.3",
  },
};

export default config;
```

#### Configuration

::: info zero-config

`hardhat-zksync-vyper` v0.2.0 introduced a default configuration so all parameters are optional.

:::

Any configuration parameters should be added inside a `zkvyper` property in the `hardhat.config.ts` file:

- `version`: The `zkvyper` compiler version. Default value is `latest`. Find the latest compiler versions in the [zkvyper repo](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource`: Indicates the compiler source and can be either `binary`. (A `docker` option is no longer recommended). If there is no previous installation, the plugin automatically downloads one.
- `compilerPath`: Optional field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used.
- `libraries`: Define any non-inlinable libraries your contracts use as dependencies here. Learn more about [compiling libraries](./compiling-libraries.md).

### 4. Create Vyper contract

The [zkSync Era cli](../../tools/zksync-cli/README.md) generates a `contracts` folder which includes a `Greeter.sol` contract.

- Delete `Greeter.sol` from the `contracts/` directory.
- Add the equivalent `Greeter.vy` Vyper contract:

```vyper
# @version ^0.3.3
# vim: ft=python

owner: public(address)
greeting: public(String[100])

# __init__ is not invoked when deployed from create_forwarder_to
@external
def __init__(greeting: String[64]):
  self.owner = msg.sender
  self.greeting = greeting

# Invoke once after create_forwarder_to
@external
def setup(_greeting: String[100]):
  assert self.owner == ZERO_ADDRESS, "owner != zero address"
  self.owner = msg.sender
  self.greeting = _greeting

@external
@view
def greet() -> String[100]:
    return self.greeting
```

### 5. Compile the contract

::: code-tabs
@tab:active yarn

```bash
yarn hardhat compile
```

@tab npm

```bash
npx hardhat compile
```

:::

### 6. Create deployment script

First update the `use-greeter.ts` script, supplied by the CLI in the `deploy/` directory.

Alter this line:

```
// Load contract artifact. Ensure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.sol/Greeter.json";
```

To aim at our Vyper contract:

```
// Load contract artifact. Ensure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.vy/Greeter.json";
```

### 7. Add private key to environment variables

Remove `example` from the `.env.example` file and add your private key to `<WALLET-PRIVATE-KEY>`.

### 8. Deploy the contract

```
yarn hardhat deploy-zksync --script deploy-greeter.ts
```

### 9. Output

You should see something like this:

```txt
Running deploy function for the Greeter contract
The deployment is projected to cost 0.000135806 ETH
constructor args:0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
Greeter was deployed to 0x7CDF8A4334fafE21B8dCCe70487d6CBC00183c0d
```
