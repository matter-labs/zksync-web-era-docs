# Differences from Ethereum :star:

zkSync Era handles nearly all smart contracts based on the Ethereum Virtual Machine (EVM) and upholds high security standards,
minimizing the need for repeated security audits. Nevertheless, it's essential to recognize the following differences.

## EVM instructions

### `CREATE`, `CREATE2`

In zkSync Era, contract deployment is performed using the hash of the bytecode, and the `factoryDeps` field of EIP712
transactions contains the bytecode. The actual deployment occurs by providing the contract's hash to the
`ContractDeployer` system contract.

To guarantee that `create`/`create2` functions operate correctly, the compiler must be aware of the bytecode of the deployed
contract in advance. The compiler interprets the calldata arguments as incomplete input for `ContractDeployer`,
as the remaining part is filled in by the compiler internally. The Yul `datasize` and `dataoffset` instructions
have been adjusted to return the constant size and bytecode hash rather than the bytecode itself.

The code below should work as expected:

```solidity
MyContract a = new MyContract();
MyContract a = new MyContract{salt: ...}();
```

In addition, the subsequent code should also work, but it must be explicitly tested to ensure its intended functionality:

```solidity
bytes memory bytecode = type(MyContract).creationCode;
assembly {
    addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
}
```

The following code will not function correctly because the compiler is not aware of the bytecode beforehand:

```solidity
function myFactory(bytes memory bytecode) public {
   assembly {
      addr := create(0, add(bytecode, 0x20), mload(bytecode))
   }
}
```

Unfortunately, it's impossible to differentiate between the above cases during compile-time. As a result, we strongly
recommend including tests for any factory that deploys child contracts using `type(T).creationCode`.

Since the deploy and runtime code is merged together in zkSync Era, we do not support `type(T).runtimeCode` and it
always produces a compile-time error.

#### Address derivation

For zkEVM bytecode, zkSync Era uses a distinct address derivation method compared to Ethereum. The precise formulas
can be found in our SDK, as demonstrated below:

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


### `CALL`, `STATICCALL`, `DELEGATECALL`

For calls, you specify a memory slice to write the return data to, e.g. `out` and `outsize` arguments for
`call(g, a, v, in, insize, out, outsize)`. In EVM, if `outsize != 0`, the allocated memory will grow to `out + outsize`
(rounded up to the words) regardless of the `returndatasize`. In zkSync Era, `returndatacopy`, similar to `calldatacopy`,
is implemented as a cycle iterating over return data with a few additional checks
(e.g. panic if `offset + len > returndatasize` to simulate the same behavior as in EVM).

Thus, unlike EVM where memory growth occurs before the call itself, in zkSync Era, the necessary copying of return data
happens only after the call has ended, leading to a difference in `msize()` and sometimes zkSync Era not panicking where
EVM would panic due to the difference in memory growth.

Additionally, there is no native support for passing Ether in zkSync Era, so it is handled by a special system contract
called `MsgValueSimulator`. The simulator receives the callee address and Ether amount, performs all necessary balance
changes, and then calls the callee.

### `MSTORE`, `MLOAD`

Unlike EVM, where the memory growth is in words, on zkEVM the memory growth is counted in bytes. For example, if you write
`mstore(100, 0)` the `msize` on zkEVM will be `132`, but on the EVM is will be `160`. Note, that also unlike EVM which
has quadratic growth for memory payments, on zkEVM the fees are charged linearly at a rate of `1` erg per byte.

The other thing is that our compiler can sometimes optimize unused memory reads/writes. This can lead to different `msize`
compared to Ethereum since fewer bytes have been allocated, leading to cases where EVM panics, but zkEVM won’t due to
the difference in memory growth.

### `CALLDATALOAD`, `CALLDATACOPY`

If the `offset` for `calldataload(offset)` is greater than `2^32-33` then execution will panic.

Internally on zkEVM, `calldatacopy(to, offset, len)` there is just a loop with the `calldataload` and `mstore` on each iteration.
That means that the code will panic if `2^32-32 + offset % 32 < offset + len`.

### `CODESIZE`

| Deploy code                       | Runtime code                      |
| --------------------------------- | --------------------------------- |
| Size of the constructor arguments | Contract size                     |

Yul uses a special instruction `datasize` to distinguish the contract code and constructor arguments, so we
substitute `datasize` with 0, and `codesize` with `calldatasize`, in zkSync Era deployment code. This way when Yul calculates the
calldata size as `sub(codesize, datasize)`, the result is the size of the constructor arguments.

### `CODECOPY`

| Deploy code                       | Runtime code (old EVM codegen)    | Runtime code (new Yul codegen)    |
| --------------------------------- | --------------------------------- | --------------------------------- |
| Copies the constructor arguments  | Zeroes memory out                 | Compile-time error                |

### `RETURN`

Constructors return the array of immutable values. If you use `RETURN` in an assembly block in the constructor in zkSync Era,
it will return the array of immutable values initialized so far.

### `TIMESTAMP`, `NUMBER`

For more information on blocks in zkSync Era, including the differences between `block.timestamp` and `block.number`,
check out the [blocks in zkSync Era documentation](../../reference/concepts/transactions/blocks.md#blocks-in-zksync-era).

### `COINBASE`

Returns the address of the `Bootloader` contract, which is `0x8001` in zkSync Era.

### `DIFFICULTY`

Returns a constant value of `2500000000000000` in zkSync Era.

### `BASEFEE`

This is not a constant on zkSync Era and is instead defined by the fee model. Most of the time it is 0.25 gwei, but under very high L1 gas prices it may rise.

### `SELFDESTRUCT`

Considered harmful and deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049).

Always produces a compile-time error with our toolchain.

### `CALLCODE`

Deprecated in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`.

Always produces a compile-time error with our toolchain.

### `PC`

Inaccessible in Yul and Solidity `>=0.7.0`, but accessible in Solidity `0.6`.

Always produces a compile-time error with our toolchain.

### `EXTCODECOPY`

Contract bytecode cannot be accessed in our architecture. Only its size is accessible with both `CODESIZE` and `EXTCODESIZE`.

`EXTCODECOPY` always produces a compile-time error with our toolchain.

### `DATASIZE`, `DATAOFFSET`, `DATACOPY`

Contract deployment is handled by two areas of our system: the front-end and the system contract `ContractDeployer`.

On the compiler front-end the code of the deployed contract is substituted with its hash. The hash is returned by the `dataoffset` Yul instruction or the `PUSH [$]` EVM legacy assembly instruction. The hash is then passed to the `datacopy` Yul instruction or the `CODECOPY` EVM legacy instruction, which writes the hash to the correct position of the calldata of the call to `ContractDeployer`.

The calldata consists of several elements:

1. The signature (4 bytes).
2. The salt (32 bytes).
3. The contract hash (32 bytes).
4. The constructor calldata offset (32 bytes).
5. The constructor calldata length (32 bytes).
6. The constructor calldata itself (N bytes).

The elements 1-5 replace the supposed contract code in the EVM pipeline, and the element 6, containing
the constructor arguments, remains unchanged. For this reason, `datasize` and `PUSH [$]` return the size of
elements 1-5 (132), and the space for constructor arguments is allocated by **solc** on top of it.

Finally, the `CREATE` or `CREATE2` instructions pass 132+N bytes to the `ContractDeployer` contract, which makes all
the necessary changes to the state and returns the contract address or zero if there has been an error.

If some Ether is passed, the call to the `ContractDeployer` also goes through the `MsgValueSimulator` just like ordinary calls.

We do not recommend using `CREATE` for anything other than creating contracts with the `new` operator. However, a lot of contracts create contracts in assembly blocks instead, so authors must ensure that the behavior is compatible with the logic described above.

Yul example:

```solidity
let _1 := 128                                       // the deployer calldata offset
let _2 := datasize("Callable_50")                   // returns the header size (132)
let _3 := add(_1, _2)                               // the constructor arguments begin offset
let _4 := add(_3, args_size)                        // the constructor arguments end offset
datacopy(_1, dataoffset("Callable_50"), _2)         // dataoffset returns the contract hash, which is written according to the offset in the 1st argument
let address_or_zero := create(0, _1, sub(_4, _1))   // the header and constructor arguments are passed to the ContractDeployer system contract
```

EVM legacy assembly example:

```solidity
010     PUSH #[$]       tests/solidity/complex/create/create/callable.sol:Callable      // returns the header size (132), equivalent to Yul's datasize
011     DUP1
012     PUSH [$]        tests/solidity/complex/create/create/callable.sol:Callable      // returns the contract hash, equivalent to Yul's dataoffset
013     DUP4
014     CODECOPY        // CODECOPY statically detects the special arguments above and behaves like the Yul's datacopy
...
146     CREATE          // accepts the same data as in the Yul example above
```

### `SETIMMUTABLE`, `LOADIMMUTABLE`

zkEVM does not provide any access to the contract bytecode, so the behavior of immutable values is simulated with the system contracts.

1. The deploy code, also known as constructor, assembles the array of immutables in the auxiliary heap. Each array element
   consists of an index and a value. Indexes are allocated sequentially by `zksolc` for each string literal identifier allocated by `solc`.
2. The constructor returns the array as the return data to the contract deployer.
3. The array is passed to a special system contract called `ImmutableSimulator`, where it is stored in a mapping with
   the contract address as the key.
4. In order to access immutables from the runtime code, contracts call the `ImmutableSimulator` to fetch a value using
   the address and value index. In the deploy code, immutable values are read from the auxiliary heap, where they are still available.

The element of the array of immutable values:

```solidity
struct Immutable {
    uint256 index;
		uint256 value;
}
```

Yul example:

```solidity
mstore(128, 1)                                   // write the 1st value to the heap
mstore(160, 2)                                   // write the 2nd value to the heap

let _2 := mload(64)
let _3 := datasize("X_21_deployed")              // returns 0 in the deploy code
codecopy(_2, dataoffset("X_21_deployed"), _3)    // no effect, because the length is 0

// the 1st argument is ignored
setimmutable(_2, "3", mload(128))                // write the 1st value to the auxiliary heap array at index 0
setimmutable(_2, "5", mload(160))                // write the 2nd value to the auxiliary heap array at index 32

return(_2, _3)                                   // returns the auxiliary heap array instead
```

EVM legacy assembly example:

```solidity
053     PUSH #[$]       <path:Type>               // returns 0 in the deploy code
054     PUSH [$]        <path:Type>
055     PUSH            0
056     CODECOPY                                  // no effect, because the length is 0
057     ASSIGNIMMUTABLE 5                         // write the 1st value to the auxiliary heap array at index 0
058     ASSIGNIMMUTABLE 3                         // write the 2nd value to the auxiliary heap array at index 32
059     PUSH #[$]       <path:Type>
060     PUSH            0
061     RETURN                                    // returns the auxiliary heap array instead
```

## Using `call` over `.send` or `.transfer`

Avoid using `payable(addr).send(x)`/`payable(addr).transfer(x)` because the 2300 gas stipend may not be enough for such calls, especially if it involves state changes that require a large amount of L2 gas for data. Instead, we recommend using `call`.

Instead of:

```solidity
payable(addr).send(x) // or
payable(addr).transfer(x)
```

Use instead:

```solidity
(bool s, ) = addr.call{value: x}("");
require(s);
```

This converts the `send`/`transfer` functionality to `call` and [avoids potential security risks outlined here.](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/). 

:::note Be aware of reentrancy
While `.call` offers more flexibility compared to `.send` or `.transfer`, developers should be aware that `.call` does not provide the same level of reentrancy protection as `.transfer`/`.send`. It's crucial to adhere to best practices like the checks-effects-interactions pattern and/or use reentrancy guard protection to secure your contracts against reentrancy attacks. It can help ensure the robustness and security of your smart contracts on the zkEVM, even under unexpected conditions.
:::


## Libraries

We rely on the **solc** optimizer for library inlining, so a library may only be used without deployment
if it has been inlined by the optimizer.

The addresses of deployed libraries must be set in the project configuration. These addresses then replace their placeholders
in IRs: `linkersymbol` in Yul and `PUSHLIB` in EVM legacy assembly.

All linking happens at compile-time. Deploy-time linking is not supported.

## Precompiles

Some EVM cryptographic precompiles (notably pairings and RSA) aren't currently available. However, pairing is
prioritized to allow deployment of both Hyperchains and protocols like Aztec/Dark Forest without modifications.

Ethereum cryptographic primitives like `ecrecover`, `keccak256`, and `sha256` are supported as precompiles.
No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.

### ecrecover

In contrast to Ethereum, zkSync Era ecrecover always return a zero address for the zero digests. Be careful with adapting crypto primitives that rely on that, specifically, it affects [secp256k1 mul verification via ecrecover](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384).

## Recommendations

### Use the proxy pattern at the early stage of the protocol

zkSync Era is based on the zk-friendly VM. That’s why we provide our compiler that compiles standard Solidity
code to zkEVM bytecode.

While we have extensive test coverage to ensure EVM compatibility, issues may still appear.
We will implement the patches for these in a timely manner.

In order to apply compiler bug fix, you need to upgrade your smart contract. We advise using the
Proxy pattern for a few months after your first deployment on zkSync Era, even if you plan to migrate to the immutable
contract in the future.

:::tip zkSync Upgradeable plugin
- The [hardhat-zksync-upgradeable plugin](https://era.zksync.io/docs/api/hardhat/hardhat-zksync-upgradable.html) is now available to help you create proxies.
:::

### Do not rely on EVM gas logic

zkSync Era has a distinctive gas logic compared to Ethereum. There are two main drivers:

- We have a state-diff-based data availability, which means that the price for the execution depends on the L1 gas price.
- zkEVM has a different set of computational trade-offs compared to the standard computational model. In practice, this means that the price for opcodes is different to Ethereum. Also, zkEVM contains a different set of opcodes under the hood and so the “gas” metric of the same set of operations may be different on zkSync Era and on Ethereum.

:::warning
Our fee model is being constantly improved and so it is highly recommended **NOT** to hardcode any constants since the fee model changes in the future might be breaking for this constant.
:::

### `gasPerPubdataByte` should be taken into account in development

Due to the state diff-based fee model of zkSync Era, every transaction includes a constant called `gasPerPubdataByte`.

Presently, the operator has control over this value. However, in EIP712 transactions, users also sign an upper bound
on this value, but the operator is free to choose any value up to that upper bound. Note, that even if the value
is chosen by the protocol, it still fluctuates based on the L1 gas price. Therefore, relying solely on gas is inadequate.

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

Read more about [zkSync Era Account Abstraction support](../../reference/concepts/aa.md).
