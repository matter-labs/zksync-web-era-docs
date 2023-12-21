---
head:
  - - meta
    - name: "twitter:title"
      content: Provider | zkSync Docs
---

# Provider

## `Provider` Class

#### Overview

The `Provider` class in zkSync Era extends the functionalities of `ethers.providers.JsonRpcProvider`. It is designed to interact with zkSync-specific methods while retaining all features of the Ethers.js provider.

#### `constructor` Method

The constructor initializes a new `Provider` object.

**Parameters**

| Parameter | Type                          | Description                | Example                            |
| --------- | ----------------------------- | -------------------------- | ---------------------------------- |
| `url`     | string or `ConnectionInfo`    | Network RPC URL (optional) | `"https://testnet.era.zksync.dev"` |
| `network` | `ethers.providers.Networkish` | Network name (optional)    | `"testnet"`                        |

**Example Usage**

{% code overflow="wrap" lineNumbers="true" %}

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://testnet.era.zksync.dev");
```

{% endcode %}

#### Try out initializing a provider

{% embed url="https://stackblitz.com/edit/typescript-m4nvot?embed=1&file=index.ts" %}
Stackblitz setup for gas estimation
{% endembed %}
