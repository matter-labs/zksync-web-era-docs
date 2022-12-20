# Введение

## Документация zkSync <a href="#zksync-documentation" id="zksync-documentation"></a>

Данная документация предназначина для того, чтобы помочь вам в разработке на zkSync. Она введет вас в концепты zkSync, опишет сетевой стэк zkSync, а также некоторые сложные моменты для комплексных приложений и вариантов применения.

Учитывая, что эта документация с открытым исходным кодом, то вы вольны в предложении новых тем, добавлении нового контента и предоставлении примеров\образцов в тех местах, где сочтете нужным. Если вы не уверены, как это сделать, то [следуйте этим инструкциям](ustranenie-nepoladok/vnesite-svoi-vklad-v-dokumentaciyu/).

### Фундаментальные темы <a href="#fundamental-topics" id="fundamental-topics"></a>

Если вы впервые знакомитесь с использованием zkSync, мы рекомендуем вам начать с ознакомления с документацией так же, как если бы вы читали книгу.

* [Введение в роллапы](readme/developer-docs/vvedenie-v-rollapy/) - Краткое описание роллапов.
* [Основы zkSync](developer-docs/osnovy-zksync/) - Быстрый обзор технологий zkSync.
* [Тестовая сеть zkSync 2.0](developer-docs/testovaya-set-zksync-2.0/)- Краткое введение в тестнет zkSync.

#### Гайды для разработчика <a href="#developer-guides" id="developer-guides"></a>

* [Быстрый старт](rukovodstvo-razrabotchika/bystryi-start.md) - узнайте, как построить полноценный dApp, используя инструментарий разработки zkSyncLearn
* [Развертывание контракта](razrabotka-na-zksync/razvertyvanie-kontrakta/) - руководство по развертыванию смарт-контрактов на zkSync.
  * [Верификация контракта](razrabotka-na-zksync/verifikaciya-smart-kontrakta/) - руководство по верификации смарт-контрактов через обозреватель блоков zkSync
* [Системные контракты](ponimanie-zksync/sistemnye-kontrakty/) - Краткий обзор системных контрактов zkSync.
* [Транзакции](ponimanie-zksync/tranzakcii/) - Руководство по тому, как zkSync обрататывает транзакции.
  * [Блоки ](ponimanie-zksync/bloki/)- Узнайте, как работают блоки в zkSync.
  * [Механизм комиссий](ponimanie-zksync/mekhanizm-komissii/) - Краткий экскурс по структуре комиссий в zkSync.
* [Абстракция аккаунта](ponimanie-zksync/podderzhka-abstrakcii-akkaunta-aa/) - Узнайте больше об абстракции аккаунта.
* [Перенос средств](ponimanie-zksync/perenos-sredstv-bridzhing/) - Краткое введение в перенос (бриджинг) токенов.
  * [Интероперабельность L1 / L2](ponimanie-zksync/interoperabelnost-l1-l2/) - Краткий брифинг по обменуданными между L1 и L2.
    * [Коммуникация L1 -> L2](ponimanie-zksync/kommunikaciya-l1-greater-than-l2/) - Узнайте, как отправлять данные с Ethereum на zkSync.
    * [Коммуникация L2 -> L1 ](ponimanie-zksync/kommunikaciya-l2-greater-than-l1/)- Узнайте, как отправлять данные с zkSync на Ethereum.
* [Важные ссылки](ustranenie-nepoladok/vazhnye-ssylki/) - Быстрый доступ к важным ссылкам.
* [Статус поддержки функций](ustranenie-nepoladok/status-podderzhki-funkcii/) - Будьте в курсе того, над чем мы сейчас работаем.
* [Известные проблемы](ustranenie-nepoladok/izvestnye-problemy/) - Получите ответы на типичтные проблемы, с которыми вы могли столкнуться.

#### Инструменты разработчика <a href="#developer-tools" id="developer-tools"></a>

* [zkSync 2.0 Portal ](https://portal.zksync.io/)- Исследуйте функции Кошелька, Моста и Крана.
* [Обозреватель блоков](https://v2-docs.zksync.io/api/tools/block-explorer/) - Ищите актуальную и историческую информацию о блоках, транзакциях, адресах и др. в обозревателе блоков zkSync.

#### Примеры и руководства <a href="#examples-and-tutorials" id="examples-and-tutorials"></a>

* [Кроссчейн управление](rukovodstva/krosschein-upravlenie/) - Узнайте, как использовать L1 для взаимодействия с контрактом на L2.
* [Абстракция аккаунта](rukovodstva/abstrakciya-akkaunta/) - Узнайте, как развертывать свои кастомные аккаунта и взаимодействовать с системными контрактами zkSync.
* [Разработка кастомного paymaster](rukovodstva/razrabotka-kastomnogo-paymaster/) - Узнайте, как построить кастомного paymaster, чтобы позволить пользователям оплачивать комиссии в вашем токене.
