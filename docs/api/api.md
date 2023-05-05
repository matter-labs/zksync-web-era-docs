# Web3 JSON-RPC API

zkSync Era fully supports the standard [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) and adds some L2-specific features.

:::tip Tip
- As long as code does not involve deploying new smart contracts, which can only be deployed using [EIP712 transactions](#eip712), _no changes to the codebase are needed_.
:::

## EIP-712 transactions

The Ethereum Improvement Proposal [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712) introduces hashing and signing of typed-structured data as well as bytestrings. 

To specify additional fields, such as the custom signature for custom accounts or to choose the paymaster, EIP-712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but they also have fields that contain additional L2-specific data (`paymaster`, etc).

```json
"gasPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factoryDeps": ["0x..."]
```

- `gasPerPubdata`: A field denoting the maximum amount of gas the user is willing to pay for a single byte of pubdata.
- `customSignature`: A field with a custom signature for the cases in which the signer's account is not an EOA.
- `paymasterParams`: A field with parameters for configuring the custom paymaster for the transaction. Parameters include the address of the paymaster and the encoded input.
- `factory_deps`: A non-empty array of `bytes`. For deployment transactions, it should contain the bytecode of the contract being deployed. If the contract is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which it can deploy.

To ensure the server recognizes EIP-712 transactions, the `transaction_type` field is equal to `113`. The number `712` cannot be used as it has to be one byte long.

Instead of signing the RLP-encoded transaction, the user signs the following typed EIP-712 structure:

| Field name             | Type        |
| ---------------------- | ----------- |
| txType                 | `uint256`   |
| from                   | `uint256`   |
| to                     | `uint256`   |
| gasLimit               | `uint256`   |
| gasPerPubdataByteLimit | `uint256`   |
| maxFeePerGas           | `uint256 `  |
| maxPriorityFeePerGas   | `uint256`   |
| paymaster              | `uint256`   |
| nonce                  | `uint256`   |
| value                  | `uint256`   |
| data                   | `bytes`     |
| factoryDeps            | `bytes32[]` |
| paymasterInput         | `bytes`     |

These fields are handled by our [SDK](./js/features.md).

## RPC endpoint URLs

### Testnet

[https://testnet.era.zksync.dev](https://testnet.era.zksync.dev)

### Mainnet

[https://mainnet.era.zksync.io](https://mainnet.era.zksync.io)


## zkSync Era JSON-RPC methods

All methods are located in the `zks_` namespace. The API may also provide methods not detailed here which are used internally by the team.

::: warning
- Metamask does not support the `zks_` namespace at the time of writing.
- Instead, use the [`Provider`]() class with the testnet RPC.
:::

### `debug_traceBlockByHash`

Returns debug trace of all executed calls contained in a block given by its L2 hash.

#### Inputs

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| `hash`    | `H256`        | The 32 byte hash defining the L2 block.                      |
| `options` | `TracerConfig`| Optional arguments: see the [TraceConfig documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#traceconfig) for details. |

#### Example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "debug_traceBlockByHash", "params": ["0x4bd0bd4547d8f8a4fc86a024e54558e156c1acf43d82e24733c6dac2fe5c5fc7"] }' \
"https://mainnet.era.zksync.io"
```

#### Output snippet

```json
{
    "calls": [],
    "error": null,
    "from": "0x0000000000000000000000000000000000008001",
    "gas": "0xe1e31a08",
    "gasUsed": "0x27e",
    "input": "0x6ef25c3a",
    "output": "0x000000000000000000000000000000000000000000000000000000000ee6b280",
    "revertReason": null,
    "to": "0x000000000000000000000000000000000000800b",
    "type": "Call",
    "value": "0x0"
},
```

### `debug_traceBlockByNumber`

Returns debug trace of all executed calls contained in a block given by its L2 block number.

#### Inputs

| Parameter | Type           | Description                                                  |
| --------- | -------------- | ------------------------------------------------------------ |
| `block`   | `BlockNumber`  | Block number.                                                |
| `options` | `TracerConfig` | Optional arguments: see the [TraceConfig documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#traceconfig) for details. |

#### Example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "debug_traceBlockByNumber", "params": [ "0x24b258" ] }' \
"https://mainnet.era.zksync.io"
```

#### Output snippet

```json
{
    "calls": [],
    "error": null,
    "from": "0x0000000000000000000000000000000000008001",
    "gas": "0xe1e31a08",
    "gasUsed": "0x27e",
    "input": "0x6ef25c3a",
    "output": "0x000000000000000000000000000000000000000000000000000000000ee6b280",
    "revertReason": null,
    "to": "0x000000000000000000000000000000000000800b",
    "type": "Call",
    "value": "0x0"
},
```

### `debug_traceCall`

Returns debug trace containing information on a specific calls given by the call request.

#### Inputs

| Parameter | Type           | Description                                                  |
| --------- | -------------- | ------------------------------------------------------------ |
| `request` | `CallRequest`  | The transaction call request for debugging.                          |
| `block`   | `BlockNumber`  | Block number by hash or number (optional).                   |
| `options` | `TracerConfig` | Optional arguments: see the [TraceConfig documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#traceconfig) for details. |

#### Example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "debug_traceCall", "params": [ { "from": "0x1111111111111111111111111111111111111111", "to":"0x2222222222222222222222222222222222222222", "data": "0xffffffff" }, "0x24b258" ] }' \
"https://mainnet.era.zksync.io"
```

#### Output snippet


```json
{
    "calls": [],
    "error": null,
    "from": "0x0000000000000000000000000000000000008001",
    "gas": "0x4b19b87",
    "gasUsed": "0x291",
    "input": "0x4de2e4680000000000000000000000001111111111111111111111111111111111111111",
    "output": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "revertReason": null,
    "to": "0x0000000000000000000000000000000000008002",
    "type": "Call",
    "value": "0x0"
},
```

### `debug_traceTransaction`

Uses the [EVM's `callTracer`](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#call-tracer) to return a debug trace of a specific transaction given by its transaction hash.

#### Inputs

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| `hash`    | `H256`        | The 32 byte hash defining the L2 block.                      |
| `options` | `TracerConfig`| Optional arguments: see the [TraceConfig documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#traceconfig) for details. |

#### Example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "debug_traceTransaction", "params": [ "0x4b228f90e796de5a18227072745b0f28e0c4a4661a339f70d3bdde591d3b7f3a" ] }' \
"https://mainnet.era.zksync.io"
```

#### Output snippet

```json
...
{
    "calls": [],
    "error": null,
    "from": "0x0000000000000000000000000000000000008001",
    "gas": "0xdff51aa3",
    "gasUsed": "0x27e",
    "input": "0x6ef25c3a",
    "output": "0x000000000000000000000000000000000000000000000000000000000ee6b280",
    "revertReason": null,
    "to": "0x000000000000000000000000000000000000800b",
    "type": "Call",
    "value": "0x0"
},
...
```

### `zks_estimateFee`

Returns the fee for the transaction.

#### Inputs

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| `request` | `CallRequest` | The zkSync transaction request for which the fee is estimated.       |

#### Example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "zks_estimateFee", "params": [ { "from": "0x1111111111111111111111111111111111111111", "to":"0x2222222222222222222222222222222222222222", "data": "0xffffffff" } ] }' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "gas_limit": "0x156c00",
        "gas_per_pubdata_limit": "0x143b",
        "max_fee_per_gas": "0xee6b280",
        "max_priority_fee_per_gas": "0x0"
    },
    "id": 2
}
```

### `zks_estimateGasL1ToL2`

Returns an estimate of the gas required for a L1 to L2 transaction.

#### Inputs

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| `request` | `CallRequest` | The zkSync transaction request for which the gas fee is estimated.   |

#### curl example

```curl
curl -X POST  -H "Content-Type: application/json"  \
--data '{"jsonrpc":"2.0", "id":2, "method": "zks_estimateGasL1ToL2", "params": [ { "from": "0x1111111111111111111111111111111111111111", "to":"0x2222222222222222222222222222222222222222", "data": "0xffffffff" } ] }' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "0x25f64db",
    "id": 2
}
```

### `zks_getAllAccountBalances`

Returns all balances for confirmed tokens given by an account address.

#### Inputs

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| `address` | `Address`     | The account address.                                         |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getAllAccountBalances", "params": [ "0x98E9D288743839e96A8005a6B51C770Bbf7788C0" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "0x0000000000000000000000000000000000000000": "0x2fbd72a1121b3100"
    },
    "id": 2
}
```

### `zks_getBlockDetails`

Returns additional zkSync-specific information about the L2 block.

- `committed`: The batch is closed and the state transition it creates exists on layer 1.
- `proven`:  The batch proof has been created, submitted, and accepted on layer 1.
- `executed`: The batch state transition has been executed on L1; meaning the root state has been updated.

#### Inputs

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| block     | `uint32` | The number of the block. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getBlockDetails", "params": [ 140599 ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "baseSystemContractsHashes": {
            "bootloader": "0x010007793a328ef16cc7086708f7f3292ff9b5eed9e7e539c184228f461bf4ef",
            "default_aa": "0x0100067d861e2f5717a12c3e869cfb657793b86bbb0caa05cc1421f16c5217bc"
        },
        "commitTxHash": "0xd045e3698f018cb233c3817eb53a41a4c5b28784ffe659da246aa33bda34350c",
        "committedAt": "2023-03-26T07:21:21.046817Z",
        "executeTxHash": "0xbb66aa75f437bb4255cf751badfc6b142e8d4d3a4e531c7b2e737a22870ff19e",
        "executedAt": "2023-03-27T07:44:52.187764Z",
        "l1BatchNumber": 1617,
        "l1GasPrice": 20690385511,
        "l1TxCount": 0,
        "l2FairGasPrice": 250000000,
        "l2TxCount": 20,
        "number": 140599,
        "operatorAddress": "0xfeee860e7aae671124e9a4e61139f3a5085dfeee",
        "proveTxHash": "0x1591e9b16ff6eb029cc865614094b2e6dd872c8be40b15cc56164941ed723a1a",
        "provenAt": "2023-03-26T19:48:35.200565Z",
        "rootHash": "0xf1adac176fc939313eea4b72055db0622a10bbd9b7a83097286e84e471d2e7df",
        "status": "verified",
        "timestamp": 1679815038
    },
    "id": 1
}
```

### `zks_getBridgeContracts`

Returns L1/L2 addresses of default bridges.

#### Inputs

None.

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getBridgeContracts", "params": [  ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "l1Erc20DefaultBridge": "0x57891966931eb4bb6fb81430e6ce0a03aabde063",
        "l2Erc20DefaultBridge": "0x11f943b2c77b743ab90f4a0ae7d5a4e7fca3e102"
    },
    "id": 1
}
```

<!--
METHOD NOT YET LIVE 28/04/2023
### `zks_getBytecodeByHash`

Returns bytecode of a transaction given by its hash.

#### Inputs

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `hash`    | `H256  ` | Hash address as string.  |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getBytecodeByHash", "params": [ "0x8151d1d2aab91e44b4f8945854d5353ba63672c8f3e01fe2ec9cbf3cd0e1572e" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

:::warning
- Method not found.
:::

```json
{
    "jsonrpc": "2.0",
    "error": {
        "code": -32601,
        "message": "Method not found"
    },
    "id": 1
}
```
-->

### `zks_getConfirmedTokens`

Returns [address, symbol, name, and decimal] information of all tokens within a range of ids given by parameters `from` and `limit`. 

**Confirmed** in the method name means the method returns any token bridged to zkSync via the official bridge.

:::info
This method is mainly used by the zkSync team as it relates to a database query where the primary keys relate to the given ids.
:::

#### Inputs

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| `from`    | `uint32` | The token id from which to start returning the information about the tokens. |
| `limit`   | `uint8`  | The number of tokens to be returned from the API.                            |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getConfirmedTokens", "params": [ 1, 3 ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": [
        {
            "decimals": 18,
            "l1Address": "0xba100000625a3754423978a60c9317c58a424e3d",
            "l2Address": "0xaff169fca5086940c890c8a04c6db4b1db6e0dd6",
            "name": "Balancer",
            "symbol": "BAL"
        },
        {
            "decimals": 18,
            "l1Address": "0xffffffff2ba8f66d4e51811c5190992176930278",
            "l2Address": "0xc2b13bb90e33f1e191b8aa8f44ce11534d5698e3",
            "name": "Furucombo",
            "symbol": "COMBO"
        },
        {
            "decimals": 18,
            "l1Address": "0xa487bf43cf3b10dffc97a9a744cbb7036965d3b9",
            "l2Address": "0x140d5bc5b62d6cb492b1a475127f50d531023803",
            "name": "Deri",
            "symbol": "DERI"
        }
    ],
    "id": 1
}
```

### `zks_getL1BatchBlockRange`

Returns the range of blocks contained within a batch given by batch number. 

The range is given by beginning/end block numbers in hexadecimal. 

#### Inputs

| Parameter | Type            | Description                                                                  |
| --------- | --------------- | ---------------------------------------------------------------------------- |
| `batch`   | `L1BatchNumber` | The layer 1 batch number. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getL1BatchBlockRange", "params": [ 12345 ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": [
        "0x116fec",
        "0x117015"
    ],
    "id": 1
}
```

### `zks_getL1BatchDetails`

Returns data pertaining to a given batch.

#### Inputs

| Parameter | Type            | Description               |
| --------- | --------------- | ------------------------- |
| `batch`   | `L1BatchNumber` | The layer 1 batch number. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getL1BatchDetails", "params": [ 12345 ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "baseSystemContractsHashes": {
            "bootloader": "0x010007793a328ef16cc7086708f7f3292ff9b5eed9e7e539c184228f461bf4ef",
            "default_aa": "0x0100067d861e2f5717a12c3e869cfb657793b86bbb0caa05cc1421f16c5217bc"
        },
        "commitTxHash": "0xe5e76d1e17cff2b7232d40ddf43c245e29c76e5354571aa8083d73e793efb64a",
        "committedAt": "2023-04-09T18:05:40.548203Z",
        "executeTxHash": "0x19c125a6104f731bcc1ce378f090c808e97c6d634fc32cb786694a94fc8219a1",
        "executedAt": "2023-04-10T18:48:25.009708Z",
        "l1GasPrice": 29424338466,
        "l1TxCount": 9,
        "l2FairGasPrice": 250000000,
        "l2TxCount": 294,
        "number": 12345,
        "proveTxHash": "0xe980f58feed22a4dbc46fe0339bfcbc09f51c99b2f3bc4f9f60e710ea5f0a2da",
        "provenAt": "2023-04-09T22:51:16.200810Z",
        "rootHash": "0x994d2738f7ac89b45c8381a7816307b501c00b3127afc79e440dbf1b3e3b5a8c",
        "status": "verified",
        "timestamp": 1681063384
    },
    "id": 1
}
```

### `zks_getL2ToL1LogProof`

Given a transaction hash, and an index of the L2 to L1 log produced within the transaction, it returns the proof for the corresponding L2 to L1 log.

The index of the log that can be obtained from the transaction receipt (it includes a list of every log produced by the transaction).

#### Inputs

| Parameter          | Type                 | Description                                                      |
| ------------------ | ---------------------| ---------------------------------------------------------------- |
| tx_hash            | `bytes32`            | Hash of the L2 transaction the L2 to L1 log was produced within. |
| l2_to_l1_log_index | `number`             | The index of the L2 to L1 log in the transaction (optional).     |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getL2ToL1LogProof", "params": [ "0x2a1c6c74b184965c0cb015aae9ea134fd96215d2e4f4979cfec12563295f610e" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

If there was no such message, the returned value is `null`. Otherwise:

```json
{
    "jsonrpc": "2.0",
    "result": {
        "id": 0,
        "proof": [
            "0x8c48910df2ca7de509daf50b3182fcdf2dd6c422c6704054fd857d6c9516d6fc",
            "0xc5028885760b8b596c4fa11497c783752cb3a3fb3b8e6b52d7e54b9f1c63521e",
            "0xeb1f451eb8163723ee19940cf3a8f2a2afdf51100ce8ba25839bd94a057cda16",
            "0x7aabfd367dea2b5306b8071c246b99566dae551a1dbd40da791e66c4f696b236",
            "0xe4733f281f18ba3ea8775dd62d2fcd84011c8c938f16ea5790fd29a03bf8db89",
            "0x1798a1fd9c8fbb818c98cff190daa7cc10b6e5ac9716b4a2649f7c2ebcef2272",
            "0x66d7c5983afe44cf15ea8cf565b34c6c31ff0cb4dd744524f7842b942d08770d",
            "0xb04e5ee349086985f74b73971ce9dfe76bbed95c84906c5dffd96504e1e5396c",
            "0xac506ecb5465659b3a927143f6d724f91d8d9c4bdb2463aee111d9aa869874db"
        ],
        "root": "0x920c63cb0066a08da45f0a9bf934517141bd72d8e5a51421a94b517bf49a0d39"
    },
    "id": 1
}
```

The `id` is the position of the leaf in the Merkle tree of L2->L1 messages for the block. The `proof` is the Merkle proof for the message, while the `root ` is the root of the Merkle tree of L2->L1 messages. Please note, that the Merkle tree uses _sha256_ for the trees.

The `id` and `proof` can be used right away for interacting with the zkSync Era smart contract.

::: tip
- The list of L2 to L1 logs produced by the transaction, which is included in the receipts, is a combination of logs produced by the `L1Messenger` contract or other system contracts/bootloader.
- The bootloader produces a log for every L1-originated transaction that outputs if the transaction has succeeded.
:::

### `zks_getL2ToL1MsgProof`

Given a block, a sender, a message, and an optional message log index in the block containing the L1->L2 message, it returns the proof for the message sent via the L1Messenger system contract.

#### Inputs

| Parameter       | Type        | Description       |
| --------------- | ------------ | ---------------------------------------|
| block           | `uint32`    | The number of the block where the message was emitted.          |
| sender          | `address`   | The sender of the message (i.e. the account that called the L1Messenger system contract).  |
| msg             | `bytes32`   | The keccak256 hash of the sent message.    |
| l2_log_position | `uint256`   | The index in the block of the event that was emitted by the [L1Messenger]() when submitting this message. If it is omitted, the proof for the first message returns. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getL2ToL1MsgProof", "params": [ 5187, "0x87869cb87c4Fa78ca278dF358E890FF73B42a39E", "0x22de7debaa98758afdaee89f447ff43bab5da3de6acca7528b281cc2f1be2ee9" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

The same as in [zks_getL2ToL1LogProof](#zks-getl2tol1logproof).

::: warning
- `zks_getL2ToL1MsgProof` endpoint will be deprecated in favor of `zks_getL2ToL1LogProof`.
:::

### `zks_getMainContract`

Returns the address of the zkSync Era contract.

#### Inputs

None.

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getMainContract", "params": [  ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "0x32400084c286cf3e17e7b677ea9583e60a000324",
    "id": 1
}
```

### `zks_getRawBlockTransactions`

Returns data of transactions in a block.

#### Inputs

| Parameter         | Type                | Description   |
| ----------------- | --------------------| ------------- |
| `block`           | `uint32`            | Block number. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getRawBlockTransactions", "params": [ 5817 ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": [
        {
            "common_data": {
                "L1": {
                    "canonicalTxHash": "0x22de7debaa98758afdaee89f447ff43bab5da3de6acca7528b281cc2f1be2ee9",
                    "deadlineBlock": 0,
                    "ethBlock": 16751339,
                    "ethHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "fullFee": "0x0",
                    "gasLimit": "0x989680",
                    "gasPerPubdataLimit": "0x320",
                    "layer2TipFee": "0x0",
                    "maxFeePerGas": "0x0",
                    "opProcessingType": "Common",
                    "priorityQueueType": "Deque",
                    "refundRecipient": "0x87869cb87c4fa78ca278df358e890ff73b42a39e",
                    "sender": "0x87869cb87c4fa78ca278df358e890ff73b42a39e",
                    "serialId": 67,
                    "toMint": "0x0"
                }
            },
            "execute": {
                "calldata": "0x471c46c800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000031edd5a882583cbf3a712e98e100ef34ad6934b400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
                "contractAddress": "0xfc5b07a5dd1b80cf271d35642f75cc0500ff1e2c",
                "factoryDeps": [],
                "value": "0x0"
            },
            "received_timestamp_ms": 1677887544169
        }
    ],
    "id": 1
}
```

### `zks_getTestnetPaymaster`

Returns the address of the [testnet paymaster](): the paymaster that is available on testnets and enables paying fees in ERC-20 compatible tokens.

#### Inputs

None.

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getTestnetPaymaster", "params": [  ]}' \
"https://testnet.era.zksync.dev"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "0x8f0ea1312da29f17eabeb2f484fd3c112cccdd63",
    "id": 1
}
```

### `zks_getTokenPrice`

Returns the price of a given token in USD. 

:::tip Note
- The price used by the zkSync Era team may be a bit different to the current market price. 
- On testnets, token prices are often different from the actual market price.
:::

#### Inputs

| Parameter | Type      | Description              |
| --------- | ------    | ------------------------ |
| address   | `address` | The address of the token. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getTokenPrice", "params": [ "0x0000000000000000000000000000000000000000" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "1908.42",
    "id": 1
}
```

### `zks_getTransactionDetails`

Returns data from a specific transaction given by the transaction hash.

#### Inputs

| Parameter         | Type                | Description   |
| ----------------- | --------------------| ------------- |
| `hash`            | `H256`              | Transaction hash as string. |

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_getTransactionDetails", "params": [ "0x22de7debaa98758afdaee89f447ff43bab5da3de6acca7528b281cc2f1be2ee9" ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": {
        "ethCommitTxHash": "0x3da5b6eda357189c9243c41c5a33b1b2ed0169be172705d74681a25217702772",
        "ethExecuteTxHash": "0xdaff5fd7ff91333b161de54534b4bb6a78e5325329959a0863bf0aae2b0fdcc6",
        "ethProveTxHash": "0x2f482d3ea163f5be0c2aca7819d0beb80415be1a310e845a2d726fbc4ac54c80",
        "fee": "0x0",
        "initiatorAddress": "0x87869cb87c4fa78ca278df358e890ff73b42a39e",
        "isL1Originated": true,
        "receivedAt": "2023-03-03T23:52:24.169Z",
        "status": "verified"
    },
    "id": 1
}
```

### `zks_L1BatchNumber`

Returns the latest L1 batch number.

#### Inputs

None.

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_L1BatchNumber", "params": [  ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "0x544c",
    "id": 1
}
```

### `zks_L1ChainId`

Returns the chain id of the underlying L1.

#### Inputs

None.

#### curl example

```curl
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "zks_L1ChainId", "params": [  ]}' \
"https://mainnet.era.zksync.io"
```

#### Output

```json
{
    "jsonrpc": "2.0",
    "result": "0x1",
    "id": 1
}
```

## PubSub API

zkSync is fully compatible with [Geth's pubsub API](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub), except for the `syncing` subscription. This is because nodes on the zkSync network are technically always synchronized.

The WebSocket URL is `wss://testnet.era.zksync.dev/ws`.

::: tip
- Use the websocket endpoint to handle smart contract events, as detailed [in this section of the docs]().
:::