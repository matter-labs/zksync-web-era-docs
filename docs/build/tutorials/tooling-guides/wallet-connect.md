---
head:
  - - meta
    - name: "twitter:title"
      content: WalletConnect | zkSync Docs
---

# WalletConnect

Using WalletConnect with zkSync Era is fast and easy. Below is a quick example to get you started.

WalletConnect's [Web3Modal React](https://docs.walletconnect.com/web3modal/react/about#introduction) integrates with the Wagmi library, offering a suite of React Hooks to streamline your dapp development. This enables effortless message signing, smart contract interactions, and additional functionalities.

::: info Don't have a project ID?

Head over to [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) and create a new project now! This is a requirement for using WalletConnect.

:::

## Installation

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

You can find more details about the installation in the [WalletConnect documentation](https://docs.walletconnect.com/web3modal/react/about#installation).

## Implementation

You can start Web3Modal configuration using either **default** or **custom** mode.

Default mode will implement WalletConnect, Browser Wallets (injected) and [Wagmi's public provider](https://wagmi.sh/react/providers/public) and [WalletConnect's provider](https://docs.walletconnect.com/cloud/blockchain-api).

Start by importing `createWeb3Modal`, `defaultWagmiConfig` and wagmi packages, then create `wagmiConfig` using `defaultWagmiConfig` function as shown below. Finally, pass `wagmiConfig` to `createWeb3Modal`.

Find an example below:

```ts
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

You can find more information about how to integrate Web3Modal in the [WalletConnect documentation](https://docs.walletconnect.com/web3modal/react/about#implementation).
