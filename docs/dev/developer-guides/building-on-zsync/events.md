# zkSync Events

## Overview 
Events are a way to publish actions to listeners outside the blockchain, this is because smart contracts themselves cannot listen to any events.

All information in the blockchain is public and any actions can be found by looking into the transactions closely enough but events are a shortcut to ease the development of outside systems in cooperation with smart contracts, they allow Dapps to monitor and react to what's happening to a smart contract. They are also indexable, meaning you can search for them. So whenever something happens within your smart contract that some system outside the blockchain should know about you should emit an event and the outside system can listen for such events.
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
