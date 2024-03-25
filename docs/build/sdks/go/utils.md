---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Utils | zkSync Docs
---

# Utils

Provides essential utilities for building on zkSync Era.

## Constants

#### L1 to L2 alias offset

Used for applying and undoing aliases on contract addresses during bridging from L1 to L2.

```go
L1ToL2AliasOffset := common.HexToAddress("0x1111000000000000000000000000000000001111")
```

### Useful addresses

#### ETH token on L1

```go
EthAddress := common.HexToAddress("0x0000000000000000000000000000000000000000")
```

#### ETH token alias on ZkSync Era

```go
L2EthTokenAddress := common.HexToAddress("0x000000000000000000000000000000000000800a")
```

#### Bootloader

```go
BootloaderFormalAddress := common.HexToAddress("0x0000000000000000000000000000000000008001")
```

#### Contract deployer

```go
ContractDeployerAddress := common.HexToAddress("0x0000000000000000000000000000000000008006")
```

#### L1 messenger

```go
L1MessengerAddress := common.HexToAddress("0x0000000000000000000000000000000000008008")
```

#### Nonce holder

```go
NonceHolderAddress := common.HexToAddress("0x0000000000000000000000000000000000008003")
```

### Gas

#### `DefaultGasPerPubdataLimit`

- Use a large amount of gas per pubdata for signing on layer 2.
- The amount ensures any reasonable limit is accepted.

:::info
The operator is NOT required to use the actual value and can use any value up to that signed by the user.
:::

```go
DefaultGasPerPubdataLimit := big.NewInt(50_000)
```

#### `RequiredL1ToL2GasPerPubdataLimit`

The current required gas per pubdata for L1->L2 transactions.

```go
RequiredL1ToL2GasPerPubdataLimit := big.NewInt(800)
```

## Functions

### `ApplyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

#### Inputs

| Parameter | Type             | Description       |
| --------- | ---------------- | ----------------- |
| `address` | `common.Address` | Contract address. |

#### Outputs

Returns the `msg.sender` of the L1->L2 transaction as the `common.Address` of the contract that initiated the transaction.

:::tip More info

1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `ApplyL1ToL2Alias(A)`.
   :::

```go
func ApplyL1ToL2Alias(address common.Address) common.Address
```

See also [`UndoL1ToL2Alias`](#undol1tol2alias).

### `Create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment.

:::warning
The zkSync Era implementation is slightly different from Ethereum.
:::

#### Inputs

| Parameter     | Type             | Description                        |
| ------------- | ---------------- | ---------------------------------- |
| `sender`      | `common.Address` | Sender address.                    |
| `bytecode`    | `[]byte`         | Output from zkSolc.                |
| `constructor` | `[]byte`         | ABI encoded constructor arguments. |
| `salt`        | `[]byte`         | Randomization element.             |

#### Outputs

Returns a `common.Address` of the future contract.

```go
func Create2Address(sender common.Address, bytecode, constructor, salt []byte) (common.Address, error)
```

:::tip
The `prefix` is equal to `keccak256("zksyncCreate2")`.
:::

### `CreateAddress`

Generates a contract address from deployer's account and nonce.

#### Inputs

| Parameter | Type              | Description     |
| --------- | ----------------- | --------------- |
| `sender`  | `common.Address`  | Sender address. |
| `nonce`   | `*big.Int` object | Sender nonce.   |

#### Outputs

Returns a `common.Address` of the future contract.

```go
func CreateAddress(sender common.Address, nonce *big.Int) (common.Address, error)
```

:::tip
The `prefix` is equal to `keccak256("zksyncCreate")`.
:::

### `CreateETH`

Creates ETH token with appropriate Name, Symbol and Decimals values.

```go
func CreateETH() *types.Token
```

### `EncodeCreate`

Returns the encoded constructor data for CREATE method used for smart contract deployment.

#### Inputs

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `bytecode` | `[]byte` | Output from zkSolc.                |
| `calldata` | `[]byte` | ABI encoded constructor arguments. |

```go
func EncodeCreate(bytecode, calldata []byte) ([]byte, error)
```

### `EncodeCreate2`

Returns the encoded constructor data for CREATE2 method used for smart contract deployment.

#### Inputs

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `bytecode` | `[]byte` | Output from zkSolc.                |
| `calldata` | `[]byte` | ABI encoded constructor arguments. |
| `salt`     | `[]byte` | Randomization element.             |

```go
func EncodeCreate2(bytecode, calldata, salt []byte) ([]byte, error)
```

### `EncodeCreateAccount`

Returns the encoded constructor data for CREATE method used for smart account deployment.

#### Inputs

| Parameter  | Type                                                                          | Description                        |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `bytecode` | `[]byte`                                                                      | Output from zkSolc.                |
| `calldata` | `[]byte`                                                                      | ABI encoded constructor arguments. |
| `version`  | [`types.AccountAbstractionVersion`](types/types.md#accountabstractionversion) | Account abstraction version.       |

```go
 EncodeCreate2Account(bytecode, calldata, version types.AccountAbstractionVersion) ([]byte, error)
```

### `EncodeCreate2Account`

Returns the encoded constructor data for CREATE2 method used for smart account deployment.

#### Inputs

| Parameter  | Type                                                                          | Description                        |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `bytecode` | `[]byte`                                                                      | Output from zkSolc.                |
| `calldata` | `[]byte`                                                                      | ABI encoded constructor arguments. |
| `salt`     | `[]byte`                                                                      | Randomization element.             |
| `version`  | [`types.AccountAbstractionVersion`](types/types.md#accountabstractionversion) | Account abstraction version.       |

```go
 EncodeCreate2Account(bytecode, calldata, salt []byte, version types.AccountAbstractionVersion) ([]byte, error)
```

### `Erc20BridgeCalldata`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter        | Type             | Description                                 |
| ---------------- | ---------------- | ------------------------------------------- |
| `l1TokenAddress` | `common.Address` | Token address on L1.                        |
| `l1Sender`       | `common.Address` | Sender address on L1.                       |
| `l2Receiver`     | `common.Address` | Recipient address on L2.                    |
| `amount`         | `*big.Int`       | Gas fee for the number of tokens to bridge. |
| `bridgeData`     | `*big.Int`       | Data                                        |

```go
func Erc20BridgeCalldata(l1TokenAddress, l1Sender, l2Receiver common.Address, amount *big.Int, bridgeData []byte)
```

### `Erc20DefaultBridgeData`

Returns the data needed for correct initialization of an L1 token counterpart on L2.

#### Inputs

| Parameter        | Type                   | Description                                                       |
| ---------------- | ---------------------- | ----------------------------------------------------------------- |
| `l1TokenAddress` | `common.Address`       | Token address on L1.                                              |
| `backend`        | `bind.ContractBackend` | Client that is able to work with contracts on a read-write basis. |

#### Outputs

An ABI-encoded `[]byte` which contains token name, symbol and decimals.

```go
func Erc20DefaultBridgeData(l1TokenAddress common.Address, backend bind.ContractBackend) ([]byte, error)
```

### `HashBytecode`

Returns the hash of given bytecode.

#### Inputs

| Parameter  | Type     | Description |
| ---------- | -------- | ----------- |
| `bytecode` | `[]byte` | Bytecode.   |

```go
func HashBytecode(bytecode []byte) ([]byte, error)
```

### `ReadStandardJson`

Reads standard-json file generated as output from zksolc. Returns standard json configuration and extracted contracts abi and bytecode from
config file.

#### Inputs

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `path`    | `string` | Path to the standard-json file. |

```go
func ReadStandardJson(path string) (*types.StandardConfiguration, abi.ABI, []byte, error)
```

### `UndoL1ToL2Alias`

Converts and returns the `msg.sender` viewed on L2 to the address that submitted a transaction to the inbox on L1.

#### Inputs

| Parameter | Type             | Description     |
| --------- | ---------------- | --------------- |
| `address` | `common.Address` | Sender address. |

#### Outputs

Returns the `msg.sender` of the L2->L1 transaction as the `common.Address` of the contract that initiated the transaction.

```go
func UndoL1ToL2Alias(address common.Address) common.Address
```

See also [`ApplyL1ToL2Alias`](#applyl1tol2alias).
