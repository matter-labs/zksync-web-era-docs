---
head:
  - - meta
    - name: "twitter:title"
      content: Deploy Contracts on zkSync | zkSync Docs
---

# Deploying Smart Contracts

Deploying smart contracts to the zkSync network involves a series of steps that leverage the capabilities of Hardhat together with the `hardhat-zksync-deploy` and `hardhat-zksync-ethers` plugins.

In this tutorial, we detail the step-by-step procedure to deploy a smart contract on the zkSync network, utilizing the following hardhat plugin:

- [hardhat-zksync-deploy](deploy-contract.md#deployment-using-hardhat-zksync-deploy)
- [hardhat-zksync-ethers](deploy-contract.md#deployment-using-hardhat-zksync-ethers)

# Prerequisites

- Node.js 14.x or later
- Yarn or npm Package Manager
- Initialized Hardhat TypeScript project
- A wallet with sufficient Sepolia ETH on Ethereum and zkSync Era Testnet to pay for deploying smart contracts. You can get Sepolia ETH from the [network faucets](../../tooling/network-faucets.md).
- Get testnet ETH for zkSync Era using [bridges](https://zksync.io/explore#bridges) to bridge funds to zkSync.

# Deployment using hardhat-zksync-deploy

This tutorial demonstrates how to deploy contracts on zkSync network using hardhat-zksync-deploy plugin.

Check **hardhat-zksync-deploy** documentation [here](../../tooling/hardhat/hardhat-zksync-deploy.md).

## Installation

To install the **hardhat-zksync-deploy** plugin and additional necessary packages, execute the following command:

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

Once installed, add the plugin at the top of the **hardhat.config.ts** file.

```bash
import "@matterlabs/hardhat-zksync-deploy";
```

# Deployment process

For the following examples, we use the simple `SimpleStorage` smart contract.

1. Navigate to the root of your project.
2. Create a folder named **contracts**.
3. Inside the **contracts** folder, create a file named **SimpleStorage.sol**.

Now we should add some code to the new **SimpleStorage.sol** file:

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

## Compilation

Before we continue with the deployment, we must include **hardhat-zksync-solc** plugin in order to compile our contracts.

::: code-tabs
@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-solc
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-solc
```

:::
Add the plugin at the top of the **hardhat.config.ts** file:

```bash
import "@matterlabs/hardhat-zksync-solc";
```

Read more about **hardhat-zksync-solc** plugin [here.](../../tooling/hardhat/hardhat-zksync-solc.md)

## Configuration

Import the package in the **hardhat.config.ts** file:

```bash
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
```

With the previous steps completed, your **hardhat.config.ts** file should now be properly configured to include settings for deploy contracts.

```bash
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
    zksolc: {
    },
    defaultNetwork:'zkTestnet',
    networks: {
        zkTestnet: {
            url: 'https://sepolia.era.zksync.dev', // The RPC URL of zkSync Era network.
            ethNetwork: 'https://sepolia.infura.io/v3/<API_KEY>', // The Ethereum Web3 RPC URL.
            zksync: true // Flag that targets zkSync Era.
        },
    },
    solidity: {
        version: '0.8.17',
    },
};
```

In the configuration above we have some important fields such as:

- **zksolc** - configuration section enabling adjustment and customization of the zk compiler.
- **defaultNetwork** - configuration section for specifying which network to use when running hardhat tasks.
- **networks** - configuration section where we define which networks we can use in our development. Only one network is used at the time.
- **solidity** - configuration section enabling adjustment and customization of the solc compiler.

Find more details about available configuration options in the [official documentation.](../../tooling/hardhat/hardhat-zksync-solc.md#configuration)

Execute the following command in your terminal to run the compilation:

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

In the root of your project you will see two new folders that represent zksolc compilation result:

- `artifacts-zk`
- `cache-zk`.

Here are the steps to create deploy scritps with **hardhat-zksync-deploy** plugin.

1. Navigate to your project's root directory.
2. Create a new folder named **deploy**.
3. Inside the **deploy** folder, create a file named **deploy-my-contract.ts**.

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

To deploy contract on `zkSync Sepolia testnet` that we already specified as default network in our **hardhat.config.ts**, run command:

```bash
yarn hardhat deploy-zksync
```

If you prefer to explicitly select network name within a command, you can run:

```bash
yarn hardhat deploy-zksync --network zkTestnet
```

After successful deployment, your console output should look something like this:

```
Running deploy script for the SimpleStorage contract
The deployment is estimated to cost 0.0002588676 ETH
SimpleStorage was deployed to 0xCE5e67aF41C194aB05fCC3860ef66790A147Adf9
Done in 8.58s.
```

Check your deployed contract on Sepolia testnet [block explorer.](https://sepolia.explorer.zksync.io/)

# Deployment using hardhat-zksync-ethers

With similar steps as above, we will now use **hardhat-zksync-ethers** to deploy our contracts.

**hardhat-zksync-ethers** plugin is a wrapper around [zksync-ethers](https://www.npmjs.com/package/zksync-ethers) sdk that gives additional methods to use for faster development.

## Installation

In the root directory of your project, execute this command:

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

To deploy contracts with **hardhat-zskync-ethers**, use the similar configuration for our **hardhat.config.ts** as shown [here.](deploy-contract.md#configuration)
The **accounts** section enables to specify wallet private keys which help us deploy contracts with automatically populated wallet within **hardhat-zksync-ethers** plugin, but it can still be manually created for our use-cases.

```bash
{
    url: 'https://sepolia.era.zksync.dev', // you should use the URL of the zkSync network RPC
    ethNetwork: 'sepolia',
    zksync: true,
    accounts:["0xYOUR_ACCOUNT_PRIVATE_KEY"]
},
```

# Deployment process

For the following examples, we use same SimpleStorage smart contract as shown [here](deploy-contract.md#simple-storage-contract).

## Compilation

We also use the same steps as shown above in this [section.](deploy-contract.md#compilation)

`Note:` **hardhat-zksync-ethers** does not require `deploy` folder.
This is because we run our scripts with `hardhat run SCRIPT_NAME` command, instead of using `hardhat deploy-zksync`

In this example, we'll name the deployment script `deploy-contract.ts` and place it in the `scripts` folder.

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

`Note:` As you can see we are not required to create the `Wallet` object.  
Wallet is constructed in the background by using the first private key set in `accounts` section.

To deploy contract, execute command:

```bash
yarn hardhat run scripts/deploy-contract.ts
```

After successful execution, your console output should look something like this:

```
Running deploy
Simple storage deployed to: 0xaC040A123496A113e84AaBEf9876Cd5D5c62Effd
Done in 5.73s.
```

# Conclusion

By following this guide, you can successfully deploy contracts using both **hardhat-zksync-deploy** and **hardhat-zksync-ethers** plugins.
