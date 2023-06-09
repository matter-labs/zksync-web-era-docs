# Bridging assets

Bridging is when two contracts (one deployed to L1, and the other deployed to L2)
communicate with each other with [L1 <-> L2 interoperability](./l1-l2-interop.md).

## Bridges
### Default bridges

Developers are free to build their own bridge for any token. However, we provide default bridges for ETH and other ERC-20 tokens.

:::info
- Use the [`zks_getBridgeContracts`](../../../api/api.md#zks_getbridgecontracts) endpoint or [`getDefaultBridgeAddresses`](../../../api/js/providers.md#getdefaultbridgeaddresses) method to get the default bridge addresses. 
- Similar methods are available in the other SDKs.
:::

### Custom bridges on L1 and L2

To build a custom bridge, create a regular Solidity contract which extends the correct interface for the layer. The interfaces provide access to the zkSync Era SDK deposit and withdraw implementations.

- L1: [IL1Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/interfaces/IL1Bridge.sol)

  For more information, check out our example [L1 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/L1ERC20Bridge.sol).


- L2: [L2ERC20Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol)

  For more information, check out our example [L2 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol).

## Adding tokens to the zkSync Era bridge

While you can use the zkSync Era standard bridges for any token, without needing permission from a smart contract perspective, the UI only displays tokens that have been added to our SDK. 

If you would like to add a token to the UI, submit a request by filling out the [token request form](https://5p68rkvrcqg.typeform.com/to/NbYpe2pw). Our team will review your request, and get back to you.

::: warning
Token addresses on L2 always differ from the same token addresses on L1.
:::

## Deposits (to L2)

To deposit assets to L2 via the bridge, call the [`deposit`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/ethereum/contracts/bridge/interfaces/IL1Bridge.sol#L21) method on the L1 bridge contract. 

Doing so triggers the following:

- The L1 tokens are sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.
- As part of the transaction, tokens are minted and sent to the specified L2 address.
  - If the token contract does not exist on zkSync Era, a new contract is deployed. The new L2 token address is deterministically derived based on the original L1 address, name, and symbol.
- For every executed L1 -> L2 transaction, there is an L2 -> L1 log message confirmation.
- Lastly, the [`finalizeDeposit`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/zksync/contracts/bridge/L2ERC20Bridge.sol#L62) method on the L2 bridge is called. This call finalizes the deposit and mints the funds on L2.

:::info
Learn [how to deposit assets via the bridge](../../how-to/deposit-via-bridge.md).
:::

## Withdrawals (to L1)

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../../troubleshooting/withdrawal-delay.md).
:::

To withdraw assets to L1, call the [`withdraw`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/zksync/contracts/bridge/L2ERC20Bridge.sol#L104) method on the L2 bridge contract. 

Doing so triggers the following:

- The L2 tokens are burned.
- An L2 -> L1 message with the information about the withdrawal is sent.
- The withdrawal is then available for finalizing on the L1 bridge.
- Finalizing occurs on calling the [`finalizeWithdrawal`](https://github.com/matter-labs/era-contracts/blob/6391c0d7bf6184d7f6718060e3991ba6f0efe4a7/ethereum/contracts/bridge/interfaces/IL1Bridge.sol#L40) method on the L1 bridge contract which proves the inclusion of the L2 -> L1 message.
- The funds are unlocked from the L1 bridge and sent to the recipient.

:::note
- zkSync Era testnet automatically finalizes all withdrawals.
- This means that for every testnet withdrawal, an L1 transaction proves the inclusion for the message.
:::

:::info
Learn [how to withdraw assets via the bridge](../../how-to/withdraw-via-bridge.md).
:::