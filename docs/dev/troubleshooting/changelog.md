# Changelog

## System update v1.3 (Feb 8th 2023)

The recent update made several modifications to the system in preparation for the "Fair Onboarding Alpha" milestone. The modifications include:

- a fee mechanism revamp that replaces `ergs` with `gas` to make it easier to understand (after all, we’re all part of the Ethereum ecosystem).
- updates in the Account Abstraction support;
- changes in L1 and L2 system contract interfaces.
- breaking changes in our SDKs where methods and properties that contained `ergs` are renamed `gas`.
- API error messages now follow the Geth format (more updates coming soon).

**These updates were followed by a system regenesis.**

### How to update your project

To update your project, follow these steps:

- Update all your project dependencies, while continuing to use `ethers v5.7.x` (as `ethers v6.x` introduces additional breaking changes).
- Delete the `artifacts-zk` and `cache-zk` folders.
- If you’re using the local-setup to run unit tests, update the docker images with `docker-compose pull` and restart the local setup state by running the `./clear.sh` script.
- Re-compile your project with the latest version of the binary compiler (`v1.3.1`).
- Update `zksync-web3` to `0.13.x`. All methods that included `ergs` have been renamed to `gas` and some function signatures have changed.
- If your project uses zksync system contracts, make sure to update the `@matterlabs/zksync-contracts` package as well. There are changes in multiple contract interfaces.
- Paymasters: The `ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT` in the transaction `customData` should be updated to `gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT`. Custom paymasters are required to return a magic value after a transaction validation on the `validateAndPayForPaymasterTransaction` method.
- If your project uses Account Abstraction, keep in mind that the IAccount interface has changed. We’ve introduced account versioning to allow for future updates. Accounts are required to return a magic value after a transaction validation on the `validateTransaction` method.
- If your smart contracts use any methods from the `SystemContractsCaller` library (like `systemCall`), you'd need to compile them with the `isSystem` flag set to `true` in the `settings` section of `zksolc` inside the `hardhat.config.ts` file.
- zkSync system contracts have cycle dependencies and might cause issues flattening contracts with `hardhat flatten`. Use the [hardhat verify plugin](../../api/hardhat/hardhat-zksync-verify.md) instead.
- As with any other regenesis, it will remove all balances and contracts so you’ll need to deposit funds and redeploy your contracts again.

If after doing these changes you’re still facing issues, please [create a support ticket in the "dev-support-beta" channed in our Discord](https://join.zksync.dev/).

The [Javascript SDK documentation](../../api/js/getting-started.md) and [Quickstart tutorial](../developer-guides/hello-world.md) have been updated but **some other sections of the docs are not updated yet.** We will release updates during the upcoming days. If you find any issues, please [contact us]((https://join.zksync.dev/)).
