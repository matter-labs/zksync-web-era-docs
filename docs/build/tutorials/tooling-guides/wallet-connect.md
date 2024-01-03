---
head:
  - - meta
    - name: "twitter:title"
      content: WalletConnect | zkSync Docs
---

# WalletConnect

Using WalletConnect with zkSync Era is fast and easy. Below is a quick example to get you started. Want to see it live in action? Check out the link below:

{% embed url="https://codesandbox.io/p/sandbox/web3modal-v3-zksync-rslp8g?file=%2Findex.html" %}

### Introduction[​](https://docs.walletconnect.com/web3modal/react/about#introduction) <a href="#introduction" id="introduction"></a>

Web3Modal React integrates with the Wagmi library, offering a suite of React Hooks to streamline your dapp development. This enables effortless message signing, smart contract interactions, and additional functionalities.

### Don't have a project ID?

Head over to WalletConnect Cloud and create a new project now! This is a requirement for using WalletConnect.

### Installation[​](https://docs.walletconnect.com/web3modal/react/about#installation) <a href="#installation" id="installation"></a>

::: code-tabs
@tab yarn

```bash
yarn add @web3modal/wagmi wagmi viem
```

@tab npm

```bash
npm install @web3modal/wagmi wagmi viem
```

:::

### Implementation[​](https://docs.walletconnect.com/web3modal/react/about#implementation) <a href="#implementation" id="implementation"></a>

You can start Web3Modal configuration using either **default** or **custom** mode.

Default mode will implement WalletConnect, Browser Wallets (injected) and [Wagmi's public provider](https://wagmi.sh/react/providers/public) and [WalletConnect's provider](https://docs.walletconnect.com/cloud/blockchain-api).

Start by importing `createWeb3Modal`, `defaultWagmiConfig` and wagmi packages, then create `wagmiConfig` using `defaultWagmiConfig` function as shown below. Finally, pass `wagmiConfig` to `createWeb3Modal`.

<details>

<summary>WalletConnect web3modal</summary>

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig, useAccount } from "wagmi";
import { zkSync } from "wagmi/chains";
import "./index.css";

// 1. Get projectId
const projectId = <PROJECT_ID>;

// 2. Create wagmiConfig
const chains = [zkSync];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: { name: "Web3Modal v3" },
});

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: zkSync });

// 4. Create modal
const App = () => {
  const { address } = useAccount();
  return (
    <>
      <div className="container">
        <w3m-button />
        <w3m-network-button />
      </div>
      <p>
        {address && (
          <>
            <b>Address:</b> {address}
          </>
        )}
      </p>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
);
```

</details>
