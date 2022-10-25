# Getting started

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.

zkSync has three plugins for hardhat:

- `@matterlabs/hardhat-zksync-solc` for smart contract compilation using Solidity.
- `@matterlabs/hardhat-zksync-vyper` for smart contract compilation using Vyper.
- `@matterlabs/hardhat-zksync-deploy` for smart contract deployment.

To learn more about hardhat itself, check out their [documentation](https://hardhat.org/getting-started/).

This tutorial shows how to set up a zkSync Solidity project using a hardhat from scratch.
If you are using Vyper, check out the [reference](./reference.md#matterlabs-hardhat-zksync-vyper) for our Vyper plugin or the [example](https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example) in our GitHub repo!

## Prerequisites

For this tutorial, the following programs must be installed:

- `yarn` package manager. `npm` examples will be added soon.
- `Docker` for compilation.
- A wallet with sufficient Görli `ETH` on L1 to pay for bridging funds to zkSync as well as deploying smart contracts.

## Initializing the project

1. Initialize the project and install the dependencies. Run the following commands in the terminal:

```
mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

`typescript` and `ts-node` are optional - plugins will work fine in a vanilla JavaScript environment. Although, please note that this tutorial _does_ use TypeScript.

2. Create the `hardhat.config.ts` file and paste the following code within it:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.2.0",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.2.0"
      }
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
  },
  networks: {
    hardhat: {
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};
```

3. Create the `contracts` and `deploy` folders. The former is the place where all the contracts' `*.sol` files should be stored, and the latter is the place where all the scripts related to deploying the contract will be put.

4. Create the `contracts/Greeter.sol` contract and insert the following code within it:

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

5. Compile the contracts with the following command:

```
yarn hardhat compile
```

An `artifacts-zk` and `cache-zk` folders were created in the root directory (instead of the regular hardhat's `artifacts` and `cache`).
These are compilation artifacts, and should not be added to version control.

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

## Learn more

- New to `zksync-web3` SDK? [Here](../js) is the documentation.
- Want to dive deeper into zkSync `hardhat` plugins? Head straight to the [reference](./reference).

## Future releases

There are two major points of improvement for the plugins which will be released in the future:

- **Composability with the existing hardhat plugins.** Compatibility with other hardhat plugins is planned for the future but has not been a focus yet.
- **Improved cross-platform support.**
