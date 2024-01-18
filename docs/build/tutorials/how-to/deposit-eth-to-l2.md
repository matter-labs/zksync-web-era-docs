---
head:
  - - meta
    - name: "twitter:title"
      content: Deposit ETH to L2 | zkSync Docs
---

# Deposit ETH to L2

Depositing assets from L1 to L2 is a fundamental step to interact with zkSync. This guide demonstrates how to deposit ETH using the Javascript SDK, ensuring a smooth transition of assets to L2. In zkSync, assets deposited from L1 are locked in a smart contract and corresponding representations of these assets are minted on L2, enabling fast and cheap transactions.

:::info
Use the **`zks_getBridgeContracts`** endpoint or **`getDefaultBridgeAddresses`** method to get the default bridge addresses.
:::

<table><thead><tr><th width="1488">Bridge Type</th><th width="101">Network</th><th width="226">L1 Address</th><th>L2 Address</th></tr></thead><tbody><tr><td>ERC-20 Default Bridge</td><td>Mainnet</td><td><code>0x57891966931eb4bb6fb81430e6ce0a03aabde063</code></td><td><code>0x11f943b2c77b743ab90f4a0ae7d5a4e7fca3e102</code></td></tr><tr><td>WETH Bridge</td><td>Mainnet</td><td><code>0x0000000000000000000000000000000000000000</code></td><td><code>0x0000000000000000000000000000000000000000</code></td></tr><tr><td>ERC-20 Default Bridge</td><td>Testnet</td><td><code>0x927ddfcc55164a59e0f33918d13a2d559bc10ce7</code></td><td><code>0x00ff932a6d70e2b8f1eb4919e1e09c1923e7e57b</code></td></tr><tr><td>WETH Bridge</td><td>Testnet</td><td><code>0x0000000000000000000000000000000000000000</code></td><td><code>0x0000000000000000000000000000000000000000</code></td></tr></tbody></table>

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. If not, download it from [here](https://nodejs.org/).
- **Private Key**: Have access to a private key for the account you'll be using.
- **L1 RPC Endpoint**: A URL to an Ethereum node to interact with. You can find RPC endpoints for Goerli and Ethereum mainnet on [Chainlist](https://chainlist.org/) or use a node provider like Infura.

### Step 1: Understand L1 - L2 Deposits

Depositing assets from L1 to L2 involves calling the [`deposit`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/ethereum/contracts/bridge/interfaces/IL1Bridge.sol#L21) method on the L1 bridge contract. Here's a simplified breakdown of the process:

1. **Locking L1 Tokens**: Initially, the specified tokens on L1 are sent to the L1 bridge, where they are locked.
2. **Initiating L1 to L2 Transaction**: The L1 bridge then initiates a transaction to the L2 bridge, marking the start of the deposit process.
3. **Minting L2 Tokens**: Tokens corresponding to the deposit are minted on L2 and sent to the designated L2 address.
   - If the token contract isn’t already present on zkSync Era, a new contract is deployed with a new L2 token address, which is derived from the original L1 address, name, and symbol.
4. **Confirmation Logging**: Each executed L1 to L2 transaction is confirmed with a log message sent from L2 back to L1.
5. **Finalizing Deposit**: Finally, the [`finalizeDeposit`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/zksync/contracts/bridge/L2ERC20Bridge.sol#L62) method is called on the L2 bridge to complete the deposit process, ensuring the funds are minted on L2.

This structured flow ensures a secure and orderly transfer of assets from L1 to L2, paving the way for further interactions on the Layer 2 network.

### Step 2: Setup Environment

Setup the node script:

::: code-tabs
@tab:active yarn

```bash
mkdir deposit-scripts && cd deposit-scripts
yarn init -y
yarn add typescript ts-node ethers@^5.7.2 zksync-ethers@5 dotenv
```

@tab npm

```bash
mkdir deposit-scripts && cd deposit-scripts
npm init -y
npm i typescript ts-node ethers@^5.7.2 zksync-ethers@5 dotenv
```

:::

Create a `.env` file in the project root containing your private key and the L1 RPC endpoint.

```bash
WALLET_PRIV_KEY=<YOUR_PRIVATE_KEY>
L1_RPC_ENDPOINT=<RPC_URL>
```

### Step 3: Create the Deposit Script

Create a new file `deposit.ts` and insert the below code:

#### Deposit script

```typescript
import { Wallet, Provider, utils } from "zksync-ethers";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || ""; // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet

// Amount in ETH
const AMOUNT = "0.00001";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error("Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider");
}

async function main() {
  console.log(`Running script to deposit ETH in L2`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  // Deposit ETH to L2
  const depositHandle = await wallet.deposit({
    to: wallet.address,
    token: utils.ETH_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT),
  });
  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Please wait a few minutes for the deposit to be processed in L2`);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
```

### Step 4: Run the Script

Execute the script using the following command:

```sh
npx ts-node deposit.ts
```

### Step 5: Verify the Deposit

Upon running the script, you should see output similar to below, indicating the deposit transaction has been sent and is being processed on L2:

```txt
Running script to deposit ETH in L2
L1 Balance is 6539874840163375070
L2 Balance is 5712612651486983637
Deposit transaction sent 0xffb8e302430b0584e2e0104dd6295a03688c98ba7b6e9279b01dba65188cc444
Please wait a few minutes for the deposit to be processed in L2
```

### Conclusion

By following this guide, you have successfully deposited ETH from L1 to L2 using the zkSync Javascript SDK. This is a fundamental step towards interacting with the zkSync Era.
