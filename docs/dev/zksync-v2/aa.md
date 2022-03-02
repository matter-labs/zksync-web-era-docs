# IMPORTANT: Account abstraction support

## Introduction

A nice introduction to the current state of AA and initial spec (to be changed soon!) can be found [here](https://hackmd.io/@angelfish/BytzUTdCK).

Any feedback or thoughts on it are appreciated!

## Current status

Our team is currently working on a new VM that better suits the AA needs. The spec is also in the process of being reworked to improve the security and universality of the account abstractions.

In the meantime, your project can prepare for native AA support. We highly encourage you to do so, since it will allow you to onboard hundreds of thousands of Argent users. We expect that in the future even more users will switch to smart wallets.

One of the most notable differences between various types of accounts to be built is different signature schemes. We will expect all account abstractions to support the [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) standard. Our team has created a utility library for verifying account signatures. Currently, it only supports ECDSA signatures, but we will add support for EIP-1271 very soon as well.

## `aa-signature-checker`

The `aa-signature-checker` library provides a way to verify signatures for account abstractions. Currently, it only supports verifying the ECDSA signatures. Very soon we will add support for EIP-1271 as well.

*We strongly encourage you to use this library whenever you need to check that a signature of an account is correct.*

### Adding the library to your project:

```
yarn add @matterlabs/signature-checker
```

### Example of using the library

```solidity
pragma solidity ^0.8.0;

import { SignatureChecker } from "@matterlabs/signature-checker/contracts/SignatureChecker.sol";

contract TestSignatureChecker {
    using SignatureChecker for address;

    function isValidSignature(
        address _address,
        bytes32 _hash,
        bytes memory _signature
    ) public pure returns (bool) {
        return _address.checkSignature(_hash, _signature);
    }
}
```

## Verifying AA signatures within our SDK

It is also **not recommended** to use `ethers.js` library to verify user signatures.

Our SDK provides two methods with its `utils` to verify the signature of an account:

```ts
export async function isMessageSignatureCorrect(
    address: string,
    message: ethers.Bytes | string,
    signature: SignatureLike
): Promise<boolean>;

export async function isTypedDataSignatureCorrect(
    address: string,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: SignatureLike
): Promise<boolean>;
```

Currently these methods only support veryfying the ECDSA signatures, but very soon they will support EIP1271 signature verification as well.

Both of these methods return `true` or `false` depending on whether or not message signature is correct.
