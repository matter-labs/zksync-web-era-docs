# Интерфейс контрактов

Для взаимодействия с zkSync со стороны L1 вам необходим интерфейс его канонического моста. Есть два основных пути его получения:

* Путем импорта npm пакета `@matterlabs/zksync-contracts`.(предпочтительно)
* Путем загрузки контактов из [репозитория](https://github.com/matter-labs/v2-testnet-contracts).

Руководство по взаимодействию с каноническим мостом zkSync с примерами и для Solidity, и для `zksync-web3` SDK можно найти [тут](https://v2-docs.zksync.io/dev/guide/l1-l2.html).

Данная страница будет служить в основном как небольшая сноска к интерфейсам и типам, которые могут вам понадобиться и как их импортировать.

### `@matterlabs/zksync-contracts`  <a href="#matterlabs-zksync-contracts-reference" id="matterlabs-zksync-contracts-reference"></a>

* `@matterlabs/zksync-contracts/contracts/interfaces/IZkSync.sol`  - это файл, в котором находится интерфейс контракта zkSync L1 `IZkSync`. Особый интерес представляет функционал интерфейса моста `IBridge`. Его реализацию можно найти [тут](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IZkSync.sol).
* &#x20;`@matterlabs/zksync-contracts/libraries/Operations.sol`  - это файл, где хранится библиотека 'Operations' вместе со всеми пользовательскими типами моста. Его реализацию можно найти [тут](https://github.com/matter-labs/v2-testnet-contracts/blob/main/libraries/Operations.sol).

\-->

Код в этом репозитории может содержать какие-то конфигурационные константы. Они являются лишь заполнителями пространства, взятыми из окружения разработки. Вам следует использовать эту библиотеку только для получения интерфейсов и типов, которые она предоставляет.
