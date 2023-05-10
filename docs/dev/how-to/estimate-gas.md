# Estimate gas

Estimating gas is a requirement for the following use cases:

- Sending transactions on: 
    - L1 to L1
    - L1 to L2
    - L2 to L2
- ??anything else??

## L1 to L1

To estimate gas for L1 to L1 transactions, use the Ethereum `eth_estimateGas` method.

??is this only sent to a layer 1 node, or zkSync also??

:::info More info
For more information and live testing, check out the [Ethereum JSON RPC docs](https://ethereum.github.io/execution-apis/api-documentation/).
:::

## L1 to L2

To estimate gas for an L1 to L2 transaction, first gather the required values:

1. Get the current L1 gas price. 
    
    For example, the Ethers.js library has a [`getGasPrice()`](https://docs.ethers.org/v5/api/providers/provider/#Provider-getGasPrice) method available on a `Provider` object. Your language of choice should have an equivalent.

2. Call the [`zks_estimateGasL1ToL2`](../../api/api.md#zks_estimategasl1tol2) method, passing the transaction data. This returns the minimum amount of gas the transaction requires; commonly called **gas limit** or similar in our code and docs.

    - Apply an alias to the addresses in the request if the sender address is a contract. If the sender is an EOA, no aliasing is required. ??example??

3. Call the [`l2TransactionBaseCost`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L129) function, passing the gas price and gas limit from previous steps. This function returns the base cost required to send a transaction.

    - You also need to pass the constant representing how much gas is required to publish a byte of data from L1 to L2. 
    
        For example, in the JavaScript API, we provide [`REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`](../../api/js/utils.md#gas). ??this is JS, can I say there is equivalent??

Once you have all of the above, you can send a transaction with the [`requestL2Transaction`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L119) function, passing the gas limit returned at step 2, along with the gas price and base cost from steps 1 and 3.

For a more detailed explanation on estimating gas with coded examples, see the [how to send a transaction from L1 to L2](../how-to/send-transaction-l1-l2.md) documentation.


## L2 to L2

Gas estimation for L2 to L2 transactions on zkSyncEra works in the same way as in Ethereum.

Supply the same call data as for a L1 to L2 transaction, and use the Ethereum `eth_estimateGas` method.

??is this only sent to a layer 2 node, or layer1 also??

:::info More info
For more information and live testing, check out the [Ethereum JSON RPC docs](https://ethereum.github.io/execution-apis/api-documentation/).
:::

## L2 to L1

Gas estimation is not required for L2 to L1 transactions.

Find out [how to send a message from L2 to L1](../../how-to/send-message-l2-l1.md).