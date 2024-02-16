---
head:
  - - meta
    - name: "twitter:title"
      content: API3 | zkSync Docs
---

# API3

In this guide, we'll create a paymaster on zkSync Era, enabling transactions to be paid using the `mockUSDC` ERC20 token, all while harnessing API3's dAPIs for accurate, decentralized price feeds.

[API3➚](https://api3.org/) offers decentralized API services to blockchain platforms. API3 empowers smart contracts with its data feeds, termed [dAPIs➚](https://docs.api3.org/guides/dapis/subscribing-self-funded-dapis/). These dAPIs, sourced from first-party oracles, constantly relay signed, updated on-chain data.

For our paymaster, we'll integrate dAPIs to fetch live [ETH/USD](https://market.api3.org/dapis/zksync-goerli-testnet/ETH-USD) and [USDC/USD](https://market.api3.org/dapis/zksync-goerli-testnet/USDC-USD) rates, facilitating users to settle their gas costs in USDC equivalent.

**Data Feed Addresses:**

<table><thead><tr><th width="156">Price Pair</th><th width="353.3333333333333">Address</th><th>Network</th></tr></thead><tbody><tr><td>ETH / USD</td><td><code>0x28ce555ee7a3daCdC305951974FcbA59F5BdF09b</code></td><td>zkSync Testnet</td></tr><tr><td>USDC / USD</td><td><code>0x946E3232Cc18E812895A8e83CaE3d0caA241C2AB</code></td><td>zkSync Testnet</td></tr></tbody></table>

### Prerequisites

- **Knowledge Base**: Familiarity with deploying smart contracts.
- **Wallet Setup**: Have MetaMask installed and set up, ensuring there's a balance on the zkSync Testnet.
- **Tooling**: This guide utilizes [`zksync-cli`](../../tooling/zksync-cli/getting-started.md). Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding the **mockUSDCPaymaster contract**

The `mockUSDCPaymaster` contract offers a refined experience for users by allowing them to pay gas fees using `mockUSDC` instead of `ETH`. This not only provides flexibility in transaction costs but also integrates real-time data feeds to determine the exact value of `USDC` and `ETH` using API3 dAPIs.

**Key components:**

- **setDapiProxy**: A function to set the dAPI proxies for allowed tokens. The function stores the proxy addresses for USDC and ETH, which are then used to fetch real-time price data.
- **readDapi**: A function that, given a dAPI proxy address, returns the real-time value. In the contract, it's used to fetch the current values of `USDC` and `ETH`.
- **validateAndPayForPaymasterTransaction**: This function validates the transaction, ensures the received token makes the allowed token, fetches real-time ETH and USRC prices using dAPIs, and calculate the required ERC20 tokens equivalent to the value of required ETH.

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/interfaces/IPaymaster.sol) interface. We will be using `zksync-cli` to bootstrap the boilerplate code for this paymaster.

### Step 2 — Environment setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

<pre class="language-bash"><code class="lang-bash"><strong>npx zksync-cli create mockUSDCPaymaster
</strong></code></pre>

Choose `Hardhat + Solidity` to setup the project repository. The contract for this guide exists under `/contracts/ApprovalPaymaster.sol`.

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance.

**Add the required dependencies to the project:**

::: code-tabs

@tab:active yarn

```bash
yarn add -D @openzeppelin/contracts-upgradeable @api3/contracts
```

@tab npm

```bash
npm install @openzeppelin/contracts-upgradeable @api3/contracts
```

:::

### Step 3 - Implementing contracts

Create a `mockUSDC.sol` contract to emulate a USDC equivalent in the `/contracts` directory. Populate the file with the provided code:

<details>

<summary>mockUSDC.sol</summary>

```solidity

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function mint(address _to, uint256 _amount) public returns (bool) {
        _mint(_to, _amount);
        return true;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
```

</details>

Using the `ApprovalPaymaster.sol` contract, add the following imports:

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";
```

Inherit `Ownable` and declare the following public variables:

```solidity
contract ApprovalPaymaster is IPaymaster, Ownable {
    address public allowedToken;
    address public USDCdAPIProxy;
    address public ETHdAPIProxy;
    uint256 public requiredETH;
}
```

Make a `public` `onlyOwner` function to set dAPI proxies:

```solidity
// Set dapi proxies for the allowed token/s
function setDapiProxy(address _USDCproxy, address _ETHproxy)
    public onlyOwner {
        USDCdAPIProxy = _USDCproxy;
        ETHdAPIProxy = _ETHproxy;
}
```

Make a `public` `view` function to read the dAPI values. This will read the price of **ETH/USD** and **USDC/USD** data feeds:

```solidity
// read the price of ETH/USD and USDC/USD data feeds
function readDapi(address _dapiProxy) public view returns (uint256) {
   (int224 value, ) = IProxy(_dapiProxy).read();
   uint256 price = uint224(value);
   return price;
}
```

Inside `validateAndPayForPaymasterTransaction()`, invoke the `readDapi()` function and add the logic to calculate the required USDC to be sent by the user:

```solidity
// Read values from the dAPIs
uint256 ETHUSDCPrice = readDapi(ETHdAPIProxy);
uint256 USDCUSDPrice = readDapi(USDCdAPIProxy);

requiredETH = _transaction.gasLimit *
    _transaction.maxFeePerGas;

// Calculate the required ERC20 tokens to be sent to the paymaster
// (Equal to the value of requiredETH)
uint256 requiredERC20 = (requiredETH * ETHUSDCPrice)/USDCUSDPrice;
require(
    providedAllowance >= requiredERC20,
    "Min paying allowance too low"
);
```

Update the try-catch block to transfer the exact `requiredERC20` amount:

```solidity
 try
    IERC20(token).transferFrom(userAddress, thisAddress, requiredERC20)
{} catch (bytes memory revertReason) {
    // If the revert reason is empty or represented by just a function selector,
    // we replace the error with a more user-friendly message
    if (requiredERC20 > amount) {
        revert("Not the required amount of tokens sent");
    }
    if (revertReason.length <= 4) {
        revert("Failed to transferFrom from users' account");
    } else {
        assembly {
            revert(add(0x20, revertReason), mload(revertReason))
        }
    }
}
```

The full paymaster implementation can be viewed here:

<details>

<summary>mockUSDCPaymaster.sol</summary>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC}
from  "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from  "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract ApprovalPaymaster is IPaymaster, Ownable {

    address public allowedToken;
    address public USDCdAPIProxy;
    address public ETHdAPIProxy;
    uint256 public requiredETH;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );
        // Continue execution if called from the bootloader.
        _;
    }

    constructor(address _erc20) {
        allowedToken = _erc20;
    }

    // Set dapi proxies for the allowed token/s
    function setDapiProxy(address _USDCproxy, address _ETHproxy)
    public onlyOwner {
        USDCdAPIProxy = _USDCproxy;
        ETHdAPIProxy = _ETHproxy;
    }

    function readDapi(address _dapiProxy) public view returns (uint256) {
        (int224 value, ) = IProxy(_dapiProxy).read();
        uint256 price = uint224(value);
        return price;
    }

    function validateAndPayForPaymasterTransaction (
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) onlyBootloader external payable returns (bytes4 magic, bytes memory context) {
        // By default we consider the transaction as accepted.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
        require(
            _transaction.paymasterInput.length >= 4,
            "The standard paymaster input must be at least 4 bytes long"
        );

        bytes4 paymasterInputSelector = bytes4(
            _transaction.paymasterInput[0:4]
        );
        if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            // While the transaction data consists of address, uint256 and bytes data,
            // the data is not needed for this paymaster
            (address token, uint256 amount, bytes memory data) = abi.decode(
                _transaction.paymasterInput[4:],
                (address, uint256, bytes)
            );

            // Verify if token is the correct one
            require(token == allowedToken, "Invalid token");

            // We verify that the user has provided enough allowance
            address userAddress = address(uint160(_transaction.from));

            address thisAddress = address(this);

            uint256 providedAllowance = IERC20(token).allowance(
                userAddress,
                thisAddress
            );
            // Read values from the dAPIs

            uint256 ETHUSDCPrice = readDapi(ETHdAPIProxy);
            uint256 USDCUSDPrice = readDapi(USDCdAPIProxy);

            requiredETH = _transaction.gasLimit *
                _transaction.maxFeePerGas;

            // Calculate the required ERC20 tokens to be sent to the paymaster
            // (Equal to the value of requiredETH)

            uint256 requiredERC20 = (requiredETH * ETHUSDCPrice)/USDCUSDPrice;
            require(
                providedAllowance >= requiredERC20,
                "Min paying allowance too low"
            );

            // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
            // neither paymaster nor account are allowed to access this context variable.
            try
                IERC20(token).transferFrom(userAddress, thisAddress, requiredERC20)
            {} catch (bytes memory revertReason) {
                // If the revert reason is empty or represented by just a function selector,
                // we replace the error with a more user-friendly message
                if (requiredERC20 > amount) {
                    revert("Not the required amount of tokens sent");
                }
                if (revertReason.length <= 4) {
                    revert("Failed to transferFrom from users' account");
                } else {
                    assembly {
                        revert(add(0x20, revertReason), mload(revertReason))
                    }
                }
            }

            // The bootloader never returns any data, so it can safely be ignored here.
            (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{
                value: requiredETH
            }("");
            require(success, "Failed to transfer funds to the bootloader");
        } else {
            revert("Unsupported paymaster flow");
        }
    }

    function postTransaction  (
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) onlyBootloader external payable override {
    }

    receive() external payable {}
}
```

</details>

### Step 4 — Deploy the contract

Create a new file under `/deploy`, for example `deploy-mockUSDCPaymaster.ts`. Insert the provided script:

<details>

<summary>Deployment script</summary>

```typescript
import { Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

require("dotenv").config();
// load wallet private key from env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  // ⚠️ Never commit private keys to file tracking history, or your account could be compromised.
  const wallet = new Wallet(PRIVATE_KEY);
  // The wallet that will receive ERC20 tokens
  const emptyWallet = Wallet.createRandom();
  console.log(`Empty wallet's address: ${emptyWallet.address}`);
  console.log(`Empty wallet's private key: ${emptyWallet.privateKey}`);

  const deployer = new Deployer(hre, wallet);

  // Deploying the ERC20 token
  const erc20Artifact = await deployer.loadArtifact("MyERC20");
  const erc20 = await deployer.deploy(erc20Artifact, ["USDC", "USDC", 18]);
  console.log(`ERC20 address: ${erc20.address}`);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("MyPaymaster");
  const paymaster = await deployer.deploy(paymasterArtifact, [erc20.address]);
  console.log(`Paymaster address: ${paymaster.address}`);

  // Supplying paymaster with ETH.
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.05"),
    })
  ).wait();

  // Setting the dAPIs in Paymaster. Head over to the API3 Market (https://market.api3.org) to verify dAPI proxy contract addresses and whether they're funded or not.
  const ETHUSDdAPI = "0x28ce555ee7a3daCdC305951974FcbA59F5BdF09b";
  const USDCUSDdAPI = "0x946E3232Cc18E812895A8e83CaE3d0caA241C2AB";
  const setProxy = paymaster.setDapiProxy(USDCUSDdAPI, ETHUSDdAPI);
  await (await setProxy).wait();
  console.log("dAPI Proxies Set!");

  // Deploying the Greeter contract
  const greeterContractArtifact = await deployer.loadArtifact("Greeter");
  const oldGreeting = "old greeting";
  const deployGreeter = await deployer.deploy(greeterContractArtifact, [oldGreeting]);
  console.log(`Greeter contract address: ${deployGreeter.address}`);

  // Supplying the ERC20 tokens to the empty wallet:
  await // We will give the empty wallet 5k mUSDC:
  (await erc20.mint(emptyWallet.address, "5000000000000000000000")).wait();

  console.log("Minted 5k mUSDC for the empty wallet");

  console.log(`Done!`);
}
```

</details>

The provided script deploys the `mockUSDC`, the `Greeter`, and the `Paymaster` contracts. After this, an empty wallet is created, and 5,000 `mockUSDC` tokens are minted for the paymaster's use. The `Paymaster` contract also receives 0.05 ETH to cover transaction fees. Additionally, the script calls the `setDapiProxy` method, assigning the necessary proxy addresses for on-chain dAPIs, and sets the initial `greeting` value.

Compile the contract:

```bash
yarn hardhat compile
```

Once compiled, deploy using:

```bash
yarn hardhat deploy-zksync --script deploy-mockUSDCPaymaster.ts
```

### Step 5 — Interact with contract

To interact with contract update the `.env` file with the following items derived from the deployment script that ran previously:

```
PRIVATE_KEY=
PAYMASTER_ADDRESS=
TOKEN_ADDRESS=
EMPTY_WALLET_PRIVATE_KEY=
GREETER_CONTRACT=
```

Create a new file under `/deploy`, for example `use-mockUSDCPaymaster.ts`. Insert the provided script:

<details>

<summary>use-mockUSDCPaymaster.ts</summary>

```typescript
import { ContractFactory, Provider, utils, Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

require("dotenv").config();

// Put the address of the deployed paymaster and the Greeter Contract in the .env file
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS || "";
const GREETER_CONTRACT_ADDRESS = process.env.GREETER_CONTRACT || "";

// Put the address of the ERC20 token in the .env file:
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";

function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
  const artifact = hre.artifacts.readArtifactSync("MyERC20");
  return new ethers.Contract(TOKEN_ADDRESS, artifact.abi, wallet);
}

// Greeter contract
function getGreeter(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
  const artifact = hre.artifacts.readArtifactSync("Greeter");
  return new ethers.Contract(GREETER_CONTRACT_ADDRESS, artifact.abi, wallet);
}

// Wallet private key
// ⚠️ Never commit private keys to file tracking history, or your account could be compromised.
const EMPTY_WALLET_PRIVATE_KEY = process.env.EMPTY_WALLET_PRIVATE_KEY || "";
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://testnet.era.zksync.dev");
  const emptyWallet = new Wallet(EMPTY_WALLET_PRIVATE_KEY, provider);

  // Obviously this step is not required, but it is here purely to demonstrate that indeed the wallet has no ether.
  const ethBalance = await emptyWallet.getBalance();
  if (!ethBalance.eq(0)) {
    throw new Error("The wallet is not empty");
  }

  const erc20Balance = await emptyWallet.getBalance(TOKEN_ADDRESS);
  console.log(`ERC20 balance of the user before tx: ${erc20Balance}`);

  const greeter = getGreeter(hre, emptyWallet);
  const erc20 = getToken(hre, emptyWallet);

  const gasPrice = await provider.getGasPrice();

  // Loading the Paymaster Contract
  const deployer = new Deployer(hre, emptyWallet);
  const paymasterArtifact = await deployer.loadArtifact("MyPaymaster");

  const PaymasterFactory = new ContractFactory(paymasterArtifact.abi, paymasterArtifact.bytecode, deployer.zkWallet);
  const PaymasterContract = PaymasterFactory.attach(PAYMASTER_ADDRESS);

  // Estimate gas fee for the transaction
  const gasLimit = await greeter.estimateGas.setGreeting("new updated greeting", {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: utils.getPaymasterParams(PAYMASTER_ADDRESS, {
        type: "ApprovalBased",
        token: TOKEN_ADDRESS,
        // Set a large allowance just for estimation
        minimalAllowance: ethers.BigNumber.from(`100000000000000000000`),
        // Empty bytes as testnet paymaster does not use innerInput
        innerInput: new Uint8Array(),
      }),
    },
  });

  // Gas estimation:
  const fee = gasPrice.mul(gasLimit.toString());
  console.log(`Estimated ETH FEE (gasPrice * gasLimit): ${fee}`);

  // Calling the dAPI to get the ETH price:
  const ETHUSD = await PaymasterContract.readDapi("0x28ce555ee7a3daCdC305951974FcbA59F5BdF09b");
  const USDCUSD = await PaymasterContract.readDapi("0x946E3232Cc18E812895A8e83CaE3d0caA241C2AB");

  // Checks old allowance (for testing purposes):
  const checkSetAllowance = await erc20.allowance(emptyWallet.address, PAYMASTER_ADDRESS);
  console.log(`ERC20 allowance for paymaster : ${checkSetAllowance}`);

  console.log(`ETH/USD dAPI Value: ${ETHUSD}`);
  console.log(`USDC/USD dAPI Value: ${USDCUSD}`);

  // Calculating the USD fee:
  const usdFee = fee.mul(ETHUSD).div(USDCUSD);
  console.log(`Estimated USD FEE: ${usdFee}`);

  console.log(`Current message is: ${await greeter.greet()}`);

  // Encoding the "ApprovalBased" paymaster flow's input
  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: "ApprovalBased",
    token: TOKEN_ADDRESS,
    // set minimalAllowance to the estimated fee in erc20
    minimalAllowance: ethers.BigNumber.from(usdFee),
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(),
  });

  await (
    await greeter.connect(emptyWallet).setGreeting(`new greeting updated at ${new Date().toUTCString()}`, {
      // specify gas values
      maxFeePerGas: gasPrice,
      maxPriorityFeePerGas: 0,
      gasLimit: gasLimit,
      // paymaster info
      customData: {
        paymasterParams: paymasterParams,
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      },
    })
  ).wait();

  const newErc20Balance = await emptyWallet.getBalance(TOKEN_ADDRESS);

  console.log(`ERC20 Balance of the user after tx: ${newErc20Balance}`);
  console.log(`Transaction fee paid in ERC20 was ${erc20Balance.sub(newErc20Balance)}`);
  console.log(`Message in contract now is: ${await greeter.greet()}`);
}
```

</details>

Run the script:

```bash
yarn hardhat deploy-zksync --script use-mockUSDCPaymaster.ts
```

The wallet had 5000 mUSDC after running the deployment script. After sending the transaction to update the `Greeting` contract, we are now left with 4998.92 mUSDC. The script used mUSDC to cover the gas costs for the update transaction!
