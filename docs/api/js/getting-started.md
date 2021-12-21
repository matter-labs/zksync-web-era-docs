# Getting started

## Concept

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features like paying fees in other tokens requires providing additional fields to those that Ethereum transactions have by default.

To provide easy access to all of the features of zkSync 2.0, we created `zksync-web3` JavaScript SDK, which is made in a way that is has an interface very similar to those of [ethers](https://docs.ethers.io/v5/). In fact, `ethers` is a peer dependency of the library and most of the objects exported by `zksync-web3` (e.g. `Wallet`, `Provider` etc) inherit from the corresponding `ethers` objects and override only the fields that need to be changed.

The library is made in such a way that changing `ethers` with `zksync-web3` in your imports should be sufficient in most cases.

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
const syncProvider = new zksync.Provider("https://z2-dev-api.zksync.dev");
```

**Note:** Currently, only `rinkeby` network is supported.

Some operations require access to the Ethereum network. We use `ethers` library to interact with
Ethereum.

```typescript
const ethProvider = ethers.getDefaultProvider("rinkeby");
```

## Creating a wallet

To control your account in zkSync, use the `zksync.Wallet` object. It can sign transactions with keys stored in
`ethers.Wallet` and send transaction to the zkSync network using `zksync.Provider`.

```typescript
// Derive zksync.Wallet from ethereum private key.
// zkSync's wallets support all of the methods of ethers' wallets.
// Also, both providers are optional and can be connected to later via `connect` and `connectToL1`.
const syncWallet = new zksync.Wallet(PRIVATE_KEY, syncProvider, ethProvider);
```

## Depositing funds

We are going to deposit `1.0 ETH` to our zkSync account.

```typescript
const deposit = await syncWallet.deposit({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("1.0"),
});
```

**NOTE:** Each token inside zkSync has an address. For ERC20 tokens this address coincides with the address in L1, except for ETH, the address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` is used for it. To get the ETH address in
zkSync, we can use the constant `ETH_ADDRESS`.

After the tx is submitted to the Ethereum node, we can track its status using the transaction handle:

```typescript
// Await processing of the deposit on L1
const ethereumTxReceipt = await deposit.waitL1Commit();

// Await processing the deposit on zkSync
const depositReceipt = await deposit.wait();
```

## Checking zkSync account balance

```typescript
// Retreiving the current (committed) balance of an account
const committedEthBalance = await syncWallet.getBalance(zksync.utils.ETH_ADDRESS);

// Retrieving the balance of an account in the last finalized block
const finalizedEthBalance = await syncWallet.getBalance(ETH_ADDRESS, "finalized");
```

You can read more about what committed and finalized blocks are [here](../../dev/concepts.md#how-does-transaction-finality-work).

## Performing a transfer

Now, let's create a second wallet and transfer some funds into it. Note that we can send assets to any fresh Ethereum
account, without preliminary registration!

```typescript
const syncWallet2 = new zksync.Wallet(PRIVATE_KEY2, syncProvider, ethProvider);
```

We are going to transfer `1 ETH` to another account and pay `1 USDC` as a fee to the operator (zkSync account balance of the sender is going to be decreased by `1 ETH` and `1 USDCs`).

**NOTE:** You can use any token inside zksync if it was previously added via the `addToken` operation. If the token does not exist, any user can add it!

```typescript
const amount = ethers.utils.parseEther("1.0");

const transfer = await syncWallet.transfer({
  to: syncWallet2.address,
  token: zksync.utils.ETH_ADDRESS,
  amount,
  feeToken: "0xeb8f08a975ab53e34d8a0330e0d34de942c95926s", // USDC address
});
```

**Note that** supplying the `token` and `feeToken` fields manually is not required. The default value for both of these fields is `ETH`.

```typescript
const amount = ethers.utils.parseEther("1.0");

const transfer = await syncWallet.transfer({
  to: syncWallet2.address,
  token: zksync.utils.ZKSYNC_ADDRESS,
  amount,
});
```

To track the status of this transaction:

```typescript
// Await commitment
const transferReceipt = await transfer.wait();

// Await finalization on L1
const transferReceipt = await transfer.waitFinalize();
```

## Withdrawing funds

There are two ways to withdraw funds from zkSync to Ethereum, calling the operation through L2 or L1. If the
withdrawal operation was called through L1, then the operator will have a period of time during which he must process
the transaction, otherwise `PriorityMode` will be turned on. This ensures that the operator cannot stage the
transaction. But in most cases, a call via L2 is sufficient.

```typescript
const withdrawL2 = await syncWallet.withdraw({
  token: zksync.utils.ETH_ADDRESS,
  amount: ethers.utils.parseEther("0.5"),
});
```

Assets will be withdrawn to the target wallet after the validity proof of the zkSync block with this transaction is
generated and verified by the mainnet contract.

We can wait until the validity proof verification is complete:

```typescript
await withdrawL2.waitFinalize();
```

## Deploying a contract

A guide on deploying smart contracts using our hardhat plugin is available [here](../hardhat).

## Adding a new native token

Adding tokens to zksync is completely permissionless, any user can add any ERC20 token from Ethereum to zkSync as a
first class citizen token. After adding a token, it can be used in all types of transactions.

Make sure you are connected to an L1 provider to use this method.

```typescript
const tokenAddress = "0x...";
const addTokenHandle = await syncWallet.addToken(tokenAddress);

await addTokenHandle.wait();
```
