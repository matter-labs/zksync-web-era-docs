# Переход на testnet paymaster

Тогда как предыдущие версии zkSync 2.0 testnet нативно поддерживали оплату комиссий в других токенах, это вызывало несколько проблем с совместимостью с экосистемой Ethereum. С приходом [paymaster'ов](../ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#paymasters) надобность в этой функции исчезла, т.к. теперь любой может развернуть свой контракт paymaster'a, который будет обменивать ERC20 токены на ETH на лету. Вы можете ознакомиться с руководством по развертыванию кастомного paymaster'a [тут](rukovodstvo-razrabotka-kastomnogo-paymaster.md).

zkSync не планирует развертывать какого-либо paymaster в mainnet в целях поддержки экосистемных разработок. Однако, держа в уме обеспечение лучшего девелоперского опыта, мы развернули одного в testnet. Testnet paymaster позволяет оплачивать комиссии в ERC-20 токене по курсу 1:1 к ETH. Вы можете ознакомиться с документацией [здесь](../ponimanie-zksync-2.0/vazhno-podderzhka-abstrakcii-akkaunta.md#testnet-paymaster). В этом разделе мы покажем короткий пример перехода от старого способа оплаты комиссий токенами ERC20 к новым.

Данная документация относится _только_ к testnet paymaster. Развертывая свой проект в mainnet, вам понадобиться либо развернуть своего paymaster'a, либо найти стороннее решение и ознакмиться с его документацией.

### Предыдущий интерфейс <a href="#previous-interface" id="previous-interface"></a>

В прошлых версиях testnet вы предоставляли аргумент `feeToken` в переопределениях (overrides) транзакции, так что вызов контракта, оплачивающего комиссии в USDC, например, выглядел примерно так:

```javascript
const tx = await contract.callMethod({
    customData: {
        feeToken: USDC_ADDRESS
    }
})
```

### Использование testnet paymaster <a href="#using-testnet-paymaster" id="using-testnet-paymaster"></a>

Работа с testnet paymaster состоит из трех шагов:

1. Извлечение адреса testnet paymaster:

```javascript
const testnetPaymaster = await provider.getTestnetPaymasterAddress();
```

Заметьте: кэширование адреса paymaster'a не рекомендуется, т.к. он может изменяться без предупреждения.

&#x20; 2\.  Кодировка параметров paymaster'a для использования в транзакции. Для этого вы можете использовать метод `utils.getPaymasterParams` :

```javascript
import { utils } from 'zksync-web3'

const paymasterParams = utils.getPaymasterParams(testnetPaymaster, {
    type: 'ApprovalBased',
    token: USDC_ADDRESS,
    // Note, that the allowance for the testnet paymaster must be
    // at least maxFeePerErg * gasLimit, where maxFeePerErg and gasLimit
    // are parameters used in the transaction.
    minimalAllowance: maxFeePerErg.mul(gasLimit),
    innerInput: new Uint8Array()
});
```

&#x20; 3\.  Отправка транзакции с предоставленными параметрами paymaster'a:

```javascript
const tx = await contract.callMethod({
    customData: {
        paymasterParams
    }
});
```
