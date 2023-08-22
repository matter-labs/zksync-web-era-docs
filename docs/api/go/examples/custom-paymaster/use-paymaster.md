---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK use paymaster example | zkSync Era Docs
---

# Use paymaster

This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.

The token address used in this example is already [deployed](deploy-token.md) at: `0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B`.
The paymaster address used in this example is already [deployed](deploy-account.md) at: `0xd660c2F92d3d0634e5A20f26821C43F1b09298fe`.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/types"
	"github.com/zksync-sdk/zksync2-go/utils"
	"log"
	"math/big"
	"os"
	"zksync2-examples/contracts/crown"
)

func main() {
	var (
		PrivateKey        = os.Getenv("PRIVATE_KEY")
		ZkSyncEraProvider = "https://testnet.era.zksync.dev"
		TokenAddress      = common.HexToAddress("0xCd9BDa1d0FC539043D4C80103bdF4f9cb108931B") // Crown token which can be minted for free
		PaymasterAddress  = common.HexToAddress("0xd660c2F92d3d0634e5A20f26821C43F1b09298fe") // Paymaster for Crown token
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
		log.Panic(err)
	}

	// Get token contract
	token, err := crown.NewCrown(TokenAddress, client)
	if err != nil {
		log.Panic(token)
	}

	// Transfer some ETH to paymaster, so it can pay fee with ETH
	transferTx, err := wallet.Transfer(nil, accounts.TransferTransaction{
		To:     PaymasterAddress,
		Amount: big.NewInt(2_000_000_000_000_000_000),
		Token:  utils.EthAddress,
	})
	if err != nil {
		return
	}

	_, err = client.WaitMined(context.Background(), transferTx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Also mint some tokens to user account, so it can offer to pay fee with it
	opts, err := bind.NewKeyedTransactorWithChainID(wallet.Signer().PrivateKey(), wallet.Signer().Domain().ChainId)
	if err != nil {
		log.Panic(err)
	}
	tx, err := token.Mint(opts, wallet.Address(), big.NewInt(10))
	if err != nil {
		log.Panic(err)
	}
	_, err = client.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Read token and ETH balances from user and paymaster accounts
	balance, err := wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		return
	}
	fmt.Println("Account balance before mint: ", balance)

	tokenBalance, err := token.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account token balance before mint: ", tokenBalance)

	balance, err = client.BalanceAt(context.Background(), PaymasterAddress, nil)
	if err != nil {
		return
	}
	fmt.Println("Paymaster balance before mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, TokenAddress)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Paymaster token balance before mint: ", tokenBalance)

	abi, err := crown.CrownMetaData.GetAbi()
	if err != nil {
		log.Panic(err)
	}

	// Encode mint function from token contract
	calldata, err := abi.Pack("mint", wallet.Address(), big.NewInt(7))
	if err != nil {
		log.Panic(err)
	}

	// Create paymaster parameters with encoded paymaster input
	paymasterParams, err := utils.GetPaymasterParams(
		PaymasterAddress,
		&types.ApprovalBasedPaymasterInput{
			Token:            TokenAddress,
			MinimalAllowance: big.NewInt(1),
			InnerInput:       []byte{},
		})
	if err != nil {
		log.Panic(err)
	}

	// In order to use paymaster, EIP712 transaction
	// need to be created with configured paymaster parameters
	hash, err := wallet.SendTransaction(context.Background(), &accounts.Transaction{
		To:   &TokenAddress,
		Data: calldata,
		Meta: &types.Eip712Meta{
			PaymasterParams: paymasterParams,
		},
	})
	if err != nil {
		log.Panic(err)
	}

	_, err = client.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Tx: ", hash)

	balance, err = wallet.Balance(context.Background(), utils.EthAddress, nil)
	if err != nil {
		return
	}
	fmt.Println("Account balance after mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, wallet.Address())
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account token balance after mint: ", tokenBalance)

	balance, err = client.BalanceAt(context.Background(), PaymasterAddress, nil)
	if err != nil {
		return
	}
	fmt.Println("Paymaster balance after mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, TokenAddress)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Paymaster token balance after mint: ", tokenBalance)

}

```
