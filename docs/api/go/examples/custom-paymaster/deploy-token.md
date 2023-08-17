# Deploy token

Deploy the token which will be used to pay transaction fee.

## Deploy token with CREATE opcode

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
	"zksync2-examples/contracts/crown"
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

	_, tokenAbi, bytecode, err := utils.ReadStandardJson("../solidity/custom_paymaster/token/build/Token.json")
	if err != nil {
		log.Panic(err)
	}

	constructor, err := tokenAbi.Pack("", "Crown", "Crown", uint8(18))
	if err != nil {
		log.Panic(err)
	}

	//Deploy smart contract
	hash, err := wallet.DeployWithCreate(nil, accounts.CreateTransaction{Bytecode: bytecode, Calldata: constructor})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	tx, err := client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	tokenAddress := tx.ContractAddress

	if err != nil {
		panic(err)
	}
	fmt.Println("Token address", tokenAddress.String())

	// Create instance of token contract
	token, err := crown.NewCrown(tokenAddress, client)
	if err != nil {
		log.Panic(err)
	}

	symbol, err := token.Symbol(nil)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Symbol: ", symbol)

	decimals, err := token.Decimals(nil)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Decimals: ", decimals)
}

```

## Deploy token with CREATE2 opcode

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
	"zksync2-examples/contracts/crown"
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

	// Read token contract from standard json
	_, tokenAbi, bytecode, err := utils.ReadStandardJson("../solidity/custom_paymaster/token/build/Token.json")
	if err != nil {
		log.Panic(err)
	}

	constructor, err := tokenAbi.Pack("", "Crown", "Crown", uint8(18))
	if err != nil {
		log.Panic(err)
	}

	//Deploy smart contract
	hash, err := wallet.Deploy(nil, accounts.Create2Transaction{Bytecode: bytecode, Calldata: constructor})
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
	tokenAddress, err := utils.Create2Address(
		wallet.Address(),
		bytecode,
		constructor,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Token address", tokenAddress.String())

	// Create instance of token contract
	token, err := crown.NewCrown(tokenAddress, client)
	if err != nil {
		log.Panic(err)
	}

	symbol, err := token.Symbol(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Symbol: ", symbol)

	decimals, err := token.Decimals(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Decimals: ", decimals)

	opts, err := bind.NewKeyedTransactorWithChainID(wallet.Signer().PrivateKey(), wallet.Signer().Domain().ChainId)
	if err != nil {
		log.Panic(err)
	}
	mint, err := token.Mint(opts, wallet.Address(), big.NewInt(5))
	if err != nil {
		log.Panic(err)
	}

	// Wait for transaction to be finalized
	_, err = client.WaitMined(context.Background(), mint.Hash())
	if err != nil {
		log.Panic(err)
	}
}

```
