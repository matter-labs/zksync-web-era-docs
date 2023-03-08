# 每日支出限额账户

在本教程中，由于zkSync上的账户抽象支持，我们将创建一个具有每日消费限额的智能合约账户。

:::warning

请注意，在`zksync-web3 ^0.13.0`中引入了一些突破性变化。API层现在使用`gas`操作，`ergs`概念只在虚拟机内部使用。

本教程将很快被更新以反映这些变化。
:::

## 前提条件

强烈建议你先阅读[the basics of Account Abstraction on zkSync](./developer-guides/aa.md)并完成[multisig account tutorial](./custom-aa-tutorial.md) 。

除此之外，我们将用[Node.js](https://nodejs.org/en/download/)和[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)构建这个项目，所以请确保你已经安装了它们。

## 安装依赖项

我们将使用[zkSync Hardhat plugins](././api/hardhat/)来构建、部署和与本项目的智能合约进行交互。

首先，让我们安装所有我们需要的依赖项。

```shell
mkdir custom-spendlimit-tutorial
cd custom-spendlimit-tutorial
yarn init -y
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

当前版本的`zksync-web3`使用`ethers v5.7.x`作为同行依赖。与`ethers v6.x.x`兼容的更新将很快发布。

:::

此外，请安装一些允许我们利用[zkSync智能合约]的软件包（.../developer-guides/system-contracts.md）。


```shell
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

最后，创建`hardhat.config.ts`配置文件以及`contracts`和`deploy`文件夹，如[快速入门教程](.../building-on-zksync/hello-world.md)。

::: tip zksync-cli

你可以使用zkSync CLI来自动构建一个项目的支架。找到[关于zkSync CLI的更多信息](.../.../api/tools/zksync-cli/)。

:::

## 设计

现在，让我们深入了解一下每日支出限额功能的设计和实现，该功能有助于防止账户支出的ETH超过其所有者设定的限额。

`SpendLimit'合约继承自`Account'合约，是一个具有以下功能的模块。

- 允许账户启用/禁用代币（本例中为ETH）中的每日支出限额。
- 允许账户改变（增加/减少或删除）每日支出限额。
- 如果超过了每日支出限额，拒绝代币转移。
- 24小时后恢复可用于消费的金额。

### 基本结构

下面是SpendLimit合约的骨架。

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

首先，添加映射`limits`和结构`Limit`，作为账户启用每日限额状态的数据存储。结构中每个变量的作用都在下面注释。

```solidity
    struct Limit {
        uint limit;      // the amount of a daily spending limit
        uint available;  // the available amount that can be spent
        uint resetTime;  // block.timestamp when the available amount is restored
        bool isEnabled;  // true when a daily spending limit is enabled
    }

    mapping(address => Limit) public limits; // token address => Limit
```

请注意，"limits "映射使用代币地址作为其关键。这意味着，用户将能够为ETH或任何ERC20代币设置限额。

### 设置和删除每日支出限额

下面是设置和删除限额的实现。

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

`setSpendingLimit`和`removeSpendingLimit`都只能由继承这个契约`SpendLimit`的账户契约来调用，这由`onlyAccount`修改器来保证。他们调用`_updateLimit`并传递参数，在`_isValidUpdate`中验证成功后修改限额的存储数据。

具体来说，`setSpendingLimit`为一个给定的token设置一个非零的每日消费限额，`removeSpendingLimit`通过将`limit`和`available`减少到0并将`isEnabled`设置为false来禁用活动的每日消费限额。

`_isValidUpdate`在消费限制没有启用的情况下返回false，如果用户在当天消费了一些金额（可用金额与限额不同），或者在上次更新后24小时之前调用该函数，也会抛出一个`无效更新'的错误。这就保证了用户不能随意修改（增加或删除）每日限额，以增加消费。

### 检查每日支出限额

`_checkSpendingLimit`函数是在执行交易前由账户合同本身内部调用。

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

如果禁用每日支出限额，检查过程立即停止。

```solidity
if(!limit.isEnabled) return;
```

在检查消费金额之前，如果上次更新后已经过了一天，该方法会更新`resetTime`和`available`金额：时间戳> resetTime。如果该交易是启用限制后的第一次消费，它才会更新`resetTime'。这样，每日限额实际上从第一笔交易开始。

```solidity

if (limit.limit != limit.available && timestamp > limit.resetTime) {
      limit.resetTime = timestamp + ONE_DAY;
      limit.available = limit.limit;

} else if (limit.limit == limit.available) {
      limit.resetTime = timestamp + ONE_DAY;
}

```

最后，该方法检查账户是否能够花费指定数额的代币。如果该金额没有超过可用金额，它就会递减限额中的 "可用"。

```solidity
require(limit.available >= _amount, 'Exceed daily limit');

limit.available -= _amount;
```

注意：你可能已经注意到上面的注释`// L1批处理时间戳`。这方面的细节将在下面解释。

### 完整的代码

现在，这里是SpendLimit合同的完整代码。但有一点需要注意的是，ONE_DAY变量的值被设置为`1分钟`而不是`24小时`。这只是为了测试的目的（我们不想等一整天才能看到它是否有效！），所以，请不要忘记在部署合同之前改变这个值。

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

### 账户和工厂合同

这就是`SpendLimit.sol`的基本内容。现在，我们还需要创建账户合同`Account.sol`，和部署账户合同的工厂合同`AAFactory.sol`。

如前所述，这两个合约主要是基于[另一个关于账户抽象的教程]（./custom-aa-tutorial.md）的实现。

我们将不深入解释这些合约是如何工作的，因为它们与多义词账户抽象教程中使用的合约类似。唯一的区别是，我们的账户将有一个而不是两个签名人。

下面是完整的代码。

#### Account.sol合约

该账户合约实现了IAccount接口，并继承了我们刚刚创建的SpendLimit合约。


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

`_executeTransaction`方法是我们将使用`SpendLimit.sol`合约的方法。如果ETH交易值为非零，账户合约就会调用`_checkSpendingLimit`来验证支出的许可。


```solidity

if ( value > 0 ) {
    _checkSpendingLimit(address(ETH_TOKEN_SYSTEM_CONTRACT), value);
}
```

由于我们在这个例子中要设置ETH的消费限额，所以`_checkSpendingLimit`的第一个参数应该是`address(ETH_TOKEN_SYSTEM_CONTRACT)`，它是从一个叫`system-contracts/Constant.sol`的系统合约中导入的。

**Note1** : The formal ETH address on zkSync is `0x000000000000000000000000000000000000800a`, neither the well-known `0xEee...EEeE` used by protocols as a placeholder on Ethereum, nor the zero address `0x000...000`, which is what `zksync-web3` package ([See](../../api/js/utils.md#the-address-of-ether)) provides as a more user-friendly alias.

**Note2** : SpendLimit是与令牌无关的。因此，一个扩展也是可能的：通过从交易calldata中提取字节的功能选择器，增加一个检查执行是否是ERC20转移。

#### AAFactory.sol contract

`AAFactory.sol`合约将负责部署`Account.sol`合约的实例。

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

## 部署智能合约

### 编译

最后，我们准备好编译和部署合约了。所以，在部署之前，让我们通过运行来编译合约。


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

更改`<WALLET_PRIVATE_KEY>后，运行。

```shell
yarn hardhat deploy-zksync --script deploy-factory-account.ts
```

输出结果将如下。

```shell
AA factory address: 0x9db333Cb68Fb6D317E3E415269a5b9bE7c72627Ds
Account owner pk: 0x957aff65500eda28beb7130b7c1bc48f783556bb84fa6874d2204c1d66a0ddc7
Account deployed on address 0x6b6B8ea196a6F27EFE408288a4FEeBE9A9e12005
```

所以，我们已经准备好尝试 "SpendLimit "合约的功能。为了测试，现在请打开[zkSync Era Block Explorer](https://goerli.explorer.zksync.io/)，搜索已部署的账户合同地址，以便能够跟踪交易和余额的变化，我们将在以下部分看到。

**TIP*: 关于合同验证，请参考[本节文档](./building-on-zksync/contracts/contract-verification.md)。

## 设置每日支出限额

首先，在`/deploy`文件夹中创建`setLimit.ts`，粘贴下面的示例代码后，将未定义的账户地址和私钥字符串值替换为我们在上一节中得到的值。

为了启用每日支出限额，我们执行`setSpendingLimit`函数，有两个参数：代币地址和金额限制。代币地址是ETH_ADDRESS，限额参数是下面例子中的 "0.005"。(可以是任何金额)

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

预期的输出多半会是这样的。

```shell
limit:  5000000000000000
available:  5000000000000000
resetTime:  1672928333
Enabled:  true
```

## 执行ETH转账

最后，我们将看看SpendLimit合约是否有效，并拒绝任何超过每日限额的ETH转移。让我们用下面的示例代码创建`transferETH.ts`。

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

要进行转移，请运行以下程序。

```shell
yarn hardhat deploy-zksync --script deploy/transferETH.ts
```

虽然错误信息没有给我们任何具体的原因，但可以预见的是，交易被还原的情况如下。


```shell
An unexpected error occurred:

Error: transaction failed...
```

出错后，我们可以用一个不超过限额的不同ETH金额重新运行代码，比如 "0.0049"，看看`SpendLimit`合约是否不拒绝低于限额的金额。

如果交易成功，输出会像下面这样。

```shell
l1TimeStamp:  1673530137
resetTime:  1673529801
limit:  5000000000000000
available:  100000000000000
New resetTime: 1673530575
```

Limit结构中的`available'值被递减，所以现在只有0.0001个ETH可用于转账。

由于`ONE_DAY`在这个测试中被设置为1分钟，所以任何金额小于限额的另一次转账应该在1分钟后而不是24小时后相应成功。然而，第二次转账会失败，我们不得不等待下一个L1批次的封存（在testnet上大约10分钟）来代替成功的交易。为了理解这背后的原因，我们应该知道使用`block.timestamp'的一个约束。

::: warning block.timestamp返回L1批次值

`block.timestamp`返回最新的L1区块的时间，而不是L2区块的时间，而且只有在新的区块被封存后才会更新（在testnet上为5-10分钟）。这意味着，基本上，zkSync上智能合约中的`block.timestamp`是一个延迟值。

为了使本教程尽可能简单，我们使用了`block.timestamp`，但我们不建议依靠它来进行精确的时间计算。


:::

## 常见错误

- Insufficient gasLimit: 交易经常由于gasLimit不足而失败。当交易在没有明确原因的情况下失败时，请手动增加该值。
- 账户合同中的余额不足：由于部署的账户合同中缺乏余额，交易可能失败。请使用Metamask或`deploy/deploy-factory-account.ts`中使用的`wallet.sendTransaction()`方法向账户转移资金。
- 在接近的时间范围内提交的交易将具有相同的`block.timestamp`，因为它们可以被添加到同一个L1批次中，并可能导致支出限制不能像预期那样工作。

## 完整的项目

你可以下载完整的项目[这里](https://github.com/porco-rosso-j/daily-spendlimit-tutorial)。此外，存储库包含一个测试文件夹，可以在zkSync本地网络上执行比本教程更详细的测试。

## 了解更多

- 要了解更多关于zkSync上L1->L2的交互，请查看[文档](.../developer-guides/bridging/l1-l2.md)。
- 要了解更多关于zksync-web3 SDK的信息，请查看其[document](././api/js)。
- 要了解更多关于zkSync hardhat插件的信息，请查看其[document](../../api/hardhat)。

## 鸣谢

由[porco-rosso](https://linktr.ee/porcorossoj)为以下[GitCoin赏金](https://gitcoin.co/issue/29669)撰写。

