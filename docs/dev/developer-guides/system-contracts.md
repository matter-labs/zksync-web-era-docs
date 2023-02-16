# System contracts

To keep the zero-knowledge circuits as simple as possible and enable simple extensions, a large chunk of the logic of zkSync was moved to the so-called "system contracts" – a set of contracts that have special privileges and serve special purposes, e.g. deployment of contracts, making sure that the user pays only once for publishing contracts' calldata, etc.

The code for the system contracts will not be public until it has gone through thorough testing. This section will only provide you with the knowledge needed to build on zkSync.


## Interfaces

The addresses and the interfaces of the system contracts can be found [here](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol).

This section will describe the semantic meaning of some of the most popular system contracts.

## ContractDeployer

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IContractDeployer.sol#L5)

This contract is used to deploy new smart contracts. Its job is to make sure that the bytecode for each deployed contract is known. This contract also defines the derivation
address. Whenever a contract is deployed, it emits the `ContractDeployed` event.

In the future, we will add a description of how to interact directly with this contract.

## L1Messenger

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/IL1Messenger.sol#L5)

This contract is used to send messages from zkSync to Ethereum. For each message sent, the `L1MessageSent` event is emitted.

## NonceHolder

[Interface](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/interfaces/INonceHolder.sol#L13)

This contract stores account nonces. The account nonces are stored in a single place for efficiency ([the tx nonce and the deployment nonce](../building-on-zksync/contracts/contract-deployment.md#differences-in-create-behaviour) are stored in a single place) and also for the ease of the operator.

## Bootloader

For greater extensibility and to lower the overhead, some parts of the protocol (e.g. account abstraction rules) were moved to an ephemeral contract called a _bootloader_. We call it ephemeral since formally it is never deployed and can not be called, but it has a formal [address](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/Constants.sol#L26) that is used on `msg.sender`, when it calls other contracts.

For now, you do not have to know any details about it, but knowing that it exists is important when you develop using the account abstraction feature. You can always assume that the bootloader is not malicious and it is a part of the protocol. In the future, the code of the bootloader will be made public and any changes to it will also mean an upgrade to the protocol.

## Protected access to some of the system contracts

Some of the system contracts have an impact on the account that may not be expected on Ethereum. For instance, on Ethereum the only way an EOA could increase its nonce is by sending a transaction. Also, sending a transaction could only increase nonce by 1 at a time. On zkSync nonces are implemented via the [NonceHolder](#nonceholder) system contract and, if naively implemented, the users could be allowed to increment their nonces by calling this contract. That's why the calls to most of the non-view methods of the nonce holder were restricted to be called only with a special `isSystem` flag, so that interactions with important system contracts could be consciously managed by the developer of the account.

The same applies to the [ContractDeployer](#contractdeployer) system contract. This means that, for instance, you would need to explicitly allow your users to deploy contracts, as it is done in the DefaultAccount's [implementation](https://github.com/matter-labs/v2-testnet-contracts/blob/main/l2/system-contracts/DefaultAccount.sol#L126).

## L1 Smart contracts

### Diamond

Technically, this L1 smart contract acts as a connector between Ethereum (L1) and zkSync (L2).
This contract checks the validity proof and data availability, handles L2 <-> L1 communication, finalizes L2 state transition, and more.

There are also important contracts deployed on the L2 that can also execute logic called _system contracts_.
Using L2 <-> L1 communication can affect both the L1 and the L2.

### DiamondProxy

This contract uses the [EIP-2535](https://eips.ethereum.org/EIPS/eip-2535) diamond proxy pattern.
It is an in-house implementation that is inspired by the [mudgen reference implementation](https://github.com/mudgen/Diamond).
It has no external functions, only the fallback that delegates a call to one of the facets (target/implementation contract).

So even an upgrade system is a separate facet that can be replaced.

One of the differences from the reference implementation is the ability to freeze access to the facet.

Each of the facets has an associated parameter that indicates if it is possible to freeze access to the facet.

Privileged actors can freeze the **diamond** (not a specific facet!) and all facets with the marker `isFreezable` should be inaccessible until the governor unfreezes the diamond.

### DiamondInit

It is a one-function contract that implements the logic of initializing a diamond proxy.
It is called only once on the diamond constructor and is not saved in the diamond as a facet.

Implementation detail - function returns a magic value just like it is designed in [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271), but the magic value is 32 bytes in size.

### DiamondCutFacet

These smart contracts manage the freezing/unfreezing and upgrades of the diamond proxy.
That being said, the contract must never be frozen.

Currently, freezing and unfreezing are implemented as access control functions. It is fully controlled by the governor but can be changed later.
The governor can call `emergencyFreezeDiamond` to freeze the diamond and `unfreezeDiamond` to restore it.

Another purpose of `DiamondCutFacet` is to upgrade the facets. The upgrading is split into 2-3 phases:

- `proposeDiamondCut` - propose an upgrade by the governor.
- `approveEmergencyDiamondCutAsSecurityCouncilMember` - approve the upgrade by the security council.
- `executeDiamondCutProposal` - finalize the upgrade.

The upgrade itself characterizes by three variables:

- `facetCuts` - a set of changes to the facets (adding new facets, removing facets, and replacing them).
- pair `(address _initAddress, bytes _calldata)` for initializing the upgrade by making a delegate call to `_initAddress` with `_calldata` inputs.

NOTE: `proposeDiamondCut` - commits data associated with an upgrade but does not execute it.
While the upgrade is associated with `facetCuts` and `(address _initAddress, bytes _calldata)` the upgrade will be committed to the
`facetCuts` and `_initAddress`. This is done on purpose, to leave some freedom to the governor to change calldata for
the upgrade between proposing and executing it.

### GettersFacet

Separate facet, whose only function is providing `view` and `pure` methods. It also implements [diamond loupe](https://eips.ethereum.org/EIPS/eip-2535#diamond-loupe) which makes managing facets easier.

### GovernanceFacet

Controls changing the privileged addresses such as governor and validators or one of the system parameters (L2 bootloader bytecode hash, verifier address, verifier parameters, etc).

### MailboxFacet

The facet that handles L2 <-> L1 communication, an overview for which can be found in the [L1 / L2 Interoperability guide](../developer-guides/bridging/l1-l2-interop.md).

The Mailbox only cares about transferring information from L2 to L1 and the other way but does not hold or transfer any assets (ETH, ERC20 tokens, or NFTs).

L1 -> L2 communication is implemented as requesting an L2 transaction on L1 and executing it on L2. This means a user can call the function on the L1 contract to save the data about the transaction in some queue. Later on, a validator can process such transactions on L2 and mark them as processed on the L1 priority queue.

Currently, it is used only for sending information from L1 to L2 or implementing a multi-layer protocol, but it is planned to use a priority queue for the censor-resistance mechanism. Relevant functions for L1 -> L2 communication: `requestL2Transaction`/`l2TransactionBaseCost`/`serializeL2Transaction`.

**NOTE**: For each executed transaction L1 -> L2, the system program necessarily sends an L2 -> L1 log.

The semantics of such L2 -> L1 log are always:

- sender = BOOTLOADER_ADDRESS.
- key = hash(L1ToL2Transaction).
- value = status of the processing transaction (1 - success & 0 for fail).
- isService = true (just a conventional value).
- l2ShardId = 0 (means that L1 -> L2 transaction was processed in a rollup shard, other shards are not available yet
  anyway).
- txNumberInBlock = number of transactions in the block.

L2 -> L1 communication, in contrast to L1 -> L2 communication, is based only on transferring the information, and not on the transaction execution on L1.

From the L2 side, there is a special zkEVM opcode that saves `l2ToL1Log` in the L2 block. A validator will send all `l2ToL1Logs` when sending an L2 block to the L1 (see `ExecutorFacet`). Later on, users will be able to both read their `l2ToL1logs` on L1 and _prove_ that they sent it.

From the L1 side, for each L2 block, a Merkle root with such logs in leaves is calculated. Thus, a user can provide Merkle proof for each `l2ToL1Logs`.

_NOTE_: The `l2ToL1Log` structure consists of fixed-size fields! Because of this, it is inconvenient to send a lot of data from L2 and to prove that they were sent on L1 using only `l2ToL1log`. To send a variable-length message we use this trick:

- One of the system contracts accepts an arbitrary-length message and sends a fixed-length message with parameters `senderAddress == this`, `marker == true`, `key == msg.sender`, `value == keccak256(message)`.
- The contract on L1 accepts all sent messages and if the message came from this system contract it requires that the
  preimage of `value` be provided.

### ExecutorFacet

A contract that accepts L2 blocks, enforces data availability and checks the validity of zk-proofs.

The state transition is divided into three stages:

- `commitBlocks` - check L2 block timestamp, process the L2 logs, save data for a block, and prepare data for zk-proof.
- `proveBlocks` - validate zk-proof.
- `executeBlocks` - finalize the state, marking L1 -> L2 communication processing, and saving Merkle tree with L2 logs.

When a block is committed, we process L2 -> L1 logs. Here are the invariants that are expected there:

- The only one L2 -> L1 log from the `L2_SYSTEM_CONTEXT_ADDRESS`, with the `key == l2BlockTimestamp` and `value == l2BlockHash`.
- Several (or none) logs from the `L2_KNOWN_CODE_STORAGE_ADDRESS` with the `key == bytecodeHash`, where bytecode is marked as a known factory dependency.
- Several (or none) logs from the `L2_BOOTLOADER_ADDRESS` with the `key == canonicalTxHash` where `canonicalTxHash` is a hash of processed L1 -> L2 transaction.
- Several (of none) logs from the `L2_TO_L1_MESSENGER` with the `key == hashedMessage` where `hashedMessage` is a hash of an arbitrary-length message that is sent from L2.
- Several (or none) logs from other addresses with arbitrary parameters.
