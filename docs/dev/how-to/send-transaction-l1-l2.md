# Send an L1 to L2 transaction

The [zkSync Era smart contracts](https://github.com/matter-labs/zksync-2-contracts/tree/main/ethereum/contracts/zksync) allow the sender to request transactions on Ethereum L1 and pass data to zkSync Era L2.

## Common use cases

Along with zkSync Era's built-in censorship resistance that requires multi-layer interoperability, there are some common use cases that need L1 to L2 transaction functionality, such as:

- Custom bridges.
- Multi-layer governing smart contracts.
- And more.

## Step-by-step without gas estimation

1. Import the zkSync Era library or contract containing the required functionality. 

    The import gives access to the [`IZkSync.sol`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IZkSync.sol#L4) inherited interfaces.

    Import the contracts with yarn (recommended), or [download the contracts](https://github.com/matter-labs/v2-testnet-contracts).

    ::: code-tabs
    @tab yarn
    ```yarn
    yarn add -D @matterlabs/zksync-contracts
    ```
    :::

2. Send the transaction by calling the [`requestExecute`](https://github.com/matter-labs/zksync-2-dev/blob/e25e6c3909dc41e71d9f377a2aeef9ddb8f4987f/sdk/zksync-web3.js/src/adapters.ts#L553) method and passing the `contractAddress` and `calldata` as a minimum. 

    :::tip 
    - The system takes care of gas estimation implicitly when not providing gas estimation parameters.
    :::

    ::: code-tabs
    @tab TypeScript
    ```ts
    async requestExecute(transaction: {
        contractAddress: Address;
        calldata: BytesLike;
        l2GasLimit?: BigNumberish;
        l2Value?: BigNumberish;
        factoryDeps?: ethers.BytesLike[];
        operatorTip?: BigNumberish;
        gasPerPubdataByte?: BigNumberish;
        refundRecipient?: Address;
        overrides?: ethers.PayableOverrides;
    }): Promise<PriorityOpResponse> {
        const requestExecuteTx = await this.getRequestExecuteTx(transaction);
        return this._providerL2().getPriorityOpResponse(await this._signerL1().sendTransaction(requestExecuteTx));
    }
    ```
    :::

    :::info 
    - The `calldata` format is a bytestream containing the contract address and the method call data. 
    - The contract ABI is required to set up the calldata for sending.
    - See the [cross chain governance tutorial implementation](../tutorials/cross-chain-tutorial.md#call-l2-contract-from-l1) for further clarification.
    :::

### Example code

TODO:

## Step-by-step with gas estimation

1. Import the zkSync Era library or contract containing the required functionality. 

    The import gives access to the [`IZkSync.sol`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IZkSync.sol#L4) inherited interfaces that include the gas estimation functionality.

    Import the contracts with yarn (recommended), or [download the contracts](https://github.com/matter-labs/v2-testnet-contracts) from the repo.

    ::: code-tabs
    @tab yarn
    ```yarn
    yarn add -D @matterlabs/zksync-contracts
    ```
    :::

2. Get the current L1 gas price. Function available in [Yul](https://github.com/matter-labs/era-system-contracts/blob/4e0487b940fa76d26107ca725d65e7abb6d0dee8/bootloader/bootloader.yul#L1069) and then called by the [JavaScript SDK](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/provider.ts#L265).

    ::: code-tabs
    @tab Yul
    ```yul
    function getGasPrice(maxFeePerGas, maxPriorityFeePerGas) -> ret {
        let baseFee := basefee()

        if gt(maxPriorityFeePerGas, maxFeePerGas) {
            revertWithReason(
                MAX_PRIORITY_FEE_PER_GAS_GREATER_THAN_MAX_FEE_PER_GAS(),
                0
            )
        }

        if gt(baseFee, maxFeePerGas) {
            revertWithReason(
                BASE_FEE_GREATER_THAN_MAX_FEE_PER_GAS(),
                0
            )
        }

        // We always use `baseFee` to charge the transaction 
        ret := baseFee
    }
    ```
    @tab TypeScript
    ```ts
    // Method available on a zkSync Era JS SDK Provider object
    override async getGasPrice(token?: Address): Promise<BigNumber> {
        const params = token ? [token] : [];
        const price = await this.send('eth_gasPrice', params);
        return BigNumber.from(price);
    }
    ```
    :::

3. Call the JSON-RPC method [`zks_estimateGasL1toL2`](../../api/api.md#zks-estimategasl1tol2), wrapping the transaction data in a [`CallRequest`](#transaction-parameters-1) JSON object parameter. 

    The method returns the minimum amount of gas required for the transaction to succeed. 

    :::tip Important
    This value is often referred to as **limit, or gas limit, or L2 gas limit** in our documented examples. 
    :::

    ::: code-tabs
    @tab TypeScript
    ```ts
    // available on a zkSync Era JS SDK Provider object
    async estimateGasL1(transaction: utils.Deferrable<TransactionRequest>): Promise<BigNumber> {
        await this.getNetwork();
        const params = await utils.resolveProperties({
            transaction: this._getTransactionRequest(transaction)
        });
        if (transaction.customData != null) {
            // @ts-ignore
            params.transaction.customData = transaction.customData;
        }
        const result = await this.send('zks_estimateGasL1ToL2', [
            Provider.hexlifyTransaction(params.transaction, { from: true })
        ]);
        try {
            return BigNumber.from(result);
        } catch (error) {
            throw new Error(`bad result from backend (zks_estimateGasL1ToL2): ${result}`);
        }
    }
    ```
    :::

    3.1 Apply an alias to the addresses in the request if the sender address is a contract. 
    
    If the sender is an EOA, no aliasing is required. Aliasing is implemented by the [`applyL1ToL2Alias`](https://github.com/matter-labs/zksync-2-contracts/blob/7b5c094a57c0606785ea38c9c752f9def9a5ed9d/ethereum/contracts/vendor/AddressAliasHelper.sol#L28) Solidity function and called by the [JavaScript SDK](https://github.com/matter-labs/zksync-era/blob/48fe6e27110c1fe1a438c5375fb256890e8017b1/sdk/zksync-web3.js/src/utils.ts#L374).

    ::: code-tabs
    @tab Solidity
    ```solidity
    function applyL1ToL2Alias(address l1Address) internal pure returns (address l2Address) {
        unchecked {
            l2Address = address(uint160(l1Address) + offset);
        }
    }
    ```
    @tab TypeScript
    ```ts
    export function applyL1ToL2Alias(address: string): string {
        return ethers.utils.hexlify(ethers.BigNumber.from(address).add(L1_TO_L2_ALIAS_OFFSET).mod(ADDRESS_MODULO));
    }
    ```
    :::

4. Get the base cost by calling the [`l2TransactionBaseCost`]((https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L129) ) function with:
    - The gas price returned at step 2 as `_gasPrice`.
    - The minimum gas value returned at step 3 as `_l2GasLimit`. 
    - A constant representing how much gas is required to publish a byte of data from L1 to L2 as `_l2GasPerPubdataByteLimit`. At the time of writing, the JavaScript API provides this constant as [`REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`](../../api/js/utils.md#gas).

    ::: code-tabs
    @tab Solidity
    ```solidity
    function l2TransactionBaseCost(
        uint256 _gasPrice,
        uint256 _l2GasLimit,
        uint256 _l2GasPerPubdataByteLimit
    ) external view returns (uint256);
    ```
    @tab TypeScript
    ```ts
    async getBaseCost(params: {
        gasLimit: BigNumberish;
        gasPerPubdataByte?: BigNumberish;
        gasPrice?: BigNumberish;
    }): Promise<BigNumber> {
        const zksyncContract = await this.getMainContract();
        const parameters = { ...layer1TxDefaults(), ...params };
        parameters.gasPrice ??= await this._providerL1().getGasPrice();
        parameters.gasPerPubdataByte ??= REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT;

        return BigNumber.from(
            await zksyncContract.l2TransactionBaseCost(
                parameters.gasPrice,
                parameters.gasLimit,
                parameters.gasPerPubdataByte
            )
        );
    }
    ```
    :::

5. The return value is a 256-bit unsigned integer in hexadecimal representing the amount of gas the transaction uses.

    ```json
    {
        "jsonrpc": "2.0",
        "result": "0x25f64db",
        "id": 2
    }
    ```

6. Send the transaction, including the gas price and base cost in the value parameters, by calling the [`requestL2Transaction`](https://github.com/matter-labs/v2-testnet-contracts/blob/b8449bf9c819098cc8bfee0549ff5094456be51d/l1/contracts/zksync/interfaces/IMailbox.sol#L119) function.

    Include the gas limit value from step 3 as `_l2GasLimit` and the `REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT` constant as `_l2GasPerPubdataByteLimit`.

    The `_refundRecipient` address receives any remaining fee after the transaction completes. If `_refundRecipient = 0` then L2 `msg.sender` is used.

    ::: code-tabs
    @tab Solidity
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
    @tab TypeScript
    ```ts
    // Initiate L2 transfer via L1 and execute from zkSync Era wallet (or signer object)
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
    ```
    :::

    :::tip Solidity parameters description
    
    - `_contractL2`: L2 address of the contract to be called.
    - `_l2Value`: Amount of ETH to pass with the call to L2; used as `msg.value` for the transaction.
    - `_calldata`: Calldata of the transaction call; encoded the same way as in Ethereum.
    - `_l2GasLimit`: Gas limit of the transaction call obtained in step 3 above.
    - `_l2GasPerPubdataByteLimit`: Constant described in step 4 above.
    - `_factoryDeps`: Bytecodes array containing the bytecode of the contract being deployed. If the contract is a factory contract, the array contains the bytecodes of the contracts it can deploy.
    - `_refundRecipient`: Address that receives the rest of the fee after the transaction execution. If `refundRecipient == 0`, L2 `msg.sender` is used. 

    **Note**: If the `_refundRecipient` is a smart contract, then during the L1->L2 the `msg.sender` address is [aliased](#aliasing). 
    :::

7. Wait for a transaction response and output the details.

    :::info Responses
    - A **successful** L1 -> L2 transaction produces an `L2Log` with `key = l2TxHash`, and `value = bytes32(1)`.
    - A **failed** L1 -> L2 transaction produces an `L2Log` with `key = l2TxHash`, and `value = bytes32(0)`.
    :::

### Example code

TOCHECK::

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
    const calldata = '["from": "0xccf9d7d2f8be1f821cb8d9ec9553ffa92aa8fc4d",
                        "to": "0xfbb5fa2ea8c5fc6f492c0795564352f262f49f50", 
                        "data": "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000007",]';
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
