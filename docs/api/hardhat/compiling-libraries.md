# Compiling libraries

Solidity libraries can be divided into two categories:

- *Inlinable*. The ones that contain only `private` or `internal` methods. Since they can never be called from outside, Solidity compiler inlines them, e.g. uses the code of these libraries as part of the code that uses them.
- *Uninlinable*. The ones that have at least one `public` or `external` method. While they may be inlined by the Solidity compiler, they are not inlined when compiled to Yul representation. Since Yul is an intermediate step when compiling to zkEVM bytecode, this means that these libraries can not be inlined by zkSync compiler.   

Practically this means that uninlinable libraries need to be deployed separately and passed as an argument when compiling the main contract. Usage of the methods of this library will be replaced with calls to the address of it.

## OpenZeppelin utility libraries

Please note, that the total majority of the OpenZeppelin utility libraries *are* inlinable. That means that *there is no need to do any further actions to make them compile*. 

This section describes compilation of uninlinable libraries only.

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

```soliditiy
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

If you try to create a project with these two files following the guidelines from the [getting started](./getting-started.md) section, you will notice that `yarn hardhat compile` will fail with the following error:

```
Error in plugin @matterlabs/hardhat-zksync-solc: LLVM("Library `contracts/MiniMath.sol:MiniMath` not found")
```

That error tells us that the address of the `MiniMath` library should be provided.
