# Web3 API

zkSync 2.0 полностью поддерживаем стандарт [Ethereum JSON-RPC API](https://eth.wiki/json-rpc/API).

Пока код не включает в себя развертывание новых смарт-контрактов (они могут быть развернуты только с использованием транзакций типа EIP712, подробнее об этом [ниже](https://app.gitbook.com/s/Q94rnwzPd443twWxJNpi/\~/changes/1FFkP4GZejfjyey9uMAD/api-reference/web3-api#eip712)), _никаких изменений в кодовой базе не требуется_.

Вы можете продолжать использование текущего SDK. Пользователи продолжать платить комиссии в ETH, а пользовательский опыт будет идентичен эфириумовскому.

Однако, у zkSync есть свои особенности, которые описываются в этом разделе.

### EIP712 <a href="#eip712" id="eip712"></a>

Для обозначения допольнительных полей транзакции, например, кастомной подписи для кастомных аккаунтов или для выбора paymaster'a, необходимо использовать транакции типа EIP712. Такие транзакции имеют те же поля, как и стандартные транзакции Ethereum, но кроме них имеются еще и поля с дополнительными данными, специфическими для L2 (например, `paymaster` и т.д.):

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

Эти поля удобным образом передаются с помощью нашего [SDK](https://v2-docs.zksync.io/api/js/features.html).

### [#](https://v2-docs.zksync.io/api/api.html#zksync-specific-json-rpc-methods)zkSync-специфичные методы JSON-RPC <a href="#zksync-specific-json-rpc-methods" id="zksync-specific-json-rpc-methods"></a>

Все zkSync-специфичные методы находятся в пространстве имен `zks_`. API может также предоставлять методы, отличные от представленных тут. Эти методы существуют для внутреннего использования командой и крайне нестабильны.

{% hint style="warning" %}
**Внимание!**

Пожалуйста, учитите, что Metamask не поддерживаем методы пространства имен zks\_, мы работают над его поддержкой в будущем. Как альтернатива, вы можете использовал класс `Provider` с testnet RPC вместо того, чтобы полагаться на провайдера, встроенного в Metamask.

#### &#x20;<a href="#zks-getmaincontract" id="zks-getmaincontract"></a>
{% endhint %}

#### `zks_getMainContract` <a href="#zks-getmaincontract" id="zks-getmaincontract"></a>

Возвращает адрес контракта zkSync.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters)Вводные параметры <a href="#input-parameters" id="input-parameters"></a>

Отсутствуют.

#### [#](https://v2-docs.zksync.io/api/api.html#output-format)Формат вывода <a href="#output-format" id="output-format"></a>

`"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"`

#### [#](https://v2-docs.zksync.io/api/api.html#zks-l1chainid)`zks_L1ChainId` <a href="#zks-l1chainid" id="zks-l1chainid"></a>

Возвращает chain id основного L1.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters-2)Вводные параметры <a href="#input-parameters-2" id="input-parameters-2"></a>

Отстутствуют.

#### [#](https://v2-docs.zksync.io/api/api.html#output-format-2)Формат вывода <a href="#output-format-2" id="output-format-2"></a>

`12`

#### [#](https://v2-docs.zksync.io/api/api.html#zks-getconfirmedtokens)`zks_getConfirmedTokens` <a href="#zks-getconfirmedtokens" id="zks-getconfirmedtokens"></a>

Представление `from` и `limit` возвращает информацию о подтвержденных токенах с идентификаторами в интервале `[from..from+limit-1]`. "Подтвержденные" здесь - некорректное название, т.к. подтвержденный токен это тот, который был перенесен через стандартный мост zkSync.

Токены возвращаются в алфавитном порядке, так что идентификатор токена (id) - это его позиция в массиве токенов, отсортированных в алфавитном порядке.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters-3)Вводные параметры <a href="#input-parameters-3" id="input-parameters-3"></a>

| Параметр | Тип данных | Описание                                                                 |
| -------- | ---------- | ------------------------------------------------------------------------ |
| from     | `uint32`   | Идентификатор токена, с которого начинается возврат информации о токенах |
| limit    | `uint8`    | Количество токенов, возвращаемых от API                                  |

#### [#](https://v2-docs.zksync.io/api/api.html#output-format-3)Формат вывода <a href="#output-format-3" id="output-format-3"></a>

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

#### `zks_getL2ToL1MsgProof` <a href="#zks-getl2tol1msgproof" id="zks-getl2tol1msgproof"></a>

Предоставление блока, отправителя, сообщения и опционального индекса журнала сообщений в блоке, содержащем сообщение L1->L2 - возвращает доказательство для сообщения, отправленного через системный контракт L1Messenger.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters-4)Вводные параметры <a href="#input-parameters-4" id="input-parameters-4"></a>

| Параметр          | Тип данных        | Описание                                                                                                                                                                                                                                                                          |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| block             | `uint32`          | Номер блока, в котором сообщение было отправлено.                                                                                                                                                                                                                                 |
| sender            | `address`         | Отправитель сообщения (т.е. аккаунт, который вызвал системный контракт L1Messenger).                                                                                                                                                                                              |
| msg               | `uint256`         | Хэш отправленного сообщения в формате keccak256.                                                                                                                                                                                                                                  |
| l2\_log\_position | `uint256 \| null` | Индекс (в блоке) события, созданного [L1Messenger](../developer-docs/ponimanie-zksync-2.0/ponimanie-sistemnykh-kontraktov.md#il1messenger)'ом во время отправки сообщения. Если пропустить это поле, то будет возвращено докзательство для первого сообщения с таким содержанием. |

#### [#](https://v2-docs.zksync.io/api/api.html#output-format-4)Формат вывода <a href="#output-format-4" id="output-format-4"></a>

Если такого сообщения не было, возвращаемное значение - `null`.

В ином случае возвращается объект следующего формата:

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

`id` - это позиция листка в древе Меркла сообщений L2->L1 для данного блока. `proof` - это доказательство Меркла для сообщения, тогда как `root` - это корень древа Меркла сообщений L2->L1. Пожалуйста, учтите, что древо Меркла использует _sha256._

Вам не нужно беспокоиться о "внутренностях", так как вовзращаемые `id` and `proof`можно использовать сразу для взаимодействия со смарт-контрактом zkSync.

Отличный пример использования данного узла через наш SDK можно найти [здесь](../developer-docs/rukovodstvo-razrabotchika/l1-greater-than-l2-kommunikaciya.md).

#### `zks_getBridgeContracts` <a href="#zks-getbridgecontracts" id="zks-getbridgecontracts"></a>

Возвращает L1/L2 адреса стандартных мостов.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters-5)Вводные параметры <a href="#input-parameters-5" id="input-parameters-5"></a>

Отсутствуют.

#### [#](https://v2-docs.zksync.io/api/api.html#output-format-5)Формат вывода <a href="#output-format-5" id="output-format-5"></a>

```json
{
  "l1Erc20DefaultBridge": "0x7786255495348c08f82c09c82352019fade3bf29",
  "l1EthDefaultBridge": "0xcbebcd41ceabbc85da9bb67527f58d69ad4dfff5",
  "l2Erc20DefaultBridge": "0x92131f10c54f9b251a5deaf3c05815f7659bbe02",
  "l2EthDefaultBridge": "0x2c5d8a991f399089f728f1ae40bd0b11acd0fb62"
}
```

#### `zks_getTestnetPaymaster` <a href="#zks-gettestnetpaymaster" id="zks-gettestnetpaymaster"></a>

Возвращает адрес [testnet paymaster](../developer-docs/ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#testnet-paymaster)'a: paymaster'a, доступного в тестнете и позволяющего оплачивать комиссии в токенах ERC-20.

#### [#](https://v2-docs.zksync.io/api/api.html#input-parameters-6)Вводные параметры <a href="#input-parameters-6" id="input-parameters-6"></a>

Отсутствуют.

#### [#](https://v2-docs.zksync.io/api/api.html#output-format-6)Формат вывода <a href="#output-format-6" id="output-format-6"></a>

```
"0x7786255495348c08f82c09c82352019fade3bf29"
```

### [#](https://v2-docs.zksync.io/api/api.html#pubsub-api)PubSub API <a href="#pubsub-api" id="pubsub-api"></a>

zkSync полностью совместим с [Geth's pubsub API](https://geth.ethereum.org/docs/rpc/pubsub), за исключением подписки на `syncing`, так как он не имеет смысла для сети zkSync, ибо технически наши ноды всегда синхронизированны.

WebSocket URL is `wss://zksync2-testnet.zksync.dev/ws`
