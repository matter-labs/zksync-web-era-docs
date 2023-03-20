# Smart contract development

zkSync Era allows developers to build projects using the same programming languages and tools used to build on Ethereum.
We provide our compiler toolchain customized and optimized for development on zkSync. For more information, see
[the toolchain documentation](../../compiler-toolchain/overview.md).

## EVM compatibility

Almost every smart contract written for EVM will be supported by zkSync Era and will hold all key security invariants so
that no additional security re-auditing will be required in most cases. A notable exception is the contracts that use
the following EVM opcodes:

- `SELFDESTRUCT` - It’s considered harmful and was deprecated in [EIP-6049](https://eips.ethereum.org/EIPS/eip-6049).
- `CALLCODE` - It was deprecated on Ethereum in [EIP-2488](https://eips.ethereum.org/EIPS/eip-2488) in favor of `DELEGATECALL`.
- `EXTCODECOPY` - We've skipped it for now because zkEVM opcodes are not identical to EVM ones, but it can be implemented if needed.
- `CODECOPY` - It's replaced with `CALLDATACOPY` in the deploy code.
- `PC` - Not accessible in Yul and Solidity `>=0.7.0`. Accessible in Solidity `0.6` although it produces a runtime error.

**All these opcodes produce an error on compilation.**

There are several other distinctions; for example, gas metering will be different (as is the case for other L2s as well).
Some EVM cryptographic precompiles (notably pairings and RSA) won’t be available in the very first release but will be
implemented soon after the launch, with pairing being a priority to allow both Hyperchains and protocols like
Aztec/Dark Forest to be deployed without modifications too.

Ethereum cryptographic primitives like `ecrecover`, `keccak256` and `sha256` are supported as precompiles.
No actions are required from your side as all the calls to the precompiles are done by the compilers under the hood.

### Other considerations

- **tx.origin usage:** `tx.origin` is a global variable in Solidity that returns the address of the account that sent the transaction.
It is supported on zkSync Era, but if a custom account interacts with a contract that uses this, the transactions will fail.
We also discourage its usage, as it can pose a threat to a phishing attack that can drain a contract of all funds.
Read more about [tx.origin phishing and other vulnerabilities](https://hackernoon.com/hacking-solidity-contracts-using-txorigin-for-authorization-are-vulnerable-to-phishing)

- **ecrecover usage:** If you are using 'ecrecover' to validate a signature of a user account, note that zkSync Era comes
with native account abstraction support. It is highly recommended not to rely on the fact that the account has an ECDSA
private key attached to it, since it may be ruled by a multisig and use another signature scheme.
Read more about [zkSync Account Abstraction support](../../developer-guides/aa.md)
