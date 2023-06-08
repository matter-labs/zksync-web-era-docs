# How to Verify Contracts

Contract verification is a critical step in building trust in your contracts by ensuring that the code running on-chain matches the source code you've published.

In the following sections, we'll provide a comprehensive guide on how to verify your contracts using [`hardhat-zksync-verify`](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify) plugin.

## Common Use Cases

The primary functionality of contract verification is to validate and authenticate contracts on their respective networks. This enhances transparency, security, and trust in your smart contracts. Here are some common use cases:

- **Transparent Contract Deployment**: With this plugin, developers can deploy their contracts on the zkSync network with transparency. Users and other developers can independently verify the contract's source code, ensuring it behaves as expected.

- **Cross-chain Interoperability**: For contracts operating across multiple chains, verifying contracts on each network assures users of the contract's consistency across different ecosystems.

- **Open Source Projects**: For open-source projects, verifying contracts enhances trust and encourages more developers to contribute. It assures contributors that the deployed contracts match the source code.
  
## Verifying Contracts using `hardhat-zksync-verify`

This guide will show you how to use the `hardhat-zksync-verify` plugin to verify contracts on the zkSync Era network. 

### Step 1: Install Required Packages

You will need to install both `@matterlabs/hardhat-zksync-verify` and `@nomiclabs/hardhat-etherscan` for this operation. Use the following commands to add these packages to your project:

For `yarn`:

```bash
yarn add -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```

For `npm`:

```bash
npm i -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```

### Step 2: Configure `hardhat.config.ts`

1. Import `@matterlabs/hardhat-zksync-verify` in the `hardhat.config.ts` file:

```javascript
import "@matterlabs/hardhat-zksync-verify";
```

2. Configure your network settings within the `hardhat.config.ts` file. You need to add the `verifyURL` property to the zkSync Era network:

```typescript
networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://testnet.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "goerli", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `goerli`)
      zksync: true,
      // Verification endpoint
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
    }
},
```

In this configuration, you can specify an arbitrary zkSync Era network name using the `defaultNetwork` property. Also, note that the `verifyURL` property points to the verification endpoint for the specific zkSync network.

If you want to verify a smart contract on Ethereum in the same project, add the `etherscan` field and your Etherscan API key:

```typescript
networks: {
    ...
},
etherscan: {
  apiKey: //<Your API key for Etherscan>,
},
```

### Step 3: Verify the Contract

You can run the following command to verify your contract on the network, replacing `<contract address>` with your contract's actual address:

```sh
yarn hardhat verify --network <network> <contract address>
```

For example, if you're verifying a contract on the `zkSyncTestnet` network and your contract address is `0x1234abc...`, you would use:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc...
```

This command verifies the contract on the specified network using the given contract's address. When executed in this manner, the verification task attempts to compare the compiled bytecode of all the contracts in your local environment with the deployed bytecode of the contract you are seeking to verify. If there is no match, it reports an error.

### Step 3.1: Verify the Contract with Fully Qualified Name

You can specify which contract from your local setup you want to verify using the `--contract` parameter and providing its fully qualified name:

```sh
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

A fully qualified name would be `path/sourceName:contractName`. For instance, if the source name is `Greeter.sol`, the contract name is `Greeter` and lives in the `contracts/` directory, then the fully qualified contract name would be: `contracts/Greeter.sol:Greeter`. An example of command using the `--contract` flag:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc... --contract contracts/Greeter.sol:Greeter
```

### Step 3.2: Verify the Contract with Constructor Arguments

If your contract was deployed with specific constructor arguments, you need to specify them when running the verify task:

```sh
yarn hardhat verify --network testnet <contract address> "<constructor argument>"
```

For example, if you're verifying a contract on the zkSyncTestnet network, your contract address is `0x1234abc...`, and your constructor argument was "Hi there", you would use:

```sh
yarn hardhat verify --network zkSyncTestnet 0x1234abc... "Hi there"
```

If your contract's constructor includes a complex list of arguments, you should handle this situation by creating a separate JavaScript module to export these arguments. Here's how you can achieve this:

1. **Prepare the JavaScript Module with Arguments:**

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

    Make sure that each argument in this array corresponds with the order of arguments in your contract's constructor!

2. **Verifying the Contract with the Constructor Arguments File:**

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

### Step 4: Check Verification Status

Once you've submitted your contract for verification, you may want to check the status of your request. This can be especially useful in cases where verification may take a longer duration, or if you wish to verify the successful receipt of your request.

Use the `verify-status` command to check the status of your verification request. Replace `<your verification id>` with the verification ID you received when you submitted your contract for verification.

```sh
yarn hardhat verify-status --verification-id <your verification id>
```

For instance, if your verification ID was `12345`, you would execute:

```sh
yarn hardhat verify-status --verification-id 12345
```

This command will return the current status of your verification request. Keep in mind that depending on the network load and complexity of your contract, the verification process may take some time to complete.

### Step 5: Verify Smart Contract Programmatically

There may be cases where you need to verify your contracts programmatically, for instance, as part of your project's build or deployment scripts. To achieve this, you can use Hardhat's task runner to call the `verify:verify` task directly from your code. Here's an example of how you can do this:

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

- `contractAddress` should be the address of the deployed contract you wish to verify. 
- `contractFullyQualifiedName` should be the fully qualified name of your contract (including the path to your Solidity file and contract name, separated by a colon e.g., `"contracts/Greeter.sol:Greeter"`).
- `constructorArguments` should be an array containing the arguments used to deploy your contract (e.g. "Hi There").

Once this script runs, it will print the verification ID. If the verification request was successful, you can use this ID to check the status of your verification request. If the request was not successful, the return value and printed ID will be `-1`.

Contract verification in zkSync is pivotal to ensure the integrity and trustworthiness of your contracts. The zkSync Block Explorer provides an accessible manual process, ideal for occasional use, while the `hardhat-zksync-verify` plugin facilitates an automated, flexible approach for developers. Whichever method you choose, remember, verification strengthens transparency and cultivates trust among your users. Happy hacking!