# L2 -> L1 коммуникация

Этот раздел описывает интерфейс взаимодействия с Эфириумом со стороны L2. Подразумевается, что вы уже знакомы с базовыми концептами работы с коммуникацией     L2 -> L1. Если это для вас в новинку, то вы можете ознакомиться с концептуальным введением [тут](https://v2-docs.zksync.io/dev/zksync-v2/l1-l2-interop.html#l2-l1-communication).

### Структура <a href="#structure" id="structure"></a>

В отличие от L1 -> L2 коммуникации, напрямую инициализировать транзакции с L2 на L1 нельзя. Тем не менее, вы можете отправлять собщения произовольной длины с zkSync на Эфириум и затем обработать полученно сообщение на L1 смарт-контракте. Со стороны L2, для отправки сообщения нужно вызвать специальный системный контракт. Он принимает только байты сообщения, которое отправляется на контракт zkSync на Эфириуме. Со стороны L1, контракт zkSync предоставляет интерфейс для доказательства того, что сообщение было отправлено в сторону L1 и включено в блок zkSync.

### Отправка сообщения на L2 <a href="#sending-a-message-on-l2" id="sending-a-message-on-l2"></a>

Отправитель сообщения определяется из контекста.

```
function sendToL1(bytes memory _message) external returns (bytes32 messageHash);
```

* `_message` - параметр, включающий байты сообщения.

Эта функция отправляет сообщения с L2 и возвращает хэш keccak256, произведенный от байтов сообщения. Хэш сообщения может быть использован позже для получения доказательства, что сообщение было отправлено в сторону L1. Его использование опционально и служит лишь для удобства.

Больше информации о мессенджере можно найти в [разделе ](https://v2-docs.zksync.io/dev/zksync-v2/system-contracts.html#understanding-system-contracts##IL1Messenger)системных контрактов.

#### Примеры: <a href="#examples" id="examples"></a>

**Solidity**

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

### Доказательство включения сообщения в блок <a href="#prove-inclusion-of-the-message-into-the-l2-block" id="prove-inclusion-of-the-message-into-the-l2-block"></a>

Следующая функция возвращает булево значение, которые указывает, было ли сообщение, с данными параметрами, отправлено на L1.

```
    struct L2Message {
        address sender;
        bytes data;
    }

    function proveL2MessageInclusion(
        uint32 _blockNumber,
        uint256 _index,
        L2Message calldata _message,
        bytes32[] calldata _proof
    ) external view returns (bool);
```

* `_blockNumber` - параметр указывает на номер блока L2, в котором сообщение было отправлено.
* `_index` - параметр включает в себя позицию сообщения в блоке L2. Он может быть узнан путем обозревания Эфириума или через API.
* `_message` - параметр включает в себя полную информацию о сообщении, включая данные в виде байтов о полезной нагрузке и адрес отправителя.
* `_proof` - параметр включает в себя merkle proof (доказательство Меркла) о включении сообщения в блок. Он может быть восстановлен путем обозревания Эфириума, либо получен через API.

#### Examples <a href="#examples-2" id="examples-2"></a>

**Отправка сообщения с L2 нa L1 с помощью `zksync-web3`**

```typescript
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import { ethers } from "ethers";

const TEST_PRIVATE_KEY = "0xc8acb475bb76a4b8ee36ea4d0e516a755a17fad2e84427d5559b37b544d9ba5a";

async function main() {
  const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
  const ethereumProvider = ethers.getDefaultProvider("goerli");
  const wallet = new Wallet(TEST_PRIVATE_KEY, zkSyncProvider, ethereumProvider);

  const contract = new ethers.Contract(utils.L1_MESSENGER_ADDRESS, utils.L1_MESSENGER, wallet);

  const someString = ethers.utils.toUtf8Bytes("Some L2->L1 message");
  const tx = await contract.sendToL1(someString);
  const receipt = await tx.waitFinalize();

  // Get proof that the message was sent to L1
  const msgProof = await zkSyncProvider.getMessageProof(receipt.blockNumber, wallet.address, ethers.utils.keccak256(someString));
}
```

**Пример контракта, обрабатывающего сообщения на L1**

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Importing zkSync contract interface
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Example {
  // NOTE: The zkSync contract implements only the functionality for proving that a message belongs to a block
  // but does not guarantee that such a proof was used only once. That's why a contract that uses L2 -> L1
  // communication must take care of the double handling of the message.
  /// @dev mapping L2 block number => message number => flag
  /// @dev Used to indicated that zkSync L2 -> L1 message was already processed
  mapping(uint32 => mapping(uint256 => bool)) isL2ToL1MessageProcessed;

  function consumeMessageFromL2(
  // The address of the zkSync smart contract.
  // It is not recommended to hardcode it during the alpha testnet as regenesis may happen.
    address _zkSyncAddress,
  // zkSync block number in which the message was sent
    uint32 _l2BlockNumber,
  // Message index, that can be received via API
    uint256 _index,
  // The message that was sent from l2
    bytes calldata _message,
  // Merkle proof for the message
    bytes32[] calldata _proof
  ) external returns (bytes32 messageHash) {
    // check that the message has not been processed yet
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

    // Mark message as processed
    isL2ToL1MessageProcessed(_l2BlockNumber, _index) = true;
  }
}
```

\
