# Bridging funds

## Introduction

Bridging is implemented by having two contracts 
(one deployed to L1, and the second deployed to L2)
communicating with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

There are two dedicated transaction types for native token bridging:

- `Deposit` for bridging tokens to zkSync.
- `Withdraw` for bridging tokens from zkSync.

Developers are free to build their own bridge for any token.
However, we are providing our default bridges (one for ETH and one for ERC20 tokens), which can be used for developers to use basic bridging.

::: warning

Addresses of tokens on L2 may differ from the L1

:::


## Default bridges

You can get default bridges' addresses using `zks_getBridgeContracts` endpoint
or `getDefaultBridgeAddresses` method of `Provider` in our JS SDK.

### Deposits

User sends a transaction to the L1 bridge calling `deposit` method, and these actions are getting done within it:

- L1 tokens are being sending to the L1 bridge and become locked there.
- L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.

Within the L2 transaction tokens are being minting to the specified address on L2.

If this transaction fails for any reason (for example provided fee is too low)
then the L2 -> L1 message is being sending.
In this case the inclusion of the message can be proven on L1 bridge to return deposited funds back.

### Withdrawals

User sends a transaction to the L2 bridge calling `withdraw` method, and these actions are getting done within it:

- L2 tokens are being burning.
- L2 -> L1 message with the information about the withdrawal is being sending.

After that anyone can finalize the withdrawal on L1 bridge by proving the inclusion of L2 -> L1 message and funds will be sent to the withdrawal recipient.

For the testnet we are automatically finalizing all the withdrawals.
