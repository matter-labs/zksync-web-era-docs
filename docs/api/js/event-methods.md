# Event methods in zkSync

In zkSync, event methods are handled almost identically to the `ethers` RPC. For further information, see the related [Ethereum wiki](https://eth.wiki/json-rpc/API#eth_newfilter) documentation.

In `ethers`, events only require two fields; `topics?:` and `address?:`. ZkSync utilises 4 additional fields. Aside from `limit?:`, which is specific to zkSync, they are also [present in `ethers`](https://eth.wiki/json-rpc/API#parameters-45):

#####     `limit?: number;`
Defines the maximum limit of events that should be returned. This is the only additional field that is exclusive to zkSync.

##### `fromBlock?: BlockTag;` 
(optional, default: "latest") Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions.

##### `toBlock?: BlockTag;`
(optional, default: "latest") Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions.

##### `blockHash?: string;`
Restricts the logs returned to the single block with the 32-byte hash `blockHash`.


Full example:

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
