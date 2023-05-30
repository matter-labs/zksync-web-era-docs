# Getting started

::: warning
- Please note that with the system update released in Feb 2023, the `ergs` concept is only used by the VM while the API layer operates with `gas`.
- For more information, read the [changelog](../../dev/troubleshooting/changelog.md#hardhat-plugins-update-feb-24th-2023).
:::

## Concept

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional fields to those that Ethereum transactions have by default.

To provide easy access to all of the features of zkSync Era, the `zksync-web3` JavaScript SDK was created, which is made in a way that has an interface very similar to those of [ethers](https://docs.ethers.io/v5/). In fact, `ethers` is a peer dependency of our library and most of the objects exported by `zksync-web3` (e.g. `Wallet`, `Provider` etc.) inherit from the corresponding `ethers` objects and override only the fields that need to be changed.

The library is made in such a way that after replacing `ethers` with `zksync-web3` most client apps will work out of box.

## Adding dependencies

```bash
yarn add zksync-web3
yarn add ethers@5 # ethers is a peer dependency of zksync-web3
```

Then you can import all the content of the `ethers` library and the `zksync-web3` library with the following statement:

```typescript
import * as zksync from "zksync-web3";
import * as ethers from "ethers";
```

## Connecting to zkSync

To interact with the zkSync network users need to know the endpoint of the operator node.

```typescript
// Currently, only one environment is supported.
import { Wallet, Provider } from 'zksync-web3';

  const provider = new Provider('https://testnet.era.zksync.dev');
  // Private key of the account to connect
  const wallet = new Wallet('<WALLET-PRIVATE-KEY>').connect(provider);
```

**Note:** Currently, only `goerli` network is supported.

Some operations require access to the Ethereum network. `ethers` library should be used to interact with
Ethereum.

```typescript
const ethProvider = ethers.getDefaultProvider("goerli");
```

## Creating a wallet

To control your account in zkSync, use the `zksync.Wallet` object. It can sign transactions with keys stored in
`ethers.Wallet` and send transaction to the zkSync network using `zksync.Provider`.

```typescript
// Derive zksync.Wallet from ethereum private key.
// zkSync's wallets support all of the methods of ethers' wallets.
// Also, both providers are optional and can be connected to later via `connect` and `connectToL1`.
const zkSyncWallet = new zksync.Wallet(PRIVATE_KEY, zkSyncProvider, ethProvider);
```

## Depositing funds

Let's deposit `1.0 ETH` to our zkSync account.

```typescript
const deposit = await zkSyncWallet.deposit({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("1.0"),
});
```

**NOTE:** Each token inside zkSync has an address. If `ERC-20` tokens are being bridged, you should supply the token's L1 address in the `deposit` function, or zero address (`0x0000000000000000000000000000000000000000`) if you want to deposit ETH. Note, that for the `ERC-20`      tokens the address of their corresponding L2 token will be different from the one on Ethereum.

After the transaction is submitted to the Ethereum node, its status can be tracked using the transaction handle:

```typescript
// Await processing of the deposit on L1
const ethereumTxReceipt = await deposit.waitL1Commit();

// Await processing the deposit on zkSync
const depositReceipt = await deposit.wait();
```

## Checking zkSync account balance

```typescript
// Retrieving the current (committed) zkSync ETH balance of an account
const committedEthBalance = await zkSyncWallet.getBalance(zksync.utils.ETH_ADDRESS);

// Retrieving the ETH balance of an account in the last finalized zkSync block.
const finalizedEthBalance = await zkSyncWallet.getBalance(zksync.utils.ETH_ADDRESS, "finalized");
```

You can read more about what committed and finalized blocks are [here](../../dev/developer-guides/transactions/blocks.md).

## Performing a transfer

Now, let's create a second wallet and transfer some funds into it. Note that it is possible to send assets to any fresh Ethereum
account, without preliminary registration!

```typescript
const zkSyncWallet2 = new zksync.Wallet(PRIVATE_KEY2, zkSyncProvider, ethProvider);
```

Let's transfer `1 ETH` to another account:

The `transfer` method is a helper method that enables transferring `ETH` or any `ERC-20` token within a single interface.

```typescript
const amount = ethers.utils.parseEther("1.0");

const transfer = await zkSyncWallet.transfer({
  to: zkSyncWallet2.address,
  token: zksync.utils.ETH_ADDRESS,
  amount,
});
```

To track the status of this transaction:

```typescript
// Await commitment
const committedTxReceipt = await transfer.wait();

// Await finalization on L1
const finalizedTxReceipt = await transfer.waitFinalize();
```

## Withdrawing funds

There are two ways to withdraw funds from zkSync to Ethereum, calling the operation through L2 or L1. If the
withdrawal operation is called through L1, then the operator has a period of time during which he must process
the transaction, otherwise `PriorityMode` will be turned on. This ensures that the operator cannot stage the
transaction. But in most cases, a call via L2 is sufficient.

```typescript
const withdrawL2 = await zkSyncWallet.withdraw({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("0.5"),
});
```

Assets will be withdrawn to the target wallet(if  do not define  the `to` address in the `withdraw` method's argument - the sender address will be chosen as a destination) after the validity proof of the zkSync block with this transaction is enerated and verified by the mainnet contract.

It is possible to wait until the validity proof verification is complete:

```typescript
await withdrawL2.waitFinalize();
```

## Deploying a contract

A guide on deploying smart contracts using our hardhat plugin is available [here](../../tools/hardhat/).

## Adding tokens to the standard bridge

Adding tokens to the zkSync standard bridge can be done in a permissionless way. After adding a token to zkSync, it can be used in all types of transactions.

The documentation on adding tokens to zkSync can be found [here](./accounts-l1-l2.md#adding-native-token-to-zksync).
