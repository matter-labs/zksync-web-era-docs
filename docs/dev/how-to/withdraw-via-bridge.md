# Withdrawal to L1

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../troubleshooting/withdrawal-delay.md).
:::

Users must call the `withdraw` method on the L2 bridge contract, which will trigger the following actions:

- L2 tokens will be burned.
- An L2 -> L1 message with the information about the withdrawal will be sent.
- After that, the withdrawal action will be available to be finalized by anyone in the L1 bridge (by proving the inclusion of the L2 -> L1 message, which is done when calling the `finalizeWithdrawal` method on the L1 bridge contract).
- After the method is called, the funds are unlocked from the L1 bridge and sent to the withdrawal recipient.

::: warning
On the testnet environment, we automatically finalize all withdrawals, i.e., for every withdrawal, we will take care of it by making an L1 transaction that proves the inclusion for each message.
:::

### Withdraw scripts

To withdraw ETH or ERC20 tokens with [Javascript SDK](../../api/js/README.md), use the same scripts but call the `withdraw` method of the `Wallet` class.

To withdraw ETH use:

```ts
// Initialize the wallet.
const l1provider = new Provider(L1_RPC_ENDPOINT);
const l2provider = new Provider(L2_RPC_ENDPOINT);
const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

// withdraw ETH to L2
const withdrawHandle = await wallet.withdraw({
  to: wallet.address,  // can bridge to a different address in L2
  token: token: utils.ETH_ADDRESS,,
  amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals

});
console.log(`Withdraw ETH transaction sent ${withdrawHandle.hash}`);
```
To withdraw an ERC20 token use:

```ts

// Initialize the wallet.
const l1provider = new Provider(L1_RPC_ENDPOINT);
const l2provider = new Provider(L2_RPC_ENDPOINT);
const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

// withdraw ERC20 token to L2
const withdrawErc20Handle = await wallet.withdraw({
  to: wallet.address,  // can bridge to a different address in L2
  token: TOKEN_ADDRESS,
  amount: ethers.utils.parseEther(AMOUNT), // assumes ERC20 has 18 decimals
  // performs the ERC20 approve action
  approveERC20: true,
});
console.log(`Withdraw ERC20 transaction sent ${withdrawErc20Handle.hash}`);

```

## Custom bridges on L1 and L2

To build a custom bridge, create a regular Solidity contract which extends the correct interface for the layer. The interfaces provide access to the zkSync Era SDK deposit and withdraw implementations.

- L1: [IL1Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/interfaces/IL1Bridge.sol)

  For more information, check out our example [L1 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/ethereum/contracts/bridge/L1ERC20Bridge.sol).


- L2: [L2ERC20Bridge.sol](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol)

  For more information, check out our example [L2 custom bridge implementation](https://github.com/matter-labs/era-contracts/blob/main/zksync/contracts/bridge/L2ERC20Bridge.sol).
