# Кроссчейн управление

Данное руководство служит примером реализации взаимодействия контрактов L1 и L2. В этом руководстве реализованы следующие функциональные возможности:

* Смарт-контракт "Counter", развернутый на zkSync: он хранит число, которое может быть увеличено вызовом метода increment.
* Смарт-контракт "Governance", развернутый на Layer 1: он имеет право увеличивать счетчик на zkSync.

### Подготовка

В этом руководстве предполагается, что вы уже знакомы с развертыванием смарт-контрактов на zkSync. Если это не так, обратитесь к разделу [быстрый старт.](../../rukovodstvo-razrabotchika/bystryi-start.md)&#x20;

Также предполагается, что вы уже имеете некоторый опыт работы с Ethereum.

### Структура проекта

Поскольку мы будем развертывать контракты как на L1, так и на L2, мы разделим этот проект на две разные папки:

* `/L1-governance`: для контрактов и скриптов на L1.
* `/L2-counter`: для контрактов и скриптов на L2.

Для дальнейшей работы создайте эти папки.

{% hint style="success" %}
**СОВЕТ**\
****\
****Обратите внимание, что`governance -` это обычный проект Hardhat, поскольку он будет использоваться для развертывания контракта только в L1, в то время как проект counter включает все зависимости zkSync и специфическую конфигурацию, поскольку он будет развертывать контракт в L2.
{% endhint %}

### L1 управление

Чтобы инициализировать проект внутри папки `/L1-governance` , запустите `npx hardhat init` и выберите опцию "Create a Typescript project".

Чтобы взаимодействовать с контрактом моста zkSync с помощью Solidity, необходимо использовать интерфейс контракта zkSync. Есть два варианта его получения:

1. Импортировать его из npm-пакета`@matterlabs/zksync-contracts`. (предпочтительно)
2. Загрузить из [репозитория контрактов](https://github.com/matter-labs/v2-testnet-contracts).

Мы выберем вариант 1 и установим пакет `@matterlabs/zksync-contracts` , выполнив следующую команду (только убедитесь, что вы находитесь в папке `/L1-governance`):

```
yarn add -D @matterlabs/zksync-contracts
```

Код `governance` контракта, который мы развернем на L1:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Governance {
    address public governor;

    constructor() {
        governor = msg.sender;
    }

    function callZkSync(
        address zkSyncAddress,
        address contractAddr,
        bytes memory data,
        uint64 ergsLimit
    ) external payable {
        require(msg.sender == governor, "Only governor is allowed");

        IZkSync zksync = IZkSync(zkSyncAddress);
        zksync.requestL2Transaction{value: msg.value}(contractAddr, 0, data, ergsLimit, new bytes[](0));
    }
}
```

Это очень простой `governance` контракт. Он устанавливает создателя контракта в качестве единственного управляющего и имеет функцию, которая может отправлять вызовы смарт-контракту zkSync.

#### Развертывание контракта L1 governance

Хотя это руководство не посвящено процессу развертывания контрактов на L1, мы дадим вам краткий обзор того, как это сделать.

1. Для отправки транзакции развертывания вам понадобится конечная точка узла RPC (RPC node endpoint) в тестовой сети Göerli. Вы можете [найти несколько провайдеров узлов здесь](https://github.com/arddluma/awesome-list-rpc-nodes-providers).
2. Создайте файл`/L1-governance/goerli.json` и внесите следущие значения:

```json
{
  "nodeUrl": "", // your Goerli Ethereum node  URL.
  "deployerPrivateKey": "" //private key of the wallet that will deploy the governance smart contract. It needs to have some ETH on Göerli.
}
```

&#x20;3\.  Добавьте секцию сети Göerli в файл`hardhat.config.ts` :

```typescript
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

// import file with Goerli params
const goerli = require('./goerli.json');

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
  networks: {
    // Göerli network
    goerli: {
      url: goerli.nodeUrl,
      accounts: [goerli.deployerPrivateKey]
    },
  }
}
```

&#x20;4\. Создайте скрипт развертывания `/L1-governance/scripts/deploy.ts` со следующим кодом:

```typescript
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy
  const Governance = await ethers.getContractFactory("Governance");

  const contract = await Governance.deploy();
  await contract.deployed();

  console.log(`Governance contract was successfully deployed at ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

&#x20;5\.  Скомпилируйте контракт и запустите скрипт развертывания с помощью:

```
# compile contract
yarn hardhat compile

# deploy contract
yarn hardhat run --network goerli ./scripts/deploy.ts
```

Последняя команда выведет адрес развернутого смарт-контракта `governance`.

### L2 счетчик

Теперь, когда мы разобрались с контрактом `governance` на L1, давайте перейдем к развертыванию контракта `counter` на L2.

1. Для инициализации проекта в папке`/L2-counter` выполните следующие команды:

```
yarn init -y
# install all dependencies
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

&#x20;2\.   Создайте файл  `hardhat.config.ts` и вставьте туда следующий код:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.2.0",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
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

Если ваша сеть по умолчанию не `hardhat`, убедитесь, что параметр `zksync: true` включен в ее конфиг.

&#x20;3\.  Создайте папки `contracts` и `deploy` . Первая папка - это место, где должны храниться все контракты  `*.sol` , а вторая - место, куда будут помещены все скрипты, связанные с развертыванием контракта.&#x20;

&#x20;4\.  Создайте файл контракта `contracts/Counter.sol`. Этот контракт будет содержать адрес контракта `governance`, развернутого в L1, и счетчик. Функция для увеличения счетчика может быть вызвана только контрактом `governance`. Вот код:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Counter {
    uint256 public value = 0;
    address public governance;

    constructor(address newGovernance) {
        governance = newGovernance;
    }

    function increment() public {
        require(msg.sender == governance, "Only governance is allowed");

        value += 1;
    }
}
```

&#x20;5\.  Скомпилируйте контракт, используя следующую команду:

```
yarn hardhat compile
```

&#x20;6\.  Создайте скрипт развертывания в файле `deploy/deploy.ts`:

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Insert the address of the governance contract
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Counter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>");

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Counter");

  // Deposit some funds to L2 to be able to perform deposits.
  const deploymentFee = await deployer.estimateDeployFee(artifact, [
    GOVERNANCE_ADDRESS,
  ]);
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similar to the ones in `ethers`.
  // The address of the governance is an argument for contract constructor.
  const counterContract = await deployer.deploy(artifact, [GOVERNANCE_ADDRESS]);

  // Show the contract info.
  const contractAddress = counterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
```

&#x20;7\.  Заменив `<WALLET-PRIVATE-KEY>` и `<GOVERNANCE-ADDRESS>` на приватный ключ кошелька Ethereum с префиксом `0x` с некоторым балансом ETH на Görli и адрес контракта `governance` на L1, соответственно, запустите скрипт с помощью следующей команды:

```
yarn hardhat deploy-zksync
```

В выводе вы должны увидеть адрес, на который был развернут контракт.

{% hint style="success" %}
**СОВЕТ**\
****\
****Более подробную информацию о развертывании контрактов вы можете найти в [руководстве по быстрому старту](broken-reference) или в документации по плагинам hardhat для zkSync.
{% endhint %}

### Считывание значения счетчика

Когда оба контракта развернуты, мы можем создать небольшой скрипт для получения значения счетчика. Для простоты мы создадим этот скрипт в папке `/L2-counter`. Для того, чтобы руководство было общим, в нем не будут использоваться специфичные для `hardhat` функции.

#### Получение ABI контракта `counter`

Вот как можно получить ABI `counter` контракта:

1. Скопируйте массив `abi` из артефакта компиляции, расположенного по адресу `/L2-counter/artifacts-zk/contracts/Counter.sol/Counter.json`.
2. Создайте папку `scripts` внутри папки проекта `/L2-counter` .
3. Создайте новый файл `/L2-counter/scripts/counter.json` и вставьте ABI контракта `counter` .
4. Создайте файл `/L2-counter/scripts/display-value.ts` и вставьте туда следующий код:

```typescript
import { Contract, Provider, Wallet } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const counterContract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counterContract.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Код относительно прост и в основном эквивалентен тому, как он работал бы на Ethereum. Он просто извлекает значение счетчика из контракта на L2.

После замены `<COUNTER-ADDRESS>` на адрес развернутого контракта `counter`, запустите этот скрипт, выполнив команду:

```
yarn ts-node ./scripts/display-value.ts
```

На выходе должно получиться:

```
The counter value is 0
```

### Вызов контракта L2 из L1

Теперь давайте вызовем `increment` метод из `Layer 1`.

1. Получите массив `ABI` для скомпилированного контракта `governance`, который находится в `/L1-governance/artifacts/contracts/Governance.sol/Governance.json`, и сохраните его в новом файле `/L2-counter/scripts/governance.json` (убедитесь, что вы создали его в папке `/L2-counter` !).
2. Создайте файл `L2-counter/scripts/increment-counter.ts` и вставьте следующий шаблон для скрипта:

```typescript
// Imports and constants will be put here

async function main() {
  // The logic will be put here
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

&#x20;3\.  Для взаимодействия со смарт-контрактом `governance` нам необходимо инициализировать провайдера Ethereum и соответствующий объект контракта `ethers`, поэтому нам нужен адрес, на который он был развернут:

```typescript
// Imports
import { BigNumber, Contract, ethers, Wallet } from "ethers";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
```

```typescript
async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet, the same one as the one that deployed the
  // governance contract
  const wallet = new ethers.Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);
}
```

Замените `<GOVERNANCE-ADDRESS>` и `<WALLET-PRIVATE-KEY>` на L1 адрес смарт-контракта `governance` и приватный ключ кошелька, который развернул этот контракт `governance`, соответственно.&#x20;

&#x20;4\.  Чтобы взаимодействовать с мостом zkSync, нам нужен его L1 адрес. Хотя в mainnet вы можете захотеть установить адрес смарт-контракта zkSync как переменную env или константу, стоит заметить, что вы можете получать адрес смарт-контракта динамически. Мы рекомендуем использовать этот подход, если вы работаете в тестовой сети, поскольку может произойти регенезис и адреса контрактов могут измениться.  &#x20;

```typescript
// Imports
import { Provider, utils } from "zksync-web3";
```

```typescript
async function main() {
  // ... Previous steps

  // Initializing the L2 privider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  // Getting the current address of the zkSync L1 bridge
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);
}
```

&#x20;5\.  Для выполнения транзакций из L1 требуется некоторая плата от вызывающей стороны в пользу оператора  L2.

Во-первых, эта плата зависит от длины `calldata` и `ergsLimit` . Если этот концепт  вам не знаком, то это практически то же самое, что и `gasLimit` в Ethereum. Подробнее о модели комиссий zkSync вы можете [прочитать здесь](https://v2-docs.zksync.io/dev/developer-guides/transactions/fee-model.html).

Во-вторых, плата зависит от цены на газ, который используется во время вызова транзакции. Поэтому, чтобы иметь предсказуемую плату за вызов, необходимо извлечь цену газа и использовать полученное значение.

```typescript
// Imports
const COUNTER_ABI = require("./counter.json");
```

```typescript
async function main() {
  // ... Previous steps

  // Encoding L1 transaction is the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of L1 transaction requests depend on the gas price used in the call,
  // so we should explicitly fetch the gas price before the call.
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for ergs limit.
  // There is currently no way to get the exact ergsLimit required for an L1->L2 tx.
  // You can read more on that in the tip below
  const ergsLimit = BigNumber.from(100000);

  // Getting the cost of the execution in Wei.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, ergsLimit, ethers.utils.hexlify(data).length);
}
```

{% hint style="success" %}
**Модель и оценка комиссий находятся в процессе разработки** \
****\
****Возможно, вы заметили отсутствие полей `ergs_per_pubdata` и`ergs_per_storage` в транзакциях L1->L2. Они безусловно важны для безопасности протокола и будут добавлены в ближайшее время. Пожалуйста, обратите внимание, что это будет критическим изменением для интерфейса контракта. \
\
Кроме того, в настоящее время нет простого способа оценить точное количество ergs, необходимых для выполнения транзакции L1->L2. На момент написания этой статьи транзакции могут быть обработаны, даже если предоставленное значение `ergsLimit` равно `0`. Это изменится в будущем.
{% endhint %}

&#x20;6\.  Теперь можно вызвать `governance` контракт , который перенаправит вызов на zkSync:

```typescript
// Imports
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
```

```typescript
async function main() {
  // ... Previous steps

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, ergsLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 transaction is complete.
  await tx.wait();
}
```

Убедитесь, что вместо `<COUNTER-ADDRESS>` указан адрес L2 контракта `counter` .&#x20;

&#x20;7\.  Вы можете отслеживать статус соответствующей транзакции L2. `zksync-web3`'s `Provider` имеет метод, который, учитывая объект L1 `ethers.TransactionResponse` транзакции, вызвавшей мост zkSync, возвращает соответствующий объект `TransactionResponse` транзакции в L2, который удобно может ждать обработки транзакции на L2.

```typescript
async function main() {
  // ... Previous steps

  // Getting the TransactionResponse object for the L2 transaction corresponding to the
  // execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the counter contract
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}
```

#### Полный код

Вот полный код для получения адреса контракта zkSync, кодирования данных транзакции, расчета комиссии, отправки транзакции в L1 и отслеживания cоответственной транзакции в L2:

```typescript
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { Provider, utils } from "zksync-web3";

const GOVERNANCE_ABI = require("./governance.json");
const GOVERNANCE_ADDRESS = "<GOVERNANCE-ADDRESS>";
const COUNTER_ABI = require("./counter.json");
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";

async function main() {
  // Ethereum L1 provider
  const l1Provider = ethers.providers.getDefaultProvider("goerli");

  // Governor wallet
  const wallet = new Wallet("<WALLET-PRIVATE-KEY>", l1Provider);

  const govcontract = new Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, wallet);

  // Getting the current address of the zkSync L1 bridge
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
  const zkSyncAddress = await l2Provider.getMainContractAddress();
  // Getting the `Contract` object of the zkSync bridge
  const zkSyncContract = new Contract(zkSyncAddress, utils.ZKSYNC_MAIN_ABI, wallet);

  // Encoding the tx data the same way it is done on Ethereum.
  const counterInterface = new ethers.utils.Interface(COUNTER_ABI);
  const data = counterInterface.encodeFunctionData("increment", []);

  // The price of the L1 transaction requests depends on the gas price used in the call
  const gasPrice = await l1Provider.getGasPrice();

  // Here we define the constant for ergs limit.
  const ergsLimit = BigNumber.from(100000);
  // Getting the cost of the execution.
  const baseCost = await zkSyncContract.l2TransactionBaseCost(gasPrice, ergsLimit, ethers.utils.hexlify(data).length);

  // Calling the L1 governance contract.
  const tx = await govcontract.callZkSync(zkSyncAddress, COUNTER_ADDRESS, data, ergsLimit, {
    // Passing the necessary ETH `value` to cover the fee for the operation
    value: baseCost,
    gasPrice,
  });

  // Waiting until the L1 tx is complete.
  await tx.wait();

  // Getting the TransactionResponse object for the L2 transaction corresponding to the
  // execution call
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);

  // The receipt of the L2 transaction corresponding to the call to the Increment contract
  const l2Receipt = await l2Response.wait();
  console.log(l2Receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Вы можете запустить скрипт с помощью следующей команды:

```
yarn ts-node ./scripts/increment-counter.ts
```

В выводе вы должны увидеть полный чек транзакции в L2. Вы можете использовать `transactionHash` для отслеживавания транзакции через [zkSync explorer](https://explorer.zksync.io/).&#x20;

&#x20;8\.  После этого вы можете проверить, что транзакция действительно прошла успешно, снова запустив скрипт `display-value`:

```
yarn ts-node ./scripts/display-value.ts
```

Счетчик в контракте L2 после транзакции должен был увеличиться, поэтому вывод должен быть следующим:

```
The counter value is 1
```

### Полный проект

Вы можете загрузить полный проект [тут](https://github.com/matter-labs/cross-chain-tutorial).

### Узнать больше

* Чтобы узнать больше о взаимодействии L1->L2 в zkSync, ознакомьтесь с документацией [тут](broken-reference).
* Чтобы узнать больше о `zksync-web3` SDK, ознакомьтесь с его документацией [тут](../../api-reference/javascript-web3-sdk/).
* Чтобы узнать больше о `hardhat` плагинах zkSync , ознакомьтесь с их документацией [тут](https://v2-docs.zksync.io/api/hardhat).
