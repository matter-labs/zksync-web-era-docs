# Временные ограничения

<mark style="color:green;">**Просьба об обратной связи**</mark>

<mark style="color:green;">Эта страница постоянно обновлятся, так как мы добавляем новые функции.</mark>

<mark style="color:green;">Если что-то из этого вам мешает, дайте нам знать в</mark> [<mark style="color:green;">discord</mark>](https://discord.gg/px2aR7w)<mark style="color:green;">, чтобы мы могли расставить соответствующие приоритеты.</mark>

### Использование библиотек в Solidity <a href="#using-libraries-in-solidity" id="using-libraries-in-solidity"></a>

Если библиотека Solidity может быть внутренней, т.е. содержать только `private` или `internal`методы, тогда эту библиотеку можно использовать без каких-либо ограничений.

Однако, если библиотека содержит хотя бы один `public` или `external` метод, она больше не является внутренней в представлении Yul. Такие адреса должны быть прямо переданы в наш компилятор. На данный момент это не поддерживается нашим hardhat плагином, но будет поддерживаться в будущем.

### Неподдерживаемые опкоды <a href="#unsupported-opcodes" id="unsupported-opcodes"></a>

* `SELFDESTRUCT` (считается вредным и есть призывы о его отключении на L1).
* `EXTCODECOPY` (он может быть реализован при необходимсоти, но на данный момент мы его пропустили, потому что опкоды zkEVM все равно не идентичны опкодам EVM)
* `CALLCODE` (объявлен устаревшим на Эфириуме в пользу `DELEGATECALL`).

### Временно смоделированы с постоянными значениями <a href="#temporarily-simulated-by-constant-values" id="temporarily-simulated-by-constant-values"></a>

Эти опкоды будут поддерживаться к моменту запуска mainnet.

* `block.gaslimit` всегда возвращает `2^32-1`.
* `MSIZE` всегда возвращает `2^16`.
* `COINBASE` (`block.coinbase`) всегда возвращает адрес [bootloader](https://v2-docs.zksync.io/dev/zksync-v2/system-contracts.html#bootloader).
* `DIFFICULTY` (`block.difficulty`) всегда возвращает `2500000000000000` (zkSync не имеет консенсуса Proof-of-Work).

### Игнорируются компилятором <a href="#ignored-by-the-compiler" id="ignored-by-the-compiler"></a>

* `PC` всегда возвращает `0` (с версии solidity 0.7.0, не доступно в Yul и Solidity).

### Предкомпилированные контракты (precompiles) <a href="#precompiles" id="precompiles"></a>

* На данный момент мы поддерживаем только `sha256` и `ecrecover`. Мы не поддерживаемм какие-либо иные преlкомпилированные контракты!
