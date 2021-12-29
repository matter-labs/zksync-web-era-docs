# Anticipated changes

## Features to be released soon

- **More developer tooling.** Composability between various hardhat plugins with the zkSync plugin, easy local setup with Docker, etc. will be essential for the growth of the ecosystem.
- **L1 <> L2 interoperability.** L1 <> L2 calls are very important for bridges, cross-layer governance protocols, etc.
- **Support for Vyper and older versions of Solidity.** We are actively working on supporting different versions of Solidity to enable seamless integration for the existing projects.
- **Priority mode implementation.** Even if the zkSync operators go down, the users must be able to withdraw their funds from the protocol. The priority mode is the mode that is triggered when the operator becomes malicious or unavailable. It allows anyone to become an operator and process transactions.
- **zkPorter extension.** One of the biggest and most important features. It will let the users choose between high security & 20x fee reduction compared to Ethereum for zkRollup accounts and security much higher than that of a sidechain & near-constant tx costs of a few USD cents for zkPorter accounts.
- **Account abstractions.** Imagine being able to implement custom logic for signature checking for your account. Or maybe social recovery? Currently, on most of the EVM chains, users need to deploy smart contract wallets for such purposes. All of this would be easily supported with account abstractions.
