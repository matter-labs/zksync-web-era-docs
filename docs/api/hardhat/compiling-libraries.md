# 编译不可连接的库

Solidity 库可以被分为两类。

- _Inlinable_. 那些只包含 "私有 "或 "内部 "的方法。由于它们永远不能从外部调用，Solidity 编译器内联它们，即不使用外部调用来访问库的方法，并将这些库的代码作为使用它们代码的一部分。
- _Non-inlinable_. 那些至少有一个 "公共 "或 "外部 "的方法。虽然它们可能被 Solidity 编译器内联，但在编译为 Yul 表示时，它们不会被内联。由于Yul是编译为zkEVM字节码时的一个中间步骤，这意味着这些库不能被zkSync编译器内联。

**实际上，这意味着具有公共方法的库需要单独部署，并在编译主合约时将其地址作为参数传递。**使用该库的方法将被替换为对其地址的调用。

## OpenZeppelin实用库

请注意，大多数OpenZeppelin实用程序库都是可内联的。这意味着_不需要做任何进一步的操作来使它们被编译_。

这一节只描述了不可内联的库的编译情况。

## 示例

假设我们有一个计算数字平方的小库。

```solidity
pragma solidity ^0.8.0;

library MiniMath {
    function square(uint256 x) public pure returns (uint256) {
         return x*x;
    }
}
```

而有一个智能合约，使用了这个库

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

如果你试图按照[getting started](./getting-started.md)指南中的指导方针用这两个文件创建一个项目，`yarn hardhat compile`命令会失败，并出现以下错误。

```
Error in plugin @matterlabs/hardhat-zksync-solc: LLVM("Library `contracts/MiniMath.sol:MiniMath` not found")
```

这个错误告诉我们，应该提供`MiniMath`库的地址。

为了解决这个问题，你需要创建一个单独的项目，其中只有库文件。在向zkSync部署_只有库之后，你应该获得部署的库的地址，并将其传递给编译器设置。部署库的过程与部署智能合约的过程是一样的。你可以在[入门](./getting-started.md#write-and-deploy-a-contract)指南中了解如何在zkSync上部署智能合约。

假设部署库的地址是`0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC`。为了把这个地址传递给编译器参数，打开`Main`合约所在的项目的`harhdat.config.ts`文件，在`zksolc`插件属性中添加`libraries`部分。

```typescript
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

module.exports = {
  zksolc: {
    version: "1.3.1",
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

库的地址在以下几行中传递。

```typescript
libraries: {
  'contracts/MiniMath.sol': {
    'MiniMath': '0xF9702469Dfb84A9aC171E284F71615bd3D3f1EdC'
  }
},
```

其中`contract/MiniMath.sol`是库的Solidity文件的位置，`MiniMath`是库的名称。

现在，运行 "yarn hardhat compile "应该能成功编译 "Main "合约。
