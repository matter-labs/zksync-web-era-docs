# Deploy a zkSync Subgraph

### Introduction

In this tutorial, you will learn how to deploy a subgraph that tracks a specific address on zkSync Era mainnet. Deploying graphs is a great way to query data from network historically and in real-time.

The Graph is a decentralized protocol for indexing and querying data from blockchains. The Graph serves queries over data that is easily stored, decentralized, and secured by the blockchain. You will learn how to deploy a subgraph that tracks a specific address on zkSync Era mainnet. You can use this subgraph to query data from zkSync Era mainnet.

## Prerequisites

- Node.js LTS and NPM
- Yarn LTS
- An account with ETH on zkSync Era testnet

## Build time

### Step 1 — Visit theGraph Studio and Connect Wallet

- Visit <https://thegraph.com/studio/>
- Connect your wallet

### Step 2 — Create a new Subgraph

- Click on the button to create a new subgraph
- Enter the name of the subgraph (for example: `zksync-thegraph-tutorial`)
- Select the network you want to deploy the subgraph on, in this case: `zkSync Era (Subgraph Only)`

### Step 3 — Install the Graph CLI

- Install the Graph CLI with `npm install -g @graphprotocol/graph-cli`
- Create `pepe_abi.json` file and use code from [GH Tutorial file](https://github.com/zkSync-Community-Hub/tutorials/blob/main/tutorials/the-graph/code/pepe_abi.json)
- Initialize the Graph project with `graph init --studio zksync-thegraph-tutorial`
  - Select `Ethereum` as the protocol
  - Select `zksync-era` as the Ethereum network
  - Provide the contract address you wish to track, for this tutorial, the PEPE token: `0xFD282F16a64c6D304aC05d1A58Da15bed0467c71`
  - Provide an abi filepath for the contract, in this case the `pepe_abi.json` file, as a path from this project root if this is your current working directory: `./code/pepe_abi.json`
  - Provide a block number to start indexing from, say `13761747` (using a higher block number will lead to a quicker graph deployment if you're following this tutorial in the future)
  - Approve the next steps and skip adding another contract

### Step 4 — Authenticate and Deploy the Subgraph

- Authenticate with `graph auth --studio <ACCESS_TOKEN>` (you can find this command with the access token in the studio, which you can copy and paste)
- Change directory to the subgraph with `cd zksync-thegraph-tutorial`
- Build the subgraph with `graph codegen && graph build`
- Deploy the subgraph with `graph deploy --studio zksync-thegraph-tutorial`
- Please, make sure that local folder name matches name of the subgraph studio

### Step 5 — Query the Subgraph

- Visit the [studio](https://thegraph.com/studio/) and then the section for the overview on this created subgraph and click on the `Playground` tab
- The tab will already have a pre-written query for you, which you can run by clicking on the `play` button. The query will look as follows:

  ```graphql
  {
    approvals(first: 5) {
      id
      owner
      spender
      value
    }
    bridgeBurns(first: 5) {
      id
      _account
      _amount
      blockNumber
    }
  }
  ```

- You can also write your own query, for example, to query the `approvals` table for a specific `owner` address, you can write the following query:

  ```graphql
  {
    approvals(where: { owner: "0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098" }) {
      id
      owner
      spender
      value
    }
  }
  ```

- You can also query the `bridgeBurns` table for a specific `account` address, you can write the following query:

  ```graphql
  {
    bridgeBurns(where: { _account: "0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098" }) {
      id
      _account
      _amount
      blockNumber
    }
  }
  ```

- You can also query the `bridgeMints` table for a specific `account` address, you can write the following query:

  ```graphql
  {
    bridgeMints(where: { _account: "0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098" }) {
      id
      _account
      _amount
      blockNumber
    }
  }
  ```

- You can interact with this subgraph by querying the data from the subgraph. You can also use this subgraph to build a frontend application that interacts with the subgraph.

## Conclusion

In this tutorial, you learned how to deploy a subgraph that tracks a specific address on zkSync Era testnet. You can now use this subgraph to query data from zkSync Era mainnet in realtime and historically. You can also use this subgraph to build a frontend application that interacts with the subgraph and is reliant on data from the blockchain.
