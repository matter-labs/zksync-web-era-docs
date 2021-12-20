# Communication with L1

::: tip To be changed soon

The version of the L1 <-> L2 communication described here does not support arbitrary calls from L1 to L2. This feature is almost ready and will be shipped soon with the new more detailed documentation to it.

:::

## Bridging native tokens to and from Ethereum

Besides being responsible for block processing, the main zkSync contract also serves as the canonical bridge, which should be the default for all deposits/withdrawals of native tokens.

### SDK

All of the following methods are already supported conveniently in our [JavaScript SDK](../api/js).

### Bridging ETH to zkSync

To bridge ETH to zkSync, you should call the following function of the zkSync smart contract:

```    
/// @notice Deposit ETH to Layer 2 - transfer ether from user into contract, validate it, register deposit
/// @param _zkSyncAddress The receiver Layer 2 address
function depositETH(address _zkSyncAddress) external payable
```

All the passed `ETH` will go to the new address. Please note that this will not be the case in future architecture, where some of `ETH` will go to the operator.

### Bridging ERC20 to zkSync

To bridge ERC20 tokens to zkSync, you should call the following function of the zkSync smart contract:

```
/// @notice Deposit ERC20 token to Layer 2 - transfer ERC20 tokens from user into contract, validate it, register deposit
/// @param _token Token address
/// @param _amount Token amount
/// @param _zkSyncAddress Receiver Layer 2 address
function depositERC20(
    IERC20 _token,
    uint256 _amount,
    address _zkSyncAddress
) external
```

Make sure to set the allowance for the zkSync smart contract at least the size of `amount`.


### Adding native tokens to zkSync

To add a new native token to zkSync, you should call the following function of the zkSync smart contract:

```
/// @notice Add token to the list of networks tokens
/// @param _token Token address
function addToken(address _token) external
```

## Calling contract methods from L1

Any L2 transaction can also be called from Ethereum. This feature is ready on zkSync side and will be available very soon as a part of the testnet.

## L2 -> L1 communication

Sending messages from zkSync to Ethereum mainnet is not yet available, but it will be implemented later.
