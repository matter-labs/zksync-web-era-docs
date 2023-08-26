---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Contracts | zkSync Era Docs
---

# Contracts

The usual way to deploy a contract with the `geth` library is to use `abigen` with the provided `--bin` option, which generates a function
that deploys the smart contract. Since the deployment of a smart contract requires an EIP-712 transaction, the deployment function generated
with the `abigen` tool does not work. In this matter, the `Deploy` interface is created, which provides methods for the deployment of smart
contracts and smart accounts. There are the following objects that implement the `Deploy` interface:

- [`BaseDeployer`](accounts.md#basedeployer),
- [`Wallet`](accounts.md#wallet).

Contract instantiation is the same as in the [`geth`](https://geth.ethereum.org/docs/developers/dapp-developer/native-bindings) library. For
examples of how to deploy and instantiate contracts and accounts, refer to the following:

- [Deploy smart contracts using CREATE opcode](examples/create.md).
- [Deploy smart contracts using CREATE2 opcode](examples/create2.md).
- [Deploy smart accounts using CREATE and CREATE2 opcode](examples/custom-paymaster/deploy-account.md)

## Contracts interfaces

The `contracts` package provides [zkSync Era system contracts](../../reference/architecture/system-contracts.md).
