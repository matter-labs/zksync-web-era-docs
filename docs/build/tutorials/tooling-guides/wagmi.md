---
head:
  - - meta
    - name: "twitter:title"
      content: Wagmi | zkSync Docs
---

# Wagmi

The `@wagmi/core` library provides a comprehensive VanillaJS toolkit for interacting with zkSync Era. It simplifies wallet connections, balance retrieval, message signing, and contract interactions. For setup instructions, consult the official documentation [here](https://wagmi.sh/core/getting-started).

:::info
Wagmi hooks do not yet support Paymasters and native Account Abstraction; development is in progress.
:::

Here are some common actions:

### Connect Wallet

```typescript
import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { zkSync, zkSyncTestnet } from "wagmi/chains";

export const walletConnectProjectId = "d4a7167a6eed6a53c8364631aaeca861";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [zkSync, ...(import.meta.env?.MODE === "development" ? [zkSyncTestnet] : [])],
  [w3mProvider({ projectId: walletConnectProjectId })]
);

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  publicClient,
  webSocketPublicClient,
});

export { chains };
```

### Display Wallet Options

```typescript
import { useConnect } from "wagmi";

export function WalletOptions() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  console.log(connectors);

  return (
    <div>
      {connectors.map((connector) => (
        <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
```

### Fetch Account

```typescript
import { useAccount } from "wagmi";

export function Account() {
  const { address } = useAccount();

  return <div>{address}</div>;
}
```

### Fetch Balance

```typescript
import { useState } from "react";
import type { Address } from "wagmi";
import { useAccount, useBalance } from "wagmi";

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
      <br />
      <div>
        <FindBalance />
      </div>
    </>
  );
}

export function AccountBalance() {
  const { address } = useAccount();
  const { data, refetch } = useBalance({
    address,
    watch: true,
  });

  return (
    <div>
      {data?.formatted}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  );
}

export function FindBalance() {
  const [address, setAddress] = useState("");
  const { data, isLoading, refetch } = useBalance({
    address: address as Address,
  });

  const [value, setValue] = useState("");

  return (
    <div>
      Find balance: <input onChange={(e) => setValue(e.target.value)} placeholder="wallet address" value={value} />
      <button onClick={() => (value === address ? refetch() : setAddress(value))}>{isLoading ? "fetching..." : "fetch"}</button>
      <div>{data?.formatted}</div>
    </div>
  );
}
```

### Fetch Block Number

```typescript
import { useBlockNumber } from "wagmi";

export function BlockNumber() {
  const { data } = useBlockNumber({ watch: true });
  return <div>{data?.toString()}</div>;
}
```

### Send Transaction

```typescript
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

import { stringify } from "../utils/stringify";

export function SendTransaction() {
  const { data, error, isLoading, isError, sendTransaction } = useSendTransaction();
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const address = formData.get("address") as string;
          const value = formData.get("value") as `${number}`;
          sendTransaction({
            to: address,
            value: parseEther(value),
          });
        }}
      >
        <input name="address" placeholder="address" />
        <input name="value" placeholder="value (ether)" />
        <button type="submit">Send</button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>Error: {error?.message}</div>}
    </>
  );
}
```

### Send Transaction (Prepared)

```typescript
import { useState } from "react";
import { parseEther, stringify } from "viem";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";

import { useDebounce } from "../hooks/useDebounce";

export function SendTransactionPrepared() {
  const [to, setTo] = useState("");
  const debouncedTo = useDebounce(to);

  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedValue ? parseEther(value as `${number}`) : undefined,
    enabled: Boolean(debouncedTo && debouncedValue),
  });
  const { data, error, isLoading, isError, sendTransaction } = useSendTransaction(config);
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendTransaction?.();
        }}
      >
        <input placeholder="address" onChange={(e) => setTo(e.target.value)} value={to} />
        <input id="value" placeholder="value (ether)" onChange={(e) => setValue(e.target.value)} value={value} />
        <button disabled={!sendTransaction} type="submit">
          Send
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>Error: {error?.message}</div>}
    </>
  );
}
```

### Sign Message

```typescript
import { useEffect, useState } from "react";
import { recoverMessageAddress } from "viem";
import { type Address, useSignMessage } from "wagmi";

export function SignMessage() {
  const [recoveredAddress, setRecoveredAddress] = useState<Address>();
  const { data: signature, variables, error, isLoading, signMessage } = useSignMessage();

  useEffect(() => {
    (async () => {
      if (variables?.message && signature) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature,
        });
        setRecoveredAddress(recoveredAddress);
      }
    })();
  }, [signature, variables?.message]);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const message = formData.get("message") as string;
          signMessage({ message });
        }}
      >
        <input name="message" type="text" required />
        <button disabled={isLoading} type="submit">
          {isLoading ? "Check Wallet" : "Sign Message"}
        </button>
      </form>

      {signature && (
        <div>
          <div>Signature: {signature}</div>
          <div>Recovered address: {recoveredAddress}</div>
        </div>
      )}
      {error && <div>Error: {error?.message}</div>}
    </>
  );
}
```

### Sign Typed Data

```typescript
import { useEffect, useState } from "react";
import { recoverTypedDataAddress } from "viem";
import { type Address, useSignTypedData } from "wagmi";

const domain = {
  name: "Ether Mail",
  version: "1",
  chainId: 280 || 324,
  verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
} as const;

const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Mail: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "contents", type: "string" },
  ],
} as const;

const message = {
  from: {
    name: "Cow",
    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
  },
  to: {
    name: "Bob",
    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
  },
  contents: "Hello, Bob!",
} as const;

export function SignTypedData() {
  const { data, error, isLoading, signTypedData } = useSignTypedData({
    domain,
    types,
    message,
    primaryType: "Mail",
  });

  const [recoveredAddress, setRecoveredAddress] = useState<Address>();
  useEffect(() => {
    if (!data) return;
    (async () => {
      setRecoveredAddress(
        await recoverTypedDataAddress({
          domain,
          types,
          message,
          primaryType: "Mail",
          signature: data,
        })
      );
    })();
  }, [data]);

  return (
    <>
      <button disabled={isLoading} onClick={() => signTypedData()}>
        {isLoading ? "Check Wallet" : "Sign Message"}
      </button>

      {data && (
        <div>
          <div>Signature: {data}</div>
          <div>Recovered address {recoveredAddress}</div>
        </div>
      )}
      {error && <div>Error: {error?.message}</div>}
    </>
  );
}
```

### Read Contract

```typescript
import { useState } from "react";
import { BaseError } from "viem";
import { type Address, useContractRead } from "wagmi";

import { erc20TokenABI } from "./contracts";

export function ReadContract() {
  return (
    <div>
      <div>
        <BalanceOf />
        <br />
        <TotalSupply />
      </div>
    </div>
  );
}

function TotalSupply() {
  const { data, isRefetching, refetch } = useContractRead({
    ...erc20TokenABI,
    functionName: "totalSupply",
  });

  return (
    <div>
      Total Supply: {data?.toString()}
      <button disabled={isRefetching} onClick={() => refetch()} style={{ marginLeft: 4 }}>
        {isRefetching ? "loading..." : "refetch"}
      </button>
    </div>
  );
}

function BalanceOf() {
  const [address, setAddress] = useState<Address>("0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b");
  const { data, error, isLoading, isSuccess } = useContractRead({
    ...erc20TokenABI,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(address),
  });

  const [value, setValue] = useState<string>(address);

  return (
    <div>
      Token balance: {isSuccess && data?.toString()}
      <input onChange={(e) => setValue(e.target.value)} placeholder="wallet address" style={{ marginLeft: 4 }} value={value} />
      <button onClick={() => setAddress(value as Address)}>{isLoading ? "fetching..." : "fetch"}</button>
      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  );
}
```

### Token

```typescript
import { useState } from "react";
import { type Address, useToken } from "wagmi";

export function Token() {
  const [address, setAddress] = useState<Address>("0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b");
  const { data, error, isError, isLoading, refetch } = useToken({ address });

  return (
    <>
      <div>
        <input onChange={(e) => setAddress(e.target.value as Address)} placeholder="token address" value={address} />
        <button onClick={() => refetch()}>fetch</button>
      </div>

      {data && (
        <div>
          {data.totalSupply?.formatted} {data.symbol}
        </div>
      )}
      {isLoading && <div>Fetching token...</div>}
      {isError && <div>Error: {error?.message}</div>}
    </>
  );
}
```

### Write Contract

```typescript
import { BaseError } from "viem";
import { useContractWrite, useWaitForTransaction } from "wagmi";

import { erc721Contract } from "./contracts";
import { stringify } from "../utils/stringify";

export function WriteContract() {
  const { write, data, error, isLoading, isError } = useContractWrite({
    ...erc721Contract,
    functionName: "mint",
  });
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return (
    <>
      <h3>Mint an NFT</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const tokenId = formData.get("tokenId") as string;
          write({
            args: [BigInt(tokenId)],
          });
        }}
      >
        <input name="tokenId" placeholder="token id" />
        <button disabled={isLoading} type="submit">
          Mint
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  );
}
```
