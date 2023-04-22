# Differences with Ethereum

zkSync Era can handle almost all smart contracts based on the Ethereum Virtual Machine (EVM) and maintains high security standards,
reducing the need for repeated security audits. However, it's important to be aware of the following differences.

## EVM Instructions

#### `CREATE` / `CREATE2`

On Ethereum, both `CREATE` and `CREATE2` accept the `initCode` of the contract plus concatenated constructor parameters
as input. However, on zkSync, contract deployment is done via hashes, and the `factoryDeps` field of EIP712 transactions
contain the bytecode. The actual deployment is done by providing the contract’s hash to the `ContractDeployer` system contract.

To ensure that `create`/`create2` works correctly, the compiler must know the bytecode of the deployed contract beforehand.
The compiler interprets the `calldata` arguments as incomplete to  `ContractDeployer`
(the rest is filled with the compiler internally). The `datasize`/ `dataoffset` Yul instructions were adapted to return
a constant size and the bytecode hash instead of bytecode.

Consider the following code:

```solidity
MyContract a = new MyContract();
MyContract a = new MyContract{salt: ...}();
```

The above should work as expected.

Additionally, the following code should also work, but must be explicitly tested to ensure it works as intended:

```solidity
bytes memory bytecode = type(MyContract).creationCode;
assembly {
    addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
}
```

The following code will not work because the compiler is unaware of the bytecode beforehand.

```solidity
function myFactory(bytes memory bytecode) public {
   assembly {
      addr := create(0, add(bytecode, 0x20), mload(bytecode))
   }
}
```

Unfortunately, it is not possible to distinguish between the above cases at compile-time. Therefore, we highly
recommended including tests for any factory that deploys child contracts.

For zkEVM bytecode, we use a different address derivation from Ethereum. The exact formulas are available in our SDK,
as seen here:

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

#### `CALL` / `STATICCALL` / `DELEGATECALL`

For `call`, you can specify a memory slice to write the returndata to (the `out` and `outsize` arguments for `call(g, a, v, in, insize, out, outsize)`).
On EVM if `outsize != 0` the allocated memory will grow to `out + outsize` (rounded up to the words) regardless of the `returndatasize`.
On zkEVM, `returndatacopy`, similarly to `calldatacopy`, is implemented as a cycle iterating over `returndata` with a few
additional checks specific to `returndata` (i.e. panic if `offset + len > returndatasize` to simulate the same behaviour as on EVM).

So, unlike EVM where the memory growth happens before the call itself, on zkEVM the necessary copying of the returndata
will happen only after the call has ended, leading to a difference in `msize()` and sometimes zkEVM not panicking where
the EVM would panic due to the difference in memory growth.

#### `MSTORE` / `MLOAD`

Unlike EVM, where the memory growth is in words, on zkEVM the memory growth is counted in bytes. For example, if you write
`mstore(100, 0)` the `msize` on zkEVM will be `132`, but on the EVM is will be `160`. Note, that also unlike EVM which
has quadratic growth for memory payments, on zkEVM the fees are charged linearly at a rate of `1` erg per byte.

The other thing is that our compiler can sometimes optimize unused memory reads/writes. This can lead to different `msize`
compared to Ethereum since fewer bytes have been allocated, leading to cases where EVM panics, but zkEVM won’t due to the difference in memory growth.

#### `CALLDATALOAD` / `CALLDATACOPY`

If the `offset` for `calldataload(offset)` is greater than `2^32-33` then execution will panic. On Ethereum, the returned value is `0`.

Internally, `calldatacopy(to, offset, len)` on zkEVM is just a loop with the `calldataload` and `mstore` on each iteration.
That means that the code will panic if `2^32-32 + offset % 32 < offset + len`.

#### `CODESIZE`

| Deploy code                       | Runtime code                      |
| --------------------------------- | --------------------------------- |
| Size of the constructor arguments | Contract size                     |

#### `CODECOPY`

| Deploy code                       | Runtime code (old EVM codegen)    | Runtime code (new Yul codegen)    |
| --------------------------------- | --------------------------------- | --------------------------------- |
| Copies the constructor arguments  | Zeroes memory out                 | Compile-time error                |

#### `RETURN`

Constructors return the array of immutable values. If you use `RETURN` in an assembly block in the constructor,
it will return the array of immutable values initialized so far.

#### `TIMESTAMP`, `NUMBER`

For more information on blocks in zkSync Era, including the differences between `block.timestamp` and `block.number`,
check out the [blocks in zkSync Era documentation](../../developer-guides/transactions/blocks.md#blocks-in-zksync-era).

#### `COINBASE`

Returns the address of the `Bootloader` contract, which is `0x8001`.

#### `DIFFICULTY`

Returns a constant value of `2500000000000000`.

#### `BASEFEE`

Is not a constant on zkSync Era and defined by the fee model. Most of the time it is 0.25 gwei, but under very high L1 gas prices it may rise.

#### `SELFDESTRUCT`

Considered harmful and deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049).

Always produces a compile-time error with our toolchain.

#### `CALLCODE`

Deprecated in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`.

Always produces a compile-time error with our toolchain.

#### `PC`

Inaccessible in Yul and Solidity `>=0.7.0`, but accessible in Solidity `0.6`.

Always produces a compile-time error with our toolchain.

#### `EXTCODECOPY`

Contract bytecode cannot be accessed in our architecture. Only its size is accessible with `CODESIZE` and `EXTCODESIZE`.

Always produces a compile-time error with our toolchain.

#### `DATASIZE`, `DATAOFFSET`, `DATACOPY`

`datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently.
Please note that `datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently in most
cases in Yul (not assembly blocks in Solidity). This is due to modifications made to make solc-generated Yul work with our system, particularly in regards to create and constructors.

#### `SETIMMUTABLE`, `LOADIMMUTABLE`

`datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently.
Please note that `datasize`, `dataoffset`, `datacopy`, `setimmutable`, and `loadimmutable` may behave differently in most
cases in Yul (not assembly blocks in Solidity). This is due to modifications made to make solc-generated Yul work with our system, particularly in regards to create and constructors.

## Using `call` over `.send` or `.transfer`

Avoid using `payable(X).send`/`payable(X).transfer` because the 2300 gas stipend may not be enough to send a transfer,
especially if it involves state changes that require a large amount of L2 gas for data. Instead, we recommend using `call`.

Instead of:

```solidity
payable(X).send // or
payable(X).transfer
```

Use instead:

```solidity
(bool s, )= call{value: x}("")
```

This converts the `send`/`transfer` functionality to `call` and [avoids potential security risks outlined here.](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/)

### Precompiles

Some EVM cryptographic precompiles (notably pairings and RSA) won’t be immediately available. However, pairing is
prioritized to allow deployment of both Hyperchains and protocols like Aztec/Dark Forest without modifications.

Ethereum cryptographic primitives like `ecrecover`, `keccak256`, and `sha256` are supported as precompiles.
No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.

## Recommendations

### Use the proxy pattern at the early stage of the protocol

zkSync Era is based on the special zk-friendly VM. That’s why we provide our compiler that compiles standard Solidity
code to the zkEVM bytecode.

While we have extensive test coverage to ensure EVM compatibility, some issues may still be found after the mainnet release.
We will implement the patches for these in a timely manner.

In order to apply a fix of a compiler bug, you need to upgrade your smart contract. That’s why we advise using the
Proxy pattern for a few months after your first deployment on zkSync Era, even if you plan to migrate to the immutable
contract later on (which can done by migrating the governance to 0 address in the future).

### Do not rely on EVM gas logic

zkSync Era has a distinctive gas logic compared to Ethereum. There are two main drivers:

- We have a state-diff-based data availability, which means that the price for the execution depends on the L1 gas price.
- zkEVM has a different set of computational trade-offs compared to the standard computational model. In practice, this means that the price for opcodes is different from Ethereum. Also, zkEVM contains a different set of opcodes under the hood and so the “gas” metric of the same set of operations may be different on zkSync Era and on Ethereum.

:::warning
Our fee model is being constantly improved and so it is highly recommended **NOT** to hardcode any constants since the fee model changes in the future might be breaking for this constant.
:::

#### `gasPerPubdataByte` should be taken into account in development

Due to the state diff-based fee model of zkSync Era, every transaction includes a constant called `gasPerPubdataByte`.

Presently, the operator has control over this value. However, in EIP712 transactions, users also sign an upper bound
on this value, but the operator is free to choose any value up to that upper bound. Note, that even if the value
is chosen by the protocol, it will still fluctuate based on the L1 gas price. Therefore, relying solely on gas is inadequate.

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

While the contract does enforce the correct `gasleft()`, it does not enforce the correct `gasPerPubdata`, since there
was no such parameter on Ethereum. This means that a malicious user could call this wallet when the `gasPerPubdata` is
high and make the transaction fail, hence making it spend artificially more gas than required.

This is the case for all relayer-like logic ported directly from Ethereum and so if you see your code relying on logic
like “the user should provide at X gas”, then the `gasPerPubdata` should be also taken into account on zkSync Era.

For now, zkSync Era operators use honest values for ETH L1 price and `gasPerPubdata`, so it should not be an issue if
enough margin is added to the estimated gas. In order to prepare for the future decentralization of zkSync Era,
it is imperative that you update your contract.

### Use native account abstraction over `ecrecover` for validation

Use zkSync Era's native account abstraction support for signature validation instead of this function.

We recommend not relying on the fact that an account has an ECDSA private key, since the account may be governed by
multisig and use another signature scheme.

Read more about [zkSync Era Account Abstraction support](../../developer-guides/aa.md).
