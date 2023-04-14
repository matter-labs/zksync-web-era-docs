# `hardhat-zksync-upgradable`

The `hardhat-zksync-upgradable` plugin is a Hardhat plugin that supports end-to-end pipelines for deploying and updating upgradable smart contracts on the zkSync Era network.

The plugin is based on [@openzeppelin/hardhat-upgrades](https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades) and [@openzeppelin/upgrades-core](https://www.npmjs.com/package/@openzeppelin/upgrades-core) plugins for deploying and managing upgradeable smart contracts on the Ethereum network. The `hardhat-zkSync-upgradable` plugin provides an easy-to-use interface for interacting with the [OpenZeppelin Upgrades Plugins](https://docs.openzeppelin.com/upgrades-plugins) within a Hardhat environment on zkSync.

## Installation

[@matterlabs/hardhat-zksync-upgradable](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-upgradable)

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-upgradable @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-upgradable
```

:::

## Configuration

After installing it, add the plugin to your `hardhat.config.ts` file:


```typescript
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-upgradable';

import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
    zksolc: {
        version: '1.3.7',
        compilerSource: 'binary',
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
    defaultNetwork: 'zkSyncNetwork',
    networks: {
        goerli: {
            zksync: false,
            url: 'http://localhost:3050',
        },
        zkSyncNetwork: {
            zksync: true,
            ethNetwork: 'goerli',
            url: 'http://localhost:8545',
        },
    },
    solidity: {
        version: '0.8.19',
    },
};

export default config;
```

# Deploying Proxies

The plugin supports two types of proxy: Transparent upgradable proxies and beacon proxies.

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

## Transparent upgradable proxies

Transparent upgradable proxies provide a way to upgrade a smart contract without changing its address or requiring any change in the contract's interaction code. With transparent proxies, a contract's address is owned by a proxy contract, which forwards all calls to the actual contract implementation. When a new implementation is deployed, the proxy can be upgraded to point to the new implementation, allowing for seamless upgrades without requiring changes to the contract's interaction code.

To deploy a simple upgradable contract on zkSync Era local setup, first create a test wallet and add it to the new Deployer.

```typescript
  const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
  const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");

  const deployer = new Deployer(hre, zkWallet);
```

After that, load the `Box` artifact and call the `deployProxy` method from the `zkUpgrades` hre property.

```typescript
  const contract = await deployer.loadArtifact(contractName);
  await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: 'store' });
```

The `deployProxy` method deploys your implementation contract on zkSync Era, deploys the proxy admin contract, and finally, deploys the transparent proxy.

### Full deploy proxy script

```typescript
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';

const hre = require('hardhat');

async function main() {
    const contractName = 'Box';
    console.log('Deploying ' + contractName + '...');

    const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
    const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");

    const deployer = new Deployer(hre, zkWallet);

    const contract = await deployer.loadArtifact(contractName);
    const box = await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: 'store' });

    await box.deployed();
    console.log(contractName + ' deployed to:', box.address);

    box.connect(zkWallet);
    const value = await box.retrieve();
    console.log('Box value is: ', value.toNumber());
}

main();
```

> **_IMPORTANT NOTE:_** `deployProxy` method (and other deploy/upgrade methods from the zkUpgrades) needs the know which wallet to use to deploy smart contracts. For this reason, the wallet needs to have a configured provider that connects it to the specific zkSync network. This provider is configured in the hardhat config file, by stating the RPC url of the network to connect to.

```typescript
defaultNetwork: 'zkSyncNetwork',
    networks: {
        goerli: {
            zksync: false,
            url: 'http://localhost:3050',
        },
        zkSyncNetwork: {
            zksync: true,
            ethNetwork: 'goerli',
            url: 'http://localhost:8545',
        },
    },
```

Since the provider was instantiated on creating the `Deployer` class, based on your Hardhat configuration, we only have to pass the `deployer.zkWallet` and be sure that the correct provider is already set.

On the other hand, if you need to explicitly set the provider, do that with the code below:

```typescript
  import { Provider } from "zksync-web3";

  const provider = new Provider("https://testnet.era.zksync.dev");

  const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
  const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");
  zkWallet.connect(provider);

  const deployer = new Deployer(hre, zkWallet);
  ...
```

## Beacon proxies

Beacon proxies are a more advanced form of proxy that use an intermediate contract (called the Beacon contract) to delegate calls to a specific implementation contract. 

Beacon proxies enable a more advanced upgrade pattern, where multiple implementation contracts can be deployed and "hot-swapped" on the fly with no disruption to the contract's operation. 

This allows for more advanced upgrade patterns, such as adding or removing functionality while minimizing downtime.

1. Start by creating a `Deployer` for the zkSync Era  network and load the `Box` artifact:

```typescript
  const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
  const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");

  const deployer = new Deployer(hre, zkWallet);

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


The whole deploy beacon script:

```typescript
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';

const hre = require('hardhat');

async function main() {
    const contractName = 'Box';
    console.log('Deploying ' + contractName + '...');

    const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
    const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");

    const deployer = new Deployer(hre, zkWallet);

    const boxContract = await deployer.loadArtifact(contractName);
    const beacon = await hre.zkUpgrades.deployBeacon(deployer.zkWallet, boxContract);
    await beacon.deployed();
    console.log('Beacon deployed to:', beacon.address);

    const box = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet, beacon, boxContract, [42]);
    await box.deployed();
    console.log(contractName + ' beacon proxy deployed to: ', box.address);

    box.connect(zkWallet);
    const value = await box.retrieve();
    console.log('Box value is: ', value.toNumber());
}

main();

```

## Implementation addresses check

Once you deploy the proxy contract, all interactions with your implementation contract go through it. If you invoke the deployProxy function multiple times for a single implementation contract, several proxies will be created, but the implementation contract will remain the same for all of them. This means we can optimize the process to check for the existing implementation addresses before deploying a new proxy, instead of deploying a new implementation contract every time.

The upgradable plugin saves this information in the manifest file. This file will be created in your project's `.upgradable` folder. The manifest file is created per network, meaning you will have different data saved for upgrading contracts on the local setup and zkSync Era networks.

# Upgrading proxies

## Validations

In order for a smart contract implementation to be upgradable, it has to follow specific [rules](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable).

:::warning
- The current version of the `hardhat-zksync-upgradable` plugin does **NOT** support all the validation checks.
- This means that it is the users responsibility to check if the new implementation they want to upgrade follows the predefined standards.
- At the time of writing, we are working on implementing those checks within the plugin itself, and the plan for subsequent releases is to support them natively.

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


## Upgrade beacon proxy

Beacon proxy implementation can be upgraded using a similarly structured method from the `zkUpgrades` called `upgradeBeacon`. For example:

```typescript

  const boxV2Implementation = await deployer.loadArtifact('BoxV2');
  await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, <BEACON_PROXY_ADDRESS>, boxV2Implementation);

```

The example below shows how to deploy and upgrade a smart contract using beacon proxy:


```typescript

import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';
import * as zk from 'zksync-web3';

const hre = require('hardhat');

async function main() {
    const testMnemonic = 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle';
    const zkWallet = Wallet.fromMnemonic(testMnemonic, "m/44'/60'/0'/0/0");
    const deployer = new Deployer(hre, zkWallet);

    // deploy beacon proxy

    const contractName = 'Box';
    const contract = await deployer.loadArtifact(contractName);
    const beacon = await hre.zkUpgrades.deployBeacon(deployer.zkWallet, contract);
    await beacon.deployed();

    const boxBeaconProxy = await hre.zkUpgrades.deployBeaconProxy(deployer.zkWallet, beacon, contract, [42]);
    await boxBeaconProxy.deployed();

    // upgrade beacon

    const boxV2Implementation = await deployer.loadArtifact('BoxV2');
    await hre.zkUpgrades.upgradeBeacon(deployer.zkWallet, beacon.address, boxV2Implementation);
    console.log('Successfully upgraded beacon Box to BoxV2 on address: ', beacon.address);

    const attachTo = new zk.ContractFactory(
        boxV2Implementation.abi,
        boxV2Implementation.bytecode,
        deployer.zkWallet,
        deployer.deploymentType
    );
    const upgradedBox = await attachTo.attach(boxBeaconProxy.address);

    upgradedBox.connect(zkWallet);
    // wait some time before the next call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const value = await upgradedBox.retrieve();
    console.log('New box value is', value);
}

main();
```

