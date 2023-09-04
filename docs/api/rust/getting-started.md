---
head:
  - - meta
    - name: "twitter:title"
      content: Rust SDK Getting Started | zkSync Era Docs
---

# Getting started

<!-- FIXME add callout stating this SDK is in an alpha state and pin it's version --> 

## Concept

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like paying fees in other tokens, requires providing additional fields to those that Ethereum transactions have by default.

To provide easy access to all of the features of zkSync Era, the [`zksync-web3-rs`][sdk] Rust SDK was created, which builds upon the [`ethers`][ethers] library. This section serves as its reference.

<!-- FIXME can we rephrase this in any meaningful way? -->
<!-- The library is made in such a way that after replacing `ethers` with `zksync-web3` most client apps will work out of box. -->


## Adding dependencies

Add the following dependencies to your `Cargo.toml` file:

```toml
zksync-web3-rs = { git = "https://www.github.com/lambdaclass/zksync-web3-rs" }
```

> Consider adding [`tokio`][tokio] as dependency since we are using a lot of async/await functions. If this example is meant to be done in the main function the `#[tokio::main]` annotation is needed.


## Connecting to zkSync

To interact with the zkSync network users need to know the endpoint of the operator node. In this tutorial, we will be using the `localnet` from [`matter-labs/local-setup`][localnet]. The localnet runs both an Ethereum node (L1) on port `8545` and an Era node (L2) on port `3050`. You can connect to the zkSync Era network using the following code:

```rust
use zksync_web3_rs::providers::{Http, Middleware, Provider};
// Extend `Provider<Http>` with specific methods for zkSync Era.
use zksync_web3_rs::zks_provider::ZKSProvider;

static L2_URL: &str = "http://localhost:3050";

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let l2_provider: Provider<Http> =
        Provider::try_from(L2_URL).expect("could not instantiate HTTP Provider");

    let l2_chain_id = l2_provider
        .get_chainid()
        .await
        .expect("Could not retrieve L2 chain id");
    println!("l2_chain_id = {l2_chain_id}");

    let l1_chain_id = l2_provider
        .get_l1_chain_id()
        .await
        .expect("Could not retrieve L1 chain id from zkSync Era node");
    println!("l1_chain_id = {l1_chain_id}");
}
```

Here, the trait `ZKSProvider` extended the `Provider<Http>` struct  adding zkSync Era specific functionality.
In this case, the method `.get_chainid()` comes from `ethers` while the method `get_l1_chain_id` comes from the `ZKSProvider` and hits an era-specific API.

## Creating a wallet

To control an account in zkSync, use the `zksync_web3_rs::ZKSWallet` struct. It can sign transactions with keys stored in `zksync_web3_rs::signers::{LocalWallet, Signer}` and send transactions to the zkSync network using a `Provider`.

```rust
use std::str::FromStr;
use zksync_web3_rs::providers::{Http, Middleware, Provider};
use zksync_web3_rs::signers::{LocalWallet, Signer};
use zksync_web3_rs::zks_provider::ZKSProvider;
use zksync_web3_rs::ZKSWallet;

static L1_URL: &str = "http://localhost:8545";
static L2_URL: &str = "http://localhost:3050";
static RICH_WALLET_PRIVATE_KEY: &str =
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let l2_provider: Provider<Http> =
        Provider::try_from(L2_URL).expect("could not instantiate HTTP Provider");

    let l2_chain_id = l2_provider
        .get_chainid()
        .await
        .expect("Could not retrieve L2 chain id");
    println!("l2_chain_id = {l2_chain_id}");

    let l1_chain_id = l2_provider
        .get_l1_chain_id()
        .await
        .expect("Could not retrieve L1 chain id from zkSync Era node");
    println!("l1_chain_id = {l1_chain_id}");

    // Create a wallet

    // We need a provider to interact with the Ethereum Layer 1.
    let l1_provider =
        Provider::<Http>::try_from(L1_URL).expect("Could not instantiate L1 Provider");

    let rich_wallet = LocalWallet::from_str(RICH_WALLET_PRIVATE_KEY)
        .expect("Invalid private key")
        .with_chain_id(l2_chain_id.as_u64());

    let zk_rich_wallet = ZKSWallet::new(
        rich_wallet,
        None,
        Some(l2_provider.clone()),
        Some(l1_provider.clone()),
    )
    .unwrap();

    // Check balances:
    println!(
        "L1 balance before: {}",
        zk_rich_wallet.eth_balance().await.unwrap()
    );
    println!(
        "L2 balance before: {}",
        zk_rich_wallet.era_balance().await.unwrap()
    );
}
```

Which outputs:

```rust
l2_chain_id = 270
l1_chain_id = 9
L1 balance before: 99999998999999999999985955702529242715
L2 balance before: 999999999999523695575000000000
```

## Checking zkSync account balance

You can use `ZKSWallet` `eth_balance` and `era_balance` to get L1 and L2 balances respectively:

```rust
let l1_balance = zk_rich_wallet.eth_balance().await.unwrap();
let l2_balance = zk_rich_wallet.era_balance().await.unwrap();
println!("L1 balance before: {l1_balance}");
println!("L2 balance before: {l2_balance}");
```

## Depositing funds

Let's deposit `1.0 ETH` to our zkSync account.

```rust
// Deposit ether on zkSync Era.

let deposit_amount = parse_units("0.1", "ether").unwrap();
let deposit_request = DepositRequest::new(deposit_amount.into());
let deposit_transaction_hash = zk_rich_wallet
    .deposit(&deposit_request)
    .await
    .expect("Failed to perform deposit transaction");
println!("Deposit transaction hash: {}", deposit_transaction_hash);
```

**NOTE:** Each token inside zkSync has an address. If `ERC-20` tokens are being bridged, you should supply the token's L1 address by calling the `token` method from `DepositRequest`, or zero address (`0x0000000000000000000000000000000000000000`) if you want to deposit ETH. Note, that for the `ERC-20` tokens the address of their corresponding L2 token will be different from the one on Ethereum.

After the transaction is submitted to the Ethereum node, its status can be tracked using the transaction hash:

```rust
let deposit_l1_receipt = l1_provider
    .get_transaction_receipt(deposit_transaction_hash)
    .await
    .unwrap()
    .unwrap();
println!(
    "Deposit L1 receipt status: {}",
    deposit_l1_receipt.status.unwrap()
);
```

Then, check the resulting account balances:

```rust
// Check balances:
println!(
    "L1 balance after deposit: {}",
    zk_rich_wallet.eth_balance().await.unwrap()
);
println!(
    "L2 balance after deposit: {}",
    zk_rich_wallet.era_balance().await.unwrap()
);
```

## Performing a transfer

Now, let's create a second wallet and transfer some funds into it. Note that it is possible to send assets to any fresh Ethereum account, without preliminary registration!

```rust
static WALLET_2_PRIVATE_KEY: &str =
    "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3";

let zk_wallet_2 = {
    let l2_wallet = LocalWallet::from_str(WALLET_2_PRIVATE_KEY)
        .expect("Invalid private key")
        .with_chain_id(l2_chain_id.as_u64());

    ZKSWallet::new(
        l2_wallet,
        None,
        Some(l2_provider.clone()),
        Some(l1_provider.clone()),
    )
    .unwrap()
};
```

We can check it's balances to verify that it has no funds:

```rust
println!(
    "L1 balance for the new wallet: {}",
    zk_wallet_2.eth_balance().await.unwrap()
);
println!(
    "L2 balance for the new wallet: {}",
    zk_wallet_2.era_balance().await.unwrap()
);
```

```
L1 balance for the new wallet: 0
L2 balance for the new wallet: 0
```

Let's transfer `1 ETH` to the new account:

The `transfer` method from the `ZSKWallet` structure is a helper method that enables transferring `ETH` or any `ERC-20` token within a single interface on the layer 2.

```rust
use zksync_web3_rs::zks_wallet::TransferRequest;

let transfer_amount = parse_units("0.05", "ether").unwrap();
let transfer_request = TransferRequest::new(transfer_amount.into())
    .to(zk_wallet_2.l2_address())
    .from(zk_rich_wallet.l2_address());
let transfer_transaction_hash = zk_rich_wallet
    .transfer(&transfer_request, None)
    .await
    .unwrap();
println!("Transfer transaction hash: {}", transfer_transaction_hash);
```

```
Transfer transaction hash: 0x84d3…8ced
```

After the transfer transaction is submitted to the zkSync Era node, its status can be tracked using the transaction hash:

```rust
let transfer_receipt = l2_provider
    .get_transaction_receipt(transfer_transaction_hash)
    .await
    .unwrap()
    .unwrap();
println!(
    "Transfer receipt status: {}",
    transfer_receipt.status.unwrap()
);
```

```
Transfer receipt status: 1
```

Again, we can use `ZKSWallet` to check the resulting account balances:

```rust
println!(
    "Rich wallet L2 balance after deposit: {}",
    zk_rich_wallet.era_balance().await.unwrap()
);
println!(
    "New wallet L2 balance after deposit: {}",
    zk_wallet_2.era_balance().await.unwrap()
);
```

Which printed:

```
Rich wallet L2 balance after deposit: 999999999999988572281250000000
New wallet L2 balance after deposit: 50000000000000000
```

<!-- FIXME I haven't touched anything from this point forward. -->

## Withdrawing funds

```rust
let withdraw_transaction_hash_l2 = {
    let amount = parse_units("0.025", "ether").unwrap();
    let request = WithdrawRequest::new(amount.into()).to(zk_wallet_2.l1_address());
    zk_wallet_2.withdraw(&request).await.unwrap()
};

// Wait until the transaction finalizes.
let withdraw_receipt_l2 = l2_provider
    .wait_for_finalize(withdraw_transaction_hash_l2, None, None)
    .await
    .unwrap();
```


Assets will be withdrawn to the target wallet after the validity proof of the zkSync block with this transaction is generated and verified by the mainnet contract.

It is possible to wait until the validity proof verification is complete using the `finalize_withdraw` method:

```typescript
let withdraw_transaction_hash_l1 = zk_wallet_2
    .finalize_withdraw(withdraw_transaction_hash_l2)
    .await
    .unwrap();

// Then, get the transaction receipt:
let withdraw_receipt_l1 = zk_wallet_2
    .get_eth_provider()
    .unwrap()
    .get_transaction_receipt(withdraw_transaction_hash_l1)
    .await
    .unwrap()
    .unwrap();
```

[sdk]: https://github.com/lambdaclass/zksync-web3-rs/
[ethers]: https://crates.io/crates/ethers
[tokio]: https://tokio.rs/
[localnet]: https://github.com/matter-labs/local-setup
[rand]: https://crates.io/crates/rand
