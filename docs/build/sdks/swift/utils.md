---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Utilities | zkSync Docs
---

# Utilities

:::info

- This document describes common functions and constants you may need.
- Functions used internally are not necessarily described.
- Check the code for the full list.
  :::

## Web3Utils extension

#### Address modulo

Used for applying and undoing alias.

```swift
static let ADDRESS_MODULO = BigUInt(2).power(160)
```

#### L1 to L2 alias offset

Used for applying and undoing aliases on addresses during bridging from L1 to L2.

```swift
static let L1_TO_L2_ALIAS_OFFSET = "0x1111000000000000000000000000000000001111"
```

#### L1 fee estimation numerator

Used to when scaling gas limit for l1 transactions

#### IERC20

For interacting with native tokens.

```swift
let IERC20 = Web3Utils.IERC20
```

#### zkSync Era main contract

```swift
let iZkSync = Web3.Utils.IZkSync
```

#### L1 messenger

Used for sending messages from zkSync Era to Ethereum.

```swift
let IL1Messenger = Web3.Utils.IL1Messenger
```

#### L1 and L2 bridges

Bridge interface ABIs for L1 and L2.

```swift
let IL1Bridge = Web3.Utils.IL1Bridge
let IL2Bridge = Web3.Utils.IL2Bridge
```

### `applyL1ToL2Alias`

Converts the address that submitted a transaction to the inbox on L1 to the `msg.sender` viewed on L2.

Returns the `msg.sender` of the L1->L2 transaction as the `address` of the contract that initiated the transaction.

:::tip More info

1. During a normal transaction, if contract A calls contract B, the `msg.sender` is A.
2. During L1->L2 communication, if an EOA X calls contract B, the `msg.sender` is X.
3. During L1->L2 communication, if a contract A calls contract B, the `msg.sender` is `applyL1ToL2Alias(A)`.
   :::

#### Inputs

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `address` | String | Contract address. |

#### Example

```swift
print(Web3Utils.applyL1ToL2Alias(address: "0x702942B8205E5dEdCD3374E5f4419843adA76Eeb"))
// l2ContractAddress = "0x813A42B8205E5DedCd3374e5f4419843ADa77FFC"
```

### 'scaleGasLimit'

#### Inputs

| Parameter | Type    | Description   |
| --------- | ------- | ------------- |
| `gas`     | BigUInt | Gas to scale. |

#### Example

```swift
BigUInt = BigUInt(100_000)
BigUInt gasLimit = Web3Utils.scaleGasLimit(gas: baseLimit)
```

### `TransactionType`

#### EIP712 transaction type

Constant representing an EIP712 transaction type.

```swift
case eip712 = 0x71
```

#### EIP712 structures

Collection of EIP712 structures with their types.

```swift
public func eip712types() -> [EIP712.`Type`] {
        return [
            ("txType", EIP712.UInt256(type.rawValue)),
            ("from", BigUInt(from!.addressData)),
            ("to", BigUInt(to.addressData)),
            ("gasLimit", gasLimit),
            ("gasPerPubdataByteLimit", eip712Meta?.gasPerPubdata as Any),
            ("maxFeePerGas", maxFeePerGas as Any),
            ("maxPriorityFeePerGas", maxPriorityFeePerGas as Any),
            ("paymaster", BigUInt(eip712Meta?.paymasterParams?.paymaster?.addressData ?? Data())),
            ("nonce", nonce),
            ("value", value as Any),
            ("data", data),
            ("factoryDeps", eip712Meta?.factoryDeps ?? []),
            ("paymasterInput", eip712Meta?.paymasterParams?.paymasterInput ?? Data())
        ]
    }
```

### `ZkSyncAddresses`

#### ETH token layer 1

```swift
public static let EthAddress = "0x0000000000000000000000000000000000000000"
```

#### Contract deployer

```swift
public static let ContractDeployerAddress = "0x0000000000000000000000000000000000008006"
```

#### L1 messenger

```swift
public static let MessengerAddress = "0x0000000000000000000000000000000000008008"
```

#### Nonce holder

```swift
public static let NonceHolderAddress = "0x0000000000000000000000000000000000008003"
```

### `EthereumAddress` extension

#### ETH token alias on ZkSync Era

```swift
static let L2EthTokenAddress = EthereumAddress("0x000000000000000000000000000000000000800a")!
```

#### ETH token layer 1

```swift
static let Default = EthereumAddress("0x0000000000000000000000000000000000000000")!
```

### `computeL2Create2Address`

Generates a future-proof contract address using salt plus bytecode which allows determination of an address before deployment.

:::warning

- The zkSync Era implementation is slightly different from Ethereum.
  :::

#### Inputs

| Parameter     | Type              | Description                        |
| ------------- | ----------------- | ---------------------------------- |
| `sender`      | `EthereumAddress` | Sender address.                    |
| `bytecode`    | `Data`            | Output from zkSolc.                |
| `constructor` | `Data`            | ABI encoded constructor arguments. |
| `salt`        | `Data`            | Randomization element.             |

#### Example

```swift
let result = ContractDeployer.computeL2Create2Address(EthereumAddress("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049")!,
                                                      bytecode: Data(hex: "0x010001cb6a6e8d5f6829522f19fa9568660e0a9cd53b2e8be4deb0a679452e41"),
                                                      constructor: Data(),
                                                      salt: Data())
```

### `computeL2CreateAddress`

Generates a contract address from deployer's account and nonce.

#### Inputs

| Parameter | Type              | Description     |
| --------- | ----------------- | --------------- |
| `sender`  | `EthereumAddress` | Sender address. |
| `nonce`   | `BigUInt`         | Sender nonce.   |

#### Example

```swift
let result = ContractDeployer.computeL2CreateAddress(EthereumAddress("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049")!, nonce: BigUInt(1))
```

### `estimateDefaultBridgeDepositL2Gas`

Returns an estimation of L2 gas required for token bridging via the default ERC20 bridge.

#### Inputs

| Parameter           | Type              | Description                                               |
| ------------------- | ----------------- | --------------------------------------------------------- |
| `providerL1`        | `Web3`            | Ethers provider.                                          |
| `providerL2`        | `ZkSyncClient`    | ZkSync provider.                                          |
| `token`             | `EthereumAddress` | Token address.                                            |
| `amount`            | `BigUInt`         | Deposit amount.                                           |
| `to`                | `Address`         | Recipient address.                                        |
| `from`              | `EthereumAddress` | Sender address.                                           |
| `gasPerPubdataByte` | `BigNumberish`    | Current gas per byte of pubdata, deffault 800 (optional). |

### `getERC20DefaultBridgeData`

Returns the calldata sent by an L1 ERC20 bridge to its L2 counterpart during token-bridging.

#### Inputs

| Parameter        | Type     | Description          |
| ---------------- | -------- | -------------------- |
| `l1TokenAddress` | `String` | Token address on L1. |
| `provider`       | `Web3`   | Provider.            |

### `verifySignature`

Returns: `true` on verification success.

#### Inputs

| Parameter   | Type     | Description                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| `signature` | `String` | Signature of the EIP-712 structures.                                                |
| `message`   | `Data`   | Message to verify.                                                                  |
| `prefixed`  | `Bool`   | If `true` then add secure prefix [EIP-712](https://eips.ethereum.org/EIPS/eip-712). |

### `verifyTypedData`

Returns: `true` on verification success.

#### Inputs

| Parameter   | Type           | Description                                    |
| ----------- | -------------- | ---------------------------------------------- |
| `domain`    | `EIP712Domain` | EIP712 domain.                                 |
| `typedData` | `S`            | Object implementing EIP712 structure standard. |
| `signature` | `String`       | Signature of the EIP-712 structures.           |
