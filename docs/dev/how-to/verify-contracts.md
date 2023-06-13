# Verify Contracts with Hardhat

Contract source-code verification ensures that the code running on-chain matches your published code. 

The verification process validates and authenticates contracts running on a blockchain network, and enhances transparency, security, and trust in your smart contracts.

This document shows you how to verify your contracts with the [`hardhat-zksync-verify`](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify) plugin.

## Common use cases

### Transparent contract deployment

Using the plugin, developers can deploy their contracts on the zkSync Era network with transparency so that users and other developers can independently verify the contract's source code, and ensure it behaves as expected.

### Cross-chain interoperability

For contracts operating across multiple chains, verifying contracts on each network assures users of the contract's consistency across different networks.

### Open source projects

For open-source projects, verifying contracts enhances trust and encourages more developers to contribute. It assures contributors that the deployed contracts match the source code.
  
## Verifying contracts using `hardhat-zksync-verify`

### 1. Install required packages

::: code-tabs
@tab yarn
```bash
yarn add -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```
@tab npm
```bash
npm i -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```
:::

### 2. Configure `hardhat.config.ts`

Add the following code to the `hardhat.config.ts` file. The configuration must include the `verifyURL` property pointing to the zkSync Era network.

```ts
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "@nomiclabs/hardhat-etherscan";

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
        verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'  // Verification endpoint
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.10",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
  },
  // etherscan: { // Optional - If you want to verify a smart contract on Ethereum in the same project
  //   apiKey: //<Your API key for Etherscan>,
  // },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
```

- You can specify an arbitrary zkSync Era network name using the `defaultNetwork` property. 
- Note that the `verifyURL` property points to the verification endpoint for the specific zkSync network.
- Note if you want to verify a smart contract on Ethereum in the same project you will need to include your [Etherscan API key](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics).

### 3. Verify the contract

Run the following command to verify your contract on the specified network, replacing `<contract address>` with your contract's actual address.

```sh
yarn hardhat verify --network <network> <contract address>
```

For example, if you're verifying a contract on the `zkSyncTestnet` network and your contract address is `0x1234abc...`, use:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc...
```

The verification task attempts to compare the compiled bytecode of all the contracts in your local environment with the deployed bytecode of the deployed contract you are seeking to verify. If there is no match, it reports an error.

### 3.1 Verify the contract with fully qualified name

Specify which contract from your local setup you want to verify using the `--contract` parameter and providing its fully qualified name.

```sh
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

A fully qualified name is, for example, `path/sourceName:contractName`. 

For instance, if the source name is `Greeter.sol`, the contract name is `Greeter`, and the contract lives in the `contracts/` directory, the fully qualified contract name is: `contracts/Greeter.sol:Greeter`. 

Here's an example of command using the `--contract` flag:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc... --contract contracts/Greeter.sol:Greeter
```

### 3.2 Verify the contract with constructor arguments

If your contract was deployed with specific constructor arguments, you need to specify them when running the verify task.

```sh
yarn hardhat verify --network testnet <contract address> "<constructor argument>"
```

For example, if you're verifying a contract on the zkSyncTestnet network, your contract address is `0x1234abc...`, and your constructor argument was "Hi there", use:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc... "Hi there"
```

### 3.3 Handle complex lists of constructor arguments

If your contract's constructor includes a complex list of arguments, create a separate JavaScript module to export these arguments. Here's how you can achieve this:

#### 3.3.1 Prepare the JavaScript module with arguments

Start by creating an `arguments.js` file. This file should export an array of arguments that matches the order and types of the arguments in your contract's constructor. 

For example, if your contract constructor has two string values, an address, and an integer, your `arguments.js` might look like this:

```javascript
module.exports = [
    "string argument 1", // string
    "string argument 2", // string
    "0x1234abc...",  // address
    42  // integer
];
```

:::warning
Make sure the order of arguments in this array matches the order of arguments in your contract's constructor.
:::

#### 3.3.2 Verify the contract with the constructor arguments file

Once you have your `arguments.js` file prepared, you can reference it when verifying your contract. The `--constructor-args` parameter allows you to specify a JavaScript module that exports your constructor arguments.

Execute the `verify` command, substituting `<contract address>` with your actual contract address:

```sh
yarn hardhat verify --network zkSyncTestnet <contract address> --constructor-args arguments.js
```

For instance, if your contract address was `0x1234abc...`, you'd use:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc... --constructor-args arguments.js
```

This command verifies the contract on the `zkSyncTestnet` network, using the specific contract address and the constructor arguments defined in the `arguments.js` file. By following this procedure, you can handle contract verification for constructors with complex argument types and arrangements.

### 4. Check verification status

Once you've submitted your contract for verification, you may want to check the status of your request. This can be especially useful in cases where verification may take a long time, or if you wish to verify the successful receipt of your request.

Use the `verify-status` command to check the status of your verification request. Replace `<your verification id>` with the verification ID you received when you submitted your contract for verification.

```sh
yarn hardhat verify-status --verification-id <your verification id>
```

For instance, if your verification ID is `12345`, run the following:

```sh
yarn hardhat verify-status --verification-id 12345
```

This command returns the current status of your verification request. 

:::tip
Depending on the network load and complexity of your contract, the verification process may take some time to complete.
:::

### 5. Verify smart contract programmatically

There may be cases where you need to verify your contracts programmatically, for instance, as part of your project's build or deployment scripts. 

To achieve this, use Hardhat's task runner to call the `verify:verify` task directly from your code. For example:

```typescript
const contractAddress = "<your contract address>";
const contractFullyQualifiedName = "<your contract fully qualified name>";
const constructorArguments = [/* your decoded constructor arguments */];

const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifiedName,
  constructorArguments: constructorArguments
});

console.log(`Verification ID: ${verificationId}`);
```

In this script:

- `contractAddress` is the address of the deployed contract you wish to verify. 
- `contractFullyQualifiedName` is the fully qualified name of your contract (including the path to your Solidity file and contract name, separated by a colon e.g., `"contracts/Greeter.sol:Greeter"`).
- `constructorArguments` is an array containing the arguments used to deploy your contract (e.g. "Hi There").

Once this script runs, it prints the verification ID. If the verification request is successful, you can use this ID to check the status of your verification request. If the request was not successful, the return value and printed ID is `-1`.

Contract verification in zkSync Era ensures the integrity and trustworthiness of your contracts. The [zkSync Era Block Explorer](https://explorer.zksync.io/blocks/) is a manual UI process for doing the same, ideal for occasional use, while the `hardhat-zksync-verify` plugin facilitates an automated, flexible approach for developers.
