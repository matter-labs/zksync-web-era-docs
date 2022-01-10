# L1/L2 interaction

This section provides description of the interface for interaction with zkSync from L1 (L2 -> L1 communication will be available later down the road). It assumes that you are already familiar with basic concepts of working with priority queue. If you are new to this topic, you can read the conceptual introduction [here](../zksync-v2/l1-l2-interop.md).

## L1 -> L2 communication

### Structure

Besides the input parameters of the operations, all of the requests contain the last two parameters: the `_queueType` and the `_opTree`. These are the important parts of the cencorship resistant protocol called [priority queue](../zksync-v2/l1-l2-interop#priority-mode). For the testnet alpha preview, these two values should be supplied as `0`.

In order to prevent the users from requesting too many heavy operations from the operator, the user must provide the fee to be paid to the zkSync operator in ETH. Each transaction has _basic cost_ in gas and the _tip fee_, that is equal to the basic cost of the tx substracted from the ETH value passed with the message.

Please note, that the basic costs are defined in gas and not in ETH, so the actual amount of ether which the submission of the tx will cost will depend on the tx gas price.

### Deposit

#### Getting the base cost

::: tip Deposit is free for now

For the time of the testnet, depositing funds to zkSync is free (the base cost is `0`), however, you should design your system (and especially L1 smart contracts) in a way that can be adapted in case the zkSync deposit base fee becomes non-zero.

The deposit base cost will be non-zero during priority mode, so it is crucial for long-term stability to keep in mind that deposit _may_ require fee.

:::

```
function depositBaseCost(
    uint256 gasPrice,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) public view returns (uint256)
```

- `gasPrice` is field which contains the tx gas price.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

The view function which returns the amount of ETH that is needed to be supplied by the user in order to cover the basecost of the transaction in ETH.

#### Interface

There are two separate methods used to bridging ETH and ERC-20 tokens from Ethereum to zkSync.

```
/// @param _amount ETH amount
/// @param _zkSyncAddress The receiver Layer 2 address
/// @param _queueType Type of data structure in which the priority operation should be stored
/// @param _opTree Priority operation processing type - Common or OnlyRollup
function depositETH(
    uint256 _amount,
    address _zkSyncAddress,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable nonReentrant
```

- `_amount` is a field which contains the number of ETH in wei to deposit. The rest of the suplied ETH is used to pay for the base cost of the transactions and the L2 tip.
- `_zkSyncAddress` is a field which specifies which address should the deposited funds go to.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

```
/// @param _token Token address
/// @param _amount Token amount
/// @param _zkSyncAddress Receiver Layer 2 address
/// @param _queueType Type of data structure in which the priority operation should be stored
/// @param _opTree Priority operation processing type - Common or OnlyRollup
function depositERC20(
    IERC20 _token,
    uint256 _amount,
    address _zkSyncAddress,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable nonReentrant
```

- `_token` is field which defines the address of the ERC-20 token to deposit the funds from. Please note that the zkSync smart contract should have the necessary allowance set before this method is be called!
- `_amount` is a field which contains the amount of the token to deposit.
- `_zkSyncAddress` is a field which specifies which address should the deposited funds go to.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

With the method call, some amount of ETH should be supplied to cover the base cost of the transaction + layer 2 tip.

#### Examples

**`zksync-web3`**

```ts

```

**`ethers`**

```ts

```

### AddToken

#### Getting the base cost

```
function addTokenBaseCost(
    uint256 _gasPrice,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) public view returns (uint256)
```

- `gasPrice` is field which contains the tx gas price.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

The view function which returns the amount of ETH that is needed to be supplied by the user in order to cover the basecost of the transaction in ETH.

#### Interface

```
/// @param _token Token address
/// @param _queueType Type of data structure in which the priority operation should be stored
function addToken(
    IERC20 _token,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable nonReentrant {
```

The `addToken` transaction is used to add a first-class citizen token to zkSync.

- `_token` is field which defines the address of the ERC-20 token to deposit the funds from.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

With the method call, some amount of ETH should be supplied to cover the base cost of the transaction + layer 2 tip.

#### Examples

**`zksync-web3`**

```ts

```

**`ethers`**

```ts

```

### Withdraw

#### Getting the base cost

```
function withdrawBaseCost(
    uint256 _gasPrice,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) public view returns (uint256)
```

- `gasPrice` is field which contains the tx gas price.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

The view function which returns the amount of ETH that is needed to be supplied by the user in order to cover the basecost of the transaction in ETH.

#### Interface

```
/// @param _token Token address
/// @param _to Address of account to withdraw funds to
/// @param _amount Amount of funds to withdraw
/// @param _queueType Type of data structure in which the priority operation should be stored
/// @param _opTree Priority operation processing type - Common or OnlyRollup
function requestWithdraw(
    address _token,
    uint256 _amount,
    address _to,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable nonReentrant {
```

The `Withdraw` transaction allows users to withdraw first-class citizen tokens to L1.

- `_token` is field which defines the address of the ERC-20 token to deposit the funds from.
- `_amount` is a field which contains the amount of the token to deposit.
- `_to` is a field which contains the address to which to withdraw the funds.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

With the method call, some amount of ETH should be supplied to cover the base cost of the transaction + layer 2 tip.

This operation will request a withdrawal of `_amount` of token with address `_token` from the `msg.sender` zkSync account to the `_to` address on L1.

#### Examples

**`zksync-web3`**

```ts

```

**`ethers`**

```ts

```

### Execute

#### Getting the base cost

```
function executeBaseCost(
    uint256 _gasPrice,
    uint256 _ergsLimit,
    uint32 _calldataLength,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) public view returns (uint256)
```

- `_gasPrice` is field which contains the tx gas price.
- `_ergsLimit` is field which contains the `ergs` limit of the transaction call. You can learn more about `ergs` and the zkSync fee system [here](../zksync-v2/fee-model).
- `_calldataLength` is field which contains the length of the calldata in bytes.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

The view function which returns the amount of ETH that is needed to be supplied by the user in order to cover the basecost of the transaction in ETH.

#### Interface

```
function requestExecute(
    address _contractAddressL2,
    bytes memory _calldata,
    uint256 _ergsLimit,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable nonReentrant
```

- `_contractAddressL2` is field which defines the address of the contract to be called.
- `_calldata` is field which contains the calldata of the transaction call.
- `_ergsLimit` is field which contains the `ergs` limit of the transaction call. You can learn more about `ergs` and the zkSync fee system [here](../zksync-v2/fee-model).
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

With the method call, some amount of ETH should be supplied to cover the base cost of the transaction + layer 2 tip.

#### Examples

**`zksync-web3`**

```ts

```

**`ethers`**

```ts

```

### Deploy Contract

#### Getting base cost

```
function deployContractBaseCost(
    uint256 _gasPrice,
    uint256 _ergsLimit,
    uint32 _bytecodeLength,
    uint32 _calldataLength,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) public view returns (uint256)
```

- `_gasPrice` is field which contains the tx gas price.
- `_ergsLimit` is field which contains the `ergs` limit of the transaction call. You can learn more about `ergs` and the zkSync fee system [here](../zksync-v2/fee-model).
- `_bytecodeLength` is field which contains the length of the bytecode in bytes.
- `_calldataLength` is field which contains the length of the calldata in bytes.
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

The view function which returns the amount of ETH that is needed to be supplied by the user in order to cover the basecost of the transaction in ETH.

#### Interface

```
function requestDeployContract(
    bytes memory _bytecode,
    bytes memory _calldata,
    uint256 _ergsLimit,
    Operations.QueueType _queueType,
    Operations.OpTree _opTree
) external payable
```

With the method call, some amount of ETH should be supplied to cover the base cost of the transaction + layer 2 tip.

- `_bytecode` is field which contains the bytecode of the contract to be deployed.
- `_calldata` is field which contains the contstructor calldata.
- `_ergsLimit` is field which contains the `ergs` limit of the transaction call. You can learn more about `ergs` and the zkSync fee system [here](../zksync-v2/fee-model).
- `_queueType` is parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.
- `_opTree` is a parameter required for the priority mode functionality. For the testnet, value `0` should always be supplied.

#### Examples

**`zksync-web3`**

```ts

```

**`ethers`**

```ts

```

## L2->L1 communication

Sending messages from zkSync to Ethereum is not yet available, but it will be implemented later.
