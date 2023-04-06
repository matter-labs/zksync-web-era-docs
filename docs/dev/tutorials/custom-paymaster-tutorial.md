# Building a custom paymaster

This tutorial shows you how to build a custom paymaster that allows users to pay fees with any ERC20 token. You will:

- Create a paymaster that assumes a single unit of an ERC20 token is enough to cover any transaction fee.
- Create the ERC20 token contract and send some tokens to a new wallet.
- Send a `mint` transaction from the newly created wallet via the paymaster. Although the transaction normally requires ETH to pay the gas fee, our paymaster executes the transaction in exchange for 1 unit of the ERC20 token.

## Prerequisites

- A [Node.js](https://nodejs.org/en/download) installation running Node.js version 16.
- Some familiarity with deploying smart contracts on zkSync. If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).
- Some background knowledge on the concepts covered by the tutorial would be helpful too. Have a look at the following docs:
    - [Account abstraction protocol](../developer-guides/aa.md).
    - [Introduction to system contracts](../developer-guides/system-contracts.md).
    - [Smart contract deployment](../building-on-zksync/contracts/contract-deployment.md) on zkSyn Era.
    - [Gas estimation for transactions](../developer-guides/transactions/fee-model.md#gas-estimation-during-transaction-for-custom-and-paymaster-accounts) guide.
- You should also know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).

## Project repo

The tutorial code is available [here](https://github.com/matter-labs/custom-paymaster-tutorial).

## Set up the project

1. Create a project folder and `cd` into it:

```sh
mkdir custom-paymaster-tutorial
cd custom-paymaster-tutorial
```

2. Initialize the project:

```sh
yarn init -y
```

3. Add the project dependencies, including Hardhat and all zkSync packages:

```sh
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

::: tip
- The current version of `zksync-web3` uses `ethers v5.7.x` as a peer dependency. 
- An update compatible with `ethers v6.x.x` will be released soon.
:::

4. Create the required folders.

```sh
mkdir contracts deploy
```

5. Create the file `hardhat.config.ts` and add the following:

```ts
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.8",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.8",
  },
};
```

::: tip
- Use the zkSync CLI to scaffold a zkSync project. Find out more info about [the zkSync CLI](../../api/tools/zksync-cli/).
:::

## Design

### Paymaster Solidity contract

The contract code defines an ERC20 token and allows it to be used to pay the fees for transactions. 

The skeleton contract looks like this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract MyPaymaster is IPaymaster {
    uint256 constant PRICE_FOR_PAYING_FEES = 1;

    address public allowedToken;

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continue execution if called from the bootloader.
        _;
    }

    constructor(address _erc20) {
        allowedToken = _erc20;
    }

    function validateAndPayForPaymasterTransaction  (
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) onlyBootloader external payable returns (bytes4 magic, bytes memory context) {
        // TO BE IMPLEMENTED
    }

    function postTransaction (
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

:::info
- Only the [bootloader](../developer-guides/system-contracts.md#bootloader) is allowed to call the `validateAndPayForPaymasterTransaction` and `postTransaction` functions. 
- To implement that, the `onlyBootloader` modifier is used on these functions.
:::

### Parsing the paymaster input

The paymaster pays the transaction fees and charges the user one unit of the `allowedToken` in exchange.

The input that the paymaster receives is encoded in the `paymasterInput` within the `validateAndPayForPaymasterTransaction` function. 

As described in [the paymaster documentation](../developer-guides/aa.md#paymasters), there are standardized ways to encode user interactions with `paymasterInput`. To charge the user, we require that she has provided enough allowance of the ERC20 token to the paymaster contract. This allowance is done in the `approvalBased` flow behind the scenes.

Firstly, we check that the `paymasterInput` is encoded as in the `approvalBased` flow, and that the token sent in `paymasterInput` is the one the paymaster accepts.

```solidity
magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;

require(
    _transaction.paymasterInput.length >= 4,
    "The standard paymaster input must be at least 4 bytes long"
);

bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector)  {
    (address token, uint256 minAllowance, bytes memory data) = abi.decode(_transaction.paymasterInput[4:], (address, uint256, bytes));

    // We verify that the user has provided enough allowance
    require(token == allowedToken, "Invalid token");

    //
    // ...
    //
} else {
    revert("Unsupported paymaster flow");
}
```

Next, we check the user provided enough allowance:

```solidity
// We verify that the user has provided enough allowance
address userAddress = address(uint160(_transaction.from));

address thisAddress = address(this);

uint256 providedAllowance = IERC20(token).allowance(
    userAddress,
    thisAddress
);
require(providedAllowance >= PRICE_FOR_PAYING_FEES, "Min allowance too low");
```

Finally, we check the price of transaction fees, transfer the ERC20 tokens to the paymaster, and transfer the correspondent gas fee from the paymaster to the bootloader to cover the transaction fees.

```solidity
// Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
// neither paymaster nor account are allowed to access this context variable.
uint256 requiredETH = _transaction.gasLimit *
    _transaction.maxFeePerGas;

try
    IERC20(token).transferFrom(userAddress, thisAddress, amount)
{} catch (bytes memory revertReason) {
    // If the revert reason is empty or represented by just a function selector,
    // we replace the error with a more user-friendly message
    if (revertReason.length <= 4) {
        revert("Failed to transferFrom from users' account");
    } else {
        assembly {
            revert(add(0x20, revertReason), mload(revertReason))
        }
    }
}

// Transfer fees to the bootloader
(bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{
    value: requiredETH
}("");
require(success, "Failed to transfer funds to the bootloader");
```

::: tip Validate all requirements first
The [validation steps](../developer-guides/aa.md#the-validation-step) ensure that the paymaster won't throttle if the first storage read which has a different value from the execution on the API is a storage slot that belongs to the user.

This is why it is important to verify transaction prerequisites _before_ performing any logic and why we _first_ check that the user provided enough allowance before calling `transferFrom`.
:::

## Paymaster contract full code

Create the `contracts/MyPaymaster.sol` file and copy/paste the following:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} 
from  "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from  "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract MyPaymaster is IPaymaster {
    uint256 constant PRICE_FOR_PAYING_FEES = 1;

    address public allowedToken;

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
            require(
                providedAllowance >= PRICE_FOR_PAYING_FEES,
                "Min allowance too low"
            );

            // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
            // neither paymaster nor account are allowed to access this context variable.
            uint256 requiredETH = _transaction.gasLimit *
                _transaction.maxFeePerGas;

            try
                IERC20(token).transferFrom(userAddress, thisAddress, amount)
            {} catch (bytes memory revertReason) {
                // If the revert reason is empty or represented by just a function selector,
                // we replace the error with a more user-friendly message
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

## Create ERC20 contract

For the sake of simplicity we will use a modified OpenZeppelin ERC20 implementation:

Create the `contracts/MyERC20.sol` file and copy/paste the following:

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

## Compile and deploy the contracts

The script below deploys the ERC20 contract and the paymaster contract. It also creates an empty wallet and mints some `MyERC20` tokens for the paymaster to use at a later step.

1. In the `deploy` folder, create the file `deploy-paymaster.ts` and copy/paste the following, replacing `<PRIVATE-KEY>` with your own:

```ts
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
  // ⚠️ Never commit private keys to file tracking history, or your account could be compromised.
  const wallet = new Wallet("<PRIVATE-KEY>");
  // The wallet that will receive ERC20 tokens
  const emptyWallet = Wallet.createRandom();
  console.log(`Empty wallet's address: ${emptyWallet.address}`);
  console.log(`Empty wallet's private key: ${emptyWallet.privateKey}`);

  const deployer = new Deployer(hre, wallet);

  // Deploying the ERC20 token
  const erc20Artifact = await deployer.loadArtifact("MyERC20");
  const erc20 = await deployer.deploy(erc20Artifact, ["MyToken", "MyToken", 18]);
  console.log(`ERC20 address: ${erc20.address}`);

  // Deploying the paymaster
  const paymasterArtifact = await deployer.loadArtifact("MyPaymaster");
  const paymaster = await deployer.deploy(paymasterArtifact, [erc20.address]);
  console.log(`Paymaster address: ${paymaster.address}`);

  // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("0.03"),
    })
  ).wait();

  // Supplying the ERC20 tokens to the empty wallet:
  await // We will give the empty wallet 3 units of the token:
  (await erc20.mint(emptyWallet.address, 3)).wait();

  console.log("Minted 3 tokens for the empty wallet");

  console.log(`Done!`);
}
```

2. Compile and deploy the contracts from the project root:

```sh
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
```

The output should be roughly the following:

```
Empty wallet's address: 0xAd155D3069BB3c587E995916B320444056d8191F
Empty wallet's private key: 0x236d735297617cc68f4ec8ceb40b351ca5be9fc585d446fa95dff02354ac04fb
ERC20 address: 0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964
Paymaster address: 0x0a67078A35745947A37A552174aFe724D8180c25
Minted 3 tokens for the empty wallet
Done!
```

:::tip
* Addresses and private keys are different on each run.
* Make sure you delete the `artifacts-zk` and `cache-zk` folders before recompiling.
:::

## Using the paymaster

1. Create the `use-paymaster.ts` script in the `deploy` folder, replacing the parameter placeholders with the details from the previous deploy step. 

::: warning 
Make sure you use the private key of the wallet created by the previous script as that wallet contains the ERC20 tokens.
:::

```ts
import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of the deployed paymaster here
const PAYMASTER_ADDRESS = "<PAYMASTER_ADDRESS>";

// Put the address of the ERC20 token here:
const TOKEN_ADDRESS = "<TOKEN_ADDRESS>";

function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
  const artifact = hre.artifacts.readArtifactSync("MyERC20");
  return new ethers.Contract(TOKEN_ADDRESS, artifact.abi, wallet);
}

// Wallet private key
// ⚠️ Never commit private keys to file tracking history, or your account could be compromised.
const EMPTY_WALLET_PRIVATE_KEY = "<EMPTY_WALLET_PRIVATE_KEY>";
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://testnet.era.zksync.dev");
  const emptyWallet = new Wallet(EMPTY_WALLET_PRIVATE_KEY, provider);

  // Obviously this step is not required, but it is here purely to demonstrate that indeed the wallet has no ether.
  const ethBalance = await emptyWallet.getBalance();
  if (!ethBalance.eq(0)) {
    throw new Error("The wallet is not empty");
  }

  console.log(
    `Balance of the user before mint: ${await emptyWallet.getBalance(
      TOKEN_ADDRESS
    )}`
  );

  const erc20 = getToken(hre, emptyWallet);

  const gasPrice = await provider.getGasPrice();

  // Encoding the "ApprovalBased" paymaster flow's input
  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: "ApprovalBased",
    token: TOKEN_ADDRESS,
    // set minimalAllowance as we defined in the paymaster contract
    minimalAllowance: ethers.BigNumber.from(1),
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(),
  });

  // Estimate gas fee for mint transaction
  const gasLimit = await erc20.estimateGas.mint(emptyWallet.address, 100, {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paymasterParams,
    },
  });

  const fee = gasPrice.mul(gasLimit.toString());

  await (
    await erc20.connect(emptyWallet).mint(emptyWallet.address, 100, {
      // paymaster info
      customData: {
        paymasterParams: paymasterParams,
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      },
    })
  ).wait();

  console.log(
    `Balance of the user after mint: ${await emptyWallet.getBalance(
      TOKEN_ADDRESS
    )}`
  );
}
```

2. Run the script:

```sh
yarn hardhat deploy-zksync --script use-paymaster.ts
```

The output should look something like this:

```txt
Balance of the user before mint: 3
Balance of the user after mint: 102
```

The wallet had 3 tokens after running the deployment script and, after sending the transaction to `mint` 100 more tokens, the balance is 102 as 1 token was used to pay the transaction fee to the paymaster.

## Common errors

* If the `use-paymaster.ts` script fails with the error `Failed to submit transaction: Failed to validate the transaction. Reason: Validation revert: Paymaster validation error: Failed to transfer funds to the bootloader`, please try sending additional ETH to the paymaster so it has enough funds to pay for the transaction. You can use [zkSync Portal](https://portal.zksync.io/).
* If the `use-paymaster.ts` script fails when minting new ERC20 tokens with the error `Error: transaction failed`, and the transactions appear with status "Failed" in the [zkSync explorer](https://explorer.zksync.io/), please reach out to us on [our Discord](https://join.zksync.dev/) or [contact page](https://zksync.io/contact.html). As a workaround, try including a specific `gasLimit` value in the transaction.

## Learn more

- Learn more about [L1->L2 interaction on zkSync](../developer-guides/bridging/l1-l2.md).
- Learn more about [the `zksync-web3` SDK](../../api/js).
- Learn more about [the zkSync hardhat plugins](../../api/hardhat).
