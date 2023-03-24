# Smart contract development

zkSync Era allows developers to build projects using the same programming languages and tools as required by Ethereum.
We provide a customized and optimized compiler toolchain for development on zkSync. For more information, see
[the toolchain documentation](../../compiler-toolchain/overview.md).

## EVM compatibility

zkSync Era supports almost every smart contract written for EVM and holds all key security invariants so
that no additional security re-auditing is usually required. Notable exceptions are contracts using
the following EVM opcodes:

- `SELFDESTRUCT` - considered harmful and deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049).
- `CALLCODE` - deprecated in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`.
- `EXTCODECOPY` - skipped at the time of writing because zkEVM opcodes are not identical in the EVM; can be implemented if needed.
- `CODECOPY` - replaced with `CALLDATACOPY` in the deploy code.
- `PC` - inaccessible in Yul and Solidity `>=0.7.0`; accessible in Solidity `0.6` although it produces a runtime error.

::: warning
These opcodes produce an error on compilation.
:::

There are several other distinctions, for example:

* Gas metering is different (as is the case for other L2s).
* Some EVM cryptographic precompiles (notably pairings and RSA) won’t be immediately available. However, pairing is prioritized to allow deployment of both Hyperchains and protocols like Aztec/Dark Forest without modifications.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles.
No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.

### Other considerations

- `tx.origin` 
A global variable in Solidity that returns the address of the account that sent the transaction.
It is supported by zkSync Era, but if a custom account interacts with a contract that uses it, the transactions will fail.
We discourage its usage as it is vulnerable to phishing attacks that can drain a contract of all funds.
Read more about [tx.origin phishing and other vulnerabilities](https://hackernoon.com/hacking-solidity-contracts-using-txorigin-for-authorization-are-vulnerable-to-phishing)

<<<<<<< HEAD
=======
- `block.timestamp` and `block.number`
These variables behave differently from L1. Read more [about blocks in zkSync](../../developer-guides/transactions/blocks.md#blocks-in-zksync-era).

>>>>>>> 9f8a9e6768f009dbbb4c254cdccc2e18312a7215
- 'ecrecover' 
Use zkSync Era's native account abstraction support for signature validation instead of this function. We recommend not relying on the fact that an account has an ECDSA private key, since the account may be governed by multisig and use another signature scheme.
Read more about [zkSync Account Abstraction support](../../developer-guides/aa.md)
