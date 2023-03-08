# 实用工具

`zksync-web3`为zkSync建设者提供了一些有用的工具。它们可以通过以下方式导入。

```typescript
import { utils } from "zksync-web3";
```

大多数实用程序是由zkSync团队内部使用的。所以本文件将只描述那些对你有帮助的工具。

## 以太坊的 "地址"

而以太坊实际上是部署在地址上的代币。

```typescript
export const L2_ETH_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800a";
```

zkSync还允许在我们的SDK和API中使用更友好的零地址别名。

```typescript
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
```

## zkSync智能合约的ABI

```typescript
export const ZKSYNC_MAIN_ABI = new utils.Interface(require("../abi/IZkSync.json"));
```

## IERC20接口

在与zkSync上的本地令牌进行交互时很方便。

```typescript
export const IERC20 = new utils.Interface(require("../abi/IERC20.json"));
```

## 编码paymaster参数

实用方法，为普通[paymaster flows](.../.../dev/developer-guides/aa.md#built-in-paymaster-flows)返回正确形成的`paymasterParams`对象。

```typescript
export function getPaymasterParams(paymasterAddress: Address, paymasterInput: PaymasterInput): PaymasterParams
```

`PaymasterInput`的定义可以在[这里](./types.md)找到。

## 有用的气体常数

目前，没有任何方法可以准确估计所需的 "gasPerPubdataLimit"。这就是为什么目前强烈建议提供`DEFAULT_GAS_PER_PUBDATA_LIMIT'。用户不会因为提供它而被收取更多的费用。
以后就可以查询当前推荐的限额了。

```typescript
const GAS_PER_PUBDATA_BYTE = 17;

// The large L2 gas per pubdata to sign. This gas is enough to ensure that
// any reasonable limit will be accepted. Note, that the operator is NOT required to
// use the honest value of gas per pubdata and it can use any value up to the one signed by the user.
// In the future releases, we will provide a way to estimate the current gasPerPubdata.
export const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;

export const RECOMMENDED_GAS_LIMIT = {
    DEPOSIT: 600_000,
    EXECUTE: 620_000,
    ERC20_APPROVE: 50_000
};
```
