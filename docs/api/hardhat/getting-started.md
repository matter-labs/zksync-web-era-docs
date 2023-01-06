# Getting started

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.

zkSync has has the following plugins for Hardhat:

- [@matterlabs/hardhat-zksync-solc](./plugins.md#hardhat-zksync-solc) - used to compile contracts written in Solidity.
- [@matterlabs/hardhat-zksync-vyper](./plugins.md#hardhat-zksync-vyper) - used to compile contracts written in Vyper.
- [@matterlabs/hardhat-zksync-deploy](./plugins.md#hardhat-zksync-deploy) - used to deploy smart contracts.
- [@matterlabs/hardhat-zksync-chai-matchers](./plugins.md#hardhat-zksync-chai-matchers) - adds zkSync-specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts.
- [@matterlabs/hardhat-zksync-verify](./plugins.md#hardhat-zksync-verify) - used to verify smart contracts.

To learn more about Hardhat itself, check out [its official documentation](https://hardhat.org/getting-started/).

This tutorial shows how to set up a zkSync Solidity project using Hardhat from scratch.
If you are using Vyper, check out the [Vyper plugin documentation](./plugins.md#matterlabs-hardhat-zksync-vyper) or [this example](https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example) in GitHub!

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Prerequisites

For this tutorial, the following programs must be installed:

- `yarn` package manager. `npm` examples will be added soon.
- A wallet with sufficient Göerli `ETH` on L1 to pay for bridging funds to zkSync as well as deploying smart contracts. We recommend using [our faucet from the zkSync portal](https://portal.zksync.io/faucet).

## Project setup

1. To initialize the project and install the dependencies, run the following commands in the terminal:

```
mkdir greeter-example
cd greeter-example
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

The `typescript` and `ts-node` dependencies are optional - plugins will work fine in a vanilla JavaScript environment. Although, please note that this tutorial _does_ use TypeScript.

## Configuration

2. Create the `hardhat.config.ts` file and paste the following code within it:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.2.2",
    compilerSource: "binary",
    settings: {},
    },
  },
  defaultNetwork: "zkTestnet",
  networks: {
    zkTestnet: {
      url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
      ethNetwork: "goerli", // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};
```

::: tip

To learn more about each specific property in the `hardhat.config.ts` file, check out the [plugins documentation](./plugins.md)

:::

## Write and deploy a contract

3. Create the `contracts` and `deploy` folders. In the `contracts` folder we will store all the smart contract files. In the `deploy` folder we'll place all the scripts related to deploying the contracts.

4. Create the `contracts/Greeter.sol` contract and paste the following code:

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

5. Run `yarn hardhat compile` which uses the `hardhat-zksync-solc` plugin to compile the contract. The `artifacts-zk` and `cache-zk` folders will be created in the root directory (instead of the regular Hardhat's `artifacts` and `cache`).

::: tip

Note that the `artifacts-zk` and `cache-zk` folders contain compilation artifacts and cache, and should not be added to version control, so it's a good practice to include them in the `.gitignore` file of your project.

:::

6. Create the deployment script in `deploy/deploy.ts` with the following code:

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

7. After replacing the `WALLET-PRIVATE-KEY` text with the private key of your Ethereum wallet, run the script using the following command: `yarn hardhat deploy-zksync`. This script will:

- Transfer 0.001 ETH from Goerli to zkSync.
- Deploy the `Greeting` contract with the message "Hi there!" to [zkSync testnet](https://v2-docs.zksync.io/dev/fundamentals/testnet.html).
- Retrieve the message from the contract calling the `greet()` method.
- Update the greet message in the contract with the `setGreeting()` method.
- Retrieve the message from the contract again.

**Congratulations! Your Hardhat project is now running on zkSync 2.0 testnet 🎉**

## Learn more

- To learn more about the zkSync Hardhat plugins check out the [plugins documentation](./plugins).
- If you want to know more about how to interact with zkSync using Javascript, check out the [zksync-web3 Javascript SDK documentation](../js) .

## Future releases

There are two major points of improvement for the plugins which will be released in the future:

- **Composability with the existing hardhat plugins.** Compatibility with other hardhat plugins is planned for the future but has not been a focus yet.
- **Improved cross-platform support.**
