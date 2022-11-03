# Cross-chain governance

This tutorial serves as an example of how to implement L1 to L2 contract interaction. The following functionality is implemented in this tutorial:

- A "counter" smart contract is deployed on zkSync, which stores a number that can be incremented by calling the `increment` method.
- A "governance" smart contract is deployed on layer 1, which has the privilege to increment the counter on zkSync.

## Preliminaries

In this tutorial, it is assumed that you are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../developer-guides/hello-world.md).

It is also assumed that you already have some experience working with Ethereum.

## Project structure

As we will deploy contracts on both L1 and L2, we'll separate this project in two different folders:

- `/L1-governance`: for the L1 contract, and scripts.
- `/L2-counter`: for the L2 contract, and scripts.

So go ahead and create these folders.

::: tip

Note that the `governance` project is a default Hardhat project because it'll be used to deploy a contract just in L1, while the `counter` project includes all the zkSync dependencies and specific configuration as it'll deploy the contract in L2.

:::

## L1 governance

To initialise the project inside the `/L1-governance` folder, run `npx hardhat init` and select the option "Create a Typescript project".

To interact with the zkSync bridge contract using Solidity, you need to use the zkSync contract interface. There are two options to get it:

1. Importing it from the `@matterlabs/zksync-contracts` npm package. (preferred)
2. Downloading it from the [contracts repo](https://github.com/matter-labs/v2-testnet-contracts).

We'll go with option 1 and install the `@matterlabs/zksync-contracts` package by running the following command (just make sure you're inside the `/L1-governance` folder):

```
yarn add -D @matterlabs/zksync-contracts
```

The code of the governance contract that we will deploy on L1 is the following:

```sol
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Governance {
    address public governor;

    constructor() {
        governor = msg.sender;
    }

    function callZkSync(
        address zkSyncAddress,
        address contractAddr,
        bytes memory data,
        uint64 ergsLimit
    ) external payable {
        require(msg.sender == governor, "Only governor is allowed");

        IZkSync zksync = IZkSync(zkSyncAddress);
        zksync.requestL2Transaction{value: msg.value}(contractAddr, 0, data, ergsLimit, new bytes[](0));
    }
}
```

This is a very simple governance contract. It sets the creator of the contract as the single governor and has a function that can send calls to the zkSync smart contract.

### Deploy L1 governance contract

Although this tutorial does not focus on the process of deploying contracts on L1, we'll give you a quick overview on how to continue.

1. You'll need an RPC node endpoint to the Göerli testnet to submit the deploymet transaction. You can [find multiple node providers here](https://github.com/arddluma/awesome-list-rpc-nodes-providers).

2. Create the file `/L1-governance/goerli.json` and fill in the following values:

```json
{
  "nodeUrl": "", // your Goerli Ethereum node  URL.
  "deployerPrivateKey": "" //private key of the wallet that will deploy the governance smart contract. It needs to have some ETH on Göerli.
}
```

3. Add the Göerli network section to the `hardhat.config.ts` file:

```ts
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

// import file with Goerli params
const goerli = require('./goerli.json');

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
  networks: {
    // Göerli network
    goerli: {
      url: goerli.nodeUrl,
      accounts: [goerli.deployerPrivateKey]
    },
  }
}
```

4. Create the deployment script `/L1-governance/scripts/deploy.ts` with the following code:

```ts
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const Governance = await ethers.getContractFactory("Governance");

  const contract = await Governance.deploy();
  await contract.deployed();

  console.log(`Governance contract was successfully deployed at ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. Compile the contract and run the deployment script with:

```
# compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts

```

The last command will output the deployed governance smart contract address.

## L2 counter

Now that we have the L1 governance contract addressed, let's proceed with deploying the counter contract on L2.

1. To initialise the project in the `/L2-counter` folder run the following commands:

```
yarn init -y
# install all dependencies
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

2. Create the `hardhat.config.ts` file and paste the following code there:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.2.0",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.2.0",
      },
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

If your default network is not `hardhat`, make sure to include `zksync: true` in its config, too.

3. Create the `contracts` and `deploy` folders. The former is the place where all the contracts' `*.sol` files should be stored, and the latter is the place where all the scripts related to deploying the contract will be put.

4. Create the `contracts/Counter.sol` contract file. This contract will have the address of the governance contract deployed in L1 and a counter. The function to increment the counter can only be invoked by the governance contract. Here is the code:

```sol
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Counter {
    uint256 public value = 0;
    address public governance;

    constructor(address newGovernance) {
        governance = newGovernance;
    }

    function increment() public {
        require(msg.sender == governance, "Only governance is allowed");

        value += 1;
    }
}
```

5. Compile the contract with the following command:

```
yarn hardhat compile
```

6. Create the deployment script in the `deploy/deploy.ts`:

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Insert the address of the governance contract
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Counter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Counter");

  // Deposit some funds to L2 to be able to perform deposits.
  const deploymentFee = await deployer.estimateDeployFee(artifact, [
    GOVERNANCE_ADDRESS,
  ]);
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.
  // The address of the governance is an argument for contract constructor.
  const counterContract = await deployer.deploy(artifact, [GOVERNANCE_ADDRESS]);

  // Show the contract info.
  const contractAddress = counterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

7. After replacing `<WALLET-PRIVATE-KEY>` and `<GOVERNANCE-ADDRESS>` with the `0x`-prefixed private key of an Ethereum wallet with some ETH balance on Göerli, and the address of the L1 governance contract respectively, run the script using the following command:

```
yarn hardhat deploy-zksync
```

In the output, you should see the address to which the contract was deployed.

::: tip

You can find more specific details about deploying contracts in the [quickstart tutorial](../developer-guides/hello-world.md) or the documentation for the [hardhat plugins](../../api/hardhat/getting-started.md) for zkSync.

:::

## Reading the counter value

With both contracts deployed, we can create a small script to retrieve the value of the counter. For the sake of simplicity, we will create this scripts inside the `/L2-counter` folder. To keep the tutorial generic hardhat-specific features will not be used in it.

### Getting the ABI of the counter contract

Here is how you can get the ABI of the counter contract:

1. Copy the `abi` array from the compilation artifact located at `/L2-counter/artifacts-zk/contracts/Counter.sol/Counter.json`.

2. Create the `scripts` folder inside the `/L2-counter` project folder.

3. Create a new file `/L2-counter/scripts/counter.json` and paste the ABI of the counter contract.

4. Create the `/L2-counter/scripts/display-value.ts` file and paste the following code there:

```ts
import { Contract, Provider, Wallet } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const counterContract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counterContract.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

The code is relatively straightforward and is mostly equivalent to how it would work with `ethers`. It will just retrieve the counter value from the L2 contract.

After replacing `<COUNTER-ADDRESS>` with the address of the deployed counter contract, run this script by running

```
yarn ts-node ./scripts/display-value.ts
```

The output should be:

```
The counter value is 0
```

## Calling an L2 contract from L1

Now, let's call the `increment` method from Layer 1.

1. Get the ABI array of the compiled Governance contract, which is located in `/L1-governance/artifacts/contracts/Governance.sol/Governance.json`, and save it in a new file as `/L2-counter/scripts/governance.json` (make sure you create it in the `/L2-counter` folder!).
2. Create the `L2-counter/scripts/increment-counter.ts` file and paste the following template for the script:

```ts
// Imports and constants will be put here

async function main() {
  // The logic will be put here
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. To interact with the governance smart contract, we need to initialise an Ethereum provider and the corresponding `ethers` `Contract` object, so we need to have the address it was deployed to:

```ts
// Imports
import { BigNumber, Contract, ethers, Wallet } from "ethers";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
```

```ts
async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet, the same one as the one that deployed the
  // governance contract
  const wallet = new ethers.Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);
}
```

Replace the `<GOVERNANCE-ADDRESS>` and `<WALLET-PRIVATE-KEY>` with the address of the L1 governance smart contract and the private key of the wallet that deployed the governance contract respectively.

5. To interact with the zkSync bridge, we need its L1 address. While on mainnet you may want to set the address of the zkSync smart contract as an env variable or a constant, it is worth noticing that you can fetch the smart contract address dynamically. We recommended this approach if you're working on a testnet since regenesis may happen and contract addresses might change.

```ts
// Imports
import { Provider, utils } from "zksync-web3";
```

```ts
async function main() {
  // ... Previous steps

  // Initializing the L2 privider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  // Getting the current address of the zkSync L1 bridge
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);
}
```

6. Executing transactions from L1 requires the caller to pay some fee to the L2 operator.

Firstly, this fee depends on the length of the calldata and the `ergsLimit`. If you are new to this concept then it is pretty much the same as the `gasLimit` on Ethereum. You can read more about [zkSync fee model here](../developer-guides/transactions/fee-model.md).

Secondly, the fee depends on the gas price that is used during the transaction call. So to have a predictable fee for the call, the gas price should be fetched and use the obtained value.

```ts
// Imports
const COUNTER_ABI = require("./counter.json");
```

```ts
async function main() {
  // ... Previous steps

  // Encoding L1 transaction is the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of L1 transaction requests depend on the gas price used in the call,
  // so we should explicitly fetch the gas price before the call.
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for ergs limit.
  // There is currently no way to get the exact ergsLimit required for an L1->L2 tx.
  // You can read more on that in the tip below
  const ergsLimit = BigNumber.from(100000);

  // Getting the cost of the execution in Wei.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, ergsLimit, ethers.utils.hexlify(data).length);
}
```

::: tip Fee model and fee estimation are WIP

You may have noticed the lack of the `ergs_per_pubdata` and `ergs_per_storage` fields in the L1->L2 transactions. These are surely important for the security of the protocol and they will be added soon. Please note that this will be a breaking change for the contract interface.

Also, there is currently no easy way to estimate the exact number of `ergs` required for the execution of an L1->L2 transaction. At the time of this writing, the transactions may be processed even if the supplied `ergsLimit` is `0`. This will change in the future.

:::

7. Now it is possible to call the governance contract, that will redirect the call to zkSync:

```ts
// Imports
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
```

```ts
async function main() {
  // ... Previous steps

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, ergsLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 transaction is complete.
  await tx.wait();
}
```

Make sure to replace `<COUNTER-ADDRESS>` with the address of the L2 counter contract.

8. You can track the status of the corresponding L2 transaction. `zksync-web3`'s `Provider` has a method that, given the L1 `ethers.TransactionResponse` object of a transaction that called the zkSync bridge, returns the correspondent `TransactionResponse` object of the transaction in L2, which can conveniently wait for the transaction to be processed on L2.

```ts
async function main() {
  // ... Previous steps

  // Getting the TransactionResponse object for the L2 transaction corresponding to the
  // execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}
```

### Complete code

Here is the full code to get the zkSync contract address, encode the transaction data, calculate the fees, send the transaction to the L1 and track the correspondent transaction in L2:

```ts
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { Provider, utils } from "zksync-web3";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
const COUNTER_ABI = require("./counter.json");
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";

async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  // Getting the current address of the zkSync L1 bridge
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);

  // Encoding the tx data the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of the L1 transaction requests depends on the gas price used in the call
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for ergs limit.
  const ergsLimit = BigNumber.from(100000);
  // Getting the cost of the execution.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, ergsLimit, ethers.utils.hexlify(data).length);

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, ergsLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 tx is complete.
  await tx.wait();

  // Getting the TransactionResponse object for the L2 transaction corresponding to the
  // execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the Increment contract
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

You can run the script with the following command:

```
yarn ts-node ./scripts/increment-counter.ts
```

In the output, you should see the full transaction receipt in L2. You can take the `transactionHash` and track it in the [zkSync explorer](https://explorer.zksync.io/).

9. After that, you can verify that the transaction was indeed successful by running the `display-value` script again:

```
yarn ts-node ./scripts/display-value.ts
```

The counter in the L2 contract should have increased after the transaction so output should be:

```
The counter value is 1
```

## Complete project

You can download the complete project [here](https://github.com/matter-labs/cross-chain-tutorial).

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](../developer-guides/bridging/l1-l2.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../api/hardhat).
