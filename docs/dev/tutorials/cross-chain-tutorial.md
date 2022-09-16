# Tutorial: Cross-chain governance

This tutorial serves as an example of how to implement L1 to L2 contract interaction. The following functionality is implemented in this tutorial:

- A "counter" smart contract is deployed on zkSync, which stores a number that can be incremented by calling the `increment` method.
- A governance smart contract is deployed on layer 1, which has the privilege to increment a counter on zkSync.

## Preliminaries

In this tutorial it is assumed that you are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [Hello World](./../developer-guides/hello-world.md) tutorial.

It is also assumed that you already have some experience working with Ethereum.

## L1 governance

To interact with the zkSync bridge contract using Solidity, you need to use the zkSync contract interface. There are two main ways to get it:

- By importing it from the `@matterlabs/zksync-contracts` npm package. (preferred)
- By downloading the contracts from the [repo](https://github.com/matter-labs/v2-testnet-contracts).

The `@matterlabs/zksync-contracts` package can be installed by running the following command:

```
yarn add -D @matterlabs/zksync-contracts
```

The code of the governance contract is the following:

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

This is a very simple governance contract. It sets the creator of the contract as the single governor and can send calls to the zkSync smart contract.

### Deploy with the predefined script

This tutorial does not focus on the process of deploying L1 contracts. To let you quickly proceed with the tutorial, the zkSync team provided a script to deploy the aforementioned smart contract on Görli.

1. Clone the complete tutorial repo:

```
git clone https://github.com/matter-labs/cross-chain-tutorial.git
cd cross-chain-tutorial/deploy-governance
```

2. Open `goerli.json` and fill in the following values there:

- `nodeUrl` should be equal to your Goerli Ethereum node provider URL.
- `deployerPrivateKey` should be equal to the private key of the wallet that will deploy the governance smart contract. It needs to have some ETH on Görli.

2. To deploy the governance smart contract run the following commands:

```
# Installing dependencies
yarn

# Building the governance smart contract
yarn build

# Deploying the governance smart contract
yarn deploy-governance
```

The last command will output the deployed governance smart contract address.

## L2 counter

Now that we have the L1 governance contract address, let's proceed with deploying the counter contract on L2.

The counter contract consists of the following code:

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

The details of the process of deploying smart contracts on zkSync will not be explained in this tutorial. 
If you are new to it, check out the [hello world](./../developer-guides/hello-world.md) tutorial or the documentation for the [hardhat plugins](./../../api/hardhat/getting-started.md) for zkSync.

1. Set up the project and install the dependencies

```
mkdir cross-chain-tutorial
cd cross-chain-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

2. Create the `hardhat.config.ts` file and paste the following code there:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.1.5",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.1.5"
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
    version: "0.8.11",
  },
};
```

If your default network is not `hardhat`, make sure to include `zksync: true` in its config, too.

3. Create the `contracts` and `deploy` folders. The former is the place where all the contracts' `*.sol` files should be stored, and the latter is the place where all the scripts related to deploying the contract will be put.

4. Create the `contracts/Counter.sol` contract and insert the counter's Solidity code provided at the beginning of this section.

5. Compile the contracts with the following command:

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
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
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

7. After replacing `<WALLET-PRIVATE-KEY>` and `<GOVERNANCE-ADDRESS>` with the `0x`-prefixed private key of an Ethereum wallet with some ETH balance on Görli and the address of the L1 governance contract respectively, run the script using the following command:

```
yarn hardhat deploy-zksync
```

In the output, you should see the address to which the contract was deployed.

## Reading the counter value

Let's create a small script for viewing the value of the counter. For the sake of simplicity, let's will keep it in the same folder as the hardhat project, but to keep the tutorial generic hardhat-specific features will not be used in it.

### Getting the ABI of the counter contract

To get the ABI of the counter contract, the user should:

1. Copy the `abi` array from the compilation artifact located at `artifacts/contracts/Counter.sol/Counter.json`.

2. Create the `scripts` folder in the project root.

3. Paste the ABI of the counter contract in the `./scripts/counter.json` file.

4. Create the `./scripts/display-value.ts` file and paste the following code there:

```ts
import { Contract, Provider, Wallet } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const counter = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counter.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

The code is relatively straightforward and is mostly equivalent to how it would work with `ethers`.

After replacing `<COUNTER-ADDRESS>` with the address of the deployed counter contract, run this script by running

```
yarn ts-node ./scripts/display-value.ts
```

The output should be:

```
The counter value is 0
```

## Calling an L2 contract from L1

Now, let's call the `increment` method from layer 1.

1. Create the `scripts/increment-counter.ts` file. There the script to interact with the contract via L1 will be put.
2. To interact with the governance contract, its ABI is needed. For your convenience, you can copy it from [here](https://github.com/matter-labs/cross-chain-tutorial/blob/main/project/scripts/governance.json). Create the `scripts/governance.json` file and paste the ABI there.
3. Paste the following template for the script:

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

4. To interact with the governance smart contract, Ethereum provider and the corresponding `ethers` `Contract` object are needed:

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

5. To interact with the zkSync bridge, its L1 address is needed. While on mainnet you may want to set the address of the zkSync smart contract as an env variable or a constant, it is worth noticing that there is an option to fetch the smart contract address dynamically.

It is a recommended step, especially during the alpha testnet since regenesis may happen.

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

Firstly, the fee depends on the length of the calldata and the `ergsLimit`. If you are new to this concept then it is pretty much the same as the `gasLimit` on Ethereum. You can read more about zkSync fee model [here](./../developer-guides/fee-model.md).

Secondly, the fee depends on the gas price that is used during the transaction call. So to have a predictable fee for the call, the gas price should be fetched explicitly and use the obtained value.

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

Also, there is currently no easy way to estimate the exact number of `ergs` required for execution of an L1->L2 tx. At the time of this writing, the transactions may be processed even if the supplied `ergsLimit` is `0`. This will change in the future.

:::

1. Now it is possible to call the governance contract so that it redirects the call to zkSync:

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

8. The status of the corresponding L2 transaction can also be tracked. After adding a priority request the `NewPriorityRequest(uint64 txId, bytes32 txHash, uint64 expirationBlock, L2CanonicalTransaction transaction, bytes[] factoryDeps);` event is emitted. While the `transaction` is needed by the operator to process the tx, `txHash`
   enables easy tracking of the transaction on zkSync.

`zksync-web3`'s `Provider` has a method that given the L1 `ethers.TransactionResponse` object of a transaction that called the zkSync bridge, returns the `TransactionResponse` object that can conveniently wait for transaction to be processed on L2.

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

In the output, you should see the L2 hash of the transaction.

9. You can now verify that the transaction was indeed successful by running the `display-value` script again:

```
yarn ts-node ./scripts/display-value.ts
```

The output should be:

```
The counter value is 1
```

## Complete project

You can download the complete project [here](https://github.com/matter-labs/cross-chain-tutorial).

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](./../developer-guides/Bridging/l1-l2.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation](./../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](./../../api/hardhat).
