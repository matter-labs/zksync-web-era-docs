# Send an L1 to L2 transaction

Sending transactions from Ethereum to zkSync Era is done via the [zkSync smart contract](??which one??) which allows the sender to request transactions directly on L1 and pass data from Ethereum to zkSync Era.

## Common use cases

Along with zkSync Era's built-in censorship resistance that requires multi-layer interoperability, there are some common use cases that need L1 to L2 transaction functionality, such as:

- Building complex bridges.
- Smart contracts on one layer that govern smart contracts on another layer.
- ??MORE??

## Step-by-step without gas estimation

TODO: xx

### Transaction parameters

The JSON structure is the same as for the `eth_estimateGas` method in Ethereum with additional fields for zkSync Era [EIP-712 transactions](../../api/api.md#eip-712-transactions).

### Examples

TODO:

## Step-by-step with gas estimation

1. Import the zkSync Era library or contract containing the required functionality. 

    The import gives access to the [`IZkSync.sol`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IZkSync.sol#L4) inherited interfaces that include the gas estimation functionality.

2. Get the current L1 gas price.

3. Call the JSON-RPC method [`zks_estimateGasL1toL2`](../../api/api.md#zks-estimategasl1tol2), wrapping the transaction data in a [`CallRequest`](#transaction-parameters-1) JSON object parameter. 

    The method returns the minimum amount of gas required for the transaction to succeed. 

    :::tip Important
    This value is often referred to as **limit, or gas limit, or L2 gas limit** in our documented examples. 
    :::

    3.1 Apply an alias to the addresses in the request if the sender address is a contract. If the sender is an EOA, no aliasing is required. Aliasing is implemented by the [`applyL1ToL2Alias`](https://github.com/matter-labs/zksync-2-contracts/blob/7b5c094a57c0606785ea38c9c752f9def9a5ed9d/ethereum/contracts/vendor/AddressAliasHelper.sol#L28) Solidity function.

4. Get the base cost by calling the [`l2TransactionBaseCost`]((https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L129) ) function with:
    - The gas price returned at step 2.
    - The minimum gas value returned at step 3. 
    - A constant representing how much gas is required to publish a byte of data from L1 to L2. At the time of writing, the JavaScript API provides this constant as [`REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`](../../api/js/utils.md#gas).

```solidity
function l2TransactionBaseCost(
    uint256 _gasPrice,
    uint256 _l2GasLimit,
    uint256 _l2GasPerPubdataByteLimit
) external view returns (uint256);
```

5. The return value is a 256-bit unsigned integer in hexadecimal representing how much gas the transaction uses in wei??.

```json
{
    "jsonrpc": "2.0",
    "result": "0x25f64db",
    "id": 2
}
```

6. Send the transaction, including both the gas price and base cost in the value parameters, by calling the [`requestL2Transaction`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L119) function. 

    Include the gas limit value from step 3 as `_l2GasLimit` and the `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT` constant as `_l2GasPerPubdataByteLimit`.

    The `_refundRecipient` address receives any remaining fee after the transaction completes. If `_refundRecipient = 0` then L2 `msg.sender` is used.

```solidity
function requestL2Transaction(
    address _contractL2,
    uint256 _l2Value,
    bytes calldata _calldata,
    uint256 _l2GasLimit,
    uint256 _l2GasPerPubdataByteLimit,
    bytes[] calldata _factoryDeps,
    address _refundRecipient
) external payable returns (bytes32 canonicalTxHash);
```

7. Wait for a transaction response and output the details.

### Transaction parameters

The JSON structure is the same as for the `eth_estimateGas` method in Ethereum with additional fields for zkSync Era [EIP-712 transactions](../../api/api.md#eip-712-transactions).

### Examples

::: code-tabs
@tab Solidity
```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Import the zkSync Era contract interface
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Example {
    function callZkSync(
        // The address of the zkSync smart contract
        address _zkSyncAddress
    ) external payable returns(bytes32 txHash) {
        IZkSync zksync = IZkSync(_zkSyncAddress);
        address someL2Contract = "<CONTRACT_ADDRESS>";
        // Call L2 smart contract from L1 Example contract
        txHash = zksync.requestL2Transaction{value: msg.value}(
            // The address of the L2 contract to call
            someL2Contract,
            // We pass no ETH with the call
            0,
            // Encoding the calldata for the execute
            abi.encodeWithSignature("someMethod()"),
            // Gas limit
            10000,
            // gas price per pubdata byte
            800,
            // factory dependencies
            new bytes[](0),
            // refund address
            address(0)
        );
    }
}
```
@tab TypeScript
```js
import { Wallet, Provider, utils } from "zksync-web3";
import { ethers, BigNumber } from "ethers";

async function main() {

    const TEST_PRIVATE_KEY = "<TEST_PRIVATE_KEY>";
    const L1_CONTRACT_ADDRESS = "<L1_CONTRACT_ADDRESS>";
    const L2_CONTRACT_ADDRESS = "<L2_CONTRACT_ADDRESS>";

    const zkSyncProvider = new Provider("https://testnet.era.zksync.dev");
    const ethereumProvider = ethers.getDefaultProvider("goerli");
    const wallet = new Wallet(TEST_PRIVATE_KEY, zkSyncProvider, ethereumProvider);

    // Initialize the L2 provider
    const l2Provider = new Provider('https://testnet.era.zksync.dev');

    const gasPrice = await wallet.provider.getGasPrice();

    // The calldata can be encoded in the same way as for Ethereum
    const calldata = '["from": "0xccf9d7d2f8be1f821cb8d9ec9553ffa92aa8fc4d","to": "0xfbb5fa2ea8c5fc6f492c0795564352f262f49f50", "data": "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000007",]';
    const gasLimit = await l2Provider.estimateL1ToL2Execute({
        contractAddress: L2_CONTRACT_ADDRESS,
        calldata: calldata,
        caller: utils.applyL1ToL2Alias(L1_CONTRACT_ADDRESS), 
    });
    const gasPerPubdataByte = utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT;

    const txCostPrice = await wallet.getBaseCost({
        gasPrice,
        gasLimit,
        gasPerPubdataByte,
    });

    console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

    // Initiate L2 transfer via L1 and execute from zkSync Era wallet
    const executeTx = await wallet.requestExecute({
        calldata,
        l2GasLimit: gasLimit,
        gasPerPubdataByte,
        contractAddress: L2_CONTRACT_ADDRESS,
        overrides: {
            gasPrice,
            value: txCostPrice,
        },
    });

    await executeTx.wait();
}

// We recommend always using this async/await pattern to properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```
@tab Python
```sh
// In progress. Check back later.
```
@tab Go
```sh
// In progress. Check back later.
```
:::
