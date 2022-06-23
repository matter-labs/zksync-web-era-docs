# Handling of ETH and tokens

zkSync has no "native" token, and the fees can be paid in ETH or ERC20 tokens, but in order to have higher compatibility with Ethereum, we decided to preserve some special behaviour of ether.

On zkSync, `ETH` is a special token with address `0x000000000000000000000000000000000000800a`, though zero address (`0x0000000000000000000000000000000000000000`) is often used as an alias for it. It can only be transferred by providing `msg.value`, i.e. the same way it is done on Ethereum and it does _not_ expose the ERC20 contract interface.

Similar to other rollups, zkSync provides a native ETH bridge, while the rest of the bridges are built using L1<->L2 messaging. The team provides a generic ERC20 token bridge  
that can be used by anyone for bridging token to L2. More details on the bridges' architecture will be published soon.
