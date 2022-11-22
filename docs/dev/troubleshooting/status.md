# Feature support status

::: tip Call for feedback

As we add new features, this page is constantly updated.

If any of these block you, let us know on our [Discord](https://join.zksync.dev/), so we can prioritize accordingly.

:::

## Using libraries in Solidity

If a Solidity library can be inlined, i.e. it only contains `private` or `internal` methods, then this library can be used without any limitations.

However, if a library contains at least one `public` or `external` method, it is no longer inlined in the Yul representation. These addresses need to be passed explicitly to our compiler. This is not currently supported by our hardhat plugin but will be added later.

For support on an older version of Solidity and Vyper, check [here](../developer-guides/contracts/contracts.md#solidity-vyper-support)

## Unsupported opcodes

- `SELFDESTRUCT` (it’s considered harmful and there are calls to deactivate it on L1).
- `EXTCODECOPY` (it can be implemented if needed, but we skip it for now because zkEVM opcodes are not identical to EVM ones anyway).
- `CALLCODE` (deprecated on Ethereum in favor of `DELEGATECALL`).
- `CODECOPY` - (It does not return 0, but produces a compile error).
## Ignored by the compiler

- `PC` always returns `0` (since solidity is 0.7.0, it is not accessible in Yul and Solidity).

## Precompiles

- zkSync natively supports `keccak256`, `sha256`, and `ecrecover` via precompiles.

## Currently supported features

- **Native support of ECDSA signatures.** Unlike the first version of zkSync and most zk rollups, no special operation is required to register the user's private key. Any account can be managed on L2 with the same private key that is used on L1.
- **Solidity 0.8.x and Vyper support.** No need for change or re-audit of the codebase.
- **Web3 API**. With small exceptions, our API is fully compatible with Ethereum. This enables seamless integration with existing indexers, explorers, etc.
- **Hardhat plugin**. This allows easy testing and development of smart contracts on zkSync.
- **L1 <-> L2 smart contract communication**.

## Features to be released soon

- **More developer tooling.** Composability between various hardhat plugins with the zkSync plugin, easy local setup with Docker, etc. will be essential for the growth of the ecosystem.
- **Support for older versions of Solidity.** We are actively working on supporting different versions of Solidity to enable seamless integration for the existing projects.
- **zkPorter extension.** One of the biggest and most important features. It will let the users choose between high security & 20x fee reduction compared to Ethereum for zkRollup accounts and security much higher than that of a sidechain & near-constant transaction costs of a few USD cents for zkPorter accounts.
