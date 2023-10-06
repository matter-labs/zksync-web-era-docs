---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync CLI | zkSync Era Docs
---

# zkSync CLI: Your Local Development Assistant

Easily interact and develop applications with zkSync Era using the zkSync CLI.

Find the source code [here](https://github.com/matter-labs/zksync-cli).

## Get Started with zkSync CLI

### Prerequisites

Ensure you have the following installed:

- [Node.js v18+](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started/) (required for `zksync-cli dev` commands)
- [Yarn](https://v3.yarnpkg.com/getting-started/install) (required for `zksync-cli create project`)

### Installation and Usage

- Run commands directly with NPX: `npx zksync-cli {COMMAND}`

Or

- Install globally with npm: `npm install -g zksync-cli` and then use: `zksync-cli {COMMAND}`

## Highlight: Start Developing Locally, Fast

Use `zksync-cli dev` for an easy way to work with zkSync on your computer. It helps you set up and manage local zkSync and Ethereum nodes, Wallet, and Bridge without hassle.

### Quick ‘dev’ Commands

- `zksync-cli dev start`: Begin your local development environment (first-time users will be prompted to configure)
- `zksync-cli dev clean`: Clear data for configured modules
- `zksync-cli dev config`: Choose modules to run in local development environment

Run `zksync-cli help dev` for more commands and details.

### Other Essential Commands

- **Basic Operations**:
  - `zksync-cli create project {FOLDER_NAME}`: Creates a project in a specified folder.
  - `zksync-cli bridge deposit`: Moves funds from Ethereum (L1) to zkSync (L2).
  - `zksync-cli bridge withdraw` and `zksync-cli bridge withdraw-finalize`: Manage funds withdrawal from zkSync (L2) to Ethereum (L1).
- **Help & Info**:
  - `zksync-cli help`: General help.
  - `zksync-cli help {command}`: Detailed command usage info.
  - `zksync-cli --version`: CLI version info.

::: info Deposit and withdraw times

- Operations like deposit and withdraw can take several minutes.
- [Mainnet withdrawals have a 24h delay](../../reference/troubleshooting/withdrawal-delay.md).
  :::

More commands and updates are coming! If you have suggestions, [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

### Project Templates

Create projects with these templates using `zksync-cli create project`:

- [Hardhat + Solidity](https://github.com/matter-labs/zksync-hardhat-template).
- [Hardhat + Vyper](https://github.com/matter-labs/zksync-hardhat-vyper-template).

### 🔗 Supported Chains

zkSync CLI supports Era Testnet and Era Mainnet by default. Use other networks by overriding L1 and L2 RPC URLs: `zksync-cli deposit --l2-rpc=http://... --l1-rpc=http://...`

For using [local setup (dockerized testing node)](../testing/dockerized-testing.md) with default RPC URLs, select `Local Dockerized node` in CLI or use `--chain local-dockerized`.

## Troubleshooting & Feedback

Encounter issues or have feedback? [Open an issue](https://github.com/matter-labs/zksync-cli/issues/new) or share thoughts [in GitHub discussions](https://github.com/zkSync-Community-Hub/zkync-developers/discussions).
