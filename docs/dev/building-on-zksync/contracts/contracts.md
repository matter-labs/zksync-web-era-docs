# 智能合约开发

zkSync Era允许开发者使用与在以太坊上构建的相同的编程语言和工具来构建项目。

## Solidity支持

  目前支持Solidity `>=0.4.10`版本，尽管**我们强烈建议使用** `^0.8.0`，因为旧版本包含已知的错误。

  Solidity版本`>=0.8`是通过Yul编译的，而`<=0.7`是通过EVM遗留汇编编译的，由于控制流和调用图的混淆，它是一个不太友好的IR。由于这个原因，zkSync 对用 Solidity `<=0.7`编写的合约有一些限制。

- 不支持合同的本地递归。

- 不支持内部函数指针。

- 对合约大小和虚拟机周期数可能有影响。
  
  ### 在 Solidity 中使用库
  
  zkSync Era支持在Solidity中使用库，但要注意以下几点。

- 如果一个Solidity库可以被内联（即它只包含 "private "或 "internal "方法），它可以被使用而不需要任何额外配置。

- 然而，如果一个库至少包含一个 "公共 "或 "外部 "方法，它就是不可内联的，其地址需要明确传递给编译器。你可以了解更多关于[如何在本节文档中编译不可内联的库](.../.../api/hardhat/compiling-libraries.md)。
  
  ## Vyper支持
  
  目前只支持Vyper `^0.3.3`。
  
  ## 编译器
  
  尽管你可以用Solidity和Vyper编写智能合约，但将这些合约编译成我们的zkEVM字节码需要特殊的编译器。

- [zksolc](https://github.com/matter-labs/zksolc-bin)。Solidity编译器。

- [zkvyper](https://github.com/matter-labs/zkvyper-bin)。Vyper编译器。
  
  **我们的编译器是基于LLVM的**。基于LLVM的编译器已经成为行业标准，因为它们的健壮性、效率和世界各地的大型社区。它们为我们提供了一些额外的优势。

- 使我们能够比原来的EVM字节码提高效率，因为通过LLVM，我们可以利用这个成熟的生态系统中的许多优化和工具。

- 为我们增加支持整合用其他编程语言编写的代码库与LLVM前端铺平道路。通过这样做，开发人员可以以目前不可能的方式构建dApps和使用区块链。
  
  我们建议通过[其对应的Hardhat插件](.../.../.../api/hardhat/plugins.md)使用这些编译器（尽管它们也可以作为二进制文件使用）。这些插件应该被添加到Hardhat的配置文件中，并允许开发人员编译新项目或将现有项目迁移到zkSync Era。
  
  ::: warning
  
  编译器不再作为Docker镜像发布，不再推荐使用它。使用`compilerSource: "binary"`在Hardhat配置文件中使用二进制文件来代替。
  
  :::
  
  **在下面的链接中了解更多关于如何安装和配置这些插件：**

- [hardhat-zksync-solc documentation](./././api/hardhat/hadhat-zksync-solc.md)

- [hardhat-zksync-vyper documentation](./././api/hardhat/hardhat-zksync-vyper.md)
  
  ## EVM兼容性
  
  几乎所有为EVM编写的智能合约都将被zkSync Era支持，并将持有所有关键的安全不变性，因此在大多数情况下不需要额外的安全重新审核。一个值得注意的例外是使用以下EVM操作码的合约。

- `SELFDESTRUCT` - 它被认为是有害的，在[EIP-6049](https://eips.ethereum.org/EIPS/eip-6049)中被废弃。

- `CALLCODE` - 它在以太坊的[EIP-2488](https://eips.ethereum.org/EIPS/eip-2488)中被弃用，转而使用`DELEGATECALL`。

- `EXTCODECOPY` - 我们暂时跳过它，因为zkEVM的操作码与EVM的操作码不一样，但如果需要，可以实现它。

- `CODECOPY` - 在部署代码中用`CALLDATACOPY`代替。

- `PC` - 在Yul和Solidity `>=0.7.0`中不能访问。在Solidity `0.6.0`中可以访问，尽管它产生一个运行时错误。
  
  **所有这些操作码在编译时产生错误**。
  
  还有一些其他的区别，例如，气体计量将是不同的（其他L2也是如此）。EVM的一些加密预编译（特别是配对和RSA）不会在第一个版本中提供，但在推出后不久就会实现，其中配对是一个优先事项，以允许超链和Aztec/Dark Forest等协议也不需要修改就可以部署。
  
  以太坊加密基元，如 "ecrecover"、"keccak256 "和 "sha256 "都支持预编译。你不需要采取任何行动，因为所有对预编译的调用都是由引擎盖下的编译器完成的。
  
  ### 其他注意事项
  
  - **tx.origin的用法**： `tx.origin`是Solidity的一个全局变量，用于返回发送交易的账户地址。它在 zkSync Era 上被支持，但是如果一个自定义的账户与使用这个的合约互动，交易将会失败。我们也不鼓励使用它，因为它可能会对网络钓鱼攻击构成威胁，使合同的所有资金流失。阅读更多关于 [tx.origin 钓鱼和其他漏洞](https://hackernoon.com/hacking-solidity-contracts-using-txorigin-for-authorization-are-vulnerable-to-phishing)
  
  - **ecrecover的用法**：如果你使用'ecrecover'来验证用户账户的签名，请注意，zkSync Era带有本地账户抽象支持。强烈建议不要依赖账户有ECDSA私钥附加的事实，因为他们可能被multisig统治并使用另一种签名方案。阅读更多关于 [zkSync账户抽象支持](.../.../developer-guides/aa.md)
