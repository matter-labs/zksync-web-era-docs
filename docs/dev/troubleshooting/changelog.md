# Changelog

## Hardhat plugins update (Feb 24th 2023)

The following hardhat plugin have been released:

- `hardhat-zksync-verify` version `0.1.2`: now returns a verification id, which can be used to query the status of a smart contract verification. More info [here](https://era.zksync.io/docs/api/hardhat/hardhat-zksync-verify.html#verification-status-check)
- `hardhat-zksync-deploy` version `0.6.2`: integrates with latest version of `zksync-web3`.
- `hardhat-zksync-chai-matchers` version `0.1.1`: integrates with latest version of `zksync-web3`.

### How to update your project

Update the following versions in the `package.json` file of your project:

- Update `@matterlabs/hardhat-zksync-verify` to `0.1.2`.
- Update `@matterlabs/hardhat-zksync-deploy` to `0.6.2`.
- Update `@matterlabs/hardhat-zksync-chai-matchers` to `0.1.1`.


## Compiler & local-setup update (Feb 20th 2023)

Version `1.3.5` of `zksolc` has been released and the zksync docker image of the local-setup has been updated. Details:

- **Compiler:**
  - Adds support for Solidity `0.8.18`.
  - Fixes a broken optimization flag that increased bytecode size of compiled contracts.
  - Fixes a bug that detected ERC20 `transfer` calls as ETH `transfer` and produced a compilation error. 
  - Detection of `transfer` and `send` methods in smart contracts now returns a warning message (similar to `v1.3.1`). The new warning message reminds developers that using these methods to transfer ETH can cause issues and suggest replacing them with `payable(address).call[value: <X>]("")`.
  - `transfer` can be used to transfer other tokens (e.g. ERC20) without any issues, although this might be still highlighted by the compiler.
- **Local setup docker image:**
  - Improvements in the zksync node error messages returned on estimate gas requests.

### How to update your project

- Update the compiler version in the `hardhat.config.ts` file to `1.3.5`.
- Re-compile contracts.
- Update the docker images of the local-setup with `docker-compose pull` and restart the its state by running the `./clear.sh` script.



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
  - The [Account abstraction multisig](../tutorials/custom-aa-tutorial.md) tutorial has been updated to reflect the interface changes.
  - The `prePaymaster` method has been renamed to`prepareForPaymaster`.
  - Smart contract accounts now include versioning to allow for future updates. This should be included as a parameter when calling `create2Account` from AA Factory contracts.
  - Accounts are required to return a magic value after a transaction validation on the `validateTransaction` method. This value should be `ACCOUNT_VALIDATION_SUCCESS_MAGIC` (available on the `IAccount.sol` interface) if the validation is successful, or an empty value `bytes4(0)` if it fails.
- If your smart contracts use any methods from the `SystemContractsCaller` library (like `systemCall`), you'd need to compile them with the `isSystem` flag set to `true` in the `settings` section of `zksolc` inside the `hardhat.config.ts` file.
- zkSync system contracts have cycle dependencies and might cause issues flattening contracts with `hardhat flatten`. Use the [hardhat verify plugin](../../api/hardhat/hardhat-zksync-verify.md) instead.
- As with any other regenesis, it will remove all balances and contracts so you’ll need to deposit funds and redeploy your contracts again.

If after doing these changes you’re still facing issues, please [create a support ticket in the "dev-support-beta" channed in our Discord](https://join.zksync.dev/).

The [Javascript SDK documentation](../../api/js/getting-started.md), [Quickstart](../building-on-zksync/hello-world.md) and [Account abstraction multisig](../tutorials/custom-aa-tutorial.md) tutorials have been updated but **some other sections of the docs are not updated yet.** We will release updates during the upcoming days. If you find any issues, please [contact us](https://join.zksync.dev/).
