# Quickstart with zksync-cli

## Introduction

In this tutorial we'll use the zksync-cli to deploy our first smart contract to zkSync Era testnet.

## Requirements

Here are the system requirements and the versions I used:

- Node.js LTS and NPM LTS
- Yarn LTS

Additionally, you'd need an account with ETH on zkSync Era testnet. You can use the [faucet from the official portal](https://goerli.portal.zksync.io/faucet).

## Build time

1. Install the zksync-cli with:

```sh
npm i -g zksync-cli@latest
```

2. Create a sample project

```sh
zksync-cli create-project quickstart  && cd quickstart
```

Choose "Hardhat + Solidity" option. This commands clones an existing template project inside a new folder named `quickstart`.

The template project has the following structure:

- `hardhat.config.ts`: Hardhat configuration file that imports the zksync required plugins.
- `contracts`: folder with a `Greeter.sol` smart contract.
- `deploy`: folder with scripts to deploy and interact with the smart contract.

3. Compile the contract with:

```sh
yarn hardhat compile
```

Once compiled, the `artifacts-zk` and `cache-zk` folders will be generated.

4. Rename the `.env.example` file to `.env` and enter your account private key in it. This is the account that will pay for the deployment of the smart contract.

```text
WALLET_PRIVATE_KEY=abcdef123456....
```

5. Deploy the contract with:

```sh
yarn hardhat deploy-zksync --script deploy-greeter.ts
```

You'll see something like this:

```sh
Running deploy script for the Greeter contract
The deployment is estimated to cost 0.00004848225 ETH
Constructor args:0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000094869207468657265210000000000000000000000000000000000000000000000
Greeter was deployed to 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0
```

Congrats, you've deployed a contract to zkSync Era testnet. You can see the contract in the [zkSync Explorer](https://goerli.explorer.zksync.io/)
