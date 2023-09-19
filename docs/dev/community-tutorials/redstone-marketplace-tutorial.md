---
head:
  - - meta
    - name: "twitter:title"
      content: Redstone zkSync Marketplace Tutorial | zkSync Era Docs
---

# RedStone Oracles on zkSync

By the end of this tutorial you will understand how to integrate your dApp built on zkSync with RedStone oracles.

## Example dApp - Stable price NFT marketplace

This repo is designed to show how to build a dApp that uses [RedStone oracles](https://redstone.finance/) on [zkSync](https://zksync.io/).

The repo contains an implementation of an NFT marketplace dApp with so-called "stable" price. It means that sellers can create sell orders (offers), specifying the price amount in USD. But buyers are able to pay with native coins, the required amount of which is calculated dynamically at the moment of the order execution. Repo lacks few crucial parts which will demonstrate how to integrate RedStone oracles and deploy dApp on zkSync Era Testnet.

## 🧑‍💻 Implementation

We use [hardhat](https://hardhat.org/), version prepared for working on [zkSync](https://github.com/matter-labs/hardhat-zksync), and [ethers.js](https://docs.ethers.io/v5/) for deployment scripts and contract tests. Frontend is implemented in [React](https://reactjs.org/).

### Code structure

```bash
├── contracts                   # Solidity contracts
│   ├── ExampleNFT.sol          # Example ERC721 contract
│   ├── Marketplace.sol         # Simple NFT marketplace contract
│   ├── StableMarketplace.sol   # NFT marketplace contract with stable price
│   └── ...
├── public                      # Folder with public html files and images for React app
├── deploy                      # Contract deployment script
├── src                         # React app source code
│   ├── components
│   │   ├── App.tsx             # Main React component
│   ├── core
│   │   ├── blockchain.ts       # TS module responsible for interaction with blockchain and contracts
│   ├── config/                 # Folder with contract ABIs and deployed contract addresses
│   └── ...
├── test                        # Contract tests
└── ...
```

### Contracts

#### ExampleNFT.sol

`ExampleNFT` is a simple ERC721 contract with automated sequential token id assignment

```js
function mint() external {
    _mint(msg.sender, nextTokenId);
    nextTokenId++;
}
```

This contract extends `ERC721Enumerable` implementation created by the `@openzeppelin` team, which adds view functions for listing all tokens and tokens owned by a user.

#### Marketplace.sol

`Marketplace` is an NFT marketplace contract, which allows to post sell orders for any NFT token that follows [EIP-721 non-fungible token standard](https://eips.ethereum.org/EIPS/eip-721). It has the following functions:

```js

// Created a new sell order
// This function requires approval for transfer on the specified NFT token
function postSellOrder(address nftContractAddress, uint256 tokenId, uint256 price) external {}

// Only order creator can call this function
function cancelOrder(uint256 orderId) external {}

// Allows to get info about all orders (including canceled, and executed ones)
function getAllOrders() public view returns (SellOrder[] memory) {}

// Returns expected price in ETH for the given order
function getPrice(uint256 orderId) public view returns (uint256) {}

// Requires sending at least the minimal amount of ETH
function buy(uint256 orderId) external payable {}

```

The implementation is quite straightforward, so we won't describe it here. You can check the full contract code in the [contracts/Marketplace.sol.](contracts/Marketplace.sol)

#### StableMarketplace.sol

`StableMarketplace` is the marketplace contract with the stable price support. It extends the `Marketplace.sol` implementation and only overrides its `_getPriceFromOrder` function.
This contract will integrate RedStone oracles functionalities and will be described later.

### Frontend

You can check the code of the React app in the `src` folder. We tried to simplify it as much as possible and leave only the core marketplace functions.

The main UI logic is located in the `App.tsx` file, and the contract interaction logic is in the `blockchain.ts` file.

If you take a look into the `blockchain.ts` file code, you'll notice that each contract call that needs to process RedStone data is made on a contract instance, that was wrapped by [@redstone-finance/evm-connector](https://www.npmjs.com/package/@redstone-finance/evm-connector).

### Tests

We've used hardhat test framework to contract tests. All the tests are located in the [test](test/) folder.

## 🔥 Tutorial how to integrate RedStone oracles on zkSync

### Prepare repo

#### 1. Clone this repo

```sh
git clone https://github.com/zkSync-Community-Hub/tutorials
cd tutorials/tutorials/zkSync-RedStone-stable-price-marketplace-tutorial
```

#### 2. Install dependencies

```sh
yarn install
```

#### 3. Run local zkSync node

You can run zkSync node in dockerized setup by following instructions presented [here](https://era.zksync.io/docs/tools/testing/dockerized-testing.html)

### Get familiar with the code

If you are not familiar with the code yet, please read [implementation description](#🧑‍💻-implementation)

### Integrate with RedStone Oracles

Now it is time to integrate RedStone Oracles into the marketplace. As you maybe noticed some parts of the code are missing the implementation. Let me give you instructions on how to integrate RedStone oracles.

#### 1. Adjust smart contract

First, we need to modify contracts as currently, they are not ready to receive transactions with RedStone data regarding price. If you are not familiar with our core model please read [how to adjust your smart contracts](#1-adjust-your-smart-contracts). Take a look at the StableMarketplace contract. It is the marketplace contract with stable price support. It extends the `Marketplace.sol` implementation and only overrides its `_getPriceFromOrder` function. The contract should be extended by MainDemoConsumerBase which is imported from [@redstone-finance/evm-connector](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector). The `_getPriceFromOrder` function should use the `getOracleNumericValueFromTxMsg` function to get price data and calculate the final price based on the order price and the price of ETH. Full implementation can be seen below:

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";
import "./Marketplace.sol";

/*
  StableMarketplace contract should extend MainDemoConsumerBase contract
  For being able to use redstone oracles data, more inf:
  https://docs.redstone.finance/docs/smart-contract-devs/get-started/redstone-core#1-adjust-your-smart-contracts
*/
contract StableMarketplace is Marketplace, MainDemoConsumerBase {
  /*
    `_getPriceFromOrder` function should uses the `getOracleNumericValueFromTxMsg` function,
    which fetches signed data from tx calldata and verifies its signature
  */
  function _getPriceFromOrder(
    SellOrder memory order
  ) internal view override returns (uint256) {
    uint256 ethPrice = getOracleNumericValueFromTxMsg(bytes32("ETH"));
    return (order.price / ethPrice) * (10 ** 8);
  }
}
```

#### 2. Adjust dApp TypeScript code

The second thing to do is adjust the Typescript code of the dApp. Please take a look at the `blockchain.ts` file. Here you can find all functions required to make the marketplace work. But the function `buy` is not implemented. Here we will call the function from the contracts which require price data. To make it possible we need to wrap the contract instance with the [RedStone framework](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector). If you are not familiar with our core model please read how to [adjust Typescript code](#2-adjust-javascript-code-of-your-dapp). After wrapping the contract we will be able to call the `getPrice` function from the `StableMarketplace` contract which eventually will call overridden `_getPriceFromOrder`. Now we are able to call the `buy` function from the `StableMarketplace` contract with the expected ETH amount to buy the NFT. Full implementation can be seen below:

```js
import { WrapperBuilder } from "@redstone-finance/evm-connector";

async function buy(orderId: string) {
  const marketplace = await getContractInstance("marketplace");

  // Wrapping marketplace contract instance.
  // It enables fetching data from redstone data pool
  // for each contract function call
  try {
    const wrappedMarketplaceContract = WrapperBuilder.wrap(marketplace).usingDataService({
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["ETH"],
    });

    // Checking expected amount
    const expectedEthAmount = await wrappedMarketplaceContract.getPrice(orderId);

    // Sending buy tx
    const buyTx = await wrappedMarketplaceContract.buy(orderId, {
      value: expectedEthAmount.mul(101).div(100), // a buffer for price movements
    });
    await buyTx.wait();

    return buyTx;
  } catch {
    const errText = "Error happened while buying the NFT";
    alert(errText);
  }
}
```

### Test dApp locally

#### 1. Check if tests pass

Tests work only when integration with RedStone oracles is ready

```sh
yarn test
```

#### 2. Compile contracts

```sh
yarn compile
```

#### 3. Deploy contracts on local blockchain

You need to populate .env file with private key for deployment e.g.

```
WALLET_PRIVATE_KEY=0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
```

and then run

```sh
yarn deploy:local
```

#### 4. Run react app

```sh
yarn app:start
```

The app should be running on <http://localhost:3000>

#### 3. Configure metamask

##### 3.1 Add local hardhat network to metamask

Select `Networks dropdown` -> `Add network` and enter the following details:
**Network Name**|**hardhat-local**
:-----:|:-----:
New RPC URL|<http://localhost:3050>
Chain ID|270
Currency Symbol|ETH

Then hit the `Save` button.

##### 3.2 Add local wallets to metamask

- `User 1`: `0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3`
- `User 2`: `0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e`

#### 4. Explore the app in browser

<img alt="stable-marketplace-app" src="docs/img/stable-marketplace-app.png" width="800" />

##### Mint NFTs

After visiting the app first time you will see an almost empty screen with the `+ Mint new NFT` link. Click this link to mint new NFTs. After the minting transaction confirmation you will see your NFT in the left column.

<img alt="my-nfts" src="docs/img/my-nfts.png" width="300" />

##### Post sell orders

Once you mint any NFTs, you can post sell order for each one of them. Click the SELL button and provide the USD value. You will be asked to confirm 2 transactions: for NFT transfer approval, and for the marketplace order creation. After their confirmation, you will see your order in the Orders column.

<img alt="orders" src="docs/img/orders.png" width="300" />

##### Buy NFTs

You can also switch metamask account and buy the NFT. I would recommend to open the developer tools in browser at the network tab and explore network requests that are being sent before the buy transaction sending.

You should see at least 2 requests with the ETH price data and crypto signatures. This data along with signatures is being attached for each contract call, that wants to process redstone oracles data.

<img alt="redstone-requests" src="docs/img/redstone-requests.png" width="800" />

## 🚀 What is RedStone?

RedStone is a data ecosystem that delivers frequently updated, reliable and diverse data for your dApps and smart contracts.

RedStone offers a radically different design of Oracles catering to the needs of modern DeFi protocols.

- Data providers can avoid the requirement of continuous on-chain data delivery
- Allow end users to self-deliver signed Oracle data on-chain
- Use the decentralized Streamr network to deliver signed oracle data to the end users
- Use token incentives to motivate data providers to maintain data integrity and uninterrupted service
- Leverage the Arweave blockchain as cheap and permanent storage for archiving Oracle data and maintaining data providers' accountability

To learn more about RedStone oracles design check out the [RedStone docs.](https://docs.redstone.finance/docs/introduction)

## 🗝️ Key facts

- The [modular architecture](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works#data-flow) maintains [data integrity](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works#data-format) from source to smart contracts
- There are [3 different ways](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works#3-ways-to-integrate) to integrate our service tailored to your needs
- We provide feeds for more than [1000 assets](https://app.redstone.finance/#/app/tokens) integrating [~50 data sources](https://app.redstone.finance/#/app/sources)
- We are present on [20+ chains](https://showroom.redstone.finance/)
- RedStone has been live on mainnets since March 2022 with no downtime. Code was audited by ABDK, Packshield and L2Beat Co-Founder.
- RedStone was a launch partner for [DeltaPrime](https://deltaprime.io/) on Avalanche and delivered data feeds not available anywhere else. Thanks to that DeltaPrime became the top 3 fastest growing dApps according to DeFiLama.

## 📈 What data is available

Thanks to our innovative architecture, we offer more than one thousand of pricing data feeds, including tokens, stocks, ETFs, commodities, and much more for a fraction of regular Oracles integration costs.

You can check available assets and data providers using [app.redstone.finance.](https://app.redstone.finance/)

## 🔥 How to use RedStone?

**IMPORTANT**: Please reach out to the RedStone team [on Discord](https://redstone.finance/discord) before using RedStone oracles in production dApps. We will be happy to help you with the integration and will set up a new pool of data provider nodes if there is a need.

### Installation

Install [@redstone-finance/evm-connector](https://www.npmjs.com/package/@redstone-finance/evm-connector) from NPM registry

```bash
# Using yarn
yarn add @redstone-finance/evm-connector

# Using NPM
npm install @redstone-finance/evm-connector
```

### Usage

TLDR; You need to do 2 things:

1. [Adjust your smart contracts](#1-adjust-your-smart-contracts)
2. [Adjust Javascript code of your dApp](#2-adjust-javascript-code-of-your-dapp) (**it is required**, otherwise you will get smart contract errors)

💡 Note: Please don't use Remix to test RedStone oracles, as Remix does not support modifying transactions in the way that the evm-connector does.

### 1. Adjust your smart contracts

You need to apply a minimum change to the source code to enable smart contract to access data. Your contract needs to extend one of our custom base contracts, which can be found [here.](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector/contracts/data-services)

We strongly recommend having some upgradeability mechanism for your contracts (it can be based on multisig, DAO, or anything else). This way, you can quickly switch to the latest trusted data providers in case of changes or problems with the current providers.

```js
import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

contract YourContractName is MainDemoConsumerBase {
  ...
}
```

After applying the mentioned change you will be able to access the data calling the local `getOracleNumericValueFromTxMsg` function. You should pass the data feed id converted to `bytes32`.

```js
// Getting a single value
uint256 ethPrice = getOracleNumericValueFromTxMsg(bytes32("ETH"));

// Getting several values
bytes32[] memory dataFeedIds = new bytes32[](2);
dataFeedIds[0] = bytes32("ETH");
dataFeedIds[1] = bytes32("BTC");
uint256[] memory values = getOracleNumericValuesFromTxMsg(dataFeedIds);
uint256 ethPrice = values[0];
uint256 btcPrice = values[1];
```

You can see all available data feeds [in our web app.](https://app.redstone.finance)

### 2. Adjust Javascript code of your dApp

You should also update the code responsible for submitting transactions. If you're using [ethers.js](https://github.com/ethers-io/ethers.js/), we've prepared a dedicated library to make the transition seamless.

#### Contract object wrapping

First, you need to import the wrapper code to your project

```ts
// Typescript
import { WrapperBuilder } from "@redstone-finance/evm-connector";

// Javascript
const { WrapperBuilder } = require("@redstone-finance/evm-connector");
```

Then you can wrap your ethers contract pointing to the selected [Redstone data service id.](https://api.redstone.finance/providers) You should also specify a number of unique signers, data feed identifiers, and (optionally) URLs for the redstone cache nodes.

```js
const yourEthersContract = new ethers.Contract(address, abi, provider);

// Connecting all provider's prices (consumes more GAS)
const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
  dataServiceId: "redstone-main-demo",
  uniqueSignersCount: 1,
  dataFeeds: ["ETH", "BTC"],
});
```

Now you can access any of the contract's methods in exactly the same way as interacting with the ethers-js code:

```js
wrappedContract.executeYourMethod();
```

#### Mock provider

If you'd like to use the wrapper in a test context, we recommend using a mock wrapper so that you can easily override the oracles values to test different scenarios. To use the mock wrapper just use the `usingMockData(signedDataPackages)` function instead of the `usingDataService` function. You can see examples of the mock wrapper usage [here.](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/evm-connector/test/mock-wrapper)

You can find more information in the [RedStone documentation](https://docs.redstone.finance/docs/smart-contract-devs/getting-started) to learn how to integrate your zkSync dApp with RedStone oracles.

## 🌎 Useful links

- [Repo with examples](https://github.com/redstone-finance/redstone-evm-examples)
- [RedStone Documentation](https://docs.redstone.finance/)
- [RedStone Price Feeds](https://docs.redstone.finance/docs/smart-contract-devs/price-feeds)
- [Data from any URL](https://docs.redstone.finance/docs/smart-contract-devs/custom-urls)
- [NFT Data Feeds](https://docs.redstone.finance/docs/smart-contract-devs/nft-data-feeds)
- [Randomness](https://docs.redstone.finance/docs/smart-contract-devs/randomness)

## 🙋‍♂️ Need help?

Please feel free to contact the RedStone team [on Discord](https://redstone.finance/discord) if you have any questions.
