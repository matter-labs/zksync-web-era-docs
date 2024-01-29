---
head:
  - - meta
    - name: "twitter:title"
      content: Viem | zkSync Docs
---

# viem

[viem](https://viem.sh/) is a TypeScript interface for Ethereum that now includes support for zkSync, offering low-level stateless primitives for interacting with both Ethereum and zkSync networks. You can use viem to interact seamlessly with smart contracts deployed on zkSync. For more information on zkSync specific support please refer to viem documentation [here](https://viem.sh/docs/chains/zksync).

You can use viem to interact with smart contracts deployed on zkSync.

## Install

To get started, install viem by running the following command:

```bash
npm install --save viem
```

## Setup

Before using viem, you need to setup a [Client](https://viem.sh/docs/clients/intro.html) with a chosen [Transport](https://viem.sh/docs/clients/intro.html) and [Chain](https://viem.sh/docs/clients/chains.html).

```javascript
import { createPublicClient, http } from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

const client = createPublicClient({
  chain: zkSyncSepoliaTestnet,
  transport: http(),
});
```

:::info

- To use the zkSync Sepolia testnet, specify `zkSyncSepoliaTestnet` as the chain.
- For zkSync mainnet, replace `zkSyncSepoliaTestnet` with `zkSync`.

:::

## Reading data from zkSync

With your client set up, access zkSync data using Public Actions. These actions correspond to Ethereum RPC methods. Since zkSync supports the standard Ethereum JSON-RPC API you can make use of these methods.

For example, you can use the `getBlockNumber` client method to get the latest block:

```javascript
const blockNumber = await client.getBlockNumber();
```

## Writing data to zkSync

To write data to zkSync, create a Wallet client (`createWalletClient`) and specify an [`Account`](https://ethereum.org/en/developers/docs/accounts/).

```javascript
import { createWalletClient, custom } from 'viem'
import { zkSyncSepoliaTestnet } from 'viem/chains'

const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })

const client = createWalletClient({
  account,
  chain: zkSyncSepoliaTestnet,
  transport: custom(window.ethereum)
})

client.sendTransaction({ ... })
```

## Sending Transactions using a Paymaster

To utilize zkSync's native account abstraction and Paymasters, extend the Wallet client with `eip712WalletActions`:

### 1. Set up your Client & Transport

Initialize your [Client](/docs/clients/intro) with a [Transport](/docs/clients/intro) & [zkSync Chain](https://viem.sh/docs/chains/zksync), then extend it with zkSync EIP712 actions:

```javascript
import 'viem/window'
import { createWalletClient, custom } from 'viem'
import { zkSync } from 'viem/chains'
import { eip712WalletActions } from 'viem/zksync'

const walletClient = createWalletClient({
  chain: zkSync,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions())
```

### 2. Use Actions

After setting up, send transactions on zkSync using a [paymaster](https://docs.zksync.io/build/developer-reference/account-abstraction.html#paymasters):

```javascript
import 'viem/window'
import { createWalletClient, custom } from 'viem'
import { zkSync } from 'viem/chains'
import { eip712WalletActions } from 'viem/zksync'
import { utils } from 'zksync-ethers'

const walletClient = createWalletClient({
  chain: zkSync,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions())

const paymasterAddress = '0xFD9aE5ebB0F6656f4b77a0E99dCbc5138d54b0BA';
const params = utils.getPaymasterParams(paymasterAddress, {
        type: "General",
        innerInput: new Uint8Array(),
});

const hash = await walletClient.sendTransaction({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
  paymaster: paymasterAddress,
  paymasterInput: params.paymasterInput as `0x${string}`,
})

console.log("Hash: ", hash);
```

:::info

Ensure the paymaster is deployed and funded on the target network. See [Paymasters](https://docs.zksync.io/build/developer-reference/account-abstraction.html#paymasters) for more details.

:::

#### To write contracts

To interact with smart contracts, use the following method:

```javascript
import 'viem/window'
import { createWalletClient, custom, parseAbi } from 'viem'
import { zkSync } from 'viem/chains'
import { eip712WalletActions } from 'viem/zksync'
import { utils } from 'zksync-ethers'

const walletClient = createWalletClient({
  account: '0x',
  chain: zkSync,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions())

const paymasterAddress = '0xFD9aE5ebB0F6656f4b77a0E99dCbc5138d54b0BA';
const params = utils.getPaymasterParams(paymasterAddress, {
        type: "General",
        innerInput: new Uint8Array(),
});

const hash = await walletClient.writeContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
  paymaster: paymasterAddress,
  paymasterInput: params.paymasterInput as `0x${string}`,
})
```

## Interacting with smart contracts

Interact with zkSync smart contracts by creating a Contract instance with [`getContract`](https://viem.sh/docs/contract/getContract.html), passing the ABI, address, and Client:

```javascript
import { getContract } from "viem";
import { wagmiAbi } from "./abi";
import { publicClient } from "./client";

const contract = getContract({
  address: "CONTRACT_ADDRESS",
  abi: wagmiAbi,
  publicClient,
});

const result = await contract.read.totalSupply();
```
