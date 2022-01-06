# Event methods in zkSync

In zkSync, event methods are handled almost identically to the `ethers` RPC. For further information, see the related [Ethereum wiki](https://eth.wiki/json-rpc/API#eth_newfilter) documentation.

The one key differentiating factor in regards to methods in zkSync is being able to define a maximum `limit` of events that should be returned. 

Example:

```
export interface EventFilter {
    topics?: Array<string | Array<string> | null>;
    address?: Address | Array<Address>;
    limit?: number;
    fromBlock?: BlockTag;
    toBlock?: BlockTag;
    blockHash?: string;
}
```
