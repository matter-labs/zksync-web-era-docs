# System contracts

To keep the zero-knowledge circuits as simple as possible and enable simple extensions, a large chunk of the logic of zkSync was moved to the so-called "system contracts" – a 
set of contracts that have special privileges and serve special purposes, e.g. deployment of contracts, making sure that the user pays only once for publishing contracts' calldata, etc.

The code for the system contracts will not be public until it has gone through thorough testing. This section will only provide you with the 
knowledge needed to build on zkSync.

## Interfaces

The addresses and the interfaces of the system contracts can be found [here](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/Constants.sol).

This section will describe the semantic meaning of some of the most popular system contracts. 

## ContractDeployer

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/interfaces/IContractDeployer.sol#L5)

This contract is used to deploy new smart contracts. Its job is to make sure that the bytecode for each deployed contract is known. This contract also defines the derivation 
address. Whenever a contract is deployed, it emits the `ContractDeployed` event.

In the future, we will add a description of how to interact directly with this contract.

## IL1Messenger

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/interfaces/IL1Messenger.sol#L5)

This contract is used to send messages from zkSync to Ethereum. For each message sent, the `L1MessageSent` event is emitted.

## INonceHolder

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/interfaces/INonceHolder.sol#L5)

This contract stores account nonces. The account nonces are stored in a single place for efficiency ([the tx nonce and the deployment nonce](./contracts.md#differences-in-create-behaviour) are stored in a single place) and also for the ease of the operator.

## Bootloader

For greater extensibility and to lower the overhead, some parts of the protocol (e.g. account abstraction rules) were moved to an ephemeral contract called a _bootloader_. We call it ephemeral since formally it is never deployed and can not be called, but it has a formal [address](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/Constants.sol#L19) that is used on `msg.sender`, when it calls other contracts.

For now, you do not have to know any details about it, but knowing that it exists is important when you develop using the account abstraction feature. You can always assume that the bootloader is not malicious and it is a part of the protocol. In the future, the code of the bootloader will be made public and any changes to it will also mean an upgrade to the protocol.

## Protected access to some of the system contracts

Some of the system contracts have an impact on the account that may not be expected on Ethereum. For instance, on Ethereum the only way an EOA could increase its nonce is by sending a transaction. Also, sending a transaction could only increase nonce by 1 at a time. On zkSync nonces are implemented via the [NonceHolder](#inonceholder) system contract and, if naively implemented, the users could be allowed to increment their nonces by calling this contract. That's why the calls to most of the non-view methods of the nonce holder were restricted to be called only with a special `isSystem` flag, so that interactions with important system contracts could be consciously managed by the developer of the account.

The same applies to the [ContractDeployer](#contractdeployer) system contract. This means that, for instance, you would need to explicitly allow your users to deploy contracts, as it is done in the DefaultAccount's [implementation](https://github.com/matter-labs/v2-testnet-contracts/blob/3f4b6f906c649671022794ecb5cfc1151c278d93/l2/system-contracts/DefaultAccount.sol#L88).
