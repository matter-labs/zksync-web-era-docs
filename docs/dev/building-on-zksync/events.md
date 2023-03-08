# 处理事件

## 概述

事件是一种向区块链外的听众发布信息的机制，因为智能合约本身不能阅读它们。

区块链在设计上是公开的，因此向公众提供了所有的信息，任何行动都可以通过仔细研究交易来发现。事件是使外部系统容易获得特定信息的捷径；它们让dApps跟踪，并对智能合约发生的事情做出反应。它们也可以被搜索到，因为它们是可索引的。因此，当你的智能合约中发生了一些区块链以外的系统应该知道的事情时，你应该发射一个事件，以便外部系统可以监听此类事件的发生。
事件被包含在包含原始交易的同一区块的交易日志中。

在zkSync，事件的行为与Ethereum中相同。

## 事件过滤

过滤用于查询索引数据，并在不需要在链上访问数据时提供低成本的数据存储。
在过滤时，你应该按区块范围（0-1999，2000-3999，......）加载事件，并在你的终端对结果进行索引。否则你会得到一个错误，说 "块范围应小于或等于2000"。

这些可以与[供应商事件API](https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods)和[合同事件API](https://docs.ethers.io/v5/api/contract/contract/#Contract--events)一起使用。

## 获取事件

下面是一个监听智能合约事件的例子。

```  js
import * as ethers from "ethers";
const contractABI = require("./ABI_JSON");

const listenEvents = async () => {
  const contractAddress = "<CONTRACT_ADDRESS>";
  const provider = new ether.providers.WebSocketProvider(`wss://zksync2-testnet.zksync.dev/ws`);

  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  //开始监听合同上的传输事件
  contract.on("Transfer", (event) => {
    // 可选的过滤参数
    let options = {
      filter: {INDEXED_PARAMETER: VALUE }, // e.g { from: '0x48c6c0923b514db081782271355e5745c49wd60' }
      fromBlock: START_BLOCK_NUMBER, // e.g 15943000
      toBlock: END_BLOCK_NUMBER, // e.g：15943100
      data: event,
   };
    console.log(JSON.stringify(options, null, 4))。
  });
};

listenEvents();
```

- Provider:你的websocket提供者，你将通过它检索事件数据。注意，你需要使用websocket端点。
- Contract address: 你想跟踪其事件的合同地址。
- ABI: JSON格式的合同ABI（应用二进制接口）。
- Event name：智能合约中定义的事件名称。在这个例子中，我们使用了ERC20合约的 "转移 "事件。
- Indexed parameter：事件的索引参数。
- Block number。检索事件的区块号码范围，它包括`START_BLOCK_NUMBER`和`END_BLOCK_NUMBER`。

**注意**：zkSync对每个响应有10K的日志限制。这意味着，如果你收到一个有10K事件的响应，它很可能包含额外的事件，所以调整过滤器以分批检索事件是一个好主意。

