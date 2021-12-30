# Feature support status

## Currently supported features

- **Native support of ECDSA signatures.** Unlike the first version of zkSync and most of the ZK Rollups, no special operation is required to register the user's private key. Any account can be managed in L2 with the same private key that is used for L1.
- **Solidity 0.8.x support.** No need for change or re-audit of the codebase.
- **Web3 API**. With small exceptions, our API is fully compatible with Ethereum. This allows seamless integration with existing indexers, explorers, etc.
- **Support for Ethereum cryptographic primitives**. zkSync natively supports `keccak256`, `sha256`, and `ecrecover` via precompiles.
- **Hardhat plugin**. Which allows easy testing and development of smart contracts on zkSync.

## Features to be released soon

- **More developer tooling.** Composability between various hardhat plugins with the zkSync plugin, easy local setup with Docker, etc. will be essential for the growth of the ecosystem.
- **Priority mode implementation.** Even if the zkSync operators go down, the users must be able to withdraw their funds from the protocol. The priority mode is the mode that is triggered when the operator becomes malicious or unavailable. It allows anyone to become an operator and process transactions.
- **L1 -> L2 smart contract calls.**

## Features to be released after the private testnet

- **L2 -> L1 smart contract calls.**
- **Support for Vyper and older versions of Solidity.** We are actively working on supporting different versions of Solidity to enable seamless integration for the existing projects.
- **zkPorter extension.** One of the biggest and most important features. It will let the users choose between high security & 20x fee reduction compared to Ethereum for zkRollup accounts and security much higher than that of a sidechain & near-constant tx costs of a few USD cents for zkPorter accounts.
- **Account abstractions.** Imagine being able to implement custom logic for signature checking for your account. Or maybe social recovery? Currently, on most of the EVM chains, users need to deploy smart contract wallets for such purposes. All of this would be easily supported with account abstractions.
