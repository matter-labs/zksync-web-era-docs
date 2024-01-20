---
head:
  - - meta
    - name: "twitter:title"
      content: Block | zkSync Docs
---

# Block Instructions

## [BLOCKHASH](https://www.evm.codes/#40?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L47) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [COINBASE](https://www.evm.codes/#41?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L150) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [TIMESTAMP](https://www.evm.codes/#42?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L98) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [NUMBER](https://www.evm.codes/#43?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L81) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [PREVRANDAO](https://www.evm.codes/#44?fork=shanghai) | [DIFFICULTY](https://www.evm.codes/#44?fork=grayGlacier)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L133) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [GASLIMIT](https://www.evm.codes/#45?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L13) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [CHAINID](https://www.evm.codes/#46?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L64) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## [SELFBALANCE](https://www.evm.codes/#47?fork=shanghai)

Implemented as [BALANCE](./environment.md#balance) with an [ADDRESS](./environment.md#address) as its argument.

## [BASEFEE](https://www.evm.codes/#48?fork=shanghai)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts.md#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L167) is common for Yul and EVMLA representations.

The request to the System Contract is done via the [SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.
