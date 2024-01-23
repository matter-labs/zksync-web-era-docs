---
head:
  - - meta
    - name: "twitter:title"
      content: Return | zkSync Docs
---

# Return Instructions

## STOP

Original [EVM](https://www.evm.codes/#00?fork=shanghai) instruction.

This instruction is a [RETURN](#return) with an empty data payload.

### LLVM IR

The same as for [RETURN](#return).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L103) is common for Yul and EVMLA representations.

## RETURN

Original [EVM](https://www.evm.codes/#f3?fork=shanghai) instruction.

This instruction works differently in deploy code. For more information, see [the zkSync Era documentation](https://era.zksync.io/docs/reference/architecture/differences-with-ethereum.html#return).

### LLVM IR

```llvm
define void @__return(i256 %0, i256 %1, i256 %2) "noinline-oz" #5 personality i32()* @__personality {
entry:
  %abi = call i256@__aux_pack_abi(i256 %0, i256 %1, i256 %2)
  tail call void @llvm.syncvm.return(i256 %abi)
  unreachable
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L16) is common for Yul and EVMLA representations.

## REVERT

Original [EVM](https://www.evm.codes/#fd?fork=shanghai) instruction.

### LLVM IR

```llvm
define void @__revert(i256 %0, i256 %1, i256 %2) "noinline-oz" #5 personality i32()* @__personality {
entry:
  %abi = call i256@__aux_pack_abi(i256 %0, i256 %1, i256 %2)
  tail call void @llvm.syncvm.revert(i256 %abi)
  unreachable
}
```

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L86) is common for Yul and EVMLA representations.

### EraVM

See also EraVM instruction `revert`: [when returning from near calls](https://matter-labs.github.io/eravm-spec/spec.html#NearRevertDefinition)
and [when returning from far calls](https://matter-labs.github.io/eravm-spec/spec.html#FarRevertDefinition).

## INVALID

Original [EVM](https://www.evm.codes/#fe?fork=shanghai) instruction.

This instruction is a [REVERT](#revert) with an empty data payload, but it also burns all the available gas.

### LLVM IR

The same as for [REVERT](#revert).

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/return.rs#L115) is common for Yul and EVMLA representations.

### EraVM

See also EraVM instruction `revert`: [when returning from near calls](https://matter-labs.github.io/eravm-spec/spec.html#NearRevertDefinition)
and [when returning from far calls](https://matter-labs.github.io/eravm-spec/spec.html#FarRevertDefinition).
