---
description: Guide to setup dockerized containers of L1 and L2 nodes.
---

# Dockerized L1 - L2 Nodes

Welcome to this step-by-step guide on establishing a local testing environment using Docker for zkSync development. With this guide, you can effortlessly emulate the zkSync environment on your local system, making it simpler to test and develop features. Let's get started!

**Prerequisites**:

1. **Docker and docker-compose**: Ensure that Docker and docker-compose are installed on your machine. If you haven't already installed them, follow the installation [guide](https://docs.docker.com/get-docker/).
2. **zkSync Hardhat plugins**: A foundational understanding of the zkSync Hardhat plugins will be beneficial. New to zkSync development with Hardhat? Explore the getting started section.

:::warning
The `matterlabs/local-node` Docker image is currently based on the protocol `Version19` (deprecated on February 5, 2024), and it will be upgraded in the coming months. It should only be used for testing L1 <-> L2 communication.
:::

### **Setting Up the Testing Environment**

Clone the dockerized zkSync project repository to your local machine:

```bash
git clone https://github.com/matter-labs/local-setup.git
```

#### **Starting the Local Node**

Navigate to the cloned directory:

```bash
cd local-setup
```

Launch the zkSync Era node locally using the `start.sh` script:

```bash
./start.sh
```

This script spins up three essential docker containers:

1. **Postgres**: The database supporting zkSync.
2. **Local Geth node**: Acts as the Layer 1 (L1) for zkSync.
3. **zkSync node**: The core component.

:::info
The first execution of the `start.sh` script should proceed without interruptions. If it halts unexpectedly, you might need to reset the local zkSync state and retry. The initialization might take up to 10 minutes initially.
:::

### **Understanding Network Details**

- **HTTP JSON-RPC API**: Accessible via port 3050.
- **WebSocket (WS) API**: Accessible through port 3051.

  Default endpoints:

- **L1 RPC**: <http://localhost:8545>
- **L2 RPC**: <http://localhost:3050>
- **WS API**: <http://localhost:3051>

  **Network Id**: 270

### **Resetting the zkSync State**

If you need to revert the zkSync state to its initial configuration, execute the `clear.sh` script:

```bash
./clear.sh
```

In the event of a "permission denied" error, run the script with root access:

```bash
sudo ./clear.sh
```

#### **Leveraging Rich Wallets**

The local zkSync setup generously equips some wallets with ample amounts of ETH on both L1 and L2, making testing easier. Access the list of preloaded accounts to obtain the addresses and corresponding private keys [here](https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json).

### **Custom Configurations (Advanced)**

To operate with a custom Postgres database or a distinct Layer 1 node, you'll need to adjust environment variables within the `docker-compose` file:

```yaml
environment:
  - DATABASE_URL=postgres://postgres@postgres/zksync_local
  - ETH_CLIENT_WEB3_URL=http://geth:8545
```

Here, `DATABASE_URL` is the connection URL to the Postgres database, and `ETH_CLIENT_WEB3_URL` is the endpoint URL for the HTTP JSON-RPC interface of the L1 node.

### Conclusion

By now, you should have a fully operational zkSync local testing environment. Dive into testing and development with the assurance that you're operating within a controlled, emulated zkSync environment. Happy coding!
