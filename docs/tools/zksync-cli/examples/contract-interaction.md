# Contract interaction

The [zksync-cli](../README.md) tool, now enhanced with `contract read` and `contract write` commands, offers efficient ways for developers to interact with smart contracts on zkSync. These commands automate tasks such as method verification, ABI handling, output decoding, and proxy contract processing.

### Table of contents

- [Contract Read - Running read-only methods](#contract-read)
- [Contract Write - Executing write operations](#contract-write)
- [Examples](#examples)
  - [Basic read example](#basic-read-example)
  - [Basic write example](#basic-write-example)
  - [Using local ABI file](#using-local-abi-file)
  - [Running read on behalf of another address](#running-read-on-behalf-of-another-address)
  - [Write operation with value transfer](#write-operation-with-value-transfer)

<br />

---

<br />

## Contract Read

The `npx zksync-cli contract read` command executes read-only methods on contracts, like checking ERC-20 balances or contract states. [See basic example](#basic-read-example)

### Read Options

You do not need to specify options below, you will be prompted to enter them if they are not specified.

- `--chain <chain-name>`: Select the chain to use
- `--rpc <url>`: Provide RPC URL instead of selecting a chain
- `--contract <address>`: Specify contract's address
- `--method <method-signature>`: Defines the contract method to interact with
- `--arguments <method-arguments...>`: Pass arguments to the contract method
- `--data <0x-transaction-data>`: Instead of specifying the method and arguments, you can pass the raw transaction data
- `--outputTypes <output-types...>`: Specifies output types for decoding
- `--from <address>`: Call method on behalf of specified address
- `--abi <path>`: Path to local ABI file or contract artifact
- `--decode-skip`: Skips prompting for output types and decoding the response
- `--show-info`: Displays transaction request information (e.g. encoded transaction data)

<br />

---

<br />

## Contract Write

The `npx zksync-cli contract write` command performs write operations on smart contracts. It enables sending transactions that alter the state of a contract, such as transferring tokens or changing ownership. [See basic example](#basic-write-example)

### Write Options

You do not need to specify options bellow, you will be prompted to enter them if they are not specified.

- `--chain <chain-name>`: Select the chain to use
- `--rpc <url>`: Provide RPC URL instead of selecting a chain
- `--contract <address>`: Specify contract's address
- `--method <method-signature>`: Defines the contract method to interact with
- `--arguments <method-arguments...>`: Pass arguments to the contract method
- `--value <ether-amount>`: Ether amount to send with the transaction (e.g. 0.01)
- `--private-key <wallet-private-key>`: Private key of the wallet to use to sign the transaction
- `--data <0x-transaction-data>`: Instead of specifying the method and arguments, you can pass the raw transaction data
- `--abi <path>`: Path to local ABI file or contract artifact
- `--show-info`: Displays transaction request information (e.g. encoded transaction data)

<br />

---

<br />

## Examples

#### Basic read example

```bash
npx zksync-cli contract read
```

You will be prompted to select a chain, contract address, and method.

```bash
? Chain to use: zkSync Goerli Testnet
? Contract address: 0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b
```

Next you need to select a **method (function) to call**.

- In case your contract is verified it will automatically identify the ABI:

  ```bash
  ? Contract method to call
    ────────── Provided contract ──────────
  ❯ balanceOf(address account) view returns (uint256)
    decimals() pure returns (uint8)
    name() pure returns (string)
    symbol() pure returns (string)
    totalSupply() view returns (uint256)
    ───────────────────────────────────────
    Type method manually
  ```

- Otherwise you'll have to enter method signature manually, for example `balanceOf(address)`.

  ```bash
  ? Enter method to call: balanceOf(address)
  ```

- Alternatively, you can specify the ABI file manually using the `--abi` option. [See example](#using-local-abi-file)

After that, you will be prompted to enter **arguments** for the method, one by one.

```bash
? Provide method arguments:
? [1/1] account (address): 0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044
```

When submitted a contract call will be made and you'll see the response in it's original encoded form.

```bash
✔ Method response (raw): 0x000000000000000000000000000000000000000000010508e606548a9e5d2000
```

Finally, you will be asked the **method output** type to decode the response. You can skip this step by submitting empty response or completely skip it by passing `--decode-skip` option.

```bash
? Output types: uint256
✔ Decoded method response: 1232701801010000000000000
```

**Tip**: after running command with prompts you will see a full command with all the options that you can copy and use later to quickly run the same command again. For example:

```bash
npx zksync-cli contract read \
  --chain "zksync-goerli" \
  --contract "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b" \
  --method "balanceOf(address)" \
  --args "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044" \
  --output "uint256"
```

<br />

---

<br />

#### Basic write example

```bash
npx zksync-cli contract write
```

You will be prompted to select a chain, contract address, and method.

```bash
? Chain to use: zkSync Goerli Testnet
? Contract address: 0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b
```

Next you need to select a **method (function) to call**.

- In case your contract is verified it will automatically identify the ABI:

  ```bash
  ? Contract method to call
    ────────── Provided contract ──────────
  ❯ approve(address spender, uint256 amount) returns (bool)
    transfer(address to, uint256 amount) returns (bool)
    ───────────────────────────────────────
    Type method manually
  ```

- Otherwise you'll have to enter method signature manually, for example `transfer(address,uint256)`.

  ```bash
  ? Enter method to call: transfer(address,uint256)
  ```

- Alternatively, you can specify the ABI file manually using the `--abi` option. [See example](#using-local-abi-file)

After that, you will be prompted to enter **arguments** for the method, one by one.

```bash
? Provide method arguments:
? [1/2] to (address): 0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044
? [2/2] amount (uint256): 1
```

Now you need to provide private key of the wallet to use to sign the transaction.

```bash
? Private key of the wallet to sign transaction: *****
```

When submitted a contract call will be made and you'll see the transaction hash

```bash
✔ Transaction submitted. Transaction hash: 0xa83ad7e8932e18cdc57d3892040505a50d560a56fa507cabcd4180e9e5898bec
```

**Tip**: after running command with prompts you will see a full command with all the options that you can copy and use later to quickly run the same command again. For example:

```bash
npx zksync-cli contract write \
  --chain "zksync-goerli" \
  --contract "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b" \
  --method "transfer(address to, uint256 amount)" \
  --args "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b" "1"
```

<br />

---

<br />

### Using local ABI file

You can specify a local ABI file using the `--abi` option. It should be a JSON file with either ABI data (array) or contract artifact which you get after compiling your contracts.

```bash
npx zksync-cli contract read \
  --abi "./Greeter.json"
```

Now you will be able to select a method:

```bash
  ────────── Provided contract ──────────
❯ greet() view returns (string)
  ───────────────────────────────────────
  Type method manually
```

Response will be decoded automatically as well according to the ABI file.

<br />

---

<br />

### Running read on behalf of another address

You can specify the `--from` option to run the method on behalf of another address. This is useful when you need to call a method that expects a specific address as `msg.sender`.

```bash
npx zksync-cli contract read \
  --from "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
```

<br />

---

<br />

### Write operation with value transfer

Here, the command sends a transaction that includes Ether transfer along with the method call.

```bash
npx zksync-cli contract write \
  --value "0.1"
```
