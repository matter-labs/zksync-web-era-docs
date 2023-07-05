# Getting started

In this guide we will demonstrate how to:

1. Deposit ETH from Ethereum into zkSync.
2. Transfer ETH on zkSync. 
3. Withdraw ETH from zkSync to Ethereum.
4. Deposit token from Ethereum into zkSync.
5. Transfer token on zkSync.
6. Withdraw token from zkSync to Ethereum.
7. Deploy a smart contract using create opcode.
8. Deploy a smart contract with constructor using create opcode.
9. Deploy a smart contract with dependency using create opcode.
10. Deploy a smart contract using create2 opcode.
11. Deploy a smart contract with constructor using create2 opcode.
12. Deploy a smart contract with dependency using create2 opcode.
13. Get confirmed tokens on zkSync.
14. Deploy custom token on zkSync.
15. Deploy smart account using create opcode.
16. Deploy smart account using create2 opcode.
17. Use paymaster to pay fee with token.

## Prerequisites

- IOS: >=13.0
- MacOS: >=11.0

## CocoaPods Integration

To install zkSync Era via CocoaPods, add zkSync2 pod to the Podfile:

```
 pod 'ZkSync2'
```

## Swift Package Manager Integration

To install zkSync Era via Swift Package Manager, add zkSync2 to the Package Dependencies:

```
 'github.com/zksync-sdk/zksync2-swift'
```

## Connecting to zkSync

Once you have integrated zkSync2 dependencies, connect to zkSync using the endpoint of the operator node.

```swift
let zkSync: ZkSync = ZkSyncImpl(URL(string: "https://testnet.era.zksync.dev")!)
```

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/swift). Examples are configured to interact with `zkSync` and `Goerli` test networks.  

### Check balance

Here is an example of how to check a balance on zkSync Era.
```swift

```

### Get all confirmed tokens on zkSync

Following example shows how to get all confirmed tokens on zkSync Era. 

```swift

```

### Deposit ETH

This is an example of how to deposit ETH from Ethereum network (L1) to zkSync Era network (L2):

```swift

```

### Transfer ETH

Here is an example on how to transfer ETH on zkSync network.

```swift

```

### Withdraw ETH

This is an example of how to withdraw ETH from zkSync Era network (L2) to Ethereum network (L1):

```swift

```

### Deposit tokens

This is an example of how to deposit tokens from Ethereum network (L1) to zkSync Era network (L2):

```swift

```

### Transfer tokens

Here is an example on how to transfer ETH on zkSync network.

```swift

```

### Withdraw tokens

This is an example of how to withdraw tokens from zkSync Era network (L2) to Ethereum network (L1):

```swift

```

### Smart contract and smart account deployment

With zkSync, you can deploy a contract using the create and create2 opcode, by simply building the contract into a binary format and deploying it to the zkSync network.


- [Storage](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/storage/Storage.sol): Contract without constructor.
- [Incrementer](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/incrementer/Incrementer.sol): Contract with constructor.
- [Demo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Demo.sol): Contract that has a dependency on 
[Foo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Foo.sol) contract.
- [Token](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/token/Token.sol): custom ERC20 token.
- [Paymaster](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/custom_paymaster/paymaster/Paymaster.sol): custom paymaster which provides payment of transaction fees in ERC20 tokens. 

There is a [user guide](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/README.md) on how to compile Solidity smart contracts using `zksolc` 
compiler. `zksolc` compiler generates a `*.zbin` and a `combined.json` file that contains the bytecode and ABI of a smart contract. 
The `combined.json` file is used by `abigen` tool to generate smart contrat bindings. 
Those files are used in the following examples. 

In some cases, you need to get the contract address before deploying it. Use
 - `utils.ComputeL2CreateAddress()` to get precomputed smart contract address when deploying with create opcode, 
 - `utils.ComputeL2Create2Address()` to get precomputed smart contract address when deploying with create2 opcode.


#### Deploy a contract with create opcode

```swift

```

#### Deploy a contract with a constructor using create opcode

```swift

```

#### Deploy a contract with dependency using create opcode

```swift

```

#### Deploy a smart account using create opcode

```swift

```

#### Deploy a contract using create2 opcode

```swift

```

#### Deploy a contract with a constructor using create2 opcode

```swift

```

#### Deploy a contract with dependency using create2 opcode

```swift

```

#### Deploy a smart account using crate2 opcode

```swift

```

### Use paymaster

This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.

```swift

```
