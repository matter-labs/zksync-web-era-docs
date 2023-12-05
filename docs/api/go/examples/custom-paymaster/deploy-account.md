---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Deploy Paymaster Example | zkSync Era Docs
---

# Deploy paymaster

Deploy the paymaster account, which will receive the token deployed in the [previous](deploy-token.md) step and pay the fee in ETH for the account that
sends the token. The token address on testnet that is deployed in previous step is `0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B`

## Deploy paymaster with CREATE opcode

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
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		TokenAddress   = "0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B" // Crown token which can be minted for free
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

	_, paymasterAbi, bytecode, err := utils.ReadStandardJson("../solidity/custom_paymaster/paymaster/build/Paymaster.json")
	if err != nil {
		log.Panic(err)
	}

	constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}

	// Deploy paymaster contract
	hash, err := wallet.DeployAccountWithCreate(nil, accounts.CreateTransaction{
		Bytecode: bytecode,
		Calldata: constructor,
	})
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	receipt, err := client.TransactionReceipt(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}
	contractAddress := receipt.ContractAddress
	fmt.Println("Paymaster address", contractAddress.String())
}

```

## Deploy paymaster with CREATE2 opcode

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
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		TokenAddress      = "0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B" // Crown token which can be minted for free
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

	// Read paymaster contract from standard json
	_, paymasterAbi, bytecode, err := utils.ReadStandardJson("./delete-me/solidity/custom_paymaster/paymaster/build/Paymaster.json")
	if err != nil {
		log.Panic(err)
	}

	// Encode paymaster constructor
	constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}

	// Deploy paymaster contract
	hash, err := wallet.DeployAccount(nil, accounts.Create2Transaction{Bytecode: bytecode, Calldata: constructor})
	if err != nil {
		log.Panic(err)
	}
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.Create2Address(wallet.Address(), bytecode, constructor, nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Paymaster address: ", contractAddress.String())
}

```
