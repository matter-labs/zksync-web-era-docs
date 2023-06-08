# Bridging assets

## Introduction

Bridging is when two contracts (one deployed to L1, and the other deployed to L2)
communicate with each other with [L1 <-> L2 interoperability](./l1-l2-interop.md).

## Default bridges

Developers are free to build their own bridge for any token. However, we provide default bridges (one for ETH and one for other ERC20 tokens).

You can get the default bridge addresses using the [`zks_getBridgeContracts`](../../../api/api.md#zks_getbridgecontracts) endpoint or [`getDefaultBridgeAddresses`](../../../api/js/providers.md#getdefaultbridgeaddresses) method. 

Similar methods are available in the other SDKs.

## Adding tokens to the zkSync Era bridge

While you can use the zkSync Era standard bridges without needing permission from a smart contract perspective, the UI only displays tokens that have been added to our SDK. 

If you would like to add a token to the UI, submit a request by filling out the [token request form](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). Our team will review your request, and get back to you.

::: warning
Token addresses on L2 always differ from the same token addresses on L1.
:::

## Deposits (to L2)

To deposit assets to L2 via the bridge, call the `deposit` method on the L1 bridge contract. This triggers the following:

- The L1 tokens are sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.
- Within the transaction, tokens are minted and sent to the specified L2 address.
  - If the token does not exist on zkSync Era yet, a new contract is deployed for it. The new L2 token address is deterministic. It is based on the original L1 address, name, and symbol.
- For every executed L1 -> L2 transaction, there is an L2 -> L1 log message confirmation.
- Lastly, the `finalizeDeposit` method is called which finalizes the deposit and mints the funds on L2.

Learn [how to deposit assets via the bridge](../../how-to/deposit-via-bridge.md).

## Withdrawals (to L1)

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../../troubleshooting/withdrawal-delay.md).
:::

To withdraw assets to L1, call the `withdraw` method on the L2 bridge contract. This triggers the following actions:

- The L2 tokens are burned.
- An L2 -> L1 message with the information about the withdrawal is sent.
- The withdrawal is then available for finalizing on the L1 bridge.
- Finalizing occurs on calling the `finalizeWithdrawal` method on the L1 bridge contract which proves the inclusion of the L2 -> L1 message.
- The funds are unlocked from the L1 bridge and sent to the recipient.

:::tip
- The testnet automatically finalizes all withdrawals.
- This means that for every withdrawal, an L1 transaction proves the inclusion for each message.
:::

Learn [how to withdraw assets via the bridge](../../how-to/withdraw-via-bridge.md).