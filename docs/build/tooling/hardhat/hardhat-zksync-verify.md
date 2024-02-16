---
head:
  - - meta
    - name: "twitter:title"
      content: hardhat-zksync-verify | zkSync Docs
---

# `hardhat-zksync-verify`

This plugin is used to verify contracts on the zkSync Era network.

[Changelog](https://github.com/matter-labs/hardhat-zksync/blob/main/packages/hardhat-zksync-verify/CHANGELOG.md)

::: warning Unknown zksolc version

If you encounter this error, it suggests that the backend verification system does not currently support the latest version of the zksolc compiler. In such cases, it may require some time for the backend to be updated to accommodate the latest compiler version.

As a temporary solution, please use previous versions of the compiler until the backend verification system is updated to support the latest version.

:::

::: warning Version Compatibility Warning
Ensure you are using the correct version of the plugin with ethers:

- For plugin version **<1.0.0**:

  - Compatible with ethers **v5**.

- For plugin version **≥1.0.0**:

  - Compatible with ethers **v6** (⭐ Recommended)

  :::

## Setup

The [@matterlabs/hardhat-zksync-verify](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify) plugin is used in conjunction with [@nomicfoundation/hardhat-verify](https://www.npmjs.com/package/@nomicfoundation/hardhat-verify) and it supports backward compatibility.
To use it, install both plugins and then import `@matterlabs/hardhat-zksync-verify` in the `hardhat.config.ts` file.

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-verify @nomicfoundation/hardhat-verify
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-verify
```

:::

### Configuration

Import the plugin in the `hardhat.config.ts` file:

```javascript
import "@matterlabs/hardhat-zksync-verify";
```

Add the `verifyURL` property to the zkSync Era network in the `hardhat.config.ts` file as shown below:

```typescript
networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
      ethNetwork: "sepolia", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
      zksync: true,
      // Verification endpoint for Sepolia
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification'
    }
},
// defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
```

Additional network properties:

- `zkTestnet` is an arbitrary zkSync Era network name. You can select this as the default network using the `defaultNetwork` property.
- `url` is a field with the URL of the zkSync Era node in case of the zkSync Era network (with `zksync` flag set to `true`), or the URL of the Ethereum node. This field is required for all zkSync Era and Ethereum networks used by this plugin.
- `ethNetwork` is a field with the URL of the Ethereum node. You can also provide network name (e.g. `sepolia`) as the value of this field. In this case, the plugin will either use the URL of the appropriate Ethereum network configuration (from the `networks` section), or the default `ethers` provider for the network if the configuration is not provided. This field is required for all zkSync networks used by this plugin.
- `zksync` is a flag that indicates a zkSync Era network configuration. This field is set to `true` for all zkSync Era networks. If you want to run a `hardhat-verify` verification, this field needs to be set to `false`. If set to `true`, the verification process will try to run the verification process on the zkSync Era network.
- `verifyURL` is a field that points to the verification endpoint for the specific zkSync network. This parameter is optional, and its default value is the testnet verification url.
  - Testnet: `https://explorer.sepolia.era.zksync.dev/contract_verification`
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
yarn hardhat verify --network <network> <contract address>
```

This command verifies the contract on the given network with the given contract's address. <br/>
When executed in this manner, the verification task attempts to compare the compiled bytecode of all the contracts in your local environment with the deployed bytecode of the contract you are seeking to verify. If there is no match, it reports an error.

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

The hardhat-zksync-verify plugin also supports the verification with encoded constructor parameters.

In order to use the encoded parameters, you need to specify a separate javascript module and export them as a <b>_non-array_</b> parameter.
It is important for encoded arguments to start with `0x` in order to be recognized by the plugin. For example:

```typescript
module.exports = "0x0x00087a676164696a61310000087a676164696a61310000000000000000000000008537b364a83f5c9a7ead381d3baf9cbb83769bf5";
```

### Verification status check

The verification process consists of two steps:

- A verification request is sent to confirm if the given parameters for your contract are correct.
- Then, we check the verification status of that request.
  Both steps run when you run the `verify` task, but you will be able to see your specific verification request ID.
  You can then use this ID to check the status of your verification request without running the whole process from the beginning.

The following command checks the status of the verification request for the specific verification ID:

```sh
yarn hardhat verify-status --verification-id <your verification id>
```

### Verify smart contract programmatically

If you need to run the verification task directly from your code, you can use the hardhat `verify:verify` task with the previously mentioned parameters with the difference in using `--address` parameter when specifying contract's address.

```typescript
const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: [...]
});
```

This task returns a verification id if the request was successfully sent.<br/>
You can use this id to check the status of your verification request as described in the section above.

If you are using encoded constructor args, `constructorArguments` parameter should be a non-array value starting with `0x`.

```typescript
const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: "0x12345...",
});
```
