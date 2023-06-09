# Withdrawal to L1

:::tip
- To provide additional security during the Alpha phase, **withdrawals in zkSync Era take 24 hours**. 
- For more information, read the [withdrawal delay guide](../troubleshooting/withdrawal-delay.md).
:::

To withdraw ETH or ERC-20 tokens, use the following [Javascript SDK](../../api/js/README.md) scripts and call the `withdraw` method of the `Wallet` class.

## Withdraw ETH

### 1. Set up

??

### 2. Create the script

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

### 3. Run the script

??

### 4. Output

??

## Withdraw an ERC-20 token

### 1. Set up

??

### 2. Create the script

```ts
// Initialize the wallet.
const l1provider = new Provider(L1_RPC_ENDPOINT);
const l2provider = new Provider(L2_RPC_ENDPOINT);
const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

// withdraw ERC-20 token to L2
const withdrawErc20Handle = await wallet.withdraw({
  to: wallet.address,  // can bridge to a different address in L2
  token: TOKEN_ADDRESS,
  amount: ethers.utils.parseEther(AMOUNT), // assumes ERC-20 has 18 decimals
  // performs the ERC-20 approve action
  approveERC20: true,
});
console.log(`Withdraw ERC-20 transaction sent ${withdrawErc20Handle.hash}`);
```

### 3. Run the script

??

### 4. Output

??