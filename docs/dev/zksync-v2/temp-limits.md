# Temporary limitations

## Native ETH transfers 

Support for native ETH transfers by passing `value` field to the transaction is not supported yet. As a consequence, `msg.value` is always equal to `0`. Dealing with native ETH is an important part of some protocols and it will be implemented in the future for backward compatibility.

## WebSocket support

Currently, WebSocket connection is not supported by zkSync.

## Unsupported opcodes

#### Returning constant value

- `block.gaslimit` always returns `2^32-1`.

#### Always returning zero

- `GASLIMIT` (`tx.gasprice`)
- `CALLVALUE` (`msg.value`)
- `MSIZE`
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
