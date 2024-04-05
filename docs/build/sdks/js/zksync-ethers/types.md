---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Types | zkSync Docs
---

# Types and Interfaces

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
- `minimalAllowance`: `BigNumberish`;
- `innerInput`: `BytesLike`;

## `BalancesMap`

Type defining a map object containing accounts and their balances.

- `{ [key: string]`: `bigint }`

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

Pipe-delimited list of block labels that includes block number in binary and hex plus block statuses.

- `BigNumberish`
- `string` // block hash
- `committed`
- `finalized`
- `latest`
- `earliest`
- `pending`

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

## `Fee`

Interface representation of transaction fee.

- `gasLimit`: `BigInt`;
- `gasPerPubdataLimit`: `BigInt`;
- `maxPriorityFeePerGas`: `BigInt`;
- `maxFeePerGas`: `BigInt`;

## `FinalizeWithdrawalParams`

Interface representation of finalize withdrawal parameters.

- `l1BatchNumber`: `number | null`;
- `l2MessageIndex`: `number`;
- `l2TxNumberInBlock`: `number | null`;
- `message`: `any`;
- `sender`: `string`;
- `proof`: `string[]`;

## `FullDepositFee`

Interface representation of full deposit fee containing various mandatory and optional fields.

- `maxFeePerGas?`: `BigInt`;
- `maxPriorityFeePerGas?`: `BigInt`;
- `gasPrice?`: `BigInt`;
- `baseCost`: `BigInt`;
- `l1GasLimit`: `BigInt`;
- `l2GasLimit`: `BigInt`;

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
- Sepolia = `6`,
- localhost = `9`

## `PaymasterInput`

Type definition for a paymaster input specified as either approval based or general.

- `ApprovalBasedPaymasterInput` | `GeneralPaymasterInput`

## `PaymasterParams`

Type defining a paymaster by address and the bytestream input.

- `paymaster`: `Address`;
- `paymasterInput`: `BytesLike`;

## `PayloadSigner`

Signs various types of payloads, optionally using a some kind of secret.

- `payload`: `BytesLike`;
- `secret`: `any`;
- `provider` `null | Provider`;

## `PriorityOpResponse`

Interface representation of priority op response that extends [`TransactionResponse`](#transactionresponse) and adds a function that waits to commit a layer 1 transaction, including when given on optional confirmation number.

- `waitL1Commit(confirmation?: number)`: `Promise<providers.TransactionReceipt>`;

## `RawBlockTransaction`

Interface representation of raw block with transactions

- `common_data`:
  - `L2`:
    - `nonce`: `number`;
    - `fee`:
      - `gas_limit`: `BigInt`;
      - `max_fee_per_gas`: `BigInt`;
      - `max_priority_fee_per_gas`: `BigInt`;
      - `gas_per_pubdata_limit`: `BigInt`;
    - `initiatorAddress`: `Address`;
    - `signature`: `Uint8Array`;
    - `transactionType`: `string`;
    - `input`
      - `hash`: `string`;
      - `data`: `Uint8Array`;
    - `paymasterParams`:
      - `paymaster`: `Address`;
      - `paymasterInput`: `Uint8Array`;
- `execute`:
  - `calldata`: `string`;
  - `contractAddress`: `Address`;
  - `factoryDeps`: `BytesLike[]`;
  - `value`: `BigInt`;
- `received_timestamp_ms`: `number`;
- `raw_bytes`: `string`;

## `Signature`

0x-prefixed, hex-encoded, ECDSA signature as string.

## `SmartAccountSigner`

Encapsulates the required input parameters for creating a signer for [`SmartAccount`](./accounts.md#smartaccount).

- `address`: `string`;
- `secret`: `any`;
- `payloadSigner`: `PayloadSigner`;
- `transactionBuilder`: `TransactionBuilder`;

## `StorageProof`

Interface representation of Merkle proofs for storage values.

- `address`: `string`;
- `storageProof` (Array):
  - `key`: `string`;
  - `value`: `string`;
  - `index`: `number`;
  - `proof`: `string[]`;

## `Token`

Interface representation of token containing various fields.

- `l1Address`: `Address`;
- `l2Address`: `Address`;
- `name`: `string`;
- `symbol`: `string`;
- `decimals`: `number`;

## `TransactionBuilder`

Populates missing fields in a transaction with default values.

- `transaction`: `TransactionRequest`;
- `secret`: `any`;
- `provider`: `null | Provider`;

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
- `l2ToL1Logs`: `Array<L2ToL1Log>`;
- `_logs`: `ReadonlyArray<Log>`;

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
Find the code definition of the types above on the [zkSync Era GitHub repo.](https://github.com/zksync-sdk/zksync-ethers/blob/main/src/types.ts)
:::
