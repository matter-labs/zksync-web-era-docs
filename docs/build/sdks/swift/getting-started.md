---
head:
  - - meta
    - name: "twitter:title"
      content: Swift SDK Getting Started | zkSync Docs
---

# Getting Started

This is a short introduction to `zksync2-swift` SDK, but covers many of the most common operations that developers require and provides a
starting point for those newer to zkSync Era.

## Overview

While most of the existing SDKs should work out of the box, deploying smart contracts or using unique zkSync features, like account abstraction, requires providing additional
fields to those that Ethereum transactions have by default.

To begin, it is useful to have a basic understanding of the types of objects available and what they are responsible for, at a high level:

- `Client` provides connection to the zkSync Era blockchain, which allows querying the blockchain state, such as account, block or transaction details,
  querying event logs or evaluating read-only code using call. Additionally, the client facilitates writing to the blockchain by sending
  transactions.
- `Signer` wraps all operations that interact with an account. An account generally has a private key, which can be used to sign a variety of
  types of payloads.
- `Wallet` is a wrapper around `Client` and `Signer` that provides easy usage of the most common features.

## Getting zksync2-swift

### Prerequisites

- IOS: >=13.0
- MacOS: >=11.0

## CocoaPods Integration

To install zkSync via CocoaPods, add zkSync2 pod to the Podfile:

```
 pod 'zkSync2-swift'
```

## Swift Package Manager Integration

To install zkSync via Swift Package Manager, add zkSync2 to the Package Dependencies:

```
 'github.com/zksync-sdk/zksync2-swift'
```

## Connecting to ZkSync

Once you have integrated zkSync2 dependencies, connect to zkSync using the endpoint of the operator node.

```swift
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://sepolia.era.zksync.dev")!)
```

## Connecting to Ethereum

Also connect to Ethereum using the endpoint of the eth_sepolia node.

```swift
let ethereum: web3 = try! Web3.new(URL(string: "https://rpc.ankr.com/eth_sepolia")!)

let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let keystoreManager = KeystoreManager([credentials])
ethereum.addKeystoreManager(keystoreManager)
```
