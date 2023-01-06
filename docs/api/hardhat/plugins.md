# Plugins

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## `hardhat-zksync-toolbox`

The hardhat-zksync-toolbox plugin provides a convenient method for bundling and accessing a range of zkSync-related Hardhat plugins. This approach simplifies the process of utilizing these plugins and promotes ease of use.

List of supported plugins:

- [hardhat-zksync-solc](#hardhat-zksync-solc)
- [hardhat-zksync-vyper](#hardhat-zksync-vyper)
- [hardhat-zksync-deploy](#hardhat-zksync-deploy)
- [hardhat-zksync-chai-matchers](#hardhat-zksync-chai-matchers)
- [hardhat-zksync-verify](#hardhat-zksync-verify)

### Installation

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-toolbox @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-vyper @matterlabs/hardhat-zksync-chai-matchers @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify hardhat ethers zksync-web3 @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-toolbox
```

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync-toolbox";
```

With the hardhat-zksync-toolbox plugin installed and imported, you will have access to all of the supported plugins and will be able to use them as needed in your project.

> **_NOTE:_** To learn more about using any of the plugins that are supported by the hardhat-zksync-toolbox plugin, you can refer to their documentation below.

## `hardhat-zksync-solc`

This plugin is used to provide a convenient interface for compiling Solidity smart contracts before deploying them to zkSync 2.0.

### Installation

[@matterlabs/hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc

# Npm
npm i -D @matterlabs/hardhat-zksync-solc
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

This plugin is configured in the `hardhat.config.ts` file of your project. Here is an example

```typescript
zksolc: {
  version: "1.2.1",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zksolc",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zksolc", // required for compilerSource: "docker"
      tag: "latest"   // required for compilerSource: "docker"
    },
    libraries:{} // optional. References to non-inlinable libraries
  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

- `version` is a field with the version of the `zksolc` compiler. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zksolc-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zksolc` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `zksync` network option indicates whether zksolc is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.

::: warning

Compilers are no longer released as Docker images and its usage is no longer recommended. Use the `compilerSource: "binary"` in the Hardhat config file to use the binary instead.

:::

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates the `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `hardhat-zksync-vyper`

This plugin is used to provide a convenient interface for compiling Vyper smart contracts before deploying them to zkSync 2.0.

### Installation

[@matterlabs/hardhat-zksync-vyper](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-vyper)

This plugin is used in conjunction with [@nomiclabs/hardhat-vyper](https://www.npmjs.com/package/@nomiclabs/hardhat-vyper).
To use it, you have to install and import both plugins in the `hardhat.config.ts` file:

```javascript
import "@nomiclabs/hardhat-vyper";
import "@matterlabs/hardhat-zksync-vyper";
```

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-vyper

# Npm
npm i -D @matterlabs/hardhat-zksync-vyper
```

### Exports

This plugin most often will not be used directly in the code.

### Configuration

```typescript
zkvyper: {
  version: "0.1.0",
  compilerSource: "binary",  // binary or docker
  settings: {
    compilerPath: "zkvyper",  // ignored for compilerSource: "docker"
    experimental: {
      dockerImage: "matterlabs/zkvyper",  // required for compilerSource: "docker"
      tag: "latest"  // required for compilerSource: "docker"
    },
    libraries{} // optional. References to non-inlinable libraries

  }
}
networks: {
  hardhat: {
    zksync: true  // enables zksync in hardhat local network
  }
}
```

- `version` is a field with the version of the `zkvyper` compiler. Compiler versions can be found in [the following repository](https://github.com/matter-labs/zkvyper-bin).
- `compilerSource` indicates the compiler source and can be either `docker` or `binary` (recommended). If there isnn't a compiler binary already installed, the plugin will automatically download it. If `docker` is used, you'd need to run Docker desktop in the background and provide both `dockerImage` and `tag` in the experimental section.
- `compilerPath` (optional) is a field with the path to the `zkvyper` binary. By default, the binary in `$PATH` is used. If `compilerSource` is `docker`, this field is ignored.
- `dockerImage` and `tag` make up the name of the compiler docker image. If `compilerSource` is `binary`, these fields are ignored.
- `libraries` if your contract uses non-inlinable libraries as dependencies, they have to be defined here. Learn more about [compiling libraries here](./compiling-libraries.md)
- `zksync` network option indicates whether zkvyper is enabled on a certain network. `false` by default. Useful for multichain projects in which you can enable `zksync` only for specific networks.

::: warning

Compilers are no longer released as Docker images and its usage is no longer recommended. Use the `compilerSource: "binary"` in the Hardhat config file to use the binary instead.

:::

### Commands

`hardhat compile` -- compiles all the smart contracts in the `contracts` directory and creates `artifacts-zk` folder with all the compilation artifacts, including factory dependencies for the contracts, which could be used for contract deployment.

To understand what the factory dependencies are, read more about them in the [Web3 API](../api.md) documentation.

## `hardhat-zksync-deploy`

This plugin provides utilities for deploying smart contracts on zkSync with artifacts built by the `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins.

::: warning

Contracts must be compiled using the official `@matterlabs/hardhat-zksync-solc` or `@matterlabs/hardhat-zksync-vyper` plugins. Contracts compiled with other compilers will fail to deploy to zkSync using this plugin.

:::

### Installation

[@matterlabs/hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

Add the latest version of this plugin to your project with the following command:

```

# Yarn

yarn add -D @matterlabs/hardhat-zksync-deploy

# Npm

npm i -D @matterlabs/hardhat-zksync-deploy

```

### Exports

#### `Deployer`

The main export of this plugin is the `Deployer` class. It is used to wrap a `zksync-web3` Wallet instance and provides a convenient interface to deploy smart contracts and account abstractions. Its main methods are:

```typescript
class Deployer {

  /**
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param zkWallet The wallet which will be used to deploy the contracts.
   * @param deploymentType Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */
  constructor(hre: HardhatRuntimeEnvironment, zkWallet: zk.Wallet, deploymentType?: zk.types.DeploymentType)

  /**
   * Created a `Deployer` object on ethers.Wallet object.
   *
   * @param hre Hardhat runtime environment. This object is provided to scripts by hardhat itself.
   * @param ethWallet The wallet which will be used to deploy the contracts.
   * @param deploymentType Optional deployment type that relates to the ContractDeployer system contract function to be called. Defaults to deploying regular smart contracts.
   */
  static fromEthWallet(hre: HardhatRuntimeEnvironment, ethWallet: ethers.Wallet, deploymentType?: zk.types.DeploymentType)

  /**
   * Loads an artifact and verifies that it was compiled by `zksolc\.
   *
   * @param contractNameOrFullyQualifiedName The name of the contract.
   *   It can be a bare contract name (e.g. "Token") if it's
   *   unique in your project, or a fully qualified contract name
   *   (e.g. "contract/token.sol:Token") otherwise.
   *
   * @throws Throws an error if a non-unique contract name is used,
   *   indicating which fully qualified names can be used instead.
   *
   * @throws Throws an error if an artifact was not compiled by `zksolc`.
   */
  public async loadArtifact(
    contractNameOrFullyQualifiedName: string
  ): Promise<ZkSyncArtifact>

  /**
   * Estimates the price of calling a deploy transaction in a certain fee token.
   *
   * @param artifact The previously loaded artifact object.
   * @param constructorArguments List of arguments to be passed to the contract constructor.
   *
   * @returns Calculated fee in ETH wei.
   */
  public async estimateDeployFee(
    artifact: ZkSyncArtifact,
    constructorArguments: any[]
  ): Promise<ethers.BigNumber>

  /**
    * Sends a deploy transaction to the zkSync network.
    * For now it uses defaults values for the transaction parameters:
    *
    * @param artifact The previously loaded artifact object.
    * @param constructorArguments List of arguments to be passed to the contract constructor.
    * @param overrides Optional object with additional deploy transaction parameters.
    * @param additionalFactoryDeps Additional contract bytecodes to be added to the factory dependencies list.
    * The fee amount is requested automatically from the zkSync server.
    *
    * @returns A contract object.
    */
  public async deploy(
    artifact: ZkSyncArtifact,
    constructorArguments: any[],
    overrides?: Overrides,
    additionalFactoryDeps?: ethers.BytesLike[],
  ): Promise<zk.Contract>

  /**
   * Extracts factory dependencies from the artifact.
   *
   * @param artifact Artifact to extract dependencies from
   *
   * @returns Factory dependencies in the format expected by SDK.
   */
  async extractFactoryDeps(artifact: ZkSyncArtifact): Promise<string[]>
```

To see an example script of how to use a `Deployer` to deploy a contract, check out [deployment section of the quickstart](./getting-started.md#write-and-deploy-a-contract).

### Configuration

::: warning API changes in v0.6.x

Previous versions of this package required a different configuration in the `hardhat.config.ts` file. If you're using `v0.5.x` or previous, the network configuration must be indicated in an object named `zkSyncDeploy`, including the properties `zkSyncNetwork` and `ethNetwork`. **We recommended users to update to the latest version of this package.**

:::

Specify the zkSync and Ethereum networks as part of the `hardhat.config.ts` file's `networks` configuration:

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // URL of the Ethereum Web3 RPC (optional)
  },
  zkTestnet: {
    url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
    ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true
  }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

- `zkTestnet` is an arbitrary zkSync network name. You can select this as the default network using the `defaultNetwork` property.
- `url` is a field with the URL of the zkSync node in case of the zkSync network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `goerli`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `zksync` is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to `true` for all zkSync networks. `false` by default.

### Commands

`hardhat deploy-zksync` -- runs through all the scripts in the `deploy` folder.

::: tip

Note that deployment scripts must be placed in the `deploy` folder!

:::

- To run a specific script, add the `--script` argument, e.g. `hardhat deploy-zksync --script 001_deploy.ts` will run script `./deploy/001_deploy.ts`.
- To run on a specific zkSync network, use standard hardhat `--network` argument, e.g. `--network zkTestnet` (the network with the name `zkTestnet` needs to be configured in the `hardhat.config.ts` file, with all required fields stated above), or specify `defaultNetwork` in `hardhat.config.ts` file.

::: tip

If network argument `--network` or `defaultNetwork` configuration are not specified, local setup with `http://localhost:8545` (Ethereum RPC URL) and `http://localhost:3050` (zkSync RPC URL), will be used. In this case zkSync network doesn't need to be configured in `hardhat.config.ts` file.
For more details about the dockerized local setup, check out [Local testing](https://v2-docs.zksync.io/api/hardhat/testing.html).

:::

## `hardhat-zksync-chai-matchers`

This plugin adds zkSync-specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts. It extends all the functionalities supported by the [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview) plugin, with the idea to preserve the same behavior and interface.
Currently, it is used in combination with [local testing environment](https://v2-docs.zksync.io/api/hardhat/testing.html).

> **_NOTE:_** Since responses from transactions that revert are highly dependent on the RPC implementation, all [hardhat](https://hardhat.org/hardhat-chai-matchers/docs/overview) chai matchers that start with revert have been affected (but without any changes to the chai matchers interface). In addition, the options argument from changeEtherBalance/changeEtherBalances has been extended with the overrides field in order to support zksync-web3 transfer method with overrides.

### Installation

Add the latest version of this plugin to your project with the following command:

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers

# Npm (version 7 or later is recommended)
npm i -D @matterlabs/hardhat-zksync-chai-matchers
```

### Usage

After installing it, add the plugin to your Hardhat config:

```javascript
import "@matterlabs/hardhat-zksync-chai-matchers";
```

Then you'll be able to use the matchers in your tests.

#### changeEtherBalance

Assert that the ether balance of an address changed by a specific amount:

```javascript
await expect(() =>
  sender.transfer({
    to: receiver.address,
    amount: 2000,
  })
).to.changeEtherBalance(sender.address, BigInt("-2000"));

await expect(() =>
  sender.sendTransaction({
    to: receiver.address,
    value: 1000,
  })
).to.changeEtherBalance(sender.address, "-1000");
```

This matchers include additional options argument with functionalities for including fee and overriding transaction:

```javascript
overrides = {
  type: 2,
  maxFeePerGas: 1 * gasPrice,
  maxPriorityFeePerGas: 1 * gasPrice,
};

await expect(() =>
  sender.transfer({
    to: receiver.address,
    amount: 500,
    overrides,
  })
).to.changeEtherBalance(sender, -(txGasFees + 500), {
  balanceChangeOptions: {
    includeFee: true,
  },
  overrides,
});
```

#### changeTokenBalance

Assert that an ERC20 token balance of an address changed by a specific amount:

```javascript
await expect(sender.transfer({ to: receiver.address, amount: 5, token: token.address })).to.changeTokenBalance(token, sender, -5);

await expect(token.transfer(receiver.address, 5)).to.not.changeTokenBalance(token, sender, 0);
```

#### reverted

Assert that a transaction reverted for any reason:

```javascript
await expect(contract.setAmount(100)).to.be.reverted;
```

#### revertedWithCustomError

Assert that a transaction reverted with a specific custom error:

```javascript
await expect(contract.setAmount(100)).to.be.revertedWithCustomError(contract, "InvalidAmount");
```

<br/>

And you can also use regular chai matchers like:

#### emit

```javascript
await expect(contract.setAmount(100)).to.emit(contract, "AmountUpdated");
```

#### properAddress

```javascript
expect("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049").to.be.properAddress;
```

#### Comparisons of numbers

```javascript
expect(await contract.getAmount()).to.equal(100);
```

Checkout the advantages of using chai matchers [here](https://hardhat.org/hardhat-chai-matchers/docs/overview#why-would-i-want-to-use-it?). Since the list of all supported chai matchers is same as with [hardhat-chai-matchers](https://hardhat.org/hardhat-chai-matchers/docs/overview) plugin, check the [reference documentation](https://hardhat.org/hardhat-chai-matchers/docs/reference).

## `hardhat-zksync-verify`

This plugin is used to verify contracts on the zkSync 2.0 network.

### Installation

[@matterlabs/hardhat-zksync-verify](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify)

The plugin is used in conjunction with [@nomiclabs/hardhat-etherscan](https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan) and it supports backward compatibility with that plugin.
To use it, you have to install both plugins and then import `@matterlabs/hardhat-zksync-verify` in the hardhat.config.ts file.

```typescript
# Yarn
yarn add -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan

# Npm
npm i -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```

```javascript
import "@matterlabs/hardhat-zksync-verify";
```

### Exports

### Configuration

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // URL of the Ethereum Web3 RPC (optional)
  },
  zkTestnet: {
    url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
    ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true,
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
  }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

- `zkTestnet` is an arbitrary zkSync network name. You can select this as the default network using the `defaultNetwork` property.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide the network name (e.g. `goerli`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `url` is a field with the URL of the zkSync node in the case of the zkSync network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.
- `zksync` is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to `true` for all zkSync networks. If you want to run a `hardhat-etherscan` verification, this field needs to be set to `false`. If set to `true`, the verification process will always try to run the verification process on the zkSync network.
- `verifyURL` is a field that points to the verification endpoint for the specific zkSync network. This parameter is optional, and its default value is the testnet verification url (`https://zksync2-testnet-explorer.zksync.dev/contract_verification`).

If you want to verify a smart contract on the Ethereum in the same project, it is important to add `etherscan` field in the `hardhat.config.ts` file:

```typescript

networks: {
    ...
},
etherscan: {
  apiKey: //<Your API key for Etherscan>,
},

```

### Commands

`hardhat verify --network <network> <contract address>` - verifies the contract on the given network with the given contract's address. </br>
Note: When run like this, the verify task will try to compare compiled bytecode of all the contracts in your local setup to the deployed bytecode of the contract you are trying to verify. If there is no match, it will report an error.

With the `--contract` parameter you can also specify which contract from your local setup you want to verify by specifying its Fully qualified name. Fully qualified name structure looks like this: "contracts/AContract.sol:TheContract" </br>

Example: ` yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>`

If your contract was deployed with the specific constructor arguments, you need to specify them when running the verify task. For example: <br/>
`yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF "Hi there!"`

If your constructor takes a complex argument list, you can write a separate javascript module to export it. <br/>
For example, create an `arguments.js` file with the following structure:

```typescript
module.exports = [
  "a string argument",
  "0xabcdef",
  "42",
  {
    property1: "one",
    property2: 2,
  },
];
```

Include it in the verify function call by adding a new parameter: `--constructor-args arguments.js`:
`yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js"`

### Verify smart contract programmatically

If you need to run the verification task directly from your code, you can use the hardhat "verify:verify" task with the previously mentioned parameters with the difference in using `--address` parameter when specifying contarct's address:<br/>

```typescript
await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
});
```
