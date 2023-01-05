# Web3 API

zkSync 2.0 fully supports the standard [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) and adds some L2-specific features.

As long as the code does not involve deploying new smart contracts (they can only be deployed using EIP712 transactions, more on that [below](#eip712)), _no changes to the codebase are needed._

It is possible to continue using the SDK that is currently in use. Users will continue paying fees in ETH, and the UX will be identical to the one on Ethereum.

However, zkSync has its specifics, which this section describes.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## EIP712

To specify additional fields, like the custom signature for custom accounts or to choose the paymaster, EIP712 transactions should be used. These transactions have the same fields as standard Ethereum transactions, but they also have fields that contain additional L2-specific data (`paymaster`, etc).

```json
"ergsPerPubdata": "1212",
"customSignature": "0x...",
"paymasterParams": {
  "paymaster": "0x...",
  "paymasterInput": "0x..."
},
"factory_deps": ["0x..."]
```

- `ergsPerPubdata`: is a field that describes the maximal amount of ergs the user is willing to pay for a single byte of pubdata.
- `customSignature` is a field with a custom signature, in case the signer's account is not EOA.
- `paymasterParams` is a field with parameters for configuring the custom paymaster for the transaction. The address of the paymaster and the encoded input to call it are in the paymaster parameters.
- `factory_deps` is a field that should be a non-empty array of `bytes`. For deployment transactions it should contain the bytecode of the contract being deployed. If the contract being deployed is a factory contract, i.e. it can deploy other contracts, the array should also contain the bytecodes of the contracts which can be deployed by it.

To let the server recognize EIP712 transactions, the `transaction_type` field is equal to `113` (unfortunately the number `712` can not be used as the `transaction_type` since the type has to be one byte long).

Instead of signing the RLP-encoded transaction, the user signs the following typed EIP712 structure:

| Field name              | Type        |
| ----------------------- | ----------- |
| txType                  | `uint256`   |
| from                    | `uint256`   |
| to                      | `uint256`   |
| ergsLimit               | `uint256`   |
| ergsPerPubdataByteLimit | `uint256`   |
| maxFeePerErg            | `uint256 `  |
| maxPriorityFeePerErg    | `uint256`   |
| paymaster               | `uint256`   |
| nonce                   | `uint256`   |
| value                   | `uint256`   |
| data                    | `bytes`     |
| factoryDeps             | `bytes32[]` |
| paymasterInput          | `bytes`     |

These fields are conveniently handled by our [SDK](./js/features.md).

## zkSync-specific JSON-RPC methods

All zkSync-specific methods are located in the `zks_` namespace. The API may also provide methods other than those provided here. These methods are to be used internally by the team and are very unstable.

::: warning

Please note that Metamask does not support zks\_ namespace's methods, we are working to support it in the future, alternatively, you can use the `Provider` class with the testnet RPC instead of relying on Metamask's injected provider.

:::

<!-- ### `zks_estimateFee`

Returns the fee for the transaction. The token in which the fee is calculated is returned based on the `fee_token` in the transaction provided.

#### Input parameters

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| req       | `CallRequest` | The zkSync transaction for which the fee should be estimated |

#### Output format

```json
{
  "ergs_limit": 100000000,
  "ergs_price_limit": 10000,
  "fee_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "ergs_per_storage_limit": 100,
  "ergs_per_pubdata_limit": 10
}
``` -->

### `zks_getMainContract`

Returns the address of the zkSync contract.

### Input parameters

None.

### Output format

`"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"`

### `zks_L1ChainId`

Returns the chain id of the underlying L1.

### Input parameters

None.

### Output format

`12`

### `zks_getConfirmedTokens`

Given `from` and `limit` return information about the confirmed tokens with IDs in the interval `[from..from+limit-1]`. "Confirmed" is the wrong word here, since a confirmed token has already been bridged through the default zkSync bridge.

The tokens are returned in alphabetical order by their symbols, so a token's id is just its place in an array of tokens that has been sorted by symbols.

### Input parameters

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| from      | `uint32` | The token id from which to start returning the information about the tokens. |
| limit     | `uint8`  | The number of tokens to be returned from the API.                            |

### Output format

```json
[
  {
    "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "decimals": 18,
    "name": "ETH",
    "symbol": "ETH"
  },
  {
    "address": "0xd2255612f9b045e9c81244bb874abb413ca139a3",
    "decimals": 18,
    "name": "TrueUSD",
    "symbol": "TUSD"
  },
  {
    "address": "0xd35cceead182dcee0f148ebac9447da2c4d449c4",
    "decimals": 6,
    "name": "USD Coin (goerli)",
    "symbol": "USDC"
  }
]
```

### `zks_getL2ToL1LogProof`

Given a transaction hash, and an index of the L2 to L1 log produced within the transaction, it returns the proof for the corresponding L2 to L1 log.

The index of the log that can be obtained from the transaction receipt (it includes a list of every log produced by the transaction).

### Input parameters

| Parameter          | Type                        | Description                                                      |
| ------------------ | --------------------------- | ---------------------------------------------------------------- |
| tx_hash            | `bytes32`                   | Hash of the L2 transaction the L2 to L1 log was produced within. |
| l2_to_l1_log_index | `undefined` &#124; `number` | The Index of the L2 to L1 log in the transaction.                |

### Output format

If there was no such message, the returned value is `null`.

Otherwise, the object of the following format is returned:

```json
{
  "id": 0,
  "proof": [
    "0x66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925",
    "0x2eeb74a6177f588d80c0c752b99556902ddf9682d0b906f5aa2adbaf8466a4e9",
    "0x1223349a40d2ee10bd1bebb5889ef8018c8bc13359ed94b387810af96c6e4268",
    "0x5b82b695a7ac2668e188b75f7d4fa79faa504117d1fdfcbe8a46915c1a8a5191"
  ],
  "root": "0x6a420705824f0a3a7e541994bc15e14e6a8991cd4e4b2d35c66f6e7647760d97"
}
```

The `id` is the position of the leaf in the Merkle tree of L2->L1 messages for the block. The `proof` is the Merkle proof for the message, while the `root ` is the root of the Merkle tree of L2->L1 messages. Please note, that the Merkle tree uses _sha256_ for the trees.

You do not need to care about the intrinsics, since the returned `id` and `proof` can be used right away for interacting with the zkSync smart contract.

A nice example of using this endpoint via our SDK can be found [here](../dev/developer-guides/bridging/l2-l1.md).

::: tip

The list of L2 to L1 logs produced by the transaction, which is included in the receipts, is a combination of logs produced by L1Messenger contract or other system contracts/bootloader.

There is a log produced by the bootloader for every L1 originated transaction that shows if the transaction has succeeded.

:::

### `zks_getL2ToL1MsgProof`

Given a block, a sender, a message, and an optional message log index in the block containing the L1->L2 message, it returns the proof for the message sent via the L1Messenger system contract.

### Input parameters

| Parameter       | Type                    | Description                                                                                                                                                                                                                                                        |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| block           | `uint32`                | The number of the block where the message was emitted.                                                                                                                                                                                                             |
| sender          | `address`               | The sender of the message (i.e. the account that called the L1Messenger system contract).                                                                                                                                                                          |
| msg             | `bytes32`               | The keccak256 hash of the sent message.                                                                                                                                                                                                                            |
| l2_log_position | `uint256` &#124; `null` | The index in the block of the event that was emitted by the [L1Messenger](../dev/developer-guides/contracts/system-contracts.md#il1messenger) when submitting this message. If it is ommitted, the proof for the first message with such content will be returned. |

### Output format

The same as in [zks_getL2ToL1LogProof](#output-format-4).

::: warning

`zks_getL2ToL1MsgProof` endpoint will be deprecated because proofs for L2 to L1 messages can also be fetched from `zks_getL2ToL1LogProof`.

:::

### `zks_getBridgeContracts`

Returns L1/L2 addresses of default bridges.

### Input parameters

None.

### Output format

```json
{
  "l1Erc20DefaultBridge": "0x7786255495348c08f82c09c82352019fade3bf29",
  "l1EthDefaultBridge": "0xcbebcd41ceabbc85da9bb67527f58d69ad4dfff5",
  "l2Erc20DefaultBridge": "0x92131f10c54f9b251a5deaf3c05815f7659bbe02",
  "l2EthDefaultBridge": "0x2c5d8a991f399089f728f1ae40bd0b11acd0fb62"
}
```

### `zks_getTestnetPaymaster`

Returns the address of the [testnet paymaster](../dev/developer-guides/aa.md#testnet-paymaster): the paymaster that is available on testnets and enables paying fees in ERC-20 compatible tokens.

### Input parameters

None.

### Output format

```json
"0x7786255495348c08f82c09c82352019fade3bf29"
```

### `zks_getBlockDetails`

Returns additional ZkSync-specific information about the L2 block.

### Input parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| block     | `uint32` | The number of the block. |

### Output format

```json
{
  "commitTxHash": "0x2c8f18312c6b6c2e72df56dd5684e3c65fcdf5f6141763eafdcbbfc02c3a39b5",
  "committedAt": "2022-12-12T08:41:50.774441Z",
  "executeTxHash": "0xa12f3a9689101758acad280dd21a00cfc2644c125702ea301f46a33799cde9b9",
  "executedAt": "2022-12-12T08:41:57.233941Z",
  "l1TxCount": 5,
  "l2TxCount": 0,
  "number": 1,
  "proveTxHash": "0x0fed6d8a7b02a26b5513edea10d8849342b56a13c0e48317556c78b34aeacd26",
  "provenAt": "2022-12-12T08:41:57.219584Z",
  "rootHash": "0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f",
  "status": "verified",
  "timestamp": 1670834504
}
```

<!-- TODO: uncomment once fixed --->
<!-- ### `zks_getTokenPrice`

Given a token address, returns its price in USD. Please note that that this is the price that is used by the zkSync team and can be a bit different from the current market price. On testnets, token prices can be very different from the actual market price.

### Input parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| address   | `address` | The address of the token. |

### Output format

`3500.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000` -->

<!--

#[rpc(name = "zks_getConfirmedTokens", returns = "Vec<Token>")]
fn get_confirmed_tokens(&self, from: u32, limit: u8) -> BoxFutureResult<Vec<Token>>;

#[rpc(name = "zks_isTokenLiquid", returns = "bool")]
fn is_token_liquid(&self, token_address: Address) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getTokenPrice", returns = "BigDecimal")]
fn get_token_price(&self, token_address: Address) -> BoxFutureResult<BigDecimal>;

#[rpc(name = "zks_setContractDebugInfo", returns = "bool")]
fn set_contract_debug_info(
    &self,
    contract_address: Address,
    info: ContractSourceDebugInfo,
) -> BoxFutureResult<bool>;

#[rpc(name = "zks_getContractDebugInfo", returns = "ContractSourceDebugInfo")]
fn get_contract_debug_info(
    &self,
    contract_address: Address,
) -> BoxFutureResult<Option<ContractSourceDebugInfo>>;

#[rpc(name = "zks_getTransactionTrace", returns = "Option<VmDebugTrace>")]
fn get_transaction_trace(&self, hash: H256) -> BoxFutureResult<Option<VmDebugTrace>>;





Documented:
#[rpc(name = "zks_estimateFee", returns = "Fee")]
fn estimate_fee(&self, req: CallRequest) -> BoxFutureResult<Fee>;

#[rpc(name = "zks_getMainContract", returns = "Address")]
fn get_main_contract(&self) -> BoxFutureResult<Address>;

#[rpc(name = "zks_L1ChainId", returns = "U64")]
fn l1_chain_id(&self) -> Result<U64>;

#[rpc(name = "zks_getL1WithdrawalTx", returns = "Option<H256>")]
fn get_eth_withdrawal_tx(&self, withdrawal_hash: H256) -> BoxFutureResult<Option<H256>>;



Don't want to document (at least for now):

### `zks_getAccountTransactions`

### Input parameters

| Parameter | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| address   | `Address` | The address of the account                            |
| before    | `u32`     | The offset from which to start returning transactions |
| limit     | `u8`      | The maximum number of transactions to be returned     |





-->

## PubSub API


zkSync is fully compatible with [Geth's pubsub API](https://geth.ethereum.org/docs/rpc/pubsub), except for the `syncing` subscription. This is because nodes on the zkSync network are technically always synchronized.

The WebSocket URL is `wss://zksync2-testnet.zksync.dev/ws`.

::: tip

You can use the websocket endpoint to handle smart contract events, as detailed [in this section of the docs](../dev/developer-guides/building-on-zksync/events.md).

:::
