# Абстракция аккаунта

Теперь давайте научимся реализовывать кастомные аккаунты и взаимодействовать напрямую с системным контрактом [ContractDeployer](../../readme/ponimanie-zksync-2.0/ponimanie-sistemnykh-kontraktov.md#contractdeployer).

В этом руководстве мы создадим фабрику (factory), которая развертывает аккаунты с мультиподписью типа "2-из-2ух".

### Подготовка <a href="#preliminaries" id="preliminaries"></a>

Прежде чем углубиться в данное руководство, крайне рекомендуется прочитать о [дизайне](../../readme/ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md) протокола абстракции аккаунта.

Предполагается, что вы уже знакомы с развертыванием контрактов на zkSync. Если нет, пожалуйста обратитесь к первому разделу руководства [Hello World](../../readme/rukovodstvo-razrabotchika/rukovodstvo-hello-world.md). Также рекомендуется прочесть [введение ](../../readme/ponimanie-zksync-2.0/ponimanie-sistemnykh-kontraktov.md)в системные контракты.

### Установка зависимостей <a href="#installing-dependencies" id="installing-dependencies"></a>

Мы будет использоваться hardhat плагин zkSync для разработки этого контракта. Во-первых, нам нужно установить все зависимости для него:

```
mkdir custom-aa-tutorial
cd custom-aa-tutorial
yarn init -y
yarn add -D typescript ts-node ethers zksync-web3 hardhat @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Так как мы работаем с контрактами zkSync, нам также нужно установить пакет с контрактами и необходимые зависимости:

```
yarn add @matterlabs/zksync-contracts @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

Также создайте файл конфигурации `hardhat.config.ts` и директории `contracts` и `deploy` как в руководстве [Hello World](../../readme/rukovodstvo-razrabotchika/rukovodstvo-hello-world.md).

### Абстракция аккаунта <a href="#account-abstraction" id="account-abstraction"></a>

Каждый аккаунт должен реализовывать интерфейс [IAccount](https://github.com/matter-labs/v2-testnet-contracts/blob/07e05084cdbc907387c873c2a2bd3427fe4fe6ad/l2/system-contracts/interfaces/IAccount.sol#L7). Так как мы делаем аккаунт с подписантами, нам также нужно реализовать [EIP1271](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/83277ff916ac4f58fec072b8f28a252c1245c2f1/contracts/interfaces/IERC1271.sol#L12).

Скелет контракта будет выглядеть следующим образом:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol';

import "@openzeppelin/contracts/interfaces/IERC1271.sol";

contract TwoUserMultisig is IAccount, IERC1271 {

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continure execution if called from the bootloader.
        _;
    }

    function validateTransaction(bytes32, bytes32 _suggestedSignedHash, Transaction calldata _transaction) external payable override onlyBootloader {
        _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(bytes32 _suggestedSignedHash, Transaction calldata _transaction) internal {

    }

    function executeTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
        _executeTransaction(_transaction);
	  }

    function _executeTransaction(Transaction calldata _transaction) internal {

    }

    function executeTransactionFromOutside(Transaction calldata _transaction) external payable {
        _validateTransaction(_transaction);
        _executeTransaction(_transaction);
    }

	  bytes4 constant EIP1271_SUCCESS_RETURN_VALUE = 0x1626ba7e;

    function isValidSignature(bytes32 _hash, bytes calldata _signature) public override view returns (bytes4) {
        return EIP1271_SUCCESS_RETURN_VALUE;
    }

    function payForTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {

    }

    function prePaymaster(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {

    }

	  receive() external payable {
        // If the bootloader called the `receive` function, it likely means
        // that something went wrong and the transaction should be aborted. The bootloader should
        // only interact through the `validateTransaction`/`executeTransaction` methods.
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
    }
}
```

Учтите, что только [bootloader](../../readme/ponimanie-zksync-2.0/ponimanie-sistemnykh-kontraktov.md#bootloader) должен быть допущен к вызову методов `validateTransaction`/`executeTransaction`/`payForTransaction`/`prePaymaster`. Поэтому для них используется модификатор `onlyBootloader` .

Метод `executeTransactionFromOutside` нужен для доступа внешним пользователям к инициации транзакции с данного аккаунта. Наиболее легкий способ реализовать его - сделать тоже самое, что бы сделали `validateTransaction` + `executeTransaction` .

#### Валидация подписи <a href="#signature-validation" id="signature-validation"></a>

Во-первых, нам нужно реализовать процесс валидации подписи. Так как мы создаем мультиподпись из двух аккаунтов, давайте передадим адреса его владельцев в конструктор. В этом руководстве мы используем библиотеку ECDSA от OpenZeppelin для валидации подписи.

Добавьте следующий импорт:

```solidity
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
```

Также добавьте конструктор в контракт:

```solidity
address public owner1;
address public owner2;

constructor(address _owner1, address _owner2) {
    owner1 = _owner1;
    owner2 = _owner2;
}
```

Затем мы можем реализовать метод `isValidSignature` следующим образом:

```solidity
function isValidSignature(bytes32 _hash, bytes calldata _signature) public override view returns (bytes4) {
    // The signature is the concatenation of the ECDSA signatures of the owners
    // Each ECDSA signature is 65 bytes long. That means that the combined signature is 130 bytes long.
    require(_signature.length == 130, 'Signature length is incorrect');

    address recoveredAddr1 = ECDSA.recover(_hash, _signature[0:65]);
    address recoveredAddr2 = ECDSA.recover(_hash, _signature[65:130]);

    require(recoveredAddr1 == owner1);
    require(recoveredAddr2 == owner2);

    return EIP1271_SUCCESS_RETURN_VALUE;
}
```

#### Валидация транзакции <a href="#transaction-validation" id="transaction-validation"></a>

Давайте реализуем процесс валидации. Он отвечает за валидацию подписи транзакции и увеличение значения nonce. Заметьте, что есть некоторые ограничения в том, что этому методу позволено выполнять. Вы можете подробнее узнать о них [тут](../../readme/ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#limitations-of-the-verification-step).

Для увеличения nonce нужно использовать метод `incrementNonceIfEquals` системного контракта `NONCE_HOLDER_SYSTEM_CONTRACT` . Он берет Nonce транзакции и проверяет, совпадает ли текущий nonce с предоставленным. Если нет, то транзакция отменяется. В ином случае, nonce увеличивается.

Хоть и требования выше позволяют аккаунтам изменять только свои слоты хранилища, доступ к вашему nonce в `NONCE_HOLDER_SYSTEM_CONTRACT` - это [разрешенный](../../readme/ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#extending-the-set-of-slots-that-belong-to-a-user) случай, так как он ведет себя так же, как ваше хранилище, но просто случилось так, что он находится в другом контракте. Для вызова `NONCE_HOLDER_SYSTEM_CONTRACT` вам нужно добавить следующий импорт:

```solidity
import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
```

Библиотека `TransactionHelper` (уже импортированная в примере выше) может использоваться для получения хэша транзакции, которую нужно подписать. Вы также можете реализовать свою собственную схему подписи и использовать иное обязательство (commitment) для подписи транзакции, но в этом примере мы используем хэш, предоставленный этой библиотекой.

Использование библиотеки `TransactionHelper` :

```solidity
using TransactionHelper for Transaction;
```

Также обратите внимание, что поскольку `non-view` методы контракта `NONCE_HOLDER_SYSTEM_CONTRACT`, должны вызываться при включенном параметре `isSystem`, нужно использовать метод [systemCall](https://github.com/matter-labs/v2-testnet-contracts/blob/a3cd3c557208f2cd18e12c41840c5d3728d7f71b/l2/system-contracts/SystemContractsCaller.sol#L55) библиотеки `SystemContractsCaller,` поэтому данную библиотеку также необходимо импортировать:

```solidity
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';
```

Теперь мы можем реализовать метод `_validateTransaction` :

```solidity
function _validateTransaction(bytes32 _suggestedSignedHash, Transaction calldata _transaction) internal {
    // Incrementing the nonce of the account.
    // Note, that reserved[0] by convention is currently equal to the nonce passed in the transaction
    SystemContractsCaller.systemCall(
        uint32(gasleft()),
        address(NONCE_HOLDER_SYSTEM_CONTRACT),
        0,
        abi.encodeCall(INonceHolder.incrementMinNonceIfEquals, (_transaction.reserved[0]))
    );

    bytes32 txHash;
    // While the suggested signed hash is usually provided, it is generally
    // not recommended to rely on it to be present, since in the future
    // there may be tx types with no suggested signed hash.
    if(_suggestedSignedHash == bytes32(0)) {
        txHash = _transaction.encodeHash();
    } else {
        txHash = _suggestedSignedHash;
    }

    require(isValidSignature(txHash, _transaction.signature) == EIP1271_SUCCESS_RETURN_VALUE);
}
```

#### Оплата комиссий за транзакцию <a href="#paying-fees-for-the-transaction" id="paying-fees-for-the-transaction"></a>

Теперь нам нужно реализовать метод `payForTransaction` . Библиотека `TransactionHelper`уже предоставляет нам метод `payToTheBootloader` , который отправляет`_transaction.maxFeePerErg * _transaction.ergsLimit` ETH в пользу bootloader. Таким образом, реализация относительно прямолинейна:

```solidity
function payForTransaction(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
		bool success = _transaction.payToTheBootloader();
		require(success, "Failed to pay the fee to the operator");
}
```

#### Реализация `prePaymaster` <a href="#implementing-prepaymaster" id="implementing-prepaymaster"></a>

Тогда как обычно протокол абстракции аккаунта позволяет исполнять произвольные действия при взаимодействии с paymaster'ами, есть несколько [общих паттернов](../../readme/ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#built-in-paymaster-flows) со встроенной поддержкой из EOA-аккаунтов. Если только вы не хотите реализовать или запретить некоторые специфические возможные действия для вашего аккаунта, лучше держать его в соответствии с EOA. Библиотека `TransactionHelper` предоставляет метод `processPaymasterInput` , который делает именно это: проходит шаг `prePaymaster` так же, как и EOA.

```solidity
function prePaymaster(bytes32, bytes32, Transaction calldata _transaction) external payable override onlyBootloader {
    _transaction.processPaymasterInput();
}
```

#### Исполнение транзакции <a href="#transaction-execution" id="transaction-execution"></a>

Самая базовая реализация исполнения транзакции довольно проста:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    uint256 to = _transaction.to;
    // By convention, the `reserved[1]` field is msg.value
    uint256 value = _transaction.reserved[1];
    bytes memory data = _transaction.data;

    bool success;
    assembly {
        success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
    }

    // Needed for the transaction to be correctly processed by the server.
    require(success);
}
```

Однако обратите внимание, что вызов ContractDeployer возможен только с вызовом параметра `isSystem`. Чтобы разрешить своим пользователям развертывать контракты, вы должны сделать это следующем образом:

```solidity
function _executeTransaction(Transaction calldata _transaction) internal {
    address to = address(uint160(_transaction.to));
    uint256 value = _transaction.reserved[1];
    bytes memory data = _transaction.data;

    if(to == address(DEPLOYER_SYSTEM_CONTRACT)) {
        // We allow calling ContractDeployer with any calldata
        SystemContractsCaller.systemCall(
            uint32(gasleft()),
            to,
            uint128(_transaction.reserved[1]), // By convention, reserved[1] is `value`
            _transaction.data
        );
    } else {
        bool success;
        assembly {
            success := call(gas(), to, value, add(data, 0x20), mload(data), 0, 0)
        }
        require(success);
    }
}
```

Стоит отметить то, сочтет ли оператор транзакцию успешной зависит только от того, был ли вызов `executeTransactions` успешным. Так что, крайне рекомендуется использовать `require(success)` для транзакции, чтобы пользователи получали наилучший опыт.

#### Полный код аккаунта <a href="#full-code-of-the-account" id="full-code-of-the-account"></a>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol";

import "@openzeppelin/contracts/interfaces/IERC1271.sol";

// Used for signature validation
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// Access zkSync system contracts, in this case for nonce validation vs NONCE_HOLDER_SYSTEM_CONTRACT
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";
// to call non-view method of system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol";

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
        // Continure execution if called from the bootloader.
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
    ) external payable override onlyBootloader {
        _validateTransaction(_suggestedSignedHash, _transaction);
    }

    function _validateTransaction(
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) internal {
        // Incrementing the nonce of the account.
        // Note, that reserved[0] by convention is currently equal to the nonce passed in the transaction
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
        // While the suggested signed hash is usually provided, it is generally
        // not recommended to rely on it to be present, since in the future
        // there may be tx types with no suggested signed hash.
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

        if (to == address(DEPLOYER_SYSTEM_CONTRACT)) {
            // We allow calling ContractDeployer with any calldata
            SystemContractsCaller.systemCall(
                uint32(gasleft()),
                to,
                uint128(_transaction.reserved[1]), // By convention, reserved[1] is `value`
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
        // The signature is the concatenation of the ECDSA signatures of the owners
        // Each ECDSA signature is 65 bytes long. That means that the combined signature is 130 bytes long.
        require(_signature.length == 130, "Signature length is incorrect");

        address recoveredAddr1 = ECDSA.recover(_hash, _signature[0:65]);
        address recoveredAddr2 = ECDSA.recover(_hash, _signature[65:130]);

        require(recoveredAddr1 == owner1);
        require(recoveredAddr2 == owner2);

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
        // If the bootloader called the `receive` function, it likely means
        // that something went wrong and the transaction should be aborted. The bootloader should
        // only interact through the `validateTransaction`/`executeTransaction` methods.
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
    }
}


```

### Фабрика (factory) <a href="#the-factory" id="the-factory"></a>

Теперь давайте создадим фабрику, которая может развертывать такие аккаунты. Заметьте, что если вы хотите развернуть АА (абстрагированный аккаунт), то нужно взаимодействовать напрямую с `DEPLOYER_SYSTEM_CONTRACT`. Для детерминированных адресов, мы будет использовать метод `create2Account`.

Код будет выглядеть так:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';

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
        bytes memory returnData = SystemContractsCaller.systemCall(
            uint32(gasleft()),
            address(DEPLOYER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(
                DEPLOYER_SYSTEM_CONTRACT.create2Account,
                (salt, aaBytecodeHash, abi.encode(owner1, owner2))
            )
        );

        (accountAddress, ) = abi.decode(returnData, (address, bytes));
    }
}
```

Отметим, что на zkSync развертывание происходит не через байт-код, а через хэш байт-кода. Сам байт-код передается оператору через поле `factoryDeps` . Учтите, что`_aaBytecodeHash` должен быть сформирован особым образом:

* Во-первых, он хешируется в виде sha256.
* Затем, первые два байта заменяются длиной байт-кода в 32-байтовых словах.

Вам не нужно об этом беспокоиться, наш SDK предоставляет встроенный метод для этого, объясним далее.

### Развертывание фабрики <a href="#deploying-the-factory" id="deploying-the-factory"></a>

Для развертывания фабрики там нужно создать скрипт развертывания. Создайте директорию `deploy` и создайте в нем один файл: `deploy-factory.ts`. Вставьте в него следующий скрипт развертывания:

```typescript
import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet("<PRIVATE-KEY>");
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact("AAFactory");
  const aaArtifact = await deployer.loadArtifact("TwoUserMultisig");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // You can remove the depositing step if the `wallet` has enough funds on zkSync
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  await depositHandle.wait();

  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  const factory = await deployer.deploy(factoryArtifact, [bytecodeHash], undefined, [
    // Since the factory requires the code of the multisig to be available,
    // we should pass it here as well.
    aaArtifact.bytecode,
  ]);

  console.log(`AA factory address: ${factory.address}`);
}
```

Чтобы развернуть фабрику, вам нужно скомпилировать контракты и запустить скрипт:

```
yarn hardhat compile
yarn hardhat deploy-zksync --script deploy-factory.ts
```

Вывод должен быть примерно таким:

```
AA factory address: 0x9db333Cb68Fb6D317E3E415269a5b9bE7c72627Ds
```

Отметим, что адрес будет разным после каждого исполнения.

### Работа с аккаунтами <a href="#working-with-accounts" id="working-with-accounts"></a>

#### Развертывание аккаунта <a href="#working-with-accounts" id="working-with-accounts"></a>

Теперь давайте развернем аккаунт и инициируем новую транзакцию с него. В этом разделе мы предполагаем, что у вас уже есть ЕОА-аккаунт на zkSync с достаточным количеством средств.

В директории `deploy` создайте файл `deploy-multisig.ts`, в который мы поместим скрипт.

Сначала давайте развернем АА. По факту, это будет вызов функции `deployAccount` :

```solidity
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "<YOUR_FACTORY_ADDRESS>";

// An example of a deploy script deploys and calls a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet = new Wallet("<PRIVATE-KEY>").connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  const aaFactory = new ethers.Contract(AA_FACTORY_ADDRESS, factoryArtifact.abi, wallet);

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(salt, owner1.address, owner2.address);
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );
  console.log(`Deployed on address ${multisigAddress}`);
}
```

_Заметьте, что правила извлечения адреса на zkSync отличаются от Эфириума._ Вам всегда нужно использовать утилитарные методы `createAddress` и `create2Address` из `zksync-web3` SDK.

#### Инициация транзакции с этого аккаунта <a href="#starting-a-transaction-from-this-account" id="starting-a-transaction-from-this-account"></a>

Прежде чем развернутый аккаунт сможет отправлять какие-либо транзакции, его нужно пополнить:

```typescript
await(
  await wallet.sendTransaction({
    to: multisigAddress,
    // You can increase the amount of ETH sent to the multisig
    value: ethers.utils.parseEther("0.003"),
  })
).wait();
```

Теперь, как пример, давайте попробуем развернуть новый аккаунт с мультиподписью (мультисиг), но инициатором транзакции будет наш уже развернутый аккаунт из предыдущей части:

```ts
let aaTx = await aaFactory.populateTransaction.deployAccount(salt, Wallet.createRandom().address, Wallet.createRandom().address);
```

Затем нам нужно заполнить все поля транзакции:

```typescript
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
    // Note, that we are using the `DEFAULT_ERGS_PER_PUBDATA_LIMIT`
    ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
  } as types.Eip712Meta,
  value: ethers.BigNumber.from(0),
};
```

{% hint style="success" %}
**Заметка по `gasLimit`**

На данный момент мы ожидаем, что `gasLimit` должен покрывать и шаг верификации, и шаг исполнения. Сейчас число ergs, возвращаемое функцией `estimateGas` равно `execution_ergs + 20000`, где `20000` примерно равны накладным расходам defaultAA, необходимым для взимания комиссии и проверки подписи. В случае, если ваш АА имеет очень дорогой шаг верификации, вам стоит добавит константу в `gasLimit`.
{% endhint %}

Затем нам нужно подписать транзакцию и предоставить `aaParamas` в `customData` транзакции:

```typescript
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

Теперь мы готовы к отправке транзакции:

```typescript
console.log(`The multisig's nonce before the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
await sentTx.wait();

// Checking that the nonce for the account has increased
console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
```

#### Полный пример <a href="#full-example" id="full-example"></a>

```typescript
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "<YOUR_FACTORY_ADDRESS>";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet = new Wallet("<YOUR_PRIVATE_KEY>").connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  const aaFactory = new ethers.Contract(AA_FACTORY_ADDRESS, factoryArtifact.abi, wallet);

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  const tx = await aaFactory.deployAccount(salt, owner1.address, owner2.address);
  await tx.wait();

  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );
  console.log(`Multisig deployed on address ${multisigAddress}`);

  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.001"),
    })
  ).wait();

  let aaTx = await aaFactory.populateTransaction.deployAccount(salt, Wallet.createRandom().address, Wallet.createRandom().address);

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
      ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
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

  console.log(`The multisig's nonce before the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  await sentTx.wait();

  // Checking that the nonce for the account has increased
  console.log(`The multisig's nonce after the first tx is ${await provider.getTransactionCount(multisigAddress)}`);
}
```

Для запуска скрипта используйте следующую команду:

```
yarn hardhat deploy-zksync --script deploy-multisig.ts
```

Вывод должен быть примерно следующим:

```
Multisig deployed on address 0xCEBc59558938bccb43A6C94769F87bBdb770E956
The multisig's nonce before the first tx is 0
The multisig's nonce after the first tx is 1
```

{% hint style="success" %}
**СОВЕТ**

Если вы получаете ошибку `Not enough balance to cover the fee,` попробуйте увеличить количество ETH, отправляемого на multisig кошелек, чтобы на нем было достаточно средств для оплаты комиссии за транзакцию.
{% endhint %}

### Полный проект <a href="#complete-project" id="complete-project"></a>

Вы можете скачать полный проект [тут.](https://github.com/matter-labs/custom-aa-tutorial)

### Узнать больше <a href="#learn-more" id="learn-more"></a>

* Узнать больше о коммуникации L1-> L2 на zkSync можно на этой [странице документации](../../readme/ponimanie-zksync-2.0/vzaimodeistvie-l1-l2.md#l1-l2-communication).
* Узнать больше о `zksync-web3` SDK можно на этой странице [документации](https://v2-docs.zksync.io/api/js).
* Узнать больше о hardhat плагинах zkSync можно на этой странице [документации](https://v2-docs.zksync.io/api/hardhat).
