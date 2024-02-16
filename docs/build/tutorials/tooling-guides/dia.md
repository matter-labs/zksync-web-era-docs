---
head:
  - - meta
    - name: "twitter:title"
      content: DIA | zkSync Docs
---

# DIA

In this guide, we'll create a simple contract that interacts with a DIA Oracle for decentralized price feeds on zkSync Testnet.

DIA’s data and oracle infrastructure provides dApps on zkSync Era’s ecosystem with access to price feeds of over [3,000+ digital assets](https://app.diadata.org/price) and [18,000+ NFT collections](https://app.diadata.org/floor-price). Additionally, DIA offers access to distributed and verifiable [Random Number Generation — RNG](https://docs.diadata.org/products/randomness-oracle), Liquid Staked Tokens — LSTs price feeds, as well as a range of lending rates, foreign exchange rates, and other data feeds. With this wide range of data feeds, zkSync Era protocols can support a wider range of applications beyond just DeFi and NFTfi.

For our purposes, we'll make use of their token price feeds to fetch live [ETH/USD](https://market.api3.org/dapis/zksync-goerli-testnet/ETH-USD) rates.

**Data Feed Addresses:**

<table><thead><tr><th width="272">Contract</th><th width="212.33333333333331">Update Frequency</th><th>Network</th></tr></thead><tbody><tr><td><a href="https://explorer.zksync.io/address/0x8569B6695B25F9Ce9A0beDA29231eE6f2fDd3997">Price Feed</a> </td><td>2 hr</td><td>zkSync Era </td></tr><tr><td><a href="https://goerli.explorer.zksync.io/address/0x294838c2399950Ab91a74F9E35213aD417761FB5">Price Feed</a></td><td>1 hr</td><td>zkSync Testnet</td></tr></tbody></table>

:::warning
DIA demo oracles are not intended for use in production environments. Developers can request a dedicated, production-ready oracle with custom price feeds and configuration settings. Start the request process: [Request a Custom Oracle | DIA Documentation](https://docs.diadata.org/introduction/intro-to-dia-oracles/request-an-oracle).
:::

### Prerequisites

- **Knowledge Base**: Familiarity with deploying smart contracts.
- **Wallet Setup**: Have MetaMask installed and set up, ensuring there's a balance on the zkSync Testnet.
- **Tooling**: This guide utilizes [`zksync-cli`](../../tooling/zksync-cli/getting-started.md). Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding the **DIAOracle contract**

The DIAOracle contract is designed to retrieve and store the latest price information of a specified asset (e.g., ETH/USD) using an external oracle. The contract has functions to fetch the price and its timestamp and to verify how recent the fetched price is.

**Key components:**

- **ORACLE**: A constant (immutable) address pointing to the oracle service that the contract uses to get the price information. This is set to [`0x294838c2399950Ab91a74F9E35213aD417761FB5`](https://goerli.explorer.zksync.io/address/0x294838c2399950Ab91a74F9E35213aD417761FB5).
- **latestPrice**: A public state variable storing the latest fetched price of the asset.
- **timestampOflatestPrice**: A public state variable storing the timestamp when the latest price was updated.
- **getPriceInfo**: A function that fetches the latest price and the timestamp of the specified asset from the DIA oracle. The fetched values are stored in the contract's state variables.
  - **key**: A string specifying the asset (like "ETH/USD"). This parameter directs the oracle to fetch the price of the specified asset.
- **checkPriceAge**: This is a view function, meaning it doesn't modify the contract's state. It checks whether the saved price's timestamp is within an acceptable range. If the latest price was updated too long ago (based on a specified threshold), the function returns `false`.
  - **maxTimePassed**: This parameter defines the maximum acceptable duration since the last price update. If the latest price was updated more recently than this duration, the function returns `true`; otherwise, it returns `false`.

### Step 2 — Environment setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

`npx zksync-cli create DIAOracle`

Choose `Hardhat + Solidity` to setup the project repository.

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance.

### Step 3 - Implementing contracts

Create a `DIAOracle.sol` contract in the `/contracts` directory. Populate the file with the provided code:

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

interface IDIAOracleV2{
    function getValue(string memory) external returns (uint128, uint128);
}

/**
* @title A sample contract showing how DIA oracles can be used in contracts.
*/
contract DIAOracle{
    address immutable ORACLE = 0x294838c2399950Ab91a74F9E35213aD417761FB5;
    uint128 public latestPrice;
    uint128 public timestampOflatestPrice;

    /**
    * @dev A function that retrieves the price and the corresponding timestamp
    * from the DIA oracle and saves them in storage variables.
    * @param key - A string specifying the asset.
    */
    function getPriceInfo(string memory key) external {
        (latestPrice, timestampOflatestPrice) = IDIAOracleV2(ORACLE).getValue(key);
    }

    /**
    * @dev A function that checks if the timestamp of the saved price
    * is older than maxTimePassed.
    * @param maxTimePassed - The max acceptable amount of time passed since the
    * oracle price was last updated.
    * @return inTime - A bool hat will be true if the price was updated
    * at most maxTimePassed seconds ago, otherwise false.
    */
    function checkPriceAge(uint128 maxTimePassed) external view returns (bool inTime){
         if((block.timestamp - timestampOflatestPrice) < maxTimePassed){
             inTime = true;
         } else {
             inTime = false;
         }
    }
}
```

### Step 4 — Deploy the contract

Create a new file under `/deploy`, for example `deploy-oracle.ts`. Insert the provided script:

The deployment script

```typescript
import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

// Deploy script for the DIAOracle contract
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the DIAOracle contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("DIAOracle");

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, []);

  // Deploy this contract.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const diaOracleContract = await deployer.deploy(artifact, []);

  // Show the contract info.
  const contractAddress = diaOracleContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

The provided script will deploy the `DIAOracle.sol` contract to zkSync Testnet. Ensure you have sufficient funds in the deployer wallet.

Compile the contract:

```bash
yarn hardhat compile
```

Once compiled, deploy using:

```bash
yarn hardhat deploy-zksync --script deploy-oracle.ts
```

### Step 5 — Interact with contract

To interact with contract, create a new file under `/deploy`, for example `use-oracle.ts`. Insert the provided script:

```typescript
import { Provider } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

import * as ContractArtifact from "../artifacts-zk/contracts/DIAOracle.sol/DIAOracle.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

const CONTRACT_ADDRESS = "DEPLOYED-CONTRACT-ADDRESS ";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractArtifact.abi, signer);
  console.log(`The contract is ${contract.address}`);
  // Fetch the price of ETH/USD
  const tx = await contract.getPriceInfo("ETH/USD");
  await tx.wait();

  // Fetch and log the latest price of ETH/USD
  const rawPrice = await contract.latestPrice();
  console.log(`The price of ETH/USD is ${rawPrice}`);

  // Fetch and log the timestamp of the latest price
  const timestamp = await contract.timestampOflatestPrice();
  const date = new Date(timestamp * 1000);
  console.log(`The price of ETH/USD was last updated on ${date.toLocaleString()}`);
}
```

Update the script to provide the deployed contract address from the previous step:

```typescript
const CONTRACT_ADDRESS = "DEPLOYED-CONTRACT-ADDRESS ";
```

Run the script:

```bash
yarn hardhat deploy-zksync --script use-oracle.ts
```

### Conclusion

In this guide, we've effectively demonstrated how to make use of the DIA Oracle on zkSync Testnet. Using DIA’s extensive data infrastructure, we set up a contract to access real-time decentralized price feeds that can be used in a variety of use cases!
