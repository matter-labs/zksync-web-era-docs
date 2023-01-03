# zkSync CLI

The zkSync CLI simplifies the process of developing applications and interacting with zkSync 2.0.

The code is available [in the following repository](https://github.com/matter-labs/zksync-cli).

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Installation

Install the zkSync CLI globally with the following command:

```
npm i -g zksync-cli@latest
```

You can also run this via NPX with `npx zksync-cli@latest [COMMAND]`

## Commands

- `zksync-cli create [PROJECT_NAME]`: creates a new Hardhat project in a new folder with the given project name. If the project name is not provided, it creates the project in the current folder, although this requires the folder to be empty. The [template project can be found here](https://github.com/matter-labs/zksync-hardhat-template).

- `zksync-cli deposit`: deposits funds from L1 (Goerli testnet) to zkSync 2.0 testnet. It will ask you to provide: the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.

- `zksync-cli withdraw`: withdraws funds from zkSync 2.0 to L1 (Goerli testnet). It will ask you to provide: the recipient wallet, the amount in ETH (eg 0.1) and the private key of the wallet you're sending the funds from.

> Both deposit and withdraw might take a couple of minutes to complete.

More commands will be added shortly but if you have any suggestions, feel free to [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new).

## Troubleshooting

If you find any issues, you can [open an issue on GitHub](https://github.com/matter-labs/zksync-cli/issues/new) or report it to us [in our Discord](https://join.zksync.dev/).
