# `hardhat-zksync-vyper`

The [@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper) plugin provides an interface for compiling Vyper smart contracts before deploying them to zkSync Era.

## Set up

### 1. Scaffold a new project

Use the [zkSync Era cli](../../tools/zksync-cli/README.md) to set up a project.

```sh
npx zksync-cli@latest create greeter-vyper-example
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
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";

const config: HardhatUserConfig = {
  zkvyper: {
    version: "1.3.7",
    compilerSource: "binary", // docker usage no longer recommended
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
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
  },
  // Currently, only Vyper ^0.3.3 is supported.
  vyper: {
    version: "0.3.3",
  },
};

export default config;
```

#### Options

- `version`: The `zkvyper` compiler version. Find the latest compiler versions in the [zkvyper repo](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource`: Indicates the compiler source and can be either `binary`. (A `docker` option is no longer recommended). If there is no previous installation, the plugin automatically downloads one. 

:::warning
The `docker` option is not recommended as compilers are no longer released as Docker images.
:::

- `compilerPath`: Optional field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used.
- `libraries`: Define any non-inlinable libraries your contracts use as dependencies here. Learn more about [compiling libraries](./compiling-libraries.md).
- `zksync`: Indicates whether `zkvyper` is enabled on zkSync Era. This option is useful for multichain projects in which you want to enable `zksync` for specific networks only.

### 4. Set Up Vyper Contracts

To prepare Vyper contracts, leverage the [zkSync Era cli](../../tools/zksync-cli/README.md), which initially generates a `Contracts` folder including a Greeter.Sol contract. As our objective involves compiling Vyper contracts, not Solidity ones, modifications are in order. 

- Delete Greeter.Sol from the `Contracts/` directory.
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

### 3. Compile Your Contract 

You can compile the contract with the following command:

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

### 4. Deploy Your Contract

To deploy the `Greeter.vy` contract, initially update the `use-greeter.ts` script, supplied by the CLI in the `deploy/` directory. 

Alter this line:
```
// Load contract artifact. Ensure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.Sol/Greeter.json";
```

To aim at our Vyper contract:
```
// Load contract artifact. Ensure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Greeter.vy/Greeter.json";
```

Following that, substitute `<WALLET-PRIVATE-KEY>` in the `deploy/deploy-greeter.ts` with your personal key. Now, you're ready to deploy the `Greeter.vy` contract! 

```
yarn hardhat deploy-zksync
```

### 5. Expect the Following Output

You should anticipate the following output:

```txt
Running deploy function for the Greeter contract
The deployment is projected to cost 0.000135806 ETH
constructor args:0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
Greeter was deployed to 0x7CDF8A4334fafE21B8dCCe70487d6CBC00183c0d
```