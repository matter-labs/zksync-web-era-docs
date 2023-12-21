---
head:
  - - meta
    - name: "twitter:title"
      content: Account | zkSync Docs
---

# Account

### Account Methods

The account methods in the zkSync Era JS SDK offer functionalities tailored to manage and inquire about accounts within zkSync Era. These methods facilitate tasks such as fetching balances, retrieving account details, and more.&#x20;

At the bottom of this section, you'll find hands-on demonstrations using Stackblitz for each of the account method operations.

### **`getAllAccountBalances` Method**

#### **Overview**

The `getAllAccountBalances` method facilitates a lookup of all confirmed token balances for a given account address. It leverages the underlying `zks_getAllAccountBalances` JSON-RPC call to perform this retrieval.

#### **Method Signature**

```typescript
getAllAccountBalances(address: Address): Promise<BalancesMap>
```

**Parameters**

| Parameter | Type      | Description                                                                         |
| --------- | --------- | ----------------------------------------------------------------------------------- |
| `address` | `Address` | Represents the Ethereum address for which the confirmed token balances are desired. |

**Return Value**\
Returns a Promise that resolves to a `BalancesMap`. The `BalancesMap` holds token symbols/IDs as its keys and their corresponding balances (expressed as BigNumbers) as its values.

**Example Usage**

Here's how you can use `getAllAccountBalances` to obtain all the confirmed token balances for a specific address:

{% code overflow="wrap" lineNumbers="true" %}

```typescript
import { Provider } from "zksync-web3";
import { BigNumber } from "ethers";

// Initialize a new Provider instance
const provider = new Provider("https://testnet.era.zksync.dev");

// Define the address
const address = "0xa1Cc678Ff30Fe601023Dbe6b62271fbf26E4760f";

// Fetch all account balances
const balances = await provider.getAllAccountBalances(address);

// Log each token's balance
for (let token in balances) {
  console.log(`Balance for ${token}: ${balances[token].toString()}`);
}
```

{% endcode %}

### `getBalance` Method

#### Overview

The `getBalance` method returns the user's balance for a specified token on a given block. The balance is returned as a `BigNumber` object. If the block and token are not supplied, the method defaults to fetching the balance for the latest committed block and for ETH.

#### Method Signature

```typescript
async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address): Promise<BigNumber>
```

#### Parameters

| Name            | Type       | Description                                                                 |
| --------------- | ---------- | --------------------------------------------------------------------------- |
| `address`       | `Address`  | User's address.                                                             |
| `blockTag?`     | `BlockTag` | Block tag for fetching the balance. Defaults to the latest committed block. |
| `tokenAddress?` | `Address`  | The address of the token. Defaults to ETH.                                  |

#### Return Value

Returns a `Promise` that resolves to a `BigNumber` object representing the user's balance for the specified token on the given block.

#### Example Usage

{% code overflow="wrap" lineNumbers="true" %}

```typescript
import { Provider } from "zksync-web3";

const provider = new Provider("https://testnet.era.zksync.dev");

const USDC_L2_ADDRESS = "0x0faF6df7054946141266420b43783387A78d82A9";
// Get the USDC balance from your account using your address.
console.log(await provider.getBalance("0xa1Cc678Ff30Fe601023Dbe6b62271fbf26E4760f", "latest", USDC_L2_ADDRESS));

// Getting ETH balance
console.log(await provider.getBalance("0xa1Cc678Ff30Fe601023Dbe6b62271fbf26E4760f"));
```

{% endcode %}
