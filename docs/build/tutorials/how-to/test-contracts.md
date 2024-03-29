---
head:
  - - meta
    - name: "twitter:title"
      content: Test Contracts on zkSync with Hardhat | zkSync Docs
---

# Test smart contracts with Hardhat plugins

This tutorial provides a step-by-step guide on testing smart contracts using the **hardhat-zksync-chai-matchers** plugin in conjunction with the **zkSync Era Test Node** on your local machine. To facilitate this process of running tests on the **zkSync Era Test Node**, you'll also utilize the **hardhat-zksync-node** plugin.

# Prerequisites

- Node.js installed (version 14.x or later)
- Either yarn or npm installed
- Initialized Hardhat TypeScript project

# Tutorial

## Integration with hardhat-zksync-node plugin

In this tutorial, the contract functionality is tested using the [zkSync Era Test Node](../../test-and-debug/era-test-node.md). To start local node we use a **hardhat-zksync-node** plugin to integrate this functionality within the Hardhat project.

:::warning zkSync Era Test Node alpha phase

During the alpha phase, zkSync Era Test Nodes are currently undergoing development, wherein certain functionalities might not be fully supported or operational.

:::

### Installation

To install the **hardhat-zksync-node** plugin and additional necessary packages, execute the following command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-node
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-node
```

:::

Once installed, add the plugin at the top of your **hardhat.config.ts** file.

```bash
import "@matterlabs/hardhat-zksync-node";
```

### Starting the zkSync Era Test Node

You can now safely run the **zkSync Era Test Node** with the following command, ensuring proper execution:

```bash
yarn hardhat node-zksync
```

::: note Test if all is ok

We'll want to verify the correctness of our installations and test if we can run a **zkSync Era Test Node**, without further use of this command in the tutorial.

:::

You should see output similar to this:

```log
09:04:44  INFO Account #9: 0xe2b8Cb53a43a56d4d2AB6131C81Bd76B86D3AFe5 (1_000_000_000_000 ETH)
09:04:44  INFO Private Key: 0xb0680d66303a0163a19294f1ef8c95cd69a9d7902a4aca99c05f3e134e68a11a
09:04:44  INFO Mnemonic: increase pulp sing wood guilt cement satoshi tiny forum nuclear sudden thank
09:04:44  INFO
09:04:44  INFO ========================================
09:04:44  INFO   Node is ready at 127.0.0.1:8011
09:04:44  INFO ========================================
```

Since we've confirmed that the **zkSync Era Test Node** is functioning properly with the help of the **hardhat-zksync-node** plugin, we can shut it down and continue with the tutorial.

Read more about **hardhat-zksync-node** [here.](../../tooling/hardhat/hardhat-zksync-node.md)

## Integration with hardhat-zksync-chai-matchers plugin

To leverage zkSync-specific capabilities within the [Chai](https://www.chaijs.com/) assertion library for testing smart contracts, it's necessary to use the **hardhat-zksync-chai-matchers** plugin.

### Installation

In the root directory of your project, execute this command:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-chai-matchers @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-chai-matchers
```

:::

After installing it, add the plugin at the top of your **hardhat.config.ts** file:

```bash
import "@nomicfoundation/hardhat-chai-matchers"
import "@matterlabs/hardhat-zksync-chai-matchers";
```

::: note Import order matters

To enable the **@matterlabs/hardhat-zksync-chai-matchers** plugin to override **@nomicfoundation/hardhat-chai-matchers**, you must import the latter first, ensuring that all zkSync-specific matchers take override the original ones.

:::

Read more about **hardhat-zksync-chai-matchers** [here.](../../tooling/hardhat/hardhat-zksync-chai-matchers.md)

### Smart Contract creation

To set up the environment for using chai matchers and writing tests, you'll need to create some contracts. Follow these steps:

1. Navigate to the root of your project.
2. Create a folder named **contracts**.
3. Inside the **contracts** folder, create a file named **Greeter.sol**.

Now we should add some code to the new **Greeter.sol** file:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Greeter {
    string private greeting;
    bool private greetingChanged;
    constructor(string memory _greeting) {
        greeting = _greeting;
        greetingChanged = false;
    }
    function greet() public view returns (string memory) {
        return greeting;
    }
    function setGreeting(string memory _greeting) public {
        require(bytes(_greeting).length > 0, "Greeting must not be empty");
        greeting = _greeting;
        greetingChanged = true;
    }
    function isGreetingChanged() public view returns (bool) {
        return greetingChanged;
    }
}
```

### Compiler configuration

We'll require the **hardhat-zksync-solc** plugin to compile our smart contracts. To install it, execute:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-solc
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-solc
```

:::

Add the plugin at the top of your **hardhat.config.ts** file:

```bash
import "@matterlabs/hardhat-zksync-solc";
```

Customize the configuration options for the **hardhat-zksync-solc** plugin according to your requirements.

You can find more details about available configuration options in the [official documentation.](../../tooling/hardhat/hardhat-zksync-solc.md)

### Deploy configuration

We'll use provided example contract for testing with help of **hardhat-zksync-chai-matchers** plugin and deploying it on **zkSync Era Test Node**. Since deployment is involved, we'll also require the **hardhat-zksync-deploy** plugin for assistance. In the same directory, execute the command to install **hardhat-zksync-deploy** plugin:

::: code-tabs

@tab:active yarn

```bash
yarn add -D @matterlabs/hardhat-zksync-deploy ethers zksync-ethers
```

@tab npm

```bash
npm i -D @matterlabs/hardhat-zksync-deploy
```

:::

Add the **hardhat-zksync-deploy** plugin to your hardhat.config.ts file, you can import it as follows:

```bash
import "@matterlabs/hardhat-zksync-deploy";
```

Learn more about the **hardhat-zksync-deploy** plugin [here.](../../tooling/hardhat/hardhat-zksync-deploy.md)

## Write Test Cases

With the previous steps completed, your **hardhat.config.ts** file should now be properly configured to include settings for local testing.

```javascript
import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-node";
import "@nomicfoundation/hardhat-chai-matchers";
import "@matterlabs/hardhat-zksync-chai-matchers";

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
  },
  solidity: "0.8.19",
  networks: {
    hardhat: {
      zksync: true,
    },
  },
};
export default config;
```

Here are the steps to create test cases with the **hardhat-zksync-chai-matchers** plugin:

1. Navigate to your project's root directory.
2. Create a new folder named **test**.
3. Inside the **test** folder, create a file named **test.ts**.

Once you've completed these steps, you'll be ready to write your tests using the **hardhat-zksync-chai-matchers** plugin.

Here's a brief example showcasing the functionalities of our contract:

```typescript
import * as hre from "hardhat";
import { expect } from "chai";
import { Wallet, Provider, Contract } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/src/types";
import { ZkSyncProviderAdapter } from "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-node/dist/type-extensions";

const RICH_PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

describe("Greeter", function () {
  let provider: Provider;
  let deployer: Deployer;
  let artifact: ZkSyncArtifact;
  let contract: Contract;

  before(async function () {
    // Creation of a provider from a network URL adjusted specifically for the zkSync Era Test Node.
    provider = new Provider(hre.network.config.url);
    // To ensure proper testing, we need to deploy our contract on the zkSync Era Test Node, for more info check hardhat-zksync-deploy plugin documentation.
    deployer = new Deployer(hre, new Wallet(RICH_PRIVATE_KEY));
    artifact = await deployer.loadArtifact("Greeter");
    contract = await deployer.deploy(artifact, ["Hello, world!"]);
  });
  it("should work on Era Test node", async function () {
    const netVersion = await provider.send("net_version", []);
    expect(netVersion === 260);
  });
  it("greet should return a string", async function () {
    expect(await contract.greet()).to.be.a("string");
  });
  it("is deployed address valid", async function () {
    expect(await contract.getAddress()).to.be.properAddress;
  });
  it("greet should say Hello", async function () {
    expect(await contract.greet()).to.match(/^Hello/);
  });
  it("setGreeting should throw when passed an invalid argument", async function () {
    await expect(contract.setGreeting("")).to.be.revertedWith("Greeting must not be empty");
  });
  it("isGreetingChanged should return true after setting greeting", async function () {
    expect(await contract.isGreetingChanged()).to.be.false;
    const tx = await contract.setGreeting("Changed");
    await tx.wait();
    expect(await contract.greet()).to.match(/^Changed/);
    expect(await contract.isGreetingChanged()).to.be.true;
  });
});
```

Execute the following command in your terminal to run the tests:

```bash
yarn hardhat test
```

::: note When you execute this command, the contract will be automatically compiled, eliminating the need for manual compilation. However, if you prefer to compile manually, simply run the following command:

```bash
yarn hardhat compile
```

:::

The **hardhat-zksync-node** plugin overrides the default behavior of the Hardhat **test** task. It starts the **zkSync Era Test Node** before running tests, executes the tests, and then automatically shuts down the node after the test cases are completed. Additionally, the plugin generates a log file named `era_test_node.log`, which indicates the node's activity and transactions made during the tests. Whenever you re-run the **test** command, the content of `era_test_node.log` is refreshed.
This setup ensures that your tests are executed against a controlled environment, mimicking the behavior of a live network but in a local sandboxed context. It's a common practice to ensure that smart contracts behave as expected under various conditions before deploying them to a live network.

`era_test_node.log` file example:

```
10:53:11  INFO
10:53:11  INFO EthToken System Contract
10:53:11  INFO   Topics:
10:53:11  INFO     0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
10:53:11  INFO     0x0000000000000000000000000000000000000000000000000000000000008001
10:53:11  INFO     0x00000000000000000000000036615cf349d7f6344891b1e7ca7c72883f5dc049
10:53:11  INFO   Data (Hex): 0x000000000000000000000000000000000000000000000000000028e0ec2a9900
10:53:11  INFO
10:53:11  INFO Call: SUCCESS
10:53:11  INFO Output: "0x0000000000000000000000000000000000000000000000000000000000000001"
10:53:11  INFO === Console Logs:
10:53:11  INFO === Call traces:
```
