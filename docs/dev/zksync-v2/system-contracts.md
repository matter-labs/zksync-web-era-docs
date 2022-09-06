# Understanding system contracts

In order to keep the zero-knowledge circuits as simple as possible and enable simple extensions, a large chunk of the logic of zkSync was moved to the so called "system contracts" -- a set of contracts that have special priviliges and serve special purposes, e.g. deployment of contracts, making sure that the user pays only once for publishing contracts' calldata, etc.

Until the code for the system contracts has gone thorough testing, the code for all the system contracts will not be public. This section will only provide you with the knowledge needed to build on zkSync.

## Interfaces

The addresses and the interfaces of the system contracts can be found [here](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol).

This section will describe semantic meaning of some of the most popular system contracts.

## ContractDeployer

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IContractDeployer.sol)

This contract is used to deploy new smart contracts. Its job is to make sure that the bytecode for each deployed contract is known. This contract also defined the derivation address. Whenever a contract is deployed it emits the `ContractDeployed` event.

In the future, we will add the description on how to interact directly with this contract.

## IL1Messenger

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IL1Messenger.sol)

This contract is used to send messages from zkSync to Ethereum L1. For each message sent the `L1MessageSent` event is emitted.

## INonceHolder

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol)

This contract stores account nonces. The account nonces are stored in a single place for efficiency ([the tx nonce and the deployment nonce](./contracts.md#differences-in-create-behaviour) are stored in a single place) and also for the ease of the operator.

## Bootloader

For greater extensibility and to lower the overhead, some parts of the protocol (e.g. account abstraction rules) were moved to an ephemeral contract called _bootloader_. We call it ephemeral since formally it is never deployed and can not be called, but it has a formal [address](https://github.com/matter-labs/v2-testnet-contracts/blob/8de367778f3b7ed7e47ee8233c46c7fe046a75a3/l2/system-contracts/Constants.sol#L19) that is used on `msg.sender`, when it calls other contracts.

For now, you do not have to know any details about it, but knowing that it exists is important when you develop using the account abstraction feature. You can always assume that the bootloader is not malicious and it is a part of the protocol. In the future, the code of the bootloader will be made public and any changes to it will also mean an upgrade to the protocol.

