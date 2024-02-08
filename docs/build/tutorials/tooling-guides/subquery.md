---
head:
  - - meta
    - name: "twitter:title"
      content: SubQuery | zkSync Docs
---

# SubQuery

### Introduction

This guide outlines the process of indexing all transfers and approval events from the Wrapped ETH on zkSync Era Network.

[The SubQuery Network](https://academy.subquery.network/) indexes and services data to the global community in an incentivized and verifiable way. After publishing your project to the SubQuery Network, anyone can index and host it — providing data to users around the world faster and reliably.

### Prerequisites

- **Node.js**: If not installed, [download it here](https://nodejs.org/).
- **Docker**: If not installed, [download it here](https://www.docker.com/get-started).
- **Tooling**: This guide utilizes `@subql/cli`. Ensure you have it accessible or installed in your environment.

### Step 1 — Understanding SubQuery

A SubQuery extracts data from a blockchain, processing it and storing it so that it can be easily queried via GraphQL. Make advanced, flexible, but simple queries over GraphQL from any website or app. SubQuery supports advanced features like aggregate functions and subscriptions. dApps often need to fetch data from chain. Instead of querying the chain directly, which can be slow and expensive, dApps can use SubQuery to quickly retrieve the data they need.

**Key components:**

- **project.yaml**: a YAML file containing the subgraph manifest.
- **schema.graphql**: a GraphQL schema that defines what data is stored for your subgraph, and how to query it via GraphQL.
- **Mappings**: Translates from the event data to the entities defined in your schema.

### Step 2 — Environment setup

Install the SubQuery CLI using NPM (avoid using `yarn global` due to dependency issues):

```bash
npm install -g @subql/cli
subql --help  # Verify installation
```

Run `subql init` in the desired directory, follow the prompts to set up your project:

```bash
subql init
# Follow the interactive prompts
```

After initialization, navigate to your project directory and install dependencies:

```bash
cd PROJECT_NAME
yarn install
```

### Step 3 — Configure Your Project Manifest File

The `project.yaml` file serves as the entry point to your zkSync project, defining how SubQuery will index and transform the chain data. For zkSync Era, three types of mapping handlers are available:

- `BlockHandlers`: Executes a mapping function on every block.
- `TransactionHandlers`: Executes a mapping function on each transaction matching optional filter criteria.
- `LogHandlers`: Executes a mapping function on each log matching optional filter criteria.

Start by:

Import the contract ABI definition from any standard [ERC-20 contract](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/), save it as `erc20.abi.json` in the `/abis` directory.

Update the `dataSources` section in `project.yaml` as shown below:

```yaml
dataSources:
  - kind: ethereum/Runtime # We use ethereum runtime since Zksync is a layer-2 that is compatible
    startBlock: 10456259 # This is the block that the contract was deployed on
    options:
      # Must be a key of assets
      abi: erc20
      address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4" # This is the contract address for wrapped ether https://explorer.zksync.io/address/0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4
    assets:
      erc20:
        file: "./abis/erc20.abi.json"
    mapping:
      file: "./dist/index.js"
      handlers:
        - handler: handleTransaction
          kind: ethereum/TransactionHandler # We use ethereum handlers since Zksync is a layer-2 that is compatible
          filter:
            ## The function can either be the function fragment or signature
            # function: '0x095ea7b3'
            # function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
            function: approve(address to, uint256 value)
        - handler: handleLog
          kind: ethereum/LogHandler # We use ethereum handlers since Zksync is a layer-2 that is compatible
          filter:
            topics:
              ## Follows standard log filters https://docs.ethers.io/v5/concepts/events/
              - Transfer(address indexed from, address indexed to, uint256 amount)
              # address: "0x60781C2586D68229fde47564546784ab3fACA982"
```

### Step 4 — Update Your GraphQL Schema File

Remove existing entities and update `schema.graphql` file to index block information, transfers, and approvals as shown below:

```graphql
type Transfer @entity {
  id: ID!
  blockHeight: BigInt
  to: String!
  from: String!
  value: BigInt!
  contractAddress: String!
}

type Approval @entity {
  id: ID!
  blockHeight: BigInt
  owner: String!
  spender: String!
  value: BigInt!
  contractAddress: String!
}
```

Generate entity classes and ABI types:

::: code-tabs

@tab:active yarn

```bash
yarn codegen
```

@tab npm

```bash
npm run-script codegen
```

:::

Import the generated types in your project:

```javascript
import { Approval, Transfer } from "../types";
import { ApproveTransaction, TransferLog } from "../types/abi-interfaces/Erc20Abi";
```

### Step 5 — Add Mapping Functions

Navigate to `src/mappings` directory, you'll find `handleLog` and `handleTransaction` functions.

Update the functions to process and store the desired data as shown below:

```typescript
export async function handleLog(log: TransferLog): Promise<void> {
  logger.info(`New transfer transaction log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const transaction = Transfer.create({
    id: log.transactionHash,
    blockHeight: BigInt(log.blockNumber),
    to: log.args.to,
    from: log.args.from,
    value: log.args.value.toBigInt(),
    contractAddress: log.address,
  });

  await transaction.save();
}

export async function handleTransaction(tx: ApproveTransaction): Promise<void> {
  logger.info(`New Approval transaction at block ${tx.blockNumber}`);
  assert(tx.args, "No tx.args");

  const approval = Approval.create({
    id: tx.hash,
    owner: tx.from,
    spender: await tx.args[0],
    value: BigInt(await tx.args[1].toString()),
    contractAddress: tx.to,
  });

  await approval.save();
}
```

These functions process transaction and log data, extracting necessary information to save in the database. Ensure to check the Mappings documentation for more insights.

### Step 6 — Build, Run, and Query Your Project

Build your project:

```bash
yarn build
```

Run your project locally with Docker:

```bash
yarn start:docker
```

Open your browser and head to `http://localhost:3000`. Explore the GraphQL playground and use the Docs tab to understand the available queries.

Try the following query to understand how it works for your new SubQuery starter project:

```graphql
{
  query {
    transfers(first: 5, orderBy: VALUE_DESC) {
      totalCount
      nodes {
        id
        blockHeight
        from
        to
        value
        contractAddress
      }
    }
  }
  approvals(first: 5, orderBy: BLOCK_HEIGHT_DESC) {
    nodes {
      id
      blockHeight
      owner
      spender
      value
      contractAddress
    }
  }
}
```

You should now see the results displayed below in the GraphQL playground, and you're ready to continue developing your SubQuery project.

### Conclusion

Congratulations! You have successfully set up a SubQuery project running locally, ready to handle GraphQL API requests pertaining to data transfers.

To ensure your SubQuery project operates efficiently and to sidestep common pitfalls, delve into the [Project Optimization](https://academy.subquery.network/build/optimisation.html) section. Happy querying!
