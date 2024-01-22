---
head:
  - - meta
    - name: "twitter:title"
      content: System Upgrades | zkSync Docs
---

# System Upgrades

## Update Process

[System contracts](https://github.com/matter-labs/era-contracts) handle core functionalities and play a critical role in maintaining the integrity of our protocol. To
ensure the highest level of security and reliability, these system contracts undergo an audit before any release.

Here is an overview of the release process of the system contracts which is aimed to preserve agility and clarity on the
order of the upgrades:

### `main` branch

[The `main` branch](https://github.com/matter-labs/era-contracts/blob/main/README.md) contains the latest code that is ready to be deployed into production. It reflects the most stable and
audited version of the protocol.

### `dev` branch

[The `dev` branch](https://github.com/matter-labs/era-contracts/blob/dev/README.md) is for active development & the latest code changes. Whenever a new PR with system contract changes is
created it should be based on the `dev` branch.

### Creating a new release

Whenever a new release is planned, a new branch named `release-vX-<name>` should be created off the `dev` branch, where
`X` represents the release version, and `<name>` is a short descriptive name for the release. The PR with the new
release should point to either the `main` branch or to the release branch with a lower version (in case the previous
branch has not been merged into `main` for some reason).

Once the audit for the release branch is complete and all the fixes from the audit are applied, we need to merge the new
changes into the `dev` branch. Once the release is final and merged into the `main` branch, the `main` branch should be
merged back into the `dev` branch to keep it up-to-date.

### Updating Unaudited Code

Since scripts, READMEs, etc., are code that is not subject to audits, these are to be merged directly into the `main`
branch. The rest of the release branches as well as the `dev` branch should merge `main` to synchronize with these
changes.
