# Time Change

This document presents a series of test examples centred around time manipulation in the zkSync Era environment. Each example highlights a unique scenario, ensuring developers understand how to simulate specific blockchain states.

:::info
To utilize these methods, you need to run tests against `era_test_node`.
:::

### **Mining a Single Block**

**Test Description**: Verifies if a single block is mined when triggering the `evm_mine` command.

- **Arrange**: Fetch the current block from the blockchain.
- **Act**: Mine a new block using the `evm_mine` method.
- **Assert**: Confirm that the block number has incremented by one.

<details>

<summary>evm_mine test</summary>

```typescript
describe("evm_mine", function () {
  it("Should mine one block", async function () {
    // Arrange
    const startingBlock = await provider.getBlock("latest");

    // Act
    await provider.send("evm_mine", []);

    // Assert
    const latestBlock = await provider.getBlock("latest");
    expect(latestBlock.number).to.equal(startingBlock.number + 1);
  });
});
```

</details>

### **Increasing Node Timestamp**

**Test Description**: Ensures the node's timestamp increases correctly by a specified amount when invoking the `evm_increaseTime` command.

- **Arrange**:
  - Set the time increment (13 seconds in this example).
  - Configure wallets using provided private keys and a randomly generated one.
  - Fetch the current timestamp and calculate the expected timestamp by adding the increment.
- **Act**:
  - Increase the node's timestamp using the `evm_increaseTime` method.
  - Initiate a transaction, which in turn will mine two new blocks, and thus, the expected timestamp should consider this.
- **Assert**: Confirm that the timestamp of the latest block matches the expected timestamp.

<details>

<summary>evm_increaseTime test</summary>

```typescript
describe("evm_increaseTime", function () {
  it("Should increase current timestamp of the node", async function () {
    // Arrange
    const timeIncreaseInSeconds = 13;
    const wallet = new Wallet(RichAccounts[0].PrivateKey, provider);
    const userWallet = Wallet.createRandom().connect(provider);
    let expectedTimestamp: number = await provider.send("config_getCurrentTimestamp", []);
    expectedTimestamp += timeIncreaseInSeconds * 1000;

    // Act
    await provider.send("evm_increaseTime", [timeIncreaseInSeconds]);

    await wallet.sendTransaction({
      to: userWallet.address,
      value: ethers.utils.parseEther("0.1"),
    });
    expectedTimestamp += 2; // New transaction will add two blocks

    // Assert
    const newBlockTimestamp = (await provider.getBlock("latest")).timestamp;
    expect(newBlockTimestamp).to.equal(expectedTimestamp);
  });
});
```

</details>

### **Setting Next Block Timestamp:**

**Test Description**: Validates the ability to specifically set the timestamp for the next block via the `evm_setNextBlockTimestamp` command.

- **Arrange**:
  - Set the desired time increment (123 milliseconds for this instance).
  - Compute the expected timestamp by adding the increment to the current timestamp.
  - Set up wallets for transaction purposes.
- **Act**:
  - Assign the next block's timestamp using the `evm_setNextBlockTimestamp` method.
  - Trigger a transaction, which will result in the mining of two new blocks. Adjust the expected timestamp accordingly.
- **Assert**: Confirm that the timestamp of the most recent block aligns with the expected timestamp.

<details>

<summary>evm_setNextBlockTimestamp</summary>

```typescript
describe("evm_setNextBlockTimestamp", function () {
  it("Should set current timestamp of the node to specific value", async function () {
    // Arrange
    const timeIncreaseInMS = 123;
    let expectedTimestamp: number = await provider.send("config_getCurrentTimestamp", []);
    expectedTimestamp += timeIncreaseInMS;
    const wallet = new Wallet(RichAccounts[0].PrivateKey, provider);
    const userWallet = Wallet.createRandom().connect(provider);

    // Act
    await provider.send("evm_setNextBlockTimestamp", [expectedTimestamp]);

    await wallet.sendTransaction({
      to: userWallet.address,
      value: ethers.utils.parseEther("0.1"),
    });
    expectedTimestamp += 2; // New transaction will add two blocks

    // Assert
    const newBlockTimestamp = (await provider.getBlock("latest")).timestamp;
    expect(newBlockTimestamp).to.equal(expectedTimestamp);
  });
});
```

</details>

### **Directly Setting Node Timestamp**

**Test Description**: Demonstrates how to set the node's timestamp to an explicit value using the `evm_setTime` command.

- **Arrange**:
  - Specify the desired time increment (123 milliseconds in this context).
  - Derive the expected timestamp by adding the increment to the existing timestamp.
  - Establish wallets for testing.
- **Act**:
  - Directly set the node's timestamp via the `evm_setTime` method.
  - Initiate a transaction which will, in turn, lead to the mining of two additional blocks. Modify the expected timestamp to reflect this.
- **Assert**: Confirm that the latest block's timestamp corresponds with the expected value.

<details>

<summary>evm_setTime test</summary>

```typescript
describe("evm_setTime", function () {
  it("Should set current timestamp of the node to specific value", async function () {
    // Arrange
    const timeIncreaseInMS = 123;
    let expectedTimestamp: number = await provider.send("config_getCurrentTimestamp", []);
    expectedTimestamp += timeIncreaseInMS;
    const wallet = new Wallet(RichAccounts[0].PrivateKey, provider);
    const userWallet = Wallet.createRandom().connect(provider);

    // Act
    await provider.send("evm_setTime", [expectedTimestamp]);

    await wallet.sendTransaction({
      to: userWallet.address,
      value: ethers.utils.parseEther("0.1"),
    });
    expectedTimestamp += 2; // New transaction will add two blocks

    // Assert
    const newBlockTimestamp = (await provider.getBlock("latest")).timestamp;
    expect(newBlockTimestamp).to.equal(expectedTimestamp);
  });
});
```

</details>

Developers can utilize these tests as templates to simulate specific time-based scenarios in zkSync. This ability is crucial for debugging, developing time-dependent features, or understanding chain behaviors.
