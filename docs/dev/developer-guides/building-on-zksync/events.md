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
While filtering, we advice to load events by block ranges (0-1999, 2000-3999, ...) and index the result on your end, else you will get an error that says "block range should be less than or equal to 2000".

These can be used in conjunction with the [Provider Events API](https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods) and with the [Contract Events API](https://docs.ethers.io/v5/api/contract/contract/#Contract--events).

## Getting the events

To get the events, use the following template:

```js
const ether = require("ethers");
const contractABI = require("./ABI_JSON")

const getEvent = async () => {
const contractAddress = "<YOUR ADDRESS>"
const provider = new ether.providers.WebSocketProvider(`wss://zksync2-testnet.zksync.dev/ws`)

const contract = new ether.ethers.Contract(contractAddress, contractABI, provider);

await contract.on("Transfer", (event) => {
    let info = {
        filter: { INDEXED_PARAMETER: VALUE },
        fromBlock: BLOCK_NUMBER, // e.g 15943000
        toBlock: BLOCK_NUMBER, // e.g 15943100
        data: event,
    }
    console.log(JSON.stringify(info, null, 4))
})
}

getEvent()

```

where

Provider — Your websocket provider through which you will retrieve the events data.
Contract address — The contract address whose events you want to track.
ABI — The ABI(Application Binary Interface) of the contract in JSON format.
Transfer — Any name you want to assign to print it at the end, for this sample, we used "Transfer".
Event name — The name of the event as defined in the smart contract.
Indexed parameter — The indexed parameter of the event.
Value — The value of the indexed parameter.
Block number — The block number range for the events retrieval.

**Note**: zkSync has a 10K log limit per response, however, if you receive a response with 10k events then there are more than 10k events in the block range, otherwise, there are less than 10k events. 


