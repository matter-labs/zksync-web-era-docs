---
head:
  - - meta
    - name: "twitter:title"
      content: Gasless | zkSync Era Docs
---

# Gasless

### Introduction

zkSync's native account abstraction allows contracts to cover transaction fees on behalf of users, significantly improving user experience. The **`GaslessPaymaster`** contract offers a method to deploy a universal paymaster which ensures transactions are gasless for users.&#x20;

This guide describes the process of setting up and deploying the **`GaslessPaymaster`** contract.

{% hint style="info" %}
For detailed explanations of the IPaymaster interface please refer to the documentation [here](https://era.zksync.io/docs/reference/concepts/account-abstraction.html#ipaymaster-interface).
{% endhint %}

### Prerequisites

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Have MetaMask installed and set up, ensuring there's a balance on the zkSync testnet.&#x20;
- **Tooling**: This guide utilizes [`zksync-cli`](../../../tooling/zksync-cli.md). Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding the GaslessPaymaster contract

The `GaslessPaymaster` contract ensures that transaction fees are handled automatically without user intervention.

Key components:

- **validateAndPayForPaymasterTransaction**: This function validates the transaction, calculates the required ETH based on gas limits, and transfers the fees to the bootloader.

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IPaymaster.sol) interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### Step 2 — Environment setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

<pre class="language-bash"><code class="lang-bash"><strong>npx zksync-cli@latest create-project gaslessPaymaster
</strong></code></pre>

Choose `Hardhat + Solidity` to setup the project repository. The contract for this guide exists under `/contracts/GeneralPaymaster.sol`.&#x20;

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance.

### Step 3 — Updating the contract

No modifications are needed for gasless transactions since the provided `GeneralPaymaster` contract is already configured for this purpose. With no restrictions on its usage.&#x20;

Reviewing the `validateAndPayForPaymasterTransaction` function reveals its simplicity: it only verifies that the paymaster holds sufficient ETH.

### Step 4 — Deploy the contract

Create a new file under `/deploy`, for example `deploy-gaslessPaymaster.ts`. Insert the provided script:

<details>

<summary>Deployment script</summary>

```typescript
import { Provider, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY) throw "⛔️ Private key not detected! Add it to the .env file!";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the GaslessPaymaster contract...`);
  const provider = new Provider("https://testnet.era.zksync.dev");

  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("GaslessPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, []);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, []);
  console.log(`Paymaster address: ${paymaster.address}`);

  console.log("Funding paymaster with ETH");
  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymaster.address);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
  console.log(`Done!`);
}
```

</details>

{% hint style="info" %}
Be sure to add your private key to the `.env` file.&#x20;
{% endhint %}

The provided script takes care of loading environment variables, setting up a deployment wallet with the private key specified in an `.env` file, contract deployment and funding the paymaster. You can adjust the amount of ETH to fund the paymaster to your needs.&#x20;

Compile the contract:

```bash
yarn hardhat compile
```

Once compiled, deploy using:

```bash
yarn hardhat deploy-zksync --script gaslessPaymaster.ts
```

### Step 5 — Testing the contract

To verify the functionality of the GaslessPaymaster contract, let's draft a quick test. Set it up by creating `gaslessTest.test.ts` in the `/test` directory and populating it with the provided script:

<details>

<summary>gasless.test.ts</summary>

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import hardhatConfig from "../hardhat.config";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as hre from "hardhat";
import * as ethers from "ethers";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

describe("GaslessPaymaster", function () {
  let provider: Provider;
  let wallet: Wallet;
  let deployer: Deployer;
  let emptyWallet: Wallet;
  let userWallet: Wallet;
  let ownerInitialBalance: ethers.BigNumber;
  let paymaster: Contract;
  let greeter: Contract;

  before(async function () {
    [provider, wallet, deployer] = setupDeployer(hardhatConfig.networks.zkSyncTestnet.url, PRIVATE_KEY);
    emptyWallet = Wallet.createRandom();
    userWallet = new Wallet(emptyWallet.privateKey, provider);
    paymaster = await deployContract(deployer, "GaslessPaymaster", []);
    greeter = await deployContract(deployer, "Greeter", ["Hi"]);
    await fundAccount(wallet, paymaster.address, "3");
    ownerInitialBalance = await wallet.getBalance();
  });

  async function executeGreetingTransaction(user: Wallet) {
    const gasPrice = await provider.getGasPrice();
    const paymasterParams = utils.getPaymasterParams(paymaster.address, {
      type: "General",
      innerInput: new Uint8Array(),
    });

    const setGreetingTx = await greeter.connect(user).setGreeting("Hola, mundo!", {
      maxPriorityFeePerGas: ethers.BigNumber.from(0),
      maxFeePerGas: gasPrice,
      gasLimit: 6000000,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    });

    await setGreetingTx.wait();
    return wallet.getBalance();
  }

  it("Owner can update message for free", async function () {
    const newBalance = await executeGreetingTransaction(userWallet);
    expect(await greeter.greet()).to.equal("Hola, mundo!");
    expect(newBalance).to.eql(ownerInitialBalance);
  });

  async function deployContract(deployer: Deployer, contract: string, params: any[]): Promise<Contract> {
    const artifact = await deployer.loadArtifact(contract);
    return await deployer.deploy(artifact, params);
  }

  async function fundAccount(wallet: Wallet, address: string, amount: string) {
    await (await wallet.sendTransaction({ to: address, value: ethers.utils.parseEther(amount) })).wait();
  }

  function setupDeployer(url: string, privateKey: string): [Provider, Wallet, Deployer] {
    const provider = new Provider(url);
    const wallet = new Wallet(privateKey, provider);
    const deployer = new Deployer(hre, wallet);
    return [provider, wallet, deployer];
  }
});
```

</details>

This script tests whether the GaslessPaymaster contract permits a user to modify a message in the "Greeter" contract without incurring any gas charges. The necessary paymaster parameters are provided when invoking the `setGreeting` method, showcasing our gasless paymaster in action.

To execute test:

```bash
yarn hardhat test
```

### Conclusion

The `GaslessPaymaster` contract provides an effortless way to cover gas fees, ensuring a seamless experience for users. It represents a breakthrough for dApps and businesses aiming to increase adoption by making user transactions gasless. You can add protocol specific validations for more control, an adaptation of which can be reviewed in the next section. &#x20;
