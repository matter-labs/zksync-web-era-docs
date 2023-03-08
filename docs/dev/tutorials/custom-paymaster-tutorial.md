# 构建自定义的paymaster

让我们看看如何使用paymaster功能来建立一个自定义的paymaster，让用户在我们的token中支付费用。在本教程中，我们将。

- 创建一个paymaster，它将假设一个单位的ERC20代币足以支付任何交易费用。
- 创建ERC20代币合约并发送一些代币到一个全新的钱包。
- 最后我们将从新创建的钱包通过paymaster发送一个`mint`交易。尽管该交易通常需要一些ETH来支付汽油费，但我们的paymaster将执行该交易，以换取1单位的ERC20代币。

## 先决条件

为了更好地理解这个页面，我们建议你在深入学习本教程之前先阅读一下[账户抽象设计](.../developer-guides/aa.md)。

假设你已经熟悉在zkSync上部署智能合约。如果没有，请参考[快速入门教程]（.../building-onzksync/hello-world.md）的第一节。还建议阅读[系统合约介绍](.../developer-guides/system-contracts.md)。

## 安装依赖项

我们将使用zkSync硬帽插件来开发这个合约。首先，我们应该为它安装所有的依赖项。

```
mkdir custom-paymaster-tutorial
cd custom-paymaster-tutorial
yarn init -y
yarn add -D typescript ts-node ethers@^5.7.2 zksync-web3@^0.13.1 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

::: tip

当前版本的`zksync-web3`使用`ethers v5.7.x`作为同行依赖。与`ethers v6.x.x`兼容的更新将很快发布。

:::

由于我们正在使用zkSync合约，我们还需要安装带有合同及其对等依赖的软件包。

```shag-0-1gr0ag-0-1gr0ereag-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8l8lag-1-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ereag-0-1gr0ere8lagag-1-1gr0ere8l-0-1gr0ere8l8lag-1-1gr0ere8lerag-1-1gr0ere8le8lag-1-1gag-0-1gr0ere8lr0ag-1-1gr0ere8lere8l
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

然后创建`hardhat.config.ts`配置文件，`contracts`和`deploy`文件夹，就像[快速入门教程](.../building-on-zksync/hello-world.md)中那样。

::: tip

你可以使用zkSync CLI来自动构建一个项目的支架。查找[关于zkSync CLI的更多信息](.../.../api/tools/zksync-cli/)

:::

## 设计

我们的协议将是一个假协议，允许任何人交换某个ERC20代币，以换取支付交易费用。

paymaster的框架看起来是这样的。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    function validateAndPayForPaymasterTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable returns (bytes4 magic, bytes memory context) {
        // TO BE IMPLEMENTED
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override {
        // Refunds are not supported yet.
    }

    receive() external payable {}
}
```

注意，只有[bootloader](.../developer-guides/system-contracts.md#bootloader)才允许调用`validateAndPayForPaymasterTransaction`/`postOp`方法。这就是为什么对它们使用`onlyBootloader`修改器。

### 解析paymaster的输入

在本教程中，我们想向用户收取一个单位的`allowedToken`以换取交易费用，这将由paymaster合同支付。

付款人应该收到的输入被编码为`paymasterInput`。正如[在paymaster文档中](.../developer-guides/aa.md#built-in-paymaster-flows)所述，有一些标准化的方法来编码用户与paymasterInput的互动。为了向用户收费，我们将要求她向paymaster合同提供足够的ERC20代币的津贴。这个津贴是在幕后的 "approvalBased "流程中完成的。

首先，我们需要检查 "paymasterInput "是否像 "approvalBased "流程中那样被编码，并且 "paymasterInput "中发送的代币是支付者接受的。

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

然后，我们需要检查用户是否确实提供了足够的津贴。

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

最后，我们将检查交易费用是多少，将ERC20代币转移到paymaster，并将相应的气体费用从paymaster转移到bootloader以支付交易费用。

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

::: tip 你应该首先验证所有的要求

付费者节流的[规则](.../developer-guides/aa.md#the-validation-step)说，如果第一个与API上的执行不同的存储读取值是属于用户的存储槽，那么付费者就不会被节流了。

这就是为什么在执行任何逻辑之前，必须验证用户是否为交易提供了所有允许的前提条件_。这就是我们_首先_检查用户是否提供了足够的许可，然后才进行`transferFrom`的原因。

:::

### paymaster的完整代码

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
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

    function validateAndPayForPaymasterTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    ) external payable returns (bytes4 magic, bytes memory context) {
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

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override {
        // Refunds are not supported yet.
    }

    receive() external payable {}
}
```

## 部署一个ERC20合约

为了测试我们的支付系统，我们需要一个ERC20代币，所以我们要部署一个。为了简单起见，我们将使用一个稍加修改的OpenZeppelin实现它。

创建 "MyERC20.sol "文件，并将以下代码放入其中。

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

## 部署支付系统

为了部署ERC20代币和paymaster，我们需要创建一个部署脚本。创建`deploy`文件夹并在那里创建一个文件。`deploy-paymaster.ts`。把下面的部署脚本放在那里。

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

除了部署paymaster，它还创建了一个空钱包，并将一些`MyERC20'代币开采到其中，以便以后可以使用paymaster。

为了部署ERC20代币和paymaster，你应该编译合约并运行该脚本。

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
```

输出结果应该大致如下。

```ag-0-1gr0ere8lag-1-1gr0ere8l
Empty wallet's address: 0xAd155D3069BB3c587E995916B320444056d8191F
Empty wallet's private key: 0x236d735297617cc68f4ec8ceb40b351ca5be9fc585d446fa95dff02354ac04fb
ERC20 address: 0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964
Paymaster address: 0x0a67078A35745947A37A552174aFe724D8180c25
Minted 3 tokens for the empty wallet
Done!
```

注意，每次运行的地址和私钥将是不同的。

## 使用paymaster

在`deploy`文件夹中创建`use-paymaster.ts`脚本。你可以在下面的代码段中看到与paymaster交互的例子。

```ts
import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of the deployed paymaster here
const PAYMASTER_ADDRESS = "<PAYMASTER_ADDRESS>";

// Put the address of the ERC20 token here:
const TOKEN_ADDRESS = "<TOKEN_ADDRESS>";

// Wallet private key
// ⚠️ Never commit private keys to file tracking history, or your account could be compromised.
const EMPTY_WALLET_PRIVATE_KEY = "<EMPTY_WALLET_PRIVATE_KEY>";
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
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
    await erc20.mint(emptyWallet.address, 100, {
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

在填写完参数`PAYMASTER_ADDRESS'、`TOKEN_ADDRESS'和`EMPTY_WALLET_PRIVATE_KEY'与上一步提供的输出后。

::: warning 

重要的是! 确保你使用的是之前脚本所创建的钱包的私钥，因为该钱包包含ERC20代币

:::

用以下命令运行这个脚本。

```
yarn hardhat deploy-zksync --script use-paymaster.ts
```

输出结果应该大致如下。

```
Balance of the user before mint: 3
Balance of the user after mint: 102
```

运行部署脚本后，钱包里有3个代币，在向`mint`发送交易后，又有100个代币，余额为102，因为有1个代币被用来支付交易费用给支付者。

## 常见错误

如果`use-paymaster.ts`脚本失败，出现错误`提交交易失败。验证交易失败。原因是。验证重启。Paymaster验证错误。向bootloader转移资金失败`，请尝试向paymaster发送额外的ETH，以便它有足够的资金来支付交易。你可以使用[zkSync Portal]（https://portal.zksync.io/）。

如果`use-paymaster.ts`脚本在铸造新的ERC20代币时失败，出现`错误：交易失败`，并且交易在[zkSync explorer](https://explorer.zksync.io/)中出现状态 "失败"，请通过[我们的Discord](https://join.zksync.dev/)或[联系页面](https://zksync.io/contact.html)与我们接触。作为一个解决方法，尝试在交易中包括一个特定的`gasLimit`值。

## 完整的项目

你可以下载完整的项目[这里](https://github.com/matter-labs/custom-paymaster-tutorial)。

## 了解更多

- 要了解更多关于zkSync上L1->L2的交互，请查看[document](../developer-guides/bridging/l1-l2.md)。
- 要了解更多关于`zksync-web3`SDK的信息，请查看其[文档](././api/js)。
- 要了解更多关于zkSync hardhat插件的信息，请查看其[document](../../api/hardhat)。
