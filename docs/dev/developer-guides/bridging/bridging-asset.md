# Bridging assets

## Introduction

Bridging is when two contracts (one deployed to L1, and the other deployed to L2)
communicate with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

Developers are free to build their own bridge for any token. However, we provide default bridges (one for ETH and one for ERC20 tokens), which can be used for basic bridging.

::: warning
Token addresses on L2 always differ from the same token address on L1.
:::

## Default bridges

You can get the default bridge addresses using the [`zks_getBridgeContracts`](../../../api/api.md#zks_getbridgecontracts) endpoint or [`getDefaultBridgeAddresses`](../../../api/js/providers.md#getdefaultbridgeaddresses) method of `Provider`. 

Similar methods are available in the other SDKs.

## Adding tokens to the zkSync Era bridge

While the zkSync Era standard bridge can be used without permission from a smart contract perspective, the UI only displays tokens that have been added to our SDK. 

If you would like to add a token, submit a request by filling out the [token request form](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). Our team will review your request, and get back to you if we have any outstanding questions before adding the token to our list.

## Deposits (to L2)

Read the [how to deposit assets via the bridge](../../how-to/deposit-via-bridge.md) document for instructions on depositing assets on L2.

## Withdrawals (to L1)

Read the [how to withdraw assets via the bridge](../../how-to/withdraw-via-bridge.md) document for instructions on withdrawing assets to L1.