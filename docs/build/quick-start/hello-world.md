---
head:
  - - meta
    - name: "twitter:title"
      content: Hello world | zkSync Docs
---

# Quickstart: hello world! hello zkSync

<div class="time-label-wrapper">
  <p>⏱️ Time to complete: &lt;5 minutes</p>
</div>

![zksync hello world tutorial](../../assets/images/quickstart-tutorial-cli.gif)

This guide shows you how to deploy and interact with a smart contract on zkSync in less than 5 minutes. It will help you get familiar with the zkSync development toolbox.

This is what we're going to do:

- Fund your wallet with zkSync testnet ETH.
- Use [zksync-cli](../tooling/zksync-cli/getting-started.md) to scaffold a new project.
- Build a smart contract that stores a greeting message and deploy it to zkSync Era testnet.
- Run a script to retrieve and update the greeting message using [zksync-ethers](../sdks/js/getting-started.md).

## Prerequisites

- Make sure your machine satisfies the [system requirements](https://github.com/matter-labs/era-compiler-solidity/tree/main#system-requirements).
- Download and install [Node.js](https://nodejs.org/en/download).
- Use the `yarn` or `npm` package manager. We recommend using `yarn`. To install `yarn`, follow the [Yarn installation guide](https://yarnpkg.com/getting-started/install).
- Learn how to [get your private key from your Metamask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) as we'll use it to deploy a contract.

## Fund your wallet

You can get testnet ETH directly into zkSync testnet using the [following faucet provided by Chainstack](https://faucet.chainstack.com/zksync-testnet-faucet).

Another option is to [get SepoliaETH from any of the following faucets](../tooling/network-faucets.md) and bridge it to zkSync Sepolia testnet using the [zkSync bridge](https://portal.zksync.io/bridge/?network=sepolia).

You can check the balance of your account in the [zkSync Sepolia explorer](https://sepolia.explorer.zksync.io/).

## Create the project

<!--
The repo used here for atlas is no longer maintained, so it's not a good idea to recommend it in the docs for it to ultimately break.

I did something similar with Chainlink that is running to this day if you want to see the actions file:
https://github.com/smartcontractkit/chainlink-brownie-contracts/blob/main/.github/workflows/add-and-commit.yml

::: info Project available in Atlas IDE
This entire tutorial can be run in under a minute using Atlas. Atlas is a smart contract IDE that lets you write, deploy, and interact with contracts from your browser.

[Open this project in Atlas](https://app.atlaszk.com/projects?template=https://github.com/matter-labs/zksync-hardhat-template&open=Greeter.sol&chainId=300).
::: -->

Run the following command in your terminal to create a new project using zkSync CLI.

```sh
npx zksync-cli create hello-zksync
```

It will give you options for different types of projects but for this tutorial choose the following:

```bash
? What type of project do you want to create? Contracts
? Ethereum framework: Ethers v6
? Template: Hardhat + Solidity
? Private key of the wallet responsible for deploying contracts (optional) ***************************************************
? Package manager: yarn
```

::: info

The private key of your wallet will be included in the `.env` file of the project and won't be pushed to GitHub. However, as this means the private key is in plain text, it's recommended to use a private key that isn't associated with any real funds.

:::

The project structure is pretty straightforward:

- `hardhat.config.ts` contains the general configuration for Hardhat and the zkSync plugins, which are already imported and setup.
- `/contracts` contains smart contracts. `zksync-cli` provides common examples like an ERC20, an NFT, and the Greeter contract that we'll use later on.
- `/deploy` contains the deployment scripts.

For this tutorial we'll focus on the `/contracts/Greeter.sol` contract:

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

As you can see, it a simple Solidity contract with two methods to read a message, `greet()`, and modify it, `setGreeting()`.

::: tip Takeaway

zkSync is EVM compatible. You can write smart contracts with Solidity or Vyper and use existing popular libraries like OpenZeppelin.

:::

## Compile the contract

Smart contracts deployed to zkSync must be compiled using our custom compilers:

- `zksolc` for Solidity contracts.
- `zkvyper` for Vyper contracts.

As this is a Solidity project, it already has the `hardhat-zksync-solc` plugin installed and configured so there's nothing you need to setup. To compile the contracts in the project, run the following command:

1. Navigate into the project directory:

```sh
cd hello-zksync
```

::: code-tabs

@tab:active yarn

```bash
yarn compile
```

@tab npm

```bash
npm run compile
```

:::

You'll get the following output:

```sh
Compiling contracts for zkSync Era with zksolc v1.3.21 and solc v0.8.17
Compiling 46 Solidity files
Successfully compiled 46 Solidity files
✨  Done in 21.55s.
```

The compiled artifacts will be located in the `/artifacts-zk` folder. These artifacts are similar to the ones generated by the Solidity compiler. For example, the ABI of the Greeter contract will be located in `/artifacts-zk/contracts/Greeter.sol/Greeter.json`.

::: tip Takeaway

Smart contracts deployed to zkSync must be compiled using `zksolc` or `zkvyper` as they generate a custom bytecode compatible with zkSync's ZKEVM.

:::

The configuration for the `zksolc` compiler is located in the `zksolc` section of the `hardhat.config.ts` file. You can find more info about the compiler settings in the [hardhat-zksync-solc plugin](../tooling/hardhat/hardhat-zksync-solc.md) and the [compiler section](../../zk-stack/components/compiler/specification/overview.md) of the ZK Stack documentation.

## Deploy and verify

The project also contains a script to deploy and verify the contract in `/deploy/deploy.ts`. Under the hood, this script uses `hardhat-zksync-deploy` and `hardhat-zksync-verify` for deployment and contract verification.

```ts
import { deployContract } from "./utils";

// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const contractArtifactName = "Greeter";
  const constructorArguments = ["Hi there!"];
  await deployContract(contractArtifactName, constructorArguments);
}
```

To execute it, just run:

::: code-tabs

@tab:active yarn

```bash
yarn deploy
```

@tab npm

```bash
npm run deploy
```

:::

You'll get the following output:

```sh
Starting deployment process of "Greeter"...
Estimated deployment cost: 0.0000648863 ETH

"Greeter" was successfully deployed:
 - Contract address: 0x0BaF96A7f137B05d0D35b76d59B16c86C1791D8D
 - Contract source: contracts/Greeter.sol:Greeter
 - Encoded constructor arguments: 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000

Requesting contract verification...
Your verification ID is: 1781
```

🥳 Congratulations! You just deployed a smart contract to zkSync Sepolia testnet. You can find it in the [zkSync Sepolia explorer](https://sepolia.explorer.zksync.io/) by searching the contract address.

In addition, the deployment script verified the contract automatically so you can see the source code in the contract tab of the block explorer.

## Interact with the contract

The project also comes with a script to interact with the contract in `/deploy/interact.ts`.
Add the address of the Greeter contract you just deployed in the `CONTRACT_ADDRESS` variable inside the `/deploy/interact.ts` file:

```ts
import * as hre from "hardhat";
import { getWallet } from "./utils";
import { ethers } from "ethers";

// Address of the contract to interact with
const CONTRACT_ADDRESS = "";
if (!CONTRACT_ADDRESS) throw "⛔️ Provide address of the contract to interact with!";

// An example of a script to interact with the contract
export default async function () {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("Greeter");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  // Run contract read function
  const response = await contract.greet();
  console.log(`Current message is: ${response}`);

  // Run contract write function
  const transaction = await contract.setGreeting("Hello people!");
  console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

  // Read message after transaction
  console.log(`The message now is: ${await contract.greet()}`);
}
```

As you can see, we're simply using `ethers` to interact with our contract. zkSync is EVM compatible so you can use existing tools and libraries like `Hardhat`, `ethers`, `web3.js`, and users can use their existing wallets like Metamask, Rabby or Zerion.

::: tip Takeaway

Existing libraries like `ethers` and `web3.js` can be used to interact with smart contracts deployed on zkSync.

:::

To execute the `/deploy/interact.ts` script, run:

::: code-tabs

@tab:active yarn

```bash
yarn interact
```

@tab npm

```bash
npm run interact
```

:::

You'll get the following output:

```sh
Running script to interact with contract 0x0BaF96A7f137B05d0D35b76d59B16c86C1791D8D
Current message is: Hi there!
Transaction hash of setting new message: 0x7a534857cfcd6df7e3eaf40a79a2c88f2e36bb60ce6f2399345e5431362b04eb
The message now is: Hello people!
✨  Done in 4.13s.
```

Congratulations! You've retrieved and updated the message on the `Greeter` contract. You can see the transaction [in the block explorer](https://sepolia.explorer.zksync.io/) by searching the transaction hash.

## Takeaways

- zkSync is EVM compatible and you can write smart contracts in Solidity or Vyper, use Hardhat, libraries like Ethers and Web3.js, or wallets like Metamask and Rabby.
- zkSync CLI provides a quick way to scaffold different types of projects thanks to its multiple templates.
- Contracts deployed to zkSync are compiled using `zksolc` or `zkvyper` as they generate a special bytecode for zkSync's ZKEVM.

## Next steps

This was your first step towards becoming a zkSync developer. Here is what you can do next:

- Create a frontend for this contract following the [Frontend quickstart](../tutorials/dapp-development/frontend-quickstart-paymaster.md).
- Join our [developer community in GitHub](https://github.com/zkSync-Community-Hub/zksync-developers/discussions), where you can ask questions and help other developers.
- Read the [Security and best practices](./best-practices.md) to keep your apps secure.
- Learn about the [differences between Ethereum and zkSync](../developer-reference/differences-with-ethereum.md).
- If you have a project, check out our [migration guide](../tooling/hardhat/migrating-to-zksync.md).
