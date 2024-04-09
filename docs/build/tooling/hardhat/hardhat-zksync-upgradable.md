---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-upgradable | zkSync Docs
---

# `hardhat-zksync-upgradable`

The `hardhat-zksync-upgradable` plugin is a Hardhat plugin that supports end-to-end pipelines for deploying and updating upgradable smart contracts on the zkSync Era network.

The plugin is based on [@openzeppelin/upgrades-core](https://www.npmjs.com/package/@openzeppelin/upgrades-core) plugin for deploying and managing upgradeable smart contracts on the Ethereum network. The `hardhat-zksync-upgradable` plugin provides an easy-to-use interface for interacting with the [OpenZeppelin Upgrades Plugins](https://docs.openzeppelin.com/upgrades-plugins) within a Hardhat environment on zkSync.

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:
  - Compatible with ethers **v6** (⭐ Recommended)

Examples are adopted for plugin version **>=1.0.0**
:::

## Installation

:::warning Version Incompatibility
Current version of the upgradable plugin does not support the latest version of the `@openzeppelin/upgrades-core` package.
:::

[@matterlabs/hardhat-zksync-upgradable](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-upgradable)

Add the latest version of this plugin to your project with the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-upgradable @openzeppelin/upgrades-core @openzeppelin/contracts-upgradeable@4.9.5 @openzeppelin/contracts@4.9.5
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-upgradable @openzeppelin/contracts-upgradeable@4.9.5 @openzeppelin/contracts@4.9.5
```

:::

## Configuration

After installing it, add the plugin to your `hardhat.config.ts` file:

```typescript
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
// upgradable plugin
import "@matterlabs/hardhat-zksync-upgradable";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  defaultNetwork: "zkSyncNetwork",
  networks: {
    ethNetwork: {
      zksync: false,
      url: "http://localhost:8545",
    },
    zkSyncNetwork: {
      zksync: true,
      ethNetwork: "ethNetwork",
      url: "http://localhost:3050",
    },
  },
  solidity: {
    version: "0.8.19",
  },
};

export default config;
```

## Deploying proxies

The plugin supports three types of proxies: Transparent upgradable proxies, UUPS proxies, and beacon proxies.

Upgradability methods are all part of the `zkUpgrades` property in the `HardhatRuntimeEnvironment` and you only need to interact with it in order to deploy or upgrade your contracts.

For the following examples, we use the simple `Box` smart contract:

```typescript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract Box is Initializable{
    uint256 private value;
    uint256 private secondValue;
    uint256 private thirdValue;

    function initialize(uint256 initValue) public initializer {
        value = initValue;
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

}
```

In the examples below, we assume that the Box contract is compiled and its artifact loaded using Deployer class from the [hardhat-zksync-deploy plugin](./hardhat-zksync-deploy.md). More info on how to compile and load the contract can be found in the [Hardhat getting started page](./getting-started.md).

## Transparent upgradable proxies

Transparent upgradable proxies provide a way to upgrade a smart contract without changing its address or requiring any change in the contract's interaction code. With transparent proxies, a contract's address is owned by a proxy contract, which forwards all calls to the actual contract implementation. When a new implementation is deployed, the proxy can be upgraded to point to the new implementation, allowing for seamless upgrades without requiring changes to the contract's interaction code.

To deploy a simple upgradable contract on zkSync Era local setup, first create a test wallet and add it to the new Deployer.

```typescript
// mnemonic for local node rich wallet
const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
const zkWallet = Wallet.fromMnemonic(testMnemonic);

const deployer = new Deployer(hre, zkWallet);
```

After that, load the `Box` artifact and call the `deployProxy` method from the `zkUpgrades` hre property.

```typescript
const contractName = "Box";
const contract = await deployer.loadArtifact(contractName);
await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: "initialize" });
```

The `deployProxy` method deploys your implementation contract on zkSync Era, deploys the proxy admin contract, and finally, deploys the transparent proxy.

### Full deploy proxy script

```typescript
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";

import * as hre from "hardhat";

async function main() {
  const contractName = "Box";
  console.log("Deploying " + contractName + "...");

  // mnemonic for local node rich wallet
  const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
  const zkWallet = Wallet.fromMnemonic(testMnemonic);

  const deployer = new Deployer(hre, zkWallet);

  const contract = await deployer.loadArtifact(contractName);
  const box = await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: "initialize" });

  await box.waitForDeployment();
  console.log(contractName + " deployed to:", await box.getAddress());

  box.connect(zkWallet);
  const value = await box.retrieve();
  console.log("Box value is: ", value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the script with:

::: code-tabs

@tab:active yarn

```bash
yarn hardhat run SCRIPT_FILE
```

@tab npm

```bash
npx hardhat run SCRIPT_FILE
```

:::

:::warning

- deployProxy method (and other deploy/upgrade methods from the zkUpgrades) needs to know which wallet to use to deploy smart contracts.
- For this reason, the wallet needs to have a configured provider that connects it to the specific zkSync network.
- This provider is configured in the hardhat config file, by stating the RPC url of the network to connect to.
  :::

### Openzeppelin Version

The plugin does not work with the latest versions due to a blocker on the `@matterlab/zksync-contracts` package.The solution is to change the development dependencies to the previous version in your `package.json`.

```
 "@openzeppelin/contracts": "^4.9.5",
 "@openzeppelin/contracts-upgradeable": "^4.9.5",
```

### Hardhat config

```typescript
defaultNetwork: 'zkSyncNetwork',
    networks: {
        sepolia: {
            zksync: false,
            url: 'http://localhost:3050',
        },
        zkSyncNetwork: {
            zksync: true,
            ethNetwork: 'sepolia',
            url: 'http://localhost:8545',
        },
    },
```

Since the provider was instantiated on creating the `Deployer` class, based on your Hardhat configuration, we only have to pass the `deployer.zkWallet` and be sure that the correct provider is already set.

On the other hand, if you need to explicitly set the provider, do that with the code below:

```typescript
  import { Provider } from "zksync-ethers";

  const provider = new Provider("https://sepolia.era.zksync.dev");

  const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
  const zkWallet = Wallet.fromMnemonic(testMnemonic);
  zkWallet.connect(provider);

  const deployer = new Deployer(hre, zkWallet);
  ...
```

## UUPS proxies

:::warning

- If you want to use the plugin's UUPS proxy functionality, use zksolc version >=1.3.9.
  :::

The UUPS proxy pattern is similar to the transparent proxy pattern, except that the upgrade is triggered via the logic contract instead of from the proxy contract.

For the UUPS deployment example, we use a slightly modified smart contract called `BoxUups`.

```typescript

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract BoxUups is Initializable, {
    uint256 private value;
    uint256 private secondValue;
    uint256 private thirdValue;

    function initialize(uint256 initValue) public initializer {
        value = initValue;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
}
```

The main difference between the `Box` and `BoxUups` contracts is that the latter implements both `UUPSUpgradeable` and `OwnableUpgradeable` interfaces and has a special function `_authorizeUpgrade` which can only be called by the contract owner.

You can find more info about how UUPS works in [OpenZeppelin's documentation.](https://docs.openzeppelin.com/contracts/4.x/api/proxy#transparent-vs-uups)

To deploy the UUPS contract, use the same script as for the transparent upgradable proxy.

```typescript
async function main() {
    const contractName = 'BoxUups';
    console.info(chalk.yellow('Deploying ' + contractName + '...'));

    // mnemonic for local node rich wallet
    const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
    const zkWallet = Wallet.fromMnemonic(testMnemonic);
    ...
```

When you run the script, the plugin detects that the proxy type is UUPS, it executes the deployment, and saves the deployment info in your manifest file.

## Beacon proxies

Beacon proxies are a more advanced form of proxy that use an intermediate contract (called the Beacon contract) to delegate calls to a specific implementation contract.

Beacon proxies enable a more advanced upgrade pattern, where multiple implementation contracts can be deployed and "hot-swapped" on the fly with no disruption to the contract's operation.

This allows for more advanced upgrade patterns, such as adding or removing functionality while minimizing downtime.

1. Start by creating a `Deployer` for the zkSync Era network and load the `Box` artifact:

```typescript
// mnemonic for local node rich wallet
const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
const zkWallet = Wallet.fromMnemonic(testMnemonic);

const deployer = new Deployer(hre, zkWallet);

const contractName = "Box";
const boxContract = await deployer.loadArtifact(contractName);
```

2. Deploy the beacon contract using `deployBeacon` method from the `zkUpgrades`

```typescript
await hre.zkUpgrades.deployBeacon(deployer.zkWallet, boxContract);
```

3. Use the `deployBeaconProxy` method which receives the zkSync Era wallet, beacon contract, and the implementation (Box) contract with its arguments.

```typescript
const box = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet, beacon, boxContract, [42]);
```

After that, your beacon proxy contract is deployed on the network, and you can interact with it.

### Full code for deploy beacon

```typescript
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";

import * as hre from "hardhat";

async function main() {
  const contractName = "Box";
  console.log("Deploying " + contractName + "...");
  // mnemonic for local node rich wallet
  const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
  const zkWallet = Wallet.fromMnemonic(testMnemonic);

  const deployer = new Deployer(hre, zkWallet);

  const boxContract = await deployer.loadArtifact(contractName);
  const beacon = await hre.zkUpgrades.deployBeacon(deployer.zkWallet, boxContract);
  await beacon.waitForDeployment();
  console.log("Beacon deployed to:", await beacon.getAddress());

  const box = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet, await beacon.getAddress(), boxContract, [42]);
  await box.waitForDeployment();
  console.log(contractName + " beacon proxy deployed to: ", await box.getAddress());

  box.connect(zkWallet);
  const value = await box.retrieve();
  console.log("Box value is: ", value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the script with:

::: code-tabs

@tab:active yarn

```bash
yarn hardhat run SCRIPT_FILE
```

@tab npm

```bash
npx hardhat run SCRIPT_FILE
```

:::

## Implementation addresses check

Once you deploy the proxy contract, all interactions with your implementation contract go through it.

If you invoke the `deployProxy` function multiple times for a single implementation contract, several proxies will be created, but the implementation contract will remain the same for all of them. This means we can optimize the process to check for the existing implementation addresses before deploying a new proxy, instead of deploying a new implementation contract every time.

The upgradable plugin saves this information in the manifest file. This file will be created in your project's `.upgradable` folder. The manifest file is created per network, meaning you will have different data saved for upgrading contracts on the local setup and zkSync Era networks.

# Upgrading proxies

## Validations

In order for a smart contract implementation to be upgradable, it has to follow specific [rules](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable).

:::warning

- The current version of the `hardhat-zksync-upgradable` plugin does **NOT** support all the validation checks.
- This means that it is the users responsibility to check if the new implementation they want to upgrade follows the predefined standards.
- At the time of writing, we are working on implementing those checks within the plugin itself, and the plan for subsequent releases is to support them natively.
  :::

## Upgradable examples

The following examples use the `BoxV2` contract as a new implementation for the `Box` proxy.

```typescript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BoxV2 is Initializable{
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    function initialize(uint256 initValue) public initializer {
        value = initValue;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value and returns it with a prefix
    function retrieve() public view returns (string memory) {
        return string(abi.encodePacked("V2: ", uint2str(value)));
    }

    // Converts a uint to a string
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
```

## Upgrade transparent proxy

To upgrade the implementation of the transparent upgradeable contract, use the `upgradeProxy` method from the `zkUpgrades`.

```typescript
  const BoxV2 = await deployer.loadArtifact('BoxV2');
  await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, <PROXY_ADDRESS>, BoxV2);
```

`upgradeProxy` receives 3 arguments:

- A zkSync Era wallet.
- The address of the previously deployed box proxy.
- The artifact containing the new `Box2` implementation.

## Upgrade UUPS proxy

Similar to the deployment script, there are no modifications needed to upgrade the implementation of the UUPS contract, compared to upgrading the transparent upgradable contract. The only difference is that we use the `BoxUupsV2` as a new implementation contract.

```typescript

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract BoxUupsV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private value;
    uint256 private secondValue;
    uint256 private thirdValue;

    function initialize(uint256 initValue) public initializer {
        value = initValue;
    }

    // Reads the last stored value and returns it with a prefix
    function retrieve() public view returns (string memory) {
        return string(abi.encodePacked('V2: ', uint2str(value)));
    }

    // Converts a uint to a string
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return '0';
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
}
```

Upgrade proxy script snippet:

```typescript
  const BoxUupsV2 = await deployer.loadArtifact('BoxUupsV2');
  await hre.zkUpgrades.upgradeProxy(deployer.zkWallet, <PROXY_ADDRESS>, BoxUupsV2);
```

## Upgrade beacon proxy

Beacon proxy implementation can be upgraded using a similarly structured method from the `zkUpgrades` called `upgradeBeacon`. For example:

```typescript
  const boxV2Implementation = await deployer.loadArtifact('BoxV2');
  await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, <BEACON_PROXY_ADDRESS>, boxV2Implementation);
```

The example below deploys and upgrades a smart contract using a beacon proxy:

```typescript
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";
import * as zk from "zksync-ethers";
import { Contract } from "ethers";

import * as hre from "hardhat";

async function main() {
  // mnemonic for local node rich wallet
  const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
  const zkWallet = Wallet.fromMnemonic(testMnemonic);
  const deployer = new Deployer(hre, zkWallet);

  // deploy beacon proxy
  const contractName = "Box";
  const contract = await deployer.loadArtifact(contractName);
  const beacon = await hre.zkUpgrades.deployBeacon(deployer.zkWallet, contract);
  await beacon.waitForDeployment();

  const beaconAddress = await beacon.getAddress();

  const boxBeaconProxy = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet, beaconAddress, contract, [42]);
  await boxBeaconProxy.waitForDeployment();

  // upgrade beacon
  const boxV2Implementation = await deployer.loadArtifact("BoxV2");
  await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, beaconAddress, boxV2Implementation);
  console.info("Successfully upgraded beacon Box to BoxV2 on address: ", beaconAddress);

  const attachTo = new zk.ContractFactory<any[], Contract>(boxV2Implementation.abi, boxV2Implementation.bytecode, deployer.zkWallet, deployer.deploymentType);
  const upgradedBox = attachTo.attach(await boxBeaconProxy.getAddress());

  upgradedBox.connect(zkWallet);
  // wait some time before the next call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const value = await upgradedBox.retrieve();
  console.log("New box value is", value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the script with:

::: code-tabs

@tab:active yarn

```bash
yarn hardhat run SCRIPT_FILE
```

@tab npm

```bash
npx hardhat run SCRIPT_FILE
```

:::

# Proxy verification

::: warning

- To use proxy verification functionality, you must use the `hardhat-zksync-verify` plugin version >=0.1.8
  :::

The hardhat-zksync-upgradable plugin supports proxy verification, which means you can verify all the contracts deployed during the proxy deployment with a single verify command.

To use the verification functionality, you first need to **import the `hardhat-zksync-verify plugin` before the `hardhat-zksync-upgradable` plugin in your `hardhat.config.ts` file:**

```typescript
...
// Imports the verify plugin before the upgradable plugin
import '@matterlabs/hardhat-zksync-verify';
import '@matterlabs/hardhat-zksync-upgradable';
...
```

To verify all the deployed contracts, simply run the verify command with the <b>_proxy address_</b> as an argument:

```sh
yarn hardhat verify <proxy address>
```

This command will verify the implementation related to the proxy, the proxy contract itself, and all the smart contracts included in the specific deployment process, such as a proxy admin smart contract or a beacon smart contract.

# Proxy validations

The `hardhat-zksync-upgradable` plugin has built-in checks to ensure that your smart contract's newest implementation version follows the necessary requirements when upgrading your smart contract.

You can learn more about what those restrictions are in [OpenZeppelin's documentation](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable).

# Proxy gas fee estimation

Should you wish to estimate the total gas used throughout the proxy deployment process, consider utilizing the upgradable plugin's gas estimation functions. We offer three types of gas estimation functions for your convenience:

- estimateGasProxy
- estimateGasBeacon
- estimateGasBeaconProxy

In the examples provided below, we will use the a Box contract and the deployer in the same way we used them in the previous examples:

```typescript
// mnemonic for local node rich wallet
const testMnemonic = "stuff slice staff easily soup parent arm payment cotton trade scatter struggle";
const zkWallet = Wallet.fromMnemonic(testMnemonic);

const deployer = new Deployer(hre, zkWallet);

const contractName = "Box";
const contract = await deployer.loadArtifact(contractName);
```

To estimate the deployment fee for the Transparent upgradable proxies and UUPS proxies, use the `estimateGasProxy` method from the `zkUpgrades.estimation`. This method calculates the fee for deploying the implementation contract, transparent proxy/UUPS contract, and the ProxyAdmin smart contract.

::: code-tabs

@tab:active Transparent proxy

```typescript
const totalGasEstimation = await hre.zkUpgrades.estimation.estimateGasProxy(deployer, contract, [], { kind: "transparent" });
```

@tab UUPS proxy

```typescript
const totalGasEstimation = await hre.zkUpgrades.estimation.estimateGasProxy(deployer, contract, [], { kind: "uups" });
```

:::

To estimate the deployment fee for the beacon contract and its corresponding implementation, use the `estimateGasBeacon` method:

```typescript
const totalGasEstimation = await hre.zkUpgrades.estimation.estimateGasBeacon(deployer, contract, []);
```

If you want to get the estimation for the beacon proxy contract, please use the `estimateGasBeaconProxy` method:

```typescript
const totalGasEstimation = await hre.zkUpgrades.estimation.estimateGasBeacon(deployer, contract, []);
```

Each of these methods totals the fee for every contract in their respective pipeline, displays the cost on the console, and returns the cumulative sum. If you prefer not to see the individual estimations, introduce the parameter `quiet` as the final parameter in any method to receive only the returned sum.

```typescript
const totalGasEstimation = await hre.zkUpgrades.estimation.estimateGasProxy(this.deployer, contract, [], { kind: "uups" }, true);
```

# Commands

Please consider that while the provided commands enable contract deployment and upgrading, not all arguments may be available. If these commands lack the required functionality, it may be necessary to utilize scripting for a more comprehensive approach.

## Configuration

To extend the configuration to support commands, we need to add an accounts field to the specific network configuration in the networks section of the `hardhat.config.ts` file. This accounts field can support an array of private keys or a mnemonic object and represents accounts that will be used as wallet automatically.

```typescript
const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL (optional).
    },
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      // ADDITION
      // The private keys for the accounts used in the deployment or in the upgrade process.
      accounts: ["0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3", "0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959"],
      // Mnemonic used in the deployment or in the upgrade process
      // accounts: {
      //     mnemonic: 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
      // }
    },
  },
};
```

- accounts represents a list of the private keys or mnemonic object for the account used in the deployment or in the upgrade process.

  accounts object will automatically be populated with rich accounts if used network is zkSync Era Test Node or zksync-cli Local Node
  To establish a default index per network, which is by default `0`, you can include a `deployerAccounts` section in your `hardhat.config.ts` file.

```typescript
const config: HardhatUserConfig = {
  // ADDITION
  deployerAccounts: {
    zkTestnet: 1, // The default index of the account for the specified network.
    //default: 0 // The default value for not specified networks. Automatically set by plugin to the index 0.
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>", // The Ethereum Web3 RPC URL (optional).
    },
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      // The private keys for the accounts used in the deployment process.
      accounts: ["0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3", "0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959"],
      // Mnemonic used in the deployment process
      // accounts: {
      //     mnemonic: 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
      // }
    },
  },
};
```

- `deployerAccounts` represents an object where the default index of the accounts is provided and automatically used in the upgradable commands described below. If the network name is not specified inside the object, the default index of the account will be `0`. We can change and deafult index for not specified networks if we override `default` name with index that we want.

## Command list

`yarn hardhat deploy-zksync:proxy --contract-name <contract name or FQN> [<constructor arguments>] [--constructor-args <javascript module name>] [--deployment-type <deployment type>] [--initializer <initialize method>] [--no-compile]`

Automatically determine whether the deployment requires a Transparent or UUPS proxy, and deploy all necessary contracts accordingly. If the Transparent proxy is chosen, the deployment will include the implementation, admin, and proxy. Alternatively, selecting the UUPS proxy will result in deploying the implementation and proxy.

`yarn hardhat upgrade-zksync:proxy --contract-name <contract name or FQN> --proxy-address <proxy address> [--deployment-type <deployment type>] [--no-compile]`

Upgrade UUPS or Transparent implementation on the specified network.

`yarn hardhat deploy-zksync:beacon --contract-name <contract name or FQN> [<constructor arguments>] [--constructor-args <javascript module name>] [--deployment-type <deployment type>] [--initializer <initialize method>] [--no-compile]`

Initiates the deployment of the specified implementation, beacon, and proxy on the specified network.

`yarn hardhat upgrade-zksync:beacon --contract-name <contract name or FQN> --beacon-address <beacon address> [--deployment-type <deployment type>] [--no-compile]`

Upgrade beacon implementation on the specified network.

- `--contract-name <contract name or FQN>` - contract name or FQN, required argument in all tasks, e.g. `hardhat deploy-zksync:proxy --contract-name SomeContract`.
- `<constructor arguments>` - list of constructor arguments, e.g. `hardhat deploy-zksync:proxy --contract-name Greeter 'Hello'`.
- `--constructor-args <module name>` - name of javascript module containing complex constructor arguments. Works only if `<constructor arguments>` are not provided, e.g. `hardhat deploy-zksync:contract --contract-name ComplexContract --constructor-args args.js`. Example of `args.js` :

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

- `--beacon-address <beacon address>` - deployed beacon contract address, e.g. `yarn hardhat upgrade-zksync:beacon --contract-name BoxV2 --beacon-address 0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520`.
- `--proxy-address <proxy address>` - deployed proxy contract address, e.g. `yarn hardhat upgrade-zksync:proxy --contract-name BoxV2 --proxy-address 0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520`.
- `--initializer <initializer method>` - initializer method name present in the contract, e.g. `hardhat deploy-zksync:proxy --contract-name Contract --initializer store`. If this parameter is omitted, the default value will be `initialize`.
- `--no-compile`- skip the compilation process, e.g. `hardhat deploy-zksync:beacon --contract-name Contract --no-compile`.
- `--deployment-type` - specify which deployer smart contract function will be called. Permissible values for this parameter include `create`, `create2`, `createAccount`, and `create2Account`. If this parameter is omitted, the default value will be `create`, e.g. `hardhat deploy-zksync:beacon --contract-name Greeter 'Hello' --deployment-type create2`.

The account used for deployment will be the one specified by the `deployerAccount` configuration within the `hardhat.config.ts` file. If no such configuration is present, the account with index `0` will be used.
