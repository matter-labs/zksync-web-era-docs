---
head:
  - - meta
    - name: "twitter:title"
      content: Local Node with zksync-cli | zkSync Docs
---

# Start a zkSync Node locally with zksync-cli

Utilize the [zksync-cli](../../zksync-cli/getting-started.md) to effortlessly initiate a local development environment. A simple command, `npx zksync-cli dev start`, gears up local zkSync and Ethereum nodes, along with Block Explorer, Wallet, and Bridge for a seamless development experience.

### Prerequisites

Before beginning, ensure you have installed:

- [Node.js v18+](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started/)

### Table of contents

- [Starting and Stopping Nodes](#starting-and-stopping-nodes)
- [Configuring Your Environment](#configuring-your-environment)
- [Managing Modules](#managing-modules)
- [Viewing Logs](#viewing-logs)
- [Cleaning Modules](#cleaning-modules)
- [Updating Modules](#updating-modules)
- [Troubleshooting](#troubleshooting)

## Starting and Stopping Nodes

- **Start**: `npx zksync-cli dev start` initiates your local environment. On the first run, it prompts to select a node and additional modules.
- **Stop**: `npx zksync-cli dev stop` terminates the local environment. Use `npx zksync-cli dev stop [module name]` to stop specific modules, e.g., `npx zksync-cli dev stop zkcli-block-explorer`.
- **Restart**: `npx zksync-cli dev restart` or `npx zksync-cli dev restart [module name]` restarts your environment or specific modules.

## Configuring Your Environment

- `npx zksync-cli dev config` allows the selection of nodes and additional modules like block explorer and bridge. Run modules such as Block Explorer against an already running node by adding a new chain.

## Managing Modules

- `npx zksync-cli dev modules` lists all installed modules, providing a clear overview of your environment's components.

## Viewing Logs

- `npx zksync-cli dev logs` displays logs for all active modules, essential for monitoring and debugging.

## Cleaning Modules

- `npx zksync-cli dev clean` removes all module data from your computer. For specific modules, use `npx zksync-cli dev clean [module name]`.

## Updating Modules

- `npx zksync-cli dev update [module name]` updates individual modules, ensuring you're running the latest versions. Usually you will see a notification when a new version is available.

## Troubleshooting

If modules malfunction, e.g., failing to start:

1. Use `npx zksync-cli dev stop` to cease all operations.
2. Reinstall the problematic module with `npx zksync-cli dev clean [module name]`, viewable via `npx zksync-cli dev modules`.
3. Restart with `npx zksync-cli dev start`. Check Docker container logs for detailed errors, accessible through Docker Desktop.
4. Persisting issues? Please report them in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general&title=[zksync-cli]%20<Title>).

For additional assistance, refer to our [troubleshooting guide](../../zksync-cli/troubleshooting.md).
