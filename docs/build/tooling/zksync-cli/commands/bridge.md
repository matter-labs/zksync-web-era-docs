---
head:
  - - meta
    - name: "twitter:title"
      content: Bridge Operations with zksync-cli | zkSync Docs
---

# Bridge operations with zksync-cli

Leverage the [zksync-cli](../../zksync-cli/getting-started.md) to facilitate bridge operations between Ethereum (L1) and zkSync (L2), including token deposits, withdrawals, and finalizing withdrawals.

### Prerequisites

Before you start, make sure you have installed:

- [Node.js v18+](https://nodejs.org/en)

### Table of contents

- [Bridge Deposit](#bridge-deposit)
  - [Deposit Options](#deposit-options)
  - [Depositing ERC-20 Tokens](#depositing-erc-20-tokens)
- [Bridge Withdraw](#bridge-withdraw)
  - [Withdraw Options](#withdraw-options)
  - [Withdrawing ERC-20 Tokens](#withdrawing-erc-20-tokens)
- [Withdraw Finalize](#withdraw-finalize)
  - [Finalize Withdraw Options](#finalize-withdraw-options)
- [Troubleshooting](#troubleshooting)

## Bridge Deposit

Transfer ETH from L1 to L2 using the deposit command.

```bash
npx zksync-cli bridge deposit
```

### Deposit Options

If options are not specified, you will be prompted to enter them.

- `--to, --recipient <0x address>`: Recipient address on L2.
- `--amount <0.1>`: Amount to deposit.
- `--token <0x address>`: ERC-20 token address.
- `--pk, --private-key <wallet private key>`: Private key of the sender.
- `--chain <chain>`: Chain to use.
- `--l1-rpc <URL>`: Override L1 RPC URL.
- `--rpc <URL>`: Override L2 RPC URL.

### Depositing ERC-20 Tokens

To deposit ERC-20 tokens, include the `--token` option with the token's contract address:

```bash
npx zksync-cli bridge deposit --token 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6
```

## Bridge Withdraw

Transfer tokens from L2 back to L1.

```bash
npx zksync-cli bridge withdraw
```

### Withdraw Options

You will be prompted to enter options if they are not specified.

- `--to, --recipient <0x address>`: Recipient address on L1.
- `--amount <0.1>`: Amount to withdraw.
- `--token <0x address>`: ERC-20 token address (omit this option to withdraw ETH).
- `--pk, --private-key <wallet private key>`: Private key of the sender.
- `--chain <chain>`: Chain to use.
- `--l1-rpc <URL>`: Override L1 RPC URL.
- `--rpc <URL>`: Override L2 RPC URL.

### Withdrawing ERC-20 Tokens

For withdrawing ERC-20 tokens, specify the token address using the `--token` option:

```bash
npx zksync-cli bridge withdraw --token 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6
```

## Withdraw Finalize

Finalize the withdrawal of funds with the following command. This step is necessary to complete the withdrawal process initiated on L2.

```bash
npx zksync-cli bridge withdraw-finalize
```

### Finalize Withdraw Options

Options will be prompted if not specified.

- `--hash <transaction_hash>`: L2 withdrawal transaction hash to finalize.
- `--pk, --private-key <wallet private key>`: Private key of the sender.
- `--chain <chain>`: Chain to use.
- `--l1-rpc <URL>`: Override L1 RPC URL.
- `--rpc <URL>`: Override L2 RPC URL.

## Troubleshooting

If you encounter any issues, please consult our [troubleshooting guide](../../zksync-cli/troubleshooting.md) or report them in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general).
