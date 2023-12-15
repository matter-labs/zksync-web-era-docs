---
description: Use in-memory node for rapid development and testing.
---

# Era Test Node

This documentation provides instructions on setting up and using the In-Memory Node, `era-test-node`, for local testing. It covers installation, network forking, transaction details viewing, replaying transactions, and testing local bootloader and system contracts.

{% hint style="danger" %}
Please keep in mind that `era-test-node` is still in its **alpha** stage, so some features might not be fully supported yet and may not work as fully intended. It is [open-sourced](https://github.com/matter-labs/era-test-node) and contributions are welcomed.
{% endhint %}

### Understanding the In-Memory Node

The In-memory node uses an in-memory database for storing state information and simplified hashmaps for tracking blocks and transactions. In fork mode, it retrieves missing storage data from a remote source when not available locally. Moreover it also uses the remote server (openchain) to resolve the ABI and topics to human readable names.

You can visit the `era-test-node` repository [here](https://github.com/matter-labs/era-test-node) to learn more.

### Limitations and Features <a href="#user-content--limitations--features" id="user-content--limitations--features"></a>

| 🚫 Limitations                                  | ✅ Features                                                 |
| ----------------------------------------------- | ----------------------------------------------------------- |
| No communication between Layer 1 and Layer 2.   | Can fork the state of mainnet, testnet, or custom network.  |
| Some APIs are not yet implemented.              | Can replay existing mainnet or testnet transactions.        |
| No support for accessing historical data.       | Uses local bootloader and system contracts.                 |
| Only one transaction allowed per Layer 1 batch. | Operates deterministically in non-fork mode.                |
| Fixed values returned for zk Gas estimation.    | Starts up quickly with pre-configured 'rich' accounts.      |
| Redeploy requires MetaMask cache reset.         | Supports hardhat's console.log debugging.                   |
|                                                 | Resolves names of ABI functions and Events using openchain. |
