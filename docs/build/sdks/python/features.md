---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Features | zkSync Docs
---

# zkSync Era Features

While zkSync is mostly Web3-compatible, it has some differences compared to Ethereum. The major of those are:

- Account abstraction support (accounts may have near-arbitrary validation logic, and also paymaster support is enabled).
- Deployment transactions require the contracts' bytecode to be passed in a separate field.
- The fee system is somewhat different.

These require us to extend standard Ethereum transactions with new custom fields. Such extended transactions are called EIP712 transactions since
[EIP712](https://eips.ethereum.org/EIPS/eip-712) is used to sign them. You can look at the internal structure of the EIP712 transactions.

This document will focus solely on how to pass these arguments to the SDK.

## Encoding paymaster params

While the paymaster feature by itself does not impose any limitations on values of the `paymasterInput`, the Matter Labs team endorses certain types of paymaster flows that are processable by EOAs.

zkSync SDK provides a utility method that can be used to get the correctly formed `paymasterParams` object: [PaymasterFlowEncoder](./paymaster-utils.md#encodeapprovalbased).

## See in action

If you want to call the method `setGreeting` of a contract called `greeter`, this would look the following way, while paying fees with the testnet paymaster:

```python
greeting = "new greeting"

paymaster_params = PaymasterParams(
            **{
                "paymaster": paymaster_address,
                "paymaster_input": eth_web3.to_bytes(
                    hexstr=PaymasterFlowEncoder(eth_web3).encode_approval_based(
                    token_address, 1, b""
            )
        ),
    }
)

transaction = TxFunctionCall(
    from_=account.address,
    to=token_address,
    data=greeter.encodeABI("setGreeting", greeting),
    gas_limit=0,  # Unknown at this state, estimation is done in next step
    gas_price=gas_price
)

estimate_gas = self.web3.zksync.eth_estimate_gas(transaction.tx)
tx_712 = transaction.tx712(estimate_gas)
signed_message = signer.sign_typed_data(tx_712.to_eip712_struct())
msg = tx_712.encode(signed_message)
tx_hash = web3.zksync.send_raw_transaction(msg)
```
