# `hardhat-zksync-ethers`

:::warning SDK Deprecation Notice
The `zksync2-js` SDK is now deprecated. \
In line with this, the `hardhat-zksync-zksync2js` package will also be deprecated. \
Moving forward, this package will be renamed to `hardhat-zksync-ethers` and will utilize the newly introduced `zksync-ethers` SDK. \
Please update your dependencies accordingly to ensure compatibility and continued support.
:::

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:
  - Compatible with ethers **v6** (⭐ Recommended)

Examples are adopted for plugin version **>=1.0.0**
:::

## Installation

[@matterlabs/hardhat-zksync-ethers](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-ethers)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-ethers zksync-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-ethers
```

:::

## Configuration

Import the package in the `hardhat.config.ts` file:

```ts
import "@matterlabs/hardhat-zksync-ethers";
```

## Tasks

This plugin creates no additional tasks.

## Environment extensions

This plugins adds an zksync-ethers object to the Hardhat Runtime Environment.
This object has the same API as [zksync-ethers](../../api/js/zksync2-js/getting-started.md), with some extra Hardhat-specific functionality.

## Helpers

Helpers added to zksync-ethers object:

```ts
interface FactoryDeps {
  // A mapping from the contract hash to the contract bytecode.
  [contractHash: string]: string;
}

interface ZkSyncArtifact extends Artifact {
  // List of factory dependencies of a contract.
  factoryDeps: FactoryDeps;
  // Mapping from the bytecode to the zkEVM assembly (used for tracing).
  sourceMapping: string;
}

interface FactoryOptions {
  wallet?: zk.Wallet;
}

function provider: () => zk.Provider;
function getWallet: (privateKeyOrIndex?: string | number) => zk.Wallet;
function getContractFactory: (name: string, wallet?: zk.Wallet, deploymentType?: DeploymentType) => Promise<zk.ContractFactory>;
function getContractFactory: (abi: any[], bytecode: ethers.BytesLike,wallet?: Wallet,deploymentType?: DeploymentType) => Promise<zk.ContractFactory>;
function getContractFactoryFromArtifact: (artifact: ZkSyncArtifact, wallet?: zk.Wallet, deploymentType?: DeploymentType) => Promise<zk.ContractFactory>;
function getContractAt: (nameOrAbi: string | any[], address: string | Address, wallet?: zk.Wallet) => Promise<zk.Contract>;
function getContractAtFromArtifact: (artifact: ZkSyncArtifact, address: string, wallet?: zk.Wallet) => Promise<zk.Contract>;
function getSigner: (address: string) => zk.Signer;
function getSigners: () => zk.Signer[];
function getImpersonatedSigner: (address: string) => Promise<zk.Signer>;
function extractFactoryDeps: (artifact: ZkSyncArtifact) => Promise<string[]>;
function loadArtifact: (name: string) => Promise<ZkSyncArtifact>;
function deployContract: (artifact: ZkSyncArtifact, constructorArguments: any[], wallet?: zk.Wallet, overrides?: ethers.Overrides, additionalFactoryDeps?: ethers.BytesLike[]) => Promise<zk.Contract>;
```

- `provider()` - retruns a `zk.Provider` automatically connected to the selected network.
- `getWallet(privateKeyOrIndex?: string | number)` - returns `zk.Wallet` for the given private key or index. If the network is set to local and the private key is not provided, the method will return a wallet for rich accounts with the default index of `0` or the specified index. If the `accounts` object is set in the hardhat config and the private key is not specified, the method will return the wallet for the given account with the default index `0` or for the specified index.
- `getWallets()` - returns all wallets of type `zk.Wallet`. If the network is set to local, the method will return wallets for rich accounts. If the `accounts` object is set in the hardhat config for the used network, the method will return the wallets for the provided accounts.
- `getContractFactory(name: string, wallet?: zk.Wallet, deploymentType?: DeploymentType)` - returns a `zk.ContractFactory` for provided artifact name.
- `getContractFactory: (abi: any[], bytecode: ethers.BytesLike,wallet?: Wallet,deploymentType?: DeploymentType)` - returns a zk.ContractFactory for provided artifact abi and bytecode.
- `getContractFactoryFromArtifact(artifact: ZkSyncArtifact, wallet?: zk.Wallet, deploymentType?: DeploymentType)` - returns a `zk.ContractFactory` for provided artifact.
- `getContractAt(nameOrAbi: string | any[], address: string | Address, wallet?: zk.Wallet)` - returns `zk.Contract` for provided artifact name or abi and address of deployed contract
- `getContractAtFromArtifact: (artifact: ZkSyncArtifact, address: string, wallet?: zk.Wallet)` - returns `zk.ContractFactory` for provided artifact and address of deployed contract
- `getImpersonatedSigner(address: string)` - impersonates `zk.Signer` from address
- `loadArtifact(name: string)` - load `ZkSyncArtifact` from contract name
- `extractFactoryDeps(artifact: ZkSyncArtifact)` - extracts factory deps from artifact
- `deployContract(artifact: ZkSyncArtifact, constructorArguments: any[], wallet?: zk.Wallet, overrides?: ethers.Overrides, additionalFactoryDeps?: ethers.BytesLike[])` - deploys contract, for more details check out the [deployment section of the quickstart](./getting-started.md#compile-and-deploy-a-contract).

::: tip

- If `wallet?: zk.Wallet` is not provided and if the network is set to local, the default wallet will be the first account in the list of rich accounts. If an `accounts` object is set in the hardhat config for the used network, the default wallet will be taken from that object.
- If `deploymentType?: DeploymentType` is not provided default value will be `create`
  :::

## Usage

Install it and access zksync-ethers through the Hardhat Runtime Environment anywhere you need it (tasks, scripts, tests, etc). For example:

Task usage:

```ts
task("getFeeData", "Returns a fee data.").setAction(async (hre) => {
  return await hre.zksyncEthers.provider.getFeeData();
});
```

Script usage:

```ts
export default async function (hre: HardhatRuntimeEnvironment) {
  console.info(chalk.yellow(`Running deploy`));

  //automatically connected to the selected network
  const gasPrice = await hre.zksyncEthers.provider.send("eth_gasPrice", []);
  assert.strictEqual("0xee6b280", gasPrice);

  //getContractFactory with default wallet
  const greeterFactory = await hre.zksyncEthers.getContractFactory("Greeter");
  const greeter = (await greeterFactory.deploy("Hello, world!")) as zk.Contract;

  console.info(chalk.green(`Greeter deployed to: ${await greeter.getAddress()}`));

  console.info(chalk.green(`Greeter greeting set to: ${await greeter.greet()}`));

  const tx = await greeter.setGreeting("Hello, world again!");
  await tx.wait();
  console.info(chalk.green(`Greeter greeting set to: ${await greeter.greet()}`));

  const wallet = await hre.zksyncEthers.getWallet("0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110");
  console.info(chalk.green(`Wallet address: ${await wallet.getAddress()}`));
}
```
