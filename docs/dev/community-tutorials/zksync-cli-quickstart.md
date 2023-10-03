# Quickstart with zksync-cli

## Introduction

Let’s explore how to utilize `zksync-cli` to deploy our initial smart contract on the zkSync Era testnet.

## Prerequisites

Ensure your system is prepared with:

- **Node.js** (LTS version) & **NPM** (LTS version) - [Download here](https://nodejs.org/en)
- **Yarn** (LTS version) - [Download here](https://v3.yarnpkg.com/getting-started/install)
- **Git** - [Download here](https://git-scm.com/downloads)

Also, you'll need an account loaded with ETH on zkSync Era testnet. Get free test ETH [here](https://goerli.portal.zksync.io/faucet).

::: info Local zkSync Testing
Without needing test ETH, `zksync-cli` allows testing contracts locally. Use `npx zksync-cli dev start` to activate a local zkSync development setup, inclusive of local Ethereum and zkSync nodes. Further details are available in the [zksync-cli documentation](../../tools/zksync-cli/README.md).
:::

## Steps to Deploy Your First Contract

#### Step 1: Initiate a Sample Project

Execute the following code to create a new project named `quickstart` using an existing template.

```sh
npx zksync-cli create-project quickstart --template hardhat_solidity  && cd quickstart
```

Inside `quickstart`, you’ll find:

- `hardhat.config.ts`: This contains configuration and imports needed by zksync.
- `contracts`: This directory holds a `Greeter.sol` smart contract.
- `deploy`: Houses scripts to both deploy and interact with the smart contract.

::: info
For local zkSync testing, modify `url` and `ethNetwork` in `hardhat.config.ts` to align with your local zkSync and Ethereum node's L2 and L1 RPC URLs, respectively.
:::

#### Step 2: Compile Your Contract

Compile your contract using the command:

```sh
yarn hardhat compile
```

After compiling, two folders - `artifacts-zk` and `cache-zk` will be created.

#### Step 3: Set your Private Key

Rename `.env.example` to `.env` and input your private key:

```text
WALLET_PRIVATE_KEY=YourPrivateKeyHere...
```

Your private key will be used for paying the costs of deploying the smart contract.

#### Step 4: Deploy Your Contract

Deploy your contract with the following:

```sh
yarn hardhat deploy-zksync --script deploy-greeter.ts
```

You should observe an output akin to:

```sh
Running deploy script for the Greeter contract
The deployment is estimated to cost 0.00004848225 ETH
Constructor args: [Byte code will be here]
Greeter was deployed to [Your Contract Address will be here]
```

🎉 **Congratulations!** Your contract has been deployed on the zkSync Era testnet. Inspect your contract [here](https://goerli.explorer.zksync.io/).

### Conclusion

Great job! You’ve successfully deployed a smart contract using `zksync-cli`. Now, feel free to explore further and play around with your new smart contract on the testnet!
