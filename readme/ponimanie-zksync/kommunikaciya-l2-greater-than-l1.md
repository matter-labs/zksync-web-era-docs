# Коммуникация L2 -> L1

Этот раздел описывает интерфейс взаимодействия с Эфириумом со стороны L2. Подразумевается, что вы уже знакомы с базовыми концептами работы с коммуникацией      L2 -> L1. Если это для вас в новинку, то вы можете ознакомиться с концептуальным введением [тут](../ponimanie-zksync-2.0/vzaimodeistvie-l1-l2.md#l2-l1-communication).

### Структура <a href="#structure" id="structure"></a>

В отличие от L1 -> L2 коммуникации, напрямую инициализировать транзакции с L2 на L1 нельзя. Тем не менее, вы можете отправлять собщения произовольной длины с zkSync на Эфириум и затем обработать полученное сообщение на L1 смарт-контракте. Чтобы отправить сообщение со стороны L2, вам нужно вызвать метод `sendToL1` [системного контракта Messenger](https://v2-docs.zksync.io/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger). Он принимает только байты сообщения, которое отправляется на контракт zkSync на Эфириуме.&#x20;

Со стороны L1, контракт zkSync предоставляет метод `proveL2MessageInclusion` для доказательства того, что сообщение было отправлено в сторону L1 и включено в блок zkSync.

### Отправка сообщения с L2 на L1 <a href="#sending-a-message-on-l2" id="sending-a-message-on-l2"></a>

Sending messages from the L2 side requires users to call the `sendToL1` method from the [Messenger system contract](https://v2-docs.zksync.io/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger). This method accepts only the bytes of the message that is being sent to the zkSync smart contract on L1.

Отправка соощений со стороны L2 требует от пользователя вызвать метод `sendToL1` [системного контракта Messenger](https://v2-docs.zksync.io/dev/developer-guides/contracts/system-contracts.html#understanding-system-contracts##IL1Messenger).

```
function sendToL1(bytes memory _message) external returns (bytes32 messageHash);
```

* `_message` - параметр, включающий необработанные(raw) байты сообщения.

{% hint style="success" %}
**СОВЕТ**

Отправитель сообщения будет определен по контексту
{% endhint %}

Эта функция отправляет сообщения с L2 и возвращает хэш keccak256, произведенный от байтов сообщения. Хэш сообщения может быть использован позже для получения доказательства, что сообщение было отправлено в сторону L1. Его использование опционально и служит лишь для удобства.

Больше информации о мессенджере можно найти в [разделе ](../ponimanie-zksync-2.0/ponimanie-sistemnykh-kontraktov.md)системных контрактов.

#### Примеры: <a href="#examples" id="examples"></a>

**Отправка сообщения с L2 на L1 с помощью `zksync-web3`**

```typescript
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import { ethers } from "ethers";

const TEST_PRIVATE_KEY = "<YOUR_PRIVATE_KEY>";

async function main() {
  const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");

  const wallet = new Wallet(TEST_PRIVATE_KEY, zkSyncProvider);

  const messengerContract = new ethers.Contract(utils.L1_MESSENGER_ADDRESS, utils.L1_MESSENGER, wallet);

  console.log(`Messenger contract address is ${messengerContract.address}`);

  const someString = ethers.utils.toUtf8Bytes("Some L2->L1 message");
  console.log(`Sending message from L2 to L1`);
  const tx = await messengerContract.sendToL1(someString);

  console.log("L2 trx hash is ", tx.hash);
  const receipt = await tx.waitFinalize();

  console.log(`Transaction included in block ${receipt.blockNumber}`);

  // Получить доказательство, что сообщение было отправлено на L1
  const msgProof = await zkSyncProvider.getMessageProof(receipt.blockNumber, wallet.address, ethers.utils.keccak256(someString));

  console.log("Proof that message was sent to L1 :>> ", msgProof);
}

try {
  main();
} catch (error) {
  console.error(error);
}
```

**Смарт-контакт на L2, отправляющий сообщение на L1**

Следующий контракт отправляет свой адрес на L1 с помощью системного контракта Messenger:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing interfaces and addresses of the system contracts
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

contract Example {
    function sendMessageToL1() external returns(bytes32 messageHash) {
        // Construct the message directly on the contract
        bytes memory message = abi.encode(address(this));

        messageHash = L1_MESSENGER_CONTRACT.sendToL1(message);
    }
}
```

### Доказательство включения сообщения в блок L2 <a href="#prove-inclusion-of-the-message-into-the-l2-block" id="prove-inclusion-of-the-message-into-the-l2-block"></a>

Со стороны L1 смарт-контракт zkSync предоставляет интерфейс для доказательства того, что сообщение было отправлено на L1 и включено в блок zkSync.

Функция `proveL2MessageInclusion` из контракта [Mailbox L1](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/facets/Mailbox.sol) возвращает булево значение, которое указывает на то, что сообщение с такими параметрами было отправлено на L1.

```solidity
 struct L2Message {
        address sender;
        bytes data;
        uint256 txNumberInblock;
    }

    function proveL2MessageInclusion(
        uint32 _blockNumber,
        uint256 _index,
        L2Message calldata _message,
        bytes32[] calldata _proof
    ) external view returns (bool);
```

Here is a detailed description of the required parameters:

* `_blockNumber` - номер пачки L1, в которую был включен блок L2. Его можно узнать, используя метод `getBlock`.
* `_index` - индекс лога L2 в блоке. Он возвращается в виде `id` с помощью метода `getMessageProof` из `zksync-web3` API.
* `_message` - параметр, включающий в себя всю информацию об отправленном сообщении. Он должен являться объектом, включающим в себя:
  * `sender`: адрес, который отправил транзакцию с L2.
  * `data`: отправленное сообщение в байтах.
  * `txNumberInBlock`: индекс транзакции в блоке L2, который возвращается в виде `transactionIndex` при использовании метода `getTransaction`.
* `_proof` - параметр, включающий в себя доказательство Меркла о включении сообщения в блок. Он может быть получен либо через обозревание Ethereum, либо с помощью метода `getMessageProof` из `zksync-web3` API.

{% hint style="success" %}
**Важно**

Примите во внимание, что L2 блок вашей транзакции должен быть верифицирован (и, следовательно, транзакция финализирована) **перед** доказательством включения в L1.\
Example
{% endhint %}

#### **Пример**

**Контракт, обрабатывающий сообщения на L1**

Следующий контракт принимает информацию о транзакции, отправленной контракту L2 messenger и доказывает, что оно было включено в блок L2.

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Импорт интерфейса контракта zkSync
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Example {
  // УЧТИТЕ: контракт zkSync реализует лишь функционал для доказательства того, что сообщение принадлежит блоку
  // но не гарантирует, что такое доказательство было использовано лишь однажды. Поэтому контракт, который использует коммуникацию L2 -> L1 
  // должен озаботиться о двойном использовании сообщения.
  /// @dev mapping L2 block number => message number => flag
  /// @dev Используется для указания на то, что сообщение zkSync L2 -> L1 уже было обработано.
  mapping(uint32 => mapping(uint256 => bool)) isL2ToL1MessageProcessed;

  function consumeMessageFromL2(
  // Адрес смарт-контракта zkSync
  // Не рекомендуется его жестко обозначать в альфа-тестнете, т.к. может быть регенезис.
    address _zkSyncAddress,
  // номер блока zkSync, в котором сообщение было отправлено
    uint32 _l2BlockNumber,
  // индект сообщение, которое можно получить через API
    uint256 _index,
  // сообщение, отправленное с L2
    bytes calldata _message,
  // Доказательство Меркла для сообщения (Merkle proof)
    bytes32[] calldata _proof
  ) external returns (bytes32 messageHash) {
    // проверка, было ли сообщение уже обработано
    require(!isL2ToL1MessageProcessed(_l2BlockNumber, _index));

    IZkSync zksync = IZkSync(_zkSyncAddress);
    address someSender = 0x19a5bfcbe15f98aa073b9f81b58466521479df8d;
    L2Message message = L2Message({sender: someSender, data: _message});

    bool success = zksync.proveL2MessageInclusion(
      _l2BlockNumber,
      _index,
      message,
      _proof
    );
    require(success, "Failed to prove message inclusion");

    // Обозначение сообщения как обработанное
    isL2ToL1MessageProcessed(_l2BlockNumber, _index) = true;
  }
}
```

**Полный алгоритм**

Следующий скрипт отправляет сообщение с L2 на L1, получает доказательство сообщения и валидирует то, что сообщение, полученное на L1, пришло из блока L2.

```typescript
import * as ethers from "ethers";
import { Provider, utils, Wallet } from "zksync-web3";
const SENDER_ADDRESS = "<YOUR_ADDRESS>";
const TEST_PRIVATE_KEY = "<YOUR_PRIVATE_KEY>";

const MESSAGE = "Some L2->L1 message";

const l2Provider = new Provider("https://zksync2-testnet.zksync.dev");
const l1Provider = ethers.getDefaultProvider("goerli");

async function sendMessageToL1(text: string) {
  console.log(`Sending message to L1 with text ${text}`);
  const textBytes = ethers.utils.toUtf8Bytes(MESSAGE);
  const wallet = new Wallet(TEST_PRIVATE_KEY, l2Provider, l1Provider);

  const messengerContract = new ethers.Contract(utils.L1_MESSENGER_ADDRESS, utils.L1_MESSENGER, wallet);
  const tx = await messengerContract.sendToL1(textBytes);
  await tx.wait();
  console.log("L2 trx hash is ", tx.hash);
  return tx;
}

async function getL2MessageProof(blockNumber: ethers.BigNumberish) {
  console.log(`Getting L2 message proof for block ${blockNumber}`);
  return await l2Provider.getMessageProof(blockNumber, SENDER_ADDRESS, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(MESSAGE)));
}

async function proveL2MessageInclusion(l1BatchNumber: ethers.BigNumberish, proof: any, trxIndex: number) {
  const zkAddress = await l2Provider.getMainContractAddress();

  const mailboxL1Contract = new ethers.Contract(zkAddress, utils.ZKSYNC_MAIN_ABI, l1Provider);
  // all the information of the message sent from L2
  const messageInfo = {
    txNumberInBlock: trxIndex,
    sender: SENDER_ADDRESS,
    data: ethers.utils.toUtf8Bytes(MESSAGE),
  };

  console.log(`Retrieving proof for batch ${l1BatchNumber}, transaction index ${trxIndex} and proof id ${proof.id}`);

  const res = await mailboxL1Contract.proveL2MessageInclusion(l1BatchNumber, proof.id, messageInfo, proof.proof);

  return res;
}

/**
 * Полный алгоритм сообщения L2 -> L1 с валидацией доказательства.
 * Рекомендуется исполнять в 3 шага:
 * 1. Send message. Отправьте сообщения
 * 2. Wait for transaction to finalize and block verified. Подождите до финализации транзакции и верификации блока.
 * 3. Wait for block to be verified and validate proof. Подождите пока блок верифицируется и валидируйте доказательство.
 */
async function main() {
  // Step 1: отправка сообщения
  const l2Trx = await sendMessageToL1(MESSAGE);

  console.log("Waiting for transaction to finalize...");

  // Step 2: ожидание финализации може занять несколько минут
  const l2Receipt = await l2Trx.waitFinalize();

  // Step 3: получение и валидация доказательства (блок должен быть верифицирован)
  const proof = await getL2MessageProof(l2Receipt.blockNumber);

  console.log(`Proof is: `, proof);

  const trx = await l2Provider.getTransaction(l2Receipt.hash);

  // @ts-ignore
  console.log("trx.transactionIndex :>> ", trx.transactionIndex);

  // @ts-ignore
  const block = await l2Provider.getBlock(trx.blockNumber);

  console.log("L1 Batch for block :>> ", block.l1BatchNumber);

  // ВАЖНО!: Этот метод требует, чтобы блок был верифицирован
  // и отправлен на L1!
  const result = await proveL2MessageInclusion(
    block.l1BatchNumber,
    proof,
    // @ts-ignore
    trx.transactionIndex
  );

  console.log("Result is :>> ", result);
  process.exit();
}

try {
  main();
} catch (error) {
  console.error(error);
}
```

\
