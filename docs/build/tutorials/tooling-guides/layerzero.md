---
head:
  - - meta
    - name: "twitter:title"
      content: LayerZero | zkSync Docs
---

# LayerZero

### Introduction

This guide aims to provide an insight into the LayerZero messaging service, which is an omnichain interoperability protocol designed for lightweight message passing across chains, and how to Setup and utilize the OmniCounter contract to demonstrate cross-chain message passing. Below is a table showcasing the zkSync Era and zkSync (Testnet) endpoint details for LayerZero:

<table><thead><tr><th width="176">Network</th><th width="91.33333333333331">ChainID</th><th>Endpoint</th></tr></thead><tbody><tr><td>zkSync Era</td><td>165</td><td>0x9b896c0e23220469C7AE69cb4BbAE391eAa4C8da</td></tr><tr><td>zkSync Testnet</td><td>10165</td><td>0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281</td></tr></tbody></table>

### Prerequisites

- **Knowledge Base**: Familiarity with blockchain concepts and smart contract development.
- **Node.js**: If not installed, [download it here](https://nodejs.org/).

### Step 1 — Understanding LayerZero messaging service

LayerZero enables authentic and guaranteed message delivery between different blockchain networks with configurable trustlessness. Messages in LayerZero are managed by LayerZero Endpoints, which comprise versioned messaging libraries and a proxy to route messages to the appropriate library version. Message states are maintained across versions, allowing for seamless library upgrades.

Messages are sent from the User Application (UA) at source `srcUA` to the UA at the destination `dstUA`. Once the message is received by `dstUA`, the message is considered delivered (transitioning from `INFLIGHT` to either `SUCCESS` or `STORED`)

More details can be found [here](https://layerzero.gitbook.io/docs/faq/messaging-properties).

### Step 2 — Environment setup

Clone the GitHub repository containing the OmniCounter contract, and navigate to the repository directory:

```bash
git clone git@github.com:dutterbutter/zksync-layer0-example.git
```

Install dependencies:

```bash
yarn install
```

**Update the Environment File**:

- Modify the `.env-example` file with your private key.
- Ensure your account has a sufficient balance for both chains being interacted with. For this guide, that is zkSync Testnet, and Optimism Testnet.

### Step 3 — Understanding OmniCounter

OmniCounter is a smart contract that increments a counter on another chain via LayerZero messaging service.

It utilizes `_lzSend()` within `incrementCounter()` to send messages, and `_nonblockingLzReceive()` to receive messages on the destination chain.

### Step 4 — Deploy OmniCounter

Deploy OmniCounter contract on at least two different chains. In this example, we'll use zkSync Testnet and Optimism Testnet.

We will start with deploying on zkSync Testnet:

```bash
npx hardhat --network zksync-testnet deploy --tags OmniCounter
```

We should see the expected output:

```
[zksync-testnet] Endpoint address: 0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281
OmniCounter was deployed to 0x07C89fc22B959DbaE2bF3Bb5d0F1Ac94986588fd
```

**Note:** Copy the contract address somewhere safe, we will need it in the next step!

Deploy on Optimism:

```bash
npx hardhat --network optimism-goerli deploy --tags OmniCounter
```

### Step 5 — Configure and Send Cross-Chain Message

Open `setTrustedRemote.js` located in the `/tasks` directory. Replace `"YOUR-ZKSYNC-DEPLOYED-OMNICOUNTER-ADDRESS"` with the zkSync contract address.

```javascript
const ZKSYNC_OMNICOUNTER = "YOUR-ZKSYNC-DEPLOYED-OMNICOUNTER-ADDRESS";
```

Set the remote addresses to allow each contract to receive messages:

```bash
npx hardhat --network zksync-testnet setTrustedRemote --target-network optimism-goerli --contract OmniCounter
```

Execute:

```bash
npx hardhat --network optimism-goerli setTrustedRemote --target-network zksync-testnet --contract OmniCounter
```

Time to send a cross-chain message from `optimism-goerli` to `zksync-testnet`:

```bash
npx hardhat --network optimism-goerli incrementCounter --target-network zksync-testnet
```

Expected output:

```
fees[0] (wei): 1289224800000000 / (eth): 0.0012892248
✅ Message Sent [optimism-goerli] incrementCounter on destination OmniCounter @ [10165]
tx: 0x6efca38d68bd11aae030c2b02d0dd8ae93eb32cba04152bb541309a909a0c894
```

### Conclusion

You have now set up and demonstrated cross-chain messaging using LayerZero with the OmniCounter contract. This simplistic example serves as a gateway to understand and explore the potential of LayerZero messaging service in building interoperable blockchain applications.
