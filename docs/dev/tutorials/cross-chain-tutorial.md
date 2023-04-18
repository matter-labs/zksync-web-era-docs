# Cross-chain governance

This tutorial shows you how to implement communication between L1 and L2 with the following example:

- A **governance** smart contract is deployed on layer 1. This contract has a function that can request a transaction on zkSync layer 2.
- A **counter** smart contract is deployed on zkSync layer 2. The contract stores a number that can be incremented by calling the `increment` method. The goverance contract on layer 1 calls this function.

## Prerequisites

- You are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).
- You already have some experience working with Ethereum.
- You have a web3 wallet app which holds some Goerli test ETH and some zkSync test ETH.
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

:::info
This tutorial was recently tested using Node v16.16.0.
:::

## Project structure

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

2. Initialize the project:

::: code-tabs
@tab npm
```sh
npm init -y
```
@tab yarn
```sh
yarn init -y
```
:::

3. Install hardhat:

::: code-tabs
@tab npm
```sh
npm install --save-dev hardhat
```
@tab yarn
```sh
yarn add --dev hardhat
```
:::

4. Run the following to set up the project:

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

::: code-tabs
@tab npm
```sh
npm i @nomiclabs/hardhat-waffle @openzeppelin/contracts @matterlabs/zksync-contracts
```
@tab yarn
```sh
yarn add -D @nomiclabs/hardhat-waffle @openzeppelin/contracts @matterlabs/zksync-contracts
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

1. Create the file `L1-Governance/goerli.json` and copy/paste the code below, filling in the relevant values. Find node provider urls [here](https://chainlist.org/chain/5).

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

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. From the `L1-governance` folder root, compile and deploy the contract:

::: code-tabs
@tab npm
```sh
# compile contract
npx hardhat compile

# deploy contract
npx hardhat run --network goerli ./scripts/deploy.ts
```
@tab yarn
```sh
# compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts
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
@tab npm
```sh
npm init -y
```
@tab yarn
```sh
yarn init -y
```
:::

2. Install the dependencies:

::: code-tabs
@tab npm
```sh
npm i typescript ts-node ethers@^5.7.2 zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```
@tab yarn
```sh
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```
:::

::: tip
- With `npm` you can also use the zkSync CLI to scaffold a project automatically. 
- Find [more info about the zkSync CLI here](../../api/tools/zksync-cli/).
:::

3. Create the `hardhat.config.ts` file in the root and add the following code, replacing `goerli` with the RPC URL as used in the `goerli.json` file in the L1 Governance section:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.8",
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
    version: "0.8.13",
  },
};
```

::: info
If your default network is not `hardhat`, make sure to include `zksync: true` in its config, too.
:::

### Create L2 counter contract

1. Create a `contracts/` folder and create a new file `Counter.sol`. 

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
@tab npm
```sh
npx hardhat compile
```
@tab yarn
```sh
yarn hardhat compile
```
:::

### Deploy L2 counter contract

1. From the `L2-counter/` folder, create a folder `deploy`, and copy/paste the following code into `deploy/deploy.ts`, replacing `<GOVERNANCE-ADDRESS>` with the address of the Governance contract we just deployed, and `<WALLET-PRIVATE-KEY>` with your private key:

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

2. Now deploy the contract from the `L2-counter/` folder root to zkSync:

::: code-tabs
@tab npm
```sh
npx hardhat deploy-zksync
```
@tab yarn
```sh
yarn hardhat deploy-zksync
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
import { Contract, Provider } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER CONTRACT ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://testnet.era.zksync.dev");

  const counterContract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counterContract.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

5. Run the script:

::: code-tabs
@tab npm
```sh
npx ts-node ./scripts/display-value.ts
```
@tab yarn
```sh
yarn ts-node ./scripts/display-value.ts
```
:::

The output should be:

```txt
The counter value is 0
```

## Call L2 contract from L1 -> this section is currently being updated

:::warning
The script below is currently being fixed. 
:::

Now, let's call the `increment` method from layer 1. 

1. Copy the `abi` array from the compilation artifact located at:

`/L1-governance/artifacts/contracts/Governance.sol/Governance.json`.

2. Paste it into a new file: `/L2-counter/scripts/governance.json`.

3. Create the `L2-counter/scripts/increment-counter.ts` file and paste in the following code, replacing the details as before:

```ts
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { Provider, utils } from "zksync-web3";
const COUNTER_ABI = require("./counter.json");
const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";

async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet, the same one as the one that deployed the governance contract
  const wallet = new ethers.Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  // Initializing the L2 provider
  const l2Provider = new Provider("https://testnet.era.zksync.dev");
  // Getting the current address of the zkSync L1 bridge
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);

  // Encoding L2 transaction is the same way it is done on Ethereum.
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

  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, gasLimit, utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 tx is complete.
  await tx.wait();

  // Getting the TransactionResponse object for the L2 transaction corresponding to the execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract
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
@tab npm
```sh
npx ts-node ./scripts/increment-counter.ts
```
@tab yarn
```sh
yarn ts-node ./scripts/increment-counter.ts
```
:::

In the output, you should see the full transaction receipt in L2. You can take the `transactionHash` and track it in the [zkSync explorer](https://explorer.zksync.io/).

5. After that, you can verify that the transaction was indeed successful by running the `display-value` script again:

```
npx ts-node ./scripts/display-value.ts
```

The counter in the L2 contract should have increased after the transaction so output should be:

```
The counter value is 1
```

<!--
## Complete project

You can download the complete project [here](https://github.com/matter-labs/cross-chain-tutorial).-->

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](../developer-guides/bridging/l1-l2.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../api/hardhat).
