# Тестовая сеть zkSync

Добро пожаловать в тестовую сеть (тестнет) zkSync 2.0 ! Наша команда будет очень рада увидеть то, что вы сможете построить на zkSync. Также мы рады любой обратной связи, которую вы могли бы предоставить!

{% hint style="warning" %}
**Альфа тестнет**

Обратите внимание, что система все еще находится в активной разработке, так что:

* **В будущем возможны критические изменения.**&#x20;
* **Некоторые из обновлений могут потребовать регенезиса сети**, т.е. обнуления всех балансов, удаления смарт-контрактов и перезапуска сети. Мы позаботимся о том, чтобы уведомить вас о регенезисе заблаговременно! Убедитесь, что следите за новостями в **** [**Discord.**](https://discord.gg/px2aR7w)
{% endhint %}

Чтобы получить представление о пользовательском опыте zkSync 2.0:

* Перейдите на портал [zkSync 2.0 Portal.](https://portal.zksync.io/)
* Получите немного токенов из крана, или переведите их себе с Ethereum Görli testnet.
* Проведите несколько транзакций.

Портал является центральной точкой входа в экосистему zkSync 2.0 как для пользователей, так и для разработчиков. Он содержит ссылки на все релевантные ресурсы, такие как [обозреватель блоков](https://explorer.zksync.io/) или каталог приложений.

### Нужен ли мне опыт работы с zkSync 1.x? <a href="#do-i-need-experience-with-zksync-1-x" id="do-i-need-experience-with-zksync-1-x"></a>

Некоторый опыт с zkSync 1.x может быть полезен для понимания некоторых ключевых концепций, например, как работает финальность. Касательно других аспектов, zkSync 2.0 и 1.х - очень разные системы, и опыт с 1.х не нужен для разработки на zkSync 2.0.

### Что мне нужно для начала разработки? <a href="#what-do-i-need-to-start-building" id="what-do-i-need-to-start-building"></a>

Все существующие SDK для Эфириума будут работать из коробки и ваши пользователи будут иметь тот же опыт, что и на Эфириуме. Если вы ходите подключить расширенные функции zkSync, как абстракция аккаунта, то нужно использоваться zkSync SDK.

Единственная другая ситуация, где необходимо использование zkSync SDK - это развертывание контрактов. Но это легко выполняется с помощью нашего hardhat плагина.

### Быстрый старт на zkSync

Ознакомьтесь с нашим [руководством по быстрому старту](https://v2-docs.zksync.io/dev/developer-guides/hello-world.html#prerequisites), из которого вы узнаете:

* Как установить hardhat плагин zkSync и разворачивать смарт-контракты с его помощью
* Как построить фронтенд для вашего dApp (децентрализованное приложение), используя библиотеку `zksync-web3`.

### Подключение Metamask

​Чтобы подключить Metamask к zkSync, добавьте в кошелек сеть zkSync alpha testnet.

1.  Откройте Metamask и кликните по значку сети в центральной верхенй части интерфейса:&#x20;

    <figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>
2. Нажмите "Add network" (Добавить сеть)
3. Заполните параметры для zkSync alpha testnet network и кликните "Save" (сохранить):

**Testnet network info**

* Network Name: `zkSync alpha testnet`
* New RPC URL: `https://zksync2-testnet.zksync.dev`
* Chain ID: `280`
* Currency Symbol: `ETH`
* Block Explorer URL: `https://goerli.explorer.zksync.io/`
* WebSocket URL: `wss://zksync2-testnet.zksync.dev/ws`

**Mainnet network info**

* Network Name: `zkSync mainnet`
* New RPC URL: `https://zksync2-mainnet.zksync.io`
* Chain ID: `324`
* Currency Symbol: `ETH`
* Block Explorer URL: `https://explorer.zksync.io/`
* WebSocket URL: `wss://zksync2-mainnet.zksync.io/ws`
