# Accounts: Overview

## PrivateKeyEthSigner

A `PrivateKeyEthSigner` provides private key management, transaction, and message signing.

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let chainId = try! zkSync.web3.eth.getChainIdPromise().wait()
let signer = PrivateKeyEthSigner(credentials, chainId: chainId)
``` 

## ZkSyncWallet

A `ZkSyncWallet` is a wrapper around `EthSigner` which provides actions on the L2 network.
Based on the action, the `ZkSyncWallet` creates an appropriate transaction, signs the transaction using the `EthSigner`, and then broadcasts the transaction to the network.

```swift
let credentials = Credentials(<WALLET_PRIVATE_KEY>)
let chainId = try! zkSync.web3.eth.getChainIdPromise().wait()
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
let signer = PrivateKeyEthSigner(credentials, chainId: chainId)
let wallet = ZkSyncWallet(zkSync, ethSigner: signer, feeToken: Token.ETH)
```

Complete examples are available on the [getting started](./getting-started.md) page.

