# Hardhat plugins for zkSync 2.0

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development on Solidity. One of the most prominent features of it is extendability: you can easily add new plugins to your hardhat project. If you learn more about hardhat, check out their [documentation](https://hardhat.org/getting-started/).

zkSync supports two plugins for hardhat:

- `hardhat-zksync-solc` for easy smart contract compilation.
- `hardhat-zksync-deploy` for easy smart contract deployment.

## NPM

- [hardhat-zksync-solc](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-solc)
- [hardhat-zksync-deploy](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-deploy)

In order to add these dependencies to your project, run 

```
# Yarn
yarn add -D @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy

# or for NPM:
npm i -D @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

## Getting started

We will show you how to setup a zkSync hardhat project from scratch.

### Initializing the project

First, we should initialize the project and install the dependencies. In order to this, you should run:

```
mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Create the `hardhat.config.ts` file and paste the following code there:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "0.1.0",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "zksyncrobot/test-build"
      }
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "https://z2-dev-api.zksync.dev",
    ethNetwork: "rinkeby",
  },
  solidity: {
    version: "0.8.10"
  }
};
```

Plese note, that the 

Create the `contracts` and `deploy` folders. The former is be the place where all the contract's `*.sol` files should be stored and the latter is the place where all the scripts related to deployment of the contract will be put. 

Create the `contracts/Greeter.sol` contract and insert the following code there:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
```

We can now compile the contracts with the following command:

```
yarn hardhat compile
```

Now, let's create the deployment script in the `deploy/deploy.ts`:

```typescript
import { Wallet, utils } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script which will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the Greeter contract`);

    // Initialize the wallet.
    const wallet = new Wallet("0x74d8b3a188f7260f67698eb44da07397a298df5427df681ef68c45b34b61f998");

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("Greeter");

    // Deposit some funds to L2 in order to be able to perform deposits.
    const depositAmount = ethers.utils.parseEther("0.001");
    const depositHandle = await deployer.zkWallet.deposit({
        to: deployer.zkWallet.address,
        token: utils.ETH_ADDRESS,
        amount: depositAmount,
    });
    // Wait until the deposit is processed on zkSync
    await depositHandle.wait();

    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const greeting = "Hi there!";
    const greeterContract = await deployer.deploy(artifact, [greeting]);

    // Show the contract info.
    const contractAddress = greeterContract.address;
    console.log(`${artifact.contractName} was deployed to ${contractAddress}!`);

    // Call the deployed contract.
    const greetingFromContract = await greeterContract.greet();
    if (greetingFromContract == greeting) {
        console.log(`Contract greets us with ${greeting}!`);
    } else {
        console.error(`Contract said something unexpected: ${greetingFromContract}`);
    }

    // Edit the greeting of the contract
    const newGreeting = "Hey guys";
    const setNewGreetingHandle = await greeterContract.setGreeting(newGreeting);
    await setNewGreetingHandle.wait();
    
    const newGreetingFromContract = await greeterContract.greet();
    if (newGreetingFromContract == newGreeting) {
        console.log(`Contract greets us with ${newGreeting}!`);
    } else {
        console.error(`Contract said something unexpected: ${newGreetingFromContract}`);
    }
}
```

Now we can run the script using the following command:

```
yarn hardhat deploy-zksync
```

Learn more:

- New to `zksync-web3` SDK? [Here](./js) is the documentation.
- Want to dive deeper into zkSync `hardhat` plugins? Head straight to the [reference](./).

## Future releases 

There are two major points of improvements for the plugins which will be relased in the future:

- **Composability with the existing hardhat plugins.** Some popular hardhat plugins may not be compatible with the zkSync development environment. This will be resolved either through cooperation with the plugins' teams or by providing new plugins with the same functionality.
- **JavaScript support.** Currently, `hardhat-zksync-deploy` requires typescript to run.
