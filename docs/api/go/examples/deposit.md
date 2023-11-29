---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Deposit Example | zkSync Era Docs
---

# Deposit

## Deposit ETH

This is an example of how to deposit ETH from Ethereum network (L1) to zkSync Era network (L2):

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

	// Show balance before deposit
	balance, err := wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance before deposit: ", balance)

	// Perform deposit
	tx, err := wallet.Deposit(nil, accounts.DepositTransaction{
		Token:  utils.EthAddress,
		Amount: big.NewInt(1_000_000_000),
		To:     wallet.Address(),
	})
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("L1 transaction: ", tx.Hash())

	// Wait for deposit transaction to be finalized on L1 network
	fmt.Println("Waiting for deposit transaction to be finalized on L1 network")
	_, err = bind.WaitMined(context.Background(), ethClient, tx)
	if err != nil {
		log.Panic(err)
	}

	// Get transaction receipt for deposit transaction on L1 network
	l1Receipt, err := ethClient.TransactionReceipt(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}
	// Get deposit transaction on L2 network
	l2Tx, err := client.L2TransactionFromPriorityOp(context.Background(), l1Receipt)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("L2 transaction", l2Tx.Hash)

	// Wait for deposit transaction to be finalized on L2 network (5-7 minutes)
	fmt.Println("Waiting for deposit transaction to be finalized on L2 network (5-7 minutes)")
	_, err = client.WaitMined(context.Background(), l2Tx.Hash)
	if err != nil {
		log.Panic(err)
	}

	balance, err = wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance after deposit: ", balance)
}
```

## Deposit tokens

This is an example of how to deposit tokens from Ethereum network (L1) to zkSync Era network (L2):

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
	"github.com/zksync-sdk/zksync2-go/contracts/erc20"
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
		TokenL1Address    = common.HexToAddress("0xc8F8cE6491227a6a2Ab92e67a64011a4Eba1C6CF")
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

	// Get token contract on Ethereum network
	tokenL1, err := erc20.NewIERC20(TokenL1Address, ethClient)
	if err != nil {
		log.Panic(err)
	}

	// Show balances before deposit
	balance, err := wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	tokenBalance, err := tokenL1.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Balance before deposit on L1 network: ", balance)
	fmt.Println("Token balance before deposit on L1 network: ", tokenBalance)

	tx, err := wallet.Deposit(nil, accounts.DepositTransaction{
		Token:           TokenL1Address,
		Amount:          big.NewInt(5),
		To:              wallet.Address(),
		ApproveERC20:    true,
		RefundRecipient: wallet.Address(),
	})
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("L1 deposit transaction: ", tx.Hash())

	// Wait for deposit transaction to be finalized on L1 network
	fmt.Println("Waiting for deposit transaction to be finalized on L1 network")
	_, err = bind.WaitMined(context.Background(), ethClient, tx)
	if err != nil {
		log.Panic(err)
	}

	// Get transaction receipt for deposit transaction on L1 network
	l1Receipt, err := ethClient.TransactionReceipt(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Get deposit transaction hash on L2 network
	l2Tx, err := client.L2TransactionFromPriorityOp(context.Background(), l1Receipt)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("L2 transaction", l2Tx.Hash)

	// Wait for deposit transaction to be finalized on L2 network (5-7 minutes)
	fmt.Println("Waiting for deposit transaction to be finalized on L2 network (5-7 minutes)")
	_, err = client.WaitMined(context.Background(), l2Tx.Hash)
	if err != nil {
		log.Panic(err)
	}

	balance, err = wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		log.Panic(err)
	}
	tokenBalance, err = tokenL1.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Balance after deposit on L1 network: ", balance)
	fmt.Println("Token balance after deposit on L1 network: ", tokenBalance)

	tokenL2Address, err := client.L2TokenAddress(context.Background(), TokenL1Address)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Token L2 address: ", tokenL2Address)

	tokenL2Balance, err := wallet.Balance(context.Background(), tokenL2Address, nil)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Token balance on L2 network: ", tokenL2Balance)
}

```

## Claim failed deposit

If the deposit L2 transaction has failed, execute the following script in order to withdraw funds to depositor:

```go
package main

import (
	"fmt"
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
		DepositL2Tx       = common.HexToHash("<Failed Deposit L2 tx hash>")
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

	claimTx, err := wallet.ClaimFailedDeposit(nil, DepositL2Tx)
	if err != nil {
		fmt.Println(err) // this should be triggered if deposit was successful
	}
	fmt.Println("ClaimFailedDeposit hash: ", claimTx.Hash())

}
```
