# Известные проблемы

zkSync 2.0 в данным момент находится в альфа-стадии, так что некоторые привычные вам вещи могут не работать. Пожалуйста, держите в уме то, что система все еще находится в процессе разработки.

### Почему не работают нативные взаимодействия со смарт-контрактами через Metamask? <a href="#why-are-metamask-native-contract-interactions-not-working" id="why-are-metamask-native-contract-interactions-not-working"></a>

На данный момент невозможно взаимодействовать со смарт-контрактами zkSync через Metamask путем транзакций типа EIL-1559. zkSync не поддерживает транзакции типа EIP-1559.

**Решение**. Открыто укажие `{ type: 0 }` в переопределениях транзакции, чтобы использовать legacy-транзакции Ethereum.

### Почему в моем кошельке нет средств и мой контракт исчез? <a href="#why-does-my-wallet-have-no-funds-and-my-contract-disappears" id="why-does-my-wallet-have-no-funds-and-my-contract-disappears"></a>

Ожидается, что мы будем регулярно обновлять наш тестнет, так что время от времени нам нужно будет производить регенезис. Это приведет к сбросу всего состояния сети, и все развернутые контракты будут удалены.

**Мы сообщаем о событиях регенезиса заблаговременно!**

### Почему `wait()` зависает для транзакций L1->L2? <a href="#why-does-wait-get-stuck-for-l1-l2-transactions" id="why-does-wait-get-stuck-for-l1-l2-transactions"></a>

Если `wait()` занимает больше ожидаемого времени, то наиболее вероятно, что транзакция провалилась.

### Почему появляется ошибка компиляции `unexpected end of JSON input` ? <a href="#why-is-there-an-unexpected-end-of-json-input-compilation-error" id="why-is-there-an-unexpected-end-of-json-input-compilation-error"></a>

Данная ошибка обычно появляется при компиляции кодовой базы массивного смарт-контракта.

Если вы встретили такую ошибку, пожалуйста, сделайте следующее:

* Обновите библиотеку `@matterlabs/hardhat-zksync-solc` и попробуйте снова скомпилировать контракт.
* Если после повторной компиляции вы получаете ошибку `Library not found`, то вам нужно следовать [инструкциям отсюда](https://v2-docs.zksync.io/api/hardhat/compiling-libraries.html).
* Если проблема сохраняется, сообщите о ней нашей команде. Мы сделаем все возможное, чтобы помочь вам.

### Почему я не могу использовать опкоды CREATE/CREATE2 через необработанный байткод? <a href="#why-can-t-i-use-create-create2-opcodes-with-raw-bytecode" id="why-can-t-i-use-create-create2-opcodes-with-raw-bytecode"></a>

zkSync не поддерживает использование CREATE/CREATE2 через необработанный байткод. Мы крайне рекомендуем использовать `new` оператор для избежания проблем.

### Почему не работает Hardhat'овский `console.log`? <a href="#why-is-hardhat-s-console-log-not-working" id="why-is-hardhat-s-console-log-not-working"></a>

zkSync не поддерживает контракт `console.log` от Nomic Foundation. Из-за разных правил извлечения адреса, даже уже развернутого, библиотека `console.log` вероятно будет иметь другой адрес, отличный от аналогичного на Ethereum.
