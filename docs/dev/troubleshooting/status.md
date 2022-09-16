# Feature support status

## Currently supported features

- **Native support of ECDSA signatures.** Unlike the first version of zkSync and most of ZK rollups, no special operation is required to register the user's private key. Any account can be managed on L2 with the same private key that is used on L1.
- **Solidity 0.8.x and Vyper support.** No need for change or re-audit of the codebase.
- **Web3 API**. With small exceptions, our API is fully compatible with Ethereum. This enables seamless integration with existing indexers, explorers, etc.
- **Support for Ethereum cryptographic primitives**. zkSync natively supports `keccak256`, `sha256`, and `ecrecover` via precompiles.
- **Hardhat plugin**. This allows easy testing and development of smart contracts on zkSync.
- **L1 <-> L2 smart contract communication**.

## Features to be released soon

- **More developer tooling.** Composability between various hardhat plugins with the zkSync plugin, easy local setup with Docker, etc. will be essential for the growth of the ecosystem.
- **Support for older versions of Solidity.** We are actively working on supporting different versions of Solidity to enable seamless integration for the existing projects.
- **zkPorter extension.** One of the biggest and most important features. It will let the users choose between high security & 20x fee reduction compared to Ethereum for zkRollup accounts and security much higher than that of a sidechain & near-constant transaction costs of a few USD cents for zkPorter accounts.
