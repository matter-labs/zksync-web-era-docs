# Withdrawal to L1

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../troubleshooting/withdrawal-delay.md).
:::

To withdraw ETH or ERC-20 tokens, use the following [Javascript SDK](../../api/js/README.md) scripts and call the `withdraw` method of the `Wallet` class.

## Withdraw ETH

### 1. Set up

```sh
mkdir withdraw-scripts && cd withdraw-scripts
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

### 3. Create the script

Create a new file `withdraw.ts` and copy/paste the code below. 

The script withdraws ETH using the [`withdraw`](../../api/js/getting-started.md#withdrawing-funds) method from JavaScript SDK `Wallet` class.

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

// Wallet 
const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

// Amount in ETH
const AMOUNT = "0.00001";

if (!WALLET_PRIV_KEY ) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error(
    "Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider"
  );
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
      to: wallet.address,  // can bridge to a different address in L1
      token: utils.ETH_ADDRESS,
      amount: ethers.utils.parseEther(AMOUNT), 
    });
    console.log(`Withdraw transaction sent ${withdrawHandle.hash}`);
  } catch (error: any) {
    console.error(`Error withdrawing: ${error.message}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Unhandled error: ${error.message}`);
  process.exitCode = 1;
});
```

### 4. Run the script

```sh
npx ts-node withdraw.ts
```

### 5. Output

You should see something like this:

```txt
Running script to withdraw ETH to L1
L1 Balance is 6539874840163375070
L2 Balance is 5712612651486983637
Withdraw transaction sent 0x4905176d42b4c3b4ab10f611e688b2d849e761493f4583119b7c7731b4254cf4
```

## Withdraw an ERC-20 token

### 1. Set up

Use the [zkSync Era cli](../../tools/zksync-cli/README.md) to set up a project.

```sh
npx zksync-cli@latest create ERC20_withdraw
```

### 2. Include the `.env` file at the project root

Copy/paste the `.env` file from above into the directory.

### 3. Create the script

- Create a new file `withdraw-erc20.ts` in the project directory and copy/paste the code below.

- Enter the `TOKEN_ADDRESS`  
- Adjust the `AMOUNT` if necessary.

```ts
import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || "";  // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet 

// ERC-20 Token address in L2
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
  console.log(`Running script to bridge ERC-20 to L1`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  // withdraw ERC-20 token to L2
  const withdrawErc20Handle = await wallet.withdraw({
    to: wallet.address,  // can bridge to a different address in L1
    token: TOKEN_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT), // assumes ERC-20 has 18 decimals
  });
  console.log(`Withdraw ERC-20 transaction sent ${withdrawErc20Handle.hash}`);

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Run the script

```sh
npx ts-node withdraw-erc20.ts
```

### 5. Output

You should see something like this:

```txt
Running script to bridge ERC-20 to L1
L1 Balance is 19421054769191270
L2 Balance is 2969626077250000000
Withdraw ERC-20 transaction sent 0x280a2168f464c93e8c56df3291076bbb6cff78ebdc30fdaad22bc275d56aa3ed
```