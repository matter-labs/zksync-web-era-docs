# Contracts

`zksync-web3` does not implement any specifc `Contract` class, since the `ethers.Contract` fully works out of the box. However, for convenience, we still re-export this class.

Since deploying smart contracts has some difference from deploying on Ethereum, we need a specific `ContractFactory` method. It supports the same interface as `ethers.ContractFactory`.

In order to pay for smart contract interactions in ERC-20 tokens, `customData` override should be used. You can read more about accessing zkSync features in [the next chaper](./fees).
