# Bridging assets

## Introduction

Bridging is implemented by having two contracts 
(one deployed to L1, and the second deployed to L2)
communicating with each other using [L1 <-> L2 interoperability](./l1-l2-interop.md).

Developers are free to build their bridge for any token.
However, we are providing our default bridges (one for ETH and one for ERC20 tokens), which can be used for developers to use basic bridging.

::: warning

Addresses of tokens on L2 will always differ from L1 addresses.

:::


## Default bridges

You can get default bridges' addresses using the `zks_getBridgeContracts` endpoint or `getDefaultBridgeAddresses` method of `Provider` in our JS SDK.

### Deposits
User make transactions to the L1 bridge by calling the `deposit` method. The following actions are then being executed:

- L1 tokens are being sent to the L1 bridge and become locked there.
- The L1 bridge initiates a transaction to the L2 bridge using L1 -> L2 communication.

Within the L2 transaction, tokens are minted and sent to the specified address on L2.

For every executed L1 -> L2 transaction there will be an L2 -> L1 log message confirming its execution.

If this transaction fails for any reason (for example, the provided fee is too low)
then the log message will state its failure.
In this case the inclusion of the log can be proven on the L1 bridge to return the deposited funds.

The log message described above is not fully supported by our SDK on our current testnet.

### Withdrawals
The user makes a transaction to the L2 bridge by calling the `withdraw` method. The following actions are then being executed:

- L2 tokens are being burnt.
- An L2 -> L1 message with the information about the withdrawal is being sent.

After that, anyone can finalize the withdrawal on the L1 bridge by proving the inclusion of the L2 -> L1 message, and the funds will be sent to the withdrawal recipient.

For the testnet, we automatically finalize all withdrawals,
i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.
