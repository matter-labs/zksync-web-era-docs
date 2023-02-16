# Account abstraction multisig

Now, let's learn how to deploy your custom accounts and interact directly with the [ContractDeployer](../developer-guides/system-contracts.md#contractdeployer) system contract.
In this tutorial, we build a factory that deploys 2-of-2 multisig accounts.


## Prerequisite

It is highly recommended to read about the [design](../developer-guides/aa.md) of the account abstraction protocol before diving into this tutorial.

It is assumed that you are already familiar with deploying smart contracts on zkSync.
If not, please refer to the first section of the [quickstart tutorial](../building-on-zksync/hello-world.md).
It is also recommended to read the [introduction](../developer-guides/system-contracts.md) to the system contracts.

## Installing dependencies

We will use the zkSync hardhat plugin for developing this contract. Firstly, we should install all the dependencies for it:

```
mkdir custom-aa-tutorial
cd custom-aa-tutorial
yarn init -y
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

The current version of `zksync-web3` uses `ethers v5.7.x` as a peer dependency. An update compatible with `ethers v6.x.x` will be released soon.

:::

Since we are working with zkSync contracts, we also need to install the package with the contracts and its peer dependencies:

```
yarn add -D @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Also, create the `hardhat.config.ts` config file, `contracts` and `deploy` folders, similar to the [quickstart tutorial](../building-on-zksync/hello-world.md). As in this project our contracts will interact with system contracts, we need to include the `isSystem: true` in the compiler settings:

```
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
      settings: {
        isSystem: true,
      },
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};
```

::: tip

You can use the zkSync CLI to scaffold a project automatically. Find [more info about the zkSync CLI here](../../api/tools/zksync-cli/)

:::

## Account abstraction

Each account needs to implement the [IAccount](../developer-guides/aa.md#iaccount-interface) interface. Since we are building an account with signers, we should also have [EIP1271](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12) implemented.

The skeleton for the contract will look the following way:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@openzeppelin/contracts/interfaces/IERC1271.sol";


contract TwoUserMultisig is IAccount, IERC1271 {
    // to get transaction hash
    using TransactionHelper for Transaction;


    bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    modifier onlyBootloader() {
        require(
            msg.sender == BOOTLOADER_FORMAL_ADDRESS,
            "Only bootloader can call this method"
        );
        // Continure execution if called from the bootloader.
        _;
    }


    function validateTransaction(
        bytes32,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable override onlyBootloader returns (bytes4 magic) {
        magic = _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal returns (bytes4 magic) {
        // TO BE IMPLEMENTED
    }

    function executeTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _executeTransaction(_transaction);
    }

    function _executeTransaction(Transaction calldata _transaction) internal {
        // TO BE IMPLEMENTED
    }

    function executeTransactionFromOutside(Transaction calldata _transaction)
        external
        payable
    {
        _validateTransaction(bytes32(0), _transaction);
        _executeTransaction(_transaction);
    }

    function isValidSignature(bytes32 _hash, bytes memory _signature)
        public
        view
        override
        returns (bytes4 magic)
    {
        // TO BE IMPLEMENTED
    }

    function payForTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        // TO BE IMPLEMENTED
    }

    function prepareForPaymaster(
        bytes32, // _txHash
        bytes32, // _suggestedSignedHash
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        // TO BE IMPLEMENTED
    }

    // This function verifies that the ECDSA signature is both in correct format and non-malleable
    function checkValidECDSASignatureFormat(bytes memory _signature) internal pure returns (bool) {
        if(_signature.length != 65) {
            return false;
        }

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
		if(v != 27 && v != 28) {
            return false;
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
        if(uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return false;
        }

        return true;
    }
    
    function extractECDSASignature(bytes memory _fullSignature) internal pure returns (bytes memory signature1, bytes memory signature2) {
        require(_fullSignature.length == 130, "Invalid length");

        signature1 = new bytes(65);
        signature2 = new bytes(65);

        // Copying the first signature. Note, that we need an offset of 0x20 
        // since it is where the length of the `_fullSignature` is stored
        assembly {
            let r := mload(add(_fullSignature, 0x20))
			let s := mload(add(_fullSignature, 0x40))
			let v := and(mload(add(_fullSignature, 0x41)), 0xff)

            mstore(add(signature1, 0x20), r)
            mstore(add(signature1, 0x40), s)
            mstore8(add(signature1, 0x60), v)
        }

        // Copying the second signature.
        assembly {
            let r := mload(add(_fullSignature, 0x61))
            let s := mload(add(_fullSignature, 0x81))
            let v := and(mload(add(_fullSignature, 0x82)), 0xff)

            mstore(add(signature2, 0x20), r)
            mstore(add(signature2, 0x40), s)
            mstore8(add(signature2, 0x60), v)
        }
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

Note, that only the [bootloader](../developer-guides/system-contracts.md#bootloader) should be allowed to call the `validateTransaction`/`executeTransaction`/`payForTransaction`/`prepareForPaymaster` methods.
That's why the `onlyBootloader` modifier is used for them.

The `executeTransactionFromOutside` is needed to allow external users to initiate transactions from this account. The easiest way to implement it is to do the same as `validateTransaction` + `executeTransaction` would do.

In addition, the `checkValidECDSASignatureFormat` and `extractECDSASignature` are helper methods that we'll use in the `isValidSignature` implementation.

### Signature validation

Firstly, we need to implement the signature validation process.  In this tutorial, we use OpenZeppelin's `ECDSA` library for signature validation so we'd need to import it:

```solidity
// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
```

Since we are building a two-account multisig, let's pass its owners' addresses in the constructor and save their state variables:

```solidity
// state variables for account owners
address public owner1;
address public owner2;


constructor(address _owner1, address _owner2) {
    owner1 = _owner1;
    owner2 = _owner2;
}
```

To validate the signature we'll have to:

- check if the length of the received signature is correct.
- extract the two signatures from the received multisig using the helper method `extractECDSASignature`
- check if both signatures are valid using the helper method `checkValidECDSASignatureFormat`.
- extract the addresses from the transaction hash and each signature using the `ECDSA.recover` method.
- check if the addresses extracted match with the owners of the account.
- return the `EIP1271_SUCCESS_RETURN_VALUE` value on success or `bytes4(0)` if validation fails.

Here is the full implementation of the `isValidSignature` method:

```solidity

function isValidSignature(bytes32 _hash, bytes memory _signature)
    public
    view
    override
    returns (bytes4 magic)
{
    magic = EIP1271_SUCCESS_RETURN_VALUE;

    if (_signature.length != 130) {
        // Signature is invalid, but we need to proceed with the signature verification as usual
        // in order for the fee estimation to work correctly
        _signature = new bytes(130);
        
        // Making sure that the signatures look like a valid ECDSA signature and are not rejected rightaway
        // while skipping the main verification process.
        _signature[64] = bytes1(uint8(27));
        _signature[129] = bytes1(uint8(27));
    }

    (bytes memory signature1, bytes memory signature2) = extractECDSASignature(_signature);

    if(!checkValidECDSASignatureFormat(signature1) || !checkValidECDSASignatureFormat(signature2)) {
        magic = bytes4(0);
    }

    address recoveredAddr1 = ECDSA.recover(_hash, signature1);
    address recoveredAddr2 = ECDSA.recover(_hash, signature2);

    // Note, that we should abstain from using the require here in order to allow for fee estimation to work
    if(recoveredAddr1 != owner1 || recoveredAddr2 != owner2) {
        magic = bytes4(0);
    }
}

```

### Transaction validation

Let's implement the validation process. It is responsible for validating the signature of the transaction and incrementing the nonce. Note, that there are some limitations on what this method is allowed to do. You can read more about them [here](../developer-guides/aa.md#limitations-of-the-verification-step).

To increment the nonce, you should use the `incrementNonceIfEquals` method of the `NONCE_HOLDER_SYSTEM_CONTRACT` system contract. It takes the nonce of the transaction and checks whether the nonce is the same as the provided one. If not, the transaction reverts. Otherwise, the nonce is increased.

Even though the requirements above allow the accounts to touch only their storage slots, accessing your nonce in the `NONCE_HOLDER_SYSTEM_CONTRACT` is a [whitelisted](../developer-guides/aa.md#extending-the-set-of-slots-that-belong-to-a-user) case, since it behaves in the same way as your storage, it just happened to be in another contract. To call the `NONCE_HOLDER_SYSTEM_CONTRACT`, you should add the following import:

```solidity
// Access zkSync system contracts, in this case for nonce validation vs NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
```

Note that since the non-view methods of the `NONCE_HOLDER_SYSTEM_CONTRACT` are required to be called with the `isSystem` flag on, the [systemCallWithPropagatedRevert](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/SystemContractsCaller.sol#L77) method of the `SystemContractsCaller` library should be used, so this library needs to be imported as well:

```solidity
// to call non-view method of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";
```


The `TransactionHelper` library (already imported above with `using TransactionHelper for Transaction;`) can be used to get the hash of the transaction that should be signed. You can also implement your own signature scheme and use a different commitment for the transaction to sign, but in this example we use the hash provided by this library.

Finally, the `_validateTransaction` method has to return the constant `ACCOUNT_VALIDATION_SUCCESS_MAGIC` if the validation is successful, or an empty value `bytes4(0)` if it fails.

Here is the full implementation fo the `_validateTransaction` method:

```solidity

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
        abi.encodeCall(INonceHolder.incrementMinNonceIfEquals, (_transaction.nonce))
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
    require(totalRequiredBalance <= address(this).balance, "Not enough balance for fee + value");

    if (isValidSignature(txHash, _transaction.signature) == EIP1271_SUCCESS_RETURN_VALUE) {
        magic = ACCOUNT_VALIDATION_SUCCESS_MAGIC;
    } else {
        magic = bytes4(0);
    }
}
```

### Paying fees for the transaction

We should now implement the `payForTransaction` method. The `TransactionHelper` library already provides us with the `payToTheBootloader` method, that sends `_transaction.maxFeePerGas * _transaction.gasLimit` ETH to the bootloader. So the implementation is rather straightforward:

```solidity
function payForTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        bool success = _transaction.payToTheBootloader();
        require(success, "Failed to pay the fee to the operator");
    }
```

### Implementing paymaster support

While generally the account abstraction protocol enables performing arbitrary actions when interacting with the paymasters, there are some [common patterns](../developer-guides/aa.md#built-in-paymaster-flows) with the built-in support for EOAs.
Unless you want to implement or restrict some specific paymaster use cases for your account, it is better to keep it consistent with EOAs. 

The `TransactionHelper` library provides the `processPaymasterInput` which does exactly that: processes the paymaster parameters the same it's done in EOAs.

```solidity

function prepareForPaymaster(
        bytes32, // _txHash
        bytes32, // _suggestedSignedHash
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _transaction.processPaymasterInput();
    }
```

### Transaction execution

The most basic implementation of the transaction execution is quite straightforward. We extract the transaction data and execute it:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    uint256 to = _transaction.to;
    // By convention, the `reserved[1]` field is msg.value
    uint256 value = _transaction.reserved[1];
    bytes memory data = _transaction.data;

    bool success;
    // execute transaction
    assembly {
        success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
    }

    // Return value required for the transaction to be correctly processed by the server.
    require(success);
}
```

However, note that calling ContractDeployer is only possible with the `isSystem` call flag. In order to allow your users to deploy contracts, you should do so explicitly:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    address to = address(uint160(_transaction.to));
    uint128 value = Utils.safeCastToU128(_transaction.value);
    bytes memory data = _transaction.data;

    if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
        uint32 gas = Utils.safeCastToU32(gasleft());

        // Note, that the deployer contract can only be called
        // with a "systemCall" flag.
        SystemContractsCaller.systemCallWithPropagatedRevert(gas, to, value, data);
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
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

import "@openzeppelin/contracts/interfaces/IERC1271.sol";

// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// Access zkSync system contracts, in this case for nonce validation vs NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
// to call non-view method of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

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
        // Continue execution if called from the bootloader.
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
            abi.encodeCall(INonceHolder.incrementMinNonceIfEquals, (_transaction.nonce))
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
        require(totalRequiredBalance <= address(this).balance, "Not enough balance for fee + value");

        if (isValidSignature(txHash, _transaction.signature) == EIP1271_SUCCESS_RETURN_VALUE) {
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

        if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
            uint32 gas = Utils.safeCastToU32(gasleft());

            // Note, that the deployer contract can only be called
            // with a "systemCall" flag.
            SystemContractsCaller.systemCallWithPropagatedRevert(gas, to, value, data);
        } else {
            bool success;
            assembly {
                success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
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

    function isValidSignature(bytes32 _hash, bytes memory _signature)
        public
        view
        override
        returns (bytes4 magic)
    {
        magic = EIP1271_SUCCESS_RETURN_VALUE;

        if (_signature.length != 130) {
            // Signature is invalid anyway, but we need to proceed with the signature verification as usual
            // in order for the fee estimation to work correctly
            _signature = new bytes(130);
            
            // Making sure that the signatures look like a valid ECDSA signature and are not rejected rightaway
            // while skipping the main verification process.
            _signature[64] = bytes1(uint8(27));
            _signature[129] = bytes1(uint8(27));
        }

        (bytes memory signature1, bytes memory signature2) = extractECDSASignature(_signature);

        if(!checkValidECDSASignatureFormat(signature1) || !checkValidECDSASignatureFormat(signature2)) {
            magic = bytes4(0);
        }

        address recoveredAddr1 = ECDSA.recover(_hash, signature1);
        address recoveredAddr2 = ECDSA.recover(_hash, signature2);

        // Note, that we should abstain from using the require here in order to allow for fee estimation to work
        if(recoveredAddr1 != owner1 || recoveredAddr2 != owner2) {
            magic = bytes4(0);
        }
    }

    // This function verifies that the ECDSA signature is both in correct format and non-malleable
    function checkValidECDSASignatureFormat(bytes memory _signature) internal pure returns (bool) {
        if(_signature.length != 65) {
            return false;
        }

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
		if(v != 27 && v != 28) {
            return false;
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
        if(uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return false;
        }

        return true;
    }
    
    function extractECDSASignature(bytes memory _fullSignature) internal pure returns (bytes memory signature1, bytes memory signature2) {
        require(_fullSignature.length == 130, "Invalid length");

        signature1 = new bytes(65);
        signature2 = new bytes(65);

        // Copying the first signature. Note, that we need an offset of 0x20 
        // since it is where the length of the `_fullSignature` is stored
        assembly {
            let r := mload(add(_fullSignature, 0x20))
			let s := mload(add(_fullSignature, 0x40))
			let v := and(mload(add(_fullSignature, 0x41)), 0xff)

            mstore(add(signature1, 0x20), r)
            mstore(add(signature1, 0x40), s)
            mstore8(add(signature1, 0x60), v)
        }

        // Copying the second signature.
        assembly {
            let r := mload(add(_fullSignature, 0x61))
            let s := mload(add(_fullSignature, 0x81))
            let v := and(mload(add(_fullSignature, 0x82)), 0xff)

            mstore(add(signature2, 0x20), r)
            mstore(add(signature2, 0x40), s)
            mstore8(add(signature2, 0x60), v)
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

## The factory

Now, let's build a factory that can deploy these accounts. To deploy the smart contract account, we need to interact directly with the `DEPLOYER_SYSTEM_CONTRACT`. For deterministic addresses, we will call the `create2Account` method.

The code will look the following way:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";

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
        (bool success, bytes memory returnData) = SystemContractsCaller
            .systemCallWithReturndata(
                uint32(gasleft()),
                address(DEPLOYER_SYSTEM_CONTRACT),
                uint128(0),
                abi.encodeCall(
                    DEPLOYER_SYSTEM_CONTRACT.create2Account,
                    (salt, aaBytecodeHash, abi.encode(owner1, owner2), IContractDeployer.AccountAbstractionVersion.Version1)
                )
            );
        require(success, "Deployment failed");

        (accountAddress) = abi.decode(returnData, (address));
    }
}

```

It's worth remembering that on zkSync, contract deployments are not done via bytecode, but via bytecode hash. The bytecode itself is passed to the operator via `factoryDeps` field. Note, that the `_aaBytecodeHash` must be formed specially:

- Firstly, it is hashed with sha256.
- Then, the first two bytes are replaced with the length of the bytecode in 32-byte words.

You don't need to worry about it, since our SDK provides a built-in method to do it, explained below.

## Deploying the factory

To deploy a factory, we need to create a deployment script. Create the `deploy` folder and create one file there: `deploy-factory.ts`. Put the following deployment script there:

```ts
import { utils, Wallet } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet('<WALLET_PRIVATE_KEY>');
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  const aaArtifact = await deployer.loadArtifact('TwoUserMultisig');

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // You can remove the depositing step if the `wallet` has enough funds on zkSync
  const depositAmount = ethers.utils.parseEther('0.001');
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  await depositHandle.wait();

  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      // Since the factory requires the code of the multisig to be available,
      // we should pass it here as well.
      aaArtifact.bytecode,
    ]
  );

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
import { utils, Wallet, Provider, EIP712Signer, types } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = '<FACTORY-ADDRESS>';

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider('https://zksync2-testnet.zksync.dev');
  const wallet = new Wallet('<WALLET-PRIVATE-KEY>').connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact('AAFactory');

  const aaFactory = new ethers.Contract(
    AA_FACTORY_ADDRESS,
    factoryArtifact.abi,
    wallet
  );

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address,
    owner2.address
  );
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(['address', 'address'], [owner1.address, owner2.address])
  );
  console.log(`Multisig deployed on address ${multisigAddress}`);
}
```

_Note, that zkSync has different address derivation rules from Ethereum_. You should always use the `createAddress` and `create2Address` utility methods of the `zksync-web3` SDK.

### Starting a transaction from this account

Before the deployed account can do any transactions, we need to add some ETH to it so it can pay transaction fees:

```ts
  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther('0.003'),
    })
  ).wait();
```

Now, as an example, let's try to deploy a new multisig, but the initiator of the transaction will be our deployed account from the previous part:

```ts
  let aaTx = await aaFactory.populateTransaction.deployAccount(
    salt,
    Wallet.createRandom().address,
    Wallet.createRandom().address
  );
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
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    } as types.Eip712Meta,
    value: ethers.BigNumber.from(0),
  };
```

::: tip Note on gasLimit

Currently, we expect the `l2gasLimit` to cover both the verification and the execution steps. Currently, the number of gas that is returned by the `estimateGas` is `execution_gas + 20000`, where `20000` is roughly equal to the overhead needed for the defaultAA to have both fee charged and the signature verified. In case your AA has a very expensive verification step, you should add some constant to the `l2gasLimit`.

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
  console.log(
    `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );
  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  await sentTx.wait();

  // Checking that the nonce for the account has increased
  console.log(
    `The multisig's nonce after the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );
```

### Full example

```ts
import { utils, Wallet, Provider, EIP712Signer, types } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = '<FACTORY-ADDRESS>';

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider('https://zksync2-testnet.zksync.dev');
  const wallet = new Wallet('<WALLET-PRIVATE-KEY>').connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact('AAFactory');

  const aaFactory = new ethers.Contract(
    AA_FACTORY_ADDRESS,
    factoryArtifact.abi,
    wallet
  );

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address,
    owner2.address
  );
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(['address', 'address'], [owner1.address, owner2.address])
  );
  console.log(`Multisig deployed on address ${multisigAddress}`);

  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther('0.003'),
    })
  ).wait();

  let aaTx = await aaFactory.populateTransaction.deployAccount(
    salt,
    Wallet.createRandom().address,
    Wallet.createRandom().address
  );

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
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
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

  console.log(
    `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );
  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  await sentTx.wait();

  // Checking that the nonce for the account has increased
  console.log(
    `The multisig's nonce after the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );
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
