---
head:
  - - meta
    - name: "twitter:title"
      content: JS SDK Deploy Token Example | zkSync Docs
---

# Deploy token

Deploy the token which will be used to pay transaction fee.

## Deploy token with CREATE opcode

```ts
import { Provider, types, Wallet, ContractFactory } from "zksync-ethers";
import { Contract, Typed } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider);

async function main() {
  const conf = require("../../solidity/custom_paymaster/token/build/Token.json");
  const abi = conf.abi;
  const bytecode: string = conf.bytecode;

  const factory = new ContractFactory(abi, bytecode, wallet);
  const token = (await factory.deploy("Crown", "Crown", 18)) as Contract;
  const tokenAddress = await token.getAddress();
  console.log(`Contract address: ${tokenAddress}`);

  const tx = await token.mint(Typed.address(await wallet.getAddress()), Typed.uint256(10));
  await tx.wait();
  console.log(`Crown tokens: ${await wallet.getBalance(tokenAddress)}`);
}

main()
  .then()
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
```

## Deploy token with CREATE2 opcode

```ts
import { Provider, types, Wallet, ContractFactory } from "zksync-ethers";
import { Contract, ethers, Typed } from "ethers";

const provider = Provider.getDefaultProvider(types.Network.Sepolia);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new Wallet(PRIVATE_KEY, provider);

async function main() {
  const conf = require("../../solidity/custom_paymaster/token/build/Token.json");
  const abi = conf.abi;
  const bytecode: string = conf.bytecode;

  const factory = new ContractFactory(abi, bytecode, wallet, "create2");
  const token = (await factory.deploy("Crown", "Crown", 18, {
    customData: { salt: ethers.hexlify(ethers.randomBytes(32)) },
  })) as Contract;
  const tokenAddress = await token.getAddress();
  console.log(`Contract address: ${tokenAddress}`);

  const tx = await token.mint(Typed.address(await wallet.getAddress()), Typed.uint256(10));
  await tx.wait();
  console.log(`Crown tokens: ${await wallet.getBalance(tokenAddress)}`);
}

main()
  .then()
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
```
