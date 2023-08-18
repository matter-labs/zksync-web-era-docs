---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK types | zkSync Era docs
---

# Types and interfaces

## `AccountAbstractionVersion`

Enumerated list of account abstraction versions.

- None = `0` (Used for contracts that are not accounts.)
- Version1 = `1`

## `AccountNonceOrdering`

Enumerated list of account nonce ordering formats.

- Sequential = `0`
- Arbitrary = `1`

## `Address`

0x-prefixed, hex-encoded, Ethereum account address as string.

## `ApprovalBasedPaymasterInput`

Interface representation of approval based paymaster input containing various fields including an `ApprovalBased` type.

- `type`: `'ApprovalBased'`;
- `token`: `Address`;
- `minimalAllowance`: `BigNumber`;
- `innerInput`: `BytesLike`;

## `BalancesMap`

Type defining a map object containing accounts and their balances.

- `{ [key: string]`: `BigNumber }`

## `BatchDetails`

Interface representation of batch information containing various optional and mandatory fields.

- `number`: `number`;
- `timestamp`: `number`;
- `l1TxCount`: `number`;
- `l2TxCount`: `number`;
- `rootHash?`: `string`;
- `status`: `string`;
- `commitTxHash?`: `string`;
- `committedAt?`: `Date`;
- `proveTxHash?`: `string`;
- `provenAt?`: `Date`;
- `executeTxHash?`: `string`;
- `executedAt?`: `Date`;
- `l1GasPrice`: `number`;
- `l2FairGasPrice`: `number`;

## `Block`

Interface representation of a block that extends the Ethers [`providers.Block`](https://docs.ethers.org/v5/api/providers/types/#providers-Block) definition with additional fields.

- `l1BatchNumber`: `number`;
- `l1BatchTimestamp`: `number`;

## `BlockDetails`

Interface representation of block information containing various optional and mandatory fields.

- `number`: `number`;
- `timestamp`: `number`;
- `l1BatchNumber`: `number`;
- `l1TxCount`: `number`;
- `l2TxCount`: `number`;
- `rootHash?`: `string`;
- `status`: `string`;
- `commitTxHash?`: `string`;
- `committedAt?`: `Date`;
- `proveTxHash?`: `string`;
- `provenAt?`: `Date`;
- `executeTxHash?`: `string`;
- `executedAt?`: `Date`;

## `BlockTag`

Pipe-delimited list of block labels that includes block number in denary and hex plus block statuses.

- `number`
- `string` // hex representation of block number
- "committed"
- "finalized"
- "latest"
- "earliest"
- "pending"

## `BlockWithTransaction`

Interface representation of a block with transaction(s) that extends the Ethers `BlockWithTransactions` definition with additional fields.

- `l1BatchNumber`: `number`;
- `l1BatchTimestamp`: `number`;
- `transactions`: `Array<TransactionResponse>`;

## `ContractAccountInfo`

Interface representation for contract account information containing information on account abstraction version and nonce ordering format.

- `supportedAAVersion`: `AccountAbstractionVersion`;
- `nonceOrdering`: `AccountNonceOrdering`;

## `DeploymentInfo`

Interface representation of deployment information with various fields.

- `sender`: `Address`;
- `bytecodeHash`: `string`;
- `deployedAddress`: `Address`;

## `DeploymentType`

Pipe-delimited choice of two deployment types that support all `create2` variants.

- `create`
- `createAccount`

## `Eip712Meta`

Type defining an EIP-712 transaction with optional parameters.

- `gasPerPubdata?`: `BigNumberish`;
- `factoryDeps?`: `BytesLike[]`;
- `customSignature?`: `BytesLike`;
- `paymasterParams?`: `PaymasterParams`;

## `EthereumSignature`

Interface representation of an Ethereum signature.

- `v`: `number`;
- `r`: `BytesLike`;
- `s`: `BytesLike`;

## `EventFilter`

Interface representation of event filter containing various fields.

- `topics?`: `Array<string | Array<string> | null>`;
- `address?`: `Address | Array<Address>`;
- `fromBlock?`: `BlockTag`;
- `toBlock?`: `BlockTag`;
- `blockHash?`: `string`;

## `FullDepositFee`

Interface representation of full deposit fee containing various mandatory and optional fields.

- `maxFeePerGas?`: `BigNumber`;
- `maxPriorityFeePerGas?`: `BigNumber`;
- `gasPrice?`: `BigNumber`;
- `baseCost`: `BigNumber`;
- `l1GasLimit`: `BigNumber`;
- `l2GasLimit`: `BigNumber`;

## `GeneralPaymasterInput`

Interface representation of general paymaster input containing a couple of fields, including a `General` type.

- `type`: `'General'`;
- `innerInput`: `BytesLike`;

## `L2ToL1Log`

Interface representation of a layer 2 to layer 1 transaction log containing various fields.

- `blockNumber`: `number`;
- `blockHash`: `string`;
- `l1BatchNumber`: `number`;
- `transactionIndex`: `number`;
- `shardId`: `number`;
- `isService`: `boolean`;
- `sender`: `string`;
- `key`: `string`;
- `value`: `string`;
- `transactionHash`: `string`;
- `logIndex`: `number`;

## `Log`

Interface representation of log that extends Ethers [`providers.Log`](https://docs.ethers.org/v5/api/providers/types/#providers-Log) and supplies the layer 1 batch number.

- `l1BatchNumber`: `number`;

## `MessageProof`

Interface representation of message proof containing various fields.

- `id`: `number`;
- `proof`: `string[]`;
- `root`: `string`;

## `Network`

Enumerated list of networks and their ids.

- Mainnet = `1`
- Ropsten = `3`
- Rinkeby = `4`
- Goerli = `5`
- localhost = `9`

## `PaymasterInput`

Type definition for a paymaster input specified as either approval based or general.

- `ApprovalBasedPaymasterInput` | `GeneralPaymasterInput`

## `PaymasterParams`

Type defining a paymaster by address and the bytestream input.

- `paymaster`: `Address`;
- `paymasterInput`: `BytesLike`;

## `PriorityOpResponse`

Interface representation of priority op response that extends [`TransactionResponse`](#transactionresponse) and adds a function that waits to commit a layer 1 transaction, including when given on optional confirmation number.

- `waitL1Commit(confirmation?: number)`: `Promise<providers.TransactionReceipt>`;

## `Signature`

0x-prefixed, hex-encoded, ECDSA signature as string.

## `Token`

Interface representation of token containing various fields.

- `l1Address`: `Address`;
- `l2Address`: `Address`;
- `address`: `Address`; // backward compatible field although @deprecated in favor of l2Address
- `name`: `string`;
- `symbol`: `string`;
- `decimals`: `number`;

## `TransactionDetails`

Interface representation of transaction details containing various mandatory and optional fields.

- `isL1Originated`: `boolean`;
- `status`: `string`;
- `fee`: `BigNumberish`;
- `initiatorAddress`: `Address`;
- `receivedAt`: `Date`;
- `ethCommitTxHash?`: `string`;
- `ethProveTxHash?`: `string`;
- `ethExecuteTxHash?`: `string`;

## `TransactionReceipt`

Interface representation of transaction receipt that extends from Ethers [`providers.TransactionReceipt`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionReceipt) with additional fields.

- `l1BatchNumber`: `number`;
- `l1BatchTxIndex`: `number`;
- `logs`: `Array<Log>`;
- `l2ToL1Logs`: `Array<L2ToL1Log>`;

## `TransactionRequest`

Interface representation of transaction request that extends from Ethers [`providers.TransactionRequest`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionRequest) which adds an optional field for EIP-712 transactions.

- `customData?`: `Eip712Meta`;

## `TransactionResponse`

Interface representation of transaction response that extends from Ethers [`providers.TransactionResponse`](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse) with additional fields.

- `l1BatchNumber`: `number`;
- `l1BatchTxIndex`: `number`;
- `waitFinalize()`: `Promise<TransactionReceipt>`;

## `TransactionStatus`

Non-enumerated enum list of transaction statuses.

- NotFound = `not-found`
- Processing = `processing`
- Committed = `committed`
- Finalized = `finalized`

:::tip More info
Find the code definition of the types above on the [zkSync Era Github repo.](https://github.com/matter-labs/zksync-era/tree/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/types.ts)
:::
