# Contracts

`zksync-web3`没有实现任何新的`合同'类，因为`ethers.Contract`完全可以开箱工作。然而，为了方便起见，该库仍然重新导出了这个类。

由于在zkSync上部署智能合约与在Ethereum上部署智能合约有一些区别，因此需要一个特定的`ContractFactory`方法。它支持与`ethers.ContractFactory`相同的接口。

为了支付ERC20代币的智能合约互动，应该使用`customData`覆盖。你可以在[下一章](./features.md)中阅读更多关于访问zkSync功能的信息。

