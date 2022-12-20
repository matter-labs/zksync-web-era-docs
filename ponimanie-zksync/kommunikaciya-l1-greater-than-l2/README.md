# Коммуникация L1 -> L2

Этот раздел описывает интерфейс взаимодействия с zkSync со стороны L1. Предполагается, что вы уже знакомы с базовыми концепциями работы с приоритетной очередью. Если это вам в новинку, то вы можете ознакомиться с концептуальным введением [тут](broken-reference). Если вы хотите погрузиться сразу в код, тогда можете прочесть [руководство ](broken-reference)по кросс-чейн управлению (cross-chain governance).

### Структура <a href="#structure" id="structure"></a>

Для предотвращения множественных "тяжелых" запросов от пользователей к оператору пользователи должны предоставить комиссию в ETH для платы оператору zkSync. У каждой транзакции есть _базовая строимость_ в газе и _чаевые оператору L2 (layer 2 tip),_ которые равны базовой стоимости запрошенной транзакции и вычитается из значения ETH, переданного вместе с вызовом.

Базовая стоимость определяется в газе, а не в ETH, так что актуальное количество эфира для отправляемой транзакции зависит от цены на газ этой транзакции. Обычный порядок исполнения при вызове любого из этих методов будет следующим:

1. Получить цену газа, которую вы будете использовать во время вызова транзакции
2. Получить базовую стоимость транзакции
3. Вызвать транзакцию, при этомпередавая требуемое значение `value` вместе с вызовом.

### Использование интерфейса контракта в вашем проекте <a href="#using-contract-interface-in-your-project" id="using-contract-interface-in-your-project"></a>

Для взаимодействия с контрактом zkSync с помощью Solidity, вам нужно использовать интерфейс контракта zkSync. Есть 2 основных способа его получить:

* Импортировав его из npm пакета `@matterlabs/zksync-contracts` (предпочтительно)
* Скачав контракты из [репозитория](https://github.com/matter-labs/v2-testnet-contracts)

Пакет `@matterlabs/zksync-contracts` устанавливается с помощью следующей команды:

```
yarn add -D @matterlabs/zksync-contracts
```

В примерах далее мы подразумеваем, что доступ к интерфейсу происходит через npm пакет `@matterlabs/zksync-contracts`.

#### Получение базовой стоимости <a href="#getting-the-base-cost" id="getting-the-base-cost"></a>

Данная функция view возвращает количество ETH, необходимое для оплаты пользователем покрытия базовой стоимости транзакции

```solidity
function l2TransactionBaseCost(
    uint256 _gasPrice,
    uint256 _ergsLimit,
    uint32 _calldataLength
) external view returns (uint256);
```

* `_gasPrice` - параметр, включающий в себя цену газа.
* `_ergsLimit` - параметр, включающий себя лимит ergs за вызов транзакции. Вы можете узнать больше про egrs и систему комиссий zkSync [здесь](broken-reference).
* `_calldataLength` - параметр, включающий в себя размер(длину) данных в байтах.

#### Интерфейс <a href="#interface" id="interface"></a>

Данная функция возвращает канонический хэш или запрашиваемую транзакцию, которая может использоваться для отслеживания исполнения данной транзакции на L2.

```solidity
function requestL2Transaction(
    address _contractAddressL2,
    uint256 _l2Value,
    bytes calldata _calldata,
    uint256 _ergsLimit,
    bytes[] calldata _factoryDeps
) external payable returns (bytes32 txHash);
```

* `_contractAddressL2` - параметр определяет адрес вызываемого контракта.
* `_l2Value` - параметр определяет количество ETH, которое вы хотите передать на L2 вместе с вызовом. Это число будет использоваться как `msg.value` для транзакции.
* `_calldata` - параметр включает в себя данные вызова транзакции. Она может быть закодирована тем же образом, как и на Эфириуме.
* `_ergsLimit` - параметр включает в себя лимит ergs для вызываемой транзакции. Вы можете узнать больше об ergs и систему комиссий zkSync [тут](broken-reference).
* `_factoryDeps` - это лист байт-кодов. Он должен включать в себя байт-код развертываемого контракта, т.е. он может разверытвать другие контракты. Массив также должен содержать байт-коды контрактов, которые могут быть развернуты им.

С вызовом данного метода должно быть передано некоторое количество ETH для покрытия базовой стоимости транзакции (включая `_l2Value`) + чаевые для оператора L2.

{% hint style="success" %}
**СОВЕТ**

**Успешное** сообщение L1 -> L2 производит `L2Log c key = l2TxHash` и `value = bytes32(1)`, тогда как **неуспешное** сообщение L1 -> L2 производит `L2Log c key = l2TxHash` и `value = bytes32(0)`
{% endhint %}

#### Примеры: <a href="#examples" id="examples"></a>

**Solidity**

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Импорт интерфейса контракта zkSync
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";
// Импорт контракта `Operations` который имеет тип `QueueType`
import "@matterlabs/zksync-contracts/l1/contracts/zksync/Operations.sol";

contract Example {
    function callZkSync(
        // Адрес смарт-контракта zkSync
        // Не рекомендуется его твердо прописывать в период альфа-тестнета, т.к. может быть регенезис
        address _zkSyncAddress
    ) external payable returns(bytes32 txHash) {
        IZkSync zksync = IZkSync(_zkSyncAddress);
        address someL2Contract = 0xdba0833e8c4b37cecc177a665e9207962e337299;
        // Вызов смарт-контракта на L2 со стороны контракта-образца на L1
        txHash = zksync.requestL2Transaction{value: msg.value}(
            // Адрес контракта для вызова на L2
            someL2Contract,
            // Мы не передаем ETH с вызовом
            0,
            // Кодируем calldata для исполнения
            abi.encodeWithSignature("someMethod()"),
            // Ergs limit
            10000,
            // factory dependencies (зависимости фабрики)
            new bytes[](0)
        );
    }
}
```

**`zksync-web3`**

```typescript
import { Wallet, Provider } from "zksync-web3";
import { ethers, BigNumber } from "ethers";

const TEST_PRIVATE_KEY = "";

const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(TEST_PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

// Calldata можно кодировать так же как в Эфириум
const calldata = "0x...";
const ergsLimit = BigNumber.from(1000);

const txCostPrice = await wallet.getBaseCost({
  gasPrice,
  calldataLength: ethers.utils.hexDataLength(calldata),
  ergsLimit,
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

// инициация трансфера на L2 через L1 execute из кошелька zkSync
const someL2Contract = "0x19a5bfcbe15f98aa073b9f81b58466521479df8d";
const executeTx = await wallet.requestExecute({
  calldata,
  ergsLimit,
  contractAddress: someL2Contract,
  overrides: {
    gasPrice,
  },
});

await executeTx.wait();
```
