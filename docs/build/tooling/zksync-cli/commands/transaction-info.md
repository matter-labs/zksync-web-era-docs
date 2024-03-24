---
head:
  - - meta
    - name: "twitter:title"
      content: Contract interaction with zksync-cli | zkSync Docs
---

# Transaction information with zksync-cli

The `npx zksync-cli transaction info` command is designed to fetch and display detailed information about a specific transaction. It can be used to check the status, amounts transferred, fees, method signatures, and arguments of transactions on the chain of choice.

### Table of contents

- [Options](#options)
- [Examples](#example-usage)
  - [Basic usage](#basic-usage)
  - [Parsing transaction data](#parsing-transaction-data)
  - [Viewing detailed information](#viewing-detailed-information)
  - [Displaying raw JSON response](#displaying-raw-json-response)
- [Troubleshooting](#troubleshooting)

<br />

---

<br />

### Options

You do not need to specify options bellow, you will be prompted to enter them if they are not specified.

- `--tx <transaction hash>`: Specify the transaction hash to query.
- `--chain <chain-name>`: Select the chain to use (e.g., `zksync-mainnet`, `zksync-sepolia`).
- `--rpc <url>`: Provide RPC URL instead of selecting a chain
- `--full`: Show all available transaction data for comprehensive insights.
- `--raw`: Display the raw JSON response from the node.
- `--abi <path>`: Path to a local ABI file to decode the transaction's input data.

If no options are provided directly, the CLI will prompt the user to enter the necessary information, such as the chain and transaction hash.

<br />

---

<br />

## Example usage

### Basic usage

```bash
npx zksync-cli transaction info
```

You will be prompted to select a chain and transaction hash.

```bash
? Chain to use: zkSync Sepolia Testnet
? Transaction hash: 0x2547ce8219eb7ed5d73e68673b0e4ded83afc732a6c651d43d9dc49bb2f13d40
```

The command will then display detailed information about the transaction, including its status, from/to addresses, value transferred, method signature with arguments, and more:

```
──────────────────── Main info ────────────────────
Transaction hash: 0x2547ce8219eb7ed5d73e68673b0e4ded83afc732a6c651d43d9dc49bb2f13d40
Status: completed
From: 0x56DDd604011c5F8629bd7C2472E3504Bd32c269b
To: 0xBB5c309A3a9347c0135B93CbD53D394Aa84345E5
Value: 0 ETH
Fee: 0.0001503581 ETH  |  Initial: 0.0004 ETH  Refunded: 0.0038496419 ETH
Method: transmit(bytes,bytes32[],bytes32[],bytes32) 0xc9807539

───────────────── Method arguments ─────────────────
[1] bytes: 0x0000000000000000000000fd69e45d6f51e482ac4f8f2e14f2155200008b5f010001020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000007df298c81a0000000000000000000000000000000000000000000000000000007df298c81a0000000000000000000000000000000000000000000000000000007df298c81a
[2] bytes32[]: 0xd737d65b6b610c3f330bcfddbfc08e46d2a628c88bf22ec0d8f25627a3330798,0x9d33be2ba33b731555c13a4e7bf02d3d576fa3115f7523cbf07732321c85cdba
[3] bytes32[]: 0x73d639deda36b781ae049c8eceafba4196ee8ecc1efb74c538a28ea762ff6658,0x37ac79ff2ca902140613b0e51357d8fb218a67b4736bdee0c268c5fd9812e146
[4] bytes32: 0x0101000000000000000000000000000000000000000000000000000000000000

───────────────────── Details ─────────────────────
Date: 2/8/2024, 2:19:54 PM (15 minutes ago)
Block: #364999
Nonce: 50131
```

### Parsing transaction data

By default `zksync-cli` tries to fetch contract verification data from the server.
In case this is not possible it queries the [open signature](https://www.4byte.directory/) database to get signature of the transaction method.
If the method signature is not found, the transaction's data is displayed as a hex string.

Alternatively, you can provide the path to a local ABI file to decode the transaction's input data:

```bash
npx zksync-cli transaction info \
  --abi "./Greeter.json"
```

### Viewing detailed information

For an even more detailed overview you can use the `--full` option:

```bash
npx zksync-cli transaction info --full
```

### Displaying raw JSON response

If you prefer to see the raw JSON response from the zkSync node, use the `--raw` option:

```bash
npx zksync-cli transaction info --raw
```

## Troubleshooting

If you encounter issues, consult our [troubleshooting guide](../../zksync-cli/troubleshooting.md) or report them in our [GitHub discussions](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/new?category=general).
