---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Verify | zkSync Docs
---

# hardhat-zksync-verify

### What is `hardhat-zksync-verify?`

The [`hardhat-zksync-verify`](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify) plugin is crafted to validate contracts on zkSync Era network.

{% hint style="info" %}
To gain an understanding **why** vyper plugin is needed for zkSync compilation please refer to the documentation [here](https://era.zksync.io/docs/tools/compiler-toolchain/overview.html).
{% endhint %}

### Installation

Ensure compatibility with the `@nomicfoundation/hardhat-verify` plugin. Install both:

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

### Configuration

Import the plugin:

```typescript
import "@matterlabs/hardhat-zksync-verify";
```

Add the `verifyURL` property to the `hardhat.config.ts` file:

```typescript
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/<API_KEY>" // The Ethereum Web3 RPC URL (optional).
  },
  zkTestnet: {
    url: "https://testnet.era.zksync.dev", // zkSync Era network testnet URL.
    ethNetwork: "goerli",
    zksync: true,
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification' // Verification endpoint.
  }
},
```

**Parameters:**

- **`zkTestnet`**: Represents the zkSync Era network name. Set as default using the `defaultNetwork` property.
- **`url`**: Required for all zkSync and Ethereum networks. Specifies the zkSync Era node's URL or the Ethereum node.
- **`ethNetwork`**: Provides the Ethereum node URL or its network name (like `goerli`). Essential for all zkSync networks.
- **`zksync`**: A flag indicating the zkSync Era network. Set to `true` for zkSync networks.
- **`verifyURL`**: Points to the verification endpoint for the zkSync network. This parameter is optional, and its default value is the testnet verification url.
  - Testnet: `https://zksync2-testnet-explorer.zksync.dev/contract_verification`
  - Mainnet: `https://zksync2-mainnet-explorer.zksync.io/contract_verification`

To verify a contract on Ethereum in the same project, add the `etherscan` field and your Etherscan API key:

```typescript
etherscan: {
  apiKey: //<Your Etherscan API key>,
},
```

### Commands

#### Contract Verification

Verify a contract on the designated network:

```bash
yarn hardhat verify --network <network> <contract address>
```

To specify the contract from your setup for verification, use the `--contract` parameter:

```bash
yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>
```

#### **Constructor Arguments**

For contracts deployed with constructor arguments, specify them when initiating the verify task:

```bash
yarn hardhat verify --network testnet <contract address> "Hi there!"
```

For complex arguments, export them from a separate JavaScript module, and integrate using `--constructor-args`:

Example `arguments.js`:

```javascript
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

```bash
yarn hardhat verify --network testnet <contract address> --constructor-args arguments.js
```

Encoded constructor parameters are also supported by the plugin but you need to specify a separate javascript module and export them as a _**non-array**_ parameter. It is important for encoded arguments to start with `0x` in order to be recognized by the plugin. For example:

```javascript
module.exports = "0x0x00087a676164696a61310000087a676164696a61310000000000000000000000008537b364a83f5c9a7ead381d3baf9cbb83769bf5";
```

#### Verification Status Check

Following a verification request, you can check its status using the verification ID:

```bash
yarn hardhat verify-status --verification-id <your verification id>
```

#### Programmatic Verification

To verify directly from code:

```javascript
const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: [...]
});
```

For encoded constructor arguments `constructorArguments` parameter should be a non-array value starting with `0x:`

```javascript
const verificationId = await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
  constructorArguments: "0x12345...",
});
```
