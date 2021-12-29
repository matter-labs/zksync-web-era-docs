# Current status

## Features that are available now 

- **Native support of ECDSA signatures.** Unlike the first version of zkSync and most of the ZK Rollups, no special operation is required to register the user's private key. Any account can be managed in L2 with the same private key that is used for L1.
- **Solidity 0.8.x support.** No need for change or re-audit of the codebase.
- **Web3 API**. With small exceptions, our API is fully compatible with Ethereum. This allows seamless integration with existing indexers, explorers, etc.
- **Support for Ethereum cryptographic primitives**. zkSync natively supports `keccak256`, `sha256`, and `ecrecover` via precompiles.
- **Hardhat plugin**. Which allows easy testing and development of smart contracts on zkSync.
