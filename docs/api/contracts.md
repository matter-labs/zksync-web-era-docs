# L1合约接口

要从L1与zkSync交互，你需要它的规范桥的接口。有两种主要方式将其导入到你的代码库中。

- 通过从`@matterlabs/zksync-contracts` npm包中导入它。(首选)
- 通过从[repo]下载合约(https://github.com/matter-labs/v2-testnet-contracts)。

在Solidity和`zksync-web3`SDK中与zkSync典范桥互动的指南，可以在[这里](https://github.com/Emptytao/zksync-web-v2-docs/blob/main/docs/dev/developer-guides/bridging/l1-l2.md)找到。

本页将主要作为你可能需要的接口和类型的快速参考，以及如何导入它们。

## `@matterlabs/zksync-contracts`参考资料

- `@matterlabs/zksync-contracts/contracts/interfaces/IZkSync.sol`是zkSync L1合约接口`IZkSync`所在的文件。特别感兴趣的是`IBridge`功能。它的实现可以在[这里]（https://github.com/matter-labs/v2-testnet-contracts/blob/main/l1/contracts/zksync/interfaces/IZkSync.sol）找到。

> - `@matterlabs/zksync-contracts/libraries/Operations.sol`是存放`Operations`库的文件，其中包含桥上的所有用户类型。它的实现可以在[这里]（https://github.com/matter-labs/v2-testnet-contracts/blob/main/libraries/Operations.sol）找到。

存储库中的代码可能包含一些配置常量。这些是取自开发环境的占位值。你应该只为它所提供的接口和类型使用该库。
