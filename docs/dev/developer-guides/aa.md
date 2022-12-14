# Account abstraction support

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Introduction

On Ethereum there are two types of accounts: [externally owned accounts (EOAs)](https://ethereum.org/en/developers/docs/accounts/#externally-owned-accounts-and-key-pairs) and [contracts accounts](https://ethereum.org/en/developers/docs/accounts/#contract-accounts).
The former type is the only one that can initiate transactions,
while the latter is the only one that can implement arbitrary logic. For some use-cases, like smart-contract wallets or privacy protocols, this difference can create a lot of friction.
As a result, such applications require L1 relayers, e.g. an EOA to help facilitate transactions from a smart-contract wallet.

Accounts in zkSync 2.0 can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract. This feature is called "account
abstraction" and it aims to resolve the issues described above.

::: warning Unstable feature

This is the test release of account abstraction (AA) on zkSync 2.0. We are very happy to hear your feedback! Please note: **breaking changes to the API/interfaces required for AA should be anticipated.**

zkSync 2.0 is one of the first EVM-compatible chains to adopt AA, so this testnet is also used to see how "classical" projects from EVM chains can coexist with the account abstraction feature.

:::

## Prerequisites

To better understand this page, we recommend you take some time to first read a guide on [accounts](https://ethereum.org/en/developers/docs/accounts/).

## Design

The account abstraction protocol on zkSync is very similar to [EIP4337](https://eips.ethereum.org/EIPS/eip-4337), though our protocol is still different for the sake of efficiency and better UX.

### Keeping nonces unique

::: warning Changes are expected

The current model has some important drawbacks: it does not allow custom wallets to send multiple transactions at the same time, while keeping a deterministic ordering. For
EOAs the nonces are expected to be sequentially growing, while for the custom accounts the order of transactions can not be determined for sure.

In the future, we plan to switch to a model where the accounts could choose whether they would want to have sequential nonce ordering (the same as EOA) or they want to have arbitrary ordering.

:::

One of the important invariants of every blockchain is that each transaction has a unique hash. Holding this property with an arbitrary account abstraction is not trivial,
though accounts can, in general, accept multiple identical transactions. Even though these transactions would be technically valid by the rules of the blockchain, violating
hash uniqueness would be very hard for indexers and other tools to process.

There needs to be a solution on the protocol level that is both cheap for users and robust in case of a malicious operator. One of the easiest ways to ensure that transaction hashes do not repeat is to have a pair (sender, nonce) always unique.

The following protocol is used:

- Before each transaction starts, the system queries the [NonceHolder](./contracts/system-contracts.md#inonceholder) to check whether the provided nonce has already been used or not.
- If the nonce has not been used yet, the transaction validation is run. The provided nonce is expected to be marked as "used" during this time.
- After the validation, the system checks whether this nonce is now marked as used.

Users will be allowed to use any 256-bit number as nonce and they can put any non-zero value under the corresponding key in the system contract. This is already supported by
the protocol, but not on the server side.

More documentation on various interactions with the `NonceHolder` system contract as well as tutorials will be available once support on the server side is released. For now,
it is recommended to only use the `incrementNonceIfEquals` method, which practically enforces the sequential ordering of nonces.

### Standardizing transaction hashes

In the future, it is planned to support efficient proofs of transaction inclusion on zkSync. This would require us to calculate the transaction's hash in the [bootloader](../developer-guides/contracts/system-contracts.md#bootloader). Since these calculations won't be free to the user, it is only fair to include the transaction's hash in the interface of the AA
methods (in case the accounts may need this value for some reason). That's why all the methods of the `IAccount` and `IPaymaster` interfaces, which are described below,
contain the hash of the transaction as well as the recommended signed digest (the digest that is signed by EOAs for this transaction).

### IAccount interface

Each account is recommended to implement the [IAccount](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IAccount.sol) interface. It contains the following five methods:

- `validateTransaction` is mandatory and will be used by the system to determine if the AA logic agrees to proceed with the transaction. In case the transaction is not accepted (e.g. the signature is wrong) the method should revert. In case the call to this method succeedes, the implemented account logic is considered to accept the transaction, and the system will proceed with the transaction flow.
- `executeTransaction` is mandatory and will be called by the system after the fee is charged from the user. This function should perform the execution of the transaction.
- `payForTransaction` is optional and will be called by the system if the transaction has no paymaster, i.e. the account is willing to pay for the transaction. This method should be used to pay for the fees by the account. Note, that if your account will never pay any fees and will always rely on the [paymaster](#paymasters) feature, you don't have to implement this method. This method must send at least `tx.gasprice * tx.ergsLimit` ETH to the [bootloader](./contracts/system-contracts.md#bootloader) address.
- `prePaymaster` is optional and will be called by the system if the transaction has a paymaster, i.e. there is a different address that pays the transaction fees for the user. This method should be used to prepare for the interaction with the paymaster. One of the notable [examples](#approval-based-paymaster-flow) where it can be helpful is to approve the ERC-20 tokens for the paymaster.
- `executeTransactionFromOutside`, technically, is not mandatory, but it is _highly encouraged_, since there needs to be some way, in case of priority mode (e.g. if the operator is unresponsive), to be able to start transactions from your account from ``outside'' (basically this is the fallback to the standard Ethereum approach, where an EOA starts transaction from your smart contract).

### IPaymaster interface

Like in EIP4337, our account abstraction protocol supports paymasters: accounts that can compensate for other accounts' transactions execution. You can read more about them
[here](#paymasters).

Each paymaster should implement the [IPaymaster](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IPaymaster.sol) interface. It contains the following two methods:

- `validateAndPayForPaymasterTransaction` is mandatory and will be used by the system to determine if the paymaster approves paying for this transaction. If the paymaster is willing to pay for the transaction, this method must send at least `tx.gasprice * tx.ergsLimit` to the operator. It should return the `context` that will be one of the call parameters to the `postOp` method.
- `postOp` is optional and will be called after the transaction has been executed. Note that unlike EIP4337, there _is no guarantee that this method will be called_. In particular, this method won't be called if the transaction has failed with `out of gas` error. It takes four parameters: the context returned by the `validateAndPayForPaymasterTransaction` method, the transaction itself, whether the execution of the transaction succeeded, and also the maximum amount of ergs the paymaster might be refunded with. More documentation on refunds will be available once their support is added to zkSync.

### Reserved fields of the `Transaction` struct with special meaning

Note that each of the methods above accept the [Transaction](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/TransactionHelper.sol#L15) struct.
While some of its fields are self-explanatory, there are also 6 `reserved` fields, the meaning of each is defined by the transaction's type. We decided to not give these fields names, since they might be unneeded in some future transaction types. For now, the convention is:

- `reserved[0]` is the nonce.
- `reserved[1]` is `msg.value` that should be passed with the transaction.

### The transaction flow

Each transaction goes through the following flow:

#### The validation step

During the validation step, the account should decide whether it accepts the transaction and if so, pay the fees for it. If any part of the validation fails, the account is not charged a fee, and such transaction can not be included in a block.

**Step 1.** The system checks that the nonce of the transaction has not been used before. You can read more about preserving the nonce uniqueness [here](#keeping-nonces-unique).

**Step 2.** The system calls the `validateTransaction` method of the account. If it does not revert, proceed to the next step.

**Step 3.** The system checks that the nonce of the transaction has been marked as used.

**Step 4 (no paymaster).** The system calls the `payForTransaction` method of the account. If it does not revert, proceed to the next step.

**Step 4 (paymaster).** The system calls the `prePaymaster` method of the sender. If this call does not revert, then the `validateAndPayForPaymasterTransaction` method of the paymaster is called. If it does not revert too, proceed to the next step.

**Step 5.** The system verifies that the bootloader has received at least `tx.ergsPrice * tx.ergsLimit` ETH to the bootloader. If it is the case, the verification is considered
complete and we can proceed to the next step.

#### The execution step

The execution step is considered responsible for the actual execution of the transaction and sending the refunds for any unused ergs back to the user. If there is any revert on this step, the transaction is still considered valid and will be included in the block.

**Step 6.** The system calls the `executeTransaction` method of the account.

**Step 7. (only in case the transaction has a paymaster)** The `postOp` method of the paymaster is called. This step should typically be used for refunding the sender the
unused ergs in case the paymaster was used to facilitate paying fees in ERC-20 tokens.

### Fees

In EIP4337 you can see three types of gas limits: `verificationGas`, `executionGas`, `preVerificationGas`, that describe the gas limit for the different steps of the transaction inclusion in a block.
zkSync 2 has only a single field, `ergsLimit`, that covers the fee for all three. When submitting a transaction, make sure that `ergsLimit` is enough to cover verification,
paying the fee (the ERC20 transfer mentioned above), and the actual execution itself.

By default, calling `estimateGas` adds a constant to cover charging the fee and the signature verification for EOA accounts.

## Using the `SystemContractsCaller` library

For the sake of security, both `NonceHolder` and the `ContractDeployer` system contracts can only be called with a special `isSystem` flag. You can read more about it [here](./contracts/system-contracts.md#protected-access-to-some-of-the-system-contracts). To make a call with this flag, the `systemCall`/`systemCallWithPropagatedRevert`/`systemCallWithReturndata` methods of the [SystemContractsCaller](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/SystemContractsCaller.sol) library should be used.

Using this library is practically a must when developing custom accounts since this is the only way to call non-view methods of the `NonceHolder` system contract. Also, you will have to use this library if you want to allow users to deploy contracts of their own. You can use the [implementation](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol) of the EOA account as a reference.

## Extending EIP4337

To provide DoS protection for the operator, EIP4337 imposes several [restrictions](https://eips.ethereum.org/EIPS/eip-4337#simulation) on the validation step of the account.
Most of them, especially those regarding the forbidden opcodes, are still relevant. However, several restrictions have been lifted for better UX.

### Extending the allowed opcodes

- It is allowed to `call`/`delegateCall`/`staticcall` contracts that were already deployed. Unlike Ethereum, we have no way to edit the code that was deployed or delete the contract via selfdestruct, so we can be sure that the code during the execution of the contract will be the same.

### Extending the set of slots that belong to a user

In the original EIP, the `validateTransaction` step of the AA allows the account to read only the storage slots of its own. However, there are slots that _semantically_ belong to that user but are actually located on another contract’s addresses. A notable example is `ERC20` balance.

This limitation provides DDoS safety by ensuring that the slots used for validation by various accounts _do not overlap_, so there is no need for them to _actually_ belong to the account’s storage.

To enable reading the user's ERC20 balance or allowance on the validation step, the following types of slots will be allowed for an account with address `A` on the validation step:

1. Slots that belong to address `A`.
2. Slots `A` on any other address.
3. Slots of type `keccak256(A || X)` on any other address. (to cover `mapping(address => value)`, which is usually used for balance in ERC20 tokens).
4. Slots of type `keccak256(X || OWN)` on any other address, where `OWN` is some slot of the previous (third) type (to cover `mapping(address ⇒ mapping(address ⇒ uint256))` that are usually used for `allowances` in ERC20 tokens).

### What could be allowed in the future?

In the future, we might even allow time-bound transactions, e.g. allow checking that `block.timestamp <= value` if it returned `false`, etc. This would require deploying a separate library of such trusted methods, but it would greatly increase the capabilities of accounts.

## Building custom accounts

As already mentioned above, each account should implement the [IAccount](#iaccount-interface) interface.

An example of the implementation of the AA interface is the [implementation](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L17) of the EOA account.
Note that this account, just like standard EOA accounts on Ethereum, successfully returns empty value whenever it is called by an external address, while this may not be the behaviour that you would like for your account.

### EIP1271

If you are building a smart wallet, we also _highly encourage_ you to implement the [EIP1271](https://eips.ethereum.org/EIPS/eip-1271) signature-validation scheme.
This is the standard that is endorsed by the zkSync team. It is used in the signature-verification library described below in this section.

### The deployment process

The process of deploying account logic is very similar to the one of deploying a smart contract.
In order to protect smart contracts that do not want to be treated as an account, a different method of the deployer system contract should be used to do it.
Instead of using `create`/`create2`, you should use the `createAccount`/`create2Account` methods of the deployer system contract.

Here is an example of how to deploy account logic using the `zksync-web3` SDK:

```ts
import { ContractFactory } from "zksync-web3";

const contractFactory = new ContractFactory(abi, bytecode, initiator, "createAccount");
const aa = await contractFactory.deploy(...args);
await aa.deployed();
```

### Limitations of the verification step

::: warning Not implemented yet

The verification rules are not fully enforced right now. Even if your custom account works right now, it might stop working in the future if it does not follow the rules below.

:::

In order to protect the system from a DoS threat, the verification step must have the following limitations:

- The account logic can only touch slots that belong to the account. Note, that the [definition](#extending-the-set-of-slots-that-belong-to-a-user) is far beyond just the slots that are at the users' address.
- The account logic can not use context variables (e.g. `block.number`).
- It is also required that your account increases the nonce by 1. This restriction is only needed to preserve transaction hash collision resistance. In the future, this requirement will be lifted to allow more generic use-cases (e.g. privacy protocols).

Transactions that violate the rules above will not be accepted by the API, though these requirements can not be enforced on the circuit/VM level and do not apply to L1->L2 transactions.

To let you try out the feature faster, we decided to release account abstraction publicly before fully implementing the limitations' checks for the verification step of the account.
Currently, your transactions may pass through the API despite violating the requirements above, but soon this will be changed.

### Nonce holder contract

For optimization purposes, both [tx nonce and the deployment nonce](./contracts/contracts.md#differences-in-create-behaviour) are put in one storage slot inside the [NonceHolder](./contracts/system-contracts.md#inonceholder) system contracts.
In order to increment the nonce of your account, it is highly recommended to call the [incrementNonceIfEquals](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L12) function and pass the value of the nonce provided in the transaction.

This is one of the whitelisted calls, where the account logic is allowed to call outside smart contracts.

### Sending transactions from an account

For now, only EIP712 transactions are supported. To submit a transaction from a specific account, you should provide the `from` field of the transaction as the address of the sender and the `customSignature` field of the `customData` with the signature for the account.

```ts
import { utils } from "zksync-web3";

// here the `tx` is a `TransactionRequest` object from `zksync-web3` SDK.
// and the zksyncProvider is the `Provider` object from `zksync-web3` SDK connected to zkSync network.
tx.from = aaAddress;
tx.customData = {
  ...tx.customData,
  customSignature: aaSignature,
};
const serializedTx = utils.serialize({ ...tx });

const sentTx = await zksyncProvider.sendTransaction(serializedTx);
```

## Paymasters

Imagine being able to pay fees for users of your protocol! Paymasters are accounts that can compensate for other accounts' transactions. The other important use-case of
paymasters is to facilitate paying fees in ERC20 tokens. While ETH is the formal fee token in zkSync, paymasters can provide the ability to exchange ERC20 tokens to ETH on the fly.

If users want to interact with a paymaster, they should provide the non-zero `paymaster` address in their EIP712 transaction. The input data to the paymaster is provided in the `paymasterInput` field of the paymaster.

### Paymaster verification rules

::: warning Not implemented yet

The verification rules are not fully enforced right now. Even if your paymaster works right now, it might stop working in the future if it does not follow the rules below.

:::

Since multiple users should be allowed to access the same paymaster, malicious paymasters _can_ do a DoS attack on our system. To work around this, a system similar to the [EIP4337 reputation scoring](https://eips.ethereum.org/EIPS/eip-4337#reputation-scoring-and-throttlingbanning-for-paymasters) will be used.

Unlike in the original EIP, paymasters are allowed to touch any storage slots. Also, the paymaster won't be throttled if either of the following is true:

- More than `X` minutes have passed since the verification has passed on the API nodes (the exact value of `X` will be defined later).
- The order of slots being read is the same as during the run on the API node and the first slot whose value has changed is one of the user's slots. This is needed to protect the paymaster from malicious users (e.g. the user might have erased the allowance for the ERC20 token).

### Built-in paymaster flows

While some paymasters can trivially operate without any interaction from users (e.g. a protocol that always pays fees for their users), some require active participation from the transaction's sender. A notable example is a paymaster that swaps users' ERC20 tokens to ETH as it requires the user to set the necessary allowance to the paymaster.

The account abstraction protocol by itself is generic and allows both accounts and paymasters to implement arbitrary interactions. However, the code of default accounts (EOAs) is constant, but we still want them to be able to participate in the ecosystem of custom accounts and paymasters. That's why we have standardized the `paymasterInput` field of the transaction to cover the most common uses-cases of the paymaster feature.

Your accounts are free to implement or not implement the support for these flows. However, this is highly encouraged to keep the interface the same for both EOAs and custom accounts.

#### General paymaster flow

It should be used if no prior actions are required from the user for the paymaster to operate.

The `paymasterInput` field must be encoded as a call to a function with the following interface:

```solidity
function general(bytes calldata data);
```

EOA accounts will do nothing and the paymaster can interpret this `data` in any way.

#### Approval-based paymaster flow

It should be used if the user is required to set certain allowance to a token for the paymaster to operate. The `paymasterInput` field must be encoded as a call to a function with the following signature:

```solidity
function approvalBased(
    address _token,
    uint256 _minAllowance,
    bytes calldata _innerInput
)
```

The EOA will ensure that the allowance of the `_token` towards the paymaster is set to at least `_minAllowance`. The `_innerInput` param is an additional payload that can be sent to the paymaster to implement any logic (e.g. an additional signature or key that can be validated by the paymaster).

If you are developing a paymaster, you _should not_ trust the transaction sender to behave honestly (e.g. provide the required allowance with the `approvalBased` flow). These flows serve mostly as instructions to EOAs and the requirements should always be double-checked by the paymaster.

#### Working with paymaster flows using `zksync-web3` SDK

The `zksync-web3` SDK provides [methods](../../api/js/utils.md#encoding-paymaster-param) for encoding correctly formatted paymaster params for all of the built-in paymaster flows.

### Testnet paymaster

To ensure users experience paymasters on testnet, as well as keep supporting paying fees in ERC20 tokens, the Matter Labs team provides the testnet paymaster, that enables paying fees in ERC20 token at a 1:1 exchange rate with ETH (i.e. one unit of this token is equal to 1 wei of ETH).

The paymaster supports only the [approval based](#approval-based-paymaster-flow) paymaster flow and requires that the `token` param is equal to the token being swapped and `minAllowance` to equal to least `tx.maxFeePerErg * tx.ergsLimit`. In addition, the testnet paymaster does not make use of the `_innerInput` parameter, so nothing should be provided (empty `bytes`).

An example of how to use testnet paymaster can be seen in the [quickstart](./hello-world.md#paying-fees-using-testnet-paymaster) tutorial.

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
