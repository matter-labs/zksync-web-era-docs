# Deposit to L2

This document shows you how to deposit ETH and ERC-20 from L1 to L2 using the [Javascript SDK](../../api/js/README.md). 

## Deposit ETH

### 1. Scaffold the project

```sh
mkdir deposit-scripts && cd deposit-scripts
npm init -y 
npm i typescript ts-node ethers@^5.7.2 zksync-web3 dotenv
```

### 2. Set up environment variables

Create a `.env` file in the project root containing your private key and the L1 RPC endpoint.

```text
WALLET_PRIV_KEY=<YOUR_PRIVATE_KEY>
L1_RPC_ENDPOINT=<RPC_URL>
```
:::tip
If you're not using a node provider, you can find RPC endpoints for Goerli and Ethereum mainnet on [Chainlist](https://chainlist.org/). 
:::

### 3. Deposit ETH

Create a new file `deposit.ts` and copy/paste the code below. 

The script deposits ETH using the [`deposit`](../../api/js/getting-started.md#depositing-funds) method from JavaScript SDK `Wallet` class.

Adjust the `AMOUNT` variable if necessary.

```ts
import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || "";  // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet 

// Amount in ETH
const AMOUNT = "0.00001";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY ) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error(
    "Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider"
  );
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Run the script

```sh
npx ts-node deposit.ts
```

### 5. Output

You should see something like this:

```txt
Running script to deposit ETH in L2
L1 Balance is 6539874840163375070
L2 Balance is 5712612651486983637
Deposit transaction sent 0xffb8e302430b0584e2e0104dd6295a03688c98ba7b6e9279b01dba65188cc444
Please wait a few minutes for the deposit to be processed in L2
```

## Deposit ERC-20 tokens

### 1. Scaffold a new project

Use the [zkSync Era cli](../../tools/zksync-cli/README.md) to set up a project.

```sh
npx zksync-cli@latest create ERC20_deposit
```

### 2. Include the `.env` file at the project root

Copy/paste the `.env` file from above into the directory.

### 3. Create the deposit ERC-20 tokens script

- Create a new file `deposit-erc20.ts` in the project directory and copy/paste the code below. The script passes `approveERC20: true` which deals with ERC-20 tokens.

- Enter the `TOKEN_ADDRESS` and adjust the `AMOUNT` if necessary.

```ts
import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || "";  // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet 

// ERC-20 Token address in L1
const TOKEN_ADDRESS = "<TOKEN_ADDRESS>";

// Amount of tokens 
const AMOUNT = "5";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY ) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error(
    "Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider"
  );
}

if (!TOKEN_ADDRESS ) {
  throw new Error("Missing address of the ERC-20 token in L1");
}

async function main() {
  console.log(`Running script to bridge ERC-20 to L2`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  // Deposit token to L2
  const depositHandle = await wallet.deposit({
    to: wallet.address,  // can bridge to a different address in L2
    token: TOKEN_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT), // assumes ERC-20 has 18 decimals
    // performs the ERC-20 approve action
    approveERC20: true,
  });
  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Please wait a few minutes for the deposit to be processed in L2`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Run the script

```sh
npx ts-node deposit-erc20.ts
```

### 5. Output

```text
Running script to bridge ERC-20 to L2
L1 Balance is 19500035772482145
L2 Balance is 2969807401250000000
Deposit transaction sent 0xffb8e302430b0584e2e0104dd6295a03688c98ba7b6e9279b01dba65188cc444
```