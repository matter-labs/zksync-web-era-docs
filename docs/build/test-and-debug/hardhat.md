---
head:
  - - meta
    - name: "twitter:title"
      content: Hardhat | zkSync Docs
---

# Hardhat

### Introduction

In the intricate world of decentralized applications, the margin for error is remarkably narrow. A single mistake in a contract can have catastrophic implications. The immutable nature of blockchain technology makes it imperative for developers to ensure their contracts operate flawlessly. For those seeking an efficient method to test and refine their contracts, this guide showcases how to utilize Hardhat and `era_test_node` for all testing needs.

### Step 1 - Understanding contract testing using HardHat

Writing automated tests when building smart contracts is of crucial importance.

To test our contract, we are going to use Hardhat, and `era_test_node` for rapid local development. In our tests we're going to use `zksync-ethers` to interact with the Greeter contract, and we'll use [Mocha](https://mochajs.org/) as our test runner.

### Step 2 — Environment setup

Using `zksync-cli` create a new project with the required dependencies and boilerplate paymaster implementations:

```bash
npx zksync-cli create test-greeter
```

Choose `Hardhat + Solidity` to setup the project repository. The contract for this guide exists under `/contracts/Greeter.sol`.

Install dependencies:

```bash
yarn install
```

Add the following additional dependencies:

```bash
yarn add -D @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers
```

Import `@nomicfoundation/hardhat-chai-matchers` into the `hardhat.config.ts` file:

```typescript
import "@nomicfoundation/hardhat-chai-matchers";
```

The `@nomicfoundation/hardhat-chai-matchers` plugin adds Ethereum specific capabilities to the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts.

Before running tests, a local zkSync Era node is required. If you are unfamiliar with `era_test_node` refer to the documentation [here](era-test-node/). Start `era_test_node`:

```bash
./target/release/era_test_node run
```

### Step 3 - Running tests with Hardhat <a href="#writing-tests" id="writing-tests"></a>

Under the `/test` directory there is a `main.test.ts` . The initial test checks if our `Greeter` contract returns the set greeting.

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { zkSyncTestnet } from "../hardhat.config";

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

async function deployGreeter(deployer: Deployer): Promise<Contract> {
  const artifact = await deployer.loadArtifact("Greeter");
  return await deployer.deploy(artifact, ["Hi"]);
}

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const provider = new Provider(zkSyncTestnet.url);

    const wallet = new Wallet(RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);

    const greeter = await deployGreeter(deployer);

    expect(await greeter.greet()).to.eq("Hi");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
```

To run this test:

```bash
yarn test
```

You should see the following output:

```
$ yarn test

  Greeter
    ✔ Should return the new greeting once it's changed (174ms)

  1 passing (174ms)
```

This means the test passed.

### Step 4 - Expanding test coverage

Our aim is comprehensive coverage. Here are the test scenarios we will cover:

1. **Testing greet() function**: Check the returned greeting.
2. **Testing setGreeting() function**: Verify the ability to update greetings.
3. **Testing Insufficient Funds**: Ensure transactions fail without enough funds.
4. **Event Emission**: Ensure an event is emitted when changing the greeting.

Each of these test cases will rely on a common setup, which involves creating a provider connected to the `zkSync` testnet, initializing a wallet with a known private key, and deploying the `Greeter` contract.

Let's refactor our test file with the provided script:

<details>

<summary>main.test.ts</summary>

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { zkSyncTestnet } from "../hardhat.config";

const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

// Deploy the Greeter contract
async function deployGreeter(deployer: Deployer): Promise<Contract> {
  // Load the Greeter contract artifact
  const artifact = await deployer.loadArtifact("Greeter");
  // Deploy the contract with an initial greeting
  return await deployer.deploy(artifact, ["Hi"]);
}

describe("Greeter", function () {
  let greeter;
  let wallet;
  let deployer;

  // Initialize commonly used variables before running the tests
  before(async function () {
    // Create a provider connected to the zkSync testnet
    const provider = new Provider(zkSyncTestnet.url);

    // Create a wallet instance using the rich wallet's private key
    wallet = new Wallet(RICH_WALLET_PK, provider);
    // Create a deployer instance for contract deployments
    deployer = new Deployer(hre, wallet);
    // Deploy the Greeter contract
    greeter = await deployGreeter(deployer);
  });

  // Test the greet() function
  it("Should return the new greeting once it's changed", async function () {
    // Ensure the greet function returns the initial greeting after deployment
    expect(await greeter.greet()).to.eq("Hi");
  });

  // Test the setGreeting() function
  it("Should set a new greeting and return it", async function () {
    // Set a new greeting
    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // Wait for the transaction to be confirmed
    await setGreetingTx.wait();

    // Ensure the greet function returns the newly set greeting
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  // Test for lack of funds (or other tx failures)
  it("Should fail when insufficient funds", async function () {
    // Create an empty wallet with no funds
    const userWallet = Wallet.createRandom();
    // Connect the empty wallet to the greeter contract and attempt to set a new greeting
    try {
      await greeter.connect(userWallet).setGreeting("fail");
      // The following line should not be reached if the transaction fails
      expect(true).to.equal(false);
    } catch (e) {
      // Expect an error to be thrown for the transaction
      expect(e).to.exist;
    }
  });

  // Test event emission
  it("Should emit an event when the greeting is changed", async function () {
    const newGreeting = "Bonjour, monde!";
    // Use the provided .emit method to test event emissions
    await expect(greeter.setGreeting(newGreeting)).to.emit(greeter, "GreetingChanged").withArgs(newGreeting);
  });
});
```

</details>

To run this test:

```bash
yarn test
```

You should see the following output:

```
$ yarn test

  Greeter
    ✔ Should return the new greeting once it's changed (211ms)
    ✔ Should set a new greeting and return it (2682ms)
    ✔ Should fail when insufficient funds (299ms)
    ✔ Should emit an event when the greeting is changed (2939ms)

  4 passing (6s)
```

### Step 5 - Reviewing the test file

#### Initial Setup and Utilities

```typescript
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { zkSyncTestnet } from "../hardhat.config";
```

This section imports all necessary utilities and configurations needed to run our tests.

- `expect` from Chai provides assertion functionalities for our tests.
- `Wallet`, `Provider`, and `Contract` from `zksync-ethers` help us with zkSync functionalities like creating wallets and interacting with contracts.
- `hre` and `Deployer` give us hardhat specific functionalities for deploying and interacting with our contract.
- `zkSyncTestnet` from our hardhat configuration provides network details of our running `era_test_node.`

#### Contract Deployment Utility

```javascript
async function deployGreeter(deployer: Deployer): Promise<Contract> { ... }
```

This utility function simplifies deploying the Greeter contract for our tests.

#### Main Test Suite

```javascript
describe('Greeter', function () { ... }
```

Here, we've declared our main test suite. Each test or nested suite inside provides specific scenarios or functionalities we want to test regarding the Greeter contract.

1.  **Initialization**:

    Before running any test, we initialize commonly used variables like the provider, wallet, deployer, and the greeter contract.

2.  **Testing greet() function**:

    ```javascript
    it("Should return the new greeting once it's changed", async function () { ... });
    ```

    We check that the greet function returns the initial greeting of 'Hi' after deployment.

3.  **Testing setGreeting() function**:

    ```javascript
    it("Should set a new greeting and return it", async function () { ... });
    ```

    We test that setting a new greeting updates the contract's state as expected.

4.  **Insufficient Funds**:

    ```javascript
    it("Should fail when insufficient funds", async function () { ... });
    ```

    Here, we simulate a scenario where an empty wallet (with no funds) tries to set a new greeting. We make use of the `connect` method on your `zksync-ethers` `Contract` object to connect it to a different account.

5.  **Event Emission**:

    ```javascript
    it("Should emit an event when the greeting is changed", async function () { ... });
    ```

    We test the emission of an event when the greeting changes in the contract making use of the `hardhat-chai-matchers`.

### Conclusion

Testing contracts using Hardhat on zkSync Era provides a familiar environment for developers. With minimal changes, you can test contracts with ease and speed.
