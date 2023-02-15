# Daily spend limit account

In this tutorial, we'll create a smart contract account with a daily spend limit thanks to the Account Abstraction support on zkSync.




::: warning

Please note that breaking changes were introduced in `zksync-web3 ^0.13.0`. The API layer now operates with `gas` and the `ergs` concept is only used internally by the VM. 

This tutorial will be updated shortly to reflect those changes.

:::

## Prerequisite

It is highly encouraged that you read [the basics of Account Abstraction on zkSync](../developer-guides/aa.md) and complete the [multisig account tutorial](./custom-aa-tutorial.md) first.

Apart from that we'll build this project with [Node.js](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) so make sure you have installed them.

## Installing dependencies

We will use the [zkSync Hardhat plugins](../../api/hardhat/) to build, deploy, and interact with the smart contracts of this project.

First, let’s install all the dependencies that we'll need:

```shell
mkdir custom-spendlimit-tutorial
cd custom-spendlimit-tutorial
yarn init -y
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

The current version of `zksync-web3` uses `ethers v5.7.x` as a peer dependency. An update compatible with `ethers v6.x.x` will be released soon.

:::

Additionally, please install a few packages that allow us to utilize the [zkSync smart contracts](../developer-guides/system-contracts.md).

```shell
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Lastly, create `hardhat.config.ts` config file and the `contracts` and `deploy` folders like in the [quickstart tutorial](../building-on-zksync/hello-world.md).

::: tip zksync-cli

You can use the zkSync CLI to scaffold a project automatically. Find [more info about the zkSync CLI here](../../api/tools/zksync-cli/).

:::

## Design

Now, let’s dive into the design and implementation of the daily spending limit feature that helps prevent an account from spending more ETH than the limit set by its owner.

The `SpendLimit` contract is inherited from the `Account` contract as a module that has the following functionalities:

- Allow the account to enable/disable the daily spending limit in a token (ETH in this example).
- Allow the account to change (increase/decrease or remove) the daily spending limit.
- Reject token transfer if the daily spending limit has been exceeded.
- Restore the available amount for spending after 24 hours.

### Basic structure

Below is the skeleton of the SpendLimit contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

First, add the mapping `limits` and struct `Limit` that serve as data storages for the state of daily limits accounts enable. The roles of each variable in the struct are commented out below.

```solidity
    struct Limit {
        uint limit;      // the amount of a daily spending limit
        uint available;  // the available amount that can be spent
        uint resetTime;  // block.timestamp when the available amount is restored
        bool isEnabled;  // true when a daily spending limit is enabled
    }

    mapping(address => Limit) public limits; // token address => Limit
```

Note that the `limits` mapping uses the token address as its key. This means that users will be able to set limits for ETH or any ERC20 token.

### Setting and Removing of the daily spending limit

Here is the implementation to set and remove the limit:

```solidity

    /// this function enables a daily spending limit for specific tokens.
    function setSpendingLimit(address _token, uint _amount) public onlyAccount {
        require(_amount != 0, "Invalid amount");

        uint resetTime;
        uint timestamp = block.timestamp; // L1 batch timestamp

        if (_isValidUpdate(_token)) {
            resetTime = timestamp + ONE_DAY;
        } else {
            resetTime = timestamp;
        }

        _updateLimit(_token, _amount, _amount, resetTime, true);
    }

    // this function disables an active daily spending limit,
    function removeSpendingLimit(address _token) public onlyAccount {
        require(isValidUpdate(_token), "Invalid Update");
        _updateLimit(_token, 0, 0, 0, false);
    }

    // verify if the update to a Limit struct is valid
    function _isValidUpdate(address _token) internal view returns(bool) {

        if (limits[_token].isEnabled) {
            require(limits[_token].limit == limits[_token].available || block.timestamp > limits[_token].resetTime,
                "Invalid Update");

            return true;
        } else {
            return false;
        }
    }

    // storage-modifying private function called by either setSpendingLimit or removeSpendingLimit
    function _updateLimit(address _token, uint _limit, uint _available, uint _resetTime, bool _isEnabled) private {
        Limit storage limit = limits[_token];
        limit.limit = _limit;
        limit.available = _available;
        limit.resetTime = _resetTime;
        limit.isEnabled = _isEnabled;
    }

```

Both `setSpendingLimit` and `removeSpendingLimit` can only be called by account contracts that inherit this contract `SpendLimit`, which is ensured by the `onlyAccount` modifier. They call `_updateLimit` and passing the arguments to modify the storage data of the limit after the verification in `_isValidUpdate` succeeds.

Specifically, `setSpendingLimit` sets a non-zero daily spending limit for a given token, and `removeSpendingLimit` disables the active daily spending limit by decreasing `limit` and `available` to 0 and setting `isEnabled` to false.

`_isValidUpdate` returns false if the spending limit is not enabled and also throws an `Invalid Update` error if the user has spent some amount in the day (the available amount is different from the limit) or the function is called before 24 hours have passed since the last update. This ensures that users can't freely modify (increase or remove) the daily limit to spend more.

### Checking daily spending limit

The `_checkSpendingLimit` function is internally called by the account contract itself before executing the transaction.

```solidity

    // this function is called by the account itself before execution.
    function _checkSpendingLimit(address _token, uint _amount) internal {
        Limit memory limit = limits[_token];

        if(!limit.isEnabled) return;

        uint timestamp = block.timestamp; // L1 batch timestamp

        if (limit.limit != limit.available && timestamp > limit.resetTime) {
            limit.resetTime = timestamp + ONE_DAY;
            limit.available = limit.limit;

        } else if (limit.limit == limit.available) {
            limit.resetTime = timestamp + ONE_DAY;
        }

        require(limit.available >= _amount, 'Exceed daily limit');

        limit.available -= _amount;
        limits[_token] = limit;
    }
```

If the daily spending limit is disabled, the checking process immediately stops.

```solidity
if(!limit.isEnabled) return;
```

Before checking the spending amount, this method renews the `resetTime` and `available` amount if a day has already passed since the last update: timestamp > resetTime. It only updates the `resetTime` if the transaction is the first spending after enabling the limit. This way the daily limit actually starts with the first transaction.

```solidity

if (limit.limit != limit.available && timestamp > limit.resetTime) {
      limit.resetTime = timestamp + ONE_DAY;
      limit.available = limit.limit;

} else if (limit.limit == limit.available) {
      limit.resetTime = timestamp + ONE_DAY;
}

```

Finally, the method checks if the account is able to spend a specified amount of the token. If the amount doesn't exceed the available amount, it decrements the `available` in the limit:

```solidity
require(limit.available >= _amount, 'Exceed daily limit');

limit.available -= _amount;
```

Note: you might have noticed the comment `// L1 batch timestamp` above. The details of this will be explained below.

### Full code

Now, here is the complete code of the SpendLimit contract. But one thing to be noted is that the value of the ONE_DAY variable is set to `1 minutes` instead of `24 hours`. This is just for testing purposes (we don't want to wait a full day to see if it works!) so, please don't forget to change the value before deploying the contract.

```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        uint timestamp = block.timestamp; // L1 batch timestamp

        if (_isValidUpdate(_token)) {
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
    function isValidUpdate(address _token) internal view returns(bool) {

        // Reverts unless it is first spending after enabling
        // or called after 24 hours have passed since the last update.
        if (limits[_token].isEnabled) {
            require(limits[_token].limit == limits[_token].available || block.timestamp > limits[_token].resetTime,
                "Invalid Update");

            return true;
        } else {
            return false;
        }
    }

    // storage-modifying private function called by either setSpendingLimit or removeSpendingLimit
    function _updateLimit(address _token, uint _limit, uint _available, uint _resetTime, bool _isEnabled) private {
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
        if(!limit.isEnabled) return;

        uint timestamp = block.timestamp; // L1 batch timestamp

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
        require(limit.available >= _amount, 'Exceed daily limit');

        // decrement `available`
        limit.available -= _amount;
        limits[_token] = limit;
    }

}

```

### Account & Factory contracts

That's pretty much for `SpendLimit.sol`. Now, we also need to create the account contract `Account.sol`, and the factory contract that deploys account contracts,`AAFactory.sol`.

As noted earlier, those two contracts are mostly based on the implementations of [another tutorial about Account Abstraction](./custom-aa-tutorial.md).

We will not explain in depth how these contract work as they're similar to the ones used in the multisig account abstraction tutorial. The only difference is that our account will have a single signer instead of two.

Below are the full codes.

#### Account.sol contract

The account contract implements the IAccount interface and inherits the SpendLimit contract we just created:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol";
import "./SpendLimit.sol";

contract Account is IAccount, IERC1271, SpendLimit { // imports SpendLimit contract

    using TransactionHelper for Transaction;

    address public owner;

    bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );

        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function validateTransaction(
        bytes32,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal {

        SystemContractsCaller.systemCall(
            uint32(gasleft()),
            address(NONCE_HOLDER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(
                INonceHolder.incrementMinNonceIfEquals,
                (_transaction.reserved[0])
            )
        );

        bytes32 txHash;

        if (_suggestedSignedHash == bytes32(0)) {
            txHash = _transaction.encodeHash();
        } else {
            txHash = _suggestedSignedHash;
        }

        require(
            isValidSignature(txHash, _transaction.signature) ==
                EIP1271_SUCCESS_RETURN_VALUE
        );
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
        uint256 value = _transaction.reserved[1];
        bytes memory data = _transaction.data;

        // Call SpendLimit contract to ensure that ETH `value` doesn't exceed the daily spending limit
        if ( value > 0 ) {
           _checkSpendingLimit(address(ETH_TOKEN_SYSTEM_CONTRACT), value);
        }

        if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
            SystemContractsCaller.systemCall(
                uint32(gasleft()),
                to,
                uint128(_transaction.reserved[1]),
                _transaction.data
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

    function executeTransactionFromOutside(Transaction calldata _transaction)
        external
        payable
    {
        _validateTransaction(bytes32(0), _transaction);

        _executeTransaction(_transaction);
    }

    function isValidSignature(bytes32 _hash, bytes calldata _signature)
        public
        view
        override
        returns (bytes4)
    {

        require(owner == ECDSA.recover(_hash, _signature));
        return EIP1271_SUCCESS_RETURN_VALUE;
    }

    function payForTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        bool success = _transaction.payToTheBootloader();
        require(success, "Failed to pay the fee to the operator");
    }

    function prePaymaster(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _transaction.processPaymasterInput();
    }

    receive() external payable {
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
    }
}
```

The `_executeTransaction` method is where we'll use the methods from the `SpendLimit.sol` contract. If the ETH transaction value is non-zero, the Account contract calls `_checkSpendingLimit` to verify the allowance for spending.

```solidity

if ( value > 0 ) {
    _checkSpendingLimit(address(ETH_TOKEN_SYSTEM_CONTRACT), value);
}
```

Since we want to set the spending limit of ETH in this example, the first argument in `_checkSpendingLimit` should be `address(ETH_TOKEN_SYSTEM_CONTRACT)`, which is imported from a system contract called `system-contracts/Constant.sol`.

**Note1** : The formal ETH address on zkSync is `0x000000000000000000000000000000000000800a`, neither the well-known `0xEee...EEeE` used by protocols as a placeholder on Ethereum, nor the zero address `0x000...000`, which is what `zksync-web3` package ([See](../../api/js/utils.md#the-address-of-ether)) provides as a more user-friendly alias.

**Note2** : SpendLimit is token-agnostic. Thus an extension is also possible: add a check for whether or not the execution is an ERC20 transfer by extracting the function selector in bytes from transaction calldata.

#### AAFactory.sol contract

The `AAFactory.sol` contract will be responsible of deploying instances of the `Account.sol` contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol";

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
                    (salt, aaBytecodeHash, abi.encode(owner))
                )
            );
        require(success, "Deployment failed");

        (accountAddress, ) = abi.decode(returnData, (address, bytes));
    }
}
```

## Deploying the smart contracts

### Compile

Finally, we are ready to compile and deploy the contracts. So, before the deployment, let's compile the contracts by running:

```shell
yarn hardhat compile
```

### Deployment script

Then, let's create a file `deploy-factory-account.ts` that deploys all the contracts we've made above and creates an account.

```typescript
import { utils, Wallet, Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet("<WALLET_PRIVATE_KEY>", provider);
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("AAFactory");
  const aaArtifact = await deployer.loadArtifact("Account");

  // Bridge funds if wallet on zkSync doesn't have enough funds.
  // const depositAmount = ethers.utils.parseEther('0.1');
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: depositAmount,
  // });
  // await depositHandle.wait();

  const factory = await deployer.deploy(factoryArtifact, [utils.hashBytecode(aaArtifact.bytecode)], undefined, [aaArtifact.bytecode]);

  console.log(`AA factory address: ${factory.address}`);

  const aaFactory = new ethers.Contract(factory.address, factoryArtifact.abi, wallet);

  const owner = Wallet.createRandom();
  console.log("Account owner pk: ", owner.privateKey);

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(salt, owner.address);
  await tx.wait();

  const abiCoder = new ethers.utils.AbiCoder();
  const accountAddress = utils.create2Address(factory.address, await aaFactory.aaBytecodeHash(), salt, abiCoder.encode(["address"], [owner.address]));

  console.log(`Account deployed on address ${accountAddress}`);

  await (
    await wallet.sendTransaction({
      to: accountAddress,
      value: ethers.utils.parseEther("0.02"),
    })
  ).wait();
}
```

After changing `<WALLET_PRIVATE_KEY>`, run:

```shell
yarn hardhat deploy-zksync --script deploy-factory-account.ts
```

The output would look like the following:

```shell
AA factory address: 0x9db333Cb68Fb6D317E3E415269a5b9bE7c72627Ds
Account owner pk: 0x957aff65500eda28beb7130b7c1bc48f783556bb84fa6874d2204c1d66a0ddc7
Account deployed on address 0x6b6B8ea196a6F27EFE408288a4FEeBE9A9e12005
```

So, we are ready to try the functionality of the `SpendLimit` contract. For the test, now please open [zkSync Era Block Explorer](https://goerli.explorer.zksync.io/) and search for the deployed Account contract address to be able to track transactions and changes in the balance which we will see in the following sections.

**TIP**: For contract verification, please refer to [this section of the documentation](../building-on-zksync/contracts/contract-verification.md).

## Set the daily spending limit

First, create `setLimit.ts` in the `/deploy` folder and after pasting the example code below, replace the undefined account address and private key string values with the ones we got in the previous section.

To enable the daily spending limit, we execute the `setSpendingLimit` function with two parameters: token address and amount limit. The token address is ETH_ADDRESS and the limit parameter is "0.005" in the example below. (can be any amount)

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const ETH_ADDRESS = "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = "<ACCOUNT_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet("<WALLET_PRIVATE_KEY>", provider);
  const owner = new Wallet("<OWNER_PRIVATE_KEY>", provider);

  const accountArtifact = await hre.artifacts.readArtifact("Account");
  const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, wallet);

  let setLimitTx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, ethers.utils.parseEther("0.005"));

  setLimitTx = {
    ...setLimitTx,
    from: ACCOUNT_ADDRESS,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: ethers.BigNumber.from(0),
  };

  setLimitTx.gasPrice = await provider.getGasPrice();
  setLimitTx.l2gasLimit = await provider.estimateGas(setLimitTx);

  const signedTxHash = EIP712Signer.getSignedDigest(setLimitTx);
  const signature = ethers.utils.arrayify(ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash)));

  setLimitTx.customData = {
    ...setLimitTx.customData,
    customSignature: signature,
  };

  const sentTx = await provider.sendTransaction(utils.serialize(setLimitTx));
  await sentTx.wait();

  const limit = await account.limits(ETH_ADDRESS);
  console.log("limit: ", limit.limit.toString());
  console.log("available: ", limit.available.toString());
  console.log("resetTime: ", limit.resetTime.toString());
  console.log("Enabled: ", limit.isEnabled);
}
```

The expected output would mostly look like this:

```shell
limit:  5000000000000000
available:  5000000000000000
resetTime:  1672928333
Enabled:  true
```

## Perform ETH transfer

Finally, we will see if the SpendLimit contract works and refuses any ETH transfer that exceeds the daily limit. Let's create `transferETH.ts` with the example code below.

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const ETH_ADDRESS = "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = "<ACCOUNT_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet("<WALLET_PRIVATE_KEY>", provider);
  const owner = new Wallet("<OWNER_PRIVATE_KEY>", provider);

  let ethTransferTx = {
    from: ACCOUNT_ADDRESS,
    to: wallet.address,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: ethers.utils.parseEther("0.0051"), // 0.0051 fails but 0.0049 succeeds
    gasPrice: await provider.getGasPrice(),
    l2gasLimit: ethers.BigNumber.from(20000000), // constant 20M since estimateGas() causes an error, and this tx consumes more than 15M at most
    data: "0x",
  };
  const signedTxHash = EIP712Signer.getSignedDigest(ethTransferTx);
  const signature = ethers.utils.arrayify(ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash)));

  ethTransferTx.customData = {
    ...ethTransferTx.customData,
    customSignature: signature,
  };

  const accountArtifact = await hre.artifacts.readArtifact("Account");
  const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, wallet);
  const limit = await account.limits(ETH_ADDRESS);

  // L1 timestamp tends to be undefined in the latest blocks. So should find the latest L1 Batch first.
  let l1BatchRange = await provider.getL1BatchBlockRange(await provider.getL1BatchNumber());
  let l1TimeStamp = (await provider.getBlock(l1BatchRange[1])).l1BatchTimestamp;

  console.log("l1TimeStamp: ", l1TimeStamp);
  console.log("resetTime: ", limit.resetTime.toString());

  // avoid unnecessary errors due to the delay in timestamp of L1 batch
  // first spending after enabling of limit is ignored
  if (l1TimeStamp > limit.resetTime.toNumber() || limit.limit == limit.available) {
    const sentTx = await provider.sendTransaction(utils.serialize(ethTransferTx));
    await sentTx.wait();

    const limit = await account.limits(ETH_ADDRESS);
    console.log("limit: ", limit.limit.toString());
    console.log("available: ", limit.available.toString());
    console.log("resetTime: ", limit.resetTime.toString());
    console.log("Enabled: ", limit.isEnabled);

    return;
  } else {
    let wait = Math.round((limit.resetTime.toNumber() - l1TimeStamp) / 60);
    console.log("Tx would fail due to approx ", wait, " mins difference in timestamp between resetTime and l1 batch");
  }
}
```

To make a transfer, run the following:

```shell
yarn hardhat deploy-zksync --script deploy/transferETH.ts
```

Although the error message doesn't give us any concrete reason, it's anticipated that the transaction was reverted like the below:

```shell
An unexpected error occurred:

Error: transaction failed...
```

After the error, we can rerun the code with a different ETH amount that doesn't exceed the limit, say "0.0049", to see if the `SpendLimit` contract doesn't refuse the amount lower than the limit.

If the transaction succeeds, the output would be like the following:

```shell
l1TimeStamp:  1673530137
resetTime:  1673529801
limit:  5000000000000000
available:  100000000000000
New resetTime: 1673530575
```

The value `available` in the Limit struct was decremented, so now only 0.0001 ETH is available for transfer.

Since the `ONE_DAY` is set to 1 minute for this test, another transfer with any amount less than the limit is supposed to succeed accordingly after a minute instead of 24 hours. However, the second transfer would fail, and we would have to wait until the next L1 batch is sealed (around ten minutes on testnet) to make a successful transaction instead. To understand the reason behind this, we should know about a constraint of using `block.timestamp`.

::: warning block.timestamp returns L1 batch value

The `block.timestamp` returns the time of the latest L1 batch instead of the L2 block and it's only updated once a new batch is sealed ( 5-10 minutes on testnet). What this means is that basically, `block.timestamp` in smart contracts on zkSync is a delayed value.

To keep this tutorial as simple as possible, we've used `block.timestamp` but we don't recommend relying on this for accurate time calculations.

:::

## Common Errors

- Insufficient gasLimit: Transactions often fail due to insufficient gasLimit. Please increase the value manually when transactions fail without clear reasons.
- Insufficient balance in account contract: transactions may fail due to the lack of balance in the deployed account contract. Please transfer funds to the account using Metamask or `wallet.sendTransaction()` method used in `deploy/deploy-factory-account.ts`.
- Transactions submitted in a close range of time will have the same `block.timestamp` as they can be added to the same L1 batch and might cause the spend limit to not work as expected.

## Complete Project

You can download the complete project [here](https://github.com/porco-rosso-j/daily-spendlimit-tutorial). Additionally, the repository contains a test folder that can perform more detailed testing than this tutorial on zkSync local network.

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](../developer-guides/bridging/l1-l2.md).
- To learn more about the zksync-web3 SDK, check out its [documentation](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../api/hardhat).

## Credits

Written by [porco-rosso](https://linktr.ee/porcorossoj) for the following [GitCoin bounty](https://gitcoin.co/issue/29669).
