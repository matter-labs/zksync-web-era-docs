# Руководство: кросс-чейн управление

Данное рукодство служит примером реализации взаимодействия контрактов с L1 на L2. В данном руководстве реализован следующий функционал:

* Смарт-контракт "счетчик", развернутый на zkSync, который хранит число, которое можно увеличить путем вызова метода `increment`
* Смарт-контракт управления, развернутый на L1, у которого есть привилегия на увеличение числа на счетчике на zkSync

### Подготовка <a href="#preliminaries" id="preliminaries"></a>

В этом руководстве предполагается, что вы уже знакомы с развертыванием контрактов на zkSync. Если нет, то пожалуйста обратитесь к первому разделу руководства [Hello World](https://v2-docs.zksync.io/dev/guide/hello-world.html).

Также предполагается, что вы уже имеете некоторый опыт работы с Эфириум.

### L1 управление <a href="#l1-governance" id="l1-governance"></a>

Для взаимодействия с контрактом моста zkSync с помощью Solidity, вам нужно использовать интерфейс контракта zkSync. Есть 2 основных способа его раздобыть:

* Импортировать его из npm пакета `@matterlabs/zksync-contract` (предпочтительно)
* Скачать контракты из [репозитория](https://github.com/matter-labs/v2-testnet-contracts).

Пакет `@matterlabs/zksync-contracts` можно установить с помощью следующей команды:&#x20;

```
yarn add -D @matterlabs/zksync-contracts
```

Код контракта управления выглядит следующим образом:

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

Это очень простой контракт управления. Он устанавливает создателя контракта как единственного управляющего и может отправлять вызовы с смарт-контракту zkSync.

#### Развертывание по предопределенному сценарию <a href="#deploy-with-the-predefined-script" id="deploy-with-the-predefined-script"></a>

Это руководство не фокусируетсся на процессе развертывания контрактов L1. Команда zkSync предоставила сценарий развертывания вышеупомянутого смарт-контракта на Görli, чтобы вы могли быстрее продвинуться по руководству.

1. Склонируйте весь репозиторий руководства:

```
git clone https://github.com/matter-labs/cross-chain-tutorial.git
cd cross-chain-tutorial/deploy-governance
```

&#x20; 2\.  Откройте `goerli.json` и заполните следующие значения:

* `nodeUrl` - должен быть равен URL вашего провайдера узла Goerli Ethereum.
* `deployerPrivateKey` - должен быть равен приватному ключу кошелька, который будеть развертывать смарт-контракт управления. На нем должно быть немного ETH на Görli.

&#x20; 3\.  Для развертывания смарт-контракта управления запустите следующий команды:

```
# Установка зависимостей
yarn

# Построение (билд) смарт-контракта управления
yarn build

# Развертывание смарт-контракта управления
yarn deploy-governance
```

Последняя команда выдаст адрес развернутого смарт-контракта управления.

### L2 счетчик <a href="#l2-counter" id="l2-counter"></a>

Теперь когда у нас есть адрес смарт-контракта управления L1, давайте перейдем к развертыванию контракта счетчика на L2.

Контракт счетчика состоит из следующего кода:

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

Детали процесса развертывания смарт-контрактов на zkSymc не будут объясняться в этом руководстве. Если это для вас в новинку, то можете ознакомиться с руководством  [hello world](https://v2-docs.zksync.io/dev/guide/hello-world.html) или с документациям к [плагинам hardhat](https://v2-docs.zksync.io/api/hardhat/getting-started.html) для zkSync.

1. Инициализируйте проект и установите зависимости.

```
mkdir cross-chain-tutorial
cd cross-chain-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

&#x20; 2\.  Создайте файл `hardhat.config.ts` и вставьте в него следующий код:

```typescript
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

module.exports = {
  zksolc: {
    version: "1.1.5",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.1.5"
      }
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
    version: "0.8.11",
  },
};
```



Если ваша сеть по умолчанию не `hardhat`, то убедитесь, что параметр `zksync: true` тоже прописан в конфиге.

&#x20; 3\.  Создайте директории `contracts` и `deploy` . В первой должны храниться все файлы контрактов `*.sol`, а во второй - все скрипты, связанные с развертыванием контрактов.

&#x20; 4\.  Создайте контракт `contracts/Counter.sol` и вставьте Solidity код счетчика, предоставленный в начале этого раздела.

&#x20; 5\.  Скомпилируйте контракты с помощью следующей команды:

```
yarn hardhat compile
```

&#x20; 6\.  Создайте скрипт развертывания в `deploy/deploy.ts`:

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
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
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

&#x20; 7\.  После замены `<WALLET-PRIVATE-KEY>` и `<GOVERNANCE-ADDRESS>` приватным ключом с префиксом `0x` от Эфириум-кошелька с некоторым количеством ETH на балансе в Görli и адресом контракта управления на L1 соответственно, запустите скрипт, используя следующую команду:

```
yarn hardhat deploy-zksync
```

### Чтение значения счетчика <a href="#reading-the-counter-value" id="reading-the-counter-value"></a>

Давайте создадим небольшой скрипт для просмотра значения счетчика. В целях упрощения, давайте сохраним его в той же директории, что и проект hardhat, но для сохранения этого руководства универсальным функции, специфичные для hardhat не будут использоваться.

#### Получение ABI контракта счетчика <a href="#getting-the-abi-of-the-counter-contract" id="getting-the-abi-of-the-counter-contract"></a>

Для получения ABI контракта счетчика пользователю нужно:

1. Копировать массив `abi` из артефакта компиляции, расположенного в `artifacts/contracts/Counter.sol/Counter.json`.
2. Создать директорию `scripts` в корневой директории проекта.
3. Вставить ABI контракта счетчика в файл `./scripts/counter.json`.
4. Создать файл `./scripts/display-value.ts` и вставить в него следующий код:

```typescript
import { Contract, Provider, Wallet } from "zksync-web3";

// The address of the counter smart contract
const COUNTER_ADDRESS = "<COUNTER-ADDRESS>";
// The ABI of the counter smart contract
const COUNTER_ABI = require("./counter.json");

async function main() {
  // Initializing the zkSync provider
  const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const counter = new Contract(COUNTER_ADDRESS, COUNTER_ABI, l2Provider);

  console.log(`The counter value is ${(await counter.value()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Этот код довольно прямолинеен и практически эквивлентен тому, как он бы работал с `ethers`

После замены `<COUNTER-ADDRESS>` адресом развернутого контракта, запустите этот скрипт командой

```
yarn ts-node ./scripts/display-value.ts
```

Вывод должен быть следующим:

```
The counter value is 0
```

### Вызов контракта на L2 со стороны L1. <a href="#calling-an-l2-contract-from-l1" id="calling-an-l2-contract-from-l1"></a>

Теперь, давайте вызовем метод `increment` со стороны L1.

1. Создайте файл `scripts/increment-counter.ts`. В него будет помещен скрипт для взаимодействия с контрактом через L1.
2. Для взаимодействия с контрактом управления, необходим его ABI. Для вашего удобства, вы можете скопировать его [отсюда](https://github.com/matter-labs/cross-chain-tutorial/blob/main/project/scripts/governance.json). Создайте файл `scripts/governance.json` и вставьте в него ABI.
3. Вставьте следующий шаблон для скрипта:

```typescript
// Импорты и константы вставлять сюда

async function main() {
  // Логику вставлять сюда
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

&#x20; 4\.  Для взаимодействия со смарт-контрактом управления, нужны соответствущие объекты `ethers` `Contract` и провайдер Эфириум:

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

Замените `<GOVERNANCE-ADDRESS>` и `<WALLET-PRIVATE-KEY>` адресом смарт-контракта управления на L1 и приватным ключом от кошелька, который развертывал смарт контракт, соответственно.

&#x20; 5\.  Для взаимодействия с мостом zkSync, нужен его L1 адрес. Если в mainnet вы хотите установить адрес смарт-контракта zkSync как переменную окружения или как константу, то стоит отметить, что существует опция подхватывать адрес смарт-контракта динамически.

Это рекомендуемый шаг, особенно в рамках альфа тестнета, т.к. может произойти регенезис и смениться адрес.

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

&#x20; 6\.  Исполнение транзакций с L1 требует оплаты некоторой комиссии оператору L2 со стороны того, кто вызывает транзакцию.&#x20;

Во-первых, комиссия зависит от длины данных вызова и от `ergsLimit`. Если вы не знакомы с этим концептом, то это примерно то же самое, что и `gasLimit` на Эфириуме. Вы можете узнать больше о модели комиссий zkSync [здесь](https://v2-docs.zksync.io/dev/zksync-v2/fee-model.html).

Во-вторых, комиссия зависит от цены на газ, используемый во время вызова транзакции. Так, для получения прогнозируемой цены вызова, цена газа должна открыто подхватываться и использоваться.

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
**Комиссионная модель и расчет комисси находятся в разработке.**

Вы могли заметить отсутствие полей `ergs_per_pubdata` и `ergs_per_storage` в L1->L2 транзакциях. Несомненно, они важны для безопасности протокола и будут добавлены в скором времени. Пожалуйста, учтите, что это будет критическим изменением для интерфейса контрактов.

Также, на данный момент нет простого способа расчитать точное количество ergs, необходимого для исполнения L1->L2 транзакции. На момент написания этого текста транзакции могут обрабатываться даже при `ergsLimit` равном `0.` Это изменится в будущем.
{% endhint %}

&#x20; 7\.  Теперь можно вызвать контракт управления таким образом, что он перенаправляет вызов на zkSync.

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

Не забудьте заменить `<COUNTER-ADDRESS>` адресом контракта счетчика на L2.

&#x20; 8\.  Статус соответствующей транзакции на L2 также можно отследить. После добавления приоритетного запроса `NewPriorityRequest(uint64 txId, bytes32 txHash, uint64 expirationBlock, L2CanonicalTransaction transaction, bytes[] factoryDeps);` происходит событие. Тогда как `transaction` нужна оператору для проведения транзакции, `txHash` позволяет легкое отслеживание транзакции на zkSync.

`Provider` `zksync-web3` имеет метод, который задаёт объект L1 `ethers.TransactionResponse` транзакции, который вызывает мост zkSync, возвращает объект `TransactionResponse`, который может комфортно ожидать обработки транзакции на L2.

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

#### Полный код <a href="#complete-code" id="complete-code"></a>

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

Вы можете запустить скрипт следующей командой:

```
yarn ts-node ./scripts/increment-counter.ts
```

В вывове вы должны увидеть хэш транзакции на L2.

&#x20; 9\.  Теперь вы можете удостовериться, что транзакция была успешно проведена путем повторного запуска скрипта `display-value`:

```
yarn ts-node ./scripts/display-value.ts
```

Вывод должен быть таким:

```
The counter value is 1
```

### Полный проект <a href="#complete-project" id="complete-project"></a>

Вы можете скачать полный проект [тут](https://github.com/matter-labs/cross-chain-tutorial).

### Узнать больше <a href="#learn-more" id="learn-more"></a>

* Больше о взаимодействии L1->L2 на zkSync в этой [документации](https://v2-docs.zksync.io/dev/guide/l1-l2.html).
* Узнать больше о `zksync-web3` SDK в этой [документации.](https://v2-docs.zksync.io/api/js)
* Узнать больше о плагинах hardhat zkSync в этой [документации.](https://v2-docs.zksync.io/api/hardhat)
