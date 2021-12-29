# Handling of ETH and tokens

zkSync has no "native" token, and the fees can be paid in ERC20 tokens. `ETH` is an ERC20 token with address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`. In order to allow easy and secure bridging of ERC20 tokens between layer 1 and layer 2, zkSync provides a canonical bridge within its smart contract. Tokens that are bridged this way have the same address on zkSync as on layer 1 and all of them have the same standard ERC20 smart contract code on layer 2.

We call such tokens _native_ or _first-class citizen_, since they are managed on the protocol level. Anyone can, in a permissionless way, add a new native token to zkSync. While technically any of these tokens can be used to pay transaction fees, the operator may decide which tokens it accepts for fee payment (one possible reason to decline a token for fee payment is to remove the chance of exploitation using worthless, recently created ERC20 tokens).
