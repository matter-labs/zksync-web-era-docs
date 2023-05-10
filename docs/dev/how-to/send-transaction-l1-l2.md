# Send a transaction L1 to L2

1. Import the zkSync Era library or contract containing the required functionality. 

The import gives access to the [`IZkSync.sol`](l1/contracts/zksync/interfaces/IZkSync.sol) inherited interfaces that include access to the gas estimation functionality.

2. Get the current L1 gas price.

3. Call the JSON-RPC method [`zks_estimateGasL1toL2`](../../api/api.md#zks-estimategasl1tol2), wrapping the transaction data in a `CallRequest` JSON object parameter. The method returns the minimum amount of gas required for the transaction to succeed. 

    :::tip Important
    This value is often referred to as **limit, or gas limit, or L2 gas limit** in our documented examples. 
    :::

    3.1 Apply an alias to the addresses in the request if the sender address is a contract. If the sender is an EOA, no aliasing is required.

4. Get the base cost by calling the [`l2TransactionBaseCost`]((https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L129) ) function with:
    - The gas price returned at step 2.
    - The minimum gas value returned at step 3. 
    - The L1 to L2 gas-per-pubdata-byte constant that represents the amount of L2 gas required to send a single byte of data. ??https://era.zksync.io/docs/api/js/utils.html#gas??

```solidity
function l2TransactionBaseCost(
        uint256 _gasPrice,
        uint256 _l2GasLimit,
        uint256 _l2GasPerPubdataByteLimit
    ) external view returns (uint256);
```

The resulting base cost is given in wei for the L2 part of the transaction.

5. Send the transaction, including both the gas price and base cost in the value parameters, by calling the [`requestL2Transaction`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L119) function. Include the gas limit value from step 3 as `_l2GasLimit`, the gas-per-pubdata-byte constant as `_l2GasPerPubdataByteLimit`.

The refund recipient as `_refundRecipient` receives any remaining fee after the transaction completes. If `_refundRecipient = 0` then L2 `msg.sender` is used.

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

6. Wait for a transaction response and output the details.

### Transaction parameters

The json is the same as for the `eth_estimateGas` method with additional fields for zkSync Era [EIP-712 transactions](../../api/api.md#eip-712-transactions).

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
@tab JavaScript
```js
import { Wallet, Provider } from "zksync-web3";
import { ethers, BigNumber } from "ethers";

const TEST_PRIVATE_KEY = "<PRIVATE_KEY_FOR_TESTING>";

const zkSyncProvider = new Provider("https://testnet.era.zksync.dev");
const ethereumProvider = ethers.getDefaultProvider("goerli");
const wallet = new Wallet(TEST_PRIVATE_KEY, zkSyncProvider, ethereumProvider);

const gasPrice = await wallet.providerL1!.getGasPrice();

// The calldata can be encoded in the same way as for Ethereum
const calldata = "0x...";
const gasLimit = BigNumber.from(1000);
const gasPerPubdataByte = BigNumber.from(800);

const txCostPrice = await wallet.getBaseCost({
  gasPrice,
  gasLimit,
  gasPerPubdataByte
});

console.log(`Executing the transaction will cost ${ethers.utils.formatEther(txCostPrice)} ETH`);

// Initiate L2 transfer via L1 and execute from zkSync Era wallet
const someL2Contract = "0x19a5bfcbe15f98aa073b9f81b58466521479df8d";
const executeTx = await wallet.requestExecute({
  calldata,
  l2GasLimit: gasLimit,
  gasPerPubdataByte,
  contractAddress: someL2Contract,
  overrides: {
    gasPrice,
    value: txCostPrice,
  },
});

await executeTx.wait();
```
@tab Python
```sh
// In progress. Check back later.
```
@tab Go
```sh
// In progress. Check back later.
```
@tab Java
```sh
// In progress. Check back later.
```
:::

### Result

6. The return value is a 256-bit unsigned integer in hexadecimal representing how much gas the transaction uses.

```json
{
    "jsonrpc": "2.0",
    "result": "0x25f64db",
    "id": 2
}
```
