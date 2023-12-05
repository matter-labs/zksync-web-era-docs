---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Transfer Example | zkSync Era Docs
---

# Transfer

## Transfer ETH

Here is an example on how to transfer ETH on zkSync Era network.

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
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey1       = os.Getenv("PRIVATE_KEY")
		PublicKey2        = "81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9"
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey1), &client, nil)
	if err != nil {
		log.Panic(err)
	}

	// Show balances before transfer for both accounts
	account1Balance, err := wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	account2Balance, err := client.BalanceAt(context.Background(), common.HexToAddress(PublicKey2), nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account1 balance before transfer: ", account1Balance)
	fmt.Println("Account2 balance before transfer: ", account2Balance)

	// Perform transfer
	tx, err := wallet.Transfer(nil, accounts.TransferTransaction{
		To:     common.HexToAddress(PublicKey2),
		Amount: big.NewInt(1_000_000_000),
		Token:  utils.EthAddress,
	})
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Transaction: ", tx.Hash())

	// Wait for transaction to be finalized on L2 network
	_, err = client.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Show balances after transfer for both accounts
	account1Balance, err = wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	account2Balance, err = client.BalanceAt(context.Background(), common.HexToAddress(PublicKey2), nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account1 balance after transfer: ", account1Balance)
	fmt.Println("Account2 balance after transfer: ", account2Balance)
}
```

## Transfer tokens

Here is an example on how to transfer tokens on zkSync Era network.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/contracts/erc20"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey1       = os.Getenv("PRIVATE_KEY")
		PublicKey2        = "0x81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9"
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		TokenL2Address    = common.HexToAddress("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey1), &client, nil)
	if err != nil {
		log.Panic(err)
	}

	// Get token contract on zkSync network
	token, err := erc20.NewIERC20(TokenL2Address, client)
	if err != nil {
		log.Panic(err)
	}

	account1TokenBalance, err := token.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}
	account2TokenBalance, err := token.BalanceOf(nil, common.HexToAddress(PublicKey2))
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Account 1 token balance before transfer: ", account1TokenBalance)
	fmt.Println("Account 2 token balance before transfer: ", account2TokenBalance)

	// Perform transfer
	tx, err := wallet.Transfer(nil, accounts.TransferTransaction{
		To:     common.HexToAddress(PublicKey2),
		Amount: big.NewInt(1),
		Token:  TokenL2Address,
	})
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Transaction: ", tx.Hash())

	// Wait for transaction to be finalized on L2 network
	_, err = client.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	account1TokenBalance, err = token.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}
	account2TokenBalance, err = token.BalanceOf(nil, common.HexToAddress(PublicKey2))
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Account 1 token balance after transfer: ", account1TokenBalance)
	fmt.Println("Account 2 token balance after transfer: ", account2TokenBalance)

}

```
