---
head:
  - - meta
    - name: "twitter:title"
      content: Foundry | zkSync Docs
---

# Foundry with zkSync

## Overview

`foundry-zksync` is a specialized fork of [Foundry](https://github.com/foundry-rs/foundry), tailored for zkSync. It extends Foundry's capabilities for Ethereum app development to support zkSync, allowing for the compilation, deployment, testing, and interaction with smart contracts on zkSync. `foundry-zksync` introduces `--zksync` flag, or the use of `vm.zkVm(true)` to target the zkSync VM.

### Status and Contribution

`foundry-zksync` is currently in its **alpha stage**, indicating ongoing development and potential for future enhancements. It is open-sourced, and contributions from the developer community are welcome. For more details and contributions, visit the [GitHub repository](https://github.com/matter-labs/foundry-zksync).

### Features and Limitations

### Features

`Foundry-zksync` offers a set of features designed to work with zkSync, providing a comprehensive toolkit for smart contract deployment and interaction:

- **Smart Contract Deployment**: Easily deploy smart contracts to zkSync mainnet, testnet, or a local test node.
- **Asset Bridging**: Bridge assets between L1 and L2, facilitating seamless transactions across layers.
- **Contract Interaction**: Call and send transactions to deployed contracts on zkSync testnet or local test node.
- **Solidity Testing**: Write tests in Solidity for a familiar testing environment.
- **Fuzz Testing**: Benefit from fuzz testing, complete with shrinking of inputs and printing of counter-examples.
- **Remote RPC Forking**: Utilize remote RPC forking mode.
- **Flexible Debug Logging**: Choose your debugging style:
  - DappTools-style: Utilize DsTest's emitted logs for debugging.
  - Hardhat-style: Leverage the popular console.sol contract.
- **Configurable Compiler Options**: Tailor compiler settings to your needs, including LLVM optimization modes.

### Limitations

While `foundry-zksync` is **alpha stage**, there are some limitations to be aware of, but not limited to:

- **Compile Time**: Some users may experience slow compiling.
- **Specific Foundry Features**: Currently features such as `coverage`, `--gas-report` or `--verify` may not work as intended. We are actively working on providing support for these feature types.
- **Compiling Libraries**: Compiling non-inlinable libraries requires deployment and adding to configuration. For more information please refer to [official docs](https://era.zksync.io/docs/tools/hardhat/compiling-libraries.html).

  ```
  # In foundry.toml
  libraries = [
      "src/MyLibrary.sol:MyLibrary:0xfD88CeE74f7D78697775aBDAE53f9Da1559728E4"
  ]
  ```

::: info
We are actively working to resolve limitations listed. Please check back on future releases for updates.
:::
