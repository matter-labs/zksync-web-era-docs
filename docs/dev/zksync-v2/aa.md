# Important: Account abstraction support

## Introduction

On Ethereum, there are two types of accounts: externally owned accounts (EOAs) and smart contracts. The former type is the only one that can initiate transactions, 
while the latter is the only one that can implement arbitrary logic. For some use-cases, like smart-contract wallets or privacy protocols, this difference can creates a lot of friction.
As a result they require L1 relayers, e.g. an EOA to help facilitate transactions from a smart-contract wallet.

Accounts in zkSync 2.0 can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract. This feature is called "account abstraction" and it is aimed to resolve the issues described above.

::: warning Unstable feature

This is the test release of account abstraction (AA) on zkSync 2.0. We are very happy to hear your feedback! Please note: **breaking changes to the API/interfaces required for AA should be anticipated.**

zkSync 2.0 is one of the first EVM-compatible chains to adopt AA, so this testnet is also used to see how "classical" projects from EVM chains can coexist with the account abstraction feature.

:::

## Design

The account abstraction protocol on zkSync is in spirit very similar to EIP4337, however there are still some changes for the sake of efficiency and better UX.

### IAccount interface

Each account is recommended to implement the [IAccountAbstraction](https://github.com/matter-labs/v2-testnet-contracts/blob/main/zksync/system-contracts/interfaces/IAccountAbstraction.sol) interface. It contains the following five methods:

- `validateTransaction` is mandatory and will be used by the system to determine if the AA logic agrees to proceed with the transaction. In case the transaction is not accepted (e.g. the signature is wrong) the transaction fails. In case the call to this method returns `true`, the implemented account logic is considered to accept the transaction and will be charged with fee afterwards.
- `executeTransaction` is mandatory and will be called by the system after the fee is charged from the user. This function should perform the execution of the transaction.
- `payForTransaction` is optional and will be called by the system if the transaction has no paymaster, i.e. the account is willing to pay for the transaction. This method should be used to pay for the fees by the account. Note, that if your account will never pay any fees and always rely on the [paymaster](#paymasters) feature, you don't have to implement this method. This method must send at least `tx.gasprice * tx.ergsLimit` to the operator.
- `prePaymaster` is optional and will be called by the system if the transaction has a paymaster, i.e. there is someone else who will pay the transaction fees for the user. This method should be used to prepare for the interaction with the paymaster. One of the notable [examples](#approval-based-paymaster-flow) where it can be helpful is to approve the ERC-20 tokens for the paymaster.
- `executeTransactionFromOutside`, technically, is not mandatory, but it is _highly encouraged_, since there needs to be some way, in case of priority mode (e.g. when the operator becomes malicious), to be able to start transactions from your account from ``outside'' (basically this is the fallback to the standard Ethereum approach, where an EOA starts transaction from your smart contract).

### IPaymaster interface

Like the original EIP4337, our account abstraction protocol supports paymasters: accounts that can compensate for other accounts' execution. You can read more implementing paymasters [here](#paymasters).

Each paymaster is recommended to implement the following interface [IPaymaster](https://github.com/matter-labs/v2-testnet-contracts/blob/main/zksync/system-contracts/interfaces/IPaymaster.sol). It contains the following two methods:

- `validateAndPayForPaymasterTransaction` is mandatory and will be used by the system to determine if the paymaster approves paying for this transaction. If the paymaster is willing to pay for the transaction, this method must send at least `tx.gasprice * tx.ergsLimit` to the operator.
- `postOp` is optional and will be called after the transaction has been executed. Note, that unlike the original EIP4337, there *is no guarantee that this method will be called*. In particular, this method won't be called if the transaction has failed with out of gas error.

### Reserved fields of the `Transaction` struct with special meaning

Note that each of the methods above accept the [Transaction](https://github.com/matter-labs/v2-testnet-contracts/blob/0e1c95969a2f92974370326e4430f03e417b25e7/l2/system-contracts/TransactionHelper.sol#L15) struct. 
While some of its fields are self-explanatory, there are also 6 `reserved` fields, the meaning of each is defined by the transaction's type. We decided to not give these fields names, since they might be unneeded in some future transaction types. For now, the convention is:

- `reserved[0]` is the nonce.
- `reserved[1]` is `msg.value` that should be passed with the transaction.

### Flow

Each transaction goes through the following flow:

#### The validation step

During the validation step, the account should decide whether it accepts the transaction and if so, pay the fees for it. If any of the parts of the validation fails, the account is not charged with any fee and such transaction can not be included in a block.

**Step 1.** The system calls the `validateTransaction` method of the account. If it does not revert, based on whether the transaction has the paymaster the following methods are called:

**Step 2 (no paymaster).** The system calls the `payForTransaction` method of the account. If it does not revert,we proceed to the third step.

**Step 2 (paymaster).** The system calls the `prePaymaster` method of the sender. If this call does not revert, then the `validateAndPayForPaymasterTransaction` method of the paymaster is called. If it does not revert, we proceeed to the third step.

**Step 3.** The system verifies that the account has sent at least `tx.ergsPrice * tx.ergsLimit` ETH to the bootloader. If it is the case, the veriifcation is considered complete and we can proceed to the next step.

#### The execution step

The execution step is considered responsible for the actual execution of the trasansaction and sending the refunds for any unused ergs back to the user. If there is any revert on this step, the transaction is still considered valid and will be included in the block.

**Step 4.** The system calls the `executeTransaction` method of the account.

**Step 5. (only in case the transaction had the paymaster)** The `postOp` method of the paymaster is called. This step should typically be used for refunding the sender the unused ergs in case the paymaster was used to facilitate paying fees in ERC-20 tokens.

### Fees

The system charges fees by doing an ERC20/ETH `transfer` from an account to the operator's account.

In the EIP4337 you can see three types of gas limits: `verificationGas`, `executionGas`, `preVerificationGas`, that describe the gas limit for the different steps of the transaction's inclusion in a block. 
Currently, zkSync supports only a single field, `ergsLimit`, that covers the fee for all three. When submitting a transaction make sure that `ergsLimit` is enough to cover verification, paying the fee (the ERC20 transfer mentioned above) and the actual execution itself.

By default, calling `estimateGas` adds a constant of `20000` to cover charging the fee and the signature verification for EOA accounts.

## Extending EIP4337

To provide DDoS protection for the operator, the original EIP4337 imposes several [restrictions](https://eips.ethereum.org/EIPS/eip-4337#simulation) the validation step of the account. Most of them, especially regarding the forbidden opcodes are still relevant. However, several restrictions have been lifted for better UX.

### Extending the allowed opcodes

- It is allowed to `call`/`delegateCall`/`staticcall` contracts that were already deployed. Unlike Ethereum, we have no way to edit the code that was deployed or delete the contract via selfdestruct, so we can be sure that the code during the execution of the contract will be the same.

### Extending the set of slots that belong to a user

In the original EIP, the `validateTransaction` step of the AA allows the account to read only the storage slots of its own. However, there are slots that *semantically* belong to that user, but actually located on another contract’s addresses. A notable example is `ERC20` balance.

This limitation provides DDoS safety by ensuring that the slots used for validation by various accounts *do not overlap*, so there is no need for them to *actually* belong to the account’s storage.

To allow reading the ERC20 balance of the user, its allowance on the validation step, the following types of slots will be allowed for an account with address `A` on the validation step:

1. Slots that belong to address `A`.
2. Slots `A` on any other address.
3. Slots of type `keccak256(A || X)` on any other address. (to cover `mapping(address => value)`, which is usually used for balance in ERC20 token.
4. Slots of type `keccak256(X || OWN)` on any other address, where `OWN` is some slot of the previous (to cover `mapping(address ⇒ mapping(address ⇒ uint256))` that are usually used for `allowances` in ERC20 tokens.

### What could be allowed in the future

In the future, we might even allow time-bound transactions, e.g. allow checking that `block.timestamp <= value` if it returned `false`, etc. This would require deploying a separate library of such trusted methods, but it would greatly the account abstraction experience.

## Building custom accounts

As already mentioned above, each account should implement the [IAccount](#iaccount-interface) interface. 

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

## Paymasters

TODO:

### Validation rules

TODO:

### General paymaster flow

TODO:

### Approval-based paymaster flow

TODO:


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
