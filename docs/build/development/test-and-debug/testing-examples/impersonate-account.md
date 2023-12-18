# Impersonate Account

In testing and development, the need sometimes arises to impersonate or act on behalf of another account without actually knowing its private key. Hardhat provides methods to facilitate this. Below is an example that demonstrates the usage of these methods.

### **Impersonating Account**

**Test Description**: Demonstrates the capability to transfer funds from an account without knowing its private key using account impersonation methods provided by Hardhat.

**Arrange:**

- Create a random user wallet and connect it to the provider.
- Fetch the balance of a rich account you want to impersonate.

**Act:**

1. Start account impersonation using `hardhat_impersonateAccount` method.
2. Get the signer associated with the impersonated account.
3. Send a transaction from the impersonated account to the user wallet.
4. Stop the impersonation of the account using `hardhat_stopImpersonatingAccount` method.

**Assert:**

- Verify the balance of the user wallet to confirm the receipt of funds.
- Check the balance of the impersonated account to confirm the deduction of sent funds.

<details>

<summary>Impersonate account test</summary>

```typescript
describe("hardhat_impersonateAccount & hardhat_stopImpersonatingAccount", function () {
  it("Should allow transfers of funds without knowing the Private Key", async function () {
    // Arrange
    const userWallet = Wallet.createRandom().connect(provider);
    const beforeBalance = await provider.getBalance(RichAccounts[0].Account);

    // Act
    // Begin account impersonation
    await provider.send("hardhat_impersonateAccount", [RichAccounts[0].Account]);

    const signer = await ethers.getSigner(RichAccounts[0].Account);
    const tx = {
      to: userWallet.address,
      value: ethers.utils.parseEther("0.42"),
    };

    // Send a transaction from the impersonated account
    const receiptTx = await signer.sendTransaction(tx);
    await receiptTx.wait();

    // Stop impersonating the account
    await provider.send("hardhat_stopImpersonatingAccount", [RichAccounts[0].Account]);

    // Assert
    // Check that the balances have been updated accordingly
    expect(await userWallet.getBalance()).to.equal(ethers.utils.parseEther("0.42"));
    expect(await provider.getBalance(RichAccounts[0].Account)).to.equal(beforeBalance.sub(0.42));
  });
});
```

</details>

This test effectively demonstrates the capacity to simulate actions from any account, a feature that proves invaluable when emulating real-world interactions in a testing environment without access to account keys.
