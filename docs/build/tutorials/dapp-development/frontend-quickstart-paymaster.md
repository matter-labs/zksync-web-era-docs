---
head:
  - - meta
    - name: "twitter:title"
      content: Frontend quickstart | zkSync Docs
---

# Frontend Quickstart: build your first dApp

::: info

Although this tutorial can be used as a reference to understand how to create frontends to interact with zkSync contracts, this is a continuation of the [Quickstart tutorial](../../quick-start/hello-world.md). Make sure to complete it before continue.

:::

In this tutorial we're going to:

- Create a basic frontend to interact with the contract deployed in [the quickstart tutorial](../../quick-start/hello-world.md).
- Learn about `zksync-ethers` and use it to connect to zkSync and interact with our contract.
- Learn about paymasters.
- Integrate a paymaster in our frontend to allow users to pay transaction fees in any ERC20 token.

## Prerequisites

- Download and install [Node.js](https://nodejs.org/en/download).
- Use the `yarn` or `npm` package manager. We recommend using `yarn`. To install `yarn`, follow the [Yarn installation guide](https://yarnpkg.com/getting-started/install).
- Get some ERC20 tokens. The easiest way is to [mint TEST tokens](https://sepolia.explorer.zksync.io/address/0x7E2026D8f35872923F5459BbEDDB809F6aCEfEB3#contract) directly in our explorer. You can also get Sepolia USDC or DAI from [the Aave faucet](https://staging.aave.com/faucet/) and then bridge them to zkSync using [the zkSync bridge](https://portal.zksync.io/bridge/?network=sepolia).

## Setup the project

We're going use the [Vue.js web framework](https://vuejs.org/) to build this app although the process is similar with other frameworks like [React](https://react.dev/). In addition, we're going to use the `zksync-ethers` SDK, which extends `ethers` with zksync-specific features. In order to focus on `zksync-ethers`, we provide a prebuilt template project with most of the frontend code. We'll just need to implement the methods to interact with the smart contracts. Let's start!

1. Clone the template project and `cd` into the folder.

```sh
git clone https://github.com/matter-labs/tutorials
cd tutorials/hello-world/frontend
```

2. Spin up the project.

```bash
yarn
yarn serve
```

Navigate to `http://localhost:8080/` in a browser to see the application running.

## Project Structure

We'll only work in the `<script>` section of the `./src/App.vue` file. Some methods are already provided while other have to be implemented. We'll go through these ones one by one:

```javascript
methods: {
  initializeProviderAndSigner() {
    // TODO: initialize provider and signer based on `window.ethereum`
  },

  async getGreeting() {
    // TODO: return the current greeting
    return "";
  },

  async getFee() {
    // TODO: return formatted fee
    return "";
  },

  async getBalance() {
    // Return formatted balance
    return "";
  },
  async getOverrides() {
    if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
      // TODO: Return data for the paymaster
    }

    return {};
  },
...
```

Beneath the `<script>` tag, there are placeholder variables for the address of your deployed `Greeter` contract, `GREETER_CONTRACT_ADDRESS`, and the path to its ABI, `GREETER_CONTRACT_ABI`.

```javascript
<script>
// eslint-disable-next-line
const GREETER_CONTRACT_ADDRESS = ""; // TODO: insert the Greeter contract address here
// eslint-disable-next-line
const GREETER_CONTRACT_ABI = []; // TODO: Complete and import the ABI
```

## Install zksync-ethers

1. From the `hello-world/frontend` root directoy, install the `zksync-ethers` library by running the following command in your terminal:

::: code-tabs

@tab:active yarn

```bash
yarn add ethers zksync-ethers
```

@tab npm

```bash
npm install zksync-ethers
```

:::

1. Add the library imports under at the top of the `./src/App.vue` file.

```ts
import {} from "zksync-ethers";
import {} from "ethers";

const GREETER_CONTRACT_ADDRESS = ""; // TODO: insert the Greeter contract address here
import * as GREETER_CONTRACT_ABI from "./abi.json"; // TODO: Complete and import the ABI
```

## Add the Contract Info

:::tip

- To interact with a smart contract deployed to zkSync, we need its ABI.
- ABI stands for Application Binary Interface and it's a JSON which describes the contract's variables and methods.

:::

1. Locate the `./src/abi.json` file. It already contains information but it's better to use the one you created instead; just in case you added new methods.

2. Copy/paste the contract's ABI from the `./artifacts-zk/contracts/Greeter.sol/Greeter.json` file in the Hardhat project from the [Quickstart tutorial](../../quick-start/hello-world.md), into `abi.json` replacing the existing one. The file should look something like this:

```json
[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

1. The `GREETER_CONTRACT_ABI` variable already imports the `abi.json` file so there's nothing else you need to do:

```ts
import * as GREETER_CONTRACT_ABI from "./abi.json"; // TODO: Complete and import the ABI
```

## Initialise Provider and Signer

1. Go to the `initializeProviderAndSigner` function in `./src/App.vue`. This function is called after the connection to Metamask is successful.

In this function we should:

- Initialize a `BrowserProvider` and a `Signer` to interact with zkSync.
- Initialize the `Contract` object to interact with the `Greeter` contract we just deployed.

2. Import the necessary classes from `zksync-ethers` in the imports we added previously:

```javascript
import { Contract, BrowserProvider, Provider } from "zksync-ethers";
```

3. Initialise the provider, signer, and contract instances like this:

```javascript
initializeProviderAndSigner() {
    this.provider = new Provider('https://sepolia.era.zksync.dev');
    // Note that we still need to get the Metamask signer
    this.signer = (new Web3Provider(window.ethereum)).getSigner();
    this.contract = new Contract(
        GREETER_CONTRACT_ADDRESS,
        GREETER_CONTRACT_ABI,
        this.signer
    );
},
```

## Retrieve the Greeting

Fill in the function to retrieve the greeting from the smart contract:

```javascript
async getGreeting() {
    // Smart contract calls work the same way as in `ethers`
    return await this.contract.greet();
},
```

After connecting the Metamask wallet to zkSync Era Testnet, you should see the following page:

!['Retrieve message from contract'](../../../assets/images/start-1.png)

The **Select token** dropdown menu allows you to choose which token to pay fees with. We'll enable this feature later.

## Check Balance and Estimate Fee

The easiest way to retrieve the user's balance is to use the `Signer.getBalance` function.

1. Add the following dependencies to the same place you added imports before:

```javascript
// `ethers` is only used in this tutorial for its utility functions
import { ethers } from "ethers";
```

2. Implement the `getBalance()` function as shown below:

```javascript
async getBalance() {
    // Getting the balance for the signer in the selected token
    const balanceInUnits = await this.signer.getBalance(this.selectedToken.l2Address);
    // To display the number of tokens in the human-readable format, we need to format them,
    // e.g. if balanceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
    return ethers.utils.formatUnits(balanceInUnits, this.selectedToken.decimals);
},
```

1. Implement the `getFee()` method that will estimate how much will it cost to update the message in the `Greeter.sol` contract calling the `setGreeting` method:

```javascript
async getFee() {
    // Getting the amount of gas (gas) needed for one transaction
    const feeInGas = await this.contract.estimateGas.setGreeting(this.newGreeting);
    // Getting the gas price per one erg. For now, it is the same for all tokens.
    const gasPriceInUnits = await this.provider.getGasPrice();

    // To display the number of tokens in the human-readable format, we need to format them,
    // e.g. if feeInGas*gasPriceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
    return ethers.utils.formatUnits(feeInGas.mul(gasPriceInUnits), this.selectedToken.decimals);
},
```

Now, when you select the token to pay the fee, both the account balance and the expected fee for the transaction will be displayed.

Click **Refresh** to recalculate the fee. Note that the fee depends on the length of the message that we want to store in the contract.

It is possible to also click on the **Change greeting** button, but nothing will happen yet as we haven't implemented the function. Let's implement that next.

![Estimate transaction fee](../../../assets/images/start-2.png)

## Update the Greeting

Update the function in `./src/App.vue` with the following code:

```javascript
async changeGreeting() {
    this.txStatus = 1;
    try {
        const txHandle = await this.contract.setGreeting(this.newGreeting, await this.getOverrides());

        this.txStatus = 2;

        // Wait until the transaction is committed
        await txHandle.wait();
        this.txStatus = 3;

        // Update greeting
        this.greeting = await this.getGreeting();

        this.retreivingFee = true;
        this.retreivingBalance = true;
        // Update balance and fee
        this.currentBalance = await this.getBalance();
        this.currentFee = await this.getFee();
    } catch (e) {
        alert(JSON.stringify(e));
    }

    this.txStatus = 0;
    this.retreivingFee = false;
    this.retreivingBalance = false;
},
```

Now you can update the greeting message in the contract via a transaction sent with Metamask. You will see the Greeter message change on the app.

Congrats! You now have a fully functional Greeter-dApp! However, it does not yet leverage any zkSync-specific features.

::: warning
Do you see a **wallet_requestPermissions** error?

Refresh your browser, or open the Metamask extension on your browser and click _Next_ or _Cancel_ to resolve it.

Read more about `wallet_requestPermissions`, in the [MetaMask documentation](https://docs.metamask.io/guide/rpc-api.html#wallet-requestpermissions).
:::

## Pay Fees with ERC20 Tokens

zkSync Era has native account abstraction, a feature that allows application developers to integrate [paymasters](../../build/developer-reference/account-abstraction.md#paymasters) that can pay the fees on behalf of the users, or allow fees to be paid with ERC20 tokens.

We will use the [testnet paymaster](../../build/developer-reference/account-abstraction.md#testnet-paymaster) that is provided on all zkSync Era testnets.

:::tip About the testnet paymaster
**The testnet paymaster allows users to pay fees in any ERC20 token with a fixed exchange rate of 1:1 - Token:ETH**, i.e. one unit of the token for one wei of ETH.

This means that transaction fees in tokens with fewer decimals than ETH will be bigger; for example, USDC which has only 6 decimals. This is a known behaviour of the testnet paymaster, which was built for demostration purposes only.

As the name suggests, the testnet paymaster is only available on testnet. When integrating your protocol on mainnet, you should follow the documentation of the paymaster you use, or create your own.

:::

The `getOverrides` function returns an empty object when users decide to pay with Ether but, when users select the ERC20 option, it should return the paymaster address and all the information required by it. This is how to do it:

1. To retrieve the address of the testnet paymaster from the zkSync provider, add the following to the `getOverrides` function:

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    // retrieve the testnet paymaster address
    const testnetPaymaster = await this.provider.getTestnetPaymasterAddress();

    // ..
  }

  return {};
}
```

2. Import `utils` from `zksync-ethers` SDK as we'll need to use some of its methods next:

```javascript
import { Contract, Web3Provider, Provider, utils } from "zksync-ethers";
```

3. We need to calculate how many tokens are required to process the transaction. Since the testnet paymaster exchanges any ERC20 token to ETH at a 1:1 rate, the amount is the same as the ETH amount in wei:

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    const testnetPaymaster = await this.provider.getTestnetPaymasterAddress();

    const gasPrice = await this.provider.getGasPrice();
    // estimate gasLimit via paymaster
    const paramsForFeeEstimation = utils.getPaymasterParams(
          testnetPaymaster,
          {
            type: "ApprovalBased",
            minimalAllowance: ethers.BigNumber.from("1"),
            token: this.selectedToken.l2Address,
            innerInput: new Uint8Array(),
          }
        );

        // estimate gasLimit via paymaster
        const gasLimit = await this.contract.estimateGas.setGreeting(
          this.newGreeting,
          // add paymaster params in transaction overrides
          {
            customData: {
              gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
              paymasterParams: paramsForFeeEstimation,
            },
          }
        );
    // fee calculated in ETH will be the same in
    // ERC20 token using the testnet paymaster
    const fee = gasPrice.mul(gasLimit);

    // ..
  }

  return {};
}
```

4. Now, what is left is to encode the paymasterInput following the [protocol requirements](../../build/developer-reference/account-abstraction.md#testnet-paymaster) and return the needed overrides.

Copy/paste the following complete function:

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    const testnetPaymaster =
      await this.provider.getTestnetPaymasterAddress();

    const gasPrice = await this.provider.getGasPrice();

    // estimate gasLimit via paymaster
    const paramsForFeeEstimation = utils.getPaymasterParams(
      testnetPaymaster,
      {
        type: "ApprovalBased",
        minimalAllowance: ethers.BigNumber.from("1"),
        token: this.selectedToken.l2Address,
        innerInput: new Uint8Array(),
      }
    );

    // estimate gasLimit via paymaster
    const gasLimit = await this.contract.estimateGas.setGreeting(
      this.newGreeting,
      {
        customData: {
          gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
          paymasterParams: paramsForFeeEstimation,
        },
      }
    );

    const fee = gasPrice.mul(gasLimit.toString());

    const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
      type: "ApprovalBased",
      token: this.selectedToken.l2Address,
      // provide estimated fee as allowance
      minimalAllowance: fee,
      // empty bytes as testnet paymaster does not use innerInput
      innerInput: new Uint8Array(),
    });

    return {
      maxFeePerGas: gasPrice,
      maxPriorityFeePerGas: ethers.BigNumber.from(0),
      gasLimit,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    };
  }

  return {};
},
```

The `ApprovalBased` type in the `paymasterParams` indicates that this paymaster allows ERC20 tokens. Behind the scenes, zkSync will take care of approve the ERC20 spending.

5. To use a list of ERC20 tokens, change the following line:

```javascript
const allowedTokens = require("./eth.json");
```

to the following one:

```javascript
const allowedTokens = require("./erc20.json");
```

The `erc20.json` file contains a few tokens like DAI, USDC and wBTC.

## Complete Application

Now you should be able to update the greeting message with ETH or any of the available tokens.

1. Select one of the ERC20 tokens to see the estimated fee:

![img](../../assets/images/start-6.jpeg)

2. Click on the `Change greeting` button to update the message. Since the `paymasterParams` were supplied, the transaction will be an `EIP712` ([more on EIP712 here](https://eips.ethereum.org/EIPS/eip-712)):

![img](../../assets/images/start-4.png)

3. Click "Sign" to send the transaction.

After the transaction is processed, the page updates the balances and the new greeting can be viewed.

**You've paid for this transaction with an ERC20 token using the testnet paymaster** 🎉

## Takeaways

- `zksync-ether` is a Javascript library that extends `ethers` with zksync-specific methods.
- Paymasters allow users to pay transaction fees in ERC20 tokens or gasless.
- Paymasters can be easily integrated in frontend applications by including additional transaction parameters.

## Next steps

- For an overview of security and best practices for developing on zkSync Era, refer to the [Security and best practices page](./best-practices.md).
- To learn more about `zksync-ethers` SDK, check out its [documentation](../../build/sdks/js/zksync-ethers/getting-started.md).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../build/tooling/hardhat/getting-started.md).
