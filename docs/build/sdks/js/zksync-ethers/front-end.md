---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Front-end Integration | zkSync Docs
---

# Front-end Integration

This section describes how to make the most of zkSync to provide the best UX.

## Going to production right away

If your front-end code does not deploy new smart contracts, then no changes to the codebase are required! All the existing SDKs/infrastructure will work out-of-box.

## Enabling zkSync features

If you want to deploy smart contracts or enable advanced zkSync features, like account abstraction, then you need to use the `zksync-ethers` library. You can read about the basics [here](./features.md).

If you want to see some code, check out our basic [tutorial](../../../quick-start/hello-world.md) for full mini-dApp.
