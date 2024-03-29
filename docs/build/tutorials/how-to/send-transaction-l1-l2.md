---
head:
  - - meta
    - name: "twitter:title"
      content: Send an L1 to L2 Transaction | zkSync Docs
---

# Send an L1 to L2 transaction

The [zkSync Era smart contracts](https://github.com/matter-labs/era-contracts/tree/main/l1-contracts/contracts/zksync) allow the sender to request transactions on Ethereum L1 and pass data to zkSync Era L2.

## Common use cases

Along with zkSync Era's built-in censorship resistance that requires multi-layer interoperability, there are some common use cases that need L1 to L2 transaction functionality, such as:

- Custom bridges.
- Multi-layer governing smart contracts.

## Step-by-step

1. Import the zkSync Era library or contract containing the required functionality.

   The import gives access to the [`IZkSync.sol`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/zksync/interfaces/IZkSync.sol) inherited interfaces that include the gas estimation functionality.

   You can do it using yarn (recommended), or [download the contracts](https://github.com/matter-labs/era-contracts) from the repo.

   ::: code-tabs
   @tab yarn

   ```yarn
   yarn init -y
   yarn add -D @matterlabs/zksync-contracts
   ```

   :::

2. Get the current L1 gas price with Ethereum JSON-RPC method [`eth_gasPrice`](https://ethereum.github.io/execution-apis/api-documentation/) called with the [Ethers implementation](https://github.com/ethers-io/ethers.js/blob/f97b92bbb1bde22fcc44100af78d7f31602863ab/packages/providers/src.ts/base-provider.ts#L1428).

   ::: code-tabs
   @tab TypeScript

   ```ts
   async getGasPrice(): Promise<BigNumber> {
       await this.getNetwork();

       const result = await this.perform("getGasPrice", { });
       try {
           return BigNumber.from(result);
       } catch (error) {
           return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
               method: "getGasPrice",
               result, error
           });
       }
   }
   ```

   :::

3. Apply an alias to the addresses in the request if the sender address is a contract.

   If the sender is an EOA, no aliasing is required. Aliasing is implemented by the [`applyL1ToL2Alias`](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l1-contracts/contracts/vendor/AddressAliasHelper.sol#L28) Solidity function and called by the [JavaScript SDK](https://github.com/zksync-sdk/zksync-ethers/blob/28d83cd7f0a8e2978c73f79867143c8e5e7e005f/src/utils.ts#L381).

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

4. Call the JSON-RPC method [`zks_estimateGasL1toL2`](../../api.md#zks-estimategasl1tol2), wrapping the transaction data in a `CallRequest` JSON object parameter.

   The method returns the amount of gas required for the transaction to succeed.

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

5. Get the base cost by calling the [`l2TransactionBaseCost`](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l1-contracts/contracts/zksync/interfaces/IMailbox.sol#L131) function with:

   - The gas price returned at step 2 as `_gasPrice`.
   - The gas value returned at step 3 as `_l2GasLimit`.
   - A constant representing how much gas is required to publish a byte of data from L1 to L2 as `_l2GasPerPubdataByteLimit`. At the time of writing, the JavaScript API provides this constant as [`REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT`](../../sdks/js/utils.md#gas).

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

6. The return value is a 256-bit unsigned integer in hexadecimal representing the amount of gas the transaction uses.

   ```json
   {
     "jsonrpc": "2.0",
     "result": "0x25f64db",
     "id": 2
   }
   ```

7. Send the transaction, including the gas price and base cost in the value parameters, by calling the [`requestL2Transaction`](https://github.com/matter-labs/era-contracts/blob/87cd8d7b0f8c02e9672c0603a821641a566b5dd8/l1-contracts/contracts/zksync/interfaces/IMailbox.sol#L121) function.

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

   **Note**: If the `_refundRecipient` is a smart contract, then during the L1 to L2 transaction its address is aliased.
   :::

8. Wait for a transaction response and output the details.

   :::info Responses

   - A **successful** L1 to L2 transaction produces an `L2Log` with `key = l2TxHash`, and `value = bytes32(1)`.
   - A **failed** L1 to L2 transaction produces an `L2Log` with `key = l2TxHash`, and `value = bytes32(0)`.
     :::

### Example code

User needs to perform next steps:

1. Run local node dockerized containers. [`Instructions how to run it`](../../test-and-debug/dockerized-l1-l2-nodes.md) or use [`zksync-cli`](https://github.com/matter-labs/zksync-cli):

```npx
  npx zksync-cli dev config
  // choose: Dockerized node - Persistent state, includes L1 and L2 nodes
  // choose: BE and Portal (optional)
  npx zksync-cli dev start
```

2. In the root folder of the imported project (step 1) create `file.js` and insert there code from example below
3. In the root folder add `.env` file with private key of wallet to use

```js
"RICH_WALLET_PRIV_KEY=0x..";
```

4. Add script to package.json file next script:

```js
`"scripts": {  "run": "node file.js"},``"type": "module",`;
```

5. Run `npm i --save-dev ethers` (in case it is not installed)
6. Run command `npm run`

Please note, that if you want to run on local-node Dockerized setup use next `hardhat.config.ts`:

```js
export const zkSyncTestnet = {
  url: "https://localhost:3051",
  ethNetwork: "https://localhost:8545",
  zksync: true,
};
```

For Testnet (recommended):

```js
export const zkSyncTestnet = {
  url: "https://sepolia.era.zksync.dev",
  ethNetwork: "https://rpc.ankr.com/eth_sepolia",
  zksync: true,
};
```

And also insert same credentials in `file.js`:

```js
const L1_RPC_ENDPOINT = "<insert network config here>"; //ethNetwork from instruction above
const L2_RPC_ENDPOINT = "<insert network config here>"; //url from instruction above
```

### Example code

::: code-tabs
@tab TypeScript

```js
import { Contract, Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// Greeter contract ABI for example
const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_greeting",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "greet",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_greeting",
        type: "string",
      },
    ],
    name: "setGreeting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// HTTPS RPC endpoints (from local node)
const L1_RPC_ENDPOINT = "http://localhost:8545";
const L2_RPC_ENDPOINT = "http://localhost:3050";

const WALLET_PRIV_KEY = process.env.RICH_WALLET_PRIV_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key is not configured in env file");
}

const L2_CONTRACT_ADDRESS = "0x..."; //

async function main() {
  console.log(`Running script for L1-L2 transaction`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  // console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  // retrieve L1 gas price
  const l1GasPrice = await l1provider.getGasPrice();
  console.log(`L1 gasPrice ${ethers.utils.formatEther(l1GasPrice)} ETH`);

  const contract = new Contract(L2_CONTRACT_ADDRESS, ABI, wallet);

  const msg = await contract.greet();

  console.log(`Message in contract is ${msg}`);

  const message = `Updated at ${new Date().toUTCString()}`;

  const tx = await contract.populateTransaction.setGreeting(message);

  // call to RPC method zks_estimateGasL1ToL2 to estimate L2 gas limit
  const l2GasLimit = await l2provider.estimateGasL1(tx);

  console.log(`L2 gasLimit ${l2GasLimit.toString()}`);

  const baseCost = await wallet.getBaseCost({
    // L2 computation
    gasLimit: l2GasLimit,
    // L1 gas price
    gasPrice: l1GasPrice,
  });

  console.log(`Executing this transaction will cost ${ethers.utils.formatEther(baseCost)} ETH`);

  const iface = new ethers.utils.Interface(ABI);
  const calldata = iface.encodeFunctionData("setGreeting", [message]);

  const txReceipt = await wallet.requestExecute({
    contractAddress: L2_CONTRACT_ADDRESS,
    calldata,
    l2GasLimit: l2GasLimit,
    refundRecipient: wallet.address,
    overrides: {
      // send the required amount of ETH
      value: baseCost,
      gasPrice: l1GasPrice,
    },
  });

  console.log("L1 tx hash is :>> ", txReceipt.hash);

  txReceipt.wait();
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
```

@tab Solidity

```solidity
// in progress
```

:::
