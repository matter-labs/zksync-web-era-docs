# Bridging assets

## Introduction

Bridging is implemented by having two contracts 
(one deployed to L1, and the second deployed to L2)
communicating with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

Developers are free to build their own bridge for any token.
However, we provide our default bridges (one for ETH and one for ERC20 tokens), which can be used for basic bridging.

::: warning

Addresses of tokens on L2 will always differ from the same token L1 address.

:::


## Default bridges

You can get default bridges' addresses using the `zks_getBridgeContracts` endpoint or `getDefaultBridgeAddresses` method of `Provider` in our JS SDK (similar methods are available in the other SDKs).

### Deposits (to L2)
Users must call the `deposit` method on the L1 bridge contract, which will trigger the following actions:

- The user's L1 tokens will be sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.
- Within the L2 transaction, tokens will be minted and sent to the specified address on L2.
    - If the token does not exist on zkSync yet, a new contract is deployed for it. Given the L2 token address is deterministic (based on the original L1 address, name and symbol), it doesn't matter who is the first person bridging it, the new L2 address will be the same.
- For every executed L1 -> L2 transaction, there will be an L2 -> L1 log message confirming its execution.

::: warning

If this transaction fails for any reason (for example, the provided fee is too low) the log message will state its failure.
In this case, the inclusion of the log can be proven on the L1 bridge to return the deposited funds to the original sender by calling the method `claimFailedDeposit`.

:::

The log message described above is not yet fully supported by our SDK but is available on the L1 bridge contract.

### Withdrawals (to L1)
Users must call the `withdraw` method on the L2 bridge contract, which will trigger the following actions:

- L2 tokens will be burned.
- An L2 -> L1 message with the information about the withdrawal will be sent.
- After that, the withdrawal action will be available to be finalized by anyone in the L1 bridge (by proving the inclusion of the L2 -> L1 message, which is done when calling the `finlizeWithdraw` method on the L1 bridge contract).
- After the method is called, the funds are unlocked from the L1 bridge and sent to the withdrawal recipient.

::: warning

On the testnet environment, we automatically finalize all withdrawals, i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.

:::
