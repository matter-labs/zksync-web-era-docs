# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Prerequisite

This guide assumes that you are familiar with [Swift](https://www.swift.org/) programming language.

##  Installation

To install the zkSync Swift SDK, just add the following pod to your dependencies:

```
ZkSync2

```

and then import it on any file you want to use it

```swift
import ZkSync2
```

## Ethereum signer

::: warning

⚠️ Never commit private keys to file tracking history, or your account could be compromised.

```swift
import ZkSync2

let chainId = BigUInt(123)

let credentials = Credentials("0x<private_key>")

let signer: EthSigner = PrivateKeyEthSigner(credentials, chainId: chainId)

```
