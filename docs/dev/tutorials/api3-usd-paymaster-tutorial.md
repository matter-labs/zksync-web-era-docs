# USDC paymaster tutorial with API3 dAPIs

This tutorial shows you how to build a custom paymaster that allows users to pay fees with a `mockUSDC` ERC20 token. You will:

- Create a paymaster that takes `mockUSDC` as gas to cover the transaction cost.
- Create the `mockUSDC` token contract and send some tokens to a new wallet.
- Send a `greet` transaction to update the greeting from the newly created wallet via the paymaster. Although the transaction normally requires ETH to pay the gas fee, our paymaster executes the transaction in exchange for the same USDC value.
- Utilize API3 data feeds within a paymaster.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed on your machine.
- Make sure your machine satisfies the [zksolc compiler system requirements](https://github.com/matter-labs/era-compiler-solidity/tree/main#system-requirements).
- You are already familiar with deploying smart contracts on zkSync Era. If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).
- You already have some experience working with Ethereum.
- You have a web3 wallet app that holds some Goerli test ETH and some zkSync test ETH.
- You know how to get your [private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

## Use API3's self-funded dAPIs to pay gas in USDC with the zkSync Era paymaster

[API3➚](https://api3.org/) is a collaborative project that delivers traditional API services to smart contract platforms in a decentralized and trust-minimized way. It is governed by a decentralized autonomous organization (DAO), namely the [API3 DAO](https://api3.org/dao).

API3 data feeds are known as [dAPIs➚](https://docs.api3.org/guides/dapis/subscribing-self-funded-dapis/). These provide access to on-chain data feeds sourced from off-chain first-party oracles owned and operated by API providers. Data feeds are continuously updated by first-party oracles using signed data.

Within a paymaster, price oracles provide price data on-chain for execution.

For this paymaster tutorial, we use dAPIs to get the price of [ETH/USD](https://market.api3.org/dapis/zksync-goerli-testnet/ETH-USD) and [USDC/USD](https://market.api3.org/dapis/zksync-goerli-testnet/USDC-USD) datafeeds, and then calculate gas in USDC value so that users can pay for their transactions with USDC.

::: note
- If you want to use an ERC20 token other than USDC, change the dAPIs used in the paymaster. 
- For example, if you want to use DAI, use the [DAI/USD](https://market.api3.org/dapis/zksync-goerli-testnet/DAI-USD) dAPI instead of USDC/USD.
:::

## Project repo

The tutorial code is available [here](https://github.com/vanshwassan/zk-paymaster-dapi-poc).

## Set up the project

1. Install the [zkSync CLI](/docs/tools/zksync-cli/) if you don't have installed it yet:

```sh
yarn add global zksync-cli@latest
```

2. Run the following command to create a new project:

```sh
yarn zksync-cli create paymaster-dapi
```

This creates a new zkSync Era project called `paymaster-dapi` with a basic `Greeter` contract. 

3. `cd` into the project directory:

```sh
cd ~/paymaster-dapi
```

4. Add the project dependencies:

```sh
yarn add -D @matterlabs/zksync-contracts @openzeppelin/contracts@4.6.0 @openzeppelin/contracts-upgradeable@4.6.0 @api3/contracts
```

## Design

For the sake of simplicity, we use a modified OpenZeppelin ERC20 implementation. For that, we are going to code a basic ERC20 token `mockUSDC` which pays for the transactions.

### 1. Create a new contract

Create `mockUSDC.sol` in the `/contracts` directory and add the following code:

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

The `Greeter.sol` contract is already in the `contracts` directory. This is the contract that we will be using to test our paymaster to set a greeting message on-chain.

### 2. Paymaster solidity contract

Create `MyPaymaster.sol` in the `/contracts` directory. 


We are going to use a skeleton paymaster contract and add the required functionality to it.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
from  "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract MyPaymaster is IPaymaster {
    
    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continue execution if called from the bootloader.
        _;
    }

    constructor(address _erc20) {
        allowedToken = _erc20;
    }
    
    function setDapiProxy(
        address _USDCproxy,
        address _ETHproxy
    ) public onlyOwner {
         // TO BE IMPLEMENTED
    }
    
    function readDapi(address _dapiProxy) public view returns (uint256) {
         // TO BE IMPLEMENTED 
    }

    function validateAndPayForPaymasterTransaction  (
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable onlyBootloader returns (bytes4 magic, bytes memory context) {
        // TO BE IMPLEMENTED
    }

    function postTransaction (
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable onlyBootloader override {
        // Refunds are not supported yet.
    }

    receive() external payable {}
}
```

- Add the following imports.

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";
```

- Inherit `Ownable` and declare the following public variables.

```solidity
contract MyPaymaster is IPaymaster, Ownable {

    address public allowedToken;
    address public USDCdAPIProxy;
    address public ETHdAPIProxy;
    uint256 public requiredETH;

}
```

- Make a `public` `onlyOwner` function to set dAPI proxies.

```solidity
    // Set dapi proxies for the allowed token/s
    function setDapiProxy(address _USDCproxy, address _ETHproxy) 
    public onlyOwner {
        USDCdAPIProxy = _USDCproxy;
        ETHdAPIProxy = _ETHproxy;
    }
```

- Make a `public` `view` function to read the dAPI values. We will use this to read the price of ETH/USD and USDC/USD datafeeds.

```solidity
    function readDapi(address _dapiProxy) public view returns (uint256) {
        (int224 value, ) = IProxy(_dapiProxy).read();
        uint256 price = uint224(value);
        return price;
    }
```

- Under `validateAndPayForPaymasterTransaction()`, we call the `readDapi()` function and add the logic to calculate the required USDC to be sent by the user.

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

- Also update the `try catch` block to transfer the `requiredERC20` token from the user to the paymaster that covers the transaction cost.

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

- Everything else for `validateAndPayForPaymasterTransaction()` remains the same as the previous paymaster contract as it follows the same paymaster flow. Here's the code for the entire function.

```solidity
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
```

- Copy/paste the full code for `MyPaymaster.sol` that uses dAPIs.

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

contract MyPaymaster is IPaymaster, Ownable {

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
        // Refunds are not supported yet.
    }

    receive() external payable {}
}
```

## Compile and deploy the contracts

The script below deploys the ERC20 (mockUSDC), Greeter, and the Paymaster contract. It also creates an empty wallet and mints 5k `mockUSDC` tokens for the paymaster to use at a later step. Finally, it also sends 0.05 ETH to the paymaster contract so it can pay for the transactions.

The script also calls the `setDapiProxy` to set the proxy addresses for the required dAPIs on-chain. It also sets the `greeting`.

### 1. Create the deployment file

Create `deploy-paymaster.ts` in the `deploy` directory and copy/paste the following code:

```ts
import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

require('dotenv').config();
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
  const setProxy = paymaster.setDapiProxy(USDCUSDdAPI, ETHUSDdAPI)
  await (await setProxy).wait()
  console.log("dAPI Proxies Set!")

  // Deploying the Greeter contract
  const greeterContractArtifact = await deployer.loadArtifact("Greeter");
  const oldGreeting = "old greeting"
  const deployGreeter = await deployer.deploy(greeterContractArtifact, [oldGreeting]);
  console.log(`Greeter contract address: ${deployGreeter.address}`);

  // Supplying the ERC20 tokens to the empty wallet:
  await // We will give the empty wallet 5k mUSDC:
  (await erc20.mint(emptyWallet.address, "5000000000000000000000")).wait();

  console.log("Minted 5k mUSDC for the empty wallet");

  console.log(`Done!`);
}
```

### 2. Update env variables

Update the existing `.env-example` file to your needs by renaming it to `.env` and insert your private key:

```sh
echo 'PRIVATE_KEY=' > .env
```

### 3. Compile and deploy

From the project root, run the following:

```sh
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
```

The output should be like this (your values will be different):

```
Empty wallet's address: 0xcc7527d2DCb86e5327C494b323af502aEFd76831
Empty wallet's private key: 0x1d79f139605b82f3597654f274273220514ec0994fabd9f205a0a56e907d14a5
ERC20 address: 0x4CbBd2FB4700a19A19d3be5b19609f8cA6187980
Paymaster address: 0x991c592Cfc34406746b59eBA26E3D8e6f40c28bb
dAPI Proxies Set!
Greeter contract address: 0xbCC6aF86Ca5BAFedDDe922a64765Cbb438698C57
Minted 5k mUSDC for the empty wallet
Done!
```

### 4. Update environment variables

Update the `.env` file to populate the following variables from the above output:

```
PRIVATE_KEY=
PAYMASTER_ADDRESS=
TOKEN_ADDRESS=
EMPTY_WALLET_PRIVATE_KEY=
GREETER_CONTRACT=
```

:::tip
* Addresses and private keys are different on each run.
* Make sure you delete the `artifacts-zk` and `cache-zk` folders before recompiling.
:::

## Using the paymaster

### 1. Create paymaster script

Create the `use-paymaster.ts` script in the `deploy` folder. 

```ts
import { ContractFactory, Provider, utils, Wallet } from "zksync-web3";
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

  const PaymasterFactory = new ContractFactory(
    paymasterArtifact.abi,
    paymasterArtifact.bytecode,
    deployer.zkWallet
  );
  const PaymasterContract = PaymasterFactory.attach(PAYMASTER_ADDRESS);

  // Estimate gas fee for the transaction
  const gasLimit = await greeter.estimateGas.setGreeting(
    "new updated greeting",
    {
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
    }
  );

  // Gas estimation:
  const fee = gasPrice.mul(gasLimit.toString());
  console.log(`Estimated ETH FEE (gasPrice * gasLimit): ${fee}`);

  // Calling the dAPI to get the ETH price:
  const ETHUSD = await PaymasterContract.readDapi(
    "0x28ce555ee7a3daCdC305951974FcbA59F5BdF09b"
  );
  const USDCUSD = await PaymasterContract.readDapi(
    "0x946E3232Cc18E812895A8e83CaE3d0caA241C2AB"
  );

  // Checks old allowance (for testing purposes):
  const checkSetAllowance = await erc20.allowance(
    emptyWallet.address,
    PAYMASTER_ADDRESS
  );
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
    await greeter
      .connect(emptyWallet)
      .setGreeting(`new greeting updated at ${new Date().toUTCString()}`, {
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
  console.log(
    `Transaction fee paid in ERC20 was ${erc20Balance.sub(newErc20Balance)}`
  );
  console.log(`Message in contract now is: ${await greeter.greet()}`);
}
```

### 2. Run the script

```sh
yarn hardhat deploy-zksync --script use-paymaster.ts
```

The output should look something like this:

```
ERC20 balance of the user before tx: 5000000000000000000000
Estimated ETH FEE (gasPrice * gasLimit): 586134250000000
ERC20 allowance for paymaster : 0
ETH/USD dAPI Value: 1829590000000000000000
USDC/USD dAPI Value: 999957462579468500
Estimated USD FEE: 1072430980905125770
Current message is: old greeting
ERC20 Balance of the user after tx: 4998927569019094874230
Transaction fee paid in ERC20 was 1072430980905125770
Message in contract now is: new greeting updated at Thu, 18 May 2023 07:40:22 GMT
```

The wallet had 5000 mUSDC after running the deployment script. After sending the transaction to update the `Greeting` contract, we are now left with 4998.92 mUSDC. The script used mUSDC to cover the gas costs for the update transaction.
