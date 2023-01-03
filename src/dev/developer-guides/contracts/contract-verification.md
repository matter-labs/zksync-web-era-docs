# Verify contracts

## Verify smart contracts by using block explorer UI

Now that you have learned how to deploy your contracts, you might be interested to know how you can **verify** the contracts deployed on zkSync using the official block explorer. All the details about how to verify contracts can be found on the [block explorer](https://v2-docs.zksync.io/api/tools/block-explorer/contract-verification.html) page.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## Verify smart contracts with the hardhat-zksync-verify plugin

To use the hardhat-zksync-verify plugin first add it to your project by running `yarn add @matterlabs/hardhat-zksync-verify`
After that, define your network configuration ("testnet" in this case):

```typescript
networks: {
  testnet: {
    zksync: true,
    url: 'https://zksync2-testnet.zksync.dev',
    ethNetwork: 'goerli',
  }
}
```

By setting the `zksync` parameter to true when running verify task, you will be verifying smart contracts on the zkSync network, but since we support verify backward compatibility, you can also verify a smart contract directly on the Ethereum network within the same project. All you need to do is to specify your network with `zksync: false` settings and follow the rest of the [Etherscan verification instructions](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan).

### Parameters

To verify the contract, you need to provide the contract's address: </br>
`yarn hardhat verify --network <network> <contract address>`

With the `--contract` parameter you can also specify which contract from your local setup you want to verify by specifying its Fully qualified name. Fully qualified name structure looks like this: "contracts/AContract.sol:TheContract" </br>

Example: `yarn hardhat verify --network <network> <contract address> --contract <fully qualified name>`

This parameter is optional. If not specified, the verify task will try to compare compiled bytecode of all the contracts in your local setup to the deployed bytecode of the contract you are trying to verify. If there is no match, it will report an error.

### Constructor arguments

Constructor arguments are an optional positional parameter you can add if your contract was deployed with the specific constructor arguments. For example: <br/>
`yarn hardhat verify --network testnet 0x7cf08341524AAF292255F3ecD435f8EE1a910AbF "Hi there!"`

If your constructor takes a complex argument list, you can write a separate javascript module to export it. <br/>
For example, create an `arguments.js` file with the following structure:

```typescript
module.exports = [
  "a string argument",
  "0xabcdef",
  "42",
  {
    property1: "one",
    property2: 2,
  },
];
```

Include it in the verify function call by adding a new parameter: `--constructor-args arguments.js `
`yarn hardhat verify --network testnet 0x7cf08341524AAF292288F3ecD435f8EE1a910AbF --constructor-args arguments.js"`

## Verify smart contract programmatically

If you need to run the verification task directly from your code, you can use the hardhat "verify:verify" task with the previously mentioned parameters with the difference in using `--address` parameter when specifying contarct's address:<br/>

```typescript
await hre.run("verify:verify", {
  address: contractAddress,
  contract: contractFullyQualifedName,
});
```
