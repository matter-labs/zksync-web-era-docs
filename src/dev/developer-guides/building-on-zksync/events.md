# Handling events

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Overview 
Events are a mechanism to publish information to listeners outside the blockchain, given that smart contracts themselves can't read them.

Blockchains are public by design, and therefore make all information available to the public, and any actions can be discovered by carefully looking into the transactions. Events are a shortcut for making specific information easily available for external systems; they let dApps keep track of, and respond to what's happening to a smart contract. They can also be searched for because they are indexable. Therefore, you should emit an event anytime something occurs in your smart contract that some system outside the blockchain should be aware of so that the outside system may listen for such occurrences. 
Events are included in the transaction logs of the same block containing the original transaction.

At zkSync, events behave the same way as in Ethereum.

## Events filtering

Filtering is used to query indexed data and provide lower-cost data storage when the data is not required to be accessed on-chain.
When filtering, you should load events by block ranges (0-1999, 2000-3999, ...) and index the result on your end. Otherwise you will get an error that says "block range should be less than or equal to 2000".

These can be used in conjunction with the [Provider Events API](https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods) and with the [Contract Events API](https://docs.ethers.io/v5/api/contract/contract/#Contract--events).

## Getting the events

Here is an example to listen for smart contract events:

```js
import * as ethers from "ethers";
const contractABI = require("./ABI_JSON")

const listenEvents = async () => {
  const contractAddress = "<CONTRACT_ADDRESS>"
  const provider = new ether.providers.WebSocketProvider(`wss://zksync2-testnet.zksync.dev/ws`)

  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
  // starts listening to Transfer events on contract
  contract.on("Transfer", (event) => {
    // optional filter parameters
    let options = {
        filter: { INDEXED_PARAMETER: VALUE }, // e.g { from: '0x48c6c0923b514db081782271355e5745c49wd60' }
        fromBlock: START_BLOCK_NUMBER, // e.g 15943000
        toBlock: END_BLOCK_NUMBER, // e.g 15943100
        data: event,
    }
    console.log(JSON.stringify(options, null, 4))
  })
}

listenEvents()

```


- Provider: Your websocket provider through which you will retrieve the events data. Note that you need to use the websocket endpoint.
- Contract address: The contract address whose events you want to track.
- ABI: The ABI (Application Binary Interface) of the contract in JSON format.
- Event name: The name of the event as defined in the smart contract. In this example we used the "Transfer" event from an ERC20 contract.
- Indexed parameter : The indexed parameter of the event.
- Block number: The block number range for the events retrieval, it involves the `START_BLOCK_NUMBER` and the `END_BLOCK_NUMBER`.

**Note**: zkSync has a 10K log limit per response. This means that if you receive a response with 10k events, it will most likely contain additional events so it'd be a good idea to adjust the filters to retrieve the events in multiple batches.


