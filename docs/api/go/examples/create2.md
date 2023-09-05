---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Create2 Example | zkSync Era Docs
---

# Deploy contract with CREATE2 opcode

With zkSync Era contract can be deployed using the CREATE2 by simply building the contract into a binary format and deploying it to the
zkSync Era network.

- [Storage](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/storage/Storage.sol): Contract without constructor.
- [Incrementer](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/incrementer/Incrementer.sol): Contract with constructor.
- [Demo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Demo.sol): Contract that has a dependency on
  [Foo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Foo.sol) contract.

There is a [user guide](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/README.md) on how to compile Solidity smart contracts using `zksolc`
compiler. `zksolc` compiler generates a `*.zbin` and a `combined.json` file that contains the bytecode and ABI of a smart contract.
The `combined.json` file is used by `abigen` tool to generate smart contract bindings.
Those files are used in the following examples.

## Deploy contract

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"math/big"
	"os"
	"zksync2-examples/contracts/storage"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("../solidity/storage/build/Storage.zbin")
	if err != nil {
		log.Panic(err)
	}

	//Deploy smart contract
	hash, err := wallet.Deploy(nil, accounts.Create2Transaction{Bytecode: bytecode})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.Create2Address(
		wallet.Address(),
		bytecode,
		nil,
		nil,
	)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Smart contract address", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Storage smart contract
	storageContract, err := storage.NewStorage(contractAddress, client)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method from storage smart contract
	value, err := storageContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value:", value)

	// Start configuring transaction parameters
	opts, err := bind.NewKeyedTransactorWithChainID(wallet.Signer().PrivateKey(), wallet.Signer().Domain().ChainId)
	if err != nil {
		log.Panic(err)
	}

	// Execute Set method from storage smart contract with configured transaction parameters
	tx, err := storageContract.Set(opts, big.NewInt(200))
	if err != nil {
		log.Panic(err)
	}
	// Wait for transaction to be finalized
	_, err = client.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method again to check if state is changed
	value, err = storageContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value after Set method execution: ", value)
}

```

## Deploy contract with constructor

```go
package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"math/big"
	"os"
	"zksync2-examples/contracts/incrementer"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("../solidity/incrementer/build/Incrementer.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Get ABI
	abi, err := incrementer.IncrementerMetaData.GetAbi()
	if err != nil {
		log.Panic(err)
	}

	// Encode constructor arguments
	constructor, err := abi.Pack("", big.NewInt(2))
	if err != nil {
		log.Panicf("error while encoding constructor arguments: %s", err)
	}

	// Generate salt
	salt := make([]byte, 32)
	_, err = rand.Read(salt)
	if err != nil {
		log.Panicf("error while generating salt: %s", err)
	}

	// Deploy smart contract
	hash, err := wallet.Deploy(nil, accounts.Create2Transaction{
		Bytecode: bytecode,
		Calldata: constructor,
		Salt:     salt,
	})
	if err != nil {
		panic(err)
		// When contract is deployed twice without salt the following error occurs:
		// panic: failed to EstimateGas712: failed to query eth_estimateGas: execution reverted: Code hash is non-zero
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.Create2Address(
		wallet.Address(),
		bytecode,
		constructor,
		salt,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address: ", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Incrementer contract
	incrementerContract, err := incrementer.NewIncrementer(contractAddress, client)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method
	value, err := incrementerContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value before Increment method execution: ", value)

	// Start configuring transaction parameters
	opts, err := bind.NewKeyedTransactorWithChainID(wallet.Signer().PrivateKey(), wallet.Signer().Domain().ChainId)
	if err != nil {
		log.Panic(err)
	}

	// Execute Set method from storage smart contract with configured transaction parameters
	tx, err := incrementerContract.Increment(opts)
	if err != nil {
		log.Panic(err)
	}
	// Wait for transaction to be finalized
	_, err = client.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method again to check if state is changed
	value, err = incrementerContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value after Increment method execution: ", value)
}

```

## Deploy contract with dependencies

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"os"
	"zksync2-examples/contracts/demo"
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Read bytecode of Demo contract
	demoBytecode, err := os.ReadFile("../solidity/demo/build/Demo.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Read bytecode of Foo contract
	fooBytecode, err := os.ReadFile("../solidity/demo/build/Foo.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Deploy smart contract
	hash, err := wallet.Deploy(nil, accounts.Create2Transaction{
		Bytecode:     demoBytecode,
		Dependencies: [][]byte{fooBytecode},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.Create2Address(
		wallet.Address(),
		demoBytecode,
		nil,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address: ", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Demo contract
	demoContract, err := demo.NewDemo(contractAddress, client)
	if err != nil {
		log.Panic(err)
	}

	// Execute GetFooName method
	value, err := demoContract.GetFooName(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value:", value)
}

```
