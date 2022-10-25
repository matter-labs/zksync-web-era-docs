## Using zkEVM debugger

### Overview

The disadvantage of contract execution is that it is difficult to determine what a transaction did. A transaction receipt has a status code that indicates whether or not the execution was successful, but there is no way to determine what data was updated or which external contracts were triggered. This is remedied by zkSync zkEVM debugger, which replays the execution of your smart contracts and captures data on exactly what the EVM did, allowing you to examine each instruction.

The [debugger page](https://explorer.zksync.io/tools/debugger) can be accessed from the top menu.

![zkEVM!](../../../assets/images/zk-evm.png "zkEVM page")

### Debugging steps 

Here are the steps to follow to debug or trace a transaction:

1. Upload a JSON file:  Click on the `Upload JSON file` button and you will see a modal window with a saving prompt, or simply drag-and-drop the file into the upload dialog. To know the specification of the type of file, please read the [EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155).
2. File upload: A loader screen is shown to indicate that the trace file is loading.
3. At a successful upload the debugger state changes to an active state.
4. To proceed to debug, click on the `Start` button.

These are some **keyboard shortcuts** to note when debugging.
- `Cmd + K`: This opens the search bar.
- `Arrows Left / Right`: This takes you to the next or previous instruction.
- `Arrows Top / Bottom`: It takes you to the next previous function inside of this contract.
- `Shift + Arrows`: It takes you to the next or previous contract