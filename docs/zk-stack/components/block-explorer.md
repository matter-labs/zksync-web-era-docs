---
head:
  - - meta
    - name: "twitter:title"
      content: Block Explorer | zkSync Docs
---

# Block Explorer

[The Block Explorer](https://github.com/matter-labs/block-explorer) is a module to allow exposing everything that is happening on your ZK Chain to your users/developers. It comes with the following components:

- **Block Explorer Worker:** an indexer service for ZK Chain data. The purpose of the service is to read the data from the blockchain in real-time, transform it and fill in its database to be used by the API.

- **Block Explorer API:** a service that provides an HTTP API for retrieving structured ZK Chain data. It must be connected to the block explorer worker database.

- **Block Explorer App:** The UI that allows user/devs to explore transactions, blocks, batches, contracts, tokens, and much more, on your ZK Chain.
