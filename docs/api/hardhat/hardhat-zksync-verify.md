# `hardhat-zksync-verify`

This plugin is used to verify contracts on the zkSync Era network.

## Installation

[@matterlabs/hardhat-zksync-verify](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify)

The plugin is used in conjunction with [@nomiclabs/hardhat-etherscan](https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan) and it supports backward compatibility with that plugin.
To use it, you have to install both plugins and then import `@matterlabs/hardhat-zksync-verify` in the hardhat.config.ts file.

```typescript
# Yarn
yarn add -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan

# Npm
npm i -D @matterlabs/hardhat-zksync-verify @nomiclabs/hardhat-etherscan
```

### Configuration

Import the plugin in the `hardhat.config.ts` file:

```javascript
import "@matterlabs/hardhat-zksync-verify";
```

Add the `verifyURL` property to the zkSync network in the `hardhat.config.ts` file as shown below:

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // URL of the Ethereum Web3 RPC (optional)
  },
  zkTestnet: {
    url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
    ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
    zksync: true,
    // Verification endpoint for Goerli
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
  }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

Additional network properties:

- `zkTestnet` is an arbitrary zkSync network name. You can select this as the default network using the `defaultNetwork` property.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide the network name (e.g. `goerli`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `url` is a field with the URL of the zkSync node in the case of the zkSync network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync and Ethereum networks used by this plugin.
- `zksync` is a flag to indicate if the network represents zkSync network configuration. This field needs to be set to `true` for all zkSync networks. If you want to run a `hardhat-etherscan` verification, this field needs to be set to `false`. If set to `true`, the verification process will always try to run the verification process on the zkSync network.
- `verifyURL` is a field that points to the verification endpoint for the specific zkSync network. This parameter is optional, and its default value is the testnet verification url.
  - Testnet: `https://zksync2-testnet-explorer.zksync.dev/contract_verification`
  - Mainnet: `https://zksync2-mainnet-explorer.zksync.io/contract_verification`

If you want to verify a smart contract on the Ethereum in the same project, it is important to add `etherscan` field and API key in the `hardhat.config.ts` file:

```typescript

networks: {
    ...
},
etherscan: {
  apiKey: //<Your API key for Etherscan>,
},

```

### Commands

```sh
hardhat verify --network <network> <contract address>
```

Verifies the contract on the given network with the given contract's address. <br/>
Note: When run like this, the verify task will try to compare compiled bytecode of all the contracts in your local setup to the deployed bytecode of the contract you are trying to verify. If there is no match, it will report an error.

```sh
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

With the `--contract` parameter you can also specify which contract from your local setup you want to verify by specifying its Fully qualified name. Fully qualified name structure looks like this: "contracts/AContract.sol:TheContract" <br/>

#### Constructor arguments

If your contract was deployed with the specific constructor arguments, you need to specify them when running the verify task. For example:

```sh
yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF "Hi there!"
```

If your constructor takes a complex argument list, you can write a separate javascript module to export it. For example, create an `arguments.js` file with the following structure:

```typescript
module.exports = [
  "a string argument",
  "0xabcdef",
  "42",
  {
    property1: "one",
    property2: 2,
  },
];
```

Include it in the verify function call by adding a new parameter: `--constructor-args arguments.js`:
```sh
yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js
```

### Verification status check

The verification process consists of two steps. First, a verification request is sent to confirm if the given parameters for your contract are correct. Then, we check the verification status of that request. Those steps are both run when you run the `verify` task, but you will be able to see your specific verification request ID.
You can then use this ID to check the status of your verification request without running the whole process from the beginning.

The following command checks the status of the verification request for the specific verification ID:
```sh
yarn hardhat verify-status --verification-id <your verification id>
```

### Verify smart contract programmatically

If you need to run the verification task directly from your code, you can use the hardhat "verify:verify" task with the previously mentioned parameters with the difference in using `--address` parameter when specifying contarct's address:<br/>

```typescript
await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: [...]
});
```
