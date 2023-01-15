# Начало

### Концепт <a href="#concept" id="concept"></a>

Тогда как большинство существующих SDK могут работать "из коробки", развертывание же смарт-контрактов или использование уникальных функций zkSync (таких как оплата комиссий в других токенах) требует прописывания дополнительных полей (параметров) для транзакций, в то время как аналогичные транзакции на Ethereum имеют эти поля по умолчанию.

Для предоставления легкого доступа ко всем фичам zkSync 2.0 был создан `zksync-web3` JavaScript SDK, спроектированный таким образом, что его интерфейс очень похож на интерфейс [ethers](https://docs.ethers.io/v5/). По факту, `ethers` - это одна из зависимостей (peer dependency) нашей библиотеки, и большинство объектов, экспортируемых пакетом `zksync-web3` (e.g. `Wallet`, `Provider` etc.) наследуют соответствующие объекты `ethers` и переопределяют только те поля, которые необходимо изменить.

Библиотека собрана таким образом, что после замены `ethers` на `zksync-web3` большинство клиентских приложений будет работать "их коробки".

### Добавление зависимостей <a href="#adding-dependencies" id="adding-dependencies"></a>

```shell
yarn add zksync-web3
yarn add ethers@5 # ethers является зависимостью zksync-web3
```

Затем вы можете импортировать все содержимое библитек `ethers` и `zksync-web3` с помощью следующего утверждения:

```typescript
import * as zksync from "zksync-web3";
import * as ethers from "ethers";
```

### Подключение к zkSync <a href="#connecting-to-zksync" id="connecting-to-zksync"></a>

Для взаимодействия с сетью zkSync пользователю необходимо знать конечную точку оператора узла (node endpoint).

```typescript
// На данный момент поддерживается только одно окружение (environment)
const syncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
```

**Примечание:** На данный момент поддерживается только сеть `goerli`

Некоторым операторам необходим доступ к сети Ethereum. Для взаимодействия с Ethereum следует использовать библиотеку `ethers`.

```typescript
const ethProvider = ethers.getDefaultProvider("goerli");
```

### Создание кошелька <a href="#creating-a-wallet" id="creating-a-wallet"></a>

Для управления вашим аккаунтом zkSync используйте объект `zksync.Wallet`. Он может подписывать транзакции с помощью ключей, хранимых в `ethers.Wallet` и отправлять транзакции в сеть zkSync, используя `zksync.Provider`.

```typescript
// Derive zksync.Wallet from ethereum private key.
// zkSync's wallets support all of the methods of ethers' wallets.
// Also, both providers are optional and can be connected to later via `connect` and `connectToL1`.
const syncWallet = new zksync.Wallet(PRIVATE_KEY, syncProvider, ethProvider);
```

### Внесение средств <a href="#depositing-funds" id="depositing-funds"></a>

Давайте внесем `1.0 ETH` на ваш аккаунт zkSync.

```typescript
const deposit = await syncWallet.deposit({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("1.0"),
});
```

**ВНИМАНИЕ:** Каждый токен внутри zkSync имеет свой адрес. Если переносятся через мост токены ERC-20, то вам следует указать адрес токена на L1 в функции `deposit`, либо нулевой адрес (`0x0000000000000000000000000000000000000000`) если вы депонируете ETH. Учтите, что адрес ERC-20 токена на zkSync будет отличаться от его адреса на L1 Ethereum.

После того, как транзакция отправлена на узел Ethereum, ее статус можно отследить, используя название транзакции:

```typescript
// Await processing of the deposit on L1
const ethereumTxReceipt = await deposit.waitL1Commit();

// Await processing the deposit on zkSync
const depositReceipt = await deposit.wait();
```

### Проверка баланса аккаунта zkSync <a href="#checking-zksync-account-balance" id="checking-zksync-account-balance"></a>

```typescript
// Retreiving the current (committed) balance of an account
const committedEthBalance = await syncWallet.getBalance(zksync.utils.ETH_ADDRESS);

// Retrieving the balance of an account in the last finalized block zkSync.md#confirmations-and-finality
const finalizedEthBalance = await syncWallet.getBalance(ETH_ADDRESS, "finalized");
```

Вы можете узнать больше об отправленных и финализированных блоках [тут](broken-reference).

### Выполнение перевода <a href="#performing-a-transfer" id="performing-a-transfer"></a>

Теперь давайте создадим второй кошелек и отправим немного средств на него. Учтите, что возможна отправка средств на любой новый аккаунт Ethereum, без предварительной регистрации!

```typescript
const syncWallet2 = new zksync.Wallet(PRIVATE_KEY2, syncProvider, ethProvider);
```

Давайте переведем `1 ETH` на другой аккаунт:

Метод `transfer` - это метод-помощник, который позволяет отправлять ETH или любой другой ERC20 токен в рамках одного интерфейса.

```typescript
const amount = ethers.utils.parseEther("1.0");

const transfer = await syncWallet.transfer({
  to: syncWallet2.address,
  token: zksync.utils.ETH_ADDRESS,
  amount,
});
```

Для отслеживания статуса транзакции:

```typescript
// Await commitment
const transferReceipt = await transfer.wait();

// Await finalization on L1
const transferReceipt = await transfer.waitFinalize();
```

### Вывод средств <a href="#withdrawing-funds" id="withdrawing-funds"></a>

Существует 2 способа вывода средств с zkSync на Ethereum: вызов операции через L2 или через L1. Если операция вывода вызывается через L1, то у оператора есть период времени, за который ой должен провести транзакцию, иначе включается `PriorityMode`. Это защищает от остановки транзакций со стороны оператора. В большинстве же случаев вызова с L2 вполне достаточно.

```typescript
const withdrawL2 = await syncWallet.withdraw({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("0.5"),
});
```

Средства будут выведены в целевой кошелек после генерации и подтвеждения доказательства верности (validity proof) для блока zkSync с этой транзакцией mainnet-контраком.

Возможно ожидание, пока подтвердится доказательство верности:

```typescript
await withdrawL2.waitFinalize();
```

### Развертывание контракта <a href="#deploying-a-contract" id="deploying-a-contract"></a>

Гайд по развертыванию смарт-контрактов с использованием нашего плагина hardhat доступен [тут](https://v2-docs.zksync.io/api/hardhat).

### Добавление токенов в мост по умолчанию. <a href="#adding-tokens-to-the-standard-bridge" id="adding-tokens-to-the-standard-bridge"></a>

Добавление токенов в мост zkSync по умолчанию может быть выполнено способом, не требующем разрешения. После добавления токена в zkSync, он может быть использован во всех типах транзакций.

Документацию по добавлению токенов в zkSync можно найти [здесь](https://v2-docs.zksync.io/api/js/accounts-l1-l2.html#adding-native-token-to-zksync).
