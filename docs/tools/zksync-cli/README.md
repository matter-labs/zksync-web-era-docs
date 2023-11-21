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

You can run commands without installation: `npx zksync-cli`. For example: `npx zksync-cli dev start`.

## Highlight: Start Developing Locally, Fast

Use `npx zksync-cli dev` for an easy way to work with zkSync on your computer. It helps you set up and manage local zkSync and Ethereum nodes, Block Explorer, Wallet, and Bridge without hassle.

### Quick ‘dev’ Commands

- `npx zksync-cli dev start`: Begin your local development environment (first-time users will be prompted to configure)
- `npx zksync-cli dev clean`: Clear data for configured modules
- `npx zksync-cli dev config`: Choose modules to run in local development environment

Run `npx zksync-cli help dev` for more commands and details.

### Other Essential Commands

- **Basic Operations**:
  - `npx zksync-cli create`: Creates a project in a specified folder. [More info](#quick-scaffolding-with-templates).
  - `npx zksync-cli bridge deposit`: Moves funds from Ethereum (L1) to zkSync (L2).
  - `npx zksync-cli bridge withdraw` and `npx zksync-cli bridge withdraw-finalize`: Manage funds withdrawal from zkSync (L2) to Ethereum (L1).
- **Help & Info**:
  - `npx zksync-cli help`: General help.
  - `npx zksync-cli help {command}`: Detailed command usage info.
  - `npx zksync-cli --version`: CLI version info.

::: info Deposit and withdraw times

- Operations like deposit and withdraw can take several minutes.
- [Mainnet withdrawals have a 24h delay](../../reference/troubleshooting/withdrawal-delay.md).
  :::

More commands and updates are coming! If you have suggestions, [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

To simplify and streamline the templates section, you can consider the following edits:

---

### Quick Scaffolding with Templates

Jumpstart your projects with `npx zksync-cli create` using our updated templates:

#### For Frontend Development

- **Frameworks**: Utilize templates for popular frameworks like Vue, React, Next.js, Nuxt, and Vite.
- **Libraries & Tools**: Options include viem, Ethers, Web3Modal, RainbowKit.
- **Resources**: [Frontend Templates on GitHub](https://github.com/matter-labs/zksync-frontend-templates#readme).

#### For Smart Contracts

- **Solidity**: Deploy and test using Hardhat with our [Solidity Template](https://github.com/matter-labs/zksync-hardhat-template#readme).
- **Vyper**: Explore our [Vyper Template](https://github.com/matter-labs/zksync-hardhat-vyper-template#readme) for Hardhat integration.

#### For Scripting and Automation

- **Node.js Applications**: Automate interactions and advanced zkSync operations.
- **Features**: Includes examples for wallet and contract interactions using either viem or Ethers.
- **Resources**: [Scripting Templates on GitHub](https://github.com/matter-labs/zksync-scripting-templates#readme).

### 🔗 Supported Chains

zkSync CLI supports Era Testnet and Era Mainnet by default. Use other networks by overriding L1 and L2 RPC URLs: `npx zksync-cli bridge deposit --l2-rpc=http://... --l1-rpc=http://...`

For using [local setup (dockerized testing node)](../testing/dockerized-testing.md) with default RPC URLs, select `Local Dockerized node` in CLI or use `--chain local-dockerized`.

## Troubleshooting & Feedback

Encounter issues or have feedback? [Open an issue](https://github.com/matter-labs/zksync-cli/issues/new) or share thoughts [in GitHub discussions](https://github.com/zkSync-Community-Hub/zkync-developers/discussions).
