# Fair Onboarding Alpha

Fair Onboarding Alpha invites projects to deploy to mainnet ahead of the full public release. To register your project for participation fill out the form [here.](https://forms.gle/wXjWiEeg16eMCWKJ8)

## How Fair Onboarding works

During Fair Onboarding Alpha, registered addresses can bridge tokens to zkSync to deploy and test their products/protocols.

Once bridged, there are no restrictions on how tokens can be used within the system. For example, a registered address can send ETH to a non-registered address, after which the non-registered address can use them inside zkSync without restriction (interacting with any smart contract). With that said, the express purpose of Fair Onboarding is for contract deployment and testing — so we recommend keeping transactions within your team.

**Note:** While non-registered addresses can receive tokens, only registered addresses can call `finaliseWithdrawal` therefore sending assets back to L1. This changes when Fair Onboarding ends and L1 <> L2 communication becomes permissionless. 

## How to bridge assets

### Bridge with Portal

You can also bridge ETH or tokens with the UI provided by Matter Labs at [portal.zksync.io](http://portal.zksync.io). If a token you want to bridge is missing from the Portal drop down, you can request that we add it [here](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). 

### Bridge scripts

To deposit ETH you can use the `deposit` method of the `Deployer` class. Here is an example:

```tsx
import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTPS RPC endpoint
const MAINNET_RPC_ENDPOINT = "";

// Amount in ETH
const AMOUNT = "0.1";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key not configured in env file");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to deposit ETH in L2`);

  // Initialize the wallet.
  const provider = new Provider(MAINNET_RPC_ENDPOINT);

  const wallet = new Wallet(WALLET_PRIV_KEY, provider);

  // Create deployer object 
  const deployer = new Deployer(hre, wallet);

  // Deposit ETH to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT),
  });
  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Waiting for deposit to be processed in L2...`);
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log(`ETH available in L2`);
}
```

To deposit ERC20 tokens you’d use the same method but additionally pass the `approveERC20: true` option:

```tsx
import { Wallet, Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTPS RPC endpoint
const MAINNET_RPC_ENDPOINT = "";

// Token address
const TOKEN_ADDRESS = "";

// Amount of tokens 
const AMOUNT = "5";

const WALLET_PRIV_KEY = process.env.WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key not configured in env file");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to bridge ERC20 to L2`);

  // Initialize the wallet.
  const provider = new Provider(
    // @ts-ignore
    MAINNET_RPC_ENDPOINT || hre.config.networks.zkSyncTestnet.ethNetwork
  );
    
  const wallet = new Wallet(WALLET_PRIV_KEY, provider);

  // Create deployer object 
  const deployer = new Deployer(hre, wallet);

  // Deposit ERC20 tokens to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: TOKEN_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals
    // performs the ERC20 approve
    approveERC20: true,
  });

  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Waiting for deposit to be processed in L2...`);
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log(`ERC20 tokens available in L2`);
}
```

To run this script, make sure your `hardhat.config.ts` file is configured for zkSync ([find an example here](https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html). You can use `npx zksync-cli@latest create PROJECT_NAME` to scaffold a new project easily in case you don’t have one already.

Place the script files in the `deploy` folder and run:

```sh
 yarn hardhat zksync-deploy --script SCRIPT_FILENAME.ts
```

### Custom bridges

Registered addresses are free to bridge tokens to zkSync by building a custom bridge. Custom bridges are not currently supported in our UI. However if you are working on a custom bridge we would love to hear from you and discuss how we can offer support. You can find us at product@matterlabs.dev.

## How to deploy

If you need a general refresher on deploying to zkSync we recommend first reading [this section](https://era.zksync.io/docs/dev/building-on-zksync/contracts/contract-deployment.html) of our documentation — otherwise you may refer to our [Quickstart Guide](https://era.zksync.io/docs/dev/building-on-zksync/hello-world.html). 

To deploy your contracts to mainnet you need to include it in the `networks` section of your `hardhat.config.ts` file:

```jsx
networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
    zkSyncMainnet: {
      url: "https://zksync2-mainnet.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
    },
  },
```

In addition, make sure your config file imports the `@matterlabs/hardhat-zksync-deploy` and `@matterlabs/hardhat-zksync-solc` plugins and that they’re configured correctly. 

Once added, make sure your deployment scripts use the `Deployer` class from the `@matterlabs/hardhat-zksync-deploy` package. Run your deployment scripts with the `--network` flag (e.g. `yarn hardhat deploy-zksync --script deploy-greeter.ts --network zkSyncMainnet` . 

::: tip

Make sure you’ve deposited funds on zkSync before following the instructions above.

:::

You can find an example of the config file and deployment scripts in the [Quickstart Guide](https://v2-docs.zksync.io/dev/developer-guides/hello-world.html). If you have an existing project, you can follow the [Hardhat zkSync migration guide](https://v2-docs.zksync.io/api/hardhat/migrating-to-zksync.html).

## zkSync Era Mainnet details

You can add zkSync mainnet to your wallet using the details below:

- Network Name: `zkSync Era Mainnet`
- New RPC URL: `https://zksync2-mainnet.zksync.io`
- Chain ID: `324`
- Currency Symbol: `ETH`
- Block Explorer URL: `https://explorer.zksync.io/`
- WebSocket URL: `wss://zksync2-mainnet.zksync.io/ws`

## How to join

To register your project for Fair Onboarding fill out the form linked [here](https://forms.gle/wXjWiEeg16eMCWKJ8). You will need the following information:

- Your project name and description
- The address of your contracts on zkSync Era Testnet
- The L1 addresses you will use for bridging
- A list of any tokens you intend to bridge during Fair Onboarding

## Security measures

We have spent over $3.5M on the range of audits with Tier 1 auditing firms, independent researchers, and public audits by the community. Matter Labs will also lock value in the system — starting with 10 ETH at the beginning of Fair Onboarding Alpha. To add further protection the following security measure will be in place:

### Withdrawal & Deposit Limits

- **Deposit Limit**: As a general security precaution (and to keep the focus of Fair Onboarding on deployment and testing) each registered address can deposit a total of **10 ETH**. We advise only bridging up to **3 ETH.** This should be more than enough for deploying contracts and executing test transactions. When Fair Onboarding ends this limitation will be lifted.

- **Withdrawal Limit**: It is only possible to withdraw up to 10% of the total protocol balance of ETH per day. The purpose of this feature is to constrain the amount of value that can be withdrawn to L1 if an attacker finds vulnerabilities that allow unauthorised minting of tokens on L2. This feature will remain in place until the system reaches a sufficient level of maturity.

### Freezing

In keeping the safety of our users first, Matter Labs has the ability to freeze (and instantly upgrade) the system in the event of an emergency. When the system is frozen no activity on L1 or L2 is possible: transactions will not be processed and our API services will be shut down.

Freezing the system allows Matter Labs to address security vulnerabilities without ongoing risk to user assets. This feature will remain in place after Fair Onboarding Alpha and will be removed as we progressively decentralise over time.

**Note:** Functions that are executed automatically (e.g. collateral liquidation) will not work when the system is frozen.

## FAQ

### When does Fair Onboarding Alpha start?

February 16th.

### How do I sign up?

You can sign up for Fair Onboarding Alpha by filling out [this form](https://docs.google.com/forms/d/e/1FAIpQLSfdXAoQiHLu16ykEoOb762uvC1bAhdzOG-YDk6ju0YwPWf3Fw/viewform). We will aim to get back to you within a week.

### How do I add an ERC20 token to the Portal UI?

You can request additional tokens by filling out [this form](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). After you have submitted the form we will reach out if there are any issues. Generally we will aim to fulfil these requests within a week.

### How long will Fair Onboarding last?

We expect Fair Onboarding to last between 4 to 6 weeks.

### My project has been approved, how do I deploy?

Make sure you complete the instructions above to deposit ETH to zkSync. Then proceed to [our guide on deployment](#how-to-deploy) to launch your contracts.

### I need an official version of an ERC20/stablecoin for my project, but it doesn’t seem to be deployed. What do I do?

We are working with partners / stablecoin providers to provide native integrations and official deployments on zkSync.
