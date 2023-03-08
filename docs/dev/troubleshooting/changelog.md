# 更改日志

## Hardhat插件更新（2023年2月24日）。

以下是已经发布的Hardhat插件。

- `hardhat-zksync-verify`版本`0.1.2`：现在返回一个验证ID，可用于查询智能合约的验证状态。更多信息[这里](https://era.zksync.io/docs/api/hardhat/hardhat-zksync-verify.html#verification-status-check)
- `hardhat-zksync-deploy`版本`0.6.2`：与最新版本的`zksync-web3`集成。
- `hardhat-zksync-chai-matchers`版本`0.1.1`：与最新版本的`zksync-web3`集成。

### 如何更新你的项目

在你项目的`package.json`文件中更新以下版本。

- 更新`@matterlabs/hardhat-zksync-verify`至`0.1.2`。
- 更新`@matterlabs/hardhat-zksync-deploy`到`0.6.2`。
- 更新 `@matterlabs/hardhat-zksync-chai-matchers` 到 `0.1.1`。

## 编译器和本地设置更新（2023年2月20日）

版本`1.3.5`的`zksolc`已经发布，本地设置的zksync docker镜像已经更新。详细内容。

- **编译器：**
  - 增加了对Solidity `0.8.18`的支持。
  - 修复了一个破损的优化标志，增加了编译合约的字节码大小。
  - 修复了一个将ERC20`transfer`调用检测为ETH`transfer`并产生一个编译错误的错误。
  - 检测智能合约中的`transfer'和`send'方法现在会返回一个警告信息（类似于`v1.3.1`）。新的警告信息提醒开发者，使用这些方法转移ETH可能会导致问题，并建议用`payable(address).call[value: <X>]("")`取代它们。
  - `transfer`可以用来转移其他代币（如ERC20）而没有任何问题，尽管这可能仍然被编译器强调。
- **本地设置docker镜像：**
  - 改进了估计气体请求时返回的zksync节点错误信息。

### 如何更新你的项目

- 将`hardhat.config.ts`文件中的编译器版本更新为`1.3.5`。
- 重新编译合约。
- 用`docker-compose pull`更新本地设置的docker镜像，并通过运行`./clear.sh`脚本重新启动其状态。

## 系统更新(2023年2月10日)

小规模更新，简化了收费模式以减少开销，并修复了一些错误。它要求将`zksync-web3`软件包更新到`v0.13.1`。

### 如何更新你的项目

- 更新`zksync-web3`到`v0.13.1`。
- 合同接口和API没有变化，所以不需要修改代码。
- 不使用`zksync-web3`而依靠`eth_signTypedData`来签署交易的项目，需要在交易覆盖中手动加入固定的`gasPerPubdataByteLimit`为`50000`。

## 系统更新 v1.3 (Feb 8th 2023)

这次更新对系统进行了一些修改，为 "Fair Onboarding Alpha "里程碑做准备。这些修改包括。

- 改造收费机制。
  - `ergs`已被替换为`gas`，以使其更容易理解（毕竟，我们都是以太坊生态系统的一部分）。
  - 气体退款：交易中未使用的气体会被退还。你可以看到这些退款作为代币转移[在探索者](https://explorer.zksync.io/)。
- 帐户抽象和Paymaster接口中的更新。
- L1和L2系统合同接口的变化。
- 在我们的SDK中，包含 "ergs "的方法和属性被重新命名为 "gas"，这是一个突破性的变化。
- API错误信息现在遵循Geth格式（更多更新即将到来）。

**这些更新是在系统再生之后进行的**。

### 如何更新你的项目

要更新你的项目，请遵循这些步骤。

- 更新你所有的项目依赖，同时继续使用`ethers v5.7.x`（因为`ethers v6.x`引入了额外的破坏性变化）。
- 删除 `artifacts-zk` 和 `cache-zk` 文件夹。
- 如果你使用本地设置来运行单元测试，用`docker-compose pull`更新docker镜像，并通过运行`./clear.sh`脚本重新启动本地设置状态。
- 用最新版本的二进制编译器（`v1.3.1`）重新编译你的项目。
- 更新`zksync-web3`到`0.13.x`。所有包含 "ergs "的方法都被重新命名为 "gas"，一些函数的签名也有变化。
- 如果你的项目使用zksync系统合约，请确保同时更新`@matterlabs/zksync-contracts`包。多个合同接口都有变化。
- 付费者。
  - 交易`customData`中的`ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT`应更新为`gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT`。
  - 在`validateAndPayForPaymasterTransaction`方法上进行交易验证后，自定义支付系统需要返回一个魔法值。如果验证成功，这个值应该是`ACCOUNT_VALIDATION_SUCCESS_MAGIC`（可在`IAccount.sol`接口上获得），如果验证失败，则是空值`bytes4(0)`。
- 如果你的项目使用账户抽象，请记住，`IAccount`接口已经改变。
  - [Account abstraction multisig](.../tutorials/custom-aa-tutorial.md) 教程已被更新，以反映接口的变化。
  - `prePaymaster`方法已更名为`prepareForPaymaster`。
  - 智能合约账户现在包括版本号，以便于未来的更新。当从AA工厂合约中调用`create2Account`时，应将其作为一个参数。
  - 账户需要在`validateTransaction`方法的交易验证后返回一个魔法值。如果验证成功，这个值应该是`ACCOUNT_VALIDATION_SUCCESS_MAGIC`（可在`IAccount.sol`接口上找到），如果验证失败，则是空值`bytes4(0)`。
- 如果你的智能合约使用`SystemContractsCaller`库中的任何方法（如`systemCall`），你需要在`zksolc`文件中`hardhat.config.ts`的`settings`部分将`isSystem`标志设置为`true`来编译它们。
- zkSync 系统合约有周期依赖，可能会导致用 `hardhat flatten` 平整合约的问题。使用[hardhat验证插件](././api/hardhat/hardhat-zksync-verify.md)来代替。
- 就像其他再生一样，它将删除所有的余额和合约，所以你需要再次存入资金并重新部署你的合约。

如果在做了这些改变之后，你仍然面临问题，请[在我们的Discord的 "dev-support-beta "频道中创建一个支持票](https://join.zksync.dev/)。

[Javascript SDK文档](.../.../api/js/getting-started.md)、[快速入门](.../building-onzksync/hello-world.md)和[账户抽象自定义](.../tutorials/custom-aa-tutorial.md) 教程已经更新，但**文档的一些其他部分还没有更新。如果你发现任何问题，请[联系我们](https://join.zksync.dev/)。
