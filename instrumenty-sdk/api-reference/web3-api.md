# Web3 API

zkSync 2.0 полностью поддерживает стандарт [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API).

Пока код не включает в себя развертывание новых смарт-контрактов (они могут быть развернуты только с использованием транзакций типа EIP712, подробнее об этом [ниже](https://app.gitbook.com/s/Q94rnwzPd443twWxJNpi/api-reference/web3-api#eip712)), _никаких изменений в кодовой базе не требуется_.

Вы можете продолжать использование текущего SDK. Пользователи продолжат платить комиссии в ETH, а пользовательский опыт будет идентичен эфириумовскому.

Однако, у zkSync есть свои особенности, которые описываются в этом разделе.

### EIP712 <a href="#eip712" id="eip712"></a>

Для обозначения дополнительных полей транзакции, например, кастомной подписи для кастомных аккаунтов или для выбора paymaster'a, необходимо использовать транакции типа EIP712. Такие транзакции имеют те же поля, как и стандартные транзакции Ethereum, но кроме них имеются еще и поля с дополнительными данными, специфическими для L2 (например, `paymaster` и т.д.):

```json
"ergsPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factory_deps": ["0x..."]
```

* `ergsPerPubdata` поле описывает максимальное количество ergs, которое пользователь готов заплатить за один байт публичных даных (pubdata).
* `customSignature` поле для кастомной подписи, на случай если аккаунт подписанта не является EOA
* `paymasterParams` поле с параметрами для конфигурирования кастомного paymaster'a для данной транзакции. Параметры paymaster'a содержат адрес paymaster'a и закодированную команду для его вызова.
* `factory_deps` поле, которое должно быть заполнено не пустым массивом `bytes` 'ов для транзакций развертывания. Оно должно включать в себя байт-код развертываемого контрата. Если развертываемый контракт является контрактом-фабрикой, т.е. может развертывать другие контракты, то массив также должен включать байт-коды контрактов, развертываемых с его помощью.

Чтобы сервер мог распознать транзакции типа EIP712, поле `transaction_type` должно быть равно `113` (к сожалению, число `712` не может быть использовано в `transaction_type`, т.к. значение должно быть не длиннее одного байта).

Вместо подписывания RLP-закодированной транзакции, пользователь подписывает следующую заполненную структуру-EIP712:

| Название поля           | Тип данных  |
| ----------------------- | ----------- |
| txType                  | `uint256`   |
| from                    | `uint256`   |
| to                      | `uint256`   |
| ergsLimit               | `uint256`   |
| ergsPerPubdataByteLimit | `uint256`   |
| maxFeePerErg            | `uint256`   |
| maxPriorityFeePerErg    | `uint256`   |
| paymaster               | `uint256`   |
| nonce                   | `uint256`   |
| value                   | `uint256`   |
| data                    | `bytes`     |
| factoryDeps             | `bytes32[]` |
| paymasterInput          | `bytes`     |

Эти поля удобным образом обрабатываются с помощью нашего [SDK](https://v2-docs.zksync.io/api/js/features.html).

### zkSync-специфичные методы JSON-RPC <a href="#zksync-specific-json-rpc-methods" id="zksync-specific-json-rpc-methods"></a>

Все zkSync-специфичные методы находятся в пространстве имен `zks_`. API может также предоставлять методы, отличные от представленных тут. Эти методы существуют для внутреннего использования командой и крайне нестабильны.

{% hint style="warning" %}
**Внимание!**

Пожалуйста, учитите, что Metamask не поддерживаем методы пространства имен zks\_, мы работают над его поддержкой в будущем. Как альтернатива, вы можете использовал класс `Provider` с testnet RPC вместо того, чтобы полагаться на провайдера, встроенного в Metamask.


{% endhint %}

#### `zks_getMainContract` <a href="#zks-getmaincontract" id="zks-getmaincontract"></a>

Возвращает адрес контракта zkSync.

#### Вводные параметры <a href="#input-parameters" id="input-parameters"></a>

Отсутствуют.

#### Формат вывода <a href="#output-format" id="output-format"></a>

`"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"`

#### `zks_L1ChainId` <a href="#zks-l1chainid" id="zks-l1chainid"></a>

Возвращает chain id основного L1.

#### Вводные параметры <a href="#input-parameters-2" id="input-parameters-2"></a>

Отстутствуют.

#### Формат вывода <a href="#output-format-2" id="output-format-2"></a>

`12`

#### `zks_getConfirmedTokens` <a href="#zks-getconfirmedtokens" id="zks-getconfirmedtokens"></a>

Принимая `from` и `limit`, возвращает информацию о подтвержденных токенах с идентификаторами в интервале `[from..from+limit-1]`. "Подтвержденные" здесь - некорректное название, т.к. подтвержденный токен это тот, который был перенесен через стандартный мост zkSync.

Токены возвращаются в алфавитном порядке, где идентификатор токена (id) - это его позиция в массиве токенов, отсортированных в алфавитном порядке.

#### Вводные параметры <a href="#input-parameters-3" id="input-parameters-3"></a>

| Параметр | Тип данных | Описание                                                                 |
| -------- | ---------- | ------------------------------------------------------------------------ |
| from     | `uint32`   | Идентификатор токена, с которого начинается возврат информации о токенах |
| limit    | `uint8`    | Количество токенов, возвращаемых от API                                  |

#### Формат вывода <a href="#output-format-3" id="output-format-3"></a>

```json
[
  {
    "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "decimals": 18,
    "name": "ETH",
    "symbol": "ETH"
  },
  {
    "address": "0xd2255612f9b045e9c81244bb874abb413ca139a3",
    "decimals": 18,
    "name": "TrueUSD",
    "symbol": "TUSD"
  },
  {
    "address": "0xd35cceead182dcee0f148ebac9447da2c4d449c4",
    "decimals": 6,
    "name": "USD Coin (goerli)",
    "symbol": "USDC"
  }
]
```

#### `zks_getL2ToL1LogProof` <a href="#zks-getl2tol1logproof" id="zks-getl2tol1logproof"></a>

Принимая хэш транзакции и индекс лога L2 - L1, созданного в рамках транзакции, он возвращает доказательство для соответствующего лога L2 - L1.

Индекс лога, который можно получить из чека транзакции (он включает список всех логов, созданных транзакцией).

#### Вводные параметры <a href="#input-parameters-4" id="input-parameters-4"></a>

| Параметр               | Тип данных              | Описание                                                         |
| ---------------------- | ----------------------- | ---------------------------------------------------------------- |
| tx\_hash               | `bytes32`               | Хэш L2 транзакции, в рамках которой был произведен лог L2 -> L1. |
| l2\_to\_l1\_log\_index | `undefined` \| `number` | Индекс лога L2 -> L1 в транзакции.                               |

#### Формат вывода <a href="#output-format-4" id="output-format-4"></a>

Если такого сообщения не существует, возвращаемое значение будет равно `null`.

Иначе, возращается объект следующего формата:

```json
{
  "id": 0,
  "proof": [
    "0x66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925",
    "0x2eeb74a6177f588d80c0c752b99556902ddf9682d0b906f5aa2adbaf8466a4e9",
    "0x1223349a40d2ee10bd1bebb5889ef8018c8bc13359ed94b387810af96c6e4268",
    "0x5b82b695a7ac2668e188b75f7d4fa79faa504117d1fdfcbe8a46915c1a8a5191"
  ],
  "root": "0x6a420705824f0a3a7e541994bc15e14e6a8991cd4e4b2d35c66f6e7647760d97"
}
```

`id` - это позиция листа в дереве Меркла сообщений L2->L1 для данного блока. `proof` - это доказательство Меркла для сообщения, а `root` - корень дерева Меркла сообщений L2->L1. Обратите внимание, что дерево Меркла использует _sha256_.

Вам не нужно заботиться об интринсиках, так как возвращаемые идентификатор и доказательство могут быть сразу использованы для взаимодействия со смарт-контрактом zkSync.

Хороший пример использования этой конечной точки через наш SDK можно найти [здесь](../../ponimanie-zksync/kommunikaciya-l2-greater-than-l1/).

{% hint style="success" %}
**СОВЕТ**

Список логов L2 - L1, созданных транзакцией, который включается в чеки, представляет собой комбинацию логов, созданных контрактом L1Messenger или другими системными контрактами/bootloader'ом.&#x20;

Существует лог, создаваемый загрузчиком для каждой транзакции, инициированной L1, который показывает, была ли транзакция успешной.
{% endhint %}

#### `zks_getL2ToL1MsgProof` <a href="#zks-getl2tol1msgproof" id="zks-getl2tol1msgproof"></a>

Принимая блок, отправителя, сообщения и опционального индекса лога сообщений в блоке, содержащем сообщение L1->L2 - возвращает доказательство для сообщения, отправленного через системный контракт L1Messenger.

#### Вводные параметры <a href="#input-parameters-4" id="input-parameters-4"></a>

| Параметр          | Тип данных        | Описание                                                                                                                                                                                                    |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| block             | `uint32`          | Номер блока, в котором сообщение было отправлено.                                                                                                                                                           |
| sender            | `address`         | Отправитель сообщения (т.е. аккаунт, который вызвал системный контракт L1Messenger).                                                                                                                        |
| msg               | `uint256`         | Хэш отправленного сообщения в формате keccak256.                                                                                                                                                            |
| l2\_log\_position | `uint256 \| null` | Индекс (в блоке) события, созданного [L1Messenger](broken-reference)'ом во время отправки сообщения. Если пропустить это поле, то будет возвращено докзательство для первого сообщения с таким содержанием. |

#### Формат вывода <a href="#output-format-4" id="output-format-4"></a>

Такой же, как у [zks\_getL2ToL1LogProof](web3-api.md#zks-getl2tol1logproof).

{% hint style="warning" %}
Конечная точка`zks_getL2ToL1MsgProof` будет объявлена устаревшей, т.к. доказательства для сообщений L2 -> L1 могут быть получены из`zks_getL2ToL1LogProof`.
{% endhint %}

#### `zks_getBridgeContracts` <a href="#zks-getbridgecontracts" id="zks-getbridgecontracts"></a>

Возвращает L1/L2 адреса стандартных мостов.

#### Вводные параметры <a href="#input-parameters-5" id="input-parameters-5"></a>

Отсутствуют.

#### Формат вывода <a href="#output-format-5" id="output-format-5"></a>

```json
{
  "l1Erc20DefaultBridge": "0x7786255495348c08f82c09c82352019fade3bf29",
  "l1EthDefaultBridge": "0xcbebcd41ceabbc85da9bb67527f58d69ad4dfff5",
  "l2Erc20DefaultBridge": "0x92131f10c54f9b251a5deaf3c05815f7659bbe02",
  "l2EthDefaultBridge": "0x2c5d8a991f399089f728f1ae40bd0b11acd0fb62"
}
```

#### `zks_getTestnetPaymaster` <a href="#zks-gettestnetpaymaster" id="zks-gettestnetpaymaster"></a>

Возвращает адрес [testnet paymaster](../../ponimanie-zksync/podderzhka-abstrakcii-akkaunta-aa/#testnet-paymaster)'a: paymaster'a, доступного в тестнете и позволяющего оплачивать комиссии в токенах ERC-20.

#### Вводные параметры <a href="#input-parameters-6" id="input-parameters-6"></a>

Отсутствуют.

#### Формат вывода <a href="#output-format-6" id="output-format-6"></a>

```json
"0x7786255495348c08f82c09c82352019fade3bf29"
```

#### `zks_getBlockDetails` <a href="#zks-getblockdetails" id="zks-getblockdetails"></a>

Возвращает дополнительную, zkSync-специфичную информацию о блоке L2.

#### Вводные параметры <a href="#input-parameters-8" id="input-parameters-8"></a>

| Параметр | Тип данных | Описание    |
| -------- | ---------- | ----------- |
| block    | `uint32`   | Номер блока |

#### Формат вывода <a href="#output-format-8" id="output-format-8"></a>

```json
{
  "commitTxHash": "0x2c8f18312c6b6c2e72df56dd5684e3c65fcdf5f6141763eafdcbbfc02c3a39b5",
  "committedAt": "2022-12-12T08:41:50.774441Z",
  "executeTxHash": "0xa12f3a9689101758acad280dd21a00cfc2644c125702ea301f46a33799cde9b9",
  "executedAt": "2022-12-12T08:41:57.233941Z",
  "l1TxCount": 5,
  "l2TxCount": 0,
  "number": 1,
  "proveTxHash": "0x0fed6d8a7b02a26b5513edea10d8849342b56a13c0e48317556c78b34aeacd26",
  "provenAt": "2022-12-12T08:41:57.219584Z",
  "rootHash": "0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f",
  "status": "verified",
  "timestamp": 1670834504
}
```

### PubSub API <a href="#pubsub-api" id="pubsub-api"></a>

zkSync полностью совместим с [Geth's pubsub API](https://geth.ethereum.org/docs/rpc/pubsub), за исключением подписки на `syncing`, так как он не имеет смысла для сети zkSync, ибо технически наши узлы всегда синхронизированны.

WebSocket URL `wss://zksync2-testnet.zksync.dev/ws`
