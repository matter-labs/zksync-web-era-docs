---
head:
  - - meta
    - name: "twitter:title"
      content: Changelog | zkSync Docs
---

# Changelog

## Hardhat plugins update (June 21st, 2023)

- New release of `@matterlabs/hardhat-zksync-solc`:
  - Compiler version checks to ascertain the use of the most recent version.
  - Support for using `version: "latest"` in your `hardhat.config.ts` file.
  - Inclusion of default values for all necessary configuration parameters to enhance user experience.
- New release of `@matterlabs/hardhat-zksync-vyper`:
  - Compiler version checks to ascertain the use of the most recent version.
  - Support for using `version: "latest"` in your `hardhat.config.ts` file.
  - Inclusion of default values for all necessary configuration parameters to enhance user experience.

### How to update your project

- `@matterlabs/hardhat-zksync-solc` plugin:

  - Update the package to `0.4.0` in your `package.json` file and re-install dependencies.

- `@matterlabs/hardhat-zksync-vyper` plugin:
  - Update the package to `0.2.0` in your `package.json` file and re-install dependencies.

## zksync-upgradable and compiler (May 5th 2023)

- First release of `@matterlabs/hardhat-zksync-upgradable` a new package to create beacon and transparent proxy contracts. [More info here](../../tools/hardhat/hardhat-zksync-upgradable.md)
- zksolc compiler has been updated to version `1.3.10`:
  - Multiple optimizations, security and bug fixes.
  - Support for metadata output option.
  - The `@matterlabs/hardhat-zksync-solc` plugin has been updated to support the latest version of the compiler and new options.
- New release of `@matterlabs/hardhat-zksync-verify`:
  - Fix to pass optimization options to verification backend.
  - The `verify:verify` task now returns a verification id.

### How to update your project

Compiler updates:

- Update `zksolc` version to `1.3.10` in the `hardhat.config.ts` and update `@matterlabs/hardhat-zksync-solc` to `0.3.17`. Recompile and redeploy.

- Verify plugin:
  - Update the package to `0.1.6` in your `package.json` file and re-install dependencies.

## Compilers and plugins (Apr 4th 2023)

- zksolc compiler has been updated to version `1.3.8`:
  - Multiple optimizations and bug fixes.
  - Included optimizer `mode` flag to reduce contract size in special cases.
  - Allowed to turn off the `solc` optimizer.
  - Support for more Solidity output options.
  - The `@matterlabs/hardhat-zksync-solc` plugin has been updated to support the latest version of the compiler.
- zkvyper compiler has been updated to version `1.3.5`:
  - Multiple optimizations and bug fixes.
  - Allowed to turn off the `vyper` optimizer.
  - Support for more Vyper output options.
  - The `@matterlabs/hardhat-zksync-vyper` plugin has been updated to support the latest version of the compiler.
- New releases of multiple Hardhat plugins with updated dependencies:
  - hardhat-zksync-chai-matchers version `0.1.2`.
  - hardhat-zksync-verify version `0.1.4`.
  - hardhat-zksync-deploy version `0.6.3`.

### How to update your project

Compiler updates:

- For Solidity projects, update `zksolc` version to `1.3.8` in the `hardhat.config.ts` and update `@matterlabs/hardhat-zksync-solc` to `0.3.15`. Recompile and redeploy.
- For Vyper projects, update `zkvyper` version to `1.3.5` in the `hardhat.config.ts` and update `@matterlabs/hardhat-zksync-vyper` to `0.1.8`. Recompile and redeploy.
  Hardhat plugin updates:
- All plugins have been released as minor updates so you can update with `npm update PACKAGE_NAME` or `yarn upgrade PACKAGE_NAME`.

## Full launch system update (Mar 23rd, 2023)

Major updates across the system include:

- Protocol changes:
  - Removed allow list for L1<>L2 communication (zkSync Era is now at Full Launch and open to all users).
  - Implementation of [withdrawal delay](../troubleshooting/withdrawal-delay.md).
  - Smart contract bytecode packing.
  - Multiple bug fixes in circuits and prover.
  - Fee model adjusted for L1<>L2 communication and proof generation.
  - Security fixes.
  - Performance improvements.
- New version of JS SDK zksync-web3 `0.14.3`.
- New version of `zksync-cli` `0.1.4`.
- Released new docker images of the local setup for unit tests.

### How to update your project

- Update `zksync-web3` to `^0.14.3` in your `package.json` file and re-install dependencies.
- Update `zksync-cli` with `npm update -g zksync-cli`.
- Pull the latest docker images of the local setup by running the `./clear.sh` script. [More about local setup](../../tools/testing/README.md).
- L1->L2 transactions now require gas fees to be paid upfront. The fee can be estimated using the new method `zks_estimateGasL1ToL2`. [Read more here](../concepts/l1-l2-interop.md).
- Provide `_refundRecipient` when using `requestL2Transaction` indicating the address that will receive refunds. (Optional)

## Hardhat plugins update (Feb 24th, 2023)

The following hardhat plugin has been released:

- `hardhat-zksync-verify` version `0.1.2`: now returns a verification id. Use this to query the status of smart contract verification. For more information, read the [Hardhat zkSync Era verification doc](../../tools/hardhat/hardhat-zksync-verify.md#verification-status-check)
- `hardhat-zksync-deploy` version `0.6.2`: integrates with latest version of `zksync-web3`.
- `hardhat-zksync-chai-matchers` version `0.1.1`: integrates with latest version of `zksync-web3`.

### How to update your project

Update the following versions in the `package.json` file of your project:

- Update `@matterlabs/hardhat-zksync-verify` to `0.1.2`.
- Update `@matterlabs/hardhat-zksync-deploy` to `0.6.2`.
- Update `@matterlabs/hardhat-zksync-chai-matchers` to `0.1.1`.

## Compiler & local-setup update (Feb 20th 2023)

Version `1.3.5` of `zksolc` has been released and the zkSync docker image of the local setup has been updated. Details:

- **Compiler:**
  - Adds support for Solidity `0.8.18`.
  - Fixes a broken optimization flag that increased the bytecode size of compiled contracts.
  - Fixes a bug that detected ERC20 `transfer` calls as ETH `transfer` and produced a compilation error.
  - Detection of `transfer` and `send` methods in smart contracts now returns a warning message (similar to `v1.3.1`). The new warning message reminds developers that using these methods to transfer ETH can cause issues and suggest replacing them with [`payable(address).call[value: <X>]`](../../dev/building-on-zksync/best-practices.md#use-call-over-send-or-transfer).
  - `transfer` can be used to transfer other tokens (e.g. ERC20) without any issues, although this might be still highlighted by the compiler.
- **Local setup docker image:**
  - Improvements in the zkSync node error messages returned on estimate gas requests.

### How to update your project

- Update the compiler version in the `hardhat.config.ts` file to `1.3.5`.
- Re-compile contracts.
- Update the docker images of the local setup with `docker-compose` pull`and restart its state by running the`./clear.sh` script.

## System update (Feb 10th 2023)

Minor updated that simplifies the fee model to reduce overhead and fix some bugs. It requires an update on the `zksync-web3` package to `v0.13.1`.

### How to update your project

- Update `zksync-web3` to `v0.13.1`.
- There are no changes in contract interfaces or APIs, so no code changes are required.
- Projects that don't use `zksync-web3` but rely on `eth_signTypedData` to sign the transactions would need to manually include a fixed `gasPerPubdataByteLimit` of `50000` in the transaction overrides.

## System update v1.3 (Feb 8th 2023)

This update made several modifications to the system in preparation for the "Fair Onboarding Alpha" milestone. The modifications include:

- Revamp in the fee mechanism:
  - `ergs` have been replaced with `gas` to make it easier to understand (after all, we’re all part of the Ethereum ecosystem).
  - Gas refunds: transactions are refunded for unused gas. You can see these refunds as token transfers [in the explorer](https://explorer.zksync.io/).
- Updates in the Account Abstraction and Paymaster interfaces.
- Changes in L1 and L2 system contract interfaces.
- Breaking changes in our SDKs where methods and properties that contained `ergs` are renamed `gas`.
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
- Paymasters:
  - The `ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT` in the transaction `customData` should be updated to `gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT`.
  - Custom paymasters are required to return a magic value after a transaction validation on the `validateAndPayForPaymasterTransaction` method. This value should be `ACCOUNT_VALIDATION_SUCCESS_MAGIC` (available on the `IAccount.sol` interface) if the validation is successful, or an empty value `bytes4(0)` if it fails.
- If your project uses Account Abstraction, keep in mind that the `IAccount` interface has changed.
  - The [Account abstraction multisig](../../dev/tutorials/custom-aa-tutorial.md) tutorial has been updated to reflect the interface changes.
  - The `prePaymaster` method has been renamed to`prepareForPaymaster`.
  - Smart contract accounts now include versioning to allow for future updates. This should be included as a parameter when calling `create2Account` from AA Factory contracts.
  - Accounts are required to return a magic value after a transaction validation on the `validateTransaction` method. This value should be `ACCOUNT_VALIDATION_SUCCESS_MAGIC` (available on the `IAccount.sol` interface) if the validation is successful, or an empty value `bytes4(0)` if it fails.
- If your smart contracts use any methods from the `SystemContractsCaller` library (like `systemCall`), you'd need to compile them with the `isSystem` flag set to `true` in the `settings` section of `zksolc` inside the `hardhat.config.ts` file.
- zkSync system contracts have cycle dependencies and might cause issues flattening contracts with `hardhat flatten`. Use the [hardhat verify plugin](../../tools/hardhat/hardhat-zksync-verify.md) instead.
- As with any other regenesis, it will remove all balances and contracts so you’ll need to deposit funds and redeploy your contracts again.

If after doing these changes you’re still facing issues, please [create a support ticket in the "dev-support-beta" channed in our Discord](https://join.zksync.dev/).

The [Javascript SDK documentation](../../api/js/getting-started.md), [Quickstart](../../dev/building-on-zksync/hello-world.md) and [Account abstraction multisig](../../dev/tutorials/custom-aa-tutorial.md) tutorials have been updated but **some other sections of the docs are not updated yet.** We will release updates during the upcoming days. If you find any issues, please [contact us](https://join.zksync.dev/).
