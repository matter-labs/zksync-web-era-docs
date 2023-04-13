# Getting started

[Hardhat](https://hardhat.org) is an Ethereum development environment, designed for easy smart contract development in Solidity. One of its most prominent features is extendability: you can easily add new plugins to your hardhat project.

zkSync has the following plugins for Hardhat:

- [@matterlabs/hardhat-zksync-solc](./hardhat-zksync-solc.md) - used to compile contracts written in Solidity.
- [@matterlabs/hardhat-zksync-vyper](./hardhat-zksync-vyper.md) - used to compile contracts written in Vyper.
- [@matterlabs/hardhat-zksync-deploy](./hardhat-zksync-deploy.md) - used to deploy smart contracts.
- [@matterlabs/hardhat-zksync-chai-matchers](./hardhat-zksync-chai-matchers.md) - adds zkSync-specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts.
- [@matterlabs/hardhat-zksync-verify](./hardhat-zksync-verify.md) - used to verify smart contracts.

To learn more about Hardhat itself, check out [its official documentation](https://hardhat.org/getting-started/).

This tutorial shows how to set up a zkSync Solidity project using Hardhat from scratch.
If you are using Vyper, check out the [Vyper plugin documentation](./hardhat-zksync-vyper.md) or [this example](https://github.com/matter-labs/hardhat-zksync/tree/main/examples/vyper-example) in GitHub!


## Prerequisites

- A Node installation with `yarn` package manager installed.
- You are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../../dev/building-on-zksync/hello-world.md).
- You have a wallet with sufficient Göerli `ETH` on L1 to pay for bridging funds to zkSync as well as deploying smart contracts. We recommend using [our faucet from the zkSync portal](https://goerli.portal.zksync.io/faucet).
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

## Setup

1. To initialize the project and install the dependencies, run the following commands in the terminal:

::: code-tabs

@tab:active folder

```sh
mkdir greeter-example
cd greeter-example

```

@tab install dependencies

```sh
yarn init -y
yarn add -D typescript ts-node @types/node ethers@^5.7.2 zksync-web3 @ethersproject/hash @ethersproject/web hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```
:::

You don't have to install `typeScript`, `ts-node`, and `@types/node` dependencies if you are using vanilla JavaScript. However, it's worth mentioning that this tutorial does use TypeScript.

::: tip
If you are using Yarn 2 or later, there may be additional steps to ensure that `TypeScript` works correctly in your editor. For more information, check out [Yarn's official documentation](https://yarnpkg.com/getting-started/editor-sdks).
:::

## Configuration

2. Create the `hardhat.config.ts` file in the project root and add the following code:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.8",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkTestnet",
  networks: {
    zkTestnet: {
      url: "https://testnet.era.zksync.dev", // URL of the zkSync network RPC
      ethNetwork: "goerli", // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};
```

::: tip
To know more about the individual properties in the `hardhat.config.ts` file, you can refer to the [plugins documentation](./plugins.md).
:::

## Write and deploy a contract

3. Create two folders: `contracts` for storing smart contract files, and `deploy` for keeping scripts related to deploying the contracts.

4. Create a new contract file called `Greeter.sol` in the `contracts` folder, and copy/paste the following code into it:

```solidity
//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.17;

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

5. To compile the contract, use the command `yarn hardhat compile` with the `hardhat-zksync-solc` plugin. This will create `artifacts-zk` and `cache-zk` folders in the root directory, instead of the usual artifacts and cache folders used by Hardhat.

::: tip

Remember to remove the folders named `artifacts-zk` and `cache-zk` from version control in your project. These folders contain compilation artifacts and cache, and it's best to add them to the `.gitignore` file to avoid them being added to your version control.

:::

6. Create a deployment script called `deploy.ts`, in the `deploy` folder, and copy/paste the following code into it, replacing `<WALLET-PRIVATE-KEY>` with your private key:

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

7. Deploy the contract.

```sh
yarn hardhat deploy-zksync
```
This script will:

- Transfer 0.001 ETH from Goerli to zkSync.
- Deploy the `Greeting` contract with the message "Hi there!" to zkSync Era Testnet.
- Retrieve the message from the contract by calling the `greet()` method.
- Update the greeting message in the contract with the `setGreeting()` method.
- Retrieve the message from the contract again.

You should see something like this:

```txt
Greeter was deployed to 0x7eCbF187fcF8904C344b54b218B274D1293a22E8
Contract greets us with Hi there!!
Contract greets us with Hey guys!
✨  Done in 218.69s.

```

**Congratulations! Your Hardhat project is now running on zkSync Era Testnet 🎉**

::: tip Request-Rate Exceeded message
- This message is caused by using the default RPC endpoints provided by ethers. 
- To avoid this, use your own Goerli RPC endpoint. 
- Find multiple [node providers here](https://github.com/arddluma/awesome-list-rpc-nodes-providers).
:::

## Learn more

- To learn more about the zkSync Hardhat plugins check out the [plugins documentation](./plugins).
- To learn more about `zksync-web3` SDK, check out its [documentation](../js/).
## Future releases

There are two major points of improvement for the plugins which will be released in the future:

- **Composability with the existing hardhat plugins.** Compatibility with other hardhat plugins is planned for the future.
