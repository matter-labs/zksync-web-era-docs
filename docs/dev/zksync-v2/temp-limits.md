# Temporary limitations

::: tip Call for feedback

As we add new features, this page is constantly updated.

If any of these block you, let us know on our [discord](https://discord.gg/px2aR7w), so we can prioritize accordingly.

:::

## Using libraries in Solidity

If a Solidity library can be inlined, i.e. it only contains `private` or `internal` methods, then this library can be used without any limitations.

However, if a library contains at least one `public` or `external` method, it is no longer inlined in the Yul representation. These addresses need to be passed explicitly to our compiler. This is not currently supported by our hardhat plugin, but will be added later.

## Unsupported opcodes

- `SELFDESTRUCT` (it’s considered harmful and there are calls to deactivate it on L1).
- `EXTCODECOPY` (it can be implemented if needed, but we skip it for now because zkEVM opcodes are not identical to EVM ones anyway).
- `CALLCODE` (deprecated on Ethereum in favor of `DELEGATECALL`).

## Temporarily simulated by constant values

These opcodes will be supported by the time of the mainnet launch.

- `block.gaslimit` always returns `2^32-1`.
- `MSIZE` always returns `2^16`.
- `COINBASE` (`block.coinbase`) always returns the [bootloader](./system-contracts.md#bootloader) address.
- `DIFFICULTY` (`block.difficulty`) always returns `2500000000000000` (zkSync does not have proof of work consensus).

## Ignored by the compiler

- `PC` always returns `0` (since solidity 0.7.0, it is not accessible in Yul and Solidity).

## Precompiles

- We currently only support `sha256` and `erecover`. We don't support any other precompiles!
