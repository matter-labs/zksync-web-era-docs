---
head:
  - - meta
    - name: "twitter:title"
      content: Custom Chains Configuration with zksync-cli | zkSync Docs
---

# Using custom chains with zksync-cli

The [zksync-cli](../../zksync-cli/getting-started.md) tool provides a flexible way to add or edit custom chains, enabling you to specify your own chain configuration. This feature is essential for developers looking to interact with ZK Stack Hyperchains.

## Configuring Custom Chains

To add or edit a custom chain, use the following command:

```bash
npx zksync-cli config chains
```

Upon execution, you will be guided through a series of prompts to enter specific details for the custom chain, including:

- **Chain Name**: A unique identifier for the custom chain.
- **RPC URL**: The RPC endpoint URL for interacting with the chain.
- **Chain ID**: The unique identifier for the chain, crucial for transaction signing and validation.
- **Other Information**: Depending on the chain's requirements, you may need to provide additional information such as block explorer URLs.

## Using Custom Chains

Once a custom chain is configured, you can use it across various `zksync-cli` commands. All of your custom chains will be listed in the chain selection prompt, allowing you to select and use them as needed. You can also specify a custom chain directly using the `--chain` option, for example:

```bash
npx zksync-cli wallet balance --chain <custom-chain-key>
```

## Troubleshooting

If you encounter issues while configuring or using custom chains, ensure your RPC URLs and Chain IDs are correct and that the network is accessible. For further assistance, consult our [troubleshooting guide](../../zksync-cli/troubleshooting.md) or report your issue in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general).
