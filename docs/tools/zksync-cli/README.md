---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync CLI | zkSync Era Docs
---

# zkSync CLI

The zkSync CLI simplifies the process of developing applications and interacting with zkSync Era.

The code is available [in the following repository](https://github.com/matter-labs/zksync-cli).

## Installation

Install the zkSync CLI globally with the following command:

- Install with Yarn:

  ```
  yarn add global zksync-cli@latest
  ```

- Install with NPM:

  ```
  npm install -g zksync-cli@latest
  ```

You can also run this via NPX with `npx zksync-cli@latest [COMMAND]`

## Commands

- `zksync-cli create-project {FOLDER_NAME}`: creates project from template in the specified folder
- `zksync-cli deposit`: deposits funds from Ethereum (L1) to zkSync (L2)
- `zksync-cli withdraw`: withdraws funds from zkSync (L2) to Ethereum (L1)
- `zksync-cli withdraw-finalize`: finalizes withdrawal of funds from zkSync (L2) to Ethereum (L1)
- `zksync-cli help`: Provides information about all supported commands
- `zksync-cli help {command}`: Provides detailed information about how to use a specific command. Replace {command} with the name of the command you want help with (e.g., create-project, deposit, withdraw, withdraw-finalize)
- `zksync-cli --version`: Returns the current version

::: info Deposit and withdraw times

- Both deposit and withdraw might take a couple of minutes to complete.
- Withdraws on mainnet have a [24h delay during Alpha](../../reference/troubleshooting/withdrawal-delay.md).

:::

More commands will be added shortly but if you have any suggestions, feel free to [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

### Project templates

Below are the repositories of the different project templates used on the `zksync-cli create-project` command:

- [Hardhat + Solidity](https://github.com/matter-labs/zksync-hardhat-template).
- [Hardhat + Vyper](https://github.com/matter-labs/zksync-hardhat-vyper-template).

### 🔗 Supported chains

By default zkSync CLI supports Era Testnet and Era Mainnet. You can also use other networks by overwriting L1 and L2 RPC URLs. For example: `zksync-cli deposit --l2-rpc=http://... --l1-rpc=http://...`

If you're using [local setup (dockerized testing node)](../testing/dockerized-testing.md) with default L1 and L2 RPC URLs, you can select `Local Dockerized node` option in the CLI or provide option `--chain local-dockerized`.

## Troubleshooting

If you find any issues, you can [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new) or report it to us [in GitHub discussions](https://github.com/zkSync-Community-Hub/zkync-developers/discussions).
