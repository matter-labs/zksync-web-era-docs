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
zp, err := clients.NewDefaultProvider(ZkSyncProvider)
if err != nil {
	log.Panic(err)
}
defer zp.Close()
```

## Examples

Full code for all examples is available [here](https://github.com/zksync-sdk/zksync2-examples/tree/main/go). Examples are configured to interact with `zkSync` and `Goerli` test networks.

### Check balance

Here is an example of how to check a balance on zkSync Era.

```go
import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey    = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Show balances before transfer for both accounts
	balance, err := w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Balance is: ", balance)
}
```

### Get all confirmed tokens on zkSync

Following example shows how to get all confirmed tokens on zkSync Era.

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

### Deposit ETH

This is an example of how to deposit ETH from Ethereum network (L1) to zkSync Era network (L2):

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

### Transfer ETH

Here is an example on how to transfer ETH on zkSync network.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
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
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey1), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
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
		big.NewInt(1_000_000_000),
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

### Withdraw ETH

This is an example of how to withdraw ETH from zkSync Era network (L2) to Ethereum network (L1):

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
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
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
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
		big.NewInt(1_000_000_000),
		nil,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Withdraw transaction: ", wHash)

	// Wait until transaction is finalized
	_, err = zp.WaitFinalized(context.Background(), wHash)
	if err != nil {
		panic(err)
	}

	// Perform finalize withdraw
	fwHash, err := w.FinalizeWithdraw(wHash, 0)
	if err != nil {
		panic(err)
	}
	fmt.Println("Finalize withdraw transaction: ", fwHash)
}

```

### Deposit tokens

This is an example of how to deposit tokens from Ethereum network (L1) to zkSync Era network (L2):

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/contracts/erc20"
	"github.com/zksync-sdk/zksync2-go/types"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
		EthereumProvider = "https://rpc.ankr.com/eth_goerli"
		TokenL1Address   = common.HexToAddress("c8F8cE6491227a6a2Ab92e67a64011a4Eba1C6CF")
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
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

	// Get token contract on Ethereum network
	tokenL1, err := erc20.NewIERC20(TokenL1Address, ep.GetClient())
	if err != nil {
		log.Panic(err)
	}

	// Show balances before deposit
	balance, err := w.GetBalance()
	if err != nil {
		log.Panic(err)
	}
	tokenBalance, err := tokenL1.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Balance before deposit on L1 network: ", balance)
	fmt.Println("Token balance before deposit on L1 network: ", tokenBalance)

	depositAmount := big.NewInt(5)

	// Bridging ERC20 tokens from Ethereum requires approving the tokens to the zkSync Ethereum smart contract
	tx, err := ep.ApproveDeposit(&types.Token{L1Address: TokenL1Address}, depositAmount, nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("L1 approve deposit transaction: ", tx.Hash())

	fmt.Println("Waiting for approve deposit transaction to be finalized on L1 network")
	_, err = ep.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Perform deposit
	tx, err = ep.Deposit(
		&types.Token{L1Address: TokenL1Address},
		depositAmount,
		w.GetAddress(),
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("L1 deposit transaction: ", tx.Hash())

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
	tokenBalance, err = tokenL1.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Balance after deposit on L1 network: ", balance)
	fmt.Println("Token balance after deposit on L1 network: ", tokenBalance)

	tokenL2Address, err := zp.L2TokenAddress(TokenL1Address)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Token L2 address: ", tokenL2Address)
	// Get token contract on zkSync network
	tokenL2, err := erc20.NewIERC20(tokenL2Address, zp)
	if err != nil {
		log.Panic(err)
	}

	tokenL2Balance, err := tokenL2.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Token balance on L2 network: ", tokenL2Balance)
}

```

### Transfer tokens

Here is an example on how to transfer ETH on zkSync network.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/contracts/erc20"
	"github.com/zksync-sdk/zksync2-go/types"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey1    = os.Getenv("PRIVATE_KEY")
		PublicKey2     = "81E9D85b65E9CC8618D85A1110e4b1DF63fA30d9"
		ZkSyncProvider = "https://testnet.era.zksync.dev"
		TokenL2Address = common.HexToAddress("Cd9BDa1d0FC539043D4C80103bdF4f9cb108931B")
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey1), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Get token contract on zkSync network
	token, err := erc20.NewIERC20(TokenL2Address, zp)
	if err != nil {
		log.Panic(err)
	}

	account1TokenBalance, err := token.BalanceOf(nil, w.GetAddress())
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
	hash, err := w.Transfer(
		common.HexToAddress(PublicKey2),
		big.NewInt(3),
		&types.Token{L2Address: TokenL2Address},
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

	account1TokenBalance, err = token.BalanceOf(nil, w.GetAddress())
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

### Withdraw tokens

This is an example of how to withdraw tokens from zkSync Era network (L2) to Ethereum network (L1):

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/contracts/erc20"
	"github.com/zksync-sdk/zksync2-go/types"
	"log"
	"math/big"
	"os"
)

func main() {
	var (
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
		EthereumProvider = "https://rpc.ankr.com/eth_goerli"
		TokenL2Address   = common.HexToAddress("1958F3a8246B526796DdE3F37fB2b9E04660Bf33")
		TokenL1Address   = common.HexToAddress("c8F8cE6491227a6a2Ab92e67a64011a4Eba1C6CF")
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
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

	// Get token contract on Ethereum network
	tokenL1, err := erc20.NewIERC20(TokenL1Address, ep.GetClient())
	if err != nil {
		log.Panic(err)
	}
	// Get token contract on zkSync network
	tokenL2, err := erc20.NewIERC20(TokenL2Address, zp)
	if err != nil {
		log.Panic(err)
	}

	tokenL1Balance, err := tokenL1.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}
	tokenL2Balance, err := tokenL2.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Token balance before withdrawal on L1 network: ", tokenL1Balance)
	fmt.Println("Token balance before withdrawal on L2 network: ", tokenL2Balance)

	// Perform withdraw
	wHash, err := w.Withdraw(
		w.GetAddress(),
		big.NewInt(1),
		&types.Token{L1Address: TokenL1Address, L2Address: TokenL2Address},
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Withdraw transaction: ", wHash)

	// Wait until transaction is finalized
	fmt.Println("Waiting for finalize transaction to be finalized on L2 network")
	_, err = zp.WaitFinalized(context.Background(), wHash)
	if err != nil {
		panic(err)
	}

	// Perform finalize withdraw
	fwHash, err := w.FinalizeWithdraw(wHash, 0)
	if err != nil {
		panic(err)
	}
	fmt.Println("Finalize withdraw transaction: ", fwHash)

	// Wait for finalize withdraw transaction to be finalized on L1 network
	fmt.Println("Waiting for finalize withdraw transaction to be finalized on L1 network")
	_, err = ep.WaitMined(context.Background(), fwHash)
	if err != nil {
		log.Panic(err)
	}

	tokenL1Balance, err = tokenL1.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}
	tokenL2Balance, err = tokenL2.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Token balance after withdrawal on L1 network: ", tokenL1Balance)
	fmt.Println("Token balance after withdrawal on L2 network: ", tokenL2Balance)

}

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

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"log"
	"math/big"
	"os"
	"zksync2-examples/contracts/storage"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("../solidity/storage/build/Storage.zbin")
	if err != nil {
		log.Panic(err)
	}

	//Deploy smart contract
	hash, err := w.DeployWithCreate(bytecode, nil, nil, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	receipt, err := zp.GetTransactionReceipt(hash)
	if err != nil {
		log.Panic(err)
	}
	contractAddress := receipt.ContractAddress

	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Storage smart contract
	storageContract, err := storage.NewStorage(contractAddress, zp)
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

	// INTERACT WITH SMART CONTRACT USING EIP712 TRANSACTIONS
	abi, err := storage.StorageMetaData.GetAbi()
	if err != nil {
		log.Panic(err)
	}
	// Encode set function arguments
	setArguments, err := abi.Pack("set", big.NewInt(500))
	if err != nil {
		log.Panic(err)
	}
	// Execute set function
	execute, err := w.Execute(contractAddress, setArguments, nil, nil)
	if err != nil {
		log.Panic(err)
	}

	_, err = zp.WaitMined(context.Background(), execute)
	if err != nil {
		log.Panic(err)
	}
}

```

#### Deploy a contract with a constructor using create opcode

```go
package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"log"
	"math/big"
	"os"
	"zksync2-examples/contracts/incrementer"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
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

	// Use salt if there is need to deploy same contract twice, otherwise remove salt
	salt := make([]byte, 32)
	_, err = rand.Read(salt)
	if err != nil {
		log.Panicf("error while generating salt: %s", err)
	}

	// Deploy smart contract
	hash, err := w.DeployWithCreate(bytecode, constructor, nil, nil)
	if err != nil {
		panic(err)
		// When contract is deployed twice without salt the following error occurs:
		// panic: failed to EstimateGas712: failed to query eth_estimateGas: execution reverted: Code hash is non-zero
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	receipt, err := zp.GetTransactionReceipt(hash)
	if err != nil {
		log.Panic(err)
	}
	contractAddress := receipt.ContractAddress

	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address: ", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Incrementer contract
	incrementerContract, err := incrementer.NewIncrementer(contractAddress, zp)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method
	value, err := incrementerContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value before Increment method execution: ", value)

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

#### Deploy a contract with dependency using create opcode

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/accounts"
	"github.com/zksync-sdk/zksync2-go/clients"
	"log"
	"os"
	"zksync2-examples/contracts/demo"
)

func main() {
	var (
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
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
	hash, err := w.DeployWithCreate(demoBytecode, nil, [][]byte{fooBytecode}, nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	receipt, err := zp.GetTransactionReceipt(hash)
	if err != nil {
		log.Panic(err)
	}
	contractAddress := receipt.ContractAddress

	if err != nil {
		panic(err)
	}
	fmt.Println("Smart contract address: ", contractAddress.String())

	// INTERACT WITH SMART CONTRACT

	// Create instance of Demo contract
	demoContract, err := demo.NewDemo(contractAddress, zp)
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

#### Deploy a smart account using create opcode

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
		ZkSyncProvider = "https://testnet.era.zksync.dev"
		TokenAddress   = "Cd9BDa1d0FC539043D4C80103bdF4f9cb108931B" // Crown token which can be minted for free
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read paymaster contract from standard json
	_, paymasterAbi, bytecode, err := utils.ReadStandardJson("../solidity/custom_paymaster/paymaster/build/Paymaster.json")
	if err != nil {
		log.Panic(err)
	}

	// Encode token constructor
	constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}

	// Deploy paymaster contract
	hash, err := w.DeployAccountWithCreate(bytecode, constructor, nil)
	if err != nil {
		return
	}
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	receipt, err := zp.GetTransactionReceipt(hash)
	if err != nil {
		log.Panic(err)
	}
	contractAddress := receipt.ContractAddress

	if err != nil {
		panic(err)
	}
	fmt.Println("Paymaster address", contractAddress.String())
}

```

#### Deploy a contract using create2 opcode

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
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
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read smart contract bytecode
	bytecode, err := os.ReadFile("../solidity/storage/build/Storage.zbin")
	if err != nil {
		log.Panic(err)
	}

	//Deploy smart contract
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
	contractAddress, err := utils.ComputeL2Create2Address(
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
	storageContract, err := storage.NewStorage(contractAddress, zp)
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

#### Deploy a contract with a constructor using create2 opcode

```go
package main

import (
	"context"
	"crypto/rand"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
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
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
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
		// panic: failed to EstimateGas712: failed to query eth_estimateGas: execution reverted: Code hash is non-zero
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.ComputeL2Create2Address(
		w.GetAddress(),
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
	incrementerContract, err := incrementer.NewIncrementer(contractAddress, zp)
	if err != nil {
		log.Panic(err)
	}

	// Execute Get method
	value, err := incrementerContract.Get(nil)
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Value before Increment method execution: ", value)

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

#### Deploy a contract with dependency using create2 opcode

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
		PrivateKey     = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider = "https://testnet.era.zksync.dev"
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
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
	contractAddress, err := utils.ComputeL2Create2Address(
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
	demoContract, err := demo.NewDemo(contractAddress, zp)
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

#### Deploy a smart account using crate2 opcode

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
		ZkSyncProvider = "https://testnet.era.zksync.dev"
		TokenAddress   = "Cd9BDa1d0FC539043D4C80103bdF4f9cb108931B" // Crown token which can be minted for free
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Read paymaster contract from standard json
	_, paymasterAbi, bytecode, err := utils.ReadStandardJson("../solidity/custom_paymaster/paymaster/build/Paymaster.json")
	if err != nil {
		log.Panic(err)
	}

	// Encode paymaster constructor
	constructor, err := paymasterAbi.Pack("", common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}

	// Deploy paymaster contract
	hash, err := w.DeployAccount(bytecode, constructor, nil, nil)
	if err != nil {
		log.Panic(err)
	}
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Transaction: ", hash)

	// Wait unit transaction is finalized
	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Get address of deployed smart contract
	contractAddress, err := utils.ComputeL2Create2Address(
		w.GetAddress(),
		bytecode,
		constructor,
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Paymaster address", contractAddress.String())
}

```

### Use paymaster

This example demonstrates how to use a paymaster to facilitate fee payment with an ERC20 token.
The user initiates a mint transaction that is configured to be paid with an ERC20 token through the paymaster.
During transaction execution, the paymaster receives the ERC20 token from the user and covers the transaction fee using ETH.

```go
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
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
		PrivateKey       = os.Getenv("PRIVATE_KEY")
		ZkSyncProvider   = "https://testnet.era.zksync.dev"
		TokenAddress     = "Cd9BDa1d0FC539043D4C80103bdF4f9cb108931B" // Crown token which can be minted for free
		PaymasterAddress = "d660c2F92d3d0634e5A20f26821C43F1b09298fe" // Paymaster for Crown token
	)

	// Connect to zkSync network
	zp, err := clients.NewDefaultProvider(ZkSyncProvider)
	if err != nil {
		log.Panic(err)
	}
	defer zp.Close()

	// Create singer object from private key for appropriate chain
	chainID, err := zp.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	es, err := accounts.NewEthSignerFromRawPrivateKey(common.Hex2Bytes(PrivateKey), chainID.Int64())
	if err != nil {
		log.Fatal(err)
	}

	// Create wallet
	w, err := accounts.NewWallet(es, zp)
	if err != nil {
		log.Panic(err)
	}

	// Get token contract
	token, err := crown.NewCrown(common.HexToAddress(TokenAddress), zp)
	if err != nil {
		log.Panic(token)
	}

	// Transfer some ETH to paymaster, so it can pay fee with ETH
	hash, err := w.Transfer(common.HexToAddress(PaymasterAddress),
		big.NewInt(2_00_000_000_000_000_000), // 0,2 ETH
		utils.CreateETH(),
		nil)
	if err != nil {
		return
	}

	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	// Also mint some tokens to user account, so user can pay fee with tokens
	privateKey, err := crypto.ToECDSA(common.Hex2Bytes(PrivateKey))
	if err != nil {
		log.Panic(err)
	}
	opts, err := bind.NewKeyedTransactorWithChainID(privateKey, w.GetEthSigner().GetDomain().ChainId)
	if err != nil {
		log.Panic(err)
	}
	tx, err := token.Mint(opts, w.GetAddress(), big.NewInt(10))
	if err != nil {
		log.Panic(err)
	}
	_, err = zp.WaitMined(context.Background(), tx.Hash())
	if err != nil {
		log.Panic(err)
	}

	// Read token and ETH balances from user and paymaster accounts
	balance, err := w.GetBalance()
	if err != nil {
		return
	}
	fmt.Println("Account balance before mint: ", balance)

	tokenBalance, err := token.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account token balance before mint: ", tokenBalance)

	balance, err = zp.GetBalance(common.HexToAddress(PaymasterAddress), types.BlockNumberLatest)
	if err != nil {
		return
	}
	fmt.Println("Paymaster balance before mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Paymaster token balance before mint: ", tokenBalance)

	abi, err := crown.CrownMetaData.GetAbi()
	if err != nil {
		log.Panic(err)
	}

	// Encode mint function from token contract
	calldata, err := abi.Pack("mint", w.GetAddress(), big.NewInt(7))
	if err != nil {
		log.Panic(err)
	}

	// Create paymaster parameters with encoded paymaster input
	paymasterParams, err := utils.GetPaymasterParams(
		common.HexToAddress(PaymasterAddress),
		&types.ApprovalBasedPaymasterInput{
			Token:            common.HexToAddress(TokenAddress),
			MinimalAllowance: big.NewInt(1),
			InnerInput:       []byte{},
		})
	if err != nil {
		log.Panic(err)
	}

	// In order to use paymaster, EIP712 transaction
	// need to be crated with configured paymaster parameters
	mintTx := utils.CreateFunctionCallTransaction(
		w.GetAddress(),
		common.HexToAddress(TokenAddress),
		big.NewInt(0),
		big.NewInt(0),
		big.NewInt(0),
		calldata,
		nil,
		paymasterParams,
	)

	nonce, err := w.GetNonce()
	if err != nil {
		log.Panic(nonce)
	}

	// Execute transaction
	hash, err = w.EstimateAndSend(mintTx, nonce)
	if err != nil {
		log.Panic(err)
	}

	_, err = zp.WaitMined(context.Background(), hash)
	if err != nil {
		log.Panic(err)
	}

	fmt.Println("Tx: ", hash)

	balance, err = w.GetBalance()
	if err != nil {
		return
	}
	fmt.Println("Account balance after mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, w.GetAddress())
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Account token balance after mint: ", tokenBalance)

	balance, err = zp.GetBalance(common.HexToAddress(PaymasterAddress), types.BlockNumberLatest)
	if err != nil {
		return
	}
	fmt.Println("Paymaster balance after mint: ", balance)

	tokenBalance, err = token.BalanceOf(nil, common.HexToAddress(TokenAddress))
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Paymaster token balance after mint: ", tokenBalance)

}

```
