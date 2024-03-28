---
head:
  - - meta
    - name: "twitter:title"
      content: Audits and Bug Bounty Program | zkSync Docs
---

# Audits and bug bounty program

zkSync Era takes security seriously and as such, we have completed multiple audits in all critical parts of the protocol. On top of that, there is an ongoing massive bug bounty program.

## Audits

We always ensure that all code deployed to production has been thoroughly tested before release. Our auditing and review processes begin well before any code is deployed. We conduct internal audits, followed by independent external audits from reputable auditors. If applicable, we also hold a public auditing contest and top it off with another independent external audit.

Here is the list of **completed audits**:

- Layer 1 Smart Contracts, Internal Audit, from 2022-06-14 to 2022-08-17.
- [Layer 1 Smart Contracts](https://blog.openzeppelin.com/zksync-layer-1-audit/), OpenZeppelin, from 2022-09-05 to 2022-09-30.
- [Layer 1 Diff Audit (Upgrade Audit)](https://blog.openzeppelin.com/zksync-layer-1-diff-audit/), OpenZeppelin, from 2022-11-21 to 2022-11-25.
- [Layer 1 Diff Audit (Upgrade Audit)](https://blog.openzeppelin.com/zksync-l1-diff-audit-february-2023/), OpenZeppelin, from 2023-02-06 to 2023-02-17.
- [Layer 1 Public Contest](https://code4rena.com/reports/2022-10-zksync/), Code4rena, from 2022-10-28 to 2022-11-09.
- [Layer 1 Smart Contracts](https://github.com/Secure3Audit/Secure3Academy/blob/main/audit_reports/zkSync/zkSync_L1_final_Secure3_Audit_Report.pdf), Secure3, from 2022-10-22 to 2022-11-06.
- [WETH Bridge Audit](https://blog.openzeppelin.com/zksync-weth-bridge-audit), OpenZeppelin, from 2023-03-27 to 2023-03-31.
- [Bridge and .transfer & .send](https://blog.openzeppelin.com/zksync-bridge-and-.transfer-.send-diff-audit), OpenZeppelin, from 2023-04-24 to 2023-05-01.
- [GnosisSafeZk Assessment](https://blog.openzeppelin.com/zksync-gnosissafezk-assessment-1), OpenZeppelin, from 2023-05-22 to 2023-05-26.
- [Upgrade System](https://blog.openzeppelin.com/zksync-upgrade-system-audit), OpenZeppelin, from 2023-06-26 to 2023-06-30.
- [Layer 1 Messenger Upgrade](https://blog.openzeppelin.com/zksync-l1messenger-upgrade-audit), OpenZeppelin, from 2023-08-30 to 2023-09-14.
- [Diff and Governance Audit](https://blog.openzeppelin.com/december-diff-and-governance-audit), OpenZeppelin, from 2023-12-04 to 2023-12-22.
- Layer 2, Internal Audit, from 2022-08-17 to 2022-10-24.
- [Layer 2 Bootloader](https://blog.openzeppelin.com/zksync-bootloader-audit-report/), OpenZeppelin, from 2022-11-28 to 2022-12-23.
- [Layer 2 Fee Model and Token Bridge](https://blog.openzeppelin.com/zksync-fee-model-and-token-bridge-audit/), OpenZeppelin, from 2023-01-23 to 2023-02-17.
- [Layer 2 System Contracts Public Contest](https://code4rena.com/contests/2023-03-zksync-era-system-contracts-contest), Code4rena, from 2023-03-10 to 2023-03-19.
- [Layer 2 Block Refactor](https://blog.openzeppelin.com/zksync-l2-block-refactor-audit), OpenZeppelin, from 2023-07-25 to 2023-07-31.
- [Keccak256 Upgrade](https://blog.openzeppelin.com/zksync-keccak256-upgrade-audit), OpenZeppelin, from 2023-10-23 to 2023-10-27.
- [Layer 1 & 2 Diff Audit](https://blog.openzeppelin.com/november-diff-audit), OpenZeppelin, from 2023-11-27 to 2023-12-05.
- [Short-Term Fee Model Changes](https://blog.openzeppelin.com/short-term-fee-model-changes-audit), OpenZeppelin, from 2023-12-06 to 2023-12-13.
- ZK Proof System, Internal Audit, from 2022-10-24 to 2022-11-18.
- [ZK Proof System](https://github.com/HalbornSecurity/PublicReports/blob/master/ZK%20Audits/MatterLabs_zkSync_Era_Circuits_Zero_Knowledge_Security_Audit_Report_Halborn_Final..pdf), Halborn, from 2023-01-09 to 2023-03-08.
- [Smart Contract Security Assessment](https://github.com/HalbornSecurity/PublicReports/blob/master/Solidity%20Smart%20Contract%20Audits/MatterLabs_Verifier_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf), Halborn, from July 12th, 2023 - July 20th, 2023.
- [SNARK Wrapper](https://github.com/spearbit/portfolio/blob/master/pdfs/Matter-labs-snark-wrapper-Spearbit-Security-Review.pdf), Spearbit, November 2023
- [EIP-4844 Support](https://blog.openzeppelin.com/eip-4844-support-audit), OpenZeppelin, February 2024

## Bug Bounty Program

zkSync Era has a very detailed **[Bug bounty Program on Immunefi](https://immunefi.com/bounty/zksyncera/)**. In the listing, you can find all the information related to assets in scope, reporting, and the payout process.

### Scope

The bug bounty program for zkSync Era aims to identify and resolve security vulnerabilities in our system before they can be exploited by malicious actors. The program is open to all individuals and teams who are interested in participating and are willing to comply with the program's rules and guidelines. The scope of the program covers all aspects of our blockchain products, including smart contracts, protocols, portals, and any other components that are part of our ecosystem.

### Requirements

1. Eligibility: The bug bounty program is open to anyone who is interested in participating and who complies with the program's rules and guidelines.
2. Responsible Disclosure: All participants must agree to follow the responsible disclosure policy and report any security vulnerabilities they discover to our security team in a timely and responsible manner.
3. Rewards: The bug bounty program offers rewards to participants who discover and report security vulnerabilities. The rewards are determined based on the severity of the vulnerability and are paid in USDC.
4. Reporting Guidelines: Participants must follow the reporting guidelines specified by the program.
5. No Public Disclosure: Participants must not publicly disclose any vulnerabilities they discover until after they have been resolved by our security team.
6. No Exploitation: Attacks that the reporter has already exploited themselves, leading to damage are not eligible for a reward.
7. Legal Compliance: Participants must comply with all applicable laws and regulations, including data privacy and security laws.
8. Program Changes: We reserve the right to modify or terminate the program at any time and without prior notice. We also reserve the right to disqualify any participant who violates the program's rules and guidelines.

### Unscoped Bug

If you think you have found a critical or major bug that is not covered by our existing bug bounty, please report it to us [via the Immunefi program](https://immunefi.com/bounty/zksyncera/) regardless. We will seriously consider the impact of any issues and may award a bounty even for out of scope assets or impacts.
