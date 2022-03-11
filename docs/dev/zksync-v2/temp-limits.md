# Current limitations

## Native ETH transfers

Support for native ETH transfers by passing `value` field to the transaction is not supported yet. As a consequence, `msg.value` is always equal to `0`.

## Using libraries in Solidity

If a Solidity library can be inlined, i.e. it only contains `private` or `internal` methods, then this library can be used without any limitations.

However, if a library contains at least one `public` or `external` method, it is no longer inlined in the Yul representation. These addresses need to be passed explicitly to our compiler. This is not currently supported by our hardhat plugin, but will be added later.

## Unsupported opcodes

#### Returning constant value

- `block.gaslimit` always returns `2^32-1`.
- `EXTCODESIZE` always returns `0xffff`.
- `MSIZE` always returns `2^16`.

#### Always returning zero

- `GASLIMIT` (`tx.gasprice`)
- `CALLVALUE` (`msg.value`)
- `ORIGIN` (`tx.origin`)
- `GASPRICE` (`tx.gasprice`)
- `CHAINID` (`chain_id`)
- `BLOCKHASH` (`tx.blockhash`)
- `DIFFICULTY` (`block.difficulty`)
- `PC`
- `BALANCE` (`address(addr).balance`)
- `SELFBALANCE` (`address(this).balance`)
- `COINBASE` (`block.coinbase`)
- `EXTCODEHASH` (`hash`)

#### NOOP

- `EXTCODECOPY`
- `SELFDESTRUCT` (`selfdestruct(addr)`)
- `CALLCODE` (`callcode`)
