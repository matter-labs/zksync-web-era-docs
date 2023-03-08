# 帐户抽象自定义

现在，让我们来学习如何部署你的自定义账户，并与[ContractDeployer](.../developer-guides/system-contracts.md#contractdeployer)系统合约直接互动。
在本教程中，我们建立一个工厂，部署2-of-2的自定义账户。

## 前提条件

在进入本教程之前，强烈建议阅读账户抽象协议的[design](.../developer-guides/aa.md)。

假设你已经熟悉在zkSync上部署智能合约。
如果没有，请参考[快速入门教程](.../building-onzksync/hello-world.md)的第一部分。
还建议阅读系统合同的[介绍](../developer-guides/system-contracts.md)。

## 安装依赖项

我们将使用zkSync硬帽插件来开发这个合同。首先，我们应该为它安装所有的依赖项。

```
mkdir custom-aa-tutorial
cd custom-aa-tutorial
yarn init -y
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

当前版本的`zksync-web3`使用`ethers v5.7.x`作为同行依赖。与`ethers v6.x.x`兼容的更新将很快发布。

:::

由于我们正在使用zkSync合约，我们还需要安装带有合同及其同行依赖关系的软件包。

```ag-0-1gr0erag-0-1gr0ereag-0-1gr0ere8l8lag-1-1gr0ere8le8ag-1-1gr0ere8llag-1-1gr0ere8l
yarn add -D @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

同时，创建`hardhat.config.ts`配置文件、`contracts`和`deploy`文件夹，与[快速入门教程](.../building-on-zksync/hello-world.md)类似。由于在这个项目中，我们的合约将与系统合约互动，我们需要在编译器设置中加入`isSystem: true`。

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

你可以使用zkSync CLI来自动构建一个项目的支架。查找[关于zkSync CLI的更多信息](.../.../api/tools/zksync-cli/)

:::

## 帐户抽象

每个账户都需要实现[IAccount](./developer-guides/aa.md#iaccount-interface)接口。因为我们要建立一个有签名者的账户，所以我们也应该实现[EIP1271](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12)。

合约的构成如下。

```solidity

```

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
注意，只有[bootloader](.../developer-guides/system-contracts.md#bootloader)才允许调用`validateTransaction`/`executeTransaction`/`payForTransaction`/`prepareForPaymaster`方法。
这就是为什么`onlyBootloader`修改器被用于它们。

需要`executeTransactionFromOutside`来允许外部用户从这个账户发起交易。实现它的最简单方法是与`validateTransaction`+`executeTransaction`的做法一样。

此外，`checkValidECDSASignatureFormat`和`extractECDSASignature`是帮助方法，我们将在`isValidSignature`实现中使用。

### 签名验证

首先，我们需要实现签名验证过程。 在本教程中，我们使用OpenZeppelin的`ECDSA`库进行签名验证，所以我们需要导入它。

```solidity
// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
```

由于我们正在建立一个双账户多义词，让我们在构造函数中传递其所有者的地址并保存其状态变量。

```solidity
// state variables for account owners
address public owner1;
address public owner2;


constructor(address _owner1, address _owner2) {
    owner1 = _owner1;
    owner2 = _owner2;
}
```

为了验证签名，我们必须。

- 检查收到的签名的长度是否正确。
- 使用辅助方法`extractECDSASignature`从收到的多重签名中提取两个签名。
- 使用辅助方法`checkValidECDSASignatureFormat'检查两个签名是否有效。
- 使用`ECDSA.recover`方法从交易哈希和每个签名中提取地址。
- 检查提取的地址是否与账户的所有者相符。
- 成功时返回`EIP1271_SUCCESS_RETURN_VALUE`值，如果验证失败则返回`bytes4(0)`。

下面是`isValidSignature`方法的完整实现。

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

### 交易验证

让我们来实现验证过程。它负责验证交易的签名和增加nonce。注意，这个方法允许做的事情有一些限制。你可以在这里读到更多的信息（.../developer-guides/aa.md#limitations-the-verification-step）。

要增加nonce，你应该使用`NONCE_HOLDER_SYSTEM_CONTRACT`系统合约的`incrementNonceIfEquals`方法。它获取交易的nonce，并检查该nonce是否与提供的nonce相同。如果不一样，交易就会恢复。否则，nonce被增加。

即使上面的要求允许账户只接触他们的存储槽，在`NONCE_HOLDER_SYSTEM_CONTRACT`中访问你的nonce是一个[白名单](./developer-guides/aa.md#extending-the-set-of-slots-that-belong-to-a-user)的情况，因为它的行为与你的存储相同，只是刚好在另一个合同中。为了调用`NONCE_HOLDER_SYSTEM_CONTRACT`，你应该添加以下导入。

```solidity
// Access zkSync system contracts, in this case for nonce validation vs NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
```

注意，由于`NONCE_HOLDER_SYSTEM_CONTRACT`的非视图方法需要在打开`isSystem`标志的情况下调用，所以应该使用`SystemContractsCaller`库的[systemCallWithPropagatedRevert](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/SystemContractsCaller.sol#L77)方法，所以这个库也需要导入。

```solidity
// to call non-view method of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/SystemContractsCaller.sol";
```

`TransactionHelper`库（上面已经导入了`using TransactionHelper for Transaction;`），可以用来获取应该被签名的交易的哈希值。你也可以实现你自己的签名方案，对要签名的事务使用不同的承诺，但在这个例子中，我们使用这个库提供的哈希值。

最后，如果验证成功，`_validateTransaction`方法必须返回常量`ACCOUNT_VALIDATION_SUCCESS_MAGIC`，如果失败则返回空值`bytes4(0)`。

下面是`_validateTransaction`方法的完整实现。

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

### 为交易支付费用

我们现在应该实现`payForTransaction`方法。TransactionHelper "库已经为我们提供了 "payToTheBootloader "方法，该方法将"_transaction.maxFeePerGas * _transaction.gasLimit "ETH发送给bootloader。因此，实现起来相当简单明了。

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

### 实现对付款人的支持

虽然一般来说，账户抽象协议可以在与付款人互动时执行任意的动作，但有一些[常见模式](.../developer-guides/aa.md#built-in-paymaster-flows)与EOAs的内置支持。
除非你想为你的账户实现或限制一些特定的paymaster用例，否则最好保持与EOAs一致。

TransactionHelper "库提供了 "processPaymasterInput"，它正是这样做的：处理paymaster参数与EOAs中的一样。

```solidity
function prepareForPaymaster(
        bytes32, // _txHash
        bytes32, // _suggestedSignedHash
        Transaction calldata _transaction
    ) external payable override onlyBootloader {
        _transaction.processPaymasterInput();
    }
```

### 交易执行

交易执行的最基本实现是非常直接的。我们提取交易数据并执行它。

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

然而，请注意，调用ContractDeployer只有在 "isSystem "调用标志下才能实现。为了让你的用户能够部署合同，你应该明确地这样做。

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    address to = address(uint160(_transaction.to));
    uint128 value = Utils.safeCastToU128(_transaction.value);
    bytes memory data = _transaction.data;

    if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
        uint32 gas = Utils.safeCastToU32(gasleft());

        // Note, that the deployer contract can only be called
        // with a "systemCall" flag.
        SystemContractsCaller.systemCallWithPropagatedRevert(ag-0-1gr0ere8lgaag-1-1gr0ere8ls, to, value, data);
    } else {
        bool success;
        assembly {
            success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
        }
        require(success);
    }
}
```

注意，操作者是否认为交易成功，只取决于对`executeTransactions`的调用是否成功。因此，强烈建议为交易设置`require(success)`，以便用户获得最佳的用户体验。

### 账户的全部代码

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

## 工厂

现在，让我们建立一个可以部署这些账户的工厂。为了部署智能合约账户，我们需要直接与`DEPLOYER_SYSTEM_CONTRACT`互动。对于确定性的地址，我们将调用`create2Account`方法。

代码将看起来如下。

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

值得一提的是，在zkSync上，合约的部署不是通过字节码完成的，而是通过字节码哈希完成的。字节码本身是通过`factoryDeps`字段传递给操作者的。请注意，`_aaBytecodeHash'必须被特别形成。

- 首先，它是用sha256散列的。
- 然后，前两个字节被替换为32字节的字节码的长度。

你不需要担心这个问题，因为我们的SDK提供了一个内置的方法来做到这一点，解释如下。

## 部署工厂

要部署一个工厂，我们需要创建一个部署脚本。创建`deploy`文件夹，并在其中创建一个文件。`deploy-factory.ts`。把下面的部署脚本放在那里。

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

为了部署工厂，你应该编译合同并运行脚本。

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-factory.ts
```

输出结果应该大致如下。

```
AA factory address: 0x9db333Cb68Fb6D317E3E415269a5b9bE7c72627Ds
```

注意，每次运行的地址都会不同。

## 使用账户工作

### 部署一个账户

现在，让我们部署一个账户并用它发起一个新的交易。在这一节中，我们假设你在zkSync上已经有一个有足够资金的EOA账户。
在`deploy`中，文件夹创建了一个文件`deploy-multisig.ts`，我们将把脚本放在那里。

首先，让我们部署AA。这将是对`deployAccount`函数的一个调用。

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

注意，zkSync的地址推导规则与Ethereum不同_。你应该始终使用`zksync-web3`SDK的`createAddress`和`create2Address`实用方法。

### 从这个账户开始交易

在部署的账户可以进行任何交易之前，我们需要向其添加一些ETH，以便它可以支付交易费用。

```ts
  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther('0.003'),
    })
  ).wait();
```

现在，作为一个例子，让我们尝试部署一个新的multisig，但交易的发起者将是我们在前一部分部署的账户。

```ts
  let aaTx = await aaFactory.populateTransaction.deployAccount(
    salt,
    Wallet.createRandom().address,
    Wallet.createRandom().address
  );
```

然后，我们需要填写所有的交易字段。

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

::: tip 关于gasLimit的说明

目前，我们希望`l2gasLimit`能够涵盖验证和执行步骤。目前，`estimateGas'返回的气体数量是`execution_gas + 20000'，其中`20000'大致等于默认AA收取费用和验证签名所需的开销。如果你的AA有一个非常昂贵的验证步骤，你应该在`l2gasLimit`中加入一些常数。

:::

然后，我们需要签署交易，并在交易的自定义数据中提供`aaParamas`。

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

现在，我们准备发送交易。

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

### 完整的例子

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

要运行该脚本，使用以下命令。

```
yarn hardhat deploy-zksync --script deploy-multisig.ts
```

输出结果应该大致如下。

```
Multisig deployed on address 0xCEBc59558938bccb43A6C94769F87bBdb770E956
The multisig's nonce before the first tx is 0
The multisig's nonce after the first tx is 1
```

::: tip

如果你得到一个错误`没有足够的余额来支付费用。`，尝试增加发送到multisig钱包的ETH数量，以便它有足够的资金来支付交易费用。

:::

## 完整的项目

你可以下载完整的项目[这里](https://github.com/matter-labs/custom-aa-tutorial)。

## 了解更多

- 要了解更多关于zkSync上L1->L2的交互，请查看[文档](../developer-guides/bridging/l1-l2.md)。
- 要了解更多关于`zksync-web3`SDK的信息，请查看其[文档](././api/js)。
- 要了解更多关于zkSync hardhat插件的信息，请查看其[document](../../api/hardhat)。
