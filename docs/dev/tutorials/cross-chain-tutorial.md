# Cross-chain governance

This tutorial shows you how to implement communication between L1 and L2 with the following example:

- A **governance** smart contract is deployed on layer 1. This contract has a function that can request a transaction on zkSync layer 2.
- A **counter** smart contract is deployed on zkSync layer 2. The contract stores a number that can be incremented by calling the `increment` method. The goverance contract on layer 1 calls this function.

## Prerequisites

- You are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).

- You already have some experience working with Ethereum.

## Project structure

Open a terminal window, create a new folder for the project tutorial, e.g. `mkdir cross-chain-tutorial`, and `cd` into the folder.

Now create separate folders to store contracts and scripts on L1 and L2.

```sh
mkdir L1-governance 
mkdir L2-counter
```

::: note
- The `L1-governance` code is a default Hardhat project used to deploy a contract on L1.
- The `L2-counter` code includes all zkSync dependencies and configurations for L2.
:::

## L1 governance

1. `cd` into `L1-governance`.

2. Initialize the project:

```sh
npm init -y
```

3. Install hardhat:

```sh
npm install --save-dev hardhat
```

4. Then run the following to set up the project:

```sh
npx hardhat 
```

Select the option **Create a Typescript project** and accept the defaults for everything else.

:::info
To interact with the zkSync bridge contract using Solidity, you need the zkSync contract interface. There are two ways to get it:

- Import it from the `@matterlabs/zksync-contracts` npm package (preferred).
- Download it from the [contracts repo](https://github.com/matter-labs/v2-testnet-contracts).
:::

5. Install the following dependencies:

```sh
npm i solc@0.8.13 @typechain/hardhat @types/node ts-node typescript @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle ethereum-waffle ethers @openzeppelin/contracts @matterlabs/zksync-contracts
```

### L1 governance contract

:::tip
Make sure you're still in the `L1-governance` folder.
:::

The following Solidity code defines the Governance smart contract. 

The constructor sets the contract creator as the single governor. The `callZkSync` function calls a transaction on L2 which can only be called by the governor.

1. `cd` into the `contracts\` folder and remove any files already there, if any.

2. Create a file called `Governance.sol` and copy/paste the code below into it.

```sol
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import 
"@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Governance {
    address public governor;

    constructor() {
        governor = msg.sender;
    }

    function callZkSync(
        address zkSyncAddress,
        address contractAddr,
        bytes memory data,
        uint256 gasLimit,
        uint256 gasPerPubdataByteLimit
    ) external payable {
        require(msg.sender == governor, "Only governor is allowed");

        IZkSync zksync = IZkSync(zkSyncAddress);
        zksync.requestL2Transaction{value: msg.value}(contractAddr, 0, 
data, gasLimit, gasPerPubdataByteLimit, new bytes[](0), msg.sender);
    }
}
```

### Deploy L1 governance contract

1. Create the file `/L1-governance/goerli.json` and copy/paste the code below, filling in the relevant values. Find node provider urls [here](https://chainlist.org/chain/5).

```json
{
  "nodeUrl": "<GOERLI NODE URL>", 
  "deployerPrivateKey": "<YOUR PRIVATE KEY>" 
}
```

2. Replace the code in `hardhat.config.ts` with the following:

```ts
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

// import file with Göerli params
const goerli = require("./goerli.json");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.13",
  },
    networks: {
      // Göerli network
      goerli: {
        url: goerli.nodeUrl,
        accounts: [goerli.deployerPrivateKey],
      },
    },
};

export default config;
```

3. Navigate to the `scripts` folder and copy/paste the following code into the `deploy.ts` file (removing any previous code):

```ts
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

4. From the `L1-governance` folder root, compile and deploy the contract:

```sh
# compile contract
npx hardhat compile

# deploy contract
npx hardhat run --network goerli ./scripts/deploy.ts
```

You should see output like this:

```sh
Governance contract was successfully deployed at 0xf28Df77fa8ff56cA3084bd11c1CAF5033A7b8C4A
```

## L2 counter

Now that we have an address for the L1 governance contract, we can build, deploy, and test the counter contract on L2.

1. `cd` into `/L2-counter` and initialize the project:

```sh
npm init -y
```

2. Install the dependencies:

```sh
npm i @typechain/hardhat @types/node ts-node typescript @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle ethereum-waffle ethers @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy @nomicfoundation/hardhat-toolbox
```

3. Set up the Hardhat project configurations, selecting **Create a Typescript project** as before:

```sh
npx hardhat 
```

::: tip
You can also use the zkSync CLI to scaffold a project automatically. Find [more info about the zkSync CLI here](../../api/tools/zksync-cli/)
:::

4. Replace the code in `hardhat.config.ts` with the following:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // use RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.13",
  },
};
```

::: info
If your default network is not `hardhat`, make sure to include `zksync: true` in its config, too.
:::

5. In the `contracts/` folder, remove any existing contracts and create a new file `Counter.sol`. 

This contract will have the address of the governance contract deployed previously on layer 1, and an incrementable counter which can only be invoked by the governance contract. 

Copy/paste the following code into the file:

```sol
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

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

6. Compile the contract from the `L2-counter` root:

```sh
npx hardhat compile
```

7. Create a folder `deploy`, and copy/paste the following code into `deploy/deploy.ts`, replacing `<GOVERNANCE-ADDRESS>` with the address of the Governance contract we just deployed, `<WALLET-PRIVATE-KEY>` with your private key:

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
  const deploymentFee = await deployer.estimateDeployFee(artifact, [GOVERNANCE_ADDRESS]);
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

8. Now deploy the contract from the `L2-governance/` folder root to zkSync:

```sh
yarn hardhat deploy-zksync
```

In the output, you should see the address to which the contract was deployed.

::: tip
You can find more specific details about deploying contracts in the [quickstart tutorial](../building-on-zksync/hello-world.md) or the documentation for the [hardhat plugins](../../api/hardhat/getting-started.md) for zkSync.
:::

## Reading the counter value

With both contracts deployed, we can create a small script to retrieve the value of the counter. For the sake of simplicity, we will create this script inside the `/L2-counter` folder. To keep the tutorial generic hardhat-specific features will not be used in it.

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

3. To interact with the governance smart contract, we need to initialise an Ethereum provider and the corresponding `ethers` `Contract` object, so we need to have the address it was deployed to:

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

4. To interact with the zkSync bridge, we need its L1 address. While on mainnet you may want to set the address of the zkSync smart contract as an env variable or a constant, it is worth noticing that you can fetch the smart contract address dynamically. We recommended this approach if you're working on a testnet since regenesis may happen and contract addresses might change.

```ts
// Imports
import { Provider, utils } from "zksync-web3";
```

```ts
async function main() {
  // ... Previous steps

  // Initializing the L2 provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  // Getting the current address of the zkSync L1 bridge
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);
}
```

5. Executing transactions from L1 requires the caller to pay some fee to the L2 operator.

Firstly, this fee depends on the length of the calldata and the `gasLimit`. If you are new to this concept then it is pretty much the same as the `l2gasLimit` on Ethereum. You can read more about [zkSync fee model here](../developer-guides/transactions/fee-model.md).

Secondly, the fee depends on the gas price that is used during the transaction call. So to have a predictable fee for the call, the gas price should be fetched from the L1 provider.

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

  // Here we define the constant for gas limit.
  // There is currently no way to get the exact gasLimit required for an L1->L2 tx.
  // You can read more on that in the tip below
  const gasLimit = BigNumber.from(100000);

  // Getting the cost of the execution in Wei.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, gasLimit, ethers.utils.hexlify(data).length);
}
```

6. Now it is possible to call the governance contract, that will redirect the call to zkSync:

```ts
// Imports
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
```

```ts
async function main() {
  // ... Previous steps

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 transaction is complete.
  await tx.wait();
}
```

Make sure to replace `<COUNTER-ADDRESS>` with the address of the L2 counter contract.

7. You can track the status of the corresponding L2 transaction. `zksync-web3`'s `Provider` has a method that, given the L1 `ethers.TransactionResponse` object of a transaction that called the zkSync bridge, returns the correspondent `TransactionResponse` object of the transaction in L2, which can conveniently wait for the transaction to be processed on L2.

```ts
async function main() {
  // ... Previous steps

  // Getting the TransactionResponse object for the L2 transaction corresponding to the execution call
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

  // Here we define the constant for gas limit.
  const gasLimit = BigNumber.from(100000);
  // Getting the cost of the execution.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, gasLimit, ethers.utils.hexlify(data).length);

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 tx is complete.
  await tx.wait();

  // Getting the TransactionResponse object for the L2 transaction corresponding to the execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract's Increment method
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

8. After that, you can verify that the transaction was indeed successful by running the `display-value` script again:

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