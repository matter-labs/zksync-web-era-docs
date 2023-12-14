---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync CLI | zkSync Era Docs
---

# zkSync CLI

The zkSync CLI simplifies the process of developing applications and interacting with zkSync Era. Out of the box it provides ready-templates to facilitate fast development and quick commands for convenience. &#x20;

:::info
**Repository:** [https://github.com/matter-labs/zksync-cli](https://github.com/matter-labs/zksync-cli)\
**Learn to contribute:** [CONTRIBUTING.md](https://github.com/matter-labs/zksync-cli/blob/main/.github/CONTRIBUTING.md)
:::

### Prerequisites

- **Node.js v18+**: If not installed, [download it here](https://nodejs.org/).
- **Docker**: If not installed, [download it here](https://www.docker.com/get-started).

### Installation

Install the zkSync CLI globally with the following command:

Run the script with:

::: code-tabs

@tab:active yarn

```bash
yarn add global zksync-cli@latest
```

@tab npm

```bash
npm install -g zksync-cli@latest
```

:::

## Usage

```bash
zksync-cli [options] [command]
```

### Commands

| Command                                   | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| `zksync-cli dev start`                    | Begin your local development environment                  |
| `zksync-cli dev clean`                    | Clear data for configured modules                         |
| `zksync-cli dev config`                   | Choose modules to run in local development environment    |
| `zksync-cli create-project {FOLDER_NAME}` | Creates a project in a specified folder                   |
| `zksync-cli deposit`                      | Moves funds from Ethereum (L1) to zkSync (L2)             |
| `zksync-cli withdraw`                     | Manage funds withdrawal from zkSync (L2) to Ethereum (L1) |
| `zksync-cli withdraw-finalize`            | Finalize withdrawal from zkSync (L2) to Ethereum (L1)     |
| `zksync-cli help`                         | General help                                              |
| `zksync-cli help {command}`               | Detailed command usage info                               |
| `zksync-cli --version`                    | CLI version info                                          |

:::info
Withdraws on zkSync Era mainnet have a **24h delay** during Alpha.
:::

#### Project Templates

Use the `zksync-cli create-project` command to initiate a project from the following templates:

- [**Hardhat + Solidity**](https://github.com/matter-labs/zksync-hardhat-template)
- [**Hardhat + Vyper**](https://github.com/matter-labs/zksync-hardhat-vyper-template)

#### Supported Chains

The zkSync CLI defaults to Era Testnet and Era Mainnet. You can target different networks by specifying L1 and L2 RPC URLs:

```bash
zksync-cli deposit --l2-rpc=http://your_l2_url --l1-rpc=http://your_l1_url
```

For a local setup using a dockerized testing node and default RPC URLs:

1. Use the **Local Dockerized node** option in the CLI.
2. Alternatively, use:

```bash
zksync-cli [command] --chain local-dockerized
```
