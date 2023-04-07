# Differences with Ethereum

zkSync Era supports almost every smart contract written for EVM and satisfies all key security invariants so
that no additional security re-auditing is usually required. However, please keep in mind the following differences and recommended practices:



## Differences

### Use `call` over `.send`/`.transfer`

`payable(X).send`/`payable(X).transfer` will not work, because the 2300 gas stipend most often will not be enough to conduct a transfer. Besides different opcode pricing, the transfer might involve state changes, which may require big number of L2 gas spent on data availability.

Instead, you should follow security best practices and use `call` instead. For example:

```solidity
payable(X).send
```
 or

```solidity
payable(X).transfer
```
Should not be used. Instead, you convert them into:

```solidity
(bool s, )= call{value: x}("")
```

### Non-standard `CREATE`/`CREATE2` behaviour

On Ethereum, both `CREATE` and `CREATE2` accept the `initCode` of the contract with constructor parameters concatenated to it as its input. On zkSync, contract deployment is done via hashes, i.e. the operator receives the bytecodes themselves in the `factoryDeps` fields of the EIP712 transactions & the actual deployment is done by providing the contract’s hash to the `ContractDeployer` system contract.

With this in mind, the compiler interprets the arguments of `create` as slightly unfilled arguments calldata to the `ContractDeployer` (the rest is filled with the compiler internally). For this to work the `datasize`/ `dataoffset` Yul instructions were adapted to return a constant size and the bytecode hash instead of bytecode. This means that in order for `create`/`create2` to work, the compiler needs to know the bytecode of the deployed contract beforehand.

```solidity

MyContract a = new MyContract();
MyContract a = new MyContract{salt: ...}();

```

The following should also work as expected, but must be explicitly tested by the team in order to make sure that this is the case:

```solidity
bytes memory bytecode = type(MyContract).creationCode;
assembly {
    addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
} 
```

The following code will not work, because the compiler will not be aware of the bytecode beforehand:

```solidity
function myFactory(bytes memory bytecode) public {
   assembly {
      addr := create(0, add(bytecode, 0x20), mload(bytecode))
   }
}
```

Unfortunately it is not possible to distinguish between the cases above in compile time. And so it *highly recommended* to include tests for your factory regarding deploying the child contracts. 

Also, note that for zkEVM bytecode we contain the different address derivation from Ethereum. The exact formulas are available in our SDK:

```typescript
export function create2Address(sender: Address, bytecodeHash: BytesLike, salt: BytesLike, input: BytesLike) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate2'));
    const inputHash = ethers.utils.keccak256(input);
    const addressBytes = ethers.utils
        .keccak256(ethers.utils.concat([prefix, ethers.utils.zeroPad(sender, 32), salt, bytecodeHash, inputHash]))
        .slice(26);
    return ethers.utils.getAddress(addressBytes);
}

export function createAddress(sender: Address, senderNonce: BigNumberish) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate'));
    const addressBytes = ethers.utils
        .keccak256(
            ethers.utils.concat([
                prefix,
                ethers.utils.zeroPad(sender, 32),
                ethers.utils.zeroPad(ethers.utils.hexlify(senderNonce), 32)
            ])
        )
        .slice(26);

    return ethers.utils.getAddress(addressBytes);
}
```

### `block.timestamp` and `block.number`
These variables behave differently from L1. Read more [about blocks in zkSync](../../developer-guides/transactions/blocks.md#blocks-in-zksync-era).

### COINBASE DIFFICULTY BASEFEE

### Use of `codesize`/`codecopy` and `calldata` in the deploy code
Calldata in the constructor is not empty as on the EVM, on zkEVM calldata contains constructor arguments.
codesize has the same behavior as calldatasize, codecopy as calldatacopy
To make it works datasize of the current object is 0.

TODO

## Opcode Differences

### Removed Opcodes

| Opcode      | Explanation |
| ----------- | ----------- |
| `SELFDESTRUCT`      | Considered harmful and deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049)       |
| `CALLCODE`   | Deprecated in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`        |
| `EXTCODECOPY` | TODO: ASK ABOUT THIS Skipped at the time of writing because zkEVM opcodes are not identical in the EVM; can be implemented if needed. |
| `CODECOPY` | Replaced with `CALLDATACOPY` |
| `PC` | Inaccessible in Yul and Solidity `>=0.7.0`; accessible in Solidity `0.6` although it produces a runtime error. | 

:::warning
All these opcodes produce an error on compilation.
:::

### Modified Opcodes

### `mstore`/`mload`

Unlike EVM, where the memory growth is in words, on zkEVM the memory growth is counted in bytes. For example, if you write `mstore(100, 0)` the `msize` on zkEVM will be `132`, but on the EVM is will be `160`. Note, that also unlike EVM which has quadratic growth for memory payments, on zkEVM the fees are charged linearly at a rate of `1` erg per byte.

The other thing is that the compiler can sometimes optimize unused memory reads/writes. This can lead to different `msize` compared to Ethereum (since fewer bytes have been allocated). Leading to cases where EVM panics, but zkEVM won’t due to the difference in memory growth.

### `calldataload`/`calldatacopy`

If the `offset` for the `calldataload(offset)` is greater than `2^32-33` then execution will panic. On Ethereum, the returned value would be `0`.

Internally, the `calldatacopy(to, offset, len)` on zkEVM is just a loop with the `calldataload` and `mstore` on each iteration. That means, that if `2^32-32 + offset%32 < offset + len` then the code will panic. Note that this case affects only big numbers (`offset + len > 2^32-32`), for smaller numbers everything works as on the EVM.

### `call`/`staticcall`/`delegatecall`

For `call`, you can specify a memory slice to write the returndata to (the `out` and `outsize` arguments for `call(g, a, v, in, insize, out, outsize)`).
On EVM if `outsize != 0` the allocated memory will grow to `out + outsize` (rounded up to the words) regardless of the `returndatasize`. On zkEVM, `returndatacopy`, similarly to `calldatacopy`, is implemented as a cycle iterating over `returndata` with a few additional checks specific to `returndata` (i.e. panic if `offset + len > returndatasize` to simulate the same behaviour as on EVM).

So, unlike EVM where the memory growth happens before the call itself, on zkEVM the necessary copying of the returndata will happen only after the call has ended, leading to a difference in `msize()` and sometimes zkEVM not panicking where the EVM would panic due to the difference in memory growth.

## Recommendations

### It is better to use a proxy pattern at the early stage of the protocol

zkSync Era is based on the special zk-friendly VM. That’s why we provide our compiler that compiles standard Solidity code to the zkEVM bytecode. While we have extensive test coverage to ensure EVM compatibility, some issues after the mainnet release may still be found & we will implement the patches for these in a timely manner. In order to apply a fix of a compiler bug, your smart contract will need to upgrade. That’s why we advise using the Proxy pattern for a few months after your first deployment on zkSync, even if you plan to migrate to the immutable contract later on (this could be done by migrating the governance to 0 address in the future).

### Your protocol should not rely on EVM gas logic

zkSync Era has a somewhat distinctive gas logic compared to Ethereum. There are two main drivers for it:

- We have a state-diff-based data availability, which means that the price for the execution depends on the L1 gas price.
- zkEVM has a different set of computational trade-offs compared to the standard computational model, which practically means that the price for opcodes is different from Ethereum. Also, zkEVM contains a different set of opcodes under the hood and so the “gas” metric of the same set of operations may be different on zkSync and on Ethereum.

Our fee model is being constantly improved and so it is highly recommended NOT to hardcode any constants since the fee model changes in the future might be breaking for this constant.

### Native Account Abstraction Over `ecrecover` for Validation

Use zkSync Era's native account abstraction support for signature validation instead of this function. We recommend not relying on the fact that an account has an ECDSA private key, since the account may be governed by multisig and use another signature scheme. Read more about [zkSync Account Abstraction support](../../developer-guides/aa.md)

### Precompiles

Some EVM cryptographic precompiles (notably pairings and RSA) won’t be immediately available. However, pairing is prioritized to allow deployment of both Hyperchains and protocols like Aztec/Dark Forest without modifications.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.
