# Troubleshooting

While zkSync 2.0 is in alpha, we will put known (and not fixed yet) bugs here as well as workarounds for them.

## Metamask native transfers not working

It is not currently possible to transfer ERC-20s inside the Metamask interface.

**Solution.** For now, transfers inside zkSync you should be done via the [zkSync Wallet](https://zqgai-staging-wallet-v2.zksync.dev) dApp. The tutorial on using the wallet can be found [here](./tutorials/bridging-funds.md).

## Metamask native contract interactions not working

It is not currently possible to interact with zkSync smart contracts via Metamask with EIP-1559 transactions. The reason for that is that Metamask tries to override several EIP-1559 transaction fields (assuming they can not have zero value), while these fields should be zero for zkSync.

**Solution.** Explicitly specify `{ type: 0 }` in transaction overrides to use Ethereum legacy transactions.

## Transfers with the _entire_ token balance fail

If you try to transfer the entire balance of a token, which is also the token you pay the fee with, the transaction fails. The reason is that we don’t deduct the fee before setting the amount to be transferred.

**Solution.** Keep aside a small a amount to cover the fee.

## Errors before sending a transaction

Similar to above, in cases where the fee should be deducted from the token amount, you may get an error if estimate_gas returns an error.

**Solution.** As above, make sure to keep aside a small amount to cover the fee.

## Fee in USDC (or WBTC) is absurdly high

This is an issue with the number of the decimal point in the USDC token.

**Solution.** You can pay fees in other token, though USDC on L1 is ``cheap''.

## Fee within the wallet is only in ETH

See the previous issue. We disabled other fee paying tokens until it’s resolved.

## The ‘Block Explorer’ link on the wallet is broken

**Solution.** Please use the following link [https://zksync-v2-testnet.zkscan.io/](https://zksync-v2-testnet.zkscan.io).

## My contract does not compile, due to an error with “cyclic dependencies”

Unfortunately, some contracts have trouble to compile with our hardhat plugin. This is due to the contracts importing external dependencies. This happens to a small number of projects. We are currently working on resolving this issue.

## My transaction is not shown on the block explorer

**Solution.** Please wait several minutes, the transaction will show in 5-15 minutes.
<br> As indication that it went through, you can see on your account page on the block explorer, that the correct amount of tokens (after processing your transactions) is shown
under the “Tokens” drop-down box at the top of the page.

## Wallet has no funds / Contract disappeared

We are expected to update our testnet continuously, and so from time to time, we will need to do a re-genesis. This will cause the entire state to reset, and all deployed contracts will cease to exist.

**We will communicate re-genesis events before they happen!**
