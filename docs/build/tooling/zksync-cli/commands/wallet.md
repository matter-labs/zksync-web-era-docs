---
head:
  - - meta
    - name: "twitter:title"
      content: Wallet Operations with zksync-cli | zkSync Docs
---

# Wallet operations with zksync-cli

Utilize the [zksync-cli](../../zksync-cli/getting-started.md) for an easy way to manage your assets on zkSync, like token transfers and balance check.

### Prerequisites

Ensure the following are installed before you proceed:

- [Node.js v18+](https://nodejs.org/en)

### Table of contents

- [Wallet Transfer](#wallet-transfer)
  - [Basic Transfer](#basic-transfer)
  - [Transfer Options](#transfer-options)
  - [Transfer ERC-20 Token](#transfer-erc-20-token)
- [Wallet Balance](#wallet-balance)
  - [Checking Balance](#checking-balance)
  - [Balance Options](#balance-options)
  - [Checking ERC-20 Token Balance](#checking-erc-20-token-balance)
- [Troubleshooting](#troubleshooting)

## Wallet Transfer

### Basic Transfer

To transfer ETH between accounts on zkSync, use the following command:

```bash
npx zksync-cli wallet transfer
```

### Transfer Options

You do not need to specify options bellow, you will be prompted to enter them if they are not specified.

- `--to`, `--recipient <0x address>`: Define the recipient address on L2.
- `--amount <0.1>`: Specify the amount to transfer.
- `--token <token address>`: Specify an ERC-20 token for the transfer instead of ETH.
- `--pk`, `--private-key <wallet private key>`: Use the private key of the sender for the transaction.
- `--chain <chain>`: Select the chain to use.
- `--rpc <URL>`: Override the default L2 RPC URL.

### Transfer ERC-20 Token

For transferring ERC-20 tokens, include the `--token` option with the token's contract address, for example:

```bash
npx zksync-cli wallet transfer --token 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6
```

## Wallet Balance

### Checking Balance

View zkSync wallet's ETH balance using the following command:

```bash
npx zksync-cli wallet balance
```

### Balance Options

You do not need to specify options bellow, you will be prompted to enter them if they are not specified.

- `--address <0x address>`: Address of the wallet to check.
- `--token <token address>`: Specify an ERC-20 token for the transfer instead of ETH.
- `--chain <chain>`: Select the chain to use.
- `--rpc <URL>`: Override the default L2 RPC URL.

### Checking ERC-20 Token Balance

To check the balance of a specific ERC-20 token, use the `--token` option, for example:

```bash
npx zksync-cli wallet balance --token 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6
```

## Troubleshooting

If you encounter issues, consult our [troubleshooting guide](../../zksync-cli/troubleshooting.md) or report them in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general).
