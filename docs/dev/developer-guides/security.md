# Security model

Given that zkSync is still in its early stages of development, there is a chance that our codebase contains undiscovered bugs that could lead to the loss of users' assets. As a result, we are constantly working to strengthen our security protocols to ensure that users and developers have a seamless onboarding experience when building on zkSync.
zkSync smart contract codebase is currently being audited, but audits are not a guarantee of quality, and they are not a guarantee that a codebase has been thoroughly vetted for vulnerabilities. It's crucial to realize that zkSync usage exposes you to the possibility of defects in the zkSync codebase.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Bug Bounty Program

zkSync takes security seriously and as such, we have a massive [bug bounty program](https://immunefi.com/bounty/zksync/). 

## Scope

Issues that can lead to substantial loss of money, critical bugs like a broken liveness condition, blocking upgrade system, irreversible loss of funds, or enforced exodus mode.

## Assumptions

To be eligible for the bug bounty, a bug should adhere to the security assumptions of zkSync.

### Cryptography assumptions:

- DLP is unbroken.
- Rescue hash and sha256 are collision-resistant.
- ZKP scheme used in the construction is secure (subject to a separate formal proof).

### L1 blockchain assumptions:

- L1 protocol is secure.
- L1 is eventually censorship-resistant: a sufficiently highly priced L1 tx will be mined in a block within finite time.
- Owners have access to the full L1 archive (can at any time retrieve all block bodies of the L1 chain).

### Operational assumptions:

- Rollup key is controlled by the owner and not compromised at all times.

## Disclosure Policy

Let us know as soon as possible upon discovery of a potential security issue.
Provide us with a reasonable amount of time to resolve the issue before any disclosure to the public or a third party.

### The wrong way to disclose

The following actions will make you ineligible for the bug bounty program:

- Filing a public issue about the vulnerability
- Testing the vulnerability on mainnet or testnet

## The right way to disclose

Please email us at security@zksync.io. We appreciate detailed information about confirming or fixing the vulnerability. If possible, please use the PGP key below to encrypt the message.

## Exclusions

- Already known vulnerabilities.
- Vulnerabilities in code not leading to funds lost or frozen.
- Vulnerabilities not related to smart contracts or cryptography used by the protocol.

## Eligibility

- You must be the first reporter of the vulnerability
- You must be able to verify a signature from the same address
- Provide enough information about the vulnerability
