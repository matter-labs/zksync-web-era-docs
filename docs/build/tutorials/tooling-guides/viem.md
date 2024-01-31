---
head:
  - - meta
    - name: "twitter:title"
      content: Viem | zkSync Docs
---

# viem

[viem](https://viem.sh/) is a TypeScript interface for Ethereum that now includes support for zkSync, offering low-level stateless primitives for interacting with both Ethereum and zkSync. You can use viem to interact seamlessly with smart contracts deployed on zkSync. For more information on zkSync specific support please refer to viem documentation [here](https://viem.sh/docs/chains/zksync).

You can use viem to interact with smart contracts deployed on zkSync.

## Installation

Start by adding Viem to your project. Open your terminal and execute the following command:

```bash
npm install --save viem
```

This command installs the latest version of Viem and adds it to your project's dependencies.

## Initial Setup

### Client Configuration

Before using viem, you need to setup a [Client](https://viem.sh/docs/clients/intro.html) with a chosen [Transport](https://viem.sh/docs/clients/intro.html) and [Chain](https://viem.sh/docs/clients/chains.html).

#### Example

```javascript
import { createPublicClient, http } from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

// Initialize the Viem client
const client = createPublicClient({
  chain: zkSyncSepoliaTestnet, // Specify the zkSync network
  transport: http(), // Define the transport method
});
```

:::info

- To use the zkSync Sepolia testnet, specify `zkSyncSepoliaTestnet` as the chain.
- For zkSync mainnet, replace `zkSyncSepoliaTestnet` with `zkSync`.

:::

### Reading Data

Access zkSync data by invoking Public Actions that mirror Ethereum RPC methods.

#### Fetch the Latest Block Number

```javascript
const blockNumber = await client.getBlockNumber();
console.log(`Current block number: ${blockNumber}`);
```

### Writing Data

To write data, such as sending transactions, you need to set up a Wallet client.

#### Sending Transactions

```javascript
import { createWalletClient, custom } from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

// Request account access from the Ethereum provider
const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });

// Configure the wallet client
const client = createWalletClient({
  account,
  chain: zkSyncSepoliaTestnet,
  transport: custom(window.ethereum),
});

// Example transaction
client.sendTransaction({
  /* transaction details */
});
```

## Advanced Usage

### Utilizing Paymasters

[Paymasters](https://docs.zksync.io/build/developer-reference/account-abstraction.html#paymasters) cover transaction fees, facilitating a smoother user experience. To utilize zkSync's native account abstraction and Paymasters, extend the Wallet client with `eip712WalletActions`:

#### Setup

```javascript
import 'viem/window';
import { createWalletClient, custom } from 'viem';
import { zkSync } from 'viem/chains';
import { eip712WalletActions } from 'viem/zksync';

// Initialize and extend the wallet client
const walletClient = createWalletClient({
  chain: zkSync,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions());
```

#### Sending a Transaction with a Paymaster

```javascript
import { utils } from "zksync-ethers";

const paymasterAddress = "<DEPLOYED_PAYMASTER_ADDRESS>"; // Replace with your paymaster address
const params = utils.getPaymasterParams(paymasterAddress, {
  type: "General",
  innerInput: new Uint8Array(),
});

// Send the transaction example
const hash = await walletClient.sendTransaction({
  account: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
  to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  value: 1000000000000000000n,
  paymaster: paymasterAddress,
  paymasterInput: params.paymasterInput,
});
```

:::info

**Note:** Ensure your paymaster contract is set up and funded appropriately.

:::

For a live example, check out this [StackBlitz demo](https://stackblitz.com/edit/github-zfdhx8-ju8urb?file=index.tsx). Remember to replace `PAYMASTER_CONTRACT_ADDRESS` with your own!

### Contract Interactions with Paymasters

#### Contract Function Call

```javascript
import { utils } from "zksync-ethers";

const paymasterAddress = "<DEPLOYED_PAYMASTER_ADDRESS>"; // Replace with actual address

// Set up paymaster parameters
const params = utils.getPaymasterParams(paymasterAddress, {
  type: "General",
  innerInput: new Uint8Array(),
});

// Call the contract function
const hash = await walletClient.writeContract({
  address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
  abi: parseAbi(["function setGreeting(string _greeting) nonpayable"]),
  functionName: "setGreeting",
  args: ["zkSync!"],
  paymaster: paymasterAddress,
  paymasterInput: params.paymasterInput,
});
```

:::info

**Note:** Ensure your paymaster contract is set up and funded appropriately.

:::

For a live example, check out this [StackBlitz demo](https://stackblitz.com/edit/github-aa4rfx?file=index.tsx). Remember to replace `PAYMASTER_CONTRACT_ADDRESS` with your own!

### Smart Contract Interactions

Interact with smart contracts by creating a Contract instance, providing ABI, address, and the client.

#### Example

```javascript
import { getContract } from "viem";
import { yourContractAbi } from "./abi"; // Your contract's ABI
import { client } from "./client"; // Your initialized Viem client

// Initialize the contract instance
const contract = getContract({
  address: "YOUR_CONTRACT_ADDRESS", // Replace with your contract's address
  abi: yourContractAbi,
  client,
});

// Interact with your contract
const result = await contract.read.totalSupply();
console.log(`Total Supply: ${result}`);
```
