---
head:
  - - meta
    - name: "twitter:title"
      content: zkSync CLI | zkSync Docs
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

### Local development commands

Use `npx zksync-cli dev` for an easy way to work with zkSync on your computer. It helps you set up and manage local zkSync and Ethereum nodes, Block Explorer, Wallet, and Bridge without hassle.

- `npx zksync-cli dev start` - start local development environment (will ask to configure if starting for the first time)
- `npx zksync-cli dev clean` - clean data for configured modules
- `npx zksync-cli dev config` - select modules to run in local development environment

Run `npx zksync-cli dev` to see the full list of commands.

### Create Project commands

- `npx zksync-cli create`: Create a project using updated templates. See [Quick Scaffolding with Templates](#quick-scaffolding-with-templates) for more information.

### Contract interaction commands

The easiest way to interact with zkSync contracts.

- `npx zksync-cli contract read`: run read-only contract methods
- `npx zksync-cli contract write`: send transactions to the contract

See full documentation and advanced examples [here](./examples/contract-interaction.md).

### Wallet commands

- `npx zksync-cli wallet transfer`: send ETH on L2 to another account
- `npx zksync-cli wallet balance`: displays ETH balance of the specified address

### Bridge commands

- `npx zksync-cli bridge deposit`: deposits funds from Ethereum (L1) to zkSync (L2)
- `npx zksync-cli bridge withdraw`: withdraws funds from zkSync (L2) to Ethereum (L1)
- `npx zksync-cli bridge withdraw-finalize`: finalizes withdrawal of funds from zkSync (L2) to Ethereum (L1)

### Other commands

- `npx zksync-cli help`: Provides information about all supported commands
- `npx zksync-cli <command> --help`: Provides detailed information about how to use a specific command. Replace \<command\> with the name of the command you want help with (e.g., `create`, `dev config`, `bridge withdraw-finalize`)
- `npx zksync-cli --version`: Returns the current version

More commands and updates are coming! If you have suggestions, [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

---

### Quick Scaffolding with Templates

Jumpstart your projects with `npx zksync-cli create` using our updated templates:

#### For Frontend Development

- **Frameworks**: Utilize templates for popular frameworks like Vue, React, Next.js, Nuxt, and Vite.
- **Libraries & Tools**: Options include Viem, Ethers, Web3Modal, RainbowKit.
- **Resources**: [Frontend Templates on GitHub](https://github.com/matter-labs/zksync-frontend-templates#readme).

#### For Smart Contracts

- **Solidity**: Deploy and test using Hardhat with our [Solidity Template](https://github.com/matter-labs/zksync-hardhat-template#readme).
- **Vyper**: Explore our [Vyper Template](https://github.com/matter-labs/zksync-hardhat-vyper-template#readme) for Hardhat integration.

#### For Scripting and Automation

- **Node.js Applications**: Automate interactions and advanced zkSync operations.
- **Features**: Includes examples for wallet and contract interactions using either viem or Ethers.
- **Resources**: [Scripting Templates on GitHub](https://github.com/matter-labs/zksync-scripting-templates#readme).

### 🔗 Use custom Chain or RPC URLs

By default zkSync CLI supports zkSync Goerli Testnet, zkSync Mainnet as well as local development networks. However, you can specify custom RPC URLs using `--rpc` and `--l1-rpc` options.

Example: `npx zksync-cli bridge deposit --rpc=http://... --l1-rpc=http://...`

## Troubleshooting & Feedback

Encounter issues or have feedback? [Open an issue](https://github.com/matter-labs/zksync-cli/issues/new) or share thoughts [in GitHub discussions](https://github.com/zkSync-Community-Hub/zkync-developers/discussions).
