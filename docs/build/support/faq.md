---
head:
  - - meta
    - name: "twitter:title"
      content: FAQ | zkSync Docs
---

# FAQ

Here you will find some of the most common questions we receive about zkSync Era.

## What is zkSync Era?

zkSync Era is a Zero Knowledge (ZK) rollup that supports generalized EVM compatibility for the Ethereum blockchain. The primary benefit of zkSync Era is that developers who have created EVM dApps can port to zkSync Era effortlessly and realize significantly lower gas fees and more transactions per second while inheriting Ethereum's security and decentralization.

## Why zkSync Era?

zkSync Era is a gigantic leap forward in Layer 2 technologies. It is a long-awaited improvement that offers many never before enjoyed benefits for Ethereum developers.

- **EVM Compatible** - zkSync is an EVM-compatible zero knowledge rollup that supports generalized EVM smart contracts. This means if you already have EVM smart contracts, it’s super easy to port your dApp to zkSync Era.
- **Ethos Compatible** - we are very aligned with the ethos of decentralization and open source. All of our code will strive to be fully open-source and zkSync will be executing a roadmap that will fully decentralize the sequencer and proof generation, and we will be executing a roadmap of organizational subtractive management - that is, we will be decentralizing our organization as well.
- **Certainty** - Unlike previous methods attempting to scale Ethereum which have in some cases offered weaker security guarantees than for L1 (e.g. sidechains, plasma, and optimistic) zkSync Era uses zero-knowledge proofs which offer _certainty_ of security.
- **Future Proof** - Ecosystem projects that adopt zkSync Era now will enjoy all future improvements without the need to change their code, in particular coming from:
  - The prover technology: hardware acceleration and [new proof systems](https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc).
  - The compiler: integration of LLVM-enabled modern programming languages. [Learn more about our compiler toolchain](../../zk-stack/components/compiler/toolchain/overview.md).
  - Other innovations like [Hyperchains, Hyperbridges and ZK Stack](../../zk-stack/concepts/hyperchains-hyperscaling.md).

## What is the zkEVM?

zkEVM is the name of the architecture that enables zero-knowledge proof generation for the execution trace of smart contracts originally written for EVM.

Its architecture is based on the following components:

- zkVM, a Turing-complete RISC-like virtual machine optimized for proving in a ZKP circuit. It has several different implementations:
  - Executor: fast native execution on CPU.
  - Witness generator: native executor to generate ZKP witness.
  - Prover: the actual ZKP circuit implementation.
- LLVM-based compiler with:
  - Solidity frontend (more precisely: Yul frontend).
  - Vyper frontend.
  - zkVM backend.
- Special-purpose circuits (heavily relying on PLONK’s custom gates and lookup tables) as “precompiles” for computationally intensive operations, such as:
  - Non-algebraic hashes (Keccak, SHA256, Blake2).
  - Storage access (Merkle paths).
  - Elliptic curve pairing.
- Recursive aggregation circuit (combines the proofs from the above-mentioned parts).

### zkEVM vs EVM

Apart from the opcodes and gas metering disparity, zkVM strictly inherits the EVM programming model and its invariants, including the ABI calling conventions. One important thing to emphasize is that the zkVM supports rollbacks and provably revertible transactions. It guarantees mutual protection: users can not stall the network with bombardment by revertible transactions, and the escape hatch (priority queue) protects the user’s ability to include any transactions into the blocks.

As a result, developers can fully rely on the censorship-resistance provided by L1 without having to introduce any changes related to the escape-hatch mechanism. This means that assets in a zkRollup account on zkSync will have exactly the same security guarantees as on L1.

### EVM Improvements

While maintaining maximum compatibility, the zkSync Era's zkEVM has significant improvements over the EVM that increase adoption and benefit our ecosystem projects.

- **Our compiler is based on LLVM**. LLVM-based compilers (Low-Level Virtual Machine) have become the default compiler for Mac OS X, iOS, FreeBSD, and Android systems and are among the most widely used because they:
  - Enable us to improve the efficiency over the original EVM bytecode because with LLVM we can take advantage of the many optimizations and tools available in this mature ecosystem.
  - Pave the way for us to add support for integrating codebases written in other programming languages with LLVM frontend. By doing so, developers can build dApps and use blockchains in ways that are currently not possible.
- **Account Abstraction is implemented natively in our zkEVM**. This is a long-anticipated feature in the Ethereum dev community which improves developer adoption and user experience in a number of ways:
  - Native support for smart contracts wallets (like Clave), which is critical for onboarding mainstream users.
  - Much better UX for multisigs.
  - Transaction fees can be paid in any token using [paymasters](../../build/developer-reference/account-abstraction.md#paymasters).
  - Protocols can now subsidize gas for users from their smart contracts or even enable gasless transactions.
  - Transaction batches (multicall) can be confirmed in one click (big UX problem on Ethereum today).
  - Learn more about [account abstraction support in zkSync Era](../../build/developer-reference/account-abstraction.md).

### EVM Compatibility

There is a lot of confusion amongst the community with regard to the impacts of being EVM Compatible versus EVM Equivalent. First, let’s define what is meant by the two.

- **EVM Equivalent** means that a given protocol supports every opcode of Ethereum’s EVM down to the bytecode. Thus, any EVM smart contract works with 100% assurance out of the box.
- **EVM Compatible** means that a percentage of the opcodes of Ethereum’s EVM are supported; thus, a percentage of smart contracts work out of the box.

zkSync is optimized to be EVM _compatible_ not EVM _equivalent_ for three primary reasons:

1. Creating a generalized circuit for EVM equivalence down to the bytecode would be prohibitively expensive and time-consuming.
2. Building on what we learned with zkSync Lite, we were able to design a system optimized for performance and provability in ZK.
3. The opcodes we’ve chosen NOT to support are deprecated by Ethereum itself, or rarely used. In the case a project needs them, modifications to work with zkSync are minimal and do not generate a need for a new security audit.

Almost every smart contract written for EVM will be supported by zkSync Era and will hold all key security invariants so that no additional security re-auditing will be required in most cases.

::: info Differences with Ethereum
You can find more information about the [differences between Ethereum and zkSync Era in this section of the docs](../../build/developer-reference/differences-with-ethereum.md).
:::

There are a few other distinctions, for example, gas metering will be different (as is the case for other L2s as well). Some EVM’s cryptographic precompiles (notably pairings and RSA) won’t be available in the very first release but will be implemented soon after the launch, with pairing being a priority to allow both Hyperchains and protocols like Aztec/Dark Forest to be deployed without modifications too.

## Security expectations

zkSync Era’s data availability layer is Ethereum. All ecosystem projects that build on zkSync Era will inherit the full security benefits of Ethereum.

This is obviously a critically important topic for us, and the system has gone through several security audits and maintains a very detailed bug bounty program. You can read more about [zkSync Era security in this section of the docs](./audit-bug-bounty.md).

### Triggering Security audits

While there are a few, rarely used opcodes that we do not support, we have not found any instances with our ecosystem projects where a breaking change was anything other than a simple refactoring of a few lines of code. None of our ecosystem projects who have ported to zkSync have reported that any change has caused a need for a security audit.

## What is Account Abstraction?

At a very high level, Account Abstraction allows us to make authorizations _programmable_, enabling a greater diversity of wallet and protocol design with use cases including:

- The implementation of smart contract wallets that improve the user experience of private key storage and recovery (eg. [social recovery](https://vitalik.eth.limo/general/2021/01/11/recovery.html), multisig).
- The ability to natively pay gas fees in tokens other than ETH.
- The ability for accounts to change public and private keys.
- The addition of non-cryptographic modifications, where users can require transactions to have expiry times, confirm slightly out-of-order, and more.
- Diversity in signature verification systems from the current ECDSA, including post-quantum safe signature algorithms (eg. Lamport, Winternitz).

In other words, Account Abstraction brings about major improvements to the overall user experience, and expands the application design space for developers. Learn more in [this blog post](https://www.argent.xyz/blog/wtf-is-account-abstraction/) by Argent.

In zkSync Era Account Abstraction is natively implemented, meaning accounts can initiate transactions, like an EOA, but can also have arbitrary logic implemented in them, like a smart contract.

If you want to better understand what Account Abstraction on zkSync looks like, you can read [this section of the docs](../../build/developer-reference/account-abstraction.md), or try out our tutorial [here](../../build/tutorials/smart-contract-development/account-abstraction/custom-aa-tutorial.md).

## zkSync Era vs Optimistic Rollups

Optimistic rollups utilize an optimistic approach to secure their networks. At the time of their development, they represented an important incremental improvement over other available options. However, a widely held opinion ([including Vitalik Buterin's](https://coinculture.com/au/people/vitalik-buterin-zk-rollups-to-outperform-optimistic-rollups/)) is that optimistic methods represent yet another temporary solution and in the long run the only permanent and truly scalable solution will be blockchains based on Zero-Knowledge proofs.

Optimistic rollups suffer from the following key downsides:

- **Optimistic rollups are secured via game theory.** This method assumes all transactions are valid and then utilizes an after-the-fact game theory mechanism to pay participants to discover fraudulent or otherwise invalid (e.g. because of bugs) transactions. Game theory is never perfect and as with the game theory that broke with stablecoins and other systems, we just don’t think it can be relied on in the long term and at true scale to offer the security the ecosystem needs.
  zkSync Era, on the other hand, relies on math, not game theory, to provide the absolute certainty of proof that every single transaction is valid and not fraudulent.

- **Optimistic methods take 7 days to settle**. Settlement time is becoming an increasingly important feature for ecosystem projects. As ecosystem projects’ needs mature, the need for as close to instant settlement will rise. With optimistic methods, this settlement problem will not go away. It's always going to be a 7-day settlement time because optimistic methods need 7 days for their after-the-fact game theory to conclude its challenge window. The only way around this is to bring in third parties that provide some liquidity - but then again this is a potential security risk in trusting the liquidity providers.

  zkSync Era provides settlement in hours but with optimizations in the system we'll reduce the settlement time without the need of projects to update their code.

- **Optimistic rollups have no method of scaling beyond where they are now.** When optimistic methods first came out, they became popular because they scaled Ethereum (e.g. they enabled the processing of 10x Ethereum transactions _without degradation of security and decentralization_). The problem is that while they can scale Ethereum by 10x now, they have no mechanism to go beyond 10x without degrading security and decentralization.

  In contrast, zkSync Era is based on zero-knowledge proofs which have important characteristics that optimistic methods do not - they can hyperscale.

::: tip Hyperscalability
Read more about [Hyperscalability and ZK Stack here](../../zk-stack/concepts/hyperchains-hyperscaling.md).
:::

## Which Wallets are supported?

At the moment, we support any Ethereum-based wallet like Metamask, BitKeep, TrustWallet or Zerion. You can add zkSync network to your Metamask manually by following the instructions in the [interact with zkSync Era](../../build/quick-start/add-zksync-to-metamask.md) page.

## Token Listing

We source our token information from [Coingecko](https://www.coingecko.com/en/categories/zksync-ecosystem).

- **Adding a Token**: all tokens are identified automatically. If you wish to include a logo, pricing, or other details for your token, ensure it is listed on Coingecko. Once listed, these details will automatically appear on Block Explorer and Bridge. It may take up to 24 hours for updates to be reflected.
- **Top Tokens List**: Tokens are arranged in descending order based on liquidity. We do not control the order of the tokens.

## How do I Request Funds for Testnet?

To access Sepolia testnet funds, [you can use one of our third party faucets](../tooling/network-faucets.md).

## How long does it take to complete a deposit transaction?

The transactions on zkSync Era should not take more than 5 minutes.

## Where can I see the transactions I submitted?

Our [Block Explorer](https://explorer.zksync.io) will show everything you may need about a transaction.

## Can someone claim the address I have for my contract in other EVM networks in zkSync Era?

The contract address derivation formula is different from the regular EVM approach. Even if a contract is deployed from the same account address with the same nonce, the zkSync Era contract address will not be the same as it is in another EVM network. This means, for example, that no one will be able to claim an existing Ethereum address of your protocol to try to trick users into interacting with a malicious version of it.

## What is Block Gas Limit on zkSync Era?

The current value is currently set at roughly 2^32 gas. <br>
**Note**: This value is temporal and will be updated soon.

## Can I withdraw my funds back to Ethereum?

Yes, the bridge is two-way. You can withdraw your funds back to Ethereum. The withdrawal transaction [will take ~24 hours, depending on the usage of the zkSync Era network](./withdrawal-delay.md).

## What is a testnet regenesis?

Sometimes, the team working on zkSync Era will initiate a regenesis on testnet - a restart of the blockchain which will introduce upgrades and return the state to the initial point.

## Why do my contracts not compile in Windows?

If you're using Windows, make sure to use WSL 2, since WSL 1 is known to cause trouble.

Additionally, if you use WSL 2, make sure that your project is located in the Linux filesystem, since accessing NTFS partitions from WSL is very slow.

## Proof sampling on testnet

zkSync Era testnet is experiencing immense demand, but its permissionless nature leaves our developer infrastructure vulnerable to potential DoS attack vectors. Generating ZK proofs inherently incurs costs, and a determined attacker could exploit this by submitting a massive number of transactions, resulting in significant expenses for us. As we currently lack a more effective method for rationing resources, we have opted to prove a random subset of batches on the testnet – the subset fluctuates with demand but maintains a high minimal threshold. This approach ensures the detection of errors probabilistically while conserving valuable GPU resources.

This resource optimization not only supports a more efficient allocation of resources but also promotes a more environmentally-friendly process compared to proving every batch on the testnet.

Moving forward, we aim to develop better mechanisms to prevent Sybil attacks on our infrastructure, with the ultimate goal of enabling the proof of all batches on the testnet.
