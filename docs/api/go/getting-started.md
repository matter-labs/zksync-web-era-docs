# Getting started

In this guide we will demonstrate how to:

1. Connect to the zkSync network.
2. Get all confirmed tokens on zkSync.
3. Deposit assets from Ethereum into zkSync.
4. Check balances.
5. Transfer assets.
6. Withdraw assets from zkSync into Ethereum.
7. Deploy a smart contract.
8. Deploy a smart contract with constructor and interact with the contract.
9. Deploy a smart contract with dependency.

## Prerequisites

- Go: >=1.17 ([installation guide](https://go.dev/dl/))

## Adding dependencies

To install zkSync Era, run the command below in your terminal.

```console
 go get github.com/zksync-sdk/zksync2-go
```

## Connecting to zkSync

Once you have all the necessary dependencies, connect to zkSync using the endpoint of the operator node.

```go
ZkSyncProvider := "https://testnet.era.zksync.dev"

// Connect to zkSync network
zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
if err != nil {
	log.Panic(err)
}
defer zp.Close()
```

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/go). Examples are configured to interact with `zkSync` and `Goerli` test networks.  

### Get all confirmed tokens on zkSync

Following example shows how to get all confirmed ERC20 tokens on zkSync network. 

```go
package main

import (
	"fmt"
	"github.com/zksync-sdk/zksync2-go"
	"log"
)

func main() {
	zp, err := zksync2.NewDefaultProvider("https://testnet.era.zksync.dev")
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

  // get first 255 tokens
	tokens, err := zp.ZksGetConfirmedTokens(0, 255)
	if err != nil {
		log.Panic(err)
	}

	for _, token := range tokens {
		fmt.Printf("%+v\n", *token)
	}
}
```

### Deposit funds

This is an example of how to deposit assets from Ethereum network (L1) to zkSync Era network (L2):

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
		EthereumProvider = "https://rpc.ankr.com/eth_goerli"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Connect to Ethereum network
	ethRpc, err := rpc.Dial(EthereumProvider)
	if err != nil {
		log.Panic(err)
	}
	ep, err := w.CreateEthereumProvider(ethRpc)
	if err != nil {
		log.Panic(err)
	}

	// Show balance before deposit
	balance, err := w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance before deposit: ", balance)

	// Perform deposit
	tx, err := ep.Deposit(
		zksync2.CreateETH(),
		big.NewInt(1000),
		w.GetAddress(),
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("L1 transaction: ", tx.Hash())

	// Wait for deposit transaction to be finalized on L1 network
	fmt.Println("Waiting for deposit transaction to be finalized on L1 network")
	_, err = ep.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Get transaction receipt for deposit transaction on L1 network
	l1Receipt, err := ep.GetClient().TransactionReceipt(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Get deposit transaction hash on L2 network
	l2Hash, err := ep.GetL2HashFromPriorityOp(l1Receipt)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("L2 transaction", l2Hash)

	// Wait for deposit transaction to be finalized on L2 network (5-7 minutes)
	fmt.Println("Waiting for deposit transaction to be finalized on L2 network (5-7 minutes)")
	_, err = zp.WaitMined(context.Background(), l2Hash)
	if err != nil {
		log.Panic(err)
	}

	balance, err = w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance after deposit: ", balance)
}

```

### Check balance

Here is an example of how to check a balance on zkSync Era.
```go
func main() {
	var (
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

        // Get balance
	balance, err := w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance is: ", balance)
}
```

### Transfer

Here is an example on how to transfer funds on zkSync network.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey1    = os.Getenv("PRIVATE_KEY")
		PublicKey2     = "81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9"
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey1), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Show balances before transfer for both accounts
	account1Balance, err := w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	account2Balance, err := zp.BalanceAt(context.Background(), common.HexToAddress(PublicKey2), nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account1 balance before transfer: ", account1Balance)
	fmt.Println("Account2 balance before transfer: ", account2Balance)

	// Perform transfer
	hash, err := w.Transfer(
		common.HexToAddress(PublicKey2),
		big.NewInt(1000000000),
		nil,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait for transaction to be finalized on L2 network
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Show balances after transfer for both accounts
	account1Balance, err = w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	account2Balance, err = zp.BalanceAt(context.Background(), common.HexToAddress(PublicKey2), nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account1 balance after transfer: ", account1Balance)
	fmt.Println("Account2 balance after transfer: ", account2Balance)
}

```

### Withdraw funds (Native coins)

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
		EthereumProvider = "https://rpc.ankr.com/eth_goerli"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Connect to Ethereum network
	ethRpc, err := rpc.Dial(EthereumProvider)
	if err != nil {
		log.Panic(err)
	}
	_, err = w.CreateEthereumProvider(ethRpc)
	if err != nil {
		log.Panic(err)
	}

	// Perform withdraw
	wHash, err := w.Withdraw(
		w.GetAddress(),
		big.NewInt(1000000000),
		nil,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Withdraw transaction: ", wHash)

	// Wait until transaction is finalized
	_, err = w.GetProvider().WaitFinalized(context.Background(), wHash)
	if err != nil {
		panic(err)
	}

	// Perform finalize withdraw
	fwHash, err := w.FinalizeWithdraw(wHash, 0)
	if err != nil {
		panic(err)
	}
	fmt.Println("Finalize withdraw transaction", fwHash)
}

```

### Smart contract deployment

With zkSync, you can deploy a contract using the create method, by simply building the contract into a binary format and deploying it to the zkSync network.


- [Storage](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/storage/Storage.sol): Contract without constructor.
- [Incrementer](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/incrementer/Incrementer.sol): Contract with constructor.
- [Demo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Demo.sol): Contract that has a dependency on 
[Foo](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/demo/Foo.sol) contract.

There is a [user guide](https://github.com/zksync-sdk/zksync2-examples/blob/main/solidity/README.md) on how to compile Solidity smart contracts using `zksolc` 
compiler. `zksolc` compiler generates a `*.zbin` and a `combined.json` file that contains the bytecode and ABI of a smart contract. 
The `combined.json` file is used by `abigen` tool to generate smart contrat bindings. 
Those files are used in the following examples. 


#### Deploy a contract

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-examples/contracts/storage"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("../solidity/storage/build/Storage.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Deploy smart contract
	hash, err := w.Deploy(bytecode, nil, nil, nil, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := zksync2.ComputeL2Create2Address(
		w.GetAddress(),
		bytecode,
		nil,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Storage smart contract
	storageContract, err := storage.NewStorage(contractAddress, zp.Client)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method from storage smart contract
	value, err := storageContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value:", value)

	// Read the private key
	privateKey, err := crypto.ToECDSA(common.Hex2Bytes(PrivateKey))
	if err != nil {
		log.Panic(err)
	}

	// Start configuring transaction parameters
	opts, err := bind.NewKeyedTransactorWithChainID(privateKey, w.GetEthSigner().GetDomain().ChainId)
	if err != nil {
		log.Panic(err)
	}
	// GasTipCap is required to be set, otherwise following error occurs: Method not found !!!
	opts.GasTipCap = big.NewInt(300)

	// Execute Set method from storage smart contract with configured transaction parameters
	tx, err := storageContract.Set(opts, big.NewInt(200))
	if err != nil {
		log.Panic(err)
	}
	// Wait for transaction to be finalized
	_, err = zp.WaitMined(context.Background(), tx.Hash())
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

#### Deploy a contract with constructor and interact with it

In some cases, you need to get the contract address before deploying it. Use
`zksync2.ComputeL2Create2Address()` to get precomputed smart contract address.

```go
package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-examples/contracts/incrementer"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("./solidity/incrementer/build/Incrementer.zbin")
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

	// Use salt if there is need to deploy same contract twice, otherwise remove salt
	salt := make([]byte, 32)
	_, err = rand.Read(salt)
	if err != nil {
		log.Panicf("error while generating salt: %s", err)
	}

	// Deploy smart contract
	hash, err := w.Deploy(bytecode, constructor, salt, nil, nil)
	if err != nil {
		panic(err)
		// When contract is deployed twice without salt the following error occurs:
		// panic: failed to EstimateGas: failed to query eth_estimateGas: execution reverted: Code hash is non-zero
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := zksync2.ComputeL2Create2Address(
		w.GetAddress(),
		bytecode,
		constructor,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address: ", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Incrementer contract
	incrementerContract, err := incrementer.NewIncrementer(contractAddress, zp.Client)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method again to check if state is changed
	value, err := incrementerContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value after Increment method execution: ", value)

	// Read the private key
	privateKey, err := crypto.ToECDSA(common.Hex2Bytes(PrivateKey))
	if err != nil {
		log.Panic(err)
	}

	// Start configuring transaction parameters
	opts, err := bind.NewKeyedTransactorWithChainID(privateKey, w.GetEthSigner().GetDomain().ChainId)
	if err != nil {
		log.Panic(err)
	}
	// GasTipCap is required to be set, otherwise following error occurs: Method not found !!!
	opts.GasTipCap = big.NewInt(300)

	// Execute Set method from storage smart contract with configured transaction parameters
	tx, err := incrementerContract.Increment(opts)
	if err != nil {
		log.Panic(err)
	}
	// Wait for transaction to be finalized
	_, err = zp.WaitMined(context.Background(), tx.Hash())
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

#### Deploy a contract with dependency

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-examples/contracts/demo"
	"github.com/zksync-sdk/zksync2-go"
	"log"
	"os"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := zksync2.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := zksync2.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := zksync2.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read bytecode of Demo contract
	demoBytecode, err := os.ReadFile("./solidity/demo/build/Demo.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Read bytecode of Foo contract
	fooBytecode, err := os.ReadFile("./solidity/demo/build/Foo.zbin")
	if err != nil {
		log.Panic(err)
	}

	// Deploy smart contract
	hash, err := w.Deploy(demoBytecode, nil, nil, [][]byte{fooBytecode}, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := zksync2.ComputeL2Create2Address(
		w.GetAddress(),
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
	demoContract, err := demo.NewDemo(contractAddress, zp.Client)
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
