# zkSync Events

## Overview 
Given that smart contracts themselves cannot listen to any events, events are a mechanism to publish actions to listeners outside the blockchain.

The blockchain makes all information available to the public, and any actions can be discovered by carefully looking into the transactions, but events are a shortcut for making the development of external systems work with smart contracts; they let Dapps keep track of and respond to what's happening to a smart contract. They can also be searched for because they are indexable. Therefore, you should emit an event anytime something occurs in your smart contract that some system outside the blockchain should be aware of so that the outside system may listen for such occurrences. 
Events are included in the transaction logs of the same block that fired the event.

zkSync events in terms of their operations are quite similar to Ethereum.

## Events filtering

Filtering is used to query indexed data and provide lower-cost data storage when the data is not required to be accessed on-chain.

These can be used in conjunction with the [Provider Events API](https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods) and with the [Contract Events API](https://docs.ethers.io/v5/api/contract/contract/#Contract--events).



```solidity
    abi = [
  "event Transfer(address indexed src, address indexed dst, uint val)"
];

contract = new Contract(tokenAddress, abi, provider);

// List all token transfers *to* myAddress:
contract.filters.Transfer(null, myAddress)
//{
//    "jsonrpc":"2.0",
//   "id":1,
//    "method":"eth_getLogs",
//    "params":[{
//       "fromBlock": "0x8e8e6",
//        "toBlock": "0x8e8e6",
//        "topics": [["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]]
//    }]
//}

```
zkSync returns a 10K logs limit per response.
