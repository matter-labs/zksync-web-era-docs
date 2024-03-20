---
head:
  - - meta
    - name: "twitter:title"
      content: Withdraw ETH to L1 | zkSync Docs
---

# Withdraw ETH to L1

Withdrawing assets from Layer 2 (L2) back to Layer 1 (L1) is an essential procedure to retrieve your assets in zkSync. This guide outlines how to withdraw ETH using the zkSync Javascript SDK, ensuring a successful transfer of assets to L1. In zkSync, withdrawing involves burning tokens on L2 and unlocking the corresponding funds on the L1 bridge.

:::info
Use the **`zks_getBridgeContracts`** endpoint or **`getDefaultBridgeAddresses`** method to get the default bridge addresses.
:::

<table><thead><tr><th width="148">Bridge Type</th><th width="101">Network</th><th width="226">L1 Address</th><th>L2 Address</th></tr></thead><tbody><tr><td>ERC-20 Default Bridge</td><td>Mainnet</td><td><code>0x57891966931eb4bb6fb81430e6ce0a03aabde063</code></td><td><code>0x11f943b2c77b743ab90f4a0ae7d5a4e7fca3e102</code></td></tr><tr><td>WETH Bridge</td><td>Mainnet</td><td><code>0x0000000000000000000000000000000000000000</code></td><td><code>0x0000000000000000000000000000000000000000</code></td></tr><tr><td>ERC-20 Default Bridge</td><td>Testnet</td><td><code>0x927ddfcc55164a59e0f33918d13a2d559bc10ce7</code></td><td><code>0x00ff932a6d70e2b8f1eb4919e1e09c1923e7e57b</code></td></tr><tr><td>WETH Bridge</td><td>Testnet</td><td><code>0x0000000000000000000000000000000000000000</code></td><td><code>0x0000000000000000000000000000000000000000</code></td></tr></tbody></table>

### Prerequisites

- **Node.js**: Ensure Node.js is installed. If not, download it from [here](https://nodejs.org/).
- **Private Key**: Have access to a private key for the account you'll be using.
- **L1 RPC Endpoint**: A URL to an Ethereum node to interact with. You can find RPC endpoints for Sepolia and Ethereum mainnet on [Chainlist](https://chainlist.org/) or use a node provider like Infura.

### Step 1: Understanding L2 to L1 Withdrawals

Withdrawing assets from L2 to L1 involves the following steps:

1. **Burning L2 Tokens**: Initially, the specified tokens on L2 are burned.
2. **Sending L2 to L1 Message**: A message detailing the withdrawal is sent from L2 to L1.
3. **Finalizing Withdrawal**: The `finalizeWithdrawal` method is called on the L1 bridge to complete the withdrawal process, unlocking the funds from the L1 bridge and sending them to the recipient.

:::warning
During the Alpha phase, **withdrawals in zkSync Era take 24 hours** for additional security.
:::

### Step 2: Setup Environment

Create a new directory for your withdrawal scripts and navigate into it:

::: code-tabs
@tab:active yarn

```bash
mkdir withdraw-scripts && cd withdraw-scripts
yarn init -y
yarn add typescript ts-node ethers@^5.7.2 zksync-ethers@5 dotenv
```

@tab npm

```bash
mkdir withdraw-scripts && cd withdraw-scripts
npm init -y
npm i typescript ts-node ethers@^5.7.2 zksync-ethers@5 dotenv
```

:::

Set up environment variables by creating a `.env` file in the project root containing your private key and the L1 RPC endpoint:

```bash
WALLET_PRIV_KEY=<YOUR_PRIVATE_KEY>
L1_RPC_ENDPOINT=<RPC_URL>
```

### Step 3: Create the Withdrawal Script

Create a new file `withdraw.ts` and insert the following code. This script utilizes the `withdraw` method from the `Wallet` class of the zkSync Javascript SDK to withdraw ETH. Adjust the `AMOUNT` variable if necessary.

#### withdraw.ts script

```typescript
import { Wallet, Provider, utils } from "zksync-ethers";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || ""; // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet

// Wallet
const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

// Amount in ETH
const AMOUNT = "0.00001";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error("Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider");
}

async function main() {
  console.log(`Running script to withdraw ETH to L1`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  try {
    // withdraw ETH to L1
    const withdrawHandle = await wallet.withdraw({
      to: wallet.address, // can bridge to a different address in L1
      token: utils.ETH_ADDRESS,
      amount: ethers.utils.parseEther(AMOUNT),
    });
    console.log(`Withdraw transaction sent ${withdrawHandle.hash}`);
  } catch (error: any) {
    console.error(`Error withdrawing: ${error.message}`);
    process.exitCode = 1;
  }
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
npx ts-node withdraw.ts
```

### Step 5: Verify the Output

Upon running the script, you should see an output similar to below, indicating the withdrawal transaction has been sent and is being processed on L1:

```txt
Running script to withdraw ETH to L1
L1 Balance is 6539874840163375070
L2 Balance is 5712612651486983637
Withdraw transaction sent 0x4905176d42b4c3b4ab10f611e688b2d849e761493f4583119b7c7731b4254cf4
```

### Conclusion

By following this guide, you have successfully withdrawn ETH from L2 to L1 using the zkSync Javascript SDK. This is a significant step towards managing your assets on the zkSync Era.
