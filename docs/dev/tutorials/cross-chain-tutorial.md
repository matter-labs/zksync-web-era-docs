# Cross-chain governance

This tutorial shows you how to implement communication between L1 and L2 with the following example:

- A **Governance** Solidity smart contract is deployed on layer 1. This contract has a function that sends a transaction to zkSync layer 2.
- A **Counter** Solidity smart contract is deployed on zkSync layer 2. This contract stores a number that is incremented by calling the `increment` method. The `Governance` contract on layer 1 calls this function.

## Prerequisites

- You are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).
- You already have some experience working with Ethereum.
- You have a web3 wallet app which holds some Goerli test ETH and some zkSync test ETH.
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

### Complete project

Download the complete project [here](https://github.com/matter-labs/cross-chain-tutorial).

## Project set up

Open a terminal window, create a new folder for the project tutorial, e.g. `mkdir cross-chain-tutorial`, and `cd` into the folder.

Now create separate folders to store contracts and scripts on L1 and L2.

```sh
mkdir L1-governance L2-counter
```

::: note
- The `L1-governance` code is a default Hardhat project used to deploy a contract on L1.
- The `L2-counter` code includes all zkSync dependencies and configurations for L2.
:::

## L1 governance

1. `cd` into `L1-governance`.

2. Run the following to initialise and set up the L1 project:

```sh
npx hardhat 
```

Select the option **Create a Typescript project** and accept the defaults for everything else.

:::info
To interact with the zkSync bridge contract using Solidity, you need the zkSync contract interface. There are two ways to get it:

- Import it from the `@matterlabs/zksync-contracts` npm package (preferred).
- Download it from the [contracts repo](https://github.com/matter-labs/v2-testnet-contracts).
:::

3. Install the following dependencies:

::: code-tabs
@tab yarn
```sh
yarn add -D typescript ts-node @openzeppelin/contracts @matterlabs/zksync-contracts @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle ethereum-waffle
```
@tab npm
```sh
npm i -D typescript ts-node @openzeppelin/contracts @matterlabs/zksync-contracts @nomiclabs/hardhat-ethers @nomiclabs/hardhat-waffle ethereum-waffle
```
:::

### Create L1 governance contract

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

1. Create the file `L1-Governance/goerli.json` and copy/paste the code below, filling in the relevant values. Find node provider urls [here](https://chainlist.org/chain/5).

```json
{
  "nodeUrl": "<GOERLI NODE URL>", 
  "deployerPrivateKey": "<YOUR PRIVATE KEY>" 
}
```

2. Replace the code in `hardhat.config.ts` with the following:

```ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// import file with Göerli params
const goerli = require("./goerli.json");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
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

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. From the `L1-governance` folder root, compile and deploy the contract:

::: code-tabs
@tab yarn
```sh
# compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts
```
@tab npm
```sh
# compile contract
npx hardhat compile

# deploy contract
npx hardhat run --network goerli ./scripts/deploy.ts
```
:::

You should see output like this:

```sh
Governance contract was successfully deployed at 0xf28Df77fa8ff56cA3084bd11c1CAF5033A7b8C4A
```

## L2 counter

Now that we have an address for the L1 governance contract, we can build, deploy, and test the counter contract on L2.

1. `cd` into `/L2-counter` and initialize the project:

::: code-tabs
@tab yarn
```sh
yarn init -y
```
@tab npm
```sh
npm init -y
```
:::

2. Install the dependencies:

::: code-tabs
@tab yarn
```sh
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```
@tab npm
```sh
npm i typescript ts-node ethers@^5.7.2 zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```
:::

::: tip
- With `npm` you can also use the zkSync CLI to scaffold a project automatically. 
- Find [more info about the zkSync CLI here](../../api/tools/zksync-cli/).
:::

3. Create the `hardhat.config.ts` file in the root and add the following code, adding a functioning RPC URL:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.10",
    compilerSource: "binary",
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "<GOERLI RPC URL>",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.19",
  },
};
```

::: info
If your default network is not `hardhat`, make sure to include `zksync: true` in the config.
:::

### Create L2 counter contract

1. In the `L2-counter` folder, create a `contracts/` directory, `cd` into it, and create a new file `Counter.sol`. 

This contract contains the address of the governance contract deployed previously on layer 1, and an incrementable counter which can only be invoked by the governance contract. 

2. Copy/paste the following code into the file:

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

3. Compile the contract from the `L2-counter` root:

::: code-tabs
@tab yarn
```sh
yarn hardhat compile
```
@tab npm
```sh
npx hardhat compile
```
:::

### Deploy L2 counter contract

1. From the `L2-counter/` folder, create a folder `deploy`, and copy/paste the following code into `deploy/deploy.ts`, replacing `<GOVERNANCE-ADDRESS>` with the address of the Governance contract we just deployed, and `<WALLET-PRIVATE-KEY>` with your private key:

```typescript
import { utils, Wallet } from "zksync-web3";
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
  const deploymentFee = await deployer.estimateDeployFee(artifact, [utils.applyL1ToL2Alias(GOVERNANCE_ADDRESS)]);
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.
  // The address of the governance is an argument for contract constructor.
  const counterContract = await deployer.deploy(artifact, [utils.applyL1ToL2Alias(GOVERNANCE_ADDRESS)]);

  // Show the contract info.
  const contractAddress = counterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

::: tip Deposit funds during deployment
The deployment script contains a deposit from Goerli to zkSync Era testnet, which can take a few minutes to finish. If your wallet already has funds in L2, you can skip that part to save you some time.
:::

2. Now deploy the contract from the `L2-counter/` folder root to zkSync:

::: code-tabs
@tab yarn
```sh
yarn hardhat deploy-zksync
```
@tab npm
```sh
npx hardhat deploy-zksync
```
:::

You should see output like this:

```txt
Running deploy script for the Counter contract
Counter was deployed to 0x3c5A6AB2390F6217C78d2F6F403A9dFb7e7784FC
```

::: tip
For more information about deploying contracts, check out the [quickstart tutorial](../building-on-zksync/hello-world.md) or the documentation for the zkSync [hardhat plugins](../../api/hardhat/getting-started.md).
:::

## Read the counter value

Now both contracts are deployed, we can create a script to retrieve the value of the counter. 

1. Create the `scripts` directory under `L2-counter`.

2. Copy the `abi` array from the compilation artifact located at `/L2-counter/artifacts-zk/contracts/Counter.sol/Counter.json`.

3. Create a new file `/L2-counter/scripts/counter.json` and paste in the `abi` array.

4. Create a `/L2-counter/scripts/display-value.ts` file and paste in the following code, adding the counter contract address:

```ts
import { Contract, Provider } from 'zksync-web3';

const COUNTER_ADDRESS = '<COUNTER-ADDRESS>';
const COUNTER_ABI = require('./counter.json');

async function main() {
  // Initialize the provider
  const l2Provider = new Provider('https://testnet.era.zksync.dev');

  const counterContract = new Contract(
    COUNTER_ADDRESS,
    COUNTER_ABI,
    l2Provider
  );

  const value = (await counterContract.value()).toString();

  console.log(`The counter value is ${value}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. Run the script:

::: code-tabs
@tab yarn
```sh
yarn ts-node ./scripts/display-value.ts
```
@tab npm
```sh
npx ts-node ./scripts/display-value.ts
```
:::

The output should be:

```txt
The counter value is 0
```

## Call L2 contract from L1 

Now, let's call the `increment` method on Layer 2 from Layer 1. 

1. Copy the `abi` array from the compilation artifact located at:

`/L1-governance/artifacts/contracts/Governance.sol/Governance.json`.

2. Paste it into a new file: `/L2-counter/scripts/governance.json`.

3. Create the `L2-counter/scripts/increment-counter.ts` file and paste in the following code, replacing the following details:

- GOVERNANCE-ADDRESS: the address of the contract deployed in L1.
- COUNTER-ADDRESS: the address of the contract deployed in L2.
- WALLET-PRIVATE-KEY: the private key of your account.
- RPC-URL: the same url you used in the `goerli.json` file.

```ts
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { Provider, utils } from "zksync-web3";
const GOVERNANCE_ABI = require('./governance.json');
const GOVERNANCE_ADDRESS = '<GOVERNANCE-ADDRESS>';
const COUNTER_ABI = require('./counter.json');
const COUNTER_ADDRESS = '<COUNTER-ADDRESS>';

async function main() {
  // Enter your Ethereum L1 provider RPC URL.
  const l1Provider = new ethers.providers.JsonRpcProvider("<RPC-URL>");
  // Set up the Governor wallet to be the same as the one that deployed the governance contract.
  const wallet = new ethers.Wallet("<YOUR-PRIVATE-KEY>", l1Provider);
  // Set a constant that accesses the Layer 1 contract.
  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  // Initialize the L2 provider.
  const l2Provider = new Provider("https://testnet.era.zksync.dev");
  // Get the current address of the zkSync L1 bridge.
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Get the `Contract` object of the zkSync bridge.
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);

  // Encoding the L1 transaction is done in the same way as it is done on Ethereum.
  // Use an Interface which gives access to the contract functions.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of an L1 transaction depends on the gas price used.
  // You should explicitly fetch the gas price before making the call.
  const gasPrice = await l1Provider.getGasPrice();

  // Define a constant for gas limit which estimates the limit for the L1 to L2 transaction.
  const gasLimit = await l2Provider.estimateL1ToL2Execute({
    contractAddress: COUNTER_ADDRESS,
    calldata: data,
    caller: utils.applyL1ToL2Alias(GOVERNANCE_ADDRESS) 
  });
  // baseCost takes the price and limit and formats the total in wei.
  // For more information on `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT` see the [fee model documentation](../developer-guides/transactions/fee-model.md).
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, gasLimit, utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT);

  // !! If you don't include the gasPrice and baseCost in the transaction, a re-estimation of fee may generate errors.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT, {
    // Pass the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Wait until the L1 tx is complete.
  await tx.wait();

  // Get the TransactionResponse object for the L2 transaction corresponding to the execution call.
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // Output the receipt of the L2 transaction corresponding to the call to the counter contract.
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

:::tip
- Executing transactions from L1 requires the caller to pay a fee to the L2 operator. The fee depends on the length of the calldata and the `gasLimit`. This is similar to `gasLimit` on Ethereum. You can read more about [zkSync Era fee model](../developer-guides/transactions/fee-model.md).
- The fee also depends on the gas price that is used during the transaction call. So to have a predictable fee for the call, the gas price should be fetched from the L1 provider.
:::

4. Run the script with the following command:

::: code-tabs
@tab yarn
```sh
yarn ts-node ./scripts/increment-counter.ts
```
@tab npm
```sh
npx ts-node ./scripts/increment-counter.ts
```
:::

In the output, you should see the full transaction receipt in L2. You can take the `transactionHash` and track it in the [zkSync explorer](https://explorer.zksync.io/). It should look something like this:

```json
{
  to: '0x9b379893bfAD08c12C2167C3e3dBf591BeD9410a',
  from: '0xE2EA97507a6cb610c81c4A9c157B8060E2ED7036',
  contractAddress: null,
  transactionIndex: 0,
  root: '0xb9ca78c288163a322a797ee671db8e9ab430eb00e38c4a989f2246ea22493945',
  gasUsed: BigNumber { _hex: '0x05c3df', _isBigNumber: true },
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  blockHash: '0xb9ca78c288163a322a797ee671db8e9ab430eb00e38c4a989f2246ea22493945',
  transactionHash: '0x1fb19cc0aca8fcccaf5fbafd9174550f3151d0d2aa15d99eb820e0394313e409',
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 4119331,
      transactionHash: '0x1fb19cc0aca8fcccaf5fbafd9174550f3151d0d2aa15d99eb820e0394313e409',
      address: '0x000000000000000000000000000000000000800A',
      topics: [Array],
      ...

```

5. Verify that the transaction was successful by running the `display-value` script again.

```sh
npx ts-node ./scripts/display-value.ts
```

You should see an incremented value in the output:

```txt
The counter value is 1
```

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](../developer-guides/bridging/l1-l2.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../api/hardhat).
