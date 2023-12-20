---
head:
  - - meta
    - name: "twitter:title"
      content: Daily Spending Limit | zkSync Era Docs
---

# Daily Spending Limit

### Introduction

This tutorial shows you how to create a smart contract account with a daily spending limit using the zkSync Era account abstraction support.

The daily limit feature prevents an account from spending more ETH than the limit set by its owner.

### Prerequisites

- **Knowledge Base**: You should be familiar with Solidity and Hardhat.
- **Wallet Setup**: Ensure your zkSync testnet wallet holds a balance in both ETH and the specific ERC-20 token intended for the paymaster contract
- **Tooling**: This guide utilizes [`zksync-cli`](../../../../tooling/zksync-cli.md). Ensure you have it accessible or installed in your environment.

### Step 1 - Understanding Daily Spend Limit Accounts

Now let’s dive into the design and implementation of the daily spending limit feature.

The `SpendLimit` contract inherits from the `Account` contract as a module that does the following:

- Allows the account to enable/disable the daily spending limit in a token (ETH in this example).
- Allows the account to change (increase/decrease or remove) the daily spending limit.
- Rejects token transfer if the daily spending limit has been exceeded.
- Restores the available amount for spending after 24 hours.

**Token-Agnostic Design**

`SpendLimit` is token-agnostic, allowing you to extend its functionality for ERC20 transfers by extracting the function selector from the transaction `calldata`.

### Step 2 - Environment setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

<pre class="language-bash"><code class="lang-bash"><strong>npx zksync-cli@latest create-project spend-limit-account --template hardhat_solidity
</strong></code></pre>

Add the zkSync and OpenZeppelin contract libraries:

```sh
yarn add -D @matterlabs/zksync-contracts @openzeppelin/contracts
```

Include the `isSystem: true` setting in the `hardhat.config.ts` configuration file to allow interaction with system contracts:

<details>

<summary>hardhat.config.ts</summary>

```typescript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import "@matterlabs/hardhat-zksync-verify";

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {
      isSystem: true, // make sure to include this line
    },
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
```

</details>

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance.

### Step 3 - Writing `SpendLimit` Contract

The `SpendLimit` smart contract is designed to enforce daily spending limits for accounts on zkSync. It supports both ETH and ERC20 tokens.

1. Create a new Solidity file named `SpendLimit.sol` in the `/contracts` directory.
2. Insert the provided code into `SpendLimit.sol:`

<details>

<summary>SpendLimit.sol</summary>

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
        uint timestamp = block.timestamp; // L1 batch timestamp

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
        require(limit.available >= _amount, "Exceed daily limit");

        // decrement `available`
        limit.available -= _amount;
        limits[_token] = limit;
    }
}
```

</details>

Let's explain the `SpendLimit` contract.&#x20;

**Data Structures**

- `Limit`: A struct holding the attributes for a spending limit.

  ```solidity
  struct Limit {
    uint limit;
    uint available;
    uint resetTime;
    bool isEnabled;
  }
  ```

- `limit`: The daily spending cap.
- `available`: Amount left to spend within the day.
- `resetTime`: Timestamp when `available` resets to `limit`.
- `isEnabled`: Status of spending limit for a token.
- `limits`: A mapping of token addresses to their respective `Limit` struct.

```solidity
mapping(address => Limit) public limits;
```

**Functions & Modifiers**

- `onlyAccount`: A modifier to restrict function calls to the inheriting contract.
- `setSpendingLimit`: Sets a spending limit for a specific token.
- `removeSpendingLimit`: Removes the spending limit for a specific token.
- `_isValidUpdate`: Checks the validity of an update to a spending limit.
- `_updateLimit`: Modifies the `limits` mapping.
- `_checkSpendingLimit`: Checks and updates the available spending limit before a transaction.

**Setting & Removing Daily Limits**

```solidity
function setSpendingLimit(address _token, uint _amount) public onlyAccount {
    require(_amount != 0, "Invalid amount");
    uint timestamp = block.timestamp;
    uint resetTime = _isValidUpdate(_token) ? timestamp + ONE_DAY : timestamp;
    _updateLimit(_token, _amount, _amount, resetTime, true);
}

function removeSpendingLimit(address _token) public onlyAccount {
    require(_isValidUpdate(_token), "Invalid Update");
    _updateLimit(_token, 0, 0, 0, false);
}

function _isValidUpdate(address _token) internal view returns (bool) {
    if (!limits[_token].isEnabled) return false;

    uint resetTime = limits[_token].resetTime;
    require(
        limits[_token].limit == limits[_token].available ||
        block.timestamp > resetTime,
        "Invalid Update"
    );
    return true;
}
```

- `setSpendingLimit`: Calls `_updateLimit` after validations.
- `removeSpendingLimit`: Calls `_updateLimit` to set all fields to zero.
- `_isValidUpdate`: Validates the timing and availability for updates.

**Transaction Execution & Limit Checks**

```solidity
function _checkSpendingLimit(address _token, uint _amount) internal {
    Limit memory limit = limits[_token];
    if (!limit.isEnabled) return;

    uint timestamp = block.timestamp;

    if (timestamp > limit.resetTime) {
        limit.resetTime = timestamp + ONE_DAY;
        limit.available = limit.limit;
    }

    require(limit.available >= _amount, "Exceed daily limit");
    limit.available -= _amount;
    limits[_token] = limit;
}
```

- `_checkSpendingLimit`: Validates and updates the remaining available limit before a transaction.

#### Additional Notes

- `ONE_DAY` is set to `24 hours` for this contract. In a testing environment, it can be set to `1 minutes` for expedited testing. Adjust accordingly.

### Step 4 - Adding `Account` and `AAFactory` contracts

This step guides you through the creation and configuration of the `Account` and `AAFactory` smart contracts.

**Create `Account.sol`**

1. Create a new Solidity file named `Account.sol` in the `/contracts` directory.
2. Insert the provided code into `Account.sol`.

<details>

<summary>Account.sol</summary>

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
        _validateTransaction(bytes32(0), _transaction);
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

</details>

**Structure & Inheritance**

- Implement `IAccount` interface.
- Inherits `SpendLimit` contract.
- Implement `EIP1271` for signature verification.

The `Account` contract should satisfy the [`IAccount` interface](https://era.zksync.io/docs/reference/concepts/account-abstraction.html#iaccount-interface) and inherit from the `SpendLimit` contract. Additionally, add [`EIP1271`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12) support for signature validation. The `isValidSignature` function will handle signature verification.

**Formal ETH Address**

In zkSync, the formal ETH address is `0x000000000000000000000000000000000000800a`. It's different from common placeholders like `0xEee...EEeE` in Ethereum or the zero address `0x000...000`.

**Create `AAFactory.sol`**

The `AAFactory.sol` contract is responsible for deploying instances of the `Account.sol` contract.

1. Create a new Solidity file named `AAFactory.sol` in the `/contracts` directory.
2. Insert the provided code into `AAFactory.sol`.

<details>

<summary>AAFactory.sol</summary>

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

</details>

### Step 5 - Compile and deploy contracts

This step outlines the process of compiling your smart contracts and deploying a factory account.

Compile the contracts:

```sh
yarn hardhat compile
```

**Create Deployment Script**

1. Create a new TypeScript file in the `/deploy` directory, for example, `deployFactoryAccount.ts`.
2. Populate `deployFactoryAccount.ts` with the provided script, replacing `<DEPLOYER_PRIVATE_KEY>` with your own private key.

<details>

<summary>deployFactoryAccount.ts</summary>

```typescript
import { utils, Wallet, Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
  const wallet = new Wallet("<DEPLOYER_PRIVATE_KEY>", provider);
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("AAFactory");
  const aaArtifact = await deployer.loadArtifact("Account");

  const factory = await deployer.deploy(factoryArtifact, [utils.hashBytecode(aaArtifact.bytecode)], undefined, [aaArtifact.bytecode]);

  console.log(`AA factory address: ${factory.address}`);

  const aaFactory = new ethers.Contract(factory.address, factoryArtifact.abi, wallet);

  const owner = Wallet.createRandom();
  console.log("SC Account owner pk: ", owner.privateKey);

  const salt = ethers.constants.HashZero;
  const tx = await aaFactory.deployAccount(salt, owner.address);
  await tx.wait();

  const abiCoder = new ethers.utils.AbiCoder();
  const accountAddress = utils.create2Address(factory.address, await aaFactory.aaBytecodeHash(), salt, abiCoder.encode(["address"], [owner.address]));

  console.log(`SC Account deployed on address ${accountAddress}`);

  console.log("Funding smart contract account with some ETH");
  await (
    await wallet.sendTransaction({
      to: accountAddress,
      value: ethers.utils.parseEther("0.02"),
    })
  ).wait();
  console.log(`Done!`);
}
```

</details>

Run the script:

```sh
yarn hardhat deploy-zksync --script deployFactoryAccount.ts
```

You should see something like this:

```txt
AA factory address: 0x56DD798Fa6934E3133b0b78A47B41E07ef1c9114
SC Account owner pk:  0x4d788b20f88040698acfcd195e877770d53eb70da1839c726a005ba556e6ffa6
SC Account deployed on address 0xb6Ed219bf1e40AF0b6D22d248FEa63076E064d3b
Funding smart contract account with some ETH
Done!
```

**Output Fields**

- `AA factory address`: Address of the deployed factory account.
- `SC Account owner pk`: Private key of the smart contract account owner.
- `SC Account deployed on address`: Smart contract account deployment address.
- `Funding smart contract account with some ETH`: Indicates that the account is being funded.

### Step 7 - Set the daily spending limit

This step focuses on setting a daily spending limit for a specified account using the `setSpendingLimit` function in the smart contract.

1. Create a new TypeScript file in `/deploy`, naming it `setLimit.ts`.
2. Fill `setLimit.ts` with the provided script, replacing `<DEPLOYED_ACCOUNT_ADDRESS>` and `<DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY>` based on outputs from the previous steps.

<details>

<summary>setLimit.ts</summary>

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const ETH_ADDRESS = "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = "<DEPLOYED_ACCOUNT_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);

  const owner = new Wallet("<DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY>", provider);

  const accountArtifact = await hre.artifacts.readArtifact("Account");
  const account = new Contract(ACCOUNT_ADDRESS, accountArtifact.abi, owner);

  let setLimitTx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, ethers.utils.parseEther("0.0005"));

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
  setLimitTx.gasLimit = await provider.estimateGas(setLimitTx);

  const signedTxHash = EIP712Signer.getSignedDigest(setLimitTx);

  const signature = ethers.utils.arrayify(ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash)));

  setLimitTx.customData = {
    ...setLimitTx.customData,
    customSignature: signature,
  };

  console.log("Setting limit for account...");
  const sentTx = await provider.sendTransaction(utils.serialize(setLimitTx));

  await sentTx.wait();

  const limit = await account.limits(ETH_ADDRESS);
  console.log("Account limit enabled?: ", limit.isEnabled);
  console.log("Account limit: ", limit.limit.toString());
  console.log("Available limit today: ", limit.available.toString());
  console.log("Time to reset limit: ", limit.resetTime.toString());
}
```

</details>

**Configure Limit Parameters**

The `setSpendingLimit` function takes two arguments:

- `token address`: Use `ETH_ADDRESS` for Ethereum.
- `limit amount`: Specify the daily limit in ETH, for example, "0.0005".

Run the script:

```sh
yarn hardhat deploy-zksync --script setLimit.ts
```

You should see something like this:

```
Setting limit for account...
Account limit enabled?:  true
Account limit:  500000000000000
Available limit today:  500000000000000
Time to reset limit:  1683027630
```

### Step 8 - Test SpendLimit Contract

This section outlines how to test the `SpendLimit` contract to verify its daily ETH spending limitations.

**Create Test Script**

1. Create a new TypeScript file in the `/deploy` directory. Name it `transferETH.ts`.
2. Populate `transferETH.ts` with the provided script, updating placeholder constants and `<RECEIVER_ACCOUNT>` with an actual account address.

<details>

<summary>transferETH.ts</summary>

```typescript
import { utils, Wallet, Provider, Contract, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const ETH_ADDRESS = "0x000000000000000000000000000000000000800A";
const ACCOUNT_ADDRESS = "<DEPLOYED_ACCOUNT_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
  const provider = new Provider(hre.config.networks.zkSyncTestnet.url);

  const owner = new Wallet("<DEPLOYED_ACCOUNT_OWNER_PRIVATE_KEY>", provider);

  // account that will receive the ETH transfer
  const receiver = "<RECEIVER_ACCOUNT>";
  // ⚠️ update this amount to test if the limit works; 0.00051 fails but 0.00049 succeeds
  const transferAmount = "0.00051";

  let ethTransferTx = {
    from: ACCOUNT_ADDRESS,
    to: receiver,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ACCOUNT_ADDRESS),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,

    value: ethers.utils.parseEther(transferAmount),
    gasPrice: await provider.getGasPrice(),
    gasLimit: ethers.BigNumber.from(20000000), // constant 20M since estimateGas() causes an error and this tx consumes more than 15M at most
    data: "0x",
  };
  const signedTxHash = EIP712Signer.getSignedDigest(ethTransferTx);
  const signature = ethers.utils.arrayify(ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash)));

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
  const sentTx = await provider.sendTransaction(utils.serialize(ethTransferTx));
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

</details>

Run the script:

```shell
yarn hardhat deploy-zksync --script deploy/transferETH.ts
```

**Expect an error message**. This confirms the contract enforces the daily spending limit. The error will be generic and might read as:

```shell
An unexpected error occurred:

Error: transaction failed...
```

**Test with Lower Amount**

1. Modify the ETH amount in `transferETH.ts` to a value below the daily limit, such as "0.00049".
2. Re-run the script. If successful, the output should resemble:

```shell
Account ETH limit is:  500000000000000
Available today:  499780000000000
L1 timestamp:  1683111266
Limit will reset on timestamp:  1683111958
Sending ETH transfer from smart contract account
ETH transfer tx hash is 0x90f1ca06e6b407dfba75da2b0e9a7d06909c1c7d702f9da44fa5124ae5864dfc
Transfer completed and limits updated!
Account limit:  500000000000000
Available today:  499670000000000
Limit will reset on timestamp:: 1683111958
Reset time was not updated as not enough time has passed
```

**Validate Limit Reset**

The limit reset time is set to 60 seconds for this test. After this period, re-run the test to confirm the limit resets.

**Output Fields**

- `Account ETH limit`: The daily spending limit in ETH.
- `Available today`: Remaining limit for the current day.
- `Limit will reset on timestamp`: Time when the limit will reset.
- `ETH transfer tx hash`: Transaction hash of the ETH transfer.

### Conclusion
