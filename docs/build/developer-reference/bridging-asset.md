---
head:
  - - meta
    - name: "twitter:title"
      content: Bridging Assets | zkSync Docs
---

# Bridging Assets

Users can deposit and withdraw assets from zkSync Era using any of the [multiple bridges](https://zksync.io/explore#bridges).

Under the hood, bridging is implemented by having two contracts
(one deployed to L1, and the second deployed to L2)
communicating with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

Developers are free to build their own [custom bridge for any token](#custom-bridges-on-l1-and-l2) however, we provide default bridges (one for ETH and one for ERC20 tokens), which can be used for basic bridging.

::: warning

Addresses of tokens on L2 will always differ from the same token L1 address. Also note, that tokens bridged via the default bridge only support standard ERC20 functionality, i.e. rebase tokens and other custom behavior are not supported.

:::

## Default bridges

You can get the default bridge addresses using the [`zks_getBridgeContracts`](../api.md#zks-getbridgecontracts) endpoint or [`getDefaultBridgeAddresses`](../sdks/js/providers.md#getdefaultbridgeaddresses) method of `Provider`. Similar methods are available in the other SDKs.

### Deposits (to L2)

Users must call the `deposit` method on the L1 bridge contract, which triggers the following actions:

- The user's L1 tokens will be sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.
- Within the L2 transaction, tokens will be minted and sent to the specified address on L2.
  - If the token does not exist on zkSync yet, a new contract is deployed for it. Given the L2 token address is deterministic (based on the original L1 address, name and symbol), it doesn't matter who is the first person bridging it, the new L2 address will be the same.
- For every executed L1 -> L2 transaction, there will be an L2 -> L1 log message confirming its execution.
- Lastly, the `finalizeDeposit`method is called and it finalizes the deposit and mints funds on L2.

You can find example scripts to deposit ETH and ERC20 tokens using the default bridges in the how-to section of the docs.

### Withdrawals (to L1)

:::tip

- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**.
- For more information, read the [withdrawal delay guide](../support/withdrawal-delay.md).
  :::

Users must call the `withdraw` method on the L2 bridge contract, which will trigger the following actions:

- L2 tokens will be burned.
- An L2 -> L1 message with the information about the withdrawal will be sent.
- After that, the withdrawal action will be available to be finalized by anyone in the L1 bridge (by proving the inclusion of the L2 -> L1 message, which is done when calling the `finalizeWithdrawal` method on the L1 bridge contract).
- After the method is called, the funds are unlocked from the L1 bridge and sent to the withdrawal recipient.

::: warning
On the testnet environment, we automatically finalize all withdrawals, i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.
:::

## Custom bridges on L1 and L2

To build a custom bridge, create a regular Solidity contract which extends one of the interfaces mentioned below for the layer. The interfaces provide access to the zkSync Era SDK deposit and withdraw implementations.

- L1: [IL1Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/bridge/interfaces/IL1Bridge.sol)

  For more information, check out our example [L1 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/bridge/L1ERC20Bridge.sol).

- L2: [IL2Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/bridge/interfaces/IL2Bridge.sol)

  For more information, check out our example [L2 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/bridge/L2ERC20Bridge.sol).

## Adding Tokens to the Bridge UI

No action is required to add tokens to the bridge UI. All tokens are automatically recognized based on user balances. If you desire for your token to display an icon or price, refer to the [Token Listing Guide](../support/faq.md#token-listing).
