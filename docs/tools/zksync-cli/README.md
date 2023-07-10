# zkSync CLI

The zkSync CLI simplifies the process of developing applications and interacting with zkSync Era.

The code is available [in the following repository](https://github.com/matter-labs/zksync-cli).

## Installation

Install the zkSync CLI globally with the following command:

```
npm i -g zksync-cli@latest
```

You can also run this via NPX with `npx zksync-cli@latest [COMMAND]`

## Commands

- `zksync-cli create [PROJECT_NAME]`: creates a new project in a new folder with the given project name. If the project name is not provided, it creates the project in the current folder, although this requires the folder to be empty.
- `zksync-cli deposit`: deposits funds from L1 to zkSync Era. It will ask you to provide: the network (localnet, testnet, mainnet), the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.
- `zksync-cli withdraw`: withdraws funds from zkSync Era to L1. It will ask you to provide: the network (localnet, testnet, mainnet), the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.
- `zksync-cli help`: returns the version and information about the different commands.

> Both deposit and withdraw might take a couple of minutes to complete.

More commands will be added shortly but if you have any suggestions, feel free to [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

### Project templates

Below are the repositories of the different project templates used on the `zksync-cli create` command:

- [Hardhat + Solidity](https://github.com/matter-labs/zksync-hardhat-template).
- [Hardhat + Vyper](https://github.com/matter-labs/zksync-hardhat-vyper-template).

## Troubleshooting

If you find any issues, you can [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new) or report it to us [in GitHub discussions](https://github.com/zkSync-Community-Hub/zkync-developers/discussions).
