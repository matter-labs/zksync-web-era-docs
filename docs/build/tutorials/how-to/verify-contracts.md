---
head:
  - - meta
    - name: "twitter:title"
      content: Verify Contracts with Hardhat | zkSync Docs
---

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

### 1. Project setup

1. Scaffold a new project by running the command:

```sh
npx zksync-cli create verify-greeter-contract --template hardhat_solidity
```

This creates a new zkSync Era project called `verify-greeter-contract` with a basic `Greeter` contract and all the zkSync plugins and configurations.

2. Proceed by moving into the project directory:

```sh
cd verify-greeter-contract
```

### 2. Package installation for verification

::: code-tabs
@tab yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-verify @nomicfoundation/hardhat-verify
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-verify @nomicfoundation/hardhat-verify
```

:::

### 3. Configuration of `hardhat.config.ts`

Duplicate and insert the following code into the `hardhat.config.ts` file. Ensure the configuration includes the `verifyURL` attribute that points towards the zkSync Era network.

```ts
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

// dynamically alters endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
      }
    : {
        url: "https://sepolia.era.zksync.dev",
        ethNetwork: "sepolia",
        zksync: true,
        verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification", // Verification endpoint
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
  },
  // etherscan: { // Optional - If you plan on verifying a smart contract on Ethereum within the same project
  //   apiKey: //<Your API key for Etherscan>,
  // },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
```

- Feel free to assign an arbitrary zkSync Era network name utilizing the `defaultNetwork` property.
- The `verifyURL` attribute directs to the verification endpoint specific to the zkSync network.
- If you want to verify a smart contract in other supported block explorer you can set `verifyURL` to point to it's verification API URL. For example for [L2scan](https://zksync-era.l2scan.co) on mainnet set `verifyURL` to `https://zksync-era.l2scan.co/api/zksync_contract_verification`.
- If you intend to validate a smart contract on Ethereum within the same project, don't forget to include your [Etherscan API key](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics).

### 4. Greeter contract compilation

The [zkSync CLI](../../tooling/zksync-cli/getting-started.md) provides a `Greeter.sol` contract we will verify on zkSync Era.

Compile the contract using this command:

```sh
yarn hardhat compile
```

### 5. Deploy the Greeter contract

The [zkSync CLI](../../tooling/zksync-cli/getting-started.md) provides a `deploy/deploy-greeter.ts` script that we will use to deploy the Greeter contract.

To configure your private key, copy the `.env.example` file, rename the copy to `.env`, and add your wallet private key.

```text
WALLET_PRIVATE_KEY=YourPrivateKeyHere....
```

Your private key will be used for paying the costs of deploying the smart contract.

Initiate contract deployment using this command:

```sh
yarn hardhat deploy-zksync --script deploy-greeter.ts
```

Expect an output similar to this:

```text
Running the deployment function for the Greeter contract
The deployment is estimated to cost 0.0265726735 ETH
constructor args:0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
The Greeter contract got deployed at 0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72
```

Remember, you need the contract address to verify the contract on zkSync Era.

### 6. Verify the contract

Run the following command to verify your contract on the specified network, replacing `<contract address>` with your deployed contract's address.

```sh
yarn hardhat verify --network <network> <contract address>
```

For example, to verify our Greeter contract on the `zkSyncTestnet` network and our contract address is `0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72`, use:

```sh
yarn hardhat verify --network zkSyncTestnet 0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72 'Hi there!'
```

The verification task attempts to compare the compiled bytecode of all the contracts in your local environment with the deployed bytecode of the deployed contract you are seeking to verify. If there is no match, it reports an error.

### 6.1 Verify the contract with fully qualified name

Specify which contract from your local setup you want to verify using the `--contract` parameter and providing its fully qualified name.

```sh
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

A fully qualified name is, for example, `path/sourceName:contractName`.

For instance, if the source name is `Greeter.sol`, the contract name is `Greeter`, and the contract lives in the `contracts/` directory, the fully qualified contract name is: `contracts/Greeter.sol:Greeter`.

Here's an example of command using the `--contract` flag:

```sh
yarn hardhat verify --network zkSyncTestnet 0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72 'Hi there!' --contract contracts/Greeter.sol:Greeter
```

### 6.2 Verify the contract with constructor arguments

If your contract was deployed with specific constructor arguments, you need to specify them when running the verify task.

```sh
yarn hardhat verify --network testnet <contract address> '<constructor argument>'
```

For example, if you're verifying the Greeter contract on the zkSyncTestnet network, your contract address is `0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72`, and your constructor argument was 'Hi there!', use:

```sh
yarn hardhat verify --network zkSyncTestnet 0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72 'Hi there!'
```

### 6.3 Handle complex lists of constructor arguments

If your contract's constructor includes a complex list of arguments, create a separate JavaScript module to export these arguments. Here's how you can achieve this:

#### 6.3.1 Prepare the JavaScript module with arguments

Start by creating an `arguments.js` file. This file should export an array of arguments that matches the order and types of the arguments in your contract's constructor.

For example, if your contract constructor has two string values, an address, and an integer, your `arguments.js` might look like this:

```javascript
module.exports = [
  "string argument 1", // string
  "string argument 2", // string
  "0x1234abc...", // address
  42, // integer
];
```

:::warning
Make sure the order of arguments in this array matches the order of arguments in your contract's constructor.
:::

#### 6.3.2 Verify the contract with the constructor arguments file

Once you have your `arguments.js` file prepared, you can reference it when verifying your contract. The `--constructor-args` parameter allows you to specify a JavaScript module that exports your constructor arguments.

Execute the `verify` command, substituting `<contract address>` with your actual contract address:

```sh
yarn hardhat verify --network zkSyncTestnet <contract address> --constructor-args arguments.js
```

For instance, if your contract address was `0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72`, you'd use:

```sh
yarn hardhat verify --network zkSyncTestnet 0xE84774C41F096Ba5BafA1439cEE787D9dD1A6b72 --constructor-args arguments.js
```

This command verifies the contract on the `zkSyncTestnet` network, using the specific contract address and the constructor arguments defined in the `arguments.js` file. By following this procedure, you can handle contract verification for constructors with complex argument types and arrangements.

### 7. Check verification status

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

### 8. Verify smart contract programmatically

There may be cases where you need to verify your contracts programmatically, for instance, as part of your project's build or deployment scripts.

To achieve this, use Hardhat's task runner to call the `verify:verify` task directly from your code. For example:

```typescript
const contractAddress = "<your contract address>";
const contractFullyQualifiedName = "<your contract fully qualified name>";
const constructorArguments = [
  /* your decoded constructor arguments */
];

const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifiedName,
  constructorArguments: constructorArguments,
});

console.log(`Verification ID: ${verificationId}`);
```

In this script:

- `contractAddress` is the address of the deployed contract you wish to verify.
- `contractFullyQualifiedName` is the fully qualified name of your contract (including the path to your Solidity file and contract name, separated by a colon e.g., `"contracts/Greeter.sol:Greeter"`).
- `constructorArguments` is an array containing the arguments used to deploy your contract (e.g. "Hi There").

Once this script runs, it prints the verification ID. If the verification request is successful, you can use this ID to check the status of your verification request. If the request was not successful, the return value and printed ID is `-1`.

### 9. UI block explorer alternative

Contract verification in zkSync Era ensures the integrity and trustworthiness of your contracts. The [Smart Contract Verification in zkSync Era Block Explorer](https://explorer.zksync.io/contracts/verify) is a manual UI process for doing the same, ideal for occasional use, while the `hardhat-zksync-verify` plugin facilitates an automated, flexible approach for developers.
