# Tutorial: Building custom paymaster

Let's see how we can use the paymaster feature to build a custom paymaster that will enable us to pay fees for any user holding our token.

## Preliminaries

It is highly recommended to read about the [design](../zksync-v2/aa.md) of the account abstraction protocol before diving into this tutorial.

It is assumed that you are already familiar with deploying smart contracts on zkSync. If not, please refer to the first section of the [Hello World](./hello-world.md) tutorial. It is also recommended to read the [introduction](../zksync-v2/system-contracts.md) to the system contracts.

It is also assumed that you already have some experience working on Ethereum.

## Installing dependencies

We will use the zkSync hardhat plugin for developing this contract. Firstly, we should install all the dependencies for it:

```
mkdir custom-paymaster-tutorial
cd custom-paymaster-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Since we are working with zkSync contracts, we also need to install the package with the contracts and its peer dependencies:

```
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Create the `hardhat.config.ts` config file, `contracts` and `deploy` folders, like in the [Hello World](./hello-world.md) tutorial.

## Design

Our protocol will be a dummy protocol that allows anyone to swap a certain ERC-20 token in exchange for paying fees for the transaction.

The skeleton for the paymaster looks the following way:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IPaymaster, ExecutionResult } from '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol';
import { IPaymasterFlow } from '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol';
import { TransactionHelper, Transaction } from '@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol';

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract MyPaymaster is IPaymaster {
    uint256 constant PRICE_FOR_PAYING_FEES = 1;

    address public allowedToken;

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continure execution if called from the bootloader.
        _;
    }

    constructor(address _erc20) {
        allowedToken = _erc20;
    }

    function validateAndPayForPaymasterTransaction(Transaction calldata _transaction) external payable override onlyBootloader returns (bytes memory context) {
        // Transaction validation logic goes here
    }

    function postOp(
      bytes calldata _context,
      Transaction calldata _transaction,
      ExecutionResult _txResult,
      uint256 _maxRefundedErgs
    ) external payable onlyBootloader {
        // This contract does not support any refunding logic
    }

    receive() external payable {}
}
```

Note, that only the [bootloader](../zksync-v2/system-contracts.md#bootloader) should be allowed to call the `validateAndPayForPaymasterTransaction`/`postOp` methods. That's why the `onlyBootloader` is used for them.

### Parsing paymaster input

In this tutorial, you want to charge the user one unit of the `allowedToken` in exchange for her fees being paid by the contract.

The input that the paymaster should receive is encoded in the `paymasterInput`. As described [here](../zksync-v2/aa.md#built-in-paymaster-flows), there are some standardized ways to encode user interactions with paymasterInput. To charge the user, we will require that he has provided enough allowance to the paymaster contract. This is what the `approvalBased` flow can help us with.

Firstly, we'll need to check that the `paymasterInput` was encoded as in the `approvalBased` flow:

```solidity
require(_transaction.paymasterInput.length >= 4, "The standard paymaster input must be at least 4 bytes long");

bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
    (address token, uint256 minAllowance, bytes memory data) = abi.decode(_transaction.paymasterInput[4:], (address, uint256, bytes));

    require(token == allowedToken, "Invalid token");
    require(minAllowance >= 1, "Min allowance too low");

    // 
    // ...
    //
} else {
    revert("Unsupported paymaster flow");
}
```

Then, we need to check that the user indeed provided enough allowance:

```solidity
address userAddress = address(uint160(_transaction.from));
address thisAddress = address(this);

uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);
require(providedAllowance >= PRICE_FOR_PAYING_FEES, "The user did not provide enough allowance");
```

Then, we finally transfer the funds to the user in exchnage for 1 unit of this token.

```solidity
// Note, that while the minimal amount of ETH needed is tx.ergsPrice * tx.ergsLimit,
// neither paymaster nor account are allowed to access this context variable.
uint256 requiredETH = _transaction.ergsLimit * _transaction.maxFeePerErg;

// Pulling all the tokens from the user
IERC20(token).transferFrom(userAddress, thisAddress, 1);
// The bootloader never returns any data, so it can safely be ignored here.
(bool success, ) = payable(BOOTLOADER_ADDRESS).call{value: requiredETH}("");
require(success, "Failed to transfer funds to the bootloader");
```

::: tip You should validate all the requirements first

The [rules](../zksync-v2/aa.md#paymaster-validation-rules) for the paymaster throttling say that the paymaster won't be throttled if the first storage read that differed was a storage slot that belonged to the user.

That is why it is important to verify that the user provided all the allowed prerequisites to the transaction *before* performing any logic. This is the reason we check that the user provided enough allowance *first*, and only then we do the transferFrom.

:::

### Full code of the paymaster

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IPaymaster, ExecutionResult } from '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol';
import { IPaymasterFlow } from '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol';
import { TransactionHelper, Transaction } from '@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol';

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract MyPaymaster is IPaymaster {
    uint256 constant PRICE_FOR_PAYING_FEES = 1;

    address public allowedToken;

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continure execution if called from the bootloader.
        _;
    }

    constructor(address _erc20) {
        allowedToken = _erc20;
    }

    function validateAndPayForPaymasterTransaction(Transaction calldata _transaction) external payable override onlyBootloader returns (bytes memory context) {
        require(_transaction.paymasterInput.length >= 4, "The standard paymaster input must be at least 4 bytes long");

        bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);
        if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            (address token, uint256 minAllowance, bytes memory data) = abi.decode(_transaction.paymasterInput[4:], (address, uint256, bytes));

            require(token == allowedToken, "Invalid token");
            require(minAllowance >= 1, "Min allowance too low");

            address userAddress = address(uint160(_transaction.from));
            address thisAddress = address(this);

            uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);
            require(providedAllowance >= PRICE_FOR_PAYING_FEES, "The user did not provide enough allowance");

            // Note, that while the minimal amount of ETH needed is tx.ergsPrice * tx.ergsLimit,
            // neither paymaster nor account are allowed to access this context variable.
            uint256 requiredETH = _transaction.ergsLimit * _transaction.maxFeePerErg;

            // Pulling all the tokens from the user
            IERC20(token).transferFrom(userAddress, thisAddress, 1);
            // The bootloader never returns any data, so it can safely be ignored here.
            (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: requiredETH}("");
            require(success, "Failed to transfer funds to the bootloader");
        } else {
            revert("Unsupported paymaster flow");
        }
    }

    function postOp(
        bytes calldata _context,
        Transaction calldata _transaction,
        ExecutionResult _txResult,
        uint256 _maxRefundedErgs
    ) external payable onlyBootloader {
        // This contract does not support any refunding logic
    }

    receive() external payable {}
}
```

## Deploying an ERC20 contract 

To test our paymaster, we need to deploy an ERC20 token. For the sake of simplicity we will use a somewhat modified OpenZeppelin implementation of it:

Create the `MyERC20.sol` file and put the following code in it:

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

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

## Deploying the paymaster

To deploy the ERC20 token and the paymaster, we need to create a deployment script. Create the `deploy` folder and create one file there: `deploy-paymaster.ts`. Put the following deployment script there:

```ts
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // The wallet that will deploy the token and the paymaster
  // It is assumed that this wallet already has sufficient funds on zkSync
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
      value: ethers.utils.parseEther('0.01')
    })
  ).wait()

  // Supplying the ERC20 tokens to the empty wallet:
  await (
    // We will give the empty wallet 3 units of the token:
    await erc20.mint(emptyWallet.address, 3)
  ).wait();

  console.log(`Done!`);
}
```

Besides deploying the paymaster it also creates an empty wallet and gives some of the `MyERC20` tokens to it, so that it can use the paymaster.

To deploy the ERC20 token and the paymaster, you should compile the contracts and run the script:

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
```

The output should be roughly the following:

```
Empty wallet's address: 0xAd155D3069BB3c587E995916B320444056d8191F
Empty wallet's private key: 0x236d735297617cc68f4ec8ceb40b351ca5be9fc585d446fa95dff02354ac04fb
ERC20 address: 0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964
Paymaster address: 0x0a67078A35745947A37A552174aFe724D8180c25
Done!
```

Note that the addresses and private keys will be different for each run.

## Using the paymaster

Create `use-paymaster.ts` script in the `deploy` folder. You can see the example of interacting with the paymaster in the code snippet below:

```ts
import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of the deployed paymaster here
const PAYMASTER_ADDRESS = '';

// Put the address of the ERC20 token here:
const TOKEN_ADDRESS = '';

// Wallet private key
const EMPTY_WALLET_PRIVATE_KEY = '';

function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
  const artifact = hre.artifacts.readArtifactSync('MyERC20');
  return new ethers.Contract(
    TOKEN_ADDRESS,
    artifact.abi,
    wallet
  )
}

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const emptyWallet = new Wallet(EMPTY_WALLET_PRIVATE_KEY, provider);

  // Obviously this step is not required, but it is here purely to demonstrate
  // that indeed the wallet has no ether.
  const ethBalance = await emptyWallet.getBalance();
  if(!ethBalance.eq(0)) {
      throw new Error('The wallet is not empty');
  }

  console.log(`Balance of the user before mint: ${await emptyWallet.getBalance(TOKEN_ADDRESS)}`);
  
  const erc20 = getToken(hre, emptyWallet);
  
  // Encoding the "ApprovalBased" paymaster flow's input
  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: 'ApprovalBased',
    token: TOKEN_ADDRESS,
    minimalAllowance: ethers.BigNumber.from(1),
    innerInput: new Uint8Array()
  });

  await (
    await erc20.mint(emptyWallet.address, 100, {
      customData: {
        paymasterParams,
        ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
      }
    })
  ).wait()

  console.log(`Balance of the user after mint: ${await emptyWallet.getBalance(TOKEN_ADDRESS)}`);
}
```

After filling in the parameters `PAYMASTER_ADDRESS`,`TOKEN_ADDRESS` and `EMPTY_WALLET_PRIVATE_KEY` with the output provided in the previous step, run this script with the following command:

```
yarn hardhat deploy-zksync --script use-paymaster.ts
```

The output should be roughly the following:

```
Balance of the user before mint: 3
Balance of the user after mint: 102
```

## Complete project

You can download the complete project [here](https://github.com/matter-labs/custom-paymaster-tutorial).

## Learn more

- To learn more about account abstraction on zkSync, check out its [documentation page](../zksync-v2/aa.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation page](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation page](../../api/hardhat).
