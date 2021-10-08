# Overview

[[toc]]

## Introduction

**zkSync** is a trustless protocol for scalable low-cost payments on Ethereum, powered by
[zkRollup technology](/faq/tech.md#zk-rollup-architecture). It uses zero-knowledge proofs and on-chain data availability
to keep users' funds as safe as though they never left the mainnet.

While security is our paramount priority, user and developer experience are central to zkSync design. We obsessively
seek out improvements that eliminate friction and complexity in order to make zkSync the most enjoyable platform on
Ethereum, for both end-users and builders. The best way to get an impression about it is to
[try out zkSync](https://wallet.zksync.io) yourself — it should only take 2 minutes.

<!-- markdownlint-disable line-length -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/el-9YYGN1nw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<!-- markdownlint-enable line-length -->

## Problems zkSync solves

Gas fees on Ethereum [exceed \$40M per month](https://ethgasstation.info/). With zkSync these costs can be reduced to a
small fraction.

UX-first crypto wallets like [Argent](https://www.argent.xyz/) or [Dharma](https://www.dharma.io/) aim to provide a
banking alternative to entire societies. zkSync makes this mission accomplishable.

The rise of DeFi opens many more interesting use cases. zkSync is here to unlock Paypal-scale for your project.

## zkSync features

- Mainnet-level security with zero reliance on 3rd parties.
- Permissionless smart contracts in Solidity / Zinc.
- No registration is required to receive funds.
- Payments to existing Ethereum addresses (including smart-contracts).
- Fees conveniently payable in the token being transferred.
- Withdrawals to mainnet in ~10 minutes<sup>\*</sup>

<span class="footnote"><sup>\*</sup> Currently, it may take longer to fill a block with transactions. Once the block is
'sealed', it is sent to the prover and appears on L1 within 10 minutes.</span>

<!-- - [Privacy](/faq/privacy.md) (coming soon). -->

<!-- ## What can I do with zkSync? -->
<!-- ADD HERE THE "PARTNER LIST" TABLE FROM NEW WEBSITE -->
<!-- WAITING UNTIL NEW WEBSITE IS LAUNCHED -->

## zkSync in comparison

zkSync
[stands out remarkably](https://medium.com/matter-labs/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955)
in security and usability among existing L2 scaling solutions. Thanks to the combination of cutting-edge cryptography
and on-chain data availability, zkRollup (the core technology of zkSync) is **the only** L2 scaling solution that
doesn't require any operational activity to keep the funds safe. For example, users can go offline for a year, then come
back and be sure to safely withdraw their assets without any external help — even if zkRollup validators were long gone.
At our current stage of development, we encourage users to monitor the chain for upgrades, and withdraw if they disagree
with upcoming changes — in the future, upgrades will require a strict opt-in.

To quote from [Vitalik Buterin's 2021 guide to rollups](https://vitalik.ca/general/2021/01/05/rollup.html):

> In general, my own view is that in the short term, optimistic rollups are likely to win out for general-purpose EVM
> computation and ZK rollups are likely to win out for simple payments, exchange and other application-specific use
> cases, **but in the medium to long term ZK rollups will win out in all use cases as ZK-SNARK technology improves**.

![L2 comparison](https://zksync.io/chart4.png)
