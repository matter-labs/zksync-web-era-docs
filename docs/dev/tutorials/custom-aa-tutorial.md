# Account abstraction

Now, let's learn how to deploy your custom accounts and interact directly with the [ContractDeployer](../developer-guides/contracts/system-contracts.md#contractdeployer) system contract.
In this tutorial, we build a factory that deploys 2-of-2 multisig accounts.

## Prerequisite

It is highly recommended to read about the [design](../developer-guides/aa.md) of the account abstraction protocol before diving into this tutorial.

It is assumed that you are already familiar with deploying smart contracts on zkSync.
If not, please refer to the first section of the [quickstart tutorial](../developer-guides/hello-world.md).
It is also recommended to read the [introduction](../developer-guides/contracts/system-contracts.md) to the system contracts.

## Installing dependencies

We will use the zkSync hardhat plugin for developing this contract. Firstly, we should install all the dependencies for it:

```
mkdir custom-aa-tutorial
cd custom-aa-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Since we are working with zkSync contracts, we also need to install the package with the contracts and its peer dependencies:

```
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Also, create the `hardhat.config.ts` config file, `contracts` and `deploy` folders, like in the [quickstart tutorial](../developer-guides/hello-world.md).

## Account abstraction

Each account needs to implement the [IAccount](../developer-guides/aa.md#iaccount-interface) interface. Since we are building an account with signers, we should also have [EIP1271](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12) implemented.

The skeleton for the contract will look the following way:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol';

import "@openzeppelin/contracts/interfaces/IERC1271.sol";

contract TwoUserMultisig is IAccount, IERC1271 {

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continure execution if called from the bootloader.
        _;
    }

    function validateTransaction(bytes32, bytes32 _suggestedSignedHash, Transaction calldata _transaction) external payable override onlyBootloader {
        _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(bytes32 _suggestedSignedHash, Transaction calldata _transaction) internal {

    }

    function executeTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
        _executeTransaction(_transaction);
	  }

    function _executeTransaction(Transaction calldata _transaction) internal {

    }

    function executeTransactionFromOutside(Transaction calldata _transaction) external payable {
        _validateTransaction(_transaction);
        _executeTransaction(_transaction);
    }

	  bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    function isValidSignature(bytes32 _hash, bytes calldata _signature) public override view returns (bytes4) {
        return EIP1271_SUCCESS_RETURN_VALUE;
    }

    function payForTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {

    }

    function prePaymaster(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {

    }

	  receive() external payable {
        // If the bootloader called the `receive` function, it likely means
        // that something went wrong and the transaction should be aborted. The bootloader should
        // only interact through the `validateTransaction`/`executeTransaction` methods.
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
    }
}
```

Note, that only the [bootloader](../developer-guides/contracts/system-contracts.md#bootloader) should be allowed to call the `validateTransaction`/`executeTransaction`/`payForTransaction`/`prePaymaster` methods.
That's why the `onlyBootloader` modifier is used for them.

The `executeTransactionFromOutside` is needed to allow external users to initiate transactions from this account. The easiest way to implement it is to do the same as `validateTransaction` + `executeTransaction` would do.

### Signature validation

Firstly, we need to implement the signature validation process. Since we are building a two-account multisig, let's pass its owners' addresses in the constructor. In this tutorial, we use OpenZeppelin's `ECDSA` library for signature validation.

Add the following import:

```solidity
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
```

Also, add the constructor to the contract:

```solidity
address public owner1;
address public owner2;

constructor(address _owner1, address _owner2) {
    owner1 = _owner1;
    owner2 = _owner2;
}
```

And then we can implement the `isValidSignature` method in the following way:

```solidity
function isValidSignature(bytes32 _hash, bytes calldata _signature) public override view returns (bytes4) {
    // The signature is the concatenation of the ECDSA signatures of the owners
    // Each ECDSA signature is 65 bytes long. That means that the combined signature is 130 bytes long.
    require(_signature.length == 130, 'Signature length is incorrect');

    address recoveredAddr1 = ECDSA.recover(_hash, _signature[0:65]);
    address recoveredAddr2 = ECDSA.recover(_hash, _signature[65:130]);

    require(recoveredAddr1 == owner1);
    require(recoveredAddr2 == owner2);

    return EIP1271_SUCCESS_RETURN_VALUE;
}
```

### Transaction validation

Let's implement the validation process. It is responsible for validating the signature of the transaction and incrementing the nonce. Note, that there are some limitations on what this method is allowed to do. You can read more about them [here](../developer-guides/aa.md#limitations-of-the-verification-step).

To increment the nonce, you should use the `incrementNonceIfEquals` method of the `NONCE_HOLDER_SYSTEM_CONTRACT` system contract. It takes the nonce of the transaction and checks whether the nonce is the same as the provided one. If not, the transaction reverts. Otherwise, the nonce is increased.

Even though the requirements above allows the accounts to touch only their storage slots, accessing your nonce in the `NONCE_HOLDER_SYSTEM_CONTRACT` is a [whitelisted](../developer-guides/aa.md#extending-the-set-of-slots-that-belong-to-a-user) case, since it behaves in the same way as your storage, it just happened to be in another contract. To call the `NONCE_HOLDER_SYSTEM_CONTRACT`, you should add the following import:

```solidity
import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
```

The `TransactionHelper` library (already imported in the example above) can be used to get the hash of the transaction that should be signed. You can also implement your own signature scheme and use a different commitment for the transaction to sign, but in this example we use the hash provided by this library.

Using the `TransactionHelper` library:

```solidity
using TransactionHelper for Transaction;
```

Also, note that since the non-view methods of the `NONCE_HOLDER_SYSTEM_CONTRACT` are required to be called with the `isSystem` flag on, the [systemCall](https://github.com/matter-labs/v2-testnet-contracts/blob/a3cd3c557208f2cd18e12c41840c5d3728d7f71b/l2/system-contracts/SystemContractsCaller.sol#L55) method of the `SystemContractsCaller` library should be used, so this library needs to be imported as well:

```solidity
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';
```

Now we can implement the `_validateTransaction` method:

```solidity
function _validateTransaction(bytes32 _suggestedSignedHash, Transaction calldata _transaction) internal {
    // Incrementing the nonce of the account.
    // Note, that reserved[0] by convention is currently equal to the nonce passed in the transaction
    SystemContractsCaller.systemCall(
        uint32(gasleft()),
        address(NONCE_HOLDER_SYSTEM_CONTRACT),
        0,
        abi.encodeCall(INonceHolder.incrementMinNonceIfEquals, (_transaction.reserved[0]))
    );

    bytes32 txHash;
    // While the suggested signed hash is usually provided, it is generally
    // not recommended to rely on it to be present, since in the future
    // there may be tx types with no suggested signed hash.
    if(_suggestedSignedHash == bytes32(0)) {
        txHash = _transaction.encodeHash();
    } else {
        txHash = _suggestedSignedHash;
    }

    require(isValidSignature(txHash, _transaction.signature) == EIP1271_SUCCESS_RETURN_VALUE);
}
```

### Paying fees for the transaction

We should now implement the `payForTransaction` method. The `TransactionHelper` library already provides us with the `payToTheBootloader` method, that sends `_transaction.maxFeePerErg * _transaction.ergsLimit` ETH to the bootloader. So the implementation is rather straightforward:

```solidity
function payForTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
		bool success = _transaction.payToTheBootloader();
		require(success, "Failed to pay the fee to the operator");
}
```

### Implementing `prePaymaster`

While generally the account abstraction protocol enables performing arbitrary actions when interacting with the paymasters, there are some [common patterns](../developer-guides/aa.md#built-in-paymaster-flows) with the built-in support from EOAs.
Unless you want to implement or restrict some specific paymaster use cases from your account, it is better to keep it consistent with EOAs. The `TransactionHelper` library provides the `processPaymasterInput` which does exactly that: processed the `prePaymaster` step the same as EOA does.

```solidity
function prePaymaster(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
    _transaction.processPaymasterInput();
}
```

### Transaction execution

The most basic implementation of the transaction execution is quite straightforward:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    uint256 to = _transaction.to;
    // By convention, the `reserved[1]` field is msg.value
    uint256 value = _transaction.reserved[1];
    bytes memory data = _transaction.data;

    bool success;
    assembly {
        success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
    }

    // Needed for the transaction to be correctly processed by the server.
    require(success);
}
```

However, note that calling ContractDeployer is only possible with the `isSystem` call flag. In order to permit your users to deploy contracts, you should do so explicitly:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    address to = address(uint160(_transaction.to));
    uint256 value = _transaction.reserved[1];
    bytes memory data = _transaction.data;

    if(to == address(DEPLOYER_SYSTEM_CONTRACT)) {
        // We allow calling ContractDeployer with any calldata
        SystemContractsCaller.systemCall(
            uint32(gasleft()),
            to,
            uint128(_transaction.reserved[1]), // By convention, reserved[1] is `value`
            _transaction.data
        );
    } else {
        bool success;
        assembly {
            success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
        }
        require(success);
    }
}
```

Note, that whether the operator will consider the transaction successful will depend only on whether the call to `executeTransactions` was successful. Therefore, it is highly recommended to put `require(success)` for the transaction, so that users get the best UX.

### Full code of the account

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol";

import "@openzeppelin/contracts/interfaces/IERC1271.sol";

// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// Access zkSync system contracts, in this case for nonce validation vs NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
// to call non-view method of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol";

contract TwoUserMultisig is IAccount, IERC1271 {
    // to get transaction hash
    using TransactionHelper for Transaction;

    // state variables for account owners
    address public owner1;
    address public owner2;

    bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );
        // Continure execution if called from the bootloader.
        _;
    }

    constructor(address _owner1, address _owner2) {
        owner1 = _owner1;
        owner2 = _owner2;
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
        // Incrementing the nonce of the account.
        // Note, that reserved[0] by convention is currently equal to the nonce passed in the transaction
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
        // While the suggested signed hash is usually provided, it is generally
        // not recommended to rely on it to be present, since in the future
        // there may be tx types with no suggested signed hash.
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

        if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
            // We allow calling ContractDeployer with any calldata
            SystemContractsCaller.systemCall(
                uint32(gasleft()),
                to,
                uint128(_transaction.reserved[1]), // By convention, reserved[1] is `value`
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
        // The signature is the concatenation of the ECDSA signatures of the owners
        // Each ECDSA signature is 65 bytes long. That means that the combined signature is 130 bytes long.
        require(_signature.length == 130, "Signature length is incorrect");

        address recoveredAddr1 = ECDSA.recover(_hash, _signature[0:65]);
        address recoveredAddr2 = ECDSA.recover(_hash, _signature[65:130]);

        require(recoveredAddr1 == owner1);
        require(recoveredAddr2 == owner2);

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
        // If the bootloader called the `receive` function, it likely means
        // that something went wrong and the transaction should be aborted. The bootloader should
        // only interact through the `validateTransaction`/`executeTransaction` methods.
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
    }
}


```

## The factory

Now, let's build a factory that can deploy these accounts. Note, that if we want to deploy AA, we need to interact directly with the `DEPLOYER_SYSTEM_CONTRACT`. For deterministic addresses, we will use `create2Account` method.

The code will look the following way:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';

contract AAFactory {
    bytes32 public aaBytecodeHash;

    constructor(bytes32 _aaBytecodeHash) {
        aaBytecodeHash = _aaBytecodeHash;
    }

    function deployAccount(
        bytes32 salt,
        address owner1,
        address owner2
    ) external returns (address accountAddress) {
        bytes memory returnData = SystemContractsCaller.systemCall(
            uint32(gasleft()),
            address(DEPLOYER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(
                DEPLOYER_SYSTEM_CONTRACT.create2Account,
                (salt, aaBytecodeHash, abi.encode(owner1, owner2))
            )
        );

        (accountAddress, ) = abi.decode(returnData, (address, bytes));
    }
}
```

Note, that on zkSync, the deployment is not done via bytecode, but via bytecode hash. The bytecode itself is passed to the operator via `factoryDeps` field. Note, that the `_aaBytecodeHash` must be formed specially:

- Firstly, it is hashed with sha256.
- Then, the first two bytes are replaced with the length of the bytecode in 32-byte words.

You don't need to worry about it, since our SDK provides a built-in method to do it, explained below.

## Deploying the factory

To deploy a factory, we need to create a deployment script. Create the `deploy` folder and create one file there: `deploy-factory.ts`. Put the following deployment script there:

```ts
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet("<PRIVATE-KEY>");
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("AAFactory");
  const aaArtifact = await deployer.loadArtifact("TwoUserMultisig");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // You can remove the depositing step if the `wallet` has enough funds on zkSync
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  await depositHandle.wait();

  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  const factory = await deployer.deploy(factoryArtifact, [bytecodeHash], undefined, [
    // Since the factory requires the code of the multisig to be available,
    // we should pass it here as well.
    aaArtifact.bytecode,
  ]);

  console.log(`AA factory address: ${factory.address}`);
}
```

In order to deploy the factory, you should compile the contracts and run the script:

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-factory.ts
```

The output should be roughly the following:

```
AA factory address: 0x9db333Cb68Fb6D317E3E415269a5b9bE7c72627Ds
```

Note that the address will be different for each run.

## Working with accounts

### Deploying an account

Now, let's deploy an account and initiate a new transaction with it. In this section, we assume that you already have an EOA account with enough funds on zkSync.
In the `deploy`, folder creates a file `deploy-multisig.ts`, where we will put the script.

Firstly, let's deploy the AA. This will be a call to the `deployAccount` function:

```ts
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "<YOUR_FACTORY_ADDRESS>";

// An example of a deploy script deploys and calls a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet = new Wallet("<PRIVATE-KEY>").connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  const aaFactory = new ethers.Contract(AA_FACTORY_ADDRESS, factoryArtifact.abi, wallet);

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(salt, owner1.address, owner2.address);
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );
  console.log(`Deployed on address ${multisigAddress}`);
}
```

_Note, that zkSync has different address derivation rules from Ethereum_. You should always use the `createAddress` and `create2Address` utility methods of the `zksync-web3` SDK.

### Starting a transaction from this account

Before the deployed account can do any transactions, we need to top it up:

```ts
await(
  await wallet.sendTransaction({
    to: multisigAddress,
    // You can increase the amount of ETH sent to the multisig
    value: ethers.utils.parseEther("0.003"),
  })
).wait();
```

Now, as an example, let's try to deploy a new multisig, but the initiator of the transaction will be our deployed account from the previous part:

```ts
let aaTx = await aaFactory.populateTransaction.deployAccount(salt, Wallet.createRandom().address, Wallet.createRandom().address);
```

Then, we need to fill all the transaction fields:

```ts
const gasLimit = await provider.estimateGas(aaTx);
const gasPrice = await provider.getGasPrice();

aaTx = {
  ...aaTx,
  from: multisigAddress,
  gasLimit: gasLimit,
  gasPrice: gasPrice,
  chainId: (await provider.getNetwork()).chainId,
  nonce: await provider.getTransactionCount(multisigAddress),
  type: 113,
  customData: {
    // Note, that we are using the `DEFAULT_ERGS_PER_PUBDATA_LIMIT`
    ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
  } as types.Eip712Meta,
  value: ethers.BigNumber.from(0),
};
```

::: tip Note on gasLimit

Currently, we expect the `gasLimit` to cover both the verification and the execution steps. Currently, the number of ergs that is returned by the `estimateGas` is `execution_ergs + 20000`, where `20000` is roughly equal to the overhead needed for the defaultAA to have both fee charged and the signature verified. In case your AA has a very expensive verification step, you should add some constant to the `gasLimit`.

:::

Then, we need to sign the transaction and provide the `aaParamas` in the customData of the transaction:

```ts
const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

const signature = ethers.utils.concat([
  // Note, that `signMessage` wouldn't work here, since we don't want
  // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
  ethers.utils.joinSignature(owner1._signingKey().signDigest(signedTxHash)),
  ethers.utils.joinSignature(owner2._signingKey().signDigest(signedTxHash)),
]);

aaTx.customData = {
  ...aaTx.customData,
  customSignature: signature,
};
```

Now, we are ready to send the transaction:

```ts
console.log(`The multisig's nonce before the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
await sentTx.wait();

// Checking that the nonce for the account has increased
console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
```

### Full example

```ts
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "<YOUR_FACTORY_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet = new Wallet("<YOUR_PRIVATE_KEY>").connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  const aaFactory = new ethers.Contract(AA_FACTORY_ADDRESS, factoryArtifact.abi, wallet);

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(salt, owner1.address, owner2.address);
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );
  console.log(`Multisig deployed on address ${multisigAddress}`);

  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.001"),
    })
  ).wait();

  let aaTx = await aaFactory.populateTransaction.deployAccount(salt, Wallet.createRandom().address, Wallet.createRandom().address);

  const gasLimit = await provider.estimateGas(aaTx);
  const gasPrice = await provider.getGasPrice();

  aaTx = {
    ...aaTx,
    from: multisigAddress,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(multisigAddress),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: ethers.BigNumber.from(0),
  };
  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  const signature = ethers.utils.concat([
    // Note, that `signMessage` wouldn't work here, since we don't want
    // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
    ethers.utils.joinSignature(owner1._signingKey().signDigest(signedTxHash)),
    ethers.utils.joinSignature(owner2._signingKey().signDigest(signedTxHash)),
  ]);

  aaTx.customData = {
    ...aaTx.customData,
    customSignature: signature,
  };

  console.log(`The multisig's nonce before the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  await sentTx.wait();

  // Checking that the nonce for the account has increased
  console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
}
```

To run the script, use the following command:

```
yarn hardhat deploy-zksync --script deploy-multisig.ts
```

The output should be roughly the following:

```
Multisig deployed on address 0xCEBc59558938bccb43A6C94769F87bBdb770E956
The multisig's nonce before the first tx is 0
The multisig's nonce after the first tx is 1
```

::: tip

If you get an error `Not enough balance to cover the fee.`, try increasing the amount of ETH sent to the multisig wallet so it has enough funds to pay for the transaction fees.

:::

## Complete project

You can download the complete project [here](https://github.com/matter-labs/custom-aa-tutorial).

## Learn more

- To learn more about L1->L2 interaction on zkSync, check out the [documentation](../developer-guides/bridging/l1-l2.md).
- To learn more about the `zksync-web3` SDK, check out its [documentation](../../api/js).
- To learn more about the zkSync hardhat plugins, check out their [documentation](../../api/hardhat).
