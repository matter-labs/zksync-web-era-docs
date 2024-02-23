---
head:
  - - meta
    - name: "twitter:title"
      content: Project Creation with zksync-cli | zkSync Docs
---

# Project creation with zksync-cli

Leverage the power of [zksync-cli](../../zksync-cli/getting-started.md) to kickstart your project with `npx zksync-cli create`. This command streamlines project setup by offering templates for frontend development, smart contracts, and scripting for zkSync, enabling rapid deployment and development.

### Prerequisites

Ensure you have the following installed before you start:

- [Node.js v18+](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)

### Table of contents

- [Available Templates](#available-templates)
  - [Frontend](#frontend)
  - [Contracts](#contracts)
  - [Scripting](#scripting)
- [Using Templates](#using-templates)
- [Troubleshooting](#troubleshooting)

## Available Templates

`npx zksync-cli create` simplifies the initial project setup by providing templates in three main categories:

### Frontend

Fast-track your UI development with our frontend templates, supporting popular frameworks like Vue, React, Next.js, Nuxt, and Vite. Options include viem, ethers, web3modal, rainbowkit, equipping you with the necessary tools for dApp development. [More Info](https://github.com/matter-labs/zksync-frontend-templates#readme).

### Contracts

For smart contract development, choose from templates designed for quick deployment and testing, compatible with Solidity or Vyper. Utilize tools like Hardhat to streamline your workflow. [Contract templates](https://github.com/matter-labs/zksync-contract-templates#readme).

### Scripting

Enhance your project with Node.js scripting templates for automated interactions and advanced zkSync operations. Includes examples of wallet or contract interactions using viem, ethers, or web3.js. [Scripting Templates](https://github.com/matter-labs/zksync-scripting-templates#readme).

## Using Templates

To create a project using a template, run the following command and follow the prompts to select your desired template category and specific framework or tool:

```bash
npx zksync-cli create
```

## Troubleshooting

If you encounter issues, consult our [troubleshooting guide](../../zksync-cli/troubleshooting.md) or report them in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general).
