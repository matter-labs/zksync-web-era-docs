# Bridging assets

## Introduction

Bridging is implemented by having two contracts
(one deployed to L1, and the second deployed to L2)
communicating with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

Developers are free to build their own bridge for any token.
However, we provide our default bridges (one for ETH and one for ERC20 tokens), which can be used for basic bridging.

::: warning

Addresses of tokens on L2 will always differ from the same token L1 address.

:::
## Default bridges

You can get the default bridge addresses using the [`zks_getBridgeContracts`](../../../api/api.md#zks_getbridgecontracts) endpoint or [`getDefaultBridgeAddresses`](../../../api/js/providers.md#getdefaultbridgeaddresses) method of `Provider`. Similar methods are available in the other SDKs.

### Add tokens to the bridge

While the zkSync standard bridge can be used without permission from a smart contract perspective, the UI only displays tokens that have been added to our SDK. 

If you would like to add a token, submit a request by filling out the [token request form](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). Our team will review your request, and get back to you if we have any outstanding questions before adding the token to our list.


### Deposits (to L2)

Users must call the `deposit` method on the L1 bridge contract, which triggers the following actions:

- The user's L1 tokens will be sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.
- Within the L2 transaction, tokens will be minted and sent to the specified address on L2.
  - If the token does not exist on zkSync yet, a new contract is deployed for it. Given the L2 token address is deterministic (based on the original L1 address, name and symbol), it doesn't matter who is the first person bridging it, the new L2 address will be the same.
- For every executed L1 -> L2 transaction, there will be an L2 -> L1 log message confirming its execution.
- Lastly, the `finalizeDeposit` method is called and it finalizes the deposit and mints funds on L2.


### Deposit scripts

The examples below show scripts to deposit ETH and ERC20 tokens using the [Javascript SDK](../../../api/js/README.md). 

To scaffold a project run:

```sh
mkdir deposit-scripts && cd deposit-scripts
npm init -y 
npm i typescript ts-node ethers@^5.7.2 zksync-web3 dotenv

```

Create an `.env` file with your private key and the L1 RPC endpoint, which will be loaded as environment variables:

```text
WALLET_PRIV_KEY=
L1_RPC_ENDPOINT=
```
::: tip

You can find RPC endpoints for Goerli and Ethereum mainnet on [Chainlist](https://chainlist.org/). 

:::

#### Deposit ETH script


Here is an example of how to deposit ETH with the `deposit` method from the `Wallet` class of [Javascript SDK](../../../api/js/getting-started.md).

```ts
// Filename deposit.ts

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

Adjust the `AMOUNT` variable and run the script with `ts-node`:

```sh
ts-node deposit.ts
```

#### Deposit ERC20 tokens script

To deposit ERC20 tokens, use the same method but pass the `approveERC20: true` option. Here's an example:

```ts
// Filename deposit-erc20.ts

import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.L1_RPC_ENDPOINT || "";  // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://testnet.era.zksync.dev"; // or the zkSync Era mainnet 

// ERC20 Token address in L1
const TOKEN_ADDRESS = "";

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
  throw new Error("Missing address of the ERC20 token in L1");
}

async function main() {
  console.log(`Running script to bridge ERC20 to L2`);

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
    amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals
    // performs the ERC20 approve action
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
<<<<<<< HEAD
Enter the `TOKEN_ADDRESS`, adjust the `AMOUNT`, and run this script with `ts-node`:
=======

To run this script, configure your `hardhat.config.ts` file as explained in this [guide](../../../tools/hardhat/hardhat-zksync-deploy.md), or use the command `npx zksync-cli@latest create PROJECT_NAME` to scaffold a new project.

Once your `hardhat.config.ts` file is configured, place the script files in the `deploy` folder and run them with the following command:
>>>>>>> 978275964a8fafd3bb0ec57495812b650baf38be

```sh
ts-node deposit-erc20.ts
```

### Withdrawals (to L1)

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../../troubleshooting/withdrawal-delay.md).
:::

Users must call the `withdraw` method on the L2 bridge contract, which will trigger the following actions:

- L2 tokens will be burned.
- An L2 -> L1 message with the information about the withdrawal will be sent.
- After that, the withdrawal action will be available to be finalized by anyone in the L1 bridge (by proving the inclusion of the L2 -> L1 message, which is done when calling the `finalizeWithdrawal` method on the L1 bridge contract).
- After the method is called, the funds are unlocked from the L1 bridge and sent to the withdrawal recipient.

::: warning
On the testnet environment, we automatically finalize all withdrawals, i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.
:::

### Withdraw scripts

To withdraw ETH or ERC20 tokens with [Javascript SDK](../../../api/js/README.md), use the same scripts but call the `withdraw` method of the `Wallet` class.

To withdraw ETH use:

```ts
// Initialize the wallet.
const l1provider = new Provider(L1_RPC_ENDPOINT);
const l2provider = new Provider(L2_RPC_ENDPOINT);
const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

// withdraw ETH to L2
const withdrawHandle = await wallet.withdraw({
  to: wallet.address,  // can bridge to a different address in L2
  token: token: utils.ETH_ADDRESS,,
  amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals

});
console.log(`Withdraw ETH transaction sent ${withdrawHandle.hash}`);
```
To withdraw an ERC20 token use:

```ts

// Initialize the wallet.
const l1provider = new Provider(L1_RPC_ENDPOINT);
const l2provider = new Provider(L2_RPC_ENDPOINT);
const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

// withdraw ERC20 token to L2
const withdrawErc20Handle = await wallet.withdraw({
  to: wallet.address,  // can bridge to a different address in L2
  token: TOKEN_ADDRESS,
  amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals
  // performs the ERC20 approve action
  approveERC20: true,
});
console.log(`Withdraw ERC20 transaction sent ${withdrawErc20Handle.hash}`);

```

## Custom bridges on L1 and L2

To build a custom bridge, create a regular Solidity contract which extends the correct interface for the layer. The interfaces provide access to the zkSync Era SDK deposit and withdraw implementations.

- L1: [IL1Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/interfaces/IL1Bridge.sol)

  For more information, check out our example [L1 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/L1ERC20Bridge.sol).


- L2: [L2ERC20Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol)

  For more information, check out our example [L2 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol).
