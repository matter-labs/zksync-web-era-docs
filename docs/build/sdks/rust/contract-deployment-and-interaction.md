---
head:
  - - meta
    - name: "twitter:title"
      content: Contract Deployment and Interaction | zkSync Docs
---

# Contract Deployment and Interaction

This guide shows you how to deploy a smart contract to zkSync and call its methods using the [`zksync-web3-rs`][repo] SDK.

This is what we're going to do:

- Deploy, and verify a smart contract on zkSync Era testnet that stores a greeting message.
- Call a `view` method that retrieves the greeting message.
- Perform a transaction that updates the greeting message.

:::info Project available as an example in the SDK REPO
This entire tutorial can be easily run using `cargo run --example contract-deployment` which is [available under the `examples/` directory][code] in the [`zksync-web3-rs`][repo].
:::

## Prerequisites

This tutorial assumes that you know how to create a rust project and add [`zksync-web3-rs`][repo] as a dependency. We recommend having followed the [Rust SDK Getting
started](./getting-started.md) tutorial first.

Also, since our SDK does not provide wrappers for the compiler, building the `Greeter` contract is out of the scope of this tutorial. We will provide the ABI and compilation output
together with the source code for the smart contract.

## The Greeter contract

In this tutorial, we are going to work with the `Greeter.sol` contract.

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
```

## Connecting to zkSync Era

To interact with the zkSync network users need to know the endpoint of the operator node. In this tutorial, we will be using the _zkSync Era In-Memory Node_ from
[`matter-labs/era-test-node`][test-node]. The test node a zkSync Era node (L2) on port `8011`. You can connect to the zkSync Era
network using the following code:

```rust
use std::str::FromStr;
use zksync_web3_rs::providers::{Middleware, Provider};
use zksync_web3_rs::signers::{LocalWallet, Signer};
use zksync_web3_rs::ZKSWallet;

// This is the default url for a local `era-test-node` instance.
static ERA_PROVIDER_URL: &str = "http://127.0.0.1:8011";

// This is the private key for one of the rich wallets that come bundled with the era-test-node.
static PRIVATE_KEY: &str = "7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

let zk_wallet = {
    let era_provider = Provider::try_from(ERA_PROVIDER_URL).unwrap();

    let chain_id = era_provider.get_chainid().await.unwrap();
    let l2_wallet = LocalWallet::from_str(PRIVATE_KEY)
        .unwrap()
        .with_chain_id(chain_id.as_u64());
    ZKSWallet::new(l2_wallet, None, Some(era_provider.clone()), None).unwrap()
};
```

## Deploy the Greeter contract

Before we begin, you'll need the compiled contract bytecode [`./Greeter.bin`][bin] and its Application Binary Interface (ABI) [`./Greeter.abi`][abi]. These files define the contract's code and
its interface, respectively.

1. The ABI file defines the interface and methods of the smart contract. Download it from [here][abi] and place it on `./Greeter.abi`.

2. The bytecode file contains the compiled binary code of the Greeter smart contract. Download it from [here][bin] and place it on `./Greeter.bin`.

3. Use the following snippet to deploy the contract to zkSync Era.

```rust
use ethers::abi::Abi;
use zksync_web3_rs::zks_wallet::DeployRequest;

static CONTRACT_BIN: &str = include_str!("./Greeter.bin");
static CONTRACT_ABI: &str = include_str!("./Greeter.abi");

// Deploy contract:
let contract_address = {
    // Read both files from disk:
    let abi = Abi::load(CONTRACT_ABI.as_bytes()).unwrap();
    let contract_bin = hex::decode(CONTRACT_BIN).unwrap().to_vec();

    // DeployRequest sets the parameters for the constructor call and the deployment transaction.
    let request = DeployRequest::with(abi, contract_bin, vec!["Hey".to_owned()])
        .from(zk_wallet.l2_address());

    // Send the deployment transaction and wait until we receive the contract address.
    let address = zk_wallet.deploy(&request).await.unwrap();

    println!("Contract address: {:#?}", address);

    address
};
```

**Congratulations! You have deployed and verified a smart contract to zkSync Era Testnet** 🎉

## Calling the `greet()` view method

In this section, we'll show you how to interact with the Greeter smart contract that you previously deployed to zkSync Era. Specifically, we'll demonstrate how to call the
`greet()` view method of the contract, which allows you to retrieve a greeting message from the blockchain.

The following Rust code snippet demonstrates how to call the `greet()` method and display the returned message:

```rust
use zksync_web3_rs::zks_wallet::CallRequest;

// Call the greet view method:
{
    let era_provider = zk_wallet.get_era_provider().unwrap();
    let call_request = CallRequest::new(contract_address, "greet()(string)".to_owned());

    let greet = ZKSProvider::call(era_provider.as_ref(), &call_request)
        .await
        .unwrap();

    println!("greet: {}", greet[0]);
}
```

## Updating the Greeting Message with `setGreeting`

In this section, we'll guide you through the process of updating the greeting message stored in the Greeter smart contract. The `setGreeting` method is used to change the `greeting`
message. Since it alters the state of the contract on the blockchain, it requires a signed transaction.

The following code snippet sends a signed transaction that calls the `setGreeting` method. The transaction is signed using the `l2_wallet` stored in the `ZKSWallet`.

```rust
// Perform a signed transaction calling the setGreeting method
{
    let receipt = zk_wallet
        .get_era_provider()
        .unwrap()
        .clone()
        .send_eip712(
            &zk_wallet.l2_wallet,
            contract_address,
            "setGreeting(string)",
            Some(["Hello".into()].into()),
            None,
        )
        .await
        .unwrap()
        .await
        .unwrap()
        .unwrap();

    println!(
        "setGreeting transaction hash {:#?}",
        receipt.transaction_hash
    );
};
```

After successfully updating the greeting message, you may want to confirm that the change has taken effect. To do this, we call the greet() method again and display the updated
greeting message:

```rust
{
    let era_provider = zk_wallet.get_era_provider().unwrap();
    let call_request = CallRequest::new(contract_address, "greet()(string)".to_owned());

    let greet = ZKSProvider::call(era_provider.as_ref(), &call_request)
        .await
        .unwrap();

    println!("greet: {}", greet[0]);
}
```

[repo]: https://github.com/lambdaclass/zksync-web3-rs/
[code]: https://github.com/lambdaclass/zksync-web3-rs/tree/main/examples/contract-deployment
[test-node]: https://github.com/matter-labs/era-test-node/
[abi]: https://raw.githubusercontent.com/lambdaclass/zksync-web3-rs/7ae7bec0323d878beac2b74f00256f8589b4a206/examples/contract-deployment/Greeter.abi
[bin]: https://raw.githubusercontent.com/lambdaclass/zksync-web3-rs/7ae7bec0323d878beac2b74f00256f8589b4a206/examples/contract-deployment/Greeter.bin
