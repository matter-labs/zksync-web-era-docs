---
head:
  - - meta
    - name: "twitter:title"
      content: Deploy Contracts on zkSync | zkSync Docs
---

# Deploying Smart Contracts

These plugins provide utilities for deploying smart contracts on zkSync Era networks.

- [hardhat-zksync-deploy](deploy-contract.md#deployment-using-hardhat-zksync-deploy) plugin.
- [hardhat-zksync-ethers](deploy-contract.md#deployment-using-hardhat-zksync-ethers) plugin.

# Prerequisites

- Node.js 14.x or later
- Yarn or npm Package Manager
- Initialized Hardhat TypeScript project
- A wallet with sufficient Sepolia ETH on Ethereum and zkSync Era Testnet to pay for deploying smart contracts. You can get Sepolia ETH from the [network faucets](../../tooling/network-faucets.md).
- Get testnet ETH for zkSync Era using [bridges](https://zksync.io/explore#bridges) to bridge funds to zkSync.

# Deployment using hardhat-zksync-deploy

This tutorial demonstrates how to deploy your contract on zkSync network using hardhat-zksync-deploy plugin.

Check **hardhat-zksync-deploy** documentation [here](../../tooling/hardhat/hardhat-zksync-deploy.md).

## Installation

In the root of your project, run command:

:::code-tabs

@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-deploy hardhat zksync-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-deploy
```

:::

Dont forget to import the package in the **hardhat.config.ts** file:

```bash
import "@matterlabs/hardhat-zksync-deploy";
```

# Deployment process

For the following examples, we use the simple `SimpleStorage` smart contract:

## Simple Storage Contract

```bash
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleStorage {
    uint private number;

    // Function to set the number
    function setNumber(uint _number) public {
        number = _number;
    }

    // Function to get the number
    function getNumber() public view returns (uint) {
        return number;
    }
}
```

Exact file location: `/contracts/SimpleStorage.sol`

## Compilation

Before we continue with the deployment, we must include **hardhat-zksync-solc** plugin in order to compile our contracts.

Read more about **hardhat-zksync-solc** plugin [here.](../../tooling/hardhat/hardhat-zksync-solc.md)

## Configuration

Import the package in the **hardhat.config.ts** file:

```bash
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
```

Your **hardhat.config.ts** file should look something like this:

```bash
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
    zksolc: {
        version: 'latest',
        settings: {
            optimizer: {
                enabled: true,
            },
        }
    },
    defaultNetwork:'zkTestnet',
    networks: {
        sepolia: {
            url: 'https://sepolia.infura.io/v3/<API_KEY>' // you can use either the URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `rinkeby`)
        },
        zkTestnet: {
            url: 'https://sepolia.era.zksync.dev', // you should use the URL of the zkSync network RPC
            ethNetwork: 'sepolia',
            zksync: true
        },
    },
    solidity: {
        version: '0.8.17',
    },
};
```

In the configuration above we have some important fields such as:

1. **zksolc** - this is the configuration for zk solc compiler. We are using default settings with `latest` version and `enabled` optimizer.
2. **defaultNetwork** - set to `zkTestnet` so we dont have to type `--network NETWORK_NAME` later in our command when running our scripts.
3. **networks** - section where we define which networks we can use in our development. Only one network is used at the time.
4. **solidity** - version of `solc` compiler we want to use.

To compile contracts run command:

```bash
yarn hardhat compile
```

After successful compilation, you should see the output similar to this:

```
Compiling contracts for zkSync Era with zksolc v1.3.22 and solc v0.8.17
Compiling 1 Solidity file
Successfully compiled 1 Solidity file
Done in 0.69s.
```

In the root of your project you will see two new folders:
`artifacts-zk` and `cache-zk`.

Now we can continue with deployment process.

- Create new folder called `deploy` in the root of your project.
- In `deploy` folder, create script called `deploy-my-contract.ts`
- Make sure to add **PRIVATE_KEY** in your file.

## Deploy script

```bash
import { Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const PRIVATE_KEY = "YOUR_PRIVATE_KEY_HERE";

// An example of a deploy script
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the SimpleStorage contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("SimpleStorage");

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, []);

  const parsedFee = ethers.formatEther(deploymentFee);
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  // Deploy contract
  const simpleStorageContract = await deployer.deploy(artifact, []);

  // Show the contract info.
  const contractAddress = await simpleStorageContract.getAddress();
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}

```

and now run command to deploy on `Sepolia` test-net as thats our selected network in **hardhat.config.ts**:

```bash
yarn hardhat deploy-zksync
```

`Note:` If you remember, in our **hardhat.config.ts** we mentioned that `defaultNetwork` is zkTestnet, and for that reason we dont need to specify `--network` option after `deploy-zksync`.

Otherwise, if you prefer explicitly typing network name, you can do:

```bash
yarn hardhat deploy-zksync --network zkTestnet
```

After successful deployment, your output should look something like this:

```
Running deploy script for the SimpleStorage contract
The deployment is estimated to cost 0.0002588676 ETH
SimpleStorage was deployed to 0xCE5e67aF41C194aB05fCC3860ef66790A147Adf9
Done in 8.58s.
```

Check your deployed contract on Sepolia testnet [block explorer.](https://sepolia.explorer.zksync.io/)

# Deployment using hardhat-zksync-ethers

With similar steps as above, we will now use **hardhat-zksync-ethers** to deploy our contracts.

- Recommendation: Start with a freshly configured TypeScript project.

## Installation

In the root of your project, run command :

:::code-tabs

@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-ethers hardhat zksync-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-ethers
```

:::

## Configuration

Use the similar configuration for our **hardhat.config.ts** as shown [here.](deploy-contract.md#configuration) with one additional feature.We have added **accounts** section so you can have array of private keys.

With this change we remove the need for Wallet in our scripts.

```bash
{
    url: 'https://sepolia.era.zksync.dev', // you should use the URL of the zkSync network RPC
    ethNetwork: 'sepolia',
    zksync: true,
    accounts:["0xYOUR_ACCOUNT_PRIVATE_KEY"]
},
```

# Deployment process

For the following examples, we use same SimpleStorage smart contract as shown [here](deploy-contract.md#simple-storage-contract), and place it in `/contracts` folder.

## Compilation

We also use the same steps as shown above in this [section.](deploy-contract.md#compilation)

`Note:` **hardhat-zksync-ethers** does not require `deploy` folder.
This is because we run our scripts with `hardhat run SCRIPT_NAME` command, instead of using `hardhat deploy-zksync`

For this example we will name the deploy script for example: `deploy-contract.ts` and put it in `scripts` folder.

Our **hardhat-zksync-ethers** compatible deploy script is shown below:

## Deploy script

```bash
import hre from 'hardhat';

async function main() {
    console.info(`Running deploy`);
    // Returns contract factory which deploys contracts
    const simpleStorageFactory = await hre.zksyncEthers.getContractFactory('SimpleStorage');
    // Deploy contract
    const simpleStorage = await simpleStorageFactory.deploy();
    // Wait for contract to be deployed
    await simpleStorage.waitForDeployment();
    // Call contract function
    const tx = await simpleStorage.setNumber(5);
    // Wait for transaction
    await tx.wait()

    console.info(`Simple storage deployed to: ${await simpleStorage.getAddress()}`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
```

Now run command:

```bash
yarn hardhat run scripts/deploy-contract.ts
```

to deploy your contract.

After successful execution, you should see result like this:

```
Running deploy
Simple storage deployed to: 0xaC040A123496A113e84AaBEf9876Cd5D5c62Effd
Done in 5.73s.
```

# Conclusion

By following this guide, you can successfully deploy your contracts using both **hardhat-zksync-deploy** and **hardhat-zksync-ethers** plugins.
