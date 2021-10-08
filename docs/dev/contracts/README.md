# Smart contracts

zkSync is on track to introduce highly efficient, secure, Turing complete, multilanguage smart contracts.

[[toc]]

<!-- spell-checker:disable -->

## Programming model

The zkSync smart contract programming model inherits that of Ethereum.

Both the Zinc and Solidity languages are Turing complete, so you can use unbounded loops, recursion, vectors and maps of
arbitrary length, and so on. Local variables are stored on the stack or the heap, whereas the contract storage
is accessed globally. Contracts call one another via strongly typed interfaces and have access to public storage fields.

## Composability

zkSync smart contracts are able to call one another just like Ethereum smart contracts can. Each call transaction tree is
atomic, regardless of the number of contract instances involved.

Any DeFi project can be migrated to zkSync, since most of the existing Solidity code can be deployed without changes.

## Sync VM

The Sync VM is a highly efficient, Turing complete, SNARK-friendly virtual machine for executing zkSync smart contracts.

State-of-the-art optimizations are applied to smart contract bytecode, while the virtual machine itself is optimized
for high load, allowing it to execute transactions in the blink of an eye.

The machine is SNARK-friendly; that is, the execution trace can be proven in SNARKs. However, it does not require one
circuit per program. A single circuit can be used instead, which needs to be audited only once.

The target proof system of the Sync VM is [PLONK](https://eprint.iacr.org/2019/953).

## Zinc

[Zinc](https://github.com/matter-labs/zinc) is an emerging framework for developing smart contracts and SNARK circuits
on the zkSync platform.

Existing ZKP frameworks lack functionality specific to smart contracts. Since smart contracts deal with valuable financial assets, security and safety are crucial. That's why designers of modern smart contract languages, such as
Simplicity or Libra's Move, favored safety and formal verifiability of the code over
expressiveness.

Zinc is created to fill the gap between these two worlds by providing a simple, reliable smart contract language that is optimized for ZKP circuits and is easy for
developers to learn.

The framework includes a simple, Turing complete, safety-focused, general-purpose language designed specifically for
developing smart contracts and zero-knowledge proof circuits with a flat learning curve. The syntax and semantics closely
follow that of [Rust](https://www.rust-lang.org/).

The Zinc compiler uses LLVM as its middle-end and back-end, which provides a powerful set of solutions for
code optimization.

The language is under heavy development; thus many of its aspects will eventually be improved or changed. However, the
basic principles, such as security and simplicity, will never be questioned.

### Learning Zinc

The Zinc programming language has an official [book](https://zinc.zksync.io/), which provides an introduction to its core
principles and conventions.

### Getting help

You can ask questions and get assistance in our [Discord](https://discord.gg/5b6s7VTC) developer chat room.

If you would like to migrate an existing project to [zkSync](https://zksync.io) and require help, please send us an
email at hello@matter-labs.io.

## Solidity

[Solidity](https://docs.soliditylang.org/en/v0.8.1/) is a general-purpose language with a huge codebase and
numberous DeFi projects, a language adopted by thousands of blockchain developers from all over the world.

It will be possible to deploy most Solidity projects almost without modification. However, some features will
likely be prohibited and should be omitted to keep the code compatible:

- ASM blocks with memory access
- Facilitating calculations via overflows
- ABI contract calls
- General cases of undefined behavior

As a little extra, we are working on a Solidity-to-Zinc transpiler to simplify the migration process.

## Choosing the framework

<table>
  <tr>
    <td>Zinc</td>
    <td>Solidity</td>
  </tr>
  <tr>
    <td>
    If you are starting a new project, <a href="https://zinc.zksync.io/"> embrace Zinc today!</a>
    </td>
    <td>
    If you possess a large Solidity codebase, it is reasonable to wait for Solidity support
    and start migrating to Zinc after the mainnet release.
    </td>
  </tr>
</table>

## Roadmap

### Testnet

The testnet for smart contracts on zkSync is live with Curve Finance as the first resident dapp, launched in October
2020! Check out the [intro post](https://medium.com/@matterlabs/5a72c496b350).

Also, feel free to test arbitrary smart contracts using our Zandbox server.

[This tutorial](https://zinc.zksync.io/07-smart-contracts/02-minimal-example.html) explains how to deploy a smart
contract to the Rinkeby testnet.

### Mainnet

zkSync smart contracts are going mainnet in 2021.

Both Zinc and Solidity will be supported at launch.
