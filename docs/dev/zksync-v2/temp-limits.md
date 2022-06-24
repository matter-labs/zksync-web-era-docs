# Temporary limitations

::: tip Call for feedback

As we add new features, this page is constantly updated. Most of the issues listed here (especially around the opcodes) will be resolved by the time of the mainnet launch.  

If any of these block you, let us know on our [discord](https://discord.gg/px2aR7w), so we can prioritize accordingly.

:::

## Using libraries in Solidity

If a Solidity library can be inlined, i.e. it only contains `private` or `internal` methods, then this library can be used without any limitations.

However, if a library contains at least one `public` or `external` method, it is no longer inlined in the Yul representation. These addresses need to be passed explicitly to our compiler. This is not currently supported by our hardhat plugin, but will be added later.

## Unsupported opcodes

#### Returning constant value

- `block.gaslimit` always returns `2^32-1`.
- `MSIZE` always returns `2^16`.
- `GASLIMIT` (`tx.gasprice`) always returns `0`.
- `ORIGIN` (`tx.origin`) always returns `0`.
- `GASPRICE` (`tx.gasprice`) always returns `0`.
- `CHAINID` (`chain_id`) always returns `0`.
- `BLOCKHASH` (`tx.blockhash`) always returns `0`.
- `DIFFICULTY` (`block.difficulty`) always returns `0`.
- `PC` always returns `0`.
- `COINBASE` (`block.coinbase`) always returns `0`.

#### NOOP

- `EXTCODECOPY`
- `SELFDESTRUCT` (`selfdestruct(addr)`)
- `CALLCODE` (`callcode`)
