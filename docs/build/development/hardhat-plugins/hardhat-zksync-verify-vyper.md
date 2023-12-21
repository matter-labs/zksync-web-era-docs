---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat zkSync Verify Vyper | zkSync Docs
---

# hardhat-zksync-verify-vyper

### What is `hardhat-zksync-verify-vyper?`&#x20;

The [`hardhat-zksync-verify-vyper`](https://www.npmjs.com/package/@matterlabs/hardhat-zksync-verify) plugin is used to verify **Vyper** smart contracts on zkSync Era network.

{% hint style="danger" %}
The `verify-vyper` plugin requires that your "contracts" folder contains the exact same Vyper contracts as when you deployed. Mismatch results in a "**bytecode doesn't match**" error. Verify contracts immediately after deployment to avoid this. This plugin is in **alpha** stage and not recommended for production use.
{% endhint %}

### Installation

Install the plugin using either of the following:

{% tabs %}
{% tab title="yarn" %}

```bash
yarn add -D @matterlabs/hardhat-zksync-verify-vyper
```

{% endtab %}

{% tab title="npm" %}

```bash
npm i -D @matterlabs/hardhat-zksync-verify-vyper
```

{% endtab %}
{% endtabs %}

### Configuration

In your `hardhat.config.ts` file, import the plugin:

```typescript
import "@matterlabs/hardhat-zksync-verify-vyper";
```

#### Network Configuration

Add or modify the zkSync network parameters in `hardhat.config.ts`:

```typescript
networks: {
  zkTestnet: {
    url: "https://testnet.era.zksync.dev",
    ethNetwork: "goerli",
    zksync: true,
    verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
  }
}
```

**Parameters**

- `url`: zkSync Era node URL.
- `ethNetwork`: Ethereum network URL or identifier.
- `zksync`: Must be `true` for zkSync verification.
- `verifyURL`: Endpoint for contract verification (Optional).
  - Testnet: `https://zksync2-testnet-explorer.zksync.dev/contract_verification`
  - Mainnet: `https://zksync2-mainnet-explorer.zksync.io/contract_verification`

### Commands

#### Verification Command

Verify a deployed contract with:

```bash
yarn hardhat verify:vyper --network <network> <contract address>
```

#### Contract Specification

Specify a contract from your local environment:

```bash
yarn hardhat verify:vyper --network <network> <contract address> --contract <fully qualified name>
```

#### Constructor Arguments

If your contract requires constructor arguments, provide them as follows:

```bash
yarn hardhat verify:vyper --network testnet <contract_address> "arg1" "arg2"
```

Or use a separate JavaScript module:

```bash
yarn hardhat verify:vyper --network testnet <contract_address> --constructor-args arguments.js
```

#### Programmatic Verification

To run verification from your code, use the Hardhat Runtime Environment (HRE):

```javascript
const verificationId = await hre.run("verify:verify:vyper", {
  address: contractAddress,
  contract: contractFullyQualifiedName,
  constructorArguments: [...]
});
```

### Troubleshooting

#### Verification Status

Check verification status with:

```bash
yarn hardhat verify-status:vyper --verification-id <your_verification_id>
```

#### Common Issues

- **Bytecode Mismatch**: Ensure that the local contract list matches the one used during deployment.
- **Error on Flag `zksync`**: Make sure `zksync` is set to `true` in network configuration.
- **Missing Constructor Arguments**: Provide constructor arguments if your contract requires them.
