---
head:
  - - meta
    - name: "twitter:title"
      content: Daily Spending Limit Tutorial | zkSync Docs
---

# Daily spending limit account

This tutorial shows you how to create a smart contract account with a daily spending limit using the zkSync Era native account abstraction.

The daily limit feature prevents an account from spending more ETH than the limit set by the account's owner.

## Prerequisites

- Make sure your machine satisfies the [system requirements](https://github.com/matter-labs/era-compiler-solidity/tree/main#system-requirements).
- [Node.js](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed on your machine.
- If you are not already familiar with deploying smart contracts on zkSync Era, please refer to the [quickstart tutorial](../../../quick-start/hello-world.md).
- A wallet with sufficient Sepolia `ETH` on Ethereum and zkSync Era Testnet to pay for deploying smart contracts. You can get Sepolia ETH from the [network faucets](../../../tooling/network-faucets.md).
- You know [how to get your private key from your MetaMask wallet](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).
- We encourage you to read [the basics of account abstraction on zkSync Era](../../../developer-reference/account-abstraction.md) and complete the [multisig account tutorial](./custom-aa-tutorial.md) before attempting this tutorial.

::: tip Local zkSync Testing with zksync-cli
Skip the hassle for test ETH by using `zksync-cli` for local testing. Simply execute `npx zksync-cli dev start` to initialize a local zkSync development environment, which includes local Ethereum and zkSync nodes. This method allows you to test contracts without requesting external testnet funds. Explore more in the [zksync-cli documentation](../../../tooling/zksync-cli/getting-started.md).
:::

## Complete Project

Download the complete project [here](https://github.com/matter-labs/tutorials/tree/main/spend-limit). Additionally, the repository contains a test folder with more detailed tests for running on a zkSync Era local network.

::: info Project available in Atlas IDE
This entire tutorial can be run in under a minute using Atlas. Atlas is a smart contract IDE that lets you write, deploy, and interact with contracts from your browser. [Open this project in Atlas](https://app.atlaszk.com/projects?template=https://github.com/Atlas-labs-inc/zksync-daily-spend-limit&open=/scripts/main.ts&chainId=300).
:::

## Project Setup

We will use the [zkSync Era Hardhat plugins](../../../tooling/hardhat/getting-started.md) to build, deploy, and interact with the smart contracts in this project.

1. Initiate a new project by running the command:

```sh
npx zksync-cli create custom-spendlimit-tutorial --template hardhat_solidity
```

This creates a new zkSync Era project called `custom-spendlimit-tutorial` with a with a few example contracts.

1. Navigate into the project directory:

```sh
cd custom-spendlimit-tutorial
```

3. For the purposes of this tutorial, we don't need the example contracts related files. So, proceed by removing all the files inside the `/contracts` and `/deploy` folders manually or by running the following commands::

```sh
rm -rf ./contracts/*
rm -rf ./deploy/*
```

4. Add the zkSync and OpenZeppelin contract libraries:

```sh
yarn add -D @matterlabs/zksync-contracts @openzeppelin/contracts@4.9.5
```

::: warning
This project does not use the latest version available of `@openzeppelin/contracts`. Make sure you install the specific version mentioned above.
:::

5. Include the `isSystem: true` setting in the `zksolc` section of the `hardhat.config.ts` configuration file to allow interaction with system contracts:

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

const config: HardhatUserConfig = {
  defaultNetwork: "zkSyncSepoliaTestnet",
  networks: {
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    inMemoryNode: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "localhost", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat: {
      zksync: true,
    },
    // Additional networks
  },
  zksolc: {
    version: "latest",
    settings: {
      isSystem: true, // ⚠️ Make sure to include this line
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
```

## Design

Now let’s dive into the design and implementation of the daily spending limit feature.

The `SpendLimit` contract inherits from the `Account` contract as a module that does the following:

- Allows the account to enable/disable the daily spending limit in a token (ETH in this example).
- Allows the account to change (increase/decrease or remove) the daily spending limit.
- Rejects token transfer if the daily spending limit has been exceeded.
- Restores the available amount for spending after 24 hours.

### Basic Structure

Below you'll find the `SpendLimit` skeleton contract.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SpendLimit {

    uint public ONE_DAY = 24 hours;

    modifier onlyAccount() {
        require(
            msg.sender == address(this),
            "Only the account that inherits this contract can call this method."
        );
        _;
    }

    function setSpendingLimit(address _token, uint _amount) public onlyAccount {
    }

    function removeSpendingLimit(address _token) public onlyAccount {
    }

    function _isValidUpdate(address _token) internal view returns(bool) {
    }

    function _updateLimit(address _token, uint _limit, uint _available, uint _resetTime, bool _isEnabled) private {
    }

    function _checkSpendingLimit(address _token, uint _amount) internal {
    }

}
```

The mapping `limits` and struct `Limit` below serve as data storage for the state of daily limits accounts enable.

The roles of each variable in the struct are detailed in the comments.

```solidity
    /// This struct serves as data storage of daily spending limits users enable
    /// limit: the amount of a daily spending limit
    /// available: the available amount that can be spent
    /// resetTime: block.timestamp at the available amount is restored
    /// isEnabled: true when a daily spending limit is enabled
    struct Limit {
        uint limit;
        uint available;
        uint resetTime;
        bool isEnabled;
    }

    mapping(address => Limit) public limits; // token => Limit
```

Note that the `limits` mapping uses the token address as its key. This means that users can set limits for ETH and any other ERC20 token.

### Setting and Removing the Daily Spending Limit

The code below sets and removes the limit.

```solidity
    /// this function enables a daily spending limit for specific tokens.
    /// @param _token ETH or ERC20 token address that a given spending limit is applied.
    /// @param _amount non-zero limit.
    function setSpendingLimit(address _token, uint _amount) public onlyAccount {
        require(_amount != 0, "Invalid amount");

        uint resetTime;
        uint timestamp = block.timestamp; // L2 block timestamp

        if (isValidUpdate(_token)) {
            resetTime = timestamp + ONE_DAY;
        } else {
            resetTime = timestamp;
        }

        _updateLimit(_token, _amount, _amount, resetTime, true);
    }

    // this function disables an active daily spending limit,
    // decreasing each uint number in the Limit struct to zero and setting isEnabled false.
    function removeSpendingLimit(address _token) public onlyAccount {
        require(isValidUpdate(_token), "Invalid Update");
        _updateLimit(_token, 0, 0, 0, false);
    }

    // verify if the update to a Limit struct is valid
    // Ensure that users can't freely modify(increase or remove) the daily limit to spend more.
    function isValidUpdate(address _token) internal view returns (bool) {
        // Reverts unless it is first spending after enabling
        // or called after 24 hours have passed since the last update.
        if (limits[_token].isEnabled) {
            require(
                limits[_token].limit == limits[_token].available ||
                    block.timestamp > limits[_token].resetTime,
                "Invalid Update"
            );

            return true;
        } else {
            return false;
        }
    }

    // storage-modifying private function called by either setSpendingLimit or removeSpendingLimit
    function _updateLimit(
        address _token,
        uint _limit,
        uint _available,
        uint _resetTime,
        bool _isEnabled
    ) private {
        Limit storage limit = limits[_token];
        limit.limit = _limit;
        limit.available = _available;
        limit.resetTime = _resetTime;
        limit.isEnabled = _isEnabled;
    }

```

Both `setSpendingLimit` and `removeSpendingLimit` can only be called by account contracts that inherit the contract `SpendLimit`. This is ensured by the `onlyAccount` modifier. They call `_updateLimit` and pass the arguments to modify the storage data of the limit after the verification in `_isValidUpdate` succeeds.

Specifically, `setSpendingLimit` sets a non-zero daily spending limit for a given token, and `removeSpendingLimit` disables the active daily spending limit by decreasing `limit` and `available` to 0 and setting `isEnabled` to false.

`_isValidUpdate` returns false if the spending limit is not enabled and also throws an `Invalid Update` error if the user has spent some amount in the day (the available amount is different from the limit) or the function is called before 24 hours have passed since the last update. This ensures that users can't freely modify (increase or remove) the daily limit to spend more.

### Checking Daily Spending Limit

The `_checkSpendingLimit` function is internally called by the account contract before executing the transaction.

```solidity
    // this function is called by the account before execution.
    // Verify the account is able to spend a given amount of tokens. And it records a new available amount.
    function _checkSpendingLimit(address _token, uint _amount) internal {
        Limit memory limit = limits[_token];

        // return if spending limit hasn't been enabled yet
        if (!limit.isEnabled) return;

        uint timestamp = block.timestamp; // L2 block timestamp

        // Renew resetTime and available amount, which is only performed
        // if a day has already passed since the last update: timestamp > resetTime
        if (limit.limit != limit.available && timestamp > limit.resetTime) {
            limit.resetTime = timestamp + ONE_DAY;
            limit.available = limit.limit;

            // Or only resetTime is updated if it's the first spending after enabling limit
        } else if (limit.limit == limit.available) {
            limit.resetTime = timestamp + ONE_DAY;
        }

        // reverts if the amount exceeds the remaining available amount.
        require(limit.available >= _amount, "Exceed daily limit");

        // decrement `available`
        limit.available -= _amount;
        limits[_token] = limit;
    }
```

If the daily spending limit is disabled, the checking process immediately stops.

```solidity
if(!limit.isEnabled) return;
```

Before checking the spending amount, this method renews the `resetTime` and `available` amount if a day has already passed since the last update: `timestamp > resetTime`. It only updates the `resetTime` if the transaction is the first spending after enabling the limit. This way the daily limit actually starts with the first transaction.

```solidity
if (limit.limit != limit.available && timestamp > limit.resetTime) {
    limit.resetTime = timestamp + ONE_DAY;
    limit.available = limit.limit;

    // Or only resetTime is updated if it's the first spending after enabling limit
} else if (limit.limit == limit.available) {
    limit.resetTime = timestamp + ONE_DAY;
}
```

Finally, the method checks if the account can spend a specified amount of the token. If the amount doesn't exceed the available amount, it decrements the `available` in the limit:

```solidity
require(limit.available >= _amount, 'Exceed daily limit');

limit.available -= _amount;
```

### Full Code for the `SpendLimit` Contract

1. In the folder `contracts`, add a file called `SpendLimit.sol`

2. Copy/paste the complete code below.

:::warning

- The value of the `ONE_DAY` variable is set to `1 minutes` instead of `24 hours`.
- This is just for testing purposes (we don't want to wait a full day to see if it works!).
- Don't forget to change the value before deploying the contract.

:::

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SpendLimit {
    // uint public ONE_DAY = 24 hours;
    uint public ONE_DAY = 1 minutes; // set to 1 min for tutorial

    /// This struct serves as data storage of daily spending limits users enable
    /// limit: the amount of a daily spending limit
    /// available: the available amount that can be spent
    /// resetTime: block.timestamp at the available amount is restored
    /// isEnabled: true when a daily spending limit is enabled
    struct Limit {
        uint limit;
        uint available;
        uint resetTime;
        bool isEnabled;
    }

    mapping(address => Limit) public limits; // token => Limit

    modifier onlyAccount() {
        require(
            msg.sender == address(this),
            "Only the account that inherits this contract can call this method."
        );
        _;
    }

    /// this function enables a daily spending limit for specific tokens.
    /// @param _token ETH or ERC20 token address that a given spending limit is applied.
    /// @param _amount non-zero limit.
    function setSpendingLimit(address _token, uint _amount) public onlyAccount {
        require(_amount != 0, "Invalid amount");

        uint resetTime;
        uint timestamp = block.timestamp; // L2 block timestamp

        if (isValidUpdate(_token)) {
            resetTime = timestamp + ONE_DAY;
        } else {
            resetTime = timestamp;
        }

        _updateLimit(_token, _amount, _amount, resetTime, true);
    }

    // this function disables an active daily spending limit,
    // decreasing each uint number in the Limit struct to zero and setting isEnabled false.
    function removeSpendingLimit(address _token) public onlyAccount {
        require(isValidUpdate(_token), "Invalid Update");
        _updateLimit(_token, 0, 0, 0, false);
    }

    // verify if the update to a Limit struct is valid
    // Ensure that users can't freely modify(increase or remove) the daily limit to spend more.
    function isValidUpdate(address _token) internal view returns (bool) {
        // Reverts unless it is first spending after enabling
        // or called after 24 hours have passed since the last update.
        if (limits[_token].isEnabled) {
            require(
                limits[_token].limit == limits[_token].available ||
                    block.timestamp > limits[_token].resetTime,
                "Invalid Update"
            );

            return true;
        } else {
            return false;
        }
    }

    // storage-modifying private function called by either setSpendingLimit or removeSpendingLimit
    function _updateLimit(
        address _token,
        uint _limit,
        uint _available,
        uint _resetTime,
        bool _isEnabled
    ) private {
        Limit storage limit = limits[_token];
        limit.limit = _limit;
        limit.available = _available;
        limit.resetTime = _resetTime;
        limit.isEnabled = _isEnabled;
    }

    // this function is called by the account before execution.
    // Verify the account is able to spend a given amount of tokens. And it records a new available amount.
    function _checkSpendingLimit(address _token, uint _amount) internal {
        Limit memory limit = limits[_token];

        // return if spending limit hasn't been enabled yet
        if (!limit.isEnabled) return;

        uint timestamp = block.timestamp; // L2 block timestamp

        // Renew resetTime and available amount, which is only performed
        // if a day has already passed since the last update: timestamp > resetTime
        if (limit.limit != limit.available && timestamp > limit.resetTime) {
            limit.resetTime = timestamp + ONE_DAY;
            limit.available = limit.limit;

            // Or only resetTime is updated if it's the first spending after enabling limit
        } else if (limit.limit == limit.available) {
            limit.resetTime = timestamp + ONE_DAY;
        }

        // reverts if the amount exceeds the remaining available amount.
        require(limit.available >= _amount, "Exceed daily limit");

        // decrement `available`
        limit.available -= _amount;
        limits[_token] = limit;
    }
}
```

### `Account` and `AAFactory` Contracts

Let's create the account contract `Account.sol`, and the factory contract that deploys account contracts, in `AAFactory.sol`. As noted earlier, those two contracts are based on the implementations of [the multisig account abstraction tutorial](./custom-aa-tutorial.md). The main difference is that our account has a single signer.

#### `Account.sol`

1. Create a file `Account.sol` in the `contracts` folder.

2. Copy/paste the code below.

The account implements the [IAccount](../../../developer-reference/account-abstraction.md#iaccount-interface) interface and inherits the `SpendLimit` contract we just created. Since we are building an account with signers, we should also implement [EIP1271](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12).

The `isValidSignature` method will take care of verifying the signature and making sure the extracted address matches with the owner of the account.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// Access zkSync system contracts for nonce validation via NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
// to call non-view function of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";
import "./SpendLimit.sol";

contract Account is IAccount, IERC1271, SpendLimit {
    // to get transaction hash
    using TransactionHelper for Transaction;

    // state variable for account owner
    address public owner;

    bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );
        // Continue execution if called from the bootloader.
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function validateTransaction(
        bytes32,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable override onlyBootloader returns (bytes4 magic) {
        return _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal returns (bytes4 magic) {
        // Incrementing the nonce of the account.
        // Note, that reserved[0] by convention is currently equal to the nonce passed in the transaction
        SystemContractsCaller.systemCallWithPropagatedRevert(
            uint32(gasleft()),
            address(NONCE_HOLDER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(
                INonceHolder.incrementMinNonceIfEquals,
                (_transaction.nonce)
            )
        );

        bytes32 txHash;
        // While the suggested signed hash is usually provided, it is generally
        // not recommended to rely on it to be present, since in the future
        // there may be tx types with no suggested signed hash.
        if (_suggestedSignedHash == bytes32(0)) {
            txHash = _transaction.encodeHash();
        } else {
            txHash = _suggestedSignedHash;
        }

        // The fact there is are enough balance for the account
        // should be checked explicitly to prevent user paying for fee for a
        // transaction that wouldn't be included on Ethereum.
        uint256 totalRequiredBalance = _transaction.totalRequiredBalance();
        require(
            totalRequiredBalance <= address(this).balance,
            "Not enough balance for fee + value"
        );

        if (
            isValidSignature(txHash, _transaction.signature) ==
            EIP1271_SUCCESS_RETURN_VALUE
        ) {
            magic = ACCOUNT_VALIDATION_SUCCESS_MAGIC;
        } else {
            magic = bytes4(0);
        }
    }

    function executeTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _executeTransaction(_transaction);
    }

    function _executeTransaction(Transaction calldata _transaction) internal {
        address to = address(uint160(_transaction.to));
        uint128 value = Utils.safeCastToU128(_transaction.value);
        bytes memory data = _transaction.data;

        // Call SpendLimit contract to ensure that ETH `value` doesn't exceed the daily spending limit
        if (value > 0) {
            _checkSpendingLimit(address(ETH_TOKEN_SYSTEM_CONTRACT), value);
        }

        if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
            uint32 gas = Utils.safeCastToU32(gasleft());

            // Note, that the deployer contract can only be called
            // with a "systemCall" flag.
            SystemContractsCaller.systemCallWithPropagatedRevert(
                gas,
                to,
                value,
                data
            );
        } else {
            bool success;
            assembly {
                success := call(
                    gas(),
                    to,
                    value,
                    add(data, 0x20),
                    mload(data),
                    0,
                    0
                )
            }
            require(success);
        }
    }

    function executeTransactionFromOutside(
        Transaction calldata _transaction
    ) external payable {
        bytes4 magic = _validateTransaction(bytes32(0), _transaction);
        require(magic == ACCOUNT_VALIDATION_SUCCESS_MAGIC, "NOT VALIDATED");
        _executeTransaction(_transaction);
    }

    function isValidSignature(
        bytes32 _hash,
        bytes memory _signature
    ) public view override returns (bytes4 magic) {
        magic = EIP1271_SUCCESS_RETURN_VALUE;

        if (_signature.length != 65) {
            // Signature is invalid anyway, but we need to proceed with the signature verification as usual
            // in order for the fee estimation to work correctly
            _signature = new bytes(65);

            // Making sure that the signatures look like a valid ECDSA signature and are not rejected rightaway
            // while skipping the main verification process.
            _signature[64] = bytes1(uint8(27));
        }

        // extract ECDSA signature
        uint8 v;
        bytes32 r;
        bytes32 s;
        // Signature loading code
        // we jump 32 (0x20) as the first slot of bytes contains the length
        // we jump 65 (0x41) per signature
        // for v we load 32 bytes ending with v (the first 31 come from s) then apply a mask
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := and(mload(add(_signature, 0x41)), 0xff)
        }

        if (v != 27 && v != 28) {
            magic = bytes4(0);
        }

        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (
            uint256(s) >
            0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0
        ) {
            magic = bytes4(0);
        }

        address recoveredAddress = ecrecover(_hash, v, r, s);

        // Note, that we should abstain from using the require here in order to allow for fee estimation to work
        if (recoveredAddress != owner && recoveredAddress != address(0)) {
            magic = bytes4(0);
        }
    }

    function payForTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        bool success = _transaction.payToTheBootloader();
        require(success, "Failed to pay the fee to the operator");
    }

    function prepareForPaymaster(
        bytes32, // _txHash
        bytes32, // _suggestedSignedHash
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _transaction.processPaymasterInput();
    }

    fallback() external {
        // fallback of default account shouldn't be called by bootloader under no circumstances
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);

        // If the contract is called directly, behave like an EOA
    }

    receive() external payable {
        // If the contract is called directly, behave like an EOA.
        // Note, that is okay if the bootloader sends funds with no calldata as it may be used for refunds/operator payments
    }
}

```

:::warning Note 1

- The formal ETH address on zkSync Era is `0x000000000000000000000000000000000000800a`.
- Neither the well-known `0xEee...EEeE` used by protocols as a placeholder on Ethereum, nor the zero address `0x000...000`, that ([`zksync-ethers` provides](../../../sdks/js/utils.md#useful-addresses)) has a more user-friendly alias.

:::

:::info Note 2

- `SpendLimit` is token-agnostic.
- This means an extension is also possible: add a check for whether or not the execution is an ERC20 transfer by extracting the function selector in bytes from transaction calldata.

:::

#### `AAFactory.sol`

The `AAFactory.sol` contract is responsible for deploying instances of the `Account.sol` contract.

1. Create the `AAFactory.sol` file in the `contracts` folder and copy/paste the code below.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

contract AAFactory {
    bytes32 public aaBytecodeHash;

    constructor(bytes32 _aaBytecodeHash) {
        aaBytecodeHash = _aaBytecodeHash;
    }

    function deployAccount(
        bytes32 salt,
        address owner
    ) external returns (address accountAddress) {
        (bool success, bytes memory returnData) = SystemContractsCaller
            .systemCallWithReturndata(
                uint32(gasleft()),
                address(DEPLOYER_SYSTEM_CONTRACT),
                uint128(0),
                abi.encodeCall(
                    DEPLOYER_SYSTEM_CONTRACT.create2Account,
                    (
                        salt,
                        aaBytecodeHash,
                        abi.encode(owner),
                        IContractDeployer.AccountAbstractionVersion.Version1
                    )
                )
            );
        require(success, "Deployment failed");

        (accountAddress) = abi.decode(returnData, (address));
    }
}
```

## Compile and Deploy the Smart Contracts

1. Compile the contracts from the project root.

```sh
yarn hardhat compile
```

2. Create a file named `deploy/deployFactoryAccount.ts`. Then, copy and paste the following code into it. Remember to add your `DEPLOYER_PRIVATE_KEY` to the .env file.

The script deploys the factory, creates a new smart contract account, and funds it with some ETH.

```typescript
import { utils, Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);
  const wallet = new Wallet(DEPLOYER_PRIVATE_KEY, provider);
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("AAFactory");
  const aaArtifact = await deployer.loadArtifact("Account");

  // Bridge funds if the wallet on zkSync doesn't have enough funds.
  // const depositAmount = ethers.parseEther('0.1');
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: depositAmount,
  // });
  // await depositHandle.wait();

  const factory = await deployer.deploy(factoryArtifact, [utils.hashBytecode(aaArtifact.bytecode)], undefined, [aaArtifact.bytecode]);
  const factoryAddress = await factory.getAddress();
  console.log(`AA factory address: ${factoryAddress}`);

  const aaFactory = new ethers.Contract(factoryAddress, factoryArtifact.abi, wallet);

  const owner = Wallet.createRandom();
  console.log("SC Account owner pk: ", owner.privateKey);

  const salt = ethers.ZeroHash;
  const tx = await aaFactory.deployAccount(salt, owner.address);
  await tx.wait();

  const abiCoder = new ethers.AbiCoder();
  const accountAddress = utils.create2Address(factoryAddress, await aaFactory.aaBytecodeHash(), salt, abiCoder.encode(["address"], [owner.address]));

  console.log(`SC Account deployed on address ${accountAddress}`);

  console.log("Funding smart contract account with some ETH");
  await (
    await wallet.sendTransaction({
      to: accountAddress,
      value: ethers.parseEther("0.02"),
    })
  ).wait();
  console.log(`Done!`);
}
```

3. Run the script.

```sh
yarn hardhat deploy-zksync --script deployFactoryAccount.ts
```

You should see something like this:

```txt
AA factory address: 0x0d3205bc8134A11f9402fBA01947Bf377FaE4C39
SC Account owner pk:  0x4ze1f87c5e575dsb6b35afe70ftu93fs53bca24592f6ng25f3v1a4f6fsd3vz
SC Account deployed on address 0x29d0D17857bdA971F40FF11145859eED7bD15c00
Funding smart contract account with some ETH
Done!
✨  Done in 10.85s.
```

Open up the [zkSync Era block explorer](https://sepolia.explorer.zksync.io) and search for the deployed Account contract address in order to track transactions and changes in the balance.

:::tip

- For contract verification, please refer to [this section of the documentation](../../how-to/verify-contracts.md).
  :::

## Set the daily spending limit

1. Create the file `setLimit.ts` in the `deploy` folder and copy/paste the example code below.

2. Replace `<DEPLOYED_ACCOUNT_ADDRESS>` and `<DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY>` with the output from the previous section in your `.env` file.

To enable the daily spending limit, we execute the `setSpendingLimit` function with two parameters: token address and limit amount. The token address is `ETH_ADDRESS` and the limit parameter is `0.0005` in the example below (and can be any amount).

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load the values into .env file after deploying the FactoryAccount
const DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY = process.env.DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY || "";
const ETH_ADDRESS = process.env.ETH_ADDRESS || "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = process.env.DEPLOYED_ACCOUNT_ADDRESS || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);

  const owner = new Wallet(DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY, provider);

  const accountArtifact = await hre.artifacts.readArtifact("Account");
  const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, owner);

  let setLimitTx = await account.setSpendingLimit.populateTransaction(ETH_ADDRESS, ethers.parseEther("0.0005"));

  setLimitTx = {
    ...setLimitTx,
    from: ACCOUNT_ADDRESS,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: BigInt(0),
  };

  setLimitTx.gasPrice = await provider.getGasPrice();
  setLimitTx.gasLimit = await provider.estimateGas(setLimitTx);

  const signedTxHash = EIP712Signer.getSignedDigest(setLimitTx);

  const signature = ethers.concat([ethers.Signature.from(owner.signingKey.sign(signedTxHash)).serialized]);

  setLimitTx.customData = {
    ...setLimitTx.customData,
    customSignature: signature,
  };

  console.log("Setting limit for account...");
  const sentTx = await provider.broadcastTransaction(types.Transaction.from(setLimitTx).serialized);

  await sentTx.wait();

  const limit = await account.limits(ETH_ADDRESS);
  console.log("Account limit enabled?: ", limit.isEnabled);
  console.log("Account limit: ", limit.limit.toString());
  console.log("Available limit today: ", limit.available.toString());
  console.log("Time to reset limit: ", limit.resetTime.toString());
}
```

3. Run the script.

```sh
yarn hardhat deploy-zksync --script setLimit.ts
```

You should see something like this:

```text
Setting limit for account...
Account limit enabled?:  true
Account limit:  500000000000000
Available limit today:  500000000000000
Time to reset limit:  1708688165
```

## Perform ETH Transfer

Let's test the `SpendLimit` contract works to make it refuse ETH transfers that exceed the daily limit.

1. Create `transferETH.ts` and copy/paste the example code below, replacing the placeholder constants as before and adding an account address for `RECEIVER_ACCOUNT`.

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load the values into .env file after deploying the FactoryAccount
const DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY = process.env.DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY || "";
const ETH_ADDRESS = process.env.ETH_ADDRESS || "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = process.env.DEPLOYED_ACCOUNT_ADDRESS || "";
const RECEIVER_ACCOUNT = process.env.RECEIVER_ACCOUNT || "";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncSepoliaTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncSepoliaTestnet.url);

  const owner = new Wallet(DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY, provider);

  // ⚠️ update this amount to test if the limit works; 0.00051 fails but 0.00049 succeeds
  const transferAmount = "0.00051";

  let ethTransferTx = {
    from: ACCOUNT_ADDRESS,
    to: RECEIVER_ACCOUNT, // account that will receive the ETH transfer
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,

    value: ethers.parseEther(transferAmount),
    gasPrice: await provider.getGasPrice(),
    gasLimit: BigInt(20000000), // constant 20M since estimateGas() causes an error and this tx consumes more than 15M at most
    data: "0x",
  };
  const signedTxHash = EIP712Signer.getSignedDigest(ethTransferTx);
  const signature = ethers.concat([ethers.Signature.from(owner.signingKey.sign(signedTxHash)).serialized]);

  ethTransferTx.customData = {
    ...ethTransferTx.customData,
    customSignature: signature,
  };

  const accountArtifact = await hre.artifacts.readArtifact("Account");

  // read account limits
  const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, owner);
  const limitData = await account.limits(ETH_ADDRESS);

  console.log("Account ETH limit is: ", limitData.limit.toString());
  console.log("Available today: ", limitData.available.toString());

  // L1 timestamp tends to be undefined in latest blocks. So it should find the latest L1 Batch first.
  let l1BatchRange = await provider.getL1BatchBlockRange(await provider.getL1BatchNumber());
  let l1TimeStamp = (await provider.getBlock(l1BatchRange[1])).l1BatchTimestamp;

  console.log("L1 timestamp: ", l1TimeStamp);
  console.log("Limit will reset on timestamp: ", limitData.resetTime.toString());

  // actually do the ETH transfer
  console.log("Sending ETH transfer from smart contract account");
  const sentTx = await provider.broadcastTransaction(types.Transaction.from(ethTransferTx).serialized);
  await sentTx.wait();
  console.log(`ETH transfer tx hash is ${sentTx.hash}`);

  console.log("Transfer completed and limits updated!");

  const newLimitData = await account.limits(ETH_ADDRESS);
  console.log("Account limit: ", newLimitData.limit.toString());
  console.log("Available today: ", newLimitData.available.toString());
  console.log("Limit will reset on timestamp:", newLimitData.resetTime.toString());

  if (newLimitData.resetTime.toString() == limitData.resetTime.toString()) {
    console.log("Reset time was not updated as not enough time has passed");
  } else {
    console.log("Limit timestamp was reset");
  }
  return;
}
```

2. Run the script to attempt to make a transfer.

```shell
yarn hardhat deploy-zksync --script transferETH.ts
```

You should see an error message with the following content so we know it failed because the amount exceeded the limit.

```shell
An unexpected error occurred:
Error: transaction failed...

shortMessage: 'execution reverted: "Exceed daily limit"'
```

You can also search the transaction in the explorer to see the error reason.

After the error, we can rerun the code with a different ETH amount that doesn't exceed the limit, say "0.00049", to see if the `SpendLimit` contract doesn't refuse the amount lower than the limit.

If the transaction succeeds, the output should look something like this:

```shell
Account ETH limit is:  500000000000000
Available today:  494900000000000
Limit will reset on timestamp:  1708689912
Sending ETH transfer from smart contract account
ETH transfer tx hash is 0x6e7742e6555a88ca1489a06992711d413a12358f77c611cca96aba112ced812b
Transfer completed and limits updated!
Account limit:  500000000000000
Available today:  449000000000000
Limit will reset on timestamp: 1708690236
Current timestamp:  1708690185
Reset time was not updated as not enough time has passed
```

The `available` value in the `Limit` struct updates to the initial limit minus the amount we transferred.

Since `ONE_DAY` is set to 1 minute for this test in the `SpendLimit.sol` contract, you should expect it to reset after 60 seconds.

## Common Errors

- Insufficient gasLimit: Transactions often fail due to insufficient gasLimit. Please increase the value manually when transactions fail without clear reasons.
- Insufficient balance in account contract: transactions may fail due to the lack of balance in the deployed account contract. Please transfer funds to the account using MetaMask or `wallet.sendTransaction()` method used in `deploy/deployFactoryAccount.ts`.
- Transactions submitted in a close range of time will have the same `block.timestamp` as they can be added to the same L1 batch and might cause the spend limit to not work as expected.

## Learn More

- To find out more about L1->L2 interaction on zkSync Era, check out the [documentation](../../../developer-reference/l1-l2-interop.md).
- To learn more about the zksync-ethers SDK, check out its [documentation](../../../sdks/js/zksync-ethers/getting-started.md).
- To learn more about the zkSync Era Hardhat plugins, check out their [documentation](../../../tooling/hardhat/getting-started.md).

## Credits

Written by [porco-rosso](https://linktr.ee/porcorossoj) for the GitCoin bounty.
