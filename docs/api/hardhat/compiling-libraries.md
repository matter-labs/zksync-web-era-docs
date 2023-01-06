# Compiling non-inlinable libraries

Solidity libraries can be divided into two categories:

- _Inlinable_. The ones that contain only `private` or `internal` methods. Since they can never be called from outside, the Solidity compiler inlines them, i.e. does not use external calls to access the library methods and uses the code of these libraries as part of the code that uses them.
- _Non-inlinable_. The ones that have at least one `public` or `external` method. While they may be inlined by the Solidity compiler, they are not inlined when compiled to Yul representation. Since Yul is an intermediate step when compiling to zkEVM bytecode, this means that these libraries can not be inlined by the zkSync compiler.

**Practically this means that libraries with public methods need to be deployed separately and their addresses passed as an argument when compiling the main contract.** Usage of the methods of this library will be replaced with calls to its address.

<TocHeader />
<TOC class="table-of-contents" :include-level="[2,3]" />

## OpenZeppelin utility libraries

Please note, that the total majority of the OpenZeppelin utility libraries _are_ inlinable. That means that _there is no need to do any further actions to make them compile_.

This section describes the compilation of non-inlinable libraries only.

## Example

Let's say that we have a small library that calculates the square of a number:

```solidity
pragma solidity ^0.8.0;

library MiniMath {
    function square(uint256 x) public pure returns (uint256) {
         return x*x;
    }
}
```

And there is a smart contract that uses this library

```solidity
pragma solidity ^0.8.0;

import "./MiniMath.sol";

contract Main {
    uint256 public lastNumber;

    function storeSquare(uint256 x) public {
        uint256 square = MiniMath.square(x);
        lastNumber = square;
    }
}
```

If you try to create a project with these two files following the guidelines from the [getting started](./getting-started.md) guide, the `yarn hardhat compile` command will fail with the following error:

```
Error in plugin @matterlabs/hardhat-zksync-solc: LLVM("Library `contracts/MiniMath.sol:MiniMath` not found")
```

That error tells us that the address of the `MiniMath` library should be provided.

To resolve the issue, you need to create _a separate project_, where only the library file will be located. After deploying _only_ the library to zkSync, you should get the address of the deployed library and pass it to the compiler settings. The process of deploying the library is the same as deploying a smart contract. You can learn how to deploy smart contracts on zkSync in the [getting started](./getting-started.md#write-and-deploy-a-contract) guide.

Let's say that the address of the deployed library is `0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC`. To pass this address to the compiler parameters, open the `harhdat.config.ts` file of the project where the `Main` contract is located and add the `libraries` section in the `zksolc` plugin properties:

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.2.2",
    compilerSource: "binary",
    settings: {
      libraries: {
        "contracts/MiniMath.sol": {
          MiniMath: "0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC",
        },
      },
    },
  },
  defaultNetwork: "zkTestnet",
  networks: {
    zkTestnet: {
      url: "https://zksync2-testnet.zksync.dev", // URL of the zkSync network RPC
      ethNetwork: "goerli", // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};
```

The address of the library is passed in the following lines:

```typescript
libraries: {
  'contracts/MiniMath.sol': {
    'MiniMath': '0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC'
  }
},
```

where `'contracts/MiniMath.sol'` is the location of the library's Solidity file and `MiniMath` is the name of the library.

Now, running `yarn hardhat compile` should successfully compile the `Main` contract.
