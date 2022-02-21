# Compiling libraries

Solidity libraries can be divided into two categories:

- *Inlinable*. The ones that contain only `private` or `internal` methods. Since they can never be called from outside, Solidity compiler inlines them, e.g. uses the code of these libraries as part of the code that uses them.
- *Uninlinable*. The ones that have at least one `public` or `external` method. While they may be inlined by the Solidity compiler, they are not inlined when compiled to Yul representation. Since Yul is an intermediate step when compiling to zkEVM bytecode, this means that these libraries can not be inlined by zkSync compiler.   

Practically this means that uninlinable libraries need to be deployed separately and passed as an argument when compiling the main contract. Usage of the methods of this library will be replaced with calls to the address of it.

## Example

Let's say that we have a small library that calculates the square of a number:

```sol
library
```

