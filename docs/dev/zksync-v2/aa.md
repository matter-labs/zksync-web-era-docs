# Important: Account abstraction support

## Introduction

On Ethereum, there are two types of accounts: externally owned accounts (EOAs) and smart contracts. The former type is the only one that can initiate transactions, 
while the latter is the only one that can implement arbitrary logic. For some use-cases, like smart-contract wallets or privacy protocols, this difference can creates a lot of friction.
As a result they require L1 relayers, e.g. an EOA to help facilitate transactions from a smart-contract wallet.

Accounts in zkSync 2.0 can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract. This feature is called "account abstraction" and it is aimed to resolve the issues described above.

::: warning Unstable feature

This is the first release of account abstraction (AA) on zkSync 2.0. We are very happy to hear your feedback! Please note: **breaking changes to the API/interfaces required for AA should be anticipated.**

zkSync 2.0 is one of the first EVM-compatible chains to adopt AA, so this testnet is also used to see how "classical" projects from EVM chains can coexist with the account abstraction feature.

:::

## Design

The design in spirit is similar to the EIP4337. For the simplicity of the implementation, some features from the original standard are removed and will be added later on to the testnet. This is one of the main reasons the breaking changes are expected.

## Fees

The system charges fees by doing an ERC20/ETH `transfer` from an account to the operator's account.

In the EIP4337 you can see three types of gas limits: `verificationGas`, `executionGas`, `preVerificationGas`, that describe the gas limit for the different steps of the transaction's inclusion in a block. 
Currently, zkSync supports only a single field, `ergsLimit`, that covers the fee for all three. When submitting a transaction make sure that `ergsLimit` is enough to cover verification, paying the fee (the ERC20 transfer mentioned above) and the actual execution itself.

By default, calling `estimateGas` adds a constant of `20000` to cover charging the fee and the signature verification for EOA accounts.

## Building custom accounts

### Interface

Each account is recommended to implement the [IAccountAbstraction](https://github.com/matter-labs/v2-testnet-contracts/blob/main/zksync/system-contracts/interfaces/IAccountAbstraction.sol) interface. It contains the following three methods:

- `validateTransaction` is mandatory and will be used by the system to determine if the AA logic agrees to proceed with the transaction. In case the transaction is not accepted 
  (e.g. the signature is wrong) the transaction fails. In case the call to this method returns `true`, the implemented account logic is considered to accept the transaction and will be charged with fee afterwards.
- `executeTransaction` is mandatory and will be called by the system after the fee is charged from the user. This function should perform the execution of the transaction.
- `executeTransactionFromOutside`, technically, is not mandatory, but it is _highly encouraged_, since there needs to be some way, in case of priority mode (e.g. when the operator becomes malicious), to be able to start transactions from your account from ``outside'' (basically this is the fallback to the standard Ethereum approach, where an EOA starts transaction from your smart contract).

Note that each of these methods accept the [Transaction](https://github.com/matter-labs/v2-testnet-contracts/blob/0e1c95969a2f92974370326e4430f03e417b25e7/l2/system-contracts/TransactionHelper.sol#L15) struct. 
While some of its fields are self-explanatory, there are also 6 `reserved` fields, the meaning of each is defined by the transaction's type. We decided to not give these fields names, since they might be unneeded in some future transaction types. For now, the convention is:

- `reverted[0]` is the nonce.
- `reserved[1]` is `msg.value` that should be passed with the transaction.

An example of the implementation of the AA interface is the [implementation](https://github.com/matter-labs/v2-testnet-contracts/blob/6a93ff85d33dfff0008624eb9777d5a07a26c55d/l2/system-contracts/DefaultAA.sol#L16) of the EOA account. 
Note that this account, just like standard EOA accounts on Ethereum, successfully returns empty value whenever it is called by an external address, while this may not be the behaviour that you would like for your account.

### EIP1271

If you are building a smart wallet, we also _highly encourage_ you to implement the [EIP1271](https://eips.ethereum.org/EIPS/eip-1271) signature-validation scheme. 
This is the standard that is endorsed by the zkSync team. It is used in the signature-verification library described below in this section.

### The deployment process

The process of deploying account logic is very similar to the one of deploying a smart contract. 
In order to protect smart contracts that do not want to be treated as an account, a different method of the deployer system contract should be used to do it. 
Instead of using `create`/`create2`, you should use the `createAA`/`create2AA` methods of the deployer system contract.

Here is an example of how to deploy account logic using the `zksync-web3` SDK:

```ts
import { ContractFactory } from "zksync-web3";

const contractFactory = new ContractFactory(abi, bytecode, initiator, "createAA");
const aa = await contractFactory.deploy(...args);
await aa.deployed();
```

### Limitations of the verification step

In order to protect the system from a DoS threat, the verification step must have the following limitations:

- The account logic can only access its own storage (calling other contracts is allowed only in rare whitelisted cases).
- The account logic can not use context variables (e.g. `block.number`).
- It is also required that your account increases the nonce by 1. This restriction is only needed to preserve transaction hash collision resistance. In the future, this requirement will be lifted to allow more generic use-cases (e.g. privacy protocols).

Transactions that violate the rules above will not be accepted by the API, though these requirements can not be enforced on the circuit/VM level and do not apply to L1->L2 transactions.

To let you try out the feature faster, we decided to release account abstraction publicly before fully implementing the limitations' checks for the verification step of the account. 
Currently, your transactions may pass through the API despite violating the requirements above, but soon this will be changed.

### Nonce holder contract

For optimization purposes, both [tx nonce and the deployment nonce](./contracts.md#differences-in-create-behaviour) are put in one storage slot inside the [NonceHolder](./system-contracts.md#inonceholder) system contracts. 
In order to increment the nonce of your account, it is highly recommended to call the [incrementNonceIfEquals](https://github.com/matter-labs/v2-testnet-contracts/blob/0e1c95969a2f92974370326e4430f03e417b25e7/l2/system-contracts/interfaces/INonceHolder.sol#L10) function and pass the value of the nonce provided in the transaction.

This is one of the whitelisted calls, where the account logic is allowed to call outside smart contracts.

### Sending transactions from an account

For now, only EIP712 transactions are supported. To submit a transaction from a specific account, you should provide the `aaParams` object with the `from` and `signature` fields in the custom data:

```ts
import { utils } from "zksync-web3";

// here the `tx` is a `TransactionRequest` object from `zksync-web3` SDK.
// and the zksyncProvider is the `Provider` object from `zksync-web3` SDK connected to zkSync network.
tx.customData = {
  ...tx.customData,
  aaParams: {
    from: aaAddress,
    signature: aaSignature,
  },
};
const serializedTx = utils.serialize({ ...tx });

const sentTx = await zksyncProvider.sendTransaction(serializedTx);
```

## `aa-signature-checker`

Your project can start preparing for native AA support. We highly encourage you to do so, since it will allow you to onboard hundreds of thousands of users (e.g. Argent users that already use the first version of zkSync). 
We expect that in the future even more users will switch to smart wallets.

One of the most notable differences between various types of accounts to be built is different signature schemes. We expect accounts to support the [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) standard. Our team has created a utility library for verifying account signatures. Currently, it only supports ECDSA signatures, but we will add support for EIP-1271 very soon as well.

The `aa-signature-checker` library provides a way to verify signatures for different account implementations. Currently it only supports verifying ECDSA signatures. Very soon we will add support for EIP-1271 as well.

_We strongly encourage you to use this library whenever you need to check that a signature of an account is correct._

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
export async function isMessageSignatureCorrect(address: string, message: ethers.Bytes | string, signature: SignatureLike): Promise<boolean>;

export async function isTypedDataSignatureCorrect(
  address: string,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>,
  signature: SignatureLike
): Promise<boolean>;
```

Currently these methods only support verifying ECDSA signatures, but very soon they will support EIP1271 signature verification as well.

Both of these methods return `true` or `false` depending on whether the message signature is correct.
