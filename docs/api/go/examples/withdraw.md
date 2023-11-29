---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Withdraw Example | zkSync Era Docs
---

# Withdrawal

When it comes to withdrawals there are several notes that needs to be taken into account:

- Withdrawal flow consist of two steps:
  - Executing withdrawal transaction on L2 which initiates submission to L1.
  - Executing finalize withdrawal after the withdrawal transaction is submitted to L1.
- The duration for [submitting a withdrawal transaction to L1](../../../reference/troubleshooting/withdrawal-delay.md)
  can last up to 24 hours.
- On the testnet, withdrawals are [automatically finalized](../../../reference/concepts/bridging-asset.md#withdrawals-to-l1).
  There is no need to execute finalize withdrawal step, otherwise, an error with code `jj` would occur.

## Withdraw ETH

This is an example of how to withdraw ETH from zkSync Era network (L2) to Ethereum network (L1):

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		EthereumProvider  = "https://rpc.ankr.com/eth_sepolia"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Connect to Ethereum network
	ethClient, err := ethclient.Dial(EthereumProvider)
	if err != nil {
		log.Panic(err)
	}
	defer ethClient.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, ethClient)
	if err != nil {
		log.Fatal(err)
	}

	// Perform withdrawal
	tx, err := wallet.Withdraw(nil, accounts.WithdrawalTransaction{
		To:     wallet.Address(),
		Amount: big.NewInt(1_000_000_000),
		Token:  utils.EthAddress,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Withdraw transaction: ", tx.Hash())

	// Wait until transaction is finalized
	_, err = client.WaitFinalized(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Perform finalize withdrawal
	finalizeWithdrawTx, err := wallet.FinalizeWithdraw(nil, tx.Hash(), 0)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Finalize withdraw transaction: ", finalizeWithdrawTx.Hash())
}
```

## Withdraw tokens

This is an example of how to withdraw tokens from zkSync Era network (L2) to Ethereum network (L1):

```go
package main

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		EthereumProvider  = "https://rpc.ankr.com/eth_sepolia"
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Connect to Ethereum network
	ethClient, err := ethclient.Dial(EthereumProvider)
	if err != nil {
		log.Panic(err)
	}
	defer ethClient.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, ethClient)
	if err != nil {
		log.Panic(err)
	}

	// Perform withdrawal
	tx, err := wallet.Withdraw(nil, accounts.WithdrawalTransaction{
		To:     wallet.Address(),
		Amount: big.NewInt(1_000_000_000),
		Token:  utils.EthAddress,
	})
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Withdraw transaction: ", tx.Hash())
}

```

## Finalize withdrawal

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"log"
	"os"
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://sepolia.era.zksync.dev"
		EthereumProvider  = "https://rpc.ankr.com/eth_sepolia"
		WithdrawTx        = common.HexToHash("<Withdraw tx hash>")
	)

	// Connect to zkSync network
	client, err := clients.Dial(ZkSyncEraProvider)
	if err != nil {
		log.Panic(err)
	}
	defer client.Close()

	// Connect to Ethereum network
	ethClient, err := ethclient.Dial(EthereumProvider)
	if err != nil {
		log.Panic(err)
	}
	defer ethClient.Close()

	// Create wallet
	wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, ethClient)
	if err != nil {
		log.Panic(err)
	}

	// Check if the withdrawal is finalized
	if isFinalized, errFinalized := wallet.IsWithdrawFinalized(nil, WithdrawTx, 0); errFinalized != nil {
		log.Panic(errFinalized)
	} else if !isFinalized {
		// Perform the finalize withdrawal
		finalizeWithdrawTx, errWithdraw := wallet.FinalizeWithdraw(nil, WithdrawTx, 0)
		if errWithdraw != nil {
			log.Panic(errWithdraw)
		}
		fmt.Println("Finalize withdraw transaction: ", finalizeWithdrawTx.Hash())

		// Wait for finalize withdraw transaction to be finalized on L1 network
		fmt.Println("Waiting for finalize withdraw transaction to be finalized on L1 network")
		_, err = bind.WaitMined(context.Background(), ethClient, finalizeWithdrawTx)
		if err != nil {
			log.Panic(err)
		}
	}

}

```
