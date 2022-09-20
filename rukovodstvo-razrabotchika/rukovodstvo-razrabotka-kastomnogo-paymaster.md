# Руководство: разработка кастомного paymaster

Давайте посмотрим, как мы можем использовать функции paymaster для создания кастомного paymaster, который позволяет пользователям платить комиссии в нашем токене. Для упрощения руководства, мы предполагаем, что одной единицы нашего токена достаточно для покрытия любой транзакционной комиссии.

### Подготовка <a href="#preliminaries" id="preliminaries"></a>

Крайне рекомендуется ознакомиться с [дизайном ](https://v2-docs.zksync.io/dev/zksync-v2/aa.html)протокола абстракции аккаунта прежде, чем углубляться в данное руководство.

Предполагается, что вы уже знакомы с развертыванием контрактов на zkSync. Если нет, пожалуйста обратитесь к первому разделу руководства [Hello World](https://v2-docs.zksync.io/dev/guide/hello-world.html). Также [рекомендуется ](https://v2-docs.zksync.io/dev/zksync-v2/system-contracts.html)ознакомиться с введением в системные контракты.

### Установка зависимостей <a href="#installing-dependencies" id="installing-dependencies"></a>

Для разработки данного контракта мы будет использывать hardhat плагин zkSync. Во-первых, нам нужно установить все зависимости для него:

```
mkdir custom-paymaster-tutorial
cd custom-paymaster-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Так как мы работаем с контрактами zkSync, нам нужно установить пакет с контрактами и их зависимостями:

```
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Создайте файл конфига `hardhat.config.ts` , директории `contracts` и `deploy` , как в руководстве [Hello World](https://v2-docs.zksync.io/dev/guide/hello-world.html).

### Дизайн <a href="#design" id="design"></a>

Нашим протоколом будет пример протокола, который позволяет кому угодно обменивать конкретный ERC20 токен на оплату комиссий за транзакцию.

Скелет paymaster выглядит следующим образом:

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

Возьмите на заметку, что только у [bootloader](https://v2-docs.zksync.io/dev/zksync-v2/system-contracts.html#bootloader) должен быть доступ к вызову методов `validateAndPayForPaymasterTransaction`/`postOp`. Именно поэтому для них используется модификатор `onlyBootloader` .

#### Парсинг вводимых данных paymaster <a href="#parsing-the-paymaster-input" id="parsing-the-paymaster-input"></a>

В этом руководстве мы хотим взять с пользователя одну единицу `allowedToken` в обмен на оплату его комиссий контрактом.

Вводные данные, которые paymaster должен получить закодированы в `paymasterInput`. Как  описывается [здесь](https://v2-docs.zksync.io/dev/zksync-v2/aa.html#built-in-paymaster-flows), есть несколько стандартизированных путей кодировки взаимодействия пользователя с `paymasterInput`. Для того, чтобы списать средства пользователя, нам необходимо будет запросить, чтобы он предоставил достаточное число разрешение на трату (allowance) для контракта paymaster. Это то, где порядок исполнения `approvalBased` может нам помочь.

Во-первых, нам нужно удостовериться, что `paymasterInput` был закодирован по порядку исполнения `approvalBased`:

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

Затем, нам нужно удостовериться, что пользователь на самом деле предоставил достаточно разрешения на трату (allowance):

```solidity
address userAddress = address(uint160(_transaction.from));
address thisAddress = address(this);

uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);
require(providedAllowance >= PRICE_FOR_PAYING_FEES, "The user did not provide enough allowance");
```

Далее, мы наконец отправляем средства пользователю в обмен на 1 единицу данного токена:

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

{% hint style="success" %}
**В первую очередь вы должны подтвердить удовлетворения всем требованиям**

Правила замедления (троттлинга) paymaster'a гласят, что paymaster не будет замедлен в случае, если первый (дальше ~~нихуя~~ не понятно)

The [rules](https://v2-docs.zksync.io/dev/zksync-v2/aa.html#paymaster-validation-rules) for the paymaster throttling say that the paymaster won't be throttled if the first storage read the value of which differed from the execution on the API was a storage slot that belonged to the user.

Поэтому важно убедиться, что пользователь предоставил все разрешения для транзакции _перед_ реализацией  какой-либо логики. По этой причине мы _сначала_ проверяем, предоставил ли пользователь достаточное разрешение на трату, и только после этого мы выполняем `transferFrom`.


{% endhint %}

#### Полный код paymaster <a href="#full-code-of-the-paymaster" id="full-code-of-the-paymaster"></a>

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

### Развертывание контракта ERC20 <a href="#deploying-an-erc20-contract" id="deploying-an-erc20-contract"></a>

Для тестирования нашего paymaster нам нужен токен ERC20. И сейчас мы его развернем. Для упрощения немного модифицированную его реализацию от OpenZeppelin:

Создайте файл `MyERC20.sol` и вставьте в него следующий код:&#x20;



&#x20;We are now going to deploy one. For the sake of simplicity we will use a somewhat modified OpenZeppelin implementation of it:

Create the `MyERC20.sol` file and put the following code in it:&#x20;

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



### Развертывание paymaster <a href="#deploying-the-paymaster" id="deploying-the-paymaster"></a>

Для развертывания токена ERC20 и paymaster'a нам нужно создать скрипт развертывания. Создайте диркеторию `deploy` и в ней же создайте файл `deploy-paymaster.ts`. Вставьте в него следующий скрипт развертывания:

```typescript
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

Помимо развертывания paymaster он также создает пустой кошелек и начисляет на него токены `MyERC20`, чтобы можно было использовать paymaster.

Для развертывания токена ERC20 и paymaster'a вам нужно скомпилировать контракты и запустить скрипт:

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-paymaster.ts
```

Вывод должен быть примерно следующим:

```
Empty wallet's address: 0xAd155D3069BB3c587E995916B320444056d8191F
Empty wallet's private key: 0x236d735297617cc68f4ec8ceb40b351ca5be9fc585d446fa95dff02354ac04fb
ERC20 address: 0x65C899B5fb8Eb9ae4da51D67E1fc417c7CB7e964
Paymaster address: 0x0a67078A35745947A37A552174aFe724D8180c25
Done!
```

Заметьте, что адреса и приватные ключи будыт разными после каждого исполнения скрипта.

### Использование paymaster <a href="#using-the-paymaster" id="using-the-paymaster"></a>

Создайте скрипт `use-paymaster.ts` в директории `deploy`. Вы можете увидеть пример взаимодействия с paymaster'oм во фрагменте кода ниже:

```typescript
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

После заполнения параметров `PAYMASTER_ADDRESS`,`TOKEN_ADDRESS` и `EMPTY_WALLET_PRIVATE_KEY` данными, полученными в предыдущем шаге, запустите этот скрипт следующей командой:&#x20;

```
yarn hardhat deploy-zksync --script use-paymaster.ts
```

Вывод должен быть примерно следующим:

```
Balance of the user before mint: 3
Balance of the user after mint: 102
```

### Полный проект <a href="#complete-project" id="complete-project"></a>

Вы можете скачать полный проект [здесь](https://github.com/matter-labs/custom-paymaster-tutorial).

### Узнать больше <a href="#learn-more" id="learn-more"></a>

* Об абстракции аккаунте можно на этой [странице документации](https://v2-docs.zksync.io/dev/zksync-v2/aa.html).
* О `zksync-web3`  можно на этой [странице документации](https://v2-docs.zksync.io/api/js).&#x20;
* О hardhat плагинах zkSync можно на этой [странице документации](https://v2-docs.zksync.io/api/hardhat).
