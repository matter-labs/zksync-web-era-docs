# Smart contracts introduction

More information on smart contracts is coming soon.

## `zcli` tool

In order to simplify interaction with smart contracts for the first release of zkSync 2.0, we've prepared `zcli`: a
command-line interface for zkSync 2.0.

This utility is capable of executing all types of zkSync transactions from the command line.

### Installing `zcli`

Make sure you have installed Node v14.14 or higher, together with NPM v5 or higher.

```bash
npm install -g zcli2
```

### Deploying contracts with `zcli`

```console
zcli2 deploy-contract [options] [account-type] [fee-token]

Options:
  --bytecode <bytecode>           read bytecode from console in `0x`-prefixed `hex` format
  --bytecode-file <bytecodeFile>  read bytecode from file as
  --fast                          do not wait for transaction commitment
```

Example:

```bash
zcli2 deploy-contract zkPorter 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE --bytecode-file test-bytecode
```

<details>

<summary>Example Response</summary>

```json
{
  "network": "rinkeby",
  "transaction": null,
  "receipt": {
    "block": {
      "blockNumber": 7,
      "committed": true,
      "verified": false
    },
    "contractAddress": "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF",
    "executed": true,
    "failReason": null,
    "status": true
  }
}
```

</details>

### Calling contracts with `zcli`

```console
zcli2 execute-contract [options] <contract-address> [fee-token]

Options:
  --calldata <calldata>           read calldata from console in `0x`-prefixed `hex` format
  --calldata-file <calldataFile>  read calldata from file
  --fast                          do not wait for transaction commitment
```

Example:

```bash
zcli2 execute-contract 0xaBEA9132b05A70803a4E85094fD0e1800777fBEF --calldata-file test-calldata
```

<details>

<summary>Example Response</summary>

```json
{
  "network": "rinkeby",
  "transaction": null,
  "receipt": {
    "block": {
      "blockNumber": 7,
      "committed": true,
      "verified": false
    },
    "contractAddress": null,
    "executed": true,
    "failReason": null,
    "status": true
  }
}
```

</details>
