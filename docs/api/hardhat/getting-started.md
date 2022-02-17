# Getting started

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.

zkSync supports two plugins for hardhat:

- `@matterlabs/hardhat-zksync-solc` for smart contract compilation.
- `@matterlabs/hardhat-zksync-deploy` for smart contract deployment.

To learn more about hardhat itself, check out their [documentation](https://hardhat.org/getting-started/).

This tutorial shows how to set up a zkSync hardhat project from scratch.

## Prerequisities

For this tutorial, the following programs must be installed:

- `yarn` package manager. `npm` examples will be added soon.
- `Docker` for compilation.
- A wallet with some Görli `ETH` on L1 (Görli `USDC` is also required for the ERC-20 tutorial) to pay for bridging funds to zkSync as well as deploying smart contracts.

## Initializing the project

1. Initialize the project and install the dependencies. Run the following commands in the terminal:

```
mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Please note that Typescript is currently required by zkSync plugins.

2. Create the `hardhat.config.ts` file and paste the following code within it:

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
        dockerImage: "zksyncrobot/test-build",
      },
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "goerli",
  },
  solidity: {
    version: "0.8.11",
  },
};
```

3. Create the `contracts` and `deploy` folders. The former is the place where all the contracts' `*.sol` files should be stored, and the latter is the place where all the scripts related to deploying the contract will be put.

4. Create the `contracts/Greeter.sol` contract and insert the following code within it:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

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

5. Compile the contracts with the following command:

```
yarn hardhat compile
```

A `tmp` folder was created in the `contracts` directory. This is where the flattened versions of the contracts are stored. This folder is a compilation artifact, and should not be added to version control.

6. Create the deployment script in the `deploy/deploy.ts`:

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
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
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

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

7. After replacing the `WALLET-PRIVATE-KEY` text with the `0x`-prefixed private key of your Ethereum wallet, run the script using the following command:

```
yarn hardhat deploy-zksync
```

## Paying fees in ERC20 tokens

This section explains how to pay fees in `USDC` token as an example.

1. After making sure that the wallet has some Görli `USDC` on L1, change the depositing code to the following:

```typescript
const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
const USDC_DECIMALS = 6;

const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting], USDC_ADDRESS);
// Deposit funds to L2.
const depositHandle = await deployer.zkWallet.deposit({
  to: deployer.zkWallet.address,
  token: USDC_ADDRESS,
  // We deposit more than the minimal required amount to have funds
  // for further iteraction with our smart contract.
  amount: deploymentFee.mul(2),
  // Unlike ETH, ERC20 tokens require approval in order to deposit to zkSync.
  // You can either set the approval in a separate transaction or provide `approveERC20` flag equal to `true`
  // and the SDK will initiate approval transaction under the hood.
  approveERC20: true,
});

// Wait until the deposit is processed by zkSync.
await depositHandle.wait();
```

2. To output the fee in a human-readable format:

```typescript
const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), USDC_DECIMALS);
console.log(`The deployment will cost ${parsedFee} USDC`);
```

Please note that the fees on the testnet do not correctly represent the fees on the future mainnet release.

3. Now pass `USDC` as the `feeToken` to the deployment transaction:

```typescript
const greeterContract = await deployer.deploy(artifact, [greeting], USDC_ADDRESS);
```

4. To pay fees in USDC for smart contract interaction, supply the fee token in the `customData` override:

```typescript
const setNewGreetingHandle = await greeterContract.setGreeting(newGreeting, {
  customData: {
    feeToken: USDC_ADDRESS,
  },
});
```

#### Full example:

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const USDC_ADDRESS = "0xeb8f08a975ab53e34d8a0330e0d34de942c95926";
const USDC_DECIMALS = 6;

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  const greeting = "Hi there!";
  const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting], USDC_ADDRESS);

  // Deposit funds to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: USDC_ADDRESS,
    amount: deploymentFee.mul(2),
    approveERC20: true,
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), USDC_DECIMALS);
  console.log(`The deployment will cost ${parsedFee} USDC`);

  const greeterContract = await deployer.deploy(artifact, [greeting], USDC_ADDRESS);

  // Show the contract info.
  const contractAddress = greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // Call the deployed contract.
  const greetingFromContract = await greeterContract.greet();
  if (greetingFromContract == greeting) {
    console.log(`Contract greets us with ${greeting}!`);
  } else {
    console.error(`Contract said something unexpected: ${greetingFromContract}`);
  }

  // Edit the greeting of the contract
  const newGreeting = "Hey guys";
  const setNewGreetingHandle = await greeterContract.setGreeting(newGreeting, {
    customData: {
      feeToken: USDC_ADDRESS,
    },
  });
  await setNewGreetingHandle.wait();

  const newGreetingFromContract = await greeterContract.greet();
  if (newGreetingFromContract == newGreeting) {
    console.log(`Contract greets us with ${newGreeting}!`);
  } else {
    console.error(`Contract said something unexpected: ${newGreetingFromContract}`);
  }
}
```

5. After replacing the `WALLET-PRIVATE-KEY` text with the `0x`-prefixed private key of the Ethereum wallet, run the script using the following command:

```
yarn hardhat deploy-zksync
```

## Learn more

- New to `zksync-web3` SDK? [Here](../js) is the documentation.
- Want to dive deeper into zkSync `hardhat` plugins? Head straight to the [reference](./).

## Future releases

There are two major points of improvements for the plugins which will be released in the future:

- **Composability with the existing hardhat plugins.** Compatibility with other hardhat plugins is planned for future, but has not been a focus yet.
- **JavaScript support.** Currently, `hardhat-zksync-deploy` requires typescript to run.
