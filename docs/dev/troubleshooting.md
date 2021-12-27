# Troubleshooting

While zkSync 2.0 is in alpha, we will put known (and not fixed yet) bugs here as well as workarounds for them.

## Metamask native transfers not working

It is not currently possible to transfer ERC-20s inside the Metamask interface.

**Solution.** For now, transfers inside zkSync you should be done via the [zkSync Wallet](https://zqgai-staging-wallet-v2.zksync.dev) dApp. The tutorial on using the wallet can be found [here](./tutorials/bridging-funds.md).

## Metamask native contract interactions not working

It is not currently possible to interact with zkSync smart contracts via Metamask with EIP-1559 transactions. The reason for that is that Metamask tries to override several EIP-1559 transaction fields (assuming they can not have zero value), while these fields should be zero for zkSync.

**Solution.** Explicitly specify `{ type: 0 }` in transaction overrides to use Ethereum legacy transactions.
