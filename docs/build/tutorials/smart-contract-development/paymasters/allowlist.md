---
head:
  - - meta
    - name: "twitter:title"
      content: AllowList | zkSync Docs
---

# AllowList

### Introduction

zkSync offers native account abstraction enabling contracts to pay transaction fees on behalf of users. The **AllowlistPaymaster** contract is one such way to utilize this, paying fees for a specified list of approved users, hence enhancing user experience by alleviating gas cost concerns.

This guide will outline the process of creating an AllowlistPaymaster contract to cover the gas fees of certain users. It provides an overview of the smart contract developed, and the steps required to deploy and operate it.;

:::info
For detailed explanations of the IPaymaster interface please refer to the documentation [here](../../../developer-reference/account-abstraction.md#ipaymaster-interface).
:::

### Prerequisites

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Have MetaMask installed and set up, ensuring there's a balance on the zkSync testnet.;
- **Tooling**: This guide utilizes [`zksync-cli`](../../../tooling/zksync-cli/getting-started.md). Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding the AllowlistPaymaster Contract

The `AllowlistPaymaster` contract is designed to be owned by an account that controls its operations. It maintains a list of addresses which are allowed to have their gas fees paid for by this contract.

Key components:

- **allowList**: A mapping to track addresses that are allowed to utilize this Paymaster.
- **validateAndPayForPaymasterTransaction**: The validation logic that checks if a given address is on the allow list.;
- **setBatchAllowance**: Allows the owner to update the allowList in batches for efficiency.

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/interfaces/IPaymaster.sol) interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### Step 2 — Environment Setup

Using `zksync-cli` we will create a new project with the required dependencies and boilerplate paymaster implementations:

```sh
npx zksync-cli@latest create gaslessPaymaster
```

Choose the following options:

```sh
? What type of project do you want to create? Contracts
? Ethereum framework Ethers v6
? Template Hardhat + Solidity
? Private key of the wallet responsible for deploying contracts (optional)
? Package manager yarn
```

The contract for this guide exists under `/contracts/GeneralPaymaster.sol`.

**Update the Environment File**:

If you didn't enter your wallet private key in the CLI prompt, enter it in the `.env` file.

Ensure your account has a sufficient balance.

### Step 3 — Updating the Contract

For convenience, rename the `GeneralPaymaster.sol` contract to `AllowlistPaymaster.sol` also changing the name of the contract in the source file.

Add the `allowList` mapping and event emit line to the contract:

```solidity
contract AllowlistPaymaster is IPaymaster, Ownable {
    // The paymaster will pay the gas fee for the accounts in allowList
    mapping(address => bool) public allowList;
    // Emits events when list has been updated
    event UpdateAllowlist(address _target, bool _allowed);
```

The `allowList` mapping will be used to track addresses that are allowed to utilize this Paymaster, and we will emit an event whenever the list has been updated.

Add a constructor method that adds the owner to the list:

```solidity
constructor() {
  // adds owner to allow list
  allowList[msg.sender] = true;
}
```

We need to include the validation logic in the `validateAndPayForPaymasterTransaction` function in the contract. Insert the following code under the `if(paymasterInputSelector == IPaymasterFlow.general.selector){` condition check:

```solidity
// extract the address from the Transaction object
address userAddress = address(uint160(_transaction.from));

// checks if account is in allowList
bool isAllowed = allowList[userAddress];
// validates if address is on the allowList
require(isAllowed, "Account is not in allow list");
```

During the validation step, the contract will check if the address is included in our `allowList` mapping, if not the account will be required to pay their gas costs.

Next, we need to include the ability to update the `allowList` in batches. Add the following function to the contract:

```solidity
function setBatchAllowance(
    address[] calldata _targets,
    bool[] calldata _allowances
) external onlyOwner {
    uint256 targetsLength = _targets.length;
    require(
        targetsLength == _allowances.length,
        "Account and permission lists should have the same length"
    ); // The size of arrays should be equal

    for (uint256 i = 0; i < targetsLength; i++) {
        _setAllowance(_targets[i], _allowances[i]);
    }
}

function _setAllowance(address _target, bool _allowed) internal {
    bool isAllowed = allowList[_target];

    if (isAllowed != _allowed) {
        allowList[_target] = _allowed;
        emit UpdateAllowlist(_target, _allowed);
    }
}
```

The contract checks if the number of addresses in `_targets` matches the number of permissions in `_allowances`. If they don't match, it reverts the transaction with an error message. For each address, it sets its allowance using the `_setAllowance` function. Fetching the current allowance status of the `_target` address, compares the current status with the new status `_allowed`. If the statuses differ, it updates the `allowList` mapping with the new status.

### Step 4 — Deploy the Contract

Create a new file under `/deploy`, for example `deploy-allowListPaymaster.ts`. Insert the provided script:

```typescript
import { Provider, Wallet } from "zksync-ethers";
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
  console.log(`Running deploy script for the AllowlistPaymaster contract...`);
  const provider = new Provider("https://sepolia.era.zksync.dev");

  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("AllowlistPaymaster");
  const deploymentFee = await deployer.estimateDeployFee(paymasterArtifact, []);
  const parsedFee = ethers.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  // Deploy the contract
  const paymaster = await deployer.deploy(paymasterArtifact, []);
  const paymasterAddress = await paymaster.getAddress();
  console.log(`Paymaster address: ${paymasterAddress}`);
  console.log(`Contract owner added to allow list: ${wallet.address}`);

  console.log("Funding paymaster with ETH");
  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymasterAddress,
      value: ethers.parseEther("0.005"),
    })
  ).wait();

  let paymasterBalance = await provider.getBalance(paymasterAddress);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);
  console.log(`Done!`);
}
```

:::info
Be sure to add your private key to the `.env` file.;
:::

The provided script takes care of loading environment variables, setting up a deployment wallet with the private key specified in an `.env` file, contract deployment and funding the paymaster. You can adjust the amount of ETH to fund the paymaster to your needs.;

Compile the contract:

```bash
yarn hardhat compile
```

Once compiled, deploy using:

```bash
yarn hardhat deploy-zksync --script deploy-allowListPaymaster.ts
```

### Step 5 — Managing the Allowlist

As the owner of the contract, you can now:

- **Add users to the allowList**: Use `setBatchAllowance` to add multiple users at once. Provide an array of addresses and a corresponding array of boolean values (true for allowing).
- **Remove users from the allowList**: Again use `setBatchAllowance`, but provide `false` for the addresses you want to remove.

### Conclusion

The AllowlistPaymaster contract on zkSync Era offers a streamlined approach to improve user experience by covering their gas fees. Through an effective management of the allowList, dApp developers and businesses can absorb transaction costs for their users, fostering growth and adoption.

For a deeper dive and further optimization of the AllowlistPaymaster, consider consulting zkSync's official documentation and developer community forums.
