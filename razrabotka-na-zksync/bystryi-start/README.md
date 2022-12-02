# Быстрый старт

В этой инструкции по быстрому старту вы научитесь развертывать смарт-контракт на zkSync, а так же создавать dApp (децентрализованное приложение), с которым можно будет взаимодействовать с помощью набора разработчика zkSync.\
\
Вот что мы создадим:

* Смарт-контракт, который будет развернут на zkSync и содержит в себе приветственное сообщение
* dApp, чтоб получить приветствие&#x20;
* Пользователи будут в состоянии изменить приветственное сообщение смарт-контракта
* По умолчанию, пользователи должны будут заплатить комиссию в Эфириуме, чтобы изменить приветсвие.\
  Но мы так же объясним как создать testnet paymaster, что позволит пользователям платить комиссию в ERC20 токенах.

{% hint style="success" %}
**СОВЕТ**\
\
Testnet paymaster создан исключительно в целях тестировки. Если вы решите создать проект в мейннет, вам стоит прочитать документацию о [Paymaster](https://v2-docs.zksync.io/dev/developer-guides/aa.html#paymasters).
{% endhint %}

### Предварительные требования <a href="#prerequisites" id="prerequisites"></a>

* Менеджер пакетов `yarn`. [Вот ссылка на инструкцию по установке](https://yarnpkg.com/getting-started/install) (`npm` примеры будут добавлены в скором времени.)
* Кошелек с достаточным количеством Göerli `ETH` на L1, чтобы оплатить комиссию моста при отправке средств на zkSync и развертывание смарт-контрактов. ERC20 токены на zkSync обязательны, если вы хотите реализовать testnet paymaster. Мы рекомендуем использовать [кран с портала zkSync](https://portal.zksync.io/faucet).

### Инициализация проекта и развертывание смарт-контракта <a href="#initializing-the-project-deploying-a-smart-contract" id="initializing-the-project-deploying-a-smart-contract"></a>

1.  Инициализируйте проект и установите зависимости. Выполните следующие команды в терминале:

    ```
    mkdir greeter-example
    cd greeter-example
    yarn init -y
    yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
    ```

    Примечание: плагины zkSync требуют наличие Typescript.
2.  Создайте файл `hardhat.config.ts` и скопируйте туда следующий код:

    ```typescript
    require("@matterlabs/hardhat-zksync-deploy");
    require("@matterlabs/hardhat-zksync-solc");

    module.exports = {
      zksolc: {
        version: "1.2.0",
        compilerSource: "binary",
        settings: {
          experimental: {
            dockerImage: "matterlabs/zksolc",
            tag: "v1.2.0",
          },
        },
      },
      zkSyncDeploy: {
        zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      },
      networks: {
        hardhat: {
          zksync: true,
        },
      },
      solidity: {
        version: "0.8.16",
      },
    };
    ```



{% hint style="warning" %}
**Совет**

Если контракт уже скомпилирован, вы должны удалить папки `artifacts-zk` and`cache-zk`, иначе они не скомпилируются заново. Еще может помочь смена версии компилятора.
{% endhint %}

1. Создайте папки `contracts` и `deploy`. В первой будут храниться все файлы смарт-контрактов `*.sol`, а во второй все файлы связанные с развертыванием контрактов .
2.  Создайте контракт `contracts/Greeter.sol` и вставьте следующий код:

    ```solidity
    //SPDX-License-Identifier: Unlicense
    pragma solidity ^0.8.0;

    contract Greeter {
        string private greeting;

        constructor(string memory _greeting) {
            greeting = _greeting;
        }

        function greet() public view returns (string memory) {
            return greeting;
        }

        function setGreeting(string memory _greeting) public {
            greeting = _greeting;
        }
    }
    ```


3.  Скомпилируйте контракт следующей командой:\


    ```
    yarn hardhat compile
    ```


4.  Создайте следующий скрипт для развертывания контракта `deploy/deploy.ts`:\


    ```typescript
    import { Wallet, Provider, utils } from "zksync-web3";
    import * as ethers from "ethers";
    import { HardhatRuntimeEnvironment } from "hardhat/types";
    import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

    // An example of a deploy script that will deploy and call a simple contract.
    export default async function (hre: HardhatRuntimeEnvironment) {
      console.log(`Running deploy script for the Greeter contract`);

      // Initialize the wallet.
      const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
      const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

      // Create deployer object and load the artifact of the contract you want to deploy.
      const deployer = new Deployer(hre, wallet);
      const artifact = await deployer.loadArtifact("Greeter");

      // Estimate contract deployment fee
      const greeting = "Hi there!";
      const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting]);

      // Deposit funds to L2
      const depositHandle = await deployer.zkWallet.deposit({
        to: deployer.zkWallet.address,
        token: utils.ETH_ADDRESS,
        amount: deploymentFee.mul(2),
      });
      // Wait until the deposit is processed on zkSync
      await depositHandle.wait();

      // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
      // `greeting` is an argument for contract constructor.
      const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
      console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

      const greeterContract = await deployer.deploy(artifact, [greeting]);

      //obtain the Constructor Arguments
      console.log("constructor args:" + greeterContract.interface.encodeDeploy([greeting]));

      // Show the contract info.
      const contractAddress = greeterContract.address;
      console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
    }
    ```

    \

5.  Замените `WALLET-PRIVATE-KEY` приватным ключем с префиксом `0x` Эфириум кошелька, который вы используете для разработки, и выполните следующую команду, чтобы запустить скрипт для развертывания контракта:\


    ```
    yarn hardhat deploy-zksync
    ```

    \
    В выводе данных вы должны увидеть адрес развернутого смарт-контракта.

Поздравляем! Вы развернули смарт-контракт на zkSync! Посетите [обозреватель блоков zkSync](https://explorer.zksync.io/) и найдите адрес вашего контракта, чтоб убедиться, что он был успешно развернут.

[Эта инструкция](https://v2-docs.zksync.io/api/tools/block-explorer/contract-verification.html) подробно объясняет как верифицировать смарт-контракт с помощью обозревателя блоков.

### Интеграция фронтенда <a href="#front-end-integration" id="front-end-integration"></a>

#### Настройка проекта <a href="#setting-up-the-project" id="setting-up-the-project"></a>

В этом руководстве, `Vue` будет выбран веб-фреймворком, но процесс будет схожим вне зависимости от выбранного вами фреймврока. Акцент на специфике работы `zksync-web3` SDK, мы предоставляем шаблон реализации фронтенда. Последний шаг - взаимодействие со смарт-контрактом zkSync.

1. Клонируйте:

```
git clone https://github.com/matter-labs/greeter-tutorial-starter
```

&#x20; 2\.   Запустите проект:

```
cd greeter-tutorial-starter
yarn
yarn serve
```

По умолчанию, страница будет запущена на `http://localhost:8080`. Откройте ссылку в браузере, чтоб увидеть страницу

#### Подключаем Metamask & отправляем токены через мост на zkSync <a href="#connecting-to-metamask-bridging-tokens-to-zksync" id="connecting-to-metamask-bridging-tokens-to-zksync"></a>

Для взаимодействия с приложениями на zkSync, подключите кошелек Metamask к сети альфа тестнета zkSync и переведите средства на L2.

* Следуйте [этой инструкции](https://v2-docs.zksync.io/dev/fundamentals/testnet.html#connecting-metamask) для подключения Metamask к zkSync.
* Используйте [наш портал](https://portal.zksync.io/) для перевода средств на zkSync.

#### Структура проекта <a href="#project-structure" id="project-structure"></a>

Весь код будет написан в `./src/App.vue`. Почти весь фронтенд код готов, осталось только заполнить TODO-поля для взаимодействия с контрактом, который вы развернули на zkSync:

```javascript
initializeProviderAndSigner() {
  // TODO: initialize provider and signer based on `window.ethereum`
},

async getGreeting() {
  // TODO: return the current greeting
  return "";
},

async getFee() {
  // TOOD: return formatted fee
  return "";
},

async getBalance() {
  // Return formatted balance
  return "";
},
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    // TODO: Return data for the paymaster
  }

  return {};
},
async changeGreeting() {
  this.txStatus = 1;
  try {
    // TODO: Submit the transaction
    this.txStatus = 2;
    // TODO: Wait for transaction compilation
    this.txStatus = 3;
    // Update greeting
    this.greeting = await this.getGreeting();
    this.retreivingFee = true;
    this.retreivingBalance = true;
    // Update balance and fee
    this.currentBalance = await this.getBalance();
    this.currentFee = await this.getFee();
  } catch (e) {
    alert(JSON.stringify(e));
  }
  this.txStatus = 0;
  this.retreivingFee = false;
  this.retreivingBalance = false;
},
```

Вверху тэга `<script>` вы можете видеть элементы, которые должны быть заполнены адресом контракта `Greeter` и путем к его ABI. Мы видим их в следующией секции.

```javascript
// eslint-disable-next-line
const GREETER_CONTRACT_ADDRESS = ""; // TODO: insert the Greeter contract address here
// eslint-disable-next-line
const GREETER_CONTRACT_ABI = []; // TODO: insert the path to the Greeter contract ABI here
```

#### Установка `zksync-web3` <a href="#installing-zksync-web3" id="installing-zksync-web3"></a>

Выполните следующую команду в корневой папке greeter-tutorial-starter для установки `zksync-web3` иc `ethers`:

```
yarn add ethers zksync-web3
```

Импортируйте обе библиотеки в `script` части `App.vue` (прямо перед константой контракта). Должно выглядеть следующим образом:

```javascript
import {} from "zksync-web3";
import {} from "ethers";

// eslint-disable-next-line
const GREETER_CONTRACT_ADDRESS = ""; // TODO: insert the Greeter contract address here
// eslint-disable-next-line
const GREETER_CONTRACT_ABI = []; // TODO: insert the path to the Greeter contract ABI here
```

#### Получение ABI и адреса контракта <a href="#getting-the-abi-and-contract-address" id="getting-the-abi-and-contract-address"></a>

Откройте `./src/App.vue` и установите константу `GREETER_CONTRACT_ADDRESS` равной адресу контракта, который вы развернули.

Для взаимодействия с контрактом на zkSync, нам также нужен ABI. ABI это Бинарный Интерфейс Приложения (Application Binary Interface) и, если вкратце, это файл, который описывает все доступные имена и типы методов смарт-контракта, с которыми можно взаимодействовать.

* Создайте файл `./src/abi.json`.
* Вы можете получить ABI контракта в папке проекта hardhat из предыдущей секции, в файле `./artifacts-zk/contracts/Greeter.sol/Greeter.json`. Вы должны скопировать массив `abi` и вставить его в файл `abi.json` , созданный на предыдущем этапе. Файл должен выглядеть приблизительно следующим образом:

```json
[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

`GREETER_CONTRACT_ABI` должен требовать файл ABI.

```javascript
// eslint-disable-next-line
const GREETER_CONTRACT_ADDRESS = "0x...";
// eslint-disable-next-line
const GREETER_CONTRACT_ABI = require("./abi.json");
```

#### Работа с провайдером <a href="#working-with-provider" id="working-with-provider"></a>

1. Найдите функцию `initializeProviderAndSigner` в `./src/App.vue`. Эта функцию вызывается при успешном подключении к аккаунту Matemask.

В этой функции мы должны:

* Инициализировать `Web3Provider` и `Signer` для взаимодействия с zkSync.
* Инициализировать объект `Contract` для взаимодействия с контрактом `Greeter`, который мы только что развернули.

&#x20; 2\.   Импортируйте необходимые зависимости:

```
import { Contract, Web3Provider, Provider } from "zksync-web3";
```

&#x20; 3\.   Инициализируйте provider, signer, и объекты контракта следующим образом:

```javascript
initializeProviderAndSigner() {
    this.provider = new Provider('https://zksync2-testnet.zksync.dev');
    // Note that we still need to get the Metamask signer
    this.signer = (new Web3Provider(window.ethereum)).getSigner();
    this.contract = new Contract(
        GREETER_CONTRACT_ADDRESS,
        GREETER_CONTRACT_ABI,
        this.signer
    );
},
```

#### Получение приветствия <a href="#retrieving-the-greeting" id="retrieving-the-greeting"></a>

1. Заполните следующую функцию для получения приветствия:

```javascript
async getGreeting() {
    // Smart contract calls work the same way as in `ethers`
    return await this.contract.greet();
}
```

Функция целиком выглядит следующим образом:

```javascript
initializeProviderAndSigner() {
    this.provider = new Provider('https://zksync2-testnet.zksync.dev');
    // Note that we still need to get the Metamask signer
    this.signer = (new Web3Provider(window.ethereum)).getSigner();
    this.contract = new Contract(
        GREETER_CONTRACT_ADDRESS,
        GREETER_CONTRACT_ABI,
        this.signer
    );
},
async getGreeting() {
    return await this.contract.greet();
},
```

После подключения кошелька Metamask, вы должны увидеть следующую страницу:

![img](https://v2-docs.zksync.io/assets/img/start-1.2212407f.png)

Теперь есть возможность выбора токена для оплаты комиссий. Но, балансы еще не обновлены.

#### Извлечение баланса токенов и транзакционных комиссий <a href="#retrieving-token-balance-and-transaction-fee" id="retrieving-token-balance-and-transaction-fee"></a>

Наилегчайшим способом выяснения баланса пользователя явлеятся использование метода `Signer.getBalance.`

1. Добавьте необходимые зависимости:

```javascript
// `ethers` используется в этом рукодостве только из-за его утилитарных функций
import { ethers } from "ethers";
```

&#x20; 2\. Реализуйте сам метод:

```javascript
async getBalance() {
    // Getting the balance for the signer in the selected token
    const balanceInUnits = await this.signer.getBalance(this.selectedToken.l2Address);
    // To display the number of tokens in the human-readable format, we need to format them,
    // e.g. if balanceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
    return ethers.utils.formatUnits(balanceInUnits, this.selectedToken.decimals);
},
```

3\. Расчитайте комиссию:

```javascript
async getFee() {
    // Getting the amount of gas (ergs) needed for one transaction
    const feeInGas = await this.contract.estimateGas.setGreeting(this.newGreeting);
    // Getting the gas price per one erg. For now, it is the same for all tokens.
    const gasPriceInUnits = await this.provider.getGasPrice();

    // To display the number of tokens in the human-readable format, we need to format them,
    // e.g. if feeInGas*gasPriceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
    return ethers.utils.formatUnits(feeInGas.mul(gasPriceInUnits), this.selectedToken.decimals);
},
```

{% hint style="success" %}
**Оплата комиссий в токенах ERC20**

zkSync 2.0 нативно не поддерживает оплату комиссий в токенах ERC20, так как функция абстракции аккаунта позволяет делать это. Пример использования testnet paymaster для этих целей будет представлен далее в этом руководстве. Однако, работая в mainnet, [вы должны сами](https://v2-docs.zksync.io/dev/tutorials/custom-paymaster-tutorial.html#prerequisite) предоставлять услуги paymaster'a, или использовать paymaster'a, предоставленного 3им лицом.
{% endhint %}

При открытии страницы и выборе токена для комиссий будут доступны баланс и ожидаемая комиссия за транзакцию.

Кнопка `Refresh` используется для перерасчета комиссии, так как она может зависеть от устанавливаемой длины строки.

Также можно нажать на кнопку `Change greeting,` но ничего не произойдет, так как контракт еще не был вызван.

![img](https://v2-docs.zksync.io/assets/img/start-2.6e948cdc.png)

#### Изменение приветствия

1. Взаимодействие со смарт-контрактом работает абсолютно так же, как `ethers`, хотя, если вы хотите использовать спец-функции zkSync, вам может понадобиться внесение дополнительных параметров в overrides (переопределения)va:

```javascript
// The example of paying fees using a paymaster will be shown in the 
// section below.
const txHandle = await this.contract.setGreeting(this.newGreeting, await this.getOverrides());
```

&#x20; 2\.   Подождите, пока транзакция обработается:

```javascript
await txHandle.wait();
```

Полностью метод выглядит так:

```javascript
async changeGreeting() {
    this.txStatus = 1;
    try {
        const txHandle = await this.contract.setGreeting(this.newGreeting, await this.getOverrides());

        this.txStatus = 2;

        // Wait until the transaction is committed
        await txHandle.wait();
        this.txStatus = 3;

        // Update greeting
        this.greeting = await this.getGreeting();

        this.retreivingFee = true;
        this.retreivingBalance = true;
        // Update balance and fee
        this.currentBalance = await this.getBalance();
        this.currentFee = await this.getFee();
    } catch (e) {
        alert(JSON.stringify(e));
    }

    this.txStatus = 0;
    this.retreivingFee = false;
    this.retreivingBalance = false;
},
```

Теперь у вас есть полноценное приложение-приветствователь! Однако же, оно не использует каких-либо zkSync-специфичных функций.

#### Оплата комиссий с использованием testnet paymaster <a href="#paying-fees-using-testnet-paymaster" id="paying-fees-using-testnet-paymaster"></a>

Хоть эфир и является единственным токеном, которым вы можете оплачивать комиссии, функция абстракции аккаунта позволяет вам интегрировать [paymaster](broken-reference)'ов, которые могут или полностью оплачивать комиссии за вас, или обменивать ваши токены на лету. В этом руководстве мы будет использовать [testnet paymaster](broken-reference)'a, который предоставляется на всех тестнетах zkSync. Он позволяет пользователям оплачивать комиссии в ERC20 токенах по курсу обмена 1:1 к эфиру, то есть одна единица токена за один wei ETH.

{% hint style="success" %}
**Интеграция в Mainnet**

Testnet paymaster работает исключительно в целях демонстрации возможностей и не будет доступен в mainnet. При интеграций в свой протокол в mainnet вам нужно следовать документации к paymaster, которого вы используете.
{% endhint %}

Адрес paymaster'a, наряду с требуемыми данными, должен быть предоставлен в метод `getOverrides`

1. Нам нужно извлечь адрес testnet paymaster'a:

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    const testnetPaymaster = await this.provider.getTestnetPaymasterAddress();

    // ..
  }

  return {};
}
```

Имейте в виду, что извлекать адрес testnet paymaster'a рекомендуется каждый раз перед каждым взаимодействием, так как он (адрес) может меняться.

&#x20;  2\.   Добавьте `utils` к импортам из `zksync-web3` SDK:

```javascript
import { Contract, Web3Provider, Provider, utils } from "zksync-web3";
```

&#x20;  3\.   Нам нужно расчитать, как много токенов необходимо для проведения транзакции. Т.к. testnet paymaster обменивает любой токен ERC20 по курсу 1:1 к ETH, то сумма будет такой же, как и сумма в ETH.

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    const testnetPaymaster = await this.provider.getTestnetPaymasterAddress();

    const gasPrice = await this.provider.getGasPrice();
    const gasLimit = await this.contract.estimateGas.setGreeting(this.newGreeting);
    const fee = gasPrice.mul(gasLimit);

    // ..
  }

  return {};
}
```

&#x20;  4\.   Теперь на осталось закодировать `paymasterInput` по [требованиям протокола](broken-reference) и вернуть нужные overrides (переопределения):

```javascript
async getOverrides() {
  if (this.selectedToken.l1Address != ETH_L1_ADDRESS) {
    const testnetPaymaster = await this.provider.getTestnetPaymasterAddress();

    const gasPrice = await this.provider.getGasPrice();
    const gasLimit = await this.contract.estimateGas.setGreeting(this.newGreeting);
    const fee = gasPrice.mul(gasLimit);

    const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
        type: 'ApprovalBased',
        token: this.selectedToken.l2Address,
        minimalAllowance: fee,
        innerInput: new Uint8Array()
    });
    
    return {
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: ethers.BigNumber.from(0),
        gasLimit,
        customData: {
            ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
            paymasterParams
        }
    };
  }

  return {};
}
```

&#x20;  5\.   Для использования списка токенов ERC20s измените следующую строку:

```javascript
const allowedTokens = require("./eth.json");
```

на эту:

```javascript
const allowedTokens = require("./erc20.json");
```

#### Цельное приложение <a href="#complete-app" id="complete-app"></a>

Теперь приветствие должно быть изменяемым.

1. Введите новое приветствие в поле для вводе и кликните на кнопку `Change greeting`:

![img](https://v2-docs.zksync.io/assets/img/start-3.5d73c63e.png)

2\. Так как параметры `paymasterParams` были предоставлены, отправляемая транзакция будет типа`EIP712` : ([больше о транзакциях типа EIP717 Здесь)](https://eips.ethereum.org/EIPS/eip-712):

![img](https://v2-docs.zksync.io/assets/img/start-4.cd0adb0a.png)

3\. Нажмите "Sign".

После подтверждения транзакции страница обновится и можно будет увидеть обновленные баланс и приветствие:

![img](https://v2-docs.zksync.io/assets/img/start-5.496a1ab6.png)

#### Узнайте больше <a href="#learn-more" id="learn-more"></a>

* Для дополнительной информации о `zksync-web3` SDK, посмотрите эту [документацию](https://v2-docs.zksync.io/api/js).
* Для дополнительной информации о hardhat плагинах zkSync посмотрите эту [документацию](https://v2-docs.zksync.io/api/hardhat).

