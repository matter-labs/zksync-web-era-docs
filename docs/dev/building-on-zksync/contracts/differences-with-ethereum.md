# Differences with Ethereum

zkSync Era can handle almost all smart contracts based on the Ethereum Virtual Machine (EVM) and maintains high security standards, reducing the need for repeated security audits. However, it's important to be aware of the following differences.

## Differences

### Using `call` over `.send` or `.transfer`

The utilization of `payable(X).send` or `payable(X).transfer` is not feasible, as the 2300 gas stipend is generally insufficient for conducting a transfer. Furthermore, owing to diverse opcode pricing, the transfer may necessitate state changes, resulting in a large number of L2 gas being expended on data availability.

To ensure adherence to security best practices, it is recommended to employ `call` instead. For instance:

::: code-tabs

@tab:active .send

```solidity
payable(X).send
```

@tab .transfer

```solidity
payable(X).transfer
```
:::

It is advised not to use the former, but rather to transform them into the following:

```solidity
(bool s, )= call{value: x}("")
```

### Non-standard `CREATE`/`CREATE2` behaviour

In Ethereum, the `initCode` of a contract with concatenated constructor parameters serves as the input for both `CREATE` and `CREATE2`.
 In contrast, on the zkSync Era, contract deployment occurs through the use of hashes. The operator receives the bytecodes in the `factoryDeps` fields of the EIP712 transactions while the actual [deployment](./contract-deployment.md#format-of-bytecode-hash) process involves providing the contract's hash to the `ContractDeployer` system contract.


Keeping this in mind, the compiler interprets the arguments of `create` as slightly unfilled arguments calldata to the `ContractDeployer`. The remaining arguments are filled by the compiler itself. To enable this, the Yul instructions `datasize` and `dataoffset` were adapted to return a constant size and bytecode hash rather than bytecode. Therefore, for the `create`/`create2` to work, the compiler needs to know the bytecode of the deployed contract beforehand.

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

### Differences in `block.timestamp` and `block.number`

These variables behave differently from L1. Read more [about blocks in zkSync](../../developer-guides/transactions/blocks.md#blocks-in-zksync-era).

### Differences in `COINBASE` `DIFFICULTY` `BASEFEE` 

- `COINBASE` returns our Bootloader contract address, `0x0000000000000000000000000000000000008001` 
- `DIFFICULTY` returns a constant value of `2500000000000000` 
- `BASEFEE` is not a constant, but is defined by the fee model. Most of the time it is 0.25 gwei, but under very high L1 gas prices it may rise.

### Use of `codesize`/`codecopy` and `calldata` in the deploy code

`Calldata` in the constructor is not empty as on the EVM, on zkEVM calldata contains constructor arguments.
`codesize` has the same behavior as `calldatasize`, `codecopy` as `calldatacopy`.
To make it works datasize of the current object is 0.

### Using `return` in the deploy code will not function as intended

Constructors on the zkSync Era return immutables arrays. If you attempt to use return, it will instead return the array of immutables in the auxiliary heap that was previously written there (using `setimmutable`) rather than the data you specified.

### For Yul users

`datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently.
Please note that `datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently in most cases in Yul (not assembly blocks in Solidity). This is due to modifications made to make solc-generated Yul work with our system, particularly in regards to create and constructors.


## Opcode Differences

### Removed Opcodes

| Opcode        | Explanation                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `SELFDESTRUCT`| Considered harmful and deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049).                      |
| `CALLCODE`    | Deprecated in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`.                  |
| `CODECOPY`    | Replaced only in the deploy code with  `CALLDATACOPY`. Forbidden in runtime code.                              |
| `CODESIZE`    | Everything is the same as for `CODECOPY`, but will return 0 instead no-op.                                     |
| `PC`          | Inaccessible in Yul and Solidity `>=0.7.0`; accessible in Solidity `0.6` although it produces a runtime error. | 

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

### It is better to use a proxy pattern at the early stage of the protocol?

zkSync Era is based on the special zk-friendly VM. That’s why we provide our compiler that compiles standard Solidity code to the zkEVM bytecode. While we have extensive test coverage to ensure EVM compatibility, some issues after the mainnet release may still be found & we will implement the patches for these in a timely manner. In order to apply a fix of a compiler bug, your smart contract will need to upgrade. That’s why we advise using the Proxy pattern for a few months after your first deployment on zkSync, even if you plan to migrate to the immutable contract later on (this could be done by migrating the governance to 0 address in the future).

### Your protocol should not rely on EVM gas logic

zkSync Era has a somewhat distinctive gas logic compared to Ethereum. There are two main drivers for it:

- We have a state-diff-based data availability, which means that the price for the execution depends on the L1 gas price.
- zkEVM has a different set of computational trade-offs compared to the standard computational model, which practically means that the price for opcodes is different from Ethereum. Also, zkEVM contains a different set of opcodes under the hood and so the “gas” metric of the same set of operations may be different on zkSync and on Ethereum.

Our fee model is being constantly improved and so it is highly recommended **NOT** to hardcode any constants since the fee model changes in the future might be breaking for this constant.

For example, `gasPerPubdataByte` should be taken into account in development.

Due to the state diff-based fee model of zkSync, every transaction includes a constant called `gasPerPubdataByte`. Presently, the operator has control over this value. However, in the EIP712 transaction’s, users also sign an upper bound on this value, but the operator is free to choose any value up to that upper bound. Note, that even if the value is chosen by the protocol, it will still fluctuate based on the L1 gas price. Therefore, relying solely on gas is inadequate.

A notable example is a Gnosis Safe’s `execTransaction` method:

```solidity
// We require some gas to emit the events (at least 2500) after the execution and some to perform code until the execution (500)
// We also include the 1/64 in the check that is not send along with a call to counteract potential shortings because of EIP-150
require(gasleft() >= ((safeTxGas * 64) / 63).max(safeTxGas + 2500) + 500, "GS010");
// Use scope here to limit variable lifetime and prevent `stack too deep` errors
{
    uint256 gasUsed = gasleft();
    // If the gasPrice is 0 we assume that nearly all available gas can be used (it is always more than safeTxGas)
    // We only substract 2500 (compared to the 3000 before) to ensure that the amount passed is still higher than safeTxGas
    success = execute(to, value, data, operation, gasPrice == 0 ? (gasleft() - 2500) : safeTxGas);
    gasUsed = gasUsed.sub(gasleft());
   
    // ...
}
```

While the contract does enforce the correct `gasleft()`, it does not enforce the correct `gasPerPubdata`, since there was no such parameter on Ethereum. Meaning that a malicious user could call this wallet when the `gasPerPubdata` is high and so make the transaction fail, hence making it spend artificially more gas than required. 

This is the case for all relayer-like logic ported directly from Ethereum and so if you see your code relying on logic like “the user should provide at X gas”, then the `gasPerPubdata` should be also taken into account on zkSync.  

For now, zkSync Era operator will use honest values for ETH L1 price and `gasPerPubdata`, and so it should not be an issue if enough margin is added to the estimated gas. In order to prepare for the future decentralization of zkSync Era, it is imperative that you update your contract.
### Native Account Abstraction Over `ecrecover` for Validation

Use zkSync Era's native account abstraction support for signature validation instead of this function. We recommend not relying on the fact that an account has an ECDSA private key, since the account may be governed by multisig and use another signature scheme. Read more about [zkSync Account Abstraction support](../../developer-guides/aa.md)

### Precompiles

Some EVM cryptographic precompiles (notably pairings and RSA) won’t be immediately available. However, pairing is prioritized to allow deployment of both Hyperchains and protocols like Aztec/Dark Forest without modifications.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles. No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.
