---
head:
  - - meta
    - name: "twitter:title"
      content: Go SDK Features | zkSync Docs
---

# zkSync Era Features

While zkSync Era is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP-712 transactions
since [EIP-712](https://eips.ethereum.org/EIPS/eip-712) is used to sign them. You can look at the internal structure of the EIP-712
transactions [here](../../../zk-stack/concepts/transaction-lifecycle.md#eip-712-0x71).

This document will focus solely on how to pass these arguments to the SDK.

## EIP-712 Metadata

[`EIP712Meta`](types/types.md#eip712meta) contains EIP-712 transaction metadata. The following objects contain `EIP712Meta` and provides working with
EIP-712 transactions:

- [`types.CallMsg`](types/types.md#callmsg)
- [`types.Transaction712`](types/types.md#transaction712)
- [`accounts.CallMsg`](types/accounts.md#callmsg)
- [`accounts.Transaction`](types/accounts#transaction)

## Encoding paymaster params

While the paymaster feature by itself does not impose any limitations on values of the `paymasterInput`, the Matter Labs team endorses certain types of [paymaster flows](../../developer-reference/account-abstraction.md#built-in-paymaster-flows) that are processable by EOAs.

zkSync SDK provides a utility method that can be used to get the correctly formed `PaymasterParams` object: [GetPaymasterParams](./paymaster-utils.md#getpaymasterparams).

## See in action

If you want to call the method `setGreeting` of a contract called `greeter`, this would look the following way, while paying fees with the
[testnet paymaster](../../developer-reference/account-abstraction.md#testnet-paymaster):

```go
PrivateKey     := os.Getenv("PRIVATE_KEY")
ZkSyncEraProvider := "https://testnet.era.zksync.dev"

TokenAddress   := common.HexToAddress("<Token address>")
GreeterAddress := common.HexToAddress("<Greeter contract address>")
ReceiptAddress := common.HexToAddress("<Receipt address>")


client, err := clients.Dial(ZkSyncEraProvider)
if err != nil {
	log.Panic(err)
}
defer client.Close()

// Create wallet
wallet, err := accounts.NewWallet(common.Hex2Bytes(PrivateKey), &client, ethClient)
if err != nil {
	log.Panic(err)
}

abi, err := greeter.GreeterMetaData.GetAbi()
if err != nil {
	log.Panic(err)
}

// Encode transfer function from token contract
calldata, err := abi.Pack("setGreeting")
if err != nil {
	log.Panic(err)
}

gasPrice, err := client.SuggestGasPrice(context.Background())
if err != nil {
	log.Panic(err)
}

gas, err := client.EstimateGas(context.Background(), ethereum.CallMsg{
	From: wallet.Address(),
	To:   ReceiptAddress,
	Data: calldata,
})
if err != nil {
  log.Panic(err)
}

testnetPaymaster, err := client.TestnetPaymaster(context.Background())
if err != nil {
	log.Panic(err)
}

// Create paymaster parameters with encoded paymaster input
paymasterParams, err := utils.GetPaymasterParams(
	PaymasterAddress,
	&zkTypes.ApprovalBasedPaymasterInput{
		Token:            testnetPaymaster,
		MinimalAllowance: new(big.Int).Mul(gasPrice, new(big.Int).SetUint64(gas)),
		InnerInput:       []byte{},
	})
if err != nil {
	log.Panic(err)
}

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

```
